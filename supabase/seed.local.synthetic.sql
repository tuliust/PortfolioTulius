-- LOCAL ONLY. Fully fictional fixture; does not copy the historic editorial seed.
-- Applied by Supabase CLI when starting/resetting the local stack.
insert into public.pages (slug, title, seo_title, seo_description, status)
values ('p2-local-fixture', 'Página de homologação fictícia', 'Título fictício local',
        'Descrição fictícia para testar o CMS em loopback.', 'draft')
on conflict (slug) do nothing;

insert into public.site_settings (site_title, locale, description, seo_json, status)
select 'Site fictício local', 'pt-BR', 'Somente homologação em ambiente isolado.',
       '{"robots":"noindex,nofollow"}'::jsonb, 'draft'
where not exists (select 1 from public.site_settings where site_title='Site fictício local');

with p as (select id from public.pages where slug='p2-local-fixture')
insert into public.sections (page_id, slug, title, intro, sort_order, status, is_visible)
select p.id, 'secao-ficticia', 'Seção sintética', 'Conteúdo exclusivamente fictício',
       1, 'draft', false from p
on conflict (page_id, slug) do nothing;

with s as (
  select s.id from public.sections s
  join public.pages p on p.id=s.page_id
  where p.slug='p2-local-fixture' and s.slug='secao-ficticia'
)
insert into public.section_panels(section_id, breakpoint, panel_key, sort_order)
select s.id, v.breakpoint, v.panel_key, v.sort_order from s
cross join (values ('desktop','desktop',1),('mobile','mobile-a',1),('mobile','mobile-b',2))
  v(breakpoint,panel_key,sort_order)
on conflict (section_id, panel_key) do nothing;

with s as (
  select s.id from public.sections s
  join public.pages p on p.id=s.page_id
  where p.slug='p2-local-fixture' and s.slug='secao-ficticia'
)
insert into public.content_blocks (section_id, block_type, content_json, mobile_panel, sort_order, status)
select s.id, 'cards',
       '{"items":[{"title":"Cartão inteiramente fictício","text":"Apenas teste local."}]}'::jsonb,
       'a', 1, 'draft'
from s
where not exists (select 1 from public.content_blocks b where b.section_id=s.id and b.sort_order=1);
