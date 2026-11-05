import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (name: string) =>
  readFileSync(new URL("../components/admin/" + name, import.meta.url), "utf8")

describe("Correções do CMS sem alterar conteúdo publicado", () => {
  it("mantém os ícones categorizados em um popover fechado por padrão", () => {
    const icons = read("VisualIconLibrary.tsx")
    expect(icons).toContain("aria-expanded={open}")
    expect(icons).toContain('className="visual-icon-popover"')
    expect(icons).toContain("max={3}")
    expect(icons).toContain('if (event.key === "Escape")')
  })

  it("abre mídia em diálogo e impede seleção de objetos privados", () => {
    const dialog = read("PublishedMediaDialog.tsx")
    const picker = read("PublishedMediaPicker.tsx")
    expect(dialog).toContain('role="dialog"')
    expect(dialog).toContain('aria-modal="true"')
    expect(dialog).toContain("getPublishedImageChoices(")
    expect(dialog).toContain("await uploadPublishedMedia(file)")
    expect(dialog).not.toContain("await uploadPrivateMedia(file)")
    expect(dialog).not.toContain("await publishPrivateMedia(asset)")
    expect(picker).toContain("<PublishedMediaDialog")
    expect(picker).not.toContain('role="region"')
  })

  it("preserva o texto e o enquadramento do slide quando o modal é cancelado", () => {
    const picker = read("PublishedMediaPicker.tsx")
    expect(picker).toContain("onSelect={onChange}")
    expect(picker).toContain("onClose={() => setOpen(false)}")
    expect(picker).toContain("<MediaFramingDialog")
    const admin = read("AdminModules.tsx")
    expect(admin).toContain('className="field-grid experience-logo-fields"')
    expect(admin).toContain('className="field-grid experience-slide-fields"')
  })
})
