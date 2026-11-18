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
/** Chrome named physical pages for complete Desktop sections; Mobile unchanged. */
function desktopPdfPrintCss(pages: readonly PdfPrintPage[]): string {
  if (
    !pages.length ||
    pages.some(
      (page) =>
        !VALID_SLUG.test(page.slug) ||
        !Number.isInteger(page.heightPx) ||
        page.heightPx < 400 ||
        page.heightPx > PDF_PRINT_MAX_PAGE_HEIGHT,
    ) ||
    new Set(pages.map((page) => page.slug)).size !== pages.length
  ) {
    throw new Error("A seleção ou altura de páginas do PDF Desktop é inválida.")
  }
  const sheets = pages.map(
    (page, index) =>
      "@page portfolio" + index + " { size: 1440px " + page.heightPx + "px; margin: 0; }",
  )
  const assignments = pages.map(
    (page, index) =>
      '.pdf-portfolio--desktop [data-pdf-section="' +
      page.slug +
      '"] { page: portfolio' +
      index +
      " !important; min-height: " +
      page.heightPx +
      "px !important; height: auto !important; max-height: none !important; " +
      "break-before: auto !important; break-after: auto !important; " +
      "break-inside: avoid !important; overflow: visible !important; }",
  )
  return [
    ...sheets,
    "@media print {",
    "html, body, #root, .pdf-portfolio, .pdf-portfolio main { width: 1440px !important; min-width: 1440px !important; max-width: none !important; height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; scroll-snap-type: none !important; }",
    ".pdf-portfolio--desktop { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }",
    ".pdf-portfolio--desktop .portfolio-section { height: auto !important; max-height: none !important; break-after: auto !important; break-before: auto !important; break-inside: auto !important; overflow: visible !important; }",
    ".pdf-portfolio--desktop #perfil .profile-desktop { min-height: 900px !important; }",
    ".pdf-portfolio--desktop .pdf-experience-layout { min-height: 0 !important; }",
    ...assignments,
    "}",
  ].join("\n")
}

/** Measure all visible section descendants before installing print styles. */
function measureDesktopSection(section: HTMLElement): PdfPrintPage {
  const box = section.getBoundingClientRect()
  const slug = section.dataset.pdfSection ?? ""
  // These transparent portraits deliberately bleed below their layout boxes.
  // Measuring their translated image bounds would extend the paper by the
  // same amount, preserving the visible orange strip below the silhouette.
  if (slug === "sobre" || slug === "contato") {
    const layout = section.querySelector<HTMLElement>(
      slug === "sobre" ? ".about-desktop" : ".contact-desktop",
    )
    if (layout) {
      const layoutBottom = layout.getBoundingClientRect().bottom - box.top
      // Contact retains its original 48px portrait bleed plus 8px of paper
      // safety, independently of the new transparent-pixel compensation.
      const bleed = slug === "contato" ? 56 : 0
      return {
        slug,
        heightPx: Math.ceil(Math.max(slug === "sobre" ? 750 : 740, layoutBottom + bleed)),
      }
    }
  }
  const bottom = Array.from(section.querySelectorAll<HTMLElement>("*")).reduce(
    (maximum, child) =>
      child.getClientRects().length
        ? Math.max(maximum, child.getBoundingClientRect().bottom)
        : maximum,
    box.bottom,
  )
  const actual = Math.max(box.height, section.scrollHeight, section.clientHeight, bottom - box.top)
  // The published Hero has a fourth highlight ("Idiomas") that escaped into
  // a second physical sheet when its pre-print height was measured below 900px.
  if (slug === "perfil") {
    return { slug, heightPx: Math.ceil(Math.max(900, actual + 12)) }
  }

  // The six company sheets can finish shortly after their lowest text
  // column, without inheriting the original immersive viewport height.
  if (["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"].includes(slug)) {
    const columns = Array.from(section.querySelectorAll<HTMLElement>(".pdf-experience-layout > *"))
    if (columns.length === 3) {
      const textBottom = Math.max(
        ...columns.map((column) => column.getBoundingClientRect().bottom - box.top),
      )
      return { slug, heightPx: Math.ceil(Math.max(400, textBottom + 64)) }
    }
  }

  // Other groups retain safety reserves against print-time grid reflow.
  let reserve = 12
  if (slug === "formacao") reserve = 240
  else if (slug === "ferramentas") reserve = 210
  else if (slug === "depoimentos") reserve = 80
  else if (slug === "resultados") reserve = 128
  else if (section.classList.contains("pdf-experience-section")) reserve = 32
  return { slug, heightPx: Math.ceil(Math.max(400, actual + reserve)) }
}

export function pdfPrintCss(device: PdfDevice, pages: readonly PdfPrintPage[]): string {
  if (device === "desktop") return desktopPdfPrintCss(pages)
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

  // Each Desktop section has its own measured sheet; Mobile remains unchanged.
  const pages =
    device === "desktop"
      ? nodes.map(measureDesktopSection)
      : slugs.map((slug) => ({ slug, heightPx: viewport.height }))
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
