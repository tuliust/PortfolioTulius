import fs from "node:fs"
import path from "node:path"

/** Reject accidental use of the real editorial seed or any remote API. */
export function validateLocalSupabaseConfig(config) {
  if (typeof config !== "string" || !/^project_id\s*=\s*"portfolio-tulius-local-isolated"\s*$/m.test(config)) {
    throw new Error("P2_LOCAL_PROJECT_ID_INVALID")
  }
  const section = config.match(/^\[db\.seed\]\s*$([\s\S]*?)(?=^\[|$(?![\s\S]))/m)?.[1] ?? ""
  if (!/^enabled\s*=\s*true\s*$/m.test(section) ||
      !/^sql_paths\s*=\s*\[\s*"\.\/seed\.local\.synthetic\.sql"\s*\]\s*$/m.test(section)) {
    throw new Error("P2_LOCAL_SEED_NOT_ISOLATED")
  }
  // Fail if a remote-ref or remote URLs enter the checked-in config.
  if (/zfnrhzplwpjpdljraypt|\.supabase\.co|seed\.sql(?=["'\]\s])/i.test(config)) {
    throw new Error("P2_LOCAL_CONFIG_REMOTE_OR_REAL_SEED")
  }
  return true
}

export function assertLocalSupabaseApi(endpoint) {
  let url
  try { url = new URL(endpoint) } catch { throw new Error("P2_LOCAL_ENDPOINT_NOT_LOOPBACK") }
  if (url.protocol !== "http:" || url.hostname !== "127.0.0.1" ||
      url.port !== "54321" || url.pathname !== "/" ||
      url.search || url.hash || url.username || url.password) {
    throw new Error("P2_LOCAL_ENDPOINT_NOT_LOOPBACK")
  }
  return true
}

export function inspectLocalRepository(root) {
  const configPath = path.join(root, "supabase", "config.toml")
  const seedPath = path.join(root, "supabase", "seed.local.synthetic.sql")
  const migrations = path.join(root, "supabase", "migrations")
  if (![configPath, seedPath].every((file) => fs.existsSync(file)) ||
      !fs.existsSync(migrations) ||
      !fs.readdirSync(migrations).some((name) => name.endsWith(".sql"))) {
    throw new Error("P2_LOCAL_REQUIRED_FILES_MISSING")
  }
  validateLocalSupabaseConfig(fs.readFileSync(configPath, "utf8"))
  const seed = fs.readFileSync(seedPath, "utf8")
  if (!seed.includes("p2-local-fixture") || /Tulius Tsangaropulos|Invest RS|Prefeitura de São Paulo|SporTV/i.test(seed)) {
    throw new Error("P2_LOCAL_SEED_NOT_SYNTHETIC")
  }
  return { migrations: fs.readdirSync(migrations).filter((name) => name.endsWith(".sql")).length }
}
