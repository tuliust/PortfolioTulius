import { randomUUID } from "node:crypto"
import { createRequire } from "node:module"
import puppeteer from "puppeteer-core"

const workspace = process.env.GITHUB_WORKSPACE
if (!workspace) throw Error("P4_RUN_ONLY_IN_ISOLATED_GITHUB_RUNNER")
const requireFromProject = createRequire(workspace + "/package.json")
const { createClient } = requireFromProject("@supabase/supabase-js")
const base = process.env.P4_LOCAL_BASE ?? "http://127.0.0.1:5173"
const endpoint = process.env.P5_LOCAL_URL ?? "http://127.0.0.1:54321/"
if (base !== "http://127.0.0.1:5173" || endpoint !== "http://127.0.0.1:54321/") {
  throw Error("P4_LOCAL_ENDPOINT_GUARD")
}
if (!process.env.P5_LOCAL_ANON_KEY || !process.env.P5_LOCAL_SERVICE_KEY) {
  throw Error("P4_LOCAL_CREDENTIALS_MISSING")
}
const opts = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
const service = createClient(endpoint, process.env.P5_LOCAL_SERVICE_KEY, opts)
const adminApi = createClient(endpoint, process.env.P5_LOCAL_ANON_KEY, opts)
const suffix = randomUUID().slice(0, 8)
const email = `p4-ui-admin-${suffix}@example.invalid`
const password = "OnlyLocalP4!" + randomUUID().replaceAll("-", "").slice(0, 19)
const tests = []
const pass = (name, facts = {}) => {
  tests.push(name)
  console.log("P4_LOCAL_BROWSER_" + name + " " + JSON.stringify({ result: "PASS", ...facts }))
}
const ensure = (condition, name) => { if (!condition) throw Error("P4_LOCAL_BROWSER_FAIL_" + name) }
const get = async (query, name) => {
  const r = await query
  if (r.error || !r.data) throw Error(name + ":" + (r.error?.code ?? "empty"))
  return r.data
}
let userId, browser, page, sectionOriginal, blockOriginal, sectionId, blockId
let pageId = null
let settingsOriginal = null
try {
  const created = await service.auth.admin.createUser({ email, password, email_confirm: true })
  if (created.error || !created.data.user) throw Error("P4_LOCAL_CREATE_USER")
  userId = created.data.user.id
  const admin = await service.from("admin_users").insert({ user_id: userId, role: "editor" })
  if (admin.error) throw Error("P4_LOCAL_ASSIGN_ADMIN")
  const signed = await adminApi.auth.signInWithPassword({ email, password })
  if (signed.error) throw Error("P4_LOCAL_SIGN_IN")
  sectionOriginal = await get(service.from("sections").select("*").eq("slug", "secao-ficticia").single(), "P4_SECTION_SEED")
  sectionId = sectionOriginal.id
  blockOriginal = await get(service.from("content_blocks").select("*").eq("section_id", sectionId).eq("mobile_panel", "a").single(), "P4_BLOCK_SEED")
  blockId = blockOriginal.id
  const meta = "Rótulo administrativo fictício " + suffix
  browser = await puppeteer.launch({ channel: "chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const writes = []
  page.on("request", (r) => {
    const url = new URL(r.url())
    if (r.method() === "POST" && url.pathname.includes("/rest/v1/rpc/")) writes.push(url.pathname.split("/").at(-1))
  })
  await page.goto(base + "/admin/login", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".login-card input[type=email]", { timeout: 20000 })
  await page.type(".login-card input[type=email]", email)
  await page.type(".login-card input[type=password]", password)
  await page.click(".login-card button[type=submit], .login-card .primary-button")
  await page.waitForFunction(() => location.pathname === "/admin" && document.querySelector(".admin-shell"), { timeout: 25000 })
  pass("JWT_ADMIN_LOGIN", { admin: true, fixture: true })

  const chooseModule = await page.evaluate(() => {
    const button = [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((b) => b.textContent?.trim() === "Editor do site")
    if (!button) return false
    button.click()
    return true
  })
  ensure(chooseModule, "EDITOR_MODULE_MISSING")
  await page.waitForSelector(".site-editor-layout .editor-form", { timeout: 15000 })
  const changed = await page.evaluate((desired) => {
    const form = document.querySelector(".site-editor-layout .editor-form")
    if (!form) return false
    const label = [...form.querySelectorAll("label")]
      .find((node) => node.textContent?.includes("Título da seção (nome no CMS)"))
    const input = label?.querySelector("input")
    const select = form.querySelector("select")
    if (!input || !select) return false
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, desired)
    input.dispatchEvent(new Event("input", { bubbles: true }))
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(select, "fade-in")
    select.dispatchEvent(new Event("change", { bubbles: true }))
    return true
  }, meta)
  ensure(changed, "EDITOR_FIELDS_MISSING")
  await page.waitForFunction(() => document.body.textContent?.includes("Alterações não salvas nesta área."), { timeout: 10000 })
  const preSave = await get(adminApi.from("content_blocks").select("content_json").eq("id", blockId).single(), "P4_PRE_SAVE_BLOCK")
  ensure(preSave.content_json?.editorTitle !== meta, "UNSAVED_WAS_WRITTEN")
  pass("UI_DIRTY_NOT_PERSISTED", { written: false })

  const savedButton = await page.evaluate(() => {
    const form = document.querySelector(".site-editor-layout .editor-form")
    const button = [...(form?.querySelectorAll(".form-actions button") ?? [])]
      .find((b) => b.textContent?.trim() === "Salvar")
    if (!button) return false
    button.click()
    return true
  })
  ensure(savedButton, "SAVE_BUTTON_MISSING")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Alterações salvas atomicamente e conferidas no Supabase."),
    { timeout: 20000 },
  )
  ensure(writes.includes("save_section_block_atomic"), "COMPOSITE_RPC_NOT_CALLED")
  ensure(!writes.includes("save_content_block_atomic"), "OLD_BLOCK_RPC_CALLED")
  const savedSection = await get(adminApi.from("sections").select("animation_preset,title").eq("id", sectionId).single(), "P4_RELOAD_SECTION")
  const savedBlock = await get(adminApi.from("content_blocks").select("content_json").eq("id", blockId).single(), "P4_RELOAD_BLOCK")
  ensure(savedSection.animation_preset === "fade-in" && savedBlock.content_json?.editorTitle === meta, "COMPOSITE_RESULT_MISMATCH")
  ensure(savedSection.title === sectionOriginal.title, "PUBLIC_TITLE_MODIFIED_BY_CMS_LABEL")
  pass("UI_COMPOSITE_SAVE_DB_RELOAD", { rpc: "save_section_block_atomic", section: true, block: true, publicTitlePreserved: true })

  await page.reload({ waitUntil: "domcontentloaded" })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  const reopened = await page.evaluate((expected) => {
    const nav = [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((b) => b.textContent?.trim() === "Editor do site")
    nav?.click()
    return new Promise((resolve) => {
      let attempts = 0
      const poll = () => {
        const input = [...document.querySelectorAll(".site-editor-layout .editor-form label")]
          .find((x) => x.textContent?.includes("Título da seção (nome no CMS)"))?.querySelector("input")
        if (input) return resolve(input.value === expected)
        if (++attempts > 40) return resolve(false)
        setTimeout(poll, 120)
      }
      poll()
    })
  }, meta)
  ensure(reopened, "UI_REOPEN_MISMATCH")
  pass("UI_CLOSE_REOPEN", { retainedValue: true })

  // Make the *fictional* section public in the local stack and test both viewports.
  // This never connects to or mutates the production cloud project.
  const addHome = await service.from("pages").insert({ slug: "home", title: "Home fictícia local", seo_title: "SEO fictício local", status: "published" }).select("id").single()
  if (addHome.error) throw Error("P4_LOCAL_HOME:" + addHome.error.code)
  pageId = addHome.data.id
  let result = await service.from("sections").update({ status: "published", is_visible: true, page_id: pageId }).eq("id", sectionId)
  if (result.error) throw Error("P4_PUBLISH_SECTION:" + result.error.code)
  result = await service.from("content_blocks").update({ status: "published" }).eq("id", blockId)
  if (result.error) throw Error("P4_PUBLISH_BLOCK:" + result.error.code)
  for (const viewport of [{width:1440,height:900,kind:"DESKTOP"},{width:390,height:844,kind:"MOBILE"}]) {
    await page.setViewport({ width: viewport.width, height: viewport.height })
    await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
    await page.waitForSelector('[data-section="secao-ficticia"]', { timeout: 18000 })
    const result = await page.evaluate(() => {
      const section = document.querySelector('[data-section="secao-ficticia"]')
      return { exists: !!section, publicTitle: section?.textContent?.includes("Seção sintética"), metadataLeaked: section?.textContent?.includes("Rótulo administrativo fictício") }
    })
    ensure(result.exists && result.publicTitle && !result.metadataLeaked, "RENDERER_" + viewport.kind)
    pass("RENDERER_" + viewport.kind, { publicText: true, metadataPrivate: true })
  }
} finally {
  if (page) await page.close()
  if (browser) await browser.close()
  // The stack is discarded by CI; restoring fixtures is a secondary safety measure.
  if (blockId && blockOriginal) await service.from("content_blocks").update({ content_json: blockOriginal.content_json, status: blockOriginal.status }).eq("id", blockId)
  if (sectionId && sectionOriginal) await service.from("sections").update({ animation_preset: sectionOriginal.animation_preset, status: sectionOriginal.status, is_visible: sectionOriginal.is_visible, page_id: sectionOriginal.page_id }).eq("id", sectionId)
  if (pageId) await service.from("pages").delete().eq("id", pageId)
  if (userId) await service.auth.admin.deleteUser(userId)
}
console.log("P4_LOCAL_BROWSER_RESULT " + JSON.stringify({ passed: tests.length, expected: 6, endpoint: "127.0.0.1", cloudConnections: 0, syntheticOnly: true, checks: tests }))
if (tests.length !== 6) process.exitCode = 1
