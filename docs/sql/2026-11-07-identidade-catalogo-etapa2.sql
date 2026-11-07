-- Etapa 2: biblioteca editável de nomes, cores, fontes e referências tipográficas.
-- A página pública continua usando apenas os tokens globais preexistentes; os
-- registros typography.* e color.white/font.serif não têm consumo automático.
-- Não altera CSS, textos nem conteúdo JSONB de seções.
ALTER TABLE public.design_tokens
  ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.design_tokens
  ADD COLUMN IF NOT EXISTS style_config jsonb NOT NULL DEFAULT '{}'::jsonb;

DO $catalog$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conrelid = 'public.design_tokens'::regclass
      AND conname = 'design_tokens_display_name_check'
  ) THEN
    ALTER TABLE public.design_tokens ADD CONSTRAINT design_tokens_display_name_check
      CHECK (display_name IS NULL OR char_length(btrim(display_name)) BETWEEN 1 AND 90);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conrelid = 'public.design_tokens'::regclass
      AND conname = 'design_tokens_style_config_object_check'
  ) THEN
    ALTER TABLE public.design_tokens ADD CONSTRAINT design_tokens_style_config_object_check
      CHECK (jsonb_typeof(style_config) = 'object');
  END IF;
END
$catalog$;

INSERT INTO public.design_tokens
  (token_key, token_value, value_type, scope, status, display_name, style_config)
VALUES
  ('color.orange', '#FF5414', 'color', 'global', 'published', 'Laranja principal', '{}'::jsonb),
  ('color.ink', '#171617', 'color', 'global', 'published', 'Grafite', '{}'::jsonb),
  ('color.paper', '#FAFAFA', 'color', 'global', 'published', 'Papel', '{}'::jsonb),
  ('color.cream', '#F8F4F1', 'color', 'global', 'published', 'Creme', '{}'::jsonb),
  ('color.muted', '#514742', 'color', 'global', 'published', 'Texto secundário', '{}'::jsonb),
  ('color.orangeDark', '#BC390C', 'color', 'global', 'published', 'Laranja escuro', '{}'::jsonb),
  ('color.white', '#FFFFFF', 'color', 'global', 'published', 'Branco', '{}'::jsonb),
  ('font.heading', 'Big Shoulders Display', 'font', 'global', 'published', 'Títulos e destaques', '{}'::jsonb),
  ('font.body', 'Inter', 'font', 'global', 'published', 'Textos e descrições', '{}'::jsonb),
  ('font.serif', 'Georgia', 'font', 'global', 'published', 'Texto serifado', '{}'::jsonb),
  ('typography.profile-main', '112', 'size', 'typography', 'published', 'Nome principal', '{"fontToken":"font.heading","colorToken":"color.ink","desktopPx":112,"mobilePx":48,"desktopCss":"clamp(3.4rem, 5.6vw, 7rem)","mobileCss":"clamp(1.35rem, 5.9vw, 48px)","sourceDesktop":".name-lockup","sourceMobile":".mobile360-person-name","note":"Limite máximo da escala responsiva","appliedToPublic":false}'::jsonb),
  ('typography.editorial-title', '82', 'size', 'typography', 'published', 'Título editorial', '{"fontToken":"font.heading","colorToken":"color.white","desktopPx":82,"mobilePx":82,"desktopCss":"—","mobileCss":"clamp(2.35rem, 13.8vw, 82px)","sourceDesktop":"—","sourceMobile":".mobile360-headline","note":"Limite máximo; a última linha mobile possui cor de destaque própria","appliedToPublic":false}'::jsonb),
  ('typography.section-title', '124.8', 'size', 'typography', 'published', 'Título de seção', '{"fontToken":"font.heading","colorToken":"color.ink","desktopPx":124.8,"mobilePx":60.8,"desktopCss":"clamp(3.2rem, 6vw, 7.8rem)","mobileCss":"clamp(2.9rem, 12vw, 3.8rem)","sourceDesktop":".section-heading h2, .panel-heading h2","sourceMobile":"--mobile-heading-size","note":"Limite máximo; varia por seção","appliedToPublic":false}'::jsonb),
  ('typography.card-title', '28', 'size', 'typography', 'published', 'Título de card', '{"fontToken":"font.heading","colorToken":"color.ink","desktopPx":28,"mobilePx":26.4,"desktopCss":"clamp(1.25rem, 1.6vw, 1.75rem)","mobileCss":"clamp(1.2rem, 5.2vw, 1.65rem)","sourceDesktop":".content-item h3","sourceMobile":".public-site .mobile-items .content-item h3","note":"Limite máximo; alguns cards têm estilos específicos","appliedToPublic":false}'::jsonb),
  ('typography.subtitle', '32', 'size', 'typography', 'published', 'Subtítulo', '{"fontToken":"font.heading","colorToken":"color.ink","desktopPx":32,"mobilePx":30.4,"desktopCss":"clamp(1.3rem, 2vw, 2rem)","mobileCss":"clamp(1.35rem, 6vw, 1.9rem)","sourceDesktop":".profile-main > h2","sourceMobile":".public-site .mobile-panel-subheading","note":"Limite máximo; exemplos representativos","appliedToPublic":false}'::jsonb),
  ('typography.support-text', '18.4', 'size', 'typography', 'published', 'Texto de apoio', '{"fontToken":"font.body","colorToken":"color.ink","desktopPx":18.4,"mobilePx":18.88,"desktopCss":"clamp(1rem, 1.2vw, 1.15rem)","mobileCss":"clamp(.95rem, 3.5vw, 1.18rem)","sourceDesktop":".section-intro","sourceMobile":".mobile360-support","note":"Limite máximo; cores e valores variam por contexto","appliedToPublic":false}'::jsonb),
  ('typography.caption', '12', 'size', 'typography', 'published', 'Legenda', '{"fontToken":"font.body","colorToken":"color.orangeDark","desktopPx":12,"mobilePx":12,"desktopCss":".75rem","mobileCss":".75rem","sourceDesktop":".section-heading > span","sourceMobile":".section-heading > span","note":"Referência de 16 px/rem; variantes específicas preservadas","appliedToPublic":false}'::jsonb),
  ('layout.container', '1680', 'size', 'global', 'published', 'Largura máxima do conteúdo', '{}'::jsonb),
  ('space.section', '64', 'space', 'global', 'published', 'Espaçamento de seção', '{}'::jsonb),
  ('radius.card', '4', 'radius', 'global', 'published', 'Raio de cartão', '{}'::jsonb),
  ('motion.duration', '520', 'motion', 'global', 'published', 'Duração de transição', '{}'::jsonb)
