import { useState } from "react"
import type { HeroTextFormat } from "../../types/content"
import type { IdentityTokenRow } from "../../lib/identity-catalog"
import { IDENTITY_NUMERIC_SIZES } from "../../lib/identity-catalog"
import { Icon } from "../ui/Icons"
import { HeroColorPicker } from "./HeroVisualPickers"
import "./HeroFormattingButton.css"

export function HeroFormattingButton({
  label,
  value,
  onChange,
  catalog,
}: {
  label: string
  value?: HeroTextFormat
  onChange: (next?: HeroTextFormat) => void
  catalog: Record<string, IdentityTokenRow>
}) {
  const [open, setOpen] = useState(false)
  const styles = Object.values(catalog).filter((entry) => entry.token_key.startsWith("typography."))
  const fonts = Object.values(catalog).filter((entry) => entry.value_type === "font")
  const sizes = Array.from(
    new Set([
      ...IDENTITY_NUMERIC_SIZES,
      ...(value?.desktopSize != null ? [value.desktopSize] : []),
      ...(value?.mobileSize != null ? [value.mobileSize] : []),
    ]),
  ).sort((a, b) => a - b)
  const patch = (next: Partial<HeroTextFormat>) => onChange({ ...value, ...next })
  return (
    <div className="hero-format-control">
      <button
        type="button"
        className="hero-format-trigger"
        aria-label={"Formatar " + label}
        title={"Formatar " + label}
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        <Icon name="sliders" size={15} />
      </button>
      {open && (
        <div className="hero-format-popover" role="group" aria-label={"Formatação de " + label}>
          <strong>Formatação · {label}</strong>
          <label>
            Estilo da Identidade
            <select
              value={value?.styleToken ?? ""}
              onChange={(event) => patch({ styleToken: event.target.value || undefined })}
            >
              <option value="">Padrão atual do elemento</option>
              {styles.map((entry) => (
                <option key={entry.token_key} value={entry.token_key}>
                  {entry.display_name}
                </option>
              ))}
            </select>
          </label>
          <HeroColorPicker
            label="Cor"
            value={value?.colorToken ?? ""}
            catalog={catalog}
            allowDefault
            onChange={(colorToken) => patch({ colorToken: colorToken || undefined })}
          />
          <label>
            Fonte
            <select
              value={value?.fontToken ?? ""}
              onChange={(event) => patch({ fontToken: event.target.value || undefined })}
            >
              <option value="">Herdar do estilo</option>
              {fonts.map((entry) => (
                <option key={entry.token_key} value={entry.token_key}>
                  {entry.display_name}
                </option>
              ))}
            </select>
          </label>
          <div className="hero-format-size-row">
            {(["desktopSize", "mobileSize"] as const).map((device) => (
              <label key={device}>
                Tamanho {device === "desktopSize" ? "desktop" : "mobile"}
                <select
                  value={value?.[device] ?? ""}
                  onChange={(event) =>
                    patch({ [device]: event.target.value ? Number(event.target.value) : undefined })
                  }
                >
                  <option value="">Usar estilo</option>
                  {sizes.map((item) => (
                    <option key={item} value={item}>
                      {item} px
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <div className="hero-format-actions">
            <button type="button" onClick={() => onChange(undefined)}>
              Restaurar padrão
            </button>
            <button type="button" onClick={() => setOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
