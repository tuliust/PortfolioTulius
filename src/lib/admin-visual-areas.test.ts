import { describe, expect, it } from "vitest"
import { adminVisualAreas } from "./admin-visual-areas"
describe("Regiões visuais do editor", () => {
  it("Sobre: texto, fotografia e destaques nos dados originais", () => {
    expect(adminVisualAreas("sobre").map((x) => x.source)).toEqual(["section", "a", "b"])
    expect(adminVisualAreas("sobre")[1].focus).toBe("about-photo")
  })
  it("Resultados: título, indicadores e temas", () => {
    expect(adminVisualAreas("resultados").map((x) => x.source)).toEqual(["section", "a", "b"])
  })
  it.each(["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"])(
    "Experiência %s: galeria reutiliza A, projetos B e A",
    (slug) => {
      const areas = adminVisualAreas(slug)
      expect(areas.map((x) => x.label)).toEqual(["Esquerda", "Centro", "Direita"])
      expect(areas.map((x) => x.source)).toEqual(["a", "b", "a"])
      expect(areas[2].focus).toBe("experience-gallery")
    },
  )
  it("Não cria centro fictício nos painéis de duas colunas", () => {
    expect(adminVisualAreas("perfil")).toEqual([])
    expect(adminVisualAreas("depoimentos")).toEqual([])
  })
})
