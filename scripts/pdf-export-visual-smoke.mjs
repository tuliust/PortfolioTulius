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
        await page.waitForFunction(
          () => document.documentElement.dataset.pdfExportReady === "true",
          { timeout: 25000 },
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
          const profileA = document.querySelector("#perfil-a")
          const profileB = document.querySelector("#perfil-b")
          const heroStage = profileA?.querySelector(".profile-mobile-stage, .mobile360")
          const profileABounds = profileA?.getBoundingClientRect()
          const profileBBounds = profileB?.getBoundingClientRect()
          const heroStageBounds = heroStage?.getBoundingClientRect()
          const loadedFonts = [...document.fonts]
            .filter((face) => face.status === "loaded")
            .map((face) => face.family)
          const testimonials = [...document.querySelectorAll("#depoimentos .testimonial-card")]
          const experienceBounds = experiences.map((section) => section.getBoundingClientRect())
          const experiencePositions = experiences.map(
            (section) => getComputedStyle(section).position,
          )
          const experienceOverlapPx = experienceBounds.reduce(
            (maximum, rect, index) =>
              index === 0
                ? maximum
                : Math.max(maximum, experienceBounds[index - 1].bottom - rect.top),
            0,
          )
          const contactPortrait = document.querySelector("#contato .contact-portrait img")
          const contactLayout = document.querySelector("#contato .contact-desktop")
          const contactBottomGap = contactPortrait && contactLayout
            ? contactLayout.getBoundingClientRect().bottom -
              contactPortrait.getBoundingClientRect().bottom
            : null
          const contactLayoutHeight = contactLayout?.getBoundingClientRect().height ?? null
          const contactLayoutOverflow = contactLayout
            ? getComputedStyle(contactLayout).overflowY
            : null
          const experienceSeparators = experiences.slice(1).map((section) => {
            const style = getComputedStyle(section)
            return { width: parseFloat(style.borderTopWidth), color: style.borderTopColor }
          })
          const testimonialPortraitWidths = testimonials.map(
            (card) => card.querySelector(".testimonial-person img")?.getBoundingClientRect().width || 0,
          )
          const testimonialQuoteFontSizes = testimonials.map(
            (card) => parseFloat(getComputedStyle(card.querySelector(".testimonial-quote")).fontSize),
          )
          const testimonialTopGaps = testimonials.map((card) => {
            const person = card.querySelector(".testimonial-person")?.getBoundingClientRect()
            const quote = card.querySelector(".testimonial-quote")?.getBoundingClientRect()
            return person && quote ? quote.top - person.bottom : 0
          })
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
            loadedFonts,
            firstMobilePanelHeight: profileABounds?.height ?? null,
            mobilePanelOverlapPx: profileABounds && profileBBounds
              ? Math.max(0, profileABounds.bottom - profileBBounds.top)
              : null,
            mobileHeroContentOverlapPx: heroStageBounds && profileBBounds
              ? Math.max(0, heroStageBounds.bottom - profileBBounds.top)
              : null,
            colors: [...new Set(colors)],
            mediaCount: document.querySelectorAll(".pdf-portfolio img").length,
            portraitLoaded: Boolean(photo?.complete && photo.naturalWidth > 0),
            resultsCenters: results?.querySelectorAll(".results-center").length || 0,
            metricsCount: results?.querySelectorAll(".results-metrics-grid .content-item").length || 0,
            metricsColumns,
            experienceCount: experiences.length,
            experienceSeparators,
            contactBottomGap,
            contactLayoutHeight,
            contactLayoutOverflow,
            experiencePositions,
            experienceOverlapPx,
            contactPortraitObjectFit: contactPortrait
              ? getComputedStyle(contactPortrait).objectFit
              : null,
            testimonialPortraitWidths,
            testimonialQuoteFontSizes,
            testimonialTopGaps,
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
        if (report.experiencePositions.some((position) => position === "sticky" || position === "fixed") || report.experienceOverlapPx > 2) issues.push("experience_stacking")
        if (report.experienceSeparators.some((entry) => entry.width < 2.5)) issues.push("experience_separators")
        if (palette === "clean" && report.experienceSeparators.some((entry) => {
          const channels = entry.color.match(/\d+/g)?.map(Number) ?? []
          return channels.length < 3 || channels[0] !== channels[1] || channels[1] !== channels[2]
        })) issues.push("clean_separator_not_grayscale")
        if (device === "desktop" && report.contactPortraitObjectFit !== "contain") issues.push("contact_photo_crop")
        if (device === "desktop" && (
          (report.contactLayoutHeight ?? 9999) > 820 ||
          report.contactLayoutOverflow !== "visible" ||
          (report.contactBottomGap ?? 9999) > 4
        )) issues.push("contact_bottom_alignment")
        if (report.testimonialPortraitWidths.some((width) => width < 64)) issues.push("testimonial_photo_size")
        if (report.testimonialQuoteFontSizes.some((size) => size < 15.5)) issues.push("testimonial_font_size")
        if (report.testimonialTopGaps.some((gap) => gap < 10)) issues.push("testimonial_text_spacing")
        if (report.trajectoryParagraphs.some((n) => n < 6)) issues.push("trajectories")
        if (report.testimonials !== 3 || !report.testimonialsAsArticles) issues.push("testimonials")
        if (report.unwantedControls !== 0 || !report.profileArrowHidden) issues.push("controls")
        if (report.heroLinks < 5) issues.push("hero_links")
        if (!report.loadedFonts.some((font) => font.includes("Big Shoulders Display"))) {
          issues.push("display_font_missing")
        }
        if (!report.loadedFonts.some((font) => font.includes("Inter"))) {
          issues.push("body_font_missing")
        }
        if (device === "mobile" && (
          (report.firstMobilePanelHeight ?? 0) < viewports.mobile.height - 2 ||
          (report.mobilePanelOverlapPx ?? 1) > 2 ||
          (report.mobileHeroContentOverlapPx ?? 1) > 2
        )) issues.push("mobile_profile_overlap")
        if (report.textClipping) issues.push("text_clipping")
        if (report.horizontalOverflowPx > 2) issues.push("horizontal_overflow")
        if (palette === "clean" && !report.whiteSections) issues.push("clean_backgrounds")
        if (palette === "original" && report.whiteSections) issues.push("original_identity")
        if (device === "mobile" && report.metricsColumns !== 1) issues.push("mobile_metric_grid")
        if (device === "desktop" && report.metricsColumns !== 4) issues.push("desktop_metric_grid")
        if (errors.length) issues.push("page_errors")

        for (const slug of ["perfil", "resultados", "invest-rs", "depoimentos", "contato"]) {
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
  // Failure-mode regression: a missing published portrait must not blank
  // the mobile document or silently enable an incomplete PDF.
  const brokenPage = await browser.newPage()
  try {
    await brokenPage.setViewport({ ...viewports.mobile, deviceScaleFactor: 1 })
    await brokenPage.goto(
      base + "/pdf-export-qa.html?device=mobile&palette=original&brokenImage=true",
      { waitUntil: "networkidle0", timeout: 35000 },
    )
    await brokenPage.waitForSelector("[data-pdf-readiness-error]", { timeout: 25000 })
    const broken = await brokenPage.evaluate(() => ({
      count: document.querySelectorAll(".pdf-portfolio [data-pdf-section]").length,
      visible: Boolean(document.querySelector("#depoimentos .testimonial-card")),
      ready: document.documentElement.dataset.pdfExportReady === "true",
      message: document.querySelector("[data-pdf-readiness-error]")?.textContent ?? "",
    }))
    const issues = []
    if (broken.count !== 13 || !broken.visible) issues.push("preview_disappeared")
    if (broken.ready) issues.push("incomplete_pdf_enabled")
    if (!broken.message.includes("depoimentos")) issues.push("missing_section_diagnostic")
    records.push({ device: "mobile", palette: "original", simulatedBrokenImage: true, report: broken, issues })
    if (issues.length) failures++
    console.log("PDF_MOBILE_BROKEN_IMAGE_QA " + JSON.stringify({ ...broken, issues }))
  } catch (error) {
    failures++
    records.push({ simulatedBrokenImage: true, error: String(error) })
    console.error("PDF_MOBILE_BROKEN_IMAGE_QA_ERROR " + String(error))
  } finally {
    await brokenPage.close()
  }

  // Regression for the production-only About tablet asset. Unlike the public
  // page, PDF export must provide an immediate src outside the viewport.
  // Mock the published URL locally: the QA does not read production Storage.
  const aboutPage = await browser.newPage()
  try {
    await aboutPage.setViewport({ ...viewports.mobile, deviceScaleFactor: 1 })
    await aboutPage.setRequestInterception(true)
    aboutPage.on("request", (request) => {
      if (request.url().includes("a46a4091-bce1-4345-a17f-7d7947a8e903-tulius_tablet.png")) {
        void request.respond({
          status: 200,
          contentType: "image/png",
          body: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lZUAAAAASUVORK5CYII=",
            "base64",
          ),
        })
      } else {
        void request.continue()
      }
    })
    await aboutPage.goto(
      base + "/pdf-export-qa.html?device=mobile&palette=original&deferredAbout=true",
      { waitUntil: "networkidle0", timeout: 35000 },
    )
    await aboutPage.waitForFunction(
      () => document.documentElement.dataset.pdfExportReady === "true",
      { timeout: 25000 },
    )
    const about = await aboutPage.evaluate(() => {
      const image = document.querySelector("#sobre .about-mobile-photo img")
      return {
        count: document.querySelectorAll(".pdf-portfolio [data-pdf-section]").length,
        hasSource: Boolean(image?.getAttribute("src")),
        eager: image?.getAttribute("loading") === "eager",
        imageLoaded: Boolean(image?.complete && image?.naturalWidth),
        error: document.querySelector("[data-pdf-readiness-error]")?.textContent ?? "",
      }
    })
    const issues = []
    if (about.count !== 13) issues.push("about_section_missing")
    if (!about.hasSource || !about.eager || !about.imageLoaded) {
      issues.push("about_photo_deferred_or_broken")
    }
    if (about.error) issues.push("about_unexpected_export_block")
    records.push({ device: "mobile", simulatedDeferredAbout: true, report: about, issues })
    if (issues.length) failures++
    console.log("PDF_MOBILE_ABOUT_IMAGE_QA " + JSON.stringify({ ...about, issues }))
  } catch (error) {
    failures++
    records.push({ simulatedDeferredAbout: true, error: String(error) })
    console.error("PDF_MOBILE_ABOUT_IMAGE_QA_ERROR " + String(error))
  } finally {
    await aboutPage.close()
  }
} finally {
  await browser.close()
}

fs.writeFileSync(path.join(shots, "report.json"), JSON.stringify({ failures, records }, null, 2))
console.log("PDF_VISUAL_QA_SUMMARY " + JSON.stringify({ failures, tested: records.length }))
if (failures > 0) process.exitCode = 1
