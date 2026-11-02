import { test } from "node:test"
import assert from "node:assert/strict"
import {
  assertLocalSupabaseApi, validateLocalSupabaseConfig, inspectLocalRepository,
} from "./p2-local-isolation.mjs"

const valid = [
  'project_id = "portfolio-tulius-local-isolated"',
  "",
  "[db.seed]",
  "enabled = true",
  'sql_paths = ["./seed.local.synthetic.sql"]',
  "",
].join("\n")

test("strictly accepts only the synthetic seed and local project id", () => {
  assert.equal(validateLocalSupabaseConfig(valid), true)
  for (const config of [
    valid.replace("enabled = true", "enabled = false"),
    valid.replace("seed.local.synthetic.sql", "seed.sql"),
    valid.replace("portfolio-tulius-local-isolated", "portfolio-tulius"),
    valid + '\nurl = "https://zfnrhzplwpjpdljraypt.supabase.co"\n',
  ]) {
    assert.throws(() => validateLocalSupabaseConfig(config))
  }
})

test("rejects cloud URLs, alternate ports and URL credentials", () => {
  assert.equal(assertLocalSupabaseApi("http://127.0.0.1:54321/"), true)
  for (const url of [
    "https://zfnrhzplwpjpdljraypt.supabase.co",
    "http://localhost:54321/",
    "http://127.0.0.1:54322/",
    "https://127.0.0.1:54321/",
    "http://127.0.0.1:54321/?x=1",
    "http://user:pass@127.0.0.1:54321/",
    "bad",
  ]) assert.throws(() => assertLocalSupabaseApi(url), { message: "P2_LOCAL_ENDPOINT_NOT_LOOPBACK" })
})

test("repository has safe config, synthetic fixture and local migrations", () => {
  const result = inspectLocalRepository(process.cwd())
  assert.ok(result.migrations >= 1)
})
