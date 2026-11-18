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

export const PDF_MOBILE_REFERENCE_STYLE_ID = "portfolio-pdf-mobile-reference"

/**
 * Chrome can open the print tab at desktop window width even when the document
 * itself is Mobile (390px). In that case media queries from the site's mobile
 * CSS stop matching, and the printout no longer resembles the 390px iframe.
 * Reapply those existing CSS rules for the reference viewport, substituting
 * viewport-width units with the 390px PDF container width.
 */
/** Check legacy and minified CSS range-syntax width conditions. */
function isMobileWidthMedia(query: string): boolean {
  return /\b(?:min|max)-width\s*:|\bwidth\s*(?::|[<>]=?)|[<>]=?\s*width\b/i.test(query)
}

/**
 * Evaluate compiled @media syntax against the *document* reference viewport,
 * not the outer tab. Vite production builds can rewrite `max-width: 767px`
 * as `width <= 767px`, which the former regex-only check did not recognize.
 */
function ensureMobileReferenceCss(doc: Document): void {
  if (doc.getElementById(PDF_MOBILE_REFERENCE_STYLE_ID)) return

  // A detached iframe has no dependable viewport. Mount a non-rendering
  // same-origin probe temporarily and remove it before measuring pages.
  const probe = doc.createElement("iframe")
  probe.setAttribute("aria-hidden", "true")
  probe.tabIndex = -1
  probe.style.cssText =
    "position:fixed;left:0;top:0;width:390px;height:844px;border:0;visibility:hidden;pointer-events:none;z-index:-1"
  doc.body.appendChild(probe)

  const normalizedBaseRules: string[] = []
  const mobileRules: string[] = []
  try {
    const referenceWindow = probe.contentWindow
    if (!referenceWindow) {
      throw new Error("Não foi possível verificar as dimensões responsivas do PDF Mobile.")
    }
    const walk = (rules: CSSRuleList, insideMobileMedia: boolean): void => {
      for (const rule of Array.from(rules)) {
        if (rule.type === CSSRule.MEDIA_RULE) {
          const media = rule as CSSMediaRule
          const query = media.media.mediaText
          if (referenceWindow.matchMedia(query).matches) {
            walk(media.cssRules, insideMobileMedia || isMobileWidthMedia(query))
          }
          continue
        }
        if (rule.type === CSSRule.STYLE_RULE) {
          const styleRule = rule as CSSStyleRule
          if (insideMobileMedia) {
            mobileRules.push(styleRule.cssText)
          } else {
            // Only viewport-dependent declarations: do not reintroduce base
            // display:grid after Mobile display:block (experience columns).
            const viewportDeclarations = Array.from(styleRule.style)
              .filter((name) =>
                /\d(?:vw|svh|dvh|lvh|vh)\b/.test(styleRule.style.getPropertyValue(name)),
              )
              .map((name) => {
                const value = styleRule.style
                  .getPropertyValue(name)
                  .replace(/(-?\d+(?:\.\d+)?)vw\b/g, "$1cqw")
                  .replace(
                    /(-?\d+(?:\.\d+)?)(?:svh|dvh|lvh|vh)\b/g,
                    (_match, unit) => String(Math.round((Number(unit) * 844) / 100)) + "px",
                  )
                const priority = styleRule.style.getPropertyPriority(name) ? " !important" : ""
                return name + ": " + value + priority + ";"
              })
            if (viewportDeclarations.length) {
              normalizedBaseRules.push(
                styleRule.selectorText + " { " + viewportDeclarations.join(" ") + " }",
              )
            }
          }
          continue
        }
        // Production CSS can wrap @media rules in @layer or @supports.
        // Traverse grouping rules, preserving their source order.
        if ("cssRules" in rule) {
          walk((rule as CSSGroupingRule).cssRules, insideMobileMedia)
        }
      }
    }
    for (const sheet of Array.from(doc.styleSheets)) {
      try {
        walk(sheet.cssRules, false)
      } catch (error) {
        if (error instanceof DOMException && error.name === "SecurityError") {
          continue // A third-party CSS file is not part of the local layout.
        }
        throw error
      }
    }
  } finally {
    probe.remove()
  }
  if (!mobileRules.length) {
    throw new Error("As regras responsivas do PDF Mobile não foram carregadas.")
  }
  // Keep the original cascade: converted base sizes first, actual responsive
  // selectors afterwards, restricted to the PDF-only internal 390px canvas.
  const style = doc.createElement("style")
  style.id = PDF_MOBILE_REFERENCE_STYLE_ID
  style.textContent = [...normalizedBaseRules, ...mobileRules]
    .join("\n")
    .replace(/(-?\d+(?:\.\d+)?)vw\b/g, "$1cqw")
    .replace(
      /(-?\d+(?:\.\d+)?)(?:svh|dvh|lvh|vh)\b/g,
      (_match, unit) => String(Math.round((Number(unit) * 844) / 100)) + "px",
    )
  doc.head.appendChild(style)
}

