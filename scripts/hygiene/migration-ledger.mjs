#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REF = "zfnrhzplwpjpdljraypt"
const remoteExpected = new Map([
  ["202610220001", "portfolio_cms"],
  ["20261024044005", "p0_01_atomic_content_block_save"],
  ["20261024051406", "p0_03_05_section_panels_publish_permissions"],
  ["20261024052156", "p0_05_pin_updated_at_search_path"],
  ["20261024060432", "p1_atomic_home_seo_save"],
  ["20261025203559", "p3_revoke_excess_table_privileges"],
  ["20261025230446", "p7_admin_rls_initplan_fk_indexes"],
  ["20261025230528", "p7_admin_users_own_select_initplan"],
  ["20261105101829", "delete_media_asset_everywhere"],
  ["20261107042248", "identity_catalog_stage2"],
  ["20261109024100", "p2_composite_section_block_save"],
  ["20261110153000", "remove_media_credit"],
])
const localOnlyPolicy = new Map()

function fail(code) {
  throw new Error(code)
}

function parseLocal(files) {
  const migrations = new Map()
  for (const file of files) {
    const match = /^(\d{12,14})_([a-z0-9_]+)\.sql$/.exec(file)
    if (!match || migrations.has(match[1])) fail("MIGRATION_LEDGER_INVALID_LOCAL_FILENAME")
    migrations.set(match[1], { version: match[1], name: match[2], file })
  }
  return migrations
}

export function reconcileMigrationLedger(snapshot, localFiles) {
  if (!snapshot || snapshot.version !== 1 || snapshot.projectRef !== REF ||
      !Array.isArray(snapshot.migrations) || !Number.isFinite(Date.parse(snapshot.observedAt))) {
    fail("MIGRATION_LEDGER_INVALID_SNAPSHOT")
  }
  const remote = new Map()
  for (const entry of snapshot.migrations) {
    if (!entry || !/^\d{12,14}$/.test(entry.version) ||
        !/^[a-z0-9_]+$/.test(entry.name) || remote.has(entry.version)) {
      fail("MIGRATION_LEDGER_INVALID_REMOTE_ENTRY")
    }
    remote.set(entry.version, entry.name)
  }
  if (remote.size !== remoteExpected.size || [...remoteExpected].some(
    ([version, name]) => remote.get(version) !== name,
  )) fail("MIGRATION_LEDGER_REMOTE_DRIFT")

  const local = parseLocal(localFiles)
  for (const [version, name] of remoteExpected) {
    if (local.get(version)?.name !== name) fail("MIGRATION_LEDGER_SHARED_MISMATCH")
  }
  const localOnly = [...local].filter(([version]) => !remote.has(version))
  if (localOnly.length !== localOnlyPolicy.size || localOnly.some(
    ([version, entry]) => localOnlyPolicy.get(version)?.name !== entry.name,
  )) fail("MIGRATION_LEDGER_UNEXPECTED_LOCAL_ONLY")
  if ([...localOnlyPolicy].some(([version]) => remote.has(version))) {
    fail("MIGRATION_LEDGER_GATED_MIGRATION_ALREADY_REMOTE")
  }
  return {
    projectRef: REF,
    observedAt: snapshot.observedAt,
    remoteCount: remote.size,
    localCount: local.size,
    sharedCount: remote.size,
    remoteOnly: [],
    localOnly: localOnly.map(([version, entry]) => ({
      version,
      name: entry.name,
      state: localOnlyPolicy.get(version).state,
      gate: localOnlyPolicy.get(version).gate,
    })),
    mediaMigrationAligned: remote.get("20261105101829") === "delete_media_asset_everywhere",
    baselineApplyAuthorized: false,
    baselineHistoryReconciled: remote.get("202610220001") === "portfolio_cms",
    controlledHistoryRepairCompleted: remote.get("202610220001") === "portfolio_cms",
    arbitrarySchemaMigrationsWriteAuthorized: false,
    p2ProductionGate: remote.get("20261109024100") === "p2_composite_section_block_save" ? "APPLIED" : "BLOCKED",
    creditRemovalGate: remote.get("20261110153000") === "remove_media_credit" ? "APPLIED" : "BLOCKED",
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (flag) => {
    const index = process.argv.indexOf(flag)
    return index < 0 ? null : process.argv[index + 1]
  }
  const remotePath = arg("--remote")
  const migrationsDirectory = resolve(arg("--migrations-dir") ?? "supabase/migrations")
  if (!remotePath) fail("Uso: --remote snapshot.json [--migrations-dir supabase/migrations]")
  const snapshot = JSON.parse(readFileSync(resolve(remotePath), "utf8"))
  const files = readdirSync(migrationsDirectory).filter((file) => file.endsWith(".sql")).sort()
  console.log(JSON.stringify(reconcileMigrationLedger(snapshot, files), null, 2))
}
