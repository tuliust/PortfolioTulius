# GUIDELINES — SITE / CURRÍCULO / PORTFÓLIO DE TULIUS TSANGAROPULOS

> **CLASSIFICAÇÃO EM 05/11/2026:** especificação **original de 22/10/2026**, preservada para contexto e rastreabilidade — **não** representa o estado do site ou do CMS atual. O produto publicado e sua aparência vigente não devem ser revertidos para corresponder a números, mockups, formas de criação ou fluxos projetados originalmente. Consultar [Estado atual](docs/ESTADO_ATUAL_VIGENTE.md), [CMS](docs/ADMIN_CMS.md), [responsividade](docs/RESPONSIVE_LAYOUT.md) e [índice](docs/README.md). Nenhuma alteração de código ou dados foi realizada por esta classificação.

> **Versão:** 1.1 (com análise visual do PDF mobile recebido) · **Data:** 22/10/2026 · **Status:** especificação de implementação, com conteúdo e ativos sujeitos a revisão editorial.
>
> **Instrução operacional:** este documento acompanha o prompt principal do Figma Make e os PDFs desktop/mobile. É referência para implementação do projeto COMPLETO, não apenas de um protótipo. Execute o máximo possível em uma única rodada, valide e identifique as limitações reais sem declarar recursos incompletos como funcionais.

## 0. O que deve ser entregue

1. Site público de currículo/portfólio com **14 seções lógicas**, navegação de tela inteira, menu por âncoras e conteúdos documentados nos anexos.
2. Versão desktop responsiva com aproximadamente uma tela útil por seção e versão mobile com **dois painéis por seção lógica** (14 × 2 = **28 painéis mobile**), preservando acessibilidade.
3. Recriação do design como elementos HTML, React e componentes reutilizáveis, não páginas rasterizadas do PDF.
4. Painel `/admin` real, privado, permitindo editar conteúdo, design tokens, ordem, visibilidade, distribuição desktop/mobile, mídias, menu e presets de animação.
5. Supabase existente conectado ou integração tecnicamente preparada e verificável; **tabelas SQL relacionais, migrations, autenticação, RLS, Storage e testes**.
6. Código React + TypeScript organizado, pronto para versionamento no GitHub e implantação na Vercel.
7. Documentação Markdown e registro rigoroso do que foi implementado/testado versus o que depende de autorização/etapa externa.

**Projeto Supabase existente:** `https://zfnrhzplwpjpdljraypt.supabase.co`  
**Project ref:** `zfnrhzplwpjpdljraypt`  
**Não criar novo projeto nem trocar automaticamente para Payload ou outro CMS.**

### 0.1. Hierarquia de fontes

| Referência | Autoridade |
|---|---|
| PDF desktop, 14 páginas | Principal para composição visual, fotografia, disposição, cores e ritmo das seções |
| `CV Digital — Mobile.pdf`, 2 páginas | Principal para a composição dos painéis 01A e 01B da MESMA seção `#perfil`; deve ser lido visualmente, não como duas seções autônomas |
| Este `guidelines.md` | Regras funcionais, técnicas, acessibilidade, segurança e critérios de aceite |
| PowerPoint | Fonte complementar; sua formatação está quebrada e não deve prevalecer visualmente |
| Links do Canva | Textos e versões editoriais complementares, sujeitos a confrontação com PDF |
| Fontes originais e imagens licenciadas | Ativos preferidos, quando de fato fornecidos e autorizados |

Projetos Canva de referência (não depender da capacidade do Make de abrir URLs privadas):
- Desktop: `https://www.canva.com/design/DAHYe7ROgwM/lqdQLRd9sHRnkAgMMyv0Dw/edit`
- Mobile: `https://www.canva.com/design/DAHYtZDmKqs/qYMTfd2sEC4-hOJ9VhGmfw/edit`

**Contagem:** o Canva desktop apresentou 15 páginas, mas a página 15 está vazia; o PDF oficial contém **14 telas úteis**. Não fabricar uma seção 15.

**Textos fictícios:** expressões como `X`, `Y`, `Z`, `XXXXX` e imagens/ícones provisórios são intencionais e representam **conteúdo ainda não concluído**. Não substituí-los por fatos inventados. Marcar o status no CMS. Não exibir mensagem de erro na página pública por um campo pendente; usar visual de rascunho em preview e regra de publicação coerente.

---

## 1. Visão do produto

### 1.1. Público e resultado desejado

Site pessoal de profissional sênior de comunicação, marketing, relações públicas, reputação e conteúdo, com trajetória no setor privado, imprensa, agências e administração pública. Comunicar senioridade, repertório, clareza estratégica e experiência internacional.

A experiência deve parecer uma **publicação editorial interativa**: tipografia forte, fotografia, ilustrações geométricas, laranja marcante, contraste, conteúdo de alta densidade organizado por módulos, movimento discreto e navegação previsível.

### 1.2. Princípios inegociáveis

- Preservar **identidade reconhecível** dos PDFs; melhorar legibilidade, consistência e responsividade, sem trocar por template genérico.
- Todo conteúdo e aparência importantes devem ser **editáveis pelo admin**; evitar manter o conteúdo do site público em constantes JSX.
- **Separar dados de apresentação:** um resultado, texto, empresa, foto ou depoimento deve ter uma fonte de verdade, com representações/layouts diferentes por breakpoint.
- **Mobile não é miniatura do desktop.** Ele distribui, sintetiza visualmente e revela detalhes sob demanda sem apagar dados.
- Priorizar rolagem nativa, sem travas de scroll e sem esconder conteúdo para obedecer altura estrita.
- Publicação segura: visitantes só leem conteúdo publicado, administradores autorizados gerenciam dados.
- Ausência de dados/licenças/credenciais não é autorização para inventá-los.

---

## 2. Mapa de informação — 14 seções / 28 painéis mobile

