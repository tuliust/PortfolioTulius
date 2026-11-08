import { useEffect, useRef, useState } from "react"
import { Link, Navigate, useBlocker, useNavigate } from "react-router"
import { isAdmin, supabase } from "../../lib/supabase"
import { PublicSite } from "../public/PublicSite"
import {
  buildAdminSectionNavigation,
  isExperienceSection,
} from "../../lib/admin-experience-navigation"
import { Icon } from "../ui/Icons"
import { HeroColorPicker } from "./HeroVisualPickers"
import { useEditorIdentityOptions } from "./EditorIdentityFields"
import { editorAnchorError, normalizeEditorAnchor } from "../../lib/editor-anchor"
import { siteEditorAreas, editorCopyInArea } from "../../lib/site-editor-areas"
import { AdminNotice } from "./AdminNotice"
import {
  adminConfirm,
  adminConfirmUnsaved,
  registerAdminSaveAction,
  saveRegisteredAdminChanges,
  AdminConfirmationHost,
} from "./AdminConfirmationHost"
import { FloatingSaveButton } from "./FloatingSaveButton"
import { IdentityCatalogEditor } from "./IdentityCatalogEditor"
import "./section-editor-stage3.css"
import { AdminInfoTip } from "./InfoTip"
import {
  ContentStudio,
  CollectionsStudio,
  EditorialStudio,
  EnhancedMediaLibrary,
  NavigationStudio,
  SeoStudio,
} from "./AdminModules"

type SectionRow = {
  id: string
  page_id: string
  title: string
  slug: string
  intro: string | null
  eyebrow: string | null
  sort_order: number
  status: string
  is_visible: boolean
  theme: string
  layout_variant: string
  animation_preset: string
  editor_title?: string
  editor_anchor?: string
  editor_block_id?: string
  editor_root_background?: string
}

function sectionPublicationLabel(section: SectionRow): string {
  return section.status === "published" && section.is_visible ? "Publicado" : "Oculto"
}

function useAdminGuard() {
  const [state, setState] = useState<"loading" | "allowed" | "denied">("loading")
  useEffect(() => {
    isAdmin()
      .then((allowed) => setState(allowed ? "allowed" : "denied"))
      .catch(() => setState("denied"))
  }, [])
  return state
}

function AdminShell({
  children,
  active,
  setActive,
  editorDirty,
  permitRouteExit,
}: {
  children: React.ReactNode
  active: string
  setActive: (value: string) => void
  editorDirty: boolean
  permitRouteExit: () => void
}) {
  const navigate = useNavigate()
  const items = [
    ["dashboard", "Visão geral", "edit"],
    ["editor", "Editor do site", "edit"],
    ["design", "Identidade", "palette"],
    ["media", "Mídia", "image"],
    ["navigation", "Navegação", "arrow"],
    ["seo", "SEO", "edit"],
    ["editorial", "Revisões", "edit"],
    ["preview", "Prévia", "arrow"],
  ] as const
  async function logout() {
    const question = editorDirty
      ? "Existem alterações não salvas. Deseja descartá-las e encerrar a sessão?"
      : "Deseja encerrar a sessão administrativa?"
    const approved = editorDirty
      ? await adminConfirmUnsaved(question, { title: "Sair do painel?" })
      : await adminConfirm(question, { title: "Sair do painel", confirmLabel: "Sair" })
    if (!approved) return
    const { error } = (await supabase?.auth.signOut()) ?? {
      error: new Error("Sessão indisponível"),
    }
    if (error) return
    permitRouteExit()
    navigate("/admin/login")
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link
          to="/"
          className="admin-logo"
          onClick={async (event) => {
            event.preventDefault()
            if (
              editorDirty &&
              !(await adminConfirmUnsaved(
                "Existem alterações não salvas. Como deseja voltar ao site?",
                { title: "Alterações não salvas" },
              ))
            )
              return
            permitRouteExit()
            navigate("/")
          }}
        >
          <span>TT</span>
          <strong>
            Tulius
            <br />
            Admin
          </strong>
        </Link>
        <nav aria-label="Administração">
          {items.map(([id, label, icon]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => setActive(id)}
            >
              <Icon name={icon} size={19} />
              {label}
            </button>
          ))}
        </nav>
        <button className="logout-button" onClick={logout}>
          <Icon name="logout" /> Sair
        </button>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  )
}

function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <header className="admin-header">
      <div>
        <p>Portfólio editorial</p>
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </div>
      {action}
    </header>
  )
}

