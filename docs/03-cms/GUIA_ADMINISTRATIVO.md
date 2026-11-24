# Guia operacional do CMS

## Upload administrativo de vídeos — 24/11/2026

No caminho **Editor do site → Experiências Profissionais → Projetos**, a ficha de cada empresa oferece o seletor Imagem/Vídeo na galeria: envio exclusivo de MP4 (até 50 MB), capa opcional, prévia nativa e remoção apenas do vínculo. Não há campo de URL externa. O objeto enviado é público imediatamente; salvar a ficha confirma a associação via RPC/CAS. Substituir ou remover o vínculo preserva o arquivo anterior. A biblioteca exibe vídeos com player, mas bloqueia exclusão física de vídeo até existir contrato de remoção seguro. Validação sintética de upload e persistência concluída; aceite visual autenticado de produção ainda não executado.

## Hierarquia visual do editor de projetos das Experiências — 23/11/2026

No caminho **Editor do site → Experiências Profissionais → Projetos**, o cabeçalho interno **Projetos e realizações** usa o título display secundário (caixa alta), menor que o cabeçalho de área **PROJETOS**. O texto de apoio e a contagem de publicações ficam em tipografia auxiliar compacta; as fichas de projetos exibem o título forte com a indicação **Centro / Slide / Oculto** em uma segunda linha menor. Os três grupos são identificados por legendas pequenas, semibold/uppercase na cor de realce, com separadores discretos: **Onde exibir este projeto?**, **Área central · Projetos e realizações** e **Área direita · Slide do projeto**.

Labels, inputs, textareas, placeholders e nota inferior usam a mesma escala editorial do restante do painel. Os campos vazios exibem orientação por placeholder, sem substituir valores existentes; campos de seleção, ordem, foco de teclado e alvos móveis são preservados. Todo o estilo é restrito à classe `experience-projects-editor` em `src/index.css`; a área pública, os dados, o Supabase e os demais editores não são alterados.

## Limpeza produtiva e estado das seis Experiências — 23/11/2026

**EXECUTADO E RELIDO NO SUPABASE:** foram excluídos apenas os **23 itens históricos com `isHidden=true`** dos arrays legados dos blocos A/B e os **2 slides sem vínculo inequívoco da Invest RS**. As seis empresas têm agora **5 fichas canônicas cada (30 projetos)** e **17 slides vinculados**: Invest RS 2, as demais 3. O conteúdo de `content_json.experienceProjects` do bloco A é agora a fonte pública dos campos e flags; as cópias legadas dos projetos *visíveis* foram mantidas para compatibilidade. Não há mais seções de itens históricos ocultos ou de slides órfãos no painel. Nenhum objeto de Storage nem registro da biblioteca de mídia foi excluído. Competências e Trajetória permanecem nas fontes anteriores.

A operação foi **atômica**, com verificação dos hashes dos 12 blocos antes da gravação e contagens finais exigidas de 30/17/23/2 (projetos/slides/itens legados eliminados/slides órfãos eliminados). Cópia privada dos **25 registros editoriais removidos** foi preservada fora do GitHub; restauração não ensaiada. A limpeza dos históricos **não se aplica** às fichas atuais: ao desmarcar as duas opções, o projeto continua armazenado e pode ser reativado.

## Experiências — edição integrada do centro e dos slides (23/11/2026)

**Caminho:** Editor do site → Experiências Profissionais → empresa → **Projetos**. Cada ficha contém **Título central** e **Descrição central** para a coluna do meio, mais **Título do slide**, **Descrição do slide** e **Imagem do slide** para a galeria à direita, incluindo alt, enquadramento e ordem. Os títulos e as descrições das duas áreas são independentes.

