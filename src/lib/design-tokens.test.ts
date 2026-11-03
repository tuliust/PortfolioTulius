import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { hydrateDesignTokens, parseCardRadius } from "./design-tokens"

describe("publicação do token de raio dos cartões", () => {
  it("preserva o valor publicado e o raio zero", () => {
    expect(parseCardRadius("4")).toBe(4)
    expect(parseCardRadius("0")).toBe(0)
    expect(parseCardRadius("12.5")).toBe(12.5)
  })
  it("descarta valores inválidos e evita dimensões abusivas", () => {
    expect(parseCardRadius("")).toBe(4)
    expect(parseCardRadius("NaN")).toBe(4)
    expect(parseCardRadius("Infinity")).toBe(4)
    expect(parseCardRadius("-15")).toBe(0)
    expect(parseCardRadius("999")).toBe(32)
  })
})

describe("identidade administrativa com design_tokens vazio", () => {
  const colors = { orange: "#FF5414", ink: "#171617" }
  const extra = { "font.body": "Inter" }

  it("usa os padrões como baseline, permitindo detectar edições sem registros no banco", () => {
    const initial = hydrateDesignTokens(colors, extra, [])
    expect(initial.tokens).toEqual(colors)
    expect(initial.extraTokens).toEqual(extra)
    expect(initial.savedDesign).toBe(JSON.stringify({ tokens: colors, extraTokens: extra }))
    const changed = { ...initial.tokens, orange: "#714738" }
    expect(JSON.stringify({ tokens: changed, extraTokens: initial.extraTokens })).not.toBe(
      initial.savedDesign,
    )
  })

  it("mantém os tokens publicados e não introduz cores desconhecidas", () => {
    const initial = hydrateDesignTokens(colors, extra, [
      { token_key: "color.orange", token_value: "#AABBCC" },
      { token_key: "font.body", token_value: "Big Shoulders Display" },
      { token_key: "color.desconhecida", token_value: "#000000" },
    ])
    expect(initial.tokens).toEqual({ orange: "#AABBCC", ink: "#171617" })
    expect(initial.extraTokens).toEqual({ "font.body": "Big Shoulders Display" })
    expect(initial.savedDesign).toBe(
      JSON.stringify({ tokens: initial.tokens, extraTokens: initial.extraTokens }),
    )
  })

  it("o editor usa o baseline também quando a consulta retorna zero registros", () => {
    const source = readFileSync(
      new URL("../components/admin/AdminApp.tsx", import.meta.url),
      "utf8",
    )
    expect(source).toContain("hydrateDesignTokens(tokens, extraTokens, data ?? [])")
    expect(source).not.toContain("if (!data?.length) return")
  })
})

describe("identidade ao descartar e voltar de outro módulo", () => {
  it("prepara novamente a paleta salva e não mantém a edição temporária", () => {
    const defaults = { orange: "#FF5414", ink: "#171617" }
    const extra = { "font.body": "Inter" }
    const firstVisit = hydrateDesignTokens(defaults, extra, [])
    const temporary = { ...firstVisit.tokens, orange: "#714738" }
    expect(JSON.stringify({ tokens: temporary, extraTokens: extra })).not.toBe(firstVisit.savedDesign)
    // The next Identity visit starts from a newly loaded, empty local catalog.
    const secondVisit = hydrateDesignTokens(defaults, extra, [])
    expect(secondVisit.tokens.orange).toBe("#FF5414")
    expect(secondVisit.savedDesign).toBe(firstVisit.savedDesign)
  })

  it("exige remount em cada entrada e impede restauração automática dos inputs", () => {
    const app = readFileSync(new URL("../components/admin/AdminApp.tsx", import.meta.url), "utf8")
    expect(app).toContain('if (next === "design") setDesignEntrySession((session) => session + 1)')
    expect(app).toContain("key={designEntrySession}")
    expect(app).toContain("entrySession={designEntrySession}")
    expect(app).toContain("autoComplete=\"off\"")
    expect(app).toContain("name={`identity-color-${entrySession}-${key}`}")
  })
})
