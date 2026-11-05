-- Remove media references in one authenticated, RLS-governed DB transaction.
-- Storage deletion must be made separately via the Storage API, never with SQL.
-- This migration is additive: it does not delete existing content on deployment.

create or replace function private.scrub_media_reference_json(
  p_value jsonb,
  p_media_id uuid,
  p_bucket text,
  p_path text
) returns jsonb
language plpgsql
immutable
set search_path = pg_catalog
as $$
declare
  kind text;
  text_value text;
  marker text := '/' || p_bucket || '/' || p_path;
  idx integer;
  tail text;
  pair record;
  item jsonb;
  cleaned jsonb;
  result jsonb;
begin
  if p_value is null or p_value = 'null'::jsonb then
    return p_value;
  end if;
  kind := jsonb_typeof(p_value);
  if kind = 'string' then
    text_value := p_value #>> '{}';
    if text_value = p_media_id::text or
       text_value = p_path or
       text_value = p_bucket || '/' || p_path then
      return 'null'::jsonb;
    end if;
    idx := position(marker in text_value);
    if idx > 0 and (
      position('/storage/v1/' in text_value) > 0 or
      left(text_value, 8) = 'https://'
    ) then
      tail := substring(text_value from idx + length(marker) for 1);
      if tail = '' or tail = '?' or tail = '#' then
        return 'null'::jsonb;
      end if;
    end if;
    return p_value;
  elsif kind = 'object' then
    result := '{}'::jsonb;
    for pair in select key, value from jsonb_each(p_value) loop
      cleaned := private.scrub_media_reference_json(
        pair.value, p_media_id, p_bucket, p_path
      );
      if cleaned = 'null'::jsonb and pair.value <> 'null'::jsonb then
        continue;
      end if;
      result := result || jsonb_build_object(pair.key, cleaned);
    end loop;
    return result;
  elsif kind = 'array' then
    result := '[]'::jsonb;
    for item in select value from jsonb_array_elements(p_value) loop
      cleaned := private.scrub_media_reference_json(
        item, p_media_id, p_bucket, p_path
      );
      if cleaned = 'null'::jsonb and item <> 'null'::jsonb then
        continue;
      end if;
      result := result || jsonb_build_array(cleaned);
    end loop;
    return result;
  end if;
  return p_value;
end;
$$;

revoke all on function private.scrub_media_reference_json(jsonb,uuid,text,text) from public;
grant execute on function private.scrub_media_reference_json(jsonb,uuid,text,text) to authenticated;

create or replace function public.delete_media_asset_everywhere(
  p_media_id uuid,
  p_expected_updated_at timestamptz
) returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public, private
as $$
declare
  target public.media_assets%rowtype;
  short_ref text;
  affected integer;
begin
  if auth.uid() is null or
     not private.is_portfolio_admin(auth.uid()) then
    raise exception 'Permissão de administrador necessária.';
  end if;
  select * into target from public.media_assets where id=p_media_id for update;
  if not found then
    raise exception 'Mídia não encontrada.';
  end if;
  if target.updated_at is distinct from p_expected_updated_at then
    raise exception 'Esta mídia foi alterada. Recarregue a biblioteca antes de excluí-la.';
  end if;
  if target.storage_bucket not in ('portfolio-public','portfolio-private') then
    raise exception 'Bucket não autorizado para remoção.';
  end if;
  if exists(
    select 1 from public.media_assets
    where storage_bucket = target.storage_bucket
      and storage_path = target.storage_path
      and id <> target.id
  ) then
    raise exception 'O arquivo também pertence a outra mídia; exclusão cancelada.';
  end if;

  -- Public JSON and direct FK references. Keep surrounding captions and content.
  update public.content_blocks b
    set media_id = nullif(b.media_id, target.id),
        content_json = private.scrub_media_reference_json(
          b.content_json, target.id, target.storage_bucket, target.storage_path
        )
    where b.media_id = target.id or
      b.content_json is distinct from private.scrub_media_reference_json(
        b.content_json, target.id, target.storage_bucket, target.storage_path
      );

  update public.site_settings s
    set favicon_media_id = nullif(s.favicon_media_id, target.id),
        seo_json = private.scrub_media_reference_json(
          s.seo_json, target.id, target.storage_bucket, target.storage_path
        )
    where s.favicon_media_id = target.id or
      s.seo_json is distinct from private.scrub_media_reference_json(
        s.seo_json, target.id, target.storage_bucket, target.storage_path
      );

  update public.testimonials
    set photo_media_id = null
    where photo_media_id = target.id;

  update public.section_panels s
    set style_config = private.scrub_media_reference_json(
          s.style_config, target.id, target.storage_bucket, target.storage_path
        )
    where s.style_config is distinct from private.scrub_media_reference_json(
          s.style_config, target.id, target.storage_bucket, target.storage_path
        );

  update public.block_placements b
    set style_config = private.scrub_media_reference_json(
          b.style_config, target.id, target.storage_bucket, target.storage_path
        ),
        motion_config = private.scrub_media_reference_json(
          b.motion_config, target.id, target.storage_bucket, target.storage_path
        )
    where b.style_config is distinct from private.scrub_media_reference_json(
          b.style_config, target.id, target.storage_bucket, target.storage_path
        )
       or b.motion_config is distinct from private.scrub_media_reference_json(
          b.motion_config, target.id, target.storage_bucket, target.storage_path
        );

  update public.tool_categories t
    set tools = private.scrub_media_reference_json(
          t.tools, target.id, target.storage_bucket, target.storage_path
        )
    where t.tools is distinct from private.scrub_media_reference_json(
          t.tools, target.id, target.storage_bucket, target.storage_path
        );

  -- Triggers can create revision snapshots with previous media URLs during updates.
  -- Redact only media pointers, retaining the audit event and its other fields.
  delete from public.media_assets where id=target.id;
  get diagnostics affected = row_count;
  if affected <> 1 then
    raise exception 'Falha no registro de mídia. Nenhuma referência foi confirmada.';
  end if;

  update public.content_revisions r
    set snapshot_json = private.scrub_media_reference_json(
          r.snapshot_json, target.id, target.storage_bucket, target.storage_path
        )
    where r.snapshot_json is distinct from private.scrub_media_reference_json(
          r.snapshot_json, target.id, target.storage_bucket, target.storage_path
        );

  update public.audit_logs a
    set metadata = private.scrub_media_reference_json(
          a.metadata, target.id, target.storage_bucket, target.storage_path
        )
    where a.metadata is distinct from private.scrub_media_reference_json(
          a.metadata, target.id, target.storage_bucket, target.storage_path
        );

  -- Reject unsupported text references rather than leaving public URLs behind.
  if exists (
    select 1 from public.contact_channels c
    where position('/' || target.storage_bucket || '/' || target.storage_path in coalesce(c.url,'')) > 0
  ) or exists (
    select 1 from public.design_tokens d
    where position('/' || target.storage_bucket || '/' || target.storage_path in coalesce(d.token_value,'')) > 0
  ) then
    raise exception 'Há referência fora das coleções de mídia mapeadas; exclusão cancelada.';
  end if;
  return jsonb_build_object('deleted', true, 'media_id',target.id);
end;
$$;

revoke all on function public.delete_media_asset_everywhere(uuid,timestamptz) from public, anon;
grant execute on function public.delete_media_asset_everywhere(uuid,timestamptz) to authenticated;