Existem dois controles: **Exibir na área central** e **Exibir nos slides da direita**. Ambos marcados publicam nos dois lugares; somente um marcado publica apenas nesse destino; ambos desmarcados ocultam a ficha do site sem eliminá-la do painel. Um slide publicado exige título, descrição e imagem segura; um item central publicado exige título e descrição. A galeria pode ficar vazia. Excluir projeto exige confirmação e só efetiva a mudança ao salvar; não exclui arquivos da biblioteca de mídia.

Não há mais seções **Slides históricos sem vínculo seguro** ou **Itens históricos ocultos**. O fallback de experiências ainda não convertidas gera fichas apenas de itens visíveis e slides com correspondência textual inequívoca. A remoção física dos registros legados do JSONB ocorre como operação controlada distinta. Não confundir os itens históricos descartados com fichas que o editor passar a ocultar usando os dois controles.

Na página pública, o slide ativo seleciona o cartão central pelo ID estável, quando esse cartão estiver visível. A troca automática acontece a cada **3 s**; depois de clicar em projeto/seta/marcador, a próxima troca é após **8 s**, e então retorna a 3 s. Pausa em aba oculta, empresa inativa, preferência por movimento reduzido ou galeria com menos de dois slides.

## Experiências — editor único de projetos e imagens (22/11/2026)

Em **Editor do site → Experiências Profissionais → empresa → Projetos**, cada ficha reúne título, descrição, visibilidade, fotografia, legenda e participação na galeria. **Empresa** mantém logotipo, competências e Trajetória. A lista central e a galeria usam o mesmo título após a gravação da coleção canônica. Projetos sem imagem são admitidos.

**Compatibilidade:** se `content_blocks.content_json.experienceProjects` não existir no bloco A, a tela compõe um rascunho não destrutivo a partir dos blocos A/B e da galeria anterior. O primeiro salvamento cria a coleção no JSONB de A, usando `save_section_block_atomic` com CAS e releitura. Os campos históricos de A/B e a galeria original **não são excluídos**. Não há conversão automática de dados produtivos por deploy.

**Slides ambíguos:** só há associação automática para título único e projeto visível. Os demais ficam em “Slides históricos sem vínculo seguro”, com título, mídia e legenda preservados até a vinculação explícita. ID estável vincula projeto e galeria após a escolha. A ocultação de um slide não apaga seu arquivo. Mudanças não confirmadas pela releitura não devem ser reenviadas automaticamente.

## Logotipo opcional das Experiências — 18/11/2026

No **Editor do site → Experiências Profissionais → empresa → bloco A**, o campo **Logotipo da empresa** persiste a URL em `content_blocks.content_json.experienceMedia.logo`. O texto alternativo (`logoAlt`) continua opcional no editor e no catálogo: sua ausência **não** impede a exibição do arquivo na barra das empresas e no cabeçalho desktop. O renderer `CompanyMark` usa a existência de `logo` como condição para `<img>` e, quando `logoAlt` não está informado, renderiza `alt=""` porque o nome da empresa já aparece em texto adjacente; quando existe alt, preserva-o. Na ausência de URL, exibe o monograma. O seletor ainda copia título/alt no instante da escolha, sem tornar alt obrigatório. Regressão coberta em `src/components/public/ExperienceStack.test.tsx`. Intervenção somente em React e documentação; sem gravação de CMS, Storage ou schema.


## Fluxo de exportação PDF homologado — 18/11/2026

No módulo **Exportar PDF**, após a prévia estar pronta, **Gerar PDF** imprime a versão Desktop diretamente no iframe de referência **1440 px**. No **Mobile**, abre aba dedicada com referência **390 px**. No Chrome, escolher **Salvar como PDF**, margens nenhuma, gráficos de fundo ativados e cabeçalhos/rodapés desativados. O proprietário **aceitou visualmente ambos os PDFs reais** após as correções da regressão. Ver [guia canônico PDF](../05-operacao/EXPORTACAO_PDF.md) para ordem das folhas, resolução e testes.

Esse aceite não equivale a teste autenticado integral de **editar → salvar → reler** os 20 indicadores do CMS; as restrições de escrita e o guard de mídia continuam inalterados.

