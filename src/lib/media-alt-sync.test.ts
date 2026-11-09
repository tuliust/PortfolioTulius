import { describe, expect, it } from "vitest"
import type { PortfolioSection } from "../types/content"
import { publishedMediaStoragePath, synchronizePublishedMediaAlts } from "./media-alt-sync"

const url = (name: string) =>
  "https://portfolio.supabase.co/storage/v1/object/public/portfolio-public/" + name

const section: PortfolioSection = {
  id: "perfil",
  slug: "perfil",
  number: 1,
  title: "Perfil",
  theme: "ink",
  layout: "hero",
  status: "published",
  visible: true,
  panelA: [
    {
      title: "Retrato",
      image: url("portrait.webp"),
      alt: "Antigo",
      hero: { mobileEditorial: { mobileImage: url("mobile.webp"), mobileAlt: "Mobile antigo" } },
    },
  ],
  panelB: [{ title: "Remoto", image: "https://other.invalid/photo.webp", alt: "Remoto" }],
  desktopPanelA: [
    {
      title: "Retrato desktop",
      image: url("portrait.webp"),
      alt: "Antigo desktop",
      aboutDesktopImage: url("desktop.webp"),
      aboutDesktopAlt: "Descrição anterior",
    },
  ],
  desktopPanelB: [{ title: "Destaque", image: url("portrait.webp"), alt: "Antigo B" }],
  experienceMedia: {
    logo: url("logo.svg"),
    logoAlt: "Logo antigo",
    slides: [{ title: "Slide", image: url("slide.webp"), alt: "Slide antigo" }],
  },
}

describe("P2 — sincronização dos textos alternativos no site público", () => {
  const catalog = [
    { storage_path: "portrait.webp", alt_text: "Retrato atualizado" },
    { storage_path: "mobile.webp", alt_text: "Fotografia mobile" },
    { storage_path: "desktop.webp", alt_text: "Fotografia desktop" },
    { storage_path: "logo.svg", alt_text: "Marca atualizada" },
    { storage_path: "slide.webp", alt_text: "Slide atualizado" },
  ]

  it("resolve apenas mídias do bucket público ou /media/", () => {
    expect(publishedMediaStoragePath(url("photos/img%20one.webp?x=1"))).toBe("photos/img one.webp")
    expect(publishedMediaStoragePath("/media/portrait.webp")).toBe("portrait.webp")
    expect(
      publishedMediaStoragePath(
        "https://portfolio.supabase.co/storage/v1/object/sign/portfolio-private/photo.webp",
      ),
    ).toBeUndefined()
  })

  it("aplica o mesmo alt em todos os painéis desktop e mobile", () => {
    const result = synchronizePublishedMediaAlts([section], catalog)[0]
    expect(result.panelA[0].alt).toBe("Retrato atualizado")
    expect(result.desktopPanelA?.[0].alt).toBe("Retrato atualizado")
    expect(result.desktopPanelB?.[0].alt).toBe("Retrato atualizado")
    expect(result.panelA[0].hero?.mobileEditorial?.mobileAlt).toBe("Fotografia mobile")
    expect(result.desktopPanelA?.[0].aboutDesktopAlt).toBe("Fotografia desktop")
  })

  it("também atualiza logo e galeria de experiência", () => {
    const result = synchronizePublishedMediaAlts([section], catalog)[0]
    expect(result.experienceMedia?.logoAlt).toBe("Marca atualizada")
    expect(result.experienceMedia?.slides?.[0].alt).toBe("Slide atualizado")
  })

  it("mantém URLs externas e não modifica dados recebidos", () => {
    const original = structuredClone(section)
    const result = synchronizePublishedMediaAlts([section], catalog)[0]
    expect(result.panelB[0].alt).toBe("Remoto")
    expect(section).toEqual(original)
  })

  it("respeita alt vazio publicado em mídia decorativa", () => {
    const result = synchronizePublishedMediaAlts(
      [section],
      [{ storage_path: "portrait.webp", alt_text: "" }],
    )[0]
    expect(result.panelA[0].alt).toBe("")
    expect(result.desktopPanelA?.[0].alt).toBe("")
  })

  it("preserva o conteúdo sem catálogo disponível", () => {
    expect(synchronizePublishedMediaAlts([section], [])[0]).toBe(section)
  })
})
