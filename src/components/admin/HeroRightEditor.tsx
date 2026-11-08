import type { ContentItem, HeroTextFormat, HeroVisualConfig } from "../../types/content"
import type { IdentityTokenRow } from "../../lib/identity-catalog"
import { HeroItemFields } from "./HeroItemFields"
import { HeroFormattingButton } from "./HeroFormattingButton"
import { HeroColorPicker, HeroIconPicker } from "./HeroVisualPickers"
import { Icon } from "../ui/Icons"
import "./HeroRightEditor.css"

type Catalog = Record<string, IdentityTokenRow>
type Option = { id: string; slug: string; title: string }

const themes = [
  { key: "corporativa", name: "Comunicação Corporativa" },
  { key: "projetos", name: "Gestão e execução de projetos" },
  { key: "eventos", name: "Relações Públicas e Gestão de Eventos" },
  { key: "marketing", name: "Marketing Digital, Branding e Performance" },
  { key: "imprensa", name: "Imprensa e Influenciadores" },
]

/** Presentation-only grouping. Original panel B items 0–10 remain at the same indexes in JSONB. */
export function HeroRightEditor({
  items, title, subtitle, sections, catalog, onTitleChange, onSubtitleChange,
  onUpdateItem, onUpdateHero, onFormat, onHeroFormat, onMove, onRemove,
}: {
  items: ContentItem[]
  title: string
  subtitle: string
  sections: Option[]
  catalog: Catalog
  onTitleChange: (value: string) => void
  onSubtitleChange: (value: string) => void
  onUpdateItem: (index: number, patch: Partial<ContentItem>) => void
  onUpdateHero: (patch: Partial<HeroVisualConfig>) => void
  onFormat: (index: number, key: string, next?: HeroTextFormat) => void
  onHeroFormat: (key: string, next?: HeroTextFormat) => void
  onMove: (index: number, direction: -1 | 1) => void
  onRemove: (index: number) => void
}) {
  const first = items[0]
  const hero = first?.hero
  if (!first) return <p role="status">O bloco direito do Hero não contém itens.</p>
  const formatHero = (name: string, key: string) => (
    <HeroFormattingButton
      label={name} value={hero?.fieldFormats?.[key]} catalog={catalog}
      onChange={(value) => onHeroFormat(key, value)}
    />
  )
  const linkOptions = sections.filter((section) => section.slug !== "perfil")
  const employerOptions = linkOptions.filter((section) =>
    ["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"].includes(section.slug),
  )

  return (
    <div className="hero-right-editor">
      <fieldset className="hero-right-group" aria-label="Título Cabeçalho">
        <legend>Título Cabeçalho</legend>
        <label className="field-wide">
          <span className="hero-field-label">
            Título principal {formatHero("título principal", "title")}
          </span>
          <input value={title} onChange={(event) => onTitleChange(event.target.value)} />
        </label>
      </fieldset>

      <fieldset className="hero-right-group" aria-label="Subtítulo">
        <legend>Subtítulo</legend>
        <label className="field-wide">
          <span className="hero-field-label">
            Descritivo {formatHero("descritivo", "role")}
          </span>
          <textarea rows={3} value={subtitle}
            onChange={(event) => onSubtitleChange(event.target.value)} />
        </label>
      </fieldset>

      <fieldset className="hero-right-group" aria-label="Botões Principais">
        <legend>Botões Principais</legend>
        <p className="hero-right-help">Cinco temas da navegação superior · título, número, destino e formatação.</p>
        <div className="hero-right-entries">
          {items.slice(0, 5).map((item, index) => (
            <details key={index} className="hero-right-entry">
              <summary>
                <span><b>{String(index + 1).padStart(2, "0")}</b>
                  <strong>{item.title || "Tema sem título"}</strong></span>
                <Icon name="down" size={17} />
              </summary>
              <div className="hero-right-entry-body field-grid">
                <HeroItemFields item={item} index={index} panel="b" catalog={catalog}
                  onUpdate={(patch) => onUpdateItem(index, patch)}
                  onFormat={(key, next) => onFormat(index, key, next)} />
                <label>
                  Tema selecionado na seção 03
                  <select value={item.themeKey || themes[index]?.key || "corporativa"}
                    onChange={(event) => onUpdateItem(index, { themeKey: event.target.value })}>
                    {themes.map((theme) => (
                      <option key={theme.key} value={theme.key}>{theme.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Link / destino do botão
                  <select value={item.targetSlug ?? "resultados"}
                    onChange={(event) => onUpdateItem(index, { targetSlug: event.target.value })}>
                    {linkOptions.map((section) => (
                      <option value={section.slug} key={section.id}>{section.title} (#{section.slug})</option>
                    ))}
                  </select>
                </label>
                <div className="hero-right-item-controls">
                  <button type="button" aria-label={`Subir tema ${index + 1}`}
                    disabled={index === 0} onClick={() => onMove(index, -1)}>
                    <Icon name="up" size={17} />
                  </button>
                  <button type="button" aria-label={`Descer tema ${index + 1}`}
                    disabled={index === 4} onClick={() => onMove(index, 1)}>
                    <Icon name="down" size={17} />
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      </fieldset>

      <fieldset className="hero-right-group" aria-label="Área de Destaques">
        <legend>Área de Destaques</legend>
        <label className="field-wide">
          <span className="hero-field-label">
            Título da área {formatHero("título da área de destaques", "secondaryTitle")}
          </span>
          <input value={hero?.secondaryTitle ?? "Experiência e atuação"}
            onChange={(event) => onUpdateHero({ secondaryTitle: event.target.value })} />
        </label>
        <div className="hero-right-entries">
          {items.slice(5).map((item, offset) => {
            const index = offset + 5
            return (
              <details className="hero-right-entry" key={index}>
                <summary>
                  <span><b>{String(offset + 1).padStart(2, "0")}</b>
                    <strong>{item.title || "Destaque sem título"}</strong>
                    <small>{item.meta || "Sem subtítulo"}</small></span>
                  <Icon name="down" size={17} />
                </summary>
                <div className="hero-right-entry-body field-grid">
                  <HeroItemFields item={item} panel="b" index={index} catalog={catalog}
                    onUpdate={(patch) => onUpdateItem(index, patch)}
                    onFormat={(key, next) => onFormat(index, key, next)} />
                  <label className="field-wide">
                    Link do destaque / empresa de destino
                    <select value={item.targetSlug ?? ""}
                      onChange={(event) => onUpdateItem(index, { targetSlug: event.target.value })}>
                      <option value="">Sem link</option>
                      {employerOptions.map((section) => (
                        <option value={section.slug} key={section.id}>{section.title} (#{section.slug})</option>
                      ))}
                    </select>
                  </label>
                  <div className="hero-right-item-controls">
                    <button type="button" aria-label={`Subir destaque ${offset + 1}`}
                      disabled={index === 5} onClick={() => onMove(index, -1)}>
                      <Icon name="up" size={17} />
                    </button>
                    <button type="button" aria-label={`Descer destaque ${offset + 1}`}
                      disabled={index === items.length - 1} onClick={() => onMove(index, 1)}>
                      <Icon name="down" size={17} />
                    </button>
                    <button type="button" aria-label={`Remover destaque ${offset + 1}`}
                      onClick={() => onRemove(index)}>
                      <Icon name="close" size={17} />
                    </button>
                  </div>
                </div>
              </details>
            )
          })}
        </div>
        <fieldset className="hero-right-bottom-button">
          <legend>Botão inferior</legend>
          <div className="field-grid">
            <HeroIconPicker label="Ícone" value={hero?.nextIcon ?? "down"}
              onChange={(nextIcon) => onUpdateHero({ nextIcon })} />
            <HeroColorPicker label="Cor do ícone" value={hero?.nextColor ?? ""}
              allowDefault onChange={(nextColor) => onUpdateHero({ nextColor })} catalog={catalog} />
            <HeroColorPicker label="Cor de fundo" value={hero?.nextBackground ?? ""}
              allowDefault allowTransparent onChange={(nextBackground) => onUpdateHero({ nextBackground })} catalog={catalog} />
            <label>
              Link do botão inferior
              <select value={hero?.nextTarget ?? ""}
                onChange={(event) => onUpdateHero({ nextTarget: event.target.value })}>
                <option value="">Próxima seção publicada</option>
                {linkOptions.map((section) => (
                  <option value={section.slug} key={section.id}>{section.title} (#{section.slug})</option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
      </fieldset>
    </div>
  )
}
