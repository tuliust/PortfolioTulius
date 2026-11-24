-- PROPOSTA NÃO APLICADA. Converter em migration com supabase migration new
-- e homologar com Supabase CLI/Docker e seed exclusivamente sintética.
-- Public bucket: download público de arquivos expressamente enviados,
-- sem listagem pública e sem escrita para anon/não administrador.
begin;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-videos','portfolio-videos',true,50000000,array['video/mp4']);
alter table public.media_assets drop constraint media_assets_storage_bucket_check;
alter table public.media_assets add constraint media_assets_storage_bucket_check
check (
  storage_bucket in ('portfolio-public','portfolio-private')
  or (storage_bucket = 'portfolio-videos' and mime_type = 'video/mp4')
);
create policy "admins manage portfolio videos"
on storage.objects for all to authenticated
using (
  bucket_id = 'portfolio-videos'
  and (select private.is_portfolio_admin((select auth.uid())))
)
with check (
  bucket_id = 'portfolio-videos'
  and (select private.is_portfolio_admin((select auth.uid())))
);
commit;
