import { describe, expect, it } from "vitest"
import {
  MOBILE_PROFILE_EDITORIAL_DEFAULTS,
  mobileEditorialFont,
  mobileEditorialLines,
  mobileProfileEditorial,
} from "./mobile-profile-editorial"

describe("Perfil editorial 360 mobile", () => {
  it("mantém o título exato e configura três zonas editáveis", () => {
    expect(mobileEditorialLines()).toEqual(["CONEXÕES", "AUTÊNTICAS.", "INOVAÇÃO."])
    expect(Object.keys(MOBILE_PROFILE_EDITORIAL_DEFAULTS)).toContain("top")
    expect(Object.keys(MOBILE_PROFILE_EDITORIAL_DEFAULTS)).toContain("middle")
    expect(Object.keys(MOBILE_PROFILE_EDITORIAL_DEFAULTS)).toContain("bottom")
  })

  it("aplica valores JSONB sem contaminar as demais zonas", () => {
    const result = mobileProfileEditorial({
      enabled: true,
      headline: "UM\nNOVO\nTÍTULO",
      top: { background: "#000000", showSupport: false },
      bottom: { photoWidth: 35 },
    })
    expect(result.enabled).toBe(true)
    expect(result.top.background).toBe("#000000")
    expect(result.top.showSupport).toBe(false)
    expect(result.middle.background).toBe("#FAFAFA")
    expect(result.middle.textColor).toBe("#FF5414")
    expect(result.bottom.photoWidth).toBe(35)
    expect(mobileEditorialLines(result.headline)).toEqual(["UM", "NOVO", "TÍTULO"])
  })

  it("restringe família tipográfica às fontes permitidas", () => {
    expect(mobileEditorialFont("Inter")).toBe("Inter")
    expect(mobileEditorialFont("font.heading")).toBe("var(--font-heading)")
    expect(mobileEditorialFont("font.body")).toBe("var(--font-body)")
    expect(mobileEditorialFont("font.serif")).toBe("var(--font-serif)")
    expect(mobileEditorialFont("url(evil)")).toBe("Big Shoulders Display")
  })
})
