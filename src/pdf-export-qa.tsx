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
import { preparePdfPrintLayout } from "./lib/pdf-print-layout"
import type { PdfDevice, PdfColorMode } from "./lib/pdf-export-options"
import "./index.css"

const query = new URLSearchParams(location.search)
const device: PdfDevice = query.get("device") === "mobile" ? "mobile" : "desktop"
const colorMode: PdfColorMode = query.get("palette") === "clean" ? "clean" : "original"
const simulateBrokenImage = query.get("brokenImage") === "true"
const simulateDeferredAbout = query.get("deferredAbout") === "true"
const simulateEditorial360 = query.get("editorial360") === "true"
const requestedSlugs = query.get("sections")?.split(",").filter(Boolean)
const fixtureSections = sections.map((section) => {
  if (section.slug === "perfil" && simulateEditorial360) {
    return {
      ...section,
      panelA: section.panelA.map((item, index) =>
        index === 0
          ? { ...item, hero: { ...item.hero, mobileEditorial: { enabled: true } } }
          : item,
      ),
    }
  }
  if (section.slug === "sobre" && device === "mobile") {
    // The isolated fallback formerly had different, shorter final headlines.
    // Match the five published blocks supplied for the real PDF comparison.
    const printReference = [
      [
        "Estratégia também é escuta.",
        "Diálogo como prioridade para compreender demandas, alinhar expectativas e orientar ações.",
      ],
      [
        "Comunicação de ponta a ponta",
        "Vivência em diferentes etapas, processos e perspectivas da Comunicação.",
      ],
      [
        "Visão editorial",
        "Clareza e repertório para temas complexos, construção de narrativas e abordagens para diferentes públicos.",
      ],
      [
        "Resultados que orientam decisões",
        "Monitoramento, análise de indicadores e apresentação de resultados para aprimorar ações.",
      ],
      [
        "Comunicação para lideranças",
        "Posicionamento e mensagens que fortalecem credibilidade e criam conexões.",
      ],
    ]
    return {
      ...section,
      panelB: section.panelB.map((item, index) =>
        printReference[index]
          ? { ...item, title: printReference[index][0], text: printReference[index][1] }
          : item,
      ),
      panelA: simulateDeferredAbout
        ? section.panelA.map((item, index) =>
            index === 0 ? { ...item, image: APPROVED_ABOUT_TABLET } : item,
          )
        : section.panelA,
    }
  }
  if (section.slug === "sobre" && simulateDeferredAbout) {
    return {
      ...section,
      panelA: section.panelA.map((item, index) =>
        index === 0 ? { ...item, image: APPROVED_ABOUT_TABLET } : item,
      ),
    }
  }
  if (section.slug === "depoimentos" && simulateBrokenImage) {
    return {
      ...section,
      panelA: section.panelA.map((item, index) =>
        index === 0 ? { ...item, image: "/media/pdf-qa-intentionally-missing.webp" } : item,
      ),
    }
  }
  return section
})

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

// This hook exists only on the isolated, non-published QA entrypoint. Production
// builds cannot dynamically import a raw /src/*.ts module as Vite dev can.
Object.assign(window, { __pdfQaPrepare: preparePdfPrintLayout })

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PdfVisualFixture />
  </React.StrictMode>,
)