ON CONFLICT (token_key) DO NOTHING;

UPDATE public.design_tokens AS d
SET display_name = v.display_name
FROM (VALUES
  ('color.orange', 'Laranja principal'),
  ('color.ink', 'Grafite'),
  ('color.paper', 'Papel'),
  ('color.cream', 'Creme'),
  ('color.muted', 'Texto secundário'),
  ('color.orangeDark', 'Laranja escuro'),
  ('color.white', 'Branco'),
  ('font.heading', 'Títulos e destaques'),
  ('font.body', 'Textos e descrições'),
  ('font.serif', 'Texto serifado'),
  ('typography.profile-main', 'Nome principal'),
  ('typography.editorial-title', 'Título editorial'),
  ('typography.section-title', 'Título de seção'),
  ('typography.card-title', 'Título de card'),
  ('typography.subtitle', 'Subtítulo'),
  ('typography.support-text', 'Texto de apoio'),
  ('typography.caption', 'Legenda'),
  ('layout.container', 'Largura máxima do conteúdo'),
  ('space.section', 'Espaçamento de seção'),
  ('radius.card', 'Raio de cartão'),
  ('motion.duration', 'Duração de transição')
) AS v(token_key, display_name)
WHERE d.token_key = v.token_key
  AND d.display_name IS NULL;

COMMENT ON COLUMN public.design_tokens.display_name IS
  'Rótulo editável exibido no CMS, sem alterar a chave técnica token_key.';
COMMENT ON COLUMN public.design_tokens.style_config IS
  'Metadados de estilo tipográfico e fórmulas CSS de referência; sem aplicação automática ao site.';
