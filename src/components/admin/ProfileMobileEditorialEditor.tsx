import type {
  MobileEditorialBottom,
  MobileEditorialFont,
  MobileEditorialMiddle,
  MobileEditorialTop,
  MobileProfileEditorial,
} from "../../types/content"
import {
  MOBILE_PROFILE_EDITORIAL_DEFAULTS,
  mobileProfileEditorial,
} from "../../lib/mobile-profile-editorial"
import { IdentityFontSelect } from "./EditorIdentityFields"
import { PublishedMediaPicker } from "./PublishedMediaPicker"
import { ColorField, NumericField } from "./AdminVisualFields"

function MobileEditorialFontField({
  label,
  value,
  onChange,
}: {
  label: string
  value?: MobileEditorialFont
  onChange: (value: MobileEditorialFont) => void
}) {
  return (
    <IdentityFontSelect
      label={label}
      value={value}
      onChange={(selected) => onChange(selected as MobileEditorialFont)}
    />
  )
}

export function ProfileMobileEditorialEditor({
  value,
  onChange,
}: {
  value?: MobileProfileEditorial
  onChange: (value: MobileProfileEditorial) => void
}) {
  const current = mobileProfileEditorial(value)
  const updateTop = (patch: Partial<MobileEditorialTop>) =>
    onChange({ ...current, top: { ...current.top, ...patch } })
  const updateMiddle = (patch: Partial<MobileEditorialMiddle>) =>
    onChange({ ...current, middle: { ...current.middle, ...patch } })
  const updateBottom = (patch: Partial<MobileEditorialBottom>) =>
    onChange({ ...current, bottom: { ...current.bottom, ...patch } })

  return (
    <fieldset className="admin-card mobile360-admin-config">
      <legend>Abertura Editorial 360° — somente mobile</legend>
      <p>
        O desktop mantém a composição existente. Este editor grava as três áreas no mesmo JSONB
        publicado; a imagem exclusiva mobile nunca substitui a foto do desktop.
      </p>
      <label className="toggle-field">
        <input
          type="checkbox"
          checked={current.enabled === true}
          onChange={(event) => onChange({ ...current, enabled: event.target.checked })}
        />
        Ativar a nova composição editorial mobile
      </label>
      <label className="field-wide">
        Título grande exclusivo do mobile — uma linha por faixa
        <textarea
          rows={3}
          value={current.headline}
          onChange={(event) => onChange({ ...current, headline: event.target.value })}
        />
        <small>
          A última linha aparece na cor de destaque. Valor inicial: CONEXÕES / AUTÊNTICAS. /
          INOVAÇÃO.
        </small>
      </label>
      <fieldset className="mobile360-admin-zone">
        <legend>Área 1 · Abertura grafite</legend>
        <div className="field-grid compact-grid">
          <ColorField
            label="Fundo da área 1"
            value={current.top.background}
            fallback={MOBILE_PROFILE_EDITORIAL_DEFAULTS.top.background}
            onChange={(background) => updateTop({ background })}
          />
          <MobileEditorialFontField
            label="Fonte do título"
            value={current.top.fontFamily}
            onChange={(fontFamily) => updateTop({ fontFamily })}
          />
          <ColorField
            label="Cor das linhas principais"
            value={current.top.textColor}
            fallback="#FFFFFF"
            onChange={(textColor) => updateTop({ textColor })}
          />
          <ColorField
            label="Cor da última linha"
            value={current.top.accentColor}
            fallback="#FF5414"
            onChange={(accentColor) => updateTop({ accentColor })}
          />
          <ColorField
            label="Cor do texto de apoio"
            value={current.top.supportColor}
            fallback="#FFFFFF"
            onChange={(supportColor) => updateTop({ supportColor })}
          />
          <MobileEditorialFontField
            label="Fonte do texto de apoio"
            value={current.top.supportFontFamily}
            onChange={(supportFontFamily) => updateTop({ supportFontFamily })}
          />
          <NumericField
            label="Tamanho máximo do título (px)"
            value={current.top.headlineSize}
            min={38}
            max={140}
            onChange={(headlineSize) => updateTop({ headlineSize })}
          />
          <NumericField
            label="Espaçamento vertical (px)"
            value={current.top.paddingY}
            min={0}
            max={120}
            onChange={(paddingY) => updateTop({ paddingY })}
          />
          <label className="toggle-field">
            <input
              type="checkbox"
              checked={current.top.showHeadline !== false}
              onChange={(event) => updateTop({ showHeadline: event.target.checked })}
            />
            Exibir título grande
          </label>
          <label className="toggle-field">
            <input
              type="checkbox"
              checked={current.top.showSupport !== false}
              onChange={(event) => updateTop({ showSupport: event.target.checked })}
            />
            Exibir texto de apoio existente
          </label>
        </div>
      </fieldset>
      <fieldset className="mobile360-admin-zone">
        <legend>Selo do painel B · acima de Áreas de Atuação</legend>
        <div className="field-grid compact-grid">
          <ColorField
            label="Fundo da área 2"
            value={current.middle.background}
            fallback="#FAFAFA"
            onChange={(background) => updateMiddle({ background })}
          />
          <MobileEditorialFontField
            label="Fonte da inscrição do selo"
            value={current.middle.fontFamily}
            onChange={(fontFamily) => updateMiddle({ fontFamily })}
          />
          <ColorField
            label="Cor do selo e da seta"
            value={current.middle.textColor}
            fallback="#FF5414"
            onChange={(textColor) => updateMiddle({ textColor })}
          />
          <NumericField
            label="Tamanho do selo (px)"
            value={current.middle.badgeSize}
            min={100}
            max={400}
            onChange={(badgeSize) => updateMiddle({ badgeSize })}
          />
          <NumericField
            label="Espaçamento vertical (px)"
            value={current.middle.paddingY}
            min={0}
            max={120}
            onChange={(paddingY) => updateMiddle({ paddingY })}
          />
          <label className="toggle-field">
            <input
              type="checkbox"
              checked={current.middle.showBadge !== false}
              onChange={(event) => updateMiddle({ showBadge: event.target.checked })}
            />
            Exibir selo circular
          </label>
          <label className="field-wide">
            Inscrição do selo exclusiva do mobile
            <input
              value={current.badgeText ?? ""}
              onChange={(event) => onChange({ ...current, badgeText: event.target.value })}
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="mobile360-admin-zone">
        <legend>Área 3 · Apresentação clara</legend>
        <div className="field-grid compact-grid">
          <ColorField
            label="Fundo da área 3"
            value={current.bottom.background}
            fallback="#FAFAFA"
            onChange={(background) => updateBottom({ background })}
          />
          <MobileEditorialFontField
            label="Fonte do nome e experiência"
            value={current.bottom.fontFamily}
            onChange={(fontFamily) => updateBottom({ fontFamily })}
          />
          <ColorField
            label="Cor do nome e botão"
            value={current.bottom.textColor}
            fallback="#171617"
            onChange={(textColor) => updateBottom({ textColor })}
          />
          <ColorField
            label="Cor de destaque e indicador"
            value={current.bottom.accentColor}
            fallback="#FF5414"
            onChange={(accentColor) => updateBottom({ accentColor })}
          />
          <ColorField
            label="Cor da descrição"
            value={current.bottom.descriptionColor}
            fallback="#171617"
            onChange={(descriptionColor) => updateBottom({ descriptionColor })}
          />
          <MobileEditorialFontField
            label="Fonte da descrição"
            value={current.bottom.descriptionFontFamily}
            onChange={(descriptionFontFamily) => updateBottom({ descriptionFontFamily })}
          />
          <NumericField
            label="Largura da fotografia (%)"
            value={current.bottom.photoWidth}
            min={25}
            max={65}
            onChange={(photoWidth) => updateBottom({ photoWidth })}
          />
          <NumericField
            label="Tamanho máximo do nome (px)"
            value={current.bottom.nameSize}
            min={20}
            max={100}
            onChange={(nameSize) => updateBottom({ nameSize })}
          />
          <NumericField
            label="Tamanho máximo do indicador (px)"
            value={current.bottom.yearsSize}
            min={25}
            max={120}
            onChange={(yearsSize) => updateBottom({ yearsSize })}
          />
          <NumericField
            label="Espaçamento vertical (px)"
            value={current.bottom.paddingY}
            min={0}
            max={120}
            onChange={(paddingY) => updateBottom({ paddingY })}
          />
          {(
            [
              ["showPhoto", "Exibir fotografia"],
              ["showName", "Exibir nome"],
              ["showExperience", "Exibir +15 ANOS e descrição"],
              ["showArrow", "Exibir botão de seta para baixo"],
            ] as const
          ).map(([key, label]) => (
            <label className="toggle-field" key={key}>
              <input
                type="checkbox"
                checked={current.bottom[key] !== false}
                onChange={(event) => updateBottom({ [key]: event.target.checked })}
              />
              {label}
            </label>
          ))}
        </div>
        <PublishedMediaPicker
          label="Fotografia exclusiva da área 3 mobile"
          value={current.mobileImage ?? ""}
          onChange={(mobileImage, mobileAlt) => onChange({ ...current, mobileImage, mobileAlt })}
          framing={current.mobileFraming}
          onFramingChange={(mobileFraming) => onChange({ ...current, mobileFraming })}
          guidance="Retrato vertical exclusivo do mobile, preferencialmente 3:4; o original desktop não é alterado."
          ratio="3 / 4"
        />
        <small>
          Até selecionar outra fotografia publicada na biblioteca, somente a composição mobile usa
          provisoriamente a mesma imagem já aprovada para o desktop.
        </small>
      </fieldset>
    </fieldset>
  )
}
