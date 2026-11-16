import { useEffect, useState, type ReactNode } from "react"
import { Navigate } from "react-router"
import { useAdminGuard } from "../../hooks/useAdminGuard"
import { usePortfolio } from "../../hooks/usePortfolio"
import { publicReadClient } from "../../lib/public-read"
import { resolveCareerSectionSlug } from "../../lib/career-record-link"
import { parsePdfPreviewConfig } from "../../lib/pdf-preview-config"
import { preparePdfPrintLayout } from "../../lib/pdf-print-layout"
import { selectPublishedPdfSections } from "../../lib/pdf-export-sections"
import { EXPERIENCE_SLUGS } from "../public/ExperienceStack"
import { PdfPortfolio } from "../public/PdfPortfolio"

/**
 * Prepare the authenticated document for print. Offscreen lazy images must
 * load before the parent admin enables printing.
 */
function PdfPrintReady({
  children,
  device,
  includedSlugs,
}: {
  children: ReactNode
  device: "desktop" | "mobile"
  includedSlugs: string[]
}) {
  const [printError, setPrintError] = useState("")
  const selection = includedSlugs.join("|")

  useEffect(() => {
    let active = true
    document.documentElement.removeAttribute("data-pdf-export-ready")
    const prepare = async () => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      await document.fonts.ready
      const images = Array.from(document.querySelectorAll<HTMLImageElement>(".pdf-portfolio img"))
        .filter((image) => image.getClientRects().length > 0)
      images.forEach((image) => { image.loading = "eager" })
      const loaded = Promise.all(
        images.map(async (image) => {
          if (!image.complete) {
            await new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), { once: true })
              image.addEventListener("error", () => resolve(), { once: true })
            })
          }
          if (!image.naturalWidth) throw new Error("Uma imagem publicada não carregou.")
          try {
            await image.decode()
          } catch {
            if (!image.naturalWidth) throw new Error("Uma imagem publicada não carregou.")
          }
        }),
      )
      await Promise.race([
        loaded,
        new Promise<never>((_, reject) =>
          window.setTimeout(
            () => reject(new Error("Tempo limite no carregamento das imagens.")),
            20000,
          ),
        ),
      ])
      if (!active) return
      document.documentElement.dataset.pdfExportReady = "true"
      if (window.parent !== window) {
        window.parent.postMessage(
          { type: "portfolio-pdf-ready", device, includedSlugs },
          window.location.origin,
        )
      }
    }
    void prepare().catch((reason: unknown) => {
      if (active) setPrintError(reason instanceof Error ? reason.message : "Erro na prévia.")
    })

    const beforePrint = () => {
      try {
        preparePdfPrintLayout(document, device, includedSlugs)
      } catch (reason) {
        if (active) setPrintError(reason instanceof Error ? reason.message : "Erro de impressão.")
      }
    }
    window.addEventListener("beforeprint", beforePrint)
    return () => {
      active = false
      document.documentElement.removeAttribute("data-pdf-export-ready")
      window.removeEventListener("beforeprint", beforePrint)
    }
  }, [device, selection])

  if (printError) return <p role="alert">Exportação bloqueada: {printError}</p>
  return <>{children}</>
}

function PublishedPdfPreview() {
  const config = parsePdfPreviewConfig(window.location.search)
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
    <PdfPrintReady device={config.device} includedSlugs={config.includedSlugs}>
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
