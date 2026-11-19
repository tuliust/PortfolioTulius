import { randomUUID } from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { assertLocalSupabaseApi } from "./p2-local-isolation.mjs"

// Only local Supabase CLI + Docker synthetic fixtures; production is forbidden.
const url = (process.env.P5_LOCAL_URL ?? "http://127.0.0.1:54321/").replace(/\/?$/, "/")
assertLocalSupabaseApi(url)
const anon = process.env.P5_LOCAL_ANON_KEY
const secret = process.env.P5_LOCAL_SERVICE_KEY
if (!anon || !secret) throw Error("P5_RPC_LOCAL_KEYS_MISSING")
const opts = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
const service = createClient(url, secret, opts)
const admin = createClient(url, anon, opts)
const reader = createClient(url, anon, opts)
const uid = randomUUID().slice(0, 8)
const users = []
const watched = ["pages", "sections", "section_panels", "content_blocks",
  "block_placements", "site_settings", "content_revisions", "audit_logs"]
let passed = 0
let pageId, homeId, adminId, originalSettings

const must = (ok, name) => { if (!ok) throw Error("P5_RPC_" + name) }
const pass = (name, evidence = {}) => {
  passed++
  console.log("P5_RPC_" + name + " " + JSON.stringify({result:"PASS",...evidence}))
}
async function get(query, name) {
  const r = await query
  if (r.error || r.data == null) throw Error("P5_RPC_" + name + ":" + (r.error?.code ?? "missing"))
  return r.data
}
async function call(client, name, args) {
  const r = await client.rpc(name, args)
  must(!r.error, "ADMIN_" + name + ":" + (r.error?.code ?? "unknown") + ":" + (r.error?.message ?? ""))
  return r.data
}
async function addUser(client, kind) {
  const email = "local-rpc-" + kind + "-" + randomUUID() + "@example.invalid"
  const password = "LocalRpc!" + randomUUID().replaceAll("-", "").slice(0, 22)
  const created = await service.auth.admin.createUser({email,password,email_confirm:true})
  must(!created.error && Boolean(created.data?.user?.id), "USER_CREATE_" + kind)
  const id = created.data.user.id
  users.push(id)
  if(kind === "admin") {
    adminId = id
    const membership = await service.from("admin_users").insert({user_id:id,role:"editor"})
    must(!membership.error, "USER_ADMIN_MEMBERSHIP")
  }
  const signed = await client.auth.signInWithPassword({email,password})
  must(!signed.error && signed.data.user?.id === id, "USER_SIGNIN_" + kind)
  return id
}
async function state() {
  const out = {}
  for (const table of watched) {
    const rows = await get(service.from(table).select("*"), "SNAPSHOT_" + table)
    out[table] = JSON.stringify([...rows].sort((a,b)=>String(a.id).localeCompare(String(b.id))))
  }
  return JSON.stringify(out)
}
async function deny(name, args) {
  const before = await state()
  const r = await reader.rpc(name,args)
  must(r.error?.code === "42501" && r.error.message.includes("portfolio_admin_required"),
    "DENIAL_ERROR_" + name + "_" + (r.error?.code ?? "none"))
  must((await state()) === before, "DENIAL_MUTATED_" + name)
  pass("NONADMIN_" + name,{sqlstate:"42501",unchanged:true})
}
const one = (table,id) => get(service.from(table).select("*").eq("id",id).single(),"READ_" + table)
async function cleanup(q,label) {
  const r=await q
  if(r.error) console.error("P5_RPC_CLEANUP_" + label + ":" + r.error.code)
}

