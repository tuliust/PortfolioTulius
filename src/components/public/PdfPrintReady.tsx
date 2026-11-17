import { useEffect, useState, type ReactNode } from "react"
import { PDF_PRINT_STYLE_ID, preparePdfPrintLayout } from "../../lib/pdf-print-layout"
import type { PdfDevice } from "../../lib/pdf-export-options"

async function waitForPublishedImages(): Promise<void> {
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>(".pdf-portfolio img"),
  ).filter((image) => image.getClientRects().length > 0)

  // Lazy images beyond the iframe viewport must start loading before decoding.
  for (const image of images) image.loading = "eager"
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

  let timeout: number | undefined
  try {
    await Promise.race([
      Promise.all(
        images.map(async (image) => {
          // decode() waits for a pending image request. Checking naturalWidth
          // immediately after switching lazy -> eager can report a false error.
          try {
            await image.decode()
          } catch {
            // A decoded image can occasionally reject while retaining usable pixels.
          }
          if (!image.naturalWidth) {
            const section = image.closest<HTMLElement>("[data-pdf-section]")?.dataset.pdfSection
            throw new Error(
              "A imagem publicada da seção " + (section || "não identificada") + " não carregou.",
            )
          }
        }),
      ),
      new Promise<never>((_, reject) => {
        timeout = window.setTimeout(
          () => reject(new Error("Tempo limite ao carregar as imagens da prévia.")),
          20000,
        )
      }),
    ])
  } finally {
    window.clearTimeout(timeout)
  }
}

/**
 * The PDF preview stays visible even when a published image fails to load.
 * Printing is blocked separately and the parent admin receives a precise error.
 */
export function PdfPrintReady({
  children,
  device,
  includedSlugs,
  prepareOnBeforePrint = true,
  autoPrint = false,
}: {
  children: ReactNode
  device: PdfDevice
  includedSlugs: string[]
  prepareOnBeforePrint?: boolean
  autoPrint?: boolean
}) {
  const [printError, setPrintError] = useState("")
  const selection = includedSlugs.join("|")

  useEffect(() => {
    let active = true
    document.documentElement.removeAttribute("data-pdf-export-ready")
    const notify = (type: "portfolio-pdf-ready" | "portfolio-pdf-error", message?: string) => {
      if (window.parent !== window) {
        window.parent.postMessage({ type, device, includedSlugs, message }, window.location.origin)
      }
    }
    const prepare = async () => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      await document.fonts.ready
      await waitForPublishedImages()
      if (!active) return
      setPrintError("")
      document.documentElement.dataset.pdfExportReady = "true"
      notify("portfolio-pdf-ready")
      if (autoPrint && window.parent === window) {
        preparePdfPrintLayout(document, device, includedSlugs)
        window.setTimeout(() => {
          if (active) window.print()
        }, 150)
      }
    }
    void prepare().catch((reason: unknown) => {
      if (!active) return
      const message =
        reason instanceof Error ? reason.message : "Não foi possível carregar a prévia."
      setPrintError(message)
      notify("portfolio-pdf-error", message)
    })

    const beforePrint = () => {
      try {
        // Chrome may fire beforeprint while the @page rules are already active.
        // Do not remeasure the page geometry once prepared for printing.
        if (document.getElementById(PDF_PRINT_STYLE_ID)) return
        preparePdfPrintLayout(document, device, includedSlugs)
      } catch (reason) {
        if (!active) return
        const message =
          reason instanceof Error ? reason.message : "Não foi possível preparar a impressão."
        setPrintError(message)
        notify("portfolio-pdf-error", message)
      }
    }
    if (prepareOnBeforePrint) window.addEventListener("beforeprint", beforePrint)
    return () => {
      active = false
      document.documentElement.removeAttribute("data-pdf-export-ready")
      window.removeEventListener("beforeprint", beforePrint)
    }
  }, [device, selection, prepareOnBeforePrint, autoPrint])

  return (
    <>
      {printError && (
        <p role="alert" data-pdf-readiness-error="true" className="pdf-readiness-error">
          Prévia disponível, mas a geração está bloqueada: {printError}
        </p>
      )}
      {children}
    </>
  )
}
