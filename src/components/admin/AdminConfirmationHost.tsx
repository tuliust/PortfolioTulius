import { useEffect, useRef, useState } from "react"

export type AdminConfirmOptions = {
  title?: string
  confirmLabel?: string
  tone?: "warning" | "danger"
}

type Confirmation = {
  message: string
  options: AdminConfirmOptions
  mode: "confirm" | "unsaved"
  resolve: (answer: boolean) => void
}

let requestConfirmation: ((request: Confirmation) => void) | null = null
type RegisteredSave = { action: () => Promise<boolean>; dirty: () => boolean }
const registeredSaves = new Map<() => Promise<boolean>, RegisteredSave>()

/** Multiple independent editors can save together without overriding one another. */
export function registerAdminSaveAction(
  action: () => Promise<boolean>,
  dirty: () => boolean = () => true,
): () => void {
  registeredSaves.set(action, { action, dirty })
  return () => { registeredSaves.delete(action) }
}

export async function saveRegisteredAdminChanges(): Promise<boolean> {
  const pending = [...registeredSaves.values()].filter((entry) => entry.dirty())
  if (!pending.length) return false
  for (const entry of pending) {
    if (!(await entry.action())) return false
  }
  return true
}

/** Fail closed if the shared dialog is not mounted. */
export function adminConfirm(message: string, options: AdminConfirmOptions = {}): Promise<boolean> {
  if (!requestConfirmation) return Promise.resolve(false)
  return new Promise<boolean>((resolve) =>
    requestConfirmation?.({ message, options, mode: "confirm", resolve }),
  )
}

export function adminConfirmUnsaved(
  message: string,
  options: AdminConfirmOptions = {},
): Promise<boolean> {
  if (!requestConfirmation) return Promise.resolve(false)
  return new Promise<boolean>((resolve) =>
    requestConfirmation?.({
      message,
      options: { title: "Alterações não salvas", ...options },
      mode: "unsaved",
      resolve,
    }),
  )
}

export function AdminConfirmationHost() {
  const [current, setCurrent] = useState<Confirmation | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const pending = useRef<Confirmation | null>(null)
  const busy = useRef(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestConfirmation = (request) => {
      if (pending.current) {
        request.resolve(false)
        return
      }
      pending.current = request
      setSaveError("")
      setCurrent(request)
    }
    return () => {
      requestConfirmation = null
      pending.current?.resolve(false)
      pending.current = null
    }
  }, [])

  function finish(accept: boolean) {
    if (busy.current) return
    const active = pending.current
    pending.current = null
    setCurrent(null)
    setSaveError("")
    active?.resolve(accept)
  }

  async function saveAndExit() {
    if (!current || current.mode !== "unsaved" || busy.current) return
    if (![...registeredSaves.values()].some((entry) => entry.dirty())) {
      setSaveError("O salvamento desta área não está disponível. Você permanece na página.")
      return
    }
    busy.current = true
    setSaving(true)
    setSaveError("")
    let confirmed = false
    try {
      confirmed = await saveRegisteredAdminChanges()
    } catch {
      confirmed = false
    }
    busy.current = false
    setSaving(false)
    if (confirmed) finish(true)
    else
      setSaveError(
        "Não foi possível confirmar o salvamento. Verifique o erro no editor. As alterações foram preservadas.",
      )
  }

  useEffect(() => {
    if (!current) return
    const former = document.activeElement instanceof HTMLElement ? document.activeElement : null
    cancelRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (busy.current) return
        event.preventDefault()
        finish(false)
        return
      }
      if (event.key !== "Tab") return
      const buttons = Array.from(
        dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? [],
      )
      if (!buttons.length) return
      const first = buttons[0],
        last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      former?.focus()
    }
  }, [current])

  if (!current) return null
  const unsaved = current.mode === "unsaved"
  return (
    <div className="admin-confirm-overlay">
      <div
        ref={dialogRef}
        className={`admin-confirm-dialog${unsaved ? " is-unsaved" : ""}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-description"
      >
        <span className="admin-confirm-eyebrow">PORTFÓLIO EDITORIAL</span>
        <h2 id="admin-confirm-title">{current.options.title ?? "Confirmar alteração"}</h2>
        <p id="admin-confirm-description">{current.message}</p>
        {saveError && (
          <p className="admin-confirm-error" role="alert">
            {saveError}
          </p>
        )}
        <div className="admin-confirm-actions">
          {unsaved ? (
            <>
              <button
                type="button"
                ref={cancelRef}
                disabled={saving}
                className="secondary-button"
                onClick={() => finish(false)}
              >
                Não sair
              </button>
              <button
                type="button"
                disabled={saving}
                className="secondary-button"
                onClick={() => finish(true)}
              >
                Sair sem salvar
              </button>
              <button
                type="button"
                disabled={saving}
                className="primary-button"
                onClick={() => void saveAndExit()}
              >
                {saving ? "Salvando…" : "Salvar e sair"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                ref={cancelRef}
                className="secondary-button"
                onClick={() => finish(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={current.options.tone === "danger" ? "danger-button" : "primary-button"}
                onClick={() => finish(true)}
              >
                {current.options.confirmLabel ?? "Continuar"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