function Dashboard({
  sections,
  loadStatus,
}: {
  sections: SectionRow[]
  loadStatus: "loading" | "ready" | "error"
}) {
  const published = sections.filter((section) => section.status === "published").length
  const visible = sections.filter(
    (section) => section.status === "published" && section.is_visible,
  ).length
  const sourceStatus = { loading: "Carregando", ready: "Online", error: "Erro" }[loadStatus]
  const [issueCount, setIssueCount] = useState<number | null>(null)
  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase
      .from("editorial_issues")
      .select("id", { count: "exact", head: true })
      .eq("status", "open")
      .then(({ count, error }) => {
        if (active) setIssueCount(error ? null : count)
      })
    return () => {
      active = false
    }
  }, [])
  return (
    <>
      <AdminHeader title="Visão geral" subtitle="Status editorial e atalhos de publicação" />
      <div className="admin-stats">
        <article>
          <span>Seções publicadas</span>
          <strong>
            {published}/{sections.length}
          </strong>
          <small>
            {visible} exibidas no site · {sections.length - published} aguardando publicação
          </small>
        </article>
        <article>
          <span>Pendências editoriais</span>
          <strong>{issueCount ?? "—"}</strong>
          <small>Registros editoriais abertos</small>
        </article>
        <article>
          <span>Fonte de dados</span>
          <strong>{sourceStatus}</strong>
          <small>Consulta de seções do Supabase</small>
        </article>
      </div>
      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p>Checklist de publicação</p>
            <h2>Qualidade antes de publicar</h2>
          </div>
        </div>
        <ul className="check-list">
          <li>
            <span className="check done">✓</span>
            <div>
              <strong>Estrutura editorial</strong>
              <p>
                {visible} seções exibidas no site, de {sections.length} cadastradas. Os painéis
                mobile seguem a composição aprovada.
              </p>
            </div>
          </li>
          <li>
            <span className="check done">✓</span>
            <div>
              <strong>Publicação das seções</strong>
              <p>
                {published} seções publicadas de {sections.length} cadastradas.
                {sections.length === published
                  ? " Nenhuma seção aguardando publicação."
                  : " Confira as seções restantes antes de publicar."}
              </p>
            </div>
          </li>
          <li>
            <span className={loadStatus === "ready" ? "check done" : "check"}>
              {loadStatus === "ready" ? "✓" : "!"}
            </span>
            <div>
              <strong>Persistência do CMS</strong>
              <p>
                {loadStatus === "ready"
                  ? "Estrutura do Supabase acessível; consulta de seções concluída."
                  : "Verifique a conexão e as permissões do Supabase antes de editar."}
              </p>
            </div>
          </li>
          <li>
            <span className={issueCount === 0 ? "check done" : "check"}>
              {issueCount === 0 ? "✓" : "!"}
            </span>
            <div>
              <strong>Revisão editorial</strong>
              <p>
                {issueCount === null
                  ? "Não foi possível conferir as pendências editoriais no Supabase."
                  : issueCount === 0
                    ? "Nenhuma pendência editorial aberta."
                    : `${issueCount} pendência(s) editorial(is) aguardando resolução.`}
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  )
}

