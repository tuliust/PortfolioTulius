import test from "node:test"
import assert from "node:assert/strict"
import { TABLES, scanReferences, makeReport } from "./schema-audit.mjs"

test("schema audit contains every public table in scope", () => {
  assert.equal(TABLES.length, 22)
  assert(TABLES.includes("media_assets"))
  assert(TABLES.includes("content_revisions"))
})

test("text scan flags references but never makes deletion decisions", () => {
  const files = [
    { path: "src/lib/query.ts", content: 'client.from("media_assets").select("credit")' },
    { path: "supabase/migrations/schema.sql", content: "CREATE TABLE public.content_revisions (id uuid);" },
  ]
  const report = makeReport(files)
  assert(report.tables.find((x) => x.name === "media_assets").runtimeFiles.includes("src/lib/query.ts"))
  assert(report.tables.find((x) => x.name === "content_revisions").schemaFiles.length === 1)
  assert(report.tables.every((x) => x.safeToDrop === false))
  assert(report.columns.every((x) => x.safeToDrop === false))
  assert(scanReferences(files, ["media_assets"]).media_assets.length === 1)
})