| Nº | Âncora estável | Desktop — conteúdo essencial | Mobile A (1ª tela) | Mobile B (2ª tela) |
|---:|---|---|---|---|
| 01 | `perfil` | Visão 360° da Comunicação; nome; tempo de experiência; cinco áreas; destaques; empresas | Conforme PDF mobile p. 1: faixa de nome, subtítulo escuro, foto +15 ANOS, selo circular, frase e quatro destaques | Conforme PDF mobile p. 2: título, cinco cards numerados em referência 3+2 e seis empresas em coluna |
| 02 | `sobre` | “Olá!”, retrato, “Prazer, sou o Tulius”, texto biográfico | Saudação, imagem e grande título | Texto biográfico e mensagem principal |
| 03 | `resultados` | Quatro frentes de resultado, métricas e projetos | Conquistas mensuráveis em cards compactos | Áreas, contexto e explicação de resultados |
| 04 | `competencias` | Comunicação e estratégia; habilidades, competências, destaques | Habilidades prioritárias | Competências, diferenciais e exemplos |
| 05 | `formacao` | Graduação, pós-graduação, MBA, idiomas e instituições | Formação acadêmica em timeline | Idiomas e formação internacional |
| 06 | `invest-rs` | Gestão de eventos, comunicação institucional, projetos digitais, competências aplicadas | Cargo/contexto e competências essenciais | Projetos e entregas, com detalhes expansíveis |
| 07 | `prefeitura-sp` | Comunicação interna e digital; plataforma SUBPI; equipe; resultados | Contexto, cargo, indicadores +48%, +225%, ~900 pessoas no escopo | Projetos, imprensa, media training, competências |
| 08 | `vale` | Comunicação corporativa global; orçamento de mídia; projetos e ESG | Contexto, cargo, principais indicadores | Projetos, realizações e competências |
| 09 | `globo-sportv` | Trajetória TV Globo/SporTV, seleção, China e conteúdo audiovisual | Correspondência internacional e seleção | Timeline dos trabalhos e repertório |
| 10 | `inpress` | Assessoria, RP, gestão de contas, campanhas | Papel, resultados, clientes | Projetos, campanhas e competências |
| 11 | `cdi` | Comunicação institucional e planejamento, competências aplicadas | Visão geral e frentes de atuação | Entregas e competências |
| 12 | `ferramentas` | Ferramentas de analytics, CRM, performance, colaboração, conteúdo | Análise, indicadores, CRM e performance | Colaboração, design e comunicação digital |
| 13 | `depoimentos` | Recomendações de Matheus Gomes, Ana Beatriz Neves e Fábio Seixas | Depoimentos selecionados sem truncamento inacessível | Demais depoimentos com acesso ao texto integral |
| 14 | `contato` | Foto, nome, WhatsApp, e-mail, LinkedIn, localização | Chamada visual e retrato | Contatos clicáveis e encerramento |

**Importante:** os layouts mobile A/B das seções 02–14 são sugestões de estrutura, não arquivos já existentes. O PDF mobile define a referência concreta apenas para a seção 01. Não é necessário fabricar conteúdo novo para ocupar painéis.

### 2.0. Leitura visual vinculante do PDF mobile recebido (2 páginas)

Este PDF efetivamente foi fornecido e inspecionado. **As páginas 1 e 2 não representam duas seções diferentes do site.** Elas correspondem, respectivamente, aos dois painéis responsivos **`#perfil-a` e `#perfil-b`** da **seção lógica 01 (`#perfil`)** vista como uma composição única no desktop. As outras 13 seções desktop têm apenas referências horizontais completas; suas duplas A/B mobile serão criadas pelo sistema.

**Página 1 — `#perfil-a`:**
1. Cabeçalho monumental, horizontal: primeiro nome `TULIUS` em faixa laranja, sobrenome `TSANGAROPULOS` em fundo branco, com tipografia condensada negra.
2. Subtítulo completo de atuação profissional em faixa grafite logo abaixo do nome, com texto branco.
3. Hero escuro: retrato em preto e branco à esquerda; `+15 ANOS` grande e laranja à direita; complemento pequeno, de alto contraste, abaixo do indicador.
4. Selo circular laranja `VISÃO 360° DA COMUNICAÇÃO`, com tipografia contornando o selo, sobrepondo-se visualmente à transição entre área escura e clara; a seta no centro é parte da marca gráfica.
5. Metade inferior de fundo branco suave: frase editorial em itálico à direita; bloco `DESTAQUES` com título na vertical à esquerda e quatro tópicos em ordem: grandes empresas; experiência internacional; liderança de equipes; idiomas. Rótulos em laranja, descrições em grafite.

**Página 2 — `#perfil-b`:**
1. Cabeçalho `EXPERIÊNCIA E ATUAÇÃO` em preto sobre fundo claro, acompanhado de fio/linha laranja.
2. Cinco áreas numeradas `01–05` em cartões de fundo preto, com número laranja e descrição branca. O arranjo de referência é de **três cartões na primeira fileira e dois na segunda (3+2)**.
3. Abaixo, **seis experiências** em fluxo vertical e nesta ordem: **Invest RS; Prefeitura de São Paulo; Vale; Grupo InPress; TV Globo/SporTV; CDI Comunicação**. O nome da instituição recebe preto forte; localização/período aparecem em laranja; e a descrição é grafite, com boa entrelinha.

**Regra de fidelidade:** reproduzir cores, componentes, ordem, contraste e hierarquia dos dois painéis; não copiar a altura em pixels, não tratar o PDF 1080×1920 como CSS real e não transformar páginas em imagens rasterizadas. No celular, o conteúdo deve ser legível sem fontes minúsculas. Se o grid 3+2 ou a lista de seis empregos não couber nos limites ideais de `100svh`, adaptar com reflow responsivo ou blocos expansíveis, mantendo acesso aos dados; autoriza-se altura maior que uma viewport por acessibilidade. A barra de menu não pode encobrir o nome monumental nem o selo. Este exemplo define a lógica de **redistribuição, preservação da identidade e hierarquia**, não um molde para repetir exatamente nas outras 13 duplas.

**Verificação obrigatória da seção 01:** conferir se ambos os painéis aparecem na ordem correta, se os cinco cards e as seis empresas estão presentes, se o selo é componente gráfico nítido, se o conteúdo se mantém acessível em 390×844 e 320px, e se a âncora `#perfil` chega ao início do painel A enquanto `#perfil-b` pode ser usado como âncora auxiliar.

### 2.1. Conteúdo-fonte para semeadura editorial

Usar integralmente os anexos como fonte prioritária; os dados abaixo são índice semântico para guiar modelagem, **não substituem o conteúdo integral do PDF**.

**01 Perfil** — Tulius Tsangaropulos; “Visão 360° da Comunicação”; “+15 anos”; atividades: comunicação corporativa, gestão de projetos, RP/eventos, marketing digital e imprensa/influenciadores. Trajetória resumida: Invest RS, Prefeitura de São Paulo, Vale, Grupo InPress, TV Globo/SporTV e CDI. Destaques de liderança e experiência internacional.

**02 Sobre** — “Olá!” / “Prazer, sou o Tulius”; texto base no PDF: “Jornalista e profissional sênior de Comunicação e Marketing, com mais de 15 anos de experiência em empresas globais, imprensa, agências e setor público. Conecto estratégia, reputação, conteúdo, tecnologia e gestão de projetos.”