try {
  await addUser(admin,"admin")
  const readerId = await addUser(reader,"reader")
  must((await get(service.from("admin_users").select("user_id").eq("user_id",readerId),"READER_MEMBERSHIP")).length===0,
    "READER_HAS_ADMIN_ROLE")
  pageId = (await get(service.from("pages").insert({
    slug:"p5-rpc-" + uid,title:"Página fictícia",status:"draft",
  }).select("id").single(),"PAGE")).id
  homeId = (await get(service.from("pages").insert({
    slug:"home",title:"Home fictícia local",status:"draft",
  }).select("id").single(),"HOME")).id
  originalSettings = await get(service.from("site_settings").select("*")
    .eq("site_title","Site fictício local").single(),"SETTINGS")

  const sectionA = await call(admin,"create_section_with_panels",{p_page_id:pageId})
  const sectionB = await call(admin,"create_section_with_panels",{p_page_id:pageId})
  must(typeof sectionA==="string" && typeof sectionB==="string" && sectionA!==sectionB,
    "CREATE_IDS")
  const panels = await get(service.from("section_panels")
    .select("id,panel_key,breakpoint").eq("section_id",sectionA),"PANELS")
  must(panels.length===3 && ["desktop","mobile-a","mobile-b"].every(
    key=>panels.some(p=>p.panel_key===key && p.breakpoint===(key==="desktop"?"desktop":"mobile"))),
    "CREATE_PANELS")
  pass("ADMIN_create_section_with_panels",{twoSections:true,devicePanels:3})

  const blockId = (await get(service.from("content_blocks").insert({
    section_id:sectionA,block_type:"cards",mobile_panel:"a",sort_order:1,status:"draft",
    content_json:{items:[{title:"Card fictício",text:"Conteúdo local"}]},
  }).select("id").single(),"BLOCK")).id
  await get(service.from("block_placements").insert([
    {block_id:blockId,panel_id:panels.find(p=>p.panel_key==="desktop").id,sort_order:1},
    {block_id:blockId,panel_id:panels.find(p=>p.panel_key==="mobile-a").id,sort_order:1},
  ]).select("id"),"PLACEMENTS")

  const initialSection = await one("sections",sectionA)
  const initialBlock = await one("content_blocks",blockId)
  const seo = {
    p_page_id:homeId,p_settings_id:originalSettings.id,
    p_page_seo_title:"Título local",p_page_seo_description:"Descrição fictícia",
    p_site_title:"Site local de teste",p_site_description:"Teste sintético",
    p_locale:"pt-BR",p_seo_json:{robots:"noindex,nofollow"},p_status:"draft",
  }
  const atomic = {
    p_block_id:blockId,p_block_type:"cards",
    p_content_json:{items:[{title:"Card fictício",text:"Tentativa proibida"}]},
    p_mobile_panel:"a",p_sort_order:1,p_status:"draft",
    p_is_placeholder:false,p_editorial_note:"Tentativa não admin",p_placements:[],
  }
  const composite = {
    p_section_id:sectionA,p_section_changes:{title:"Tentativa proibida"},
    p_expected_section_updated_at:initialSection.updated_at,
    p_block_id:blockId,p_block_changes:{editorial_note:"Tentativa proibida"},
    p_expected_block_updated_at:initialBlock.updated_at,p_placements:[],
  }
  for (const [name,payload] of [
    ["create_section_with_panels",{p_page_id:pageId}],
    ["duplicate_section",{source_section:sectionA}],
    ["publish_section",{section_to_publish:sectionA,allow_placeholders:false}],
    ["save_content_block_atomic",atomic],
    ["save_home_seo_atomic",seo],
    ["save_section_block_atomic",composite],
    ["swap_section_order",{section_a:sectionA,section_b:sectionB}],
  ]) await deny(name,payload)

  await call(admin,"save_content_block_atomic",{
    ...atomic,p_content_json:{items:[{title:"Card fictício",text:"Edição autorizada"}]},
    p_editorial_note:"Admin local",
  })
  must((await one("content_blocks",blockId)).content_json.items[0].text===
    "Edição autorizada","ATOMIC_NOT_PERSISTED")
  pass("ADMIN_save_content_block_atomic",{saved:true})

  const a0 = await one("sections",sectionA)
  const b0 = await one("content_blocks",blockId)
  await call(admin,"save_section_block_atomic",{
    p_section_id:sectionA,p_section_changes:{title:"Título autorizado"},
    p_expected_section_updated_at:a0.updated_at,p_block_id:blockId,
    p_block_changes:{editorial_note:"Editado conjuntamente"},
    p_expected_block_updated_at:b0.updated_at,p_placements:[],
  })
  must((await one("sections",sectionA)).title==="Título autorizado" &&
    (await one("content_blocks",blockId)).editorial_note==="Editado conjuntamente",
    "COMPOSITE_NOT_PERSISTED")
  pass("ADMIN_save_section_block_atomic",{section:true,block:true})

  const copied = await call(admin,"duplicate_section",{source_section:sectionA})
  must(typeof copied==="string" && copied!==sectionA,"DUPLICATE_ID")
  const copiedPanels = await get(service.from("section_panels").select("id")
    .eq("section_id",copied),"DUPLICATE_PANELS")
  const copiedBlocks = await get(service.from("content_blocks").select("id,status")
    .eq("section_id",copied),"DUPLICATE_BLOCKS")
  must(copiedPanels.length===3 && copiedBlocks.length===1 &&
    copiedBlocks[0].status==="draft","DUPLICATE_TOPOLOGY")
  pass("ADMIN_duplicate_section",{panels:3,blocks:1})

  await call(admin,"publish_section",{section_to_publish:sectionA,allow_placeholders:false})
  must((await one("sections",sectionA)).status==="published" &&
    (await one("content_blocks",blockId)).status==="published","PUBLISH_NOT_PERSISTED")
  pass("ADMIN_publish_section",{published:true})

  const orderA = (await one("sections",sectionA)).sort_order
  const orderB = (await one("sections",copied)).sort_order
  await call(admin,"swap_section_order",{section_a:sectionA,section_b:copied})
  must((await one("sections",sectionA)).sort_order===orderB &&
    (await one("sections",copied)).sort_order===orderA,"SWAP_NOT_PERSISTED")
  pass("ADMIN_swap_section_order",{swapped:true})

  await call(admin,"save_home_seo_atomic",seo)
  must((await one("pages",homeId)).seo_title===seo.p_page_seo_title &&
    (await one("site_settings",originalSettings.id)).site_title===seo.p_site_title,
    "SEO_NOT_PERSISTED")
  pass("ADMIN_save_home_seo_atomic",{page:true,settings:true})
} finally {
  if(originalSettings) await cleanup(service.from("site_settings").update({
    site_title:originalSettings.site_title,description:originalSettings.description,
    locale:originalSettings.locale,seo_json:originalSettings.seo_json,status:originalSettings.status,
  }).eq("id",originalSettings.id),"SETTINGS")
  if(pageId) await cleanup(service.from("pages").delete().eq("id",pageId),"PAGE")
  if(homeId) await cleanup(service.from("pages").delete().eq("id",homeId),"HOME")
  if(adminId) {
    await cleanup(service.from("content_revisions").delete().eq("actor_user_id",adminId),"REVISIONS")
    await cleanup(service.from("audit_logs").delete().eq("user_id",adminId),"AUDIT")
  }
  for(const id of users.reverse()) {
    const deleted=await service.auth.admin.deleteUser(id)
    if(deleted.error) console.error("P5_RPC_CLEANUP_USER:" + deleted.error.message)
  }
}
console.log("P5_RPC_RESULT "+JSON.stringify({
  passed,expected:14,endpoint:"127.0.0.1",syntheticOnly:true,cloudConnections:0,
}))
if(passed!==14) process.exitCode=1
