import { randomUUID } from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { assertLocalSupabaseApi } from "./p2-local-isolation.mjs"

// Synthetic-only E2E at PostgREST/RPC layer; the workflow runs this on an isolated Docker stack.
const endpoint = (process.env.P5_LOCAL_URL ?? "http://127.0.0.1:54321/").replace(/\/?$/, "/")
assertLocalSupabaseApi(endpoint)
const anonKey = process.env.P5_LOCAL_ANON_KEY
const serviceKey = process.env.P5_LOCAL_SERVICE_KEY
if (!anonKey || !serviceKey) throw Error("P2_LOCAL_CREDENTIALS_MISSING")
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
const service = createClient(endpoint, serviceKey, options)
const writer = createClient(endpoint, anonKey, options)
const second = createClient(endpoint, anonKey, options)
const reader = createClient(endpoint, anonKey, options)
const users = []
const suffix = randomUUID().slice(0, 8)
let sectionId, blockId, desktopId
let initialSection, initialBlock, originalPlacement
const checks = []
const pass = (name, evidence = {}) => {
  checks.push(name)
  console.log("P2_COMPOSITE_" + name + " " + JSON.stringify({result: "PASS", ...evidence}))
}
const must = (condition, code) => { if (!condition) throw Error(code) }
const value = async (query, code) => {
  const { data, error } = await query
  if (error || !data) throw Error(code + ":" + (error?.code ?? "missing"))
  return data
}
async function addUser(client, role) {
  const email = `p2-${role}-${randomUUID()}@example.invalid`
  const password = "LocalP2!" + randomUUID().replaceAll("-", "").slice(0, 22)
  const r = await service.auth.admin.createUser({email, password, email_confirm:true})
  if (r.error || !r.data.user) throw Error("P2_CREATE_USER")
  users.push(r.data.user.id)
  if (role !== "nonadmin") {
    const e = await service.from("admin_users").insert({user_id:r.data.user.id, role:"editor"})
    if (e.error) throw Error("P2_GRANT_ADMIN")
  }
  const auth = await client.auth.signInWithPassword({email, password})
  if (auth.error) throw Error("P2_SIGNIN")
}
const section = async () => value(writer.from("sections").select("*").eq("id",sectionId).single(), "P2_SECTION_READ")
const block = async () => value(writer.from("content_blocks").select("*").eq("id",blockId).single(),"P2_BLOCK_READ")
const placement = async () => value(writer.from("block_placements").select("*").eq("block_id",blockId).eq("panel_id",desktopId).maybeSingle(),"P2_PLACEMENT_READ")
const compose = (client, params) => client.rpc("save_section_block_atomic", {
  p_section_id: sectionId,
  p_section_changes: {},
  p_block_id: null,
  p_block_changes: null,
  p_placements: [],
  ...params,
})

