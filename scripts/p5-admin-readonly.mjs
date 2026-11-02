import puppeteer from "puppeteer-core"

const email = process.env.P5_ADMIN_EMAIL
const password = process.env.P5_ADMIN_PASSWORD
const base = process.env.P5_BASE_URL ?? "https://tulius.work"
if (!email || !password) {
  console.error("P5_ADMIN_NOT_RUN: configurar credenciais exclusivamente em secrets do GitHub Actions ou variáveis de ambiente locais.")
  process.exit(2)
}
const url = new URL(base)
if (url.protocol !== "https:" || url.username || url.password) {
  throw new Error("P5_BASE_URL precisa ser HTTPS e não conter credenciais.")
}

const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
let passed = 0
const mutations = []
try {
  const page = await browser.newPage()
  // Puppeteer's 800×600 default viewport can put "Sair" outside the fixed-height
  // desktop admin sidebar. Use a normal desktop viewport for pointer interaction.
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  // Login/logout Auth POSTs are allowed. Writes to CMS data/Storage are never allowed.
  page.on("request", (request) => {
    const method = request.method()
    const address = request.url()
    // POST /object/sign creates an expiring preview URL; it does not mutate
    // Storage objects. Still reject all other write-like CMS/Storage requests.
    const pathname = new URL(address).pathname
    const readOnlySignedPreview = method === "POST" &&
      pathname.startsWith("/storage/v1/object/sign/")
    if (!readOnlySignedPreview && ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
        (pathname.includes("/rest/v1/") || pathname.includes("/storage/v1/object/"))) {
      mutations.push({ method, resource: pathname })
    }
  })
  await page.goto(new URL("/admin/login", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".login-card input[type=email]", { timeout: 12000 })
  await page.type(".login-card input[type=email]", email)
  await page.type(".login-card input[type=password]", password)
  await page.click(".login-card button[type=submit], .login-card .primary-button")
  await page.waitForFunction(
    () => location.pathname === "/admin" && !!document.querySelector(".admin-shell"),
    { timeout: 20000 },
  )
  passed++
  console.log("P5_ADMIN_LOGIN " + JSON.stringify({ result: "PASS", authenticated: true }))

  const expectedModules = ["Editor do site", "Identidade", "Mídia", "Navegação", "SEO", "Revisões", "Prévia", "Visão geral"]
  for (const label of expectedModules) {
    const clicked = await page.$$eval(".admin-sidebar nav button", (nodes, target) => {
      const button = nodes.find(node => node.textContent?.trim() === target)
      if (!button) return false
      button.click()
      return true
    }, label)
    if (!clicked) throw new Error("Módulo administrativo indisponível: " + label)
    // Wait for the actual selected module; the old header may remain briefly.
    await page.waitForFunction((target) => {
      const active = document.querySelector(".admin-sidebar nav button.active")
      return active?.textContent?.trim() === target &&
        !!document.querySelector(".admin-header h1")
    }, { timeout: 10000 }, label)
  }
  passed++
  console.log("P5_ADMIN_MODULES " + JSON.stringify({ result: "PASS", modules: expectedModules.length }))

  // Read-only P4 checks: confirm the identity token and all nine structured
  // collections are reachable without submitting any data or media writes.
  await page[String.fromCharCode(36, 36) + "eval"](".admin-sidebar nav button", (nodes) => {
    nodes.find((node) => node.textContent?.trim() === "Identidade")?.click()
  })
  await page.waitForSelector(".license-card .field-grid", { timeout: 12000 })
  const radiusVisible = await page.$eval(".license-card", (node) =>
    [...node.querySelectorAll("label")].some((label) =>
      label.textContent?.includes("radius.card"),
    ),
  )
  if (!radiusVisible) throw new Error("Token radius.card ausente no editor de identidade.")
  await page[String.fromCharCode(36, 36) + "eval"](".admin-sidebar nav button", (nodes) => {
    nodes.find((node) => node.textContent?.trim() === "Editor do site")?.click()
  })
  await page.waitForSelector(".site-editor-tabs", { timeout: 12000 })
  await page[String.fromCharCode(36, 36) + "eval"](".site-editor-tabs [role=tab]", (nodes) => {
    nodes.find((node) => node.textContent?.includes("Acervo estruturado"))?.click()
  })
  await page.waitForSelector(".collection-tabs [role=tab]", { timeout: 15000 })
  const collections = await page[String.fromCharCode(36, 36) + "eval"](".collection-tabs [role=tab]", (nodes) =>
    nodes.map((node) => node.textContent?.trim()),
  )
  if (collections.length !== 9 || collections.some((label) => !label)) {
    throw new Error("Acervo estruturado incompleto: " + JSON.stringify(collections))
  }
  if (mutations.length) throw new Error("A leitura do acervo tentou alterar dados.")
  passed++
  console.log("P5_P4_CMS_READONLY " + JSON.stringify({
    result: "PASS", radiusField: radiusVisible, collections: collections.length,
    contentMutations: mutations.length,
  }))

  // Verify the newly edited CMS at a narrow viewport, without submitting any
  // request that mutates the database. Input changes are ephemeral drafts.
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  const openEditor = await page.$$eval(".admin-sidebar nav button", (nodes) => {
    const button = nodes.find((node) => node.textContent?.trim() === "Editor do site")
    if (!button) return false
    button.click()
    return true
  })
  if (!openEditor) throw new Error("Editor não disponível em viewport mobile.")
  await page.waitForSelector(".site-editor-layout .block-item-toggle", { timeout: 20000 })
  await page.click(".block-item-toggle")
  await page.waitForSelector(".block-item-body .item-alt-field input", { timeout: 10000 })
  const initial = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 2,
    saveDisabled: document.querySelector(".admin-floating-save button")?.disabled,
    altOptional: !document.querySelector(".block-item-body .item-alt-field input")?.required,
    editorialNoteVisible: [...document.querySelectorAll("label")].some((node) =>
      node.textContent?.trim().startsWith("Nota editorial")
    ),
  }))
  if (initial.overflow || initial.saveDisabled !== true || !initial.altOptional || initial.editorialNoteVisible)
    throw new Error("CMS mobile inicial inválido: " + JSON.stringify(initial))
  // Change a text field locally; assert the floating save and custom leave
  // guard, then cancel and explicitly discard the draft without writing data.
  const title = await page.$(".block-item-body input")
  if (!title) throw new Error("Campo de edição não encontrado.")
  await title.type(" P5")
  await page.waitForFunction(() => {
    return document.querySelector(".admin-floating-save button")?.disabled === false
  }, { timeout: 7000 })
  await page.$$eval(".site-editor-tabs [role=tab]", (nodes) => {
    nodes.find((node) => node.textContent?.includes("Informações da seção"))?.click()
  })
  await page.waitForSelector(".admin-confirm-dialog[role=alertdialog]", { timeout: 7000 })
  await page.click(".admin-confirm-dialog .secondary-button")
  if (!await page.$(".block-item-body input")) throw new Error("Cancelar descartou a edição local.")
  await page.$$eval(".site-editor-tabs [role=tab]", (nodes) => {
    nodes.find((node) => node.textContent?.includes("Informações da seção"))?.click()
  })
  await page.waitForSelector(".admin-confirm-dialog[role=alertdialog]", { timeout: 7000 })
  await page.click(".admin-confirm-dialog .primary-button")
  await page.waitForSelector(".site-editor-body .editor-form", { timeout: 10000 })
  await page.waitForFunction(() => document.querySelector(".admin-floating-save button")?.disabled === true, { timeout: 7000 })
  // Open the published Results block without selecting or saving an icon.
  await page[String.fromCharCode(36, 36) + "eval"](".site-editor-tabs [role=tab]", (nodes) => {
    nodes.find((node) => node.textContent?.includes("Conteúdo e painéis"))?.click()
  })
  await page.waitForSelector(".site-editor-body .block-item-toggle", { timeout: 12000 })
  const resultsSelected = await page[String.fromCharCode(36, 36) + "eval"](".site-editor-sidebar button", (nodes) => {
    const button = nodes.find((node) => node.textContent?.includes("Resultados e projetos"))
    if (!button) return false
    button.click()
    return true
  })
  if (!resultsSelected) throw new Error("Seção Resultados indisponível no editor.")
  await page.waitForFunction(
    () => document.querySelector(".site-editor-heading h2")?.textContent?.includes("Resultados"),
    { timeout: 10000 },
  )
  await page.waitForSelector(".site-editor-body .block-item-toggle", { timeout: 12000 })
  await page.click(".site-editor-body .block-item-toggle")
  await page.waitForSelector(".block-item-body .visual-icon-trigger[aria-expanded=\"false\"]", { timeout: 12000 })
  await page.click(".block-item-body .visual-icon-trigger")
  await page.waitForSelector(".block-item-body .visual-icon-popover .visual-icon-grid button", { timeout: 12000 })
  const iconCatalog = await page[String.fromCharCode(36, 36) + "eval"](".block-item-body .visual-icon-popover .visual-icon-grid button", (nodes) => ({
    count: nodes.length,
    labeled: nodes.every((node) => Boolean(node.getAttribute("aria-label"))),
    visual: nodes.every((node) => [...node.childNodes].every((child) => child.nodeType !== 3 || !child.textContent?.trim())),
  }))
  if (iconCatalog.count !== 50 || !iconCatalog.labeled || !iconCatalog.visual) {
    throw new Error("Biblioteca de ícones incompleta: " + JSON.stringify(iconCatalog))
  }
  console.log("P5_ADMIN_ICON_LIBRARY " + JSON.stringify({ result: "PASS", ...iconCatalog }))

  console.log("P5_ADMIN_MOBILE_EDIT_GUARD " + JSON.stringify({
    result: "PASS", viewport: "390x844", floatingSave: true,
    altOptional: true, customLeaveDialog: true, contentMutations: mutations.length,
  }))
  if (mutations.length) throw new Error("Escrita não autorizada detectada na verificação mobile: " + JSON.stringify(mutations))

  await page.goto(new URL("/admin/preview", base).href, { waitUntil: "networkidle2", timeout: 30000 })
  await page.waitForSelector(".preview-banner", { timeout: 15000 })
  // The preview banner renders before Supabase finishes loading. Wait for the
  // 14 registered sections (including the intentionally hidden "competencias").
  // Do not treat an early DOM count of zero as an incomplete admin preview.
  let previewTimedOut = false
  try {
    await page.waitForFunction(
      () => {
        const count = document.querySelectorAll("section.portfolio-section").length
        const loading = !!document.querySelector(".public-site .data-status")
        const failed = !!document.querySelector(".public-site .data-error")
        return failed || (!loading && count === 14)
      },
      { timeout: 20000 },
    )
  } catch {
    previewTimedOut = true
  }
  const previewState = await page.evaluate(() => ({
    sectionCount: document.querySelectorAll("section.portfolio-section").length,
    loading: !!document.querySelector(".public-site .data-status"),
    failed: !!document.querySelector(".public-site .data-error"),
    hiddenSectionPresent: !!document.querySelector("section#competencias"),
  }))
  if (previewTimedOut || previewState.failed || previewState.sectionCount !== 14 ||
      !previewState.hiddenSectionPresent) {
    throw new Error("Prévia administrativa incompleta: " + JSON.stringify(previewState))
  }
  passed++
  console.log("P5_ADMIN_PREVIEW " + JSON.stringify({
    result: "PASS",
    sectionCount: previewState.sectionCount,
    hiddenSectionPresent: previewState.hiddenSectionPresent,
  }))

  await page.goto(new URL("/admin", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".logout-button", { visible: true, timeout: 15000 })
  const logoutClickable = await page.$eval(".logout-button", (button) => {
    const rect = button.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0 &&
      rect.top >= 0 && rect.bottom <= window.innerHeight &&
      rect.left >= 0 && rect.right <= window.innerWidth
  })
  if (!logoutClickable) {
    throw new Error("Botão Sair fora da viewport desktop; falha de layout de navegador.")
  }
  await page.click(".logout-button")
  await page.waitForSelector(".admin-confirm-dialog[role=alertdialog]", { timeout: 10000 })
  await page.click(".admin-confirm-dialog .primary-button")
  await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
  await page.goto(new URL("/admin/preview", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
  if (mutations.length) {
    throw new Error("Unexpected content write from read-only suite: " + JSON.stringify(mutations))
  }
  passed++
  console.log("P5_ADMIN_LOGOUT " + JSON.stringify({ result: "PASS", reaccessBlocked: true }))
} finally {
  await browser.close()
}
console.log("P5_READONLY_RESULT " + JSON.stringify({ passed, expected: 5, contentMutations: 0 }))
if (passed !== 5) process.exitCode = 1
