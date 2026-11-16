import { describe, expect, it } from "vitest"
import type { PortfolioSection } from "../types/content"
import { selectPublishedPdfSections } from "./pdf-export-sections"

function section(slug: string, number: number, visible = true): PortfolioSection {
  return {
    id: slug,
    slug,
    number,
    title: slug,
    theme: "paper",
    layout: "editorial",
    status: "published",
    visible,
    panelA: [],
    panelB: [],
  }
}

describe("selectPublishedPdfSections", () => {
  it("orders only published and visible sections without mutating its input", () => {
    const input = [
      section("invest-rs", 6),
      section("competencias", 4, false),
      section("perfil", 1),
      { ...section("draft", 2), status: "draft" as const },
      section("resultados", 3),
    ]
    expect(selectPublishedPdfSections(input).map((item) => item.slug)).toEqual([
      "perfil",
      "resultados",
      "invest-rs",
    ])
    expect(input[0].slug).toBe("invest-rs")
  })

  it("supports selected sections in public order and the empty selection", () => {
    const input = [section("contato", 14), section("perfil", 1), section("vale", 8)]
    expect(selectPublishedPdfSections(input, ["vale", "perfil"]).map((item) => item.slug)).toEqual([
      "perfil",
      "vale",
    ])
    expect(selectPublishedPdfSections(input, [])).toEqual([])
  })

  it("does not expose hidden or draft content when selected", () => {
    const input = [
      section("perfil", 1),
      section("competencias", 4, false),
      { ...section("rascunho", 5), status: "draft" as const },
    ]
    expect(
      selectPublishedPdfSections(input, ["competencias", "rascunho", "perfil"]).map(
        (item) => item.slug,
      ),
    ).toEqual(["perfil"])
  })
})
