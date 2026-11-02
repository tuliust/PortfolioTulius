import { readFile, access, readdir } from "node:fs/promises"

const root = new URL("../dist/", import.meta.url)
const read = (file) => readFile(new URL(file, root), "utf8")
function check(condition, message) {
  if (!condition) throw new Error("smoke:build: " + message)
}

const [html, robots, sitemap] = await Promise.all([
  read("index.html"),
  read("robots.txt"),
  read("sitemap.xml"),
])
check(/<title>[^<]+<\/title>/i.test(html), "Título ausente no HTML.")
check(/<meta\s+name=["']description["'][^>]+>/i.test(html),
  "Meta description ausente.")
check(/<link\s+rel=["']canonical["'][^>]+>/i.test(html),
  "Canonical ausente.")
check(robots.includes("Disallow: /admin\n") && robots.includes("Disallow: /admin/"),
  "robots.txt sem regras para área administrativa.")
check(/<urlset\b/.test(sitemap) && /<loc>https:\/\//.test(sitemap),
  "sitemap.xml não contém uma URL HTTPS.")

const modulePreloads = [...html.matchAll(/<link\b[^>]*\brel=["']modulepreload["'][^>]*>/gi)]
check(
  modulePreloads.every(([tag]) => !/admin-router-[^"'\s>]+\.js/.test(tag)),
  "HTML público pré-carrega o chunk administrativo.",
)
// CI's offline build intentionally has no Supabase public environment; Vite
// eliminates its PostgREST import. Only require the preload when the same
// build is configured to serve the live CMS, as in Vercel production.
if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  check(
    modulePreloads.some(([tag]) => /public-postgrest-[^"'\s>]+\.js/.test(tag)),
    "HTML público não carrega o cliente PostgREST reduzido.",
  )
}
check(
  modulePreloads.every(([tag]) => !/supabase-sdk-[^"'\s>]+\.js/.test(tag)),
  "HTML público ainda pré-carrega Auth/Storage/Realtime.",
)

const emittedAssets = await readdir(new URL("assets/", root))
check(
  emittedAssets.some((name) => /^AdminLogin-[\\w-]+\\.js$/.test(name)),
  "Login administrativo não foi extraído para um bundle independente.",
)
check(
  emittedAssets.some((name) => /^AdminApp-[\\w-]+\\.js$/.test(name)),
  "Editor administrativo perdeu seu bundle dedicado.",
)

const assetNames = [
  ...html.matchAll(/(?:src|href)=["']\/assets\/([^"']+\.(?:js|css))["']/g),
].map((match) => match[1])
check(assetNames.some((name) => name.endsWith(".js")),
  "HTML sem referência a bundle JavaScript.")
for (const name of assetNames) {
  check(!name.includes(".."), "Referência de asset inválida.")
  await access(new URL("assets/" + name, root))
}
console.log(
  `PASS: build local, metadados, robots, sitemap e ${assetNames.length} assets.`,
)
console.log("Esta verificação é offline e não confirma a disponibilidade do domínio.")
