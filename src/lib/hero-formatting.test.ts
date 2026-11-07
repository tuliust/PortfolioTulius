import { describe, expect, it } from "vitest"
import { heroColor, heroFont, heroSizeClass, heroTextStyle } from "./hero-formatting"

describe("Seção 01 — estilos sem alterar o layout público original", () => {
  it("mantém todos os valores herdados quando nenhum campo foi formatado", () => {
    expect(heroColor()).toBeUndefined()
    expect(heroFont()).toBeUndefined()
    expect(heroSizeClass()).toBeUndefined()
    expect(heroTextStyle()).toBeUndefined()
  })

  it("resolve apenas cores e famílias permitidas pela Identidade", () => {
    expect(heroColor("transparent")).toBe("transparent")
    expect(heroColor("color.ink")).toBe("var(--ink)")
    expect(heroColor("color.orange")).toBe("var(--orange)")
    expect(heroColor("color.inexistente")).toBeUndefined()
    expect(heroColor("url(javascript:alert(1))")).toBeUndefined()
    expect(heroFont("font.heading")).toBe("var(--font-heading)")
    expect(heroFont("font.serif")).toBe("var(--font-serif)")
    expect(heroFont("font.fake")).toBeUndefined()
  })

  it("utiliza o estilo da Identidade e tamanhos separados por dispositivo", () => {
    const format = {
      styleToken: "typography.profile-main",
      colorToken: "color.orange",
      fontToken: "font.body",
      desktopSize: 112,
      mobileSize: 48,
    }
    expect(heroSizeClass(format)).toBe("hero-formatted-size")
    expect(heroTextStyle(format)).toEqual({
      color: "var(--orange)",
      fontFamily: "var(--font-body)",
      "--hero-format-desktop": "112px",
      "--hero-format-mobile": "48px",
    })
  })

  it("rejeita tamanhos inválidos e não insere CSS livre", () => {
    const format = {
      styleToken: "typography.unsafe;",
      colorToken: "red; background: hotpink",
      fontToken: "font.unknown",
      desktopSize: Number.POSITIVE_INFINITY,
      mobileSize: -2,
    }
    expect(heroSizeClass(format)).toBeUndefined()
    expect(heroTextStyle(format)).toEqual({})
  })
})
