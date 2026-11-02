import assert from "node:assert/strict"
import { test } from "node:test"
import { createOfflineSeoPublisher } from "./p6-seo-publish-simulation.mjs"

test("draft and unprivileged actions cannot trigger a simulated publish", async () => {
  let sends = 0
  const publisher = createOfflineSeoPublisher(() => { sends++ })
  assert.deepEqual(await publisher.onChange({ actorIsAdmin: true, status: "draft", version: "test-001" }), { result: "draft_skipped" })
  await assert.rejects(() => publisher.onChange({ actorIsAdmin: false, status: "published", version: "test-001" }), /synthetic_admin_required/)
  assert.equal(sends, 0)
})

test("a published version dispatches once despite repeated requests", async () => {
  let sends = 0
  const publisher = createOfflineSeoPublisher(() => { sends++ })
  const first = { actorIsAdmin: true, status: "published", version: "synthetic-v1" }
  const results = await Promise.all([publisher.onChange(first), publisher.onChange(first)])
  assert.deepEqual(results, [{ result: "sent" }, { result: "sent" }])
  assert.deepEqual(await publisher.onChange(first), { result: "already_sent" })
  assert.equal(sends, 1)
})

test("failure is reported and retried without marking the version delivered", async () => {
  let attempts = 0
  const publisher = createOfflineSeoPublisher(() => {
    attempts++
    if (attempts === 1) throw new Error("simulated-deploy-unavailable")
  })
  const request = { actorIsAdmin: true, status: "published", version: "synthetic-v2" }
  assert.deepEqual(await publisher.onChange(request), { result: "failed_retryable" })
  assert.deepEqual(await publisher.onChange(request), { result: "sent" })
  assert.deepEqual(await publisher.onChange(request), { result: "already_sent" })
  assert.equal(attempts, 2)
})

test("different published versions are dispatched separately; invalid versions fail closed", async () => {
  const versions = []
  const publisher = createOfflineSeoPublisher((version) => { versions.push(version) })
  await assert.rejects(() => publisher.onChange({ actorIsAdmin: true, status: "published", version: "remote/url" }), /synthetic_invalid_version/)
  for (const version of ["synthetic-v3", "synthetic-v4"])
    assert.equal((await publisher.onChange({ actorIsAdmin: true, status: "published", version })).result, "sent")
  assert.deepEqual(versions, ["synthetic-v3", "synthetic-v4"])
})
