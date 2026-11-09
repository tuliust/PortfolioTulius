import { randomUUID } from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { assertLocalSupabaseApi } from "./p2-local-isolation.mjs"

// Only GitHub's isolated Docker Supabase stack, never a cloud database or bucket.
if (!process.env.GITHUB_WORKSPACE) throw Error("P4_MEDIA_REQUIRES_ISOLATED_RUNNER")
const endpoint = (process.env.P5_LOCAL_URL ?? "http://127.0.0.1:54321/").replace(/\/?$/, "/")
assertLocalSupabaseApi(endpoint)
const anonKey = process.env.P5_LOCAL_ANON_KEY
const serviceKey = process.env.P5_LOCAL_SERVICE_KEY
if (!anonKey || !serviceKey) throw Error("P4_MEDIA_LOCAL_KEYS_MISSING")
const opts = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
const service = createClient(endpoint, serviceKey, opts)
const admin = createClient(endpoint, anonKey, opts)
const nonadmin = createClient(endpoint, anonKey, opts)
const anonymous = createClient(endpoint, anonKey, opts)
const uid = randomUUID()
const original = "p4-media/" + uid + ".svg"
const renamed = "p4-media/" + uid + "-renamed.svg"
const failed = "p4-media/" + uid + "-compensation.svg"
const blob = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><rect width="2" height="2" fill="black"/></svg>')
const paths = { "portfolio-private": new Set(), "portfolio-public": new Set() }
const userIds = []
let assetId = null
let passes = 0
const must = (ok, code) => { if (!ok) throw Error("P4_MEDIA_" + code) }
const pass = (name, evidence = {}) => {
  passes++
  console.log("P4_MEDIA_" + name + " " + JSON.stringify({ result: "PASS", ...evidence }))
}
const requireData = async (query, name) => {
  const { data, error } = await query
  must(!error && data, name + ":" + (error?.code ?? "no_data"))
  return data
}
async function createUser(client, role) {
  const email = "p4-media-" + role + "-" + randomUUID() + "@example.invalid"
  const password = "OnlyLocalMedia!" + randomUUID().replaceAll("-", "").slice(0, 20)
  const created = await service.auth.admin.createUser({ email, password, email_confirm: true })
  must(!created.error && created.data.user, "CREATE_USER")
  userIds.push(created.data.user.id)
  if (role === "admin") {
    const membership = await service.from("admin_users").insert({ user_id: created.data.user.id, role: "editor" })
    must(!membership.error, "ADMIN_ROLE")
  }
  const login = await client.auth.signInWithPassword({ email, password })
  must(!login.error, "SIGN_IN")
}
async function upload(bucket, path) {
  const r = await admin.storage.from(bucket).upload(path, blob, { contentType: "image/svg+xml", upsert: false })
  must(!r.error, "UPLOAD_" + bucket + ":" + (r.error?.message ?? ""))
  paths[bucket].add(path)
}
async function exists(bucket, path) {
  const r = await service.storage.from(bucket).download(path)
  return !r.error && !!r.data
}
try {
  await createUser(admin, "admin")
  await createUser(nonadmin, "reader")
  pass("SYNTHETIC_JWT_USERS", { admin: true, nonAdmin: true })

  await upload("portfolio-private", original)
  const asset = await requireData(admin.from("media_assets").insert({
    storage_bucket: "portfolio-private", storage_path: original, mime_type: "image/svg+xml",
    file_size: blob.length, title: "Mídia fictícia P4", alt_text: "Descritivo fictício",
    status: "draft",
  }).select("*").single(), "CATALOG_INSERT")
  assetId = asset.id
  const anonRows = await requireData(anonymous.from("media_assets").select("id").eq("id", assetId), "ANON_PRIVATE_CATALOG")
  const deniedDownload = await anonymous.storage.from("portfolio-private").download(original)
  must(anonRows.length === 0 && !!deniedDownload.error, "PRIVATE_LEAK")
  pass("PRIVATE_STORAGE_AND_RLS", { anonymousRows: 0, anonymousDownloadDenied: true })

  const blocked = await nonadmin.from("media_assets").update({ title: "NOT_ALLOWED" }).eq("id", assetId).select("id").maybeSingle()
  const afterBlocked = await requireData(admin.from("media_assets").select("title").eq("id", assetId).single(), "RECHECK_NONADMIN")
  must((!!blocked.error || !blocked.data) && afterBlocked.title === asset.title, "NONADMIN_MUTATION")
  pass("NONADMIN_WRITE_DENIED", { titleIntact: true })

  const metadata = { title: "Catálogo sintético revisado", alt_text: "Novo texto alternativo fictício",
    credit: "Crédito fictício para auditoria", focal_point: { x: 32, y: 67, zoom: 1.4 } }
  const updated = await requireData(admin.from("media_assets").update(metadata)
    .eq("id", assetId).eq("updated_at", asset.updated_at).select("*").single(), "CAS_METADATA_SAVE")
  must(updated.alt_text === metadata.alt_text && updated.credit === metadata.credit &&
    updated.focal_point?.x === 32 && updated.focal_point?.zoom === 1.4, "METADATA_MISMATCH")
  const stale = await admin.from("media_assets").update({ title: "STALE_CHANGE" })
    .eq("id", assetId).eq("updated_at", asset.updated_at).select("id").maybeSingle()
  must(!stale.error && !stale.data, "STALE_CAS_ACCEPTED")
  const fresh = await requireData(admin.from("media_assets").select("*").eq("id", assetId).single(), "RELOAD_METADATA")
  must(fresh.alt_text === metadata.alt_text && fresh.credit === metadata.credit &&
    fresh.focal_point?.y === 67 && fresh.title === metadata.title, "RELOAD_METADATA_MISMATCH")
  pass("METADATA_ALT_CREDIT_FOCAL_CAS_RELOAD", { alt: true, credit: true, focalPoint: true, staleRejected: true })

  const copied = await admin.storage.from("portfolio-private").copy(original, renamed)
  must(!copied.error, "COPY_RENAME")
  paths["portfolio-private"].add(renamed)
  const renamedRow = await requireData(admin.from("media_assets").update({ storage_path: renamed })
    .eq("id", assetId).eq("updated_at", fresh.updated_at).select("*").single(), "RENAME_CAS")
  const removeOld = await admin.storage.from("portfolio-private").remove([original])
  must(!removeOld.error, "RENAME_REMOVE_OLD")
  paths["portfolio-private"].delete(original)
  must(await exists("portfolio-private", renamed) && !(await exists("portfolio-private", original)), "RENAME_FILE_STATE")
  pass("PRIVATE_RENAME_DB_AND_STORAGE", { oldObjectAbsent: true, newObjectExists: true })

  // A rejected metadata operation after a successful object upload must remove the new object.
  await upload("portfolio-public", failed)
  const intentional = await admin.from("media_assets").insert({
    storage_bucket: "portfolio-public", storage_path: failed, mime_type: "image/svg+xml",
    title: "Invalid status", status: "INVALID_STATUS",
  })
  must(!!intentional.error, "FAILURE_INJECTION_NOT_REJECTED")
  const compensated = await admin.storage.from("portfolio-public").remove([failed])
  must(!compensated.error, "COMPENSATION_REMOVE")
  paths["portfolio-public"].delete(failed)
  const leftover = await requireData(service.from("media_assets").select("id").eq("storage_path", failed), "COMPENSATION_CATALOG")
  must(!(await exists("portfolio-public", failed)) && leftover.length === 0, "COMPENSATION_ORPHAN")
  pass("UPLOAD_SQL_FAILURE_COMPENSATION", { orphanObjects: 0, orphanRows: 0 })

  const downloaded = await admin.storage.from("portfolio-private").download(renamed)
  must(!downloaded.error && downloaded.data, "DOWNLOAD_FOR_PUBLICATION")
  const promoted = await admin.storage.from("portfolio-public").upload(renamed, downloaded.data,
    { contentType: "image/svg+xml", upsert: false })
  must(!promoted.error, "PUBLIC_UPLOAD")
  paths["portfolio-public"].add(renamed)
  const published = await requireData(admin.from("media_assets").update({
    storage_bucket: "portfolio-public", status: "published",
  }).eq("id", assetId).eq("storage_bucket", "portfolio-private")
    .eq("storage_path", renamed).select("*").single(), "PUBLISH_METADATA")
  const publicRows = await requireData(anonymous.from("media_assets")
    .select("id,alt_text,credit,focal_point").eq("id", assetId), "PUBLIC_CATALOG_RELOAD")
  const publicFile = await anonymous.storage.from("portfolio-public").download(renamed)
  must(publicRows.length === 1 && publicRows[0].alt_text === metadata.alt_text &&
    !!publicFile.data && !publicFile.error, "PUBLICATION_NOT_VISIBLE")
  pass("PUBLISHED_PUBLIC_CATALOG_AND_STORAGE", { anonymousReadsPublished: true, altPersisted: true })

  const deleted = await admin.rpc("delete_media_asset_everywhere", {
    p_media_id: assetId, p_expected_updated_at: published.updated_at,
  })
  must(!deleted.error, "DELETE_RPC:" + (deleted.error?.message ?? ""))
  assetId = null
  const removePublished = await admin.storage.from("portfolio-public").remove([renamed])
  must(!removePublished.error, "DELETE_PUBLIC_BYTES")
  paths["portfolio-public"].delete(renamed)
  const afterDeletion = await requireData(anonymous.from("media_assets").select("id").eq("storage_path", renamed), "DELETION_RELOAD")
  must(afterDeletion.length === 0 && !(await exists("portfolio-public", renamed)), "DELETE_RESIDUE")
  pass("CONTROLLED_DELETE_DB_AND_STORAGE", { dbRows: 0, publicObjectAbsent: true })

  console.log("P4_MEDIA_SUMMARY " + JSON.stringify({ passed: passes, environment: "local-synthetic", cloudWrites: 0 }))
} finally {
  if (assetId) await service.from("media_assets").delete().eq("id", assetId)
  for (const [bucket, names] of Object.entries(paths)) {
    if (names.size) await service.storage.from(bucket).remove([...names])
  }
  for (const id of userIds) await service.auth.admin.deleteUser(id)
}
