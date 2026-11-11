#!/usr/bin/env node
// Validates only the sanitized JSON evidence produced by the private local
// restore package. Never reads SQL dumps, logs, credentials or database URLs.
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REF = "zfnrhzplwpjpdljraypt"
const allowedKeys = new Set([
  "project", "originalChecksums", "derivedRolesSHA256",
  "removedLocalOnlyPrivilegeStatement", "clusterPrivilegeReconstructed",
  "originalBackupFilesChanged", "warning",
  "localPostgresVersionNum", "mode", "restoreResult", "role", "verifiedAt",
  "tablesCompared", "allCountsMatch", "differences", "foreignKeysChecked",
  "foreignKeyViolations", "rlsPublicTables", "publicPolicies", "publicForeignKeys",
  "publicIndexes", "publicUserTriggers", "publicAndPrivateFunctions",
  "auditLogSequenceLastValue", "authRefreshTokenSequenceLastValue", "coreRolesPresent",
  "fullStorageBytesRestored", "migrationHistoryRestored", "scopeNote",
])
const structural = {
  rlsPublicTables: 22,
  publicPolicies: 41,
  publicForeignKeys: 14,
  publicIndexes: 51,
  publicUserTriggers: 36,
  publicAndPrivateFunctions: 12,
  auditLogSequenceLastValue: 231,
  authRefreshTokenSequenceLastValue: 135,
  coreRolesPresent: 4,
}

function fail(code) {
  throw new Error(code)
}

export function validateRestoreEvidence(evidence) {
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    fail("RESTORE_EVIDENCE_INVALID_OBJECT")
  }
  const keys = Object.keys(evidence)
  if (keys.some((key) => !allowedKeys.has(key)) ||
      [...allowedKeys].some((key) => !Object.hasOwn(evidence, key))) {
    fail("RESTORE_EVIDENCE_UNEXPECTED_OR_MISSING_FIELD")
  }
  if (evidence.project !== REF || evidence.originalChecksums !== "PASS" ||
      !/^[a-f0-9]{64}$/.test(evidence.derivedRolesSHA256) ||
      evidence.removedLocalOnlyPrivilegeStatement !== 1 ||
      evidence.clusterPrivilegeReconstructed !== true ||
      evidence.originalBackupFilesChanged !== 0) {
    fail("RESTORE_EVIDENCE_BACKUP_IDENTITY_FAILED")
  }
  if (evidence.mode !== "LOCAL_RESTORE" || evidence.restoreResult !== "COMMITTED" ||
      !["postgres", "supabase_admin"].includes(evidence.role) ||
      !/^17\d+$/.test(evidence.localPostgresVersionNum)) {
    fail("RESTORE_EVIDENCE_LOCAL_COMMIT_FAILED")
  }
  const verifiedAt = Date.parse(evidence.verifiedAt)
  if (!Number.isFinite(verifiedAt) || verifiedAt > Date.now() + 5 * 60 * 1000) {
    fail("RESTORE_EVIDENCE_INVALID_TIMESTAMP")
  }
  if (evidence.tablesCompared !== 25 || evidence.allCountsMatch !== true ||
      !Array.isArray(evidence.differences) || evidence.differences.length !== 0) {
    fail("RESTORE_EVIDENCE_COUNT_MISMATCH")
  }
  if (!Number.isSafeInteger(evidence.foreignKeysChecked) || evidence.foreignKeysChecked < 14 ||
      !Array.isArray(evidence.foreignKeyViolations) || evidence.foreignKeyViolations.length !== 0) {
    fail("RESTORE_EVIDENCE_FOREIGN_KEY_FAILURE")
  }
  for (const [field, expected] of Object.entries(structural)) {
    if (evidence[field] !== expected) fail("RESTORE_EVIDENCE_STRUCTURE_MISMATCH")
  }
  if (evidence.fullStorageBytesRestored !== false || evidence.migrationHistoryRestored !== false) {
    fail("RESTORE_EVIDENCE_SCOPE_FLAGS_INVALID")
  }
  if (evidence.warning !== "Derived roles file omits one cluster grant; equivalent isolated role and SET privilege were reconstructed from remote role metadata." ||
      evidence.scopeNote !== "Database restore evidence excludes physical Storage bytes, remote migration history and production migration state; verify each separately.") {
    fail("RESTORE_EVIDENCE_SCOPE_TEXT_INVALID")
  }
  return {
    project: REF,
    verifiedAt: evidence.verifiedAt,
    databaseRestoreGate: "PASS",
    databaseCounts: "25/25",
    foreignKeysChecked: evidence.foreignKeysChecked,
    storageBytesGate: "SEPARATE_EVIDENCE_REQUIRED",
    migrationHistoryGate: "NOT_INCLUDED_IN_RESTORE_EVIDENCE",
    p2ProductionGate: "NOT_DERIVED_FROM_RESTORE_EVIDENCE",
    safeToShareSummaryOnly: true,
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = process.argv.indexOf("--evidence")
  if (index < 0 || !process.argv[index + 1] || process.argv[index + 1].startsWith("--")) {
    fail("Uso: node scripts/hygiene/restore-evidence.mjs --evidence /caminho/privado/restore-p2-isolated-evidence.json")
  }
  const evidence = JSON.parse(readFileSync(resolve(process.argv[index + 1]), "utf8"))
  console.log(JSON.stringify(validateRestoreEvidence(evidence), null, 2))
}
