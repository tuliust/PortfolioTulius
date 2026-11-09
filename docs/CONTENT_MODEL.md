# Atualização operacional — P2/P4, 09/11/2026

> **Atualização de continuidade — 09/11/2026.** Este trecho prevalece sobre quaisquer snapshots datados abaixo. Código inicialmente auditado em `7e8d7f82`, agora incluindo correção de fallback P2 (`4e739dbf`), suíte de mídia sintética (`630fb712`) e experimentos de prioridade da consulta inicial de Perfil (`b3dc0a5f` e `93176222`). **Não foi aplicada migration nem houve escrita de ensaio no Supabase de produção.** A migration `20261109024100_p2_composite_section_block_save.sql` existe em Git, mas `public.save_section_block_atomic` está **ausente no banco produtivo** (SELECT em `pg_proc`); usar o caminho legado até autorização separada. Veja [relatório de execução](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md), [plano de aceite](P2_P4_PLANO_ACEITE_2026-11-08.md) e [mapa CMS → renderer](MAPA_CAMPOS_CMS_RENDERER.md).

## Atualização de modelos e contratos de campos
- `sections`: `title`, `eyebrow`, `intro`, `animation_preset` podem ser incluídos no mesmo save composto do bloco, com versão esperada.
- `content_blocks`: `content_json`, `editorTitle`, `editorAnchor`, `items[0].hero.rootBackground`; o objeto global `hero` do primeiro item B deve permanecer no item 0 ao reordenar.
- `block_placements`: `desktop`, `mobile-a`, `mobile-b`; `updated_at` **só** depois de instalar a migration incremental, versões CAS e visibilidade/motion por painel.
- `media_assets`: `alt_text`, `credit`, `focal_point`, `storage_bucket`, `storage_path`, `updated_at`; novo teste local armazenou, releu e publicou esses dados, com RLS de admin/non-admin.
- `alt_text`: o hook público prioriza catálogo, sincronizado em memória no desktop/mobile, Sobre, logo e galerias; fallback JSONB quando catálogo não disponível.
- `credit` e `focal_point`: metadados editáveis da biblioteca, **não provar renderização global**. Enquadramento específico do renderer usa JSONB `mediaFraming` e variantes, sem default automático do catálogo.
- SEO `pages` + `site_settings`: RPC `save_home_seo_atomic` protege dados; `scripts/generate-seo.mjs` gera HTML a cada build.

---

## Documento anterior preservado para rastreabilidade

# Modelo de conteúdo

## Modelo editorial da revisão de 01/11/2026 (referência datada)

**Complemento verificado em 05/11 — SHA [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2):** as seis experiências permitem editar na mesma página os campos da coleção original `career_experiences`, com `updated_at` como guarda de concorrência. O CMS não copia a descrição da Trajetória para `content_blocks`. Edição de alt permanece concentrada na Biblioteca de Mídia; a atualização retroativa de cópias de alt em JSON não foi comprovada. Este complemento não altera registros.

A apresentação pública responsiva reutiliza seções, blocos/placements, coleções e mídias publicados; **não existe catálogo estático de empresas, formações, métricas ou ferramentas que substitua os valores CMS em produção**. `ContentItem` preserva `title`, `text`, `tags`, `value`, `themeKey`, `toolIcons` e vínculos disponíveis; as regras de publicação/visibilidade e RLS continuam obrigatórias.

- **Perfil/Olá!/Resultados:** dados dos blocos CMS, com seletor de categoria mobile vinculado ao estado do renderer, sem mudança de schema.
- **Formação/Ferramentas:** três + dois registros e seis grupos são contagens do último SHA testado, não limites SQL nem motivo para truncar coleções futuras.
- **Experiências:** seis seções públicas, com projetos e slides vinculados por título/associação já existente; a versão mobile apresenta um projeto expandido de cada vez e apenas suas imagens, sem substituir a galeria desktop. `career_experiences` fornece a Trajetória publicada integral em mobile, sem reconstruir texto em JSX. Imagens ausentes não devem ser preenchidas com mídia fictícia.
- **Fonte operacional:** [estado atual](ESTADO_ATUAL_VIGENTE.md), [experiências](EXPERIENCIAS_UNIFICADAS_2026-10-31.md) e `src/components/public/ExperienceStack.tsx`.

Esta revisão é somente documental. Nada autoriza alterações nas tabelas, RLS, triggers, Status editorial ou Storage. Relatórios SQL de outubro refletem a data da consulta, não inventário permanente.

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

