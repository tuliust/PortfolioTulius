import assert from "node:assert/strict"
import { test } from "node:test"
import { createSyntheticStagingFixtures } from "./p2-synthetic-fixtures.mjs"

test("all fixtures are synthetic, unique and unpublished", () => {
  const first = createSyntheticStagingFixtures()
  const second = createSyntheticStagingFixtures()
  assert.notEqual(first.nonce, second.nonce)
  assert.notEqual(first.page.slug, second.page.slug)
  for (const [key, record] of Object.entries(first)) {
    if (key === "nonce") continue
    if ("status" in record) assert.equal(record.status, "draft")
  }
  const content = JSON.stringify(first)
  for (const restricted of [
    "zfnrhzplwpjpdljraypt", "Tulius", "Matheus Gomes", "Ana Beatriz Neves",
    "Fábio Seixas", "Invest RS", "Prefeitura de São Paulo", "SporTV",
  ]) assert.equal(content.includes(restricted), false, "Real identity included in fixture: " + restricted)
  assert.ok(first.media.storage_path.startsWith("p2-fixture/" + first.nonce))
  assert.equal(first.block.content_json.items.length, 1)
})