**03 Resultados** — 01 Mídia e Estratégia: R$ 12 milhões de orçamento anual de mídia gerido na Vale; 02 Comunicação Pública: +48% de seguidores e +225% de alcance orgânico em seis meses na Prefeitura de São Paulo; 03 Jornalismo Internacional: selecionado entre cerca de 8 mil candidatos para programa da TV Globo/SporTV, correspondente na China; 04 Relações Públicas e Imprensa: mais de 30 veiculações associadas ao Grupo InPress. O PDF contém elementos gráficos `XXXXX`, `X/Y/Z`; são placeholders. O Canva mais recente acrescenta indicadores como `+20` eventos e referências a alcance internacional: tratar como campos com origem e estado de revisão até aprovação, não fundir indicadores.

**04 Comunicação e Estratégia** — planejamento estratégico, comunicação executiva, gestão de equipes, projetos, reputação, indicadores, comunicação corporativa/interna/digital, imprensa, RP e gestão de crise.

**05 Formação** — Bacharelado em Comunicação Social/Jornalismo na UFRN (período 2007–2012 no PDF); pós em Comunicação Integrada e Marketing Digital na UnP (2013); MBA em Marketing Digital, BI e Estratégia Data Driven na PUCRS (2020–2021 no PDF). Formação em inglês na Swan Training Institute (Dublin, 2010–2011) e espanhol no Instituto Rojas (Buenos Aires, 2024). As denominações dos níveis de idiomas divergem entre fontes, não mudar silenciosamente.

**06 Invest RS** — atuação em eventos, comunicação institucional, relacionamento com stakeholders e transformação digital; iniciativas como guia de boas-vindas, eventos, plataforma de eventos/relacionamento, mailing institucional e cartões de visita digitais. Não declarar proposta ou protótipo como produto integralmente operacional. Cargo divergente: PDF “Analista Executivo”; Canva “Assessor Executivo | Núcleo de Comunicação”.

**07 Prefeitura de São Paulo** — Coordenador de Comunicação, nov/2024–jan/2026; planejamento, conteúdo institucional/executivo, imprensa e públicos estratégicos, gestão de crise/media training; plataforma SUBPI no escopo de aproximadamente 900 colaboradores; crescimento de +48% em seguidores e +225% no alcance de publicações.

**08 Vale** — Analista Sênior de Comunicação, jun/2020–out/2024; comunicação corporativa global e executiva, mídia digital, performance, reputação, KPIs e projetos de ESG/inovação. Indicador `R$ 12 milhões` anual. Divergência de destaque secundário: PDF `6 pessoas` na equipe, Canva `14 países`; manter dados separados e confirmar contexto antes da publicação.

**09 Globo/SporTV** — Trainee, Repórter, Produtor, Editor e Correspondente, 2015–2019; seleção nacional entre ~8 mil; correspondente na China por cerca de um ano, reportagens, entradas ao vivo, produção audiovisual. O Canva menciona também séries no Japão/Coreia, usar somente quando sustentado e editorialmente aprovado.

**10 Grupo InPress** — nov/2019–jun/2020; assessoria de imprensa, RP e gestão de contas; clientes citados: GoPro, Johnson & Johnson e Sicredi; cerca de 30 veiculações de destaque; atuação em campanhas integradas. Nome de cargo varia entre versões.

**11 CDI Comunicação** — nov/2014–set/2015; planejamento estratégico, imprensa, RP, gestão de stakeholders e comunicação institucional. Há revisão mais recente do Canva com enfoque em releases, pautas, entrevistas e eventos. Conservar pendência editorial ao confrontar fontes.

**12 Ferramentas** — análise: GA4, Search Console, dashboards/KPIs; mídia/performance: Meta Ads; CRM: Salesforce, HubSpot, Sprinklr; projetos: Asana, Notion; conteúdo/design: Adobe Creative Cloud, Figma, WordPress; comunicação digital e social media.

**13 Depoimentos** — depoentes: Matheus Gomes, Ana Beatriz Neves e Fábio Seixas; associar cada pessoa à sua citação correta. Há duplicação gráfica de dois depoimentos no PDF, não cadastrar depoimento duplicado como registro distinto. Manter integridade do texto.

**14 Contato** — WhatsApp, e-mail, LinkedIn e localização Porto Alegre/RS, com ações explícitas (`wa.me`, `mailto:`, HTTPS) usando dados cadastrados no CMS. Não criar formulário que capture dados pessoais sem necessidade e política de privacidade correspondente.

### 2.2. Registro de pendências editoriais

Conservar tabela `editorial_issues` ou registro equivalente contendo: `section_id`, `field_path`, `source_a`, `source_b`, `description`, `status`, `resolution`, `reviewed_at`. Itens a revisar:

1. Papel na Invest RS: `Analista Executivo` vs `Assessor Executivo | Núcleo de Comunicação`.
2. Idiomas: `inglês fluente / espanhol avançado` vs `inglês avançado C1 / espanhol avançado B2`.
3. Vale: indicador de `6 pessoas` vs `14 países` — indicadores distintos, não falsos sinônimos.
4. Trajetória internacional: viagens a 34 países vs articulação profissional com 14 países; definir contextos.
5. Descrições/cargos no Grupo InPress e CDI entre PDF e Canva.
6. Conteúdo provisório na seção Resultados, incluindo rótulos `X/Y/Z/XXXXX` e eventuais rótulos não preenchidos.
7. Imagens temporárias na Invest RS; solicitar ativos reais apropriados sem inventar fotos/logos.
8. Duplicações gráficas de depoimentos na composição do PDF.
9. Recursos de mídia, fontes comerciais e ícones sem licença comprovada.

---

## 3. Design system

### 3.1. Direção estética

**Conceito:** editorial de alta energia visual, clareza corporativa, tipografia condensada, contrastes marcantes, geometria circular e setas como linguagem de movimento.

Manter:
- Laranja dominante de marca; superfícies alternadas claras e grafite.
- Títulos monumentais de alto impacto e boa hierarquia de parágrafos.
- Fotografia profissional em recortes ajustáveis, sem distorção.
- Círculos concêntricos de linhas muito finas, badges e ícones de traço.
- Blocos assimétricos, divisórias, métricas grandes, listas e números de ordenação.
- Logos de empresas apenas com arquivos autorizados ou fallback textual.

Evitar:
- Tema genérico SaaS, blur excessivo, glassmorphism exagerado, gradientes coloridos estranhos à marca.
- Tipografia decorativa em textos longos; texto sobre fotos sem contraste.
- Extrair uma imagem raster do PDF e mostrá-la como “tela responsiva”.
- Ícones de biblioteca inconsistente e fotos genéricas representando acontecimentos específicos.

### 3.2. Paleta e tokens iniciais

