import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8")
const adminApp = readFileSync(new URL("../components/admin/AdminApp.tsx", import.meta.url), "utf8")
const editorial = readFileSync(
  new URL("../components/admin/AdminModules.tsx", import.meta.url),
  "utf8",
)

describe("Responsividade administrativa sem alterar o site público", () => {
  it("converte a navegação fixa em faixa horizontal nos tablets e celulares", () => {
    expect(css).toMatch(
      /@media \(max-width: 1100px\) \{[\s\S]*?\.admin-shell \{ display: flex; flex-direction: column;/,
    )
    expect(css).toContain("overscroll-behavior-inline: contain")
    expect(css).toContain(".admin-sidebar nav button {")
  })

  it("mantém a prévia mobile na página dedicada, sem aba no Editor do site", () => {
    expect(adminApp).toContain("function PortfolioPreviewPane()")
    expect(adminApp).toContain("preview: <PortfolioPreviewPane />")
    expect(adminApp).not.toContain('{ id: "preview", title: "Prévia" }')
    expect(adminApp).toContain('src="/admin/preview"')
  })

  it("preserva as revisões antigas e pagina os novos registros em grupos de dez", () => {
    expect(editorial).toContain("const EDITORIAL_PAGE_SIZE = 10")
    expect(editorial).toContain('.gte("created_at", EDITORIAL_ACTIVITY_START)')
    expect(editorial).toContain(".range(0, revisionLimit - 1)")
    expect(editorial).toContain("setIssueLimit((limit) => limit + EDITORIAL_PAGE_SIZE)")
    expect(editorial).toContain("setRevisionLimit((limit) => limit + EDITORIAL_PAGE_SIZE)")
  })

  it("consolida os dois editores, mantendo acervo em aba separada", () => {
    expect(adminApp).toContain('type SiteEditorPane = "edit" | "records"')
    expect(adminApp).toContain('id: "edit", title: "Editar seção"')
    expect(adminApp).toContain('className="site-editor-consolidated"')
    expect(adminApp.indexOf("<SectionsEditor", adminApp.indexOf('className="site-editor-consolidated"'))).toBeLessThan(
      adminApp.indexOf("<ContentStudio", adminApp.indexOf('className="site-editor-consolidated"')),
    )
  })

  it("adapta formulários, mídia, modais e toques para celular", () => {
    expect(css).toContain(".admin-stats, .field-grid, .responsive-style-grid")
    expect(css).toContain(".block-item-head .order-buttons button { min-width: 44px")
    expect(css).toContain(".admin-confirm-actions { flex-direction: column-reverse")
    expect(css).toContain(".site-editor-preview-frame.mobile { width: 100%")
    expect(css).toContain("@media (max-width: 380px)")
  })
})
