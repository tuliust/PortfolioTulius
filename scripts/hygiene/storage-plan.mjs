import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const EXPECTED_REF = "zfnrhzplwpjpdljraypt"
const ALLOWED_BUCKETS = new Set(["portfolio-public", "portfolio-private"])

export function validateManifest(input) {
  if (!input || input.version !== 1 || input.projectRef !== EXPECTED_REF ||
      !Array.isArray(input.items) || input.items.length > 1000) {
    throw new Error("HYG_INVALID_MANIFEST_HEADER")
  }
  const seen = new Set()
  for (const item of input.items) {
    if (!item || !ALLOWED_BUCKETS.has(item.bucket) ||
        typeof item.path !== "string" || !item.path.trim() ||
        item.path.startsWith("/") || item.path.includes("\\") ||
        item.path.split("/").some((part) => part === ".." || part === "." || !part) ||
        /[\u0000-\u001f]/.test(item.path)) {
      throw new Error("HYG_INVALID_STORAGE_PATH")
    }
    const key = JSON.stringify([item.bucket, item.path])
    if (seen.has(key)) throw new Error("HYG_DUPLICATE_OBJECT")
    seen.add(key)
    for (const field of ["registered", "currentPublished", "anyBlock", "inRevisions", "inSeo", "sameMetaPair"]) {
      if (typeof item[field] !== "boolean") throw new Error("HYG_MISSING_REFERENCE_FLAG:" + field)
    }
    if (!Number.isSafeInteger(item.size) || item.size < 0) {
      throw new Error("HYG_INVALID_SIZE")
    }
    if (item.sha256 !== undefined && !/^[a-f0-9]{64}$/.test(item.sha256)) {
      throw new Error("HYG_INVALID_CHECKSUM")
    }
  }
  return input
}

export function classifyObject(row) {
  const flags = []
  if (row.currentPublished) flags.push("LIVE_PUBLIC_REFERENCE")
  if (row.anyBlock) flags.push("CMS_BLOCK_REFERENCE")
  if (row.inRevisions) flags.push("HISTORICAL_REVISION")
  if (row.inSeo) flags.push("SEO_REFERENCE")
  if (row.registered) flags.push("CATALOG_RECORD")
  if (row.sameMetaPair) flags.push("METADATA_MATCH_ONLY_NOT_BYTE_PROOF")
  if (row.bucket === "portfolio-private") flags.push("PRIVATE_BUCKET")
  const lane = row.currentPublished || row.anyBlock || row.inSeo
    ? "PRESERVE_PENDING_REVIEW"
    : row.bucket === "portfolio-private" && row.sameMetaPair
      ? "VERIFY_PRIVATE_MIRROR_AND_BACKUP"
      : row.inRevisions
        ? "HISTORICAL_REVIEW_REQUIRED"
        : "MANUAL_REVIEW_REQUIRED"
  return { bucket: row.bucket, path: row.path, lane, flags, removalAuthorized: false }
}

export function createDryRun(manifest) {
  validateManifest(manifest)
  const items = manifest.items.map(classifyObject)
  const byLane = {}
  for (const item of items) byLane[item.lane] = (byLane[item.lane] ?? 0) + 1
  return { projectRef: manifest.projectRef, total: items.length, byLane, deletionCount: 0, items }
}

export function loadManifest(file) {
  return validateManifest(JSON.parse(readFileSync(file, "utf8")))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = process.argv.indexOf("--manifest")
  if (index < 0 || !process.argv[index + 1]) {
    throw new Error("Uso: node scripts/hygiene/storage-plan.mjs --manifest /arquivo/privado.json [--show-items]")
  }
  const report = createDryRun(loadManifest(process.argv[index + 1]))
  console.log(JSON.stringify(process.argv.includes("--show-items") ? report : {
    projectRef: report.projectRef, total: report.total, byLane: report.byLane,
    deletionCount: report.deletionCount, privatePathsOmitted: true,
  }, null, 2))
}
