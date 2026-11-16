import type { CSSProperties } from "react"
import type { DesignTokens, PortfolioSection } from "../../types/content"
import { heroColor, heroFont } from "../../lib/hero-formatting"
import { selectPublishedPdfSections } from "../../lib/pdf-export-sections"
import {
  RESULT_THEME_KEYS,
  ResultsCenter,
  Section,
  TestimonialCards,
} from "./PublicSite"
import { EXPERIENCE_SLUGS, PdfExperienceSection } from "./ExperienceStack"
import "./PdfPortfolio.css"

export type PdfDevice = "desktop" | "mobile"
export type PdfColorMode = "original" | "clean"

export type PdfPortfolioProps = {
  sections: readonly PortfolioSection[]
  tokens: DesignTokens
  careerDescriptions: Readonly<Record<string, string>>
  device: PdfDevice
  colorMode: PdfColorMode
  includedSlugs?: readonly string[]
}

/** Same CMS typography/color tokens as PublicSite, scoped to the export. */
function pdfSiteStyle(tokens: DesignTokens, colorMode: PdfColorMode): CSSProperties {
  const typographyVariables: Record<string, string> = {}
  for (const [key, config] of Object.entries(tokens.editorialStyles ?? {})) {
    if (!/^typography\.[a-z0-9-]+$/.test(key)) continue
    const name = key.slice("typography.".length)
    if (typeof config.desktopPx === "number" && Number.isFinite(config.desktopPx)) {
      typographyVariables["--hero-style-" + name + "-desktop"] = config.desktopPx + "px"
    }
    if (typeof config.mobilePx === "number" && Number.isFinite(config.mobilePx)) {
      typographyVariables["--hero-style-" + name + "-mobile"] = config.mobilePx + "px"
    }
    const font = heroFont(config.fontToken)
    const color = heroColor(config.colorToken)
    if (font) typographyVariables["--hero-style-" + name + "-font"] = font
    if (color) typographyVariables["--hero-style-" + name + "-color"] = color
  }
  const clean = colorMode === "clean"
  return {
    ...typographyVariables,
    "--white": clean ? "#FFFFFF" : tokens.white,
    "--font-serif": '"Georgia", serif',
    "--orange": clean ? "#555555" : tokens.orange,
    "--ink": clean ? "#171717" : tokens.ink,
    "--paper": clean ? "#FFFFFF" : tokens.paper,
    "--light-gray": clean ? "#FFFFFF" : tokens.lightGray,
    "--cream": clean ? "#FFFFFF" : tokens.cream,
    "--muted": clean ? "#555555" : tokens.muted,
    "--orange-dark": clean ? "#454545" : tokens.orangeDark,
    "--container": tokens.container + "px",
    "--section-space": tokens.sectionSpace + "px",
    "--card-radius": tokens.cardRadius + "px",
    "--motion-duration": "0ms",
    "--header": "0px",
    "--font-heading": '"' + tokens.headingFont + '", "Arial Narrow", sans-serif',
    "--font-display": '"' + tokens.headingFont + '", "Arial Narrow", sans-serif',
    "--font-body": '"' + tokens.bodyFont + '", system-ui, sans-serif',
  } as CSSProperties
}

function PdfResultsSection({ section, isMobile }: { section: PortfolioSection; isMobile: boolean }) {
  const topics = isMobile ? section.panelB : (section.desktopPanelB ?? section.panelB)
  return (
    <section
      id={section.slug}
      data-section={section.slug}
      data-pdf-section={section.slug}
      className={"portfolio-section pdf-results-section theme-" + section.theme}
    >
      <div className="pdf-results-page">
        <header className="section-heading">
          <h2>{section.title}</h2>
          {section.intro && <p className="section-intro">{section.intro}</p>}
        </header>
        <div className="pdf-results-flow">
          <div className="pdf-results-group pdf-results-overview">
            <h3 className="pdf-results-group-heading">Visão geral — indicadores</h3>
            <ResultsCenter section={section} selectedTheme={null} mobile={isMobile} />
          </div>
          {topics.map((topic, index) => (
            <div className="pdf-results-group" key={topic.themeKey || index}>
              <ResultsCenter
                section={section}
                selectedTheme={topic.themeKey || RESULT_THEME_KEYS[index]}
                mobile={isMobile}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PdfTestimonialsSection({
  section,
  isMobile,
}: {
  section: PortfolioSection
  isMobile: boolean
}) {
  const items = isMobile
    ? [...section.panelA, ...section.panelB]
    : [...(section.desktopPanelA ?? section.panelA), ...(section.desktopPanelB ?? section.panelB)]
  return (
    <section
      id={section.slug}
      data-section={section.slug}
      data-pdf-section={section.slug}
      className={"portfolio-section pdf-testimonials-section theme-" + section.theme}
    >
      <div className="pdf-testimonials-page">
        <header className="section-heading">
          <h2>{section.title}</h2>
          {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
        </header>
        <TestimonialCards items={items} expandedForExport />
      </div>
    </section>
  )
}

/**
 * Read-only document renderer. The caller supplies a consistent published
 * CMS snapshot and all published career descriptions. This is not a PDF engine.
 */
export function PdfPortfolio({
  sections,
  tokens,
  careerDescriptions,
  device,
  colorMode,
  includedSlugs,
}: PdfPortfolioProps) {
  const ordered = selectPublishedPdfSections(sections, includedSlugs)
  const publishedSlugs = ordered.map((section) => section.slug)
  const isMobile = device === "mobile"

  return (
    <div
      className={"public-site pdf-portfolio pdf-portfolio--" + device + " pdf-portfolio--" + colorMode}
      data-pdf-device={device}
      data-pdf-palette={colorMode}
      style={pdfSiteStyle(tokens, colorMode)}
    >
      <main>
        <h1 className="sr-only">Tulius Tsangaropulos — portfólio profissional</h1>
        {ordered.map((section, index) => {
          if (EXPERIENCE_SLUGS.includes(section.slug as (typeof EXPERIENCE_SLUGS)[number])) {
            return (
              <PdfExperienceSection
                key={section.id}
                section={section}
                isMobile={isMobile}
                detail={careerDescriptions[section.slug]}
              />
            )
          }
          if (section.slug === "resultados") {
            return <PdfResultsSection key={section.id} section={section} isMobile={isMobile} />
          }
          if (section.slug === "depoimentos") {
            return <PdfTestimonialsSection key={section.id} section={section} isMobile={isMobile} />
          }
          return (
            <Section
              key={section.id}
              section={section}
              nextSectionSlug={ordered[index + 1]?.slug}
              publishedSlugs={publishedSlugs}
              selectedTheme={null}
              isMobile={isMobile}
              onSelectTheme={() => undefined}
            />
          )
        })}
      </main>
    </div>
  )
}
