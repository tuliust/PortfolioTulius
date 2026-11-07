import { describe, expect, it } from "vitest"
import {
  IDENTITY_CATALOG_DEFAULTS,
  IDENTITY_TYPOGRAPHY_KEYS,
  identityCatalogFromRows,
  identityChangedRows,
  identityTokenError,
  serializeIdentityCatalog,
} from "./identity-catalog"

describe("biblioteca central de Identidade — etapa 2", () => {
  it("mantém a paleta global e as famílias existentes", () => {
    const catalog = identityCatalogFromRows([])
    expect(catalog["color.orange"].token_value).toBe("#FF5414")
    expect(catalog["font.heading"].token_value).toBe("Big Shoulders Display")
    expect(catalog["font.body"].token_value).toBe("Inter")
    expect(catalog["font.serif"].token_value).toBe("Georgia")
    expect(catalog["color.white"].token_value).toBe("#FFFFFF")
    expect(IDENTITY_TYPOGRAPHY_KEYS.length).toBe(7)
  })

  it("preserva valores publicados e nomes editáveis, sem alterar chaves estáveis", () => {
    const catalog = identityCatalogFromRows([
      { token_key: "color.orange", token_value: "#AABBCC", display_name: "Meu laranja" },
    ])
    expect(catalog["color.orange"].display_name).toBe("Meu laranja")
    expect(catalog["color.orange"].token_value).toBe("#AABBCC")
    expect(catalog["color.orange"].token_key).toBe("color.orange")
  })

  it("preserva fórmulas responsivas da referência, sem aplicá-las automaticamente", () => {
    const item = identityCatalogFromRows([])["typography.editorial-title"]
    expect(item.style_config.mobileCss).toBe("clamp(2.35rem, 13.8vw, 82px)")
    expect(item.style_config.mobilePx).toBe(82)
    expect(item.style_config.appliedToPublic).toBe(false)
  })

  it("detecta só mudanças efetivas, ignorando ordem de propriedades JSON", () => {
    const original = identityCatalogFromRows([])
    const altered = {
      ...original,
      "typography.caption": {
        ...original["typography.caption"],
        style_config: {
          mobilePx: 14,
          ...original["typography.caption"].style_config,
          desktopPx: 12,
        },
      },
    }
    altered["typography.caption"].style_config.mobilePx = 14
    expect(identityChangedRows(altered, original).map((x) => x.token_key)).toEqual([
      "typography.caption",
    ])
    const copy = { ...original, "color.orange": { ...original["color.orange"] } }
    expect(serializeIdentityCatalog(copy)).toBe(serializeIdentityCatalog(original))
  })

  it("rejeita fonte, cor ou tamanho inválidos", () => {
    const all = identityCatalogFromRows([])
    const color = { ...all["color.orange"], token_value: "red" }
    const font = { ...all["font.heading"], token_value: "url(evil)" }
    const style = {
      ...all["typography.card-title"],
      token_value: "999",
      style_config: { ...all["typography.card-title"].style_config, desktopPx: 999 },
    }
    expect(identityTokenError(color, all)).toBeTruthy()
    expect(identityTokenError(font, all)).toBeTruthy()
    expect(identityTokenError(style, all)).toBeTruthy()
    expect(IDENTITY_CATALOG_DEFAULTS.length).toBe(21)
  })
})
