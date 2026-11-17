import { describe, expect, it } from "vitest"
import { PDF_PRINT_MAX_PAGE_HEIGHT, pdfPrintCss } from "./pdf-print-layout"

describe("PDF physical page flow", () => {
  it("uses stable landscape paper, with breaks before subsequent sections", () => {
    const css = pdfPrintCss("desktop", [
      { slug: "perfil", heightPx: 900 },
      { slug: "resultados", heightPx: 2350 },
    ])
    expect(css).toContain("@page { size: 1440px 900px; margin: 0; }")
    expect(css).not.toContain("@page portfolio")
    expect(css).toContain('data-pdf-section="perfil"] { break-before: auto')
    expect(css).toContain('data-pdf-section="resultados"] { break-before: page')
    expect(css).toContain("break-inside: auto !important")
  })

  it("keeps portrait mobile paper fixed for tall sections", () => {
    const css = pdfPrintCss("mobile", [{ slug: "invest-rs", heightPx: 4200 }])
    expect(css).toContain("@page { size: 390px 844px; margin: 0; }")
    expect(css).not.toContain("390px 4200px")
  })

  it("rejects invalid, duplicated and dangerously sized entries", () => {
    expect(() => pdfPrintCss("desktop", [])).toThrow()
    expect(() => pdfPrintCss("desktop", [{ slug: "../admin", heightPx: 900 }])).toThrow()
    expect(() => pdfPrintCss("mobile", [
      { slug: "perfil", heightPx: 844 }, { slug: "perfil", heightPx: 844 },
    ])).toThrow()
    expect(() => pdfPrintCss("mobile", [{ slug: "perfil", heightPx: 500 }])).toThrow()
    expect(() =>
      pdfPrintCss("mobile", [{ slug: "perfil", heightPx: PDF_PRINT_MAX_PAGE_HEIGHT + 1 }]),
    ).toThrow()
  })
})
