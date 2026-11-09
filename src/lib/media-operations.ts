/** Compensates Storage writes when a separate Postgres metadata operation fails. */
type MediaResponse = { error: { message: string } | null }
type Outcome = { ok: boolean; message: string; warning?: string }

export async function stagePrivateMediaChange(steps: {
  stage: () => Promise<MediaResponse>
  persist: () => Promise<MediaResponse>
  undoStage: () => Promise<MediaResponse>
  cleanupOld?: () => Promise<MediaResponse>
  /** Distinguish a rejected SQL write from a lost response after commit. */
  reconcile?: () => Promise<"committed" | "unchanged" | "unknown">
}): Promise<Outcome> {
  try {
    const upload = await steps.stage()
    if (upload.error) return { ok: false, message: upload.error.message }
  } catch (error) {
    return { ok: false, message: String(error) }
  }

  let saveError: string | null = null
  try {
    const persisted = await steps.persist()
    saveError = persisted.error?.message ?? null
  } catch (error) {
    saveError = String(error)
  }

  let recoveredAfterUncertainResponse = false
  if (saveError) {
    let state: "committed" | "unchanged" | "unknown" = "unknown"
    try {
      state = (await steps.reconcile?.()) ?? "unknown"
    } catch {
      // A failed confirmation read is an unknown outcome, not a rollback.
    }
    if (state === "committed") {
      recoveredAfterUncertainResponse = true
    } else if (state === "unknown") {
      return {
        ok: false,
        message:
          saveError +
          " Não foi possível confirmar a gravação. As cópias anterior e nova foram preservadas; recarregue o catálogo antes de tentar novamente.",
      }
    } else {
      try {
        const cleanup = await steps.undoStage()
        return {
          ok: false,
          message: cleanup.error
            ? `${saveError} Atenção: arquivo temporário não removido: ${cleanup.error.message}`
            : `${saveError} Upload temporário revertido.`,
        }
      } catch (error) {
        return {
          ok: false,
          message: `${saveError} Atenção: falha na limpeza do arquivo temporário: ${String(error)}`,
        }
      }
    }
  }

  if (steps.cleanupOld) {
    try {
      const cleanup = await steps.cleanupOld()
      if (cleanup.error) {
        return {
          ok: true,
          message: "",
          warning: `A mídia foi atualizada, mas o arquivo anterior precisa de remoção: ${cleanup.error.message}`,
        }
      }
    } catch (error) {
      return {
        ok: true,
        message: "",
        warning: `A mídia foi atualizada, mas a limpeza anterior falhou: ${String(error)}`,
      }
    }
  }

  return {
    ok: true,
    message: "",
    ...(recoveredAfterUncertainResponse
      ? { warning: "Gravação confirmada por releitura após resposta SQL incerta." }
      : {}),
  }
}
