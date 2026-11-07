# Plano completo — padronização do CMS (Identidade, Editor do Site e Acervo Estruturado)

**Registrado em:** 07/11/2026. **Escopo autorizado agora:** somente a Etapa 1 (inventário, cópias de valores de apresentação e referências visuais). **Código-fonte de referência anterior ao inventário:** `207327b1ebe974e768a81f752fe1184249d210ba`.

> Este documento formaliza o plano solicitado. **Não autoriza iniciar as Etapas 2–5**, nem editar a página pública, Supabase, CSS, RLS, Storage, SEO ou configuração Vercel nesta primeira execução. A identidade visual publicada é a linha de base a preservar.

## Objetivo e princípios invariantes

Tornar a edição do portfólio mais intuitiva, com **Identidade** como catálogo central de cores, fontes e estilos tipográficos; **Editor do Site** com seletores legíveis e correspondência real com a página pública; e **Acervo Estruturado** separado das edições específicas de seção.

1. **Zero diferença visual inicial:** manter cores, fontes, escalas, quebras, responsividade, fotografias, composição, movimento e textos atuais no desktop e no mobile.
2. **Nenhuma exclusão ou duplicação:** preservar registros, identificadores, mídias, histórico editorial e vínculos Supabase.
3. **Edição por nomes e números compreensíveis:** o Editor do Site não deve exigir HEX nem entrada livre de família tipográfica ou tamanho de fonte. Cores e fontes por nome; tamanhos tipográficos por seletor numérico.
4. **Responsividade intacta:** tamanho numérico pode representar tamanho fixo ou referência responsiva; **não** substituir indiscriminadamente `clamp()`, `rem` e `vw` por `px` fixo.
5. **Configurações compartilhadas e exclusivas identificadas:** separar desktop/mobile e distinguir herança de estilo versus personalização local.
6. **Persistência verificável:** declarar sucesso apenas após salvar e reler pelo Supabase; testes de código não substituem homologação administrativa real.
7. **Escopo mínimo:** mudanças em etapas pequenas, sem refatorações globais destrutivas.

## Etapa 1 — Inventário e preservação visual

**Ações:**
- Mapear fontes, cores e tamanhos usados em componentes públicos, incluindo seletores, propriedades e origens de valores.
- Identificar fontes/estilos globais, configurações compartilhadas e regras específicas de desktop e mobile.
- Registrar valores fixos e responsivos `px`, `rem`, `vw`, `clamp()` (também `dvh`, `svh`, media queries e custom properties quando aplicáveis).
- Confrontar CSS, tipos TypeScript, constantes de fallback, `design_tokens`, `sections`, `section_panels`, `block_placements` e JSONB de `content_blocks`.
- Preparar cópia **dos campos de apresentação** envolvidos, com datas, IDs e SHA da origem, além das referências visuais anteriores à mudança.
- Registrar o escopo e limitações do backup: repositório público, sem versionar dados privados, credenciais nem dump integral do CMS.

**Entregáveis:** [inventário e mapa de correspondência](INVENTARIO_ESTILOS_BASELINE_2026-11-07.md), [declarações CSS indexadas](baselines/2026-11-07/css-declaracoes-de-estilo.csv), [snapshot de campos de apresentação do Supabase](baselines/2026-11-07/cms-estilos-supabase.json) e [manifesto de referências visuais](baselines/2026-11-07/REFERENCIAS_VISUAIS.md).

**Resultado esperado:** inventário dos valores atuais, sem modificações visuais. **Situação:** executada em 07/11/2026; ver o relatório, os limites e as evidências anexas. A comprovação de igualdade visual é uma obrigação de comparação futura, não consequência automática do inventário.

## Etapa 2 — Identidade como biblioteca central

### Cores

- Cadastrar e nomear as cores efetivamente usadas, preservando exatamente os valores atuais; incluir o branco se utilizado por elementos editáveis.
- Manter a edição de HEX exclusivamente em **Identidade** e expor nas demais telas um seletor de nome + amostra visual.
- Distinguir cores globais de variações contextuais (contraste, opacidade e estados de interação), sem trocar seus valores automaticamente.
- Não substituir literais arbitrários do CSS por tokens sem mapa de impacto e comparação antes/depois.

### Fontes

- Centralizar as famílias autorizadas mantendo Big Shoulders Display, Inter e Georgia nos usos existentes.
- Apresentar nas demais telas um seletor por **nome da família** ou papel (títulos, corpo e complementar).
- Preservar pesos, estilos (itálico, caixa-alta), fallback e carregamento para evitar diferenças de largura e quebra.

### Tamanhos e estilos tipográficos

- Cadastrar papéis semânticos: Título principal, Título editorial, Título de seção, Título de card, Texto de apoio, Legenda e variações comprovadas no inventário.
- **Tamanho numérico por seleção**, como 12, 14, 16, 18, 20, 24, 32, 48 e valores reais adicionais; não restringir os valores atuais a uma escala arbitrária.
- Oferecer **Padrão do estilo** e, quando apropriado, opção de personalização individual por número.
- Manter fórmulas responsivas originais por dispositivo; em escalas fluidas, o número é uma **referência declarada para um viewport** ou um limite, não tamanho universal.
- Registrar metadados de nomes somente quando necessários; preferir a tabela existente `design_tokens` e referências estáveis. Definir contrato e migração antes de alterar produção.

