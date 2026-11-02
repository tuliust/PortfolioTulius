import { createClient } from "@supabase/supabase-js"
import { assertLocalSupabaseApi } from "./p2-local-isolation.mjs"

// NO mutation methods here; read-only local verification after 'supabase start'.
// Use only the local CLI output. Do not supply production or service_role keys.
const endpoint = process.env.P2_LOCAL_URL ?? "http://127.0.0.1:54321/"
assertLocalSupabaseApi(endpoint)
const publishable = process.env.P2_LOCAL_ANON_KEY
if (!publishable || !publishable.trim()) throw new Error("P2_LOCAL_ANON_KEY_REQUIRED")
const client = createClient(endpoint, publishable, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})
for (const table of ["pages","sections","content_blocks","career_experiences","media_assets"]) {
  const r = await client.from(table).select("id").limit(1)
  if (r.error) throw new Error("P2_LOCAL_READ_FAILED_" + table + "_" + r.error.code)
}
const p = await client.from("pages").select("id").eq("slug","p2-local-fixture")
if (p.error || p.data.length !== 0) {
  throw new Error("P2_LOCAL_DRAFT_RLS_FAILED")
}
console.log("P2_LOCAL_READONLY_PASS " + JSON.stringify({ endpoint: "loopback", schema: 5, unpublishedFixtureIsPrivate: true, writes: 0 }))
