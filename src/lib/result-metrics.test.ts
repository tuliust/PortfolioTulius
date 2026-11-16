import { describe, expect, it } from "vitest"
import type { ContentItem } from "../types/content"
import { selectResultMetrics } from "./result-metrics"

const metrics: ContentItem[] = [
  { title: "14 países", value: "14", relatedThemeKeys: ["corporativa"], showInOverview: false },
  {
    title: "Vale",
    value: "R$ 12 milhões",
    relatedThemeKeys: ["marketing"],
    showInOverview: true,
    overviewOrder: 1,
  },
  {
    title: "Prefeitura",
    value: "+225%",
    relatedThemeKeys: ["marketing"],
    showInOverview: true,
    overviewOrder: 2,
  },
  {
    title: "Globo",
    value: "100+",
    relatedThemeKeys: ["imprensa"],
    showInOverview: true,
    overviewOrder: 3,
  },
  {
    title: "Invest RS",
    value: "25",
    relatedThemeKeys: ["projetos"],
    showInOverview: true,
    overviewOrder: 4,
  },
]

describe("Indicadores por categoria e visão geral", () => {
  it("exibe quatro indicadores gerais na ordem definida", () => {
    expect(selectResultMetrics(metrics).map((item) => item.title)).toEqual([
      "Vale",
      "Prefeitura",
      "Globo",
      "Invest RS",
    ])
  })
  it("filtra as categorias sem cruzar os indicadores", () => {
    expect(selectResultMetrics(metrics, { title: "Corporativa", themeKey: "corporativa" })).toEqual(
      [metrics[0]],
    )
    expect(selectResultMetrics(metrics, { title: "Projetos", themeKey: "projetos" })).toEqual([
      metrics[4],
    ])
  })
  it("mantém a visão geral com itens legados sem configuração explícita", () => {
    const legacy: ContentItem[] = [{ title: "Legado", value: "1" }]
    expect(selectResultMetrics(legacy)).toEqual(legacy)
  })
})
