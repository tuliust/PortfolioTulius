import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8")

describe("Etapa 4 — Acervo Estruturado separado do Editor do Site", () => {
  const app = read("components/admin/AdminApp.tsx")
  const shared = read("components/admin/SharedCollectionsEditor.tsx")
  const modules = read("components/admin/AdminModules.tsx")
  const references = read("lib/shared-acervo.ts")

  it("abre o Acervo no menu principal sem aba ou editor duplicado dentro da seção", () => {
    expect(app).toContain('["acervo", "Acervo Estruturado", "edit"]')
    expect(app).toContain("<SharedCollectionsEditor")
    expect(app).not.toContain('type SiteEditorPane = "edit" | "records"')
    expect(app).not.toContain('pane === "records"')
    expect(app).not.toContain("<CollectionsStudio")
    expect(app).toContain('onOpenCollection={(source) => {')
  })

  it("mostra somente fontes efetivamente vinculadas e nunca as nove tabelas por padrão", () => {
    expect(shared).toContain("discoverAcervoUsages")
    expect(shared).toContain("activeAcervoSources")
    expect(shared).toContain('status === "ready" && initialSource')
    expect(shared).toContain("availableSources={sources}")
    expect(modules).toContain("availableSources.includes(item.table as CollectionSource)")
    expect(modules).toContain("visibleConfigs.map")
    expect(references).toContain("content_json?.source_collection")
  })

  it("indica o painel onde cada registro é usado e preserva trajetória em Experiências", () => {
    expect(modules).toContain("usagesForAcervoRecord(")
    expect(modules).toContain("Utilizado em: ")
    expect(modules).toContain("<InlineCareerTrajectoryEditor")
    expect(shared).toContain("trajetórias de Experiências Profissionais continuam no Editor do Site")
    expect(references).toContain('section.status === "published"')
  })

  it("preserva persistência e aviso de alterações pendentes do acervo", () => {
    expect(modules).toContain("buildCollectionSavePayload(draft, config.table)")
    expect(modules).toContain("Registro salvo e recuperado do Supabase.")
    expect(modules).toContain("registerAdminSaveAction(save, () => recordDirty)")
    expect(app).toContain('void selectModule("acervo", source)')
  })
})