/** One variable-height physical Mobile sheet per complete published section. */
function mobilePdfPrintCss(pages: readonly PdfPrintPage[]): string {
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
    throw new Error("A seleção ou altura das páginas do PDF Mobile é inválida.")
  }
  const sheets = pages.map(
    (page, index) =>
      "@page portfolioMobile" + index + " { size: 390px " + page.heightPx + "px; margin: 0; }",
  )
  const assignments = pages.map(
    (page, index) =>
      '.pdf-portfolio--mobile [data-pdf-section="' +
      page.slug +
      '"] { page: portfolioMobile' +
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
    "html, body, #root, .pdf-portfolio--mobile, .pdf-portfolio--mobile main { width: 390px !important; min-width: 390px !important; max-width: 390px !important; height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; scroll-snap-type: none !important; }",
    ".pdf-portfolio--mobile { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }",
    ".pdf-portfolio--mobile .portfolio-section { height: auto !important; max-height: none !important; break-after: auto !important; break-before: auto !important; break-inside: auto !important; overflow: visible !important; }",
    ".pdf-portfolio--mobile .pdf-results-overview .results-metrics-grid { grid-template-columns: minmax(0, 1fr) !important; }",
    ".pdf-portfolio--mobile .pdf-results-group:not(.pdf-results-overview) .results-metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }",
    ".pdf-portfolio--mobile #perfil-a.mobile-panel { height: auto !important; min-height: 0 !important; }",
    ".pdf-portfolio--mobile .contact-mobile-photo, .pdf-portfolio--mobile .contact-mobile-photo img { min-height: 422px !important; }",
    ...assignments,
    "}",
  ].join("\n")
}

function measureMobileSection(section: HTMLElement): PdfPrintPage {
  const box = section.getBoundingClientRect()
  const doc = section.ownerDocument
  let bottom = box.top

  // Empty layout leaves can grow with the external browser viewport even
  // though every printed line stays at the same position. Measure glyph
  // rectangles and actual media boxes rather than arbitrary leaf elements.
  const walker = doc.createTreeWalker(section, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.textContent?.trim()) continue
    const range = doc.createRange()
    range.selectNodeContents(node)
    for (const rect of Array.from(range.getClientRects())) {
      bottom = Math.max(bottom, rect.bottom)
    }
  }
  for (const media of Array.from(section.querySelectorAll("img, svg, canvas, video"))) {
    if (media.getClientRects().length > 0) {
      bottom = Math.max(bottom, media.getBoundingClientRect().bottom)
    }
  }

  // Protect the final caption, photo or punctuation without creating an
  // orphaned sheet when printing a tall trajectory or second mobile panel.
  const reserve = section.dataset.pdfSection === "sobre" ? 64 : 72
  return {
    slug: section.dataset.pdfSection ?? "",
    heightPx: Math.ceil(Math.max(400, bottom - box.top + reserve)),
  }
}

export function pdfPrintCss(device: PdfDevice, pages: readonly PdfPrintPage[]): string {
  if (device === "desktop") return desktopPdfPrintCss(pages)
  return mobilePdfPrintCss(pages)
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

  // Preserve the approved Desktop geometry. Mobile uses its own 390px CSS
  // viewport rules and a measured, independent physical sheet per section.
  if (device === "mobile") ensureMobileReferenceCss(doc)
  const pages =
    device === "desktop" ? nodes.map(measureDesktopSection) : nodes.map(measureMobileSection)
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
