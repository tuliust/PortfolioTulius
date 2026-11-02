import { FormEvent, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { defaultTokens } from "../../content/fallback"
import { isCollectionSource } from "../../lib/collections"
import { isAdmin, isSupabaseConfigured, supabase } from "../../lib/supabase"
import { PublicSite } from "../public/PublicSite"
import {
  buildAdminSectionNavigation,
  isExperienceSection,
} from "../../lib/admin-experience-navigation"
import { Icon } from "../ui/Icons"
import { AdminNotice, statusPt } from "./AdminNotice"
import { adminConfirm, AdminConfirmationHost } from "./AdminConfirmationHost"
import { FloatingSaveButton } from "./FloatingSaveButton"
import {
  CollectionsStudio,
  ContentStudio,
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

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return setMessage("Configure as variáveis públicas do Supabase.")
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage(error.message)
      setBusy(false)
      return
    }
    if (!(await isAdmin())) {
      await supabase.auth.signOut()
      setMessage("Esta conta não possui autorização administrativa.")
      setBusy(false)
      return
    }
    navigate("/admin")
  }

  return (
    <main className="login-page">
      <Link to="/" className="admin-back">
        ← Voltar ao site
      </Link>
      <form className="login-card" onSubmit={submit}>
        <div className="admin-mark">TT</div>
        <p>Área administrativa</p>
        <h1>Conteúdo em boas mãos.</h1>
        <label>
          E-mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {message && (
          <div className="form-message" role="alert">
            {message}
          </div>
        )}
        <button className="primary-button" disabled={busy || !isSupabaseConfigured}>
          {busy ? "Entrando…" : "Entrar com segurança"}
        </button>
        <small>
          O acesso exige uma conta no Supabase Auth vinculada à tabela protegida de administradores.
        </small>
      </form>
    </main>
  )
}