`pages → sections → section_panels/content_blocks → block_placements` separa conteúdo e apresentação. Coleções normalizadas cobrem experiências, projetos, métricas, competências, formação, idiomas, ferramentas, depoimentos e contatos.

Campos de status usam `draft`, `in_review`, `published` e `archived`. `editorial_issues` preserva divergências; `is_placeholder` e `editorial_note` impedem que X/Y/Z sejam convertidos em fatos.

O seed registra as 14 seções, dois blocos por seção, tokens, navegação, experiências e nove pendências. Os mesmos blocos alimentam desktop e mobile, evitando cópias editoriais.

## Navegação interna dos cards de especialidades (seção 01)

Os cinco primeiros itens de `content_blocks.content_json.items` no bloco `perfil` / painel `b` admitem o campo opcional `targetSlug` (texto, slug de seção, sem URL externa). O valor é compartilhado por desktop e mobile e editado no módulo **Blocos e painéis** do admin. Quando ausente, o renderer aponta para `#resultados` (seção 03). Destino inexistente ou não publicado é rejeitado na renderização com fallback para `#resultados`; se `resultados` também estiver indisponível, o card é apresentado sem link para evitar âncora quebrada.

Esse campo é armazenado no JSONB já existente, validado no cliente e persistido pela RPC `save_content_block_atomic`. **Nenhuma nova coluna, tabela, migration ou permissão foi criada.** A configuração do card é distinta dos itens do menu (`navigation_items`).

## Seções 02 e 03 — conteúdo após revisão de 26/10/2026

A seção `sobre` mantém dois blocos `content_blocks` e não recebeu novas tabelas:
- `mobile_panel='a'`: **um item técnico de foto**, com `title="Imagem da seção 02"`, `image/alt` mobile e campos opcionais `aboutDesktopImage/aboutDesktopAlt` para o centro desktop.
- `mobile_panel='b'`: **array JSONB de declarações** (inicialmente 5, sem limite fixo), cada uma contendo `title` e `text`. Ordem: Estratégia também é escuta.; Comunicação de ponta a ponta; Visão editorial; Resultados que orientam decisões; A voz de quem lidera. O componente desktop percorre a lista completa e o mobile reutiliza o primeiro título/texto com a foto no painel A e os demais no painel B. Não há duplicação do texto no banco.

Na seção `resultados`, o painel B contém os cinco títulos correspondentes aos cards de especialidades da seção 01, em substituição aos sete títulos anteriores, inclusive ao placeholder `XXXXX · X/Y/Z`. O painel A de métricas não foi alterado. O registro de `editorial_issues` para o placeholder foi mantido com `status='resolved'` e motivo da resolução; não foi apagado.

Todas as edições do administrador seguem `save_content_block_atomic` e a estrutura existente de RLS/revisões; a mudança dos dados publicados foi realizada por transação SQL controlada e confirmada com leitura posterior. **Os títulos da seção 03 são um snapshot editorial, não uma referência relacional dinâmica às especialidades da seção 01.**

## Dossiês temáticos da seção 03 — JSONB (26/10/2026)

Sem tabelas/migrations novas, os dois blocos de `resultados` foram enriquecidos:

- **Painel A, quatro indicadores:** `title`, `value` e `text` permanecem; o antigo `label` numérico foi removido. Acrescentados `metricIcon` (enum finito dos pictogramas SVG internos) e `relatedThemeKeys` (lista de identificadores de temas). Vínculos iniciais: Mídia e Estratégia → marketing; Comunicação Pública → marketing; Jornalismo Internacional → imprensa; Relações Públicas e Imprensa → eventos e imprensa.
- **Painel B, cinco temas:** `title` (rótulo do seletor); `themeKey` (ID estável); `themeAxis` (eixo); `themeTitle`; `themeSubtitle`; `themeTopics`; `themeSummary`; `inheritedHighlights: string[]` (conteúdo reaproveitado da seção 04). O conteúdo de cada tema foi fornecido pelo proprietário, com associação temática dos cinco eixos aos cinco cartões da abertura.

Os primeiros cinco cards de `perfil`/painel B receberam o atributo opcional `themeKey`, sem alteração dos títulos ou destinos `targetSlug`. A seleção é um estado React `selectedTheme: string | null` compartilhado pelo herói e pela seção de resultados; `null` exibe todos os quatro indicadores. Clique no card com destino `#resultados` define o mesmo tema no painel interativo.

