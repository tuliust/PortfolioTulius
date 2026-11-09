-- P2: migration INCREMENTAL, to be tested on synthetic local Supabase ONLY.
-- DO NOT apply to production without a separate authorization and rollback plan.
-- Does not modify content values when installed. Never re-applies baseline migration.

alter table public.block_placements
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists p2_block_placements_updated_at on public.block_placements;
create trigger p2_block_placements_updated_at
  before update on public.block_placements
  for each row execute function public.set_updated_at();

create or replace function public.save_section_block_atomic(
  p_section_id uuid,
  p_section_changes jsonb default '{}'::jsonb,
  p_expected_section_updated_at timestamptz default null,
  p_block_id uuid default null,
  p_block_changes jsonb default null,
  p_expected_block_updated_at timestamptz default null,
  p_placements jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_section public.sections%rowtype;
  v_block public.content_blocks%rowtype;
  v_current public.block_placements%rowtype;
  v_panel_id uuid;
  v_item jsonb;
  v_panel_key text;
  v_seen text[] := array[]::text[];
  v_expected_placement timestamptz;
  v_has_section boolean;
  v_has_block boolean;
  v_sort integer;
  v_visibility boolean;
  v_layout text;
  v_motion jsonb;
  v_style jsonb;
begin
  perform private.require_portfolio_admin();

  if p_section_id is null or p_section_changes is null
    or jsonb_typeof(p_section_changes) is distinct from 'object'
    or p_placements is null or jsonb_typeof(p_placements) is distinct from 'array'
    or jsonb_array_length(p_placements) > 3
    or (p_block_changes is not null and jsonb_typeof(p_block_changes) is distinct from 'object')
    or exists (select 1 from jsonb_object_keys(p_section_changes) as k(key)
               where key not in ('title', 'eyebrow', 'intro', 'animation_preset'))
    or (p_block_changes is not null and exists (
          select 1 from jsonb_object_keys(p_block_changes) as k(key)
          where key not in ('block_type', 'content_json', 'mobile_panel', 'sort_order',
                            'status', 'is_placeholder', 'editorial_note')))
  then
    raise exception 'p2_invalid_payload' using errcode = '22023';
  end if;

  v_has_section := p_section_changes <> '{}'::jsonb;
  v_has_block := p_block_changes is not null and p_block_changes <> '{}'::jsonb;
  if (v_has_block or jsonb_array_length(p_placements) > 0) and p_block_id is null then
    raise exception 'p2_block_required' using errcode = '22023';
  end if;

  -- Lock the section first, then block and placement rows, in fixed order.
  select * into v_section from public.sections where id = p_section_id for update;
  if not found then
    raise exception 'p2_section_not_found' using errcode = 'P0002';
  end if;
  if v_has_section and (
    p_expected_section_updated_at is null or
    v_section.updated_at is distinct from p_expected_section_updated_at
  ) then
    raise exception 'p2_section_conflict' using errcode = '40001';
  end if;

  if p_block_id is not null then
    select * into v_block from public.content_blocks
      where id = p_block_id and section_id = p_section_id for update;
    if not found then
      raise exception 'p2_block_not_found_or_wrong_section' using errcode = 'P0002';
    end if;
    if (v_has_block or jsonb_array_length(p_placements) > 0) and (
      p_expected_block_updated_at is null or
      v_block.updated_at is distinct from p_expected_block_updated_at
    ) then
      raise exception 'p2_block_conflict' using errcode = '40001';
    end if;
  end if;

  -- Updating only columns requested prevents unrelated content_json rewrites.
  if v_has_section then
    if (p_section_changes ? 'title' and
        (jsonb_typeof(p_section_changes->'title') <> 'string' or
         nullif(btrim(p_section_changes->>'title'), '') is null)) or
       (p_section_changes ? 'animation_preset' and
        (p_section_changes->>'animation_preset') not in
          ('none','fade-in','fade-up','stagger','image-reveal','metric-count')) then
      raise exception 'p2_invalid_section_fields' using errcode = '22023';
    end if;
    update public.sections set
      title = case when p_section_changes ? 'title' then btrim(p_section_changes->>'title') else title end,
      eyebrow = case when p_section_changes ? 'eyebrow' then p_section_changes->>'eyebrow' else eyebrow end,
      intro = case when p_section_changes ? 'intro' then p_section_changes->>'intro' else intro end,
      animation_preset = case when p_section_changes ? 'animation_preset'
        then p_section_changes->>'animation_preset' else animation_preset end
    where id = p_section_id;
  end if;

  if v_has_block then
    if (p_block_changes ? 'content_json' and
        jsonb_typeof(p_block_changes->'content_json') is distinct from 'object') or
       (p_block_changes ? 'sort_order' and
        (jsonb_typeof(p_block_changes->'sort_order') <> 'number' or
         (p_block_changes->>'sort_order')::integer < 1)) or
       (p_block_changes ? 'mobile_panel' and
        (p_block_changes->>'mobile_panel') not in ('a','b')) or
       (p_block_changes ? 'status' and
        (p_block_changes->>'status') not in ('draft','in_review','published','archived')) then
      raise exception 'p2_invalid_block_fields' using errcode = '22023';
    end if;
    update public.content_blocks set
      block_type = case when p_block_changes ? 'block_type' then p_block_changes->>'block_type' else block_type end,
      content_json = case when p_block_changes ? 'content_json' then p_block_changes->'content_json' else content_json end,
      mobile_panel = case when p_block_changes ? 'mobile_panel' then p_block_changes->>'mobile_panel' else mobile_panel end,
      sort_order = case when p_block_changes ? 'sort_order' then (p_block_changes->>'sort_order')::integer else sort_order end,
      status = case when p_block_changes ? 'status' then p_block_changes->>'status' else status end,
      is_placeholder = case when p_block_changes ? 'is_placeholder' then (p_block_changes->>'is_placeholder')::boolean else is_placeholder end,
      editorial_note = case when p_block_changes ? 'editorial_note' then p_block_changes->>'editorial_note' else editorial_note end
    where id = p_block_id;
  end if;

  -- An invalid placement after a successful section UPDATE raises an exception.
  -- PostgreSQL rolls back all writes in this RPC transaction.
  for v_item in select value from jsonb_array_elements(p_placements) as e(value) loop
    if jsonb_typeof(v_item) is distinct from 'object' then
      raise exception 'p2_invalid_placement' using errcode = '22023';
    end if;
    v_panel_key := v_item->>'panel_key';
    if v_panel_key is null or v_panel_key not in ('desktop','mobile-a','mobile-b')
       or v_panel_key = any(v_seen) then
      raise exception 'p2_invalid_or_duplicate_panel_key' using errcode = '22023';
    end if;
    v_seen := array_append(v_seen, v_panel_key);
    select id into v_panel_id from public.section_panels
      where section_id = p_section_id and panel_key = v_panel_key;
    if not found then
      raise exception 'p2_panel_not_found' using errcode = 'P0002';
    end if;
    v_expected_placement := null;
    if v_item ? 'expected_updated_at' and v_item->>'expected_updated_at' is not null then
      v_expected_placement := (v_item->>'expected_updated_at')::timestamptz;
    end if;
    select * into v_current from public.block_placements
      where block_id = p_block_id and panel_id = v_panel_id for update;
    if found then
      if v_expected_placement is null or v_current.updated_at is distinct from v_expected_placement then
        raise exception 'p2_placement_conflict' using errcode = '40001';
      end if;
    elsif v_expected_placement is not null then
      raise exception 'p2_placement_removed' using errcode = '40001';
    end if;
    v_sort := coalesce((v_item->>'sort_order')::integer, v_current.sort_order, v_block.sort_order);
    v_visibility := coalesce((v_item->>'is_visible')::boolean, v_current.is_visible, true);
    v_layout := coalesce(nullif(v_item->>'layout_variant',''), v_current.layout_variant, 'default');
    v_motion := coalesce(v_item->'motion_config', v_current.motion_config, '{}'::jsonb);
    v_style := coalesce(v_item->'style_config', coalesce(v_current.style_config, '{}'::jsonb));
    if v_sort < 1 or jsonb_typeof(v_motion) <> 'object' or jsonb_typeof(v_style) <> 'object' then
      raise exception 'p2_invalid_placement_fields' using errcode = '22023';
    end if;
    insert into public.block_placements
      (block_id, panel_id, sort_order, layout_variant, style_config, motion_config, is_visible)
    values (p_block_id, v_panel_id, v_sort, v_layout, v_style, v_motion, v_visibility)
    on conflict (block_id, panel_id) do update set
      sort_order = excluded.sort_order,
      layout_variant = excluded.layout_variant,
      style_config = excluded.style_config,
      motion_config = excluded.motion_config,
      is_visible = excluded.is_visible
    where (public.block_placements.sort_order, public.block_placements.layout_variant,
           public.block_placements.style_config, public.block_placements.motion_config,
           public.block_placements.is_visible) is distinct from
          (excluded.sort_order, excluded.layout_variant, excluded.style_config,
           excluded.motion_config, excluded.is_visible);
    v_current := null;
  end loop;
  return jsonb_build_object('section_id', p_section_id, 'block_id', p_block_id,
    'section_changed', v_has_section, 'block_changed', v_has_block,
    'placements_checked', jsonb_array_length(p_placements));
end;
$function$;

revoke all on function public.save_section_block_atomic(uuid,jsonb,timestamptz,uuid,jsonb,timestamptz,jsonb)
  from public, anon, authenticated;
grant execute on function public.save_section_block_atomic(uuid,jsonb,timestamptz,uuid,jsonb,timestamptz,jsonb)
  to authenticated;