# CMS → Supabase → Renderer — mapa versionado (referência e atualização)

> **Atualização operacional em 09/11/2026:** o conteúdo abaixo é o contrato de 08/11 (SHA `2c01b7d9`) preservado como especificação. Desde então, `save_section_block_atomic` foi implementada em migration incremental, validada em 11 cenários sintéticos e integrada aos editores; **não foi aplicada em produção**. Também ocorreram seis E2E básicos de UI, cinco de SEO e oito cenários adicionais reais de Auth/Storage sintéticos. A meta Lighthouse mobile falhou em 09/11 e exige novo resultado de três amostras antes de aceite. Consultar também `P2_P4_RELATORIO_EXECUCAO_2026-11-09.md` e `ESTADO_ATUAL_VIGENTE.md` para evidências e limites atuais.

# Mapa operacional — campos do CMS → Supabase → site público

**Revisão:** 08/11/2026, baseada no SHA [`2c01b7d9`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/2c01b7d92bdb0161e056e8b3ba0b86de4986e5aa).  
**Objetivo:** evitar a criação de campos administrativos sem efeito público, a perda de valores ao reordenar itens e atualizações sem releitura. **É um mapa de contrato, não relatório de teste de cada campo.** Para schemas e tipos exatos consultar `src/types/content.ts`, os componentes e migrations.

## 1. Fluxo de leitura e gravação

```text
CMS /admin
  ├─ AdminApp.tsx / AdminModules.tsx / editores extraídos
  ├─ sections / content_blocks / block_placements / coleções / media_assets
  └─ RPCs protegidas + UPDATEs com RLS/CAS nos caminhos correspondentes
                       │
                       ▼
           Supabase PostgREST + Storage
                       │
                       ▼
usePortfolio.ts → media-alt-sync.ts → PortfolioSection[]
                       │
                       ▼
PublicSite.tsx / ExperienceStack.tsx / Navigation.tsx
                   Desktop + Mobile
```

`save_content_block_atomic` é atômica **para um bloco e seus placements**; outros updates executados antes/depois são operações independentes. A atualização do SEO estático ocorre apenas durante o build.

## 2. Seções e administração

| Controle no CMS | Persistência principal | Consumidor/comportamento | Observações |
|---|---|---|---|
| Título público de seção | `sections.title` | Cabeçalho/títulos públicos conforme seção, inclusive nome do Perfil | Distinguir `editorTitle` interno |
| Sobrancelha e introdução | `sections.eyebrow`, `sections.intro` | Frases editoriais do site | Hero é caso de salvamento composto |
| Ordem de seção | `sections.sort_order`, RPC `swap_section_order` | Ordem do fluxo público | Depende de publicação/visibilidade |
| Visibilidade e status | `sections.is_visible`, `sections.status` | Seleção de seções publicadas | Uma seção pode estar `published` e oculta |
| Preset de transição | `sections.animation_preset` | Motion das seções conforme composição | Validar enum/predefinições suportadas |
| Nome interno da seção | `content_blocks.content_json.editorTitle` no bloco correspondente | **Somente CMS** | Não substituir título público |
| Âncora editorial interna | `content_blocks.content_json.editorAnchor` | Navegação/identificação do editor quando aplicável | Não alterar `sections.slug` inadvertidamente |
| Fundo geral do Hero | `content_blocks.content_json.items[0].hero.rootBackground` de Perfil A | Fundo público do Perfil | Metadado global ancorado no item A inicial |

**Integridade:** `AdminApp.tsx` pode modificar `sections` e `content_blocks` em chamadas separadas; tratar o par como uma unidade lógica na nova RPC P2, se a edição requerer ambos.

## 3. Estrutura de blocos, itens e placements

| Campo | Local | Efeito esperado |
|---|---|---|
| Título, texto, rótulo, metadado, valor | `content_blocks.content_json.items[].title/text/label/meta/value` | Cards, indicadores e frases de suas seções, conforme renderer |
| Tags / toolIcons / metricIcon | Campos JSONB do item | Etiquetas e pictogramas do catálogo interno quando usados pelo renderer |
| Tema/resultados | `themeKey`, `relatedThemeKeys` e propriedades de tema dos itens | Seleção e herança visual entre Hero e Resultados |
| Imagens | `items[].image`, `aboutDesktopImage`, `experienceMedia.logo`, `experienceMedia.slides[].image` | Uso da mídia na composição específica |
| Estilo por dispositivo | Campos JSONB de apresentação do item, quando existentes | Overrides do respectivo dispositivo |
| Presença e ordem do bloco | `content_blocks.status`, `sort_order`, `mobile_panel` | Qual bloco entra em cada composição |
| Layout, ordem, visibilidade e movimento por painel | `block_placements` ligado a `section_panels` | Desktop e mobile usam placements do mesmo bloco; não criar duplicação editorial |
| Motion | `block_placements.motion_config` | Preset, duração, delay, distância e execução conforme renderer |

**Chaves canônicas de placement:** `desktop`, `mobile-a`, `mobile-b`; o painel mobile efetivamente exigido depende de `content_blocks.mobile_panel` (`a` ou `b`). O administrador conserva painéis já existentes não alterados.

## 4. Perfil — Hero A e B

