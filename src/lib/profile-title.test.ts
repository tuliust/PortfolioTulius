import { describe, expect, it } from "vitest"
import { splitProfileTitle } from "./profile-title"

describe("título do Perfil compartilhado com marca e apresentações", () => {
  it("preserva o lockup publicado", () => {
    expect(splitProfileTitle("Tulius Tsangaropulos")).toEqual({
      first: "TULIUS",
      rest: "TSANGAROPULOS",
    })
  })
  it("aceita títulos mais longos e espaços extras", () => {
    expect(splitProfileTitle("  Tulius  de Souza  ")).toEqual({
      first: "TULIUS",
      rest: "DE SOUZA",
    })
  })
  it("mantém fallback seguro antes do carregamento", () => {
    expect(splitProfileTitle(null).rest).toBe("TSANGAROPULOS")
  })
})
