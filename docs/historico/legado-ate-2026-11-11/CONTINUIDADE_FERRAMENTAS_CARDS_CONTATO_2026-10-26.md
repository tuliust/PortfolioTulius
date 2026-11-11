# PortfolioTulius — Continuidade: Ferramentas, links de experiência e Contato

**Data:** 26/10/2026  
**Projeto:** PortfolioTulius — https://tulius.work/  
**Repositório:** https://github.com/tuliustsangaropulos/PortfolioTulius — branch `main`.

## 1. Solicitações

1. Ferramentas: aplicar fundo cinza-escuro da identidade visual, converter fontes e títulos para branco/laranja e ilustrar as seis categorias com ícones de plataformas, conforme referência gráfica.
2. Abertura (seção 01): fazer os seis blocos de histórico profissional inteiramente clicáveis, com hover e navegação direta até as respectivas seções de experiência.
3. Contato: alterar a cor dos títulos e valores clicáveis quando o cursor passa sobre seus links, sem modificar seus endereços ou dados.

## 2. Ferramentas

A seção `ferramentas` recebeu `sections.theme='ink'` no Supabase (em vez de `cream`) e no fallback local. Seu fundo passa a `#171617`, com texto auxiliar branco e títulos alternando laranja e branco. A estrutura, título principal e todos os textos das seis categorias permanecem os originais.

Foram criados 15 pictogramas vetoriais SVG autocontidos em `src/components/public/ToolIcons.tsx`, apresentados em grupos de círculos laranja com símbolos claros:

| Categoria | Ícones iniciais |
|---|---|
| Análise e indicadores | Google Analytics, Search Console |
| Mídia e performance | Meta Ads, crescimento/performance |
| CRM e monitoramento | Salesforce, HubSpot, Sprinklr |
| Projetos e colaboração | Asana, Notion |
| Conteúdo e design | Adobe Creative Cloud, Figma, WordPress |
| Comunicação digital | Redes sociais, conteúdo audiovisual e campanhas |

Os desenhos são representações ilustrativas locais das ferramentas, **não SVGs oficiais de logomarcas**. Não há dependências de serviço de imagem externo, nem foi incluído software de terceiros para obter logotipos. Essa distinção deve ser observada caso o usuário solicite fidelidade às marcas em uma etapa posterior.

Os ícones são armazenados em `content_blocks.content_json.items[].toolIcons` (array de zero a três nomes de uma enumeração `ToolIconName`). A validação rejeita nomes inválidos, repetidos ou mais de três. No CMS: **Blocos e painéis → Ferramentas → Painel A ou B → Ícones de plataformas (até três)**. O botão **Salvar alterações** usa a RPC atual `save_content_block_atomic`.

## 3. Navegação dos cards da seção 01

Os seis itens de carreira do bloco `perfil/B` receberam `targetSlug` próprio. Foram preservados seus títulos, datas e descrições:

| Card da abertura | Destino |
|---|---|
| Invest RS | `#invest-rs` |
| Prefeitura de São Paulo | `#prefeitura-sp` |
| Vale | `#vale` |
| Grupo InPress | `#inpress` |
| TV Globo/SporTV | `#globo-sportv` |
| CDI Comunicação | `#cdi` |

Em desktop e mobile, `ItemCard` renderiza um `<a>` na superfície inteira quando o slug é válido e publicado. O hover possui fundo alaranjado discreto, acento à esquerda e alteração da cor do título; o teclado tem foco visível. Nenhum card é direcionado à seção 03 por fallback: o mecanismo desses seis itens é distinto dos cinco cards de especialidades, cuja configuração `themeKey` e navegação continuam intactas.

O painel admin recebeu seletor **Empresa de destino (card clicável)** nos itens 6–11 em **Perfil → Painel B**. Pode ser configurado como **Sem link**, removendo o direcionamento. A existência/publicação do slug é conferida antes da renderização do link.

## 4. Links de Contato

No CSS da seção `#contato`, o hover e o foco por teclado mudam as cores de `.contact-link h3` e `.contact-link .item-value` para `var(--paper)` (branco), mantendo o fundo laranja, os rótulos secundários e a seta existentes. WhatsApp, e-mail, LinkedIn e respectivos endereços não foram modificados.

## 5. Escritas no Supabase

Projeto: `zfnrhzplwpjpdljraypt` (`portfolio`).

Transação SQL com guardas de valores anteriores atualizou somente:
- `sections.slug='ferramentas'`: `theme='ink'`;
- `content_blocks.id='4b6b0baf-33a8-4f18-b5fe-2de06ff4d1bd'` (`ferramentas/A`): `toolIcons` dos três itens;
- `content_blocks.id='717c437f-871f-42ef-8c8e-f6183a2d13a2'` (`ferramentas/B`): `toolIcons` dos três itens;
- `content_blocks.id='a092fea1-754d-422b-a0aa-5e2502714a68'` (`perfil/B`): `targetSlug` dos seis itens de carreira.

Leitura posterior confirmou a estrutura e os destinos publicados. Os itens e textos originais foram preservados. **Não houve alteração de schema, migrations, RLS, Auth, Storage nem configurações de segurança.** As alterações diretas no banco são publicações editoriais, não testes autenticados do CMS nem revisões geradas pela RPC.

## 6. Código e documentação

Código modificado:
- `src/components/public/ToolIcons.tsx`: pictogramas vetoriais acessíveis, nomes de plataformas;
- `src/components/public/PublicSite.tsx`: clusters de ferramentas e links de carreira desktop/mobile;
- `src/index.css`: fundo escuro de Ferramentas e hover/foco das duas outras áreas;
- `src/types/content.ts`: `ToolIconName` e `ContentItem.toolIcons`;
- `src/components/admin/AdminModules.tsx`: campos de ícones e destinos da carreira;
- `src/lib/validation.ts`: validação de ícones;
- `src/content/fallback.ts`: atualização local de tema, destinos e pictogramas;
- `src/content/fallback.test.ts` e `src/lib/validation.test.ts`: testes de regressão.

Documentos sincronizados: `README.md`, `docs/ADMIN_CMS.md`, `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/OPEN_ISSUES.md`, `docs/ESTADO_ATUAL_AUDITORIA_2026-10-25.md` e este registro. `AGENTS.md` permanece inalterado.

## 7. Testes e publicação

O workflow `Validate PortfolioTulius` conferiu formatação, TypeScript, testes unitários, build e smoke para os commits finais do código. Ainda requer confirmação do deployment mais recente pela Vercel. Na etapa anterior, a plataforma retornou `402 api-deployments-free-per-day` por atingir o limite diário; **não presumir que a versão no GitHub está automaticamente publicada**.

Pendências: verificar o hover em diferentes resoluções e no teclado, conferir a navegação das seis âncoras e a aparência dos ícones no ambiente publicado; homologar edição e revisão/rollback via CMS com JWT real. Não modificar o plano de cobrança Vercel sem autorização.

## 8. Fontes do projeto ChatGPT

Anexar este arquivo como continuidade da etapa de Ferramentas/links/Contato. Atualizar a cópia do relatório consolidado `ESTADO_ATUAL_AUDITORIA_2026-10-25.md` se o projeto possuir versão anterior. Preservar os registros históricos de contexto, ambiente e das seções 01–04.
