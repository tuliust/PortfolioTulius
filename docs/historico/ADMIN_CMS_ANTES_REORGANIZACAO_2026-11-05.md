> **ARQUIVO HISTÓRICO — fonte:** [`docs/ADMIN_CMS.md`](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2/docs/ADMIN_CMS.md), commit `79aa3c07`. Os textos e evidências foram preservados; somente links relativos foram ajustados à localização no arquivo histórico. Não usar como estado vigente.

> **AJUSTE DO EDITOR — 05/11/2026:** em Experiências, a orientação “Cada título de slide…” passou ao `AdminInfoTip` junto a “Slides relacionados aos projetos” (clique/hover), e o texto redundante sobre resumos foi removido. Os campos da Trajetória (Empresa, Cargo, Local, Início, Fim, Ordem, Status, Descrição com formatação) agora estão **na mesma página** de edição da experiência; o botão “Editar trajetória completa (Coleções)” foi retirado. O formulário grava a linha original em `career_experiences` pelo Salvar agregado e usa `updated_at` para bloquear sobrescrita de outra sessão. **Não** há migração nem cópia da descrição para `content_blocks`, e a gravação autenticada real não foi homologada nesta rodada.

> **ATUALIZAÇÃO DOCUMENTAL DE 05/11/2026:** referência funcional [`31943c12`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/31943c12b8214aa1d4aad957d159ddcea010835e), [Validate #42016989021](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016989021) **success**, Vercel READY. **P3 geral não aprovado** no run [#42016688466](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016688466) de `04cf1240`: 7 falhas de navegador, apesar de P6 LCP mobile mediano de 3,484 s passar isoladamente. [Auditoria integral dos pedidos](../AUDITORIA_PEDIDOS_CHAT_2026-11-05.md).
**Editor do Site atual:** tabs menores dentro do cabeçalho da seção, à direita inferior; removidos Nova seção, Duplicar seção, Novo bloco, Adicionar item e quadro explicativo de status. Botão **Salvar** usa ação consolidada; sidebar mostra Oculto/6 itens; Prévia mobile adota 390×844; inputs locais de alt e controles locais de enquadramento saíram do Editor e permanecem em Mídia. **Ressalva:** a seleção copia alt para JSON; sincronização posterior entre Biblioteca e referências do conteúdo ainda não foi comprovada.

> **CMS FUNCIONAL — 05/11/2026:** alterações administrativas consolidadas até [`94466303`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/94466303617b18e343dddeb64d2ca7e39f131475) ([Validate #42011905996](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42011905996) **success**); código incorporado ao HEAD [`5ed489af`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5ed489af5879589565cb0101e420065bfbf50552), também publicado. **Mídias:** upload novo direto em `portfolio-public` com `media_assets.status=published`, botão **Salvar**, alt com borda visível, miniaturas com **X** e confirmação, sem botão Substituir/Disponibilizar. RPC transacional de exclusão de referências + remoção subsequente do Storage; dois retratos com referências fixas são bloqueados. **Editor:** seções e blocos exibem Publicado/Oculto sem edição direta de status; `is_placeholder` permanece preservado nos saves; Tema, Transições e campos avançados têm infos contextuais. **Navegação:** Novo item desabilitado e status fixado como publicado no salvamento. **Sem ensaio autenticado de operações destrutivas**; os registros históricos abaixo não são contrato atual. [Relatório completo](../RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md).

> **Rodada de 05/11/2026, posterior ao encerramento:** a página Editor do Site reúne **Informações da seção** e **Conteúdo e painéis** (nesta ordem); Acervo estruturado permanece separado. **Nova seção** e **Novo bloco** estão desabilitados. A barra flutuante de salvar não aparece sem alterações, e os toasts têm afastamento quando ela está presente. Biblioteca de Mídia oculta o campo de crédito, reutiliza modal de posição/zoom e permite renomear **somente arquivos físicos privados**, via cópia no Storage, atualização condicional do `storage_path` e **remoção posterior do objeto anterior**. Arquivos públicos mantêm URL e título editorial editável. Validação: [`5599b2f0e0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5599b2f0e030565b224b9ab0c8046c371e14749c) e [CI #42004690688](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42004690688). **Não há aceite comprovado de gravação autenticada**; validar política de preservação de Storage antes de renomear. [Matriz e limites](../RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md). Trechos datados anteriores abaixo são históricos.

> **ACEITE HUMANO — 05/11/2026:** CMS e site do escopo atual foram encerrados por decisão expressa do proprietário; os testes manuais das Etapas 4–7 permanecem concluídos. [Registro vigente](../ENCERRAMENTO_OPERACIONAL_2026-11-05.md). As seções cronológicas abaixo preservam o estado que tinham na data de emissão.

# CMS administrativo

## Estado funcional e aceite — revisão 01/11/2026

As solicitações do documento [CONTINUIDADE_CMS de 31/10](../CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md) foram descritas **antes de sua implementação**. O CMS vigente registra em código: **CMS-UX-01**, seletor de 50 ícones em popover visual com cinco categorias e limites de seleção; **CMS-UX-02**, campos de alt/legenda alinhados; **CMS-UX-03**, biblioteca padronizada em modal e fluxo de upload com publicação deliberada; **CMS-UX-04**, Salvar/dirty guard e `beforeunload` nativo.

**Limite de comprovação:** implementação e verificações read-only/estáticas **não** constituem aceite humano do diálogo nem homologação transacional autenticada de uploads e CRUD. A decisão P2 de não executar gravações de teste em produção, nem criar staging pago sem autorização, permanece em vigor. Não modificar status de mídia/Storage ou dados editoriais por atualização documental.

O conteúdo das seis experiências (tags, projetos, slides e `career_experiences`) continua separado e editável pelo CMS. O frontend mobile reorganiza somente a visualização: acordeão, galeria vinculada, Trajetória integral e ficha sticky, sem copiar textos para JSX. Ver [estado atual](../ESTADO_ATUAL_VIGENTE.md) e [pendências](../OPEN_ISSUES.md).

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

## Revisão de experiências: badges, alternância tipográfica e CDI sem texto — 31/10/2026

- **Dados revisados no Supabase:** seis empresas com cinco tags editoriais cada. A Invest RS mantém as cinco competências já aceitas. Foram adicionados registros do tipo `{title: "Competências aplicadas", tags: [...]}` ao início de `content_blocks.content_json.items` do painel A da Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress e CDI Comunicação, preservando todos os demais itens, slides, métricas, status e coleções. Verificação SQL posterior confirmou **6/6 empresas com 5 tags**, sem alteração de schema, RLS, tabelas ou `career_experiences`.
- **Site público:** os botões `PROJETOS E REALIZAÇÕES` e `TRAJETÓRIA` usam agora **a mesma fonte de display e caixa alta**. O ativo fica maior e o inativo menor, invertendo a hierarquia quando o usuário seleciona Trajetória; os controles acessíveis `aria-pressed` e `aria-controls` foram preservados.
- **CMS:** `ContentStudio` ganhou campo dedicado **Competências aplicadas — tags abaixo do período**, uma por linha, salvando no próprio bloco A somente pelo botão Salvar existente. Há orientação sobre vínculo entre itens visíveis e títulos dos slides e atalho para a coleção `career_experiences`, que guarda o texto integral de Trajetória. Projetos, slides, competências e coleções não foram fundidos; não há autoescrita silenciosa.
- **CDI Comunicação — arte corrigida:** [job GitHub #41179537232](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179537232) **success**: três SVGs existentes descarregados do Storage, dois nós `<text>` removidos **por imagem** e checksum SHA-256 verificado. Três novos objetos publicados em `portfolio-generated/2026-10-31-cdi-no-text/`, com os três slides da CDI atualizados (3/3, verificação SQL posterior). **Os arquivos originais, proporção 1200×675 e conteúdos ilustrativos foram preservados**; não confundir com fotografias originais ou com as 19 outras ilustrações de 1200×1350. A rotina autenticada partiu de Storage privado e promoveu explicitamente ao público.
- **Verificações:** [CI #41179537245](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179537245) aprovado; revisão [`fb0caebd`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fb0caebd98a32568355b4e3069958d664972ae7f) adicionou checagens de navegador de seis listas de badges, imagens CDI sem texto e tamanho/fonte dos controles. A [P3 #41179623669](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179623669) é uma medição separada; manter P3-PERF-01 aberto enquanto LCP mobile exceder 2,5 s. Não declarar homologação P2 transacional paga ou testes destrutivos.

## Estado atualizado em 31/10/2026 — revisão editorial e UX do CMS

**Código:** [`01a3a287`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/01a3a28731817c510616408d85196d10dd206113), [Validate #41175411745](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41175411745) **success** e Vercel Production **READY** no mesmo SHA (`dpl_B64aMBXM9URAwppjwWcaxfjoTJJq`). A P3 do novo código é independente; não afirmar que LCP mobile foi corrigido.

**UX administrativa:** removido o aviso repetitivo "Origem do conteúdo: Itens editados neste bloco" de todos os editores, sem retirar acesso a "Editar registros vinculados" quando há coleção. A orientação "Textos da seção 02 — coluna direita" foi movida para o ícone de informações, visível por mouse ou clique e acessível via teclado. A prévia de "Ajustar enquadramento" ganhou área geometricamente limitada, imagem isolada e controles de posição/zoom sem sobreposição. Testes estáticos `admin-editor-notices-framing.test.ts` e CI aprovados; inspeção visual específica em 1440px e 390px ainda requer validação humana.

**Supabase — gravação editorial expressamente solicitada e conferida por leitura posterior:** **0** ocorrências `editorial_issues` abertas (oito desta rodada passaram a `resolved` e uma já estava resolvida), **3** depoimentos publicados e **2** exemplos fictícios arquivados reversivelmente. Permanecem Matheus Gomes, Ana Beatriz Neves e Fábio Seixas; nenhuma recomendação de Marcelo Ventura foi criada, pois não há texto autêntico disponível no acervo. Cargo Invest RS confirmado como "Assessor Executivo | Núcleo de Comunicação"; CDI alinhada à captura de LinkedIn fornecida, com texto detalhado na coleção e síntese nos quatro cards; Perfil e Vale exibem somente a articulação/atuação envolvendo 14 países; idiomas "inglês fluente / espanhol avançado" e cargo InPress foram confirmados. Imagens da Invest RS preservadas com aviso de caráter ilustrativo, alt provisórios corrigidos. Conteúdo original da mídia e Storage não foram modificados.

**Limites:** o proprietário autorizou as gravações pontuais de conteúdo desta rodada. Isso **não** reabre a homologação transacional P2, não autoriza staging pago, alteração de RLS, testes destrutivos, exclusão permanente, nem altera a pendência P3 de LCP mobile. Os depoimentos de Marcelo Ventura poderão ser acrescentados futuramente **somente** mediante texto real e autorização. Os registros anteriores deste documento são históricos e devem ser interpretados à luz desta atualização.

## CMS UX entregue em 31/10/2026 — código e limites

O commit funcional [`6913d91`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/6913d91c71041457d3425836ee2e96f93677bc59), [CI Validate #41173453310](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41173453310) **success** e Vercel Production **READY** incorporou:

1. `VisualIconLibrary.tsx` com seletor compacto e popover contendo 50 opções gráficas em cinco grupos; foco inicial, Escape, fechamento externo, `aria-expanded` e os contratos de seleção única/múltipla permanecem.
2. Em `AdminModules.tsx`, campos de descrição alternativa do logo e legenda dos slides alinhados ao topo pela grade CSS própria (`experience-logo-fields`, `experience-slide-fields`). O `logoAlt` segue opcional e os valores dos campos não foram alterados.
3. `PublishedMediaPicker.tsx` passou a abrir `PublishedMediaDialog.tsx`, com pesquisa, seleção publicada, envio de mídia dentro do modal e lista separada de arquivos privados não selecionáveis. `src/lib/media-library-actions.ts` compartilha upload privado e publicação explicitamente confirmada com a biblioteca principal; a imagem atual, alt e X/Y/zoom do bloco só mudam se o administrador confirmar uma seleção e posteriormente salvar o formulário.
4. O Salvar flutuante e as proteções de rascunho continuam existentes. Fechar/cancelar um modal não salva o bloco; `beforeunload` segue nativo por restrição do navegador.

**Provas:** CI completo e teste estático `admin-cms-ux.test.ts`; [P5 read-only #41173340958](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41173340958) aprovou o catálogo recolhível e nenhum conteúdo foi escrito. **Não executado:** testes de upload real, promoção, CRUD/restauração transacionais (P2 suspenso), nem nova inspeção visual do modal e popover em aparelhos físicos. Não usar `READY` como prova de publicação editorial/Storage.

## Histórico do backlog de UX — 31/10/2026 (estado anterior à entrega)

As capturas mostram: **(a)** os 50 ícones ocupam o formulário de modo permanente; substituir por **dropdown visual com popover** e as cinco categorias atuais; seleção única de métrica e até 3 plataformas; acessibilidade e estado de rascunho. **(b)** `Descrição alternativa do logo` e `Legenda da imagem` estão deslocadas verticalmente; alinhar label/input ao topo sem alterar valores existentes, inclusive descrições opcionais. **(c)** `PublishedMediaPicker` abre a biblioteca inline `role="region"`; alterar para **dialog/modal** com busca, escolha e envio de imagem no mesmo diálogo. Compartilhar lógica segura de `EnhancedMediaLibrary` para upload privado, revisão e promoção deliberada. Preserve mídia atual, X/Y/zoom e Salvar flutuante; não usar confirmações JS nativas para navegação interna.

**Handoff e critérios de aceite:** [`CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md`](../CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md), CMS-UX-01/02/03/04. Testes reais de escrita de arquivos/banco continuam bloqueados por P2; testes de interface e mocks/read-only são permitidos. Este bloco é um **registro de pendência**, não uma descrição da UI já implementada.



> **Estado operacional em 28/10/2026:** confira [índice vigente](../ESTADO_ATUAL_VIGENTE.md) e [pendências P2](../OPEN_ISSUES.md). O [P5 de leitura autenticada #40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770) **passou 4/4** (login, 8 módulos, prévia, logout, zero requisições de escrita CMS/Storage detectadas). **Não testou salvar, publicar, alterar, promover upload ou restaurar via UI.** Os fluxos descritos abaixo são funcionalidades do código, não provas de homologação transacional. A recuperação limitada de campos de seções e blocos foi implementada na interface em 29/10, mas **não está homologada com gravações reais**. Mídia e Storage continuam excluídos da restauração. A seção antiga de 26/10 deve ser lida como histórico das alterações; não criar usuário administrativo adicional sem pedido explícito.

## Restauração assistida de revisões — 29/10/2026

Em `/admin` → **Revisões**, uma revisão de `sections` ou `content_blocks` pode ser comparada com a versão atual. A recuperação é **limitada** a `title`, `eyebrow` e `intro` (seções), ou a `content_json` (blocos). Não recupera `media_assets`, arquivos Storage, `status`, visibilidade, ordem, IDs ou placements. A prévia mostra os campos a recuperar; revisões cujo conteúdo ultrapasse o limite de pré-visualização permanecem bloqueadas para recuperação nessa interface.

Antes de gravar, a interface exige confirmação, relê a versão atual, compara `updated_at`, insere explicitamente o snapshot atual em `content_revisions` e somente então tenta aplicar o patch restrito, condicionado ao mesmo `updated_at`. O trigger existente continua capturando snapshots posteriores. Esta sequência protege contra sobrescrita simples e preserva uma cópia prévia, **mas não é uma transação SQL atômica única** entre a cópia e o UPDATE. **A execução transacional com JWT administrativo real continua não homologada e suspensa (P2)**. Os testes unitários validam apenas a lista branca, integridade de identidade e proibição de reverter mídia.


## Capacidades do marco histórico anterior (não utilizar como contrato vigente)

- Login Supabase Auth e verificação adicional em `admin_users`.
- Dashboard de estado e pendências.
- Seções: editar, publicar, ocultar, ordenar por botões, duplicar e arquivar com confirmação.
- Blocos: criar, editar e arquivar; editar itens, ordem, painel A/B, placement, layout e motion.
- Coleções: experiências, projetos, métricas, competências, formação, idiomas, ferramentas, depoimentos e contato.
- Design: editar/publicar cores, fontes autorizadas, container, espaçamento, raio e duração.
- Mídia: upload privado, alt, crédito, substituição e promoção ao bucket público.
- Navegação: criar e editar rótulo, grupo, âncora, ordem, status e visibilidade.
- SEO: título, descrição, Open Graph e canonical.
- Governança: pendências editoriais, revisões automáticas e audit log no banco.
- Preview: rota protegida com consulta incluindo drafts.

Nenhuma configuração executa JS/CSS do banco. Slugs publicados são bloqueados no editor.

## Conta administrativa e provisionamento excepcional

Já existe **uma conta Auth associada a um registro em `admin_users`** no snapshot verificado de 28/10. Não criar ou substituir contas durante homologação documental. **Somente se for solicitada expressamente uma nova conta**, provisionar via Supabase Auth e inserir seu UID em `admin_users` pelo operador autorizado. Não existe autopromoção, signup administrativo público ou autorização baseada apenas em `authenticated`.

Revisões e auditoria são gravadas por trigger. A interface atual oferece comparação e recuperação **restrita** de campos com cópia de segurança e controle de concorrência; o ensaio transacional P2 com JWT real permanece suspenso.

## Destino dos cinco cards da abertura (25/10/2026)

Em `/admin`, abra **Blocos e painéis**, escolha **Perfil** e selecione o bloco de **painel B** (com cinco especialidades e seis experiências). Nos **itens 01 a 05**, aparece **Destino do card (seção interna)**. Selecione a seção desejada e clique em **Salvar alterações**; o valor é salvo como `targetSlug` em cada item de `content_json.items` pela mesma RPC atômica existente. Os cards são links em toda a superfície, tanto no desktop como no painel B mobile. O destino padrão, inclusive para itens antigos sem o campo, é **Resultados e projetos em destaque (`#resultados`, seção 03)**.

Os destinos são selecionados entre slugs do CMS. O renderer aceita somente slugs que correspondam a seções visíveis e publicadas; um alvo ausente/não publicado cai para `#resultados` (ou apresenta card sem link se também faltar a seção 03). Não usar `meta` para configurar esses links: `meta` permanece reservado ao conteúdo/metadado existente. A gravação do editor com JWT administrativo real ainda exige homologação manual; a disponibilização do campo no código não prova o teste de gravação em produção.

## Seção 02 — gestão completa dos cinco textos (26/10/2026)

Em `/admin` → **Blocos e painéis**, escolha **Olá!** e o **painel B**. Os cinco títulos e respectivos textos da coluna direita estão no mesmo bloco, em `content_json.items`, podendo ser:
- **Adicionados** por **Adicionar item**;
- **Editados** nos campos **Título** e **Texto**;
- **Reordenados** pelas setas para cima/baixo;
- **Excluídos** pelo botão de remoção, sujeito a confirmação.

Use **Salvar alterações** para gravar via RPC `save_content_block_atomic`. A quantidade não fica limitada a cinco: cinco é o conteúdo inicial solicitado. Não remova o único item do **painel A**, que armazena a fotografia e seus campos desktop, inclusive `aboutDesktopImage` e `aboutDesktopAlt`. A coluna esquerda continua sendo editada em **Seções → Olá!** (título, subtítulo e introdução).

**Renderização:** no desktop, toda a lista B aparece à direita na mesma ordem. No mobile, a foto do painel A é acompanhada pelo título/texto do primeiro item B; os demais itens B aparecem no painel mobile B. Nenhuma cópia textual é mantida no item de foto. Se todos os textos forem excluídos, permanece apenas a fotografia no mobile A.

## Seção 03 — lista de especialidades

Em **Blocos e painéis → Resultados e projetos em destaque → painel B**, estão os cinco temas iguais aos cards 01–05 da seção 01. Podem ser editados pelo CMS, mas **não são ligados automaticamente** aos títulos da seção 01 após futuras alterações; para manter a equivalência editorial, modificar ambos os blocos ou solicitar a implantação de sincronização automatizada. O painel A da seção 03 contém os quatro indicadores de resultados e não foi alterado nesta rodada.

**Aceite pendente:** salvar/adicionar/excluir/reordenar com JWT administrativo real ainda requer teste autenticado de navegador; o sucesso do SQL e os testes unitários não demonstram o fluxo UI completo.

## Seção 03 — resultados temáticos e ícones (26/10/2026)

**Gerenciar indicadores:** em **Blocos e painéis → Resultados e projetos em destaque → painel A**, cada indicador continua com valor, título e texto. O campo **Ícone do indicador** escolhe entre dez pictogramas internos (gráfico, crescimento, pessoas, imprensa, meta, comunicação, projetos, eventos, destaque e estratégia), sem URLs de ícones externos. Em **Exibir este indicador nos temas**, marque uma ou mais especialidades às quais o resultado comprovado pertence. Na **Visão geral**, os quatro indicadores aparecem juntos; em cada tema, aparecem apenas os resultados vinculados. Não inferir números nem relacionar resultados sem fundamento.

**Gerenciar os cinco temas:** no mesmo módulo, abrir o **painel B** de Resultados. O campo **Título** é o rótulo clicável à direita; campos adicionais editam **Identificador do tema**, **Eixo central**, **Título central**, **Subtítulo central**, **Temas relacionados**, **Texto curto** e **Conteúdo reaproveitado da antiga seção 04** (uma linha por destaque). Ordem e itens continuam editáveis pelas ferramentas padrão do bloco. O identificador de tema deve ser único, minúsculo e sem caracteres especiais (`corporativa`, `projetos`, `eventos`, `marketing`, `imprensa` na entrega).

**Ligação desde a abertura:** em **Perfil → painel B → cards 01 a 05**, além do campo **Destino do card**, há **Tema selecionado na seção 03**. O tema é aplicado somente se o destino continuar sendo `resultados`. Identificadores permanecem estáveis após reorganizar os cards, desde que não sejam removidos ou editados indevidamente.

**Seção 04:** `competencias` recebeu `is_visible=false` em `sections`. Não foi excluída nem arquivada, continua disponível no admin. Os cinco registros originais de Habilidades, Gestão, Competências, Relações e Destaques também foram transpostos para os destaques temáticos da seção 03. Para reativar a antiga seção, usar a gestão de visibilidade do CMS em operação expressamente autorizada.

**Aceite pendente:** selecionar, salvar e publicar alterações com JWT administrativo real, verificar revisão/rollback, e testar vinculação/tema depois de reordenação. Atualização direta de JSONB e build não validam esse fluxo autenticado.

## Administração das galerias e logotipos das seis empresas — 26/10/2026

Em `/admin` → **Blocos e painéis**, selecione uma das seis empresas (Invest RS, Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress ou CDI Comunicação) e abra o **Painel A**. A seção **Identidade da empresa e galeria de projetos** edita diretamente `content_json.experienceMedia`, sem nova tabela:

- **URL do logo** (somente `/media/arquivo` ou HTTPS), **descrição alternativa do logo**; se não preenchidos, aparece um monograma tipográfico temporário, que **não representa a marca oficial**.
- **Slides**: adicionar/excluir/reordenar, editar título do projeto, URL da foto, texto alternativo e legenda. O conteúdo inicial contém três projetos por empresa sem foto aprovada. A galeria mantém espaço reservado identificando a pendência, nunca fotografia fictícia.
- Salvar com **Salvar bloco**, pela mesma RPC atômica `save_content_block_atomic` e mecanismo de revisão do CMS. URLs são validadas pela lista segura `isSafeEditorialImage`; cada foto e logo informativos exigem `alt`.

Os textos e conteúdos existentes dos **Painéis A e B** continuam administráveis e foram preservados. As imagens devem ser registros realmente relacionados ao projeto e com autorização de uso; **não inserir material ilustrativo genérico como se documentasse a atuação profissional**. Somente depois de cadastrar URLs válidas a galeria exibirá fotos. O sistema não cria arquivos nem transfere imagens automaticamente para o Storage.

A seção Formação mantém os mesmos blocos; sua identidade escura foi configurada no tema da seção. As seis empresas receberam `theme='paper'`, mas o layout especial é exclusivo desses slugs. Não alterar a ordem para fora do grupo sem reavaliar o componente `ExperienceStack`.

**Ainda pendente:** homologar inclusões e exclusões de slides, persistência/rollback com sessão autenticada, qualidade/ direitos das imagens e arquivo real das seis logomarcas.

## Ferramentas e links de experiência — 26/10/2026

- **Ferramentas:** em `/admin` → **Blocos e painéis** → **Ferramentas**, selecionar **Painel A** ou **Painel B**. Cada item possui checkboxes **Ícones de plataformas (até três)**: Google Analytics, Search Console, Meta Ads, indicadores, Salesforce, HubSpot, Sprinklr, Asana, Notion, Adobe, Figma, WordPress, social, vídeo e campanhas. A lista de quinze pictogramas é local e tipada; cada item aceita no máximo três sem repetições. Salvar alterações pela RPC existente `save_content_block_atomic`.
- **Experiência e atuação (seção 01):** em **Perfil → Painel B**, os itens **6–11** agora expõem **Empresa de destino (card clicável)**. Selecionar uma das seis seções de experiência publicadas, ou **Sem link**. Os cinco itens 1–5 continuam com seus campos de tema/destino existentes. O clique da caixa inteira funciona em desktop/mobile, com hover e foco.
- **Contato:** efeito de hover e foco no CSS, sem novos campos e sem mudanças em URLs.

A identidade da seção Ferramentas usa `sections.theme='ink'`. Na ausência de alteração explícita, preservar textos originais. **Pendente:** testar edição, salvamento, revisão/rollback de ícones e destinos usando uma sessão JWT administrativa real; os commits GitHub e SQL não substituem essa homologação.

## Etapa 3 — mídia com compensação e aprovação de textos (26/10/2026)

Uploads privados e substituições passam por procedimento compensatório: o arquivo novo é enviado, os metadados são gravados, e somente então um arquivo substituído é removido; se a gravação falha, tenta-se remover o novo arquivo. Uma falha de limpeza é reportada ao operador. **Não é uma transação distribuída entre PostgreSQL e Storage**; homologação com JWT administrativo real ainda falta.

A pedido do proprietário, os textos publicados de `resultados/A`, `invest-rs/A` e `invest-rs/B` tiveram a marca de placeholder do bloco removida. O item específico **Ativos visuais**, dentro de `invest-rs/B`, continua `placeholder=true` por não haver imagens aprovadas; as notas `editorial_note` documentam a distinção. O conteúdo `content_json` não foi reescrito. Ver [registro da etapa 3](../ETAPA_3_AJUSTES_2026-10-26.md).


## Correção da pré-visualização da Biblioteca de mídia — 26/10/2026

A Biblioteca de mídia agora exibe a **imagem real**, em vez de um ícone fixo, em cartões de arquivos privados e públicos. A imagem usa `object-fit: contain` para preservar as proporções dos logotipos e tem fallback visível para caminho ausente, erro de assinatura ou falha de carregamento.

- **Bucket `portfolio-private`:** o admin autenticado solicita uma URL assinada com validade de 3.600 segundos por meio da sessão e das regras RLS existentes; a URL é mantida apenas no estado do componente e não é gravada no CMS. Após expirar, recarregue a Biblioteca de mídia para gerar uma nova prévia.
- **Bucket `portfolio-public`:** a URL pública é obtida pelo SDK via `getPublicUrl(storage_path)`; não é necessário abrir o bucket privado para visitantes.
- **Fluxos preservados:** upload privado, metadados, revisão, publicação, substituição e referência de logo por URL em `Blocos e painéis`. Não houve alteração de Auth, RLS, bucket nem conteúdo editorial.
- **Limite:** testes unitários cobrem geração da URL e falhas. Sem execução E2E com JWT admin, não afirmar que o carregamento de imagens privadas foi homologado no navegador real.


## Seleção de imagens nos Blocos — 26/10/2026

Em **Admin → Blocos e painéis**, os antigos campos de URL para imagens dos itens, foto principal desktop da seção Olá!, logos das seis empresas e fotografias dos slides foram substituídos por **Escolher da biblioteca**, com grade de miniaturas, busca pelo título/nome e indicação da seleção atual. A imagem escolhida grava a URL pública existente no mesmo campo do JSONB (sem migração) somente ao clicar em **Salvar alterações / Salvar bloco**.

A lista inclui exclusivamente imagens com `status=published`, `storage_bucket=portfolio-public`, MIME de imagem permitido e caminho válido. Arquivos privados e rascunhos não podem ser referenciados pelo site público. Primeiro envie e publique na aba **Mídia**, depois escolha em **Blocos**. A descrição alternativa é preenchida com o `alt_text` cadastrado na biblioteca; revise-a no contexto da seção antes de salvar. A ação **Remover imagem** limpa a associação no formulário e exige salvar o bloco; na foto desktop da seção Olá!, valor vazio preserva o fallback local `/media/tulius-contact.jpg`.

Referências antigas HTTPS ou `/media/` continuam exibidas/preservadas no formulário mesmo que não constem da biblioteca; não são apagadas automaticamente. Não foram alterados os registros de `media_assets`, os arquivos de Storage, as políticas RLS, nem as demais partes do CMS. Login, gravação e escolha visual com JWT administrativo real exigem homologação humana separada.


## Seletor de imagem em todos os formulários aplicáveis (26/10/2026)

Foi feita a inspeção dos formulários de `AdminApp.tsx` e `AdminModules.tsx`. A única referência de **imagem** ainda editável como texto livre fora de **Blocos e painéis** era **SEO → Imagem Open Graph** (`site_settings.seo_json.ogImage`). Esse campo passou a usar o componente visual `PublishedMediaPicker`, com busca, miniatura, remoção e seleção de mídias publicadas.

A alteração de `ogImage` preserva as demais propriedades de `seo_json`, inclusive `canonical` e `robots`. É gravada somente pelo botão **Salvar SEO**, pela RPC existente `save_home_seo_atomic`. Os metadados embutidos no HTML e nas prévias sociais são regenerados no **próximo build/deploy**; mudar o banco não altera imediatamente o HTML já entregue ao visitante.

Inventário de campos com seletor: `content_json.items[].image`, `content_json.items[].aboutDesktopImage`, `content_json.experienceMedia.logo`, `content_json.experienceMedia.slides[].image`, e `site_settings.seo_json.ogImage`. A Biblioteca de mídia propriamente dita administra objetos, prévias, upload e metadados, não vínculos de imagem em páginas. **Coleções** não expõe campo de imagem editável no formulário atual. URLs genéricas, endereços de contato, `canonical`, cores e seletores de ícones continuam sendo controles apropriados aos seus tipos — não imagens.

Não foram alterados imagens existentes, conteúdo editorial, banco de dados, Auth, Storage ou RLS. A sessão administrativa com JWT real e a prévia real de redes sociais continuam condições separadas de aceite.

## Revisão manual de conteúdo — 28/10/2026

**Blocos e painéis → experiências:** cada item possui a opção **Exibir este item em Projetos e realizações**. Quando desmarcada, o CMS destaca **Ocultado**; o conteúdo não é apagado do JSONB e pode ser reexibido com a mesma opção. A referência inicial é Vale, com seis itens visíveis por empregador sempre que existirem seis.

**Coleções → Depoimentos:** esta é a fonte pública autoritativa para os cinco cartões. Dois registros de demonstração são identificados como fictícios; evitar tratá-los como endossos reais. Os blocos em Depoimentos guardam conteúdo manual original, mas têm vínculo com `testimonials` (painel A: início 0, quantidade 2; painel B: início 2, restantes). Alterações publicadas na coleção são refletidas sem duplicação editorial; o painel B contém novos depoimentos conforme a ordem. Os cartões expandidos são controlados pelo visitante e não alteram o CMS.

**Contato:** o texto de rodapé provém de `sections.intro` e do campo Texto do primeiro item do painel A; fotografia e URLs são editáveis nos blocos existentes. **Menu:** usar o módulo Navegação para ajustar rótulos ou reexibir links individuais dos empregadores sem editar as seções.

## Revisão manual — comportamento dos módulos (28/10/2026)

**Seções:** as listas traduzem `draft` para **Rascunho**, `in_review` para **Em revisão**, `published` para **Publicado** e `archived` para **Arquivado**; os valores persistidos e as restrições de banco permanecem em inglês. `Salvar alterações` altera textos/tema/visibilidade/ordem editorial válida, mas não permite publicar rascunhos ou arquivar diretamente pelo combo: usar os botões específicos. **Publicar seção** solicita confirmação, chama `publish_section` e bloqueia placeholders. **Arquivar** solicita confirmação, marca `archived` e `is_visible=false`. **Exibir no site** continua em `sections.is_visible`, utilizado nas consultas públicas e no menu. Seções especiais têm layout/motion fixos visíveis como controles desabilitados, evitando prometer uma opção não renderizada. Em seções genéricas são utilizadas classes `layout-*`, `theme-*` e `motion-*`; temas de empregadores respeitam as classes públicas.

**Feedback transversal:** `AdminNotice` exibe toast acessível (duração 7 s, botão fechar) para operações de Seções, Blocos, Coleções, Identidade, Mídia, Navegação, SEO e Revisões; estados de salvamento distintos permitem múltiplas operações seguidas. Mensagens Supabase são exibidas sem afirmar sucesso quando o backend retorna erro. Fluxos e endpoints inspecionados: Seções (`sections.update`, `publish_section`, `duplicate_section`, `create_section_with_panels`, `swap_section_order`), Blocos (`save_content_block_atomic`), Coleções (`upsert/insert/update`), Identidade (`design_tokens.upsert`), Mídia (`media_assets`, buckets privado/público), Navegação (`navigation_items.upsert`), SEO (`save_home_seo_atomic`), Revisões (`editorial_issues.update`); Prévia permanece isolada por autenticação.

**Biblioteca de mídia:** primeiro nível é uma grade de **miniatura + nome do arquivo com extensão**. Clicar abre um único editor do arquivo (nome somente leitura, alt, status e ações); clicar de novo ou fechar recolhe. Campo Crédito/licença não aparece mais e não entra nas operações de gravação. A coluna antiga do PostgreSQL e seus 19 valores históricos não foram apagados. Os títulos de 21 registros da coleção `media_assets` foram sincronizados com o nome final de `storage_path` (somente texto); novos uploads/substituições seguem esse padrão.

**Seletores de mídia em Blocos:** orientações indicam dimensões e proporções de referência antes da escolha; botão **Ajustar posição e zoom** abre janela com controles X/Y (0–100%), zoom (100–300%) e prévia do recorte. **Aplicar ao formulário** só altera o rascunho em memória; **Salvar bloco** persiste JSONB, sem editar o arquivo original. O cancelamento/fechamento da janela não grava o enquadramento. Campos contemplados: imagem do item, imagem desktop da seção Olá!, logomarca e slides de experiência. O seletor SEO orienta 1200×630 px, mas não aplica crop HTML/CSS a uma mídia de compartilhamento de terceiros: prepare os pixels do próprio arquivo se desejar recorte OG.

**Homologação real ainda aberta:** não executar CRUD transacional com JWT administrativo em produção só para teste. Confirmação funcional de upload/download, autorização de gravação, RPCs, RLS e restauração depende de reabrir P2 com ambiente seguro e autorização expressa. A verificação estática e testes automatizados não são prova dessas mutações.

### Evidências da auditoria administrativa integral — 28/10/2026

[Relatório por aba](../AUDITORIA_ADMIN_MANUAL_2026-10-28.md): auditoria de código de dez áreas, sem mutações P2. CI #40776321190 aprovado; auditoria pública P3 #40776111312 aprovada; 21/21 títulos de mídia sincronizados com nome de arquivo no Supabase e 19 créditos históricos preservados sem uso. O LCP mobile e o teste real de gravação do CMS permanecem pendentes.

## Ajustes técnicos de baixo risco após o aceite manual — 28/10/2026

- **Visão geral CMS:** substituída a frase fixa das 14 seções/2 distribuições por contagem dinâmica de seções visíveis e cadastradas, e contador das `editorial_issues` efetivamente abertas. Não houve alteração de registros.
- **Depoimentos:** grade desktop passa a ter duas linhas uniformes e cartões quadrados, com expansão ocupando duas linhas. No mobile mantém-se uma coluna fluida. Textos e cinco registros publicados preservados.
- **Janela X/Y/zoom:** o diálogo agora recebe foco inicial, retém Tab/Shift+Tab, permite Escape e devolve o foco ao controle anterior ao fechar; o arquivo original e configurações preexistentes continuam intocados.
- **Carregamento público:** a consulta de depoimentos, única coleção atualmente vinculada no Supabase público, é iniciada em paralelo à consulta da estrutura de seções. Isso remove uma etapa sequencial de rede no carregamento inicial; não constitui por si só comprovação de LCP ≤2,5 s.
- **Aceite humano:** declarado concluído pelo proprietário nesta conversa. P2, direitos de mídias, riscos de segurança anteriormente aceitos, exclusões de Storage/branches, 8 ocorrências editoriais e reconciliação de Fontes ChatGPT seguem como decisões separadas.

## Menu público sem grupos — compactação final (29/10/2026)

**Solicitação do proprietário:** manter as oito opções integralmente visíveis, evitando rolagem vertical nas alturas usuais; remover da navegação pública os subtítulos `PERFIL`, `EXPERIÊNCIA`, `REFERÊNCIAS` e a assinatura `Comunicação · Estratégia · Reputação`. Não modificar nomes, ordem, numeração nem âncoras dos oito links.

**Implementação:** `src/components/public/Navigation.tsx` não renderiza títulos de grupo nem a assinatura estática. `src/index.css` usa espaçamento compacto e linhas com `grid-auto-rows: clamp(44px, 9dvh, 72px)`; todos os alvos têm altura mínima de 44 px. A rolagem permanece apenas como fallback para zoom de acessibilidade, excesso futuro de itens ou viewport excepcionalmente baixo. Menu responsivo sem `zoom` CSS ou mudanças na identidade visual.

**Admin:** `NavigationStudio` remove o campo de grupos, mantém rótulo, âncora, status, visibilidade, reordenação e salvar. Novos registros e gravações posteriores usam `group_name='Menu'` por compatibilidade com a coluna existente. **Supabase:** os 14 registros da tabela `public.navigation_items` foram atualizados apenas no campo `group_name` de Perfil/Experiência/Referências para `Menu`, transação com guardas de 14 totais e 8 visíveis. Conferência após atualização: **14 registrados, 8 visíveis, 6 ocultos, grupo único Menu**. Sem DDL, alterações RLS, exclusões, mudança de textos/âncoras, custos ou migrações; a frase final era hardcoded, não existia em `site_settings`.

**Evidência:** commit funcional [`bfd3f7e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bfd3f7e25b03dc6fa0e647f44eb1f3bb92905f96) com formatação no [`0e06df6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0e06df6c031e01da3bf9453f8a6246d1f80409b1), [CI #40810591049](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810591049) **success** e [P3 #40810488285](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810488285) **success**. Teste `P3_MENU_FIT_MOBILE` em **390×844**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=844`, último link até y=662,09. Teste `P3_MENU_FIT_DESKTOP` em **1512×691**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=691`, último link até y=573,58. P3: **0 falhas**, 13 seções, 25 painéis mobile, 38 capturas, P5 anônimo 3/3, zero mutações. Mobile Lighthouse Performance 82, LCP **4,44 s**, meta ≤2,5 s ainda aberta; desktop LCP **1,18 s**.

**Prevenção:** os testes P3 agora verificam número de links, ausência de grupos/rodapé, ausência de rolagem interna e visibilidade do último link, além de foco e Escape. A frente de P2 transacional segue suspensa; não equiparar o teste de leitura pública à homologação de escrita CMS com JWT real.

## Biblioteca de Mídia — editor no item e status editorial único (29/10/2026)

**Escopo autorizado:** a Biblioteca de Mídia do CMS agora substitui a miniatura clicada por um editor **na mesma posição da grade** (largura de duas colunas com reflow responsivo); o editor não é mais montado no final da página. Botão de fechamento **X** com rótulo acessível. Foi removido **apenas o controle de entrada “Texto alternativo”**; os metadados antigos `alt_text` permanecem no banco, e a prévia do admin continua a usá-los quando existentes, com fallback para o nome do arquivo. Fotos e componentes públicos conservam seus `alt` próprios.

**Status:** a única opção editorial no admin é **Publicado**; a interface não oferece mais o seletor Rascunho/Em revisão/Arquivado. Em upload e substituição, o registro `media_assets.status` é gravado como `published`, mas o arquivo novo/substituído continua inicialmente em `portfolio-private` **até o usuário acionar “Disponibilizar no site”**. Esse controle continua usando a cópia segura Storage→Storage já existente, com rollback quando os metadados não persistem, sem sobrescrever um arquivo público diretamente. Arquivos públicos continuam sem substituição direta para não expor rascunhos. O botão **Salvar** preserva `alt_text`, `storage_path` e outros metadados não editados.

**Banco no encerramento desta atualização:** após identificar uploads concorrentes ocorridos durante a inspeção, a atualização guardada e não destrutiva foi concluída com **27 registros `published`** (**24** em `portfolio-public` e **3** em `portfolio-private`); **21 textos alternativos não vazios preservados**. O primeiro plano SQL foi abortado antes da gravação ao detectar 25→27 registros. RLS vigente `public media metadata` exige `status='published' AND storage_bucket='portfolio-public'` para leitura anônima; `PublishedMediaPicker` aplica ambos os filtros, portanto a unificação de status não expõe mídias privadas. A nova prova unitária `media-publication.test.ts` verifica esse filtro. Nenhum arquivo foi excluído ou copiado, nenhum bucket foi aberto e nenhuma política de RLS foi alterada. **Publicado é status editorial, não afirmação de disponibilidade pública de mídia privada.**

**Código:** [`6c5e3e0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/6c5e3e0f8991d825652844decbd482b86892457b), formatado em [`c9cb3de`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c9cb3dee73fadd11fc1a7bae86a78e8a89e039fb). [CI #40812587748](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812587748) `success`. [P3 #40812459767](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812459767) validou 13 seções, 25 painéis mobile, 38 capturas, zero falhas de browser e P5 público 3/3; **o gate Lighthouse P6 falhou** por LCP mobile instável (~7,68 s) e ausência de correspondência do retrato na amostra. Nova execução solicitada; **não considerar o P3 aprovado até confirmação**. A homologação de gravações com JWT administrativo real permanece suspensa conforme P2, de modo que o fluxo de upload/publicação não deve ser declarado homologado ponta a ponta.

### Verificação complementar do desempenho — 29/10/2026

A repetição da [auditoria P3 #40812459767](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812459767) concluiu com **failure apenas no orçamento Lighthouse P6**; as verificações de rotas e responsividade permaneceram aprovadas (`P3_BROWSER_AUDIT failures=0`, 13 seções, 25 painéis, 38 capturas, P5 anônimo 3/3). Mediana mobile **LCP 8,455 s, Performance 69**; desktop **LCP 1,685 s, Performance 93**; o gate de retrato esperado como LCP não conseguiu confirmar o elemento em nenhuma das duas categorias. Uma execução anterior do mesmo código havia registrado LCP mobile ~7,680 s e também falhou no P6. **Não declarar aceite de desempenho; a meta ≤2,5 s e a investigação da variância permanecem abertas.** O teste funcional do site público não indica perda de seções, mídias ou RLS; ainda não há evidência causal relacionando a piora sintética às alterações exclusivamente administrativas. Homologação de escrita autenticada do CMS segue suspensa (P2).

## Verificação manual — Olá! e Invest RS, 29/10/2026

- **Seção 02 “Olá!” (somente desktop):** para que a silhueta da fotografia personalizada alcance a margem inferior do painel, `src/index.css` compensou a faixa transparente inferior da imagem com altura `calc(100% + clamp(2rem, 5.5dvh, 3rem))`, posicionada no topo e recortada pelo contêiner existente. Mantidos fonte original no Supabase, enquadramento do CMS, colunas, textos, cor laranja e composição mobile. Sem zoom/scale global.
- **Logos das experiências:** a borda e o preenchimento cinza foram retirados somente de `.experience-heading > .company-mark` (logo acima do título da empresa). Os seis ícones do seletor superior mantêm bordas, tamanho, links e navegação.
- **Invest RS:** de oito itens cadastrados, ficam **quatro visíveis** (Competências aplicadas; Guia de Boas-Vindas; Organização de eventos; Plataforma de eventos e relacionamento) e **quatro marcados `isHidden=true`** (Estratégia de CRM e mailing institucional; Cartões de visita digitais; Conteúdo e apresentações institucionais; Inovação, IA e automação). Os dois últimos já estavam ocultos. Nenhum texto, registro, bloco ou slide foi excluído ou alterado. A alteração foi transacionada no JSONB do bloco B `222cc514-c860-4ec4-bc01-40a9084dc2e9` com guardas de título e estado anterior, e conferida em leitura posterior. O painel **Blocos** continua com a opção “Exibir este item em Projetos e realizações” e indica “Ocultado”. O conteúdo de fallback foi alinhado com a publicação; outras cinco empresas mantidas.
- **Critério de regressão:** `scripts/p3-browser-smoke.mjs` ganhou `P3_ABOUT_INVEST_FIT` para 1512×691, zoom nativo: altura/recorte da foto desktop, borda inexistente do logo grande, borda preservada na navegação superior, exatamente quatro projetos Invest RS e ausência de scroll interno. Aferir junto à auditoria P3; teste automatizado não substitui inspeção visual real.

**Commit funcional:** [`d882d7a`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d882d7a71ff45e0d6980cf85fbcaa6533f0f89db). [CI #40815457072](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457072) `success`, Vercel Production `READY`; [P3 #40815457107](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457107) em execução na criação deste registro. P2 transacional continua suspenso e LCP mobile ≤2,5s permanece pendente. Não houve custo adicional, mudança de RLS, Storage, arquivo de mídia ou estrutura do banco.



## Editor do Site unificado — 30/10/2026

A navegação administrativa reúne **Seções, Blocos e Coleções** em **Editor do site**. A escolha de uma seção permanece visível enquanto o editor alterna entre **Conteúdo e painéis**, **Informações da seção**, **Acervo estruturado** e **Prévia**.

A integração é de **interface, não de banco**: `sections`, `content_blocks`, `block_placements` e coleções continuam com seus contratos atuais. O salvamento da seção, a RPC `save_content_block_atomic`, as operações de coleções e a publicação via `publish_section` mantêm ações próprias. Não há botão “salvar tudo” nem nova transação cruzando essas fontes.

**Origem dos dados:** cada bloco informa se usa itens manuais ou a `source_collection` explícita. Se vinculado, há acesso direto ao editor da coleção correspondente. O Acervo também oferece acesso a todas as coleções; editar um registro não cria associação com seções automaticamente. Os itens manuais preservados sob um vínculo não são reescritos pela interface integrada.

**Proteções:** ao mudar seção, área, registro, bloco ou sair do Editor com campos alterados, a interface solicita confirmação antes de descartá-los; o navegador também avisa ao sair com alterações pendentes. Controles técnicos de tipo, origem, placements e animação permanecem acessíveis em **Configurações avançadas**, sem alteração de valores existentes. A prévia protegida usa `/admin/preview#slug` e reflete dados **já persistidos**, não mudanças ainda abertas no formulário.

**Limite de validação:** integração visual e regressões verificáveis por CI/P3; não confundir com homologação de CRUD, publicação, restauração ou Storage com JWT real do P2 transacional suspenso. Não houve alteração planejada de schema, políticas, mídia, dados, layout do site público ou configuração Vercel.

**Evidência de implementação (30/10/2026):** SHA funcional [`bc4f3ca`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bc4f3cadc3de8751039954e46b1c19ef05c406a2), [CI #41134897178](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41134897178) `success` e [Vercel READY](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/H4bkM8rzZRMt89icqwog3VfinDzJ) no mesmo SHA. [P3 público #41134316506](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41134316506) comprovou 13/25/38 e P5 anônimo 3/3, mas falhou em LCP mobile P6 (~7,54 s), pendência anterior independente. A UI de escrita do CMS não foi ensaiada com JWT real.

## Ajustes de itens e controles de mídia — 30/10/2026

Em **Editor do site → Conteúdo e painéis**, cada `content_json.items[]` inicia recolhido, com um único item expansível por vez. O cabeçalho preserva número, título, marca de item oculto e controles de ordem/remoção. Criar um item expande o novo, e a seleção acompanha reordenações/exclusões. A lógica é isolada em `src/lib/admin-item-expansion.ts` e coberta por `src/lib/admin-item-expansion.test.ts`.

Os campos **Valor/métrica** e **Metadado/URL** receberam pequenas ajudas acessíveis; a descrição contextual é exibida ao passar o mouse ou clicar (também operável por teclado). O seletor **Imagem do item** mostra a recomendação de proporção/dimensão em ajuda, sem texto de orientação sempre visível. Para Perfil e Contato, a mensagem é **“Área de destino: Retrato vertical 3:4; sugestão 900 × 1200 px.”**. As ações **Escolher da biblioteca**, **Ajustar posição e zoom** e **Remover imagem** usam apenas ícones neste seletor específico, com `aria-label` e `title` preservando o significado; outros `PublishedMediaPicker` não foram modificados visualmente. O campo **Texto alternativo** recebe alinhamento independente do tamanho da prévia.

**Evidências:** [commit funcional `0c2abd0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0c2abd042b1050ec1db5899c13438a9fb367101f), [CI Validate #41136712312](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41136712312) `success`, [Vercel READY no mesmo SHA](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/UN2YUd9uz1QxXWL1nCARrJinKFkP). Os componentes públicos e os dados não foram alterados. A inspeção autenticada de UI e a homologação transacional P2 não foram executadas.

## Agrupamento de Experiências Profissionais — 30/10/2026

Na área **Editor do Site**, o menu de seções apresenta uma única opção **Experiências Profissionais** na posição da primeira das seis experiências. Ela substitui **somente na navegação do CMS** as entradas individuais de Invest RS, Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress e CDI Comunicação. A área aberta apresenta uma grade com todos os seis trabalhos e permite escolher qual editar, com destaque de seleção e confirmação quando há alterações pendentes. As abas Conteúdo e painéis, Informações da seção, Acervo estruturado e Prévia continuam operando com o ID real da seção individual. Nenhum vínculo, slug, ordem, visibilidade, dado, JSONB ou painel público foi reestruturado.

Código: `src/components/admin/AdminApp.tsx` e `src/lib/admin-experience-navigation.ts`, com testes em `src/lib/admin-experience-navigation.test.ts`. [SHA funcional `05a4cf1`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/05a4cf1f27962d1df24fbf4cd53aceb0192955a6) · [CI #41137954207 success](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41137954207) · [Vercel READY no mesmo SHA](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/EQ5dA4FFMrt9dJqvB5nrxuHjG3ri). Ainda não houve navegação manual autenticada nem homologação P2 de escrita com JWT real.

## Editor administrativo — confirmações padronizadas e acervo corrigido (30/10/2026)

**Código funcional:** [`120e681`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/120e681ec66fdd39596fbc7ba4a4efa81d341b42). [CI Validate #41139782822](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41139782822) **success**, com formatação, TypeScript, testes unitários, build de produção e smoke offline. [Vercel Production](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/4kMTvrv5sVDJoP8kaUQLEVQmBZUo) **READY** no mesmo SHA funcional.

**Diálogos:** no CMS, chamadas nativas a `confirm()` foram substituídas por `adminConfirm()`, renderizado por `AdminConfirmationHost` como diálogo de marca, foco gerenciado, navegação por Tab e Escape para cancelar. Cobertura: alternância entre seção, área, bloco, fonte e registro; descarte de alterações; criação/duplicação de seção, arquivamento e publicação; exclusão de itens/slides; promoção de mídia; restauração de revisões; saída do painel e retorno ao site. Um teste estático `admin-dialog-policy.test.ts` impede `confirm/alert/prompt/beforeunload` nativos em componentes administrativos. O listener `beforeunload` foi removido: **fechar/recarregar a aba não é interceptável por um diálogo próprio**, portanto rascunhos de formulário não salvos podem ser perdidos nessa circunstância. Transições internas têm guarda personalizada. Os avisos `AdminNotice` seguem como toasts padronizados de erro, sucesso, alerta ou informação, com `role=alert` para erros.

**Acervo:** os registros não pertencentes a `tool_categories` não recebem mais o campo virtual `tools_text`; o payload também exclui sempre `tools_text`, `id` e `updated_at`, preservando `tools` estruturado em Ferramentas conforme a implementação anterior. Testes de regressão cobrem esses casos. O Editor mostra fontes `source_collection` explícitas ligadas aos blocos da seção, mantendo o Acervo global para coleções sem relação específica; somente `metrics` é consultada por `section_id` ao editar a seção. A prévia protegida ganhou alternância de largura desktop/mobile (simulação, não substitui teste real). O seletor de tipo de bloco apresenta rótulos editoriais, mantendo os valores gravados.

**Invariantes/limites:** sem migration, SQL de mutação, alterações em RLS/Auth/Storage, gravações em dados aprovados ou edição de componentes públicos. Os testes aprovam código e lógica auxiliar, **não homologam gravação administrativa transacional (P2 suspenso)** nem inspeção manual visual/autenticada dos novos diálogos. LCP mobile P3-PERF-01 segue aberto e independente.


## Responsividade mobile do CMS e conclusão do aceite — 30/10/2026

O proprietário informou que a verificação manual anterior foi realizada. O CMS mantém seus fluxos existentes, agora com uma navegação superior horizontal em viewport ≤1100px em vez de sidebar fixa. Em ≤767px, edição de seções, formulários e controles passam a uma coluna; mídia e detalhes são apresentados em 2/1 colunas, conforme espaço, e botões/diálogos alcançam ao menos 44px de toque. As proteções de conteúdo não salvo e o diálogo de marca permanecem. Controles na entrada de formulários usam 16px em iOS para evitar ampliação automática. As regras são exclusivamente administrativas, não alteram os 25 painéis públicos.

**Evidência:** [SHA `f2f8e4f`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/f2f8e4fe7a54e371a96ceff546b711ca5b0bcd19), [CI #41140863031](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41140863031) aprovado, Vercel READY no mesmo código. Teste `admin-mobile-layout.test.ts` inspeciona o contrato de estilo; não constitui teste visual com sessão real de admin. P2 permanece suspenso, sem testes de escrita.


## Editor padronizado (31/10/2026)

Campos de texto alternativo são opcionais em todo o conteúdo editável; seus valores existentes e os dados `editorial_note` são preservados. A interface não apresenta mais controles `Nota editorial`. Em **Olá!** uma única área de imagem oferece troca de destino **Mobile/Desktop** com URLs e enquadramentos independentes sem duplicação visual. Os controles de mídia usam ícones sem texto por padrão.

A **biblioteca visual de 50 ícones**, dividida em Resultados, Comunicação, Trabalho e estratégia, Digital e Plataformas, substitui listas textuais nos campos de indicador e ferramentas. As células são pictogramas acessíveis por `aria-label` e seleção por `aria-pressed`; Ferramentas permite três escolhas.

O botão **Salvar flutuante** está disponível nos formulários editáveis (Seções, Blocos, Coleções, Navegação, SEO e Identidade) e fica desabilitado enquanto não há alterações. Na navegação interna com alterações abertas há diálogo próprio; refresh/fechar aba exige diálogo fornecido pelo navegador. Revisões e mídia têm ações específicas (restaurar, disponibilizar, fazer upload), não salvamento geral. Testes automatizados aprovados em [CI #41170233909](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41170233909); confirmação manual de edição/salvamento após esta rodada ainda necessária, sem homologação P2 transacional.


## Verificação autenticada mobile sem gravações — 31/10/2026

O [P5 Admin Read-Only #41172037326](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172037326) passou no código de produção, conferindo 8 módulos, biblioteca com 50 botões de ícone acessíveis, editor com viewport 390×844 sem overflow horizontal, Salvar desativado até editar e ativado ao mudar campo, abandono protegido por diálogo próprio com cancelamento que preserva o rascunho, campo alt opcional, prévia de 14 seções, logout e bloqueio do acesso sem sessão. `contentMutations=0`. Alterações de campos foram apenas locais, sem submit nem operações de banco. POST de assinatura de prévia privada é operação de leitura; o detector distingue a rota `/storage/v1/object/sign/` de escrita real.

Permanece pendente a conferência visual manual em aparelho físico; fluxos reais de CRUD/Storage continuam suspensos no P2. [CI #41172037322](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172037322) e Vercel READY no SHA `e3c85c2`.


## Rodada de mídia e controles — 05/11/2026 (posterior ao encerramento)

O upload novo usa `uploadPublishedMedia` no bucket público; a exclusão confirmada pelo **X** usa a RPC transacional `delete_media_asset_everywhere` e depois remove bytes do Storage, com falhas independentes explicitadas. O modal preserva o enquadramento e o campo alternativo tem borda reforçada. Navegação salva status `published` sem seletor e com **Novo item** inativo. Editor de Seção mostra situação “Publicado/Oculto” sem combo, e Tema/Transições têm ícones de informação. Transições de entrada são aplicadas ao ingressar no viewport com respeito a `prefers-reduced-motion`. [Matriz de evidências](../RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md#4-nova-solicitação-posterior--mídia-navegação-seo-e-edição-05112026).

**Limites:** não há evidência de upload/exclusão real em sessão admin; conteúdos antigos permanecem. O canonical de produção é `https://tulius.work/`, não o domínio `tuliust.work` não vinculado à Vercel. SEO estático só reflete edições do CMS no próximo deploy.
