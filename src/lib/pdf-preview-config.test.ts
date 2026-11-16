import { describe, expect, it } from "vitest"
import { buildPdfPreviewUrl, parsePdfPreviewConfig } from "./pdf-preview-config"

describe("PDF admin preview configuration", () => {
  it("round trips all four variants", () => {
    for (const device of ["desktop", "mobile"] as const) {
      for (const colorMode of ["original", "clean"] as const) {
        const config = { device, colorMode, includedSlugs: ["perfil", "resultados"] }
        const url = buildPdfPreviewUrl(config)
        expect(url).not.toBeNull()
        expect(parsePdfPreviewConfig(new URL(url!, "https://example.test").search)).toEqual(config)
      }
    }
  })

  it("rejects invalid options or an empty selection", () => {
    expect(
      buildPdfPreviewUrl({ device: "mobile", colorMode: "clean", includedSlugs: [] }),
    ).toBeNull()
    expect(parsePdfPreviewConfig("?device=mobile&palette=clean")).toBeNull()
    expect(parsePdfPreviewConfig("?device=tablet&palette=clean&section=perfil")).toBeNull()
    expect(parsePdfPreviewConfig("?device=mobile&palette=blue&section=perfil")).toBeNull()
    expect(parsePdfPreviewConfig("?device=mobile&palette=clean&section=..%2Ffoo")).toBeNull()
  })

  it("removes duplicates, leaving CMS ordering to the renderer", () => {
    const parsed = parsePdfPreviewConfig(
      "?device=desktop&palette=original&section=vale&section=perfil&section=vale",
    )
    expect(parsed?.includedSlugs).toEqual(["vale", "perfil"])
  })
})
