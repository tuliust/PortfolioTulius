import { supabase } from "./supabase"

/**
 * Zero-write feature detection: the new RPC is called only when saving.
 * Only a missing-function response permits the legacy backend path. All other
 * errors (including unknown network outcomes) halt without a second write.
 */
export type CompositePayload = {
  p_section_id: string
  p_section_changes: Record<string, unknown>
  p_expected_section_updated_at: string | null
  p_block_id: string | null
  p_block_changes: Record<string, unknown> | null
  p_expected_block_updated_at: string | null
  p_placements: Array<Record<string, unknown>>
}

export type CompositeOutcome =
  | { mode: "saved" }
  | { mode: "legacy" }
  | { mode: "error"; message: string }

export function compositeErrorText(error: { code?: string; message?: string }): string {
  const code = error.code ?? ""
  const detail = error.message ?? "Erro desconhecido"
  if (code === "40001" || /p2_(section|block|placement)_conflict/.test(detail)) {
    return "Outra edição alterou este conteúdo. Reabra a seção antes de salvar novamente."
  }
  if (code === "42501") return "Sua conta não tem permissão para salvar estas alterações."
  if (code === "22023" || code === "P0002") {
    return "Os dados informados não puderam ser gravados. Revise os campos e recarregue."
  }
  return (
    "Não foi possível confirmar a gravação composta (" +
    code +
    "). Recarregue e confira os valores antes de tentar novamente. " +
    detail
  )
}

export async function tryCompositeSave(payload: CompositePayload): Promise<CompositeOutcome> {
  if (!supabase) return { mode: "error", message: "Conexão com o Supabase indisponível." }
  try {
    const { error } = await supabase.rpc("save_section_block_atomic", payload)
    if (!error) return { mode: "saved" }
    // PGRST202 is the PostgREST schema-cache signal for an absent RPC.
    // SQLSTATE 42883 may also be raised inside an installed RPC: NEVER fall
    // back after a server-side execution error or an uncertain write.
    if (
      error.code === "PGRST202" &&
      /\bpublic\.save_section_block_atomic\b/i.test(error.message ?? "")
    ) {
      return { mode: "legacy" }
    }
    return { mode: "error", message: compositeErrorText(error) }
  } catch {
    return {
      mode: "error",
      message: "A conexão foi interrompida e o resultado é incerto. Recarregue antes de reenviar.",
    }
  }
}

/** Compare JSONB data independent of object key insertion order. */
export function sameJson(a: unknown, b: unknown): boolean {
  const normalize = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(normalize)
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.keys(value as Record<string, unknown>)
          .filter((key) => (value as Record<string, unknown>)[key] !== undefined)
          .sort()
          .map((key) => [key, normalize((value as Record<string, unknown>)[key])]),
      )
    }
    return value
  }
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b))
}
