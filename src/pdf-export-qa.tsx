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
import { PdfPrintReady } from "./components/public/PdfPrintReady"
import { selectPublishedPdfSections } from "./lib/pdf-export-sections"
import type { PdfDevice, PdfColorMode } from "./lib/pdf-export-options"
import "./index.css"

const query = new URLSearchParams(location.search)
const device: PdfDevice = query.get("device") === "mobile" ? "mobile" : "desktop"
const colorMode: PdfColorMode = query.get("palette") === "clean" ? "clean" : "original"
const simulateBrokenImage = query.get("brokenImage") === "true"
const fixtureSections = simulateBrokenImage
  ? sections.map((section) =>
      section.slug === "depoimentos"
        ? {
            ...section,
            panelA: section.panelA.map((item, index) =>
              index === 0 ? { ...item, image: "/media/pdf-qa-intentionally-missing.webp" } : item,
            ),
          }
        : section,
    )
  : sections

const careerDescriptions = Object.fromEntries(
  EXPERIENCE_SLUGS.map((slug) => [
    slug,
    [
      "Trajetória para o ensaio visual isolado com informações sintéticas.",
      "• Comunicação institucional: Planejamento e produção de mensagens e materiais para diferentes públicos.",
      "• Relacionamento estratégico: Articulação de equipes, fornecedores e parceiros institucionais.",
      "• Projetos: Integração entre planejamento editorial, conteúdo, dados e governança.",
      "• Gestão: Coordenação de entregas e acompanhamento da execução de iniciativas.",
      "• Resultados: Monitoramento, documentação e análise dos projetos realizados.",
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
    <PdfPrintReady
      device={device}
      includedSlugs={selectPublishedPdfSections(fixtureSections).map((section) => section.slug)}
    >
      <PdfPortfolio
        sections={fixtureSections}
        tokens={defaultTokens}
        careerDescriptions={careerDescriptions}
        device={device}
        colorMode={colorMode}
      />
    </PdfPrintReady>
  )
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PdfVisualFixture />
  </React.StrictMode>,
)
