import { pdfExportViewport, type PdfDevice } from "./pdf-export-options"

export const PDF_PRINT_STYLE_ID = "portfolio-pdf-print-pages"
export const PDF_PRINT_MAX_PAGE_HEIGHT = 16000

export type PdfPrintPage = { slug: string; heightPx: number }
export type PdfPrintManifest = { widthPx: number; pages: PdfPrintPage[] }

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Native CSS named pages preserve vector text, links, and original colors. */
export function pdfPrintCss(device: PdfDevice, pages: readonly PdfPrintPage[]): string {
  const viewport = pdfExportViewport(device)
  if (!pages.length || pages.some((page) => !VALID_SLUG.test(page.slug))) {
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

  const declarations = pages
    .map(
      (page, index) =>
        "@page portfolio" +
        index +
        " { size: " +
        viewport.width +
        "px " +
        page.heightPx +
        "px; margin: 0; }",
    )
    .join("\n")
  const assignments = pages
    .map(
      (page, index) =>
        '.pdf-portfolio [data-pdf-section="' +
        page.slug +
        '"] { page: portfolio' +
        index +
        " !important; height: " +
        page.heightPx +
        "px !important; min-height: " +
        page.heightPx +
        "px !important; break-before: auto !important; break-after: page !important; overflow: visible !important; }",
    )
    .join("\n")
  // In print, 100svh follows the variable PDF page height rather than the
  // 844px mobile reference. Freeze only these PDF-specific viewport elements.
  const mobileViewportFreeze =
    device === "mobile"
      ? ".pdf-portfolio--mobile #perfil-a.mobile-panel { height: 844px !important; min-height: 844px !important; }\n" +
        ".pdf-portfolio--mobile .contact-mobile-photo, .pdf-portfolio--mobile .contact-mobile-photo img { min-height: 422px !important; }\n"
      : ""
  return (
    declarations +
    "\n@media print {\n" +
    "html, body, #root { width: " +
    viewport.width +
    "px !important; min-width: " +
    viewport.width +
    "px !important; max-width: none !important; height: auto !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; scroll-snap-type: none !important; }\n" +
    "body, .pdf-portfolio, .pdf-portfolio main { width: " +
    viewport.width +
    "px !important; max-width: none !important; height: auto !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }\n" +
    ".pdf-portfolio .portfolio-section:last-child { break-after: auto !important; }\n" +
    assignments +
    "\n" +
    mobileViewportFreeze +
    "\n}\n"
  )
}

/**
 * Prepare a complete authorized preview for Chrome's native Save as PDF.
 * No CMS mutation, rasterization, upload or PDF server is involved.
 */
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

  const pages = nodes.map((section) => {
    const bounds = section.getBoundingClientRect()
    // Section.scrollHeight can stay at the mobile viewport minimum even when
    // descendant text extends past the section before print reflow.
    const visibleContentBottom = Array.from(section.querySelectorAll<HTMLElement>("*")).reduce(
      (bottom, child) => {
        if (!child.getClientRects().length) return bottom
        return Math.max(bottom, child.getBoundingClientRect().bottom)
      },
      bounds.bottom,
    )
    const measuredHeight = Math.max(
      viewport.height,
      section.scrollHeight,
      section.clientHeight,
      bounds.height,
      visibleContentBottom - bounds.top,
    )
    // Print fonts and svh-based blocks can reflow when Chromium assigns a
    // variable-height named page. The reserve prevents a trailing fragment.
    const reserve = device === "mobile" ? 96 : 8
    return { slug: section.dataset.pdfSection ?? "", heightPx: Math.ceil(measuredHeight + reserve) }
  })
  const css = pdfPrintCss(device, pages)
  doc.getElementById(PDF_PRINT_STYLE_ID)?.remove()
  const style = doc.createElement("style")
  style.id = PDF_PRINT_STYLE_ID
  style.textContent = css
  doc.head.appendChild(style)

  // Internal links to excluded sections open the corresponding public page.
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
