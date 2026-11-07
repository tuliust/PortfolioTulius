import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (file: string) =>
  readFileSync(new URL("../" + file, import.meta.url), "utf8")

const app = read("components/admin/AdminApp.tsx")
const fields = read("components/admin/EditorIdentityFields.tsx")
const modules = read("components/admin/AdminModules.tsx")
const navigation = read("components/public/Navigation.tsx")
const publicSite = read("components/public/PublicSite.tsx")

describe("Etapa 3 — correspondência CMS e seletores por identidade", () => {
  it("vincula título da seção à apresentação pública e ao header", () => {
    expect(publicSite).toContain("splitProfileTitle(section.title)")
    expect(publicSite).toContain('brandTitle={sections.find((section) => section.slug === "perfil")?.title}')
    expect(navigation).toContain("splitProfileTitle(brandTitle)")
    expect(publicSite).not.toContain("<span>TSANGAROPULOS</span>")
  })

  it("preserva tema/layout técnicos e aceita apenas presets do banco", () => {
    expect(app).not.toContain("value={draft.theme}")
    expect(app).not.toContain("value={draft.layout_variant}")
    for (const preset of ["none", "fade-in", "fade-up", "stagger", "image-reveal", "metric-count"])
      expect(app).toContain(`<option value="${preset}">`)
    expect(app).not.toContain('<option value="slide-right">')
    expect(app).not.toContain('<option value="zoom-in">')
    expect(app).not.toContain("Exibir no site")
    expect(app).toContain('title: confirmTitle')
    expect(app).toContain('const is_visible = !currentlyVisible')
  })

  it("seleciona cores e fontes por nome preservando literais anteriores", () => {
    expect(fields).toContain("item.display_name")
    expect(fields).toContain("Valor existente (preservado)")
    expect(fields).toContain("cssVar(next)")
    expect(fields).toContain("option value=\"__custom__\"")
    expect(fields).not.toContain('type="color"')
    expect(modules).toContain("<IdentityColorSelect")
    expect(modules).toContain("<IdentityFontSelect")
    expect(modules).toContain("<IdentityNumericSize")
  })

  it("oferece tamanhos numéricos e não substitui medidas geométricas", () => {
    expect(fields).toContain("IDENTITY_NUMERIC_SIZES")
    expect(fields).toContain("Padrão (responsivo)")
    expect(modules).toContain('label="Espaçamento vertical (px)"')
    expect(modules).toContain('block.mobile_panel === "a" ? "Esquerda" : "Direita"')
  })
})
