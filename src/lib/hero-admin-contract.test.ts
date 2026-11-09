import { describe, expect, it } from "vitest"
import type { ContentItem } from "../types/content"
import {
  hasHeroMediaControls,
  publishedHeroDestinations,
  reorderHeroItems,
  unavailableHeroDestination,
} from "./hero-admin-contract"

const sections = [
  { slug: "perfil", status: "published", is_visible: true },
  { slug: "resultados", status: "published", is_visible: true },
  { slug: "invest-rs", status: "published", is_visible: true },
  { slug: "competencias", status: "published", is_visible: false },
  { slug: "rascunho", status: "draft", is_visible: true },
]

describe("P1 — contrato funcional do editor Hero", () => {
  it("oferece somente destinos publicados, visíveis e diferentes do próprio Hero", () => {
    expect(publishedHeroDestinations(sections).map((section) => section.slug)).toEqual([
      "resultados",
      "invest-rs",
    ])
  })

  it("impede salvar destinos ocultos ou despublicados, inclusive a seta inferior", () => {
    expect(
      unavailableHeroDestination([{ title: "Tema", targetSlug: "competencias" }], "", sections),
    ).toBe("competencias")
    expect(unavailableHeroDestination([{ title: "Tema" }], "rascunho", sections)).toBe("rascunho")
    expect(
      unavailableHeroDestination(
        [{ title: "Tema", targetSlug: "resultados" }],
        "invest-rs",
        sections,
      ),
    ).toBeUndefined()
  })

  it("mantém os metadados globais no primeiro item ao mover o primeiro botão para baixo", () => {
    const metadata = {
      secondaryTitle: "Experiência e atuação",
      nextColor: "#FF5414",
      fieldFormats: { title: { desktopSize: 104 } },
    }
    const items: ContentItem[] = Array.from({ length: 11 }, (_, index) => ({
      title: "Item " + (index + 1),
      ...(index === 0 ? { hero: metadata } : {}),
    }))
    const reordered = reorderHeroItems(items, 0, 1, "b")
    expect(reordered[0].title).toBe("Item 2")
    expect(reordered[1].title).toBe("Item 1")
    expect(reordered[0].hero).toEqual(metadata)
    expect(reordered[1].hero).toBeUndefined()
    expect(items[0].title).toBe("Item 1")
    expect(items[0].hero).toEqual(metadata)
  })

  it("preserva os metadados ao mover o segundo botão para cima", () => {
    const items: ContentItem[] = [
      { title: "A", hero: { nextTarget: "resultados" } },
      { title: "B" },
    ]
    expect(reorderHeroItems(items, 1, -1, "b")).toEqual([
      { title: "B", hero: { nextTarget: "resultados" } },
      { title: "A" },
    ])
  })

  it("não mistura botões principais, destaques ou o retrato fixo do Hero", () => {
    const items: ContentItem[] = Array.from({ length: 11 }, (_, index) => ({
      title: "Item " + (index + 1),
    }))
    expect(reorderHeroItems(items, 4, 1, "b")).toEqual(items)
    expect(reorderHeroItems(items, 5, -1, "b")).toEqual(items)
    expect(reorderHeroItems(items, 1, -1, "a")).toEqual(items)
    expect(reorderHeroItems(items, 7, -1, "b")[6].title).toBe("Item 8")
  })

  it("exibe geometria de foto/selo somente no primeiro item do Hero esquerdo", () => {
    expect(hasHeroMediaControls("perfil", "a", 0)).toBe(true)
    expect(hasHeroMediaControls("perfil", "b", 0)).toBe(false)
    expect(hasHeroMediaControls("perfil", "a", 1)).toBe(false)
    expect(hasHeroMediaControls("sobre", "a", 0)).toBe(false)
  })
})
