import { describe, expect, it } from "vitest"
import { PDF_PRINT_MAX_PAGE_HEIGHT, pdfPrintCss } from "./pdf-print-layout"

describe("PDF native named pages", () => {
  it("creates independently sized desktop pages with no margins", () => {
    const css = pdfPrintCss("desktop", [
      { slug: "perfil", heightPx: 900 },
      { slug: "resultados", heightPx: 2350 },
    ])
    expect(css).toContain("@page portfolio0 { size: 1440px 900px; margin: 0; }")
    expect(css).toContain("@page portfolio1 { size: 1440px 2350px; margin: 0; }")
    expect(css).toContain('data-pdf-section="resultados"')
    expect(css).toContain("break-after: page")
    expect(css).toContain("print-color-adjust: exact")
  })

  it("preserves mobile viewport width and tall sections", () => {
    const css = pdfPrintCss("mobile", [{ slug: "invest-rs", heightPx: 4200 }])
    expect(css).toContain("size: 390px 4200px")
    expect(css).toContain("min-width: 390px")
  })

  it("rejects invalid content and dangerous heights", () => {
    expect(() => pdfPrintCss("desktop", [])).toThrow()
    expect(() => pdfPrintCss("desktop", [{ slug: "../admin", heightPx: 900 }])).toThrow()
    expect(() => pdfPrintCss("mobile", [{ slug: "perfil", heightPx: 500 }])).toThrow()
    expect(() =>
      pdfPrintCss("mobile", [{ slug: "perfil", heightPx: PDF_PRINT_MAX_PAGE_HEIGHT + 1 }]),
    ).toThrow()
  })
})
