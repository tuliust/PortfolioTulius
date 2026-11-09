import { beforeEach, describe, expect, it, vi } from "vitest"

const rpc = vi.hoisted(() => vi.fn())
vi.mock("./supabase", () => ({ supabase: { rpc } }))
import { tryCompositeSave, type CompositePayload } from "./p2-composite-save"

const payload: CompositePayload = {
  p_section_id: "00000000-0000-0000-0000-000000000001",
  p_section_changes: { title: "Seção sintética" },
  p_expected_section_updated_at: "2026-11-09T00:00:00Z",
  p_block_id: null,
  p_block_changes: null,
  p_expected_block_updated_at: null,
  p_placements: [],
}

describe("P2: fallback seguro da RPC composta", () => {
  beforeEach(() => rpc.mockReset())

  it("confirma uma chamada composta bem-sucedida sem recorrer ao legado", async () => {
    rpc.mockResolvedValue({ error: null })
    expect(await tryCompositeSave(payload)).toEqual({ mode: "saved" })
    expect(rpc).toHaveBeenCalledOnce()
    expect(rpc).toHaveBeenCalledWith("save_section_block_atomic", payload)
  })

  it("permite o caminho legado somente quando a RPC não existe no schema cache", async () => {
    rpc.mockResolvedValue({
      error: {
        code: "PGRST202",
        message:
          "Could not find the function public.save_section_block_atomic(p_section_id) in the schema cache",
      },
    })
    expect(await tryCompositeSave(payload)).toEqual({ mode: "legacy" })
  })

  it("não trata erro SQL interno 42883 como permissão para gravar duas vezes", async () => {
    rpc.mockResolvedValue({
      error: { code: "42883", message: "function private.missing_helper() does not exist" },
    })
    expect((await tryCompositeSave(payload)).mode).toBe("error")
    expect(rpc).toHaveBeenCalledOnce()
  })

  it("não interpreta PGRST202 de outro recurso como ausência desta RPC", async () => {
    rpc.mockResolvedValue({
      error: { code: "PGRST202", message: "Could not find the function public.other_function()" },
    })
    expect((await tryCompositeSave(payload)).mode).toBe("error")
  })

  it("não ativa o legado quando a rede devolve erro não classificado", async () => {
    rpc.mockResolvedValue({ error: { code: "PGRST000", message: "connection reset" } })
    const outcome = await tryCompositeSave(payload)
    expect(outcome.mode).toBe("error")
    if (outcome.mode === "error") expect(outcome.message).toContain("Recarregue")
    expect(rpc).toHaveBeenCalledOnce()
  })

  it("não ativa fallback em conflitos de versão, permissão ou payload", async () => {
    for (const code of ["40001", "42501", "22023"]) {
      rpc.mockResolvedValueOnce({ error: { code, message: "Rejected by SQL" } })
      expect((await tryCompositeSave(payload)).mode).toBe("error")
    }
    expect(rpc).toHaveBeenCalledTimes(3)
  })
})
