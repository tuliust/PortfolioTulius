import { pdfExportViewport, type PdfDevice } from "./pdf-export-options"

export const PDF_PRINT_STYLE_ID = "portfolio-pdf-print-pages"
export const PDF_PRINT_MAX_PAGE_HEIGHT = 16000

export type PdfPrintPage = { slug: string; heightPx: number }
export type PdfPrintManifest = { widthPx: number; pages: PdfPrintPage[] }

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Chrome print: one stable physical paper size per device. A logical section
 * begins on a new sheet; its contents can span continuation sheets.
 * Variable-sized named pages were unstable with real CMS data in Chrome.
 */
export function pdfPrintCss(device: PdfDevice, pages: readonly PdfPrintPage[]): string {
  const viewport = pdfExportViewport(device)
  if (
    !pages.length ||
    pages.some((page) => !VALID_SLUG.test(page.slug)) ||
    new Set(pages.map((page) => page.slug)).size !== pages.length
  ) {
    throw new Error("A seleção de páginas do PDF é inválida.")
  }
  if (
    pages.some(
      (page) =>
        !Number.isInteger(page.heightPx) ||
        page.heightPx < viewport.height ||
        page.heightPx > PDF_PRINT_MAX_PAGE_HEIGHT,
    )
  ) {
    throw new Error("Uma seção ultrapassou o limite de paginação do PDF.")
  }
  const starts = pages
    .map(
      (page, index) =>
        '.pdf-portfolio [data-pdf-section="' +
        page.slug +
        '"] { break-before: ' +
        (index === 0 ? "auto" : "page") +
        " !important; page-break-before: " +
        (index === 0 ? "auto" : "always") +
        " !important; }",
    )
    .join("\n")

  return (
    "@page { size: " +
    viewport.width +
    "px " +
    viewport.height +
    "px; margin: 0; }\n" +
    "@media print {\n" +
    "html, body, #root { width: " +
    viewport.width +
    "px !important; min-width: " +
    viewport.width +
    "px !important; max-width: none !important; height: auto !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; scroll-snap-type: none !important; }\n" +
    "body, .pdf-portfolio, .pdf-portfolio main { width: " +
    viewport.width +
    "px !important; max-width: none !important; height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }\n" +
    ".pdf-portfolio .portfolio-section { height: auto !important; max-height: none !important; break-after: auto !important; page-break-after: auto !important; break-inside: auto !important; page-break-inside: auto !important; overflow: visible !important; }\n" +
    ".pdf-portfolio .pdf-results-group, .pdf-portfolio .mobile-panel, .pdf-portfolio .desktop-panel { break-inside: auto !important; page-break-inside: auto !important; }\n" +
    ".pdf-portfolio :is(.results-metrics-grid .content-item, .experience-project, .testimonial-card, .contact-link, .experience-full-point) { break-inside: avoid !important; page-break-inside: avoid !important; }\n" +
    ".pdf-portfolio :is(.section-heading, .panel-heading, .experience-heading, .pdf-experience-column-heading, .pdf-results-group-heading) { break-after: avoid-page !important; }\n" +
    (device === "mobile"
      ? ".pdf-portfolio--mobile #perfil-a.mobile-panel { height: auto !important; min-height: 844px !important; }\n" +
        ".pdf-portfolio--mobile .contact-mobile-photo, .pdf-portfolio--mobile .contact-mobile-photo img { min-height: 422px !important; }\n"
      : "") +
    starts +
    "\n}\n"
  )
}

/** Prepare published, authorized content for Chrome's native Save as PDF. */
export function preparePdfPrintLayout(
  doc: Document,
  device: PdfDevice,
  includedSlugs: readonly string[],
): PdfPrintManifest {
  const root = doc.querySelector<HTMLElement>(".pdf-portfolio")
  const viewport = pdfExportViewport(device)
  if (!root || root.dataset.pdfDevice !== device) {
    throw new Error("A prévia não corresponde ao dispositivo selecionado.")
  }
  if (doc.documentElement.dataset.pdfExportReady !== "true") {
    throw new Error("Aguarde as fontes, imagens e Trajetórias publicadas.")
  }
  if (!includedSlugs.length || new Set(includedSlugs).size !== includedSlugs.length) {
    throw new Error("Selecione ao menos uma seção válida.")
  }
  doc.getElementById(PDF_PRINT_STYLE_ID)?.remove()
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-pdf-section]"))
  const slugs = nodes.map((section) => section.dataset.pdfSection ?? "")
  if (
    slugs.length !== includedSlugs.length ||
    slugs.some((slug, index) => slug !== includedSlugs[index])
  ) {
    throw new Error("A seleção ou a ordem não corresponde à prévia carregada.")
  }
  if (root.querySelector("[data-pdf-missing-trajectory], .pdf-export-missing-data")) {
    throw new Error("Há Trajetórias ausentes. Nenhum PDF será gerado.")
  }
  const brokenImages = Array.from(root.querySelectorAll<HTMLImageElement>("img")).filter(
    (image) => image.getClientRects().length > 0 && (!image.complete || !image.naturalWidth),
  )
  if (brokenImages.length) {
    throw new Error("Há uma imagem publicada que não foi carregada.")
  }

  // The manifest counts logical sections, never the number of printed sheets.
  const pages = slugs.map((slug) => ({ slug, heightPx: viewport.height }))
  const style = doc.createElement("style")
  style.id = PDF_PRINT_STYLE_ID
  style.textContent = pdfPrintCss(device, pages)
  doc.head.appendChild(style)

  const ids = new Set(Array.from(root.querySelectorAll("[id]")).map((node) => node.id))
  for (const anchor of Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
    const old = anchor.getAttribute("data-pdf-print-original-href")
    if (old !== null) {
      anchor.setAttribute("href", old)
      anchor.removeAttribute("data-pdf-print-original-href")
    }
    const href = anchor.getAttribute("href")
    if (!href?.startsWith("#")) continue
    const destination = decodeURIComponent(href.slice(1))
    if (!destination || ids.has(destination)) continue
    anchor.setAttribute("data-pdf-print-original-href", href)
    anchor.setAttribute("href", "https://tulius.work/" + href)
  }
  for (const slug of ["perfil", "contato"]) {
    if (!slugs.includes(slug)) continue
    if (!nodes[slugs.indexOf(slug)].querySelector("a[href]")) {
      style.remove()
      throw new Error("A seção " + slug + " não contém os hiperlinks exigidos.")
    }
  }
  return { widthPx: viewport.width, pages }
}
