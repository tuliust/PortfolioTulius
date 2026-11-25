import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { APPROVED_PROFILE_PORTRAIT, CURRENT_PROFILE_PORTRAIT, syncProfilePreload } from "./portrait-preload.mjs"

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")
const site = readFileSync(new URL("../src/components/public/PublicSite.tsx", import.meta.url), "utf8")

describe("preload de imagem LCP aprovado", () => {
  it("usa a mesma fotografia aprovada pelo componente público", () => {
    expect(site).toContain(`"${APPROVED_PROFILE_PORTRAIT}"`)
  })

  it("preserva WebP responsivo quando CMS usa a fotografia aprovada", () => {
    const result = syncProfilePreload(html, APPROVED_PROFILE_PORTRAIT)
    expect(result.strategy).toBe("responsive-webp")
    expect(result.html).toBe(html)
    expect(result.html).toContain('imagesrcset="/media/tulius-site-600.webp 600w')
    expect(result.html).not.toContain(`href="${APPROVED_PROFILE_PORTRAIT}"`)
  })

  it("precarrega a cópia sem perda da fotografia atual sem reutilizar o retrato anterior", () => {
    const result = syncProfilePreload(html, CURRENT_PROFILE_PORTRAIT)
    expect(site).toContain(`"${CURRENT_PROFILE_PORTRAIT}"`)
    expect(result.strategy).toBe("lossless-webp")
    expect(result.html).toContain('href="/media/tulius-inicial-lossless.webp"')
    expect(result.html).not.toContain('imagesrcset="/media/tulius-site-600.webp')
    expect(result.html).not.toContain(`href="${CURRENT_PROFILE_PORTRAIT}"`)
  })

  it("não mantém o WebP antigo se a fotografia CMS for alterada", () => {
    const newPortrait = "https://example.org/photo.jpg?v=1&published=true"
    const result = syncProfilePreload(html, newPortrait)
    expect(result.strategy).toBe("cms-image")
    expect(result.html).toContain('href="https://example.org/photo.jpg?v=1&amp;published=true"')
    expect(result.html).not.toContain('imagesrcset="/media/tulius-site-600.webp')
  })

  it("omite o preload quando a fotografia publicada não pode ser determinada", () => {
    const result = syncProfilePreload(html, null)
    expect(result.strategy).toBe("omitted")
    expect(result.html).not.toMatch(/rel="preload" as="image"/)
  })

  it("falha o build caso o preload deixe de existir no HTML base", () => {
    expect(() => syncProfilePreload("<html></html>", APPROVED_PROFILE_PORTRAIT)).toThrow(
      "Missing first-fold image preload",
    )
  })
})
