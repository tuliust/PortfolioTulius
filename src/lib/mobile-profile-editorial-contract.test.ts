import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const publicSource = readFileSync(
  new URL("../components/public/PublicSite.tsx", import.meta.url),
  "utf8",
)
const navigation = readFileSync(
  new URL("../components/public/Navigation.tsx", import.meta.url),
  "utf8",
)
const editor = ["AdminModules.tsx", "ProfileMobileEditorialEditor.tsx"]
  .map((name) => readFileSync(new URL("../components/admin/" + name, import.meta.url), "utf8"))
  .join("\n")
const css = readFileSync(new URL("../index.css", import.meta.url), "utf8")

describe("Perfil Editorial 360 — exclusivo mobile", () => {
  it("ativa por configuração sem substituir o renderer desktop", () => {
    expect(publicSource).toContain("function ProfileDesktop(")
    expect(publicSource).toContain("function ProfileMobileEditorial(")
    expect(publicSource).toContain("if (hero?.mobileEditorial?.enabled)")
    expect(publicSource).toContain("<ProfileDesktop")
    expect(publicSource).toContain('href="#perfil-b"')
  })
  it("tem três áreas com conteúdo vinculado ao CMS", () => {
    for (const name of ["mobile360-top", "mobile360-middle", "mobile360-bottom"]) {
      expect(publicSource).toContain(name)
      expect(css).toContain(name)
    }
    expect(publicSource).toContain("mobileEditorialLines(config.headline)")
    expect(publicSource).toContain("config.mobileImage")
    expect(publicSource).toContain("splitProfileTitle(section.title)")
    expect(publicSource).not.toContain("CONEXÕES AUTÊNTICAS. INOVAÇÃO.")
  })
  it("oferece no admin controles para as três áreas e foto exclusiva", () => {
    expect(editor).toContain("Abertura Editorial 360° — somente mobile")
    expect(editor).toContain("Fotografia exclusiva da área 3 mobile")
    expect(editor).toContain("updateHero(index, { mobileEditorial })")
    expect(editor).toContain('label="Fundo da área 1"')
    expect(editor).toContain('label="Fundo da área 2"')
    expect(editor).toContain('label="Fundo da área 3"')
  })
  it("não aplica o cabeçalho escuro ao desktop e aceita redução de movimento", () => {
    expect(navigation).toContain("mobileEditorialEnabled && firstPanelVisible")
    expect(css).toContain(".site-header.header-profile-editorial")
    expect(css).toContain("@media (prefers-reduced-motion: reduce)")
  })
})
