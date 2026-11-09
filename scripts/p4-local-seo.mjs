import { randomUUID } from "node:crypto"
import { readFile } from "node:fs/promises"
import { spawnSync } from "node:child_process"
import { createClient } from "@supabase/supabase-js"
import { assertLocalSupabaseApi } from "./p2-local-isolation.mjs"

const local = (process.env.P5_LOCAL_URL ?? "http://127.0.0.1:54321/").replace(/\/?$/, "/")
assertLocalSupabaseApi(local)
const anon = process.env.P5_LOCAL_ANON_KEY
const serviceKey = process.env.P5_LOCAL_SERVICE_KEY
if (!anon || !serviceKey) throw Error("P4_SEO_LOCAL_KEYS_MISSING")
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
const service = createClient(local, serviceKey, options)
const editor = createClient(local, anon, options)
const suffix = randomUUID().slice(0, 8)
const password = "OnlyLocalSeo!" + randomUUID().replaceAll("-", "").slice(0, 20)
const email = `p4-seo-${suffix}@example.invalid`
const title = "Título SEO fictício " + suffix
const description = "Descrição estritamente sintética para teste de build"
const canonical = "https://example.invalid/p4/"
const image = "https://example.invalid/p4-preview.png"
const json = { canonical, ogImage: image, robots: "noindex,nofollow" }
let userId, pageId, settingsOriginal
let passed = 0
const pass = (name, detail={}) => {
  passed++
  console.log("P4_LOCAL_SEO_" + name + " " + JSON.stringify({ result: "PASS", ...detail }))
}
const must = (test, name) => { if (!test) throw Error("P4_LOCAL_SEO_FAIL_" + name) }
const get = async (promise, name) => {
  const r = await promise
  if (r.error || !r.data) throw Error(name + ":" + (r.error?.code ?? "missing"))
  return r.data
}
try {
  const created=await service.auth.admin.createUser({email,password,email_confirm:true})
  if (created.error || !created.data.user) throw Error("P4_LOCAL_SEO_CREATE_ADMIN")
  userId=created.data.user.id
  const membership=await service.from("admin_users").insert({user_id:userId,role:"editor"})
  if(membership.error)throw Error("P4_LOCAL_SEO_ADMIN_ROLE")
  const login=await editor.auth.signInWithPassword({email,password})
  if(login.error)throw Error("P4_LOCAL_SEO_JWT")
  const settings=await get(service.from("site_settings").select("*").limit(1).single(),"P4_LOCAL_SEO_SETTINGS")
  settingsOriginal=settings
  const home=await get(service.from("pages").insert({
    slug:"home",title:"Home de homologação sintética",status:"published",
  }).select("id").single(),"P4_LOCAL_SEO_HOME")
  pageId=home.id
  const payload={p_page_id:pageId,p_settings_id:settings.id,
    p_page_seo_title:title,p_page_seo_description:description,
    p_site_title:"Site fictício P4",p_site_description:"Site de teste local",
    p_locale:"pt-BR",p_seo_json:json,p_status:"published"}
  const written=await editor.rpc("save_home_seo_atomic",payload)
  must(!written.error,"RPC_SAVE")
  const [page,site]=await Promise.all([
    get(editor.from("pages").select("seo_title,seo_description,status").eq("id",pageId).single(),"P4_SEO_PAGE_READ"),
    get(editor.from("site_settings").select("site_title,locale,seo_json,status").eq("id",settings.id).single(),"P4_SEO_SETTINGS_READ"),
  ])
  must(page.seo_title===title&&page.seo_description===description&&page.status==="published"&&
    site.locale==="pt-BR"&&site.status==="published"&&site.seo_json.canonical===canonical,
    "PERSISTENCE")
  pass("RPC_SAVE_RELOAD",{adminJWT:true,settings:true,page:true})
  const rejected=await editor.rpc("save_home_seo_atomic",{...payload,p_locale:"invalid",p_page_seo_title:"SHOULD_ROLLBACK"})
  must(Boolean(rejected.error),"INVALID_ACCEPTED")
  const after=await get(editor.from("pages").select("seo_title").eq("id",pageId).single(),"P4_SEO_AFTER_FAILURE")
  must(after.seo_title===title,"INVALID_PARTIAL_WRITE")
  pass("INVALID_PAYLOAD_ROLLBACK",{pageIntact:true})

  const build=spawnSync("pnpm",["build"],{
    cwd:process.cwd(),encoding:"utf8",timeout:240000,
    env:{...process.env,
      VITE_SUPABASE_URL:"http://127.0.0.1:54321",
      VITE_SUPABASE_PUBLISHABLE_KEY:anon,
      P4_LOCAL_SYNTHETIC_SEO:"true"},
  })
  if(build.error||build.status!==0){
    console.error((build.stdout??"").slice(-2500),(build.stderr??"").slice(-1500))
    throw Error("P4_SEO_BUILD_FAILED:"+(build.status??"spawn"))
  }
  const html=await readFile("dist/index.html","utf8")
  const robots=await readFile("dist/robots.txt","utf8")
  const sitemap=await readFile("dist/sitemap.xml","utf8")
  must(html.includes(`<title>${title}</title>`) && html.includes(description),"STATIC_TITLE_DESCRIPTION")
  must(html.includes(`content="${image}"`) && html.includes('property="og:locale" content="pt_BR"'),"STATIC_OG")
  must(html.includes(`rel="canonical" href="${canonical}"`) &&
    html.includes('name="robots" content="noindex,nofollow"'),"STATIC_CANONICAL_ROBOTS")
  must(robots.includes("Disallow: /admin") && sitemap.includes("https://example.invalid/"),"STATIC_ROBOTS_SITEMAP")
  pass("BUILD_HTML_PARITY",{title:true,description:true,og:true,locale:true})
  pass("CANONICAL_ROBOTS_SITEMAP",{canonical:true,robots:true,sitemap:true})
  pass("PUBLISH_STATUS",{page:true,site:true})
}finally{
  if(pageId)await service.from("pages").delete().eq("id",pageId)
  if(settingsOriginal)await service.from("site_settings").update({
    site_title:settingsOriginal.site_title,description:settingsOriginal.description,
    locale:settingsOriginal.locale,seo_json:settingsOriginal.seo_json,status:settingsOriginal.status,
  }).eq("id",settingsOriginal.id)
  if(userId)await service.auth.admin.deleteUser(userId)
}
console.log("P4_LOCAL_SEO_RESULT "+JSON.stringify({passed,expected:5,endpoint:"127.0.0.1",syntheticOnly:true,cloudConnections:0}))
if(passed!==5)process.exitCode=1
