import { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { useAdminGuard } from "../../hooks/useAdminGuard"
import { usePortfolio } from "../../hooks/usePortfolio"
import { publicReadClient } from "../../lib/public-read"
import { resolveCareerSectionSlug } from "../../lib/career-record-link"
import { parsePdfPreviewConfig } from "../../lib/pdf-preview-config"
import { PdfPrintReady } from "../public/PdfPrintReady"
import { selectPublishedPdfSections } from "../../lib/pdf-export-sections"
import { EXPERIENCE_SLUGS } from "../public/ExperienceStack"
import { PdfPortfolio } from "../public/PdfPortfolio"

function PublishedPdfPreview() {
  const config = parsePdfPreviewConfig(window.location.search)
  const printMode = new URLSearchParams(window.location.search).get("print") === "1"
  const { sections, tokens, source, loading, error } = usePortfolio(false)
  const [careerDetails, setCareerDetails] = useState<Record<string, string>>({})
  const [careerStatus, setCareerStatus] = useState<"loading" | "ready" | "error">("loading")
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const handle = window.setTimeout(() => setTimedOut(true), 20000)
    return () => window.clearTimeout(handle)
  }, [])

  useEffect(() => {
    let active = true
    if (!publicReadClient) {
      setCareerStatus("error")
      return
    }
    void (async () => {
      try {
        const { data, error: readError } = await publicReadClient
          .from("career_experiences")
          .select("id,company,description")
          .eq("status", "published")
        if (!active) return
        if (readError) {
          setCareerStatus("error")
          return
        }
        const records: Record<string, string> = {}
        for (const row of data ?? []) {
          const slug = resolveCareerSectionSlug(row)
          if (slug && row.description?.trim()) records[slug] = row.description
        }
        setCareerDetails(records)
        setCareerStatus("ready")
      } catch {
        if (active) setCareerStatus("error")
      }
    })()
    return () => {
      active = false
    }
  }, [])

  if (!config) return <div role="alert">Configuração da prévia inválida.</div>
  if (!publicReadClient || source !== "supabase") {
    return <div role="alert">O conteúdo publicado do Supabase não está disponível.</div>
  }
  if (error || careerStatus === "error") {
    return <div role="alert">Erro na leitura do conteúdo ou das Trajetórias publicadas.</div>
  }
  const selected = selectPublishedPdfSections(sections, config.includedSlugs)
  const found = new Set(selected.map((section) => section.slug))
  const missingSections = config.includedSlugs.some((slug) => !found.has(slug))
  const missingCareer = selected.some(
    (section) =>
      EXPERIENCE_SLUGS.some((slug) => slug === section.slug) && !careerDetails[section.slug],
  )
  if (loading || careerStatus === "loading" || missingSections || missingCareer) {
    return (
      <div role={timedOut ? "alert" : "status"}>
        {timedOut
          ? "Não foi possível carregar todas as seções e Trajetórias. Reabra a prévia."
          : "Carregando conteúdo publicado e Trajetórias…"}
      </div>
    )
  }
  return (
    <PdfPrintReady device={config.device} includedSlugs={config.includedSlugs} autoPrint={printMode}>
      {printMode && (
        <div className="pdf-print-toolbar">
          <span>Prévia pronta para salvar. Se o diálogo não abrir, use o botão ao lado.</span>
          <button type="button" onClick={() => window.print()}>
            Imprimir / Salvar PDF
          </button>
        </div>
      )}
      <PdfPortfolio
        sections={selected}
        tokens={tokens}
        careerDescriptions={careerDetails}
        device={config.device}
        colorMode={config.colorMode}
        includedSlugs={config.includedSlugs}
      />
    </PdfPrintReady>
  )
}

/** Authorization runs before the content hook is mounted. */
export function AdminPdfPreview() {
  const guard = useAdminGuard()
  if (guard === "loading") return <div className="admin-loading">Verificando autorização…</div>
  if (guard === "denied") return <Navigate to="/admin/login" replace />
  return <PublishedPdfPreview />
}
