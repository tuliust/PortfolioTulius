import { spawnSync } from "node:child_process"
import { inspectLocalRepository } from "./p2-local-isolation.mjs"

const info = inspectLocalRepository(process.cwd())
console.log("P2_LOCAL_CONFIG_OK " + JSON.stringify({ migrations: info.migrations, seed: "synthetic_only" }))
for (const [name, args] of [["docker", ["info", "--format", "{{.ServerVersion}}"]], ["supabase", ["--version"]]]) {
  const r = spawnSync(name, args, { encoding: "utf8", timeout: 12000 })
  if (r.error || r.status !== 0) {
    console.error("P2_LOCAL_PREREQUISITE_MISSING " + name + ": install/start locally before running supabase start")
    process.exitCode = 2
  } else {
    console.log("P2_LOCAL_PREREQUISITE_OK " + name)
  }
}
