import { describe, it, expect } from "vitest"
import { sectionElementGroup } from "./section-element-group"

describe("CMS — agrupamentos editoriais sem migração", () => {
  it("nomeia as áreas conforme a composição publicada", () => {
    expect(sectionElementGroup("formacao", "left", "a")[0]).toBe("Formação acadêmica")
    expect(sectionElementGroup("formacao", "right", "b")[0]).toBe("Idiomas")
    expect(sectionElementGroup("resultados", "center", "a")[0]).toBe("Indicadores e métricas")
    expect(sectionElementGroup("contato", "right", "b")[0]).toBe("Canais de contato")
    expect(sectionElementGroup("invest-rs", "right", "a")[0]).toBe("Galeria e mídia")
  })
})