| Token | Valor | Aplicação | Observação |
|---|---|---|---|
| `color.brand.orange` | `#FF5414` | marca, fundos, numerais, gráficos | preferir texto grafite sobre essa cor |
| `color.ink` | `#171617` | texto forte, superfícies escuras | cor estrutural |
| `color.paper` | `#FAFAFA` | superfícies brancas suaves | base de leitura |
| `color.cream` | `#F8F4F1` | alternância de fundos | caráter editorial |
| `color.muted` | `#514742` | texto de apoio | validar contraste |
| `color.brand.orangeDark` | `#BC390C` | links/texto em superfícies claras | cor suplementar proposta |

Iniciar com predominância visual de superfícies claras (~50%), grafite (~30%) e laranja (~20%), mas adaptar por seção. Não interpretar as porcentagens como limitação de cada página. Manter tokens para `text`, `background`, `surface`, `border`, `focus`, `hover`, `disabled` e `interactive` em temas claros/escuros.

Texto pequeno branco sobre o laranja principal pode não alcançar contraste AA; preferir grafite. Verificar contraste conforme WCAG, sem presumir que a cor da marca resolve todos os usos.

### 3.3. Fontes e licenças

Arquivos disponibilizados pelo proprietário: Big Shoulders, Inter, Neue Montreal e Heading Now.

- **Big Shoulders:** título condensado, números, macro-hierarquia; pacote enviado possui `OFL.txt`. Confirmar correspondência visual com “Big Shoulders Display” citado no PPT.
- **Inter:** texto corrido, botões, formulários, admin; pacote enviado possui `OFL.txt`.
- **Neue Montreal:** subtítulos/informações institucionais; pacote **não contém licença** explícita; usar webfont somente com direitos confirmados, caso contrário fallback (`Inter`).
- **Heading Now:** grande título expressivo; ZIP contém arquivos `HeadingNowTrial` e documento de licença de avaliação/não comercial. **NÃO hospedar/distribuir fontes trial na web ou no GitHub**. Usar fallback autorizado até comprovação de licença e webfont apropriada.

Sugerir `font-display: swap`, WOFF2 licenciado e subset por idioma. No sistema de administração, oferecer apenas famílias permitidas, não upload irrestrito de executáveis. Não compartilhar os arquivos originais das fontes nos artefatos de documentação.

| Nível | Desktop | Mobile | Exemplos |
|---|---|---|---|
| Display | `clamp(4.5rem, 7.5vw, 9rem)` | `clamp(3rem, 11vw, 4.75rem)` | Olá!, Contato |
| Título de seção | `clamp(3rem, 5vw, 5.5rem)` | `clamp(2.375rem, 9vw, 3.5rem)` | Resultados, Ferramentas |
| Subtítulo | 26–36px | 22–28px | Títulos de experiência |
| Título de card | 20–28px | 18–22px | Projetos e competências |
| Corpo | 17–19px | 16–17px | Textos e descrições |
| Legenda/metadados | 13–15px | 12–14px | Datas e localizações |

Corpo: line-height ~1.5–1.6, leitura ideal de ~55–75 caracteres por linha; títulos condensados podem ter line-height menor sem sobreposição. Títulos não devem reduzir indefinidamente para caber.

### 3.4. Grids e margens

**Desktop** (referência 1920×1080): container até 1680px; margem horizontal fluida 48–96px; respiro vertical 40–72px; grid de 12 colunas com gutter próximo de 24px; divisão visual 4/8, 5/7 ou 6/6 conforme seção; padding de cards 24–32px. Uma seção deve ocupar ao menos a altura útil da janela, sem impedir overflow quando necessário.

**Mobile** (referência visual 1080×1920; teste funcional ~390×844): 4 colunas; margem externa 20–24px; padding de card 12–16px; espaço entre itens 12–16px; header 56–64px e margem de segurança para sistema operacional. Títulos grandes precisam quebrar de forma deliberada, jamais ultrapassar o viewport.

**Tablet:** avaliar a melhor abordagem por espaço útil e densidade, não só pelo valor de largura. Breakpoints iniciais em torno de 768px e 1200px, sujeitos a avaliação.

Tokens: espaçamento de base 4px e escala 4, 8, 12, 16, 24, 32, 48, 64, 96; border-radius de 4, 8, 12 e 20px, usando raios discretos e consistentes. Linha divisória fina de baixa opacidade.

### 3.5. Componentes essenciais

`SiteShell`, `GlobalNavigation`, `NavDrawer`, `SectionIndicator`, `MobilePanelIndicator`, `SectionRenderer`, `ResponsivePanel`, `HeroSplit`, `EditorialHeading`, `MediaFrame`, `CircularMotif`, `ArrowIcon`, `MetricCard`, `SkillTag`, `CompetencyList`, `ProjectCard`, `ExperienceHeader`, `Timeline`, `Accordion`, `Tabs`, `ModalDetail`, `LogoBadge`, `QuoteCard`, `ContactLink`, `RevealOnView`, `LoadingState`, `EmptyState`, `ErrorState`, `AdminLayout`, `MediaPicker`, `BlockEditor`, `SectionEditor`, `ThemeEditor`, `PreviewMode`.

Implementar semântica nativa e permitir configurações via dados: `variant`, `layout`, `align`, `spacing`, `theme`, `animation_preset`, `visibility`, `order`, `background`, `media_fit`, `mobile_panel_id` etc. Validar essas chaves.

---

## 4. Layout adaptativo e tela inteira

### 4.1. Modelo conceitual

```text
Site
 └─ Página pública
     ├─ Seção lógica (id persistente, slug para âncora, sort_order)
     │   ├─ Dados de conteúdo: textos, mídia, métricas, projetos, competências
     │   ├─ Desktop: painel único / layout configurável
     │   └─ Mobile: painel A + painel B / placements configuráveis
     └─ Navegação e tema global
```

Dados principais não devem ser copiados para criar páginas mobile; usar `content_block_id` compartilhado com regras de placement/variante por breakpoint. Permitir resumo mobile opcional como campo editorial e manter acesso ao texto completo por expansão/modal/rota.

### 4.2. Regras por dispositivo

- Desktop: viewport inteiro como meta visual; `min-height: 100vh` com refinamento por altura útil.
- Mobile: cada painel A/B visa 100% da altura estável, com `min-height:100svh` e adaptações quando barras de navegador alteram dimensões; `100dvh` pode ser útil em contextos específicos, mas deve ser testado.
- Não impor `height: 100vh` + `overflow:hidden` em conteúdo textual.
- Se conteúdo real, idioma, ampliação ou viewport pequeno impedir ajuste, permitir que o painel ultrapasse 100% de altura ou abra detalhes sem eliminar a informação.
- Respeitar `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)`.
- As âncoras apontam para início de seção; em mobile, painel A; painel B pode ter id auxiliar estável (`perfil-b`), sem perder a âncora principal.
- H1 único principal; H2 por seção e hierarquia semântica de headings dentro dos painéis.

### 4.3. Compactação por tipo

