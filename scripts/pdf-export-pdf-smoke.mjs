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
  // Reproduces the owner's real print tab: a wide tab containing a 390px document.
  { device: "mobile", palette: "original", sections: allSections, wideTab: true },
  // Includes the actual mobile editorial Hero variant absent from fallback CMS.
  { device: "mobile", palette: "original", sections: allSections, editorial360: true },
  { device: "mobile", palette: "original", sections: allSections, wideTab: true, editorial360: true },
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
    const { device, palette, sections, wideTab = false, editorial360 = false } = item
    const selected = new Set(sections)
    const label = device + "-" + palette + (wideTab ? "-wide-tab" : "") + (editorial360 ? "-editorial360" : "") + "-" + sections.length + "sections"
    try {
      const width = device === "desktop" || wideTab ? 1440 : 390
      const height = device === "desktop" || wideTab ? 900 : 844
      await page.setCacheEnabled(false)
      await page.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
        isMobile: device === "mobile",
        hasTouch: device === "mobile",
      })
      const response = await page.goto(
        origin + "/pdf-export-qa.html?device=" + device + "&palette=" + palette +
          "&sections=" + encodeURIComponent(sections.join(",")) +
          (editorial360 ? "&editorial360=true" : ""),
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

      const beforePrintIsStable = await page.evaluate(() => {
        const style = document.getElementById("portfolio-pdf-print-pages")
        window.dispatchEvent(new Event("beforeprint"))
        return Boolean(style) && document.getElementById("portfolio-pdf-print-pages") === style
      })
      if (!beforePrintIsStable) {
        throw new Error("beforeprint replaced the prepared page geometry")
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
      if (!Number.isInteger(actualPages) || actualPages < sections.length || actualPages > 100) {
        throw new Error("Invalid physical page count " + actualPages +
          " for " + sections.length + " sections")
      }
      if (actualPages !== sections.length) {
        throw new Error("Desktop printed " + actualPages +
          " physical pages for " + sections.length + " sections")
      }
      // Validate the *physical* orientation on every PDF page, not merely
      // the CSS reference viewport or a global landscape print option.
      const sizeInfo = execFileSync(
        "pdfinfo",
        ["-f", "1", "-l", String(actualPages), file],
        { encoding: "utf8" },
      )
      const paperSizes = [...sizeInfo.matchAll(
        /^Page\s+\d+\s+size:\s*([0-9.]+)\s+x\s+([0-9.]+)\s+pts/gm,
      )].map((match) => ({ widthPt: Number(match[1]), heightPt: Number(match[2]) }))
      if (paperSizes.length !== actualPages) {
        throw new Error("Unable to inspect individual physical page sizes")
      }
      for (const [index, pageSize] of paperSizes.entries()) {
        // Desktop has constant 1440px width, but Trajetórias can be
        // legitimately taller than the width after allowing variable heights.
        if (device === "desktop" && Math.abs(pageSize.widthPt - 1080) > 1) {
          throw new Error(
            "Wrong Desktop paper width on page " + (index + 1) + ": " + JSON.stringify(pageSize),
          )
        }
        if (device === "mobile" && (
          Math.abs(pageSize.widthPt - 292.5) > 1 ||
          pageSize.widthPt >= pageSize.heightPt
        )) {
          throw new Error(
            "Wrong Mobile portrait page " + (index + 1) + ": " + JSON.stringify(pageSize),
          )
        }
      }
      // Verify that every section starts on its own physical PDF page.
      const titles = {
        perfil: "TULIUS",
        sobre: "PRAZER",
        resultados: "RESULTADOS",
        formacao: "FORMACAO",
        "invest-rs": "INVEST RS",
        "prefeitura-sp": "PREFEITURA",
        vale: "VALE",
        "globo-sportv": "GLOBO",
        inpress: "INPRESS",
        cdi: "CDI",
        ferramentas: "FERRAMENTAS",
        depoimentos: "DEPOIMENTOS",
        contato: "CONTATO",
      }
      const physicalTexts = Array.from({ length: actualPages }, (_, index) => {
        const text = execFileSync("pdftotext", [
          "-f", String(index + 1), "-l", String(index + 1), "-layout", file, "-",
        ], { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 })
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .toUpperCase().replace(/\s+/g, " ").trim()
      })
      for (let index = 0; index < physicalTexts.length; index++) {
        if (physicalTexts[index].length < 20) {
          throw new Error("Blank or truncated physical PDF page " + (index + 1))
        }
      }
      const sectionStarts = {}
      let previous = -1
      for (const slug of sections) {
        const pageIndex = physicalTexts.findIndex(
          (text, index) => index > previous && text.includes(titles[slug]),
        )
        if (pageIndex < 0) {
          throw new Error("Missing or out-of-order section " + slug +
            " after physical page " + (previous + 1))
        }
        sectionStarts[slug] = pageIndex
        previous = pageIndex
      }
      if (device === "mobile") {
        if (editorial360 && (
          !physicalTexts[0].includes("CONEXOES") ||
          !physicalTexts[0].includes("INOVACAO") ||
          !physicalTexts[0].includes("TSANGAROPULOS")
        )) {
          throw new Error("Mobile editorial Hero lost title or name")
        }
        for (const [index, slug] of sections.entries()) {
          if (sectionStarts[slug] !== index) {
            throw new Error("Wrong Mobile section page for " + slug)
          }
          if (["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"].includes(slug) &&
            !physicalTexts[index].includes("FRENTE SINTETICA 13")) {
            throw new Error("Incomplete Mobile Trajetória for " + slug)
          }
        }
      }
      if (device === "desktop") {
        if (sections.includes("perfil") &&
          !physicalTexts[sectionStarts.perfil].includes("IDIOMAS")) {
          throw new Error("Desktop Hero lost the Idiomas highlight onto another sheet")
        }
        for (const [index, slug] of sections.entries()) {
          if (sectionStarts[slug] !== index) {
            throw new Error("Wrong Desktop section page for " + slug)
          }
          if (["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"].includes(slug) &&
            !physicalTexts[index].includes("FRENTE SINTETICA 13")) {
            throw new Error("Incomplete Desktop Trajetória for " + slug)
          }
          if (slug === "resultados" && (
            !physicalTexts[index].includes("RESULTADOS QUE ORIENTAM DECISOES") ||
            !physicalTexts[index].includes("CONTEUDO E IMPRENSA")
          )) {
            throw new Error("Incomplete Desktop Results")
          }
        }
        for (const slug of ["formacao", "ferramentas", "depoimentos"]) {
          if (!sections.includes(slug)) continue
          const pageHeight = paperSizes[sectionStarts[slug]].heightPt / 0.75
          if (pageHeight > 880) {
            throw new Error("Excessive Desktop whitespace in " + slug)
          }
        }
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
      if (physical.length !== actualPages) throw new Error("Cannot parse PDF pages")
      const firstNextSection = sections[sections.indexOf("perfil") + 1]
      const hero = physical.slice(
        sectionStarts.perfil ?? 0,
        firstNextSection ? sectionStarts[firstNextSection] : actualPages,
      ).map((part) => part[0]).join("\n")
      const contact = physical.slice(sectionStarts.contato ?? actualPages - 1)
        .map((part) => part[0]).join("\n")
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
        paperSizes,
        referencePaperHeightPx: height, wideTab, sectionStarts,
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
