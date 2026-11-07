import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8")
const app = read("components/admin/AdminApp.tsx")
const modules = read("components/admin/AdminModules.tsx")
const publicSite = read("components/public/PublicSite.tsx")
const experience = read("components/public/ExperienceStack.tsx")
const css = read("index.css")
const actions = read("lib/media-library-actions.ts")
const picker = read("components/admin/PublishedMediaDialog.tsx")

describe("editorial UX and public section transitions", () => {
  it("uses info affordances and removes editable status and placeholder controls", () => {
    expect(app).toContain("admin-field-label")
    expect(app).not.toContain('label="Tema"')
    expect(app).not.toContain("Exibir no site")
    expect(app).toContain('label="Transições"')
    expect(app).toContain('<option value="metric-count">Destacar métricas</option>')
    expect(app).not.toContain("value={draft.status}")
    expect(modules).not.toContain("Contém conteúdo provisório")
    expect(modules).toContain('label="Painel a editar"')
    expect(modules).toContain("p_is_placeholder: draft.is_placeholder")
    expect(modules).toContain('p_status: draft.status === "archived" ? "archived" : "published"')
  })

  it("maps editable theme and entrance presets to public section and experience classes", () => {
    expect(publicSite).toContain("theme-${section.theme}")
    expect(experience).toContain("theme-${section.theme}")
    expect(publicSite).toContain("cms-entrance-${section.animation")
    expect(experience).toContain("cms-entrance-${section.animation")
    expect(publicSite).toContain('section.classList.add("cms-section-entered")')
    for (const name of ["fade-in", "fade-up", "slide-left", "slide-right", "zoom-in"]) {
      expect(css).toContain(".cms-entrance-" + name)
    }
    expect(css).toContain("prefers-reduced-motion: reduce")
  })

  it("publishes new media directly to the public bucket without a second action", () => {
    expect(actions).toContain("export async function uploadPublishedMedia")
    expect(actions).toContain('storage.from("portfolio-public").upload')
    expect(picker).not.toContain("Disponibilizar no site")
    expect(modules).toContain("aria-label={`Remover imagem ${mediaDisplayTitle(asset)}`}")
    expect(modules).toContain("Deseja remover a imagem?")
    expect(modules).toContain("deleteMediaAssetEverywhere")
  })

  it("simplifies site controls while preserving media metadata in the library", () => {
    const editor =
      modules
        .split("export function ContentStudio")[1]
        ?.split("function TrajectoryTextEditor")[0] ?? ""
    expect(app).toContain('className="site-editor-heading-copy"')
    expect(app).toContain("onClick={embedded ? saveRegisteredAdminChanges : save}")
    expect(app).not.toContain("Duplicar seção")
    expect(app).not.toContain("Nova seção")
    expect(app).not.toContain("Publicar seção")
    expect(app).not.toContain("Oculta no site")
    expect(modules).toContain('block.mobile_panel === "a" ? "Esquerda" : "Direita"')
    expect(app).toContain("<h3>Conteúdo</h3>")
    expect(editor).not.toContain("Novo bloco")
    expect(editor).not.toContain("Adicionar item")
    expect(editor).not.toContain("Texto alternativo (opcional)")
    expect(editor).not.toContain("Descrição alternativa do logo")
    expect(editor).not.toContain("Descrição alternativa da foto")
    expect(editor).toContain("allowFraming={false}")
    expect(modules).toContain("value={mediaDraft.altText}")
    expect(css).toContain("aspect-ratio: 390 / 844")
  })

  it("shows the slides explanation through an info button and embeds trajectory fields", () => {
    expect(modules).toContain('label="Slides relacionados aos projetos"')
    expect(modules).toContain("Cada título de slide é um projeto clicável na página pública.")
    expect(modules).not.toContain("experience-admin-relationship-note")
    expect(modules).not.toContain("Editar trajetória completa (Coleções)")
    expect(modules).not.toContain("O site evita exibir trechos já resumidos")
    expect(modules).toContain("<InlineCareerTrajectoryEditor")
    expect(modules).toContain("resolveCareerSectionSlug(row) === sectionSlug")
    expect(modules).toContain('from("career_experiences")')
    expect(modules).toContain('.eq("updated_at", saved.updated_at)')
    expect(modules).toContain("blockDirty || trajectoryDirty")
    expect(modules).toContain("Trajetória completa")
    expect(css).toContain(".experience-admin-slide-heading")
  })

  it("preserves published navigation and clarifies the verified canonical domain", () => {
    expect(modules).toContain('status: "published"')
    expect(modules).toContain('title="Criação de itens desativada"')
    expect(modules).toContain("https://tulius.work/")
    expect(modules).toContain("próximo deploy")
  })
})
