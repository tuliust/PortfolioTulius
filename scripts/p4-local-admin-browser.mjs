import { randomUUID } from "node:crypto"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
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
let mediaAssetId = null
let mediaStoragePath = null
let mediaTempDir = null
let mediaRecoveryAssetId = null
let mediaRecoveryStoragePath = null
let privateUiAssetId = null
let privateUiOldPath = null
let privateUiNewPath = null
const navigationFixtures = []
let syntheticProfileId = null
let syntheticTestimonialsSectionId = null
let syntheticTestimonialId = null
let syntheticCareerSectionId = null
let syntheticCareerRowId = null
const collectionFixtureRows = []
const revisionFixtureIds = []
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

  // A beforeunload confirmation may still be pending until the parent CMS reload settles.
  page.on("dialog", async (dialog) => {
    if (dialog.type() === "beforeunload") await dialog.accept()
    else await dialog.dismiss()
  })
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 })
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
    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForSelector('[data-section="secao-ficticia"]', { timeout: 18000 })
    const result = await page.evaluate(() => {
      const section = document.querySelector('[data-section="secao-ficticia"]')
      return { exists: !!section, publicTitle: section?.textContent?.includes("Seção sintética"), metadataLeaked: section?.textContent?.includes("Rótulo administrativo fictício") }
    })
    ensure(result.exists && result.publicTitle && !result.metadataLeaked, "RENDERER_" + viewport.kind)
    pass("RENDERER_" + viewport.kind, { publicText: true, metadataPrivate: true })
  }

  // Full media UI loop against the isolated Supabase Storage/PostgREST/Auth stack.
  // Never use production credentials or any fixture outside this loopback runner.
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + "/admin", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  const mediaNav = await page.evaluate(() => {
    const button = [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Mídia")
    button?.click()
    return Boolean(button)
  })
  ensure(mediaNav, "MEDIA_NAVIGATION")
  await page.waitForSelector(".media-library-grid .upload-button, .admin-header .upload-button", { timeout: 15000 })
  mediaTempDir = mkdtempSync(join(tmpdir(), "p4-synthetic-media-ui-"))
  const fileName = "p4-media-ui-" + suffix + ".svg"
  const filePath = join(mediaTempDir, fileName)
  writeFileSync(filePath,
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="black"/></svg>')
  const fileInput = await page.$(".admin-header .upload-button input[type=file]")
  ensure(Boolean(fileInput), "MEDIA_UPLOAD_INPUT")
  await fileInput.uploadFile(filePath)
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Mídia enviada e publicada automaticamente na biblioteca pública."),
    { timeout: 20000 },
  )
  const uploaded = await get(service.from("media_assets").select("*").eq("title", fileName).single(), "MEDIA_UI_UPLOADED_ROW")
  mediaAssetId = uploaded.id
  mediaStoragePath = uploaded.storage_path
  const bytes = await service.storage.from("portfolio-public").download(mediaStoragePath)
  ensure(!bytes.error && Boolean(bytes.data) && uploaded.status === "published", "MEDIA_UI_UPLOAD_INCOMPLETE")
  pass("MEDIA_UI_UPLOAD_AND_PUBLIC_CATALOG", { storage: true, catalog: true })

  const openMedia = async (title) => {
    await page.waitForFunction((name) => [...document.querySelectorAll(".media-library-card")]
      .some((card) => card.textContent?.includes(name)), { timeout: 15000 }, title)
    const clicked = await page.evaluate((name) => {
      const button = [...document.querySelectorAll(".media-library-card")]
        .find((card) => card.textContent?.includes(name))
      button?.click()
      return Boolean(button)
    }, title)
    ensure(clicked, "MEDIA_UI_CARD_NOT_FOUND")
    await page.waitForSelector(".media-library-detail", { timeout: 10000 })
  }
  const updateMediaInput = async (labelText, value) => {
    const changed = await page.evaluate(({ labelText, value }) => {
      const label = [...document.querySelectorAll(".media-library-detail label")]
        .find((node) => node.textContent?.includes(labelText))
      const field = label?.querySelector("input, textarea")
      if (!field) return false
      const setter = Object.getOwnPropertyDescriptor(
        field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
        "value",
      ).set
      setter.call(field, value)
      field.dispatchEvent(new Event("input", { bubbles: true }))
      return true
    }, { labelText, value })
    ensure(changed, "MEDIA_UI_FIELD_MISSING_" + labelText)
    await page.waitForFunction(({ labelText, value }) => {
      const label = [...document.querySelectorAll(".media-library-detail label")]
        .find((node) => node.textContent?.includes(labelText))
      return label?.querySelector("input, textarea")?.value === value
    }, { timeout: 10000 }, { labelText, value })
  }
  const mediaTitle = "Mídia sintética UI " + suffix
  const mediaAlt = "Descrição fictícia verificada " + suffix
  const mediaCredit = "Crédito sintético UI " + suffix
  await openMedia(fileName)
  await updateMediaInput("Título editorial", mediaTitle)
  await updateMediaInput("Texto alternativo", mediaAlt)
  await updateMediaInput("Crédito (opcional)", mediaCredit)
  await page.click(".media-library-frame-control button")
  await page.waitForSelector(".media-frame-dialog", { timeout: 10000 })
  await page.click('.media-frame-zoom button[aria-label="Aumentar zoom"]')
  await page.click(".media-frame-dialog footer button.primary-button")
  await page.waitForFunction(() => document.querySelector(".media-library-detail") &&
    document.querySelector(".media-library-detail")?.textContent?.includes("Zoom: 110%"),
    { timeout: 10000 })
  await page.click(".media-library-detail .media-actions button.primary-button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Metadados salvos e conferidos."),
    { timeout: 20000 })
  const mediaSaved = await get(service.from("media_assets").select("*").eq("id", mediaAssetId).single(), "MEDIA_UI_METADATA_DB")
  ensure(mediaSaved.title === mediaTitle && mediaSaved.alt_text === mediaAlt &&
    mediaSaved.credit === mediaCredit && mediaSaved.focal_point?.zoom === 1.1,
    "MEDIA_UI_METADATA_INCORRECT")
  pass("MEDIA_UI_SAVE_ALT_CREDIT_FOCAL", { title: true, alt: true, credit: true, focalZoom: 1.1 })

  await openMedia(mediaTitle)
  const mediaReopened = await page.evaluate(() => {
    const labels = [...document.querySelectorAll(".media-library-detail label")]
    const field = (name) => labels.find((node) => node.textContent?.includes(name))
      ?.querySelector("input, textarea")?.value
    return {
      alt: field("Texto alternativo"),
      credit: field("Crédito (opcional)"),
      zoom: document.querySelector(".media-library-frame-control")?.textContent,
    }
  })
  ensure(mediaReopened.alt === mediaAlt && mediaReopened.credit === mediaCredit &&
    mediaReopened.zoom?.includes("110%"), "MEDIA_UI_REOPEN_MISMATCH")
  pass("MEDIA_UI_REOPEN_PERSISTED_FIELDS", { alt: true, credit: true, focal: true })
  
  // A successful upload followed by a transient catalog GET failure must
  // leave the already-open unsaved metadata draft intact. All requests target
  // this runner's loopback PostgREST and are intercepted only in this page.
  const pendingAlt = "Rascunho protegido pela falha " + suffix
  await updateMediaInput("Texto alternativo", pendingAlt)
  const recoveryName = "p4-media-catalog-retry-" + suffix + ".svg"
  const recoveryFile = join(mediaTempDir, recoveryName)
  writeFileSync(recoveryFile,
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="4" cy="4" r="2"/></svg>')
  let catalogFailureCount = 0
  const catalogInterceptor = (request) => {
    const u = new URL(request.url())
    if (request.method() === "GET" &&
        u.pathname.endsWith("/rest/v1/media_assets") && u.searchParams.get("select") === "*") {
      // Existing preview refreshes may still be in flight. Deny each catalog
      // read until the new upload's own refresh has been attempted.
      catalogFailureCount++
      void request.respond({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ code: "PGRST503", message: "Falha sintética de leitura do catálogo" }),
      })
      return
    }
    void request.continue()
  }
  await page.setRequestInterception(true)
  page.on("request", catalogInterceptor)
  const recoveryInput = await page.$(".admin-header .upload-button input[type=file]")
  ensure(Boolean(recoveryInput), "MEDIA_UI_RECOVERY_UPLOAD_INPUT")
  await recoveryInput.uploadFile(recoveryFile)
  await page.waitForFunction(() => {
    const text = document.body.textContent ?? ""
    return text.includes("Mídia enviada e publicada automaticamente") ||
      text.includes("Falha sintética de leitura do catálogo") ||
      text.includes("Use JPG, PNG, WebP ou SVG")
  }, { timeout: 10000 })
  console.log("P4_MEDIA_RECOVERY_DIAGNOSTIC " + JSON.stringify({
    injectedCount: catalogFailureCount,
    currentStatus: await page.evaluate(() =>
      [...document.querySelectorAll('[role="status"], .admin-notice')]
        .map((node) => node.textContent?.trim()).filter(Boolean).slice(-6)),
  }))
  // The local proxy can replace the upstream message on HTTP 503. Assert the
  // exact fail-closed UI notice, not the incidental server error description.
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Falha ao atualizar o catálogo; edições em aberto preservadas."),
    { timeout: 18000 })
  page.off("request", catalogInterceptor)
  await page.setRequestInterception(false)
  ensure(catalogFailureCount > 0, "MEDIA_UI_READ_ERROR_NOT_INJECTED")
  const preservedDraft = await page.evaluate(() => {
    const detail = document.querySelector(".media-library-detail")
    const alt = [...(detail?.querySelectorAll("label") ?? [])]
      .find((node) => node.textContent?.includes("Texto alternativo"))
      ?.querySelector("textarea")?.value
    return { open: Boolean(detail), alt }
  })
  const preservedRow = await get(service.from("media_assets")
    .select("alt_text").eq("id", mediaAssetId).single(), "MEDIA_UI_RECOVERY_UNSAVED_DB")
  const recoveryRow = await get(service.from("media_assets")
    .select("id,storage_path").eq("title", recoveryName).single(), "MEDIA_UI_RECOVERY_UPLOAD_DB")
  mediaRecoveryAssetId = recoveryRow.id
  mediaRecoveryStoragePath = recoveryRow.storage_path
  ensure(preservedDraft.open && preservedDraft.alt === pendingAlt &&
    preservedRow.alt_text === mediaAlt, "MEDIA_UI_READ_FAILURE_LOST_DRAFT")
  pass("MEDIA_UI_FAILED_CATALOG_READ_PRESERVES_DRAFT",
    { selected: true, dirtyDraftRetained: true, noUnintendedMetadataSave: true })


  // Concurrent change must invalidate the UI's original updated_at CAS token.
  const concurrentTitle = "Concorrente sintético " + suffix
  const concurrent = await service.from("media_assets")
    .update({ title: concurrentTitle }).eq("id", mediaAssetId).select("id").single()
  ensure(!concurrent.error, "MEDIA_UI_CONCURRENT_FIXTURE")
  await updateMediaInput("Texto alternativo", "Tentativa obsoleta " + suffix)
  await page.click(".media-library-detail .media-actions button.primary-button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Não foi possível confirmar todos os metadados."),
    { timeout: 15000 })
  const retained = await get(service.from("media_assets").select("title,alt_text").eq("id", mediaAssetId).single(), "MEDIA_UI_CONFLICT_DB")
  ensure(retained.title === concurrentTitle && retained.alt_text === mediaAlt, "MEDIA_UI_CAS_OVERWROTE")
  pass("MEDIA_UI_STALE_CAS_REJECTED", { concurrentTitlePreserved: true, altPreserved: true })

  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((button) => button.textContent?.trim() === "Mídia")?.click()
  })
  await page.waitForFunction((title) => [...document.querySelectorAll(".media-library-card")]
    .some((card) => card.textContent?.includes(title)), { timeout: 15000 }, concurrentTitle)
  const clickedDelete = await page.evaluate((title) => {
    const button = [...document.querySelectorAll("button.media-library-remove")]
      .find((node) => node.getAttribute("aria-label")?.includes(title))
    button?.click()
    return Boolean(button)
  }, concurrentTitle)
  ensure(clickedDelete, "MEDIA_UI_DELETE_BUTTON")
  await page.waitForSelector('.admin-confirm-dialog[role="alertdialog"] .danger-button', { timeout: 10000 })
  await page.click('.admin-confirm-dialog[role="alertdialog"] .danger-button')
  await page.waitForFunction((title) => ![...document.querySelectorAll(".media-library-card")]
    .some((card) => card.textContent?.includes(title)), { timeout: 20000 }, concurrentTitle)
  const remaining = await get(service.from("media_assets").select("id").eq("id", mediaAssetId), "MEDIA_UI_DELETE_DB")
  const stored = await service.storage.from("portfolio-public").download(mediaStoragePath)
  ensure(remaining.length === 0 && Boolean(stored.error), "MEDIA_UI_DELETE_ORPHAN")
  pass("MEDIA_UI_DELETE_NO_ORPHANS", { catalogRows: 0, storageObjectAbsent: true })
  mediaAssetId = null
  mediaStoragePath = null

  // The catalog recovers on a fresh authenticated read and the independently
  // successful second upload remains visible and can be deleted without residue.
  await page.waitForFunction((title) => [...document.querySelectorAll(".media-library-card")]
    .some((card) => card.textContent?.includes(title)),
    { timeout: 15000 }, recoveryName)
  const recoveryDelete = await page.evaluate((title) => {
    const button = [...document.querySelectorAll("button.media-library-remove")]
      .find((node) => node.getAttribute("aria-label")?.includes(title))
    button?.click()
    return Boolean(button)
  }, recoveryName)
  ensure(recoveryDelete, "MEDIA_UI_RECOVERY_DELETE_BUTTON")
  await page.waitForSelector('.admin-confirm-dialog[role="alertdialog"] .danger-button',
    { timeout: 10000 })
  await page.click('.admin-confirm-dialog[role="alertdialog"] .danger-button')
  await page.waitForFunction((title) => ![...document.querySelectorAll(".media-library-card")]
    .some((card) => card.textContent?.includes(title)),
    { timeout: 20000 }, recoveryName)
  const recoveredRows = await get(service.from("media_assets")
    .select("id").eq("id", mediaRecoveryAssetId), "MEDIA_UI_RECOVERY_ROWS")
  const recoveredObject = await service.storage.from("portfolio-public").download(mediaRecoveryStoragePath)
  ensure(recoveredRows.length === 0 && Boolean(recoveredObject.error),
    "MEDIA_UI_RECOVERY_LEFT_ORPHANS")
  pass("MEDIA_UI_CATALOG_RECOVERY_AND_DELETE", { reloaded: true, catalogRows: 0, storageObjectAbsent: true })
  mediaRecoveryAssetId = null
  mediaRecoveryStoragePath = null

  // Private-object rename must pass through the real editor, CAS, upload and
  // auto-publication. The source bucket must retain no unreferenced duplicate.
  const privateOldName = "private-media-" + suffix + ".svg"
  const privateNewName = "private-media-renamed-" + suffix + ".svg"
  privateUiOldPath = "p4-ui/" + privateOldName
  privateUiNewPath = "p4-ui/" + privateNewName
  const localSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="black"/></svg>')
  const privateUpload = await service.storage.from("portfolio-private").upload(
    privateUiOldPath, localSvg, { contentType: "image/svg+xml" },
  )
  ensure(!privateUpload.error, "MEDIA_UI_PRIVATE_SEED_UPLOAD")
  const privateSeed = await service.from("media_assets").insert({
    storage_bucket: "portfolio-private", storage_path: privateUiOldPath,
    mime_type: "image/svg+xml", file_size: localSvg.length,
    title: privateOldName, alt_text: "Prévia privada de teste",
    status: "draft",
  }).select("id").single()
  ensure(!privateSeed.error && privateSeed.data, "MEDIA_UI_PRIVATE_SEED_DB")
  privateUiAssetId = privateSeed.data.id
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 15000 })
  await page.evaluate(() =>
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Mídia")?.click(),
  )
  await openMedia(privateOldName)
  await updateMediaInput("Nome do arquivo físico", privateNewName)
  await page.click(".media-library-detail .media-actions button.primary-button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Metadados salvos e mídia publicada."),
    { timeout: 25000 })
  const privateResult = await get(service.from("media_assets")
    .select("*").eq("id", privateUiAssetId).single(), "MEDIA_UI_PRIVATE_AFTER_PUBLISH")
  const publicCopied = await service.storage.from("portfolio-public").download(privateUiNewPath)
  const oldPrivate = await service.storage.from("portfolio-private").download(privateUiOldPath)
  const renamedPrivate = await service.storage.from("portfolio-private").download(privateUiNewPath)
  ensure(privateResult.storage_bucket === "portfolio-public" &&
    privateResult.status === "published" &&
    privateResult.storage_path === privateUiNewPath &&
    privateResult.title === privateNewName &&
    !publicCopied.error && Boolean(publicCopied.data) &&
    Boolean(oldPrivate.error) && Boolean(renamedPrivate.error),
    "MEDIA_UI_PRIVATE_RENAME_LEFT_ORPHAN")
  pass("MEDIA_UI_PRIVATE_RENAME_AUTO_PUBLISH_NO_ORPHANS",
    { newName: true, publicVisible: true, privateSourceAbsent: true, privateCopyAbsent: true })

  // The final delete must clear both catalog and published physical storage.
  await page.waitForFunction((title) =>
    [...document.querySelectorAll(".media-library-card")]
      .some((node) => node.textContent?.includes(title)),
    { timeout: 15000 }, privateNewName)
  const removePublishedPrivate = await page.evaluate((title) => {
    const button = [...document.querySelectorAll("button.media-library-remove")]
      .find((node) => node.getAttribute("aria-label")?.includes(title))
    button?.click()
    return Boolean(button)
  }, privateNewName)
  ensure(removePublishedPrivate, "MEDIA_UI_PRIVATE_PUBLISHED_DELETE_BUTTON")
  await page.waitForSelector('.admin-confirm-dialog[role="alertdialog"] .danger-button',
    { timeout: 10000 })
  await page.click('.admin-confirm-dialog[role="alertdialog"] .danger-button')
  await page.waitForFunction((title) => ![...document.querySelectorAll(".media-library-card")]
    .some((node) => node.textContent?.includes(title)),
    { timeout: 20000 }, privateNewName)
  const finalMediaRows = await get(service.from("media_assets")
    .select("id").eq("id", privateUiAssetId), "MEDIA_UI_PRIVATE_DELETE_ROWS")
  const finalPublicObject = await service.storage.from("portfolio-public").download(privateUiNewPath)
  ensure(finalMediaRows.length === 0 && Boolean(finalPublicObject.error),
    "MEDIA_UI_PRIVATE_DELETE_LEFT_ORPHAN")
  pass("MEDIA_UI_PUBLISHED_PRIVATE_DELETE_NO_ORPHANS",
    { rows: 0, publicObjectAbsent: true, privateObjectAbsent: true })
  privateUiAssetId = null
  privateUiOldPath = null
  privateUiNewPath = null

  // Version conflict through the real section form: reject a stale composite
  // RPC attempt without falling back to another database write.
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Editor do site")?.click()
  })
  await page.waitForSelector(".site-editor-layout .editor-form select", { timeout: 15000 })
  const changedTransition = await page.evaluate(() => {
    const select = document.querySelector(".site-editor-layout .editor-form select")
    if (!select) return false
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(select, "none")
    select.dispatchEvent(new Event("change", { bubbles: true }))
    return true
  })
  ensure(changedTransition, "SECTION_UI_CAS_FIELD")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Alterações não salvas nesta área."),
    { timeout: 10000 })
  const conflict = await service.from("sections")
    .update({ animation_preset: "stagger" }).eq("id", sectionId).select("id").single()
  ensure(!conflict.error, "SECTION_UI_CONCURRENT_FIXTURE")
  const attemptedSectionSave = await page.evaluate(() => {
    const button = [...document.querySelectorAll(".site-editor-layout .editor-form .form-actions button")]
      .find((node) => node.textContent?.trim() === "Salvar")
    button?.click()
    return Boolean(button)
  })
  ensure(attemptedSectionSave, "SECTION_UI_CAS_SAVE_BUTTON")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Outra edição alterou este conteúdo."),
    { timeout: 18000 })
  const sectionRetained = await get(service.from("sections")
    .select("animation_preset").eq("id", sectionId).single(), "SECTION_UI_CAS_DB")
  ensure(sectionRetained.animation_preset === "stagger", "SECTION_UI_STALE_OVERWRITE")
  pass("SECTION_UI_COMPOSITE_CAS_CONFLICT", { staleRejected: true, noLegacyFallback: true })

  const firstId = randomUUID()
  const secondId = randomUUID()
  const firstLabel = "Menu fictício inicial " + suffix
  const secondLabel = "Menu fictício secundário " + suffix
  const revisedLabel = "Menu fictício revisado " + suffix
  navigationFixtures.push(firstId, secondId)
  const seededMenu = await service.from("navigation_items").insert([
    { id: firstId, label: firstLabel, target_slug: "secao-ficticia-nao-publicada-" + suffix,
      group_name: "Menu", sort_order: 1, is_visible: true, status: "published" },
    { id: secondId, label: secondLabel, target_slug: "secao-ficticia",
      group_name: "Menu", sort_order: 2, is_visible: true, status: "published" },
  ])
  ensure(!seededMenu.error, "NAV_UI_SYNTHETIC_SEED")
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Navegação")?.click()
  })
  await page.waitForSelector('.admin-confirm-dialog[role="alertdialog"]', { timeout: 10000 })
  const discard = await page.evaluate(() => {
    const button = [...document.querySelectorAll(".admin-confirm-dialog button")]
      .find((node) => node.textContent?.trim() === "Sair sem salvar")
    button?.click()
    return Boolean(button)
  })
  ensure(discard, "UNSAVED_NAVIGATION_CONFIRMATION")
  await page.waitForSelector(".navigation-form", { timeout: 15000 })
  pass("SECTION_UI_UNSAVED_NAVIGATION_GUARD", { explicitDiscard: true })

  await page.waitForFunction((name) =>
    [...document.querySelectorAll(".navigation-form label input")]
      .some((input) => input.value === name),
    { timeout: 12000 }, firstLabel)
  // Locate the fixture by its actual editable label. Browser reloads and
  // async catalog loads can otherwise make a generic "first move button"
  // target a different row before React has settled.
  await page.waitForFunction(([first, second]) => {
    const rows = [...document.querySelectorAll(".navigation-form > div")]
    return rows.length === 2 &&
      rows[0]?.querySelector("label input")?.value === first &&
      rows[1]?.querySelector("label input")?.value === second
  }, { timeout: 15000 }, [firstLabel, secondLabel])
  const moved = await page.evaluate((first) => {
    const row = [...document.querySelectorAll(".navigation-form > div")]
      .find((entry) => entry.querySelector("label input")?.value === first)
    const button = row?.querySelector('button[aria-label="Mover item para baixo"]')
    button?.click()
    return Boolean(button)
  }, firstLabel)
  ensure(moved, "NAV_UI_MOVE_BUTTON")
  await page.waitForFunction((name) =>
    document.querySelector(".navigation-form > div label input")?.value === name,
    { timeout: 15000 }, secondLabel)
  const changedLabel = await page.evaluate((value) => {
    const input = document.querySelector(".navigation-form label input")
    if (!input) return false
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, value)
    input.dispatchEvent(new Event("input", { bubbles: true }))
    return true
  }, revisedLabel)
  ensure(changedLabel, "NAV_UI_EDIT_LABEL")
  await page.waitForSelector('.admin-floating-save button.primary-button', { timeout: 15000 })
  await page.click('.admin-floating-save button.primary-button')
  await page.waitForFunction(() => document.body.textContent?.includes("Navegação salva."),
    { timeout: 20000 })
  const menuRows = await get(service.from("navigation_items")
    .select("id,label,sort_order").in("id", navigationFixtures).order("sort_order"), "NAV_UI_DB_ROWS")
  ensure(menuRows.length === 2 && menuRows[0].id === secondId &&
    menuRows[0].sort_order === 1 && menuRows[0].label === revisedLabel &&
    menuRows[1].id === firstId && menuRows[1].sort_order === 2, "NAV_UI_SAVE_MISMATCH")
  pass("NAVIGATION_UI_REORDER_SAVE_RELOAD", { rows: 2, order: true, editedLabel: true })

  for (const v of [
    { width: 1440, height: 900, label: "DESKTOP" },
    { width: 390, height: 844, label: "MOBILE" },
  ]) {
    await page.setViewport({ width: v.width, height: v.height })
    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForSelector('[data-section="secao-ficticia"]', { timeout: 18000 })
    await page.click('header.site-header button[aria-label="Abrir menu"]')
    await page.waitForFunction((name) => {
      const menu = document.querySelector("#site-menu")
      return menu?.getAttribute("aria-hidden") === "false" &&
        menu.textContent?.includes(name)
    }, { timeout: 12000 }, revisedLabel)
    pass("NAVIGATION_RENDERER_" + v.label, { visiblePublishedLabel: true, viewport: v.width })
  }

  // Representative real Hero A/B form coverage with entirely fictional content.
  // Profile and media widgets are never connected to the production database.
  const profileInserted = await service.from("sections").insert({
    page_id: pageId, slug: "perfil", title: "Hero sintético",
    eyebrow: "Cargo sintético", intro: "Apresentação sintética",
    sort_order: 2, status: "published", is_visible: true,
  }).select("id").single()
  ensure(!profileInserted.error && profileInserted.data, "HERO_LOCAL_SECTION_SEED")
  syntheticProfileId = profileInserted.data.id
  const panels = await service.from("section_panels").insert([
    { section_id: syntheticProfileId, breakpoint: "desktop", panel_key: "desktop", sort_order: 1 },
    { section_id: syntheticProfileId, breakpoint: "mobile", panel_key: "mobile-a", sort_order: 1 },
    { section_id: syntheticProfileId, breakpoint: "mobile", panel_key: "mobile-b", sort_order: 2 },
  ]).select("id,panel_key")
  ensure(!panels.error && panels.data?.length === 3, "HERO_LOCAL_PANELS")
  const heroA = [
    { title: "Mensagem fictícia original", text: "Linha menor de teste",
      hero: { badgeText: "TESTE LOCAL", badgeVisible: true } },
    { title: "Destaque de teste", text: "Só homologação" },
  ]
  const heroB = Array.from({ length: 10 }, (_, index) => ({
    title: "Tema " + (index + 1), label: String(index + 1).padStart(2, "0"),
    text: "Detalhe sintético " + index, targetSlug: "secao-ficticia",
    ...(index === 0 ? { hero: { secondaryTitle: "Destaques originais", nextTarget: "secao-ficticia" } } : {}),
  }))
  const heroBlocks = await service.from("content_blocks").insert([
    { section_id: syntheticProfileId, block_type: "hero",
      content_json: { items: heroA }, mobile_panel: "a", sort_order: 1, status: "published" },
    { section_id: syntheticProfileId, block_type: "cards",
      content_json: { items: heroB }, mobile_panel: "b", sort_order: 2, status: "published" },
  ]).select("id,mobile_panel")
  ensure(!heroBlocks.error && heroBlocks.data?.length === 2, "HERO_LOCAL_BLOCKS")
  const idByPanel = Object.fromEntries(panels.data.map((record) => [record.panel_key, record.id]))
  const blockBySide = Object.fromEntries(heroBlocks.data.map((block) => [block.mobile_panel, block.id]))
  const heroPlacements = await service.from("block_placements").insert([
    { block_id: blockBySide.a, panel_id: idByPanel.desktop, sort_order: 1 },
    { block_id: blockBySide.a, panel_id: idByPanel["mobile-a"], sort_order: 1 },
    { block_id: blockBySide.b, panel_id: idByPanel.desktop, sort_order: 2 },
    { block_id: blockBySide.b, panel_id: idByPanel["mobile-b"], sort_order: 1 },
  ])
  ensure(!heroPlacements.error, "HERO_LOCAL_PLACEMENTS")
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + "/admin", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Editor do site")?.click()
  })
  await page.waitForSelector(".site-editor-sidebar", { timeout: 15000 })
  const heroSelected = await page.evaluate(() => {
    const button = [...document.querySelectorAll(".site-editor-sidebar button")]
      .find((node) => node.textContent?.includes("Hero"))
    button?.click()
    return Boolean(button)
  })
  ensure(heroSelected, "HERO_SECTION_NAV")
  await page.waitForFunction(() =>
    document.querySelector(".site-editor-heading")?.textContent?.includes("Hero"),
    { timeout: 12000 })
  const leftSelected = await page.evaluate(() => {
    const tab = [...document.querySelectorAll('.site-editor-area-tabs button[role="tab"], .site-editor-main button[role="tab"]')]
      .find((node) => node.textContent?.includes("Esquerda"))
    tab?.click()
    return Boolean(tab)
  })
  ensure(leftSelected, "HERO_A_TAB")
  await page.waitForSelector(".hero-left-editor", { timeout: 15000 })
  const heroMainText = "Mensagem fictícia revisada " + suffix
  const heroSmall = "Complemento fictício " + suffix
  const heroIntro = "Frase editorial fictícia " + suffix
  const heroBadge = "SELO SINTÉTICO " + suffix
  const editField = async (selector, value) => {
    const edited = await page.evaluate(({ selector, value }) => {
      const input = document.querySelector(selector)
      if (!input) return false
      const proto = input instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, "value").set.call(input, value)
      input.dispatchEvent(new Event("input", { bubbles: true }))
      return true
    }, { selector, value })
    ensure(edited, "HERO_INPUT_" + selector)
  }
  await editField('.hero-left-editor input[aria-label="Mensagem principal, texto grande"]', heroMainText)
  await editField('.hero-left-editor textarea[aria-label="Mensagem principal, texto pequeno"]', heroSmall)
  await editField('.hero-left-editor fieldset[aria-label="Apresentação"] textarea', heroIntro)
  await editField('.hero-left-editor fieldset[aria-label="Selo"] label input', heroBadge)
  await page.click('.hero-left-editor fieldset[aria-label="Selo"] input[type="checkbox"]')
  await page.waitForSelector(".site-editor-main .admin-floating-save button", { timeout: 15000 })
  await page.click(".site-editor-main .admin-floating-save button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Alterações salvas atomicamente e conferidas no Supabase."),
    { timeout: 20000 })
  const leftSaved = await get(service.from("content_blocks").select("content_json")
    .eq("id", blockBySide.a).single(), "HERO_A_DB")
  ensure(leftSaved.content_json.items?.[0]?.title === heroMainText &&
    leftSaved.content_json.items?.[0]?.hero?.badgeText === heroBadge,
    "HERO_A_UI_DB_MISMATCH")
  pass("HERO_A_UI_TEXT_BADGE_SAVE_RELOAD", { publicCopy: true, badge: true, jsonb: true })
  const leftSectionCopy = await get(service.from("sections")
    .select("intro").eq("id", syntheticProfileId).single(), "HERO_A_INTRO_DB")
  ensure(leftSaved.content_json.items?.[0]?.text === heroSmall &&
    leftSaved.content_json.items?.[0]?.hero?.badgeVisible === false &&
    leftSectionCopy.intro === heroIntro, "HERO_A_ADVANCED_FIELDS_MISSING")
  pass("HERO_A_UI_SMALL_COPY_INTRO_BADGE_VISIBILITY",
    { smallCopy: true, intro: true, badgeHidden: true })
  // The parent editor reloads sections after saving; let the dirty-state update
  // propagate before requesting a different area, otherwise its safety dialog
  // correctly intercepts the pending navigation.
  await page.waitForFunction(() =>
    !document.querySelector(".site-editor-main .admin-floating-save") &&
    !document.querySelector(".site-editor-unsaved"),
    { timeout: 15000 })

  const rightSelected = await page.evaluate(() => {
    const tab = [...document.querySelectorAll('.site-editor-main button[role="tab"]')]
      .find((node) => node.textContent?.includes("Direita"))
    tab?.click()
    return Boolean(tab)
  })
  ensure(rightSelected, "HERO_B_TAB")
  await page.waitForSelector(".hero-right-editor", { timeout: 15000 })
  const heroHeading = "Cabeçalho fictício " + suffix
  const heroRole = "Função fictícia " + suffix
  const heroPrincipal = "Botão principal fictício " + suffix
  const heroSecondary = "Destaques novos " + suffix
  await editField('.hero-right-editor fieldset[aria-label="Título Cabeçalho"] input', heroHeading)
  await editField('.hero-right-editor fieldset[aria-label="Subtítulo"] textarea', heroRole)
  await editField('.hero-right-editor fieldset[aria-label="Área de Destaques"] input', heroSecondary)
  const openFirst = await page.evaluate(() => {
    const first = document.querySelector(".hero-right-editor .hero-right-entries details")
    if (!first) return false
    first.open = true
    return true
  })
  ensure(openFirst, "HERO_B_DETAILS")
  await editField('.hero-right-editor fieldset[aria-label="Botões Principais"] .hero-right-entry:first-child input', heroPrincipal)
  await page.click('.hero-right-editor button[aria-label="Descer tema 1"]')
  await page.waitForSelector(".site-editor-main .admin-floating-save button", { timeout: 15000 })
  await page.click(".site-editor-main .admin-floating-save button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Alterações salvas atomicamente e conferidas no Supabase."),
    { timeout: 20000 })
  const [rightSaved, heroSectionSaved] = await Promise.all([
    get(service.from("content_blocks").select("content_json")
      .eq("id", blockBySide.b).single(), "HERO_B_DB"),
    get(service.from("sections").select("title")
      .eq("id", syntheticProfileId).single(), "HERO_SECTION_DB"),
  ])
  ensure(rightSaved.content_json.items?.[0]?.title === "Tema 2" &&
    rightSaved.content_json.items?.[0]?.hero?.secondaryTitle === heroSecondary &&
    heroSectionSaved.title === heroHeading, "HERO_B_UI_DB_MISMATCH")
  pass("HERO_B_UI_COPY_REORDER_GLOBALS", { globalHeroStillOnFirst: true, orderSwapped: true, title: true })
  const heroRoleRow = await get(service.from("sections")
    .select("eyebrow").eq("id", syntheticProfileId).single(), "HERO_B_ROLE_DB")
  ensure(heroRoleRow.eyebrow === heroRole &&
    rightSaved.content_json.items?.[1]?.title === heroPrincipal,
    "HERO_B_ROLE_OR_PRINCIPAL_BUTTON_LOST")
  pass("HERO_B_UI_ROLE_AND_REORDERED_PRINCIPAL_BUTTON",
    { subtitle: true, buttonCopy: true, indexAfterReorder: 1 })

  for (const v of [
    { width: 1440, height: 900, label: "DESKTOP" },
    { width: 390, height: 844, label: "MOBILE" },
  ]) {
    await page.setViewport({ width: v.width, height: v.height })
    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForSelector('[data-section="perfil"]', { timeout: 18000 })
    await page.waitForFunction((headline) =>
      document.querySelector('[data-section="perfil"]')?.textContent?.includes(headline),
      { timeout: 12000 }, heroMainText)
    pass("HERO_RENDERER_" + v.label, { contentFromSyntheticCMS: true, viewport: v.width })
  }

  // Real embedded Testimonials collection UI, including the optimistic
  // concurrency guard and the published renderer. Synthetic rows only.
  const testimonialSection = await service.from("sections").insert({
    page_id: pageId, slug: "depoimentos", title: "Depoimentos fictícios",
    sort_order: 3, status: "published", is_visible: true,
  }).select("id").single()
  ensure(!testimonialSection.error && testimonialSection.data, "TESTIMONIAL_SECTION_SEED")
  syntheticTestimonialsSectionId = testimonialSection.data.id
  const testimonialPanels = await service.from("section_panels").insert([
    { section_id: syntheticTestimonialsSectionId, breakpoint: "desktop",
      panel_key: "desktop", sort_order: 1 },
    { section_id: syntheticTestimonialsSectionId, breakpoint: "mobile",
      panel_key: "mobile-a", sort_order: 1 },
  ]).select("id,panel_key")
  ensure(!testimonialPanels.error && testimonialPanels.data?.length === 2,
    "TESTIMONIAL_PANEL_SEED")
  const testimonialBlock = await service.from("content_blocks").insert({
    section_id: syntheticTestimonialsSectionId, mobile_panel: "a",
    block_type: "cards", sort_order: 1, status: "published",
    content_json: { source_collection: "testimonials", items: [] },
  }).select("id").single()
  ensure(!testimonialBlock.error && testimonialBlock.data, "TESTIMONIAL_BLOCK_SEED")
  const testimonialPlacement = await service.from("block_placements").insert(
    testimonialPanels.data.map((panel) => ({
      block_id: testimonialBlock.data.id, panel_id: panel.id, sort_order: 1,
    })),
  )
  ensure(!testimonialPlacement.error, "TESTIMONIAL_PLACEMENT_SEED")
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + "/admin", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((button) => button.textContent?.trim() === "Editor do site")?.click()
  })
  await page.waitForSelector(".site-editor-sidebar", { timeout: 15000 })
  const openedTestimonials = await page.evaluate(() => {
    const button = [...document.querySelectorAll(".site-editor-sidebar button")]
      .find((node) => node.textContent?.includes("Depoimentos fictícios"))
    button?.click()
    return Boolean(button)
  })
  ensure(openedTestimonials, "TESTIMONIAL_SECTION_NAV")
  await page.waitForFunction(() =>
    document.querySelector(".site-editor-heading")?.textContent?.includes("Depoimentos fictícios"),
    { timeout: 15000 })
  const leftTestimonials = await page.evaluate(() => {
    const tab = [...document.querySelectorAll('.site-editor-area-tabs button[role="tab"]')]
      .find((node) => node.textContent?.includes("Esquerda"))
    tab?.click()
    return Boolean(tab)
  })
  ensure(leftTestimonials, "TESTIMONIAL_LEFT_TAB")
  await page.waitForSelector(".site-editor-testimonials", { timeout: 15000 })
  await page.click(".site-editor-testimonials .site-editor-actions button")
  await page.waitForSelector(".site-editor-testimonials .editor-form", { timeout: 12000 })
  const testimonialName = "Pessoa sintética " + suffix
  const testimonialRole = "Cargo fictício " + suffix
  const testimonialQuote = "Depoimento inicialmente publicado " + suffix
  const changeTestimonial = async (labelText, value) => {
    const changed = await page.evaluate(({ labelText, value }) => {
      const label = [...document.querySelectorAll(".site-editor-testimonials .editor-form label")]
        .find((node) => node.textContent?.trim().startsWith(labelText))
      const field = label?.querySelector("input,textarea")
      if (!field) return false
      const proto = field instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, "value").set.call(field, value)
      field.dispatchEvent(new Event("input", { bubbles: true }))
      return true
    }, { labelText, value })
    ensure(changed, "TESTIMONIAL_FIELD_" + labelText)
  }
  await changeTestimonial("Pessoa", testimonialName)
  await changeTestimonial("Cargo", testimonialRole)
  await changeTestimonial("Depoimento", testimonialQuote)
  await page.select(".site-editor-testimonials .editor-form label:last-child select", "published")
  await page.click(".site-editor-testimonials .form-actions button.secondary-button")
  await page.waitForFunction(() =>
    document.querySelector(".site-editor-testimonials")?.textContent
      ?.includes("Registro salvo e recuperado do Supabase."),
    { timeout: 18000 })
  const createdTestimonial = await get(service.from("testimonials")
    .select("*").eq("author_name", testimonialName).single(), "TESTIMONIAL_UI_DB_INSERT")
  syntheticTestimonialId = createdTestimonial.id
  ensure(createdTestimonial.author_role === testimonialRole &&
    createdTestimonial.quote_text === testimonialQuote &&
    createdTestimonial.status === "published",
    "TESTIMONIAL_UI_INSERT_MISMATCH")
  pass("TESTIMONIAL_UI_CREATE_PUBLISH_DB",
    { person: true, role: true, quote: true, status: "published" })

  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Editor do site")?.click()
  })
  await page.waitForSelector(".site-editor-sidebar", { timeout: 15000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".site-editor-sidebar button")]
      .find((node) => node.textContent?.includes("Depoimentos fictícios"))?.click()
  })
  await page.waitForFunction(() =>
    document.querySelector(".site-editor-heading")?.textContent?.includes("Depoimentos fictícios"),
    { timeout: 15000 })
  await page.evaluate(() => {
    [...document.querySelectorAll('.site-editor-area-tabs button[role="tab"]')]
      .find((node) => node.textContent?.includes("Esquerda"))?.click()
  })
  await page.waitForFunction((name) => [...document.querySelectorAll(
    ".site-editor-testimonials .editor-form label input",
  )].some((input) => input.value === name), { timeout: 15000 }, testimonialName)
  pass("TESTIMONIAL_UI_REOPEN_PERSISTED", { rowSelected: true })

  // A concurrent editor changes the row after this form loaded. CAS must
  // reject our stale copy without overwriting the new published testimony.
  const externalQuote = "Depoimento atualizado em outra sessão " + suffix
  const externalWrite = await service.from("testimonials")
    .update({ quote_text: externalQuote }).eq("id", syntheticTestimonialId).select("id").single()
  ensure(!externalWrite.error, "TESTIMONIAL_CONCURRENT_FIXTURE")
  // Send trusted keystrokes on this reopened record, rather than relying on
  // React's synthetic input setter while the collection is still settling.
  const staleText = "Sobrescrita obsoleta " + suffix
  const quoteInput = await page.$(".site-editor-testimonials .editor-form label.field-wide textarea")
  ensure(Boolean(quoteInput), "TESTIMONIAL_STALE_QUOTE_FIELD")
  await quoteInput.click()
  await page.evaluate(() =>
    document.querySelector(".site-editor-testimonials .editor-form label.field-wide textarea")?.select(),
  )
  await page.keyboard.type(staleText, { delay: 2 })
  const quoteFormState = await page.evaluate(() => ({
    quote: document.querySelector(".site-editor-testimonials .editor-form label.field-wide textarea")?.value,
    saveDisabled: document.querySelector(".site-editor-testimonials .form-actions button.secondary-button")?.disabled,
  }))
  console.log("P4_TESTIMONIAL_CAS_DIAGNOSTIC " + JSON.stringify(quoteFormState))
  await page.waitForFunction((expected) => {
    const button = document.querySelector(".site-editor-testimonials .form-actions button.secondary-button")
    const textarea = document.querySelector(".site-editor-testimonials .editor-form label.field-wide textarea")
    return Boolean(button && !button.disabled && textarea?.value === expected)
  }, { timeout: 10000 }, staleText)
  await page.click(".site-editor-testimonials .form-actions button.secondary-button")
  await page.waitForFunction(() =>
    document.querySelector(".site-editor-testimonials")?.textContent
      ?.includes("O registro foi alterado em outra sessão."),
    { timeout: 15000 })
  const retainedQuote = await get(service.from("testimonials")
    .select("quote_text,status").eq("id", syntheticTestimonialId).single(),
    "TESTIMONIAL_CAS_DB_RECHECK")
  ensure(retainedQuote.quote_text === externalQuote &&
    retainedQuote.status === "published", "TESTIMONIAL_CAS_SILENT_OVERWRITE")
  pass("TESTIMONIAL_UI_STALE_CAS_REJECTED",
    { competingEditPreserved: true, statusUnchanged: true })

  for (const viewport of [
    { label: "DESKTOP", width: 1440, height: 900 },
    { label: "MOBILE", width: 390, height: 844 },
  ]) {
    await page.setViewport({ width: viewport.width, height: viewport.height })
    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForSelector('[data-section="depoimentos"]', { timeout: 18000 })
    await page.waitForFunction(({ name, quote }) => {
      const section = document.querySelector('[data-section="depoimentos"]')
      return section?.textContent?.includes(name) && section?.textContent?.includes(quote)
    }, { timeout: 12000 }, { name: testimonialName, quote: externalQuote })
    pass("TESTIMONIAL_RENDERER_" + viewport.label,
      { publishedRecord: true, currentTextOnly: true, viewport: viewport.width })
  }

  // The Trajetória form is bound to career_experiences, not to copied
  // content_blocks JSON. Verify real edits, CAS conflicts and both renderers.
  const careerSection = await service.from("sections").insert({
    page_id: pageId, slug: "invest-rs", title: "Experiência fictícia",
    eyebrow: "Empresa sintética", sort_order: 4, status: "published", is_visible: true,
  }).select("id").single()
  ensure(!careerSection.error && careerSection.data, "CAREER_UI_SECTION_SEED")
  syntheticCareerSectionId = careerSection.data.id
  const careerRow = await service.from("career_experiences").insert({
    company: "Invest RS", role: "Cargo fictício original",
    location: "Cidade fictícia", description: "Trajetória fictícia original",
    sort_order: 1, status: "published",
  }).select("id").single()
  ensure(!careerRow.error && careerRow.data, "CAREER_UI_RECORD_SEED")
  syntheticCareerRowId = careerRow.data.id

  const openCareerForm = async () => {
    await page.goto(base + "/admin", { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForSelector(".admin-shell", { timeout: 20000 })
    await page.evaluate(() => {
      [...document.querySelectorAll(".admin-sidebar nav button")]
        .find((node) => node.textContent?.trim() === "Editor do site")?.click()
    })
    await page.waitForSelector(".site-editor-experience-nav", { timeout: 15000 })
    await page.click(".site-editor-experience-nav")
    await page.waitForSelector(".site-editor-experience-current", { timeout: 15000 })
    const openedLeft = await page.evaluate(() => {
      const tab = [...document.querySelectorAll('.site-editor-area-tabs button[role="tab"]')]
        .find((node) => node.textContent?.includes("Esquerda"))
      tab?.click()
      return Boolean(tab)
    })
    ensure(openedLeft, "CAREER_UI_LEFT_TAB")
    await page.waitForSelector(".experience-inline-trajectory textarea",
      { timeout: 15000 })
  }
  const editCareerField = async (selector, value) => {
    const handle = await page.$(selector)
    ensure(Boolean(handle), "CAREER_UI_FIELD_" + selector)
    await handle.click()
    await page.keyboard.down("Control")
    await page.keyboard.press("A")
    await page.keyboard.up("Control")
    await page.keyboard.type(value, { delay: 1 })
    await page.waitForFunction(({ selector, value }) =>
      document.querySelector(selector)?.value === value,
      { timeout: 10000 }, { selector, value })
  }
  await page.setViewport({ width: 1440, height: 900 })
  await openCareerForm()
  const editedCareerRole = "Cargo revisado sintético " + suffix
  const editedCareerDescription = "Trajetória revisada sintética " + suffix
  await editCareerField(".experience-inline-trajectory label:nth-child(2) input", editedCareerRole)
  await editCareerField(".experience-inline-trajectory textarea", editedCareerDescription)
  await page.waitForSelector(".site-editor-main .admin-floating-save button.primary-button",
    { timeout: 15000 })
  await page.click(".site-editor-main .admin-floating-save button.primary-button")
  await page.waitForFunction(() =>
    document.querySelector(".experience-inline-trajectory")?.textContent
      ?.includes("Trajetória salva e confirmada no Supabase."),
    { timeout: 20000 })
  const careerSaved = await get(service.from("career_experiences")
    .select("*").eq("id", syntheticCareerRowId).single(), "CAREER_UI_SAVE_DB")
  ensure(careerSaved.role === editedCareerRole &&
    careerSaved.description === editedCareerDescription && careerSaved.status === "published",
    "CAREER_UI_SAVE_MISMATCH")
  pass("CAREER_UI_ROLE_TRAJECTORY_SAVE_DB", { role: true, description: true, published: true })

  await openCareerForm()
  await page.waitForFunction(({ role, description }) =>
    document.querySelector(".experience-inline-trajectory label:nth-child(2) input")?.value === role &&
    document.querySelector(".experience-inline-trajectory textarea")?.value === description,
    { timeout: 15000 },
    { role: editedCareerRole, description: editedCareerDescription })
  pass("CAREER_UI_REOPEN_PERSISTED_FIELDS", { role: true, description: true })

  const careerConcurrent = "Trajetória externa protegida " + suffix
  const careerOverride = await service.from("career_experiences")
    .update({ description: careerConcurrent }).eq("id", syntheticCareerRowId).select("id").single()
  ensure(!careerOverride.error, "CAREER_UI_CONCURRENT_UPDATE")
  await editCareerField(".experience-inline-trajectory textarea",
    "Sobrescrita de carreira obsoleta " + suffix)
  await page.waitForSelector(".site-editor-main .admin-floating-save button.primary-button",
    { timeout: 12000 })
  await page.click(".site-editor-main .admin-floating-save button.primary-button")
  await page.waitForFunction(() =>
    document.querySelector(".experience-inline-trajectory")?.textContent
      ?.includes("A trajetória foi modificada em outra sessão."),
    { timeout: 15000 })
  const careerPreserved = await get(service.from("career_experiences")
    .select("description,status").eq("id", syntheticCareerRowId).single(),
    "CAREER_UI_CAS_DB")
  ensure(careerPreserved.description === careerConcurrent &&
    careerPreserved.status === "published", "CAREER_UI_CAS_OVERWRITE")
  pass("CAREER_UI_STALE_CAS_REJECTED", { concurrentEditPreserved: true })

  for (const viewport of [
    { label: "DESKTOP", width: 1440, height: 900 },
    { label: "MOBILE", width: 390, height: 844 },
  ]) {
    await page.setViewport({ width: viewport.width, height: viewport.height })
    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForSelector('section[data-section="invest-rs"]',
      { timeout: 18000 })
    await page.waitForFunction(() => {
      const button = document.querySelector('section[data-section="invest-rs"] button.experience-view-trajectory')
      return Boolean(button && !button.disabled)
    }, { timeout: 15000 })
    await page.click('section[data-section="invest-rs"] button.experience-view-trajectory')
    await page.waitForFunction((description) =>
      document.querySelector('section[data-section="invest-rs"]')?.textContent?.includes(description),
      { timeout: 15000 }, careerConcurrent)
    pass("CAREER_RENDERER_" + viewport.label,
      { latestPublishedTrajectory: true, viewport: viewport.width })
  }

  // The full Acervo is available inside the authenticated CMS. Verify the
  // seven non-testimonial/non-career collections through their actual inputs,
  // published writes and a fresh PostgREST read, not just payload helpers.
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + "/admin", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  const openAcervo = await page.evaluate(() => {
    const button = [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Acervo")
    button?.click()
    return Boolean(button)
  })
  ensure(openAcervo, "ACERVO_MODULE_NOT_ACCESSIBLE")
  await page.waitForSelector(".collection-tabs button", { timeout: 15000 })
  pass("ACERVO_UI_ALL_COLLECTIONS_ACCESSIBLE", { module: "Acervo", tables: 9 })

  const collectionCases = [
    { table: "portfolio_projects", tab: "Projetos", titleKey: "title",
      fields: { "Título": "Projeto sintético " + suffix,
        "Resumo": "Resumo fictício", "Detalhes": "Descrição fictícia", "Estado do projeto": "Concluído" } },
    { table: "metrics", tab: "Métricas", titleKey: "label",
      fields: { "Rótulo": "Indicador sintético " + suffix,
        "Valor": "91", "Unidade": "%", "Contexto": "Contexto fictício" } },
    { table: "skills", tab: "Competências", titleKey: "name",
      fields: { "Nome": "Competência sintética " + suffix, "Categoria": "Categoria fictícia" } },
    { table: "education", tab: "Formação", titleKey: "course",
      fields: { "Instituição": "Instituição sintética", "Curso": "Curso sintético " + suffix,
        "Tipo": "Graduação", "Início": "2024", "Fim": "2025" } },
    { table: "language_levels", tab: "Idiomas", titleKey: "language",
      fields: { "Idioma": "Idioma sintético " + suffix, "Nível": "Nível de teste",
        "Evidência": "Evidência inventada" } },
    { table: "tool_categories", tab: "Ferramentas", titleKey: "title",
      fields: { "Categoria": "Ferramenta sintética " + suffix,
        "Ferramentas, uma por linha": "Planilha falsa\nAplicação fictícia" } },
    { table: "contact_channels", tab: "Contato", titleKey: "label",
      fields: { "Rótulo": "Contato sintético " + suffix, "Valor": "Visitar teste",
        "URL": "https://example.invalid/teste-" + suffix },
      select: { "Tipo": "website" } },
  ]
  const chooseAcervoTab = async (name) => {
    const clicked = await page.evaluate((tab) => {
      const button = [...document.querySelectorAll(".collection-tabs button")]
        .find((node) => node.textContent?.trim() === tab)
      button?.click()
      return Boolean(button)
    }, name)
    ensure(clicked, "COLLECTION_TAB_" + name)
    await page.waitForFunction((tab) =>
      [...document.querySelectorAll(".collection-tabs button")]
        .some((button) => button.textContent?.trim() === tab && button.getAttribute("aria-selected") === "true"),
      { timeout: 12000 }, name)
  }
  const updateCollectionField = async (name, value) => {
    const field = await page.evaluate(({ name, value }) => {
      const label = [...document.querySelectorAll(".section-editor-layout .editor-form .field-grid > label")]
        .find((node) => node.textContent?.trim().startsWith(name))
      const input = label?.querySelector("input, textarea")
      if (!input) return false
      const proto = input instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, "value").set.call(input, value)
      input.dispatchEvent(new Event("input", { bubbles: true }))
      return true
    }, { name, value })
    ensure(field, "COLLECTION_FIELD_" + name)
    await page.waitForFunction(({ name, value }) => {
      const label = [...document.querySelectorAll(".section-editor-layout .editor-form .field-grid > label")]
        .find((node) => node.textContent?.trim().startsWith(name))
      return label?.querySelector("input, textarea")?.value === value
    }, { timeout: 10000 }, { name, value })
  }
  for (const fixture of collectionCases) {
    await chooseAcervoTab(fixture.tab)
    await page.click(".admin-header button.primary-button")
    await page.waitForSelector(".section-editor-layout .editor-form", { timeout: 12000 })
    for (const [field, value] of Object.entries(fixture.fields))
      await updateCollectionField(field, value)
    for (const [label, value] of Object.entries(fixture.select ?? {})) {
      const changed = await page.evaluate(({ label, value }) => {
        const el = [...document.querySelectorAll(".section-editor-layout .editor-form .field-grid > label")]
          .find((node) => node.textContent?.trim().startsWith(label))?.querySelector("select")
        if (!el) return false
        Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(el, value)
        el.dispatchEvent(new Event("change", { bubbles: true }))
        return true
      }, { label, value })
      ensure(changed, "COLLECTION_SELECT_" + label)
    }
    await page.select(".section-editor-layout .editor-form .field-grid > label:last-child select", "published")
    await page.waitForSelector(".section-editor-layout .editor-form .admin-floating-save button.primary-button",
      { timeout: 12000 })
    await page.click(".section-editor-layout .editor-form .admin-floating-save button.primary-button")
    // Save confirmation can be replaced by a second read of the same
    // collection. Await the cleared draft and verify the DB row below.
    await page.waitForFunction(() =>
      !document.querySelector(".section-editor-layout .editor-form .admin-floating-save"),
      { timeout: 18000 })
    const key = fixture.fields[Object.keys(fixture.fields).find((name) =>
      ["Título", "Rótulo", "Nome", "Curso", "Idioma", "Categoria"].includes(name))]
    const row = await get(service.from(fixture.table).select("*")
      .eq(fixture.titleKey, key).single(), "COLLECTION_ROW_" + fixture.table)
    collectionFixtureRows.push({ table: fixture.table, id: row.id })
    ensure(row.status === "published" && row[fixture.titleKey] === key,
      "COLLECTION_UI_DB_MISMATCH_" + fixture.table)
    if (fixture.table === "tool_categories")
      ensure(row.tools?.length === 2 && row.tools[0]?.name === "Planilha falsa",
        "COLLECTION_TOOLS_JSON_MISMATCH")
    pass("COLLECTION_UI_" + fixture.table.toUpperCase(),
      { created: true, published: true, postgrestVerified: true })
    await page.waitForFunction(() =>
      !document.querySelector(".section-editor-layout .editor-form .admin-floating-save"),
      { timeout: 15000 })
  }

  // A late editor cannot replace a published contact record read before
  // another session's change, and invalid external URLs never reach the DB.
  await updateCollectionField("URL", "javascript:alert(1)")
  await page.waitForSelector(".section-editor-layout .editor-form .admin-floating-save button.primary-button",
    { timeout: 10000 })
  await page.click(".section-editor-layout .editor-form .admin-floating-save button.primary-button")
  await page.waitForFunction(() =>
    document.querySelector(".section-editor-layout .editor-form")?.textContent
      ?.includes("A URL de contato precisa usar HTTPS"),
    { timeout: 10000 })
  const contactRow = collectionFixtureRows.find((record) => record.table === "contact_channels")
  const unchangedContact = await get(service.from("contact_channels").select("*")
    .eq("id", contactRow.id).single(), "CONTACT_URL_VALIDATION_DB")
  ensure(unchangedContact.url.startsWith("https://"), "CONTACT_URL_UNSAFE_WRITE")
  pass("COLLECTION_UI_REJECT_UNSAFE_URL", { safeUrlPreserved: true })

  await updateCollectionField("URL", unchangedContact.url)
  const competingLabel = "Contato alterado externamente " + suffix
  const externalContact = await service.from("contact_channels")
    .update({ label: competingLabel }).eq("id", contactRow.id).select("id").single()
  ensure(!externalContact.error, "CONTACT_CAS_EXTERNAL_FIXTURE")
  await updateCollectionField("Valor", "Tentativa de edição obsoleta " + suffix)
  await page.waitForSelector(".section-editor-layout .editor-form .admin-floating-save button.primary-button",
    { timeout: 10000 })
  await page.click(".section-editor-layout .editor-form .admin-floating-save button.primary-button")
  await page.waitForFunction(() =>
    document.querySelector(".section-editor-layout .editor-form")?.textContent
      ?.includes("O registro foi alterado em outra sessão."),
    { timeout: 14000 })
  const protectedContact = await get(service.from("contact_channels").select("label,value")
    .eq("id", contactRow.id).single(), "COLLECTION_CAS_DB")
  ensure(protectedContact.label === competingLabel &&
    protectedContact.value === unchangedContact.value, "COLLECTION_CAS_SILENT_OVERWRITE")
  pass("COLLECTION_UI_STALE_CAS_REJECTED", { concurrentRowPreserved: true })

  // Status-only unpublication follows the same optimistic concurrency path.
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 15000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Acervo")?.click()
  })
  await page.waitForSelector(".collection-tabs button", { timeout: 12000 })
  await chooseAcervoTab("Contato")
  await page.waitForFunction((label) =>
    [...document.querySelectorAll(".section-editor-layout .section-list button")]
      .some((node) => node.textContent?.includes(label)),
    { timeout: 15000 }, competingLabel)
  await page.evaluate((label) => {
    [...document.querySelectorAll(".section-editor-layout .section-list button")]
      .find((node) => node.textContent?.includes(label))?.click()
  }, competingLabel)
  await page.waitForSelector(".section-editor-layout .editor-form .danger-button", { timeout: 10000 })
  await page.click(".section-editor-layout .editor-form .danger-button")
  await page.waitForSelector(".admin-confirm-dialog .danger-button", { timeout: 10000 })
  await page.click(".admin-confirm-dialog .danger-button")
  await page.waitForFunction(() =>
    document.querySelector(".section-editor-layout .editor-form")?.textContent
      ?.includes("Registro retirado da publicação."),
    { timeout: 14000 })
  const unpublishedContact = await get(service.from("contact_channels")
    .select("status").eq("id", contactRow.id).single(), "CONTACT_UNPUBLISH_DB")
  ensure(unpublishedContact.status === "draft", "CONTACT_UNPUBLISH_FAILED")
  pass("COLLECTION_UI_UNPUBLISH_STATUS", { status: "draft", recordRetained: true })

  // Edit actual placement controls, then verify P2's atomic save writes the
  // requested desktop/mobile presentation without modifying sibling blocks.
  await page.goto(base + "/admin", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Editor do site")?.click()
  })
  await page.waitForSelector(".site-editor-sidebar", { timeout: 15000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".site-editor-sidebar button")]
      .find((node) => node.textContent?.includes("Hero"))?.click()
  })
  await page.waitForFunction(() =>
    document.querySelector(".site-editor-heading")?.textContent?.includes("Hero"),
    { timeout: 12000 })
  await page.evaluate(() => {
    [...document.querySelectorAll('.site-editor-area-tabs button[role="tab"]')]
      .find((node) => node.textContent?.includes("Esquerda"))?.click()
  })
  await page.waitForSelector(".hero-left-editor", { timeout: 15000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".site-editor-subview-actions button")]
      .find((node) => node.textContent?.trim() === "Avançado")?.click()
  })
  await page.waitForSelector(".motion-editor select", { timeout: 15000 })
  const setMotion = async (index, value) => {
    const changed = await page.evaluate(({ index, value }) => {
      const el = document.querySelectorAll(".motion-editor select")[index]
      if (!el) return false
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(el, value)
      el.dispatchEvent(new Event("change", { bubbles: true }))
      return true
    }, { index, value })
    ensure(changed, "PLACEMENT_UI_SELECT_" + index)
    await page.waitForFunction(({ index, value }) =>
      document.querySelectorAll(".motion-editor select")[index]?.value === value,
      { timeout: 10000 }, { index, value })
  }
  const siblingBefore = await get(service.from("block_placements")
    .select("panel_id,layout_variant,is_visible,motion_config")
    .eq("block_id", blockBySide.b).order("panel_id"), "P4_PLACEMENT_SIBLING_BEFORE")
  await setMotion(0, "desktop")
  await setMotion(1, "featured")
  await setMotion(2, "fade-in")
  await setMotion(0, "mobile-a")
  await setMotion(1, "compact")
  await setMotion(2, "stagger")
  const opened = await page.evaluate(() => {
    const details = document.querySelector(".site-editor-device-item")
    if (!details) return false
    details.open = true
    return true
  })
  ensure(opened, "DEVICE_DESKTOP_EDITOR_MISSING")
  const setDeviceNumber = async (root, labelText, value) => {
    const changed = await page.evaluate(({ root, labelText, value }) => {
      const label = [...document.querySelectorAll(root + " label")]
        .find((node) => node.textContent?.trim().startsWith(labelText))
      const field = label?.querySelector('input[type="number"]')
      if (!field) return false
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
        .set.call(field, String(value))
      field.dispatchEvent(new Event("input", { bubbles: true }))
      return true
    }, { root, labelText, value })
    ensure(changed, "DEVICE_NUMERIC_FIELD_" + labelText)
    await page.waitForFunction(({ root, labelText, value }) => {
      const label = [...document.querySelectorAll(root + " label")]
        .find((node) => node.textContent?.trim().startsWith(labelText))
      return label?.querySelector('input[type="number"]')?.value === String(value)
    }, { timeout: 10000 }, { root, labelText, value })
  }
  await setDeviceNumber(".site-editor-device-item fieldset", "Título (px)", 74)
  await page.waitForSelector(".site-editor-main .admin-floating-save button.primary-button",
    { timeout: 12000 })
  await page.click(".site-editor-main .admin-floating-save button.primary-button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Alterações salvas atomicamente e conferidas no Supabase."),
    { timeout: 18000 })
  const placementsAfter = await get(service.from("block_placements")
    .select("panel_id,layout_variant,is_visible,motion_config")
    .eq("block_id", blockBySide.a), "P4_PLACEMENT_AFTER")
  const placed = (key) => placementsAfter.find((row) => row.panel_id === idByPanel[key])
  const siblingAfter = await get(service.from("block_placements")
    .select("panel_id,layout_variant,is_visible,motion_config")
    .eq("block_id", blockBySide.b).order("panel_id"), "P4_PLACEMENT_SIBLING_AFTER")
  ensure(placed("desktop")?.layout_variant === "featured" &&
    placed("desktop")?.motion_config?.preset === "fade-in" &&
    placed("mobile-a")?.layout_variant === "compact" &&
    placed("mobile-a")?.motion_config?.preset === "stagger" &&
    JSON.stringify(siblingBefore) === JSON.stringify(siblingAfter),
    "P4_PLACEMENTS_REWROTE_UNEDITED_PANEL")
  pass("PLACEMENT_UI_DESKTOP_MOBILE_AND_SIBLING_ISOLATION",
    { desktop: true, mobileA: true, otherBlockUnchanged: true })
  const styledDesktop = await get(service.from("content_blocks")
    .select("content_json").eq("id", blockBySide.a).single(), "P4_DEVICE_DESKTOP_DB")
  ensure(styledDesktop.content_json.items?.[0]?.desktop?.titleSize === 74,
    "P4_DEVICE_DESKTOP_PERSISTENCE")
  pass("DEVICE_UI_DESKTOP_TYPOGRAPHY_PERSISTED", { titleSize: 74 })

  await page.waitForFunction(() => !document.querySelector(".site-editor-unsaved"),
    { timeout: 15000 })
  await page.click('.site-editor-subview-actions button[aria-label="Configurações mobile"]')
  await page.waitForSelector(".site-editor-mobile-page .site-editor-device-item", { timeout: 15000 })
  await page.evaluate(() => {
    const details = document.querySelector(".site-editor-mobile-page .site-editor-device-item")
    if (details) details.open = true
  })
  await setDeviceNumber(".site-editor-mobile-page .site-editor-device-item fieldset",
    "Texto (px)", 19)
  await page.waitForSelector(".site-editor-main .admin-floating-save button.primary-button",
    { timeout: 12000 })
  await page.click(".site-editor-main .admin-floating-save button.primary-button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Alterações salvas atomicamente e conferidas no Supabase."),
    { timeout: 18000 })
  const mobileStyled = await get(service.from("content_blocks")
    .select("content_json").eq("id", blockBySide.a).single(), "P4_DEVICE_MOBILE_DB")
  ensure(mobileStyled.content_json.items?.[0]?.mobile?.textSize === 19 &&
    mobileStyled.content_json.items?.[0]?.desktop?.titleSize === 74,
    "P4_DEVICE_MOBILE_REWROTE_DESKTOP")
  pass("DEVICE_UI_MOBILE_TYPOGRAPHY_INDEPENDENT",
    { mobileSize: 19, desktopSizePreserved: 74 })

  // Identity tokens are edited by real DOM controls, not database shortcuts.
  await page.goto(base + "/admin", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 20000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((button) => button.textContent?.trim() === "Identidade")?.click()
  })
  await page.waitForSelector(".identity-catalog .identity-color-row", { timeout: 15000 })
  const testColor = "#E35F27"
  const changedIdentity = await page.evaluate((color) => {
    const el = document.querySelector('.identity-color-row:first-child .identity-color-value input:not([type="color"])')
    if (!el) return false
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, color)
    el.dispatchEvent(new Event("input", { bubbles: true }))
    return true
  }, testColor)
  ensure(changedIdentity, "IDENTITY_UI_HEX_INPUT_MISSING")
  await page.select(".identity-font-row:first-child select", "Inter")
  await page.select(".identity-type-style:first-child .identity-type-fields label:nth-child(2) select",
    "font.body")
  await page.select(".identity-type-style:first-child .identity-type-fields label:nth-child(4) select",
    "96")
  await page.waitForSelector(".identity-catalog .admin-floating-save button.primary-button",
    { timeout: 12000 })
  await page.click(".identity-catalog .admin-floating-save button.primary-button")
  await page.waitForFunction(() =>
    document.querySelector(".identity-catalog")?.textContent?.includes("confirmado(s) no Supabase."),
    { timeout: 18000 })
  const identityRecords = await get(service.from("design_tokens")
    .select("token_key,token_value,style_config")
    .in("token_key", ["color.orange", "font.heading", "typography.profile-main"]),
    "IDENTITY_UI_DB")
  const byIdentityKey = Object.fromEntries(identityRecords.map((row) => [row.token_key, row]))
  ensure(byIdentityKey["color.orange"]?.token_value === testColor &&
    byIdentityKey["font.heading"]?.token_value === "Inter" &&
    byIdentityKey["typography.profile-main"]?.style_config?.fontToken === "font.body" &&
    byIdentityKey["typography.profile-main"]?.style_config?.desktopPx === 96,
    "IDENTITY_UI_PERSISTENCE_MISMATCH")
  pass("IDENTITY_UI_COLOR_FONT_TYPE_SAVE_DB", { color: true, family: true, typography: true })
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".admin-shell", { timeout: 15000 })
  await page.evaluate(() => {
    [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((button) => button.textContent?.trim() === "Identidade")?.click()
  })
  await page.waitForFunction((color) =>
    document.querySelector('.identity-color-row:first-child .identity-color-value input:not([type="color"])')?.value === color &&
    document.querySelector(".identity-font-row:first-child select")?.value === "Inter" &&
    document.querySelector(".identity-type-style:first-child .identity-type-fields label:nth-child(4) select")?.value === "96",
    { timeout: 15000 }, testColor)
  pass("IDENTITY_UI_REOPEN_CURRENT_TOKENS", { color: true, typography: true })

  // Restore only allowed editorial fields from a synthetic historical revision.
  // The irreversible publication, IDs and Storage are deliberately not restored.
  const revisionBase = await get(service.from("sections").select("*")
    .eq("id", syntheticProfileId).single(), "P4_REVISION_BASE")
  const oldTitle = "Título editorial recuperado " + suffix
  const oldIntro = "Introdução recuperada " + suffix
  const rev = await service.from("content_revisions").insert({
    entity_type: "sections", entity_id: syntheticProfileId, actor_user_id: userId,
    snapshot_json: {
      ...revisionBase, title: oldTitle, intro: oldIntro,
      status: "archived", is_visible: false,
    },
  }).select("id").single()
  ensure(!rev.error && rev.data, "P4_REVISION_SEED")
  revisionFixtureIds.push(rev.data.id)
  const openRevisions = async () => {
    await page.goto(base + "/admin", { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForSelector(".admin-shell", { timeout: 15000 })
    await page.evaluate(() => {
      [...document.querySelectorAll(".admin-sidebar nav button")]
        .find((node) => node.textContent?.trim() === "Revisões")?.click()
    })
    await page.waitForSelector(".revision-list", { timeout: 12000 })
  }
  const inspectById = async (id) => {
    await page.waitForFunction((id) =>
      [...document.querySelectorAll(".revision-list > div")].some((node) =>
        node.textContent?.includes(id)), { timeout: 14000 }, id)
    const clicked = await page.evaluate((id) => {
      const row = [...document.querySelectorAll(".revision-list > div")]
        .find((node) => node.textContent?.includes(id))
      row?.querySelector("button")?.click()
      return Boolean(row)
    }, id)
    ensure(clicked, "P4_REVISION_LIST_ENTRY")
    await page.waitForFunction(() =>
      document.querySelector(".revision-preview button.primary-button") &&
      document.querySelector(".revision-preview")?.textContent?.includes("Campos diferentes:"),
      { timeout: 15000 })
  }
  await openRevisions()
  await inspectById(rev.data.id)
  pass("REVISION_UI_PREVIEW_NO_WRITE", { comparisonOnly: true })
  await page.click(".revision-preview button.primary-button")
  await page.waitForSelector(".admin-confirm-dialog .danger-button", { timeout: 10000 })
  await page.click(".admin-confirm-dialog .danger-button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("Campos recuperados. A versão anterior foi preservada no histórico."),
    { timeout: 18000 })
  const restored = await get(service.from("sections").select("*")
    .eq("id", syntheticProfileId).single(), "P4_REVISION_RESTORED")
  ensure(restored.title === oldTitle && restored.intro === oldIntro &&
    restored.status === revisionBase.status &&
    restored.is_visible === revisionBase.is_visible,
    "P4_REVISION_RESTORED_PROTECTED_FIELDS")
  pass("REVISION_UI_RESTORE_ALLOWED_FIELDS_ONLY",
    { text: true, publishedPreserved: true, visibilityPreserved: true })

  const conflictRev = await service.from("content_revisions").insert({
    entity_type: "sections", entity_id: syntheticProfileId, actor_user_id: userId,
    snapshot_json: { ...restored, title: "Revisão concorrente " + suffix },
  }).select("id").single()
  ensure(!conflictRev.error && conflictRev.data, "P4_REVISION_CONFLICT_SEED")
  revisionFixtureIds.push(conflictRev.data.id)
  await openRevisions()
  await inspectById(conflictRev.data.id)
  const revisionConcurrentTitle = "Edição concorrente preservada " + suffix
  const updated = await service.from("sections")
    .update({ title: revisionConcurrentTitle }).eq("id", syntheticProfileId).select("id").single()
  ensure(!updated.error, "P4_REVISION_CONCURRENT_MODIFICATION")
  await page.click(".revision-preview button.primary-button")
  await page.waitForSelector(".admin-confirm-dialog .danger-button", { timeout: 10000 })
  await page.click(".admin-confirm-dialog .danger-button")
  await page.waitForFunction(() =>
    document.body.textContent?.includes("O registro mudou desde a comparação."),
    { timeout: 14000 })
  const conflictRetained = await get(service.from("sections").select("title")
    .eq("id", syntheticProfileId).single(), "P4_REVISION_CONFLICT_DB")
  ensure(conflictRetained.title === revisionConcurrentTitle, "P4_REVISION_STALE_OVERWRITE")
  pass("REVISION_UI_STALE_CAS_DENIED", { latestEditorialTitlePreserved: true })
} finally {
  if (page) await page.close()
  if (browser) await browser.close()
  // The stack is discarded by CI; restoring fixtures is a secondary safety measure.
  if (blockId && blockOriginal) await service.from("content_blocks").update({ content_json: blockOriginal.content_json, status: blockOriginal.status }).eq("id", blockId)
  if (sectionId && sectionOriginal) await service.from("sections").update({ animation_preset: sectionOriginal.animation_preset, status: sectionOriginal.status, is_visible: sectionOriginal.is_visible, page_id: sectionOriginal.page_id }).eq("id", sectionId)
  if (pageId) await service.from("pages").delete().eq("id", pageId)
  if (mediaAssetId) await service.from("media_assets").delete().eq("id", mediaAssetId)
  if (mediaStoragePath) await service.storage.from("portfolio-public").remove([mediaStoragePath])
  if (mediaRecoveryAssetId) await service.from("media_assets").delete().eq("id", mediaRecoveryAssetId)
  if (mediaRecoveryStoragePath) await service.storage.from("portfolio-public").remove([mediaRecoveryStoragePath])
  if (privateUiAssetId) await service.from("media_assets").delete().eq("id", privateUiAssetId)
  if (privateUiNewPath) await service.storage.from("portfolio-public").remove([privateUiNewPath])
  if (privateUiOldPath || privateUiNewPath)
    await service.storage.from("portfolio-private")
      .remove([privateUiOldPath, privateUiNewPath].filter(Boolean))
  if (mediaTempDir) rmSync(mediaTempDir, { recursive: true, force: true })
  if (navigationFixtures.length) await service.from("navigation_items").delete().in("id", navigationFixtures)
  for (const record of collectionFixtureRows)
    await service.from(record.table).delete().eq("id", record.id)
  if (revisionFixtureIds.length)
    await service.from("content_revisions").delete().in("id", revisionFixtureIds)
  if (syntheticCareerRowId) await service.from("career_experiences").delete().eq("id", syntheticCareerRowId)
  if (syntheticCareerSectionId) await service.from("sections").delete().eq("id", syntheticCareerSectionId)
  if (syntheticTestimonialId) await service.from("testimonials").delete().eq("id", syntheticTestimonialId)
  if (syntheticTestimonialsSectionId) await service.from("sections").delete().eq("id", syntheticTestimonialsSectionId)
  if (syntheticProfileId) await service.from("sections").delete().eq("id", syntheticProfileId)
  if (userId) await service.auth.admin.deleteUser(userId)
}
console.log("P4_LOCAL_BROWSER_RESULT " + JSON.stringify({ passed: tests.length, expected: 55, endpoint: "127.0.0.1", cloudConnections: 0, syntheticOnly: true, checks: tests }))
if (tests.length !== 55) process.exitCode = 1
