import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "node:crypto"
import { readFile } from "node:fs/promises"
import { assertLocalSupabaseApi } from "./p2-local-isolation.mjs"

const endpoint = (process.env.P5_LOCAL_URL ?? "http://127.0.0.1:54321/").replace(/\/?$/, "/")
assertLocalSupabaseApi(endpoint)
const anonKey = process.env.P5_LOCAL_ANON_KEY
const serviceKey = process.env.P5_LOCAL_SERVICE_KEY
if (!anonKey || !serviceKey || !process.env.P5_LOCAL_VIDEO_FIXTURE)
  throw Error("LOCAL_SYNTHETIC_INPUTS_REQUIRED")
const opts = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
const service = createClient(endpoint, serviceKey, opts)
const admin = createClient(endpoint, anonKey, opts)
const reader = createClient(endpoint, anonKey, opts)
const anon = createClient(endpoint, anonKey, opts)
const bucket = "portfolio-videos"
const path = randomUUID() + ".mp4"
const bytes = await readFile(process.env.P5_LOCAL_VIDEO_FIXTURE)
const users = []
let assetId, blockId, original
const checks = []
const must = (ok, label) => { if (!ok) throw Error(label) }
const pass = (label) => { checks.push(label); console.log("VIDEO_PASS " + label) }
async function dataOf(query, label) {
  const { data, error } = await query
  must(!error && data, label + ":" + (error?.message ?? "missing"))
  return data
}
async function login(client, authorized) {
  const email = "video-" + randomUUID() + "@example.invalid"
  const password = "LocalVideo!" + randomUUID().replaceAll("-", "")
  const created = await service.auth.admin.createUser({email, password, email_confirm:true})
  must(!created.error && created.data.user, "CREATE_SYNTHETIC_USER")
  users.push(created.data.user.id)
  if (authorized) {
    const member = await service.from("admin_users").insert({user_id: created.data.user.id, role:"editor"})
    must(!member.error, "ADMIN_ROLE")
  }
  const signed = await client.auth.signInWithPassword({email,password})
  must(!signed.error, "LOGIN")
}
try {
  must(bytes.length > 0 && bytes.subarray(4,8).toString() === "ftyp", "REAL_MP4_REQUIRED")
  await login(admin, true)
  await login(reader, false)
  const b = await dataOf(service.storage.getBucket(bucket), "BUCKET")
  must(b.public && b.file_size_limit === 50000000 && b.allowed_mime_types?.join(",") === "video/mp4", "BUCKET_SETTINGS")
  pass("BUCKET_LIMIT_MIME")
  const upload = (client, name, type = "video/mp4") =>
    client.storage.from(bucket).upload(name, bytes, {contentType:type,upsert:false})
  must(!!(await upload(anon, randomUUID()+".mp4")).error, "ANON_UPLOAD_ALLOWED")
  must(!!(await upload(reader, randomUUID()+".mp4")).error, "NONADMIN_UPLOAD_ALLOWED")
  pass("ANON_NONADMIN_UPLOAD_DENIED")
  must(!!(await upload(admin, randomUUID()+".txt", "text/plain")).error, "INVALID_MIME_ALLOWED")
  pass("INVALID_MIME_DENIED")
  must(!(await upload(admin, path)).error, "ADMIN_UPLOAD")
  pass("ADMIN_REAL_MP4_UPLOAD")
  const metadata = {storage_bucket:bucket,storage_path:path,mime_type:"video/mp4",file_size:bytes.length,title:"Vídeo sintético",alt_text:"",status:"published"}
  must(!!(await reader.from("media_assets").insert(metadata)).error, "NONADMIN_METADATA_ALLOWED")
  const asset = await dataOf(admin.from("media_assets").insert(metadata).select("id,storage_path,status").single(), "CATALOG")
  assetId = asset.id
  must(asset.storage_path===path && asset.status==="published", "CATALOG_MISMATCH")
  pass("ADMIN_CATALOG_NONADMIN_DENIED")
  const pub = new URL("storage/v1/object/public/"+bucket+"/"+path,endpoint)
  const response = await fetch(pub)
  must(response.ok && Buffer.from(await response.arrayBuffer()).equals(bytes), "PUBLIC_DOWNLOAD_MISMATCH")
  const range = await fetch(pub, {headers:{Range:"bytes=0-31"}})
  must(range.status===206 && Buffer.from(await range.arrayBuffer()).equals(bytes.subarray(0,32)), "RANGE_MISMATCH")
  pass("PUBLIC_BYTES_AND_RANGE")
  const s = await dataOf(service.from("sections").select("id,status").eq("slug","secao-ficticia").single(), "SYNTHETIC_SECTION")
  must(s.status==="draft", "NOT_SYNTHETIC_DRAFT")
  const block = await dataOf(admin.from("content_blocks").select("id,updated_at,content_json").eq("section_id",s.id).eq("mobile_panel","a").single(), "SYNTHETIC_BLOCK")
  blockId=block.id; original=block.content_json
  const next={...original,experienceProjects:[{id:randomUUID(),item:{title:"Projeto sintético",text:"Teste local"},includeInGallery:true,slide:{title:"Vídeo sintético",caption:"Teste local",mediaType:"video",videoPath:path}}]}
  const params={p_section_id:s.id,p_section_changes:{},p_block_id:blockId,p_block_changes:{content_json:next},p_expected_block_updated_at:block.updated_at,p_placements:[]}
  must(!!(await reader.rpc("save_section_block_atomic",params)).error,"NONADMIN_RPC_ALLOWED")
  must(!(await admin.rpc("save_section_block_atomic",params)).error,"ADMIN_RPC_FAILED")
  const saved=await dataOf(admin.from("content_blocks").select("content_json").eq("id",blockId).single(),"RELOAD")
  must(saved.content_json.experienceProjects[0].slide.videoPath===path && saved.content_json.experienceProjects[0].slide.mediaType==="video","VIDEO_LINK_NOT_SAVED")
  pass("EDITOR_RPC_SAVE_RELOAD")
  must(!!(await reader.storage.from(bucket).remove([path])).error || (await fetch(pub)).ok,"NONADMIN_DELETE")
  must((await fetch(pub)).ok,"OBJECT_NOT_PRESERVED")
  pass("NONADMIN_DELETE_DENIED")
  console.log("VIDEO_SYNTHETIC_RESULT "+JSON.stringify({passed:checks.length,expected:8,environment:"local-synthetic",cloudWrites:0}))
} finally {
  if (blockId && original) await service.from("content_blocks").update({content_json:original}).eq("id",blockId)
  if (assetId) await service.from("media_assets").delete().eq("id",assetId)
  await service.storage.from(bucket).remove([path])
  for (const id of users) await service.auth.admin.deleteUser(id)
}

