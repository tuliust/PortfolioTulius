#!/usr/bin/env node
// Read-only verifier for Supabase CLI SQL dumps. Never prints, uploads,
// executes, or commits their data (which can include auth credentials).
import { readFileSync, existsSync } from "node:fs"
import { createHash } from "node:crypto"
import { resolve, join } from "node:path"

const argv = process.argv.slice(2)
function option(name) {
  const i = argv.indexOf(name)
  if (i < 0 || !argv[i + 1]) throw new Error("Required argument: " + name + " PATH")
  return argv[i + 1]
}
const dir = resolve(option("--dir"))
const expected = JSON.parse(readFileSync(resolve(option("--expected")), "utf8"))
const files = ["roles.sql", "schema.sql", "data.sql"]
const checksumLines = readFileSync(join(dir, "SHA256SUMS.txt"), "utf8").trim().split(/\r?\n/)
const checksums = new Map()
for (const line of checksumLines) {
  const m = /^([a-fA-F0-9]{64}) \*([^/\\\r\n]+)$/.exec(line)
  if (!m || checksums.has(m[2])) throw new Error("Invalid SHA256SUMS entry")
  checksums.set(m[2], m[1].toLowerCase())
}
if (checksums.size !== 3 || files.some(file => !checksums.has(file))) {
  throw new Error("SHA256SUMS must list exactly roles.sql, schema.sql and data.sql")
}
const sizes = {}
for (const file of files) {
  const p = join(dir, file)
  if (!existsSync(p)) throw new Error("Missing SQL dump: " + file)
  const bytes = readFileSync(p)
  if (!bytes.length) throw new Error("Empty SQL dump: " + file)
  const actual = createHash("sha256").update(bytes).digest("hex")
  if (actual !== checksums.get(file)) throw new Error("SHA-256 mismatch: " + file)
  sizes[file] = bytes.length
}

// A COPY block ends on a line containing only a backslash and period.
// Only count records. Never print values from auth, public or storage tables.
const copyCounts = new Map()
let current = null
let rowCount = 0
for (const line of readFileSync(join(dir, "data.sql"), "utf8").split(/\r?\n/)) {
  if (current !== null) {
    if (line === "\\.") {
      if (copyCounts.has(current)) throw new Error("Duplicate COPY block: " + current)
      copyCounts.set(current, rowCount)
      current = null
      rowCount = 0
    } else rowCount++
    continue
  }
  const m = /^COPY "([a-z_][a-z_0-9]*)"\."([a-z_][a-z_0-9]*)" \(.+\) FROM stdin;$/.exec(line)
  if (m) current = m[1] + "." + m[2]
}
if (current !== null) throw new Error("Unterminated COPY block: " + current)
const checks = {
  ...Object.fromEntries(Object.entries(expected.public).map(([name, count]) => ["public." + name, count])),
  ...expected.other,
}
const differences = Object.entries(checks)
  .filter(([name, count]) => copyCounts.get(name) !== count)
  .map(([name, count]) => ({
    table: name, expected: count, actual: copyCounts.get(name) ?? null,
  }))
console.log(JSON.stringify({
  project: expected.project,
  checksums: "PASS",
  sizes,
  publicTables: Object.keys(expected.public).length,
  tablesCompared: Object.keys(checks).length,
  copyBlocks: copyCounts.size,
  rowCountComparison: differences.length ? "FAIL" : "PASS",
  differences,
  cautions: [
    "Not a PostgreSQL restoration",
    "Storage object bytes are not present in SQL dump",
    "supabase_migrations history not in the standard dump"
  ]
}, null, 2))
if (differences.length) process.exitCode = 1
