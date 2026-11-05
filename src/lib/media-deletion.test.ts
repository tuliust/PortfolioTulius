import { describe, expect, it, vi } from "vitest"
import { runMediaDeletion } from "./media-deletion"

const ok = { error: null }
const fail = { error: { message: "Falha de operação" } }

describe("exclusão de mídia com confirmação da transação e limpeza do Storage", () => {
  it("não exclui o arquivo quando a transação no Supabase falha", async () => {
    const removeFile = vi.fn().mockResolvedValue(ok)
    const result = await runMediaDeletion(vi.fn().mockResolvedValue(fail), removeFile)
    expect(result.ok).toBe(false)
    expect(result.databaseDeleted).toBe(false)
    expect(removeFile).not.toHaveBeenCalled()
  })

  it("exclui o objeto do Storage somente depois da transação", async () => {
    const order: string[] = []
    const result = await runMediaDeletion(
      async () => {
        order.push("database")
        return ok
      },
      async () => {
        order.push("storage")
        return ok
      },
    )
    expect(result.ok).toBe(true)
    expect(order).toEqual(["database", "storage"])
  })

  it("reporta explicitamente quando o arquivo físico não foi removido", async () => {
    const result = await runMediaDeletion(
      async () => ok,
      async () => fail,
    )
    expect(result.ok).toBe(false)
    expect(result.databaseDeleted).toBe(true)
    expect(result.message).toContain("não foi possível excluir")
  })
})
