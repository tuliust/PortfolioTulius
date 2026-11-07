import { describe, expect, it } from "vitest"
import {
  editorAnchorError,
  normalizeEditorAnchor,
  publicEditorAnchor,
  validEditorAnchor,
} from "./editor-anchor"

describe("Hero — âncora editorial separada do slug interno", () => {
  it("aceita âncoras legíveis sem alterar o identificador perfil", () => {
    expect(normalizeEditorAnchor("  Meu-Perfil ")).toBe("meu-perfil")
    expect(validEditorAnchor("meu-perfil")).toBe(true)
    expect(editorAnchorError("novo-hero", "perfil", ["sobre", "resultados"])).toBeUndefined()
    expect(publicEditorAnchor("novo-hero", "perfil")).toBe("novo-hero")
  })

  it("não permite colisões com âncoras de seções existentes", () => {
    expect(editorAnchorError("sobre", "perfil", ["sobre", "contato"])).toMatch(/já é utilizada/)
    expect(publicEditorAnchor("perfil", "perfil")).toBeUndefined()
  })

  it("não permite caracteres de hash malformados, espaços nem valores vazios", () => {
    for (const value of [
      "",
      "a b",
      "#perfil",
      "meu--perfil",
      "_interno",
      "área",
      "x/other",
      "a".repeat(65),
    ]) {
      expect(validEditorAnchor(value)).toBe(false)
      expect(publicEditorAnchor(value, "perfil")).toBeUndefined()
    }
  })
})
