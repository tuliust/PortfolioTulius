import type { ContentItem, HeroTextFormat } from "../../types/content"
import type { IdentityTokenRow } from "../../lib/identity-catalog"
import { HeroFormattingButton } from "./HeroFormattingButton"

type Catalog = Record<string, IdentityTokenRow>

/** Profile-specific fields. Other sections retain their unchanged generic item editor. */
export function HeroItemFields({
  item, index, panel, catalog, onUpdate, onFormat,
}: {
  item: ContentItem
  index: number
  panel: "a" | "b"
  catalog: Catalog
  onUpdate: (patch: Partial<ContentItem>) => void
  onFormat: (key: string, value?: HeroTextFormat) => void
}) {
  const format = (name: string, key: string) => (
    <HeroFormattingButton label={name} value={item.fieldFormats?.[key]}
      onChange={(next) => onFormat(key, next)} catalog={catalog} />
  )
  const title = (
    <label>
      <span className="hero-field-label">
        {panel === "a" ? "Título do destaque" : index < 5 ? "Título do botão principal" : "Título do item"}
        {format("título do item", "title")}
      </span>
      <input value={item.title} onChange={(e) => onUpdate({ title: e.target.value })} />
    </label>
  )
  const text = (
    <label className="field-wide">
      <span className="hero-field-label">
        {panel === "a" ? "Subtítulo do destaque" : index < 5 ? "Descrição do botão" : "Descrição do item"}
        {format("texto do item", "text")}
      </span>
      <textarea rows={3} value={item.text ?? ""} onChange={(e) => onUpdate({ text: e.target.value })} />
    </label>
  )
  return (
    <>
      {panel === "a" && index === 0 ? (
        <fieldset className="hero-message-group field-wide">
          <legend>Mensagem principal</legend>
          <div className="field-grid">
            <label>
              <span className="hero-field-label">Texto grande {format("texto grande", "title")}</span>
              <input aria-label="Mensagem principal, texto grande" value={item.title}
                onChange={(e) => onUpdate({ title: e.target.value })} />
            </label>
            <label>
              <span className="hero-field-label">Texto pequeno {format("texto pequeno", "text")}</span>
              <textarea aria-label="Mensagem principal, texto pequeno" rows={3}
                value={item.text ?? ""} onChange={(e) => onUpdate({ text: e.target.value })} />
            </label>
          </div>
        </fieldset>
      ) : (
        <>
          {title}
          {((panel === "b" && index < 5) || Boolean(item.label?.trim())) && (
            <label>
              <span className="hero-field-label">
                {panel === "b" && index < 5 ? "Rótulo / número" : "Rótulo"}
                {format("rótulo do item", "label")}
              </span>
              <input value={item.label ?? ""} onChange={(e) => onUpdate({ label: e.target.value })} />
            </label>
          )}
          {text}
          {Boolean(item.meta?.trim()) && (
            <label>
              <span className="hero-field-label">
                {panel === "b" && index >= 5 ? "Subtítulo do item" : "Informação complementar"}
                {format("subtítulo do item", "meta")}
              </span>
              <input value={item.meta ?? ""} onChange={(e) => onUpdate({ meta: e.target.value })} />
            </label>
          )}
        </>
      )}
      {Boolean(item.value?.trim()) && (
        <label>
          Valor / métrica
          <input value={item.value ?? ""} onChange={(e) => onUpdate({ value: e.target.value })} />
        </label>
      )}
    </>
  )
}
