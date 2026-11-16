import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const base = process.env.PDF_QA_BASE || "http://127.0.0.1:4177"
const shots = process.env.PDF_QA_SHOTS || path.join(process.cwd(), "pdf-visual-shots")
fs.mkdirSync(shots, { recursive: true })

const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})

const viewports = {
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
}

const expectedOrder = [
  "perfil",
  "sobre",
  "resultados",
  "formacao",
  "invest-rs",
  "prefeitura-sp",
  "vale",
  "globo-sportv",
  "inpress",
  "cdi",
  "ferramentas",
  "depoimentos",
  "contato",
]
const records = []
let failures = 0

try {
  for (const device of ["desktop", "mobile"]) {
    for (const palette of ["original", "clean"]) {
      const page = await browser.newPage()
      const errors = []
      page.on("pageerror", (error) => errors.push(String(error).slice(0, 250)))
      try {
        await page.setViewport({ ...viewports[device], deviceScaleFactor: 1 })
        const response = await page.goto(
          base + "/pdf-export-qa.html?device=" + device + "&palette=" + palette,
          { waitUntil: "networkidle0", timeout: 35000 },
        )
        if (response?.status() !== 200) throw new Error("Fixture status " + response?.status())
        await page.waitForFunction(
          () => document.documentElement.dataset.pdfQaReady === "true",
          { timeout: 10000 },
        )
        await page.evaluate(async () => {
          await document.fonts.ready
          await Promise.all(
            [...document.images].map(
              (img) =>
                img.complete
                  ? Promise.resolve()
                  : new Promise((resolve) => {
                      img.addEventListener("load", resolve, { once: true })
                      img.addEventListener("error", resolve, { once: true })
                      setTimeout(resolve, 4000)
                    }),
            ),
          )
        })

        const report = await page.evaluate(() => {
          const root = document.querySelector(".pdf-portfolio")
          const sections = [...document.querySelectorAll(".pdf-portfolio [data-pdf-section]")]
          const results = document.querySelector("#resultados")
          const experiences = [...document.querySelectorAll(".pdf-experience-section")]
          const colors = sections.map((el) => getComputedStyle(el).backgroundColor)
          const metricsGrid = results?.querySelector(".results-metrics-grid")
          const metricsColumns = metricsGrid
            ? getComputedStyle(metricsGrid).gridTemplateColumns.split(" ").length
            : 0
          const photo = document.querySelector("#perfil img")
          const testimonials = [...document.querySelectorAll("#depoimentos .testimonial-card")]
          const clipping = [
            ...document.querySelectorAll(
              "#resultados .results-center, #depoimentos .testimonial-quote, .pdf-experience-trajectory",
            ),
          ].filter((el) => {
            const style = getComputedStyle(el)
            return /(auto|hidden|clip|scroll)/.test(style.overflowY) &&
              el.scrollHeight > el.clientHeight + 2
          })
          return {
            order: sections.map((el) => el.dataset.pdfSection),
            viewportWidth: innerWidth,
            declaredWidth: Number(root?.dataset.pdfReferenceWidth),
            device: root?.dataset.pdfDevice,
            palette: root?.dataset.pdfPalette,
            whiteSections: colors.every((color) => color === "rgb(255, 255, 255)"),
            colors: [...new Set(colors)],
            mediaCount: document.querySelectorAll(".pdf-portfolio img").length,
            portraitLoaded: Boolean(photo?.complete && photo.naturalWidth > 0),
            resultsCenters: results?.querySelectorAll(".results-center").length || 0,
            metricsCount: results?.querySelectorAll(".results-metrics-grid .content-item").length || 0,
            metricsColumns,
            experienceCount: experiences.length,
            projectCounts: experiences.map(
              (el) => el.querySelectorAll(".pdf-experience-projects .experience-project").length,
            ),
            trajectoryParagraphs: experiences.map(
              (el) => el.querySelectorAll(".pdf-experience-trajectory .experience-full-body p").length,
            ),
            testimonials: testimonials.length,
            testimonialsAsArticles: testimonials.every((el) => el.tagName === "ARTICLE"),
            unwantedControls: document.querySelectorAll(
              ".site-header, .experience-index, .experience-gallery, .results-theme-list, .testimonial-action",
            ).length,
            profileArrowHidden: [
              ...document.querySelectorAll(".profile-next-section, .profile-mobile-next"),
            ].every(
              (el) => getComputedStyle(el).display === "none",
            ),
            heroLinks: [...document.querySelectorAll("#perfil a[href^='#']")].filter(
              (anchor) =>
                anchor.classList.contains("area-card-link") ||
                Boolean(anchor.closest(".profile-mobile-area-list")),
            ).length,
            textClipping: clipping.length,
            horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - innerWidth),
          }
        })

        const issues = []
        if (JSON.stringify(report.order) !== JSON.stringify(expectedOrder)) issues.push("order")
        if (report.viewportWidth !== viewports[device].width) issues.push("viewport")
        if (report.declaredWidth !== viewports[device].width) issues.push("reference_width")
        if (report.device !== device || report.palette !== palette) issues.push("mode")
        if (report.resultsCenters !== 6 || report.metricsCount !== 24) issues.push("results")
        if (report.experienceCount !== 6 || report.projectCounts.some((n) => n !== 5)) issues.push("projects")
        if (report.trajectoryParagraphs.some((n) => n < 6)) issues.push("trajectories")
        if (report.testimonials !== 3 || !report.testimonialsAsArticles) issues.push("testimonials")
        if (report.unwantedControls !== 0 || !report.profileArrowHidden) issues.push("controls")
        if (report.heroLinks < 5) issues.push("hero_links")
        if (report.textClipping) issues.push("text_clipping")
        if (report.horizontalOverflowPx > 2) issues.push("horizontal_overflow")
        if (palette === "clean" && !report.whiteSections) issues.push("clean_backgrounds")
        if (palette === "original" && report.whiteSections) issues.push("original_identity")
        if (device === "mobile" && report.metricsColumns !== 1) issues.push("mobile_metric_grid")
        if (device === "desktop" && report.metricsColumns !== 4) issues.push("desktop_metric_grid")
        if (errors.length) issues.push("page_errors")

        for (const slug of ["perfil", "resultados", "invest-rs", "depoimentos"]) {
          const section = await page.$('[data-pdf-section="' + slug + '"]')
          if (section) {
            await section.screenshot({
              path: path.join(shots, device + "-" + palette + "-" + slug + ".png"),
              captureBeyondViewport: true,
            })
          }
        }

        records.push({ device, palette, report, errors, issues })
        if (issues.length) failures++
        console.log("PDF_VISUAL_QA " + JSON.stringify({ device, palette, issues, ...report }))
      } catch (error) {
        failures++
        const message = String(error)
        records.push({ device, palette, error: message })
        console.error("PDF_VISUAL_QA_ERROR " + JSON.stringify({ device, palette, error: message }))
      } finally {
        await page.close()
      }
    }
  }
} finally {
  await browser.close()
}

fs.writeFileSync(path.join(shots, "report.json"), JSON.stringify({ failures, records }, null, 2))
console.log("PDF_VISUAL_QA_SUMMARY " + JSON.stringify({ failures, tested: records.length }))
if (failures > 0) process.exitCode = 1
