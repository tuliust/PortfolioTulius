import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { defaultTokens } from "../../content/defaultTokens"
import type { PortfolioSection } from "../../types/content"
import { PdfPortfolio } from "./PdfPortfolio"

function section(slug: string, number: number): PortfolioSection {
  return {
    id: slug,
    slug,
    number,
    title: slug,
    theme: "paper",
    layout: "editorial",
    status: "published",
    visible: true,
    panelA: [],
    panelB: [],
  }
}

describe("PdfPortfolio read-only renderer", () => {
  const results: PortfolioSection = {
    ...section("resultados", 3),
    title: "Resultados e projetos em destaque",
    panelA: [
      {
        title: "Indicador principal",
        value: "400+",
        text: "Texto integral do indicador.",
        showInOverview: true,
        overviewOrder: 1,
        relatedThemeKeys: ["corporativa"],
      },
    ],
    panelB: [
      {
        title: "Comunicação Corporativa",
        themeKey: "corporativa",
        themePresentation: "metrics",
        themeAxis: "Estratégia e Reputação",
        themeTitle: "Comunicação que conecta",
        themeSubtitle: "Resultados de comunicação.",
      },
    ],
  }
  const experience: PortfolioSection = {
    ...section("invest-rs", 6),
    title: "Invest RS",
    panelA: [
      { title: "Guia de Boas-Vindas", text: "Projeto entregue à equipe." },
      { title: "Plataforma de eventos", text: "Sistema de relacionamento concluído." },
      { title: "Registro antigo", text: "Não deve sair.", isHidden: true },
    ],
  }
  const testimonials: PortfolioSection = {
    ...section("depoimentos", 13),
    title: "Depoimentos",
    panelA: [
      {
        title: "Profissional convidado",
        text: "Depoimento integral e completo, sem truncamento de texto.",
      },
    ],
  }

  for (const device of ["desktop", "mobile"] as const) {
    it(
      "keeps results continuous, trajectory visible and testimonials complete on " + device,
      () => {
        const html = renderToStaticMarkup(
          <PdfPortfolio
            sections={[testimonials, experience, results]}
            tokens={defaultTokens}
            careerDescriptions={{
              "invest-rs": "Atuação profissional.\n• Projetos institucionais: Entregas concluídas.",
            }}
            device={device}
            colorMode="clean"
          />,
        )

        expect(html.indexOf('id="resultados"')).toBeLessThan(html.indexOf('id="invest-rs"'))
        expect(html.indexOf('id="invest-rs"')).toBeLessThan(html.indexOf('id="depoimentos"'))
        expect(html).toContain("Visão geral — indicadores")
        expect(html).toContain("Comunicação que conecta")
        expect(html.match(/400\+/g)?.length).toBe(2)
        expect(html).toContain("Guia de Boas-Vindas")
        expect(html).toContain("Projetos institucionais")
        expect(html).toContain("Depoimento integral e completo")
        expect(html).not.toContain("Registro antigo")
        expect(html).not.toContain("Ler depoimento completo")
        expect(html).not.toContain("experience-index")
        expect(html).not.toContain("experience-gallery")
        expect(html).not.toContain("site-header")
        expect(html).not.toContain("results-theme-list")
        expect(html).toContain("pdf-portfolio--clean")
      },
    )
  }
})
