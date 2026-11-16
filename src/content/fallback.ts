import type { PortfolioSection } from "../types/content"
import { resultThemeContent } from "./resultThemes"

export { defaultTokens } from "./defaultTokens"

export const sections: PortfolioSection[] = [
  {
    id: "seed-perfil",
    slug: "perfil",
    number: 1,
    title: "Tulius Tsangaropulos",
    eyebrow:
      "Comunicação Corporativa e Institucional · Coordenação de Comunicação · RP, Reputação, Assessoria e Estratégia Digital",
    intro: "Foco em gerar conexões autênticas e projetos inovadores.",
    theme: "paper",
    layout: "hero",
    status: "published",
    animation: "fade-up",
    visible: true,
    panelA: [
      {
        title: "+15 ANOS",
        label: "Experiência",
        text: "de experiência em Comunicação, Marketing e Conteúdo",
        image: "/media/tulius-portrait-dark.jpg",
        alt: "Retrato em preto e branco de Tulius Tsangaropulos",
        hero: {
          panelBackground: "#171617",
          badgeText: "VISÃO 360° DA COMUNICAÇÃO E MARKETING ·",
          badgeVisible: true,
          badgeBackground: "#FF5414",
          badgeColor: "#171617",
          introColor: "#FFFFFF",
          desktop: {
            visualHeight: 45,
            imageWidth: 52,
            imageHeight: 100,
            imagePositionX: 50,
            imagePositionY: 0,
            yearsX: 50,
            yearsY: 10,
            yearsWidth: 43,
            badgeSize: 34,
            badgeX: 55,
            badgeY: 74,
            contentGap: 10,
          },
          mobile: {
            imageWidth: 46,
            imageHeight: 100,
            imagePositionX: 50,
            imagePositionY: 0,
            badgeSize: 28,
            badgeX: 5,
            badgeY: 72,
          },
        },
      },
      {
        title: "Experiência em grandes empresas",
        text: "TV Globo, Vale e Prefeitura de São Paulo",
        icon: "arrow",
      },
      {
        title: "Experiência internacional",
        text: "Correspondente internacional na China, intercâmbio em Dublin, curso em Buenos Aires e vivências em 34 países.",
        icon: "arrow",
      },
      {
        title: "Liderança de equipes",
        text: "Relacionamento com stakeholders, planejamento e visão estratégica",
        icon: "arrow",
      },
      {
        title: "Idiomas",
        text: "Inglês fluente e espanhol avançado",
        icon: "arrow",
      },
    ],
    panelB: [
      { title: "Comunicação Corporativa", themeKey: "corporativa", label: "01" },
      { title: "Gestão e execução de projetos", themeKey: "projetos", label: "02" },
      { title: "Relações públicas e gestão de eventos", themeKey: "eventos", label: "03" },
      { title: "Marketing digital, branding e performance", themeKey: "marketing", label: "04" },
      { title: "Imprensa e influenciadores", themeKey: "imprensa", label: "05" },
      {
        title: "Invest RS",
        targetSlug: "invest-rs",
        meta: "Porto Alegre · 2026",
        text: "Gestão de Eventos · Comunicação Institucional · Relações Públicas · Inovação Digital",
      },
      {
        title: "Prefeitura de São Paulo",
        targetSlug: "prefeitura-sp",
        meta: "2024–2026",
        text: "Liderança de Equipes · Relacionamento com a Imprensa · Gestão de Crise · Estratégia Digital · Comunicação Interna · Media Training",
      },
      {
        title: "Vale",
        targetSlug: "vale",
        meta: "São Paulo · 2020–2024",
        text: "Comunicação Corporativa Global · Comunicação Executiva · Gestão de Projetos · Campanhas Digitais · Reputação e Gestão de Crise",
      },
      {
        title: "Grupo InPress",
        targetSlug: "inpress",
        meta: "São Paulo · 2019–2020",
        text: "Assessoria de Imprensa · Relações Públicas · Gestão de Contas · Comunicação Integrada · Branding e Design",
      },
      {
        title: "TV Globo/SporTV",
        targetSlug: "globo-sportv",
        meta: "Rio de Janeiro, Pequim e São Paulo · 2015–2019",
        text: "Jornalismo · Correspondente Internacional · Produção, Reportagem e Edição · Conteúdo Editorial",
      },
      {
        title: "CDI Comunicação",
        targetSlug: "cdi",
        meta: "São Paulo · 2014–2015",
        text: "Planejamento Estratégico · Comunicação Institucional · Relações Públicas · Gestão de Stakeholders",
      },
    ],
  },
  {
    id: "seed-sobre",
    slug: "sobre",
    number: 2,
    title: "Olá!",
    eyebrow: "Prazer, sou o Tulius",
    intro:
      "Jornalista e profissional sênior de Comunicação e Marketing, com mais de 15 anos de experiência em empresas globais, imprensa, agências e setor público.",
    theme: "orange",
    layout: "editorial",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Imagem da seção 02",
        image: "/media/tulius-portrait.jpg",
        alt: "Retrato de Tulius Tsangaropulos",
        aboutDesktopImage: "/media/tulius-contact.jpg",
        aboutDesktopAlt: "Tulius Tsangaropulos segurando um tablet",
      },
    ],
    panelB: [
      {
        title: "Estratégia também é escuta.",
        text: "Uma trajetória conectando organizações e pessoas.",
      },
      {
        title: "Comunicação de ponta a ponta",
        text: "Conecto estratégia, reputação, conteúdo, tecnologia e gestão de projetos.",
      },
      {
        title: "Visão editorial",
        text: "Clareza para temas complexos, repertório internacional e execução orientada por contexto.",
      },
      {
        title: "Resultados que orientam decisões",
        text: "Indicadores e análise de desempenho para transformar estratégia em impacto mensurável.",
      },
      {
        title: "A voz de quem lidera",
        text: "Posicionamento e mensagens que fortalecem lideranças e criam conexões com públicos estratégicos.",
      },
    ],
  },
  {
    id: "seed-resultados",
    slug: "resultados",
    number: 3,
    title: "Resultados e projetos em destaque",
    theme: "paper",
    layout: "metrics",
    status: "published",
    visible: true,
    intro: "Indicadores documentados nas experiências profissionais.",
    panelA: [
      {
        title: "Comunicação Global",
        value: "14 países",
        text: "Alinhamento estratégico semanal com equipes internacionais da Vale.",
        metricIcon: "chart",
        relatedThemeKeys: ["corporativa"],
        showInOverview: false,
      },
      {
        title: "Comunicação Interna",
        value: "1.000+",
        text: "Profissionais contemplados por plataforma criada na Prefeitura de São Paulo.",
        metricIcon: "chart",
        relatedThemeKeys: ["corporativa"],
        showInOverview: false,
      },
      {
        title: "Reputação Corporativa",
        value: "+12%",
        text: "Avanço no sentimento positivo da sociedade em relação à Vale, entre resultados coletivos.",
        metricIcon: "chart",
        relatedThemeKeys: ["corporativa"],
        showInOverview: false,
      },
      {
        title: "Cultura e Pertencimento",
        value: "+28%",
        text: "Evolução do sentimento de pertencimento de empregados LGBT+ da Vale, entre resultados coletivos.",
        metricIcon: "chart",
        relatedThemeKeys: ["corporativa"],
        showInOverview: false,
      },
      {
        title: "Gestão de Projetos",
        value: "25 eventos",
        text: "Coordenação de fornecedores, logística, orçamento e comunicação na Invest RS.",
        metricIcon: "megaphone",
        relatedThemeKeys: ["projetos"],
        showInOverview: true,
        overviewOrder: 4,
      },
      {
        title: "Soluções Digitais",
        value: "3 plataformas",
        text: "Iniciativas de desenvolvimento de ferramentas para eventos, relacionamento e processos internos.",
        metricIcon: "chart",
        relatedThemeKeys: ["projetos"],
        showInOverview: false,
      },
      {
        title: "Campanhas Internacionais",
        value: "6 países",
        text: "Projetos de comunicação para recrutamento desenvolvidos na Vale.",
        metricIcon: "chart",
        relatedThemeKeys: ["projetos"],
        showInOverview: false,
      },
      {
        title: "Produção de Campanhas",
        value: "5 cidades",
        text: "Acompanhamento presencial de produções em operações brasileiras da Vale.",
        metricIcon: "chart",
        relatedThemeKeys: ["projetos"],
        showInOverview: false,
      },
      {
        title: "Eventos Internacionais",
        value: "4 países",
        text: "Atuação em eventos no Brasil, Estados Unidos, França e China pela Invest RS.",
        metricIcon: "chart",
        relatedThemeKeys: ["eventos"],
        showInOverview: false,
      },
      {
        title: "Atendimento à Imprensa",
        value: "300+",
        text: "Solicitações atendidas pela equipe da Prefeitura de São Paulo em um ano.",
        metricIcon: "chart",
        relatedThemeKeys: ["eventos"],
        showInOverview: false,
      },
      {
        title: "Relacionamento Estratégico",
        value: "15 encontros",
        text: "Encontros com jornalistas, influenciadores e formadores de opinião.",
        metricIcon: "chart",
        relatedThemeKeys: ["eventos"],
        showInOverview: false,
      },
      {
        title: "Rede de Relacionamento",
        value: "3 mil+",
        text: "Contatos estruturados em mailing institucional na Invest RS.",
        metricIcon: "chart",
        relatedThemeKeys: ["eventos"],
        showInOverview: false,
      },
      {
        title: "Mídia e Estratégia",
        value: "R$ 12 milhões",
        text: "Orçamento anual de campanhas digitais gerenciado na Vale.",
        metricIcon: "chart",
        relatedThemeKeys: ["marketing"],
        showInOverview: true,
        overviewOrder: 1,
      },
      {
        title: "Alcance no LinkedIn",
        value: "44,5 milhões+",
        text: "Membros impactados pelas campanhas digitais da Vale.",
        metricIcon: "chart",
        relatedThemeKeys: ["marketing"],
        showInOverview: false,
      },
      {
        title: "Crescimento Digital",
        value: "+48%",
        text: "Aumento de seguidores na comunicação pública da Prefeitura de São Paulo.",
        metricIcon: "chart",
        relatedThemeKeys: ["marketing"],
        showInOverview: false,
      },
      {
        title: "Performance Digital",
        value: "+225%",
        text: "Crescimento do alcance em seis meses na Prefeitura de São Paulo.",
        metricIcon: "trending",
        relatedThemeKeys: ["marketing"],
        showInOverview: true,
        overviewOrder: 2,
      },
      {
        title: "Seleção Nacional",
        value: "8 entre ~8 mil",
        text: "Um dos oito repórteres selecionados para a Globo/SporTV entre aproximadamente oito mil candidatos.",
        metricIcon: "chart",
        relatedThemeKeys: ["imprensa"],
        showInOverview: false,
      },
      {
        title: "Reportagens Internacionais",
        value: "40+",
        text: "Produções jornalísticas durante a correspondência na Ásia.",
        metricIcon: "chart",
        relatedThemeKeys: ["imprensa"],
        showInOverview: false,
      },
      {
        title: "Participações ao Vivo",
        value: "100+ ao vivo",
        text: "Entradas na programação da TV Globo e do SporTV.",
        metricIcon: "newspaper",
        relatedThemeKeys: ["imprensa"],
        showInOverview: true,
        overviewOrder: 3,
      },
      {
        title: "Cobertura Esportiva",
        value: "200+",
        text: "Jogos cobertos em mais de 20 cidades brasileiras.",
        metricIcon: "chart",
        relatedThemeKeys: ["imprensa"],
        showInOverview: false,
      },
    ],
    panelB: resultThemeContent,
  },
  {
    id: "seed-competencias",
    slug: "competencias",
    number: 4,
    title: "Comunicação e estratégia",
    theme: "cream",
    layout: "editorial",
    status: "published",
    visible: false,
    panelA: [
      {
        title: "Habilidades",
        text: "Planejamento estratégico e comunicação executiva.",
      },
      {
        title: "Gestão",
        text: "Gestão de equipes, projetos, reputação e indicadores.",
      },
    ],
    panelB: [
      {
        title: "Competências",
        text: "Comunicação corporativa, interna e digital.",
      },
      {
        title: "Relações",
        text: "Assessoria de imprensa, relações públicas e gestão de crises.",
      },
      {
        title: "Destaques",
        text: "Mais de 15 anos na Vale, TV Globo/SporTV, Invest RS, agências de comunicação e setor público.",
      },
    ],
  },
  {
    id: "seed-formacao",
    slug: "formacao",
    number: 5,
    title: "Formação",
    theme: "ink",
    layout: "timeline",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Comunicação Social — Jornalismo",
        meta: "UFRN · 2007–2012",
        label: "Graduação",
      },
      {
        title: "Comunicação Integrada e Marketing Digital",
        meta: "UnP · 2013",
        label: "Pós-graduação",
      },
      {
        title: "Marketing Digital, BI e Estratégia Data Driven",
        meta: "PUCRS · 2020–2021",
        label: "MBA",
      },
    ],
    panelB: [
      {
        title: "Swan Training Institute",
        meta: "Dublin, Irlanda · 2010–2011",
        label: "Inglês",
      },
      {
        title: "Instituto Rojas",
        meta: "Buenos Aires, Argentina · 2024",
        label: "Espanhol",
      },
    ],
  },
  {
    id: "seed-invest",
    slug: "invest-rs",
    number: 6,
    title: "Invest RS",
    eyebrow: "Gestão de eventos, comunicação institucional e projetos digitais",
    intro: "Analista Executivo · Julho/2026 – atual · Porto Alegre, RS",
    theme: "paper",
    layout: "timeline",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        {
          title: "Guia de Boas-Vindas",
          image: "/media/editorial-invest-rs-01.svg",
          alt: "Infográfico editorial de Invest RS sobre Guia de Boas-Vindas: Organização editorial do guia; Estrutura para atualização; Apoio à integração de equipes. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Organização de eventos",
          image: "/media/editorial-invest-rs-02.svg",
          alt: "Infográfico editorial de Invest RS sobre Organização de eventos: Mais de 10 eventos na atuação; Fornecedores e credenciamento; Logística, comunicação e cobertura. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Plataforma de eventos e relacionamento",
          image: "/media/editorial-invest-rs-03.svg",
          alt: "Infográfico editorial de Invest RS sobre Plataforma de eventos e relacionamento: Convites e inscrições; Check-in e segmentação de públicos; Histórico e relatórios de participação. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Estratégia de CRM e mailing institucional",
          image: "/media/editorial-invest-rs-04.svg",
          alt: "Infográfico editorial de Invest RS sobre Estratégia de CRM e mailing institucional: Governança e segmentação de contatos; Fluxos de convites e relacionamento; Integrações externas ainda planejadas. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
      ],
    },
    panelA: [
      {
        title: "Competências aplicadas",
        tags: [
          "Comunicação institucional",
          "Projetos digitais e automação",
          "Relações públicas",
          "Stakeholders",
          "Gestão de eventos",
          "Mailing e convites",
        ],
      },
      {
        title: "Guia de Boas-Vindas",
        text: "Organização editorial e estrutura de atualização do Guia de Boas-Vindas, com apoio à apresentação institucional e à integração de equipes.",
      },
      {
        title: "Organização de eventos",
        text: "Apoio à organização e à comunicação de mais de 10 eventos institucionais, incluindo a Expointer 2026: fornecedores, credenciamento, logística, materiais e cobertura.",
      },
    ],
    panelB: [
      {
        title: "Plataforma de eventos e relacionamento",
        text: "Estruturação de solução para eventos e relacionamento: convites, inscrições, check-in, segmentação de públicos e relatórios de participação.",
      },
      {
        title: "Estratégia de CRM e mailing institucional",
        isHidden: true,
        text: "Diagnóstico e proposta de modelo integrado para mailing e CRM: consolidação de contatos, segmentação, governança, fluxos de convites e histórico de relacionamento. As integrações externas permanecem planejadas.",
      },
      {
        title: "Cartões de visita digitais",
        isHidden: true,
        text: "Concepção de variantes multilíngues, QR Code e vCard.",
      },
      {
        title: "Conteúdo e apresentações institucionais",
        isHidden: true,
        text: "Produção de materiais institucionais, apresentações estratégicas e articulação com stakeholders e agências contratadas.",
      },
      {
        title: "Inovação, IA e automação",
        isHidden: true,
        text: "Participação em frentes de projetos digitais e inovação com inteligência artificial e automação aplicadas a fluxos de comunicação.",
      },
    ],
  },
  {
    id: "seed-prefeitura",
    slug: "prefeitura-sp",
    number: 7,
    title: "Prefeitura de São Paulo",
    eyebrow: "Comunicação institucional, interna e digital",
    intro: "Coordenador de Comunicação · Nov/2024 – jan/2026 · São Paulo, SP",
    theme: "paper",
    layout: "metrics",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        {
          title: "Planejamento de comunicação",
          image: "/media/editorial-prefeitura-sp-01.svg",
          alt: "Infográfico editorial de Prefeitura de São Paulo sobre Planejamento de comunicação: Comunicação institucional; Comunicação interna; Estratégia digital. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Conteúdo institucional e executivo",
          image: "/media/editorial-prefeitura-sp-02.svg",
          alt: "Infográfico editorial de Prefeitura de São Paulo sobre Conteúdo institucional e executivo: Notas oficiais e comunicados; Discursos e revistas; Materiais para diferentes públicos. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Plataforma SUBPI",
          image: "/media/editorial-prefeitura-sp-03.svg",
          alt: "Infográfico editorial de Prefeitura de São Paulo sobre Plataforma SUBPI: Portal interno concebido; Cerca de 900 colaboradores no escopo; Comunicados, relatórios e indicadores. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
      ],
    },
    panelA: [
      {
        title: "Planejamento de comunicação",
        label: "01",
        text: "Planejamento institucional, interno e digital.",
      },
      {
        title: "Conteúdo institucional e executivo",
        label: "02",
        text: "Notas oficiais, discursos, comunicados, revistas e materiais informativos.",
      },
      { title: "Seguidores orgânicos", value: "+48%" },
      { title: "Alcance de publicações", value: "+225%" },
      { title: "Colaboradores no escopo", value: "900" },
    ],
    panelB: [
      {
        title: "Imprensa e públicos estratégicos",
        label: "03",
        text: "Relacionamento com imprensa, órgãos públicos, lideranças e cidadãos.",
      },
      {
        title: "Media training e reputação",
        label: "04",
        text: "Preparação de porta-vozes, notas oficiais, suporte à crise e gestão da reputação.",
      },
      {
        title: "Plataforma SUBPI",
        text: "Portal interno concebido para cerca de 900 colaboradores, reunindo comunicados, relatórios e indicadores.",
      },
      {
        title: "Território e contexto institucional",
        text: "A Subprefeitura de Pinheiros reúne Pinheiros, Itaim Bibi, Jardim Paulista e Alto de Pinheiros, incluindo áreas estratégicas próximas às avenidas Paulista e Faria Lima.",
      },
    ],
  },
  {
    id: "seed-vale",
    slug: "vale",
    number: 8,
    title: "Vale",
    eyebrow: "Comunicação corporativa global e estratégia digital",
    intro: "Analista Sênior de Comunicação · Jun/2020 – out/2024",
    theme: "paper",
    layout: "metrics",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        {
          title: "Projetos digitais de ponta a ponta",
          image: "/media/editorial-vale-01.svg",
          alt: "Infográfico editorial de Vale sobre Projetos digitais de ponta a ponta: Planejamento, briefing e governança; Coordenação com áreas e agências; Equipe digital de seis pessoas. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Comunicação executiva e reputação",
          image: "/media/editorial-vale-02.svg",
          alt: "Infográfico editorial de Vale sobre Comunicação executiva e reputação: Conteúdo para CEO e vice-presidentes; Campanhas institucionais; Reputação corporativa. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Mídia paga e inteligência de dados",
          image: "/media/editorial-vale-03.svg",
          alt: "Infográfico editorial de Vale sobre Mídia paga e inteligência de dados: R$ 12 milhões anuais sob gestão; Indicadores e otimização; Relatórios executivos. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
      ],
    },
    panelA: [
      { title: "Orçamento anual de mídia sob gestão", value: "R$ 12 milhões" },
      {
        title: "Equipe digital integrada a áreas e agências",
        value: "6 pessoas",
      },
      {
        title: "Projetos digitais de ponta a ponta",
        label: "01",
        text: "Planejamento, briefing, governança e coordenação com equipes, agências e plataformas.",
      },
    ],
    panelB: [
      {
        title: "Comunicação executiva e reputação",
        label: "02",
        text: "Conteúdo para CEO e vice-presidentes e apoio a campanhas institucionais.",
      },
      {
        title: "Mídia paga e inteligência de dados",
        label: "03",
        text: "Planejamento, otimização de investimentos e relatórios executivos.",
      },
      {
        title: "Temas corporativos e inovação",
        label: "04",
        text: "ESG, sustentabilidade, diversidade e inclusão, comunicação digital e novas tecnologias.",
      },
    ],
  },
  {
    id: "seed-globo",
    slug: "globo-sportv",
    number: 9,
    title: "TV Globo / SporTV",
    eyebrow: "Correspondente internacional",
    intro: "Trainee, Repórter, Produtor, Editor e Correspondente · 2015–2019",
    theme: "paper",
    layout: "timeline",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        {
          title: "Produção de ponta a ponta",
          image: "/media/editorial-globo-sportv-01.svg",
          alt: "Infográfico editorial de TV Globo / SporTV sobre Produção de ponta a ponta: Pauta e apuração; Entrevistas e captação; Roteiro, reportagem e edição. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Jornalista em Pequim",
          image: "/media/editorial-globo-sportv-02.svg",
          alt: "Infográfico editorial de TV Globo / SporTV sobre Jornalista em Pequim: Correspondência internacional na China; Ciclo dos Jogos Olímpicos de 2016; Reportagens e entradas ao vivo. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Reportagens e entradas ao vivo",
          image: "/media/editorial-globo-sportv-03.svg",
          alt: "Infográfico editorial de TV Globo / SporTV sobre Reportagens e entradas ao vivo: Série sobre homofobia no futebol; Cobertura do acidente da Chapecoense; Retrospectivas e coberturas especiais. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
      ],
    },
    panelA: [
      {
        title: "Seleção nacional e formação",
        label: "01",
        text: "Selecionado entre cerca de 8 mil candidatos para uma turma de oito repórteres.",
      },
      {
        title: "Produção de ponta a ponta",
        label: "02",
        text: "Apuração, pauta, entrevistas, roteiro, gravação, reportagem e edição.",
      },
      {
        title: "Televisão e plataformas digitais",
        label: "03",
        text: "Produção jornalística para TV Globo/SporTV e Globoesporte.com.",
      },
    ],
    panelB: [
      {
        title: "Cobertura e conteúdo editorial",
        label: "04",
        text: "Séries especiais e coberturas esportivas e sociais.",
      },
      {
        title: "Jornalista em Pequim",
        label: "05",
        text: "Correspondente por cerca de um ano na China, com reportagens sobre esporte e cultura.",
      },
      {
        title: "Reportagens e entradas ao vivo",
        label: "06",
        text: "Entradas ao vivo e reportagens diárias, da apuração à edição.",
      },
      {
        title: "2015 — Seleção e formação",
        meta: "TRAJETÓRIA · 2015",
        text: "Selecionado entre aproximadamente 8 mil candidatos para integrar um grupo de oito repórteres; formação e treinamento em jornalismo e operação audiovisual na TV Globo/SporTV.",
      },
      {
        title: "2016 — Correspondência internacional na China",
        meta: "TRAJETÓRIA · 2016",
        text: "Atuação por cerca de um ano em Pequim, no ciclo dos Jogos Olímpicos do Rio 2016, com reportagens sobre esporte, cultura e sociedade.",
      },
      {
        title: "2016 — Entradas ao vivo e produção completa",
        meta: "TRAJETÓRIA · 2016",
        text: "Entradas ao vivo diárias, com responsabilidade por apuração, entrevistas, captação de imagens, roteiro, reportagem e edição.",
      },
      {
        title: "2017–2019 — Reportagem, produção e edição",
        meta: "TRAJETÓRIA · 2017–2019",
        text: "No Brasil, atuação como produtor, repórter e editor em coberturas de grande repercussão e programas especiais e retrospectivos.",
      },
      {
        title: "Série sobre homofobia no futebol",
        meta: "DESTAQUE EDITORIAL",
        text: "Primeira série sobre homofobia no futebol exibida em rede nacional, conforme o infográfico profissional fornecido.",
      },
      {
        title: "Cobertura do acidente da Chapecoense",
        meta: "DESTAQUE EDITORIAL",
        text: "Cobertura jornalística do acidente da Chapecoense, conforme a seleção de trabalhos do infográfico profissional.",
      },
      {
        title: "Programas de retrospectiva do ano",
        meta: "DESTAQUE EDITORIAL",
        text: "Participação na produção de programas especiais de retrospectiva, reunindo pautas e acontecimentos de destaque.",
      },
      {
        title: "Coberturas especiais no Brasil e no exterior",
        meta: "DESTAQUE EDITORIAL",
        text: "Reportagens e séries internacionais, incluindo produções relacionadas a Japão, Coreia do Sul, Hong Kong e Macau.",
      },
    ],
  },
  {
    id: "seed-inpress",
    slug: "inpress",
    number: 10,
    title: "Grupo InPress",
    eyebrow: "Assessoria de imprensa, relações públicas e gestão de contas",
    intro: "Analista de Comunicação e Atendimento Sênior · Nov/2019 – jun/2020",
    theme: "paper",
    layout: "timeline",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        {
          title: "Assessoria de imprensa",
          image: "/media/editorial-inpress-01.svg",
          alt: "Infográfico editorial de Grupo InPress sobre Assessoria de imprensa: Mais de 30 veiculações; TV Globo, Folha e Veja; Exame e Forbes. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Relações públicas",
          image: "/media/editorial-inpress-02.svg",
          alt: "Infográfico editorial de Grupo InPress sobre Relações públicas: Jornalistas e influenciadores; Porta-vozes e entrevistas; Eventos e relacionamento. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Campanhas integradas",
          image: "/media/editorial-inpress-03.svg",
          alt: "Infográfico editorial de Grupo InPress sobre Campanhas integradas: Contas como GoPro e Sicredi; Johnson & Johnson; Imprensa, eventos e ações digitais. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
      ],
    },
    panelA: [
      {
        title: "Assessoria de imprensa",
        label: "01",
        text: "Mais de 30 veiculações em TV Globo, Folha, Veja, Exame e Forbes.",
      },
      {
        title: "Relações públicas",
        label: "02",
        text: "Relacionamento com jornalistas, influenciadores e porta-vozes.",
      },
    ],
    panelB: [
      {
        title: "Gestão de contas",
        label: "03",
        text: "Atendimento a GoPro, Johnson & Johnson e Sicredi, com gestão de demandas e entregas.",
      },
      {
        title: "Campanhas integradas",
        label: "04",
        text: "Planejamento articulando imprensa, influenciadores, eventos e ações digitais.",
      },
    ],
  },
  {
    id: "seed-cdi",
    slug: "cdi",
    number: 11,
    title: "CDI Comunicação",
    eyebrow: "Planejamento estratégico e comunicação institucional",
    intro: "Analista de Comunicação e Atendimento Pleno · Nov/2014 – set/2015",
    theme: "paper",
    layout: "timeline",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        {
          title: "Planejamento estratégico",
          image: "/media/editorial-cdi-01.svg",
          alt: "Infográfico editorial de CDI Comunicação sobre Planejamento estratégico: Planejamento anual; Planos táticos mensais; Públicos, mensagens e indicadores. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Comunicação institucional",
          image: "/media/editorial-cdi-02.svg",
          alt: "Infográfico editorial de CDI Comunicação sobre Comunicação institucional: Roteiros e discursos; Apresentações institucionais; Materiais para diferentes públicos. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
        {
          title: "Gestão de stakeholders",
          image: "/media/editorial-cdi-03.svg",
          alt: "Infográfico editorial de CDI Comunicação sobre Gestão de stakeholders: Sicredi e Instituto Vladimir Herzog; Relacionamento institucional; Articulação e porta-vozes. Não é fotografia do projeto.",
          caption:
            "Síntese editorial baseada no currículo e nos infográficos; não é registro fotográfico da entrega.",
        },
      ],
    },
    panelA: [
      {
        title: "Planejamento estratégico",
        label: "01",
        text: "Planejamento anual e planos táticos mensais, públicos, mensagens-chave e indicadores.",
      },
      {
        title: "Comunicação institucional",
        label: "02",
        text: "Roteiros, discursos, apresentações e materiais institucionais.",
      },
    ],
    panelB: [
      {
        title: "Relações públicas",
        label: "03",
        text: "Relacionamento institucional de clientes como Sicredi e Instituto Vladimir Herzog.",
      },
      {
        title: "Gestão de stakeholders",
        label: "04",
        text: "Articulação com públicos estratégicos e preparação de porta-vozes.",
      },
    ],
  },
  {
    id: "seed-tools",
    slug: "ferramentas",
    number: 12,
    title: "Ferramentas",
    theme: "ink",
    layout: "editorial",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Análise e indicadores",
        toolIcons: ["analytics", "search"],
        text: "Google Analytics 4 (GA4) · Google Search Console · KPIs, dashboards e relatórios",
      },
      {
        title: "Mídia e performance",
        toolIcons: ["meta", "growth"],
        text: "Meta Ads · Segmentação e gestão de campanhas · Monitoramento de resultados",
      },
      {
        title: "CRM e monitoramento",
        toolIcons: ["salesforce", "hubspot", "sprinklr"],
        text: "Salesforce · HubSpot · Sprinklr · CRM e relacionamento · Monitoramento de reputação",
      },
    ],
    panelB: [
      {
        title: "Projetos e colaboração",
        toolIcons: ["asana", "notion"],
        text: "Asana · Notion · Planejamento e fluxos de trabalho · Gestão de equipes e entregas",
      },
      {
        title: "Conteúdo e design",
        toolIcons: ["adobe", "figma", "wordpress"],
        text: "Adobe Creative Cloud · Figma · WordPress · Produção de conteúdo visual e digital",
      },
      {
        title: "Comunicação digital",
        toolIcons: ["social", "video", "megaphone"],
        text: "Conteúdo e mídias sociais · Comunicação institucional e executiva · Planejamento de campanhas",
      },
    ],
  },
  {
    id: "seed-quotes",
    slug: "depoimentos",
    number: 13,
    title: "Depoimentos",
    theme: "paper",
    layout: "quotes",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Matheus Gomes",
        meta: "Estagiário · Subprefeitura de Pinheiros",
        image: "/media/matheus-gomes.jpg",
        alt: "Retrato de Matheus Gomes",
        text: "“Aprendi muito com ele no desenvolvimento do meu olhar jornalístico e na compreensão de uma comunicação mais estratégica, alinhada aos objetivos institucionais e ao interesse público. Sou muito grato ao Tulius pela oportunidade. Sem dúvida, é um profissional que inspira e ensina.”",
      },
      {
        title: "Ana Beatriz Neves",
        meta: "Estagiária · Subprefeitura de Pinheiros",
        image: "/media/ana-beatriz-neves.jpg",
        alt: "Retrato de Ana Beatriz Neves",
        text: "“Além de jornalista, Tulius se destaca pelo seu olhar voltado à inovação e à tecnologia. Para mim, ele foi também um verdadeiro professor nessa área, sempre disposto a compartilhar conhecimentos, explicar processos e apresentar novas ferramentas e possibilidades que ampliaram minha visão profissional.”",
      },
    ],
    panelB: [
      {
        title: "Fábio Seixas",
        meta: "Chefe de Redação da TV Globo",
        image: "/media/fabio-seixas.jpg",
        alt: "Retrato de Fábio Seixas",
        text: "“Em meio a milhares de candidatos, Tulius foi um dos selecionados para o programa Passaporte SporTV. Destacou-se na fase de seleção e foi enviado à China durante os Jogos Olímpicos do Rio. É um profissional batalhador e cheio de iniciativa, que certamente vai crescer muito na carreira.”",
      },
    ],
  },
  {
    id: "seed-contact",
    slug: "contato",
    number: 14,
    title: "Contato",
    eyebrow: "Vamos criar conexões autênticas?",
    intro: "Tulius Tsangaropulos · Comunicação, estratégia e reputação",
    theme: "orange",
    layout: "contact",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Tulius Tsangaropulos",
        text: "Moinhos de Vento · Porto Alegre/RS",
        image: "/media/tulius-contact.jpg",
        alt: "Tulius Tsangaropulos segurando um tablet",
      },
    ],
    panelB: [
      {
        title: "WhatsApp",
        value: "(51) 98992-6830",
        meta: "https://wa.me/5551989926830",
      },
      {
        title: "E-mail",
        value: "tuliust@gmail.com",
        meta: "mailto:tuliust@gmail.com",
      },
      {
        title: "LinkedIn",
        value: "linkedin.com/in/tuliust",
        meta: "https://linkedin.com/in/tuliust",
      },
    ],
  },
]
