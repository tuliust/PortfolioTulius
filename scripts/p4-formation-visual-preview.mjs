import fs from "node:fs/promises"
import path from "node:path"
import puppeteer from "puppeteer-core"

// DOM-only simulation of the six approved Formation/A decisions.
// Never logs into the CMS, invokes a mutation, or changes production content.
const approved = [
  { title: "Comunicação Social — Jornalismo", meta: "UFRN · 2007–2012", text: "Universidade Federal do Rio Grande do Norte (UFRN)" },
  { title: "Comunicação Integrada e Marketing Digital", meta: "UnP · 2013", text: "Universidade Potiguar (UnP)" },
  { title: "Marketing Digital, BI e Estratégia Data Driven", meta: "PUCRS · 2020–2021", text: "Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)" },
]
const viewports = [
  { name: "desktop", width: 1440, height: 900, isMobile: false },
  { name: "mobile-390", width: 390, height: 844, isMobile: true },
  { name: "mobile-360", width: 360, height: 800, isMobile: true },
]
const outputDir = process.env.P4_PREVIEW_DIR ?? path.join(process.env.RUNNER_TEMP ?? "/tmp", "p4-formation-preview")
await fs.mkdir(outputDir, { recursive: true })
const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
try {
  for (const viewport of viewports) {
    const page = await browser.newPage()
    const writeMethods = []
    const endpointCounts = new Map()
    try {
      await page.setViewport({ ...viewport, deviceScaleFactor: 1, hasTouch: viewport.isMobile })
      page.on("request", (request) => {
        const u = new URL(request.url())
        if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) writeMethods.push(request.method())
        if (u.hostname.endsWith(".supabase.co") && request.method() === "GET" && u.pathname.startsWith("/rest/v1/")) {
          const table = u.pathname.slice("/rest/v1/".length)
          endpointCounts.set(table, (endpointCounts.get(table) ?? 0) + 1)
        }
      })
      const response = await page.goto("https://tulius.work/", { waitUntil: "networkidle2", timeout: 45000 })
      if (!response?.ok()) throw new Error("P4 preview homepage unavailable")
      await page.waitForFunction(
        () => document.querySelectorAll("#formacao-a .content-item").length === 3 &&
          document.querySelectorAll("section.portfolio-section").length === 13,
        { timeout: 15000 },
      )
      const selector = viewport.isMobile ? "#formacao-a" : "#formacao .desktop-panel"
      if (!(await page.$(selector))) throw new Error("P4 preview panel missing: " + selector)
      await page.$eval(selector, (el) => el.scrollIntoView({ block: "start", behavior: "instant" }))
      await (await page.$(selector)).screenshot({ path: path.join(outputDir, viewport.name + "-before.png") })
      const state = await page.evaluate(({ approved, selector }) => {
        const panel = document.querySelector(selector)
        const all = [...(panel?.querySelectorAll(".content-item") ?? [])]
        if (!panel) throw new Error("P4 preview missing panel")
        for (const record of approved) {
          const cards = all.filter((card) => card.querySelector("h3")?.textContent?.trim() === record.title)
          if (cards.length !== 1) throw new Error("P4 preview title not uniquely found: " + record.title)
          const card = cards[0]
          const meta = card.querySelector(".item-meta")?.textContent?.trim()
          if (meta !== record.meta) throw new Error("P4 preview old meta changed: " + record.title)
          const copy = card.querySelector(".item-copy")
          if (!copy || copy.querySelectorAll("p").length !== 1)
            throw new Error("P4 preview unexpected published text: " + record.title)
          const newText = document.createElement("p")
          newText.dataset.p4FormationPreview = "true"
          newText.textContent = record.text
          copy.append(newText)
        }
        const added = [...panel.querySelectorAll("[data-p4-formation-preview]")]
        return {
          added: added.map((element) => element.textContent),
          viewportOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
          section: panel.closest("section")?.id ?? null,
          sourceUnchanged: [...panel.querySelectorAll(".content-item")].filter((card) =>
            approved.some((record) => card.querySelector("h3")?.textContent?.trim() === record.title &&
              card.querySelector(".item-meta")?.textContent?.trim() === record.meta)).length === 3,
        }
      }, { approved, selector })
      await (await page.$(selector)).screenshot({ path: path.join(outputDir, viewport.name + "-approved-preview.png") })
      if (writeMethods.length || state.added.length !== 3 || !state.sourceUnchanged || state.viewportOverflow ||
        state.added.some((value, index) => value !== approved[index].text)) {
        throw new Error("P4 preview contract failed: " + JSON.stringify({ viewport: viewport.name, state, writeMethods }))
      }
      const network = Object.fromEntries([...endpointCounts.entries()].sort((a, b) => a[0].localeCompare(b[0])))
      console.log("P4_FORMATION_VISUAL_PREVIEW " + JSON.stringify({
        viewport: viewport.name, result: "PASS", ...state, writes: writeMethods.length, screenshots: 2,
      }))
      console.log("P3_PUBLIC_REQUEST_BASELINE " + JSON.stringify({ viewport: viewport.name, endpoints: network, writes: 0 }))
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
