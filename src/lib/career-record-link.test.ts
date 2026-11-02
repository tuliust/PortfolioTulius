import { describe, expect, it } from "vitest"
import { resolveCareerSectionSlug } from "./career-record-link"

describe("associação estável entre acervo e experiências públicas", () => {
  it("preserva cada uma das seis seções independentemente do nome editado", () => {
    const fixtures = [
      ["73235f75-d104-4213-821a-4956688a3375", "invest-rs"],
      ["31d0afd1-2d5c-4238-9a66-28fc6b02e001", "prefeitura-sp"],
      ["83b94934-af15-43ea-a1e9-125c376eddd3", "vale"],
      ["a5ef45bb-4347-4bd3-89ef-e35222a3d12f", "inpress"],
      ["d2d19ae8-0fbe-4afb-bb45-f71d02d84068", "globo-sportv"],
      ["9b38d29f-fb51-4fb9-9ecc-16ef28616626", "cdi"],
    ]
    for (const [id, expected] of fixtures) {
      expect(resolveCareerSectionSlug({ id, company: "Nome atualizado no CMS" })).toBe(expected)
    }
  })
  it("conserva compatibilidade com bases sem os IDs atuais", () => {
    expect(resolveCareerSectionSlug({ company: "Grupo InPress" })).toBe("inpress")
    expect(resolveCareerSectionSlug({ company: "TV Globo/SporTV" })).toBe("globo-sportv")
  })
  it("não associa uma empresa nova à seção errada por posição ou ordem", () => {
    expect(resolveCareerSectionSlug({ id: "novo", company: "Empresa nova" })).toBeUndefined()
  })
})
