import assert from "node:assert/strict"
import { randomUUID, createHash } from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { assertIsolatedStagingDestination } from "./p2-stage-destination.mjs"

// P2: manual staging ONLY. Fail closed before any write on absent or mismatched config.
const required = (name) => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error("P2_STAGE_MISSING_" + name)
  return value
}
const ref = required("P2_STAGE_REF")
const endpoint = required("P2_STAGE_URL")
const publishable = required("P2_STAGE_PUBLISHABLE_KEY")
const adminEmail = required("P2_STAGE_ADMIN_EMAIL")
const adminPassword = required("P2_STAGE_ADMIN_PASSWORD")
const otherEmail = required("P2_STAGE_NONADMIN_EMAIL")
const otherPassword = required("P2_STAGE_NONADMIN_PASSWORD")
assertIsolatedStagingDestination({
  ref,
  endpoint,
  acknowledgement: required("P2_STAGE_CONFIRM"),
})
const auth = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
const admin = createClient(endpoint, publishable, auth)
const other = createClient(endpoint, publishable, auth)
const anon = createClient(endpoint, publishable, auth)
const fixture = randomUUID()
const slug = "p2-fixture-" + fixture
const objectPath = "p2-fixture/" + fixture + "/pixel.png"
const payload = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==", "base64")
const digest = (v) => createHash("sha256").update(v).digest("hex")
const must = (result, label) => {
  if (result.error) throw new Error("P2_" + label + "_FAILED: " + (result.error.code ?? "API"))
  return result.data
}
const hits = []
const pass = (name) => { hits.push(name); console.log("P2_STAGE_PASS " + name) }
let pageId = null, mediaId = null
let failed = false
const errors = []
try {
  const signed = await admin.auth.signInWithPassword({ email: adminEmail, password: adminPassword })
  if (signed.error || !signed.data.user) throw new Error("P2_ADMIN_AUTH_FAILED")
  must(await admin.from("admin_users").select("user_id").eq("user_id", signed.data.user.id).single(), "ADMIN_MEMBERSHIP")
  const outsider = await other.auth.signInWithPassword({ email: otherEmail, password: otherPassword })
  if (outsider.error || !outsider.data.user) throw new Error("P2_NONADMIN_AUTH_FAILED")
  if (must(await other.from("admin_users").select("user_id").eq("user_id", outsider.data.user.id), "NONADMIN_MEMBERSHIP").length)
    throw new Error("P2_NONADMIN_IS_ADMIN")
  // Schema/buckets must already exist. A data-less branch may lack the original
  // baseline migration: never bootstrap production from this test suite.
  for (const table of ["pages", "sections", "section_panels", "content_blocks", "media_assets"])
    must(await admin.from(table).select("id").limit(1), "SCHEMA_" + table)
  for (const bucket of ["portfolio-private", "portfolio-public"])
    must(await admin.storage.from(bucket).list("", { limit: 1 }), "BUCKET_" + bucket)
  assert.equal(must(await admin.from("pages").select("id").eq("slug", slug), "SLUG_RESERVED").length, 0)
  pass("ISOLATED_PREFLIGHT_AND_REAL_JWT")

  pageId = must(await admin.from("pages").insert({ slug, title: "Fixture isolada P2", status: "draft" })
    .select("id").single(), "PAGE_CREATE").id
  const sectionId = must(await admin.rpc("create_section_with_panels", { p_page_id: pageId }), "SECTION_RPC_CREATE")
  must(await admin.from("sections").update({ slug, title: "Fixture isolada P2", is_visible: false })
    .eq("id", sectionId), "SECTION_EDIT")
  const blockId = must(await admin.from("content_blocks").insert({
    section_id: sectionId, block_type: "rich_text", mobile_panel: "a", sort_order: 1,
    status: "draft", content_json: { text: "Antes" },
  }).select("id").single(), "BLOCK_CREATE").id
  const saveArgs = (text) => ({
    p_block_id: blockId, p_block_type: "rich_text", p_content_json: { text },
    p_mobile_panel: "a", p_sort_order: 1, p_status: "draft", p_is_placeholder: false,
    p_editorial_note: "Teste P2 isolado", p_placements: [
      { panel_key: "desktop", sort_order: 1 }, { panel_key: "mobile-a", sort_order: 1 },
    ],
  })
  must(await admin.rpc("save_content_block_atomic", saveArgs("Depois")), "BLOCK_RPC_SAVE")
  assert.equal(must(await admin.from("content_blocks").select("content_json")
    .eq("id", blockId).single(), "BLOCK_READ").content_json.text, "Depois")
  const denied = await other.rpc("publish_section", { section_to_publish: sectionId, allow_placeholders: false })
  if (!denied.error) throw new Error("P2_NONADMIN_RPC_NOT_BLOCKED")
  assert.equal(must(await anon.from("sections").select("id").eq("id", sectionId), "ANON_DRAFT").length, 0)
  pass("CMS_WRITE_AND_NONADMIN_DENIAL")

  must(await admin.rpc("publish_section", { section_to_publish: sectionId, allow_placeholders: false }), "SECTION_PUBLISH")
  assert.equal(must(await anon.from("sections").select("id").eq("id", sectionId), "PUBLIC_READ").length, 1)
  must(await admin.from("sections").update({ status: "draft", is_visible: false })
    .eq("id", sectionId), "SECTION_UNPUBLISH")
  must(await admin.rpc("save_content_block_atomic", saveArgs("Antes")), "BLOCK_RESTORE")
  assert.equal(must(await admin.from("content_blocks").select("content_json")
    .eq("id", blockId).single(), "BLOCK_RESTORE_READ").content_json.text, "Antes")
  assert.equal(must(await anon.from("sections").select("id").eq("id", sectionId), "HIDDEN_READ").length, 0)
  pass("CMS_PUBLISH_UNPUBLISH_AND_API_RESTORE")

  must(await admin.storage.from("portfolio-private").upload(objectPath, payload, {
    contentType: "image/png", upsert: false,
  }), "PRIVATE_UPLOAD")
  if (!(await other.storage.from("portfolio-private").download(objectPath)).error)
    throw new Error("P2_NONADMIN_PRIVATE_STORAGE_READ_NOT_BLOCKED")
  const privateBlob = must(await admin.storage.from("portfolio-private").download(objectPath), "PRIVATE_DOWNLOAD")
  assert.equal(digest(Buffer.from(await privateBlob.arrayBuffer())), digest(payload))
  pass("STORAGE_PRIVATE_JWT_AND_SHA256")
  mediaId = must(await admin.from("media_assets").insert({
    storage_bucket: "portfolio-private", storage_path: objectPath, mime_type: "image/png",
    file_size: payload.length, alt_text: "Pixel sintético de homologação", status: "draft",
  }).select("id").single(), "MEDIA_REGISTER").id
  must(await admin.storage.from("portfolio-public").upload(objectPath, payload, {
    contentType: "image/png", upsert: false,
  }), "PUBLIC_UPLOAD")
  must(await admin.from("media_assets").update({ storage_bucket: "portfolio-public", status: "published" })
    .eq("id", mediaId), "MEDIA_PROMOTE")
  const publicBlob = must(await anon.storage.from("portfolio-public").download(objectPath), "ANON_PUBLIC_DOWNLOAD")
  assert.equal(digest(Buffer.from(await publicBlob.arrayBuffer())), digest(payload))
  pass("STORAGE_PROMOTION_AND_ANON_SHA256")
} catch (error) {
  failed = true
  console.log("P2_STAGE_FAILURE " + String(error.message).slice(0,120))
} finally {
  // Cleanup only the random fixture, never existing production/private objects.
  if (mediaId && (await admin.from("media_assets").delete().eq("id", mediaId)).error)
    errors.push("metadata")
  for (const bucket of ["portfolio-private", "portfolio-public"]) {
    if ((await admin.storage.from(bucket).remove([objectPath])).error) errors.push(bucket)
  }
  if (pageId && (await admin.from("pages").delete().eq("id", pageId)).error)
    errors.push("page")
  if (pageId || mediaId) {
    if (must(await admin.from("pages").select("id").eq("slug", slug), "CHECK_PAGE").length) errors.push("remaining_page")
    if (must(await admin.from("media_assets").select("id").eq("storage_path", objectPath), "CHECK_MEDIA").length) errors.push("remaining_media")
  }
  await admin.auth.signOut()
  await other.auth.signOut()
  console.log("P2_STAGE_RESULT " + JSON.stringify({
    result: failed || errors.length ? "FAIL" : "PASS", passes: hits, cleanupErrors: errors,
    uiRollbackTested: false, productionWrites: false,
  }))
  if (failed || errors.length) process.exitCode = 1
}
