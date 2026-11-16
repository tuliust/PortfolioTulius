import { useEffect, useMemo, useRef, useState } from "react"
import {
  PDF_EXPORT_VIEWPORTS,
  type PdfColorMode,
  type PdfDevice,
} from "../../lib/pdf-export-options"
import { buildPdfPreviewUrl } from "../../lib/pdf-preview-config"
import "./PdfExportPanel.css"

type AdminSection = {
  id: string
  slug: string
  title: string
  status: string
  is_visible: boolean
  sort_order: number
}

export default function PdfExportPanel({
  sections,
  loadStatus,
}: {
  sections: AdminSection[]
  loadStatus: "loading" | "ready" | "error"
}) {
  const [device, setDevice] = useState<PdfDevice>("desktop")
  const [palette, setPalette] = useState<PdfColorMode>("original")
  const [excluded, setExcluded] = useState<string[]>([])
  const [scale, setScale] = useState(1)
  const host = useRef<HTMLDivElement>(null)
  const visible = useMemo(
    () =>
      sections
        .filter((section) => section.status === "published" && section.is_visible)
        .sort((a, b) => a.sort_order - b.sort_order || a.slug.localeCompare(b.slug)),
    [sections],
  )
  const included = visible.filter((item) => !excluded.includes(item.slug)).map((item) => item.slug)
  const url = buildPdfPreviewUrl({ device, colorMode: palette, includedSlugs: included })
  const canPreview = loadStatus === "ready" && url !== null
  const viewport = PDF_EXPORT_VIEWPORTS[device]

  useEffect(() => {
    const element = host.current
    if (!element) return
    const adjust = () => {
      const width = element.getBoundingClientRect().width
      if (width > 0) setScale(Math.min(1, Math.max(0.2, (width - 24) / viewport.width)))
    }
    adjust()
    const observer = new ResizeObserver(adjust)
    observer.observe(element)
    return () => observer.disconnect()
  }, [canPreview, device, viewport.width])

  const toggle = (slug: string, checked: boolean) => {
    setExcluded((prev) =>
      checked ? prev.filter((item) => item !== slug) : [...new Set([...prev, slug])],
    )
  }

  return (
    <div className="pdf-export-admin">
      <header className="admin-header">
        <div>
          <p>Portfólio editorial</p>
          <h1>Exportar PDF</h1>
          <span>Configure o documento com conteúdo publicado, sem modificar o CMS.</span>
        </div>
      </header>
      <section className="admin-card pdf-export-options" aria-label="Configurações do PDF">
        <div className="pdf-export-modes">
          <fieldset>
            <legend>Dispositivo</legend>
            <div className="pdf-export-toggles">
              {(["desktop", "mobile"] as const).map((option) => (
                <button
                  type="button"
                  key={option}
                  className={device === option ? "active" : ""}
                  aria-pressed={device === option}
                  onClick={() => setDevice(option)}
                >
                  {option === "desktop" ? "Desktop" : "Mobile"}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Identidade visual</legend>
            <div className="pdf-export-toggles">
              {(["original", "clean"] as const).map((option) => (
                <button
                  type="button"
                  key={option}
                  className={palette === option ? "active" : ""}
                  aria-pressed={palette === option}
                  onClick={() => setPalette(option)}
                >
                  {option === "original" ? "Original" : "Clean"}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="pdf-export-selection-heading">
          <h2>Seções incluídas</h2>
          <span aria-live="polite">
            {included.length} de {visible.length}
          </span>
        </div>
        <p className="pdf-export-help">
          A ordem segue a página pública. Desmarcar uma seção não altera sua publicação.
        </p>
        <div className="pdf-export-select-actions">
          <button type="button" disabled={!visible.length} onClick={() => setExcluded([])}>
            Selecionar todas
          </button>
          <button
            type="button"
            disabled={!visible.length}
            onClick={() => setExcluded(visible.map((item) => item.slug))}
          >
            Desmarcar todas
          </button>
        </div>
        {loadStatus === "loading" ? (
          <p role="status">Carregando seções publicadas…</p>
        ) : loadStatus === "error" ? (
          <p role="alert">Não foi possível consultar as seções. Verifique o Supabase.</p>
        ) : visible.length ? (
          <div className="pdf-export-sections">
            {visible.map((item) => (
              <label key={item.id}>
                <input
                  type="checkbox"
                  checked={!excluded.includes(item.slug)}
                  onChange={(event) => toggle(item.slug, event.target.checked)}
                />
                <span>{item.title}</span>
              </label>
            ))}
          </div>
        ) : (
          <p role="alert">Nenhuma seção publicada e visível está disponível.</p>
        )}
      </section>
      <section className="admin-card pdf-export-preview" aria-label="Prévia PDF">
        <div className="pdf-export-preview-heading">
          <div>
            <h2>Prévia do documento</h2>
            <p>
              {device === "desktop" ? "Desktop · 1440 × 900" : "Mobile · 390 × 844"} ·{" "}
              {palette === "original" ? "Original" : "Clean"}
            </p>
          </div>
          {canPreview && (
            <a href={url ?? undefined} target="_blank" rel="noopener noreferrer">
              Abrir em nova aba
            </a>
          )}
        </div>
        {!canPreview ? (
          <p role="status">
            {loadStatus === "loading"
              ? "Aguardando as seções."
              : loadStatus === "error"
                ? "Prévia indisponível: erro na leitura."
                : "Selecione pelo menos uma seção para visualizar."}
          </p>
        ) : (
          <div className="pdf-export-preview-host" ref={host}>
            <div
              className="pdf-export-preview-scaled"
              style={{ width: viewport.width * scale, height: viewport.height * scale }}
            >
              <iframe
                title={"Prévia PDF " + device + " " + palette}
                src={url ?? undefined}
                loading="lazy"
                style={{
                  width: viewport.width,
                  height: viewport.height,
                  transform: "scale(" + scale + ")",
                }}
              />
            </div>
          </div>
        )}
        <p className="pdf-export-help">
          Prévia protegida com conteúdo publicado. A geração do arquivo PDF, os links finais e a
          paginação física serão implementados na Etapa 5.
        </p>
        <p className="pdf-export-pending">
          Download de PDF indisponível nesta etapa. Nenhum arquivo foi gerado.
        </p>
      </section>
    </div>
  )
}
