import { useEffect, useRef, useState } from "react"
import { Link, Navigate, useBlocker, useNavigate } from "react-router"
import { isAdmin, supabase } from "../../lib/supabase"
import { PublicSite } from "../public/PublicSite"
import {
  buildAdminSectionNavigation,
  isExperienceSection,
} from "../../lib/admin-experience-navigation"
import { Icon } from "../ui/Icons"
import { editorAnchorError, normalizeEditorAnchor } from "../../lib/editor-anchor"
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
}: {
  sections: SectionRow[]
  reload: () => void
  selectedSectionId?: string
  embedded?: boolean
  onDirtyChange?: (dirty: boolean) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedSectionId ?? sections[0]?.id ?? null,
  )
  const selected = sections.find((s) => s.id === selectedId)
  const [draft, setDraft] = useState<SectionRow | null>(selected ?? null)
  const [message, setMessage] = useState("")
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
    if (!(draft.slug === "perfil" ? draft.editor_title?.trim() : draft.title.trim())) {
      setMessage("O título da seção é obrigatório.")
      return false
    }
    const anchor = normalizeEditorAnchor(draft.editor_anchor ?? draft.slug)
    if (draft.slug === "perfil") {
      const warning = editorAnchorError(
        anchor,
        draft.slug,
        sections.filter((entry) => entry.id !== draft.id).flatMap((entry) => [
          entry.slug,
          entry.editor_anchor ?? entry.slug,
        ]),
      )
      if (warning) {
        setMessage(warning)
        return false
      }
    }
    const allowed = ["none", "fade-in", "fade-up", "stagger", "image-reveal", "metric-count"]
    if (!allowed.includes(draft.animation_preset)) {
      setMessage("Selecione uma transição válida.")
      return false
    }
    setMessage("Salvando…")
    const { data, error } = await supabase
      .from("sections")
      .update(
        draft.slug === "perfil"
          ? { animation_preset: draft.animation_preset }
          : {
              title: draft.title.trim(),
              intro: draft.intro,
              eyebrow: draft.eyebrow,
              animation_preset: draft.animation_preset,
            },
      )
      .eq("id", draft.id)
      .select("id,title,animation_preset")
      .single()
    if (
      error ||
      !data ||
      (draft.slug !== "perfil" && data.title !== draft.title.trim()) ||
      data.animation_preset !== draft.animation_preset
    ) {
      setMessage(error?.message ?? "Não foi possível confirmar o salvamento da seção.")
      return false
    }
    if (
      draft.slug === "perfil" &&
      (draft.editor_title?.trim() !== selected?.editor_title?.trim() ||
        anchor !== (selected?.editor_anchor ?? selected?.slug))
    ) {
      if (!draft.editor_block_id) {
        setMessage("Bloco esquerdo do Hero não encontrado para guardar os dados da seção.")
        return false
      }
      // The canonical slug remains "perfil" because public components and
      // existing navigation depend on it. An edited anchor is an extra alias.
      const latest = await supabase
        .from("content_blocks")
        .select("content_json")
        .eq("id", draft.editor_block_id)
        .single()
      if (latest.error || !latest.data) {
        setMessage(latest.error?.message ?? "Não foi possível ler os dados da seção.")
        return false
      }
      const desired = draft.editor_title?.trim() || "Hero"
      const updatedJson = {
        ...(latest.data.content_json ?? {}),
        editorTitle: desired,
        editorAnchor: anchor,
      }
      const written = await supabase
        .from("content_blocks")
        .update({ content_json: updatedJson })
        .eq("id", draft.editor_block_id)
        .select("content_json")
        .single()
      if (
        written.error ||
        written.data?.content_json?.editorTitle !== desired ||
        written.data?.content_json?.editorAnchor !== anchor
      ) {
        setMessage(written.error?.message ?? "Não foi possível confirmar a âncora da seção.")
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
                <h2>{draft.slug === "perfil" ? draft.editor_title || "Hero" : draft.title}</h2>
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
            <div className="field-grid">
              <label>
                {draft.slug === "perfil" ? "Título da seção (nome no CMS)" : "Título"}
                <input
                  value={draft.slug === "perfil" ? (draft.editor_title ?? "Hero") : draft.title}
                  onChange={(e) =>
                    setDraft(
                      draft.slug === "perfil"
                        ? { ...draft, editor_title: e.target.value }
                        : { ...draft, title: e.target.value },
                    )
                  }
                />
              </label>
              <label>
                Âncora
                <input
                  value={draft.slug === "perfil" ? draft.editor_anchor ?? draft.slug : draft.slug}
                  disabled={draft.slug !== "perfil"}
                  maxLength={64}
                  spellCheck={false}
                  aria-describedby={draft.slug === "perfil" ? "hero-anchor-help" : undefined}
                  onChange={(event) =>
                    setDraft({ ...draft, editor_anchor: event.target.value })
                  }
                />
                {draft.slug === "perfil" && (
                  <small id="hero-anchor-help">
                    A âncora pública pode ser editada. O identificador interno #perfil e os links
                    existentes continuam funcionando.
                  </small>
                )}
              </label>
              {draft.slug !== "perfil" && (
                <>
                  <label className="field-wide">
                    Linha editorial
                    <input
                      value={draft.eyebrow ?? ""}
                      onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
                    />
                  </label>
                  <label className="field-wide">
                    Introdução
                    <textarea
                      rows={4}
                      value={draft.intro ?? ""}
                      onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
                    />
                  </label>
                </>
              )}
              <label>
                <span className="admin-field-label">
                  Transições
                  <AdminInfoTip
                    label="Transições"
                    description="Escolha um efeito de entrada compatível com os presets publicados no Supabase. Movimentos internos das composições especiais continuam independentes."
                  />
                </span>
                <select
                  value={draft.animation_preset}
                  onChange={(event) => setDraft({ ...draft, animation_preset: event.target.value })}
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
            <AdminNotice message={message} />
            <div className="form-actions">
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
  const [heroMode, setHeroMode] = useState<"section" | "left" | "right">("section")
  const [sectionInfoDirty, setSectionInfoDirty] = useState(false)
  const [contentDirty, setContentDirty] = useState(false)
  const [testimonialsDirty, setTestimonialsDirty] = useState(false)
  useEffect(() => {
    onDirtyChange(sectionInfoDirty || contentDirty || testimonialsDirty)
  }, [sectionInfoDirty, contentDirty, testimonialsDirty, onDirtyChange])
  const [lastExperienceId, setLastExperienceId] = useState("")
  const selected = sections.find((item) => item.id === selectedId)
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
    setHeroMode("section")
    setSelectedId(id)
    if (sections.some((section) => section.id === id && isExperienceSection(section.slug))) {
      setLastExperienceId(id)
    }
  }

  async function chooseHeroMode(next: "section" | "left" | "right") {
    if (next === heroMode || !(await canLeave())) return
    onDirtyChange(false)
    setSectionInfoDirty(false)
    setContentDirty(false)
    setTestimonialsDirty(false)
    setHeroMode(next)
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
                    {entry.section.slug === "perfil"
                      ? entry.section.editor_title || "Hero"
                      : entry.section.title}
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
                      : `SEÇÃO ${String(selected.sort_order).padStart(2, "0")} · #${selected.slug === "perfil" ? selected.editor_anchor ?? selected.slug : selected.slug}`}
                  </p>
                  <h2>
                    {selectedIsExperience
                      ? "Experiências Profissionais"
                      : selected.slug === "perfil"
                        ? selected.editor_title || "Hero"
                        : selected.title}
                  </h2>
                  <span>
                    {selectedIsExperience
                      ? "Escolha abaixo o trabalho que deseja editar."
                      : sectionPublicationLabel(selected)}
                  </span>
                </div>
              </div>
              {selected.slug === "perfil" && (
                <nav className="hero-editor-tabs" role="tablist" aria-label="Áreas de edição do Hero">
                  {([
                    ["section", "Seção", "Configurações gerais"],
                    ["left", "Esquerda", "Elementos da área esquerda"],
                    ["right", "Direita", "Elementos da área direita"],
                  ] as const).map(([value, label, description]) => (
                    <button
                      type="button"
                      role="tab"
                      key={value}
                      className={heroMode === value ? "active" : ""}
                      aria-selected={heroMode === value}
                      aria-controls="hero-editor-active-panel"
                      onClick={() => void chooseHeroMode(value)}
                    >
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </button>
                  ))}
                </nav>
              )}
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
                  id={selected.slug === "perfil" ? "hero-editor-active-panel" : undefined}
                  role={selected.slug === "perfil" ? "tabpanel" : undefined}
                  aria-label={selected.slug === "perfil" ? (
                    heroMode === "section" ? "Seção" : heroMode === "left" ? "Esquerda" : "Direita"
                  ) : undefined}
                >
                  {(selected.slug !== "perfil" || heroMode === "section") && (
                    <>
                      <div className="site-editor-consolidated-heading" id="site-editor-section-details">
                        <h3>Informações da seção</h3>
                        <p>Título, âncora, transição e publicação.</p>
                      </div>
                      <SectionsEditor
                        key={selected.id + "-details"}
                        sections={sections}
                        reload={reload}
                        selectedSectionId={selected.id}
                        embedded
                        onDirtyChange={setSectionInfoDirty}
                      />
                    </>
                  )}
                  {(selected.slug !== "perfil" || heroMode !== "section") && (
                    <>
                      <div className="site-editor-consolidated-heading">
                        <h3>{selected.slug === "perfil" ? (
                          heroMode === "left" ? "Esquerda" : "Direita"
                        ) : "Conteúdo"}</h3>
                        <p>{selected.slug === "perfil"
                          ? "Edite os elementos da área selecionada."
                          : "Textos, imagens e itens da seção."}</p>
                      </div>
                      {selected.slug === "depoimentos" && (
                        <section aria-label="Gerenciar depoimentos" className="site-editor-testimonials">
                          <div className="site-editor-consolidated-heading">
                            <h3>Gerenciar depoimentos</h3>
                            <p>
                              Edite pessoas, cargos, textos, ordem e publicação nesta seção. Os
                              registros são utilizados pelos dois painéis do site.
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
                      <ContentStudio
                        key={selected.id + "-content-" + heroMode}
                        sections={sections}
                        sectionIdOverride={selected.id}
                        heroArea={selected.slug === "perfil" && heroMode !== "section" ? heroMode : undefined}
                        embedded
                        onDirtyChange={setContentDirty}
                        onSaved={reload}
                      />
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
        // The CMS title is stored separately from the published hero name.
        // A read failure leaves the familiar default label and never changes public data.
        let next: SectionRow[] = data ?? []
        if (!error) {
          const profile = next.find((entry) => entry.slug === "perfil")
          if (profile) {
            const read = await supabase
              ?.from("content_blocks")
              .select("id,content_json")
              .eq("section_id", profile.id)
              .eq("mobile_panel", "a")
              .order("sort_order")
              .limit(1)
            const left = read?.data?.[0]
            next = next.map((entry) =>
              entry.id !== profile.id
                ? entry
                : {
                    ...entry,
                    editor_title:
                      typeof left?.content_json?.editorTitle === "string" &&
                      left.content_json.editorTitle.trim()
                        ? left.content_json.editorTitle
                        : "Hero",
                    editor_anchor:
                      typeof left?.content_json?.editorAnchor === "string" &&
                      left.content_json.editorAnchor.trim()
                        ? left.content_json.editorAnchor
                        : profile.slug,
                    editor_block_id: left?.id,
                  },
            )
          }
          setSections(next)
        }
        setLoadError(error?.message ?? "")
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
