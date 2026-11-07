import { describe, expect, it } from "vitest"
import { siteEditorAreas, editorCopyInArea } from "./site-editor-areas"

describe("CMS — navegação por áreas nas 14 seções", () => {
  const slugs = [
    "perfil", "sobre", "resultados", "competencias", "formacao",
    "invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress",
    "cdi", "ferramentas", "depoimentos", "contato",
  ]
  it("abre cada seção com Seção e somente as áreas realmente mapeadas", () => {
    for (const slug of slugs) {
      const areas = siteEditorAreas(slug)
      expect(areas[0].id).toBe("section")
      expect(areas.find((area) => area.id === "left")).toBeDefined()
      expect(areas.find((area) => area.id === "right")).toBeDefined()
      expect(areas.some((area) => area.id === "center")).toBe(
        ["sobre", "resultados", "invest-rs", "prefeitura-sp", "vale",
          "globo-sportv", "inpress", "cdi"].includes(slug),
      )
      expect(areas.some((area) => area.source === "a")).toBe(true)
    }
  })
  it("preserva a origem de cada painel, inclusive projetos e galeria", () => {
    expect(siteEditorAreas("sobre").map((a) => a.source)).toEqual(["section", "section", "a", "b"])
    expect(siteEditorAreas("resultados").map((a) => a.source)).toEqual(["section", "section", "a", "b"])
    expect(siteEditorAreas("invest-rs").map((a) => a.source)).toEqual(["section", "a", "b", "a"])
    expect(siteEditorAreas("contato").map((a) => a.source)).toEqual(["section", "a", "b"])
    expect(editorCopyInArea("perfil", "left")).toBe(false)
    expect(editorCopyInArea("sobre", "left")).toBe(true)
    expect(editorCopyInArea("formacao", "right")).toBe(false)
  })
})
