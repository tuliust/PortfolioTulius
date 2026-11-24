import { describe, expect, it, vi } from "vitest"
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

describe("Exibição independente e sincronização editorial do projeto", () => {
  const first = {
    id: "projeto-1",
    item: { title: "Título central", text: "Descrição exclusiva do centro" },
    slide: {
      title: "Título do slide diferente",
      caption: "Descrição exclusiva do slide",
      image: "/media/foto-aprovada.png",
    },
    slideOrder: 0,
    showInCenter: true,
    includeInGallery: true,
  }
  const second = {
    id: "projeto-2",
    item: { title: "Somente centro", text: "Sem slide publicado" },
    showInCenter: true,
    includeInGallery: false,
  }
  const third = {
    id: "projeto-3",
    item: { title: "Somente no arquivo", text: "Texto não publicado" },
    slide: {
      title: "Somente slide",
      caption: "Descrição da galeria",
      image: "/media/outra-foto.png",
    },
    showInCenter: false,
    includeInGallery: true,
    slideOrder: 1,
  }
  const fourth = {
    id: "projeto-4",
    item: { title: "Totalmente oculto", text: "Não publicar" },
    showInCenter: false,
    includeInGallery: false,
  }

  it("renderiza títulos independentes e não publica fichas com ambos os campos desligados", () => {
    const html = renderToStaticMarkup(
      <ExperienceStack
        sections={[{ ...section, experienceProjects: [first, second, third, fourth] }]}
        isMobile={false}
      />,
    )
    expect(html).toContain("Título central")
    expect(html).toContain("Descrição exclusiva do centro")
    expect(html).toContain("Título do slide diferente")
    expect(html).toContain("Descrição exclusiva do slide")
    expect(html).toContain("Somente centro")
    expect(html).not.toContain("Somente no arquivo")
    expect(html).not.toContain("Totalmente oculto")
  })

  it("não produz galeria genérica quando todos os slides estão desligados", () => {
    const html = renderToStaticMarkup(
      <ExperienceStack
        sections={[{ ...section, experienceProjects: [second, fourth] }]}
        isMobile={false}
      />,
    )
    expect(html).not.toContain('class="experience-gallery"')
    expect(html).toContain("Somente centro")
  })
})

describe("Slides de vídeo enviados pelo CMS", () => {
  it("renderiza um player nativo com controles no desktop e no mobile", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co")
    try {
      for (const isMobile of [false, true]) {
        const html = renderToStaticMarkup(
          <ExperienceStack
            sections={[
              {
                ...section,
                experienceProjects: [
                  {
                    id: "video-project",
                    item: { title: "Projeto", text: "Descrição" },
                    slide: {
                      title: "Vídeo do projeto",
                      caption: "Legenda",
                      mediaType: "video",
                      videoPath: "00000000-0000-4000-8000-000000000001.mp4",
                    },
                    includeInGallery: true,
                  },
                ],
              },
            ]}
            isMobile={isMobile}
          />,
        )
        expect(html).toContain("<video")
        expect(html).toContain("controls")
        expect(html).toContain('preload="none"')
        expect(html).toContain("/portfolio-videos/00000000-0000-4000-8000-000000000001.mp4")
        expect(html).not.toContain("autoPlay")
      }
    } finally {
      vi.unstubAllEnvs()
    }
  })
})
