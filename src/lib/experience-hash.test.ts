import { describe, expect, it } from "vitest"
import { experienceSlugFromHash } from "./experience-hash"

const companies = ["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"]

describe("P4 — acesso direto às experiências mobile", () => {
  it("seleciona a seção publicada na URL", () => {
    expect(experienceSlugFromHash("#vale", companies)).toBe("vale")
    expect(experienceSlugFromHash("#prefeitura-sp", companies)).toBe("prefeitura-sp")
  })
  it("suporta destinos do painel B", () => {
    expect(experienceSlugFromHash("#globo-sportv-b", companies)).toBe("globo-sportv")
  })
  it("rejeita seções ocultas e fragmentos inválidos", () => {
    expect(experienceSlugFromHash("#competencias", companies)).toBeUndefined()
    expect(experienceSlugFromHash("#%ZZ", companies)).toBeUndefined()
    expect(experienceSlugFromHash("", companies)).toBeUndefined()
  })
})