| Campo/UI | Caminho | Consumidor/limite |
|---|---|---|
| Foto/selo do Hero | Primeiro item do bloco **Perfil A** (`image`, `alt`, propriedades `hero` e estilo) | `PublicSite.tsx` em desktop e mobile; **não** oferecer cópia funcional no bloco B |
| Desktop/mobile do retrato | `hero.desktop`, `hero.mobile` do item A 0 | Dimensões, posição e selo conforme `HeroDeviceStyle` |
| Abertura Editorial 360° mobile | `hero.mobileEditorial` do item A 0 | Exclusivamente `ProfileMobileEditorial`; desktop ignora esses ajustes |
| Painel de cartões e destaques direito | Bloco **Perfil B**, `content_json.items[]` | Cards do Hero; primeiros cinco itens têm agrupamento próprio |
| Destino de card | `content_json.items[].targetSlug` no B | Âncora pública, apenas para seção publicada e visível |
| Formatação global e destaques à direita | `content_json.items[0].hero` no B | Campos gerais como `secondaryTitle`, `nextTarget`, `fieldFormats`; **não trocar com item ao reordenar** |
| Formatos por item | `items[].fieldFormats` e `items[0].hero.fieldFormats` conforme campo | Estilos do texto ou da área geral, conforme renderer |
| Próximo destino do Hero | `content_json.items[0].hero.nextTarget` no B | Selecionar apenas destino publicado e visível |

**Regra de integridade P1:** `src/lib/hero-admin-contract.ts` preserva a configuração geral `hero` no item 0 quando a ordem muda e impede passar itens entre grupos indevidos; `publishedHeroDestinations` filtra seções ocultas. Isso foi testado em código, não em gravação produtiva de ensaio.

## 5. Mídia e fontes canônicas

| Campo | Banco/JSON | Efeito público verificado ou pendente |
|---|---|---|
| Texto alternativo canônico | `media_assets.alt_text` (bucket público) | `usePortfolio.ts` busca `storage_path,alt_text`; `synchronizePublishedMediaAlts` atualiza dados em memória do site |
| Alt de item | `items[].alt` | Substituído pelo valor canônico do catálogo quando reconhecido; fallback ao JSON quando ausente |
| Alt da seção Sobre desktop | `items[].aboutDesktopAlt` | Mesmo mecanismo canônico |
| Alt da foto editorial mobile | `items[0].hero.mobileEditorial.mobileAlt` | Mesmo mecanismo canônico |
| Logo e slides de experiência | `experienceMedia.logoAlt`, `experienceMedia.slides[].alt` | Mesmo mecanismo canônico; galeria em `ExperienceStack.tsx` |
| Título/Crédito do arquivo | `media_assets.title`, `media_assets.credit` | Metadados editáveis da biblioteca; **não presumir efeito público automático** |
| Ponto focal/zoom do catálogo | `media_assets.focal_point` | Editável e conferido no catálogo; **não** integrado automaticamente pelo hook de alt; definir contrato antes de declarar propagação |
| Enquadramento de uso | JSONB `mediaFraming`, `aboutDesktopFraming`, `mobileFraming` ou `logoFraming` | `imageFramingStyle` é consumido pelos renderers onde aplicado |
| Arquivo físico | `media_assets.storage_bucket/storage_path` e Supabase Storage | Publicação, renomeação e exclusão envolvem etapas de banco/Storage não atômicas entre sistemas |

**Importante:** quando a página já está aberta, atualização posterior do catálogo pode exigir reload para voltar a consultar os metadados. Não reescrever cópias antigas no JSONB indiscriminadamente; versões/revisões podem conter URLs históricas legítimas.

## 6. Coleções, navegação e SEO

| Controle | Persistência | Consumo |
|---|---|---|
| Trajetória da experiência | Linha existente de `career_experiences`, com guarda `updated_at` | Texto integral/atributos da carreira pública; sem duplicar em `content_blocks` |
| Depoimentos | `testimonials` (edição inline no Editor do site) | Cards publicados de depoimento; não recriar Acervo independente no menu |
| Projetos, métricas, ferramentas, formação, contatos | Coleções normalizadas e/ou blocos vinculados | Vínculos existentes, `source_collection` quando aplicável; não migrar conteúdos em massa |
| Navegação pública | `navigation_items` | `Navigation.tsx`, destino e visibilidade condicionados às seções publicadas |
| SEO página | `pages.seo_title`, `pages.seo_description` | HTML estático **após build** |
| SEO global | `site_settings.site_title`, `description`, `locale`, `seo_json`, `status` | `generate-seo.mjs`: title/OG/canonical/robots/sitemap e campos sociais no build |
| SEO persistido | RPC `save_home_seo_atomic` | Atualiza `pages` e `site_settings` em transação SQL única; **não** dispara publicação automática |
| Revisões | `content_revisions`, `audit_logs`, `editorial_issues` | Histórico e revisões administrativas; recuperação controlada |

## 7. Regressões obrigatórias após qualquer edição

- [ ] Salvar e recarregar item Hero e bloco correspondente, confirmando que `hero` do item 0 não saiu do lugar após reordenação.
- [ ] Verificar seleção e gravação de `targetSlug` publicado; impedir link para seção invisível.
- [ ] Confrontar campo de mobile com renderer mobile, sem afirmar efeito no desktop quando exclusivo.
- [ ] Verificar `sections`, `content_blocks` e placements juntos; falhas não podem ser relatadas como sucesso integral.
- [ ] Alterar `media_assets.alt_text` fictício, recarregar e conferir imagem pública desktop/mobile.
- [ ] Distinguir catálogos `focal_point`/`credit` de overrides locais usados pelo renderer.
- [ ] Executar build para testar SEO estático; salvar só o banco não basta.
- [ ] Conferir CAS, RLS, histórico e comportamento com erro parcial sem recorrer a dados produtivos.

**Complementar com casos e evidências reais no [plano de aceite](P2_P4_PLANO_ACEITE_2026-11-08.md).**