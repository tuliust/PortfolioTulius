import test from "node:test"
import assert from "node:assert/strict"
import { validateRestoreEvidence } from "./restore-evidence.mjs"

const valid = () => ({
  project: "zfnrhzplwpjpdljraypt",
  originalChecksums: "PASS",
  derivedRolesSHA256: "a".repeat(64),
  removedLocalOnlyPrivilegeStatement: 1,
  clusterPrivilegeReconstructed: true,
  originalBackupFilesChanged: 0,
  warning: "Derived roles file omits one cluster grant; equivalent isolated role and SET privilege were reconstructed from remote role metadata.",
  localPostgresVersionNum: "170011",
  mode: "LOCAL_RESTORE",
  restoreResult: "COMMITTED",
  role: "postgres",
  verifiedAt: "2026-11-11T06:30:00.000Z",
  tablesCompared: 25,
  allCountsMatch: true,
  differences: [],
  foreignKeysChecked: 20,
  foreignKeyViolations: [],
  rlsPublicTables: 22,
  publicPolicies: 41,
  publicForeignKeys: 14,
  publicIndexes: 51,
  publicUserTriggers: 36,
  publicAndPrivateFunctions: 12,
  auditLogSequenceLastValue: 231,
  authRefreshTokenSequenceLastValue: 135,
  coreRolesPresent: 4,
  fullStorageBytesRestored: false,
  migrationHistoryRestored: false,
  scopeNote: "Database restore evidence excludes physical Storage bytes, remote migration history and production migration state; verify each separately.",
})

test("accepts sanitized committed local restore evidence but keeps production gates closed", () => {
  const result = validateRestoreEvidence(valid())
  assert.equal(result.databaseRestoreGate, "PASS")
  assert.equal(result.storageBytesGate, "SEPARATE_EVIDENCE_REQUIRED")
  assert.equal(result.migrationHistoryGate, "NOT_INCLUDED_IN_RESTORE_EVIDENCE")
  assert.equal(result.p2ProductionGate, "NOT_DERIVED_FROM_RESTORE_EVIDENCE")
  assert.equal(result.safeToShareSummaryOnly, true)
})

test("rejects failed, mismatched or incomplete restore evidence", () => {
  for (const mutate of [
    (x) => ({ ...x, restoreResult: "FAILED_AND_PSQL_TRANSACTION_ABORTED" }),
    (x) => ({ ...x, allCountsMatch: false, differences: [{ table: "public.sections" }] }),
    (x) => ({ ...x, foreignKeyViolations: [{ from: "public.a", to: "public.b", invalid: 1 }] }),
    (x) => ({ ...x, publicIndexes: 50 }),
    (x) => ({ ...x, fullStorageBytesRestored: true }),
  ]) assert.throws(() => validateRestoreEvidence(mutate(valid())), /RESTORE_EVIDENCE_/)
})

test("rejects extra fields that could contain private diagnostics", () => {
  assert.throws(() => validateRestoreEvidence({ ...valid(), errorLog: "private detail" }),
    /UNEXPECTED_OR_MISSING_FIELD/)
})

test("rejects missing fields, wrong project and future timestamps", () => {
  const missing = valid()
  delete missing.scopeNote
  assert.throws(() => validateRestoreEvidence(missing), /UNEXPECTED_OR_MISSING_FIELD/)
  assert.throws(() => validateRestoreEvidence({ ...valid(), project: "other" }), /BACKUP_IDENTITY/)
  assert.throws(() => validateRestoreEvidence({ ...valid(), verifiedAt: "2999-01-01T00:00:00.000Z" }), /TIMESTAMP/)
})
