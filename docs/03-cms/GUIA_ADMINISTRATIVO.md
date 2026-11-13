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

## Controles desktop para a atualização visual de 12/11/2026

Em **Editor do site → Perfil → Coluna esquerda**, o campo **Tamanho da frase no desktop (px)** grava `content_blocks.content_json.items[0].hero.desktop.introSize`. Em **Itens de Destaque**, cada entrada dispõe de tamanho de título, descrição e espaçamento para desktop, gravados em `items[1..4].desktop.{titleSize,textSize,spacing}`. Na **Coluna direita → Área de Destaques**, os seis títulos das empresas possuem campo desktop `items[5..10].desktop.titleSize`.

Em **Formação**, o editor genérico já oferece **Desktop → Título (px)**; os três cursos e os dois idiomas usam `items[].desktop.titleSize`. Esses campos não modificam `items[].mobile`, `hero.mobile`, `hero.mobileEditorial` nem os textos compartilhados. A seta centralizada, os espaçamentos de Resultados e o alinhamento inferior da foto de Sobre são geometria CSS, sem novos campos ou migrations. O fluxo de salvamento/CAS do CMS permanece inalterado.

### Valores publicados e roteiro de edição desktop (12/11/2026)

1. **Editor do site → Perfil → Esquerda → Apresentação:** `Tamanho da frase no desktop (px)` está em **22** (desde 13/11/2026). Esse controle atualiza `items[0].hero.desktop.introSize` do bloco A. A frase e o retrato permanecem no conteúdo original.
2. **Perfil → Esquerda → Itens de Destaque:** abrir cada uma das quatro entradas; o grupo **Tipografia e espaçamento · desktop** contém **Título desktop (16 px)**, **Descrição desktop (15 px)** e **Espaçamento desktop (2 px)**, armazenados em `items[1..4].desktop` no mesmo bloco A.
3. **Perfil → Direita → Área de Destaques:** abrir cada empresa (Invest RS, Prefeitura de São Paulo, Vale, Grupo InPress, TV Globo/SporTV, CDI Comunicação). O campo **Tamanho do título da empresa no desktop (px)** vale **23** e grava `items[5..10].desktop.titleSize` do bloco B.
4. **Editor do site → Formação:** o editor genérico já contém **Desktop → Título (px)**. Os três cursos do bloco 1 estão em **30 px**; Swan Training Institute e Instituto Rojas, no bloco 2, em **29 px**.
5. **Resultados** (gaps iguais), **Perfil** (seta centralizada e não sobreposição do selo) e **Sobre/Olá!** (foto alinhada ao limite inferior) são ajustes de CSS/renderer desktop, **sem novos campos** no admin ou atualização das métricas/fotografia no banco.

**Persistência e cuidado operacional:** os valores iniciais foram configurados por **SQL UPDATE restrito** nos quatro blocos publicados e relidos no Supabase; o P5 [#43197029455](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029455) validou a **exibição read-only** de 21/21 etapas, **zero escritas**, incluindo controles desktop da abertura. Não houve teste autenticado `editar → salvar` em produção; alterações editoriais futuras usam o botão Salvar e a RPC/CAS existentes. Não tocar os controles **Mobile**, a identidade global nem registros de outras seções para reproduzir o layout.

## Atualização editorial dos tamanhos desktop do Perfil — 13/11/2026

No Supabase de produção, `content_blocks.id = a2f4770b-7964-4f3c-b816-c778b66ac15c` (Perfil, bloco A publicado), foram reduzidos exclusivamente `items[0].hero.desktop.introSize` de 24 para **22 px**, `items[1..4].desktop.titleSize` de 17 para **16 px** e `items[1..4].desktop.textSize` de 16 para **15 px**. Todos os quatro `desktop.spacing` permaneceram em 2 px. A operação foi condicionada à versão anterior do registro e os valores novos foram confirmados por `UPDATE ... RETURNING` no banco em 13/11/2026. Os valores pertencem ao CMS, não a constantes globais do CSS. Nenhum controle mobile, conteúdo textual, bloco B, outra seção, tabela ou migration foi alterado. A aplicação pública lê os valores diretamente do CMS; não foi necessário publicar novo bundle para refletir a mudança. A revisão ocorreu por leitura de banco; não se trata de teste visual end-to-end em navegador.