---

**Status:** contrato administrativo vigente · **Revisão:** 18/11/2026. Resultados e Experiências revisados no CMS; aceite editorial do proprietário concluído. A gravação autenticada integral editar→salvar→reler **não foi executada** neste ciclo e não pode ser inferida do aceite ou da leitura pública.

## Resultados — operação vigente do editor (16/11/2026)

**Editor do site → Resultados e projetos em destaque:** `Centro` (bloco A) é a **fonte única dos 20 indicadores**; `Direita` (bloco B) reúne **cinco categorias**. O editor do bloco A permite **Adicionar indicador**, editar valor/título/descrição/ícone, ordenar, marcar os temas vinculados por `relatedThemeKeys`, escolher **Exibir também na visão geral** (`showInOverview`) e definir **Ordem na visão geral** (`overviewOrder`). Quatro indicadores permanecem na visão geral, independentemente da ordem temática. Propriedade `showInOverview` ausente mantém a visibilidade legada do item.

Cada categoria do bloco B tem `themeKey` estável e o seletor **Apresentação da categoria**: `editorial` (legado) ou `metrics` (compacta). Em `metrics`, aparecem **eixo, título, subtítulo e quatro indicadores**, preservando no CMS os campos antigos `themeTopics`, `themeSummary` e `inheritedHighlights` sem renderizá-los. Em produção, todas as cinco categorias usam `metrics`; Comunicação Corporativa tem eixo “Estratégia e Reputação” e título “Comunicação que conecta”.

**Persistência e limites:** o Centro e a Direita são dois blocos independentes, salvos separadamente pela RPC/CAS administrativa `save_section_block_atomic`, sem transação única entre ambos. A carga inicial dos dois JSONB foi feita por **SQL restrito com guardas de versão e releitura**, não por salvamento autenticado no painel. No SHA intermediário `cb953dad`, P5 read-only e P5 sintético foram **SUCCESS**; no último SHA funcional `9915964`, a auditoria pública P3 foi **SUCCESS**, mas não foi demonstrado um teste integral autenticado de editar→salvar→reler os 20 itens nesse SHA. Não duplicar itens no B ou executar CRUD de testes em produção.

[Modelo de dados](MODELO_DE_DADOS.md) · [Arquitetura](../01-projeto/ARQUITETURA.md) · [Homologação por SHA](../05-operacao/TESTES_E_HOMOLOGACAO.md).

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

1. **Editor do site → Perfil → Esquerda → Apresentação:** `Tamanho da frase no desktop (px)` está em **18** (valor vigente após revisão posterior em 13/11/2026). Esse controle atualiza `items[0].hero.desktop.introSize` do bloco A. A frase e o retrato permanecem no conteúdo original.
2. **Perfil → Esquerda → Itens de Destaque:** abrir cada uma das quatro entradas; o grupo **Tipografia e espaçamento · desktop** contém **Título desktop (13 px)**, **Descrição desktop (15 px)** e **Espaçamento desktop (10 px)**, armazenados em `items[1..4].desktop` no mesmo bloco A.
3. **Perfil → Direita → Área de Destaques:** abrir cada empresa (Invest RS, Prefeitura de São Paulo, Vale, Grupo InPress, TV Globo/SporTV, CDI Comunicação). O campo **Tamanho do título da empresa no desktop (px)** vale **23** e grava `items[5..10].desktop.titleSize` do bloco B.
4. **Editor do site → Formação:** o editor genérico já contém **Desktop → Título (px)**. Os três cursos do bloco 1 estão em **30 px**; Swan Training Institute e Instituto Rojas, no bloco 2, em **29 px**.
5. **Resultados** (gaps iguais), **Perfil** (seta centralizada e não sobreposição do selo) e **Sobre/Olá!** (foto alinhada ao limite inferior) são ajustes de CSS/renderer desktop, **sem novos campos** no admin ou atualização das métricas/fotografia no banco.