try {
  const fixture = await value(service.from("sections").select("*").eq("slug","secao-ficticia").single(),"P2_FIXTURE_SECTION")
  sectionId = fixture.id
  initialSection = {title:fixture.title, eyebrow:fixture.eyebrow, intro:fixture.intro,
    animation_preset: fixture.animation_preset}
  const b = await value(service.from("content_blocks").select("*").eq("section_id",sectionId).eq("mobile_panel","a").single(),"P2_FIXTURE_BLOCK")
  blockId = b.id
  initialBlock = {content_json: b.content_json, block_type:b.block_type, sort_order:b.sort_order,
    mobile_panel:b.mobile_panel, status:b.status, is_placeholder:b.is_placeholder,
    editorial_note:b.editorial_note}
  const panel = await value(service.from("section_panels").select("id").eq("section_id",sectionId)
    .eq("panel_key","desktop").single(),"P2_FIXTURE_PANEL")
  desktopId = panel.id
  const existingPlacement = await service.from("block_placements").select("*").eq("block_id",blockId).eq("panel_id",desktopId).maybeSingle()
  if (existingPlacement.error) throw Error("P2_FIXTURE_PLACEMENT:"+existingPlacement.error.code)
  originalPlacement = existingPlacement.data
  must(fixture.status === "draft" && !fixture.is_visible,"P2_NON_SYNTHETIC_SECTION")
  await addUser(writer,"admin1")
  await addUser(second,"admin2")
  await addUser(reader,"nonadmin")
  const draftRead = await value(reader.from("sections").select("id").eq("id",sectionId),"P2_ANON_READ")
  must(draftRead.length===0,"P2_DRAFT_LEAKED")
  pass("AUTH_AND_DRAFT_RLS",{users:3,draftHidden:true})

  const a0=await section(), b0=await block()
  const nextContent=structuredClone(b0.content_json)
  nextContent.items[0].text="Edição atômica fictícia "+suffix
  let r=await compose(writer, {
    p_section_changes:{title:"P2 texto fictício "+suffix,eyebrow:"Subtítulo sintético"},
    p_expected_section_updated_at:a0.updated_at,
    p_block_id:blockId,
    p_expected_block_updated_at:b0.updated_at,
    p_block_changes:{content_json:nextContent},
    p_placements:[{panel_key:"desktop",expected_updated_at:originalPlacement?.updated_at??null,
      sort_order:1,layout_variant:"default",is_visible:true,
      motion_config:{preset:"fade-in",duration:300,delay:0,distance:10,once:true}}],
  })
  must(!r.error,"P2_COMPOSITE_RPC:"+r.error?.message)
  const savedSection=await section(), savedBlock=await block(), savedPlacement=await placement()
  must(savedSection.title==="P2 texto fictício "+suffix &&
    savedSection.eyebrow==="Subtítulo sintético" &&
    savedBlock.content_json.items[0].text===nextContent.items[0].text,
    "P2_COMPOSITE_NOT_PERSISTED")
  pass("COMPOSITE_SAVE_RELOAD",{section:true,block:true})
  must(Boolean(savedPlacement) && savedPlacement.motion_config.preset==="fade-in" &&
    savedPlacement.updated_at,"P2_PLACEMENT_NOT_PERSISTED")
  pass("PLACEMENT_VERSIONED",{placement:true,updatedAt:true})

  // Text-only edits MUST NOT mutate the JSONB block or placement version.
  r=await compose(writer,{p_section_changes:{intro:"Nova introdução fictícia"},
    p_expected_section_updated_at:savedSection.updated_at})
  must(!r.error,"P2_TEXT_ONLY_FAILED")
  const independentBlock=await block(), independentPlacement=await placement()
  must(independentBlock.updated_at===savedBlock.updated_at &&
    independentPlacement.updated_at===savedPlacement.updated_at,"P2_TEXT_ONLY_REWROTE_BLOCK")
  pass("INDEPENDENT_EDIT_NO_REWRITE",{blockUnchanged:true,placementUnchanged:true})

  // Invalid panel is discovered only AFTER section update, requiring transaction rollback.
  const beforeRollback=await section(), beforeBlock=await block(), beforePlacement=await placement()
  r=await compose(writer,{p_section_changes:{title:"SHOULD_ROLLBACK"},
    p_expected_section_updated_at:beforeRollback.updated_at,p_block_id:blockId,
    p_expected_block_updated_at:beforeBlock.updated_at,
    p_placements:[{panel_key:"inexistente",sort_order:1}]})
  must(Boolean(r.error),"P2_EXPECTED_SQL_FAILURE_MISSING")
  const afterRollback=await section(), afterBlock=await block(), afterPlacement=await placement()
  must(afterRollback.title===beforeRollback.title && afterRollback.updated_at===beforeRollback.updated_at &&
    afterBlock.updated_at===beforeBlock.updated_at &&
    afterPlacement.updated_at===beforePlacement.updated_at,"P2_TRANSACTION_DID_NOT_ROLLBACK")
  pass("ROLLBACK_AFTER_SECTION_UPDATE",{section:true,block:true,placement:true})

  // Session B holds a stale version while session A edits.
  const stale = (await value(second.from("sections").select("updated_at").eq("id",sectionId).single(),"P2_SECOND_READ")).updated_at
  r=await compose(writer,{p_section_changes:{title:"Editor A "+suffix},
    p_expected_section_updated_at:(await section()).updated_at})
  must(!r.error,"P2_FIRST_EDITOR_FAILED")
  const collision=await compose(second,{p_section_changes:{title:"Editor B overwrite"},
    p_expected_section_updated_at:stale})
  must(Boolean(collision.error) && (await section()).title==="Editor A "+suffix,"P2_LOST_UPDATE")
  pass("TWO_ADMIN_SESSIONS_CONFLICT",{staleRejected:true})

  const staleBlock=beforeBlock.updated_at
  r=await compose(writer,{p_block_id:blockId,p_expected_block_updated_at:staleBlock,
    p_block_changes:{editorial_note:"Primeiro editor sintético"}})
  must(!r.error,"P2_BLOCK_FIRST_UPDATE_FAILED")
  const changedBlock=await block()
  r=await compose(second,{p_block_id:blockId,p_expected_block_updated_at:staleBlock,
    p_block_changes:{editorial_note:"Sobrescrita indevida"}})
  must(Boolean(r.error) && (await block()).editorial_note===changedBlock.editorial_note,"P2_BLOCK_CAS_BROKEN")
  pass("STALE_BLOCK_CAS",{rejected:true})

  const stablePlacement=await placement()
  r=await compose(writer,{p_block_id:blockId,p_expected_block_updated_at:(await block()).updated_at,
    p_placements:[{panel_key:"desktop",expected_updated_at:stablePlacement.updated_at,
      sort_order:2,layout_variant:"default",is_visible:true,
      motion_config:stablePlacement.motion_config}]})
  must(!r.error,"P2_PLACEMENT_FIRST_FAILED")
  const placed=await placement()
  const stalePlacementRequest=await compose(second,{p_block_id:blockId,
    p_expected_block_updated_at:(await block()).updated_at,
    p_placements:[{panel_key:"desktop",expected_updated_at:stablePlacement.updated_at,
      sort_order:3,layout_variant:"default",is_visible:true,motion_config:placed.motion_config}]})
  must(Boolean(stalePlacementRequest.error) && (await placement()).sort_order===2,"P2_PLACEMENT_CAS_BROKEN")
  pass("STALE_PLACEMENT_CAS",{rejected:true})

  const denied=await compose(reader,{p_section_changes:{title:"Não pode salvar"},
    p_expected_section_updated_at:(await section()).updated_at})
  must(Boolean(denied.error) && (await section()).title==="Editor A "+suffix,"P2_NONADMIN_WRITE")
  pass("NONADMIN_RPC_DENIED",{denied:true})

  const invalid=await compose(writer,{p_section_changes:{slug:"invalid-should-reject"},
    p_expected_section_updated_at:(await section()).updated_at})
  must(Boolean(invalid.error),"P2_INVALID_PAYLOAD_ACCEPTED")
  pass("INVALID_PAYLOAD_DENIED",{denied:true})

  // A pre-P2 client can still use the direct table path after the migration.
  // Its unrelated field must persist and produce a fresh version for P2 clients.
  const beforeLegacy=await section()
  const legacyEyebrow="Cliente legado "+suffix
  const legacySaved=await value(writer.from("sections").update({eyebrow:legacyEyebrow})
    .eq("id",sectionId).eq("updated_at",beforeLegacy.updated_at).select("*").single(),
  "P2_LEGACY_DIRECT_WRITE")
  must(legacySaved.eyebrow===legacyEyebrow && legacySaved.title===beforeLegacy.title &&
    legacySaved.updated_at!==beforeLegacy.updated_at,"P2_LEGACY_WRITE_NOT_PRESERVED")
  pass("LEGACY_CLIENT_WRITE_AFTER_P2",{directTableWrite:true,unrelatedFieldsPreserved:true})

  // Simulate an ACK/network loss by replaying the same successful request with its stale CAS.
  const beforeRetry=await section()
  const payload={p_section_changes:{intro:"Rede simulada "+suffix},
    p_expected_section_updated_at:beforeRetry.updated_at}
  r=await compose(writer,payload)
  must(!r.error,"P2_RETRY_FIRST_WRITE_FAILED")
  const afterFirstWrite=await section()
  const laterLegacyValue="Legado posterior "+suffix
  await value(writer.from("sections").update({eyebrow:laterLegacyValue})
    .eq("id",sectionId).eq("updated_at",afterFirstWrite.updated_at).select("*").single(),
  "P2_LATER_LEGACY_WRITE")
  const retry=await compose(writer,payload)
  const afterRetry=await section()
  must(Boolean(retry.error) && afterRetry.intro==="Rede simulada "+suffix,
    "P2_UNCERTAIN_RESULT_OVERWROTE")
  pass("RETRY_AFTER_UNKNOWN_ACK",{reloadRequired:true})
  must(afterRetry.eyebrow===laterLegacyValue,"P2_RETRY_REMOVED_LATER_LEGACY_WRITE")
  pass("RETRY_PRESERVES_LATER_LEGACY_WRITE",{laterWritePreserved:true})
} finally {
  // Service role operates only against the URL asserted as strict loopback.
  if (blockId && desktopId) {
    if (originalPlacement) {
      await service.from("block_placements").update({sort_order:originalPlacement.sort_order,
        layout_variant:originalPlacement.layout_variant,is_visible:originalPlacement.is_visible,
        motion_config:originalPlacement.motion_config,
        style_config:originalPlacement.style_config})
        .eq("id",originalPlacement.id)
    } else {
      await service.from("block_placements").delete().eq("block_id",blockId).eq("panel_id",desktopId)
    }
  }
  if (blockId && initialBlock) await service.from("content_blocks").update(initialBlock).eq("id",blockId)
  if (sectionId && initialSection) await service.from("sections").update(initialSection).eq("id",sectionId)
  for (const id of users) await service.auth.admin.deleteUser(id)
}
console.log("P2_COMPOSITE_RESULT " + JSON.stringify({passed:checks.length,expected:13,
  endpoint:"127.0.0.1",cloudConnections:0,syntheticOnly:true,checks}))
if (checks.length!==13) process.exitCode=1