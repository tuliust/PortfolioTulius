import { describe, expect, it } from "vitest"
import { selectResultMetrics } from "../lib/result-metrics"
import { sections } from "./fallback"

const expectedSlugs = [
  "perfil",
  "sobre",
  "resultados",
  "competencias",
  "formacao",
  "invest-rs",
  "prefeitura-sp",
  "vale",
  "globo-sportv",
  "inpress",
  "cdi",
  "ferramentas",
  "depoimentos",
  "contato",
]

describe("estrutura editorial", () => {
  it("mantém 14 seções e 28 painéis", () => {
    expect(sections).toHaveLength(14)
    expect(sections.flatMap((section) => [section.panelA, section.panelB])).toHaveLength(28)
  })

  it("preserva slugs e ordem", () => {
    expect(sections.map((section) => section.slug)).toEqual(expectedSlugs)
    expect(sections.map((section) => section.number)).toEqual(
      Array.from({ length: 14 }, (_, index) => index + 1),
    )
  })

  it("mantém cinco áreas e seis experiências no perfil B", () => {
    expect(sections[0].panelB.slice(0, 5)).toHaveLength(5)
    expect(sections[0].panelB.slice(5)).toHaveLength(6)
  })
})

describe("conteúdo da seção 02 e especialidades da seção 03", () => {
  const profile = sections.find((section) => section.slug === "perfil")
  const about = sections.find((section) => section.slug === "sobre")
  const results = sections.find((section) => section.slug === "resultados")

  it("mantém cinco textos gerenciáveis no painel B da seção 02", () => {
    expect(about?.panelA).toHaveLength(1)
    expect(about?.panelB.map((item) => item.title)).toEqual([
      "Estratégia também é escuta.",
      "Comunicação de ponta a ponta",
      "Visão editorial",
      "Resultados que orientam decisões",
      "A voz de quem lidera",
    ])
    expect(about?.panelA[0]?.image).toBe("/media/tulius-portrait.jpg")
  })

  it("reutiliza os cinco temas da abertura na lista da seção 03", () => {
    const opening = profile?.panelB.slice(0, 5).map((item) => item.title.toLowerCase())
    const specialties = results?.panelB.map((item) => item.title.toLowerCase())
    expect(specialties).toEqual(opening)
    expect(results?.panelB).toHaveLength(5)
    expect(results?.panelA).toHaveLength(20)
    expect(results?.panelB.some((item) => item.placeholder)).toBe(false)
  })
})

describe("interação da seção 03 e remoção da seção 04", () => {
  const profile = sections.find((section) => section.slug === "perfil")
  const results = sections.find((section) => section.slug === "resultados")
  const hidden = sections.find((section) => section.slug === "competencias")

  it("preserva cinco vínculos temáticos estáveis na abertura e nos resultados", () => {
    const heroKeys = profile?.panelB.slice(0, 5).map((item) => item.themeKey)
    const themeKeys = results?.panelB.map((item) => item.themeKey)
    expect(heroKeys).toEqual(["corporativa", "projetos", "eventos", "marketing", "imprensa"])
    expect(themeKeys).toEqual(heroKeys)
    expect(results?.panelB.every((item) => Boolean(item.themeTitle && item.themeSummary))).toBe(
      true,
    )
  })

  it("distribui vinte métricas entre cinco temas e mantém quatro na visão geral", () => {
    expect(results?.panelA).toHaveLength(20)
    const metrics = results?.panelA ?? []
    expect(selectResultMetrics(metrics).map((item) => item.value)).toEqual([
      "R$ 12 milhões",
      "+225%",
      "400+",
      "25 eventos",
    ])
    expect(results?.panelB.map((theme) => selectResultMetrics(metrics, theme).length)).toEqual([
      4, 4, 4, 4, 4,
    ])
    expect(metrics.every((item) => !item.label && Boolean(item.relatedThemeKeys))).toBe(true)
    expect(results?.panelB.every((item) => item.themePresentation === "metrics")).toBe(true)
  })

  it("aproveita a seção 04 e a oculta sem apagar seu conteúdo histórico", () => {
    expect(hidden?.visible).toBe(false)
    expect(hidden?.panelA).toHaveLength(2)
    expect(hidden?.panelB).toHaveLength(3)
    expect(results?.panelB.some((item) => Boolean(item.inheritedHighlights?.length))).toBe(true)
  })
})

