import { describe, expect, it } from "vitest"
import { PDF_PRINT_MAX_PAGE_HEIGHT, pdfPrintCss } from "./pdf-print-layout"

describe("PDF native print pagination", () => {
  it("gives Desktop sections variable heights without a second forced break", () => {
    const css = pdfPrintCss("desktop", [
      { slug: "perfil", heightPx: 912 },
      { slug: "resultados", heightPx: 1375 },
      { slug: "formacao", heightPx: 520 },
    ])
    expect(css).toContain("@page portfolio0 { size: 1440px 912px; margin: 0; }")
    expect(css).toContain("@page portfolio1 { size: 1440px 1375px; margin: 0; }")
    expect(css).toContain("@page portfolio2 { size: 1440px 520px; margin: 0; }")
    expect(css).toContain('data-pdf-section="resultados"] { page: portfolio1')
    expect(css).toContain("break-after: auto !important")
    expect(css).toContain("min-height: 1375px !important")
    expect(css).not.toContain("break-after: page !important")
  })

  it("retains the Mobile fixed-sheet layout", () => {
    const css = pdfPrintCss("mobile", [
      { slug: "perfil", heightPx: 844 },
      { slug: "invest-rs", heightPx: 844 },
    ])
    expect(css).toContain("@page { size: 390px 844px; margin: 0; }")
    expect(css).not.toContain("@page portfolio0")
    expect(css).toContain('data-pdf-section="invest-rs"] { break-before: page')
  })

  it("rejects invalid, duplicate or excessively tall pages", () => {
    expect(() => pdfPrintCss("desktop", [])).toThrow()
    expect(() => pdfPrintCss("desktop", [{ slug: "../admin", heightPx: 900 }])).toThrow()
    expect(() =>
      pdfPrintCss("mobile", [
        { slug: "perfil", heightPx: 844 },
        { slug: "perfil", heightPx: 844 },
      ]),
    ).toThrow()
    expect(() => pdfPrintCss("desktop", [{ slug: "formacao", heightPx: 399 }])).toThrow()
    expect(() => pdfPrintCss("mobile", [{ slug: "perfil", heightPx: 500 }])).toThrow()
    expect(() =>
      pdfPrintCss("desktop", [{ slug: "invest-rs", heightPx: PDF_PRINT_MAX_PAGE_HEIGHT + 1 }]),
    ).toThrow()
  })
})