| Tipo | Padrão desktop | Padrão mobile |
|---|---|---|
| Métricas | 3–4 colunas com título e descrição | grid 2×2 ou vertical; detalhes ao toque |
| Projetos | cards/texto lado a lado | card resumido, expandable details |
| Experiência | lista de competências e atividades | acordeões semânticos e tags |
| Timeline | duas colunas ou disposição editorial | sequência vertical numerada |
| Formação | lista em colunas | timeline acadêmica + idioma no painel B |
| Ferramentas | grupos 2–3 colunas | categorias com chips e expansão |
| Depoimentos | retratos e textos completos | um/depoente por card, expansão para citação integral |
| Elementos decorativos | podem ter dimensão monumental | reduzir, recortar com critério ou reposicionar |

Não usar carrossel horizontal sem indicação de que há mais conteúdo; controles anterior/próximo e foco acessíveis. Não transformar números em imagens com baixa qualidade.

### 4.4. Scroll e comportamento

Preferir scroll nativo com `scroll-snap-type: y proximity` e `scroll-snap-align: start` nos painéis. Suspender/afrouxar snapping quando blocos expandidos ficarem mais altos que o viewport. Usar `scroll-margin-top` para compensar header. A navegação deve funcionar com mouse, trackpad, toque, teclado e readers.

**Anti-padrões:** bloquear roda do mouse, interceptar toda rolagem com JavaScript, forçar `mandatory` em conteúdo alto, nesting de múltiplos scroll containers sem necessidade, renderizar apenas slide visível e remover texto do DOM de forma que leitores de tela não encontrem conteúdo.

---

## 5. Menu, URLs e comportamento de navegação

### Desktop
- Header fixo, discreto e adaptável ao contraste da seção atual.
- Marca tipográfica/assinatura à esquerda; botão MENU à direita.
- Drawer lateral ou painel de navegação com grupos semânticos, com **todos os 14 destinos** acessíveis.
- Indicador `01/14` a `14/14`, opcionalmente pontos/progresso editorial.
- Fechamento por botão, Escape, mudança de destino, ou clique fora (com semântica correta).

### Mobile
- Header compacto de 56–64px, respeitando safe-area; menu acessível com área de toque ≥44×44px.
- Menu em drawer ou overlay com itens grandes e scroll próprio quando necessário.
- Indicador de seção + subpainel, por exemplo `08/14 · 2/2`.
- Ao tocar em uma âncora, fechar menu e ir ao painel A da seção sem trancos.

### Âncoras

`#perfil`, `#sobre`, `#resultados`, `#competencias`, `#formacao`, `#invest-rs`, `#prefeitura-sp`, `#vale`, `#globo-sportv`, `#inpress`, `#cdi`, `#ferramentas`, `#depoimentos`, `#contato`.

- Alterar hash e histórico de forma coerente, sem inserir entradas excessivas a cada pixel de scroll.
- Destacar link atual com IntersectionObserver, observando o início e/ou maior área visível da seção.
- Respeitar `prefers-reduced-motion` e permitir navegação imediata sem animação.
- Manter estado de foco do drawer; foco retorna ao acionador ao fechar.
- Nomes, grupos, ordem e visibilidade do menu editáveis no CMS sem modificar as âncoras publicadas inadvertidamente. Caso slug mude, preservar redirecionamento ou alias.

---

## 6. Animações e microinterações

**Direção:** editorial, curta, funcional, sem parecer apresentação de slides descontrolada.

| Preset | Propriedades iniciais | Aplicar em |
|---|---|---|
| `none` | sem animação | reduced motion / escolha do usuário |
| `fade-in` | opacidade 0→1, 250–450ms | conteúdo secundário |
| `fade-up` | opacidade + translateY 16–24px, 450–600ms | títulos e cards |
| `stagger` | 60–90ms de intervalo | conjuntos de cards/listas |
| `image-reveal` | clip/opacity, 500–700ms | fotografias e ilustrações |
| `metric-count` | 700–1000ms, sem alterar leitura final | números em destaque |
| `nav-drawer` | 200–300ms ease-out | abrir/fechar menu |
| `hover-arrow` | translate 3–5px, 150–220ms | CTA, links clicáveis |
| `circle-subtle` | deslocamento/scale suave | elementos geométricos |

- Usar transform e opacity preferencialmente, sem animações custosas de layout.
- Respeitar `prefers-reduced-motion` integralmente.
- Focar reveal na **entrada**; não fazer texto desaparecer abruptamente na **saída**.
- Animation presets parametrizáveis pelo admin com validação (`duration`, `delay`, `distance`, `enabled`, `once`) e limites máximos.
- Não animar cada palavra/caractere do conteúdo longo, especialmente no mobile.
- Scroll nativo tem prioridade sobre encadeamentos de timing.

---

## 7. Painel administrativo — escopo operacional

### 7.1. Rotas e acesso

- `/admin/login`: tela limpa, distinta do site público, login via Supabase Auth.
- `/admin`: dashboard privado com atalhos, estado da publicação, conteúdo incompleto e ações recentes.
- `/admin/sections`: seção e painéis, ordenação, duplicação, visibilidade, exclusão com confirmação.
- `/admin/sections/:id`: editor de blocos, variants, distribuição desktop/mobile e previews.
- `/admin/content`: coleções de experiências, resultados, projetos, formação, competências, depoimentos, ferramentas e contato.
- `/admin/media`: upload/biblioteca, metadados, tags, alt e créditos.
- `/admin/design`: tokens de cores, fontes permitidas, espaçamento, parâmetros e presets de estilo.
- `/admin/navigation`: itens, rótulos, grupos, alvos, ordem e ocultação.
- `/admin/seo`: metadados globais e por página.
- `/admin/revisions`: histórico de publicações e restauração básica (quando tecnicamente viável).

Esses caminhos são recomendados; UX pode combinar páginas se preservado o escopo funcional.

### 7.2. Capacidades e regras

- **CRUD real e persistido:** adicionar, editar, ocultar, remover/arquivar, duplicar e reordenar.
- **Pré-visualização:** alternância desktop/mobile com tela por tela e visualização de conteúdo draft protegido.
- **Tema:** editor de cores globais, fonte/escala, largura de container, espaçamento, fundo e estilo de card.
- **Layout:** escolhas de templates do catálogo, alinhamentos, colunas, ordem do bloco, colocação no mobile A/B, ocultação visual restrita e override por breakpoint.
- **Conteúdo:** campos editáveis para títulos, descrições, números, datas, empresas, tags, arquivos e links.
- **SEO:** título, resumo, Open Graph, imagem social, robots/canonical (quando aplicável).
- **Rascunho/publicação:** `draft`, `in_review`, `published`, `archived`, com prévia protegida; nenhum texto experimental precisa ser publicado compulsoriamente.
- **Histórico mínimo:** registrar editor/data/mudanças essenciais; oferecer confirmação antes de ações destrutivas.
- **Erros:** mensagens legíveis, estados de carregamento, erro de rede e sucesso; feedback sem afirmar sucesso antes do retorno do servidor.
- **Controles acessíveis:** reordenação por botões além de drag-and-drop; formulário com labels, foco e atalhos adequados.
- **Segurança:** não permitir JSX/JS/CSS arbitrário salvo e executado a partir do banco; configurações passam por allowlist/validação tipada.
- **Visual editor:** um catálogo de componentes/configurações (block-based CMS), não um clone irrestrito de Figma. Essa é a fronteira intencional entre flexibilidade e confiabilidade.

