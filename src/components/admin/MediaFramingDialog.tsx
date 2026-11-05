import { useEffect, useRef, useState } from "react"
import {
  defaultMediaFraming,
  imageFramingStyle,
  normalizeMediaFraming,
  type MediaFraming,
} from "../../lib/media-framing"
export function MediaFramingDialog({
  src,
  label,
  guidance,
  ratio,
  value,
  onChange,
  onClose,
  saveHint = "O enquadramento será publicado ao salvar o bloco. O arquivo original não é modificado.",
}: {
  src: string
  label: string
  guidance: string
  ratio: string
  value?: MediaFraming
  onChange: (value: MediaFraming) => void
  onClose: () => void
  saveHint?: string
}) {
  const [current, setCurrent] = useState(() => normalizeMediaFraming(value))
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    const focusables = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled])") ??
          [],
      )
    focusables()[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeRef.current()
      }
      if (event.key !== "Tab") return
      const controls = focusables()
      if (!controls.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      previousFocus?.focus()
    }
  }, [])
  const ratioParts = ratio.split("/").map((part) => Number(part.trim()))
  const aspect =
    ratioParts.length === 2 && ratioParts[0] > 0 && ratioParts[1] > 0
      ? ratioParts[0] / ratioParts[1]
      : 16 / 9
  const set = (field: keyof MediaFraming, n: number) =>
    setCurrent((before) => normalizeMediaFraming({ ...before, [field]: n }))
  return (
    <div
      className="media-frame-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="media-frame-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Ajustar ${label}`}
      >
        <header>
          <div>
            <h3>Ajustar enquadramento</h3>
            <p>
              {label} · {guidance}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar janela">
            ×
          </button>
        </header>
        <div
          className="media-frame-stage"
          style={{ aspectRatio: ratio, maxWidth: `min(100%, calc(42dvh * ${aspect}))` }}
        >
          <img src={src} alt="Prévia do enquadramento" style={imageFramingStyle(current)} />
        </div>
        <div className="media-frame-controls">
          {(["x", "y"] as const).map((axis) => (
            <label key={axis}>
              Posição {axis.toUpperCase()} — {Math.round(current[axis])}%
              <input
                type="range"
                min={0}
                max={100}
                value={current[axis]}
                onChange={(event) => set(axis, Number(event.target.value))}
              />
            </label>
          ))}
          <div className="media-frame-zoom">
            <span>Zoom — {Math.round(current.zoom * 100)}%</span>
            <button
              type="button"
              aria-label="Diminuir zoom"
              onClick={() => set("zoom", Math.round((current.zoom - 0.1) * 10) / 10)}
            >
              −
            </button>
            <input
              type="range"
              aria-label="Zoom"
              min={1}
              max={3}
              step={0.1}
              value={current.zoom}
              onChange={(event) => set("zoom", Number(event.target.value))}
            />
            <button
              type="button"
              aria-label="Aumentar zoom"
              onClick={() => set("zoom", Math.round((current.zoom + 0.1) * 10) / 10)}
            >
              +
            </button>
          </div>
        </div>
        <footer>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setCurrent(defaultMediaFraming)}
          >
            Restaurar
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              onChange(current)
              onClose()
            }}
          >
            Aplicar ao formulário
          </button>
        </footer>
        <small>{saveHint}</small>
      </div>
    </div>
  )
}
