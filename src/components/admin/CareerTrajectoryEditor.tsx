import { useEffect, useRef, useState } from "react"
import { supabase } from "../../lib/supabase"
import { resolveCareerSectionSlug } from "../../lib/career-record-link"
import {
  TRAJECTORY_RECOMMENDED_CHARS,
  trajectoryVisibleLength,
} from "../../lib/experience-text"
import { validateCollectionSaveDraft } from "../../lib/admin-collection-payload"
import { registerAdminSaveAction } from "./AdminConfirmationHost"
import { AdminNotice } from "./AdminNotice"

/** The six career trajectories remain bound to existing career_experiences rows. */
function TrajectoryTextEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const visibleLength = trajectoryVisibleLength(value)
  const aboveLimit = visibleLength > TRAJECTORY_RECOMMENDED_CHARS

  function formatSelection(style: "bold" | "italic" | "underline" | "bullet") {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    if (style === "bullet") {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1
      const nextLine = value.indexOf("\n", end)
      const lineEnd = nextLine === -1 ? value.length : nextLine
      const block = value.slice(lineStart, lineEnd)
      const formatted = block
        .split("\n")
        .map((line) => (line.trim() && !/^[•-]\s/u.test(line) ? `• ${line}` : line))
        .join("\n")
      onChange(value.slice(0, lineStart) + formatted + value.slice(lineEnd))
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(lineStart, lineStart + formatted.length)
      })
      return
    }
    const marker = style === "bold" ? "**" : style === "italic" ? "*" : "__"
    const selected = value.slice(start, end)
    onChange(value.slice(0, start) + marker + selected + marker + value.slice(end))
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + marker.length, start + marker.length + selected.length)
    })
  }

  return (
    <div className="trajectory-editor">
      <div
        className="trajectory-format-controls"
        role="toolbar"
        aria-label="Formatação da trajetória"
      >
        <button
          type="button"
          title="Bullets"
          aria-label="Inserir bullets"
          onClick={() => formatSelection("bullet")}
        >
          • Lista
        </button>
        <button
          type="button"
          title="Negrito"
          aria-label="Negrito"
          onClick={() => formatSelection("bold")}
        >
          <strong>N</strong>
        </button>
        <button
          type="button"
          title="Itálico"
          aria-label="Itálico"
          onClick={() => formatSelection("italic")}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          title="Sublinhado"
          aria-label="Sublinhado"
          onClick={() => formatSelection("underline")}
        >
          <u>S</u>
        </button>
      </div>
      <textarea
        ref={textareaRef}
        rows={10}
        value={value}
        aria-describedby="trajectory-length-guidance"
        onChange={(event) => onChange(event.target.value)}
      />
      <p
        id="trajectory-length-guidance"
        className={aboveLimit ? "trajectory-format-note is-warning" : "trajectory-format-note"}
        role="status"
      >
        {visibleLength} / {TRAJECTORY_RECOMMENDED_CHARS} caracteres visíveis recomendados para caber
        no desktop sem rolagem interna. O espaço depende da resolução; ultrapassar este valor não
        corta nem apaga o texto existente.
      </p>
      <small className="trajectory-format-hint">
        Selecione o trecho para aplicar a formatação. A marcação é salva como texto e renderizada
        com segurança na Trajetória pública (bullets, **negrito**, *itálico*, __sublinhado__).
      </small>
    </div>
  )
}

type CareerTrajectoryRecord = {
  id: string
  company: string
  role: string
  location: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  sort_order: number
  status: string
  updated_at: string
}

const careerTrajectoryColumns =
  "id,company,role,location,start_date,end_date,description,sort_order,status,updated_at"

/**
 * Edit the career record for the selected experience without navigating to Collections.
 * Resolve the same stable company ID as the public experience stack; never copy
 * the trajectory into the content_blocks JSON.
 */
