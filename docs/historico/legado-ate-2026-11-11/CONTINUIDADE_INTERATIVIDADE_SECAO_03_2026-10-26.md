# PortfolioTulius — Interatividade da seção 03 e incorporação da seção 04

**Data da etapa:** 26/10/2026.  
**Código:** https://github.com/tuliustsangaropulos/PortfolioTulius · `main`  
**Produção:** https://tulius.work/#resultados  
**Objetivo:** transformar a seção Resultados em experiência temática vinculada aos cards da abertura; retirar a antiga seção 04 da publicação sem perder seu conteúdo.

## 1. Escopo aprovado

- Trocar os números 01–04 na área de indicadores da seção 03 por ícones SVG editáveis no admin.
- Transformar os cinco títulos à direita em botões com hover/foco e seleção, modificando o conteúdo central conforme o tema.
- Integrar os cinco cards da seção 01: ao clicar, ir para `#resultados` já exibindo o conteúdo pertinente, preservando o campo de destino configurável.
- Retirar a antiga seção 04 (“Comunicação e Estratégia”) do site e da navegação, aproveitando seus cinco conteúdos no painel da seção 03.
- Incorporar os cinco eixos com títulos, subtítulos, temas relacionados e textos curtos enviados pelo proprietário, sem inventar números ou alterar outras seções.
- Atualizar CMS, documentação e testes.

## 2. Eixos temáticos e associações

| Tema selecionado | Eixo central | Título do conteúdo |
| --- | --- | --- |
| Comunicação Corporativa | Liderança e Posicionamento | A voz de quem lidera |
| Gestão e execução de projetos | Integração e Execução | Comunicação de ponta a ponta |
| Relações Públicas e Gestão de Eventos | Estratégia e Relacionamento | Estratégia também é escuta. |
| Marketing Digital, Branding e Performance | Performance e Resultados | Resultados que orientam decisões |
| Imprensa e Influenciadores | Conteúdo e Imprensa | Visão editorial |

Os **subtítulos, temas relacionados e textos curtos exatos do pedido** foram publicados no JSONB do bloco `resultados/B`. Os cinco blocos antigos da seção 04 foram aproveitados como `inheritedHighlights`, sem apagar a fonte: “Competências” e “Destaques” no tema corporativo, “Gestão” no de projetos, “Relações” no de eventos e imprensa, “Habilidades” no de marketing. A associação foi uma decisão editorial interpretativa para integrar os dois conjuntos; pode ser alterada no admin.

## 3. Indicadores e ícones

Os **quatro valores originais** e respectivas descrições continuam no bloco `resultados/A`, sem alteração dos números. Os antigos rótulos 01/02/03/04 foram retirados; cada item recebeu `metricIcon`, selecionável em uma lista de dez ícones SVG locais:

- Mídia e Estratégia — `chart`, associado a marketing.
- Comunicação Pública — `trending`, associado a marketing.
- Jornalismo Internacional — `newspaper`, associado a imprensa.
- Relações Públicas e Imprensa — `megaphone`, associado a eventos e imprensa.

Ao abrir diretamente a seção 03, aparece **Visão geral — indicadores** com os quatro valores. Ao selecionar um tema, aparecem os campos de narrativa, competências reaproveitadas e somente os indicadores vinculados. **Temas sem métrica numérica comprovada não recebem números inventados.** O visitante pode retornar à Visão geral.

## 4. Navegação a partir da seção 01

Os primeiros cinco itens de `perfil/B` receberam `themeKey` estável (`corporativa`, `projetos`, `eventos`, `marketing`, `imprensa`). No desktop e mobile, o clique em uma caixa de especialidade cuja `targetSlug` resolvida seja `resultados` atualiza o estado `selectedTheme` no React e navega por âncora `#resultados`. Se o administrador configurar outro destino, a seleção temática não é acionada.

O seletor da seção 03 utiliza botões semânticos com `aria-pressed` e estilos de hover/foco. Existe uma apresentação desktop de três colunas e uma apresentação mobile unificada com seletores seguidos do conteúdo.

## 5. Como administrar

Em `/admin` → **Blocos e painéis**:

1. **Resultados e projetos em destaque → painel A:** alterar valores/títulos/textos originais, **Ícone do indicador** e caixas **Exibir este indicador nos temas**; salvar o bloco.
2. **Resultados e projetos em destaque → painel B:** alterar **Título** do seletor, **Identificador do tema**, **Eixo central**, **Título central**, **Subtítulo central**, **Temas relacionados**, **Texto curto**, **Conteúdo reaproveitado da antiga seção 04**; salvar o bloco. Os temas são objetos estruturados no JSONB existente.
3. **Perfil → painel B → primeiros cinco cards:** alterar **Tema selecionado na seção 03** além do campo **Destino do card**, mantendo os identificadores consistentes com o bloco Resultados/B.
4. **Seções → Comunicação e Estratégia:** a seção está oculta (`is_visible=false`), mas conserva seus registros e pode voltar a ser exibida apenas mediante nova solicitação explícita.

