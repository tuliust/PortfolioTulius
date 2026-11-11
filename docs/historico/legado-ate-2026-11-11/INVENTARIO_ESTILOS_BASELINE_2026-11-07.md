# Inventário de estilos e baseline visual — Etapa 1

**Data:** 07/11/2026. **Escopo:** apenas inventário e preservação de referências; nenhuma alteração de CSS, React, textos públicos, tabelas, mídias ou RLS. **SHA funcional inventariado:** [`207327b1ebe974e768a81f752fe1184249d210ba`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/207327b1ebe974e768a81f752fe1184249d210ba). **Arquivo CSS base:** `src/index.css`, blob Git `b3a05b9e1f93bcbb9c4a3a9b10d57235a8656242`. O commit documental que acrescenta este relatório **não** é uma nova referência visual.

## 1. Procedimento e limites

- Leitura direta do stylesheet, componentes públicos, contratos TypeScript e CMS no SHA indicado, seguida de consultas **SELECT** ao projeto Supabase de produção (`zfnrhzplwpjpdljraypt`).
- Inventário automatizado de declarações CSS com **linha, seletor, propriedade, valor, contexto de media query e escopo heurístico**: [CSV indexado](baselines/2026-11-07/css-declaracoes-de-estilo.csv). A extração preserva a **ordem** dos seletores; uma regra anterior pode ser sobrescrita por outra mais específica ou por media queries.
- Foram indexadas **1.000 declarações de cor/tipografia/tokens relacionados**: 559 classificadas heurísticamente como público/compartilhado, 191 como administração e 250 como indeterminadas. **Não** interpretar as classificações automáticas como cálculo de estilo final.
- Há **235 declarações `font-size`** com **159 expressões distintas** no arquivo CSS. A contagem inclui regras para administração, mídia responsiva e possíveis sobrescritas: **não equivale a 159 estilos tipográficos efetivamente usados**.
- Estilos inline JSX, herança, cascata, fontes carregadas, dados do CMS e media queries são parte do resultado final. Não há aqui um dump de `getComputedStyle()` de cada elemento em todos os viewports.
- A cópia [JSON do Supabase](baselines/2026-11-07/cms-estilos-supabase.json) foi capturada em **2026-11-07 04:07:01 UTC**, exclusivamente com campos pertinentes à apresentação. **Não** é dump integral nem backup de textos, usuários ou credenciais.

## 2. Fontes ativas e origem

| Papel atual | Família/base | Origem/observação |
|---|---|---|
| Títulos, display, valores e nome | **Big Shoulders Display** | `design_tokens.font.heading`, `--font-heading`, `--font-display`, além de campos mobile; fallback `Arial Narrow` |
| Textos de corpo, descrições e suporte | **Inter** | `design_tokens.font.body`, `--font-body`; fallback `system-ui` |
| Frase do Perfil desktop e usos serifados | **Georgia** | Regra CSS específica, não consta hoje nos 12 tokens persistidos |
| Outras famílias | fallback do sistema | Não substituir automaticamente; conferir componente antes de oferecer no CMS |

Os 12 registros atuais de `design_tokens` são: seis cores, duas fontes, um container, um espaçamento de seção, um raio e uma duração de movimento. **Não existem tokens publicados de tamanhos de fonte**. O código do perfil mobile possui sua própria lista de três famílias autorizadas: Big Shoulders Display, Inter e Georgia.

## 3. Cores globais em `design_tokens`

| Nome técnico existente | Valor HEX registrado | Papel conhecido |
|---|---|---|
| `color.orange` | `#FF5414` | Destaques e faixas laranja |
| `color.ink` | `#171617` | Grafite, texto escuro |
| `color.paper` | `#FAFAFA` | Fundo claro |
| `color.cream` | `#F8F4F1` | Variação clara |
| `color.muted` | `#514742` | Texto de contraste secundário |
| `color.orangeDark` | `#BC390C` | Laranja escuro |

**Branco** (`#FFFFFF` ou `white`) é utilizado diretamente em alguns componentes, inclusive nas configurações da primeira área do Perfil Editorial 360°, mas **não possui hoje token `color.white` no banco**. O CSS contém ainda cores para bordas, estados, alpha, interações e expressões `color-mix()`; catalogá-las exige análise de uso antes de agrupá-las sob seis nomes.

Os tokens globais de layout existentes são `layout.container=1680`, `space.section=64`, `radius.card=4` e `motion.duration=520`; **nenhum deles é um preset de fonte**.