function AdminShell({
  children,
  active,
  setActive,
  editorDirty,
}: {
  children: React.ReactNode
  active: string
  setActive: (value: string) => void
  editorDirty: boolean
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
    if (!(await adminConfirm(question, { title: "Sair do painel", confirmLabel: "Sair" }))) return
    await supabase?.auth.signOut()
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
              !(await adminConfirm(
                "Existem alterações não salvas. Deseja descartá-las e voltar ao site?",
                { title: "Descartar alterações?" },
              ))
            )
              return
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
          <small>{sections.length - published} aguardando publicação</small>
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
          <span className="status-chip">Rascunho seguro</span>
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
              <strong>Conteúdo do PDF</strong>
              <p>Textos, métricas e depoimentos sem duplicações gráficas.</p>
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
            <span className="check">!</span>
            <div>
              <strong>Revisão editorial</strong>
              <p>Cargos, idiomas e indicadores divergentes aguardam decisão.</p>
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
  onSelectSection,
  onDirtyChange,
}: {
  sections: SectionRow[]
  reload: () => void
  selectedSectionId?: string
  embedded?: boolean
  onSelectSection?: (id: string) => void
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
  const fixedLayouts: Record<string, string> = {
    perfil: "hero",
    sobre: "editorial",
    resultados: "metrics",
    "invest-rs": "timeline",
    "prefeitura-sp": "timeline",
    vale: "timeline",
    "globo-sportv": "timeline",
    inpress: "timeline",
    cdi: "timeline",
    depoimentos: "quotes",
    contato: "contact",
  }
  useEffect(() => setDraft(selected ?? null), [selectedId, selected])
  useEffect(() => {
    onDirtyChange?.(sectionDirty)
  }, [sectionDirty, onDirtyChange])
  useEffect(() => {
    if (!selectedId && sections[0]) setSelectedId(sections[0].id)
  }, [sections, selectedId])

  async function save() {
    if (!draft || !supabase) return
    if (draft.status === "archived" && selected?.status !== "archived") {
      setMessage("Para arquivar uma seção use o botão Arquivar.")
      return
    }
    if (draft.status === "published" && selected?.status !== "published") {
      setMessage("Para publicar uma seção use o botão Publicar seção.")
      return
    }
    setMessage("Salvando…")
    const { error } = await supabase
      .from("sections")
      .update({
        title: draft.title,
        intro: draft.intro,
        eyebrow: draft.eyebrow,
        status: draft.status,
        is_visible: draft.is_visible,
        theme: draft.theme,
        layout_variant: draft.layout_variant,
        animation_preset: draft.animation_preset,
      })
      .eq("id", draft.id)
      .select("id")
      .single()
    setMessage(error ? error.message : "Alterações salvas.")
    if (!error) reload()
  }
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
  async function duplicate() {
    if (!selected || !supabase) return
    if (
      draft &&
      JSON.stringify(draft) !== JSON.stringify(selected) &&
      !(await adminConfirm("Alterações desta seção ainda não foram salvas. Descartar e duplicar?", {
        title: "Descartar alterações?",
      }))
    )
      return
    const { data, error } = await supabase.rpc("duplicate_section", {
      source_section: selected.id,
    })
    setMessage(error ? error.message : "Seção duplicada como rascunho.")
    if (data) {
      reload()
      setSelectedId(data)
      onSelectSection?.(data)
    }
  }
  async function create() {
    if (!supabase || !sections[0]) return
    if (
      draft &&
      selected &&
      JSON.stringify(draft) !== JSON.stringify(selected) &&
      !(await adminConfirm(
        "Alterações desta seção ainda não foram salvas. Descartar e criar outra?",
        { title: "Descartar alterações?" },
      ))
    )
      return
    setMessage("Criando seção e painéis…")
    const { data, error } = await supabase.rpc("create_section_with_panels", {
      p_page_id: sections[0].page_id,
    })
    setMessage(error?.message ?? "Seção e painéis criados como rascunho.")
    if (!error && data) {
      reload()
      setSelectedId(data)
      onSelectSection?.(data)
    }
  }

  async function publish() {
    if (!selected || !supabase) return
    if (
      !(await adminConfirm(`Publicar “${selected.title}” e seus blocos?`, {
        title: "Publicar seção",
        confirmLabel: "Publicar",
      }))
    )
      return
    // Publication validates editorial placeholders; Save must never bypass this RPC.
    setMessage("Publicando seção…")
    const { error } = await supabase.rpc("publish_section", {
      section_to_publish: selected.id,
      allow_placeholders: false,
    })
    setMessage(error?.message ?? "Seção e blocos publicados.")
    if (!error) reload()
  }
  async function remove() {
    if (!selected || !supabase) return
    if (
      !(await adminConfirm(`Arquivar “${selected.title}”?`, {
        title: "Arquivar seção",
        confirmLabel: "Arquivar",
        tone: "danger",
      }))
    )
      return
    const { error } = await supabase
      .from("sections")
      .update({ status: "archived", is_visible: false })
      .eq("id", selected.id)
      .select("id")
      .single()
    setMessage(error ? error.message : "Seção arquivada.")
    if (!error) reload()
  }
  return (
    <>
      {!embedded && (
        <AdminHeader
          title="Seções"
          subtitle="Ordem, visibilidade, conteúdo e apresentação"
          action={
            <div className="header-actions">
              <button className="secondary-button" onClick={create}>
                Nova seção
              </button>
              <button className="primary-button" onClick={duplicate}>
                Duplicar seção
              </button>
            </div>
          }
        />
      )}
      {embedded && (
        <div className="site-editor-actions">
          <button className="secondary-button" onClick={create}>
            Nova seção
          </button>
          <button className="secondary-button" onClick={duplicate}>
            Duplicar seção
          </button>
        </div>
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
                  <small>{statusPt(section.status)}</small>
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
                <h2>{draft.title}</h2>
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
                Título
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </label>
              <label>
                Âncora
                <input value={draft.slug} disabled title="Âncoras publicadas são estáveis" />
              </label>
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
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                >
                  <option value="draft">Rascunho</option>
                  <option value="in_review">Em revisão</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </label>
              <label>
                Tema
                <select
                  value={draft.theme}
                  onChange={(e) => setDraft({ ...draft, theme: e.target.value })}
                >
                  <option value="paper">Papel</option>
                  <option value="cream">Creme</option>
                  <option value="ink">Grafite</option>
                  <option value="orange">Laranja</option>
                </select>
              </label>
              <label>
                Layout
                <select
                  value={draft.layout_variant}
                  disabled={Boolean(fixedLayouts[draft.slug])}
                  onChange={(e) => setDraft({ ...draft, layout_variant: e.target.value })}
                >
                  <option value="hero">Abertura especial</option>
                  <option value="editorial">Editorial</option>
                  <option value="metrics">Métricas</option>
                  <option value="timeline">Timeline</option>
                  <option value="quotes">Depoimentos</option>
                  <option value="contact">Contato</option>
                </select>
                {fixedLayouts[draft.slug] && (
                  <small>
                    Composição exclusiva desta seção. O layout é fixo para preservar o design
                    aprovado.
                  </small>
                )}
              </label>
              <label>
                Animação
                <select
                  disabled={Boolean(fixedLayouts[draft.slug])}
                  value={draft.animation_preset}
                  onChange={(e) => setDraft({ ...draft, animation_preset: e.target.value })}
                >
                  <option value="none">Sem animação</option>
                  <option value="fade-in">Fade</option>
                  <option value="fade-up">Fade vertical</option>
                  <option value="stagger">Cards em sequência</option>
                  <option value="image-reveal">Reveal de imagem</option>
                  <option value="metric-count">Métricas</option>
                </select>
                {fixedLayouts[draft.slug] && (
                  <small>
                    Movimentos desta composição são definidos pelo design editorial; esta opção não
                    altera seus componentes especiais.
                  </small>
                )}
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={draft.is_visible}
                  onChange={(e) => setDraft({ ...draft, is_visible: e.target.checked })}
                />{" "}
                Exibir no site
              </label>
            </div>
            <AdminNotice message={message} />
            <div className="form-actions">
              <button className="danger-button" onClick={remove}>
                Arquivar
              </button>
              <button className="secondary-button" onClick={publish}>
                Publicar seção
              </button>
              <FloatingSaveButton enabled={sectionDirty} onClick={save} />
            </div>
          </section>
        )}
      </div>
    </>
  )
}

