import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const origin = process.env.PDF_QA_BASE || "http://127.0.0.1:4177"
const output = process.env.PDF_QA_SHOTS || path.join(process.cwd(), "pdf-visual-shots")
fs.mkdirSync(output, { recursive: true })

const allSections = [
  "perfil", "sobre", "resultados", "formacao", "invest-rs", "prefeitura-sp",
  "vale", "globo-sportv", "inpress", "cdi", "ferramentas", "depoimentos", "contato",
]
const variants = [
  { device: "desktop", palette: "original", sections: allSections },
  { device: "desktop", palette: "clean", sections: allSections },
  { device: "mobile", palette: "original", sections: allSections },
  { device: "mobile", palette: "clean", sections: allSections },
  { device: "desktop", palette: "original", sections: ["perfil", "resultados", "invest-rs", "contato"] },
  { device: "mobile", palette: "clean", sections: ["perfil", "resultados", "invest-rs", "contato"] },
]
const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
const records = []
let failed = 0

try {
  for (const item of variants) {
    const page = await browser.newPage()
    const { device, palette, sections } = item
    const selected = new Set(sections)
    const label = device + "-" + palette + "-" + sections.length + "pages"
    try {
      const width = device === "desktop" ? 1440 : 390
      const height = device === "desktop" ? 900 : 844
      await page.setCacheEnabled(false)
      await page.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
        isMobile: device === "mobile",
        hasTouch: device === "mobile",
      })
      const response = await page.goto(
        origin + "/pdf-export-qa.html?device=" + device + "&palette=" + palette,
        { waitUntil: "networkidle0", timeout: 45000 },
      )
      if (response?.status() !== 200 && response?.status() !== 304) {
        throw new Error("Fixture returned " + response?.status())
      }
      await page.waitForFunction(() => document.documentElement.dataset.pdfQaReady === "true")

      const manifest = await page.evaluate(async (slugs, mobileOrDesktop) => {
        await document.fonts.ready
        const root = document.querySelector(".pdf-portfolio")
        if (!root) throw new Error("No PDF renderer in fixture")
        for (const section of [...root.querySelectorAll("[data-pdf-section]")]) {
          if (!slugs.includes(section.dataset.pdfSection)) section.remove()
        }
        const images = [...root.querySelectorAll("img")].filter(
          (img) => img.getClientRects().length > 0,
        )
        images.forEach((img) => { img.loading = "eager" })
        await Promise.all(
          images.map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  img.addEventListener("load", resolve, { once: true })
                  img.addEventListener("error", resolve, { once: true })
                }),
          ),
        )
        if (images.some((img) => !img.naturalWidth)) throw new Error("Broken image")
        document.documentElement.dataset.pdfExportReady = "true"
        const mod = await import("/src/lib/pdf-print-layout.ts")
        return mod.preparePdfPrintLayout(document, mobileOrDesktop, slugs)
      }, sections, device)

      if (manifest.pages.length !== sections.length) throw new Error("Manifest count mismatch")
      if (manifest.pages.some((entry, index) => entry.slug !== sections[index])) {
        throw new Error("Manifest order mismatch")
      }

      const file = path.join(output, label + ".pdf")
      await page.pdf({
        path: file,
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        tagged: true,
        timeout: 120000,
      })
      const info = execFileSync("pdfinfo", [file], { encoding: "utf8" })
      const actualPages = Number(info.match(/^Pages:\s*(\d+)/m)?.[1])
      if (actualPages !== sections.length) {
        const entries = []
        for (let number = 1; number <= actualPages; number++) {
          const text = execFileSync("pdftotext", [
            "-f", String(number), "-l", String(number), file, "-",
          ], { encoding: "utf8" })
          entries.push({ page: number, text: text.replace(/\s+/g, " ").slice(0, 110) })
        }
        throw new Error(
          "Physical PDF pages " + actualPages + ", requested " + sections.length +
          "; manifest=" + JSON.stringify(manifest.pages) + "; pageStarts=" + JSON.stringify(entries),
        )
      }
      const searchable = execFileSync("pdftotext", ["-layout", file, "-"], {
        encoding: "utf8",
        maxBuffer: 25 * 1024 * 1024,
      })
      if (searchable.length < 300 || !/RESULTADOS/i.test(searchable)) {
        throw new Error("PDF has missing or unsearchable text")
      }
      const xml = execFileSync("pdftohtml", ["-xml", "-stdout", "-hidden", "-i", file], {
        encoding: "utf8",
        maxBuffer: 35 * 1024 * 1024,
      })
      const physical = [...xml.matchAll(/<page number="(\d+)"[\s\S]*?<\/page>/g)]
      if (physical.length !== sections.length) throw new Error("Cannot parse PDF pages")
      const hero = physical[0]?.[0] ?? ""
      const contact = physical[physical.length - 1]?.[0] ?? ""
      if (selected.has("perfil") && !hero.includes("<a href=")) {
        throw new Error("Missing clickable Hero links")
      }
      if (selected.has("contato") && !contact.includes("<a href=")) {
        throw new Error("Missing clickable Contact links")
      }
      const excludedHeroLinks = await page.evaluate(() =>
        document.querySelectorAll("#perfil a[data-pdf-print-original-href]").length,
      )
      if (excludedHeroLinks > 0 && !hero.includes("https://tulius.work/")) {
        throw new Error("Excluded-section Hero links should open the live site")
      }
      const record = {
        label, pages: actualPages, widthPx: manifest.widthPx,
        heightsPx: manifest.pages.map((part) => part.heightPx),
        searchableChars: searchable.length, bytes: fs.statSync(file).size,
        heroLinks: (hero.match(/<a href=/g) || []).length,
        contactLinks: (contact.match(/<a href=/g) || []).length,
        result: "PASS",
      }
      records.push(record)
      console.log("PDF_NATIVE_PAGES " + JSON.stringify(record))
    } catch (reason) {
      failed++
      const record = { label, result: "FAIL", error: String(reason) }
      records.push(record)
      console.error("PDF_NATIVE_PAGES " + JSON.stringify(record))
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
fs.writeFileSync(
  path.join(output, "pdf-native-report.json"),
  JSON.stringify({ failed, records }, null, 2),
)
console.log("PDF_NATIVE_SUMMARY " + JSON.stringify({ failed, tested: records.length }))
if (failed) process.exitCode = 1
