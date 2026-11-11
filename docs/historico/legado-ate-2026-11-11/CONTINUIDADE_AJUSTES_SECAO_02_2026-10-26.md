# PortfolioTulius — Continuidade da seção 02

**Data da execução:** 26/10/2026.  
**Site:** https://tulius.work/  
**Repositório:** https://github.com/tuliustsangaropulos/PortfolioTulius — branch `main`.  
**Situação:** implementação e testes automatizados da seção 02 concluídos; aceite visual e gravação real do novo campo no CMS ainda pendentes.

## 1. Pedido e referências visuais

O proprietário apresentou o estado da seção 02 (tema laranja, `#sobre`) e uma imagem de referência. Solicitou:

- **Coluna esquerda:** preservar o título “OLÁ!”, o subtítulo “PRAZER, SOU O TULIUS” e a introdução, mantendo-os gerenciáveis no CMS.
- **Coluna central:** retirar o card pequeno com foto e substituí-lo por uma foto vertical que se estenda do topo à base da seção, baseada na referência de Tulius segurando um tablet sobre um grande círculo claro.
- **Coluna direita:** manter “COMUNICAÇÃO DE PONTA A PONTA” e “VISÃO EDITORIAL” e transferir para abaixo deles “ESTRATÉGIA TAMBÉM É ESCUTA.” / “Uma trajetória conectando organizações e pessoas.”, **sem a miniatura de foto**.
- Manter a edição de foto central, textos da direita e textos existentes da esquerda no painel administrativo.
- Preservar outras seções, os dados de conteúdo e o comportamento mobile salvo demanda explícita.

## 2. Decisões de implementação

**Fonte do retrato:** localizamos em `public/media/tulius-contact.jpg` uma fotografia já versionada e descrita editorialmente como “Tulius Tsangaropulos segurando um tablet”. O renderer a usa **por padrão**, sem gerar nem importar novos ativos. O círculo claro é um elemento CSS; a imagem é apresentada em escala de cinza, com ajuste de enquadramento e mistura visual com o fundo laranja.

**Fonte do conteúdo:** nenhuma duplicação nem alteração SQL. No Supabase, a seção `sobre` (id `5119424d-a03c-439b-9cd2-1024534e7f98`) mantém dois blocos:
- Painel A, bloco `49fbe2d3-fe6d-459c-a298-35b6a9fe563d`, com um item `Estratégia também é escuta.` e o retrato mobile original `/media/tulius-portrait.jpg`.
- Painel B, bloco `2410a612-17df-48fe-93a3-fd1c6504a200`, com dois itens: `Comunicação de ponta a ponta` e `Visão editorial`.

A composição `AboutDesktop` lê os dois blocos existentes: usa a foto principal no centro e renderiza **B1, B2, A1 (sem `image`)** à direita. A coluna esquerda lê o próprio registro `sections`. Na versão mobile, os painéis A/B e o retrato original foram mantidos, sem redesign.

## 3. Gestão no CMS

- **Esquerda:** `/admin` → **Seções** → **Olá!**: editar título, subtítulo e introdução.
- **Centro:** `/admin` → **Blocos e painéis** → **Olá!** → bloco **painel A** → item 01: novos campos **Imagem central da seção 02 (desktop)** (`aboutDesktopImage`) e **Descrição da imagem central (desktop)** (`aboutDesktopAlt`). Em branco, usam o asset e o alt padrão mencionados acima.
- **Direita:** no **painel B**, editar os títulos/textos dos dois primeiros itens. No **painel A**, título/texto do item 01 editam o terceiro item da direita, sem nova linha no banco.

As chaves opcionais `aboutDesktopImage` e `aboutDesktopAlt` são propriedades de `ContentItem` graváveis em `content_blocks.content_json.items` pelo RPC existente `save_content_block_atomic`. Não houve migration ou mudança em RLS; imagem personalizada aceita HTTPS ou arquivo seguro de `/media/` e exige alt próprio. **O fluxo autenticado de edição/gravação desses novos campos ainda não foi testado pelo navegador.**

## 4. Código alterado

- `src/components/public/PublicSite.tsx`: `AboutDesktop` para `slug === "sobre"`, com renderização independente de foto e textos.
- `src/index.css`: três colunas, altura da foto, halo branco e tratamentos de viewport intermediário.
- `src/types/content.ts`: dois campos opcionais para imagem/alt de desktop.
- `src/components/admin/AdminModules.tsx`: campos de imagem desktop e instrução sobre proveniência dos textos.
- `src/lib/validation.ts`, `src/lib/validation.test.ts`: validação e testes da URL/alt da foto.
- `src/content/fallback.ts`: fotografia e alt padrão sincronizados no item de `sobre`.
- `.github/workflows/validate.yml`: diagnóstico de diffs de formatação, executado somente se a checagem `format:check` falhar, sem persistir alterações da CI.

## 5. Infraestrutura e verificações

**GitHub:** commits diretamente na `main`, conforme `AGENTS.md`.  
**Supabase:** apenas leitura para inspecionar os dois blocos da seção 02; não houve update de conteúdo, DDL, policy ou Storage.  
**Vercel:** integração GitHub → produção ativa; builds da etapa retornaram `READY`. Conferir a associação ao SHA final após atualização dos documentos.

**CI:** o workflow `Validate PortfolioTulius` foi aprovado no commit de código `d6e1083`, run [40263871192](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40263871192): oxfmt, TypeScript, Vitest, build, smoke offline e sintaxe das suítes.

**Não homologado:** comparação pixel/viewport da fotografia central com a referência original, navegador real em múltiplas dimensões/zoom, e edição CMS real com JWT administrativo. Os testes de TypeScript/build não substituem essas provas.

## 6. Documentação e próxima etapa

Foram atualizados `README.md`, `docs/ADMIN_CMS.md`, `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/OPEN_ISSUES.md` e criado este relatório. Preservar histórico anterior da P7 e da seção 01.

**Fontes do projeto ChatGPT:** adicionar este arquivo como a fonte mais recente da seção 02. Continuar preservando `CONTINUIDADE_AJUSTES_SECAO_01_PORTFOLIOTULIUS_2026-10-25.md` e demais arquivos históricos; não sobrescrevê-los. Se necessário atualizar o relatório consolidado de estado no GitHub e substituir apenas sua cópia antiga anexada às fontes.

**Próxima interação:** receber do proprietário feedback visual real da seção 02 e refinamentos pontuais; não redesenhar outras seções sem instrução.

## 7. Refinamento pós-auditoria da fotografia

As capturas P4 do commit `d6e1083` revelaram que `tulius-contact.jpg` tem fundo preto e este obscurecia o círculo branco quando exibido diretamente. Sem alterar o asset de origem, o CSS `.about-portrait img` recebeu um recorte de silhueta por `clip-path`; a imagem voltou à composição sobre o halo branco, sem retângulo preto. A auditoria P4 do SHA `ac15053c` confirmou visualmente essa eliminação na captura desktop de 1440×900 ([run 40264875355](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40264875355)). A distância da foto ao topo foi refinada e o contorno superior suavizado posteriormente em `cdd2e110`; essas últimas mudanças dependem de sua própria verificação de CI/print.

O `clip-path` é uma máscara CSS de apresentação específica do asset padrão do repositório. **Ao configurar `aboutDesktopImage` no CMS**, a classe `has-custom-image` desativa automaticamente a máscara e o halo, exibindo a nova fotografia em enquadramento vertical genérico, sem recorte inadequado. A eventual adoção de uma foto PNG/WebP já transparente e de um halo correspondente poderá ser tratada em refinamento posterior.
