import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { acervoUsageLabel, usagesForAcervoRecord, type AcervoUsage } from "../../lib/shared-acervo"
import type { CollectionSource } from "../../lib/collections"
import {
  buildCollectionSavePayload,
  normalizeCollectionRecord,
  isUnpublishOnlyCollection,
  validateCollectionSaveDraft,
  CONTACT_CHANNEL_TYPES,
} from "../../lib/admin-collection-payload"
import { adminConfirm, adminConfirmUnsaved, registerAdminSaveAction } from "./AdminConfirmationHost"
import { AdminNotice, statusPt } from "./AdminNotice"
import { FloatingSaveButton } from "./FloatingSaveButton"
import { TrajectoryTextEditor } from "./CareerTrajectoryEditor"

/** Structured collection editor and its existing field configuration. */
type FieldConfig = {
  key: string
  label: string
  multiline?: boolean
  type?: "number" | "url"
}
type CollectionConfig = {
  table: string
  label: string
  titleKey: string
  fields: FieldConfig[]
}

export const collectionConfigs: CollectionConfig[] = [
  {
    table: "career_experiences",
    label: "Experiências",
    titleKey: "company",
    fields: [
      { key: "company", label: "Empresa" },
      { key: "role", label: "Cargo" },
      { key: "location", label: "Local" },
      { key: "start_date", label: "Início" },
      { key: "end_date", label: "Fim" },
      { key: "description", label: "Descrição", multiline: true },
    ],
  },
  {
    table: "portfolio_projects",
    label: "Projetos",
    titleKey: "title",
    fields: [
      { key: "title", label: "Título" },
      { key: "summary", label: "Resumo", multiline: true },
      { key: "details", label: "Detalhes", multiline: true },
      { key: "project_status", label: "Estado do projeto" },
    ],
  },
  {
    table: "metrics",
    label: "Métricas",
    titleKey: "label",
    fields: [
      { key: "label", label: "Rótulo" },
      { key: "value_text", label: "Valor" },
      { key: "unit", label: "Unidade" },
      { key: "context", label: "Contexto", multiline: true },
    ],
  },
  {
    table: "skills",
    label: "Competências",
    titleKey: "name",
    fields: [
      { key: "name", label: "Nome" },
      { key: "category", label: "Categoria" },
    ],
  },
  {
    table: "education",
    label: "Formação",
    titleKey: "course",
    fields: [
      { key: "institution", label: "Instituição" },
      { key: "course", label: "Curso" },
      { key: "degree_type", label: "Tipo" },
      { key: "start_date", label: "Início" },
      { key: "end_date", label: "Fim" },
    ],
  },
  {
    table: "language_levels",
    label: "Idiomas",
    titleKey: "language",
    fields: [
      { key: "language", label: "Idioma" },
      { key: "level_label", label: "Nível" },
      { key: "evidence_note", label: "Evidência", multiline: true },
    ],
  },
  {
    table: "tool_categories",
    label: "Ferramentas",
    titleKey: "title",
    fields: [
      { key: "title", label: "Categoria" },
      {
        key: "tools_text",
        label: "Ferramentas, uma por linha",
        multiline: true,
      },
    ],
  },
  {
    table: "testimonials",
    label: "Depoimentos",
    titleKey: "author_name",
    fields: [
      { key: "author_name", label: "Pessoa" },
      { key: "author_role", label: "Cargo" },
      { key: "quote_text", label: "Depoimento", multiline: true },
    ],
  },
  {
    table: "contact_channels",
    label: "Contato",
    titleKey: "label",
    fields: [
      { key: "channel_type", label: "Tipo" },
      { key: "label", label: "Rótulo" },
      { key: "value", label: "Valor" },
      { key: "url", label: "URL", type: "url" },
    ],
  },
]