describe("formação e experiência profissional em camadas", () => {
  const companies = ["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"]

  it("apresenta cinco projetos visíveis por empresa sem apagar itens históricos", () => {
    for (const slug of companies) {
      const section = sections.find((item) => item.slug === slug)
      const visible = [...(section?.panelA ?? []), ...(section?.panelB ?? [])].filter(
        (item) =>
          item.title !== "Competências aplicadas" &&
          !item.value &&
          item.isHidden !== true,
      )
      expect(visible).toHaveLength(5)
    }
    const globo = sections.find((section) => section.slug === "globo-sportv")
    const visibleTexts = [...(globo?.panelA ?? []), ...(globo?.panelB ?? [])]
      .filter((item) => item.isHidden !== true)
      .map((item) => item.text)
    expect(visibleTexts.some((text) => text?.includes("100 participações"))).toBe(true)
    expect(visibleTexts.some((text) => text?.includes("200 jogos"))).toBe(true)
  })

  it("usa identidade escura na formação e papel branco nas seis empresas", () => {
    expect(sections.find((section) => section.slug === "formacao")?.theme).toBe("ink")
    for (const slug of companies) {
      expect(sections.find((section) => section.slug === slug)?.theme).toBe("paper")
    }
  })

  it("preserva os conteúdos e vincula sínteses editoriais editáveis sem simular fotografias", () => {
    for (const slug of companies) {
      const section = sections.find((entry) => entry.slug === slug)
      expect(section?.panelA.length).toBeGreaterThan(0)
      expect(section?.panelB.length).toBeGreaterThan(0)
      expect(section?.experienceMedia?.slides).toHaveLength(slug === "invest-rs" ? 4 : 3)
      expect(
        section?.experienceMedia?.slides?.every(
          (slide) =>
            Boolean(slide.title) &&
            slide.image?.startsWith(`/media/editorial-${slug}-`) &&
            slide.alt?.includes("Não é fotografia do projeto.") &&
            slide.caption?.includes("não é registro fotográfico"),
        ),
      ).toBe(true)
    }
  })

  it("incorpora a experiência internacional e a trajetória jornalística dos anexos", () => {
    const profile = sections.find((section) => section.slug === "perfil")
    const invest = sections.find((section) => section.slug === "invest-rs")
    const globo = sections.find((section) => section.slug === "globo-sportv")
    const prefeitura = sections.find((section) => section.slug === "prefeitura-sp")

    expect(profile?.panelA.some((item) => item.text?.includes("34 países"))).toBe(true)
    expect(invest?.panelB.some((item) => item.title.includes("CRM"))).toBe(true)
    expect(invest?.panelB.some((item) => item.title.includes("IA e automação"))).toBe(true)
    expect(prefeitura?.panelB.some((item) => item.title.includes("Território"))).toBe(true)
    expect(globo?.panelB.filter((item) => item.meta?.startsWith("TRAJETÓRIA"))).toHaveLength(4)
    expect(globo?.panelB.some((item) => item.title.includes("Chapecoense"))).toBe(true)
  })
})

describe("links de experiência e ícones de ferramentas", () => {
  const profile = sections.find((section) => section.slug === "perfil")
  const tools = sections.find((section) => section.slug === "ferramentas")

  it("liga as seis experiências às seções públicas correspondentes", () => {
    expect(profile?.panelB.slice(5).map((item) => item.targetSlug)).toEqual([
      "invest-rs",
      "prefeitura-sp",
      "vale",
      "inpress",
      "globo-sportv",
      "cdi",
    ])
    expect(
      profile?.panelB
        .slice(5)
        .every((item) =>
          sections.some((section) => section.slug === item.targetSlug && section.visible),
        ),
    ).toBe(true)
  })

  it("apresenta seis conjuntos de pictogramas sobre o tema escuro", () => {
    expect(tools?.theme).toBe("ink")
    expect([...tools!.panelA, ...tools!.panelB].map((item) => item.toolIcons)).toEqual([
      ["analytics", "search"],
      ["meta", "growth"],
      ["salesforce", "hubspot", "sprinklr"],
      ["asana", "notion"],
      ["adobe", "figma", "wordpress"],
      ["social", "video", "megaphone"],
    ])
  })
})
