import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const publicSite = readFileSync(
  new URL("../components/public/PublicSite.tsx", import.meta.url),
  "utf8",
)

describe("Miniatura Sobre carregada sob demanda", () => {
  it("restringe adiamento ao PNG publicado e preserva o CMS para outras imagens", () => {
    expect(publicSite).toContain("a46a4091-bce1-4345-a17f-7d7947a8e903-tulius_tablet.png")
    expect(publicSite).toContain("item.image === APPROVED_ABOUT_TABLET")
    expect(publicSite).toContain("src={item.image}")
  })
  it("limita o novo adiamento ao retrato atual de Olá e preserva PDF", () => {
    expect(publicSite).toContain(
      "41687064-3d60-43c3-9ee2-ab52c8b609a8-Tulius---Foto-Profissional.png",
    )
    expect(publicSite).toContain("imageSource === CURRENT_ABOUT_PHOTO")
    expect(publicSite).toContain("!pdfExport ? (")
    expect(publicSite).toContain("src={imageSource}")
  })
  it("reserva proporções e carrega quando a imagem se aproxima da viewport", () => {
    expect(publicSite).toContain('rootMargin: "600px 0px"')
    expect(publicSite).toContain("src = APPROVED_ABOUT_TABLET")
    expect(publicSite).toContain("src={nearViewport ? src : undefined}")
    expect(publicSite).toContain("width={src === CURRENT_ABOUT_PHOTO ? 1086 : 900}")
    expect(publicSite).toContain("height={src === CURRENT_ABOUT_PHOTO ? 1448 : 1200}")
    expect(publicSite).toContain('fetchPriority="low"')
  })
})
