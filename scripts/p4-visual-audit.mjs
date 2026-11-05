import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const base = "https://tulius.work/"
const dir = path.join(process.env.RUNNER_TEMP ?? "/tmp", "p4-editorial")
fs.mkdirSync(dir, { recursive: true })
const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
let failures = 0
const report = []
try {
  for (const variant of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage()
    try {
      await page.setViewport({
        width: variant.width, height: variant.height,
        deviceScaleFactor: 1, isMobile: variant.name === "mobile",
        hasTouch: variant.name === "mobile",
      })
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ])
      await page.goto(base, { waitUntil: "networkidle2", timeout: 40000 })
      const expectedVisible = variant.name === "mobile" ? 8 : 13
      await page.waitForFunction((total) =>
        document.querySelectorAll("section.portfolio-section").length === total,
        { timeout: 15000 }, expectedVisible)
      await page.evaluate(async () => document.fonts.ready)
      const renderedSlugs = await page.$$eval("section.portfolio-section", nodes => nodes.map(node => node.id))
      const companySlugs = ["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"]
      const slugs = variant.name === "mobile"
        ? renderedSlugs.flatMap(slug => slug === "invest-rs" ? companySlugs : [slug])
        : renderedSlugs
      if (slugs.length !== 13 || new Set(slugs).size !== 13) throw new Error("Seções ausentes ou duplicadas")
      for (const [index, slug] of slugs.entries()) {
        if (variant.name === "mobile" && companySlugs.includes(slug) && slug !== "invest-rs") {
          await page.click(`.experience-index a[href="#${slug}"]`)
          await page.waitForSelector(`#${slug}-a`, { timeout: 15000 })
        }
        const panelKeys = variant.name === "desktop" ? ["desktop"] : slug === "resultados" ? ["a"] : ["a", "b"]
        for (const panel of panelKeys) {
          const selector = variant.name === "desktop"
            ? "#"+slug+" .desktop-panel" : "#"+slug+"-"+panel
          const found = await page.$(selector)
          if (!found) throw new Error("Painel ausente: " + selector)
          await page.evaluate((sel) => {
            const element = document.querySelector(sel)
            element?.scrollIntoView({ block: "start", behavior: "instant" })
          }, selector)
          // Lazy images must be decoded before recording a panel as visually verified.
          await page.waitForFunction((sel) =>
            Array.from(document.querySelectorAll(sel + " img")).every(img => img.complete && img.naturalWidth > 0),
            { timeout: 12000 }, selector)
          const state = await page.evaluate((sel) => {
            const el = document.querySelector(sel)
            const rect = el?.getBoundingClientRect()
            return {
              documentWidth: document.documentElement.scrollWidth,
              textLength: el?.textContent?.trim().length ?? 0,
              panelWidth: Math.round(rect?.width ?? 0),
              panelHeight: Math.round(rect?.height ?? 0),
              visible: !!el && getComputedStyle(el).display !== "none",
              error: !!document.querySelector(".data-error"),
              images: el?.querySelectorAll("img").length ?? 0,
              brokenImages: Array.from(el?.querySelectorAll("img") ?? []).filter(img => !img.complete || img.naturalWidth === 0).length,
            }
          }, selector)
          const photoOnlyContact = variant.name === "mobile" && slug === "contato" &&
            panel === "a" && state.images > 0 && state.brokenImages === 0
          if (!state.visible || (state.textLength < 15 && !photoOnlyContact) ||
              state.error || state.brokenImages > 0 || state.documentWidth > variant.width+2) {
            failures++
          }
          const filename = `p4-${variant.name}-${String(index+1).padStart(2,'0')}-${slug}-${panel}.png`
          // Capture all of the selected panel, not the first viewport after scrolling.
          await found.screenshot({ path: path.join(dir, filename), captureBeyondViewport: true })
          report.push({ section: slug, panel, ...state, screenshot: filename })
        }
      }
    } catch (error) {
      failures++
      console.log("P4_EDITORIAL_ERROR " + JSON.stringify({ variant: variant.name, message: String(error) }))
    } finally {
      await page.close()
    }
  }
  const page = await browser.newPage()
  try {
    await page.setViewport({ width: 320, height: 700, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    await page.goto(base, { waitUntil: "networkidle2", timeout: 40000 })
    const contact = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".layout-contact .panel-b .item-value"))
      return items.map(el => {
        const range = document.createRange()
        range.selectNodeContents(el)
        return { value: el.textContent?.trim().slice(0, 36), lines: range.getClientRects().length }
      })
    })
    console.log("P4_CONTACT_320 " + JSON.stringify({ values: contact }))
    if (contact.length < 3 || contact.some(x => x.lines > 1)) failures++
  } catch (error) {
    failures++
    console.log("P4_CONTACT_320_ERROR " + String(error))
  } finally {
    await page.close()
  }
} finally {
  await browser.close()
}
console.log("P4_EDITORIAL_SUMMARY " + JSON.stringify({
  captures: report.length,
  desktop: report.filter(x => x.panel === "desktop").length,
  mobile: report.filter(x => x.panel !== "desktop").length,
  failures,
  badPanels: report.filter(x => {
    const photoOnlyContact = x.section === "contato" && x.panel === "a" &&
      x.images > 0 && x.brokenImages === 0
    return !x.visible || (x.textLength < 15 && !photoOnlyContact) ||
      x.error || x.brokenImages > 0 || x.documentWidth > (x.panel === "desktop" ? 1442 : 392)
  }),
}))
if (report.length !== 38 || failures) process.exitCode = 1
