import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { isSafeEditorialImage, validateContentItems } from "../../lib/validation"
import {
  isRestorableEntity,
  prepareContentRestoration,
  type RestorableEntity,
} from "../../lib/revision-restore"
import { stagePrivateMediaChange } from "../../lib/media-operations"
import { uploadPrivateMedia, publishPrivateMedia } from "../../lib/media-library-actions"
import { resolveMediaPreview, type MediaPreview } from "../../lib/media-preview"
import { PublishedMediaPicker } from "./PublishedMediaPicker"
import { AdminInfoTip } from "./InfoTip"
import {
  nextExpandedItem,
  expandedAfterMove,
  expandedAfterRemoval,
} from "../../lib/admin-item-expansion"
import { AdminNotice, statusPt } from "./AdminNotice"
import { adminConfirm, adminConfirmUnsaved, registerAdminSaveAction } from "./AdminConfirmationHost"
import { mediaFileName } from "../../lib/media-framing"
import {
  buildMediaMetadataPayload,
  createMediaMetadataDraft,
  hasMediaMetadataChanges,
  mediaDisplayTitle,
  type MediaMetadataDraft,
  type StoredMediaMetadata,
} from "../../lib/media-metadata"
import { experienceTitleKey } from "../../lib/experience-text"
import { withOpenGraphImage } from "../../lib/media-selection"
import {
  COLLECTION_SOURCES,
  isCollectionSource,
  collectionToItems,
  resolveCollectionBlocks,
  type CollectionSource,
} from "../../lib/collections"
import { compareCollectionItemChanges } from "../../lib/collection-link-review"
import {
  buildCollectionSavePayload,
  normalizeCollectionRecord,
  isUnpublishOnlyCollection,
  validateCollectionSaveDraft,
  CONTACT_CHANNEL_TYPES,
} from "../../lib/admin-collection-payload"
import type {
  ContentItem,
  DeviceItemStyle,
  HeroDeviceStyle,
  HeroVisualConfig,
  MetricIconName,
  ExperienceMedia,
} from "../../types/content"
import { Icon } from "../ui/Icons"
import { VisualIconLibrary, PlatformIconLibrary } from "./VisualIconLibrary"
import { FloatingSaveButton } from "./FloatingSaveButton"

interface SectionOption {
  id: string
  title: string
  slug: string
}
type BlockRow = {
  id: string
  section_id: string
  block_type: string
  content_json: {
    items?: ContentItem[]
    source_collection?: string | null
    collection_start?: number
    collection_limit?: number
    experienceMedia?: ExperienceMedia
  }
  mobile_panel: "a" | "b"
  sort_order: number
  status: string
  is_placeholder: boolean
  editorial_note: string | null
}

const emptyItem: ContentItem = { title: "Novo item", text: "" }

function StatusMessage({ children }: { children: string }) {
  return <AdminNotice message={children} />
}

function optionalNumber(value: string) {
  return value === "" ? undefined : Number(value)
}

function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string
  value?: string
  fallback: string
  onChange: (value: string) => void
}) {
  return (
    <label>
      {label}
      <input
        type="color"
        value={value || fallback}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function NumericField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value?: number
  min: number
  max: number
  onChange: (value?: number) => void
}) {
  return (
    <label>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ""}
        placeholder="Automático"
        onChange={(event) => onChange(optionalNumber(event.target.value))}
      />
    </label>
  )
}

function DeviceStyleEditor({
  device,
  value,
  onChange,
}: {
  device: "desktop" | "mobile"
  value?: DeviceItemStyle
  onChange: (patch: Partial<DeviceItemStyle>) => void
}) {
  return (
    <fieldset>
      <legend>{device === "desktop" ? "Desktop" : "Mobile"}</legend>
      <div className="field-grid compact-grid">
        <label className="toggle-field">
          <input
            type="checkbox"
            checked={value?.visible !== false}
            onChange={(event) => onChange({ visible: event.target.checked })}
          />
          Visível
        </label>
        <NumericField
          label="Ordem"
          value={value?.order}
          min={-20}
          max={20}
          onChange={(order) => onChange({ order })}
        />
        <NumericField
          label="Espaçamento (px)"
          value={value?.spacing}
          min={0}
          max={120}
          onChange={(spacing) => onChange({ spacing })}
        />
        <NumericField
          label="Largura (%)"
          value={value?.width}
          min={10}
          max={100}
          onChange={(width) => onChange({ width })}
        />
        <NumericField
          label="Título (px)"
          value={value?.titleSize}
          min={8}
          max={120}
          onChange={(titleSize) => onChange({ titleSize })}
        />
        <NumericField
          label="Texto (px)"
          value={value?.textSize}
          min={8}
          max={72}
          onChange={(textSize) => onChange({ textSize })}
        />
        <label>
          Alinhamento
          <select
            value={value?.textAlign ?? "left"}
            onChange={(event) =>
              onChange({
                textAlign: event.target.value as DeviceItemStyle["textAlign"],
              })
            }
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </label>
      </div>
    </fieldset>
  )
}

function HeroDeviceEditor({
  device,
  value,
  onChange,
}: {
  device: "desktop" | "mobile"
  value?: HeroDeviceStyle
  onChange: (patch: Partial<HeroDeviceStyle>) => void
}) {
  const fields: Array<{
    key: Exclude<keyof HeroDeviceStyle, "introAlign">
    label: string
    min: number
    max: number
    desktopOnly?: boolean
  }> = [
    {
      key: "visualHeight",
      label: "Altura da foto (% viewport)",
      min: 25,
      max: 65,
      desktopOnly: true,
    },
    { key: "imageWidth", label: "Largura da foto (%)", min: 20, max: 100 },
    { key: "imageHeight", label: "Altura da foto (%)", min: 20, max: 100 },
    { key: "imagePositionX", label: "Foco horizontal (%)", min: 0, max: 100 },
    { key: "imagePositionY", label: "Foco vertical (%)", min: 0, max: 100 },
    {
      key: "yearsX",
      label: "Indicador +15: posição X (%)",
      min: 0,
      max: 100,
      desktopOnly: true,
    },
    {
      key: "yearsY",
      label: "Indicador +15: posição Y (%)",
      min: 0,
      max: 100,
      desktopOnly: true,
    },
    {
      key: "yearsWidth",
      label: "Indicador +15: largura (%)",
      min: 15,
      max: 80,
      desktopOnly: true,
    },
    { key: "badgeSize", label: "Tamanho do selo (%)", min: 12, max: 70 },
    { key: "badgeX", label: "Selo: posição X (%)", min: 0, max: 100 },
    { key: "badgeY", label: "Selo: posição Y (%)", min: 0, max: 100 },
    {
      key: "contentGap",
      label: "Espaço entre conteúdos (px)",
      min: 0,
      max: 48,
      desktopOnly: true,
    },
    {
      key: "introSize",
      label: "Frase: tamanho (px)",
      min: 8,
      max: 48,
    },
    {
      key: "introSpacing",
      label: "Frase: espaçamento (px)",
      min: 0,
      max: 120,
    },
  ]
  return (
    <fieldset>
      <legend>Fotografia e selo · {device === "desktop" ? "Desktop" : "Mobile"}</legend>
      <div className="field-grid compact-grid">
        {fields
          .filter((field) => device === "desktop" || !field.desktopOnly)
          .map((field) => (
            <NumericField
              key={field.key}
              label={field.label}
              value={value?.[field.key]}
              min={field.min}
              max={field.max}
              onChange={(nextValue) => onChange({ [field.key]: nextValue })}
            />
          ))}
        <label>
          Frase: alinhamento
          <select
            value={value?.introAlign ?? (device === "desktop" ? "center" : "right")}
            onChange={(event) =>
              onChange({
                introAlign: event.target.value as HeroDeviceStyle["introAlign"],
              })
            }
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </label>
      </div>
    </fieldset>
  )
}

