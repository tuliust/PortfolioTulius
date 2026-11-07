import puppeteer from "puppeteer-core"

const email = process.env.P5_ADMIN_EMAIL
const password = process.env.P5_ADMIN_PASSWORD
const base = process.env.P5_BASE_URL ?? "https://tulius.work"
if (!email || !password) {
  console.error("P5_ADMIN_NOT_RUN: credenciais de homologação ausentes (GitHub Actions secrets).")
  process.exit(2)
}
const url = new URL(base)
if (url.protocol !== "https:" || url.username || url.password) {
  throw Error("P5_BASE_URL deve ser HTTPS e não pode conter credenciais.")
}

const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
let checks = 0
const blockedWrites = []
const report = (name, details = {}) => {
  checks++
  console.log("P5_STAGE5_" + name + " " + JSON.stringify({ result: "PASS", ...details }))
}
const assert = (condition, message) => {
  if (!condition) throw Error(message)
}
const waitFor = async (page, predicate, arg, timeout = 18000) =>
  page.waitForFunction(predicate, { timeout }, arg)
const requestModule = async (page, label) => {
  const found = await page.evaluate((name) => {
    const node = [...document.querySelectorAll(".admin-sidebar nav button")]
      .find((item) => item.textContent?.trim() === name)
    if (!node) return false
    node.click()
    return true
  }, label)
  assert(found, "Módulo indisponível: " + label)
}
const selectModule = async (page, label) => {
  await requestModule(page, label)
  await waitFor(page, (name) => {
    const active = document.querySelector(".admin-sidebar nav button.active")
    return active?.textContent?.trim() === name
  }, label)
}
const chooseDialog = async (page, label) => {
  await page.waitForSelector('.admin-confirm-dialog[role="alertdialog"]', { timeout: 12000 })
  const clicked = await page.$$eval(".admin-confirm-dialog button", (nodes, name) => {
    const node = nodes.find((item) => item.textContent?.trim() === name)
    if (!node) return false
    node.click()
    return true
  }, label)
  assert(clicked, "Ação de diálogo ausente: " + label)
  await waitFor(page, () => !document.querySelector(".admin-confirm-dialog"))
}
const updateInput = async (page, selector, nextValue) => {
  await page.click(selector)
  await page.keyboard.down("Control")
  await page.keyboard.press("KeyA")
  await page.keyboard.up("Control")
  await page.keyboard.type(nextValue)
  await waitFor(page, (expected) =>
    document.activeElement instanceof HTMLInputElement &&
    document.activeElement.value === expected, nextValue)
}

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  // The suite is strictly read-only. Abort any unexpected CMS/Storage write,
  // including writes inadvertently triggered by an input or dialog.
  await page.setRequestInterception(true)
  page.on("request", (request) => {
    const method = request.method()
    const target = new URL(request.url())
    const apiWrite = ["POST", "PATCH", "PUT", "DELETE"].includes(method)
    const contentApi = target.pathname.includes("/rest/v1/")
    const storageApi = target.pathname.includes("/storage/v1/object/")
    const signedRead = method === "POST" && target.pathname.startsWith("/storage/v1/object/sign/")
    if (apiWrite && (contentApi || storageApi) && !signedRead) {
      blockedWrites.push({ method, path: target.pathname })
      void request.abort("blockedbyclient")
      return
    }
    void request.continue()
  })

  await page.goto(new URL("/admin/login", base).href, {
    waitUntil: "domcontentloaded", timeout: 30000,
  })
  await page.waitForSelector(".login-card input[type=email]", { timeout: 15000 })
  await page.type(".login-card input[type=email]", email)
  await page.type(".login-card input[type=password]", password)
  await page.click(".login-card button[type=submit], .login-card .primary-button")
  await waitFor(page, () =>
    location.pathname === "/admin" && !!document.querySelector(".admin-shell"), null, 30000)
  report("LOGIN", { authenticated: true, contentWrites: blockedWrites.length })

  const modules = [
    "Visão geral", "Editor do site", "Identidade", "Acervo Estruturado",
    "Mídia", "Navegação", "SEO", "Revisões", "Prévia",
  ]
  for (const label of modules) await selectModule(page, label)
  report("MODULES", { count: modules.length, includesIndependentAcervo: true })

  await selectModule(page, "Identidade")
  await page.waitForSelector(".identity-type-style", { timeout: 18000 })
  const identity = await page.evaluate(() => ({
    colors: document.querySelectorAll(".identity-color-row").length,
    fonts: document.querySelectorAll(".identity-font-row").length,
    styles: document.querySelectorAll(".identity-type-style").length,
    names: [...document.querySelectorAll('.identity-type-style input')]
      .every((input) => input.value.trim().length > 0),
    responsiveChoices: [...document.querySelectorAll(".identity-type-style select")]
      .some((select) => [...select.options].some((option) => option.textContent?.includes("px"))),
    error: document.querySelector(".identity-catalog .admin-notice")?.textContent ?? "",
  }))
  assert(identity.colors === 7 && identity.fonts === 3 && identity.styles === 7 &&
    identity.names && identity.responsiveChoices, "Biblioteca de Identidade incompleta: " + JSON.stringify(identity))
  report("IDENTITY_CATALOG", { colors: identity.colors, fonts: identity.fonts, styles: identity.styles })

  const identityNameSelector = ".identity-color-row input[name^='identity-color-name-']"
  const originalColorName = await page.$eval(identityNameSelector, (input) => input.value)
  await updateInput(page, identityNameSelector, originalColorName + " HOMOLOGAÇÃO")
  await page.waitForSelector(".admin-floating-save button", { timeout: 8000 })
  await requestModule(page, "Acervo Estruturado")
  await chooseDialog(page, "Não sair")
  assert((await page.$eval(identityNameSelector, (input) => input.value)) ===
    originalColorName + " HOMOLOGAÇÃO", "Cancelar descartou rascunho de Identidade.")
  await requestModule(page, "Acervo Estruturado")
  await chooseDialog(page, "Sair sem salvar")
  await page.waitForSelector(".shared-acervo-usage-list", { timeout: 18000 })
  await selectModule(page, "Identidade")
  await page.waitForSelector(identityNameSelector, { timeout: 10000 })
  assert((await page.$eval(identityNameSelector, (input) => input.value)) === originalColorName,
    "Alteração de Identidade descartada foi persistida.")
  report("IDENTITY_DISCARD", { unsavedGuard: true, reloadedValuePreserved: true })
  await selectModule(page, "Acervo Estruturado")

  await page.waitForSelector(".shared-acervo-usage-list", { timeout: 15000 })
  await page.waitForSelector(".shared-acervo .section-editor-layout .section-list button", { timeout: 15000 })
  const acervo = await page.evaluate(() => ({
    sourceSummary: [...document.querySelectorAll(".shared-acervo-usage-summary strong")]
      .map((x) => x.textContent?.trim()),
    selectedRecords: document.querySelectorAll(".shared-acervo .section-editor-layout .section-list button").length,
    usageLabels: [...document.querySelectorAll(".shared-acervo-record-location")]
      .map((x) => x.textContent?.trim() ?? ""),
    nineSourceTabsPresent: document.querySelectorAll(".shared-acervo .collection-tabs button").length === 9,
    sectionContext: document.querySelector(".shared-acervo-usage-summary span")?.textContent ?? "",
  }))
  assert(acervo.sourceSummary.length === 1 && acervo.sourceSummary[0] === "Depoimentos" &&
    acervo.selectedRecords === 5 && !acervo.nineSourceTabsPresent &&
    acervo.usageLabels.some((x) => x.startsWith("Utilizado em:")) &&
    acervo.sectionContext.includes("Depoimentos"),
    "Filtro ou localização do Acervo incorretos: " + JSON.stringify(acervo))
  report("SHARED_COLLECTION", { sources: acervo.sourceSummary.length, records: acervo.selectedRecords,
    linkedCardsLabeled: acervo.usageLabels.filter((x) => x.startsWith("Utilizado em:")).length })

  const recordInput = ".shared-acervo .section-editor-layout .editor-form .field-grid input:not([type=number])"
  await page.waitForSelector(recordInput, { timeout: 16000 })
  const oldRecordValue = await page.$eval(recordInput, (input) => input.value)
  await updateInput(page, recordInput, oldRecordValue + " HOMOLOGAÇÃO")
  await page.waitForSelector(".admin-floating-save button", { timeout: 8000 })
  await requestModule(page, "Editor do site")
  await chooseDialog(page, "Sair sem salvar")
  await selectModule(page, "Acervo Estruturado")
  await page.waitForSelector(recordInput, { timeout: 15000 })
  assert((await page.$eval(recordInput, (input) => input.value)) === oldRecordValue,
    "Alteração do Acervo descartada foi persistida.")
  report("SHARED_RECORD_DISCARD", { unsavedGuard: true, recoveredOriginal: true })

  await selectModule(page, "Editor do site")
  await page.waitForSelector(".site-editor-section .editor-form .field-grid", { timeout: 16000 })
  await page.waitForSelector(".studio-block-picker button", { timeout: 16000 })
  const section = await page.evaluate(() => {
    const fields = [...document.querySelectorAll(".site-editor-section .field-grid label")]
    const names = fields.map((item) => item.textContent?.trim() ?? "")
    const title = fields.find((item) => item.textContent?.trim() === "Título")?.querySelector("input")?.value
    const select = document.querySelector(".site-editor-section select")
    return {
      title,
      fieldLabels: names,
      transitions: select ? [...select.options].map((option) => option.value) : [],
      archive: !![...document.querySelectorAll(".site-editor-section .form-actions button")]
        .find((item) => item.textContent?.trim() === "Arquivar"),
      oldTabs: !!document.querySelector(".site-editor-tabs"),
      panels: [...document.querySelectorAll(".studio-block-picker button strong")]
        .map((node) => node.textContent?.trim()),
    }
  })
  const transitions = ["none", "fade-in", "fade-up", "stagger", "image-reveal", "metric-count"]
  assert(section.title === "Tulius Tsangaropulos" && section.archive && !section.oldTabs &&
    transitions.every((x) => section.transitions.includes(x)) &&
    section.transitions.length === transitions.length &&
    section.panels.includes("Esquerda") && section.panels.includes("Direita") &&
    !section.fieldLabels.some((name) => /^(Tema|Layout|Exibir no site)$/.test(name)),
    "Editor da seção não corresponde à Etapa 3: " + JSON.stringify(section))
  report("EDITOR_SECTION", { titleSynced: true, transitions: section.transitions.length,
    positionPanels: section.panels, removedRedundantFields: true })

  const archiveClicked = await page.$$eval(".site-editor-section .form-actions button", (nodes) => {
    const btn = nodes.find((item) => item.textContent?.trim() === "Arquivar")
    if (!btn) return false
    btn.click()
    return true
  })
  assert(archiveClicked, "Botão Arquivar indisponível.")
  await chooseDialog(page, "Cancelar")
  report("ARCHIVE_CANCEL", { confirmationReversible: true })

  const transitionSelector = ".site-editor-section select"
  const originalTransition = await page.$eval(transitionSelector, (node) => node.value)
  const alternateTransition = transitions.find((transition) => transition !== originalTransition)
  await page.select(transitionSelector, alternateTransition)
  await page.waitForSelector(".admin-floating-save button", { timeout: 8000 })
  await requestModule(page, "Identidade")
  await chooseDialog(page, "Sair sem salvar")
  await selectModule(page, "Editor do site")
  await page.waitForSelector(transitionSelector, { timeout: 16000 })
  assert((await page.$eval(transitionSelector, (node) => node.value)) === originalTransition,
    "Transição alterada em rascunho foi persistida.")
  report("TRANSITION_DISCARD", { options: transitions.length, recoveredOriginal: true })

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await page.waitForSelector(".studio-block-picker button", { timeout: 15000 })
  const mobile = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
    panelButtons: [...document.querySelectorAll(".studio-block-picker button strong")].map(x => x.textContent?.trim()),
    menuPresent: !![...document.querySelectorAll(".admin-sidebar nav button")]
      .find((node) => node.textContent?.trim() === "Acervo Estruturado"),
  }))
  assert(!mobile.horizontalOverflow && mobile.menuPresent && mobile.panelButtons.length >= 2,
    "Layout do editor em 390 px: " + JSON.stringify(mobile))
  report("MOBILE_EDITOR", { viewport: "390x844", overflow: mobile.horizontalOverflow })
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await selectModule(page, "Prévia")
  await page.waitForSelector(".site-editor-preview-frame iframe", { timeout: 10000 })
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

  await page.click(".logout-button")
  await chooseDialog(page, "Sair")
  await waitFor(page, () => location.pathname === "/admin/login", null, 16000)
  await page.goto(new URL("/admin/preview", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await waitFor(page, () => location.pathname === "/admin/login", null, 16000)
  assert(blockedWrites.length === 0, "Tentativas inesperadas de escrita: " + JSON.stringify(blockedWrites))
  report("LOGOUT", { previewProtected: true, cmsWrites: blockedWrites.length })
} finally {
  await browser.close()
}
console.log("P5_STAGE5_RESULT " + JSON.stringify({ passed: checks, expected: 11, writes: blockedWrites.length }))
if (checks !== 11) process.exitCode = 1
