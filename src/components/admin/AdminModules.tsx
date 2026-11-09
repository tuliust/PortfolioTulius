import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { adminVisualAreas, type AdminVisualArea } from "../../lib/admin-visual-areas"
import { sectionElementGroup } from "../../lib/section-element-group"
import { isSafeEditorialImage, validateContentItems } from "../../lib/validation"
import {
  isRestorableEntity,
  prepareContentRestoration,
  type RestorableEntity,
} from "../../lib/revision-restore"
import { PublishedMediaPicker } from "./PublishedMediaPicker"
import { AdminInfoTip } from "./InfoTip"
import {
  nextExpandedItem,
  expandedAfterMove,
  expandedAfterRemoval,
} from "../../lib/admin-item-expansion"
import { AdminNotice, statusPt } from "./AdminNotice"
import { adminConfirm, adminConfirmUnsaved, registerAdminSaveAction } from "./AdminConfirmationHost"
import { experienceTitleKey } from "../../lib/experience-text"
import {
  COLLECTION_SOURCES,
  isCollectionSource,
  collectionToItems,
  resolveCollectionBlocks,
  type CollectionSource,
} from "../../lib/collections"
import { compareCollectionItemChanges } from "../../lib/collection-link-review"
import type {
  ContentItem,
  DeviceItemStyle,
  HeroDeviceStyle,
  HeroVisualConfig,
  HeroTextFormat,
  MetricIconName,
  ExperienceMedia,
} from "../../types/content"
import {
  EditorIdentityProvider,
  useEditorIdentityOptions,
} from "./EditorIdentityFields"
import "./EditorIdentityFields.css"
import { Icon } from "../ui/Icons"
import { VisualIconLibrary, PlatformIconLibrary } from "./VisualIconLibrary"
import { FloatingSaveButton } from "./FloatingSaveButton"
import { HeroFormattingButton } from "./HeroFormattingButton"
import { HeroItemFields } from "./HeroItemFields"
import { HeroLeftEditor } from "./HeroLeftEditor"
import { HeroRightEditor } from "./HeroRightEditor"
import { HeroColorPicker, HeroIconPicker } from "./HeroVisualPickers"
import { ColorField, NumericField } from "./AdminVisualFields"
import { DeviceStyleEditor, HeroDeviceEditor } from "./DeviceStyleEditors"
import { ProfileMobileEditorialEditor } from "./ProfileMobileEditorialEditor"
import {
  hasHeroMediaControls,
  reorderHeroItems,
  unavailableHeroDestination,
} from "../../lib/hero-admin-contract"

interface SectionOption {
  id: string
  title: string
  slug: string
  status: string
  is_visible: boolean
  intro?: string | null
  eyebrow?: string | null
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
    editorTitle?: string
    editorAnchor?: string
  }
  mobile_panel: "a" | "b"
  sort_order: number
  status: string
  is_placeholder: boolean
  editorial_note: string | null
}

function StatusMessage({ children }: { children: string }) {
  return <AdminNotice message={children} />
}

