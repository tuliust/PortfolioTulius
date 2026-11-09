import { IdentityColorSelect, IdentityNumericSize } from "./EditorIdentityFields"

/** Shared numeric and color fields for all visual editing areas. */
function optionalNumber(value: string) {
  return value === "" ? undefined : Number(value)
}

export function ColorField(props: {
  label: string
  value?: string
  fallback: string
  onChange: (value: string) => void
}) {
  return <IdentityColorSelect {...props} />
}

export function NumericField({
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
  const typography =
    /^(Título \(px\)|Texto \(px\)|Tamanho máximo do título|Tamanho máximo do nome|Tamanho máximo do indicador|Frase: tamanho \(px\))/.test(
      label,
    )
  if (typography) {
    return (
      <IdentityNumericSize label={label} value={value} min={min} max={max} onChange={onChange} />
    )
  }
  return (
    <label>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ""}
        placeholder="Automático"
        onChange={(event) => onChange(optionalNumber(event.target.value))}
      />
    </label>
  )
}
