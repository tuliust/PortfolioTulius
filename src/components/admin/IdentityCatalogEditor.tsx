import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import {
  IDENTITY_COLOR_KEYS,
  IDENTITY_FONT_KEYS,
  IDENTITY_LAYOUT_KEYS,
  IDENTITY_NUMERIC_SIZES,
  IDENTITY_TYPOGRAPHY_KEYS,
  identityCatalogFromRows,
  identityChangedRows,
  identityTokenError,
  serializeIdentityCatalog,
  type IdentityTokenRow,
} from "../../lib/identity-catalog"
import { AdminNotice } from "./AdminNotice"
import { registerAdminSaveAction } from "./AdminConfirmationHost"
import { FloatingSaveButton } from "./FloatingSaveButton"
import "./IdentityCatalogEditor.css"

type Catalog = Record<string, IdentityTokenRow>

export function IdentityCatalogEditor({
  onDirtyChange,
  entrySession,
}: {
  onDirtyChange?: (dirty: boolean) => void
  entrySession: number
}) {
  const [catalog, setCatalog] = useState<Catalog>(() => identityCatalogFromRows([]))
  const [saved, setSaved] = useState<Catalog | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const dirty =
    saved !== null && serializeIdentityCatalog(catalog) !== serializeIdentityCatalog(saved)

  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange])

  useEffect(() => {
    let mounted = true
    if (!supabase) {
      setMessage("Supabase indisponível. Nenhuma edição pode ser salva.")
      setLoading(false)
      return
    }
    void supabase
      .from("design_tokens")
      .select("token_key,token_value,value_type,scope,status,display_name,style_config")
      .then(({ data, error }) => {
        if (!mounted) return
        setLoading(false)
        if (error) {
          setMessage("Não foi possível carregar a biblioteca: " + error.message)
          return
        }
        const next = identityCatalogFromRows((data ?? []) as IdentityTokenRow[])
        setCatalog(next)
        setSaved(next)
      })
    return () => {
      mounted = false
    }
  }, [entrySession])

  function change(key: string, patch: Partial<IdentityTokenRow>) {
    setCatalog((current) => ({
      ...current,
      [key]: { ...current[key], ...patch },
    }))
  }

  function changeStyle(key: string, patch: Record<string, unknown>) {
    const previous = catalog[key]
    const nextConfig = { ...previous.style_config, ...patch }
    change(key, {
      style_config: nextConfig,
      ...(Object.prototype.hasOwnProperty.call(patch, "desktopPx")
        ? { token_value: String(patch.desktopPx) }
        : {}),
    })
  }

  async function save(): Promise<boolean> {
    if (!supabase || !saved || loading || saving) return false
    const changed = identityChangedRows(catalog, saved)
    if (changed.length === 0) return true
    for (const row of Object.values(catalog)) {
      const error = identityTokenError(row, catalog)
      if (error) {
        setMessage(row.display_name + ": " + error)
        return false
      }
    }
    setSaving(true)
    setMessage("Salvando biblioteca…")
    const payload = changed.map((row) => ({
      token_key: row.token_key,
      token_value: row.token_value,
      value_type: row.value_type,
      scope: row.scope,
      status: row.status,
      display_name: row.display_name.trim(),
      style_config: row.style_config,
    }))
    const { error } = await supabase
      .from("design_tokens")
      .upsert(payload, { onConflict: "token_key" })
    if (error) {
      setSaving(false)
      setMessage("Não foi possível salvar: " + error.message)
      return false
    }

    // Confirmar persistência efetiva antes de marcar o formulário como salvo.
    const { data, error: checkError } = await supabase
      .from("design_tokens")
      .select("token_key,token_value,value_type,scope,status,display_name,style_config")
      .in(
        "token_key",
        changed.map((row) => row.token_key),
      )
    const confirmed = new Map(
      (data ?? []).map((row) => [row.token_key as string, row as IdentityTokenRow]),
    )
    const matches = changed.every((row) => {
      const stored = confirmed.get(row.token_key)
      return (
        stored !== undefined &&
        serializeIdentityCatalog({ row }) === serializeIdentityCatalog({ row: stored })
      )
    })
    setSaving(false)
    if (checkError || !matches) {
      setMessage(
        "Gravação realizada, mas a releitura não confirmou todos os valores. Atualize a página antes de editar novamente.",
      )
      return false
    }
    setSaved(catalog)
    setMessage(changed.length + " registro(s) salvo(s) e confirmado(s) no Supabase.")
    return true
  }

  useEffect(() => registerAdminSaveAction(save), [save])

  if (loading) {
    return <section className="admin-card">Carregando biblioteca de estilos…</section>
  }
  if (!saved) {
    return (
      <section className="admin-card">
        <AdminNotice message={message || "Biblioteca indisponível."} />
      </section>
    )
  }

  return (
    <div className="identity-catalog">
      <div className="identity-catalog-intro">
        <p>
          Centralize nomes, cores e fontes. Os sete estilos tipográficos são referências do projeto
          e <strong>não alteram a página pública nesta etapa</strong>. A vinculação aos elementos do
          Editor do Site será feita na Etapa 3.
        </p>
      </div>

      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p>Paleta global</p>
            <h2>Cores da marca</h2>
          </div>
        </div>
        <div className="identity-color-grid">
          {IDENTITY_COLOR_KEYS.map((key) => {
            const item = catalog[key]
            return (
              <div className="identity-color-row" key={key}>
                <span
                  className="identity-swatch"
                  style={{
                    backgroundColor: /^#[0-9a-fA-F]{6}$/.test(item.token_value)
                      ? item.token_value
                      : "#FFFFFF",
                  }}
                  aria-hidden="true"
                />
                <label>
                  Nome da cor
                  <input
                    name={`identity-color-name-${entrySession}-${key}`}
                    autoComplete="off"
                    value={item.display_name}
                    maxLength={90}
                    onChange={(event) => change(key, { display_name: event.target.value })}
                  />
                </label>
                <label className="identity-color-value">
                  Cor HEX
                  <span>
                    <input
                      type="color"
                      value={
                        /^#[0-9a-fA-F]{6}$/.test(item.token_value) ? item.token_value : "#FFFFFF"
                      }
                      aria-label={"Selecionar " + item.display_name}
                      onChange={(event) =>
                        change(key, { token_value: event.target.value.toUpperCase() })
                      }
                    />
                    <input
                      name={`identity-color-${entrySession}-${key}`}
                      autoComplete="off"
                      value={item.token_value}
                      maxLength={7}
                      onChange={(event) => change(key, { token_value: event.target.value })}
                    />
                  </span>
                </label>
              </div>
            )
          })}
        </div>
      </section>

      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p>Famílias autorizadas</p>
            <h2>Fontes</h2>
          </div>
        </div>
        <div className="identity-font-grid">
          {IDENTITY_FONT_KEYS.map((key) => {
            const item = catalog[key]
            const isSerif = key === "font.serif"
            const options = isSerif ? ["Georgia"] : ["Big Shoulders Display", "Inter"]
            return (
              <div className="identity-font-row" key={key}>
                <label>
                  Nome da fonte no painel
                  <input
                    value={item.display_name}
                    autoComplete="off"
                    name={`identity-font-name-${entrySession}-${key}`}
                    maxLength={90}
                    onChange={(event) => change(key, { display_name: event.target.value })}
                  />
                </label>
                <label>
                  Família
                  <select
                    value={item.token_value}
                    onChange={(event) => change(key, { token_value: event.target.value })}
                  >
                    {options.map((family) => (
                      <option key={family} value={family}>
                        {family}
                      </option>
                    ))}
                  </select>
                </label>
                <div
                  className="identity-font-preview"
                  style={{ fontFamily: item.token_value }}
                  aria-label={"Prévia de " + item.display_name}
                >
                  Aa 123
                </div>
              </div>
            )
          })}
        </div>
        <small>
          As famílias usadas são Big Shoulders Display, Inter e Georgia. Fontes sem licença web não
          são disponibilizadas. Uma alteração na fonte global de títulos ou textos pode modificar a
          página pública; nenhuma foi realizada automaticamente.
        </small>
      </section>

      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p>Hierarquia tipográfica</p>
            <h2>Estilos e tamanhos</h2>
          </div>
        </div>
        <p className="identity-explanation">
          Cada estilo tem uma identificação estável e um nome editável. Os números abaixo são
          limites ou referências extraídos das regras CSS atuais, não tamanhos fixos em toda tela.
          As fórmulas originais permanecem intactas.
        </p>
        <div className="identity-type-list">
          {IDENTITY_TYPOGRAPHY_KEYS.map((key) => {
            const item = catalog[key]
            const config = item.style_config
            return (
              <fieldset className="identity-type-style" key={key}>
                <legend>{item.display_name}</legend>
                <div className="identity-type-fields">
                  <label className="identity-style-name">
                    Nome do estilo
                    <input
                      value={item.display_name}
                      name={`identity-style-name-${entrySession}-${key}`}
                      autoComplete="off"
                      maxLength={90}
                      onChange={(event) => change(key, { display_name: event.target.value })}
                    />
                  </label>
                  <label>
                    Fonte
                    <select
                      value={String(config.fontToken)}
                      onChange={(event) => changeStyle(key, { fontToken: event.target.value })}
                    >
                      {IDENTITY_FONT_KEYS.map((fontKey) => (
                        <option key={fontKey} value={fontKey}>
                          {catalog[fontKey].display_name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Cor
                    <select
                      value={String(config.colorToken)}
                      onChange={(event) => changeStyle(key, { colorToken: event.target.value })}
                    >
                      {IDENTITY_COLOR_KEYS.map((colorKey) => (
                        <option key={colorKey} value={colorKey}>
                          {catalog[colorKey].display_name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {(["desktopPx", "mobilePx"] as const).map((part) => (
                    <label key={part}>
                      {part === "desktopPx" ? "Referência desktop (px)" : "Referência mobile (px)"}
                      <select
                        value={String(config[part])}
                        onChange={(event) =>
                          changeStyle(key, { [part]: Number(event.target.value) })
                        }
                      >
                        {IDENTITY_NUMERIC_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size} px
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <div className="identity-type-baseline">
                  <small>
                    CSS atual desktop: <code>{String(config.desktopCss)}</code>
                  </small>
                  <small>
                    CSS atual mobile: <code>{String(config.mobileCss)}</code>
                  </small>
                  <small>{String(config.note ?? "")}</small>
                </div>
              </fieldset>
            )
          })}
        </div>
      </section>

      <section className="admin-card license-card">
        <div className="card-heading">
          <div>
            <p>Parâmetros existentes</p>
            <h2>Layout e movimento</h2>
          </div>
        </div>
        <div className="field-grid">
          {IDENTITY_LAYOUT_KEYS.map((key) => {
            const item = catalog[key]
            return (
              <label key={key}>
                {item.display_name}
                <input
                  type="number"
                  min="0"
                  max={key === "motion.duration" ? "1200" : "2000"}
                  value={item.token_value}
                  onChange={(event) => change(key, { token_value: event.target.value })}
                />
              </label>
            )
          })}
        </div>
      </section>

      <AdminNotice message={message} />
      <FloatingSaveButton enabled={dirty && !saving} onClick={save} label="Salvar identidade" />
    </div>
  )
}
