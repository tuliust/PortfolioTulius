import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { isSafeEditorialImage } from "../../lib/validation"
import { sameJson, tryCompositeSave } from "../../lib/p2-composite-save"
import {
  experienceProjectSlides,
  legacyExperienceProjects,
  validateExperienceProjects,
  type LegacyExperienceBlock,
} from "../../lib/experience-projects"
import type { ExperienceProject, ExperienceSlide } from "../../types/content"
import { PublishedMediaPicker } from "./PublishedMediaPicker"
import { AdminNotice } from "./AdminNotice"
import { registerAdminSaveAction } from "./AdminConfirmationHost"

type EditorBlock = LegacyExperienceBlock & {
  section_id: string
  block_type: string
  sort_order: number
  status: string
  is_placeholder: boolean
  editorial_note: string | null
  updated_at: string
}

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

  async function load() {
    if (!supabase) {
      setMessage("Cliente de conteúdo indisponível.")
      setLoading(false)
      return false
    }
    setLoading(true)
    const response = await supabase
      .from("content_blocks")
      .select("id,section_id,block_type,mobile_panel,sort_order,status,is_placeholder,editorial_note,content_json,updated_at")
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
    setExpanded(nextProjects.find((entry) => entry.item && entry.item.isHidden !== true)?.id ?? null)
    setMessage("")
    return true
  }

  useEffect(() => {
    let active = true
    setBlocks([])
    setSaved(null)
    setProjects(null)
    setLoading(true)
    void (async () => {
      if (active) await load()
    })()
    return () => {
      active = false
    }
  }, [sectionId])

  function edit(id: string, patch: Partial<ExperienceProject>) {
    setProjects((current) =>
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

  function attachSlide(slideId: string, projectId: string) {
    if (!projects || !projectId) return
    const source = projects.find((entry) => entry.id === slideId)
    const target = projects.find((entry) => entry.id === projectId)
    if (!source?.slide || !target?.item || target.slide) return
    setProjects(
      projects
        .filter((entry) => entry.id !== slideId)
        .map((entry) =>
          entry.id === projectId
            ? { ...entry, slide: source.slide, slideOrder: source.slideOrder, includeInGallery: true }
            : entry,
        ),
    )
    setExpanded(projectId)
  }

  async function save(): Promise<boolean> {
    if (!supabase || !projects || saving || loading) return false
    const a = blocks.find((block) => block.mobile_panel === "a")
    if (!a) return false
    const errors = validateExperienceProjects(projects)
    for (const project of projects) {
      if (project.slide?.image && !isSafeEditorialImage(project.slide.image))
        errors.push("Uma imagem do projeto não possui URL segura.")
      if (project.item?.image && !isSafeEditorialImage(project.item.image))
        errors.push("Um item possui URL de imagem insegura.")
    }
    if (errors.length) {
      setMessage(errors.join(" "))
      return false
    }
    setSaving(true)
    try {
      // Block B remains unchanged, but its initial version must still match
      // so an unrelated newer project is not accidentally shadowed.
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
        setMessage("Gravação solicitada, mas releitura não confirmada. Não salve novamente sem conferir.")
        return false
      }
      if (!(await load())) {
        setMessage("Gravado, mas não foi possível recarregar. Reabra antes de reenviar.")
        return false
      }
      setMessage("Projetos e imagens gravados e conferidos no bloco A.")
      onSaved?.()
      return true
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => registerAdminSaveAction(save, () => dirty), [save, dirty])

  const visibleProjects = projects?.filter((project) => project.item && project.item.isHidden !== true) ?? []
  const hiddenProjects = projects?.filter((project) => project.item?.isHidden === true) ?? []
  const unlinkedSlides = projects?.filter((project) => !project.item && project.slide) ?? []
  const totalSlides = projects ? experienceProjectSlides(projects).length : 0

  function renderProject(project: ExperienceProject) {
    if (!project.item) return null
    const item = project.item
    const open = expanded === project.id
    return (
      <article className="block-item-editor" key={project.id}>
        <div className="block-item-head">
          <button
            type="button"
            className="block-item-toggle"
            aria-expanded={open}
            onClick={() => setExpanded(open ? null : project.id)}
          >
            <strong>{item.title || "Projeto sem título"}{item.isHidden && " · Ocultado"}</strong>
          </button>
          <div className="order-buttons">
            <button type="button" aria-label={"Mover " + item.title + " para cima"} onClick={() => move(project.id, -1)}>↑</button>
            <button type="button" aria-label={"Mover " + item.title + " para baixo"} onClick={() => move(project.id, 1)}>↓</button>
          </div>
        </div>
        {open && (
          <div className="block-item-body">
            <div className="field-grid">
              <label className="field-wide">
                Título do projeto · compartilhado pelo texto e pela galeria
                <input
                  value={item.title}
                  onChange={(event) =>
                    edit(project.id, { item: { ...item, title: event.target.value } })
                  }
                />
              </label>
              <label className="field-wide">
                Descrição do projeto
                <textarea
                  rows={3}
                  value={item.text ?? ""}
                  onChange={(event) =>
                    edit(project.id, { item: { ...item, text: event.target.value } })
                  }
                />
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={item.isHidden !== true}
                  onChange={(event) =>
                    edit(project.id, { item: { ...item, isHidden: !event.target.checked } })
                  }
                />
                Exibir o projeto na lista pública
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={Boolean(project.slide && project.includeInGallery !== false)}
                  onChange={(event) =>
                    edit(project.id, {
                      includeInGallery: event.target.checked,
                      slide: event.target.checked && !project.slide ? { title: item.title } : project.slide,
                      slideOrder: project.slideOrder ?? totalSlides,
                    })
                  }
                />
                Exibir também na galeria de imagens
              </label>
              {project.slide && (
                <>
                  <label>
                    Ordem na galeria (1 = primeiro)
                    <input
                      type="number"
                      min="1"
                      value={(project.slideOrder ?? totalSlides) + 1}
                      onChange={(event) =>
                        edit(project.id, {
                          slideOrder: Math.max(0, Number(event.target.value) - 1),
                        })
                      }
                    />
                  </label>
                  <label className="field-wide">
                    Legenda da imagem
                    <input
                      value={project.slide.caption ?? ""}
                      onChange={(event) =>
                        edit(project.id, {
                          slide: { ...project.slide!, caption: event.target.value },
                        })
                      }
                    />
                  </label>
                  <div className="field-wide">
                    <PublishedMediaPicker
                      label="Fotografia do projeto"
                      recommendedSize="1600 × 1600 px (desktop e mobile)"
                      guidance="Mantenha imagem aprovada, alt e enquadramento."
                      ratio="1 / 1"
                      value={project.slide.image ?? ""}
                      allowFraming={false}
                      onChange={(image, alt) =>
                        edit(project.id, { slide: { ...project.slide!, image, alt } })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </article>
    )
  }

  return (
    <div className="admin-card editor-form" aria-label="Projetos e imagens unificados">
      <h3>Projetos e realizações</h3>
      <p>Uma ficha por projeto. Título, descrição e imagem são gerenciados juntos; a galeria pode ter menos imagens que a lista.</p>
      {loading && <p role="status">Carregando projetos…</p>}
      {!loading && !projects && <p role="alert">Conteúdo não disponível. Nenhuma gravação permitida.</p>}
      {projects && (
        <>
          <p><strong>{visibleProjects.length} projetos visíveis · {totalSlides} slides · {unlinkedSlides.length} imagens sem vínculo.</strong></p>
          <div className="block-items">{visibleProjects.map(renderProject)}</div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              const id = crypto.randomUUID()
              setProjects([...projects, { id, item: { title: "Novo projeto", text: "" } }])
              setExpanded(id)
            }}
          >
            Adicionar projeto
          </button>
          {unlinkedSlides.length > 0 && (
            <section className="admin-card">
              <h4>Slides históricos sem vínculo seguro</h4>
              <p>As imagens e legendas estão preservadas. Escolha explicitamente o projeto correspondente; não é feito vínculo automático por posição ou título duplicado.</p>
              {unlinkedSlides.map((project) => (
                <div className="block-item-editor" key={project.id}>
                  <div className="field-grid">
                    <label className="field-wide">
                      Título do slide histórico
                      <input
                        value={project.slide!.title}
                        onChange={(event) =>
                          edit(project.id, { slide: { ...project.slide!, title: event.target.value } })
                        }
                      />
                    </label>
                    <label className="field-wide">
                      Associar ao projeto
                      <select value="" onChange={(event) => attachSlide(project.id, event.target.value)}>
                        <option value="">Manter slide independente</option>
                        {projects.filter((entry) => entry.item && !entry.slide).map((entry) => (
                          <option value={entry.id} key={entry.id}>{entry.item!.title}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field-wide">
                      Legenda
                      <input
                        value={project.slide!.caption ?? ""}
                        onChange={(event) =>
                          edit(project.id, { slide: { ...project.slide!, caption: event.target.value } })
                        }
                      />
                    </label>
                    <div className="field-wide">
                      <PublishedMediaPicker
                        label="Imagem do slide histórico"
                        recommendedSize="1600 × 1600 px"
                        ratio="1 / 1"
                        value={project.slide?.image ?? ""}
                        allowFraming={false}
                        onChange={(image, alt) =>
                          edit(project.id, { slide: { ...project.slide!, image, alt } })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
          {hiddenProjects.length > 0 && (
            <details className="admin-card">
              <summary>Itens históricos ocultos ({hiddenProjects.length})</summary>
              <p>Preservados sem exclusão; é possível reativá-los se necessário.</p>
              <div className="block-items">{hiddenProjects.map(renderProject)}</div>
            </details>
          )}
          <AdminNotice message={message} />
          {saving && <p role="status">Salvando e verificando dados…</p>}
          <p className="site-editor-note">O salvamento usa a RPC de bloco existente. Blocos históricos A/B e mídia original não são excluídos.</p>
        </>
      )}
    </div>
  )
}
