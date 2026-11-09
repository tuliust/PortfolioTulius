import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
const sql = readFileSync(new URL("../supabase/migrations/20261109024100_p2_composite_section_block_save.sql", import.meta.url), "utf8")
const script = readFileSync(new URL("./p2-local-composite.mjs", import.meta.url), "utf8")
const workflow = readFileSync(new URL("../.github/workflows/p5-local-transactional.yml", import.meta.url), "utf8")

test("RPC installation is separate and admin-only", () => {
  assert.match(sql, /create or replace function public\.save_section_block_atomic\(/i)
  assert.match(sql, /perform private\.require_portfolio_admin\(\)/i)
  assert.match(sql, /security definer[\s\S]*?set search_path\s*=\s*''/i)
  assert.match(sql, /revoke all on function public\.save_section_block_atomic/i)
  assert.match(sql, /grant execute on function public\.save_section_block_atomic[\s\S]*?to authenticated/i)
  assert.doesNotMatch(sql, /drop table|truncate table|delete from public\./i)
})
test("new contract supports versioned section, block and placements", () => {
  assert.match(sql, /p_expected_section_updated_at timestamptz/i)
  assert.match(sql, /p_expected_block_updated_at timestamptz/i)
  assert.match(sql, /expected_updated_at/i)
  assert.match(sql, /p2_section_conflict/i)
  assert.match(sql, /p2_block_conflict/i)
  assert.match(sql, /p2_placement_conflict/i)
})
test("synthetic workflow never points to a cloud project", () => {
  assert.match(workflow, /supabase@3\.0\.0 start/)
  assert.match(workflow, /127\.0\.0\.1:54321/)
  assert.match(workflow, /node scripts\/p2-local-composite\.mjs/)
  assert.doesNotMatch(workflow, /supabase link|supabase db push|supabase db pull|supabase\/seed\.sql/i)
  assert.match(script, /assertLocalSupabaseApi\(endpoint\)/)
  assert.match(script, /ROLLBACK_AFTER_SECTION_UPDATE/)
  assert.match(script, /TWO_ADMIN_SESSIONS_CONFLICT/)
  assert.match(script, /NONADMIN_RPC_DENIED/)
})