import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8")
describe("Editor do Site — depoimentos na própria seção", () => {
  const app = read("components/admin/AdminApp.tsx")
  const modules = read("components/admin/AdminModules.tsx")
  const visuals = read("lib/admin-visual-areas.ts")
  const identity = read("components/admin/IdentityCatalogEditor.css")
  const publicSite = read("components/public/PublicSite.tsx")
  it("remove o Acervo do menu sem excluir dados ou duplicar formulários", () => {
    expect(app).not.toContain('["acervo", "Acervo Estruturado", "edit"]')
    expect(app).not.toContain("<SharedCollectionsEditor")
    expect(app).toContain('selected.slug === "depoimentos"')
    expect(app).toContain("<CollectionsStudio")
    expect(app).toContain('initialSource="testimonials"')
    expect(app).toContain('availableSources={["testimonials"]}')
    expect(app).toContain("setTestimonialsDirty")
    expect(modules).not.toContain("Editar no Acervo")
    expect(modules).toContain("buildCollectionSavePayload(draft, config.table)")
    expect(modules).toContain("registerAdminSaveAction(save, () => recordDirty)")
  })
  it("expõe as três áreas sem criar terceiro content_blocks", () => {
    expect(visuals).toContain('slug === "sobre"')
    expect(visuals).toContain('slug === "resultados"')
    expect(visuals).toContain('"vale"')
    expect(modules).toContain('aria-label="Áreas visuais no desktop"')
    expect(modules).toContain("selectVisualArea(area)")
    expect(modules).toContain('setAboutImageTarget("desktop")')
    expect(publicSite).toContain(
      "const customDesktopImage = introductoryItem?.aboutDesktopImage?.trim()",
    )
  })
  it("iguala os labels de Identidade aos outros formulários", () => {
    expect(identity).toContain(".identity-catalog label")
    expect(identity).toContain("font-weight: 600")
    expect(identity).toContain("font-size: 0.8rem")
  })
})
