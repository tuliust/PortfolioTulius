import { describe, expect, it } from "vitest"
import { FALLBACK_FAVICON, safeSiteIconUrl, withSiteFavicon } from "./site-icons"

describe("favicon gerenciado por SEO", () => {
  it("admite o asset local e URLs HTTPS publicadas", () => {
    expect(safeSiteIconUrl(FALLBACK_FAVICON)).toBe("/favicon.png")
    expect(safeSiteIconUrl("https://example.com/icon.png")).toBe("https://example.com/icon.png")
  })
  it("rejeita URL insegura e preserva as demais configurações", () => {
    for (const url of ["javascript:alert(1)", "//evil.test/icon.png", "/../secret.png", "http://example.com/icon.png"]) {
      expect(safeSiteIconUrl(url)).toBeNull()
    }
    expect(withSiteFavicon({ canonical: "https://tulius.work/" }, "")).toEqual({
      canonical: "https://tulius.work/",
      faviconUrl: FALLBACK_FAVICON,
    })
  })
})
