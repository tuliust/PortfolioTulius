import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { NumericField } from "./AdminVisualFields"
import { DeviceStyleEditor, HeroDeviceEditor } from "./DeviceStyleEditors"
import { ProfileMobileEditorialEditor } from "./ProfileMobileEditorialEditor"
import { PublishedMediaPicker } from "./PublishedMediaPicker"
import { getItemMediaRecommendation } from "../../lib/admin-media-recommendations"

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

  it("expõe as dimensões em botão de informação ao lado do campo de mídia", () => {
    const html = renderToStaticMarkup(
      <PublishedMediaPicker
        label="Fotografia do slide"
        recommendedSize="1600 × 1600 px (desktop e mobile)"
        guidance="A imagem é exibida inteira."
        value=""
        onChange={() => undefined}
      />,
    )
    expect(html).toContain('aria-label="Informações sobre Fotografia do slide"')
    expect(html).toContain('role="tooltip"')
    expect(html).toContain("Tamanho recomendado: 1600 × 1600 px")
    expect(html).toContain("A imagem é exibida inteira.")
  })

  it("diferencia Perfil, Sobre, Contato e miniaturas por destino", () => {
    expect(getItemMediaRecommendation("perfil", "a", 0, "mobile").recommendedSize).toContain(
      "1200 × 1600 px",
    )
    expect(getItemMediaRecommendation("sobre", "a", 0, "desktop").recommendedSize).toContain(
      "1200 × 1600 px",
    )
    expect(getItemMediaRecommendation("sobre", "a", 0, "mobile").recommendedSize).toContain(
      "900 × 1200 px",
    )
    expect(getItemMediaRecommendation("contato", "a", 0, "mobile").guidance).toContain(
      "transparência",
    )
    expect(getItemMediaRecommendation("perfil", "b", 1, "mobile").recommendedSize).toContain(
      "600 × 600 px",
    )
  })

  it("mantém as três áreas editoriais mobile, sem mudar a composição desktop", () => {
    const html = renderToStaticMarkup(<ProfileMobileEditorialEditor onChange={() => undefined} />)
    expect(html).toContain("Abertura Editorial 360°")
    expect(html).toContain("Área 1")
    expect(html).toContain("Selo do painel B · acima de Áreas de Atuação")
    expect(html).toContain("Área 3")
    expect(html).toContain("Fotografia exclusiva")
    expect(html).toContain("Tamanho recomendado: 900 × 1200 px")
  })
})
