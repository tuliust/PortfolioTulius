import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import {
  isRestorableEntity,
  prepareContentRestoration,
  type RestorableEntity,
} from "../../lib/revision-restore"
import { adminConfirm } from "./AdminConfirmationHost"
import { AdminNotice } from "./AdminNotice"

/** Editorial issues and revision previews remain in the original CMS schema. */
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
          <AdminNotice message={message} />
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
              <div key={revision.id} data-revision-id={revision.id}>
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
