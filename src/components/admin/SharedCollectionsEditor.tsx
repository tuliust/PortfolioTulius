import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { type CollectionSource } from "../../lib/collections"
import {
  activeAcervoSources,
  acervoUsageLabel,
  discoverAcervoUsages,
  type AcervoBlockRef,
  type AcervoSectionRef,
  type AcervoUsage,
} from "../../lib/shared-acervo"
import { CollectionsStudio } from "./AdminModules"
import { AdminNotice } from "./AdminNotice"
import "./SharedCollectionsEditor.css"

/** Standalone shared-data source editor. Section-specific records stay in Editor do Site. */
export function SharedCollectionsEditor({
  requestedSource,
  onDirtyChange,
}: {
  requestedSource?: string
  onDirtyChange?: (dirty: boolean) => void
}) {
  const [links, setLinks] = useState<AcervoUsage[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function loadLinks() {
      if (!supabase) {
        if (!cancelled) {
          setStatus("error")
          setError("Supabase indisponível; não é possível consultar os vínculos do acervo.")
        }
        return
      }
      const [blocks, sections] = await Promise.all([
        supabase
          .from("content_blocks")
          .select("id,section_id,mobile_panel,status,content_json"),
        supabase
          .from("sections")
          .select("id,slug,title,status,is_visible"),
      ])
      if (cancelled) return
      if (blocks.error || sections.error) {
        setStatus("error")
        setError(
          "Não foi possível verificar os vínculos: " +
            (blocks.error?.message ?? sections.error?.message),
        )
        return
      }
      setLinks(
        discoverAcervoUsages(
          (blocks.data ?? []) as AcervoBlockRef[],
          (sections.data ?? []) as AcervoSectionRef[],
        ),
      )
      setStatus("ready")
    }
    void loadLinks()
    return () => {
      cancelled = true
    }
  }, [])

  const sources = activeAcervoSources(links)
  const initialSource: CollectionSource | undefined =
    sources.find((source) => source === requestedSource) ?? sources[0]

  return (
    <div className="shared-acervo">
      <header className="admin-header">
        <div>
          <p>Fontes compartilhadas</p>
          <h1>Acervo Estruturado</h1>
          <span>Edite registros utilizados por blocos publicados, com origem identificada.</span>
        </div>
      </header>
      <section className="admin-card shared-acervo-explanation">
        <strong>O que aparece neste acervo?</strong>
        <p>
          Somente coleções vinculadas explicitamente a conteúdos publicados. Conteúdos próprios
          de cada seção e trajetórias de Experiências Profissionais continuam no Editor do Site.
          Nenhum registro ou tabela foi excluído.
        </p>
        {status === "ready" && (
          <div className="shared-acervo-usage-list">
            {sources.map((source) => {
              const usages = links.filter((usage) => usage.source === source && usage.published)
              return (
                <div key={source} className="shared-acervo-usage-summary">
                  <strong>{source === "testimonials" ? "Depoimentos" : source.replace(/_/g, " ")}</strong>
                  <span>
                    Utilizado em: {[...new Set(usages.map(acervoUsageLabel))].join(" · ")}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>
      {status === "loading" && <p role="status">Verificando vínculos do acervo…</p>}
      {status === "error" && <AdminNotice message={error} />}
      {status === "ready" && !initialSource && (
        <section className="admin-card">
          <p>Não há coleções compartilhadas vinculadas a blocos publicados atualmente.</p>
          <small>
            A configuração de vínculo é feita no conteúdo da seção. Os registros existentes
            permanecem preservados no banco de dados.
          </small>
        </section>
      )}
      {status === "ready" && initialSource && (
        <CollectionsStudio
          key={initialSource}
          initialSource={initialSource}
          availableSources={sources}
          usageLinks={links}
          embedded
          onDirtyChange={onDirtyChange}
        />
      )}
    </div>
  )
}