O registro `sections.slug='competencias'` foi **despublicado visualmente por `is_visible=false`**, mantendo `status=published` e todos os blocos originais intactos. Assim o projeto preserva fontes históricas sem renderizar o antigo painel como seção independente. Total esperado: **13 seções públicas e 25 painéis mobile** (resultados usa um único painel mobile interativo). Os demais conteúdos não foram alterados.

## Metadados de mídia de experiência (26/10/2026)

Sem DDL nem Storage novo, cada bloco publicado de `content_blocks` com `mobile_panel='a'` das seis empresas recebeu a propriedade JSONB opcional `experienceMedia` junto de `items`:

```json
{
  "experienceMedia": {
    "logo": "/media/logo-autorizado.svg",
    "logoAlt": "Logotipo da empresa",
    "slides": [
      {
        "title": "Nome de projeto",
        "image": "/media/foto-real-aprovada.jpg",
        "alt": "Descrição da fotografia",
        "caption": "Legenda opcional"
      }
    ]
  }
}
```

**Exemplo estrutural, não dados existentes:** os campos `logo`, `logoAlt`, `image`, `alt` e `caption` são opcionais e **não foram preenchidos** no seed. Inicialmente há três `slides` com `title` por empresa; o CMS os preserva/edita. O hook `usePortfolio` incorpora `experienceMedia` na `PortfolioSection` a partir do primeiro bloco publicado A; `ExperienceStack` renderiza `logo`/slides se houver mídia válida.

Conteúdo e imagens não são duplicados nos módulos mobile/desktop: os dois leem `experienceMedia` da seção. Todos os `items` A/B antigos permanecem. `sections.theme`: `formacao=ink`; seis empresas `paper`. Grupo de slugs e ordem: `invest-rs`, `prefeitura-sp`, `vale`, `globo-sportv`, `inpress`, `cdi`. Mais detalhes em `docs/CONTINUIDADE_FORMACAO_EXPERIENCIAS_2026-10-26.md`.

## Ícones de Ferramentas e destinos da abertura — 26/10/2026

Em `content_blocks.content_json.items[]` dos painéis A/B da seção `ferramentas`, acrescentado `toolIcons?: ToolIconName[]`: até três nomes de um conjunto fixo de quinze ícones SVG locais, validados no CMS (`analytics`, `search`, `meta`, `growth`, `salesforce`, `hubspot`, `sprinklr`, `asana`, `notion`, `adobe`, `figma`, `wordpress`, `social`, `video`, `megaphone`). São pictogramas ilustrativos, **não arquivos oficiais dos logotipos**. O componente `ToolIcons` exibe grupos de badges laranja com desenhos brancos. `sections.theme='ink'` para `ferramentas`.

Os seis objetos de carreira em `perfil/B` (índices 5–10 em base zero) receberam `targetSlug`, na ordem editorial já existente: `invest-rs`, `prefeitura-sp`, `vale`, `inpress`, `globo-sportv`, `cdi`. São âncoras com destino condicionado à publicação do slug, independentes dos cinco cards de especialidades (tema/resultado). O campo já existente `targetSlug` foi estendido, sem novos modelos ou tabelas.

Sem DDL, migrations, Auth, RLS ou Storage; mudanças do banco limitaram-se a campos JSONB dos três blocos citados e ao tema da seção Ferramentas.

## Revisão manual — experiências, depoimentos, contato e menu (28/10/2026)

- **Experiências:** `content_blocks.content_json.items[].isHidden` é uma marcação editorial opcional. Itens ocultos **permanecem íntegros no JSONB e editáveis no CMS**, mas não aparecem em `ExperienceStack` desktop/mobile. As listas maiores foram limitadas inicialmente a seis itens visíveis para reduzir a necessidade de rolagem; em janelas curtas continua possível rolar. Não houve exclusão nem migration.
- **Depoimentos:** coleção `testimonials` é fonte única de texto, nome, cargo e status. Os blocos históricos `depoimentos/a` e `depoimentos/b` utilizam `source_collection="testimonials"` com `collection_start` e `collection_limit` para distribuir 2+3 itens entre mobile A/B, preservando os arrays originais como backup e as fotografias já aprovadas. No desktop cinco cards quadrados ocupam grade 3 colunas × 2 linhas, com expansão acessível que ocupa duas linhas. Dois novos textos foram explicitamente identificados como **fictícios/ilustrativos** e não representam recomendações reais. Edição no admin: **Coleções → Depoimentos**.
- **Contato:** `sections.intro` e `contato/a.items[0].text` permanecem editáveis no CMS e são exibidos no rodapé; a imagem do item A ocupa exclusivamente a coluna central. Links permanecem no bloco B e são apresentados sem colisão da seta com URLs.
- **Menu:** rótulos e visibilidade são gerenciados por `navigation_items`; há 13 seções públicas, mas **8 entradas visíveis no menu**. Cinco entradas individuais de empregadores ficam ocultas, preservadas no banco; `invest-rs` recebe o rótulo "Experiência Profissional". A navegação horizontal interna entre empregadores continua independente do menu lateral.

