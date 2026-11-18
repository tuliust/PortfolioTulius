import type { PdfDevice } from "./pdf-export-options"
import { preparePdfPrintLayout } from "./pdf-print-layout"

/**
 * Desktop retains its approved preview-side page validation. The Mobile print
 * tab has its own readiness and page validation; repeating that preparation
 * in the parent's 390px iframe can throw a cross-realm exception and prevent
 * the tab from opening.
 */
export function preparePdfPreviewForLaunch(
  document: Document,
  device: PdfDevice,
  includedSlugs: readonly string[],
  prepare: typeof preparePdfPrintLayout = preparePdfPrintLayout,
): void {
  if (device !== "desktop") return
  const manifest = prepare(document, device, includedSlugs)
  if (manifest.pages.length !== includedSlugs.length) {
    throw new Error("A quantidade de páginas não corresponde à seleção.")
  }
}

/** Errors thrown by an iframe may not pass `instanceof Error` in its parent. */
export function pdfPrintErrorMessage(reason: unknown): string {
  if (reason && typeof reason === "object" && "message" in reason) {
    const message = reason.message
    if (typeof message === "string" && message.trim()) return message
  }
  if (typeof reason === "string" && reason.trim()) return reason
  return "Não foi possível imprimir."
}
