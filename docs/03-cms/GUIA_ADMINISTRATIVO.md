# Guia operacional do CMS
**Status:** contrato administrativo vigente · **Revisão:** 11/11/2026.

## Acesso e áreas
`/admin/login` autentica pelo Supabase Auth, com autorização pela tabela `admin_users`. `/admin` abriga o editor; `/admin/preview` exige autenticação. Módulos: Visão geral, Editor do site, Identidade, Mídia, Navegação, SEO, Revisões e Prévia.

O Editor reúne informações da seção e conteúdo na mesma página; as áreas Esquerda/Centro/Direita correspondem a blocos existentes. Depoimentos são editados em **Editor do site → Depoimentos → Gerenciar depoimentos**. O Acervo Estruturado **não** é mais menu independente, embora os dados persistam.

Nas seis experiências, Trajetória (empresa, cargo, local, início, fim, ordem, status, descrição) persiste em `career_experiences`; não replicar texto integral no JSON dos blocos.

## Apresentação mobile (11/11/2026)

Em **Editor do site → Perfil → Configurações mobile → Painel A → Abertura Editorial 360°**, o grupo do selo passa a se chamar **“Selo do painel B · acima de Áreas de Atuação”**. Fundo, cor do selo/seta, texto, fonte, diâmetro, espaçamento e visibilidade continuam editáveis no registro único `content_blocks.content_json.items[0].hero.mobileEditorial.middle` do bloco A. A renderização mobile exibe o elemento no painel B, sem duplicar blocos ou placements; o desktop não lê essas propriedades específicas.

As demais correções de abertura, Resultados, Formação, barra sticky e badges de Experiências, e Contato são regras de apresentação mobile: não modificam títulos, cargos, métricas, competências ou coleções. A mensagem da barra fixa é microtexto de interface no código, não um dado editorial paralelo. O painel B do Contato lê os tokens globais `color.ink`, `color.paper` e `color.orange` configurados em **Identidade**; não alterar o tema global da seção Contato, pois esse tema é compartilhado com o desktop.

## Persistência
O editor usa estado de alterações pendentes, proteção de rascunho e botão Salvar. `save_section_block_atomic` **já está em produção**, com CAS de `updated_at` e transação SQL de seção, bloco e placements. [`p2-composite-save.ts`](../../src/lib/p2-composite-save.ts) só cai no legado para `PGRST202` da função ausente; nunca repetir escrita depois de erro SQL ou rede incerta.

Biblioteca de mídia centraliza arquivo, título, alt e enquadramento. A coluna `media_assets.credit` foi **removida**; não restaurar campo por guia antigo. SEO salvo no CMS exige novo build para refletir HTML estático.

## Cautelas
Guardar ID de seção/bloco/experiência, não duplicar dados nem reabrir controles de criação removidos da UI. SQL e Storage não são atômicos juntos. Testar `editar → salvar → reler → banco → renderer` com dados sintéticos locais; não escrever dados de ensaio em produção.

[Modelo de dados](MODELO_DE_DADOS.md) · [Mídia](MIDIAS_E_STORAGE.md).

## Favicon e ícone Apple (12/11/2026)

Em **SEO e metadados → Favicon e ícone de início (Apple)**, o editor usa `PublishedMediaPicker`, com acesso à biblioteca pública e ao upload de PNG/JPG/WebP/SVG, para selecionar a arte. Após escolher, **Salvar SEO** persiste `site_settings.seo_json.faviconUrl` pela RPC existente `save_home_seo_atomic`; os demais campos de SEO permanecem inalterados. O valor vazio reverte para `/favicon.png`. O código `site-icons.ts` valida URL HTTPS ou arquivo local explícito para evitar protocolo inseguro.

O arquivo `public/favicon.png` é o ícone padrão do anexo aprovado (56×56); `public/apple-touch-icon.png` é sua versão 180×180 para atalho Apple. Enquanto `faviconUrl=/favicon.png`, ambos usam seus arquivos estáticos específicos. Após escolher mídia publicada no Storage, ambos passam a apontar ao URL HTTPS da biblioteca. O app atualiza os elementos `link` em runtime depois da leitura de SEO; metadados HTML estáticos e ícones de atalho requerem novo build/deploy do fluxo de SEO. O campo legatário `site_settings.favicon_media_id` continua `NULL` e não foi introduzida segunda fonte de verdade.

## Primeira tela mobile: espaçamentos de 12/11/2026

A abertura continua a utilizar **um único** `content_blocks.content_json.items[0].hero.mobileEditorial` do bloco A de Perfil. Os campos editáveis de respiro superior e inferior foram reduzidos no banco para `top.paddingY=18` e `bottom.paddingY=0`, respectivamente, para manter a seta visível na primeira dobra; os defaults em `src/lib/mobile-profile-editorial.ts` são iguais. O encaixe da foto na borda inferior e o posicionamento da seta em sobreposição são regras de geometria mobile (`src/index.css`), não novos campos ou alterações nos dados dos painéis. O fator de escala da linha **TULIUS** (1,38 sobre a fonte do nome) também é regra responsiva; fonte, cores, visibilidade e texto mantêm os controles existentes no admin.

## Cinza claro do selo e sincronização do admin (12/11/2026)

O painel **Identidade → Cores da marca** apresenta o novo token **Cinza claro** (`color.lightGray`, `#ECECEC` inicialmente), gerenciado pelo mesmo formulário e política já usados pelas cores existentes. No editor **Perfil → Configurações mobile → Abertura Editorial 360° → Selo do painel B**, o campo **“Fundo do selo e da faixa superior do painel B”** utiliza a paleta existente e guarda em `hero.mobileEditorial.middle.background` a referência `color.lightGray` — não um HEX duplicado. O renderer resolve a referência por `heroColor()` para `var(--light-gray)`, cujo valor vem de `design_tokens` publicado. Alterações futuras em Identidade afetam a faixa sem editar o registro do Hero, preservando o controle editorial para escolher outra cor se necessário.

Os demais ajustes solicitados (recuo vertical dos textos da abertura, foto colada à esquerda, tipografia de Formação e Contato e retirada da borda acima de Canais de Contato) são CSS limitado ao mobile; não requerem novas tabelas, alterações em RLS ou campos administrativos.