export function ContentStudio({
  sections,
  sectionIdOverride,
  embedded = false,
  onDirtyChange,
  onEditCollection,
  onSaved,
}: {
  sections: SectionOption[]
  sectionIdOverride?: string
  embedded?: boolean
  onDirtyChange?: (dirty: boolean) => void
  onEditCollection?: (source: string) => void
  onSaved?: () => void
}) {
  const [sectionId, setSectionId] = useState(sectionIdOverride ?? sections[0]?.id ?? "")
  const [blocks, setBlocks] = useState<BlockRow[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null)
  const [aboutImageTarget, setAboutImageTarget] = useState<"mobile" | "desktop">("mobile")
  const [draft, setDraft] = useState<BlockRow | null>(null)
  const [message, setMessage] = useState("")
  const [reviewingSource, setReviewingSource] = useState(false)
  const initialPlacement = {
    layout_variant: "default",
    is_visible: true,
    preset: "fade-up",
    duration: 520,
    delay: 0,
    distance: 18,
    once: true,
  }
  type PanelKey = "desktop" | "mobile-a" | "mobile-b"
  type PlacementForm = typeof initialPlacement
  const [placementPanel, setPlacementPanel] = useState<PanelKey>("desktop")
  const [placementsByPanel, setPlacementsByPanel] = useState<
    Partial<Record<PanelKey, PlacementForm>>
  >({})
  const [loadedPanelKeys, setLoadedPanelKeys] = useState<PanelKey[]>([])
  const [editedPanelKeys, setEditedPanelKeys] = useState<PanelKey[]>([])
  const [placementsLoading, setPlacementsLoading] = useState(true)
  const [placementsReadError, setPlacementsReadError] = useState(false)
  const placement = placementsByPanel[placementPanel] ?? initialPlacement
  const savedBlock = blocks.find((block) => block.id === selectedId)
  const blockDirty =
    Boolean(draft && savedBlock && JSON.stringify(draft) !== JSON.stringify(savedBlock)) ||
    editedPanelKeys.length > 0
  useEffect(() => onDirtyChange?.(blockDirty), [blockDirty, onDirtyChange])
  const setPlacement = (next: PlacementForm) => {
    setPlacementsByPanel((current) => ({ ...current, [placementPanel]: next }))
    setEditedPanelKeys((current) =>
      current.includes(placementPanel) ? current : [...current, placementPanel],
    )
  }

  useEffect(() => {
    if (!sectionId && sections[0]) setSectionId(sections[0].id)
  }, [sections, sectionId])

  const load = async (): Promise<boolean> => {
    if (!supabase || !sectionId) return false
    const { data, error } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("section_id", sectionId)
      .order("sort_order")
    if (error) {
      // A transient read failure must not erase loaded blocks or an unsaved form.
      setMessage(error.message)
      return false
    }
    setBlocks((data as BlockRow[]) ?? [])
    setMessage("")
    if (data?.length && !data.some((block) => block.id === selectedId)) setSelectedId(data[0].id)
    return true
  }

  useEffect(() => {
    void load()
  }, [sectionId])

  useEffect(() => {
    setExpandedItemIndex(null)
    setAboutImageTarget("mobile")
  }, [selectedId, sectionId])

  useEffect(() => {
    let cancelled = false
    const selected = blocks.find((block) => block.id === selectedId)
    setDraft(selected ? structuredClone(selected) : null)
    setPlacementPanel("desktop")
    setPlacementsByPanel({})
    setLoadedPanelKeys([])
    setEditedPanelKeys([])
    setPlacementsLoading(true)
    setPlacementsReadError(false)
    if (!selectedId || !supabase || !selected) {
      setPlacementsLoading(false)
      return
    }

    // Resolve panels independently to avoid relying on an ambiguous join shape.
    void Promise.all([
      supabase.from("section_panels").select("id,panel_key").eq("section_id", selected.section_id),
      supabase
        .from("block_placements")
        .select("panel_id,layout_variant,is_visible,motion_config")
        .eq("block_id", selectedId),
    ]).then(([panelResult, placementResult]) => {
      if (cancelled) return
      if (panelResult.error || placementResult.error) {
        setMessage(
          panelResult.error?.message ??
            placementResult.error?.message ??
            "Falha ao carregar placements.",
        )
        setPlacementsReadError(true)
        setPlacementsLoading(false)
        return
      }
      const panelNames = new Map(
        (panelResult.data ?? []).map((panel) => [panel.id, panel.panel_key]),
      )
      const byPanel: Partial<Record<PanelKey, PlacementForm>> = {}
      const keys: PanelKey[] = []
      for (const row of placementResult.data ?? []) {
        const key = panelNames.get(row.panel_id) as PanelKey | undefined
        if (key !== "desktop" && key !== "mobile-a" && key !== "mobile-b") continue
        const motion = row.motion_config as Record<string, unknown> | null
        byPanel[key] = {
          layout_variant: row.layout_variant ?? "default",
          is_visible: row.is_visible ?? true,
          preset: typeof motion?.preset === "string" ? motion.preset : "fade-up",
          duration: typeof motion?.duration === "number" ? motion.duration : 520,
          delay: typeof motion?.delay === "number" ? motion.delay : 0,
          distance: typeof motion?.distance === "number" ? motion.distance : 18,
          once: typeof motion?.once === "boolean" ? motion.once : true,
        }
        keys.push(key)
      }
      setPlacementsByPanel(byPanel)
      setLoadedPanelKeys(keys)
      setPlacementsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [blocks, selectedId])

  async function createBlock() {
    if (!supabase || !sectionId) return
    if (
      blockDirty &&
      !(await adminConfirmUnsaved(
        "Alterações deste bloco ainda não foram salvas. Como deseja continuar antes de criar outro?",
        { title: "Alterações não salvas" },
      ))
    )
      return
    const { data, error } = await supabase
      .from("content_blocks")
      .insert({
        section_id: sectionId,
        block_type: "cards",
        content_json: { items: [emptyItem] },
        mobile_panel: "a",
        sort_order: blocks.length + 1,
        status: "draft",
      })
      .select("*")
      .single()
    if (error) return setMessage(error.message)
    setMessage("Bloco criado como rascunho.")
    await load()
    setSelectedId(data.id)
  }

  async function saveBlock(): Promise<boolean> {
    if (!supabase || !draft) return false
    if (placementsLoading || placementsReadError) {
      setMessage("Carregue os placements antes de salvar.")
      return false
    }
    const validationErrors = isCollectionSource(draft.content_json.source_collection)
      ? []
      : validateContentItems(draft.content_json.items ?? [])
    if (validationErrors.length) {
      setMessage(validationErrors.join(" "))
      return false
    }
    const media = draft.content_json.experienceMedia
    if (media) {
      if (media.logo && !isSafeEditorialImage(media.logo)) {
        setMessage("Logo exige uma URL segura.")
        return false
      }
      for (const [index, slide] of (media.slides ?? []).entries()) {
        if (!slide.title.trim()) {
          setMessage(`Slide ${index + 1}: título obrigatório.`)
          return false
        }
        if (slide.image && !isSafeEditorialImage(slide.image)) {
          setMessage(`Slide ${index + 1}: imagem exige uma URL segura.`)
          return false
        }
      }
    }

    // Preserve existing independent placements: send only edited panels
    // and create the required desktop/mobile placements if they are missing.
    const requiredKeys: PanelKey[] = [
      "desktop",
      draft.mobile_panel === "a" ? "mobile-a" : "mobile-b",
    ]
    const changedKeys = Array.from(
      new Set([
        ...editedPanelKeys,
        ...requiredKeys.filter((key) => !loadedPanelKeys.includes(key)),
      ]),
    )
    const placementUpdates = changedKeys.map((key) => {
      const form = placementsByPanel[key] ?? initialPlacement
      return {
        panel_key: key,
        sort_order: draft.sort_order,
        layout_variant: form.layout_variant,
        is_visible: form.is_visible,
        motion_config: {
          preset: form.preset,
          duration: Math.min(1200, Math.max(0, form.duration)),
          delay: Math.min(600, Math.max(0, form.delay)),
          distance: Math.min(48, Math.max(0, form.distance)),
          once: form.once,
        },
      }
    })

    setMessage("Salvando bloco e painéis…")
    const { error } = await supabase.rpc("save_content_block_atomic", {
      p_block_id: draft.id,
      p_block_type: draft.block_type,
      p_content_json: draft.content_json,
      p_mobile_panel: draft.mobile_panel,
      p_sort_order: draft.sort_order,
      p_status: draft.status,
      p_is_placeholder: draft.is_placeholder,
      p_editorial_note: draft.editorial_note,
      p_placements: placementUpdates,
    })
    if (error) {
      setMessage(error.message)
      return false
    }
    const reloaded = await load()
    if (!reloaded) {
      setMessage(
        "O banco confirmou a transação, mas a recuperação do bloco falhou. Verifique antes de salvar novamente.",
      )
      return false
    }
    setMessage("Bloco e placements salvos em uma transação.")
    onSaved?.()
    return true
  }
  useEffect(() => registerAdminSaveAction(saveBlock), [saveBlock])

  async function reviewCollectionSourceChange(next: string) {
    if (!supabase || !draft || !savedBlock || reviewingSource) return
    if (next === (draft.content_json.source_collection ?? "")) return
    if (next && !isCollectionSource(next)) {
      setMessage("Fonte de coleção não reconhecida.")
      return
    }
    setReviewingSource(true)
    try {
      const publishedItems = async (source: CollectionSource): Promise<ContentItem[]> => {
        const { data, error } = await supabase!
          .from(source)
          .select("*")
          .eq("status", "published")
          .order("sort_order")
        if (error) throw error
        return collectionToItems(source, data ?? [])
      }
      const previous = savedBlock.content_json.source_collection
      const currentItems = isCollectionSource(previous)
        ? (resolveCollectionBlocks(
            [savedBlock],
            new Map([[previous, await publishedItems(previous)]]),
          )[0].content_json?.items ?? [])
        : (savedBlock.content_json.items ?? [])
      // Switching collections resets old pagination, which might silently hide
      // cards belonging to the new collection. Restore manual items when unlinked.
      const proposedJson = {
        ...draft.content_json,
        source_collection: next || null,
        collection_start: undefined,
        collection_limit: undefined,
      }
      const proposedItems = isCollectionSource(next)
        ? (resolveCollectionBlocks(
            [{ ...draft, content_json: proposedJson }],
            new Map([[next, await publishedItems(next)]]),
          )[0].content_json?.items ?? [])
        : (draft.content_json.items ?? [])
      const changes = compareCollectionItemChanges(currentItems, proposedItems)
      if (changes.length > 80) {
        setMessage(
          `A comparação encontrou ${changes.length} divergências. Revise este bloco separadamente antes de trocar sua fonte.`,
        )
        return
      }
      const proceed = await adminConfirm(
        `A fonte será alterada somente após ${changes.length} diferenças serem aprovadas individualmente. O site público só mudará depois de salvar o bloco. Os cards originais continuam armazenados. Deseja revisar?`,
        { title: "Conferência editorial antes da vinculação", confirmLabel: "Revisar diferenças" },
      )
      if (!proceed) return
      for (const [index, change] of changes.entries()) {
        const approved = await adminConfirm(
          `Diferença ${index + 1} de ${changes.length} — item ${change.position}, campo "${change.field}". Valor publicado: ${change.before}. Valor proposto: ${change.after}. Aprovar esta diferença?`,
          { title: "Aprovação editorial individual", confirmLabel: "Aprovar diferença" },
        )
        if (!approved) {
          setMessage("Vinculação cancelada; nenhum campo do bloco foi alterado.")
          return
        }
      }
      const blockId = draft.id
      setDraft((current) =>
        current?.id === blockId
          ? {
              ...current,
              content_json: {
                ...current.content_json,
                source_collection: next || null,
                collection_start: undefined,
                collection_limit: undefined,
              },
            }
          : current,
      )
      setMessage(
        "Diferenças revisadas. A fonte mudou apenas no formulário; salve o bloco para aplicar.",
      )
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Não foi possível conferir a coleção: ${error.message}`
          : "Não foi possível comparar as fontes. Nenhuma alteração aplicada.",
      )
    } finally {
      setReviewingSource(false)
    }
  }

  async function archiveBlock() {
    if (!supabase || !draft) return
    if (
      !(await adminConfirm("Arquivar este bloco?", {
        title: "Arquivar bloco",
        confirmLabel: "Arquivar",
        tone: "danger",
      }))
    )
      return
    const { error } = await supabase
      .from("content_blocks")
      .update({ status: "archived" })
      .eq("id", draft.id)
    setMessage(error?.message ?? "Bloco arquivado.")
    if (!error) await load()
  }

  function updateItem(index: number, patch: Partial<ContentItem>) {
    if (!draft) return
    const items = [...(draft.content_json.items ?? [])]
    items[index] = { ...items[index], ...patch }
    setDraft({ ...draft, content_json: { ...draft.content_json, items } })
  }

  function updateDeviceStyle(
    index: number,
    device: "desktop" | "mobile",
    patch: Partial<DeviceItemStyle>,
  ) {
    if (!draft) return
    const item = draft.content_json.items?.[index]
    if (!item) return
    updateItem(index, {
      [device]: { ...item[device], ...patch },
    })
  }

  function updateHero(index: number, patch: Partial<HeroVisualConfig>) {
    if (!draft) return
    const item = draft.content_json.items?.[index]
    if (!item) return
    updateItem(index, { hero: { ...item.hero, ...patch } })
  }

  function updateHeroDevice(
    index: number,
    device: "desktop" | "mobile",
    patch: Partial<HeroDeviceStyle>,
  ) {
    if (!draft) return
    const item = draft.content_json.items?.[index]
    if (!item) return
    updateHero(index, {
      [device]: { ...item.hero?.[device], ...patch },
    })
  }

  function moveItem(index: number, direction: -1 | 1) {
    if (!draft) return
    const items = [...(draft.content_json.items ?? [])]
    const target = index + direction
    if (target < 0 || target >= items.length) return
    ;[items[index], items[target]] = [items[target], items[index]]
    setDraft({ ...draft, content_json: { ...draft.content_json, items } })
    setExpandedItemIndex((current) => expandedAfterMove(current, index, target))
  }

  async function removeItem(index: number) {
    if (!draft) return
    if (
      !(await adminConfirm("Remover este item do bloco?", {
        title: "Remover item",
        confirmLabel: "Remover",
        tone: "danger",
      }))
    )
      return
    const items = (draft.content_json.items ?? []).filter((_, i) => i !== index)
    setDraft({ ...draft, content_json: { ...draft.content_json, items } })
    setExpandedItemIndex((current) => expandedAfterRemoval(current, index))
  }

  return (
    <>
      {!embedded && (
        <header className="admin-header">
          <div>
            <p>Conteúdo modular</p>
            <h1>Blocos e painéis</h1>
            <span>Uma fonte de conteúdo, composições desktop e mobile A/B</span>
          </div>
          <button className="primary-button" onClick={createBlock}>
            Novo bloco
          </button>
        </header>
      )}
      {embedded && (
        <div className="site-editor-actions">
          <div>
            <strong>Elementos desta seção</strong>
            <small>Escolha um painel para editar os textos, imagens e itens exibidos.</small>
          </div>
          <button type="button" className="secondary-button" onClick={createBlock}>
            Novo bloco
          </button>
        </div>
      )}
      {!embedded && (
        <div className="studio-toolbar">
          <label>
            Seção
            <select value={sectionId} onChange={(event) => setSectionId(event.target.value)}>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div className={embedded ? "studio-inline-layout" : "section-editor-layout"}>
        <div className={embedded ? "studio-block-picker" : "section-list"}>
          {blocks.map((block) => (
            <button
              key={block.id}
              className={selectedId === block.id ? "active" : ""}
              onClick={async () => {
                if (block.id === selectedId) return
                if (
                  blockDirty &&
                  !(await adminConfirmUnsaved(
                    "Existem alterações não salvas neste bloco. Como deseja continuar?",
                    { title: "Alterações não salvas" },
                  ))
                )
                  return
                setSelectedId(block.id)
              }}
            >
              <span>{block.mobile_panel.toUpperCase()}</span>
              <div>
                <strong>{block.content_json.items?.[0]?.title ?? block.block_type}</strong>
                <small>
                  {statusPt(block.status)} · {block.content_json.items?.length ?? 0} itens
                </small>
              </div>
            </button>
          ))}
        </div>
        {draft ? (
          <section className="admin-card editor-form">
            {isCollectionSource(draft.content_json.source_collection) && onEditCollection && (
              <div className="site-editor-collection-action">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onEditCollection(draft.content_json.source_collection!)}
                >
                  Editar registros vinculados
                </button>
              </div>
            )}
            <details className="site-editor-advanced">
              <summary>Configurações avançadas do bloco e dos painéis</summary>
              <div className="field-grid compact-grid">
                <label>
                  Tipo
                  <select
                    value={draft.block_type}
                    onChange={(event) => setDraft({ ...draft, block_type: event.target.value })}
                  >
                    {[
                      "hero",
                      "rich_text",
                      "metric",
                      "cards",
                      "timeline",
                      "skills",
                      "media",
                      "quote",
                      "contact",
                      "tools",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {
                          (
                            {
                              hero: "Destaque",
                              rich_text: "Texto",
                              metric: "Métrica",
                              cards: "Cards",
                              timeline: "Linha do tempo",
                              skills: "Competências",
                              media: "Imagem/vídeo",
                              quote: "Depoimento",
                              contact: "Contato",
                              tools: "Ferramentas",
                            } as Record<string, string>
                          )[type]
                        }
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Painel mobile
                  <select
                    value={draft.mobile_panel}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        mobile_panel: event.target.value as "a" | "b",
                      })
                    }
                  >
                    <option value="a">Painel A</option>
                    <option value="b">Painel B</option>
                  </select>
                </label>
                <label>
                  Ordem
                  <input
                    type="number"
                    min="1"
                    value={draft.sort_order}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        sort_order: Number(event.target.value),
                      })
                    }
                  />
                </label>
                {sections.find((section) => section.id === draft.section_id)?.slug !== "perfil" && (
                  <label className="field-wide">
                    Fonte do conteúdo exibido
                    <select
                      value={draft.content_json.source_collection ?? ""}
                      disabled={reviewingSource}
                      onChange={(event) => void reviewCollectionSourceChange(event.target.value)}
                    >
                      <option value="">Cards manuais (original)</option>
                      {COLLECTION_SOURCES.map((source) => (
                        <option key={source} value={source}>
                          {collectionConfigs.find((config) => config.table === source)?.label ??
                            source}
                        </option>
                      ))}
                    </select>
                    {draft.content_json.source_collection && (
                      <>
                        <small>
                          Fonte vinculada: edite e publique registros na aba Coleções. Os cards
                          manuais abaixo continuam armazenados e voltam a aparecer quando o vínculo
                          for removido.
                        </small>
                        {draft.content_json.source_collection === "testimonials" && (
                          <div className="field-grid compact-grid">
                            <NumericField
                              label="Primeiro depoimento na coleção (índice inicial, começando em 0)"
                              value={draft.content_json.collection_start ?? 0}
                              min={0}
                              max={500}
                              onChange={(collection_start) =>
                                setDraft({
                                  ...draft,
                                  content_json: { ...draft.content_json, collection_start },
                                })
                              }
                            />
                            <NumericField
                              label="Quantidade neste painel (vazio = todos os restantes)"
                              value={draft.content_json.collection_limit}
                              min={1}
                              max={100}
                              onChange={(collection_limit) =>
                                setDraft({
                                  ...draft,
                                  content_json: { ...draft.content_json, collection_limit },
                                })
                              }
                            />
                          </div>
                        )}
                      </>
                    )}
                  </label>
                )}
                <label>
                  Status
                  <select
                    value={draft.status}
                    onChange={(event) => setDraft({ ...draft, status: event.target.value })}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="in_review">Em revisão</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </label>
                <label className="toggle-field field-wide">
                  <input
                    type="checkbox"
                    checked={draft.is_placeholder}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        is_placeholder: event.target.checked,
                      })
                    }
                  />
                  Contém conteúdo provisório
                </label>
              </div>
              <fieldset className="motion-editor">
                <legend>Placement e animação</legend>
                <label>
                  Painel a editar (demais painéis são preservados)
                  <select
                    value={placementPanel}
                    onChange={(event) => setPlacementPanel(event.target.value as PanelKey)}
                  >
                    <option value="desktop">Desktop</option>
                    <option value="mobile-a">Mobile A</option>
                    <option value="mobile-b">Mobile B</option>
                  </select>
                </label>
                <div className="field-grid compact-grid">
                  <label>
                    Variante de layout
                    <select
                      value={placement.layout_variant}
                      onChange={(event) =>
                        setPlacement({
                          ...placement,
                          layout_variant: event.target.value,
                        })
                      }
                    >
                      <option value="default">Padrão</option>
                      <option value="compact">Compacto</option>
                      <option value="featured">Destaque</option>
                      <option value="wide">Largo</option>
                    </select>
                  </label>
                  <label>
                    Preset
                    <select
                      value={placement.preset}
                      onChange={(event) =>
                        setPlacement({ ...placement, preset: event.target.value })
                      }
                    >
                      <option value="none">Nenhum</option>
                      <option value="fade-in">Fade</option>
                      <option value="fade-up">Fade vertical</option>
                      <option value="stagger">Stagger</option>
                      <option value="image-reveal">Reveal de imagem</option>
                      <option value="metric-count">Métrica</option>
                    </select>
                  </label>
                  <label>
                    Duração (ms)
                    <input
                      type="number"
                      min="0"
                      max="1200"
                      value={placement.duration}
                      onChange={(event) =>
                        setPlacement({
                          ...placement,
                          duration: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    Atraso (ms)
                    <input
                      type="number"
                      min="0"
                      max="600"
                      value={placement.delay}
                      onChange={(event) =>
                        setPlacement({
                          ...placement,
                          delay: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    Deslocamento
                    <input
                      type="number"
                      min="0"
                      max="48"
                      value={placement.distance}
                      onChange={(event) =>
                        setPlacement({
                          ...placement,
                          distance: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="toggle-field">
                    <input
                      type="checkbox"
                      checked={placement.is_visible}
                      onChange={(event) =>
                        setPlacement({
                          ...placement,
                          is_visible: event.target.checked,
                        })
                      }
                    />
                    Placement visível
                  </label>
                </div>
              </fieldset>
            </details>
            {["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"].includes(
              sections.find((entry) => entry.id === draft.section_id)?.slug ?? "",
            ) &&
              draft.mobile_panel === "a" && (
                <fieldset className="admin-card">
                  <legend>Identidade da empresa e galeria de projetos</legend>
                  <div className="experience-admin-competencies">
                    <label className="field-wide">
                      <span className="admin-field-with-info">
                        Competências aplicadas — tags abaixo do período
                        <AdminInfoTip
                          label="Competências aplicadas nas experiências"
                          description="Uma competência por linha. As tags aparecem abaixo do cargo e período no site. São editadas no bloco A desta empresa e só publicadas ao clicar em Salvar bloco."
                        />
                      </span>
                      <textarea
                        rows={5}
                        value={
                          (draft.content_json.items ?? [])
                            .find(
                              (item) => experienceTitleKey(item.title) === "competencias aplicadas",
                            )
                            ?.tags?.join("\n") ?? ""
                        }
                        onChange={(event) => {
                          const tags = [
                            ...new Set(
                              event.target.value
                                .split("\n")
                                .map((entry) => entry.trim())
                                .filter(Boolean),
                            ),
                          ]
                          const items = [...(draft.content_json.items ?? [])]
                          const index = items.findIndex(
                            (item) => experienceTitleKey(item.title) === "competencias aplicadas",
                          )
                          if (index >= 0) {
                            items[index] = { ...items[index], tags }
                          } else {
                            items.unshift({ title: "Competências aplicadas", tags })
                          }
                          setDraft({ ...draft, content_json: { ...draft.content_json, items } })
                        }}
                      />
                    </label>
                    <small>
                      As tags não criam slides, não substituem projetos e não alteram a descrição
                      completa da carreira.
                    </small>
                  </div>
                  <p>
                    Use arquivos próprios/autorizados. Sem imagens aprovadas, o site mostra um
                    espaço reservado identificado, não uma fotografia fictícia.
                  </p>
                  <div className="field-grid experience-logo-fields">
                    <PublishedMediaPicker
                      label="Logotipo da empresa"
                      guidance="Logo quadrado 1:1; referência 400 × 400 px ou SVG."
                      ratio="1 / 1"
                      framing={draft.content_json.experienceMedia?.logoFraming}
                      onFramingChange={(logoFraming) =>
                        setDraft({
                          ...draft,
                          content_json: {
                            ...draft.content_json,
                            experienceMedia: {
                              ...draft.content_json.experienceMedia,
                              logoFraming,
                            },
                          },
                        })
                      }
                      value={draft.content_json.experienceMedia?.logo ?? ""}
                      onChange={(logo, alt) =>
                        setDraft({
                          ...draft,
                          content_json: {
                            ...draft.content_json,
                            experienceMedia: {
                              ...draft.content_json.experienceMedia,
                              logo,
                              logoAlt: alt,
                            },
                          },
                        })
                      }
                    />
                    <label className="experience-logo-alt">
                      Descrição alternativa do logo (opcional)
                      <input
                        value={draft.content_json.experienceMedia?.logoAlt ?? ""}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            content_json: {
                              ...draft.content_json,
                              experienceMedia: {
                                ...draft.content_json.experienceMedia,
                                logoAlt: event.target.value,
                              },
                            },
                          })
                        }
                      />
                    </label>
                  </div>
                  <h3>Slides relacionados aos projetos</h3>
                  <p className="experience-admin-relationship-note">
                    Cada título de slide é um projeto clicável na página pública. Se existir um item
                    visível com o mesmo título nos blocos A ou B, seu texto será exibido junto ao
                    projeto; caso contrário, aparece apenas o título do slide. Alterar a ordem dos
                    slides também altera a ordem dos projetos. Indicadores permanecem independentes.
                  </p>
                  {onEditCollection && (
                    <div className="experience-admin-career-link">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => onEditCollection("career_experiences")}
                      >
                        Editar trajetória completa (Coleções)
                      </button>
                      <small>
                        O site evita exibir trechos já resumidos em Projetos e realizações; o texto
                        integral continua preservado na coleção.
                      </small>
                    </div>
                  )}
                  {(draft.content_json.experienceMedia?.slides ?? []).map((slide, slideIndex) => (
                    <div className="block-item-editor" key={slideIndex}>
                      <div className="block-item-head">
                        <strong>Slide {slideIndex + 1}</strong>
                        <div className="order-buttons">
                          <button
                            type="button"
                            aria-label="Slide anterior na ordem"
                            onClick={() => {
                              if (slideIndex === 0) return
                              const slides = [...(draft.content_json.experienceMedia?.slides ?? [])]
                              ;[slides[slideIndex - 1], slides[slideIndex]] = [
                                slides[slideIndex],
                                slides[slideIndex - 1],
                              ]
                              setDraft({
                                ...draft,
                                content_json: {
                                  ...draft.content_json,
                                  experienceMedia: {
                                    ...draft.content_json.experienceMedia,
                                    slides,
                                  },
                                },
                              })
                            }}
                          >
                            <Icon name="up" size={17} />
                          </button>
                          <button
                            type="button"
                            aria-label="Slide seguinte na ordem"
                            onClick={() => {
                              const slides = [...(draft.content_json.experienceMedia?.slides ?? [])]
                              if (slideIndex >= slides.length - 1) return
                              ;[slides[slideIndex + 1], slides[slideIndex]] = [
                                slides[slideIndex],
                                slides[slideIndex + 1],
                              ]
                              setDraft({
                                ...draft,
                                content_json: {
                                  ...draft.content_json,
                                  experienceMedia: {
                                    ...draft.content_json.experienceMedia,
                                    slides,
                                  },
                                },
                              })
                            }}
                          >
                            <Icon name="down" size={17} />
                          </button>
                          <button
                            type="button"
                            aria-label="Excluir slide"
                            onClick={async () => {
                              if (
                                !(await adminConfirm("Excluir este slide?", {
                                  title: "Excluir slide",
                                  confirmLabel: "Excluir",
                                  tone: "danger",
                                }))
                              )
                                return
                              const slides = (
                                draft.content_json.experienceMedia?.slides ?? []
                              ).filter((_, i) => i !== slideIndex)
                              setDraft({
                                ...draft,
                                content_json: {
                                  ...draft.content_json,
                                  experienceMedia: {
                                    ...draft.content_json.experienceMedia,
                                    slides,
                                  },
                                },
                              })
                            }}
                          >
                            <Icon name="close" size={17} />
                          </button>
                        </div>
                      </div>
                      <div className="field-grid experience-slide-fields">
                        {(
                          [
                            ["title", "Título do projeto"],
                            ["alt", "Descrição alternativa da foto"],
                            ["caption", "Legenda da imagem"],
                          ] as const
                        ).map(([key, label]) => (
                          <label className="experience-slide-field" key={key}>
                            {label}
                            <input
                              value={slide[key] ?? ""}
                              onChange={(event) => {
                                const slides = [
                                  ...(draft.content_json.experienceMedia?.slides ?? []),
                                ]
                                slides[slideIndex] = { ...slide, [key]: event.target.value }
                                setDraft({
                                  ...draft,
                                  content_json: {
                                    ...draft.content_json,
                                    experienceMedia: {
                                      ...draft.content_json.experienceMedia,
                                      slides,
                                    },
                                  },
                                })
                              }}
                            />
                          </label>
                        ))}
                        <PublishedMediaPicker
                          label="Fotografia do slide"
                          guidance="Galeria vertical 9:10; referência 900 × 1000 px."
                          ratio="9 / 10"
                          framing={slide.framing}
                          onFramingChange={(framing) => {
                            const slides = [...(draft.content_json.experienceMedia?.slides ?? [])]
                            slides[slideIndex] = { ...slide, framing }
                            setDraft({
                              ...draft,
                              content_json: {
                                ...draft.content_json,
                                experienceMedia: { ...draft.content_json.experienceMedia, slides },
                              },
                            })
                          }}
                          value={slide.image ?? ""}
                          onChange={(image, alt) => {
                            const slides = [...(draft.content_json.experienceMedia?.slides ?? [])]
                            slides[slideIndex] = { ...slide, image, alt }
                            setDraft({
                              ...draft,
                              content_json: {
                                ...draft.content_json,
                                experienceMedia: {
                                  ...draft.content_json.experienceMedia,
                                  slides,
                                },
                              },
                            })
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      const slides = [
                        ...(draft.content_json.experienceMedia?.slides ?? []),
                        { title: "Novo projeto" },
                      ]
                      setDraft({
                        ...draft,
                        content_json: {
                          ...draft.content_json,
                          experienceMedia: { ...draft.content_json.experienceMedia, slides },
                        },
                      })
                    }}
                  >
                    Adicionar slide
                  </button>
                </fieldset>
              )}
            <div className="block-items">
              {sections.find((entry) => entry.id === draft.section_id)?.slug === "sobre" &&
                draft.mobile_panel === "b" && (
                  <div className="block-item-help">
                    <AdminInfoTip
                      label="Textos da seção 02 — coluna direita"
                      description="Cada item corresponde a um título e texto. Use Adicionar item, as setas de ordenação e Remover item para gerenciar a lista completa. O primeiro item também aparece junto à foto no painel A mobile. Clique em Salvar alterações para publicar suas edições no bloco."
                    />
                  </div>
                )}
              {(draft.content_json.items ?? []).map((item, index) => (
                <article className="block-item-editor" key={index}>
                  <div className="block-item-head">
                    <button
                      type="button"
                      className="block-item-toggle"
                      aria-expanded={expandedItemIndex === index}
                      aria-controls={`block-item-fields-${draft.id}-${index}`}
                      onClick={() =>
                        setExpandedItemIndex((current) => nextExpandedItem(current, index))
                      }
                    >
                      <Icon name={expandedItemIndex === index ? "up" : "down"} size={17} />
                      <span className="block-item-toggle-label">
                        <strong>
                          Item {String(index + 1).padStart(2, "0")}
                          {item.isHidden === true && (
                            <span className="admin-hidden-label"> · Ocultado</span>
                          )}
                        </strong>
                        <small>{item.title?.trim() || "Sem título"}</small>
                      </span>
                    </button>
                    <div className="order-buttons">
                      <button onClick={() => moveItem(index, -1)} aria-label="Mover item para cima">
                        <Icon name="up" size={17} />
                      </button>
                      <button onClick={() => moveItem(index, 1)} aria-label="Mover item para baixo">
                        <Icon name="down" size={17} />
                      </button>
                      <button onClick={() => removeItem(index)} aria-label="Remover item">
                        <Icon name="close" size={17} />
                      </button>
                    </div>
                  </div>
                  {expandedItemIndex === index && (
                    <div className="block-item-body" id={`block-item-fields-${draft.id}-${index}`}>
                      {[
                        "invest-rs",
                        "prefeitura-sp",
                        "vale",
                        "globo-sportv",
                        "inpress",
                        "cdi",
                      ].includes(
                        sections.find((entry) => entry.id === draft.section_id)?.slug ?? "",
                      ) && (
                        <label className="toggle-field admin-visibility-toggle">
                          <input
                            type="checkbox"
                            checked={item.isHidden !== true}
                            onChange={(event) =>
                              updateItem(index, { isHidden: !event.target.checked })
                            }
                          />
                          Exibir este item em Projetos e realizações (desmarcado = ocultado, sem
                          excluir)
                        </label>
                      )}
                      <div className="field-grid">
                        <label>
                          Título
                          <input
                            value={item.title}
                            onChange={(event) => updateItem(index, { title: event.target.value })}
                          />
                        </label>
                        <label>
                          Rótulo / número
                          <input
                            value={item.label ?? ""}
                            onChange={(event) => updateItem(index, { label: event.target.value })}
                          />
                        </label>
                        <label className="field-wide">
                          Texto
                          <textarea
                            value={item.text ?? ""}
                            onChange={(event) => updateItem(index, { text: event.target.value })}
                          />
                        </label>
                        <label>
                          <span className="admin-field-with-info">
                            Valor/métrica
                            <AdminInfoTip
                              label="Valor/métrica"
                              description="Valor ou indicador exibido em componentes que utilizam métricas. Deixe vazio quando o item não tiver um valor."
                            />
                          </span>
                          <input
                            value={item.value ?? ""}
                            onChange={(event) => updateItem(index, { value: event.target.value })}
                          />
                        </label>
                        <label>
                          <span className="admin-field-with-info">
                            Metadado/URL
                            <AdminInfoTip
                              label="Metadado/URL"
                              description="Informação complementar do item, como período, local ou unidade. Alguns componentes podem utilizar este campo como URL; o comportamento depende da seção."
                            />
                          </span>
                          <input
                            value={item.meta ?? ""}
                            onChange={(event) => updateItem(index, { meta: event.target.value })}
                          />
                        </label>
                        {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                          "resultados" &&
                          draft.mobile_panel === "a" && (
                            <div className="field-wide">
                              <VisualIconLibrary
                                value={item.metricIcon ?? "chart"}
                                onChange={(metricIcon) => updateItem(index, { metricIcon })}
                              />
                              <fieldset>
                                <legend>Exibir este indicador nos temas</legend>
                                {(
                                  blocks.find(
                                    (entry) =>
                                      entry.section_id === draft.section_id &&
                                      entry.mobile_panel === "b",
                                  )?.content_json.items ?? []
                                ).map((theme, themeIndex) => {
                                  const key =
                                    theme.themeKey ||
                                    ["corporativa", "projetos", "eventos", "marketing", "imprensa"][
                                      themeIndex
                                    ] ||
                                    `tema-${themeIndex + 1}`
                                  return (
                                    <label key={key} className="toggle-field">
                                      <input
                                        type="checkbox"
                                        checked={(item.relatedThemeKeys ?? []).includes(key)}
                                        onChange={(event) => {
                                          const selected = item.relatedThemeKeys ?? []
                                          updateItem(index, {
                                            relatedThemeKeys: event.target.checked
                                              ? [...selected, key]
                                              : selected.filter((value) => value !== key),
                                          })
                                        }}
                                      />
                                      {theme.title}
                                    </label>
                                  )
                                })}
                              </fieldset>
                            </div>
                          )}
                        {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                          "resultados" &&
                          draft.mobile_panel === "b" && (
                            <div className="field-wide">
                              <label>
                                Identificador do tema (para os links da abertura)
                                <input
                                  value={item.themeKey ?? ""}
                                  onChange={(event) =>
                                    updateItem(index, { themeKey: event.target.value })
                                  }
                                  placeholder="corporativa, projetos, eventos, marketing ou imprensa"
                                />
                              </label>
                              <label>
                                Eixo central
                                <input
                                  value={item.themeAxis ?? ""}
                                  onChange={(event) =>
                                    updateItem(index, { themeAxis: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                Título do conteúdo central
                                <input
                                  value={item.themeTitle ?? ""}
                                  onChange={(event) =>
                                    updateItem(index, { themeTitle: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                Subtítulo do conteúdo central
                                <textarea
                                  value={item.themeSubtitle ?? ""}
                                  onChange={(event) =>
                                    updateItem(index, { themeSubtitle: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                Temas relacionados
                                <textarea
                                  value={item.themeTopics ?? ""}
                                  onChange={(event) =>
                                    updateItem(index, { themeTopics: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                Texto curto
                                <textarea
                                  value={item.themeSummary ?? ""}
                                  onChange={(event) =>
                                    updateItem(index, { themeSummary: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                Conteúdo reaproveitado da antiga seção 04 (uma linha por item)
                                <textarea
                                  value={(item.inheritedHighlights ?? []).join("\n")}
                                  onChange={(event) =>
                                    updateItem(index, {
                                      inheritedHighlights: event.target.value
                                        .split("\n")
                                        .map((value) => value.trim())
                                        .filter(Boolean),
                                    })
                                  }
                                />
                              </label>
                            </div>
                          )}
                        {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                          "perfil" &&
                          draft.mobile_panel === "b" &&
                          index < 5 && (
                            <>
                              <label className="field-wide">
                                Destino do card (seção interna)
                                <select
                                  value={item.targetSlug ?? "resultados"}
                                  onChange={(event) =>
                                    updateItem(index, { targetSlug: event.target.value })
                                  }
                                >
                                  {sections
                                    .filter((entry) => entry.slug !== "perfil")
                                    .map((entry) => (
                                      <option key={entry.id} value={entry.slug}>
                                        {entry.title} (#{entry.slug})
                                      </option>
                                    ))}
                                </select>
                                <small>
                                  Padrão: seção 03. O clique funciona em toda a área do card.
                                </small>
                              </label>
                              <label className="field-wide">
                                Tema selecionado na seção 03
                                <select
                                  value={
                                    item.themeKey ||
                                    ["corporativa", "projetos", "eventos", "marketing", "imprensa"][
                                      index
                                    ]
                                  }
                                  onChange={(event) =>
                                    updateItem(index, { themeKey: event.target.value })
                                  }
                                >
                                  <option value="corporativa">Comunicação Corporativa</option>
                                  <option value="projetos">Gestão e execução de projetos</option>
                                  <option value="eventos">
                                    Relações Públicas e Gestão de Eventos
                                  </option>
                                  <option value="marketing">
                                    Marketing Digital, Branding e Performance
                                  </option>
                                  <option value="imprensa">Imprensa e Influenciadores</option>
                                </select>
                              </label>
                            </>
                          )}
                        {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                          "perfil" &&
                          draft.mobile_panel === "b" &&
                          index >= 5 &&
                          index < 11 && (
                            <label className="field-wide">
                              Empresa de destino (card clicável)
                              <select
                                value={item.targetSlug ?? ""}
                                onChange={(event) =>
                                  updateItem(index, { targetSlug: event.target.value })
                                }
                              >
                                <option value="">Sem link</option>
                                {sections
                                  .filter((entry) =>
                                    [
                                      "invest-rs",
                                      "prefeitura-sp",
                                      "vale",
                                      "globo-sportv",
                                      "inpress",
                                      "cdi",
                                    ].includes(entry.slug),
                                  )
                                  .map((entry) => (
                                    <option key={entry.id} value={entry.slug}>
                                      {entry.title}
                                    </option>
                                  ))}
                              </select>
                              <small>
                                O card inteiro direciona para a seção da empresa, incluindo no
                                mobile.
                              </small>
                            </label>
                          )}
                        {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                          "ferramentas" && (
                          <div className="field-wide">
                            <PlatformIconLibrary
                              selected={item.toolIcons ?? []}
                              onChange={(toolIcons) => updateItem(index, { toolIcons })}
                            />
                          </div>
                        )}
                        {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                          "sobre" &&
                          draft.mobile_panel === "a" &&
                          index === 0 && (
                            <div
                              className="field-wide admin-image-target-switch"
                              role="group"
                              aria-label="Destino da imagem"
                            >
                              <span>Destino da imagem</span>
                              <button
                                type="button"
                                className={aboutImageTarget === "mobile" ? "active" : ""}
                                aria-pressed={aboutImageTarget === "mobile"}
                                onClick={() => setAboutImageTarget("mobile")}
                              >
                                Mobile
                              </button>
                              <button
                                type="button"
                                className={aboutImageTarget === "desktop" ? "active" : ""}
                                aria-pressed={aboutImageTarget === "desktop"}
                                onClick={() => setAboutImageTarget("desktop")}
                              >
                                Desktop
                              </button>
                            </div>
                          )}
                        <PublishedMediaPicker
                          label="Imagem do item"
                          guidanceAsInfo
                          iconOnlyActions
                          guidance={
                            ["perfil", "contato", "sobre"].includes(
                              sections.find((entry) => entry.id === draft.section_id)?.slug ?? "",
                            )
                              ? "Retrato vertical 3:4; sugestão 900 × 1200 px."
                              : "Miniatura editorial 1:1; sugestão 600 × 600 px."
                          }
                          ratio={
                            ["perfil", "contato", "sobre"].includes(
                              sections.find((entry) => entry.id === draft.section_id)?.slug ?? "",
                            )
                              ? "3 / 4"
                              : "1 / 1"
                          }
                          framing={
                            aboutImageTarget === "desktop" &&
                            sections.find((entry) => entry.id === draft.section_id)?.slug ===
                              "sobre" &&
                            draft.mobile_panel === "a" &&
                            index === 0
                              ? item.aboutDesktopFraming
                              : item.mediaFraming
                          }
                          onFramingChange={(framing) => {
                            if (
                              aboutImageTarget === "desktop" &&
                              sections.find((entry) => entry.id === draft.section_id)?.slug ===
                                "sobre" &&
                              draft.mobile_panel === "a" &&
                              index === 0
                            ) {
                              updateItem(index, { aboutDesktopFraming: framing })
                            } else updateItem(index, { mediaFraming: framing })
                          }}
                          value={
                            aboutImageTarget === "desktop" &&
                            sections.find((entry) => entry.id === draft.section_id)?.slug ===
                              "sobre" &&
                            draft.mobile_panel === "a" &&
                            index === 0
                              ? (item.aboutDesktopImage ?? "")
                              : (item.image ?? "")
                          }
                          onChange={(image, alt) => {
                            if (
                              aboutImageTarget === "desktop" &&
                              sections.find((entry) => entry.id === draft.section_id)?.slug ===
                                "sobre" &&
                              draft.mobile_panel === "a" &&
                              index === 0
                            ) {
                              updateItem(index, { aboutDesktopImage: image, aboutDesktopAlt: alt })
                            } else updateItem(index, { image, alt })
                          }}
                        />
                        <label className="item-alt-field">
                          Texto alternativo (opcional)
                          <input
                            value={
                              aboutImageTarget === "desktop" &&
                              sections.find((entry) => entry.id === draft.section_id)?.slug ===
                                "sobre" &&
                              draft.mobile_panel === "a" &&
                              index === 0
                                ? (item.aboutDesktopAlt ?? "")
                                : (item.alt ?? "")
                            }
                            onChange={(event) => {
                              if (
                                aboutImageTarget === "desktop" &&
                                sections.find((entry) => entry.id === draft.section_id)?.slug ===
                                  "sobre" &&
                                draft.mobile_panel === "a" &&
                                index === 0
                              ) {
                                updateItem(index, { aboutDesktopAlt: event.target.value })
                              } else updateItem(index, { alt: event.target.value })
                            }}
                          />
                        </label>
                        {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                          "sobre" &&
                          draft.mobile_panel === "a" &&
                          index === 0 && (
                            <small className="field-wide">
                              As imagens mobile e desktop são preservadas separadamente. Se desktop
                              estiver vazio, a seção utiliza /media/tulius-contact.jpg.
                            </small>
                          )}
                      </div>
                      <details className="visual-config">
                        <summary>Estilo, visibilidade e responsividade</summary>
                        <fieldset>
                          <legend>Compartilhado entre desktop e mobile</legend>
                          <div className="field-grid compact-grid">
                            <fieldset className="visual-icon-library">
                              <legend>Ícone do card</legend>
                              <div className="visual-icon-grid">
                                <button
                                  type="button"
                                  aria-label="Sem ícone"
                                  aria-pressed={item.icon !== "arrow"}
                                  className={item.icon !== "arrow" ? "active" : ""}
                                  onClick={() => updateItem(index, { icon: "none" })}
                                >
                                  —
                                </button>
                                <button
                                  type="button"
                                  aria-label="Seta diagonal"
                                  aria-pressed={item.icon === "arrow"}
                                  className={item.icon === "arrow" ? "active" : ""}
                                  onClick={() => updateItem(index, { icon: "arrow" })}
                                >
                                  <Icon name="arrow" size={24} />
                                </button>
                              </div>
                            </fieldset>
                            <ColorField
                              label="Cor do título"
                              value={item.titleColor}
                              fallback="#FF5414"
                              onChange={(titleColor) => updateItem(index, { titleColor })}
                            />
                            <ColorField
                              label="Cor da descrição"
                              value={item.textColor}
                              fallback="#FFFFFF"
                              onChange={(textColor) => updateItem(index, { textColor })}
                            />
                            <ColorField
                              label="Cor de fundo"
                              value={item.backgroundColor}
                              fallback="#171617"
                              onChange={(backgroundColor) => updateItem(index, { backgroundColor })}
                            />
                          </div>
                        </fieldset>
                        <div className="responsive-style-grid">
                          {(["desktop", "mobile"] as const).map((device) => (
                            <DeviceStyleEditor
                              key={device}
                              device={device}
                              value={item[device]}
                              onChange={(patch) => updateDeviceStyle(index, device, patch)}
                            />
                          ))}
                        </div>
                        {item.image && (
                          <fieldset>
                            <legend>Fotografia e selo da abertura</legend>
                            <div className="field-grid compact-grid">
                              <label className="field-wide">
                                Texto do selo circular
                                <input
                                  value={
                                    item.hero?.badgeText ??
                                    "VISÃO 360° DA COMUNICAÇÃO E MARKETING ·"
                                  }
                                  onChange={(event) =>
                                    updateHero(index, {
                                      badgeText: event.target.value,
                                    })
                                  }
                                />
                              </label>
                              <label className="toggle-field">
                                <input
                                  type="checkbox"
                                  checked={item.hero?.badgeVisible !== false}
                                  onChange={(event) =>
                                    updateHero(index, {
                                      badgeVisible: event.target.checked,
                                    })
                                  }
                                />
                                Exibir selo
                              </label>
                              <ColorField
                                label="Fundo da coluna"
                                value={item.hero?.panelBackground}
                                fallback="#171617"
                                onChange={(panelBackground) =>
                                  updateHero(index, { panelBackground })
                                }
                              />
                              <ColorField
                                label="Fundo do selo"
                                value={item.hero?.badgeBackground}
                                fallback="#FF5414"
                                onChange={(badgeBackground) =>
                                  updateHero(index, { badgeBackground })
                                }
                              />
                              <ColorField
                                label="Traço do selo"
                                value={item.hero?.badgeColor}
                                fallback="#171617"
                                onChange={(badgeColor) => updateHero(index, { badgeColor })}
                              />
                              <ColorField
                                label="Cor da frase"
                                value={item.hero?.introColor}
                                fallback="#FFFFFF"
                                onChange={(introColor) => updateHero(index, { introColor })}
                              />
                            </div>
                            <div className="responsive-style-grid">
                              <HeroDeviceEditor
                                device="desktop"
                                value={item.hero?.desktop}
                                onChange={(patch) => updateHeroDevice(index, "desktop", patch)}
                              />
                              <HeroDeviceEditor
                                device="mobile"
                                value={item.hero?.mobile}
                                onChange={(patch) => updateHeroDevice(index, "mobile", patch)}
                              />
                            </div>
                          </fieldset>
                        )}
                      </details>
                    </div>
                  )}
                </article>
              ))}
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  const nextIndex = draft.content_json.items?.length ?? 0
                  setDraft({
                    ...draft,
                    content_json: {
                      ...draft.content_json,
                      items: [...(draft.content_json.items ?? []), { ...emptyItem }],
                    },
                  })
                  setExpandedItemIndex(nextIndex)
                }}
              >
                Adicionar item
              </button>
            </div>
            <StatusMessage>{message}</StatusMessage>
            <div className="form-actions">
              <button className="danger-button" onClick={archiveBlock}>
                Arquivar bloco
              </button>
              <FloatingSaveButton
                enabled={blockDirty && !placementsLoading && !placementsReadError}
                onClick={saveBlock}
                label="Salvar bloco"
              />
            </div>
          </section>
        ) : (
          <div className="admin-card empty-state">
            <h2>Selecione ou crie um bloco</h2>
          </div>
        )}
      </div>
    </>
  )
}

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

const collectionConfigs: CollectionConfig[] = [
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
  embedded = false,
  onDirtyChange,
}: {
  initialSource?: string
  sectionId?: string
  linkedSources?: string[]
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
  useEffect(() => registerAdminSaveAction(save), [save])

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
          {linkedSources.includes(config.table)
            ? "Coleção vinculada nesta seção: os registros publicados alimentam o bloco correspondente."
            : "Coleção não vinculada a esta seção. Salvar aqui atualiza o acervo, mas não os cards manuais do site. Para vinculá-la, use Fonte do conteúdo exibido nas configurações avançadas do bloco."}
        </p>
      )}
      <div className="collection-tabs" role="tablist">
        {collectionConfigs.map((item) => (
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
            <StatusMessage>{message}</StatusMessage>
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
              <FloatingSaveButton enabled={recordDirty} onClick={save} label="Salvar registro" />
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export function NavigationStudio({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const [items, setItems] = useState<Record<string, any>[]>([])
  const [savedItems, setSavedItems] = useState("[]")
  const navigationDirty = JSON.stringify(items) !== savedItems
  useEffect(() => onDirtyChange?.(navigationDirty), [navigationDirty, onDirtyChange])
  const [message, setMessage] = useState("")
  const load = async (): Promise<boolean> => {
    if (!supabase) return false
    const { data, error } = await supabase.from("navigation_items").select("*").order("sort_order")
    if (error) {
      setMessage(error.message)
      return false
    }
    setItems(data ?? [])
    setSavedItems(JSON.stringify(data ?? []))
    setMessage("")
    return true
  }
  useEffect(() => {
    void load()
  }, [])
  function patch(index: number, values: Record<string, any>) {
    const next = [...items]
    next[index] = { ...next[index], ...values }
    setItems(next)
  }
  function create() {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        label: "Novo item",
        target_slug: "perfil",
        group_name: "Menu",
        sort_order: items.length + 1,
        is_visible: false,
        status: "draft",
      },
    ])
  }
  async function save(): Promise<boolean> {
    if (!supabase) return false
    setMessage("Salvando navegação…")
    const rows = items.map(({ id, label, target_slug, sort_order, is_visible, status }) => ({
      id,
      label,
      target_slug,
      group_name: "Menu",
      sort_order,
      is_visible,
      status,
    }))
    const { error } = await supabase.from("navigation_items").upsert(rows, { onConflict: "id" })
    if (error) {
      setMessage(error.message)
      return false
    }
    const confirmed = await load()
    setMessage(
      confirmed ? "Navegação salva." : "Gravação realizada, mas leitura de confirmação falhou.",
    )
    return confirmed
  }
  useEffect(() => registerAdminSaveAction(save), [save])
  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next.map((item, order) => ({ ...item, sort_order: order + 1 })))
  }
  return (
    <>
      <header className="admin-header">
        <div>
          <p>Menu público</p>
          <h1>Navegação</h1>
          <span>
            Menu único: rótulos, ordem, âncoras e visibilidade. Sem títulos de grupo no site.
          </span>
        </div>
        <div className="header-actions">
          <button className="secondary-button" onClick={create}>
            Novo item
          </button>
          <FloatingSaveButton enabled={navigationDirty} onClick={save} label="Salvar menu" />
        </div>
      </header>
      <section className="admin-card navigation-form">
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="order-buttons">
              <button onClick={() => move(index, -1)} aria-label="Mover item para cima">
                <Icon name="up" size={17} />
              </button>
              <button onClick={() => move(index, 1)} aria-label="Mover item para baixo">
                <Icon name="down" size={17} />
              </button>
            </div>
            <label>
              Rótulo
              <input
                value={item.label}
                onChange={(event) => patch(index, { label: event.target.value })}
              />
            </label>
            <label>
              Âncora
              <input
                value={item.target_slug}
                onChange={(event) => patch(index, { target_slug: event.target.value })}
              />
            </label>
            <label className="toggle-field">
              <input
                type="checkbox"
                checked={item.is_visible}
                onChange={(event) => patch(index, { is_visible: event.target.checked })}
              />
              Visível
            </label>
            <label>
              Status
              <select
                value={item.status}
                onChange={(event) => patch(index, { status: event.target.value })}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </label>
          </div>
        ))}
        <StatusMessage>{message}</StatusMessage>
      </section>
    </>
  )
}

export function SeoStudio({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const [page, setPage] = useState<Record<string, any> | null>(null)
  const [savedSeo, setSavedSeo] = useState("")
  const [settings, setSettings] = useState<Record<string, any> | null>(null)
  const [message, setMessage] = useState("")
  const seoDirty = Boolean(
    page && settings && savedSeo && JSON.stringify({ page, settings }) !== savedSeo,
  )
  useEffect(() => onDirtyChange?.(seoDirty), [seoDirty, onDirtyChange])
  useEffect(() => {
    void Promise.all([
      supabase?.from("pages").select("*").eq("slug", "home").maybeSingle(),
      supabase?.from("site_settings").select("*").limit(1).maybeSingle(),
    ]).then(([pageResult, settingsResult]) => {
      const loadedPage = pageResult?.data ?? null
      const loadedSettings = settingsResult?.data ?? {
        site_title: "",
        locale: "pt-BR",
        description: "",
        seo_json: {},
        status: "draft",
      }
      setPage(loadedPage)
      setSettings(loadedSettings)
      setSavedSeo(JSON.stringify({ page: loadedPage, settings: loadedSettings }))
    })
  }, [])
  async function save(): Promise<boolean> {
    if (!supabase || !page || !settings) return false
    if (!page.id || !settings.id) {
      setMessage("Página ou configurações de SEO ausentes. Nada foi alterado.")
      return false
    }
    setMessage("Salvando SEO…")
    const { error } = await supabase.rpc("save_home_seo_atomic", {
      p_page_id: page.id,
      p_settings_id: settings.id,
      p_page_seo_title: page.seo_title,
      p_page_seo_description: page.seo_description,
      p_site_title: settings.site_title,
      p_site_description: settings.description,
      p_locale: settings.locale,
      p_seo_json: settings.seo_json ?? {},
      p_status: settings.status,
    })
    setMessage(
      error?.message ??
        "SEO salvo atomicamente. Metadados para robôs serão regenerados no próximo deploy.",
    )
    if (!error) setSavedSeo(JSON.stringify({ page, settings }))
    return !error
  }
  useEffect(() => registerAdminSaveAction(save), [save])

  return (
    <>
      <header className="admin-header">
        <div>
          <p>Descoberta</p>
          <h1>SEO e metadados</h1>
          <span>Configurações globais e da página principal</span>
        </div>
        <FloatingSaveButton enabled={seoDirty} onClick={save} label="Salvar SEO" />
      </header>
      {page && settings && (
        <section className="admin-card editor-form">
          <div className="field-grid">
            <label>
              Título do site
              <input
                value={settings.site_title}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    site_title: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Idioma
              <input
                value={settings.locale}
                onChange={(event) => setSettings({ ...settings, locale: event.target.value })}
              />
            </label>
            <label className="field-wide">
              Descrição global
              <textarea
                value={settings.description ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    description: event.target.value,
                  })
                }
              />
            </label>
            <label className="field-wide">
              Título SEO
              <input
                value={page.seo_title ?? ""}
                onChange={(event) => setPage({ ...page, seo_title: event.target.value })}
              />
            </label>
            <label className="field-wide">
              Descrição SEO
              <textarea
                value={page.seo_description ?? ""}
                onChange={(event) => setPage({ ...page, seo_description: event.target.value })}
              />
            </label>
            <div className="field-wide">
              <PublishedMediaPicker
                label="Imagem Open Graph (compartilhamento)"
                guidance="1200 × 630 px (1,91:1). Redes sociais usam o arquivo original; prepare o recorte antes do upload."
                ratio="1200 / 630"
                value={settings.seo_json?.ogImage ?? ""}
                onChange={(ogImage) =>
                  setSettings({
                    ...settings,
                    seo_json: withOpenGraphImage(settings.seo_json, ogImage),
                  })
                }
              />
              <small>
                Selecione uma imagem publicada. A alteração dos metadados HTML será aplicada no
                próximo deploy após salvar o SEO.
              </small>
            </div>
            <label className="field-wide">
              Canonical
              <input
                value={settings.seo_json?.canonical ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    seo_json: {
                      ...(settings.seo_json ?? {}),
                      canonical: event.target.value,
                    },
                  })
                }
                placeholder="Definir após o domínio final"
              />
            </label>
            <label>
              Status
              <select
                value={settings.status}
                onChange={(event) => setSettings({ ...settings, status: event.target.value })}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </label>
          </div>
          <StatusMessage>{message}</StatusMessage>
        </section>
      )}
    </>
  )
}

type RevisionPreview = {
  revisionId: string
  entityType: RestorableEntity
  entityId: string
  current: Record<string, any>
  patch: Record<string, unknown>
  changedFields: string[]
}

// Apenas a listagem corrente é reiniciada; os registros anteriores permanecem no Supabase.
const EDITORIAL_ACTIVITY_START = "2026-11-05T08:36:27.000Z"
const EDITORIAL_PAGE_SIZE = 10

export function EditorialStudio() {
  const [issues, setIssues] = useState<Record<string, any>[]>([])
  const [revisions, setRevisions] = useState<Record<string, any>[]>([])
  const [issueLimit, setIssueLimit] = useState(EDITORIAL_PAGE_SIZE)
  const [revisionLimit, setRevisionLimit] = useState(EDITORIAL_PAGE_SIZE)
  const [issueTotal, setIssueTotal] = useState(0)
  const [revisionTotal, setRevisionTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [preview, setPreview] = useState<RevisionPreview | null>(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    if (!supabase) {
      setLoading(false)
      setMessage("Não foi possível acessar o Supabase.")
      return
    }
    setLoading(true)
    const [issueResult, revisionResult] = await Promise.all([
      supabase
        .from("editorial_issues")
        .select("*, sections(title)", { count: "exact" })
        .eq("status", "open")
        .gte("created_at", EDITORIAL_ACTIVITY_START)
        .order("created_at", { ascending: false })
        .range(0, issueLimit - 1),
      supabase
        .from("content_revisions")
        .select("*", { count: "exact" })
        .gte("created_at", EDITORIAL_ACTIVITY_START)
        .order("created_at", { ascending: false })
        .range(0, revisionLimit - 1),
    ])
    setLoading(false)
    if (!issueResult.error) {
      setIssues(issueResult.data ?? [])
      setIssueTotal(issueResult.count ?? 0)
    }
    if (!revisionResult.error) {
      setRevisions(revisionResult.data ?? [])
      setRevisionTotal(revisionResult.count ?? 0)
    }
    if (issueResult.error || revisionResult.error) {
      setMessage(issueResult.error?.message ?? revisionResult.error?.message ?? "Falha na leitura.")
    }
  }
  useEffect(() => {
    void load()
  }, [issueLimit, revisionLimit])

  async function resolve(id: string, resolution: string) {
    if (!supabase || !resolution.trim()) return setMessage("Informe a resolução editorial.")
    setMessage("Registrando resolução…")
    const { error } = await supabase
      .from("editorial_issues")
      .update({ status: "resolved", resolution, reviewed_at: new Date() })
      .eq("id", id)
    setMessage(error?.message ?? "Pendência resolvida.")
    if (!error) await load()
  }

  async function inspectRevision(revision: Record<string, any>) {
    if (!supabase || busy || !isRestorableEntity(revision.entity_type)) return
    setBusy(true)
    setPreview(null)
    setMessage("Lendo o registro atual e preparando comparação…")
    try {
      const table = revision.entity_type as RestorableEntity
      const { data: current, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", revision.entity_id)
        .single()
      if (error || !current) throw new Error(error?.message ?? "Registro original não encontrado.")
      const result = prepareContentRestoration(
        table,
        revision.entity_id,
        revision.snapshot_json,
        current as Record<string, unknown>,
      )
      setPreview({
        revisionId: revision.id,
        entityType: table,
        entityId: revision.entity_id,
        current,
        patch: result.patch,
        changedFields: result.changedFields,
      })
      setMessage(
        result.changedFields.length
          ? "Comparação pronta. Nenhuma alteração foi gravada."
          : "Esta revisão já corresponde aos campos recuperáveis do registro.",
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível comparar a revisão.")
    } finally {
      setBusy(false)
    }
  }

  async function restorePreview() {
    if (!supabase || !preview || busy || !preview.changedFields.length) return
    if (
      !(await adminConfirm(
        "Restaurar os campos exibidos desta revisão? O estado atual será salvo como uma nova revisão antes da alteração. Status, visibilidade, ordem e Storage serão preservados.",
        { title: "Restaurar revisão", confirmLabel: "Restaurar", tone: "danger" },
      ))
    )
      return
    setBusy(true)
    setMessage("Validando versão atual e criando cópia de segurança…")
    try {
      const table = preview.entityType
      const { data: latest, error: readError } = await supabase
        .from(table)
        .select("*")
        .eq("id", preview.entityId)
        .single()
      if (readError || !latest) throw new Error(readError?.message ?? "Registro não encontrado.")
      if (latest.updated_at !== preview.current.updated_at)
        throw new Error("O registro mudou desde a comparação. Reabra a revisão antes de restaurar.")
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user)
        throw new Error("A sessão administrativa expirou. Faça login novamente.")
      // Triggers save AFTER snapshots, so first preserve the current record
      // explicitly. This backup must succeed before touching the live row.
      const { error: backupError } = await supabase.from("content_revisions").insert({
        entity_type: table,
        entity_id: preview.entityId,
        snapshot_json: latest,
        actor_user_id: authData.user.id,
      })
      if (backupError)
        throw new Error("Backup não gravado. Nenhuma restauração feita: " + backupError.message)
      const { data: updated, error: updateError } = await supabase
        .from(table)
        .update(preview.patch)
        .eq("id", preview.entityId)
        .eq("updated_at", preview.current.updated_at)
        .select("id")
      if (updateError)
        throw new Error("A restauração falhou. O backup foi preservado: " + updateError.message)
      if (updated?.length !== 1)
        throw new Error(
          "O registro mudou durante a restauração. Backup preservado; nada foi sobrescrito.",
        )
      setPreview(null)
      setMessage("Campos recuperados. A versão anterior foi preservada no histórico.")
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha na restauração.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <header className="admin-header">
        <div>
          <p>Governança editorial</p>
          <h1>Revisões e pendências</h1>
          <span>Novos registros desde 05/11/2026 · histórico anterior preservado no Supabase</span>
        </div>
      </header>
      <div className="editorial-columns">
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <p>Novas em aberto</p>
              <h2>Pendências editoriais</h2>
            </div>
            <span className="status-chip">
              {issueTotal}
            </span>
          </div>
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} onResolve={resolve} />
          ))}
          {!loading && issues.length === 0 && (
            <p className="admin-note">Nenhuma nova pendência editorial aberta.</p>
          )}
          {issues.length < issueTotal && (
            <button
              type="button"
              className="secondary-button editorial-load-more"
              disabled={loading}
              onClick={() => setIssueLimit((limit) => limit + EDITORIAL_PAGE_SIZE)}
            >
              Ver mais
            </button>
          )}
          <StatusMessage>{message}</StatusMessage>
        </section>
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <p>Novas revisões</p>
              <h2>Revisões</h2>
            </div>
          </div>
          <p>
            Selecione uma revisão para comparar os campos recuperáveis com o registro atual. A
            restauração preserva estado de publicação, visibilidade, ordem e arquivos. Histórico de
            mídia disponível somente para consulta.
          </p>
          {preview && (
            <div className="revision-preview">
              <h3>Comparação da revisão</h3>
              <p>
                {preview.entityType} ·{" "}
                {preview.changedFields.length
                  ? "Campos diferentes: " + preview.changedFields.join(", ")
                  : "Sem diferenças recuperáveis"}
              </p>
              <details>
                <summary>Mostrar valores que serão recuperados</summary>
                <pre>{JSON.stringify(preview.patch, null, 2).slice(0, 12000)}</pre>
                {JSON.stringify(preview.patch).length > 12000 && (
                  <p>Prévia abreviada. Consulte os dados completos antes de confirmar.</p>
                )}
              </details>
              <div className="header-actions">
                <button
                  className="primary-button"
                  disabled={
                    busy ||
                    !preview.changedFields.length ||
                    JSON.stringify(preview.patch).length > 12000
                  }
                  onClick={() => void restorePreview()}
                >
                  {busy ? "Restaurando…" : "Restaurar apenas estes campos"}
                </button>
                <button
                  className="secondary-button"
                  onClick={() => setPreview(null)}
                  disabled={busy}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
          <div className="revision-list">
            {revisions.map((revision) => (
              <div key={revision.id}>
                <strong>{revision.entity_type}</strong>
                <span>{new Date(revision.created_at).toLocaleString("pt-BR")}</span>
                <code>{revision.entity_id}</code>
                {isRestorableEntity(revision.entity_type) ? (
                  <button
                    className="secondary-button"
                    disabled={busy}
                    onClick={() => void inspectRevision(revision)}
                  >
                    Comparar e recuperar
                  </button>
                ) : (
                  <small>Somente consulta: mídia e Storage preservados</small>
                )}
              </div>
            ))}
          </div>
          {!loading && revisions.length === 0 && (
            <p className="admin-note">Nenhuma nova revisão registrada.</p>
          )}
          {revisions.length < revisionTotal && (
            <button
              type="button"
              className="secondary-button editorial-load-more"
              disabled={loading}
              onClick={() => setRevisionLimit((limit) => limit + EDITORIAL_PAGE_SIZE)}
            >
              Ver mais
            </button>
          )}
        </section>
      </div>
    </>
  )
}

function IssueRow({
  issue,
  onResolve,
}: {
  issue: Record<string, any>
  onResolve: (id: string, resolution: string) => void
}) {
  const [resolution, setResolution] = useState(issue.resolution ?? "")
  return (
    <article className="issue-row">
      <span>{issue.sections?.title ?? issue.field_path}</span>
      <strong>{issue.description}</strong>
      {(issue.source_a || issue.source_b) && (
        <p>
          {issue.source_a || "—"} <b>×</b> {issue.source_b || "—"}
        </p>
      )}
      {issue.status === "open" ? (
        <div>
          <input
            aria-label={`Resolução para ${issue.description}`}
            value={resolution}
            onChange={(event) => setResolution(event.target.value)}
            placeholder="Decisão editorial"
          />
          <button className="secondary-button" onClick={() => onResolve(issue.id, resolution)}>
            Resolver
          </button>
        </div>
      ) : (
        <small>Resolvido: {issue.resolution}</small>
      )}
    </article>
  )
}

type MediaLibraryAsset = StoredMediaMetadata & Record<string, any>

export function EnhancedMediaLibrary({
  onDirtyChange,
}: {
  onDirtyChange?: (dirty: boolean) => void
}) {
  const [assets, setAssets] = useState<MediaLibraryAsset[]>([])
  const [previews, setPreviews] = useState<Record<string, MediaPreview>>({})
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)
  const [mediaDraft, setMediaDraft] = useState<MediaMetadataDraft | null>(null)
  const [message, setMessage] = useState("")
  const selectedAsset = assets.find((asset) => asset.id === selectedMediaId)
  const mediaDirty = Boolean(
    selectedAsset && mediaDraft && hasMediaMetadataChanges(selectedAsset, mediaDraft),
  )
  useEffect(() => onDirtyChange?.(mediaDirty), [mediaDirty, onDirtyChange])
  const load = async () => {
    const client = supabase
    if (!client) return
    const { data, error } = await client
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
    const nextAssets = data ?? []
    setAssets(nextAssets)
    setSelectedMediaId((current) =>
      nextAssets.some((item) => item.id === current) ? current : null,
    )
    setFailedImages({})
    if (error) {
      setPreviews({})
      setMessage(error.message)
      return
    }
    const resolved = await Promise.all(
      nextAssets.map(async (asset) => ({
        id: asset.id,
        preview: await resolveMediaPreview(client.storage, asset),
      })),
    )
    setPreviews(Object.fromEntries(resolved.map(({ id, preview }) => [id, preview])))
  }
  useEffect(() => {
    void load()
  }, [])
  async function save(asset: MediaLibraryAsset): Promise<boolean> {
    if (!supabase || !mediaDraft) return false
    const result = buildMediaMetadataPayload(mediaDraft)
    if (!result.ok) {
      setMessage(result.error)
      return false
    }
    setMessage("Salvando metadados…")
    // Prevent stale edits from silently overwriting another admin's changes.
    const { data, error } = await supabase
      .from("media_assets")
      .update(result.payload)
      .eq("id", asset.id)
      .eq("updated_at", asset.updated_at)
      .select("id")
      .maybeSingle()
    if (error || !data) {
      setMessage(
        error?.message ?? "Esta mídia mudou durante a edição. Reabra para atualizar os dados.",
      )
      return false
    }
    setMessage("Metadados salvos.")
    setMediaDraft(null)
    setSelectedMediaId(null)
    await load()
    return true
  }
  useEffect(
    () => registerAdminSaveAction(async () => (selectedAsset ? save(selectedAsset) : false)),
    [selectedAsset, mediaDraft],
  )
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ""
    const result = await uploadPrivateMedia(file)
    setMessage(result.message)
    if (result.ok) await load()
  }
  async function promote(asset: MediaLibraryAsset) {
    if (!supabase) return
    if (asset.storage_bucket === "portfolio-public") return save(asset)
    if (
      !(await adminConfirm(`Publicar mídia “${mediaDisplayTitle(asset)}” no site público?`, {
        title: "Publicar mídia",
        confirmLabel: "Publicar",
      }))
    )
      return
    setMessage("Publicando mídia…")
    const result = await publishPrivateMedia({
      id: asset.id,
      storage_bucket: asset.storage_bucket,
      storage_path: asset.storage_path,
      mime_type: asset.mime_type,
    })
    setMessage(result.message)
    if (result.ok) await load()
  }
  async function replace(event: React.ChangeEvent<HTMLInputElement>, asset: MediaLibraryAsset) {
    const file = event.target.files?.[0]
    if (!file || !supabase) return
    if (
      !["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type) ||
      file.size > 8_000_000
    )
      return setMessage("Use JPG, PNG, WebP ou SVG de até 8 MB.")
    if (asset.storage_bucket !== "portfolio-private")
      return setMessage(
        "Substituição direta de mídia pública bloqueada para evitar expor um rascunho. Envie um novo arquivo privado e publique após revisar.",
      )
    // Never overwrite existing bytes before the metadata pointer is committed.
    const client = supabase
    const newPath = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
    const result = await stagePrivateMediaChange({
      stage: () =>
        client.storage.from("portfolio-private").upload(newPath, file, {
          contentType: file.type,
          upsert: false,
        }),
      persist: async () =>
        client
          .from("media_assets")
          .update({
            storage_path: newPath,
            title: asset.title?.trim() || file.name,
            mime_type: file.type,
            file_size: file.size,
            status: "published",
          })
          .eq("id", asset.id)
          .select("id")
          .single(),
      undoStage: () => client.storage.from("portfolio-private").remove([newPath]),
      cleanupOld: () => client.storage.from("portfolio-private").remove([asset.storage_path]),
    })
    setMessage(
      result.ok
        ? `Arquivo substituído; use Disponibilizar no site para atualizar a versão pública.${result.warning ? ` ${result.warning}` : ""}`
        : result.message,
    )
    if (result.ok) await load()
  }
  return (
    <>
      <header className="admin-header">
        <div>
          <p>Assets editoriais</p>
          <h1>Biblioteca de mídia</h1>
          <span>Miniaturas, nomes de arquivo e publicação</span>
        </div>
        <label className="primary-button upload-button">
          Enviar mídia
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={upload}
          />
        </label>
      </header>
      <StatusMessage>{message}</StatusMessage>
      <div className="media-grid media-library-grid" aria-label="Arquivos da biblioteca">
        {assets.map((asset) =>
          selectedMediaId === asset.id && mediaDraft ? (
            <section
              className="admin-card media-library-detail"
              key={asset.id}
              aria-label={"Editar mídia " + mediaDisplayTitle(asset)}
            >
              <div className="card-heading">
                <div>
                  <p>Mídia selecionada</p>
                  <h2>{mediaDisplayTitle(asset)}</h2>
                </div>
                <button
                  type="button"
                  className="icon-button media-detail-close"
                  aria-label="Fechar detalhes da mídia"
                  title="Fechar detalhes"
                  onClick={async () => {
                    if (
                      mediaDirty &&
                      !(await adminConfirmUnsaved(
                        "Existem alterações não salvas nesta mídia. Como deseja continuar?",
                        { title: "Alterações não salvas" },
                      ))
                    )
                      return
                    setSelectedMediaId(null)
                    setMediaDraft(null)
                  }}
                >
                  <Icon name="close" />
                </button>
              </div>
              <label>
                Título editorial
                <input
                  maxLength={180}
                  value={mediaDraft.title}
                  onChange={(event) => setMediaDraft({ ...mediaDraft, title: event.target.value })}
                />
              </label>
              <label>
                Texto alternativo (opcional)
                <textarea
                  rows={3}
                  maxLength={500}
                  value={mediaDraft.altText}
                  onChange={(event) =>
                    setMediaDraft({ ...mediaDraft, altText: event.target.value })
                  }
                />
              </label>
              <label>
                Crédito / procedência (não inventar autoria)
                <textarea
                  rows={2}
                  maxLength={300}
                  value={mediaDraft.credit}
                  onChange={(event) => setMediaDraft({ ...mediaDraft, credit: event.target.value })}
                />
              </label>
              <div className="field-grid">
                <label>
                  Ponto focal X (%)
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={mediaDraft.focalX}
                    onChange={(event) =>
                      setMediaDraft({ ...mediaDraft, focalX: event.target.value })
                    }
                  />
                </label>
                <label>
                  Ponto focal Y (%)
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={mediaDraft.focalY}
                    onChange={(event) =>
                      setMediaDraft({ ...mediaDraft, focalY: event.target.value })
                    }
                  />
                </label>
              </div>
              <small>Arquivo físico (não renomeado): {mediaFileName(asset.storage_path)}</small>
              <div className="media-library-publication">
                <span>Status</span>
                <strong>
                  {asset.storage_bucket === "portfolio-public" ? "Publicado" : "Privado"}
                </strong>
                {asset.storage_bucket === "portfolio-private" && (
                  <small>
                    Arquivo privado protegido. Use “Disponibilizar no site” para torná-lo acessível
                    nas páginas públicas.
                  </small>
                )}
              </div>
              <div className="media-actions">
                <button
                  type="button"
                  className="primary-button"
                  disabled={!hasMediaMetadataChanges(asset, mediaDraft)}
                  onClick={() => save(asset)}
                >
                  Salvar metadados
                </button>
                <label className="secondary-button replace-button">
                  Substituir arquivo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={(event) => replace(event, asset)}
                  />
                </label>
                {asset.storage_bucket === "portfolio-private" && (
                  <button type="button" className="primary-button" onClick={() => promote(asset)}>
                    Disponibilizar no site
                  </button>
                )}
              </div>
            </section>
          ) : (
            <button
              key={asset.id}
              type="button"
              className="media-library-card"
              aria-expanded={false}
              onClick={async () => {
                if (
                  mediaDirty &&
                  !(await adminConfirmUnsaved(
                    "Existem alterações não salvas nesta mídia. Como deseja continuar?",
                    { title: "Alterações não salvas" },
                  ))
                )
                  return
                setSelectedMediaId(asset.id)
                setMediaDraft(createMediaMetadataDraft(asset))
              }}
            >
              <div className="media-placeholder media-preview">
                {previews[asset.id]?.url && !failedImages[asset.id] ? (
                  <img
                    src={previews[asset.id].url}
                    alt={asset.alt_text?.trim() || mediaDisplayTitle(asset)}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedImages((current) => ({ ...current, [asset.id]: true }))}
                  />
                ) : (
                  <div className="media-preview-fallback">
                    <Icon name="image" size={32} />
                    <small>
                      {failedImages[asset.id]
                        ? "Imagem indisponível"
                        : (previews[asset.id]?.error ?? "Carregando prévia…")}
                    </small>
                  </div>
                )}
              </div>
              <strong>{mediaDisplayTitle(asset)}</strong>
            </button>
          ),
        )}
      </div>
    </>
  )
}