**Persistência e cuidado operacional:** os valores iniciais foram configurados por **SQL UPDATE restrito** nos quatro blocos publicados e relidos no Supabase; o P5 [#43197029455](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029455) validou a **exibição read-only** de 21/21 etapas, **zero escritas**, incluindo controles desktop da abertura. Não houve teste autenticado `editar → salvar` em produção; alterações editoriais futuras usam o botão Salvar e a RPC/CAS existentes. Não tocar os controles **Mobile**, a identidade global nem registros de outras seções para reproduzir o layout.

## Histórico: primeira redução dos tamanhos desktop do Perfil — 13/11/2026

No Supabase de produção, `content_blocks.id = a2f4770b-7964-4f3c-b816-c778b66ac15c` (Perfil, bloco A publicado), foram reduzidos exclusivamente `items[0].hero.desktop.introSize` de 24 para **22 px**, `items[1..4].desktop.titleSize` de 17 para **16 px** e `items[1..4].desktop.textSize` de 16 para **15 px**. Todos os quatro `desktop.spacing` permaneceram em 2 px. A operação foi condicionada à versão anterior do registro e os valores novos foram confirmados por `UPDATE ... RETURNING` no banco em 13/11/2026. Os valores pertencem ao CMS, não a constantes globais do CSS. Nenhum controle mobile, conteúdo textual, bloco B, outra seção, tabela ou migration foi alterado. A aplicação pública lê os valores diretamente do CMS; não foi necessário publicar novo bundle para refletir a mudança. A revisão ocorreu por leitura de banco; não se trata de teste visual end-to-end em navegador.

## Valores vigentes do Perfil desktop — segunda revisão de 13/11/2026

A pedido do proprietário, a alteração feita em produção no bloco A de Perfil (`content_blocks.id = a2f4770b-7964-4f3c-b816-c778b66ac15c`) ajustou somente propriedades desktop do JSONB do CMS:

- `content_json.items[0].hero.desktop.introSize`: **22 → 20 px** (frase editorial itálica).
- `content_json.items[1..4].desktop.titleSize`: **16 → 13 px** (quatro títulos laranja).
- `content_json.items[1..4].desktop.textSize`: **15 px**, sem alteração (descrições brancas).
- `content_json.items[1..4].desktop.spacing`: **2 → 10 px** (maior distância visual entre os destaques).

O controle de espaçamento do CMS alimenta a variável `--item-desktop-spacing`, aplicada por `src/index.css` ao `padding-block` dos itens; a solicitação não introduziu uma propriedade `margin-bottom` separada. A operação utilizou correspondência de ID, status, `updated_at`, estrutura e valores anteriores; o banco retornou os quatro itens com os novos tamanhos, textos em 15 px e spacing em 10 px. Sem alteração do bloco B, dos campos mobile, de migrations, de RLS ou de componentes React; o conteúdo publicado é consultado pelo renderer, sem exigir nova compilação do site para a mudança editorial. As demais seções seguem com seus valores anteriores. Inspeção de layout pixel a pixel em navegador não foi realizada nesta intervenção.

## Terceira revisão da tipografia do Perfil desktop — 13/11/2026

No Supabase de produção, bloco A publicado de `perfil` (`content_blocks.id = a2f4770b-7964-4f3c-b816-c778b66ac15c`), o campo `items[0].hero.desktop.introSize` foi alterado de **20 para 18 px** por SQL restrito ao ID, status, versão `updated_at`, seção, cinco itens e valores anteriores. `UPDATE ... RETURNING` confirmou 18 px e preservação dos quatro destaques em **13/15/10 px** e da configuração mobile (checksum conferido). Nenhuma migration, outro bloco, tabela ou campo mobile foi modificado. A redução do limite inferior do CSS de 18,4 px para 18 px garante a aplicação exata desse valor pelo renderer. O filete de **2 px** é somente CSS, sem controle ou gravação adicional no CMS. O histórico de 20 px em seção anterior corresponde ao estado anterior.


## Campos desktop utilizados na revisão de 16/11/2026

Em **Editor do site → Perfil → Coluna esquerda → Apresentação**, os campos `Tamanho da frase no desktop (px)` e o novo `Tamanho de +15 ANOS no desktop (px)` escrevem no mesmo objeto `items[0].hero.desktop`, respectivamente `introSize=15` e `yearsSize=55`. Os seis títulos de empresas no bloco Perfil/B usam o controle já existente `Tamanho do título da empresa no desktop (px)` (`items[5..10].desktop.titleSize=21`). Para “Olá!” → bloco B, os cinco itens utilizam **Ajustes de apresentação desktop → Texto (px)** (`items[*].desktop.textSize=14`), sem novos blocos, migrations ou tabelas.

Todos os campos seguem o salvamento CAS/RPC `save_section_block_atomic` do editor; ajustes de margem, grade de Resultados e animação do botão são CSS e não novas entradas no CMS. O frontend lê os estilos desktop, mantendo `items[].mobile` e `hero.mobileEditorial` inalterados. Confrontar sempre os valores atuais no banco antes de futuras edições: a documentação anterior de 13/11 mostrava 18 px na frase, mas o valor vivo de 16/11 antes desta intervenção já havia sido reduzido para 16 px por edição posterior.


## Revisão do campo +15 ANOS — 16/11/2026

No **Perfil → Coluna esquerda → Apresentação**, o campo existente **“Tamanho de +15 ANOS no desktop (px)”** agora tem valor publicado **51 px** (anteriormente 55 px), armazenado em `content_blocks.content_json.items[0].hero.desktop.yearsSize`. Não foi criado campo novo. As alterações geométricas do selo são CSS desktop e continuam respeitando o valor editável `hero.desktop.badgeSize` quando fornecido. O conteúdo editorial, `hero.mobile`, `hero.mobileEditorial` e a edição mobile não mudam. Edite os tamanhos do título pelo CMS normalmente; a modificação SQL desta entrega foi protegida por checagem da versão do bloco, sem testar gravação pela interface.


## Experiências — cinco projetos e Trajetória padronizada (16/11/2026)

Nas seis seções de experiência, editar **cinco itens visíveis** com `title` e `text` (resumo de até duas linhas na apresentação). A quantidade de slides em `experienceMedia.slides` pode continuar menor: texto não depende de imagem e novas imagens não são necessárias. Os itens históricos com `isHidden=true` não devem ser eliminados por conveniência. A interface mantém os controles de edição no bloco da seção, com salvamento normal via `save_section_block_atomic` e releitura; não replicar Trajetória nesse JSONB.

A aba **Trajetória** lê `career_experiences.description`: um parágrafo introdutório seguido por linhas `• Tema: explicação`. O renderer destaca o título até os dois-pontos e exibe a descrição integral tanto no desktop quanto no mobile. Formatação apenas visual em duas linhas nos resumos dos projetos; não truncar os valores salvos no CMS. Estados confirmados: Invest RS/Guia e Plataforma realizados; a estratégia CRM foi entregue como estratégia (sem implicar integrações não documentadas); Prefeitura/SUBPI entregue, com dashboards e relatórios. `status=published` não equivale a estado de execução.

## PDF — estado após a Etapa 2 (16/11/2026)

Existe apenas renderer estático em `PdfPortfolio.tsx`, ainda sem item de menu, rota de preview ou download. A filtragem `includedSlugs` atua em memória; não modifica publicação, `sections.is_visible` ou registros do CMS. O integrador deverá passar seções e tokens publicados e seis descrições de Trajetória, bloqueando geração se dados obrigatórios faltarem. Não usar rascunhos da prévia em um PDF anunciado como público.

## Preparação das quatro variantes de PDF — Etapa 3 (16/11/2026)

A exportação passou a carregar metadados de viewport e paleta, sem novos controles no painel administrativo. A seleção das seções permanece apenas em memória e não altera dados. Nenhuma tela administrativa ou API de geração foi criada nesta etapa.

## Exportar PDF — interface da Etapa 4 (16/11/2026)

No menu administrativo, após **Prévia**, há **Exportar PDF**, com escolhas **Desktop/Mobile** e **Original/Clean**. A seleção mostra somente seções publicadas e visíveis na ordem `sort_order`, inicialmente todas incluídas. É possível marcar/desmarcar e usar **Selecionar todas** ou **Desmarcar todas**. Nada é gravado no CMS; com seleção vazia, a prévia fica indisponível.

A prévia protegida aparece em iframe com opção **Abrir em nova aba** e usa conteúdo publicado, não rascunhos. Trajetórias de experiências selecionadas são obrigatórias e erros de leitura impedem a composição. **Download PDF ainda não existe**: paginação, hiperlinks finais e geração ficam para a Etapa 5. Nenhum dado, Auth/RLS, Storage ou migration foi alterado.

## Etapa 5 — salvar documento PDF (16/11/2026)

Em **Exportar PDF**, selecione Desktop/Mobile, Original/Clean e as seções desejadas; aguarde **Documento pronto para impressão** e clique **Gerar PDF**. No diálogo do navegador Chromium/Chrome, selecione **Salvar como PDF** (sem cabeçalhos e rodapés) para gravar o arquivo. A impressão usa uma página de altura própria por seção, respeita a ordem pública e conserva links e texto nativos. Seções desmarcadas são omitidas, sem alteração de publicação. Links que apontam a seções excluídas levam ao site público.

A geração permanece bloqueada se a prévia estiver incompleta, houver imagens ausentes, Trajetórias não carregadas, seções divergentes ou excesso do limite físico de página. **Não existe download binário direto**: o salvamento ocorre no diálogo do navegador, sob controle do usuário. Não há alterações persistidas pelo módulo.

**Configurações de cor na impressão:** no Chrome/Chromium, marque **Gráficos de fundo** e desative cabeçalhos e rodapés. A diretiva `print-color-adjust: exact` não sobrepõe opções escolhidas manualmente; a QA física de Chromium é executada com `printBackground: true`.

## PDF — comportamento após a homologação de 17/11/2026

A prévia do PDF mostra as seis experiências em sequência, sem cartões sobrepostos. Contato Desktop exibe o retrato completo; Depoimentos tem retratos e fontes maiores, com respiro antes da citação. A opção Mobile carrega as imagens de forma antecipada: a prévia visual permanece acessível mesmo se uma fotografia falhar. Nesse caso o painel exibe **a seção da imagem indisponível**, não habilita **Gerar PDF** e mantém íntegro o documento disponível para inspeção. Corrigir o arquivo publicado ou a conectividade antes de imprimir; a alteração não troca imagens no Supabase nem altera o site público.

## Correções da impressão e diagramação do PDF — 17/11/2026

**Gerar PDF** agora abre uma aba de impressão protegida com o mesmo conteúdo publicado e seleção da prévia, em vez de mandar imprimir o iframe reduzido da tela administrativa. A aba tenta abrir o diálogo automaticamente após carregar fontes, imagens e Trajetórias; se o navegador bloquear a abertura do diálogo, há o botão **Imprimir / Salvar PDF** na própria aba. Na janela de impressão é necessário escolher **Salvar como PDF** como destino, não a impressora HP/física. O site não consegue selecionar a impressora do usuário programaticamente. A orientação pretendida é **paisagem no Desktop** e **retrato no Mobile**, preservando uma página por seção e a seleção parcial. Nenhum dado do CMS muda.

## PDF — carregamento da imagem Sobre e impressão no Chrome (17/11/2026)

A exportação Mobile de Sobre solicita a imagem publicada imediatamente com `loading="eager"` e `src` presente desde a primeira renderização. No site público, o `DeferredAboutTablet` continua esperando interseção da viewport e conserva sua otimização de download. O arquivo referenciado está cadastrado no CMS e existe no bucket público. A exportação não altera, substitui ou oculta essa mídia.

Na aba protegida de impressão, o evento `beforeprint` deixa de medir novamente o documento caso as regras `@page` já tenham sido preparadas: isso reduz o risco de geometria divergente no diálogo gráfico. Para salvar, escolha **Destino: Salvar como PDF**, **Margens: Nenhuma**, marque **Gráficos de segundo plano** e desative cabeçalhos e rodapés. O aplicativo não altera as configurações do Chrome.

## Fluxo de impressão PDF em folhas estáveis — 17/11/2026

Em **Exportar PDF**, Desktop utiliza folhas em paisagem e Mobile em retrato. Cada seção selecionada inicia em nova folha, mas Resultados, Trajetórias, projetos e Depoimentos podem continuar em folhas adicionais; **13 seções não significam necessariamente 13 folhas**. Preservar fotos, texto selecionável e hyperlinks. No Chrome, escolher **Salvar como PDF**, margens nenhuma, gráficos de segundo plano marcados, cabeçalhos/rodapés desativados.

A homologação com dados reais do CMS ainda é necessária; nenhuma mídia ou dado editorial é modificado pela exportação.
A ajuda da tela administrativa também informa que uma seção pode continuar em folhas subsequentes, sem prometer uma folha de altura variável por seção.


## Exportação Desktop — destino correto do PDF (17/11/2026)

Para **Desktop**, o painel e a aba de impressão distinguem a opção interna **Destino: Salvar como PDF** do Chrome do driver virtual Windows **Microsoft Print to PDF**. O driver Windows não é equivalente ao mecanismo Chromium empregado na QA física, que respeita o tamanho de folha CSS.

Selecionar no Chrome **Salvar como PDF** (não Microsoft Print to PDF), **Margens: Nenhuma**, **Gráficos de segundo plano** ligados e cabeçalhos/rodapés desligados. Espera-se folha Desktop em paisagem, textos pesquisáveis e links; seções extensas podem continuar em folhas seguintes. O site não consegue escolher o destino do diálogo de impressão programaticamente. Nenhuma mídia ou dado CMS é alterado.
## Desktop PDF — dimensionamento editorial por conteúdo (17/11/2026)

Na opção **Desktop** do Exportar PDF, cada seção começa em uma nova folha com altura calculada de acordo com seu conteúdo publicado. Assim, Resultados e as seis experiências podem ocupar uma única folha mais alta, enquanto Formação, Ferramentas e Depoimentos deixam de preencher artificialmente 900 px. As fotografias de Sobre e Contato recebem alinhamentos exclusivos para essa exportação. As bordas laranja entre as empresas foram removidas somente do PDF Desktop.

O modo **Mobile não mudou** e continua com folhas de tamanho fixo e eventuais continuações. Selecione sempre **Destino: Salvar como PDF** no Chrome, margens nenhuma, gráficos de segundo plano habilitados e cabeçalhos/rodapés desativados. A geração não altera dados ou mídias do CMS.
## Correções de acabamento na impressão Desktop — 17/11/2026

O PDF Desktop mantém alturas individuais por seção. A folha **Perfil** conserva os quatro destaques, incluindo **Idiomas**, na mesma página; as fotografias centrais de **Sobre** e **Contato** são alinhadas à base de suas páginas; as folhas de **Invest RS, Prefeitura de São Paulo, Vale, TV Globo/SporTV e Grupo InPress** são compactadas depois do último parágrafo. **Ferramentas** recebe redução moderada da sobra inferior. A seção **CDI**, a versão Mobile e a exibição pública não recebem esses ajustes.

Permanece obrigatório escolher **Salvar como PDF** do Chrome, margens nenhuma, gráficos de segundo plano habilitados e cabeçalhos/rodapés desativados. O destino Microsoft Print to PDF não é equivalente. A prova de conteúdo não cortado depende da QA física e do arquivo produtivo regenerado.

## PDF Mobile — abertura da impressão sem duplicar preparação do iframe (18/11/2026)

Na opção **Mobile**, após a prévia comunicar que fontes, imagens e Trajetórias estão carregadas, o botão **Gerar PDF** abre a aba de impressão diretamente. A aba já executa `PdfPrintReady` e `preparePdfPrintLayout` com as verificações de integridade, seleção, mídias, regras responsivas e páginas antes do diálogo Chrome. Antes desta correção, o painel também tentava preparar as folhas dentro do iframe Mobile e, se essa chamada gerasse uma exceção pertencente ao contexto da outra janela, o botão exibia apenas **"Não foi possível imprimir."**. A nova chamada de pré-validação é mantida **somente para Desktop**, cuja experiência está aprovada e permanece inalterada. O painel também conserva mensagens específicas de erros de outras janelas (`message` tipado), em vez do aviso genérico.

**Operação:** atualizar a tela administrativa para carregar o build novo, selecionar Mobile/Original e clicar Gerar PDF. Se a aba ou o diálogo forem bloqueados, permitir pop-ups ou usar o botão **Imprimir / Salvar PDF** na aba. O PDF real ainda depende de conferência após ser salvo pelo Chrome. O aviso do Chrome de imagem previamente carregada e não utilizada não indica falha de impressão nem autoriza mudanças no preload público.

## Ajuda de dimensão nos seletores de fotos e imagens (18/11/2026)

Nos campos de `PublishedMediaPicker` do Editor do site (Perfil, Sobre/“Olá!”, Contato, seis Experiências e miniaturas de itens) e em SEO (Open Graph e favicon), um **ícone discreto “i”** ao lado do rótulo revela, por **hover** no desktop, a indicação **“Tamanho recomendado”** correspondente ao destino. O controle `AdminInfoTip` existente continua acionável por **clique/toque** e teclado (Enter/Espaço, Esc para fechar), com `role=tooltip` e rótulo acessível. O tamanho do botão junto aos campos de mídia é **24 × 24 px no desktop** e permanece **44 × 44 px no mobile**. Não é uma exigência do uploader nem altera arquivos, recorte salvo ou validação.

As recomendações são passadas explicitamente ao seletor pelo prop `recommendedSize`, com orientações de proporção/formato complementares. Para os itens genéricos, `src/lib/admin-media-recommendations.ts` diferencia o primeiro retrato do Perfil (1200 × 1600 desktop / 900 × 1200 otimizado mobile), “Olá!” (1200 × 1600 desktop ou 900 × 1200 mobile conforme aba), Contato (1200 × 1600 no mesmo arquivo) e miniaturas restantes (600 × 600). Em Experiências, a galeria informa **1600 × 1600 px** para ambos os dispositivos, sem corte por `contain`, e a marca informa **512 × 512 px** se raster ou SVG. A foto mobile exclusiva do Perfil informa **900 × 1200 px**. SEO informa **1200 × 630 px** para Open Graph e **512 × 512 px** como fonte de favicon (exibição Apple de referência 180 × 180 px).

A ajuda reaproveita `src/components/admin/InfoTip.tsx`, e a orientação aparece também quando o diálogo de enquadramento é aplicável. O comportamento de upload, seleção, exclusão, publicação e CAS permanece o mesmo. Verificações: renderização do tooltip e mapeamento de seção/dispositivo em `admin-visual-editors.test.tsx`; smoke/CI devem confirmar o build por SHA e inspeção manual de hover/foco quando houver sessão administrativa. Esta mudança não reabre o aceite de composição pública.
