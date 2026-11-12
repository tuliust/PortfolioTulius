import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { withOpenGraphImage } from "../../lib/media-selection"
import { FALLBACK_FAVICON, withSiteFavicon } from "../../lib/site-icons"
import { registerAdminSaveAction } from "./AdminConfirmationHost"
import { AdminNotice } from "./AdminNotice"
import { FloatingSaveButton } from "./FloatingSaveButton"
import { PublishedMediaPicker } from "./PublishedMediaPicker"

/** Global SEO editor. Retains the existing atomic SEO RPC and field structure. */
export function SeoStudio({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const [page, setPage] = useState<Record<string, any> | null>(null)
  const [savedSeo, setSavedSeo] = useState("")
  const [settings, setSettings] = useState<Record<string, any> | null>(null)
  const [message, setMessage] = useState("")
  const seoDirty = Boolean(
    page && settings && savedSeo && JSON.stringify({ page, settings }) !== savedSeo,
  )
  useEffect(() => onDirtyChange?.(seoDirty), [seoDirty, onDirtyChange])
  useEffect(() => {
    void Promise.all([
      supabase?.from("pages").select("*").eq("slug", "home").maybeSingle(),
      supabase?.from("site_settings").select("*").limit(1).maybeSingle(),
    ]).then(([pageResult, settingsResult]) => {
      const loadedPage = pageResult?.data ?? null
      const loadedSettings = settingsResult?.data ?? {
        site_title: "",
        locale: "pt-BR",
        description: "",
        seo_json: {},
        status: "draft",
      }
      setPage(loadedPage)
      setSettings(loadedSettings)
      setSavedSeo(JSON.stringify({ page: loadedPage, settings: loadedSettings }))
    })
  }, [])
  async function save(): Promise<boolean> {
    if (!supabase || !page || !settings) return false
    if (!page.id || !settings.id) {
      setMessage("Página ou configurações de SEO ausentes. Nada foi alterado.")
      return false
    }
    setMessage("Salvando SEO…")
    const { error } = await supabase.rpc("save_home_seo_atomic", {
      p_page_id: page.id,
      p_settings_id: settings.id,
      p_page_seo_title: page.seo_title,
      p_page_seo_description: page.seo_description,
      p_site_title: settings.site_title,
      p_site_description: settings.description,
      p_locale: settings.locale,
      p_seo_json: settings.seo_json ?? {},
      p_status: settings.status,
    })
    setMessage(
      error?.message ??
        "SEO salvo atomicamente. Metadados para robôs serão regenerados no próximo deploy.",
    )
    if (!error) setSavedSeo(JSON.stringify({ page, settings }))
    return !error
  }
  useEffect(() => registerAdminSaveAction(save, () => seoDirty), [save, seoDirty])

  return (
    <>
      <header className="admin-header">
        <div>
          <p>Descoberta</p>
          <h1>SEO e metadados</h1>
          <span>Configurações globais e da página principal</span>
        </div>
        <FloatingSaveButton enabled={seoDirty} onClick={save} label="Salvar SEO" />
      </header>
      {page && settings && (
        <section className="admin-card editor-form">
          <div className="field-grid">
            <label>
              Título do site
              <input
                value={settings.site_title}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    site_title: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Idioma
              <input
                value={settings.locale}
                onChange={(event) => setSettings({ ...settings, locale: event.target.value })}
              />
            </label>
            <label className="field-wide">
              Descrição global
              <textarea
                value={settings.description ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    description: event.target.value,
                  })
                }
              />
            </label>
            <label className="field-wide">
              Título SEO
              <input
                value={page.seo_title ?? ""}
                onChange={(event) => setPage({ ...page, seo_title: event.target.value })}
              />
            </label>
            <label className="field-wide">
              Descrição SEO
              <textarea
                value={page.seo_description ?? ""}
                onChange={(event) => setPage({ ...page, seo_description: event.target.value })}
              />
            </label>
            <div className="field-wide">
              <PublishedMediaPicker
                label="Imagem Open Graph (compartilhamento)"
                guidance="1200 × 630 px (1,91:1). Redes sociais usam o arquivo original; prepare o recorte antes do upload."
                ratio="1200 / 630"
                value={settings.seo_json?.ogImage ?? ""}
                onChange={(ogImage) =>
                  setSettings({
                    ...settings,
                    seo_json: withOpenGraphImage(settings.seo_json, ogImage),
                  })
                }
              />
              <small>
                Selecione uma imagem publicada. A alteração dos metadados HTML será aplicada no
                próximo deploy após salvar o SEO.
              </small>
            </div>
            <div className="field-wide">
              <PublishedMediaPicker
                label="Favicon e ícone de início (Apple)"
                guidance="Imagem quadrada, preferencialmente PNG. Clique em Escolher da biblioteca e use Enviar mídia para fazer o upload. O mesmo arquivo será utilizado como favicon e ícone Apple após salvar."
                ratio="1 / 1"
                value={settings.seo_json?.faviconUrl || FALLBACK_FAVICON}
                allowFraming={false}
                allowStaticSiteIcon
                iconOnlyActions={false}
                onChange={(faviconUrl) =>
                  setSettings({
                    ...settings,
                    seo_json: withSiteFavicon(settings.seo_json, faviconUrl),
                  })
                }
              />
              <small>
                O arquivo enviado entra no catálogo público de mídias. Salve o SEO para persistir
                a seleção no Supabase. O favicon é atualizado na página aberta; o HTML de
                atalhos e robôs é atualizado no próximo build/publicação.
              </small>
            </div>
            <label className="field-wide">
              Canonical
              <input
                value={settings.seo_json?.canonical ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    seo_json: {
                      ...(settings.seo_json ?? {}),
                      canonical: event.target.value,
                    },
                  })
                }
                placeholder="https://tulius.work/"
              />
              <small>
                Domínio verificado na Vercel: https://tulius.work/. O domínio tuliust.work não está
                associado a este projeto. Metadados estáticos, sitemap e robots.txt são atualizados
                no próximo deploy.
              </small>
            </label>
            <label>
              Status
              <select
                value={settings.status}
                onChange={(event) => setSettings({ ...settings, status: event.target.value })}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </label>
          </div>
          <AdminNotice message={message} />
        </section>
      )}
    </>
  )
}
