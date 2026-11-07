import type { ReactNode } from "react"
import type { ContentItem, HeroTextFormat, HeroVisualConfig } from "../../types/content"
import type { IdentityTokenRow } from "../../lib/identity-catalog"
import { HeroItemFields } from "./HeroItemFields"
import { HeroHighlightsEditor } from "./HeroHighlightsEditor"
import { HeroFormattingButton } from "./HeroFormattingButton"
import { HeroColorPicker, HeroIconPicker } from "./HeroVisualPickers"
import { PublishedMediaPicker } from "./PublishedMediaPicker"
import "./HeroLeftEditor.css"

type Catalog = Record<string, IdentityTokenRow>

/**
 * Editor-only presentation of the existing Hero A block.
 * Item 01 retains its original JSONB identity; highlights remain items 02–05.
 */
export function HeroLeftEditor({
  items,
  intro,
  catalog,
  onIntroChange,
  onUpdateItem,
  onUpdateHero,
  onFormat,
  onHeroFormat,
  onMove,
  onRemove,
  mobileSettings,
}: {
  items: ContentItem[]
  intro: string
  catalog: Catalog
  onIntroChange: (next: string) => void
  onUpdateItem: (index: number, patch: Partial<ContentItem>) => void
  onUpdateHero: (patch: Partial<HeroVisualConfig>) => void
  onFormat: (index: number, key: string, next?: HeroTextFormat) => void
  onHeroFormat: (key: string, next?: HeroTextFormat) => void
  onMove: (index: number, direction: -1 | 1) => void
  onRemove: (index: number) => void
  mobileSettings?: ReactNode
}) {
  const item = items[0]
  if (!item) return <p role="status">O bloco esquerdo do Hero não contém uma apresentação.</p>
  const hero = item.hero

  return (
    <div className="hero-left-editor">
      <HeroItemFields item={item} index={0} panel="a" catalog={catalog}
        onUpdate={(patch) => onUpdateItem(0, patch)}
        onFormat={(key, next) => onFormat(0, key, next)} />

      <fieldset className="hero-left-group" aria-label="Selo">
        <legend>Selo</legend>
        <div className="field-grid">
          <label className="field-wide">
            <span className="hero-field-label">
              Texto giratório
              <HeroFormattingButton label="texto giratório do selo"
                value={hero?.fieldFormats?.badgeText}
                onChange={(next) => onHeroFormat("badgeText", next)} catalog={catalog} />
            </span>
            <input value={hero?.badgeText ?? "VISÃO 360° DA COMUNICAÇÃO E MARKETING ·"}
              onChange={(event) => onUpdateHero({ badgeText: event.target.value })} />
          </label>
          <HeroIconPicker label="Ícone central" value={hero?.badgeIcon ?? "arrow"}
            onChange={(badgeIcon) => onUpdateHero({ badgeIcon })} />
          <HeroColorPicker label="Fundo do selo" value={hero?.badgeBackground ?? "#FF5414"}
            onChange={(badgeBackground) => onUpdateHero({ badgeBackground })} catalog={catalog} />
          <HeroColorPicker label="Cor do selo" value={hero?.badgeColor ?? "#171617"}
            onChange={(badgeColor) => onUpdateHero({ badgeColor })} catalog={catalog} />
          <label className="toggle-field field-wide">
            <input type="checkbox" checked={hero?.badgeVisible !== false}
              onChange={(event) => onUpdateHero({ badgeVisible: event.target.checked })} />
            Exibir selo
          </label>
        </div>
      </fieldset>

      <fieldset className="hero-left-group" aria-label="Apresentação">
        <legend>Apresentação</legend>
        <div className="field-grid">
          <div className="field-wide">
            <PublishedMediaPicker label="Foto" guidanceAsInfo iconOnlyActions
              allowFraming={false}
              guidance="Retrato vertical 3:4; sugestão 900 × 1200 px."
              ratio="3 / 4" value={item.image ?? ""} framing={item.mediaFraming}
              onFramingChange={(mediaFraming) => onUpdateItem(0, { mediaFraming })}
              onChange={(image, alt) => onUpdateItem(0, { image, alt })} />
          </div>
          <HeroColorPicker label="Fundo da seção (Hero)" allowTransparent
            value={hero?.rootBackground ?? "transparent"}
            onChange={(rootBackground) => onUpdateHero({ rootBackground })} catalog={catalog} />
          <HeroColorPicker label="Fundo da Esquerda"
            value={hero?.panelBackground ?? "#171617"}
            onChange={(panelBackground) => onUpdateHero({ panelBackground })} catalog={catalog} />
          <label className="field-wide">
            <span className="hero-field-label">
              Frase editorial
              <HeroFormattingButton label="frase editorial" value={hero?.fieldFormats?.intro}
                onChange={(next) => onHeroFormat("intro", next)} catalog={catalog} />
            </span>
            <textarea rows={3} value={intro} onChange={(event) => onIntroChange(event.target.value)} />
          </label>
          <HeroColorPicker label="Cor da frase" value={hero?.introColor ?? "#FFFFFF"}
            onChange={(introColor) => onUpdateHero({ introColor })} catalog={catalog} />
        </div>
        {mobileSettings && (
          <details className="hero-left-mobile-details">
            <summary>Estilo e apresentação mobile</summary>
            {mobileSettings}
          </details>
        )}
      </fieldset>

      <HeroHighlightsEditor items={items} catalog={catalog} onUpdate={onUpdateItem}
        onFormat={onFormat} onMove={onMove} onRemove={onRemove} />
    </div>
  )
}