### 7.3. Tratamento de conteúdo provisório

Cada registro relevante deve ter `editorial_status` e, quando necessário, `is_placeholder`/`editorial_note`. Em dashboard, exibir contagem de itens pendentes e sinalizar em preview. Na publicação, bloquear apenas campos realmente obrigatórios à integridade da página; oferecer escolha explícita de manter, ocultar ou publicar elementos pendentes. Nunca converter placeholder em valor fictício.

### 7.4. Escopo editável no nível de detalhe

| Entidade | Edição exigida |
|---|---|
| Site | nome, descrição, idioma, links sociais, favicon, SEO |
| Seção | título, slug, ordem, fundo, visibilidade, variante, tema |
| Painel | A/B mobile, tema, cor, fundo, animações e placements |
| Bloco | texto, mídia, variante, ordenação, estilo, visibilidade, animação |
| Mídia | upload, substituição, formatos, alt, título, crédito, recorte/foco |
| Navegação | rótulo, agrupamento, âncora, ordem, exibição |
| Conteúdo estruturado | experiência, formação, projetos, competências, ferramentas, depoimentos, contatos |
| Design tokens | cores, fontes permitidas, tamanho, espaçamento, bordas, layout |
| Publicação | drafts, preview, published_at, revisão e rollback básico |

---

## 8. Supabase: estrutura de dados e segurança

### 8.1. Conexão e responsabilidade

- Existe um projeto Supabase: `zfnrhzplwpjpdljraypt`.
- A URL pública **não equivale** a uma conexão autenticada. Efetuar integração por mecanismo autorizado, seguindo Figma Make → Settings → Integrations → Supabase, quando disponível.
- Não criar novo projeto Supabase.
- Utilizar Postgres relacional e migrations. Caso o Figma Make apenas consiga gerenciar armazenamento key-value pela integração nativa, preparar os scripts SQL e código cliente de modo que sejam aplicados ao projeto existente; não substituir silenciosamente o banco relacional por KV.
- Verificar esquema existente antes de migrar; nunca apagar tabelas/dados existentes sem autorização explícita.
- Secrets fora do código público. Na UI do usuário usar apenas chave publicável com RLS. Nunca usar `service_role` no navegador.

### 8.2. Proposta de modelo relacional

Ajustar semântica, normalização e índice conforme implementação, mas preservar esses conceitos:

| Tabela | Campos mínimos / relacionamentos |
|---|---|
| `site_settings` | `id`, `site_title`, `locale`, `description`, `favicon_media_id`, `updated_at` |
| `design_tokens` | `id`, `token_key`, `token_value`, `value_type`, `scope`, `updated_at` |
| `pages` | `id`, `slug`, `title`, `seo_title`, `seo_description`, `status`, `published_at` |
| `sections` | `id`, `page_id`, `slug`, `title`, `sort_order`, `layout_variant`, `status`, `is_visible` |
| `section_panels` | `id`, `section_id`, `breakpoint`, `panel_key` (`desktop`, `mobile-a`, `mobile-b`), `theme`, `sort_order`, `layout_variant` |
| `content_blocks` | `id`, `section_id`, `block_type`, `content_json`, `media_id`, `status`, `is_placeholder`, `editorial_note` |
| `block_placements` | `id`, `block_id`, `panel_id`, `sort_order`, `layout_variant`, `style_config`, `motion_config`, `is_visible` |
| `navigation_items` | `id`, `label`, `target_slug`, `group_name`, `sort_order`, `is_visible` |
| `media_assets` | `id`, `storage_bucket`, `storage_path`, `mime_type`, `width`, `height`, `alt_text`, `credit`, `status` |
| `career_experiences` | `id`, `company`, `role`, `location`, `start_date`, `end_date`, `description`, `sort_order`, `status` |
| `portfolio_projects` | `id`, `experience_id`, `title`, `summary`, `details`, `project_status`, `sort_order`, `status` |
| `metrics` | `id`, `section_id`, `label`, `value_text`, `unit`, `context`, `sort_order`, `status` |
| `skills` | `id`, `name`, `category`, `sort_order`, `status` |
| `education` | `id`, `institution`, `course`, `start_date`, `end_date`, `sort_order`, `status` |
| `language_levels` | `id`, `language`, `level_label`, `evidence_note`, `sort_order`, `status` |
| `tool_categories` | `id`, `title`, `sort_order`, `status` + tabela vinculada de ferramentas, se necessário |
| `testimonials` | `id`, `author_name`, `author_role`, `quote_text`, `photo_media_id`, `sort_order`, `status` |
| `contact_channels` | `id`, `channel_type`, `label`, `value`, `url`, `sort_order`, `status` |
| `content_revisions` | `id`, `entity_type`, `entity_id`, `snapshot_json`, `actor_user_id`, `created_at` |
| `editorial_issues` | `id`, `section_id`, `field_path`, `description`, `source_a`, `source_b`, `status`, `resolution` |
| `admin_users` | `user_id` (FK `auth.users`), `role`, `created_at`; atualização restrita a administradores autorizados |
| `audit_logs` | `id`, `user_id`, `action`, `entity_type`, `entity_id`, `created_at`, `metadata` |

Preferir tabelas normalizadas nas entidades editoriais relevantes, mas `content_json` e `style_config` tipados podem armazenar configuração de variantes e módulos sem explosão de tabelas. Incluir chaves estrangeiras, índices de FK/status/ordem, timestamps e constraints de unicidade (`page_id+slug`, `section_id+panel_key+breakpoint` quando pertinente).

### 8.3. Estratégia de draft/published

- Visitante (`anon`) pode consultar somente conteúdo publicado e visível necessário ao site.
- Admin autorizado pode criar, ler e alterar drafts, publicar e arquivar.
- Evitar expor drafts via views que bypassam RLS ou por objetos em buckets públicos.
- Para preview de drafts, exigir sessão admin e aplicar guard de autorização na camada de dados, não apenas esconder link.
- Se um tema global ainda não publicado foi editado, só mostrá-lo no preview até publicar.
- Manter datasets de seed baseados nos materiais, marcados como rascunho quando inconclusos.