export function ContentStudio({
  sections,
  sectionIdOverride,
  embedded = false,
  onDirtyChange,
  onSaved,
  heroArea,
  editorArea,
  editorView = "content",
}: {
  sections: SectionOption[]
  sectionIdOverride?: string
  embedded?: boolean
  onDirtyChange?: (dirty: boolean) => void
  onSaved?: () => void
  heroArea?: "left" | "right"
  editorArea?: AdminVisualArea
  editorView?: "content" | "advanced" | "mobile"
}) {
  const identityOptions = useEditorIdentityOptions()
  const [sectionId, setSectionId] = useState(sectionIdOverride ?? sections[0]?.id ?? "")
  const [blocks, setBlocks] = useState<BlockRow[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null)
  const [aboutImageTarget, setAboutImageTarget] = useState<"mobile" | "desktop">("mobile")
  const [visualArea, setVisualArea] = useState<AdminVisualArea["id"]>(() => {
    const slug = sections.find((entry) => entry.id === sectionIdOverride)?.slug
    return slug === "sobre" || slug === "resultados" ? "center" : "left"
  })
  const [draft, setDraft] = useState<BlockRow | null>(null)
  const [message, setMessage] = useState("")
  const [reviewingSource, setReviewingSource] = useState(false)
  const [trajectoryDirty, setTrajectoryDirty] = useState(false)
  const experienceSlug = sections.find((entry) => entry.id === sectionId)?.slug
  const [heroCopy, setHeroCopy] = useState({ title: "", eyebrow: "", intro: "" })
  const [heroCopySaved, setHeroCopySaved] = useState({ title: "", eyebrow: "", intro: "" })
  useEffect(() => {
    const section = sections.find((entry) => entry.id === sectionId)
    const copy = {
      title: section?.title ?? "",
      eyebrow: section?.eyebrow ?? "",
      intro: section?.intro ?? "",
    }
    setHeroCopy(copy)
    setHeroCopySaved(copy)
  }, [sectionId])
  const heroCopyDirty =
    experienceSlug === "perfil" && JSON.stringify(heroCopy) !== JSON.stringify(heroCopySaved)
  const visualAreas = adminVisualAreas(experienceSlug)
  const activeVisualArea = editorArea?.id ?? visualArea
  const sectionGroup = sectionElementGroup(
    experienceSlug,
    activeVisualArea,
    draft?.mobile_panel ?? "a",
  )
  const hasCareerTrajectory = [
    "invest-rs",
    "prefeitura-sp",
    "vale",
    "globo-sportv",
    "inpress",
    "cdi",
  ].includes(experienceSlug ?? "")
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
  useEffect(
    () => onDirtyChange?.(blockDirty || trajectoryDirty || heroCopyDirty),
    [blockDirty, trajectoryDirty, heroCopyDirty, onDirtyChange],
  )
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
    const expectedPanel =
      editorArea?.source === "a" || editorArea?.source === "b"
        ? editorArea.source
        : heroArea === "left"
          ? "a"
          : heroArea === "right"
            ? "b"
            : undefined
    if (expectedPanel) {
      const preferred = data?.find((block) => block.mobile_panel === expectedPanel)
      if (preferred) {
        if (preferred.id !== selectedId) setSelectedId(preferred.id)
      } else {
        setSelectedId("")
        setMessage("O painel solicitado não foi encontrado nesta seção.")
      }
    } else if (data?.length && !data.some((block) => block.id === selectedId)) {
      setSelectedId(data[0].id)
    }
    return true
  }

  useEffect(() => {
    void load()
  }, [sectionId, heroArea, editorArea?.id, editorArea?.source])

  useEffect(() => {
    if (editorView === "mobile") {
      setPlacementPanel(draft?.mobile_panel === "b" ? "mobile-b" : "mobile-a")
    } else if (editorView === "advanced") {
      setPlacementPanel("desktop")
    }
  }, [editorView, draft?.id])

  useEffect(() => {
    setExpandedItemIndex(experienceSlug === "perfil" ? 0 : null)
    setAboutImageTarget("mobile")
  }, [selectedId, sectionId, experienceSlug])

  // The existing A item holds two independent photos for Sobre.
  useEffect(() => {
    const block = blocks.find((entry) => entry.id === selectedId)
    if (
      experienceSlug === "sobre" &&
      activeVisualArea === "center" &&
      block?.mobile_panel === "a"
    ) {
      setExpandedItemIndex(0)
      setAboutImageTarget("desktop")
    }
  }, [selectedId, sectionId, visualArea, experienceSlug])

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

  async function saveBlock(): Promise<boolean> {
    if (!supabase || !draft) return false
    if (heroCopyDirty && !heroCopy.title.trim()) {
      setMessage("O título principal é obrigatório.")
      return false
    }
    if (placementsLoading || placementsReadError) {
      setMessage("Carregue os placements antes de salvar.")
      return false
    }
    if (experienceSlug === "perfil" && draft.mobile_panel === "b") {
      const unavailable = unavailableHeroDestination(
        draft.content_json.items ?? [],
        draft.content_json.items?.[0]?.hero?.nextTarget,
        sections,
      )
      if (unavailable) {
        setMessage(
          "O destino #" + unavailable + " não está publicado e visível. Escolha uma seção disponível.",
        )
        return false
      }
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

    // Check the source section before any block update. A CAS write prevents
    // another editor's newer copy from being silently overwritten.
    const heroTextSavedNow = heroCopyDirty
    if (heroCopyDirty) {
      const current = await supabase
        .from("sections")
        .select("title,eyebrow,intro,updated_at")
        .eq("id", draft.section_id)
        .single()
      if (current.error || !current.data) {
        setMessage(current.error?.message ?? "Não foi possível conferir os textos do Hero.")
        return false
      }
      if (
        current.data.title !== heroCopySaved.title ||
        (current.data.eyebrow ?? "") !== heroCopySaved.eyebrow ||
        (current.data.intro ?? "") !== heroCopySaved.intro
      ) {
        setMessage("Outra edição modificou os textos do Hero. Reabra a seção antes de salvar.")
        return false
      }
      const normalizedCopy = { ...heroCopy, title: heroCopy.title.trim() }
      const updated = await supabase
        .from("sections")
        .update(normalizedCopy)
        .eq("id", draft.section_id)
        .eq("updated_at", current.data.updated_at)
        .select("title,eyebrow,intro")
        .maybeSingle()
      if (
        updated.error ||
        updated.data?.title !== normalizedCopy.title ||
        updated.data?.eyebrow !== normalizedCopy.eyebrow ||
        updated.data?.intro !== normalizedCopy.intro
      ) {
        setMessage(
          updated.error?.message ??
            "Não foi possível confirmar os textos do Hero: houve edição concorrente. Reabra a seção.",
        )
        return false
      }
      setHeroCopy(normalizedCopy)
      setHeroCopySaved(normalizedCopy)
    }
    // A text-only edit must never rewrite a content block or its placements.
    if (!blockDirty) {
      setMessage("Textos do Hero salvos e conferidos no Supabase.")
      onSaved?.()
      return true
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
    let contentToSave = draft.content_json
    if (draft.mobile_panel === "a") {
      // Another editor can save the CMS-only section label while this item form is open.
      // Read it again immediately before the atomic write to avoid losing that label.
      const latest = await supabase
        .from("content_blocks")
        .select("content_json")
        .eq("id", draft.id)
        .single()
      if (latest.error) {
        setMessage(latest.error.message)
        return false
      }
      contentToSave = {
        ...contentToSave,
        ...(latest.data?.content_json?.editorTitle !== undefined
          ? { editorTitle: latest.data.content_json.editorTitle }
          : {}),
        ...(latest.data?.content_json?.editorAnchor !== undefined
          ? { editorAnchor: latest.data.content_json.editorAnchor }
          : {}),
      }
      if (experienceSlug === "perfil") {
        // Settings and content editors share the same first Hero item. Keep a
        // freshly saved root background unless this form explicitly edited it.
        const originalRoot = savedBlock?.content_json.items?.[0]?.hero?.rootBackground
        const draftRoot = draft.content_json.items?.[0]?.hero?.rootBackground
        const latestRoot = latest.data?.content_json?.items?.[0]?.hero?.rootBackground
        if (
          draftRoot !== originalRoot &&
          latestRoot !== originalRoot &&
          latestRoot !== draftRoot
        ) {
          setMessage(
            "A cor de fundo do Hero mudou em outra edição. Reabra a seção para resolver o conflito.",
          )
          return false
        }
        if (draftRoot === originalRoot && latestRoot !== originalRoot && contentToSave.items?.[0]) {
          const items = [...contentToSave.items]
          items[0] = {
            ...items[0],
            hero: { ...items[0].hero, rootBackground: latestRoot },
          }
          contentToSave = { ...contentToSave, items }
        }
      }
    }
    const { error } = await supabase.rpc("save_content_block_atomic", {
      p_block_id: draft.id,
      p_block_type: draft.block_type,
      p_content_json: contentToSave,
      p_mobile_panel: draft.mobile_panel,
      p_sort_order: draft.sort_order,
      p_status: draft.status === "archived" ? "archived" : "published",
      p_is_placeholder: draft.is_placeholder,
      p_editorial_note: draft.editorial_note,
      p_placements: placementUpdates,
    })
    if (error) {
      setMessage(
        heroTextSavedNow
          ? "Os textos do Hero foram salvos, mas o bloco não: " + error.message
          : error.message,
      )
      return false
    }
    const reloaded = await load()
    if (!reloaded) {
      setMessage(
        "O banco confirmou a transação do bloco, mas sua leitura posterior falhou. Verifique antes de salvar novamente.",
      )
      return false
    }
    setMessage("Bloco e textos salvos e conferidos.")
    onSaved?.()
    return true
  }
  useEffect(
    () =>
      registerAdminSaveAction(
        saveBlock,
        () => (blockDirty || heroCopyDirty) && !placementsLoading && !placementsReadError,
      ),
    [saveBlock, blockDirty, heroCopyDirty, placementsLoading, placementsReadError],
  )

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

  function updateFieldFormat(index: number, key: string, next?: HeroTextFormat) {
    if (!draft) return
    const item = draft.content_json.items?.[index]
    if (!item) return
    const fieldFormats = { ...item.fieldFormats }
    if (next) fieldFormats[key] = next
    else delete fieldFormats[key]
    updateItem(index, { fieldFormats })
  }

  function updateHeroFormat(index: number, key: string, next?: HeroTextFormat) {
    if (!draft) return
    const item = draft.content_json.items?.[index]
    if (!item) return
    const fieldFormats = { ...item.hero?.fieldFormats }
    if (next) fieldFormats[key] = next
    else delete fieldFormats[key]
    updateHero(index, { fieldFormats })
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
    let items = [...(draft.content_json.items ?? [])]
    const target = index + direction
    if (target < 0 || target >= items.length) return
    if (experienceSlug === "perfil") {
      items = reorderHeroItems(items, index, direction, draft.mobile_panel)
    } else {
      ;[items[index], items[target]] = [items[target], items[index]]
    }
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

  async function selectVisualArea(area: AdminVisualArea) {
    if (area.source === "section") {
      setVisualArea(area.id)
      document.getElementById("site-editor-section-details")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      return
    }
    const block = blocks.find((entry) => entry.mobile_panel === area.source)
    if (!block) return
    if (
      block.id !== selectedId &&
      blockDirty &&
      !(await adminConfirmUnsaved(
        "Existem alterações não salvas neste bloco. Como deseja continuar?",
        { title: "Alterações não salvas" },
      ))
    )
      return
    setVisualArea(area.id)
    if (block.id !== selectedId) setSelectedId(block.id)
    if (area.focus === "about-photo") {
      setExpandedItemIndex(0)
      setAboutImageTarget("desktop")
    }
    if (area.focus === "experience-gallery") {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          document.getElementById("site-editor-experience-gallery")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }),
      )
    }
  }

  return (
    <EditorIdentityProvider value={identityOptions}>
      {!embedded && (
        <header className="admin-header">
          <div>
            <p>Conteúdo modular</p>
            <h1>Conteúdo</h1>
            <span>Uma fonte de conteúdo, composições desktop e mobile</span>
          </div>
        </header>
      )}
      {embedded && !heroArea && !editorArea && (
        <div className="site-editor-actions">
          <div>
            <strong>Elementos desta seção</strong>
            <small>Escolha um painel para editar os textos, imagens e itens exibidos.</small>
          </div>
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
        {embedded && !editorArea && visualAreas.length > 0 && (
          <nav className="site-editor-visual-areas" aria-label="Áreas visuais no desktop">
            {visualAreas.map((area) => (
              <button
                type="button"
                key={area.id}
                className={visualArea === area.id ? "active" : ""}
                aria-pressed={visualArea === area.id}
                disabled={
                  area.source !== "section" &&
                  !blocks.some((block) => block.mobile_panel === area.source)
                }
                onClick={() => void selectVisualArea(area)}
              >
                <strong>{area.label}</strong>
                <small>{area.description}</small>
              </button>
            ))}
          </nav>
        )}
        {embedded && !editorArea && visualAreas.length > 0 && (
          <p className="site-editor-area-hint">
            Áreas da composição desktop vinculadas aos campos existentes. No mobile, os mesmos
            conteúdos continuam nos painéis A e B.
            {hasCareerTrajectory && " Alguns projetos usam itens de A e B; a galeria pertence a A."}
          </p>
        )}
        {embedded && hasCareerTrajectory && activeVisualArea === "center" && (
          <div
            className="site-editor-center-blocks"
            role="group"
            aria-label="Origens dos projetos da área central"
          >
            {blocks.map((block) => (
              <button
                type="button"
                key={block.id}
                aria-pressed={selectedId === block.id}
                className={selectedId === block.id ? "active" : ""}
                onClick={() =>
                  void selectVisualArea({
                    id: "center",
                    label: "Centro",
                    description: "Projetos da experiência",
                    source: block.mobile_panel,
                  })
                }
              >
                Projetos do bloco {block.mobile_panel.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <div
          className={embedded ? "studio-block-picker" : "section-list"}
          hidden={embedded && (visualAreas.length > 0 || Boolean(heroArea) || Boolean(editorArea))}
        >
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
                <strong>{block.mobile_panel === "a" ? "Esquerda" : "Direita"}</strong>
                <small>
                  {block.status === "published" ? "Publicado" : "Oculto"} ·{" "}
                  {block.content_json.items?.length ?? 0} itens ·
                  {block.mobile_panel === "a" ? " Primeiro no mobile" : " Segundo no mobile"}
                </small>
              </div>
            </button>
          ))}
        </div>
        {draft ? (
          <section className="admin-card editor-form">
            {editorView === "advanced" ? (
              <div className="site-editor-standalone-page">
                <div className="site-editor-advanced site-editor-advanced-page">
                  <h4>Bloco e painéis</h4>
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
                        <option value="a">Esquerda (primeiro no mobile)</option>
                        <option value="b">Direita (segundo no mobile)</option>
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
                    {sections.find((section) => section.id === draft.section_id)?.slug !==
                      "perfil" && (
                      <label className="field-wide">
                        Fonte do conteúdo exibido
                        <select
                          value={draft.content_json.source_collection ?? ""}
                          disabled={reviewingSource}
                          onChange={(event) =>
                            void reviewCollectionSourceChange(event.target.value)
                          }
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
                              Fonte vinculada: edite e publique registros em Gerenciar depoimentos
                              quando a origem for Depoimentos. Os cards manuais abaixo continuam
                              armazenados e voltam a aparecer quando o vínculo for removido.
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
                    <div className="editor-readonly-status" role="status">
                      <strong>{draft.status === "published" ? "Publicado" : "Oculto"}</strong>
                      <span>
                        Blocos publicados aparecem quando a seção e o painel estão visíveis.
                      </span>
                    </div>
                  </div>
                  <fieldset className="motion-editor">
                    <legend>Placement e animação</legend>
                    <label>
                      <span className="admin-field-label">
                        Painel a editar
                        <AdminInfoTip
                          label="Painel a editar"
                          description="A alteração é aplicada somente ao painel selecionado. Os demais painéis são preservados."
                        />
                      </span>
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
                </div>
                <fieldset className="site-editor-device-fieldset">
                  <legend>Ajustes de apresentação desktop</legend>
                  <div className="site-editor-device-list">
                    {(draft.content_json.items ?? []).map((item, index) => (
                      <details key={index} className="site-editor-device-item">
                        <summary>{item.title || `Elemento ${index + 1}`}</summary>
                        <DeviceStyleEditor
                          device="desktop"
                          value={item.desktop}
                          onChange={(patch) => updateDeviceStyle(index, "desktop", patch)}
                        />
                        {hasHeroMediaControls(experienceSlug, draft.mobile_panel, index) && (
                          <HeroDeviceEditor
                            device="desktop"
                            value={item.hero?.desktop}
                            onChange={(patch) => updateHeroDevice(index, "desktop", patch)}
                          />
                        )}
                      </details>
                    ))}
                  </div>
                </fieldset>
                <StatusMessage>{message}</StatusMessage>
              </div>
            ) : editorView === "mobile" ? (
              <div className="site-editor-standalone-page site-editor-mobile-page">
                <fieldset className="site-editor-device-fieldset">
                  <legend>Configurações dos painéis mobile</legend>
                  <div className="field-grid compact-grid">
                    <label>
                      Ordem de exibição do bloco
                      <select
                        value={draft.mobile_panel}
                        onChange={(event) =>
                          setDraft({ ...draft, mobile_panel: event.target.value as "a" | "b" })
                        }
                      >
                        <option value="a">Painel A · Primeiro no mobile</option>
                        <option value="b">Painel B · Segundo no mobile</option>
                      </select>
                    </label>
                    <label>
                      Placement mobile
                      <select
                        value={placementPanel}
                        onChange={(event) => setPlacementPanel(event.target.value as PanelKey)}
                      >
                        <option value="mobile-a">Mobile A</option>
                        <option value="mobile-b">Mobile B</option>
                      </select>
                    </label>
                    <label>
                      Layout
                      <select
                        value={placement.layout_variant}
                        onChange={(event) =>
                          setPlacement({ ...placement, layout_variant: event.target.value })
                        }
                      >
                        <option value="default">Padrão</option>
                        <option value="compact">Compacto</option>
                        <option value="featured">Destaque</option>
                        <option value="wide">Largo</option>
                      </select>
                    </label>
                    <label>
                      Animação
                      <select
                        value={placement.preset}
                        onChange={(event) =>
                          setPlacement({ ...placement, preset: event.target.value })
                        }
                      >
                        <option value="none">Nenhuma</option>
                        <option value="fade-in">Aparecer suavemente</option>
                        <option value="fade-up">Subir suavemente</option>
                        <option value="stagger">Sequência</option>
                        <option value="image-reveal">Revelar imagem</option>
                        <option value="metric-count">Destacar métricas</option>
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
                          setPlacement({ ...placement, duration: Number(event.target.value) })
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
                          setPlacement({ ...placement, delay: Number(event.target.value) })
                        }
                      />
                    </label>
                    <label>
                      Deslocamento (px)
                      <input
                        type="number"
                        min="0"
                        max="48"
                        value={placement.distance}
                        onChange={(event) =>
                          setPlacement({ ...placement, distance: Number(event.target.value) })
                        }
                      />
                    </label>
                    <label className="toggle-field">
                      <input
                        type="checkbox"
                        checked={placement.is_visible}
                        onChange={(event) =>
                          setPlacement({ ...placement, is_visible: event.target.checked })
                        }
                      />
                      Exibir placement mobile
                    </label>
                  </div>
                </fieldset>
                <fieldset className="site-editor-device-fieldset">
                  <legend>Elementos responsivos · Mobile</legend>
                  <div className="site-editor-device-list">
                    {(draft.content_json.items ?? []).map((item, index) => (
                      <details
                        className="site-editor-device-item"
                        key={index}
                        open={experienceSlug === "perfil" && index === 0 ? true : undefined}
                      >
                        <summary>{item.title || `Elemento ${index + 1}`}</summary>
                        <DeviceStyleEditor
                          device="mobile"
                          value={item.mobile}
                          onChange={(patch) => updateDeviceStyle(index, "mobile", patch)}
                        />
                        {hasHeroMediaControls(experienceSlug, draft.mobile_panel, index) && (
                          <HeroDeviceEditor
                            device="mobile"
                            value={item.hero?.mobile}
                            onChange={(patch) => updateHeroDevice(index, "mobile", patch)}
                          />
                        )}
                        {experienceSlug === "perfil" &&
                          draft.mobile_panel === "a" &&
                          index === 0 && (
                            <ProfileMobileEditorialEditor
                              value={item.hero?.mobileEditorial}
                              onChange={(mobileEditorial) => updateHero(index, { mobileEditorial })}
                            />
                          )}
                      </details>
                    ))}
                  </div>
                </fieldset>
                <StatusMessage>{message}</StatusMessage>
              </div>
            ) : experienceSlug === "sobre" &&
              activeVisualArea === "center" &&
              draft.mobile_panel === "a" ? (
              <div className="about-center-photo-only">
                <div>
                  <h3>Fotografia desktop · Centro</h3>
                  <p>
                    Esta área controla apenas a fotografia central da seção 02. Os textos e a imagem
                    mobile permanecem em seus próprios campos.
                  </p>
                </div>
                {draft.content_json.items?.[0] ? (
                  <PublishedMediaPicker
                    label="Fotografia desktop"
                    guidanceAsInfo
                    iconOnlyActions
                    allowFraming={false}
                    guidance="Retrato vertical 3:4; sugestão 900 × 1200 px."
                    ratio="3 / 4"
                    framing={draft.content_json.items[0].aboutDesktopFraming}
                    onFramingChange={(aboutDesktopFraming) =>
                      updateItem(0, { aboutDesktopFraming })
                    }
                    value={draft.content_json.items[0].aboutDesktopImage ?? ""}
                    onChange={(aboutDesktopImage, aboutDesktopAlt) =>
                      updateItem(0, { aboutDesktopImage, aboutDesktopAlt })
                    }
                  />
                ) : (
                  <p role="status">Não foi encontrado o registro da fotografia desktop.</p>
                )}
                <p>
                  Se não houver fotografia desktop, o site conserva a imagem de reserva. A imagem
                  mobile não será modificada.
                </p>
                <StatusMessage>{message}</StatusMessage>
                {!embedded && (
                  <FloatingSaveButton
                    enabled={blockDirty && !placementsLoading && !placementsReadError}
                    onClick={saveBlock}
                    label="Salvar fotografia desktop"
                  />
                )}
              </div>
            ) : (
              <>
                {draft.content_json.source_collection === "testimonials" && (
                  <p className="site-editor-note">
                    Os depoimentos exibidos no site são editados em
                    <strong> Gerenciar depoimentos</strong>, acima. Os itens manuais deste bloco
                    permanecem armazenados como reserva.
                  </p>
                )}

                {["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"].includes(
                  sections.find((entry) => entry.id === draft.section_id)?.slug ?? "",
                ) &&
                  draft.mobile_panel === "a" && (
                    <fieldset className="admin-card" id="site-editor-experience-gallery">
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
                                  (item) =>
                                    experienceTitleKey(item.title) === "competencias aplicadas",
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
                                (item) =>
                                  experienceTitleKey(item.title) === "competencias aplicadas",
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
                          As tags não criam slides, não substituem projetos e não alteram a
                          descrição completa da carreira.
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
                          allowFraming={false}
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
                      </div>
                      <div className="experience-admin-slide-heading">
                        <h3>Slides relacionados aos projetos</h3>
                        <AdminInfoTip
                          label="Slides relacionados aos projetos"
                          description="Cada título de slide é um projeto clicável na página pública. Se existir um item visível com o mesmo título nos blocos A ou B, seu texto será exibido junto ao projeto; caso contrário, aparece apenas o título do slide. Alterar a ordem dos slides também altera a ordem dos projetos. Indicadores permanecem independentes."
                        />
                      </div>
                      {(draft.content_json.experienceMedia?.slides ?? []).map(
                        (slide, slideIndex) => (
                          <div className="block-item-editor" key={slideIndex}>
                            <div className="block-item-head">
                              <strong>Slide {slideIndex + 1}</strong>
                              <div className="order-buttons">
                                <button
                                  type="button"
                                  aria-label="Slide anterior na ordem"
                                  onClick={() => {
                                    if (slideIndex === 0) return
                                    const slides = [
                                      ...(draft.content_json.experienceMedia?.slides ?? []),
                                    ]
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
                                    const slides = [
                                      ...(draft.content_json.experienceMedia?.slides ?? []),
                                    ]
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
                                allowFraming={false}
                                framing={slide.framing}
                                onFramingChange={(framing) => {
                                  const slides = [
                                    ...(draft.content_json.experienceMedia?.slides ?? []),
                                  ]
                                  slides[slideIndex] = { ...slide, framing }
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
                                value={slide.image ?? ""}
                                onChange={(image, alt) => {
                                  const slides = [
                                    ...(draft.content_json.experienceMedia?.slides ?? []),
                                  ]
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
                        ),
                      )}
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
                {editorArea && experienceSlug !== "perfil" && (
                  <div className="site-editor-element-group">
                    <h3>{sectionGroup[0]}</h3>
                    <p>{sectionGroup[1]}</p>
                  </div>
                )}
                <div className="block-items">
                  {experienceSlug === "perfil" && draft.mobile_panel === "a" ? (
                    <HeroLeftEditor
                      items={draft.content_json.items ?? []}
                      intro={heroCopy.intro}
                      catalog={identityOptions}
                      onIntroChange={(intro) => setHeroCopy((current) => ({ ...current, intro }))}
                      onUpdateItem={updateItem}
                      onUpdateHero={(patch) => updateHero(0, patch)}
                      onFormat={updateFieldFormat}
                      onHeroFormat={(key, next) => updateHeroFormat(0, key, next)}
                      onMove={moveItem}
                      onRemove={(index) => void removeItem(index)}
                    />
                  ) : experienceSlug === "perfil" && draft.mobile_panel === "b" ? (
                    <HeroRightEditor
                      items={draft.content_json.items ?? []}
                      title={heroCopy.title}
                      subtitle={heroCopy.eyebrow}
                      sections={sections}
                      catalog={identityOptions}
                      onTitleChange={(title) => setHeroCopy((current) => ({ ...current, title }))}
                      onSubtitleChange={(eyebrow) =>
                        setHeroCopy((current) => ({ ...current, eyebrow }))
                      }
                      onUpdateItem={updateItem}
                      onUpdateHero={(patch) => updateHero(0, patch)}
                      onFormat={updateFieldFormat}
                      onHeroFormat={(key, next) => updateHeroFormat(0, key, next)}
                      onMove={moveItem}
                      onRemove={(index) => void removeItem(index)}
                    />
                  ) : (
                    <>
                      {sections.find((entry) => entry.id === draft.section_id)?.slug === "sobre" &&
                        draft.mobile_panel === "b" && (
                          <div className="block-item-help">
                            <AdminInfoTip
                              label="Textos da seção 02 — coluna direita"
                              description="Cada item corresponde a um título e texto. Use as setas de ordenação e Remover item para organizar os itens existentes. O primeiro item também aparece junto à foto no painel A mobile. Use Salvar para confirmar suas edições no bloco."
                            />
                          </div>
                        )}
                      {(draft.content_json.items ?? []).map((item, index) =>
                        experienceSlug === "perfil" &&
                        draft.mobile_panel === "a" &&
                        index > 0 ? null : (
                          <article className="block-item-editor" key={index}>
                            <div className="block-item-head">
                              <button
                                type="button"
                                className="block-item-toggle"
                                aria-expanded={expandedItemIndex === index}
                                aria-controls={`block-item-fields-${draft.id}-${index}`}
                                onClick={() =>
                                  setExpandedItemIndex((current) =>
                                    nextExpandedItem(current, index),
                                  )
                                }
                              >
                                <Icon
                                  name={expandedItemIndex === index ? "up" : "down"}
                                  size={17}
                                />
                                <span className="block-item-toggle-label">
                                  <strong>
                                    {experienceSlug === "perfil"
                                      ? `Item ${String(index + 1).padStart(2, "0")}`
                                      : item.title?.trim() || `Elemento ${index + 1}`}
                                    {item.isHidden === true && (
                                      <span className="admin-hidden-label"> · Ocultado</span>
                                    )}
                                  </strong>
                                  <small>
                                    {experienceSlug === "perfil"
                                      ? item.title?.trim() || "Sem título"
                                      : `Elemento ${String(index + 1).padStart(2, "0")} · ${draft.mobile_panel.toUpperCase()}`}
                                  </small>
                                </span>
                              </button>
                              <div className="order-buttons">
                                <button
                                  onClick={() => moveItem(index, -1)}
                                  aria-label="Mover item para cima"
                                >
                                  <Icon name="up" size={17} />
                                </button>
                                <button
                                  onClick={() => moveItem(index, 1)}
                                  aria-label="Mover item para baixo"
                                >
                                  <Icon name="down" size={17} />
                                </button>
                                <button onClick={() => removeItem(index)} aria-label="Remover item">
                                  <Icon name="close" size={17} />
                                </button>
                              </div>
                            </div>
                            {expandedItemIndex === index && (
                              <div
                                className="block-item-body"
                                id={`block-item-fields-${draft.id}-${index}`}
                              >
                                {[
                                  "invest-rs",
                                  "prefeitura-sp",
                                  "vale",
                                  "globo-sportv",
                                  "inpress",
                                  "cdi",
                                ].includes(
                                  sections.find((entry) => entry.id === draft.section_id)?.slug ??
                                    "",
                                ) && (
                                  <label className="toggle-field admin-visibility-toggle">
                                    <input
                                      type="checkbox"
                                      checked={item.isHidden !== true}
                                      onChange={(event) =>
                                        updateItem(index, { isHidden: !event.target.checked })
                                      }
                                    />
                                    Exibir este item em Projetos e realizações (desmarcado =
                                    ocultado, sem excluir)
                                  </label>
                                )}
                                {experienceSlug === "perfil" && index === 0 && (
                                  <fieldset className="hero-section-specific">
                                    <legend>
                                      Hero · {draft.mobile_panel === "a" ? "Esquerda" : "Direita"}
                                    </legend>
                                    {draft.mobile_panel === "a" ? (
                                      <div className="field-grid">
                                        <HeroColorPicker
                                          label="Cor do BG do Hero"
                                          value={item.hero?.rootBackground ?? "transparent"}
                                          onChange={(rootBackground) =>
                                            updateHero(index, { rootBackground })
                                          }
                                          catalog={identityOptions}
                                          allowTransparent
                                        />
                                        <HeroColorPicker
                                          label="Cor do BG · Esquerda"
                                          value={item.hero?.panelBackground ?? "#171617"}
                                          onChange={(panelBackground) =>
                                            updateHero(index, { panelBackground })
                                          }
                                          catalog={identityOptions}
                                        />
                                        <label className="field-wide">
                                          <span className="hero-field-label">
                                            Frase editorial
                                            <HeroFormattingButton
                                              label="frase editorial"
                                              value={item.hero?.fieldFormats?.intro}
                                              onChange={(next) =>
                                                updateHeroFormat(index, "intro", next)
                                              }
                                              catalog={identityOptions}
                                            />
                                          </span>
                                          <textarea
                                            rows={3}
                                            value={heroCopy.intro}
                                            onChange={(event) =>
                                              setHeroCopy((current) => ({
                                                ...current,
                                                intro: event.target.value,
                                              }))
                                            }
                                          />
                                        </label>
                                        <label className="field-wide">
                                          <span className="hero-field-label">
                                            Círculo · texto giratório
                                            <HeroFormattingButton
                                              label="texto giratório"
                                              value={item.hero?.fieldFormats?.badgeText}
                                              onChange={(next) =>
                                                updateHeroFormat(index, "badgeText", next)
                                              }
                                              catalog={identityOptions}
                                            />
                                          </span>
                                          <input
                                            value={
                                              item.hero?.badgeText ??
                                              "VISÃO 360° DA COMUNICAÇÃO E MARKETING ·"
                                            }
                                            onChange={(event) =>
                                              updateHero(index, { badgeText: event.target.value })
                                            }
                                          />
                                        </label>
                                        <HeroIconPicker
                                          label="Círculo · ícone central"
                                          value={item.hero?.badgeIcon ?? "arrow"}
                                          onChange={(badgeIcon) => updateHero(index, { badgeIcon })}
                                        />
                                      </div>
                                    ) : (
                                      <div className="field-grid">
                                        <label className="field-wide">
                                          <span className="hero-field-label">
                                            Título principal
                                            <HeroFormattingButton
                                              label="título principal"
                                              value={item.hero?.fieldFormats?.title}
                                              onChange={(next) =>
                                                updateHeroFormat(index, "title", next)
                                              }
                                              catalog={identityOptions}
                                            />
                                          </span>
                                          <input
                                            value={heroCopy.title}
                                            onChange={(event) =>
                                              setHeroCopy((current) => ({
                                                ...current,
                                                title: event.target.value,
                                              }))
                                            }
                                          />
                                        </label>
                                        <label className="field-wide">
                                          <span className="hero-field-label">
                                            Descritivo
                                            <HeroFormattingButton
                                              label="descritivo"
                                              value={item.hero?.fieldFormats?.role}
                                              onChange={(next) =>
                                                updateHeroFormat(index, "role", next)
                                              }
                                              catalog={identityOptions}
                                            />
                                          </span>
                                          <input
                                            value={heroCopy.eyebrow}
                                            onChange={(event) =>
                                              setHeroCopy((current) => ({
                                                ...current,
                                                eyebrow: event.target.value,
                                              }))
                                            }
                                          />
                                        </label>
                                        <label className="field-wide">
                                          <span className="hero-field-label">
                                            Título secundário
                                            <HeroFormattingButton
                                              label="título secundário"
                                              value={item.hero?.fieldFormats?.secondaryTitle}
                                              onChange={(next) =>
                                                updateHeroFormat(index, "secondaryTitle", next)
                                              }
                                              catalog={identityOptions}
                                            />
                                          </span>
                                          <input
                                            value={
                                              item.hero?.secondaryTitle ?? "Experiência e atuação"
                                            }
                                            onChange={(event) =>
                                              updateHero(index, {
                                                secondaryTitle: event.target.value,
                                              })
                                            }
                                          />
                                        </label>
                                        <HeroIconPicker
                                          label="Botão inferior · ícone"
                                          value={item.hero?.nextIcon ?? "down"}
                                          onChange={(nextIcon) => updateHero(index, { nextIcon })}
                                        />
                                        <HeroColorPicker
                                          label="Botão inferior · cor do ícone"
                                          value={item.hero?.nextColor ?? ""}
                                          allowDefault
                                          onChange={(nextColor) => updateHero(index, { nextColor })}
                                          catalog={identityOptions}
                                        />
                                        <HeroColorPicker
                                          label="Botão inferior · cor do BG"
                                          value={item.hero?.nextBackground ?? ""}
                                          allowDefault
                                          allowTransparent
                                          onChange={(nextBackground) =>
                                            updateHero(index, { nextBackground })
                                          }
                                          catalog={identityOptions}
                                        />
                                        <label>
                                          Botão inferior · âncora
                                          <select
                                            value={item.hero?.nextTarget ?? ""}
                                            onChange={(event) =>
                                              updateHero(index, { nextTarget: event.target.value })
                                            }
                                          >
                                            <option value="">Próxima seção publicada</option>
                                            {sections
                                              .filter((entry) => entry.slug !== "perfil")
                                              .map((entry) => (
                                                <option key={entry.id} value={entry.slug}>
                                                  {entry.title} (#{entry.slug})
                                                </option>
                                              ))}
                                          </select>
                                        </label>
                                      </div>
                                    )}
                                  </fieldset>
                                )}
                                <div className="field-grid">
                                  {experienceSlug === "perfil" ? (
                                    <HeroItemFields
                                      item={item}
                                      index={index}
                                      panel={draft.mobile_panel}
                                      catalog={identityOptions}
                                      onUpdate={(patch) => updateItem(index, patch)}
                                      onFormat={(key, next) => updateFieldFormat(index, key, next)}
                                    />
                                  ) : (
                                    <>
                                      <label>
                                        <span className="hero-field-label">
                                          {experienceSlug === "perfil"
                                            ? draft.mobile_panel === "a"
                                              ? index === 0
                                                ? "Mensagem principal · texto grande"
                                                : "Destaque · título"
                                              : index < 5
                                                ? "Botão principal · título"
                                                : "Item · título"
                                            : "Título"}
                                          {
                                            <HeroFormattingButton
                                              label="título do item"
                                              value={item.fieldFormats?.title}
                                              onChange={(next) =>
                                                updateFieldFormat(index, "title", next)
                                              }
                                              catalog={identityOptions}
                                            />
                                          }
                                        </span>
                                        <input
                                          value={item.title}
                                          onChange={(event) =>
                                            updateItem(index, { title: event.target.value })
                                          }
                                        />
                                      </label>
                                      {Boolean(item.label?.trim()) && (
                                        <label>
                                          <span className="hero-field-label">
                                            {draft.mobile_panel === "b" &&
                                            experienceSlug === "perfil" &&
                                            index < 5
                                              ? "Linha superior / número"
                                              : "Rótulo / número"}
                                            {
                                              <HeroFormattingButton
                                                label="linha superior"
                                                value={item.fieldFormats?.label}
                                                onChange={(next) =>
                                                  updateFieldFormat(index, "label", next)
                                                }
                                                catalog={identityOptions}
                                              />
                                            }
                                          </span>
                                          <input
                                            value={item.label ?? ""}
                                            onChange={(event) =>
                                              updateItem(index, { label: event.target.value })
                                            }
                                          />
                                        </label>
                                      )}
                                      {Boolean(item.text?.trim()) && (
                                        <label className="field-wide">
                                          <span className="hero-field-label">
                                            {experienceSlug === "perfil"
                                              ? draft.mobile_panel === "a"
                                                ? index === 0
                                                  ? "Mensagem principal · texto pequeno"
                                                  : "Destaque · subtítulo"
                                                : index >= 5
                                                  ? "Descrição do item"
                                                  : "Texto"
                                              : "Texto"}
                                            {
                                              <HeroFormattingButton
                                                label="texto do item"
                                                value={item.fieldFormats?.text}
                                                onChange={(next) =>
                                                  updateFieldFormat(index, "text", next)
                                                }
                                                catalog={identityOptions}
                                              />
                                            }
                                          </span>
                                          <textarea
                                            value={item.text ?? ""}
                                            onChange={(event) =>
                                              updateItem(index, { text: event.target.value })
                                            }
                                          />
                                        </label>
                                      )}
                                      {Boolean(item.value?.trim()) && (
                                        <label>
                                          <span className="admin-field-with-info">
                                            Valor/métrica
                                            <HeroFormattingButton
                                              label="valor ou métrica"
                                              value={item.fieldFormats?.value}
                                              onChange={(next) =>
                                                updateFieldFormat(index, "value", next)
                                              }
                                              catalog={identityOptions}
                                            />
                                            <AdminInfoTip
                                              label="Valor/métrica"
                                              description="Valor ou indicador exibido em componentes que utilizam métricas. Deixe vazio quando o item não tiver um valor."
                                            />
                                          </span>
                                          <input
                                            value={item.value ?? ""}
                                            onChange={(event) =>
                                              updateItem(index, { value: event.target.value })
                                            }
                                          />
                                        </label>
                                      )}
                                      {Boolean(item.meta?.trim()) && (
                                        <label>
                                          <span className="admin-field-with-info">
                                            {experienceSlug === "perfil" &&
                                            draft.mobile_panel === "b" &&
                                            index >= 5
                                              ? "Subtítulo do item"
                                              : "Metadado/URL"}
                                            {
                                              <HeroFormattingButton
                                                label="subtítulo do item"
                                                value={item.fieldFormats?.meta}
                                                onChange={(next) =>
                                                  updateFieldFormat(index, "meta", next)
                                                }
                                                catalog={identityOptions}
                                              />
                                            }
                                            <AdminInfoTip
                                              label="Metadado/URL"
                                              description="Informação complementar do item, como período, local ou unidade. Alguns componentes podem utilizar este campo como URL; o comportamento depende da seção."
                                            />
                                          </span>
                                          <input
                                            value={item.meta ?? ""}
                                            onChange={(event) =>
                                              updateItem(index, { meta: event.target.value })
                                            }
                                          />
                                        </label>
                                      )}
                                    </>
                                  )}
                                  {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                                    "resultados" &&
                                    draft.mobile_panel === "a" && (
                                      <div className="field-wide">
                                        <VisualIconLibrary
                                          value={item.metricIcon ?? "chart"}
                                          onChange={(metricIcon) =>
                                            updateItem(index, { metricIcon })
                                          }
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
                                              [
                                                "corporativa",
                                                "projetos",
                                                "eventos",
                                                "marketing",
                                                "imprensa",
                                              ][themeIndex] ||
                                              `tema-${themeIndex + 1}`
                                            return (
                                              <label key={key} className="toggle-field">
                                                <input
                                                  type="checkbox"
                                                  checked={(item.relatedThemeKeys ?? []).includes(
                                                    key,
                                                  )}
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
                                              updateItem(index, {
                                                themeSubtitle: event.target.value,
                                              })
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
                                              updateItem(index, {
                                                themeSummary: event.target.value,
                                              })
                                            }
                                          />
                                        </label>
                                        <label>
                                          Conteúdo reaproveitado da antiga seção 04 (uma linha por
                                          item)
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
                                            Padrão: seção 03. O clique funciona em toda a área do
                                            card.
                                          </small>
                                        </label>
                                        <label className="field-wide">
                                          Tema selecionado na seção 03
                                          <select
                                            value={
                                              item.themeKey ||
                                              [
                                                "corporativa",
                                                "projetos",
                                                "eventos",
                                                "marketing",
                                                "imprensa",
                                              ][index]
                                            }
                                            onChange={(event) =>
                                              updateItem(index, { themeKey: event.target.value })
                                            }
                                          >
                                            <option value="corporativa">
                                              Comunicação Corporativa
                                            </option>
                                            <option value="projetos">
                                              Gestão e execução de projetos
                                            </option>
                                            <option value="eventos">
                                              Relações Públicas e Gestão de Eventos
                                            </option>
                                            <option value="marketing">
                                              Marketing Digital, Branding e Performance
                                            </option>
                                            <option value="imprensa">
                                              Imprensa e Influenciadores
                                            </option>
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
                                          O card inteiro direciona para a seção da empresa,
                                          incluindo no mobile.
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
                                    label={
                                      experienceSlug === "perfil" &&
                                      draft.mobile_panel === "a" &&
                                      index === 0
                                        ? "Foto"
                                        : "Imagem do item"
                                    }
                                    guidanceAsInfo
                                    iconOnlyActions
                                    allowFraming={false}
                                    guidance={
                                      ["perfil", "contato", "sobre"].includes(
                                        sections.find((entry) => entry.id === draft.section_id)
                                          ?.slug ?? "",
                                      )
                                        ? "Retrato vertical 3:4; sugestão 900 × 1200 px."
                                        : "Miniatura editorial 1:1; sugestão 600 × 600 px."
                                    }
                                    ratio={
                                      ["perfil", "contato", "sobre"].includes(
                                        sections.find((entry) => entry.id === draft.section_id)
                                          ?.slug ?? "",
                                      )
                                        ? "3 / 4"
                                        : "1 / 1"
                                    }
                                    framing={
                                      aboutImageTarget === "desktop" &&
                                      sections.find((entry) => entry.id === draft.section_id)
                                        ?.slug === "sobre" &&
                                      draft.mobile_panel === "a" &&
                                      index === 0
                                        ? item.aboutDesktopFraming
                                        : item.mediaFraming
                                    }
                                    onFramingChange={(framing) => {
                                      if (
                                        aboutImageTarget === "desktop" &&
                                        sections.find((entry) => entry.id === draft.section_id)
                                          ?.slug === "sobre" &&
                                        draft.mobile_panel === "a" &&
                                        index === 0
                                      ) {
                                        updateItem(index, { aboutDesktopFraming: framing })
                                      } else updateItem(index, { mediaFraming: framing })
                                    }}
                                    value={
                                      aboutImageTarget === "desktop" &&
                                      sections.find((entry) => entry.id === draft.section_id)
                                        ?.slug === "sobre" &&
                                      draft.mobile_panel === "a" &&
                                      index === 0
                                        ? (item.aboutDesktopImage ?? "")
                                        : (item.image ?? "")
                                    }
                                    onChange={(image, alt) => {
                                      if (
                                        aboutImageTarget === "desktop" &&
                                        sections.find((entry) => entry.id === draft.section_id)
                                          ?.slug === "sobre" &&
                                        draft.mobile_panel === "a" &&
                                        index === 0
                                      ) {
                                        updateItem(index, {
                                          aboutDesktopImage: image,
                                          aboutDesktopAlt: alt,
                                        })
                                      } else updateItem(index, { image, alt })
                                    }}
                                  />
                                  {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                                    "sobre" &&
                                    draft.mobile_panel === "a" &&
                                    index === 0 && (
                                      <small className="field-wide">
                                        As imagens mobile e desktop são preservadas separadamente.
                                        Se desktop estiver vazio, a seção utiliza
                                        /media/tulius-contact.jpg.
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
                                        onChange={(backgroundColor) =>
                                          updateItem(index, { backgroundColor })
                                        }
                                      />
                                    </div>
                                  </fieldset>
                                  <div className="responsive-style-grid">
                                    {(["desktop", "mobile"] as const).map((device) => (
                                      <DeviceStyleEditor
                                        key={device}
                                        device={device}
                                        value={item[device]}
                                        onChange={(patch) =>
                                          updateDeviceStyle(index, device, patch)
                                        }
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
                                          onChange={(badgeColor) =>
                                            updateHero(index, { badgeColor })
                                          }
                                        />
                                        <ColorField
                                          label="Cor da frase"
                                          value={item.hero?.introColor}
                                          fallback="#FFFFFF"
                                          onChange={(introColor) =>
                                            updateHero(index, { introColor })
                                          }
                                        />
                                      </div>
                                      <div className="responsive-style-grid">
                                        <HeroDeviceEditor
                                          device="desktop"
                                          value={item.hero?.desktop}
                                          onChange={(patch) =>
                                            updateHeroDevice(index, "desktop", patch)
                                          }
                                        />
                                        <HeroDeviceEditor
                                          device="mobile"
                                          value={item.hero?.mobile}
                                          onChange={(patch) =>
                                            updateHeroDevice(index, "mobile", patch)
                                          }
                                        />
                                      </div>
                                    </fieldset>
                                  )}
                                </details>
                                {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                                  "perfil" &&
                                  draft.mobile_panel === "a" &&
                                  index === 0 && (
                                    <ProfileMobileEditorialEditor
                                      value={item.hero?.mobileEditorial}
                                      onChange={(mobileEditorial) =>
                                        updateHero(index, { mobileEditorial })
                                      }
                                    />
                                  )}
                              </div>
                            )}
                          </article>
                        ),
                      )}
                    </>
                  )}
                </div>
                <StatusMessage>{message}</StatusMessage>
                <div className="form-actions">
                  <button className="danger-button" onClick={archiveBlock}>
                    Arquivar bloco
                  </button>
                  {!embedded && (
                    <FloatingSaveButton
                      enabled={
                        (blockDirty || heroCopyDirty) && !placementsLoading && !placementsReadError
                      }
                      onClick={saveBlock}
                      label="Salvar bloco"
                    />
                  )}
                </div>
              </>
            )}
          </section>
        ) : (
          <div className="admin-card empty-state">
            <h2>Selecione ou crie um bloco</h2>
          </div>
        )}
        {embedded && hasCareerTrajectory && experienceSlug && (
          <InlineCareerTrajectoryEditor
            sectionSlug={experienceSlug}
            onDirtyChange={setTrajectoryDirty}
          />
        )}
      </div>
    </EditorIdentityProvider>
  )
}

import { InlineCareerTrajectoryEditor } from "./CareerTrajectoryEditor"

export { CollectionsStudio } from "./CollectionsStudio"

export { NavigationStudio } from "./NavigationStudio"
export { SeoStudio } from "./SeoStudio"

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
            <span className="status-chip">{issueTotal}</span>
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

export { EnhancedMediaLibrary } from "./EnhancedMediaLibrary"