## 4. Mapa de correspondências público ↔ CSS ↔ Supabase

| Elemento público | Definição atual de fonte/tamanho | Dependência e cuidado |
|---|---|---|
| Corpo do site | `src/index.css`: `.public-site` usa `var(--font-body)` | Token `font.body` do Supabase; manter fallback |
| Títulos gerais de seções | `.section-heading h2, .panel-heading h2`, linha 94: `clamp(3.2rem,6vw,7.8rem)` | Media queries posteriores refinam valores; não forçar tamanho fixo |
| Nome monumental desktop | `.name-lockup`, linha 194: `clamp(3.4rem,5.6vw,7rem)` | Fonte `--font-display`; nome escrito diretamente em `PublicSite.tsx`, a corrigir apenas na etapa 3 |
| Frase do Perfil desktop | `.profile-intro`, linha 181: `Georgia` e `var(--hero-desktop-intro-size,clamp(.85rem,1.05vw,1.1rem))` | Pode receber configuração JSONB de hero; possui ajustes por largura |
| Títulos dos destaques do Perfil | `.profile-highlights .content-item h3`, linha 187: `var(--item-desktop-title-size,clamp(.72rem,.92vw,.92rem))` | Campos `DeviceItemStyle` permitem override em JSONB; consultar CSS posterior |
| Header público | `.brand-button` e media queries de `src/index.css` | Fonte display, nome fixo em `Navigation.tsx`, independente do campo Título no CMS |
| Títulos de Experiências desktop | `.experience-heading h2`, linha 608 em diante, com outras regras por breakpoint | Tipografia varia com largura, identidade da empresa e composição |
| Títulos Experiências mobile | `.experience-mobile-copy .experience-heading h2`, linha 691: `clamp(3.2rem,12vw,5.1rem)` | Não usar um único número para todos os dispositivos |
| Títulos de ferramentas | `.tools-editorial > .section-heading h2`, linhas 711 e 752 | Sobrescritas de tamanhos coexistentes; requer análise de cascata |
| Cabeçalho de painéis mobile | `--mobile-heading-size`, linha 1441: `clamp(2.9rem,12vw,3.8rem)` | Aplicado em títulos de painel com escopo; não remover fluidez |
| Título editorial da abertura mobile | `.mobile360-headline`, linha 2429: `clamp(2.35rem,13.8vw,var(--mobile360-headline-size,82px))` | Configuração em `items[0].hero.mobileEditorial.top.headlineSize` atualmente **82**; é teto e não tamanho fixo |
| Nome na área inferior mobile | `.mobile360-person-name`, linha 2515: `clamp(1.35rem,5.9vw,var(--mobile360-name-size,48px))` | `hero.mobileEditorial.bottom.nameSize` atualmente **48** |
| Indicador de experiência mobile | `.mobile360-experience > strong`, linha 2539: `clamp(2.3rem,10.7vw,var(--mobile360-years-size,64px))` | `hero.mobileEditorial.bottom.yearsSize` atualmente **64** |
| Suporte e descrição mobile | `.mobile360-support` e `.mobile360-experience > p`, linhas 2447 e 2547 | Inter por padrão, tamanho fluido de acordo com largura |
| Três fundos do Editorial 360° | `.mobile360-top`, `.mobile360-middle`, `.mobile360-bottom` | Supabase JSONB `hero.mobileEditorial.top/middle/bottom.background`, não necessariamente tokens globais |

**Exemplo de risco de regressão:** em 390 px de largura, 13,8vw equivale a aproximadamente 53,8 px; o `82` editado no CMS é o teto da regra, não o tamanho exibido nessa viewport. Não basta selecionar `54 px` e substituir a regra inteira.

## 5. Atributos editáveis já modelados

**CSS global / `design_tokens`**: cores de marca e fontes principais; root também contém tamanhos, medidas e cores de estado não cadastrados no banco.

**`sections` (14 registros)**: `theme`, `layout_variant`, `animation_preset`, `status`, `is_visible`; o renderer constrói classes de tema, layout e motion a partir deles.

**`section_panels` (42 registros)**: `breakpoint`, `panel_key`, `theme`, `layout_variant` e `style_config`. Neste baseline, **0/42 `style_config` são não vazios**.

**`block_placements` (56 registros)**: `layout_variant`, `style_config`, `motion_config`, `is_visible`; **0/56 `style_config` não vazios**, e **56/56 `motion_config` não vazios**. Preservar motion durante qualquer refatoração de estilos.