## Enquadramento por placement e identificação de mídias — 28/10/2026

Sem alterar tabela, migration ou Storage, `ContentItem.mediaFraming?: {x,y,zoom}`, `ContentItem.aboutDesktopFraming`, `ExperienceMedia.logoFraming` e `ExperienceSlide.framing` são campos JSONB opcionais definidos em `content_blocks.content_json`. Padrões: `x=50`, `y=50`, `zoom=1`; x/y limitados a 0–100% e zoom a 1–3. Somente a **apresentação** recebe `object-position`/`scale`. Mídias legadas sem configuração preservam o enquadramento e o layout anteriores.

`media_assets.title` é o nome final de `storage_path` com extensão (basename). Os 21 registros existentes foram sincronizados. O campo histórico `media_assets.credit` permanece no banco apenas por preservação de dados, mas não é usado pelo CMS em novas atualizações nem renderizado. Não houve deleção, mudança de esquema, política RLS, alterações de conteúdo editorial ou substituição de bytes.

## Biblioteca de Mídia — editor no item e status editorial único (29/10/2026)

**Escopo autorizado:** a Biblioteca de Mídia do CMS agora substitui a miniatura clicada por um editor **na mesma posição da grade** (largura de duas colunas com reflow responsivo); o editor não é mais montado no final da página. Botão de fechamento **X** com rótulo acessível. Foi removido **apenas o controle de entrada “Texto alternativo”**; os metadados antigos `alt_text` permanecem no banco, e a prévia do admin continua a usá-los quando existentes, com fallback para o nome do arquivo. Fotos e componentes públicos conservam seus `alt` próprios.

**Status:** a única opção editorial no admin é **Publicado**; a interface não oferece mais o seletor Rascunho/Em revisão/Arquivado. Em upload e substituição, o registro `media_assets.status` é gravado como `published`, mas o arquivo novo/substituído continua inicialmente em `portfolio-private` **até o usuário acionar “Disponibilizar no site”**. Esse controle continua usando a cópia segura Storage→Storage já existente, com rollback quando os metadados não persistem, sem sobrescrever um arquivo público diretamente. Arquivos públicos continuam sem substituição direta para não expor rascunhos. O botão **Salvar** preserva `alt_text`, `storage_path` e outros metadados não editados.

**Banco no encerramento desta atualização:** após identificar uploads concorrentes ocorridos durante a inspeção, a atualização guardada e não destrutiva foi concluída com **27 registros `published`** (**24** em `portfolio-public` e **3** em `portfolio-private`); **21 textos alternativos não vazios preservados**. O primeiro plano SQL foi abortado antes da gravação ao detectar 25→27 registros. RLS vigente `public media metadata` exige `status='published' AND storage_bucket='portfolio-public'` para leitura anônima; `PublishedMediaPicker` aplica ambos os filtros, portanto a unificação de status não expõe mídias privadas. A nova prova unitária `media-publication.test.ts` verifica esse filtro. Nenhum arquivo foi excluído ou copiado, nenhum bucket foi aberto e nenhuma política de RLS foi alterada. **Publicado é status editorial, não afirmação de disponibilidade pública de mídia privada.**

**Código:** [`6c5e3e0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/6c5e3e0f8991d825652844decbd482b86892457b), formatado em [`c9cb3de`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c9cb3dee73fadd11fc1a7bae86a78e8a89e039fb). [CI #40812587748](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812587748) `success`. [P3 #40812459767](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812459767) validou 13 seções, 25 painéis mobile, 38 capturas, zero falhas de browser e P5 público 3/3; **o gate Lighthouse P6 falhou** por LCP mobile instável (~7,68 s) e ausência de correspondência do retrato na amostra. Nova execução solicitada; **não considerar o P3 aprovado até confirmação**. A homologação de gravações com JWT administrativo real permanece suspensa conforme P2, de modo que o fluxo de upload/publicação não deve ser declarado homologado ponta a ponta.

