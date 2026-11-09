import type { DeviceItemStyle, HeroDeviceStyle } from "../../types/content"
import { NumericField } from "./AdminVisualFields"

export function DeviceStyleEditor({
  device,
  value,
  onChange,
}: {
  device: "desktop" | "mobile"
  value?: DeviceItemStyle
  onChange: (patch: Partial<DeviceItemStyle>) => void
}) {
  return (
    <fieldset>
      <legend>{device === "desktop" ? "Desktop" : "Mobile"}</legend>
      <div className="field-grid compact-grid">
        <label className="toggle-field">
          <input
            type="checkbox"
            checked={value?.visible !== false}
            onChange={(event) => onChange({ visible: event.target.checked })}
          />
          Visível
        </label>
        <NumericField
          label="Ordem"
          value={value?.order}
          min={-20}
          max={20}
          onChange={(order) => onChange({ order })}
        />
        <NumericField
          label="Espaçamento (px)"
          value={value?.spacing}
          min={0}
          max={120}
          onChange={(spacing) => onChange({ spacing })}
        />
        <NumericField
          label="Largura (%)"
          value={value?.width}
          min={10}
          max={100}
          onChange={(width) => onChange({ width })}
        />
        <NumericField
          label="Título (px)"
          value={value?.titleSize}
          min={8}
          max={120}
          onChange={(titleSize) => onChange({ titleSize })}
        />
        <NumericField
          label="Texto (px)"
          value={value?.textSize}
          min={8}
          max={72}
          onChange={(textSize) => onChange({ textSize })}
        />
        <label>
          Alinhamento
          <select
            value={value?.textAlign ?? "left"}
            onChange={(event) =>
              onChange({
                textAlign: event.target.value as DeviceItemStyle["textAlign"],
              })
            }
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </label>
      </div>
    </fieldset>
  )
}

export function HeroDeviceEditor({
  device,
  value,
  onChange,
}: {
  device: "desktop" | "mobile"
  value?: HeroDeviceStyle
  onChange: (patch: Partial<HeroDeviceStyle>) => void
}) {
  const fields: Array<{
    key: Exclude<keyof HeroDeviceStyle, "introAlign">
    label: string
    min: number
    max: number
    desktopOnly?: boolean
  }> = [
    {
      key: "visualHeight",
      label: "Altura da foto (% viewport)",
      min: 25,
      max: 65,
      desktopOnly: true,
    },
    { key: "imageWidth", label: "Largura da foto (%)", min: 20, max: 100 },
    { key: "imageHeight", label: "Altura da foto (%)", min: 20, max: 100 },
    { key: "imagePositionX", label: "Foco horizontal (%)", min: 0, max: 100 },
    { key: "imagePositionY", label: "Foco vertical (%)", min: 0, max: 100 },
    {
      key: "yearsX",
      label: "Indicador +15: posição X (%)",
      min: 0,
      max: 100,
      desktopOnly: true,
    },
    {
      key: "yearsY",
      label: "Indicador +15: posição Y (%)",
      min: 0,
      max: 100,
      desktopOnly: true,
    },
    {
      key: "yearsWidth",
      label: "Indicador +15: largura (%)",
      min: 15,
      max: 80,
      desktopOnly: true,
    },
    { key: "badgeSize", label: "Tamanho do selo (%)", min: 12, max: 70 },
    { key: "badgeX", label: "Selo: posição X (%)", min: 0, max: 100 },
    { key: "badgeY", label: "Selo: posição Y (%)", min: 0, max: 100 },
    {
      key: "contentGap",
      label: "Espaço entre conteúdos (px)",
      min: 0,
      max: 48,
      desktopOnly: true,
    },
    {
      key: "introSize",
      label: "Frase: tamanho (px)",
      min: 8,
      max: 48,
    },
    {
      key: "introSpacing",
      label: "Frase: espaçamento (px)",
      min: 0,
      max: 120,
    },
  ]
  return (
    <fieldset>
      <legend>Fotografia e selo · {device === "desktop" ? "Desktop" : "Mobile"}</legend>
      <div className="field-grid compact-grid">
        {fields
          .filter((field) => device === "desktop" || !field.desktopOnly)
          .map((field) => (
            <NumericField
              key={field.key}
              label={field.label}
              value={value?.[field.key]}
              min={field.min}
              max={field.max}
              onChange={(nextValue) => onChange({ [field.key]: nextValue })}
            />
          ))}
        <label>
          Frase: alinhamento
          <select
            value={value?.introAlign ?? (device === "desktop" ? "center" : "right")}
            onChange={(event) =>
              onChange({
                introAlign: event.target.value as HeroDeviceStyle["introAlign"],
              })
            }
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </label>
      </div>
    </fieldset>
  )
}
