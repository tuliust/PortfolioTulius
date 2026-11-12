import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { NumericField } from "./AdminVisualFields"
import { DeviceStyleEditor, HeroDeviceEditor } from "./DeviceStyleEditors"
import { ProfileMobileEditorialEditor } from "./ProfileMobileEditorialEditor"

describe("P3 — regressão dos formulários visuais extraídos", () => {
  it("mantém o contrato de números opcionais e limites", () => {
    const html = renderToStaticMarkup(
      <NumericField label="Espaçamento (px)" min={0} max={120} onChange={() => undefined} />,
    )
    expect(html).toContain('type="number"')
    expect(html).toContain('min="0"')
    expect(html).toContain('max="120"')
    expect(html).toContain('placeholder="Automático"')
  })

  it("preserva a configuração de visibilidade, ordem e alinhamento por dispositivo", () => {
    const html = renderToStaticMarkup(
      <DeviceStyleEditor device="desktop" onChange={() => undefined} />,
    )
    expect(html).toContain("Desktop")
    expect(html).toContain("Visível")
    expect(html).toContain("Ordem")
    expect(html).toContain("Alinhamento")
  })

  it("exibe somente no desktop os parâmetros exclusivos da fotografia Hero", () => {
    const desktop = renderToStaticMarkup(
      <HeroDeviceEditor device="desktop" onChange={() => undefined} />,
    )
    const mobile = renderToStaticMarkup(
      <HeroDeviceEditor device="mobile" onChange={() => undefined} />,
    )
    expect(desktop).toContain("Indicador +15: posição X")
    expect(mobile).not.toContain("Indicador +15: posição X")
    expect(desktop).toContain("Frase: alinhamento")
    expect(mobile).toContain("Frase: alinhamento")
  })

  it("mantém as três áreas editoriais mobile, sem mudar a composição desktop", () => {
    const html = renderToStaticMarkup(<ProfileMobileEditorialEditor onChange={() => undefined} />)
    expect(html).toContain("Abertura Editorial 360°")
    expect(html).toContain("Área 1")
    expect(html).toContain("Selo do painel B · acima de Áreas de Atuação")
    expect(html).toContain("Área 3")
    expect(html).toContain("Fotografia exclusiva")
  })
})