Persistência do CMS segue a RPC `save_content_block_atomic`. A edição por sessão JWT administrativa real, os fluxos de revisão e rollback ainda requerem homologação end-to-end.

## 6. Estado do Supabase

Projeto `portfolio` (`zfnrhzplwpjpdljraypt`). O bloco `resultados/A` (`f7908ce3-dd45-4f55-b858-46c15fbda357`) e `resultados/B` (`ccb158ca-ee6a-4305-873d-8230a03de216`) foram atualizados por uma transação guardada que verificava os dados anteriores; a mesma transação definiu `is_visible=false` na seção `competencias` (`e41e6eb4-6bb9-42d3-b9fb-1e672faf796f`). Segunda operação controlada acrescentou `themeKey` aos cinco cards em `perfil/B` (`a092fea1-754d-422b-a0aa-5e2502714a68`). Os dois blocos originais da seção 04 continuam intactos. As demais seções e os indicadores numéricos não foram alterados.

**Não houve DDL, migration, mudança de policies RLS, Storage, autenticação ou configurações Vercel.** A edição direta no banco não foi feita pela UI administrativa; não deve ser confundida com teste autenticado do CMS ou revisão gerada pela RPC.

O menu agora enumera sequencialmente **13 seções visíveis**; a apresentação mobile totaliza **25 painéis**, pois a seção Resultados utiliza apenas um painel interativo. A política RLS pública das seções exige `status=published AND is_visible`.

## 7. Código e testes

- `src/types/content.ts`: campos opcionais de métrica/ícone e dossiê temático.
- `src/components/ui/Icons.tsx`: conjunto local de pictogramas SVG.
- `src/components/public/PublicSite.tsx`: seletor de temas e composição central compartilhada, ligação com os cards de perfil, visão geral e estados de foco.
- `src/components/public/Navigation.tsx`: numeração sequencial de seções visíveis.
- `src/components/admin/AdminModules.tsx`: campos estruturados de temas, seleção de ícones, associações dos indicadores e configuração dos cards.
- `src/content/resultThemes.ts`, `src/content/fallback.ts`: seed editorial sincronizado e seção 04 oculta.
- `src/content/fallback.test.ts`, `src/lib/validation.ts`, `src/lib/validation.test.ts`: integridade de temas, identificadores únicos e nomes de ícones permitidos.
- `src/index.css`: layout da visão geral e dossiês, botões, responsividade e acessibilidade.
- `scripts/p3-browser-smoke.mjs`, `scripts/p4-visual-audit.mjs`, `scripts/p5-public-rls.mjs`: verificações atualizadas para 13/25/38, sem relaxar critérios de overflow ou segurança. O teste P3 também verifica o fluxo card da abertura → tema selecionado, alternância de tema e retorno à visão geral.

**Verificações:** `Validate PortfolioTulius` passou no código após formatação, TypeScript, Vitest, build e smoke. O workflow completo `Audit P3 Lighthouse` passou no SHA `d536ba3a`, com auditoria dos oito viewports sem overflow, RLS anônimo, páginas administrativas não autenticadas e screenshots dos 38 painéis. Após ajustes posteriores de CSS/documentação/teste temático, verificar novamente CI/auditoria do SHA final antes de declarar aceite definitivo.

**Ainda pendente:** teste real de edição/salvamento no CMS com JWT, compatibilidade de todos os cinco temas em telas pequenas, inspeção manual de recortes e ajustes finos de layout, decisão editorial final das associações onde não há métrica, e confirmação da navegação temática no navegador após último deploy.

## 8. Documentação e fontes ChatGPT

Atualizados: `README.md`, `docs/ADMIN_CMS.md`, `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/OPEN_ISSUES.md`, `docs/ESTADO_ATUAL_AUDITORIA_2026-10-25.md` e este arquivo. `AGENTS.md` e históricos anteriores foram preservados.

Adicionar este arquivo como fonte mais recente do projeto ChatGPT e atualizar a cópia anexada do relatório de auditoria. Os documentos das seções 01/02 e a continuidade de conteúdo anterior continuam válidos como histórico, mas não representam isoladamente a versão atual da seção 03.
