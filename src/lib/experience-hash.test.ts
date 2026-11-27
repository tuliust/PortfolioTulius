import { describe, expect, it } from "vitest"
import { decodePublicFragment, experienceSlugFromHash } from "./experience-hash"

describe("Fragmentos de navegação pública", () => {
  it("preserva o destino completo e decodifica links válidos", () => {
    expect(decodePublicFragment("#perfil-b")).toBe("perfil-b")
    expect(decodePublicFragment("#globo%2Dsportv-b")).toBe("globo-sportv-b")
  })
  it("ignora fragmentos vazios ou com codificação inválida", () => {
    for (const hash of ["", "#", "#%ZZ", "#%E0%A4%A"]) {
      expect(decodePublicFragment(hash)).toBeUndefined()
    }
  })
})

const companies = ["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"]

describe("P4 — acesso direto às experiências mobile", () => {
  it("seleciona a seção publicada na URL", () => {
    expect(experienceSlugFromHash("#vale", companies)).toBe("vale")
    expect(experienceSlugFromHash("#prefeitura-sp", companies)).toBe("prefeitura-sp")
  })
  it("suporta destinos do painel B", () => {
    expect(experienceSlugFromHash("#globo-sportv-b", companies)).toBe("globo-sportv")
    expect(experienceSlugFromHash("#globo%2Dsportv-b", companies)).toBe("globo-sportv")
  })
  it("rejeita seções ocultas e fragmentos inválidos", () => {
    expect(experienceSlugFromHash("#competencias", companies)).toBeUndefined()
    expect(experienceSlugFromHash("#%ZZ", companies)).toBeUndefined()
    expect(experienceSlugFromHash("", companies)).toBeUndefined()
  })
})