### 8.4. Auth e roles

- Supabase Auth com login administrativo.
- `admin_users` ou modelo equivalente de papel autorizado; criar a primeira conta de admin por procedimento explícito de setup, usando UID obtido após login/convite e inserção privilegiada segura.
- **Não** permitir cadastro público virar admin automaticamente e **não** liberar operações apenas porque o usuário está `authenticated`.
- Não confiar em `user_metadata` alterável pelo usuário para autorização.
- Políticas devem testar identidade administrativa por dado protegido ou claim de autorização confiável. Se função `security definer` for indispensável, restringir grants, colocar fora do schema public quando possível e auditar seu uso.
- Atualização de dados requer políticas `SELECT` e `UPDATE` adequadas; `UPDATE` deve incluir `USING` e `WITH CHECK` apropriados.

### 8.5. RLS e privileges

**Regra geral: RLS habilitada em TODAS as tabelas expostas.**

1. Anônimo: `SELECT` somente conteúdo `published` e `is_visible = true`, quando couber; sem `INSERT`, `UPDATE`, `DELETE`.
2. Autenticado comum: mesmas permissões públicas até que seja comprovadamente admin.
3. Admin: operações específicas autorizadas e auditadas.
4. Informações privadas como `audit_logs`, drafts, contatos administrativos e originais não são públicos.
5. Storage com políticas explícitas (`SELECT`, `INSERT`, `UPDATE`, `DELETE` conforme fluxo) e sem acesso público a bucket privado.
6. Garantir que permissões de schema/Data API estejam compatíveis com RLS; `GRANT` e RLS resolvem camadas distintas.
7. Testar tentativas negativas (anon editar, usuário comum promover-se, arquivo privado acessível sem login etc.).

### 8.6. Storage

- Bucket `portfolio-public` (ou equivalente): fotos, logos e mídias efetivamente publicadas, com URLs públicas permitidas.
- Bucket `portfolio-private` (ou equivalente): originais, drafts, anexos e mídias ainda não aprovadas; usar URLs assinadas para previews autenticados.
- Ao publicar, promover/copiar ativo aprovado para bucket público ou adotar fluxo equivalente com referências estáveis.
- Metadata: alt, legenda, crédito, foco/recorte, dimensões, tipo MIME, tamanho, destino e status.
- Validar tamanho/formatos; formatos web otimizados para fotos, SVG confiáveis para ilustrações e logos; impedir upload executável perigoso.

### 8.7. Migrations, seeds e testes

Gerar versionamento de schema (arquivos SQL em `supabase/migrations/`, com nomes corretos conforme CLI vigente). O prompt não equivale a migration: a implementação deve produzir arquivos executáveis. Gerar `supabase/seed.sql` contendo dados editoriais reais dos anexos e status coerentes; não injetar admin inventado nem secrets. Criar testes SQL/manuais de RLS e manual de rollback/backup. Ao aplicar mudanças, verificar retorno real do banco e advisors de segurança quando disponíveis.

**Critérios de teste obrigatórios:**
- Um visitante lê as seções publicadas sem autenticação.
- Um visitante NÃO edita conteúdo e NÃO acessa drafts ou mídias privadas.
- Uma pessoa autenticada sem papel admin não edita conteúdo.
- Admin altera texto, ordem, cor e mídia; ao publicar, o site reflete os dados.
- Um admin não pode escalar outro usuário sem política apropriada.
- Acesso a bucket privado não funciona sem autorização.

---

## 9. Arquitetura frontend e organização do repositório

### 9.1. Stack

- React + TypeScript, utilizando empacotamento compatível com o código gerado pelo Figma Make; Vite/React é aceitável quando for o ambiente suportado.
- CSS modular/tokens e componentes reutilizáveis; pode usar Tailwind se estiver integrado de forma consistente, com tokens centralizados.
- Supabase JS com variáveis de ambiente **publicáveis** no frontend.
- Navegação por âncoras da página pública; roteamento apropriado para admin/login e previews.
- Evitar dependências da ferramenta de geração que impossibilitem executar localmente/na Vercel.
- SEO com metadados e HTML semântico; considerar estratégia de pré-renderização/SSR se compatível com stack, registrando limitações de SPA quando persistirem.

### 9.2. Organização proposta

```text
/
├── README.md
├── guidelines.md
├── .env.example
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── RESPONSIVE_LAYOUT.md
│   ├── UX_UI_MOTION.md
│   ├── CONTENT_MODEL.md
│   ├── ADMIN_CMS.md
│   ├── SECURITY_RLS.md
│   ├── DEPLOYMENT.md
│   └── OPEN_ISSUES.md
├── src/
│   ├── app/
│   ├── components/
│   │   ├── ui/
│   │   ├── editorial/
│   │   └── admin/
│   ├── features/
│   │   ├── public-site/
│   │   ├── cms/
│   │   └── auth/
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase/
│   │   └── validators/
│   ├── styles/
│   ├── types/
│   └── content/    # apenas fallback/seed, NÃO fonte de verdade pública
└── supabase/
    ├── migrations/
    ├── seed.sql
    └── tests/
```

### 9.3. GitHub e Vercel

- Versionar código, migrations, schemas, docs e `.env.example`, **não** as chaves secretas.
- Configurar previews/builds na Vercel quando as conexões apropriadas estiverem autorizadas.
- Registrar comandos reais de `install`, `dev`, `build`, `test` e `deploy` no `README.md`.
- Lembrar que o fluxo padrão Push to GitHub do Figma Make é unidirecional e pode sobrescrever mudanças feitas diretamente no repositório em pushes posteriores; documentar a gestão desse risco, sem afirmar sincronização bidirecional.
- Não afirmar “deploy realizado”, “repo criado” ou “banco migrado” sem execução e confirmação verificável.

---

## 10. Acessibilidade, SEO, performance, qualidade

### 10.1. Acessibilidade

- Texto de leitura com contraste suficiente; foco de teclado destacado e hierarquia adequada.
- Sem conteúdo cortado sob ampliação até 200% e layout que reflua sem rolagem horizontal no mobile.
- Menu, acordeões, modais, tabs e carrosséis com ARIA e semântica corretas; use nativos quando possível.
- Botões com área de toque ≥44×44px; labels consistentes.
- Respeitar `prefers-reduced-motion` e oferecer navegação sem animações não essenciais.
- Modal com foco preso durante abertura, Escape para fechar e retorno de foco.
- Seções em HTML semântico; títulos/números não podem ser apenas imagens.

### 10.2. SEO

