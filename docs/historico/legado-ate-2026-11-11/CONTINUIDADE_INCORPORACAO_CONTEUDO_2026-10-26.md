# Incorporação de conteúdo e sínteses editoriais — 26/10/2026

## Escopo
Inclusão de conteúdo factual documentado pelo CV Digital e pelos quatro infográficos fornecidos pelo proprietário. Aplicação em **blocos publicados do Supabase** e em `src/content/fallback.ts`; campos editáveis por `/admin` > **Blocos e painéis**. Sem criação de seção, alteração de schema ou reconfiguração de RLS.

## Alterações de conteúdo
- Perfil: 34 países, distinguindo correspondência, estudos e vivências.
- Invest RS: detalhamento de mais de dez eventos; Guia de Boas-Vindas; projetos digitais; estratégia de CRM e mailing com integrações externas expressamente planejadas; apresentações institucionais e frentes de IA/automação. A antiga ficha editorial `Ativos visuais` foi substituída por entregas substantivas.
- Prefeitura de São Paulo: área de abrangência da Subprefeitura de Pinheiros e contexto territorial.
- TV Globo/SporTV: trajetória 2015–2019 e quatro destaques editoriais da referência ilustrada, mantendo os seis itens originais.
- 19 slides de galeria com **arquivos SVG editoriais reais** em `public/media/editorial-*.svg`, publicados como URLs e textos alternativos no JSONB `experienceMedia.slides`.

## Proveniência e limites
Os SVGs são **infográficos de síntese editorial**, com texto oriundo dos materiais fornecidos. Não são fotografias reais, capturas de sistemas, reproduções de logotipos oficiais nem prova independente de conclusão dos projetos. Os campos `image`, `alt`, `title` e `caption` ficam editáveis no CMS, podendo posteriormente ser substituídos por provas documentais originais aprovadas. No caso do CRM e da SUBPI, preservar respectivamente as ressalvas de integrações planejadas e portal concebido.

## Compatibilidade
- `ExperienceStack` exibe o campo editável `meta` para os marcos de carreira.
- `fallback.ts` espelha as atualizações; quando Supabase está configurado, a fonte pública principal continua sendo o banco.
- Todos os blocos existentes permanecem publicados e os ativos são versionados no GitHub; nada depende de placeholder visual.
- Não registrar aprovação do fluxo autenticado de edição no admin sem teste JWT real.
