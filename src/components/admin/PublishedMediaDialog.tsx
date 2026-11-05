import { useCallback, useEffect, useRef, useState } from "react"
import { supabase } from "../../lib/supabase"
import { uploadPublishedMedia } from "../../lib/media-library-actions"
import {
  getPublishedImageChoices,
  type MediaLibraryRow,
  type PublishedImageChoice,
} from "../../lib/media-selection"

export function PublishedMediaDialog({
  label,
  selectedUrl,
  onSelect,
  onClose,
}: {
  label: string
  selectedUrl: string
  onSelect: (url: string, alt: string) => void
  onClose: () => void
}) {
  const [assets, setAssets] = useState<PublishedImageChoice[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [query, setQuery] = useState("")
  const dialogRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  const load = useCallback(async () => {
    if (!supabase) {
      setError("Supabase não está configurado.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    const { data, error: loadError } = await supabase
      .from("media_assets")
      .select("id,title,alt_text,mime_type,storage_bucket,storage_path,status")
      .eq("status", "published")
      .order("created_at", { ascending: false })
    if (loadError) {
      setError(loadError.message)
      setAssets([])
    } else {
      const rows = data as MediaLibraryRow[]
      setAssets(
        getPublishedImageChoices(
          rows,
          (path) => supabase!.storage.from("portfolio-public").getPublicUrl(path).data.publicUrl,
        ),
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    searchRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector('[role="alertdialog"]')) return
      if (event.key === "Escape") {
        event.preventDefault()
        closeRef.current()
      }
      if (event.key !== "Tab") return
      const controls = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled])",
        ) ?? [],
      )
      if (!controls.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      previousFocus?.focus()
    }
  }, [])

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ""
    setBusy(true)
    try {
      const result = await uploadPublishedMedia(file)
      setMessage(result.message)
      if (result.ok) await load()
    } catch {
      setMessage("Não foi possível publicar a mídia enviada.")
    } finally {
      setBusy(false)
    }
  }

  const filtered = assets.filter((asset) =>
    `${asset.title} ${asset.path} ${asset.alt}`
      .toLocaleLowerCase("pt-BR")
      .includes(query.toLocaleLowerCase("pt-BR").trim()),
  )

  return (
    <div
      className="media-frame-overlay published-media-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="media-frame-dialog published-media-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Biblioteca de imagens: ${label}`}
      >
        <header>
          <div>
            <h3>Biblioteca de imagens</h3>
            <p>Escolha uma imagem existente ou envie uma nova, publicada automaticamente.</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Fechar biblioteca">
            ×
          </button>
        </header>
        <div className="published-media-dialog-tools">
          <label>
            Buscar imagem
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Título ou nome do arquivo"
            />
          </label>
          <label className="secondary-button published-media-upload">
            Enviar mídia
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              disabled={busy}
              onChange={upload}
            />
          </label>
        </div>
        {message && (
          <p role="status" className="published-media-dialog-status">
            {message}
          </p>
        )}
        {loading ? (
          <p role="status">Carregando imagens…</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : filtered.length ? (
          <div className="published-media-grid" aria-label="Imagens públicas disponíveis">
            {filtered.map((asset) => (
              <button
                type="button"
                key={asset.id}
                className="published-media-option"
                aria-pressed={selectedUrl === asset.url}
                disabled={busy}
                onClick={() => {
                  onSelect(asset.url, asset.alt)
                  onClose()
                }}
              >
                <img src={asset.url} alt="" loading="lazy" decoding="async" />
                <span>{asset.title}</span>
                {selectedUrl === asset.url && <small>Selecionada</small>}
              </button>
            ))}
          </div>
        ) : (
          <p>
            {assets.length
              ? "Nenhuma imagem corresponde à busca."
              : "Ainda não há imagens públicas."}
          </p>
        )}
        <footer>
          <button type="button" className="secondary-button" disabled={busy} onClick={onClose}>
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  )
}
