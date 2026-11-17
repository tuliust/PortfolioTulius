/**
 * Development-only HTML fixture (not included in the production Vite build).
 * The public fallback provides editorial sample content; trajectories below
 * are synthetic. Never describe this fixture as a read of the live CMS.
 */
import React, { useEffect } from "react"
import { createRoot } from "react-dom/client"
import { sections, defaultTokens } from "./content/fallback"
import { EXPERIENCE_SLUGS } from "./components/public/ExperienceStack"
import { PdfPortfolio } from "./components/public/PdfPortfolio"
import { APPROVED_ABOUT_TABLET } from "./components/public/PublicSite"
import { PdfPrintReady } from "./components/public/PdfPrintReady"
import { selectPublishedPdfSections } from "./lib/pdf-export-sections"
import type { PdfDevice, PdfColorMode } from "./lib/pdf-export-options"
import "./index.css"

const query = new URLSearchParams(location.search)
const device: PdfDevice = query.get("device") === "mobile" ? "mobile" : "desktop"
const colorMode: PdfColorMode = query.get("palette") === "clean" ? "clean" : "original"
const simulateBrokenImage = query.get("brokenImage") === "true"
const simulateDeferredAbout = query.get("deferredAbout") === "true"
const requestedSlugs = query.get("sections")?.split(",").filter(Boolean)
const fixtureSections =
  simulateBrokenImage || simulateDeferredAbout
    ? sections.map((section) =>
        section.slug === "sobre" && simulateDeferredAbout
          ? {
              ...section,
              panelA: section.panelA.map((item, index) =>
                index === 0 ? { ...item, image: APPROVED_ABOUT_TABLET } : item,
              ),
            }
          : section.slug === "depoimentos" && simulateBrokenImage
            ? {
                ...section,
                panelA: section.panelA.map((item, index) =>
                  index === 0
                    ? { ...item, image: "/media/pdf-qa-intentionally-missing.webp" }
                    : item,
                ),
              }
            : section,
      )
    : sections

const fixtureIncludedSlugs = selectPublishedPdfSections(fixtureSections, requestedSlugs).map(
  (section) => section.slug,
)

const careerDescriptions = Object.fromEntries(
  EXPERIENCE_SLUGS.map((slug) => [
    slug,
    [
      "Trajetória sintética extensa, com volume comparável à produção.",
      ...Array.from(
        { length: 13 },
        (_, index) =>
          "• Frente sintética " +
          (index + 1) +
          ": Planejamento, comunicação institucional e articulação de fornecedores e equipes, com documentação de resultados, acompanhamento de processos e relatórios para diferentes públicos.",
      ),
    ].join("\n"),
  ]),
)

function PdfVisualFixture() {
  useEffect(() => {
    document.documentElement.dataset.pdfQaReady = "true"
    return () => {
      delete document.documentElement.dataset.pdfQaReady
    }
  }, [])

  return (
    <PdfPrintReady device={device} includedSlugs={fixtureIncludedSlugs}>
      <PdfPortfolio
        sections={fixtureSections}
        tokens={defaultTokens}
        careerDescriptions={careerDescriptions}
        device={device}
        colorMode={colorMode}
        includedSlugs={fixtureIncludedSlugs}
      />
    </PdfPrintReady>
  )
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PdfVisualFixture />
  </React.StrictMode>,
)
