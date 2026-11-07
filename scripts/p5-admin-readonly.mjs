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
  await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-area-tabs button")]
      .find((node) => node.querySelector("strong")?.textContent?.trim() === "Esquerda")?.click())
  await waitFor(page, () =>
    document.querySelector(".site-editor-area-tabs button[aria-selected='true'] strong")?.textContent?.trim() === "Esquerda")

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
  await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-area-tabs button")]
      .find((node) => node.querySelector("strong")?.textContent?.trim() === "Esquerda")?.click())
  await waitFor(page, () =>
    document.querySelector(".site-editor-area-tabs button[aria-selected='true'] strong")?.textContent?.trim() === "Esquerda")

  await page.waitForSelector(recordInput, { timeout: 15000 })
  assert((await page.$eval(recordInput, (input) => input.value)) === oldRecordValue,
    "Depoimento descartado foi persistido.")
  report("INLINE_TESTIMONIAL_DISCARD", { unsavedGuard: true, recoveredOriginal: true })

  await chooseSection("Hero")
  await selectModule(page, "Editor do site")
  await page.waitForSelector(".site-editor-section .editor-form .field-grid", { timeout: 16000 })
  await page.waitForSelector(".hero-editor-tabs button", { timeout: 16000 })
  const section = await page.evaluate(() => {
    const fields = [...document.querySelectorAll(".site-editor-section .field-grid label")]
    const names = fields.map((item) => item.textContent?.trim() ?? "")
    const title = fields.find((item) => item.textContent?.trim() === "Título da seção (nome no CMS)")?.querySelector("input")?.value
    const select = document.querySelector(".site-editor-section select")
    const anchor = document.querySelector(".site-editor-section [aria-describedby='editor-anchor-help']")
    return {
      title,
      anchorEditable: anchor instanceof HTMLInputElement && !anchor.disabled,
      anchorValue: anchor?.value,
      fieldLabels: names,
      transitions: select ? [...select.options].map((option) => option.value) : [],
      archive: !![...document.querySelectorAll(".site-editor-section .form-actions button")]
        .find((item) => item.textContent?.trim() === "Arquivar"),
      tabs: [...document.querySelectorAll(".hero-editor-tabs button")].map((node) => ({
        label: node.querySelector("strong")?.textContent?.trim(),
        selected: node.getAttribute("aria-selected"),
      })),
      contentHidden: !document.querySelector(".studio-inline-layout"),
    }
  })
  const transitions = ["none", "fade-in", "fade-up", "stagger", "image-reveal", "metric-count"]
  assert(section.title === "Hero" && section.anchorEditable && section.anchorValue === "perfil" &&
    section.archive && section.contentHidden &&
    transitions.every((x) => section.transitions.includes(x)) &&
    section.transitions.length === transitions.length &&
    !section.fieldLabels.some((name) => /^(Tema|Layout|Exibir no site)$/.test(name)),
    "Editor geral do Hero incompleto: " + JSON.stringify(section))
  assert(JSON.stringify(section.tabs.map((tab) => tab.label)) ===
    JSON.stringify(["Seção", "Esquerda", "Direita"]) &&
    section.tabs[0].selected === "true",
    "Três botões do Hero ausentes: " + JSON.stringify(section.tabs))
  report("EDITOR_SECTION", { titleSynced: true, transitions: section.transitions.length,
    editableAnchor: true, removedRedundantFields: true })
  report("HERO_TABS", { tabs: section.tabs.map((tab) => tab.label),
    defaultMode: "Seção" })

  await page.evaluate(() =>
    [...document.querySelectorAll(".hero-editor-tabs button")]
      .find((node) => node.textContent?.includes("Esquerda"))?.click())
  await waitFor(page, () => document.querySelector(".hero-left-editor .hero-message-group") &&
    document.querySelector(".hero-left-editor fieldset[aria-label='Selo']") &&
    document.querySelector(".hero-left-editor fieldset[aria-label='Apresentação']"))

  const heroLeft = await page.evaluate(() => ({
    groups: [...document.querySelectorAll(".hero-left-editor > fieldset")].map((node) =>
      node.querySelector("legend")?.textContent?.trim()),
    palettes: document.querySelectorAll(".hero-left-editor .hero-visual-picker-trigger").length,
    genericCards: document.querySelectorAll(".hero-left-editor .block-item-editor").length,
    formatButtons: document.querySelectorAll(".hero-left-editor .hero-format-trigger").length,
    photo: [...document.querySelectorAll(".hero-left-editor .published-media-picker-label")]
      .some((node) => node.textContent?.trim() === "Foto"),
  }))
  assert(heroLeft.groups.includes("Mensagem principal") && heroLeft.groups.includes("Selo") &&
    heroLeft.groups.includes("Apresentação") && heroLeft.genericCards === 0 &&
    heroLeft.palettes >= 5 && heroLeft.formatButtons >= 3 && heroLeft.photo,
    "Elementos da Esquerda incompletos: " + JSON.stringify(heroLeft))

  const highlights = await page.evaluate(() => ({
    group: document.querySelector(".hero-highlights-editor > summary")?.textContent?.trim(),
    children: document.querySelectorAll(".hero-highlights-editor .hero-highlight-entry").length,
    descriptions: [...document.querySelectorAll(".hero-highlight-entry .hero-highlight-caption")]
      .map((node) => node.textContent?.trim()),
  }))
  assert(highlights.group?.includes("Itens de Destaque") && highlights.children === 4 &&
    highlights.descriptions.includes("Experiência em grandes empresas"),
    "Destaques do Hero não foram agrupados: " + JSON.stringify(highlights))
  report("HERO_HIGHLIGHTS", { group: "Itens de Destaque",
    count: highlights.children, preservedLegacyItems: true })

  await page.evaluate(() =>
    document.querySelector(".hero-left-editor button[aria-label='Fundo do selo']")?.click())
  await page.waitForSelector(".hero-swatch-grid button", { timeout: 10000 })
  const swatchCount = await page.evaluate(() => document.querySelectorAll(".hero-swatch-grid button").length)
  assert(swatchCount >= 7, "Paleta visual incompleta.")
  await page.keyboard.press("Escape")
  await page.evaluate(() =>
    document.querySelector(".hero-left-editor button[aria-label='Ícone central']")?.click())
  await page.waitForSelector(".hero-icon-popover .hero-icon-grid button", { timeout: 10000 })
  const iconGroups = await page.evaluate(() => [...document.querySelectorAll(".hero-icon-popover h4")]
    .map((node) => node.textContent?.trim()))
  assert(iconGroups.includes("Resultados") && iconGroups.includes("Digital") &&
    iconGroups.includes("Navegação e controles"), "Ícones não agrupados.")
  await page.keyboard.press("Escape")

  await page.evaluate(() =>
    [...document.querySelectorAll(".hero-editor-tabs button")]
      .find((node) => node.textContent?.includes("Direita"))?.click())
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
  report("HERO_FIELDS", { left: heroLeft.groups, right: heroRight.group, styles: styleChoices,
    fieldsPersistedInExistingBlocks: true })

  await page.evaluate(() =>
    [...document.querySelectorAll(".hero-editor-tabs button")]
      .find((node) => node.textContent?.trim().startsWith("Seção"))?.click())
  await page.waitForSelector(".site-editor-section .form-actions button", { timeout: 10000 })

  const archiveClicked = await page.$$eval(".site-editor-section .form-actions button", (nodes) => {
    const btn = nodes.find((item) => item.textContent?.trim() === "Arquivar")
    if (!btn) return false
    btn.click()
    return true
  })
  assert(archiveClicked, "Botão Arquivar indisponível.")
  await chooseDialog(page, "Cancelar")
  report("ARCHIVE_CANCEL", { confirmationReversible: true })

  const adminTitleSelector = ".site-editor-section .field-grid label:first-child input"
  const originalAdminTitle = await page.$eval(adminTitleSelector, (node) => node.value)
  await updateInput(page, adminTitleSelector, originalAdminTitle + " ENSAIO")
  const anchorSelector = ".site-editor-section [aria-describedby='editor-anchor-help']"
  const originalAnchor = await page.$eval(anchorSelector, (node) => node.value)
  await updateInput(page, anchorSelector, "novo-perfil-ensaio")
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
  assert((await page.$eval(adminTitleSelector, (node) => node.value)) === originalAdminTitle,
    "Título administrativo descartado foi persistido.")
  assert((await page.$eval(anchorSelector, (node) => node.value)) === originalAnchor,
    "Âncora editada foi gravada apesar do descarte.")
  report("TRANSITION_DISCARD", { options: transitions.length, recoveredOriginal: true,
    adminSectionTitleIndependent: true })

  // Every section has the same top-level navigation; center appears only
  // for the layouts where it exists in the published composition.
  const chooseArea = async (label) => {
    const clicked = await page.evaluate((name) => {
      const button = [...document.querySelectorAll(".site-editor-area-tabs button")]
        .find((item) => item.querySelector("strong")?.textContent?.trim() === name)
      button?.click()
      return Boolean(button)
    }, label)
    assert(clicked, "Área indisponível: " + label)
    await waitFor(page, (name) =>
      document.querySelector(".site-editor-area-tabs button[aria-selected='true'] strong")
        ?.textContent?.trim() === name, label)
  }
  const verifyZones = async (sectionName, expectedLabels) => {
    await chooseSection(sectionName)
    await waitFor(page, (length) =>
      document.querySelectorAll(".site-editor-area-tabs button").length === length,
      expectedLabels.length)
    const buttons = await page.evaluate(() =>
      [...document.querySelectorAll(".site-editor-area-tabs button")]
        .map((x) => x.querySelector("strong")?.textContent?.trim()))
    assert(JSON.stringify(buttons) === JSON.stringify(expectedLabels),
      "Áreas erradas para " + sectionName + ": " + JSON.stringify(buttons))
  }
  const triple = ["Seção", "Esquerda", "Centro", "Direita"]
  await verifyZones("Olá!", triple)
  await chooseArea("Centro")
  await page.waitForSelector(".about-center-photo-only .published-media-picker-label", { timeout: 12000 })
  const photoTarget = await page.evaluate(() => ({
    title: document.querySelector(".about-center-photo-only h3")?.textContent?.trim(),
    mediaLabel: document.querySelector(".about-center-photo-only .published-media-picker-label")?.textContent?.trim(),
    itemEditors: document.querySelectorAll(".studio-inline-layout .block-item-editor").length,
    advancedSettings: document.querySelectorAll(".studio-inline-layout .site-editor-advanced").length,
  }))
  assert(photoTarget.title?.includes("Fotografia desktop") &&
    photoTarget.mediaLabel === "Fotografia desktop" &&
    photoTarget.itemEditors === 0 && photoTarget.advancedSettings === 0,
    "Centro de Olá! deve ter somente fotografia: " + JSON.stringify(photoTarget))
  await verifyZones("Resultados e projetos", triple)
  await chooseArea("Centro")
  await waitFor(page, () =>
    document.querySelector(".studio-inline-layout .block-items") !== null)
  await verifyZones("Experiências Profissionais", triple)
  await chooseArea("Centro")
  await waitFor(page, () => document.querySelectorAll(".site-editor-center-blocks button").length === 2)
  const centerSources = await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-center-blocks button")].map((x) => x.textContent?.trim()))
  assert(centerSources.includes("Projetos do bloco A") &&
    centerSources.includes("Projetos do bloco B"), "Projetos A/B indisponíveis no Centro.")
  await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-center-blocks button")]
      .find((x) => x.textContent?.includes("bloco A"))?.click())
  await waitFor(page, () =>
    [...document.querySelectorAll(".site-editor-center-blocks button")]
      .find((x) => x.textContent?.includes("bloco A"))?.getAttribute("aria-pressed") === "true")
  await chooseArea("Direita")
  await page.waitForSelector("#site-editor-experience-gallery", { timeout: 12000 })
  report("VISUAL_AREAS", { sections: 3, positions: triple,
    desktopPortraitOnly: true, sharedExperienceGallery: true })

  const ordinarySections = ["Comunicação e estratégia", "Formação",
    "Ferramentas", "Depoimentos", "Contato"]
  for (const name of ordinarySections) {
    await verifyZones(name, ["Seção", "Esquerda", "Direita"])
    await chooseArea("Esquerda")
    await waitFor(page, () =>
      document.querySelector(".site-editor-section input[value]") !== null &&
      document.querySelector(".studio-inline-layout .block-items") !== null)
    await chooseArea("Direita")
    await waitFor(page, () => document.querySelector(".studio-inline-layout .block-items") !== null)
  }
  const experienceNames = ["Invest RS", "Prefeitura de São Paulo",
    "Vale", "TV Globo / SporTV", "Grupo InPress", "CDI Comunicação"]
  await chooseSection("Experiências Profissionais")
  for (const name of experienceNames) {
    const activated = await page.evaluate((label) => {
      const button = [...document.querySelectorAll(".site-editor-experience-options button")]
        .find((item) => item.textContent?.includes(label))
      button?.click()
      return Boolean(button)
    }, name)
    assert(activated, "Trabalho ausente: " + name)
    await waitFor(page, (label) =>
      [...document.querySelectorAll(".site-editor-experience-options button")]
        .some((button) => button.classList.contains("active") &&
          button.textContent?.includes(label)), name)
    await waitFor(page, () => document.querySelectorAll(".site-editor-area-tabs button").length === 4)
  }
  report("ALL_SECTIONS", { total: 14, ordinary: ordinarySections.length,
    experiences: experienceNames.length, areaRouting: true })

  await chooseSection("Formação")
  await chooseArea("Esquerda")
  const copyFields = await page.evaluate(() =>
    [...document.querySelectorAll(".site-editor-section .field-grid label")]
      .map((node) => node.textContent?.trim()))
  assert(copyFields.some((text) => text?.includes("Título público")) &&
    copyFields.some((text) => text?.includes("Introdução")),
    "Textos públicos não aparecem na área Esquerda.")
  report("EDITORIAL_COPY", { publicTitleSeparatedFromCmsTitle: true, section: "Formação" })
  await chooseSection("Hero")

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  await page.waitForSelector(".hero-editor-tabs button", { timeout: 15000 })
  const mobile = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
    panelButtons: [...document.querySelectorAll(".hero-editor-tabs button strong")].map(x => x.textContent?.trim()),
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
console.log("P5_STAGE5_RESULT " + JSON.stringify({ passed: checks, expected: 17, writes: blockedWrites.length }))
if (checks !== 17) process.exitCode = 1