**`content_blocks` (28 registros)**: conteúdo JSONB com itens que podem ter `desktop`, `mobile`, `titleColor`, `textColor`, `backgroundColor` e `hero`. Na leitura atual, somente **1 item tem override explícito desses campos**, o Perfil A com `hero.mobileEditorial`; outros visuais herdam CSS e tokens. Isso não autoriza concluir que os blocos não são estilizados.

**`MobileProfileEditorial` (Perfil, mobile)**: tipos em `src/types/content.ts`, padrões em `src/lib/mobile-profile-editorial.ts` e renderização em `src/components/public/PublicSite.tsx`. O objeto possui cores, fontes, tamanho máximo do título, tamanhos máximos do nome e do indicador, selo, foto, espaçamento e visibilidade por área. **Hoje usa valores diretos**, não IDs de `design_tokens`.

**Campos numéricos no admin**: `DeviceStyleEditor`, `HeroDeviceEditor` e `ProfileMobileEditorialEditor` permitem entrada livre de número; `ColorField` usa color picker e `MobileEditorialFontField` usa famílias. Na Etapa 2/3, diferenciar **tipografia** de medidas geométricas (largura, posição, foco e espaçamento) para não substituir controles necessários inadvertidamente.

## 6. Responsividade que deve ser preservada

O CSS possui regras, entre outras, para `max-width:767px`, `max-width:360px`, `max-width:380px`, `min-width:768px` com cortes para tablets e telas médias, `min-width:1101px`, regras de **altura de viewport** e `prefers-reduced-motion`.

A etapa seguinte deverá catalogar estilos por papel semântico **com regra de desktop e mobile própria**. Usar seleção numérica como linguagem de edição **sem trocar fórmulas `clamp()` por valores fixos**, inclusive em casos de estilos definidos em `font:` shorthand.

A linha de base deve ser testada com os mesmos parâmetros de viewport e conteúdo, considerando zoom e disponibilidade de fontes para futura comparação.

## 7. Cópias, referências visuais e limites

- [Snapshot JSON de apresentação](baselines/2026-11-07/cms-estilos-supabase.json): IDs e valores originais dos campos estilísticos relevantes, incluindo flags de seções, painéis, motion dos placements e estilo item-level. **Não inclui textos integrais, arquivos de mídia, Auth, RLS, nem dump de banco**.
- [Mapa CSS rastreável](baselines/2026-11-07/css-declaracoes-de-estilo.csv): 1.000 registros de estilo; `line` e `selector` permitem localizar override existente no SHA fonte.
- [Referências visuais e manifesto](baselines/2026-11-07/REFERENCIAS_VISUAIS.md): capturas automatizadas P3 e P4 do SHA funcional, 17 + 38 imagens; links e prazos dos artefatos, além de orientação para comparação posterior.
- **Atenção à origem da captura:** o workflow P3 associado está **reprovado globalmente**; as capturas são evidência de estado renderizado, **não aprovação de layout nem garantia de produção visual**.
- Os ZIPs foram recuperados via GitHub Actions para entrega nesta conversa. Como os artifacts expiram e o repositório é público, o manifesto documental registra SHA e nomes; **os arquivos binários não foram versionados no GitHub**.

## 8. Critérios da Etapa 1 — verificação

| Critério | Resultado |
|---|---|
| Fontes, cores e tamanhos catalogados | **Concluído:** fontes base, 6 cores do banco, 1.000 declarações CSS |
| Valores fixos, fluidos e cortes documentados | **Concluído:** CSV conserva regras e contexto; mapeamento humano dos elementos principais |
| Desktop, mobile e herança identificados | **Concluído em nível de código**, não medição computada integral de browser |
| Dados Supabase/JSONB confrontados | **Concluído:** consultas SELECT e snapshot parcial com contagens verificadas |
| Referências visuais anteriores preparadas | **Concluído:** P3 17 e P4 38 capturas recuperadas; manifesto e entrega em ZIP |
| Verificação de ausência de alterações visuais | **Garantida pelo escopo de alterações:** somente arquivos de documentação; verificar diff final antes do commit |
| Homologação visual manual | **Não executada**, reservada para Etapa 5 |

**Nota de preservação:** qualquer correção do título no header, troca de tokens, escala, nome de estilo ou comportamento de CMS será **uma etapa posterior** e não deve ser misturada ao inventário.