**Resultado esperado:** estilos editáveis centralizados sem nenhuma mudança inicial na exibição pública.

## Etapa 3 — Simplificação do Editor do Site

### Informações da seção

- Corrigir o campo **Título** para alimentar os elementos públicos correspondentes, incluindo o nome monumental do Perfil e a marca textual no header, preservando títulos editoriais independentes (por exemplo, o título exclusivo da abertura mobile).
- Retirar **Tema** e **Layout** da interface, mas manter valores e comportamento técnicos atuais.
- Corrigir **Transições** em conjunto com os presets suportados no código e a restrição real de `sections.animation_preset` no banco. Não ocultar erros nem gravar valores incompatíveis.
- Remover **Exibir no site** e padronizar a ação reversível **Arquivar / Exibir**, preservando estado, ordem e conteúdo e tratando seções apenas ocultas de forma segura.
- Proteger a âncora e a navegação da primeira seção quando arquivada/restaurada.

### Conteúdo e painéis

- Renomear **Conteúdo e Painéis** para **Conteúdo**.
- Exibir posição visual para os painéis: **Esquerda**, **Direita**, **Superior**, **Inferior** ou **Central**, conforme composição e dispositivo; manter IDs e relacionamentos internos A/B.
- Não usar título do primeiro item do bloco como rótulo de localização; incluir indicação de dispositivo quando a posição for diferente no mobile.
- Preservar conteúdos e vínculos editáveis existentes.

### Seletores de identidade

- Substituir HEX por seletor de cores nomeadas e visualmente identificadas.
- Substituir digitação de tamanho tipográfico por seletor numérico e **Padrão do estilo**.
- Substituir campos de fonte livre por seletor de fontes autorizadas.
- Separar controles **tipográficos** de dimensões/posicionamento/espaçamento, que podem exigir unidades e interface próprias.
- Manter suporte a valores herdados e a personalizações pontuais, sempre com leitura correta após salvar.

**Resultado esperado:** formulários mais fáceis sem mudança visual não solicitada, com persistência testada.

## Etapa 4 — Reorganização do Acervo Estruturado

- Adicionar **Acervo Estruturado** ao menu principal do CMS.
- Retirar sua apresentação como aba principal do Editor do Site; preservar atalhos contextuais **Editar no Acervo** quando houver vínculo efetivo.
- Identificar coleções compartilhadas **de fato** com base nas consultas e no código renderer: um registro de coleção não é automaticamente exibido no site.
- Mostrar onde cada registro é utilizado, ocultando da navegação de acervo compartilhado os conjuntos sem vínculo comprovado — sem excluir tabelas ou registros.
- Preservar relacionamento de origem, edição de Trajetória, depoimentos, experiências e caminhos específicos dos componentes públicos.
- Evitar duplicação de formulários ou conteúdo.

**Resultado esperado:** gestão clara de conteúdo por seção versus dados estruturados compartilhados.

## Etapa 5 — Validação, homologação e publicação

1. Conferir carregamento dos tokens e dos estilos, seleção, salvamento e recuperação via Supabase autenticado.
2. Validar herança de estilos, personalização local e comportamento responsivo dos tamanhos numéricos.
3. Testar os dispositivos e tamanhos de viewport cobertos pela linha de base, além de zoom/aumento de texto e `prefers-reduced-motion`.
4. Comparar capturas antes/depois para Perfil (desktop e mobile), demais seções e estados interativos com o **mesmo conteúdo, largura, altura e fontes carregadas**. Diferenciar comparação de pixels de avaliação estética humana.
5. Testar edição do título do Perfil, header, transições, Arquivar/Exibir, labels de painéis e Acervo compartilhado; confirmar alterações no banco após recarga.
6. Executar `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, verificações de navegador e performance vigentes. Não atribuir P3 verde a SHA que não foi auditado.
7. Fazer revisão de diff, documentar riscos e publicar somente depois de confirmar ausência de diferenças inesperadas.

**Critérios obrigatórios de aceite:** aparência inicial preservada em desktop/mobile; sem perda ou duplicação; cores/fontes por nome; tamanhos por número com responsividade; Identidade central; persistência confirmada; navegação e recursos públicos preservados.

## Sequência autorizada e bloqueios

| Etapa | Situação em 07/11/2026 | Modificação visual |
|---|---|---|
| 1. Inventário e preservação | Executada como documentação e backup parcial | Não |
| 2. Biblioteca Identidade | Planejada, não iniciada | Não autorizada |
| 3. Editor do Site | Planejada, não iniciada | Não autorizada |
| 4. Acervo Estruturado | Planejada, não iniciada | Não autorizada |
| 5. Homologação e publicação | Planejada, não iniciada | Não autorizada |

**Atenção:** backups desta etapa são específicos de **apresentação** e não um dump integral das tabelas. Antes de qualquer edição de conteúdo, realizar também backup completo e protegido dos registros que serão efetivamente alterados, respeitando a natureza pública deste repositório.

## Referências de precedência

[AGENTS](../AGENTS.md) · [documentação vigente](README.md) · [CMS atual](ADMIN_CMS.md) · [Design system](DESIGN_SYSTEM.md) · [layout responsivo](RESPONSIVE_LAYOUT.md) · [perfil editorial mobile](PERFIL_EDITORIAL_360_MOBILE_2026-11-06.md).
