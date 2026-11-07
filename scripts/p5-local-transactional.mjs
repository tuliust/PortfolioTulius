import { randomUUID } from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { assertLocalSupabaseApi } from "./p2-local-isolation.mjs"

// Strictly isolated localhost transaction checks. NEVER run against cloud production.
// Only synthetic fixtures from seed.local.synthetic.sql are edited.
const endpoint = (process.env.P5_LOCAL_URL ?? "http://127.0.0.1:54321/").replace(/\/?$/, "/")
assertLocalSupabaseApi(endpoint)
const anonKey = process.env.P5_LOCAL_ANON_KEY
const serviceKey = process.env.P5_LOCAL_SERVICE_KEY
if (!anonKey || !serviceKey) throw Error("P5_LOCAL_CREDENTIALS_MISSING")
const clientOptions = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
}
const service = createClient(endpoint, serviceKey, clientOptions)
const admin = createClient(endpoint, anonKey, clientOptions)
const nonAdmin = createClient(endpoint, anonKey, clientOptions)
const publicReader = createClient(endpoint, anonKey, clientOptions)
const suffix = randomUUID().slice(0, 8)
let adminId = null, nonAdminId = null
let sectionBefore, tokenBefore, blockBefore
let sectionId, blockId, tokenKey
let passed = 0
const check = (name, detail) => {
  passed++
  console.log("P5_LOCAL_" + name + " " + JSON.stringify({ result: "PASS", ...detail }))
}
const must = (condition, code) => {
  if (!condition) throw Error(code)
}
const found = async (query, code) => {
  const r = await query
  if (r.error || !r.data) throw Error(code + ":" + (r.error?.code ?? "missing"))
  return r.data
}
const reReadSection = () => found(
  admin.from("sections").select("*").eq("id", sectionId).single(),
  "P5_LOCAL_SECTION_READ",
)
const reReadToken = () => found(
  admin.from("design_tokens").select("*").eq("token_key", tokenKey).single(),
  "P5_LOCAL_TOKEN_READ",
)
const reReadBlock = () => found(
  admin.from("content_blocks").select("*").eq("id", blockId).single(),
  "P5_LOCAL_BLOCK_READ",
)
async function atomicSave(block, content) {
  const r = await admin.rpc("save_content_block_atomic", {
    p_block_id: block.id,
    p_block_type: block.block_type,
    p_content_json: content,
    p_mobile_panel: block.mobile_panel,
    p_sort_order: block.sort_order,
    p_status: block.status,
    p_is_placeholder: block.is_placeholder ?? false,
    p_editorial_note: block.editorial_note ?? null,
    p_placements: [],
  })
  if (r.error) throw Error("P5_LOCAL_ATOMIC_RPC:" + r.error.code + ":" + r.error.message)
}
try {
  const publicDraft = await found(
    publicReader.from("pages").select("id").eq("slug", "p2-local-fixture"),
    "P5_LOCAL_PUBLIC_RLS_READ",
  )
  must(publicDraft.length === 0, "P5_LOCAL_DRAFT_EXPOSED")
  check("ANON_DRAFT_HIDDEN", { fixture: "synthetic", publicRows: 0 })

  const adminEmail = "stage5-admin-" + suffix + "@example.invalid"
  const nonAdminEmail = "stage5-reader-" + suffix + "@example.invalid"
  const password = "LocalStage5!" + randomUUID().replaceAll("-", "").slice(0, 18)
  const created = await service.auth.admin.createUser({
    email: adminEmail, password, email_confirm: true,
  })
  if (created.error || !created.data.user) throw Error("P5_LOCAL_CREATE_ADMIN:" + created.error?.message)
  adminId = created.data.user.id
  const membership = await service.from("admin_users").insert({ user_id: adminId, role: "owner" })
  if (membership.error) throw Error("P5_LOCAL_ADMIN_MEMBERSHIP:" + membership.error.message)
  const signed = await admin.auth.signInWithPassword({ email: adminEmail, password })
  if (signed.error || !signed.data.user) throw Error("P5_LOCAL_SIGNIN_ADMIN")
  check("ADMIN_AUTH", { role: "admin", fixtureOnly: true })

  const section = await found(
    admin.from("sections").select("*").eq("slug", "secao-ficticia").single(),
    "P5_LOCAL_SECTION_FIXTURE",
  )
  sectionId = section.id
  sectionBefore = { title: section.title, animation_preset: section.animation_preset,
    status: section.status, is_visible: section.is_visible }
  must(section.status === "draft" && !section.is_visible, "P5_LOCAL_NOT_DRAFT")
  const title = "Seção de homologação " + suffix
  const revised = await found(admin.from("sections")
    .update({ title, animation_preset: "fade-in" })
    .eq("id", sectionId).select("id,title,animation_preset").single(),
    "P5_LOCAL_SAVE_SECTION")
  must(revised.title === title && revised.animation_preset === "fade-in", "P5_LOCAL_SECTION_SAVE_VALUE")
  const reloaded = await reReadSection()
  must(reloaded.title === title && reloaded.animation_preset === "fade-in",
    "P5_LOCAL_SECTION_RELOAD")
  check("SECTION_SAVE_RELOAD", { nameChanged: true, transition: "fade-in" })

  const archived = await found(admin.from("sections")
    .update({ status: "archived", is_visible: false }).eq("id", sectionId)
    .select("id,status,is_visible").single(), "P5_LOCAL_ARCHIVE")
  must(archived.status === "archived" && archived.is_visible === false,
    "P5_LOCAL_ARCHIVE_INCORRECT")
  const restored = await found(admin.from("sections")
    .update({ status: "published", is_visible: true }).eq("id", sectionId)
    .select("id,status,is_visible").single(), "P5_LOCAL_RESTORE")
  must(restored.status === "published" && restored.is_visible === true,
    "P5_LOCAL_RESTORE_INCORRECT")
  check("ARCHIVE_AND_EXHIBIT", { reversible: true, restored: true })

  tokenKey = "typography.caption"
  const token = await found(admin.from("design_tokens").select("*").eq("token_key", tokenKey).single(),
    "P5_LOCAL_TOKEN_FIXTURE")
  tokenBefore = { display_name: token.display_name, token_value: token.token_value,
    style_config: token.style_config }
  const nextStyle = { ...token.style_config, mobilePx: 14 }
  const tokenUpdated = await found(admin.from("design_tokens")
    .update({ display_name: "Legenda homologação " + suffix, style_config: nextStyle })
    .eq("token_key", tokenKey).select("token_key").single(), "P5_LOCAL_SAVE_TOKEN")
  const tokenReloaded = await reReadToken()
  must(tokenUpdated.token_key === tokenKey &&
    tokenReloaded.display_name === "Legenda homologação " + suffix &&
    Number(tokenReloaded.style_config.mobilePx) === 14, "P5_LOCAL_TOKEN_RELOAD")
  check("IDENTITY_SAVE_RELOAD", { catalogStableKey: true, mobileSize: 14 })

  const block = await found(admin.from("content_blocks").select("*").eq("section_id", sectionId)
    .eq("mobile_panel", "a").single(), "P5_LOCAL_BLOCK_FIXTURE")
  blockId = block.id
  blockBefore = structuredClone(block)
  const json = structuredClone(block.content_json)
  json.items[0].text = "Edição fictícia " + suffix
  await atomicSave(block, json)
  const blockReloaded = await reReadBlock()
  must(blockReloaded.content_json.items[0].text === "Edição fictícia " + suffix,
    "P5_LOCAL_BLOCK_RELOAD")
  check("ATOMIC_BLOCK_SAVE_RELOAD", { rpc: "save_content_block_atomic", jsonb: true })

  const createdOther = await service.auth.admin.createUser({
    email: nonAdminEmail, password, email_confirm: true,
  })
  if (createdOther.error || !createdOther.data.user) throw Error("P5_LOCAL_CREATE_NONADMIN")
  nonAdminId = createdOther.data.user.id
  const signedOther = await nonAdmin.auth.signInWithPassword({
    email: nonAdminEmail, password,
  })
  if (signedOther.error) throw Error("P5_LOCAL_SIGNIN_NONADMIN")
  const attempt = await nonAdmin.rpc("save_content_block_atomic", {
    p_block_id: block.id,
    p_block_type: block.block_type,
    p_content_json: { items: [{ title: "Invasão fictícia", text: "Deve falhar" }] },
    p_mobile_panel: "a",
    p_sort_order: block.sort_order,
    p_status: "draft",
    p_is_placeholder: false,
    p_editorial_note: null,
    p_placements: [],
  })
  must(Boolean(attempt.error), "P5_LOCAL_NONADMIN_WRITE_ALLOWED")
  const unchanged = await reReadBlock()
  must(unchanged.content_json.items[0].text === "Edição fictícia " + suffix,
    "P5_LOCAL_NONADMIN_CHANGED_BLOCK")
  check("NONADMIN_WRITE_DENIED", { rlsRpc: true })

  await atomicSave(blockBefore, blockBefore.content_json)
  const originalBlock = await reReadBlock()
  must(JSON.stringify(originalBlock.content_json) === JSON.stringify(blockBefore.content_json),
    "P5_LOCAL_BLOCK_NOT_RESTORED")
  await found(admin.from("design_tokens")
    .update(tokenBefore).eq("token_key", tokenKey).select("token_key").single(),
    "P5_LOCAL_REVERT_TOKEN")
  const originalToken = await reReadToken()
  must(originalToken.display_name === tokenBefore.display_name &&
    originalToken.style_config.mobilePx === tokenBefore.style_config.mobilePx,
    "P5_LOCAL_TOKEN_NOT_RESTORED")
  await found(admin.from("sections")
    .update(sectionBefore).eq("id", sectionId).select("id").single(),
    "P5_LOCAL_REVERT_SECTION")
  const originalSection = await reReadSection()
  must(originalSection.status === "draft" &&
    originalSection.title === sectionBefore.title &&
    originalSection.animation_preset === sectionBefore.animation_preset &&
    originalSection.is_visible === sectionBefore.is_visible,
    "P5_LOCAL_SECTION_NOT_RESTORED")
  check("FULL_RESTORE", { section: true, token: true, block: true })
} finally {
  // Local stack is discarded after workflow; best-effort restore even on errors.
  if (sectionId && sectionBefore)
    await service.from("sections").update(sectionBefore).eq("id", sectionId)
  if (tokenKey && tokenBefore)
    await service.from("design_tokens").update(tokenBefore).eq("token_key", tokenKey)
  if (blockId && blockBefore)
    await service.from("content_blocks").update({
      content_json: blockBefore.content_json,
      block_type: blockBefore.block_type,
      status: blockBefore.status,
      sort_order: blockBefore.sort_order,
      mobile_panel: blockBefore.mobile_panel,
      is_placeholder: blockBefore.is_placeholder,
      editorial_note: blockBefore.editorial_note,
    }).eq("id", blockId)
  if (adminId) await service.auth.admin.deleteUser(adminId)
  if (nonAdminId) await service.auth.admin.deleteUser(nonAdminId)
}
console.log("P5_LOCAL_RESULT " + JSON.stringify({ passed, expected: 7, endpoint: "127.0.0.1",
  cloudConnections: 0, syntheticOnly: true }))
if (passed !== 7) process.exitCode = 1
