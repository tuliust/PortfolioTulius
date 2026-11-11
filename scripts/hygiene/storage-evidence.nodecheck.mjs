import test from "node:test"
import assert from "node:assert/strict"
import { validateStorageEvidence } from "./storage-evidence.mjs"

const valid = () => ({
  projectRef: "zfnrhzplwpjpdljraypt",
  verified: 128,
  verifiedBytes: 4661351,
  complete: true,
  manifestMatched: true,
  matchingPairs: 50,
  differingPairs: 3,
  note: "Comparação SHA-256 apenas dos pares presentes neste backup",
})

test("accepts complete manifest-bound Storage proof but keeps other gates closed", () => {
  assert.deepEqual(validateStorageEvidence(valid()), {
    projectRef: "zfnrhzplwpjpdljraypt",
    storageObjects: 128,
    storageBytes: 4661351,
    storageBytesGate: "PASS",
    databaseRestoreGate: "BLOCKED",
    migrationHistoryGate: "BLOCKED",
    rollbackGate: "BLOCKED",
    p2ProductionGate: "BLOCKED",
    safeToShareSummaryOnly: true,
  })
})

test("rejects wrong project, object count, byte total or missing manifest proof", () => {
  for (const mutate of [
    (x) => ({ ...x, projectRef: "other" }),
    (x) => ({ ...x, verified: 127 }),
    (x) => ({ ...x, verifiedBytes: 4661350 }),
    (x) => ({ ...x, complete: false }),
    (x) => ({ ...x, manifestMatched: false }),
  ]) assert.throws(() => validateStorageEvidence(mutate(valid())),
    /STORAGE_EVIDENCE_INCOMPLETE_OR_WRONG_SOURCE/)
})

test("rejects extra fields, missing fields and invalid pair counts", () => {
  assert.throws(() => validateStorageEvidence({ ...valid(), objectPaths: ["private/path"] }),
    /UNEXPECTED_OR_MISSING_FIELD/)
  const missing = valid()
  delete missing.note
  assert.throws(() => validateStorageEvidence(missing), /UNEXPECTED_OR_MISSING_FIELD/)
  assert.throws(() => validateStorageEvidence({ ...valid(), matchingPairs: -1 }), /PAIR_COUNTS/)
  assert.throws(() => validateStorageEvidence({ ...valid(), matchingPairs: 64, differingPairs: 1 }),
    /PAIR_COUNTS/)
})

test("rejects altered scope text", () => {
  assert.throws(() => validateStorageEvidence({ ...valid(), note: "all objects identical" }),
    /SCOPE_TEXT/)
})