export function CollectionsStudio({
  initialSource,
  sectionId,
  linkedSources = [],
  availableSources,
  usageLinks,
  embedded = false,
  onDirtyChange,
}: {
  initialSource?: string
  sectionId?: string
  linkedSources?: string[]
  availableSources?: readonly CollectionSource[]
  usageLinks?: readonly AcervoUsage[]
  embedded?: boolean
  onDirtyChange?: (dirty: boolean) => void
}) {
  const [config, setConfig] = useState(
    collectionConfigs.find((item) => item.table === initialSource) ?? collectionConfigs[0],
  )
  const [records, setRecords] = useState<Record<string, any>[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [draft, setDraft] = useState<Record<string, any> | null>(null)
  const [message, setMessage] = useState("")
  const savedRecord = records.find((item) => item.id === selectedId)
  const visibleConfigs = availableSources
    ? collectionConfigs.filter((item) => availableSources.includes(item.table as CollectionSource))
    : collectionConfigs
  const recordDirty = Boolean(
    draft && (!savedRecord || JSON.stringify(draft) !== JSON.stringify(savedRecord)),
  )
  useEffect(() => onDirtyChange?.(recordDirty), [recordDirty, onDirtyChange])

  const load = async (preferredId?: string): Promise<boolean> => {
    if (!supabase) return false
    const query = supabase.from(config.table).select("*").order("sort_order")
    const { data, error } =
      config.table === "metrics" && sectionId
        ? await query.eq("section_id", sectionId)
        : await query
    if (error) {
      setMessage(error.message)
      return false
    }
    const normalized = (data ?? []).map((record) => normalizeCollectionRecord(record, config.table))
    setRecords(normalized)
    setMessage("")
    const nextId = preferredId ?? selectedId
    setSelectedId(
      normalized.some((record) => record.id === nextId) ? nextId : (normalized[0]?.id ?? ""),
    )
    if (!normalized.length) setDraft(null)
    return !preferredId || normalized.some((record) => record.id === preferredId)
  }

  useEffect(() => {
    setSelectedId("")
    setDraft(null)
    void load()
  }, [config.table, sectionId])

  useEffect(() => {
    // A new record has no id yet; do not erase its in-progress form.
    if (!selectedId) return
    const record = records.find((item) => item.id === selectedId)
    setDraft(record ? structuredClone(record) : null)
  }, [records, selectedId])

  async function newRecord() {
    if (
      recordDirty &&
      !(await adminConfirmUnsaved(
        "Existem alterações não salvas neste registro. Como deseja continuar?",
        {
          title: "Alterações não salvas",
        },
      ))
    )
      return
    const base = Object.fromEntries(config.fields.map((field) => [field.key, ""]))
    setSelectedId("")
    setDraft({
      ...base,
      ...(config.table === "metrics" && sectionId ? { section_id: sectionId } : {}),
      sort_order: records.length + 1,
      status: "draft",
    })
  }

  async function save(): Promise<boolean> {
    if (!supabase || !draft) return false
    const validationErrors = validateCollectionSaveDraft(draft, config.table)
    if (validationErrors.length) {
      setMessage(validationErrors.join(" "))
      return false
    }
    setMessage("Salvando registro…")
    const payload = buildCollectionSavePayload(draft, config.table)
    const result = draft.id
      ? await supabase.from(config.table).update(payload).eq("id", draft.id).select("id").single()
      : await supabase.from(config.table).insert(payload).select("id").single()
    if (result.error) {
      setMessage(result.error.message)
      return false
    }
    const confirmed = await load(result.data.id)
    setMessage(
      confirmed
        ? "Registro salvo e recuperado do Supabase."
        : "O banco confirmou a gravação, mas a leitura posterior não confirmou o registro. Verifique antes de repetir.",
    )
    return confirmed
  }
  useEffect(() => registerAdminSaveAction(save, () => recordDirty), [save, recordDirty])

  async function archive() {
    if (!supabase || !draft?.id) return
    const unpublishOnly = isUnpublishOnlyCollection(config.table)
    if (
      !(await adminConfirm(
        unpublishOnly ? "Retirar este registro da publicação?" : "Arquivar este registro?",
        {
          title: unpublishOnly ? "Despublicar registro" : "Arquivar registro",
          confirmLabel: unpublishOnly ? "Despublicar" : "Arquivar",
          tone: "danger",
        },
      ))
    )
      return
    const { error } = await supabase
      .from(config.table)
      .update({ status: unpublishOnly ? "draft" : "archived" })
      .eq("id", draft.id)
      .select("id")
      .single()
    if (error) return setMessage(error.message)
    const confirmed = await load(draft.id)
    setMessage(
      confirmed
        ? unpublishOnly
          ? "Registro retirado da publicação."
          : "Registro arquivado e recuperado do Supabase."
        : "Alteração não confirmada na leitura posterior. Verifique antes de repetir.",
    )
  }

  return (
    <>
      {!embedded && (
        <header className="admin-header">
          <div>
            <p>Fonte estruturada</p>
            <h1>Coleções</h1>
            <span>Experiências, resultados, formação e referências</span>
          </div>
          <button className="primary-button" onClick={newRecord}>
            Novo registro
          </button>
        </header>
      )}
      {embedded && (
        <div className="site-editor-actions">
          <div>
            <strong>Registros do acervo</strong>
            <small>
              Dados compartilhados; verifique o vínculo de origem no bloco antes de editar.
            </small>
          </div>
          <button type="button" className="secondary-button" onClick={newRecord}>
            Novo registro
          </button>
        </div>
      )}
      {embedded && (
        <p className="site-editor-note" role="status">
          {usageLinks
            ? "Registros publicados desta fonte são reutilizados nos painéis indicados. Alterações salvas podem aparecer imediatamente no site."
            : linkedSources.includes(config.table)
              ? "Coleção vinculada nesta seção: os registros publicados alimentam o bloco correspondente."
              : "Coleção não vinculada a esta seção. Salvar aqui atualiza o acervo, mas não os cards manuais do site. Para vinculá-la, use Fonte do conteúdo exibido nas configurações avançadas do bloco."}
        </p>
      )}
      {visibleConfigs.length > 1 && (
        <div className="collection-tabs" role="tablist">
          {visibleConfigs.map((item) => (
            <button
              key={item.table}
              role="tab"
              aria-selected={item.table === config.table}
              className={item.table === config.table ? "active" : ""}
              onClick={async () => {
                if (item.table === config.table) return
                if (
                  recordDirty &&
                  !(await adminConfirmUnsaved(
                    "Existem alterações não salvas neste registro. Como deseja continuar?",
                    {
                      title: "Alterações não salvas",
                    },
                  ))
                )
                  return
                setDraft(null)
                setSelectedId("")
                setConfig(item)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      <div className="section-editor-layout">
        <div className="section-list">
          {records.map((record, index) => (
            <button
              key={record.id}
              className={selectedId === record.id ? "active" : ""}
              onClick={async () => {
                if (record.id === selectedId) return
                if (
                  recordDirty &&
                  !(await adminConfirmUnsaved(
                    "Existem alterações não salvas neste registro. Como deseja continuar?",
                    {
                      title: "Alterações não salvas",
                    },
                  ))
                )
                  return
                setSelectedId(record.id)
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{record[config.titleKey] || "Sem título"}</strong>
                <small>{statusPt(record.status)}</small>
                {usageLinks && (
                  <small
                    className={
                      usagesForAcervoRecord(
                        config.table as CollectionSource,
                        record,
                        records,
                        usageLinks,
                      ).length
                        ? "shared-acervo-record-location"
                        : "shared-acervo-record-location is-unlinked"
                    }
                  >
                    {(() => {
                      const used = usagesForAcervoRecord(
                        config.table as CollectionSource,
                        record,
                        records,
                        usageLinks,
                      )
                      return used.length
                        ? "Utilizado em: " + [...new Set(used.map(acervoUsageLabel))].join(" · ")
                        : "Sem utilização publicada neste momento"
                    })()}
                  </small>
                )}
              </div>
            </button>
          ))}
        </div>
        {draft && (
          <section className="admin-card editor-form">
            <div className="field-grid">
              {config.fields.map((field) => (
                <label key={field.key} className={field.multiline ? "field-wide" : ""}>
                  {field.label}
                  {config.table === "contact_channels" && field.key === "channel_type" ? (
                    <select
                      value={draft.channel_type ?? ""}
                      onChange={(event) => setDraft({ ...draft, channel_type: event.target.value })}
                    >
                      <option value="">Selecione o tipo</option>
                      {CONTACT_CHANNEL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  ) : config.table === "career_experiences" && field.key === "description" ? (
                    <TrajectoryTextEditor
                      value={draft.description ?? ""}
                      onChange={(description) => setDraft({ ...draft, description })}
                    />
                  ) : field.multiline ? (
                    <textarea
                      rows={4}
                      value={draft[field.key] ?? ""}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          [field.key]: event.target.value,
                        })
                      }
                    />
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      value={draft[field.key] ?? ""}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          [field.key]: event.target.value,
                        })
                      }
                    />
                  )}
                </label>
              ))}
              <label>
                Ordem
                <input
                  type="number"
                  min="1"
                  value={draft.sort_order ?? 1}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      sort_order: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                Status
                <select
                  value={draft.status ?? "draft"}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value })}
                >
                  <option value="draft">Rascunho</option>
                  {!["skills", "tool_categories", "contact_channels"].includes(config.table) && (
                    <option value="in_review">Em revisão</option>
                  )}
                  <option value="published">Publicado</option>
                  {!["skills", "tool_categories", "contact_channels"].includes(config.table) && (
                    <option value="archived">Arquivado</option>
                  )}
                </select>
              </label>
            </div>
            <AdminNotice message={message} />
            <div className="form-actions">
              <button
                className="danger-button"
                onClick={archive}
                disabled={
                  !draft.id ||
                  (isUnpublishOnlyCollection(config.table) && draft.status !== "published")
                }
              >
                {isUnpublishOnlyCollection(config.table) ? "Despublicar" : "Arquivar"}
              </button>
              {embedded ? (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => void save()}
                  disabled={!recordDirty}
                >
                  Salvar depoimento
                </button>
              ) : (
                <FloatingSaveButton enabled={recordDirty} onClick={save} label="Salvar registro" />
              )}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
