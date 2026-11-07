-- Registro idempotente da correção do título realizada em 07/11/2026.
-- Só corrige a versão específica com s adicional; preserva todos os outros campos.
UPDATE public.sections
SET title = 'Tulius Tsangaropulos'
WHERE slug = 'perfil'
  AND title = 'Tulius Tsangaropuloss'
  AND status = 'published'
RETURNING id, slug, title, status, is_visible, theme, layout_variant, animation_preset;
