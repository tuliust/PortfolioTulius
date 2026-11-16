import { describe, expect, it } from "vitest"
import { PDF_EXPORT_VIEWPORTS, pdfExportViewport } from "./pdf-export-options"

describe("PDF export reference viewports", () => {
  it("uses desktop CSS pixels", () => {
    expect(pdfExportViewport("desktop")).toEqual({ width: 1440, height: 900 })
  })

  it("uses independent mobile CSS pixels", () => {
    expect(pdfExportViewport("mobile")).toEqual({ width: 390, height: 844 })
    expect(PDF_EXPORT_VIEWPORTS.mobile.width).toBeLessThan(768)
  })
})