export function InlineCareerTrajectoryEditor({
  sectionSlug,
  onDirtyChange,
}: {
  sectionSlug: string
  onDirtyChange: (dirty: boolean) => void
}) {
  const [saved, setSaved] = useState<CareerTrajectoryRecord | null>(null)
  const [draft, setDraft] = useState<CareerTrajectoryRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [readError, setReadError] = useState("")
  const [message, setMessage] = useState("")
  const dirty = Boolean(saved && draft && JSON.stringify(saved) !== JSON.stringify(draft))

  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange])

  useEffect(() => {
    let cancelled = false
    const client = supabase
    if (!client) {
      setReadError("O Supabase não está disponível para carregar a trajetória.")
      setLoading(false)
      return
    }
    setLoading(true)
    setReadError("")
    void (async () => {
      const { data, error } = await client
        .from("career_experiences")
        .select(careerTrajectoryColumns)
        .order("sort_order")
      if (cancelled) return
      if (error) {
        setReadError(error.message)
        setLoading(false)
        return
      }
      const matches = ((data ?? []) as CareerTrajectoryRecord[]).filter(
        (row) => resolveCareerSectionSlug(row) === sectionSlug,
      )
      if (matches.length !== 1) {
        setReadError(
          matches.length === 0
            ? "Não foi encontrado um registro de trajetória vinculado a esta experiência."
            : "Mais de um registro corresponde a esta experiência. Confira o vínculo no acervo.",
        )
        setLoading(false)
        return
      }
      setSaved(matches[0])
      setDraft(structuredClone(matches[0]))
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [sectionSlug])

  async function saveTrajectory(): Promise<boolean> {
    if (!supabase || !saved || !draft || loading || readError || !dirty) return false
    const errors = validateCollectionSaveDraft(draft, "career_experiences")
    if (errors.length) {
      setMessage(errors.join(" "))
      return false
    }
    setMessage("Salvando trajetória…")
    const payload = {
      company: draft.company,
      role: draft.role,
      location: draft.location,
      start_date: draft.start_date,
      end_date: draft.end_date,
      description: draft.description,
      sort_order: draft.sort_order,
      status: draft.status,
    }
    // Version check prevents silently replacing edits made in another session.
    const { data, error } = await supabase
      .from("career_experiences")
      .update(payload)
      .eq("id", saved.id)
      .eq("updated_at", saved.updated_at)
      .select(careerTrajectoryColumns)
      .maybeSingle()
    if (error || !data) {
      setMessage(
        error?.message ??
          "A trajetória foi modificada em outra sessão. Recarregue a seção antes de salvar.",
      )
      return false
    }
    const current = data as CareerTrajectoryRecord
    setSaved(current)
    setDraft(structuredClone(current))
    setMessage("Trajetória salva e confirmada no Supabase.")
    return true
  }

  useEffect(
    () => registerAdminSaveAction(saveTrajectory, () => dirty && !loading && !readError),
    [saveTrajectory, dirty, loading, readError],
  )

  const update = (patch: Partial<CareerTrajectoryRecord>) =>
    setDraft((current) => (current ? { ...current, ...patch } : current))

  return (
    <section className="admin-card editor-form experience-inline-trajectory">
      <h3>Trajetória completa</h3>
      <p className="experience-inline-trajectory-note">
        Informações profissionais desta empresa. Os campos permanecem na coleção original e são
        salvos pelo botão Salvar do Editor do Site.
      </p>
      {loading ? (
        <p role="status">Carregando trajetória…</p>
      ) : readError ? (
        <AdminNotice message={readError} />
      ) : draft ? (
        <div className="field-grid">
          <label>
            Empresa
            <input
              value={draft.company}
              onChange={(event) => update({ company: event.target.value })}
            />
          </label>
          <label>
            Cargo
            <input value={draft.role} onChange={(event) => update({ role: event.target.value })} />
          </label>
          <label>
            Local
            <input
              value={draft.location ?? ""}
              onChange={(event) => update({ location: event.target.value })}
            />
          </label>
          <label>
            Início
            <input
              value={draft.start_date ?? ""}
              onChange={(event) => update({ start_date: event.target.value })}
            />
          </label>
          <label>
            Fim
            <input
              value={draft.end_date ?? ""}
              onChange={(event) => update({ end_date: event.target.value })}
            />
          </label>
          <label>
            Ordem
            <input
              type="number"
              min="1"
              value={draft.sort_order}
              onChange={(event) => update({ sort_order: Number(event.target.value) })}
            />
          </label>
          <label>
            Status
            <select
              value={draft.status}
              onChange={(event) => update({ status: event.target.value })}
            >
              <option value="draft">Rascunho</option>
              <option value="in_review">Em revisão</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
          <label className="field-wide">
            Descrição — Trajetória
            <TrajectoryTextEditor
              value={draft.description ?? ""}
              onChange={(description) => update({ description })}
            />
          </label>
        </div>
      ) : null}
      <AdminNotice message={message} />
    </section>
  )
}

