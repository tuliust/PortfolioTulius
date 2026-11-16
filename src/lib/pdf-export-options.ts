/** Capture viewports; Chromium must use these CSS-pixel dimensions. */
export const PDF_EXPORT_VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const

export type PdfDevice = keyof typeof PDF_EXPORT_VIEWPORTS
export type PdfColorMode = "original" | "clean"

export function pdfExportViewport(device: PdfDevice) {
  return PDF_EXPORT_VIEWPORTS[device]
}