function SectionsEditor({
  sections,
  reload,
  selectedSectionId,
  embedded = false,
  onDirtyChange,
  mode = "settings",
}: {
  sections: SectionRow[]
  reload: () => void
  selectedSectionId?: string
  embedded?: boolean
  onDirtyChange?: (dirty: boolean) => void
  mode?: "settings" | "editorial"
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedSectionId ?? sections[0]?.id ?? null,
  )
  const selected = sections.find((s) => s.id === selectedId)
  const [draft, setDraft] = useState<SectionRow | null>(selected ?? null)
  const [message, setMessage] = useState("")
  const identityOptions = useEditorIdentityOptions()
  const sectionDirty = Boolean(
    draft && selected && JSON.stringify(draft) !== JSON.stringify(selected),
  )
  useEffect(() => setDraft(selected ?? null), [selectedId, selected])
  useEffect(() => {
    onDirtyChange?.(sectionDirty)
  }, [sectionDirty, onDirtyChange])
  useEffect(() => {
    if (!selectedId && sections[0]) setSelectedId(sections[0].id)
  }, [sections, selectedId])

  async function save(): Promise<boolean> {
    if (!draft || !supabase) return false
    const isSettings = mode === "settings"
    const adminTitle = draft.editor_title?.trim() || ""
    const rootBackground = draft.editor_root_background ?? "transparent"
    if (isSettings ? !adminTitle : !draft.title.trim()) {
      setMessage("O título da seção é obrigatório.")
      return false
    }
    const anchor = normalizeEditorAnchor(draft.editor_anchor ?? draft.slug)
    if (isSettings) {
      const warning = editorAnchorError(
        anchor,
        draft.slug,
        sections
          .filter((entry) => entry.id !== draft.id)
          .flatMap((entry) => [entry.slug, entry.editor_anchor ?? entry.slug]),
      )
      if (warning) {
        setMessage(warning)
        return false
      }
    }
    const allowed = ["none", "fade-in", "fade-up", "stagger", "image-reveal", "metric-count"]
    if (isSettings && !allowed.includes(draft.animation_preset)) {
      setMessage("Selecione uma transição válida.")
      return false
    }
    setMessage("Salvando…")
    const expected = isSettings
      ? { animation_preset: draft.animation_preset }
      : { title: draft.title.trim(), eyebrow: draft.eyebrow, intro: draft.intro }
    const updated = await supabase
      .from("sections")
      .update(expected)
      .eq("id", draft.id)
      .select("id,title,eyebrow,intro,animation_preset")
      .single()
    const verified = isSettings
      ? updated.data?.animation_preset === draft.animation_preset
      : updated.data?.title === draft.title.trim() &&
        updated.data?.eyebrow === draft.eyebrow &&
        updated.data?.intro === draft.intro
    if (updated.error || !verified) {
      setMessage(updated.error?.message ?? "Não foi possível confirmar o salvamento da seção.")
      return false
    }
    if (
      isSettings &&
      (adminTitle !== (selected?.editor_title ?? selected?.title)?.trim() ||
        anchor !== (selected?.editor_anchor ?? selected?.slug) ||
        (draft.slug === "perfil" &&
          rootBackground !== (selected?.editor_root_background ?? "transparent")))
    ) {
      if (!draft.editor_block_id) {
        setMessage("Bloco de conteúdo não encontrado para salvar os dados administrativos.")
        return false
      }
      // Editor-only metadata belongs to the existing panel A JSONB; never
      // overwrite the public title or the canonical slug used by components.
      const latest = await supabase
        .from("content_blocks")
        .select("content_json")
        .eq("id", draft.editor_block_id)
        .single()
      if (latest.error || !latest.data) {
        setMessage(latest.error?.message ?? "Não foi possível ler os dados administrativos.")
        return false
      }
      const currentContent = latest.data.content_json ?? {}
      const items = [...(currentContent.items ?? [])]
      if (draft.slug === "perfil" && items[0]) {
        items[0] = { ...items[0], hero: { ...items[0].hero, rootBackground } }
      }
      const nextContent = {
        ...currentContent,
        editorTitle: adminTitle,
        editorAnchor: anchor,
        ...(draft.slug === "perfil" ? { items } : {}),
      }
      const saved = await supabase
        .from("content_blocks")
        .update({ content_json: nextContent })
        .eq("id", draft.editor_block_id)
        .select("content_json")
        .single()
      if (
        saved.error ||
        saved.data?.content_json?.editorTitle !== adminTitle ||
        saved.data?.content_json?.editorAnchor !== anchor ||
        (draft.slug === "perfil" &&
          saved.data?.content_json?.items?.[0]?.hero?.rootBackground !== rootBackground)
      ) {
        setMessage(saved.error?.message ?? "Não foi possível confirmar o nome e a âncora.")
        return false
      }
    }
    setMessage("Alterações salvas.")
    reload()
    return true
  }
  useEffect(() => registerAdminSaveAction(save, () => sectionDirty), [save, sectionDirty])
  async function move(direction: -1 | 1) {
    if (!selected || !supabase) return
    const target = sections.find((s) => s.sort_order === selected.sort_order + direction)
    if (!target) return
    setMessage("Reordenando…")
    const { error } = await supabase.rpc("swap_section_order", {
      section_a: selected.id,
      section_b: target.id,
    })
    setMessage(error?.message ?? "Ordem atualizada.")
    if (!error) reload()
  }
  async function togglePublication() {
    if (!selected || !supabase) return
    if (
      sectionDirty &&
      !(await adminConfirmUnsaved(
        "Existem alterações não salvas. Salve ou descarte antes de alterar a publicação.",
        { title: "Alterações não salvas" },
      ))
    )
      return
    const currentlyVisible = selected.status === "published" && selected.is_visible
    const confirmTitle = currentlyVisible ? "Arquivar seção" : "Exibir seção"
    const confirmMessage = currentlyVisible
      ? `Arquivar “${selected.title}”? A seção deixará de aparecer no site e poderá ser restaurada.`
      : `Exibir “${selected.title}”? A seção será publicada e ficará visível no site.`
    if (
      !(await adminConfirm(confirmMessage, {
        title: confirmTitle,
        confirmLabel: currentlyVisible ? "Arquivar" : "Exibir",
        tone: currentlyVisible ? "danger" : "warning",
      }))
    )
      return
    const status = currentlyVisible ? "archived" : "published"
    const is_visible = !currentlyVisible
    const { data, error } = await supabase
      .from("sections")
      .update({ status, is_visible })
      .eq("id", selected.id)
      .select("id,status,is_visible")
      .single()
    if (error || !data || data.status !== status || data.is_visible !== is_visible) {
      setMessage(error?.message ?? "Não foi possível confirmar a alteração de publicação.")
      return
    }
    setMessage(currentlyVisible ? "Seção arquivada." : "Seção publicada e visível.")
    reload()
  }
  return (
    <>
      {!embedded && (
        <AdminHeader title="Seções" subtitle="Ordem, visibilidade, conteúdo e apresentação" />
      )}
      <div className={embedded ? "site-editor-section" : "section-editor-layout"}>
        {!embedded && (
          <div className="section-list" aria-label="Seções do site">
            {sections.map((section) => (
              <button
                key={section.id}
                className={selectedId === section.id ? "active" : ""}
                onClick={() => setSelectedId(section.id)}
              >
                <span>{String(section.sort_order).padStart(2, "0")}</span>
                <div>
                  <strong>{section.title}</strong>
                  <small>{sectionPublicationLabel(section)}</small>
                </div>
              </button>
            ))}
          </div>
        )}
        {draft && (
          <section className="editor-form admin-card">
            <div className="card-heading">
              <div>
                <p>Seção {String(draft.sort_order).padStart(2, "0")}</p>
                <h2>
                  {mode === "editorial"
                    ? "Textos públicos"
                    : draft.editor_title || (draft.slug === "perfil" ? "Hero" : draft.title)}
                </h2>
              </div>
              <div className="order-buttons">
                <button onClick={() => move(-1)} aria-label="Mover para cima">
                  <Icon name="up" />
                </button>
                <button onClick={() => move(1)} aria-label="Mover para baixo">
                  <Icon name="down" />
                </button>
              </div>
            </div>
            {mode === "settings" ? (
              <div className="field-grid">
                <label>
                  Título da seção (nome no CMS)
                  <input
                    value={draft.editor_title ?? (draft.slug === "perfil" ? "Hero" : draft.title)}
                    onChange={(event) => setDraft({ ...draft, editor_title: event.target.value })}
                  />
                </label>
                <label>
                  Âncora
                  <input
                    value={draft.editor_anchor ?? draft.slug}
                    maxLength={64}
                    spellCheck={false}
                    aria-describedby="editor-anchor-help"
                    onChange={(event) => setDraft({ ...draft, editor_anchor: event.target.value })}
                  />
                  <small id="editor-anchor-help">
                    Altere o endereço público sem perder os links para #{draft.slug}.
                  </small>
                </label>
                {draft.slug === "perfil" && (
                  <div className="field-wide site-editor-section-background">
                    <HeroColorPicker
                      label="Fundo da seção (Hero)"
                      value={draft.editor_root_background ?? "transparent"}
                      allowTransparent
                      catalog={identityOptions}
                      onChange={(value) => setDraft({ ...draft, editor_root_background: value })}
                    />
                  </div>
                )}
                <label>
                  <span className="admin-field-label">
                    Transições
                    <AdminInfoTip
                      label="Transições"
                      description="Efeito de entrada da seção. Animações internas permanecem independentes."
                    />
                  </span>
                  <select
                    value={draft.animation_preset}
                    onChange={(event) =>
                      setDraft({ ...draft, animation_preset: event.target.value })
                    }
                  >
                    <option value="none">Nenhuma</option>
                    <option value="fade-in">Aparecer suavemente</option>
                    <option value="fade-up">Subir suavemente</option>
                    <option value="stagger">Revelar em sequência</option>
                    <option value="image-reveal">Revelar imagem</option>
                    <option value="metric-count">Destacar métricas</option>
                  </select>
                </label>
              </div>
            ) : (
              <div className="field-grid">
                <label className="field-wide">
                  Título público
                  <input
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  />
                </label>
                <label className="field-wide">
                  Linha editorial / descritivo
                  <input
                    value={draft.eyebrow ?? ""}
                    onChange={(event) => setDraft({ ...draft, eyebrow: event.target.value })}
                  />
                </label>
                <label className="field-wide">
                  Introdução / frase editorial
                  <textarea
                    rows={4}
                    value={draft.intro ?? ""}
                    onChange={(event) => setDraft({ ...draft, intro: event.target.value })}
                  />
                </label>
              </div>
            )}
            <AdminNotice message={message} />
            <div className="form-actions">
              {mode === "settings" && (
                <button
                  type="button"
                  className={
                    draft.status === "published" && draft.is_visible
                      ? "danger-button"
                      : "secondary-button site-editor-restore-button"
                  }
                  onClick={togglePublication}
                >
                  {draft.status === "published" && draft.is_visible ? "Arquivar" : "Exibir"}
                </button>
              )}
              <button
                type="button"
                className="secondary-button"
                onClick={embedded ? saveRegisteredAdminChanges : save}
              >
                Salvar
              </button>
              {!embedded && <FloatingSaveButton enabled={sectionDirty} onClick={save} />}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function SiteEditor({
  sections,
  reload,
  dirty,
  onDirtyChange,
}: {
  sections: SectionRow[]
  reload: () => void
  dirty: boolean
  onDirtyChange: (dirty: boolean) => void
}) {
  const [selectedId, setSelectedId] = useState(sections[0]?.id ?? "")
  const [editorMode, setEditorMode] = useState<"section" | "left" | "center" | "right">("section")
  const [editorSubView, setEditorSubView] = useState<"content" | "advanced" | "mobile">("content")
  const [sectionInfoDirty, setSectionInfoDirty] = useState(false)
  const [contentDirty, setContentDirty] = useState(false)
  const [testimonialsDirty, setTestimonialsDirty] = useState(false)
  useEffect(() => {
    onDirtyChange(sectionInfoDirty || contentDirty || testimonialsDirty)
  }, [sectionInfoDirty, contentDirty, testimonialsDirty, onDirtyChange])
  const [lastExperienceId, setLastExperienceId] = useState("")
  const selected = sections.find((item) => item.id === selectedId)
  const editorAreas = siteEditorAreas(selected?.slug)
  const selectedArea = editorAreas.find((area) => area.id === editorMode) ?? editorAreas[0]
  const navigationEntries = buildAdminSectionNavigation(sections)
  const experienceSections = sections.filter((section) => isExperienceSection(section.slug))
  const selectedIsExperience = Boolean(selected && isExperienceSection(selected.slug))
  useEffect(() => {
    if (!selectedId && sections[0]) setSelectedId(sections[0].id)
  }, [selectedId, sections])

  async function canLeave() {
    return (
      !dirty ||
      (await adminConfirmUnsaved("Existem alterações não salvas. Como deseja continuar?", {
        title: "Alterações não salvas",
      }))
    )
  }

  async function selectSection(id: string) {
    if (id === selectedId || !(await canLeave())) return
    onDirtyChange(false)
    setSectionInfoDirty(false)
    setContentDirty(false)
    setTestimonialsDirty(false)
    setEditorMode("section")
    setEditorSubView("content")
    setSelectedId(id)
    if (sections.some((section) => section.id === id && isExperienceSection(section.slug))) {
      setLastExperienceId(id)
    }
  }

  async function chooseEditorMode(next: "section" | "left" | "center" | "right") {
    if (next === editorMode || !editorAreas.some((area) => area.id === next) || !(await canLeave()))
      return
    onDirtyChange(false)
    setSectionInfoDirty(false)
    setContentDirty(false)
    setTestimonialsDirty(false)
    setEditorMode(next)
    setEditorSubView("content")
  }

  async function chooseEditorSubView(next: "content" | "advanced" | "mobile") {
    if (next === editorSubView || !(await canLeave())) return
    onDirtyChange(false)
    setSectionInfoDirty(false)
    setContentDirty(false)
    setTestimonialsDirty(false)
    setEditorSubView(next)
  }

  function selectExperienceGroup() {
    if (selectedIsExperience) return
    const next =
      experienceSections.find((section) => section.id === lastExperienceId) ?? experienceSections[0]
    if (next) selectSection(next.id)
  }

  return (
    <>
      <AdminHeader
        title="Editor do site"
        subtitle="Textos, imagens e depoimentos gerenciados em suas respectivas seções"
      />
      <div className="site-editor-layout">
        <nav className="section-list site-editor-sidebar" aria-label="Escolher seção do site">
          {navigationEntries.map((entry) =>
            entry.kind === "experiences" ? (
              <button
                type="button"
                key="professional-experiences"
                className={
                  selectedIsExperience
                    ? "active site-editor-experience-nav"
                    : "site-editor-experience-nav"
                }
                aria-current={selectedIsExperience ? "true" : undefined}
                onClick={selectExperienceGroup}
              >
                <span>{String(entry.sections[0].sort_order).padStart(2, "0")}</span>
                <div>
                  <strong>Experiências Profissionais</strong>
                  <small>{entry.sections.length} itens</small>
                </div>
              </button>
            ) : (
              <button
                type="button"
                key={entry.section.id}
                className={selectedId === entry.section.id ? "active" : ""}
                aria-current={selectedId === entry.section.id ? "true" : undefined}
                onClick={() => selectSection(entry.section.id)}
              >
                <span>{String(entry.section.sort_order).padStart(2, "0")}</span>
                <div>
                  <strong>
                    {entry.section.editor_title ||
                      (entry.section.slug === "perfil" ? "Hero" : entry.section.title)}
                  </strong>
                  <small>{sectionPublicationLabel(entry.section)}</small>
                </div>
              </button>
            ),
          )}
        </nav>
        <div className="site-editor-main">
          {selected ? (
            <>
              <div className="site-editor-heading">
                <div className="site-editor-heading-copy">
                  <p>
                    {selectedIsExperience
                      ? `GRUPO EDITORIAL · ${experienceSections.length} TRABALHOS`
                      : `SEÇÃO ${String(selected.sort_order).padStart(2, "0")} · #${selected.editor_anchor ?? selected.slug}`}
                  </p>
                  <h2>
                    {selectedIsExperience
                      ? "Experiências Profissionais"
                      : selected.editor_title ||
                        (selected.slug === "perfil" ? "Hero" : selected.title)}
                  </h2>
                  <span>
                    {selectedIsExperience
                      ? "Escolha abaixo o trabalho que deseja editar."
                      : sectionPublicationLabel(selected)}
                  </span>
                </div>
              </div>
              <nav
                className="hero-editor-tabs site-editor-area-tabs"
                role="tablist"
                aria-label={`Áreas de edição de ${selected.editor_title || selected.title}`}
              >
                {editorAreas.map((area) => (
                  <button
                    type="button"
                    role="tab"
                    key={area.id}
                    className={editorMode === area.id ? "active" : ""}
                    aria-selected={editorMode === area.id}
                    aria-controls="site-editor-active-panel"
                    onClick={() => void chooseEditorMode(area.id)}
                  >
                    <strong>{area.label}</strong>
                    <small>{area.description}</small>
                  </button>
                ))}
              </nav>
              {selectedIsExperience && (
                <section
                  className="site-editor-experience-picker"
                  aria-label="Trabalhos de Experiências Profissionais"
                >
                  <h3>Escolha um trabalho</h3>
                  <div
                    className="site-editor-experience-options"
                    role="group"
                    aria-label="Experiência para editar"
                  >
                    {experienceSections.map((experience) => (
                      <button
                        type="button"
                        key={experience.id}
                        className={experience.id === selectedId ? "active" : ""}
                        aria-pressed={experience.id === selectedId}
                        onClick={() => selectSection(experience.id)}
                      >
                        <strong>{experience.title}</strong>
                        <small>
                          Seção {String(experience.sort_order).padStart(2, "0")} ·{" "}
                          {sectionPublicationLabel(experience)}
                        </small>
                      </button>
                    ))}
                  </div>
                  <p className="site-editor-experience-current">
                    Editando: <strong>{selected.title}</strong>. O agrupamento existe apenas no
                    painel administrativo; as seções públicas permanecem independentes.
                  </p>
                </section>
              )}

              <div className="site-editor-body">
                {dirty && (
                  <p className="site-editor-unsaved" role="status">
                    Alterações não salvas nesta área.
                  </p>
                )}
                <div
                  className="site-editor-consolidated"
                  id="site-editor-active-panel"
                  role="tabpanel"
                  aria-label={selectedArea.label}
                >
                  {selectedArea.id === "section" ? (
                    <>
                      <div
                        className="site-editor-consolidated-heading"
                        id="site-editor-section-details"
                      >
                        <h3>Informações da seção</h3>
                        <p>Título administrativo, âncora, transições e publicação.</p>
                      </div>
                      <SectionsEditor
                        key={selected.id + "-settings"}
                        sections={sections}
                        reload={reload}
                        selectedSectionId={selected.id}
                        embedded
                        mode="settings"
                        onDirtyChange={setSectionInfoDirty}
                      />
                    </>
                  ) : (
                    <>
                      <div className="site-editor-consolidated-heading site-editor-subview-heading">
                        <div>
                          <h3>
                            {editorSubView === "content"
                              ? selectedArea.label
                              : editorSubView === "advanced"
                                ? `Avançado · ${selectedArea.label}`
                                : `Mobile · ${selectedArea.label}`}
                          </h3>
                          <p>
                            {editorSubView === "content"
                              ? `${selectedArea.description} · edite somente os elementos desta área.`
                              : editorSubView === "advanced"
                                ? "Configurações avançadas do bloco e dos painéis."
                                : "Exibição, responsividade e apresentação mobile."}
                          </p>
                        </div>
                        <div
                          className="site-editor-subview-actions"
                          role="group"
                          aria-label="Outras configurações da área"
                        >
                          {editorSubView !== "content" && (
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => void chooseEditorSubView("content")}
                            >
                              Voltar à edição
                            </button>
                          )}
                          <button
                            type="button"
                            className={editorSubView === "advanced" ? "active" : ""}
                            aria-pressed={editorSubView === "advanced"}
                            onClick={() => void chooseEditorSubView("advanced")}
                          >
                            Avançado
                          </button>
                          <button
                            type="button"
                            className={editorSubView === "mobile" ? "active" : ""}
                            aria-label="Configurações mobile"
                            title="Configurações mobile"
                            aria-pressed={editorSubView === "mobile"}
                            onClick={() => void chooseEditorSubView("mobile")}
                          >
                            <Icon name="smartphone" size={18} />
                          </button>
                        </div>
                      </div>
                      {editorSubView === "content" &&
                        editorCopyInArea(selected.slug, selectedArea.id) && (
                          <SectionsEditor
                            key={selected.id + "-editorial"}
                            sections={sections}
                            reload={reload}
                            selectedSectionId={selected.id}
                            embedded
                            mode="editorial"
                            onDirtyChange={setSectionInfoDirty}
                          />
                        )}
                      {editorSubView === "content" &&
                        selected.slug === "depoimentos" &&
                        selectedArea.id === "left" && (
                          <section
                            aria-label="Gerenciar depoimentos"
                            className="site-editor-testimonials"
                          >
                            <div className="site-editor-consolidated-heading">
                              <h3>Gerenciar depoimentos</h3>
                              <p>
                                Pessoas, cargos, textos, ordem e publicação; os registros alimentam
                                os painéis A e B.
                              </p>
                            </div>
                            <CollectionsStudio
                              key={selected.id + "-testimonials"}
                              initialSource="testimonials"
                              availableSources={["testimonials"]}
                              linkedSources={["testimonials"]}
                              embedded
                              onDirtyChange={setTestimonialsDirty}
                            />
                          </section>
                        )}
                      {selectedArea.source !== "section" && (
                        <ContentStudio
                          key={selected.id + "-content-" + selectedArea.id + "-" + editorSubView}
                          sections={sections}
                          sectionIdOverride={selected.id}
                          editorArea={selectedArea}
                          editorView={editorSubView}
                          embedded
                          onDirtyChange={setContentDirty}
                          onSaved={reload}
                        />
                      )}
                    </>
                  )}
                  <FloatingSaveButton
                    enabled={sectionInfoDirty || contentDirty || testimonialsDirty}
                    onClick={saveRegisteredAdminChanges}
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="site-editor-note">Nenhuma seção disponível para edição.</p>
          )}
        </div>
      </div>
    </>
  )
}

function DesignEditor({
  onDirtyChange,
  entrySession,
}: {
  onDirtyChange?: (dirty: boolean) => void
  entrySession: number
}) {
  return (
    <>
      <AdminHeader title="Identidade" subtitle="Cores, famílias e estilos tipográficos nomeados" />
      <IdentityCatalogEditor onDirtyChange={onDirtyChange} entrySession={entrySession} />
    </>
  )
}

export function AdminApp() {
  const guard = useAdminGuard()
  const [active, setActive] = useState("dashboard")
  const [editorDirty, setEditorDirty] = useState(false)
  const [designEntrySession, setDesignEntrySession] = useState(0)
  const bypassRouteGuard = useRef(false)
  // SPA history transitions can use the CMS dialog; closing/reloading a tab
  // is handled only by the browser's non-customizable beforeunload prompt.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      editorDirty &&
      !bypassRouteGuard.current &&
      currentLocation.pathname !== nextLocation.pathname,
  )
  useEffect(() => {
    if (blocker.state !== "blocked") return
    let active = true
    void adminConfirmUnsaved("Existem alterações não salvas. Como deseja sair?", {
      title: "Alterações não salvas",
    }).then((approved) => {
      if (!active || blocker.state !== "blocked") return
      if (approved) {
        bypassRouteGuard.current = true
        setEditorDirty(false)
        blocker.proceed()
      } else {
        blocker.reset()
      }
    })
    return () => {
      active = false
    }
  }, [blocker.state])
  // Reloading or closing the tab cannot display a custom CMS dialog.
  // Browsers provide only their own generic, user-initiated confirmation.
  useEffect(() => {
    if (!editorDirty) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [editorDirty])
  async function selectModule(next: string) {
    if (next === active) return
    if (
      editorDirty &&
      !(await adminConfirmUnsaved("Existem alterações não salvas. Como deseja sair?", {
        title: "Alterações não salvas",
      }))
    )
      return
    setEditorDirty(false)
    // Explicitly give each Identity visit a fresh React and browser form
    // identity. Discarded colors must not reappear via form restoration.
    if (next === "design") setDesignEntrySession((session) => session + 1)
    setActive(next)
  }
  const [sections, setSections] = useState<SectionRow[]>([])
  const [loadError, setLoadError] = useState("")
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">("loading")
  const load = () => {
    void supabase
      ?.from("sections")
      .select("*")
      .order("sort_order")
      .then(async ({ data, error }) => {
        // All administrative labels and optional public aliases live in the
        // pre-existing JSONB of panel A. Public headings and canonical slugs stay intact.
        let next: SectionRow[] = data ?? []
        let metadataError = ""
        if (!error && next.length && supabase) {
          const read = await supabase
            .from("content_blocks")
            .select("id,section_id,content_json")
            .eq("mobile_panel", "a")
            .in(
              "section_id",
              next.map((row) => row.id),
            )
            .order("sort_order")
          metadataError = read.error?.message ?? ""
          const firstBySection = new Map<
            string,
            {
              id: string
              content_json: {
                editorTitle?: string
                editorAnchor?: string
                items?: Array<{ hero?: { rootBackground?: string } }>
              } | null
            }
          >()
          for (const block of read.data ?? []) {
            if (!firstBySection.has(block.section_id)) firstBySection.set(block.section_id, block)
          }
          next = next.map((section) => {
            const block = firstBySection.get(section.id)
            const label = block?.content_json?.editorTitle
            const alias = block?.content_json?.editorAnchor
            return {
              ...section,
              editor_title:
                typeof label === "string" && label.trim()
                  ? label
                  : section.slug === "perfil"
                    ? "Hero"
                    : section.title,
              editor_anchor: typeof alias === "string" && alias.trim() ? alias : section.slug,
              editor_block_id: block?.id,
              editor_root_background:
                section.slug === "perfil"
                  ? (block?.content_json?.items?.[0]?.hero?.rootBackground ?? "transparent")
                  : undefined,
            }
          })
        }
        if (!error) setSections(next)
        setLoadError(error?.message ?? metadataError)
        setLoadStatus(error ? "error" : "ready")
      })
  }
  useEffect(() => {
    load()
  }, [])
  if (guard === "loading") return <div className="admin-loading">Verificando autorização…</div>
  if (guard === "denied") return <Navigate to="/admin/login" replace />
  const screens: Record<string, React.ReactNode> = {
    dashboard: <Dashboard sections={sections} loadStatus={loadStatus} />,
    editor: (
      <SiteEditor
        sections={sections}
        reload={load}
        dirty={editorDirty}
        onDirtyChange={setEditorDirty}
      />
    ),
    design: (
      <DesignEditor
        key={designEntrySession}
        entrySession={designEntrySession}
        onDirtyChange={setEditorDirty}
      />
    ),
    media: <EnhancedMediaLibrary onDirtyChange={setEditorDirty} />,
    navigation: <NavigationStudio onDirtyChange={setEditorDirty} />,
    seo: <SeoStudio onDirtyChange={setEditorDirty} />,
    editorial: <EditorialStudio />,
    preview: <PortfolioPreviewPane />,
  }
  return (
    <AdminShell
      active={active}
      setActive={selectModule}
      editorDirty={editorDirty}
      permitRouteExit={() => {
        bypassRouteGuard.current = true
      }}
    >
      {loadError && (
        <div className="admin-warning">
          <strong>Não foi possível carregar as seções.</strong> {loadError}. Confira a conexão e as
          permissões do Supabase antes de editar conteúdo.
        </div>
      )}
      {screens[active]}
      <AdminConfirmationHost />
    </AdminShell>
  )
}

function PortfolioPreviewPane() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  return (
    <div className="embedded-preview site-editor-responsive-preview">
      <AdminHeader
        title="Pré-visualização"
        subtitle="Rascunhos visíveis somente em sessão administrativa"
      />
      <div
        className="site-editor-preview-controls"
        role="group"
        aria-label="Visualizar em dispositivo"
      >
        <button
          type="button"
          className={device === "desktop" ? "active" : ""}
          aria-pressed={device === "desktop"}
          onClick={() => setDevice("desktop")}
        >
          Desktop
        </button>
        <button
          type="button"
          className={device === "mobile" ? "active" : ""}
          aria-pressed={device === "mobile"}
          onClick={() => setDevice("mobile")}
        >
          Mobile
        </button>
      </div>
      <div className={`site-editor-preview-frame ${device}`}>
        <iframe key={device} title={`Prévia ${device} do portfólio`} src="/admin/preview" />
      </div>
      <small>
        A prévia mobile utiliza proporção de 390 × 844 px; não substitui testes em dispositivos
        reais.
      </small>
    </div>
  )
}

export function AdminPreview() {
  const guard = useAdminGuard()
  if (guard === "loading") return <div className="admin-loading">Abrindo prévia…</div>
  if (guard === "denied") return <Navigate to="/admin/login" replace />
  const formationPilot = new URLSearchParams(window.location.search).get("formationPilot") === "1"
  return <PublicSite preview formationPilot={formationPilot} />
}
