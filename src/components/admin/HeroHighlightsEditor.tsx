import type { ContentItem, HeroTextFormat } from "../../types/content"
import type { IdentityTokenRow } from "../../lib/identity-catalog"
import { HeroItemFields } from "./HeroItemFields"
import { Icon } from "../ui/Icons"
import "./HeroHighlightsEditor.css"

/**
 * The Hero's four sidebar highlights belong to one editorial group.
 * Each highlight remains a separate entry in the existing content_blocks.items array.
 * There is deliberately no migration or public-layout change.
 */
export function HeroHighlightsEditor({
  items,
  catalog,
  onUpdate,
  onFormat,
  onMove,
  onRemove,
}: {
  items: ContentItem[]
  catalog: Record<string, IdentityTokenRow>
  onUpdate: (index: number, patch: Partial<ContentItem>) => void
  onFormat: (index: number, key: string, next?: HeroTextFormat) => void
  onMove: (index: number, direction: -1 | 1) => void
  onRemove: (index: number) => void
}) {
  const highlights = items.slice(1)
  if (!highlights.length) return null

  return (
    <details className="hero-highlights-editor">
      <summary>
        <span className="hero-highlights-heading">
          <strong>Itens de Destaque</strong>
          <small>{highlights.length} destaques · textos, ícones e formatação</small>
        </span>
        <Icon name="down" size={18} />
      </summary>
      <div className="hero-highlights-editor-items">
        {highlights.map((item, offset) => {
          const index = offset + 1
          return (
            <fieldset className="hero-highlight-entry" key={index}>
              <legend>Destaque {String(index).padStart(2, "0")}</legend>
              <p className="hero-highlight-caption">{item.title || "Sem título"}</p>
              <div className="field-grid">
                <HeroItemFields
                  item={item}
                  index={index}
                  panel="a"
                  catalog={catalog}
                  onUpdate={(patch) => onUpdate(index, patch)}
                  onFormat={(key, next) => onFormat(index, key, next)}
                />
                <fieldset className="hero-highlight-icon-choice field-wide">
                  <legend>Ícone do destaque</legend>
                  <div className="hero-highlight-icon-buttons">
                    <button type="button" aria-label={`Seta diagonal no destaque ${index}`}
                      aria-pressed={item.icon !== "none"}
                      className={item.icon !== "none" ? "active" : ""}
                      onClick={() => onUpdate(index, { icon: "arrow" })}>
                      <Icon name="arrow" size={20} />
                    </button>
                    <button type="button" aria-label={`Sem ícone no destaque ${index}`}
                      aria-pressed={item.icon === "none"}
                      className={item.icon === "none" ? "active" : ""}
                      onClick={() => onUpdate(index, { icon: "none" })}>
                      —
                    </button>
                  </div>
                </fieldset>
              </div>
              <div className="hero-highlight-controls">
                <button type="button" aria-label={`Subir destaque ${index}`}
                  disabled={index === 1} onClick={() => onMove(index, -1)}>
                  <Icon name="up" size={17} />
                </button>
                <button type="button" aria-label={`Descer destaque ${index}`}
                  disabled={index === items.length - 1} onClick={() => onMove(index, 1)}>
                  <Icon name="down" size={17} />
                </button>
                <button type="button" aria-label={`Remover destaque ${index}`}
                  onClick={() => onRemove(index)}>
                  <Icon name="close" size={17} />
                </button>
              </div>
            </fieldset>
          )
        })}
      </div>
    </details>
  )
}
