import test from "node:test"
import assert from "node:assert/strict"
import { createDryRun, validateManifest } from "./storage-plan.mjs"

const ref = "zfnrhzplwpjpdljraypt"
const flags = { registered: false, currentPublished: false, anyBlock: false, inRevisions: false, inSeo: false, sameMetaPair: false, size: 12 }
const object = (bucket, path, extras = {}) => ({ bucket, path, ...flags, ...extras })

test("all candidates require review; dry-run never authorizes deletion", () => {
  const report = createDryRun({ version: 1, projectRef: ref, items: [
    object("portfolio-public", "safe/live.svg", { currentPublished: true, registered: true }),
    object("portfolio-public", "old/file.svg", { registered: true, inRevisions: true }),
    object("portfolio-private", "same/file.svg", { inRevisions: true, sameMetaPair: true }),
  ] })
  assert.equal(report.total, 3)
  assert.equal(report.deletionCount, 0)
  assert.equal(report.byLane.PRESERVE_PENDING_REVIEW, 1)
  assert.equal(report.byLane.HISTORICAL_REVIEW_REQUIRED, 1)
  assert.equal(report.byLane.VERIFY_PRIVATE_MIRROR_AND_BACKUP, 1)
  assert(report.items.every((item) => item.removalAuthorized === false))
})

test("rejects wrong project, traversal, duplicates and missing evidence", () => {
  assert.throws(() => validateManifest({ version: 1, projectRef: "other", items: [] }), /HEADER/)
  assert.throws(() => validateManifest({ version: 1, projectRef: ref, items: [object("portfolio-public", "../file")] }), /PATH/)
  assert.throws(() => validateManifest({ version: 1, projectRef: ref, items: [object("portfolio-public", "a"), object("portfolio-public", "a")] }), /DUPLICATE/)
  assert.throws(() => validateManifest({ version: 1, projectRef: ref, items: [{ bucket: "portfolio-public", path: "a", size: 1 }] }), /FLAG/)
})