type SiteEditorPane = "content" | "details" | "records" | "preview"

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
  const [pane, setPane] = useState<SiteEditorPane>("content")
  const [collectionSource, setCollectionSource] = useState("career_experiences")
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop")
  const [linkedSources, setLinkedSources] = useState<string[]>([])
  const [lastExperienceId, setLastExperienceId] = useState("")
  const selected = sections.find((item) => item.id === selectedId)
  const navigationEntries = buildAdminSectionNavigation(sections)
  const experienceSections = sections.filter((section) => isExperienceSection(section.slug))
  const selectedIsExperience = Boolean(selected && isExperienceSection(selected.slug))
  useEffect(() => {
    let cancelled = false
    setLinkedSources([])
    if (!supabase || !selectedId) return
    void supabase
      .from("content_blocks")
      .select("content_json")
      .eq("section_id", selectedId)
      .then(({ data }) => {
        if (cancelled) return
        const sources = (data ?? [])
          .map((row) => row.content_json?.source_collection)
          .filter(isCollectionSource)
        setLinkedSources([...new Set(sources)])
      })
    return () => {
      cancelled = true
    }
  }, [selectedId])

  useEffect(() => {
    if (!selectedId && sections[0]) setSelectedId(sections[0].id)
  }, [selectedId, sections])

  async function canLeave() {
    return (
      !dirty ||
      (await adminConfirm("Existem alterações não salvas. Deseja descartá-las e continuar?", {
        title: "Descartar alterações?",
      }))
    )
  }

  async function selectSection(id: string) {
    if (id === selectedId || !(await canLeave())) return
    onDirtyChange(false)
    setSelectedId(id)
    if (sections.some((section) => section.id === id && isExperienceSection(section.slug))) {
      setLastExperienceId(id)
    }
    setPane("content")
  }

  function selectExperienceGroup() {
    if (selectedIsExperience) return
    const next =
      experienceSections.find((section) => section.id === lastExperienceId) ?? experienceSections[0]
    if (next) selectSection(next.id)
  }

  async function selectPane(next: SiteEditorPane) {
    if (next === pane || !(await canLeave())) return
    onDirtyChange(false)
    setPane(next)
  }

  async function editLinkedCollection(source: string) {
    if (!(await canLeave())) return
    onDirtyChange(false)
    setCollectionSource(source)
    setPane("records")
  }

  async function switchCollection(source: string) {
    if (source === collectionSource || !(await canLeave())) return
    onDirtyChange(false)
    setCollectionSource(source)
  }

  // Creation/duplication already confirms unsaved edits before the RPC.
  function selectCreatedSection(id: string) {
    onDirtyChange(false)
    setSelectedId(id)
    if (sections.some((section) => section.id === id && isExperienceSection(section.slug))) {
      setLastExperienceId(id)
    }
    setPane("content")
  }

  const panes: { id: SiteEditorPane; title: string }[] = [
    { id: "content", title: "Conteúdo e painéis" },
    { id: "details", title: "Informações da seção" },
    { id: "records", title: "Acervo estruturado" },
    { id: "preview", title: "Prévia" },
  ]

  return (
    <>
      <AdminHeader
        title="Editor do site"
        subtitle="Seções, conteúdo e coleções em um único fluxo de trabalho"
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
                  <small>{entry.sections.length} trabalhos para editar</small>
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
                  <strong>{entry.section.title}</strong>
                  <small>
                    {statusPt(entry.section.status)}
                    {!entry.section.is_visible ? " · Oculta no site" : ""}
                  </small>
                </div>
              </button>
            ),
          )}
        </nav>
        <div className="site-editor-main">
          {selected ? (
            <>
              <div className="site-editor-heading">
                <p>
                  {selectedIsExperience
                    ? `GRUPO EDITORIAL · ${experienceSections.length} TRABALHOS`
                    : `SEÇÃO ${String(selected.sort_order).padStart(2, "0")} · #${selected.slug}`}
                </p>
                <h2>{selectedIsExperience ? "Experiências Profissionais" : selected.title}</h2>
                <span>
                  {selectedIsExperience
                    ? "Escolha abaixo o trabalho que deseja editar."
                    : `${selected.is_visible ? "Exibida no site" : "Não exibida no site"} · ${statusPt(selected.status)}`}
                </span>
              </div>
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
                          {statusPt(experience.status)}
                          {!experience.is_visible ? " · Oculta no site" : ""}
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
              <div className="site-editor-tabs" role="tablist" aria-label="Edição da seção">
                {panes.map((item) => (
                  <button
                    type="button"
                    role="tab"
                    key={item.id}
                    aria-selected={pane === item.id}
                    className={pane === item.id ? "active" : ""}
                    onClick={() => selectPane(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <div className="site-editor-body">
                {dirty && (
                  <p className="site-editor-unsaved" role="status">
                    Alterações não salvas nesta área.
                  </p>
                )}
                {pane === "content" && (
                  <ContentStudio
                    key={selected.id}
                    sections={sections}
                    sectionIdOverride={selected.id}
                    embedded
                    onDirtyChange={onDirtyChange}
                    onEditCollection={editLinkedCollection}
                  />
                )}
                {pane === "details" && (
                  <SectionsEditor
                    key={selected.id}
                    sections={sections}
                    reload={reload}
                    selectedSectionId={selected.id}
                    embedded
                    onSelectSection={selectCreatedSection}
                    onDirtyChange={onDirtyChange}
                  />
                )}
                {pane === "records" && (
                  <>
                    <p className="site-editor-note">
                      O acervo é compartilhado entre seções. Um registro só altera o conteúdo
                      público desta seção quando um bloco aponta explicitamente para a coleção;
                      editar um registro não cria esse vínculo automaticamente.
                    </p>
                    {linkedSources.length > 0 && (
                      <div className="site-editor-contextual-sources">
                        <strong>Fontes vinculadas aos blocos desta seção</strong>
                        <div>
                          {linkedSources.map((source) => (
                            <button
                              type="button"
                              key={source}
                              className={source === collectionSource ? "active" : ""}
                              onClick={() => switchCollection(source)}
                            >
                              {source.replace(/_/g, " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <CollectionsStudio
                      key={collectionSource}
                      initialSource={collectionSource}
                      sectionId={selected.id}
                      linkedSources={linkedSources}
                      embedded
                      onDirtyChange={onDirtyChange}
                    />
                  </>
                )}
                {pane === "preview" && (
                  <div className="embedded-preview site-editor-responsive-preview">
                    <p className="site-editor-note">
                      Prévia protegida dos dados já salvos. Alterações abertas nos formulários
                      aparecem somente depois de gravadas.
                    </p>
                    <div
                      className="site-editor-preview-controls"
                      role="group"
                      aria-label="Visualizar em dispositivo"
                    >
                      <button
                        type="button"
                        className={previewDevice === "desktop" ? "active" : ""}
                        aria-pressed={previewDevice === "desktop"}
                        onClick={() => setPreviewDevice("desktop")}
                      >
                        Desktop
                      </button>
                      <button
                        type="button"
                        className={previewDevice === "mobile" ? "active" : ""}
                        aria-pressed={previewDevice === "mobile"}
                        onClick={() => setPreviewDevice("mobile")}
                      >
                        Mobile
                      </button>
                    </div>
                    <div className={`site-editor-preview-frame ${previewDevice}`}>
                      <iframe
                        key={selected.slug}
                        title={`Prévia ${previewDevice} da seção ${selected.title}`}
                        src={`/admin/preview#${selected.slug}`}
                      />
                    </div>
                    <small>
                      A simulação varia a largura da prévia; não substitui testes em dispositivos
                      reais.
                    </small>
                  </div>
                )}
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

function DesignEditor({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const [tokens, setTokens] = useState({
    orange: defaultTokens.orange,
    ink: defaultTokens.ink,
    paper: defaultTokens.paper,
    cream: defaultTokens.cream,
    muted: defaultTokens.muted,
    orangeDark: defaultTokens.orangeDark,
  })
  const [extraTokens, setExtraTokens] = useState<Record<string, string>>({
    "font.heading": "Big Shoulders Display",
    "font.body": "Inter",
    "layout.container": "1680",
    "space.section": "64",
    "radius.card": "4",
    "motion.duration": "520",
  })
  const [message, setMessage] = useState("")
  const [savedDesign, setSavedDesign] = useState("")
  const designDirty = Boolean(
    savedDesign && JSON.stringify({ tokens, extraTokens }) !== savedDesign,
  )
  useEffect(() => onDirtyChange?.(designDirty), [designDirty, onDirtyChange])
  useEffect(() => {
    supabase
      ?.from("design_tokens")
      .select("token_key,token_value")
      .then(({ data }) => {
        if (!data?.length) return
        const next = { ...tokens }
        data.forEach((item) => {
          const key = item.token_key.replace("color.", "") as keyof typeof next
          if (key in next) next[key] = item.token_value
        })
        setTokens(next)
        const nextExtra = {
          ...extraTokens,
          ...Object.fromEntries(
            data
              .filter((item) => !item.token_key.startsWith("color."))
              .map((item) => [item.token_key, item.token_value]),
          ),
        }
        setExtraTokens(nextExtra)
        setSavedDesign(JSON.stringify({ tokens: next, extraTokens: nextExtra }))
      })
  }, [])
  async function save() {
    if (!supabase) return
    setMessage("Salvando…")
    const rows = Object.entries(tokens).map(([key, value]) => ({
      token_key: `color.${key}`,
      token_value: value,
      value_type: "color",
      scope: "global",
      status: "published",
    }))
    rows.push(
      ...Object.entries(extraTokens).map(([key, value]) => ({
        token_key: key,
        token_value: value,
        value_type: key.startsWith("font.")
          ? "font"
          : key.startsWith("motion.")
            ? "motion"
            : key.startsWith("radius.")
              ? "radius"
              : key.startsWith("space.")
                ? "space"
                : "size",
        scope: "global",
        status: "published",
      })),
    )
    const { error } = await supabase.from("design_tokens").upsert(rows, { onConflict: "token_key" })
    setMessage(error ? error.message : "Tokens publicados.")
    if (!error) setSavedDesign(JSON.stringify({ tokens, extraTokens }))
  }
  return (
    <>
      <AdminHeader
        title="Identidade"
        subtitle="Tokens seguros e famílias tipográficas autorizadas"
        action={
          <FloatingSaveButton enabled={designDirty} onClick={save} label="Salvar identidade" />
        }
      />
      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p>Paleta global</p>
            <h2>Cores da marca</h2>
          </div>
        </div>
        <div className="token-grid">
          {Object.entries(tokens).map(([key, value]) => (
            <label key={key}>
              <span className="color-preview" style={{ background: value }} />
              <span>{key}</span>
              <input
                type="color"
                value={value}
                onChange={(e) => setTokens({ ...tokens, [key]: e.target.value })}
              />
              <input
                value={value}
                onChange={(e) => setTokens({ ...tokens, [key]: e.target.value })}
              />
            </label>
          ))}
        </div>
        <AdminNotice message={message} />
      </section>
      <section className="admin-card license-card">
        <p>Escala e movimento</p>
        <h2>Tokens de layout</h2>
        <div className="field-grid">
          {Object.entries(extraTokens).map(([key, value]) => (
            <label key={key}>
              {key}
              {key.startsWith("font.") ? (
                <select
                  value={value}
                  onChange={(event) =>
                    setExtraTokens({
                      ...extraTokens,
                      [key]: event.target.value,
                    })
                  }
                >
                  <option>Inter</option>
                  <option>Big Shoulders Display</option>
                </select>
              ) : (
                <input
                  type="number"
                  min="0"
                  max={key.startsWith("motion.") ? "1200" : "2000"}
                  value={value}
                  onChange={(event) =>
                    setExtraTokens({
                      ...extraTokens,
                      [key]: event.target.value,
                    })
                  }
                />
              )}
            </label>
          ))}
        </div>
      </section>
      <section className="admin-card license-card">
        <p>Tipografia</p>
        <h2>Fontes autorizadas</h2>
        <div>
          <strong>Big Shoulders Display</strong>
          <span>Google Fonts · títulos e numerais</span>
        </div>
        <div>
          <strong>Inter</strong>
          <span>Google Fonts · textos e interface</span>
        </div>
        <small>
          Neue Montreal permanece em fallback Inter até confirmação da licença web. Heading Now
          Trial não é distribuída.
        </small>
      </section>
    </>
  )
}

export function AdminApp() {
  const guard = useAdminGuard()
  const [active, setActive] = useState("dashboard")
  const [editorDirty, setEditorDirty] = useState(false)
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
      !(await adminConfirm("Existem alterações não salvas. Deseja descartá-las e sair?", {
        title: "Descartar alterações?",
      }))
    )
      return
    setEditorDirty(false)
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
      .then(({ data, error }) => {
        setSections(data ?? [])
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
    design: <DesignEditor onDirtyChange={setEditorDirty} />,
    media: <EnhancedMediaLibrary />,
    navigation: <NavigationStudio onDirtyChange={setEditorDirty} />,
    seo: <SeoStudio onDirtyChange={setEditorDirty} />,
    editorial: <EditorialStudio />,
    preview: (
      <div className="embedded-preview">
        <AdminHeader
          title="Pré-visualização"
          subtitle="Rascunhos visíveis somente em sessão administrativa"
        />
        <iframe title="Prévia do portfólio" src="/admin/preview" />
      </div>
    ),
  }
  return (
    <AdminShell active={active} setActive={selectModule} editorDirty={editorDirty}>
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

export function AdminPreview() {
  const guard = useAdminGuard()
  if (guard === "loading") return <div className="admin-loading">Abrindo prévia…</div>
  if (guard === "denied") return <Navigate to="/admin/login" replace />
  return <PublicSite preview />
}
