import { readFile, writeFile } from "node:fs/promises"
import { syncProfilePreload } from "./portrait-preload.mjs"

const outputPath = new URL("../dist/index.html", import.meta.url)
const fallbackCanonical = "https://tulius.work/"
const fallbackTitle = "Tulius Tsangaropulos — Comunicação e Estratégia"
const fallbackDescription =
  "Portfólio e trajetória profissional em comunicação corporativa, jornalismo, reputação e estratégia."

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function secureHttps(value) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.href : null
  } catch { return null }
}
function safeFavicon(value) {
  if (typeof value !== "string" || !value.trim()) return null
  const candidate = value.trim()
  if (/^\/[a-zA-Z0-9/_-]+(?:\.[a-zA-Z0-9_-]+)?$/.test(candidate) && !candidate.includes(".."))
    return candidate
  return candidate.startsWith("https://") && !candidate.includes("\\")
    ? secureHttps(candidate) : null
}
function replaceIconLink(html, rel, url) {
  const tag = `<link rel="${rel}" href="${escapeHtml(url)}" />`
  const regex = new RegExp(`<link\\s+[^>]*\\brel=["']${rel}["'][^>]*>`, "i")
  return regex.test(html) ? html.replace(regex, tag) : html.replace("</head>", `  ${tag}\n  </head>`)
}
// A loopback exception is available only in explicit isolated P4 CI runs.
function allowSyntheticLocalSeo(base) {
  return process.env.P4_LOCAL_SYNTHETIC_SEO === "true" &&
    process.env.P5_LOCAL_URL === "http://127.0.0.1:54321/" &&
    base === "http://127.0.0.1:54321"
}
function replaceMeta(html, name, content, attribute = "name") {
  const match = new RegExp(`<meta\\b[^>]*\\b${attribute}=["']${name}["'][^>]*>`, "i")
  const tag = `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`
  return match.test(html) ? html.replace(match, tag) : html.replace("</head>", `  ${tag}\n  </head>`)
}
function replaceCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`
  const match = /<link\s+rel=["']canonical["'][^>]*>/i
  return match.test(html) ? html.replace(match, tag) : html.replace("</head>", `  ${tag}\n  </head>`)
}
async function getPublished(table, columns, filters) {
  const base = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!base || !key || (!secureHttps(base) && !allowSyntheticLocalSeo(base))) return null
  const query = new URL(`${base}/rest/v1/${table}`)
  query.searchParams.set("select", columns)
  for (const [column, predicate] of Object.entries(filters))
    query.searchParams.set(column, predicate)
  query.searchParams.set("limit", "1")
  const response = await fetch(query, {
    headers: { apikey: key, Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`Supabase metadata HTTP ${response.status}`)
  const data = await response.json()
  return Array.isArray(data) ? data[0] ?? null : null
}
async function run() {
  let html = await readFile(outputPath, "utf8")
  let title = fallbackTitle
  let description = fallbackDescription
  let canonical = fallbackCanonical
  let robots = "index,follow"
  let image = null
  let favicon = "/favicon.png"
  let locale = "pt_BR"
  try {
    const [page, settings] = await Promise.all([
      getPublished("pages", "seo_title,seo_description", { slug: "eq.home", status: "eq.published" }),
      getPublished("site_settings", "site_title,description,locale,seo_json", { status: "eq.published" }),
    ])
    if (page?.seo_title?.trim()) title = page.seo_title.trim()
    else if (settings?.site_title?.trim()) title = settings.site_title.trim()
    if (page?.seo_description?.trim()) description = page.seo_description.trim()
    else if (settings?.description?.trim()) description = settings.description.trim()
    canonical = secureHttps(settings?.seo_json?.canonical) ?? fallbackCanonical
    image = secureHttps(settings?.seo_json?.ogImage)
    favicon = safeFavicon(settings?.seo_json?.faviconUrl) ?? favicon
    robots = /^(index|noindex),(follow|nofollow)$/.test(settings?.seo_json?.robots ?? "")
      ? settings.seo_json.robots : robots
    if (settings?.locale && /^[a-z]{2}-[A-Z]{2}$/.test(settings.locale))
      locale = settings.locale.replace("-", "_")
  } catch (error) {
    console.warn("SEO: Supabase indisponível; usando metadados editoriais estáticos.", error?.message)
  }

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = replaceMeta(html, "description", description)
  html = replaceMeta(html, "og:title", title, "property")
  html = replaceMeta(html, "og:description", description, "property")
  html = replaceMeta(html, "og:locale", locale, "property")
  html = replaceMeta(html, "twitter:description", description)
  html = replaceMeta(html, "robots", robots)
  html = replaceCanonical(html, canonical)
  html = replaceIconLink(html, "icon", favicon)
  html = replaceIconLink(
    html, "apple-touch-icon",
    favicon === "/favicon.png" ? "/apple-touch-icon.png" : favicon,
  )
  if (image) {
    html = replaceMeta(html, "og:image", image, "property")
    html = replaceMeta(html, "twitter:image", image)
    html = replaceMeta(html, "twitter:card", "summary_large_image")
  }
  // Match the preload to the current CMS portrait, not the historical fallback
  // asset. Otherwise a new published photo forces a large LCP image to wait for
  // React/Supabase while the browser downloads the wrong first-fold image.
  if (process.env.VITE_SUPABASE_URL) {
    let portraitUrl = null
    try {
      const section = await getPublished(
        "sections",
        "slug,content_blocks(mobile_panel,status,content_json)",
        { slug: "eq.perfil", status: "eq.published", is_visible: "eq.true" },
      )
      const profileBlock = (section?.content_blocks ?? []).find(
        (block) => block.mobile_panel === "a" && block.status === "published",
      )
      const candidate = profileBlock?.content_json?.items?.[0]?.image
      if (typeof candidate === "string") {
        portraitUrl = candidate.startsWith("/") && !candidate.startsWith("//")
          ? candidate : secureHttps(candidate)
      }
    } catch (error) {
      console.warn("P3: retrato indisponível no build; sem preload potencialmente incorreto.", error?.message)
    }
    const result = syncProfilePreload(html, portraitUrl)
    html = result.html
    console.log("P3: preload do retrato " + result.strategy + ".")
  }
  await writeFile(outputPath, html)
  const siteRoot = new URL("../dist/", import.meta.url)
  const domain = new URL(canonical).origin
  await writeFile(new URL("robots.txt", siteRoot),
    `User-agent: *\nDisallow: /admin\nDisallow: /admin/\nSitemap: ${domain}/sitemap.xml\n`)
  await writeFile(new URL("sitemap.xml", siteRoot),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeHtml(domain + "/")}</loc></url></urlset>\n`)
  // A public, non-secret build fingerprint lets P3 verify the SHA actually
  // served by the production alias, even if GitHub receives no Vercel status.
  const commit = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? ""
  if (/^[0-9a-f]{40}$/.test(commit)) {
    await writeFile(new URL("p3-deployment.json", siteRoot), JSON.stringify({ sha: commit }) + "\n")
    console.log("P3: identificador do deployment produzido.")
  } else {
    console.warn("P3: SHA de build não exposto; fingerprint não gerado.")
  }
  console.log("SEO: título, descrição, Open Graph, canonical, robots e sitemap gerados.")
}

await run()
