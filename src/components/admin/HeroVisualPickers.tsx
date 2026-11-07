import { useEffect, useRef, useState } from "react"
import type { IdentityTokenRow } from "../../lib/identity-catalog"
import { Icon } from "../ui/Icons"
import { iconCategories } from "../../lib/icon-catalog"
import type { MetricIconName } from "../../types/content"
import "./HeroVisualPickers.css"

type Catalog = Record<string, IdentityTokenRow>
const specialIcons = [
  ["arrow", "Seta diagonal"],
  ["down", "Seta para baixo"],
  ["plus", "Cruz"],
  ["none", "Sem ícone"],
] as const

function useDismiss(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])
  return ref
}

/** Keeps published color references intact; shows the actual palette instead of a text-only select. */
export function HeroColorPicker({
  label,
  value = "",
  onChange,
  catalog,
  allowTransparent = false,
  allowDefault = false,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
  catalog: Catalog
  allowTransparent?: boolean
  allowDefault?: boolean
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const ref = useDismiss(open, close)
  const colors = Object.values(catalog).filter((row) => row.value_type === "color")
  const selected = colors.find(
    (row) => row.token_key === value || row.token_value.toLowerCase() === value.toLowerCase(),
  )
  const activeColor =
    selected?.token_value ?? (value === "transparent" || !value ? "transparent" : value)
  return (
    <div ref={ref} className="hero-visual-picker">
      <span className="hero-picker-label">{label}</span>
      <button
        type="button"
        className="hero-visual-picker-trigger"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className={"hero-color-swatch" + (activeColor === "transparent" ? " is-transparent" : "")}
          style={{ backgroundColor: activeColor }}
          aria-hidden="true"
        />
        <span className="hero-picker-selected">
          {value === "transparent"
            ? "Transparente"
            : !value
              ? "Padrão do site"
              : (selected?.display_name ?? "Cor preservada")}
        </span>
        <Icon name={open ? "up" : "down"} size={16} />
      </button>
      {open && (
        <div className="hero-visual-picker-popover" role="group" aria-label={"Paleta · " + label}>
          <strong>Paleta da Identidade</strong>
          <div className="hero-swatch-grid">
            {allowDefault && (
              <button
                type="button"
                className={!value ? "is-selected" : ""}
                aria-label="Padrão do site"
                aria-pressed={!value}
                title="Padrão do site"
                onClick={() => {
                  onChange("")
                  close()
                }}
              >
                <span className="hero-color-swatch is-transparent" aria-hidden="true" />
                <span className="hero-swatch-caption">Padrão</span>
              </button>
            )}
            {allowTransparent && (
              <button
                type="button"
                className={value === "transparent" ? "is-selected" : ""}
                aria-label="Transparente"
                aria-pressed={value === "transparent"}
                title="Transparente"
                onClick={() => {
                  onChange("transparent")
                  close()
                }}
              >
                <span className="hero-color-swatch is-transparent" aria-hidden="true" />
                <span className="hero-swatch-caption">Sem cor</span>
              </button>
            )}
            {colors.map((row) => (
              <button
                type="button"
                key={row.token_key}
                className={
                  value === row.token_key || value.toLowerCase() === row.token_value.toLowerCase()
                    ? "is-selected"
                    : ""
                }
                title={row.display_name}
                aria-label={row.display_name}
                aria-pressed={
                  value === row.token_key || value.toLowerCase() === row.token_value.toLowerCase()
                }
                onClick={() => {
                  onChange(row.token_key)
                  close()
                }}
              >
                <span
                  className="hero-color-swatch"
                  style={{ backgroundColor: row.token_value }}
                  aria-hidden="true"
                />
                <span className="hero-swatch-caption">{row.display_name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Icon grid grouped by theme, shares the canonical catalog with the rest of the CMS. */
export function HeroIconPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (icon: string) => void
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const ref = useDismiss(open, close)
  const groups = [{ category: "Navegação e controles", icons: specialIcons }, ...iconCategories]
  const iconLabel =
    groups.flatMap((group) => group.icons).find(([key]) => key === value)?.[1] ?? "Ícone atual"
  const image = (key: string, size: number) =>
    key === "none" ? (
      <span className="hero-no-icon" aria-hidden="true">
        —
      </span>
    ) : (
      <Icon name={key as MetricIconName} size={size} />
    )
  return (
    <div className="hero-visual-picker">
      <span className="hero-picker-label">{label}</span>
      <div ref={ref} className="hero-icon-picker-anchor">
        <button
          type="button"
          className="hero-visual-picker-trigger"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="hero-current-icon">{image(value, 22)}</span>
          <span className="hero-picker-selected">{iconLabel}</span>
          <Icon name={open ? "up" : "down"} size={16} />
        </button>
        {open && (
          <div
            className="hero-visual-picker-popover hero-icon-popover"
            role="group"
            aria-label={"Ícones · " + label}
          >
            {groups.map((group) => (
              <section key={group.category}>
                <h4>{group.category}</h4>
                <div className="hero-icon-grid">
                  {group.icons.map(([key, name]) => (
                    <button
                      type="button"
                      key={key}
                      className={key === value ? "is-selected" : ""}
                      aria-label={name}
                      aria-pressed={key === value}
                      title={name}
                      onClick={() => {
                        onChange(key)
                        close()
                      }}
                    >
                      {image(key, 25)}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
