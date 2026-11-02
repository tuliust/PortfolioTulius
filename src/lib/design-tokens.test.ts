import { describe, expect, it } from "vitest"
import { parseCardRadius } from "./design-tokens"

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
