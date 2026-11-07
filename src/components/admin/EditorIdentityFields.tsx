import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { HeroColorPicker } from "./HeroVisualPickers"
import {
  IDENTITY_NUMERIC_SIZES,
  identityCatalogFromRows,
  type IdentityTokenRow,
} from "../../lib/identity-catalog"

type Catalog = Record<string, IdentityTokenRow>
const defaults = identityCatalogFromRows([])
const IdentityOptionsContext = createContext<Catalog>(defaults)

const colorVariables: Record<string, string> = {
  "color.orange": "--orange",
  "color.ink": "--ink",
  "color.paper": "--paper",
  "color.cream": "--cream",
  "color.muted": "--muted",
  "color.orangeDark": "--orange-dark",
  "color.white": "--white",
}

export function useEditorIdentityOptions() {
  const [catalog, setCatalog] = useState<Catalog>(defaults)
  useEffect(() => {
    let mounted = true
    void supabase
      ?.from("design_tokens")
      .select("token_key,token_value,value_type,scope,status,display_name,style_config")
      .then(({ data, error }) => {
        if (mounted && !error && data) setCatalog(identityCatalogFromRows(data))
      })
    return () => {
      mounted = false
    }
  }, [])
  return catalog
}

export const EditorIdentityProvider = IdentityOptionsContext.Provider

function cssVar(tokenKey: string) {
  const variable = colorVariables[tokenKey]
  return variable ? `var(${variable})` : ""
}

export function IdentityColorSelect({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string
  value?: string
  fallback: string
  onChange: (value: string) => void
}) {
  const catalog = useContext(IdentityOptionsContext)
  const current = value || fallback
  const selected = Object.values(catalog).find(
    (item) => item.value_type === "color" && (
      cssVar(item.token_key) === current ||
      item.token_key === current ||
      item.token_value.toLowerCase() === current.toLowerCase()
    ),
  )
  return (
    <div className="editor-identity-color-field">
      <HeroColorPicker label={label} value={current} catalog={catalog}
        onChange={(next) => {
          if (cssVar(next)) onChange(cssVar(next))
        }} />
      {!selected && (
        <small>Valor existente (preservado): {current}. Escolha uma amostra para alterar.</small>
      )}
    </div>
  )
}

export function IdentityFontSelect({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
}) {
  const catalog = useContext(IdentityOptionsContext)
  const choices = Object.values(catalog).filter((item) => item.value_type === "font")
  const current = value || "Big Shoulders Display"
  const selected = choices.find(
    (item) => item.token_key === current || item.token_value === current,
  )
  return (
    <label>
      {label}
      <select
        value={selected?.token_key ?? "__custom__"}
        onChange={(event) => {
          if (event.target.value !== "__custom__") onChange(event.target.value)
        }}
      >
        {!selected && <option value="__custom__">Fonte atual: {current}</option>}
        {choices.map((item) => (
          <option value={item.token_key} key={item.token_key}>
            {item.display_name} · {item.token_value}
          </option>
        ))}
      </select>
    </label>
  )
}

export function IdentityNumericSize({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value?: number
  min: number
  max: number
  onChange: (value?: number) => void
}) {
  const catalog = useContext(IdentityOptionsContext)
  const presets = Object.values(catalog)
    .filter((item) => item.token_key.startsWith("typography."))
    .map((item) => Number(item.token_value))
    .filter((size) => Number.isFinite(size))
  const choices = [
    ...new Set([...IDENTITY_NUMERIC_SIZES, ...presets, ...(value === undefined ? [] : [value])]),
  ]
    .filter((size) => size >= min && size <= max)
    .sort((a, b) => a - b)
  return (
    <label>
      {label}
      <select
        value={value === undefined ? "" : String(value)}
        onChange={(event) =>
          onChange(event.target.value === "" ? undefined : Number(event.target.value))
        }
      >
        <option value="">Padrão (responsivo)</option>
        {choices.map((size) => {
          const namedStyles = Object.values(catalog)
            .filter(
              (item) =>
                item.token_key.startsWith("typography.") &&
                (Number(item.style_config.desktopPx) === size ||
                  Number(item.style_config.mobilePx) === size),
            )
            .map((item) => item.display_name)
          return (
            <option key={size} value={size}>
              {size} px{namedStyles.length > 0 ? ` · ${namedStyles.join(" / ")}` : ""}
            </option>
          )
        })}
      </select>
    </label>
  )
}