- Título e descrição global editáveis, metadados Open Graph/Twitter, favicon, imagem de compartilhamento.
- Estrutura H1/H2/H3 coerente, URLs/âncoras estáveis, imagens com alt e links reais.
- Considerar JSON-LD `Person`/`ProfilePage` somente com campos existentes e verificáveis; não inventar instituições ou prêmios.
- Sitemap, robots e canonical conforme tecnologia e domínio final; sem URL inventada como canônica.
- Conteúdo importante legível em HTML renderizado; se SPA apresentar limitação de indexação, registrar necessidade de SSR/prerender em relatório.

### 10.3. Performance

- Lazy loading de fotos abaixo da dobra, tratamento correto da hero.
- Fontes otimizadas e licenciadas, peso reduzido e política de `font-display`.
- Imagens adaptativas com tamanhos físicos apropriados; não carregar PDF inteiro como imagem de fundo.
- Animações por transform/opacity, evitar layouts animados pesados.
- Carregamento inicial rápido, sem dependência de segredos no client.
- Fallback, loading, empty states e mensagens de erro honestas quando o Supabase não estiver disponível.

### 10.4. Matriz de testes visuais

| Cenário | O que validar |
|---|---|
| Desktop 1920×1080 | fidelidade aos 14 layouts, hierarquia e respiro |
| Desktop 1440×900 | proporções e sem overflow horizontal |
| Notebook 1366×768 | textos densos e altura baixa |
| Tablet ~768px | transição adequada sem imagens ou cards cortados |
| Mobile 390×844 | 28 painéis, menu, fotos, CTA, scroll |
| Mobile 360×800 | legibilidade dos títulos e cards |
| Mobile 320px | reflow e acessibilidade |
| Zoom 200% | sem perda de conteúdo ou botões encobertos |
| Reduced-motion | sem animações obrigatórias |
| Teclado | menu, acordeões, drawers, modal, foco |
| Link externo | HTTPS ou ação `mailto:/wa.me` correta |

---

## 11. Critérios de aceite e rastreabilidade

Uma entrega só pode ser marcada como concluída quando houver evidência de funcionamento. Usar checklist no README e relatório final.

### Público / UX

- [ ] 14 seções lógicas desktop, na ordem correta, com URLs de âncora estáveis.
- [ ] 28 painéis mobile, derivados de 14 seções; os painéis `#perfil-a` e `#perfil-b` preservam a hierarquia visual das páginas 1 e 2 do PDF mobile, com cinco áreas numeradas e seis experiências, sem cópia rasterizada nem texto cortado.
- [ ] Menu desktop/mobile funcional e acessível; rolagem por âncora com estado/histórico coerente.
- [ ] Sem conteúdo cortado por height/overflow em viewport curto ou com zoom.
- [ ] Componentes reutilizáveis, tipografia real e paleta/tokens definidos.
- [ ] Motivos geométricos, fotos, divisórias, números e ritmo editorial respeitados.
- [ ] Motion presets, reduced motion e estados hover/focus.

### Admin / dados

- [ ] Autenticação funcional com admin autorizado.
- [ ] CRUD persistente de seções, blocos, menu e conteúdo editorial.
- [ ] Editar cores, fontes permitidas, espaçamento e estilos sem mexer no código.
- [ ] Editar ordem e visibilidade de seções e divisão A/B mobile.
- [ ] Upload e substituição de imagem; alt text e licença/crédito.
- [ ] Pré-visualizar rascunho, publicar, ver alterações no site público.
- [ ] Status de placeholders e pendências editoriais visíveis no painel.
- [ ] Nenhum controle visual apresentado como funcional sem persistência real.

### Banco / segurança

- [ ] Projeto Supabase correto `zfnrhzplwpjpdljraypt` identificado.
- [ ] Migrations SQL completas e registradas; seed de conteúdo real.
- [ ] RLS habilitada e políticas testadas para público e admin.
- [ ] Buckets públicos/privados e políticas de Storage.
- [ ] Nenhum segredo inserido em bundle client ou arquivos versionados.
- [ ] Teste negativo: usuário anônimo/comum não consegue editar/ler drafts.

### Engenharia / documentação

- [ ] Código TypeScript compilável e build funcional.
- [ ] README, guidelines, docs de arquitetura/CMS/design/segurança/deploy.
- [ ] `.env.example` sem credenciais secretas.
- [ ] Configuração de repositório e deploy documentada, com status confirmado.
- [ ] Lista de pendências por severidade, sem confundir arquivo gerado com recurso testado.

---

## 12. Instruções operacionais para o Figma Make — executar em uma rodada

1. **Ler completamente** o prompt principal, este arquivo e os PDFs anexos. O PDF desktop é estilo e composição, não uma imagem para renderizar como página inteira.
2. Preparar estrutura de componentes, estilos e dados; montar as 14 seções públicas, incluindo layout mobile A/B de todas elas.
3. Implementar menu por âncoras, indicadores, comportamento de scroll, interações e animacões acessíveis.
4. Implementar o painel administrativo com autenticação e operações reais de edição/persistência.
5. Integrar projeto Supabase existente. Quando a conexão depender de autorização do proprietário, pedir apenas o passo necessário, continuar o restante e **gerar migrations SQL e clientes reais** mesmo sem acesso imediato.
6. Criar RLS, buckets, testes, seeds e documentação de integração. Não apagar dados/tabelas do projeto existente.
7. Executar testes disponíveis (build, navegação, mobile, admin e segurança); corrigir erros detectados.
8. Produzir relatório objetivo de: **Implementado e validado / Gerado e aguardando aplicação / Não executável neste ambiente / Pendências editoriais**.

**Não parar depois do plano. Não declarar o projeto concluído com apenas uma landing page. Não substituir integrações impossíveis por simulações silenciosas. Não inventar números, fatos, licenças ou privilégios administrativos.**

## 13. Referências técnicas oficiais para consulta

- Figma Make, anexos: <https://help.figma.com/hc/en-us/articles/31304529835671-Attach-files-to-a-prompt-in-the-Figma-agent-and-Figma-Make>
- Figma Make, integração backend: <https://help.figma.com/hc/en-us/articles/32640822050199-Add-a-backend-to-a-functional-prototype-or-web-app>
- Figma Make → GitHub: <https://help.figma.com/hc/en-us/articles/35463818346647-Push-from-Figma-Make-to-GitHub>
- Documentação Supabase: <https://supabase.com/docs>
- Segurança Supabase: <https://supabase.com/docs/guides/security/product-security>
- MDN Scroll Snap: <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap>
- MDN reduced motion: <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>

## 14. Observação final

Este arquivo estabelece o alvo do **projeto completo**. Os PDFs trazem o design e o conteúdo editorial; este Markdown traz as regras de produto e engenharia. Quando houver incompatibilidade técnica ou ausência de autorização, documentar limites e **entregar o máximo verificável**, sem abandonar as outras partes do escopo.
