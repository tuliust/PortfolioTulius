import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { isSafeEditorialImage } from "../../lib/validation"
import { sameJson, tryCompositeSave } from "../../lib/p2-composite-save"
import {
  experienceProjectItems,
  experienceProjectSlides,
  legacyExperienceProjects,
  validateExperienceProjects,
  type LegacyExperienceBlock,
} from "../../lib/experience-projects"
import type { ExperienceProject } from "../../types/content"
import { PublishedMediaPicker } from "./PublishedMediaPicker"
import { AdminNotice } from "./AdminNotice"
import { adminConfirm, registerAdminSaveAction } from "./AdminConfirmationHost"

type EditorBlock = LegacyExperienceBlock & {
  section_id: string
  block_type: string
  sort_order: number
  status: string
  is_placeholder: boolean
  editorial_note: string | null
  updated_at: string
}

/**
 * One editorial project, two independently published areas.
 * The original A/B blocks are never rewritten by this editor.
 */
export function ExperienceProjectsEditor({
  sectionId,
  onDirtyChange,
  onSaved,
}: {
  sectionId: string
  onDirtyChange?: (dirty: boolean) => void
  onSaved?: () => void
}) {
  const [blocks, setBlocks] = useState<EditorBlock[]>([])
  const [saved, setSaved] = useState<ExperienceProject[] | null>(null)
  const [projects, setProjects] = useState<ExperienceProject[] | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const dirty = projects !== null && saved !== null && !sameJson(projects, saved)

  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange])

  async function load(): Promise<boolean> {
    if (!supabase) {
      setMessage("Cliente de conteúdo indisponível.")
      setLoading(false)
      return false
    }
    setLoading(true)
    const response = await supabase
      .from("content_blocks")
      .select(
        "id,section_id,block_type,mobile_panel,sort_order,status,is_placeholder,editorial_note,content_json,updated_at",
      )
      .eq("section_id", sectionId)
      .order("sort_order")
    setLoading(false)
    if (response.error || !response.data) {
      setMessage(response.error?.message ?? "Não foi possível carregar os projetos.")
      return false
    }
    const nextBlocks = response.data as EditorBlock[]
    if (!nextBlocks.some((block) => block.mobile_panel === "a")) {
      setMessage("Bloco A não encontrado. Não é seguro editar esta experiência.")
      return false
    }
    const nextProjects = legacyExperienceProjects(nextBlocks)
    setBlocks(nextBlocks)
    setSaved(structuredClone(nextProjects))
    setProjects(nextProjects)
    setExpanded(nextProjects[0]?.id ?? null)
    setMessage("")
    return true
  }

  useEffect(() => {
    setBlocks([])
    setSaved(null)
    setProjects(null)
    setLoading(true)
    void load()
  }, [sectionId])

  function edit(id: string, patch: Partial<ExperienceProject>) {
    setProjects(
      (current) =>
        current?.map((project) => (project.id === id ? { ...project, ...patch } : project)) ?? null,
    )
  }

  function move(id: string, offset: number) {
    setProjects((current) => {
      if (!current) return current
      const next = [...current]
      const from = next.findIndex((project) => project.id === id)
      const to = from + offset
      if (from < 0 || to < 0 || to >= next.length) return current
      ;[next[from], next[to]] = [next[to], next[from]]
      return next
    })
  }

  async function remove(id: string) {
    if (!(await adminConfirm("Excluir este projeto e seu slide da coleção editorial?", {
      title: "Excluir projeto",
      confirmLabel: "Excluir",
      tone: "danger",
    }))) return
    setProjects((current) => current?.filter((project) => project.id !== id) ?? null)
    if (expanded === id) setExpanded(null)
  }

  async function save(): Promise<boolean> {
    if (!supabase || !projects || saving || loading) return false
    const a = blocks.find((block) => block.mobile_panel === "a")
    if (!a) return false
    const errors = validateExperienceProjects(projects)
    for (const project of projects) {
      if (project.includeInGallery !== false && project.slide?.image &&
          !isSafeEditorialImage(project.slide.image)) {
        errors.push("A imagem do slide exige uma URL segura.")
      }
      if (project.item?.image && !isSafeEditorialImage(project.item.image)) {
        errors.push("Uma imagem de projeto possui URL insegura.")
      }
    }
    if (errors.length) {
      setMessage(errors.join(" "))
      return false
    }
    setSaving(true)
    try {
      const latest = await supabase
        .from("content_blocks")
        .select("id,updated_at")
        .eq("section_id", sectionId)
      if (latest.error || !latest.data) {
        setMessage(latest.error?.message ?? "Não foi possível conferir versões.")
        return false
      }
      if (
        blocks.some(
          (block) =>
            latest.data.find((entry) => entry.id === block.id)?.updated_at !== block.updated_at,
        )
      ) {
        setMessage("Outra edição alterou um bloco. Reabra a empresa antes de salvar.")
        return false
      }
      const content = { ...a.content_json, experienceProjects: projects }
      const result = await tryCompositeSave({
        p_section_id: sectionId,
        p_section_changes: {},
        p_expected_section_updated_at: null,
        p_block_id: a.id,
        p_block_changes: {
          block_type: a.block_type,
          content_json: content,
          mobile_panel: a.mobile_panel,
          sort_order: a.sort_order,
          status: a.status,
          is_placeholder: a.is_placeholder,
          editorial_note: a.editorial_note,
        },
        p_expected_block_updated_at: a.updated_at,
        p_placements: [],
      })
      if (result.mode !== "saved") {
        setMessage(
          result.mode === "error"
            ? result.message
            : "A RPC transacional não foi encontrada. Nenhum dado foi gravado.",
        )
        return false
      }
      const read = await supabase
        .from("content_blocks")
        .select("content_json")
        .eq("id", a.id)
        .single()
      if (
        read.error ||
        !read.data ||
        !sameJson(read.data.content_json?.experienceProjects, projects)
      ) {
        setMessage(
          "Gravação solicitada, mas releitura não confirmada. Recarregue antes de reenviar.",
        )
        return false
      }
      if (!(await load())) {
        setMessage("Gravado, mas não foi possível recarregar. Reabra antes de reenviar.")
        return false
      }
      setMessage("Projetos e slides gravados e conferidos no Supabase.")
      onSaved?.()
      return true
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => registerAdminSaveAction(save, () => dirty), [save, dirty])

  const centralCount = projects ? experienceProjectItems(projects).length : 0
  const galleryCount = projects ? experienceProjectSlides(projects).length : 0
  const hiddenCount = projects
    ? projects.filter((project) => project.showInCenter === false && project.includeInGallery === false).length
    : 0

  function renderProject(project: ExperienceProject, index: number) {
    if (!project.item) return null
    const item = project.item
    const open = expanded === project.id
    const centerVisible = project.showInCenter !== false
    const galleryVisible = project.includeInGallery !== false && Boolean(project.slide)
    return (
      <article className="block-item-editor" key={project.id}>
        <div className="block-item-head">
          <button
            type="button"
            className="block-item-toggle"
            aria-expanded={open}
            onClick={() => setExpanded(open ? null : project.id)}
          >
            <strong>{item.title || project.slide?.title || "Projeto sem título"}</strong>
            <span className="block-item-toggle-label">
              {centerVisible ? "Centro" : ""}{centerVisible && galleryVisible ? " + " : ""}
              {galleryVisible ? "Slide" : ""}
              {!centerVisible && !galleryVisible ? "Oculto" : ""}
            </span>
          </button>
          <div className="order-buttons">
            <button
              type="button"
              disabled={index === 0}
              aria-label={"Mover " + item.title + " para cima"}
              onClick={() => move(project.id, -1)}
            >↑</button>
            <button
              type="button"
              disabled={index === (projects?.length ?? 0) - 1}
              aria-label={"Mover " + item.title + " para baixo"}
              onClick={() => move(project.id, 1)}
            >↓</button>
            <button
              type="button"
              aria-label={"Excluir projeto " + item.title}
              onClick={() => void remove(project.id)}
            >×</button>
          </div>
        </div>
        {open && (
          <div className="block-item-body">
            <fieldset className="field-grid">
              <legend>Onde exibir este projeto?</legend>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={centerVisible}
                  onChange={(event) =>
                    edit(project.id, { showInCenter: event.target.checked })
                  }
                />
                Exibir na área central
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={galleryVisible}
                  onChange={(event) =>
                    edit(project.id, {
                      includeInGallery: event.target.checked,
                      slide: event.target.checked && !project.slide
                        ? { title: item.title, caption: "", image: "" }
                        : project.slide,
                      slideOrder: project.slideOrder ?? galleryCount,
                    })
                  }
                />
                Exibir nos slides da direita
              </label>
              {!centerVisible && !galleryVisible && (
                <p className="field-wide">
                  Oculto no site. Os campos permanecem disponíveis para futura reativação.
                </p>
              )}
            </fieldset>
            <fieldset className="field-grid">
              <legend>Área central · Projetos e realizações</legend>
              <label className="field-wide">
                Título central
                <input
                  value={item.title}
                  onChange={(event) =>
                    edit(project.id, { item: { ...item, title: event.target.value } })
                  }
                />
              </label>
              <label className="field-wide">
                Descrição central
                <textarea
                  rows={3}
                  value={item.text ?? ""}
                  onChange={(event) =>
                    edit(project.id, { item: { ...item, text: event.target.value } })
                  }
                />
              </label>
            </fieldset>
            <fieldset className="field-grid">
              <legend>Área direita · Slide do projeto</legend>
              <label className="field-wide">
                Título do slide
                <input
                  value={project.slide?.title ?? ""}
                  onChange={(event) =>
                    edit(project.id, {
                      slide: {
                        ...project.slide,
                        title: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field-wide">
                Descrição do slide
                <textarea
                  rows={3}
                  value={project.slide?.caption ?? ""}
                  onChange={(event) =>
                    edit(project.id, {
                      slide: {
                        ...project.slide,
                        title: project.slide?.title ?? "",
                        caption: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label>
                Ordem do slide (1 = primeiro)
                <input
                  type="number"
                  min="1"
                  value={(project.slideOrder ?? galleryCount) + 1}
                  onChange={(event) =>
                    edit(project.id, {
                      slideOrder: Math.max(0, Number(event.target.value) - 1),
                    })
                  }
                />
              </label>
              <label className="field-wide">
                Texto alternativo da imagem
                <input
                  value={project.slide?.alt ?? ""}
                  onChange={(event) =>
                    edit(project.id, {
                      slide: {
                        ...project.slide,
                        title: project.slide?.title ?? "",
                        alt: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <div className="field-wide">
                <PublishedMediaPicker
                  label="Imagem do slide"
                  recommendedSize="1600 × 1600 px (desktop e mobile)"
                  guidance="Use imagem própria ou aprovada. O enquadramento e o texto alternativo são preservados."
                  ratio="1 / 1"
                  value={project.slide?.image ?? ""}
                  framing={project.slide?.framing}
                  onFramingChange={(framing) =>
                    edit(project.id, {
                      slide: {
                        ...project.slide,
                        title: project.slide?.title ?? "",
                        framing,
                      },
                    })
                  }
                  onChange={(image, alt) =>
                    edit(project.id, {
                      slide: {
                        ...project.slide,
                        title: project.slide?.title ?? "",
                        image,
                        alt,
                      },
                    })
                  }
                />
              </div>
            </fieldset>
          </div>
        )}
      </article>
    )
  }

  return (
    <div className="admin-card editor-form" aria-label="Projetos e slides unificados">
      <h3>Projetos e realizações</h3>
      <p>
        Edite os textos do centro e os textos e imagens da galeria na mesma ficha.
        Marque onde cada projeto aparece; com as duas opções desmarcadas, ele fica oculto.
      </p>
      {loading && <p role="status">Carregando projetos…</p>}
      {!loading && !projects && <p role="alert">Conteúdo indisponível. Nenhuma gravação permitida.</p>}
      {projects && (
        <>
          <p>
            <strong>
              {centralCount} no centro · {galleryCount} nos slides · {hiddenCount} ocultos
            </strong>
          </p>
          <div className="block-items">{projects.map(renderProject)}</div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              const id = crypto.randomUUID()
              setProjects([
                ...projects,
                {
                  id,
                  item: { title: "Novo projeto", text: "" },
                  showInCenter: true,
                  includeInGallery: false,
                },
              ])
              setExpanded(id)
            }}
          >Adicionar projeto</button>
          <AdminNotice message={message} />
          {saving && <p role="status">Salvando e verificando dados…</p>}
          <p className="site-editor-note">
            Cada projeto possui um único registro editorial no bloco A.
            A exclusão remove a ficha após salvar; não exclui arquivos da biblioteca de mídia.
          </p>
        </>
      )}
    </div>
  )
}
