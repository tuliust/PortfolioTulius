import { useEffect, useState } from "react"
import { isSafeEditorialImage } from "../../lib/validation"
import { MediaFramingDialog } from "./MediaFramingDialog"
import { PublishedMediaDialog } from "./PublishedMediaDialog"
import { AdminInfoTip } from "./InfoTip"
import { Icon } from "../ui/Icons"
import type { MediaFraming } from "../../lib/media-framing"

export function PublishedMediaPicker({
  label,
  value,
  onChange,
  framing,
  onFramingChange,
  guidance = "Imagem responsiva: conferir desktop e mobile.",
  ratio = "16 / 9",
  guidanceAsInfo = true,
  iconOnlyActions = true,
  allowFraming = true,
}: {
  label: string
  value: string
  onChange: (url: string, alt: string) => void
  framing?: MediaFraming
  onFramingChange?: (framing: MediaFraming) => void
  guidance?: string
  ratio?: string
  guidanceAsInfo?: boolean
  iconOnlyActions?: boolean
  allowFraming?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [framingOpen, setFramingOpen] = useState(false)

  useEffect(() => {
    setPreviewFailed(false)
  }, [value])

  return (
    <div className="published-media-picker">
      <div className="published-media-label-row">
        <strong className="published-media-picker-label">{label}</strong>
        {guidanceAsInfo && (
          <AdminInfoTip label={label} description={`Área de destino: ${guidance}`} />
        )}
      </div>
      {!guidanceAsInfo && <p className="published-media-guidance">Área de destino: {guidance}</p>}
      {value && isSafeEditorialImage(value) && !previewFailed ? (
        <div className="published-media-current">
          <img
            src={value}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPreviewFailed(true)}
          />
          <span>Imagem atual preservada. Escolha outra imagem para substituí-la.</span>
        </div>
      ) : (
        <p className="published-media-current-note">
          {value
            ? "Prévia indisponível. A referência atual será preservada até você substituí-la."
            : "Nenhuma imagem selecionada."}
        </p>
      )}
      <div className="published-media-actions">
        <button
          type="button"
          className={iconOnlyActions ? "secondary-button media-icon-action" : "secondary-button"}
          aria-label={iconOnlyActions ? "Escolher da biblioteca" : undefined}
          title={iconOnlyActions ? "Escolher da biblioteca" : undefined}
          onClick={() => setOpen(true)}
        >
          {iconOnlyActions ? <Icon name="image" size={20} /> : "Escolher da biblioteca"}
        </button>
        {allowFraming && value && onFramingChange && (
          <button
            type="button"
            className={iconOnlyActions ? "secondary-button media-icon-action" : "secondary-button"}
            aria-label={iconOnlyActions ? "Ajustar posição e zoom" : undefined}
            title={iconOnlyActions ? "Ajustar posição e zoom" : undefined}
            onClick={() => setFramingOpen(true)}
          >
            {iconOnlyActions ? <Icon name="sliders" size={20} /> : "Ajustar posição e zoom"}
          </button>
        )}
        {value && (
          <button
            type="button"
            className={iconOnlyActions ? "secondary-button media-icon-action" : "secondary-button"}
            aria-label={iconOnlyActions ? "Remover imagem" : undefined}
            title={iconOnlyActions ? "Remover imagem" : undefined}
            onClick={() => onChange("", "")}
          >
            {iconOnlyActions ? <Icon name="trash" size={20} /> : "Remover imagem"}
          </button>
        )}
      </div>
      {allowFraming && framingOpen && value && onFramingChange && (
        <MediaFramingDialog
          src={value}
          label={label}
          guidance={guidance}
          ratio={ratio}
          value={framing}
          onChange={onFramingChange}
          onClose={() => setFramingOpen(false)}
        />
      )}
      {open && (
        <PublishedMediaDialog
          label={label}
          selectedUrl={value}
          onSelect={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
