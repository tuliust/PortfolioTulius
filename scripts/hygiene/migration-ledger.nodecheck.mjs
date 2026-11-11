import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { reconcileMigrationLedger } from "./migration-ledger.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..", "..")
const snapshot = () => JSON.parse(readFileSync(
  join(here, "fixtures", "portfolio-remote-migrations-2026-11-11.json"), "utf8",
))
const localFiles = () => readdirSync(join(root, "supabase", "migrations"))
  .filter((file) => file.endsWith(".sql")).sort()

test("reconciles all twelve local migrations without replaying the baseline", () => {
  const result = reconcileMigrationLedger(snapshot(), localFiles())
  assert.equal(result.remoteCount, 12)
  assert.equal(result.sharedCount, 12)
  assert.equal(result.localCount, 12)
  assert.deepEqual(result.remoteOnly, [])
  assert.deepEqual(result.localOnly, [])
  assert.equal(result.mediaMigrationAligned, true)
  assert.equal(result.baselineApplyAuthorized, false)
  assert.equal(result.baselineHistoryReconciled, true)
  assert.equal(result.controlledHistoryRepairCompleted, true)
  assert.equal(result.arbitrarySchemaMigrationsWriteAuthorized, false)
  assert.equal(result.p2ProductionGate, "APPLIED")
  assert.equal(result.creditRemovalGate, "APPLIED")
})

test("rejects remote drift, duplicates and staged migrations reported as installed", () => {
  const drift = snapshot()
  drift.migrations[0].name = "renamed"
  assert.throws(() => reconcileMigrationLedger(drift, localFiles()), /REMOTE_DRIFT/)

  const duplicate = snapshot()
  duplicate.migrations.push({ ...duplicate.migrations[0] })
  assert.throws(() => reconcileMigrationLedger(duplicate, localFiles()), /INVALID_REMOTE_ENTRY/)

  const staged = snapshot()
  staged.migrations.push({ version: "20261111120000", name: "unexpected" })
  assert.throws(() => reconcileMigrationLedger(staged, localFiles()), /REMOTE_DRIFT/)
})

test("rejects a missing, renamed or unexpected local migration", () => {
  const files = localFiles()
  assert.throws(() => reconcileMigrationLedger(snapshot(), files.filter(
    (file) => !file.startsWith("20261105101829_"),
  )), /SHARED_MISMATCH/)
  assert.throws(() => reconcileMigrationLedger(snapshot(), files.map(
    (file) => file.startsWith("20261105101829_") ? "20261105101829_wrong.sql" : file,
  )), /SHARED_MISMATCH/)
  assert.throws(() => reconcileMigrationLedger(snapshot(), [
    ...files, "20261111120000_unexpected.sql",
  ]), /UNEXPECTED_LOCAL_ONLY/)
})
