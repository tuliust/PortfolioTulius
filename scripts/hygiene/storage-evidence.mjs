#!/usr/bin/env node
// Validates only the shareable JSON emitted after a private physical Storage
// backup verification. Never reads the manifest, object paths, bytes or keys.
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REF = "zfnrhzplwpjpdljraypt"
const EXPECTED_OBJECTS = 128
const EXPECTED_BYTES = 4661351
const NOTE = "Comparação SHA-256 apenas dos pares presentes neste backup"
const allowedKeys = new Set([
  "projectRef", "verified", "verifiedBytes", "complete", "manifestMatched",
  "matchingPairs", "differingPairs", "note",
])

function fail(code) {
  throw new Error(code)
}

export function validateStorageEvidence(evidence) {
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    fail("STORAGE_EVIDENCE_INVALID_OBJECT")
  }
  const keys = Object.keys(evidence)
  if (keys.some((key) => !allowedKeys.has(key)) ||
      [...allowedKeys].some((key) => !Object.hasOwn(evidence, key))) {
    fail("STORAGE_EVIDENCE_UNEXPECTED_OR_MISSING_FIELD")
  }
  if (evidence.projectRef !== REF ||
      evidence.verified !== EXPECTED_OBJECTS ||
      evidence.verifiedBytes !== EXPECTED_BYTES ||
      evidence.complete !== true ||
      evidence.manifestMatched !== true) {
    fail("STORAGE_EVIDENCE_INCOMPLETE_OR_WRONG_SOURCE")
  }
  if (!Number.isSafeInteger(evidence.matchingPairs) || evidence.matchingPairs < 0 ||
      !Number.isSafeInteger(evidence.differingPairs) || evidence.differingPairs < 0 ||
      evidence.matchingPairs + evidence.differingPairs > EXPECTED_OBJECTS / 2) {
    fail("STORAGE_EVIDENCE_INVALID_PAIR_COUNTS")
  }
  if (evidence.note !== NOTE) fail("STORAGE_EVIDENCE_SCOPE_TEXT_INVALID")
  return {
    projectRef: REF,
    storageObjects: EXPECTED_OBJECTS,
    storageBytes: EXPECTED_BYTES,
    storageBytesGate: "PASS",
    databaseRestoreGate: "BLOCKED",
    migrationHistoryGate: "BLOCKED",
    rollbackGate: "BLOCKED",
    p2ProductionGate: "BLOCKED",
    safeToShareSummaryOnly: true,
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = process.argv.indexOf("--evidence")
  if (index < 0 || !process.argv[index + 1] || process.argv[index + 1].startsWith("--")) {
    fail("Uso: node scripts/hygiene/storage-evidence.mjs --evidence /caminho/privado/storage-backup-evidence.json")
  }
  const evidence = JSON.parse(readFileSync(resolve(process.argv[index + 1]), "utf8"))
  console.log(JSON.stringify(validateStorageEvidence(evidence), null, 2))
}
