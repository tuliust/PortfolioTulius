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
    "Visão geral", "Editor do site", "Identidade",
    "Mídia", "Navegação", "SEO", "Revisões", "Prévia",
  ]
  for (const label of modules) await selectModule(page, label)
  report("MODULES", { count: modules.length, acervoRemoved: true })

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
  const labelStyle = await page.$eval(".identity-color-row label", (node) => ({
    fontSize: getComputedStyle(node).fontSize,
    fontWeight: getComputedStyle(node).fontWeight,
  }))
  assert(parseFloat(labelStyle.fontSize) <= 14 && Number(labelStyle.fontWeight) >= 600,
    "Labels de Identidade não receberam padrão editorial: " + JSON.stringify(labelStyle))
  const originalColorName = await page.$eval(identityNameSelector, (input) => input.value)
  await updateInput(page, identityNameSelector, originalColorName + " HOMOLOGAÇÃO")
  await page.waitForSelector(".admin-floating-save button", { timeout: 8000 })
  await requestModule(page, "Editor do site")
  await chooseDialog(page, "Não sair")
  assert((await page.$eval(identityNameSelector, (input) => input.value)) ===
    originalColorName + " HOMOLOGAÇÃO", "Cancelar descartou rascunho de Identidade.")
  await requestModule(page, "Editor do site")
  await chooseDialog(page, "Sair sem salvar")
  await selectModule(page, "Identidade")
  await page.waitForSelector(identityNameSelector, { timeout: 10000 })
  assert((await page.$eval(identityNameSelector, (input) => input.value)) === originalColorName,
    "Alteração de Identidade descartada foi persistida.")
  report("IDENTITY_DISCARD", { unsavedGuard: true, labels: labelStyle,
    reloadedValuePreserved: true })

  await selectModule(page, "Editor do site")
  const chooseSection = async (label) => {
    const clicked = await page.evaluate((value) => {
      const item = [...document.querySelectorAll(".site-editor-sidebar button")]
        .find((node) => node.textContent?.includes(value))
      if (!item) return false
      item.click()
      return true
    }, label)
    assert(clicked, "Seção ausente: " + label)
    await waitFor(page, (value) =>
      document.querySelector(".site-editor-sidebar button.active")?.textContent?.includes(value),
      label)
  }
  await chooseSection("Depoimentos")
  await page.waitForSelector(".site-editor-testimonials .editor-form .field-grid", { timeout: 16000 })
  await waitFor(page, () =>
    document.querySelectorAll(".site-editor-testimonials .section-list button").length === 5)
  const testimonials = await page.evaluate(() => ({
    count: document.querySelectorAll(".site-editor-testimonials .section-list button").length,
    sourceTabs: document.querySelectorAll(".site-editor-testimonials .collection-tabs button").length,
    hasEditForm: !!document.querySelector(".site-editor-testimonials .editor-form"),
    acervoInMenu: [...document.querySelectorAll(".admin-sidebar nav button")]
      .some(x => x.textContent?.includes("Acervo Estruturado")),
  }))
  assert(testimonials.count === 5 && testimonials.sourceTabs === 0 &&
    testimonials.hasEditForm && !testimonials.acervoInMenu,
    "Edição local de depoimentos incompleta: " + JSON.stringify(testimonials))
  report("INLINE_TESTIMONIALS", { records: testimonials.count, onlyOnEditor: true })

  const recordInput = ".site-editor-testimonials .editor-form .field-grid input:not([type=number])"
  const oldRecordValue = await page.$eval(recordInput, (input) => input.value)
  await updateInput(page, recordInput, oldRecordValue + " HOMOLOGAÇÃO")
  await page.waitForSelector(".admin-floating-save button", { timeout: 8000 })
  await requestModule(page, "Identidade")
  await chooseDialog(page, "Sair sem salvar")
  await selectModule(page, "Editor do site")
  await chooseSection("Depoimentos")
  await page.waitForSelector(recordInput, { timeout: 15000 })
  assert((await page.$eval(recordInput, (input) => input.value)) === oldRecordValue,
    "Depoimento descartado foi persistido.")
  report("INLINE_TESTIMONIAL_DISCARD", { unsavedGuard: true, recoveredOriginal: true })

  await chooseSection("Hero")
  await selectModule(page, "Editor do site")
  await page.waitForSelector(".site-editor-section .editor-form .field-grid", { timeout: 16000 })
  await page.waitForSelector(".studio-block-picker button", { timeout: 16000 })
  const section = await page.evaluate(() => {
    const fields = [...document.querySelectorAll(".site-editor-section .field-grid label")]
    const names = fields.map((item) => item.textContent?.trim() ?? "")
    const title = fields.find((item) => item.textContent?.trim() === "Título da seção (nome no CMS)")?.querySelector("input")?.value
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
  assert(section.title === "Hero" && section.archive && !section.oldTabs &&
    transitions.every((x) => section.transitions.includes(x)) &&
    section.transitions.length === transitions.length &&
    section.panels.includes("Esquerda") && section.panels.includes("Direita") &&
    !section.fieldLabels.some((name) => /^(Tema|Layout|Exibir no site)$/.test(name)),
    "Editor da seção não corresponde à Etapa 3: " + JSON.stringify(section))
  report("EDITOR_SECTION", { titleSynced: true, transitions: section.transitions.length,
    positionPanels: section.panels, removedRedundantFields: true })

  // Verify new Hero controls in both existing blocks; never persist test edits.
  await waitFor(page, () =>
    document.querySelector(".hero-section-specific legend")?.textContent?.includes("Esquerda") &&
    document.querySelectorAll(".hero-format-trigger").length >= 3)
  const heroLeft = await page.evaluate(() => ({
    group: document.querySelector(".hero-section-specific legend")?.textContent?.trim(),
    palettes: document.querySelectorAll(".hero-section-specific .hero-visual-picker-trigger").length,
    colorsAsTextSelect: document.querySelectorAll(".hero-section-specific select option[value^='color.']").length,
    singleMessage: document.querySelectorAll(".hero-message-group legend").length === 1,
    genericMetricHidden: ![...document.querySelectorAll(".block-item-body label")].some(
      (node) => node.textContent?.trim().startsWith("Valor/métrica")),
    formatButtons: document.querySelectorAll(".hero-format-trigger").length,
    photo: [...document.querySelectorAll(".block-item-body .published-media-picker-label")].some(
      (node) => node.textContent?.trim() === "Foto"),
  }))
  assert(heroLeft.group?.includes("Esquerda") && heroLeft.palettes >= 3 &&
    heroLeft.colorsAsTextSelect === 0 && heroLeft.singleMessage && heroLeft.genericMetricHidden &&
    heroLeft.formatButtons >= 3 && heroLeft.photo,
    "Hero Esquerda incompleto: " + JSON.stringify(heroLeft))
  await page.evaluate(() =>
    document.querySelector(".hero-section-specific .hero-visual-picker-trigger")?.click())
  await page.waitForSelector(".hero-swatch-grid button", { timeout: 10000 })
  const swatchCount = await page.$eval(".hero-swatch-grid button", (buttons) => buttons.length)
  console.log("P5_HERO_PALETTE " + JSON.stringify({
    swatchCount,
    choices: await page.$eval(".hero-swatch-grid button", (nodes) =>
      nodes.map((node) => node.getAttribute("aria-label"))),
  }))
  assert(swatchCount >= 7, "Paleta visual incompleta.")
  await page.keyboard.press("Escape")
  await page.evaluate(() =>
    document.querySelector(".hero-icon-picker-anchor .hero-visual-picker-trigger")?.click())
  await page.waitForSelector(".hero-icon-popover .hero-icon-grid button", { timeout: 10000 })
  const iconGroups = await page.$eval(".hero-icon-popover h4", (nodes) =>
    nodes.map((node) => node.textContent?.trim()))
  assert(iconGroups.includes("Resultados") && iconGroups.includes("Digital") &&
    iconGroups.includes("Navegação e controles"), "Ícones não agrupados.")
  await page.keyboard.press("Escape")
  const changedPanel = await page.evaluate(() => {
    const button = [...document.querySelectorAll(".studio-block-picker button")].find(
      (node) => node.querySelector("strong")?.textContent?.includes("Direita"))
    if (!button) return false
    button.click()
    return true
  })
  assert(changedPanel, "Bloco Direito do Hero indisponível.")
  await waitFor(page, () =>
    document.querySelector(".hero-section-specific legend")?.textContent?.includes("Direita"))
  const heroRight = await page.evaluate(() => ({
    group: document.querySelector(".hero-section-specific legend")?.textContent?.trim(),
    buttons: document.querySelectorAll(".hero-section-specific .hero-format-trigger").length,
    secondary: [...document.querySelectorAll(".hero-section-specific input")].some(
      (input) => input.value === "Experiência e atuação"),
    labels: [...document.querySelectorAll(".hero-section-specific label, .hero-section-specific .hero-picker-label")]
      .map((node) => node.textContent?.trim()),
    mainTitle: [...document.querySelectorAll(".hero-section-specific input")]
      .some((node) => node.value === "Tulius Tsangaropulos"),
    originalBlockCount: document.querySelectorAll(".studio-block-picker button").length,
  }))
  assert(heroRight.group?.includes("Direita") && heroRight.secondary &&
    heroRight.buttons >= 3 && heroRight.originalBlockCount === 2 && heroRight.mainTitle &&
    heroRight.labels.some((x) => x.includes("Botão inferior")),
    "Hero Direita incompleto: " + JSON.stringify(heroRight))
  await page.evaluate(() =>
    document.querySelector(".hero-section-specific .hero-format-trigger")?.click())
  await page.waitForSelector(".hero-format-popover select", { timeout: 10000 })
  const styleChoices = await page.$eval(".hero-format-popover select", (select) =>
    [...select.options].filter((option) => option.value.startsWith("typography.")).length)
  assert(styleChoices === 7, "Popover não usa os 7 estilos da Identidade.")
  await page.evaluate(() =>
    document.querySelector(".hero-format-popover .hero-format-actions button:last-child")?.click())
  report("HERO_FIELDS", { left: heroLeft.group, right: heroRight.group, styles: styleChoices,
    fieldsPersistedInExistingBlocks: true })

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

  // Three desktop visual zones map to the existing two content blocks.
  const verifyZones = async (sectionName, expectedLabels) => {
    await chooseSection(sectionName)
    await waitFor(page, () =>
      document.querySelectorAll(".site-editor-visual-areas button").length === 3 &&
      document.querySelectorAll(".studio-block-picker button").length >= 2 &&
      [...document.querySelectorAll(".site-editor-visual-areas button")].every(x => !x.disabled))
    const buttons = await page.evaluate(() =>
      [...document.querySelectorAll(".site-editor-visual-areas button")]
        .map((x) => x.querySelector("strong")?.textContent?.trim()))
    assert(JSON.stringify(buttons) === JSON.stringify(expectedLabels),
      "Áreas visuais erradas para " + sectionName + ": " + JSON.stringify(buttons))
  }
  const triple = ["Esquerda", "Centro", "Direita"]
  await verifyZones("Olá!", triple)
  await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-visual-areas button")]
      .find((x) => x.querySelector("strong")?.textContent?.trim() === "Centro")?.click())
  await page.waitForSelector(".admin-image-target-switch button.active", { timeout: 12000 })
  const photoTarget = await page.$eval(".admin-image-target-switch button.active",
    node => node.textContent?.trim())
  assert(photoTarget === "Desktop", "Centro de Sobre não seleciona fotografia desktop.")
  await verifyZones("Resultados e projetos", triple)
  await verifyZones("Experiências Profissionais", triple)
  await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-visual-areas button")]
      .find((x) => x.querySelector("strong")?.textContent?.trim() === "Centro")?.click())
  await waitFor(page, () =>
    document.querySelectorAll(".site-editor-center-blocks button").length === 2)
  const centerSources = await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-center-blocks button")].map(x => x.textContent?.trim()))
  assert(centerSources.includes("Projetos do bloco A") &&
    centerSources.includes("Projetos do bloco B"), "Projetos A/B indisponíveis no Centro.")
  await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-center-blocks button")]
      .find(x => x.textContent?.includes("bloco A"))?.click())
  await waitFor(page, () =>
    [...document.querySelectorAll(".site-editor-center-blocks button")]
      .find(x => x.textContent?.includes("bloco A"))?.getAttribute("aria-pressed") === "true")
  await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-visual-areas button")]
      .find((x) => x.querySelector("strong")?.textContent?.trim() === "Direita")?.click())
  await page.waitForSelector("#site-editor-experience-gallery", { timeout: 12000 })
  report("VISUAL_AREAS", { sections: 3, positions: triple, desktopPortrait: true,
    sharedExperienceGallery: true })
  await chooseSection("Hero")

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  await page.waitForSelector(".studio-block-picker button", { timeout: 15000 })
  const mobile = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
    panelButtons: [...document.querySelectorAll(".studio-block-picker button strong")].map(x => x.textContent?.trim()),
    acervoRemoved: ![...document.querySelectorAll(".admin-sidebar nav button")]
      .some((node) => node.textContent?.trim() === "Acervo Estruturado"),
  }))
  assert(!mobile.horizontalOverflow && mobile.acervoRemoved && mobile.panelButtons.length >= 2,
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
console.log("P5_STAGE5_RESULT " + JSON.stringify({ passed: checks, expected: 13, writes: blockedWrites.length }))
if (checks !== 13) process.exitCode = 1
