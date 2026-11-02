import { readdirSync, readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const TABLES = [
  "admin_users", "audit_logs", "block_placements", "career_experiences",
  "contact_channels", "content_blocks", "content_revisions", "design_tokens",
  "editorial_issues", "education", "language_levels", "media_assets", "metrics",
  "navigation_items", "pages", "portfolio_projects", "section_panels",
  "sections", "site_settings", "skills", "testimonials", "tool_categories",
]
export const COLUMNS_TO_REVIEW = [
  "career_experiences.skills", "media_assets.credit",
  "media_assets.width", "media_assets.height", "content_blocks.media_id",
  "testimonials.photo_media_id", "site_settings.favicon_media_id",
  "portfolio_projects.experience_id", "metrics.section_id",
]

export function scanReferences(files, terms = TABLES) {
  return Object.fromEntries(terms.map((term) => {
    const token = term.includes(".") ? term.split(".").at(-1) : term
    const pattern = new RegExp("\\b" + token + "\\b", "g")
    const hits = files.filter((item) => pattern.test(item.content) && (pattern.lastIndex = 0) === 0)
      .map((item) => item.path)
    return [term, hits]
  }))
}

export function collectProjectFiles(root) {
  const targets = ["src", "scripts", "supabase/migrations", "supabase/tests"]
  const found = []
  const scan = (dir) => {
    for (const node of readdirSync(join(root, dir), { withFileTypes: true })) {
      const child = join(dir, node.name)
      if (node.isDirectory()) {
        if (node.name !== "hygiene" && node.name !== "node_modules") scan(child)
      } else if (/\.(tsx?|mjs|sql)$/.test(node.name) && !node.name.startsWith(".")) {
        found.push({ path: child.replaceAll("\\", "/"), content: readFileSync(join(root, child), "utf8") })
      }
    }
  }
  for (const dir of targets) {
    try { scan(dir) } catch (error) {
      if (error.code !== "ENOENT") throw error
    }
  }
  return found
}

export function makeReport(files) {
  const references = scanReferences(files, TABLES)
  const columnReferences = scanReferences(files, COLUMNS_TO_REVIEW)
  const runtimeFiles = (paths) => paths.filter((p) => p.startsWith("src/") || p.startsWith("scripts/"))
  return {
    scannedFiles: files.length,
    tables: TABLES.map((name) => ({
      name, runtimeFiles: runtimeFiles(references[name]),
      schemaFiles: references[name].filter((p) => p.startsWith("supabase/")),
      safeToDrop: false,
    })),
    columns: COLUMNS_TO_REVIEW.map((name) => ({
      name, runtimeFiles: runtimeFiles(columnReferences[name]),
      schemaFiles: columnReferences[name].filter((p) => p.startsWith("supabase/")),
      safeToDrop: false,
    })),
    limitation: "Static text scan; runtime SQL, RPC, JSONB, FK, triggers, RLS, revisions and external consumers require separate review.",
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = makeReport(collectProjectFiles(process.cwd()))
  if (process.argv.includes("--summary-only")) {
    console.log(JSON.stringify({
      scannedFiles: report.scannedFiles, tables: report.tables.length,
      tablesWithRuntimeHits: report.tables.filter((x) => x.runtimeFiles.length).length,
      columnsReview: report.columns.length, removalAuthorized: false,
    }))
  } else {
    console.log(JSON.stringify(report, null, 2))
  }
}
