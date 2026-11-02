import puppeteer from "puppeteer-core"

// Compare production HTML (as seen by crawlers) to published CMS rows returned
// through the same public PostgREST requests made by the application.
// No credentials are logged, and no mutation is performed.
const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
const page = await browser.newPage()
const pending = Object.fromEntries(
  ["pages", "site_settings"].map((table) => {
    let resolve
    let reject
    const promise = new Promise((ok, fail) => {
      resolve = ok
      reject = fail
    })
    return [table, { promise, resolve, reject }]
  }),
)
page.on("response", (response) => {
  const url = new URL(response.url())
  const table = url.pathname.split("/").at(-1)
  // CORS OPTIONS preflights have no readable JSON body. Match only the
  // actual published PostgREST GET response, never the OPTIONS handshake.
  if (
    response.request().method() !== "GET" ||
    !url.hostname.endsWith(".supabase.co") ||
    !pending[table]
  ) return
  if (!response.ok()) {
    pending[table].reject(new Error("Read-only CMS query for " + table + " returned HTTP " + response.status()))
    return
  }
  void response.json()
    .then((rows) => {
      if (!Array.isArray(rows)) throw new Error("Unexpected " + table + " response shape")
      pending[table].resolve(rows[0] ?? null)
    })
    .catch(pending[table].reject)
})
try {
  const response = await page.goto("https://tulius.work/", {
    waitUntil: "networkidle2",
    timeout: 45000,
  })
  if (!response?.ok()) throw new Error("Production homepage is unavailable")
  const html = await response.text()
  const [publishedPage, settings] = await Promise.race([
    Promise.all([pending.pages.promise, pending.site_settings.promise]),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timed out waiting for published SEO read requests")), 16000),
    ),
  ])
  if (!publishedPage || !settings) throw new Error("Published SEO rows not found")

  const meta = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, "text/html")
    const get = (name, attr = "name") =>
      doc.head.querySelector(`meta[${attr}="${name}"]`)?.getAttribute("content") ?? null
    return {
      title: doc.title,
      description: get("description"),
      ogTitle: get("og:title", "property"),
      ogDescription: get("og:description", "property"),
      twitterDescription: get("twitter:description"),
      locale: get("og:locale", "property"),
      robots: get("robots"),
      canonical: doc.head.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      ogImage: get("og:image", "property"),
    }
  }, html)

  const title = publishedPage.seo_title?.trim() || settings.site_title?.trim()
  const description = publishedPage.seo_description?.trim() || settings.description?.trim()
  const canonical = settings.seo_json?.canonical?.startsWith("https://")
    ? settings.seo_json.canonical : "https://tulius.work/"
  const robots = /^(index|noindex),(follow|nofollow)$/.test(settings.seo_json?.robots ?? "")
    ? settings.seo_json.robots : "index,follow"
  const expected = {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    twitterDescription: description,
    locale: settings.locale?.replace("-", "_") ?? "pt_BR",
    canonical,
    robots,
  }
  if (settings.seo_json?.ogImage?.startsWith("https://")) {
    expected.ogImage = settings.seo_json.ogImage
  }
  const failures = Object.entries(expected).filter(([key, value]) => meta[key] !== value)
  if (failures.length) {
    throw new Error("Static HTML differs from published CMS: " +
      JSON.stringify(failures.map(([field, expectedValue]) => ({
        field, expected: expectedValue, actual: meta[field],
      }))))
  }
  console.log("P4_SEO_PARITY " + JSON.stringify({
    result: "PASS",
    checkedFields: Object.keys(expected),
    staticTitleMatchesCms: true,
    publicCmsQueries: 2,
    mutations: 0,
  }))
} finally {
  await page.close()
  await browser.close()
}
