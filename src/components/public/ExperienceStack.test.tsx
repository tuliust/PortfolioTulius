import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import type { PortfolioSection } from "../../types/content"
import { ExperienceStack } from "./ExperienceStack"

const section: PortfolioSection = {
  id: "invest-test",
  slug: "invest-rs",
  number: 6,
  title: "Invest RS",
  theme: "paper",
  layout: "editorial",
  status: "published",
  visible: true,
  panelA: [],
  panelB: [],
}

function marks(media: PortfolioSection["experienceMedia"], isMobile = false) {
  const html = renderToStaticMarkup(
    <ExperienceStack sections={[{ ...section, experienceMedia: media }]} isMobile={isMobile} />,
  )
  return {
    html,
    images: [...html.matchAll(/<img[^>]*>/g)]
      .map((match) => match[0])
      .filter((tag) => tag.includes('src="/media/invest-logo.png"')),
  }
}

describe("Logotipos das experiências profissionais", () => {
  it("exibe logo publicado mesmo sem texto alternativo no desktop e no mobile", () => {
    for (const isMobile of [false, true]) {
      const { html, images } = marks({ logo: "/media/invest-logo.png" }, isMobile)
      expect(images).toHaveLength(isMobile ? 1 : 2)
      expect(images.every((image) => image.includes('alt=""'))).toBe(true)
      expect(html).not.toContain('class="experience-monogram"')
    }
  })

  it("aceita alt vazio e espaços sem ocultar o logo", () => {
    const { images } = marks({ logo: "/media/invest-logo.png", logoAlt: "   " })
    expect(images).toHaveLength(2)
    expect(images.every((image) => image.includes('alt=""'))).toBe(true)
  })

  it("preserva o texto alternativo informado", () => {
    const { images } = marks({
      logo: "/media/invest-logo.png",
      logoAlt: "Logotipo da Invest RS",
    })
    expect(images).toHaveLength(2)
    expect(images.every((image) => image.includes('alt="Logotipo da Invest RS"'))).toBe(true)
  })

  it("mantém o monograma quando não existe URL de logo", () => {
    const { html, images } = marks({ logoAlt: "Invest RS" })
    expect(images).toHaveLength(0)
    expect(html.match(/class="experience-monogram"/g)).toHaveLength(2)
  })
})
