import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const base = "https://tulius.work"
const shots = path.join(process.env.RUNNER_TEMP ?? "/tmp", "p3-screenshots")
fs.mkdirSync(shots, { recursive: true })
const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
let failures = 0
try {
  for (const route of ["/admin", "/admin/preview"]) {
    const page = await browser.newPage()
    try {
      const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 30000 })
      const robotsHeader = response?.headers()["x-robots-tag"] ?? ""
      const noindex = robotsHeader.includes("noindex")
      await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
      if (!noindex) throw new Error("X-Robots-Tag noindex ausente na rota " + route)
      console.log("P3_ANON_ROUTE " + JSON.stringify({ route, finalPath: new URL(page.url()).pathname, noindex, result: "PASS" }))
    } catch (error) {
      failures++
      console.log("P3_ANON_ROUTE " + JSON.stringify({ route, result: "FAIL", url: page.url(), error: String(error).slice(0, 260) }))
    } finally {
      await page.close()
    }
  }

  {
    const page = await browser.newPage()
    let stage = "init"
    try {
      stage = "page loaded"
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.evaluateOnNewDocument(() => {
        window.__p3LcpSamples = []
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              window.__p3LcpSamples.push({
                startMs: Math.round(entry.startTime),
                size: Math.round(entry.size),
                isProfile: Boolean(entry.element?.closest(".mobile-profile-hero, .mobile360")),
              })
            }
          }).observe({ type: "largest-contentful-paint", buffered: true })
        } catch { /* Observer availability varies by browser. */ }
      })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      // networkidle2 only measures network quiet; the public CMS can still be
      // awaiting its first live PostgREST response. Require the actual startup
      // milestones before checking ordering or classifying a blank menu as a
      // visual regression. Timeout remains a hard failure, not an approval.
      try {
        await page.waitForFunction(() => {
          const marks = new Set(performance.getEntriesByType("mark").map((entry) => entry.name))
          return marks.has("p3:profile-bootstrap-ready") &&
            marks.has("p3:profile-dom-committed") &&
            marks.has("p3:portfolio-primary-ready") &&
            document.querySelectorAll("section.portfolio-section").length > 0
        }, { timeout: 20000 })
      } catch (error) {
        const diagnosis = await page.evaluate(() => ({
          marks: performance.getEntriesByType("mark").map((entry) => entry.name)
            .filter((name) => name.startsWith("p3:")),
          publicSections: document.querySelectorAll("section.portfolio-section").length,
          message: document.querySelector('[role="alert"]')?.textContent?.slice(0, 160) ?? null,
        }))
        throw new Error("Public CMS initial load did not settle: " +
          JSON.stringify(diagnosis) + " / " + String(error))
      }
      const firstFold = await page.evaluate(() => {
        const marks = Object.fromEntries(
          performance.getEntriesByType("mark")
            .filter((entry) => entry.name.startsWith("p3:"))
            .map((entry) => [entry.name, Math.round(entry.startTime)]),
        )
        const resources = performance.getEntriesByType("resource")
          .filter((entry) => entry.name.includes(".supabase.co/rest/v1/"))
          .map((entry) => {
            const url = new URL(entry.name)
            return { table: url.pathname.split("/").at(-1), startMs: Math.round(entry.startTime), durationMs: Math.round(entry.duration) }
          })
        const portrait = document.querySelector(".mobile-profile-hero img, .mobile360-photo img")
        const imageResource = performance.getEntriesByType("resource")
          .find((entry) => entry.name === portrait?.currentSrc)
        return {
          marks, resources,
          lcpSamples: window.__p3LcpSamples ?? [],
          imageResource: imageResource ? {
            startMs: Math.round(imageResource.startTime),
            durationMs: Math.round(imageResource.duration),
            transferSize: imageResource.transferSize,
          } : null,
          imagePreloads: [...document.querySelectorAll('link[rel="preload"][as="image"]')].map((link) => ({
            responsiveWebp: Boolean(link.imageSrcset?.includes("tulius-site-600.webp")),
            originalPng: link.href.includes("tulius_site.png"),
          })),
          adminRouterPreloaded: [...document.querySelectorAll('link[rel="modulepreload"]')].some((link) =>
            link.href.includes("admin-router"),
          ),
          adminRouterRequested: performance.getEntriesByType("resource").some((entry) =>
            /\/admin-router-[^/]+\.js/.test(entry.name),
          ),
          fullSupabaseSdkRequested: performance.getEntriesByType("resource").some((entry) =>
            /\/supabase-sdk-[^/]+\.js/.test(entry.name),
          ),
          publicPostgrestRequested: performance.getEntriesByType("resource").some((entry) =>
            /\/public-postgrest-[^/]+\.js/.test(entry.name),
          ),
          portraitComplete: portrait?.complete ?? false,
          publicSections: document.querySelectorAll("section.portfolio-section").length,
        }
      })
      console.log("P3_FIRST_FOLD_TIMING " + JSON.stringify(firstFold))
      const profileCommitMs = firstFold.marks["p3:profile-dom-committed"]
      const bootstrapStartMs = firstFold.marks["p3:profile-bootstrap-start"]
      const bootstrapReadyMs = firstFold.marks["p3:profile-bootstrap-ready"]
      if (!Number.isFinite(bootstrapStartMs) ||
          !Number.isFinite(bootstrapReadyMs) ||
          !(bootstrapStartMs < firstFold.marks["p3:portfolio-fetch-start"])) {
        throw new Error("Live Profile request did not start before React")
      }
      console.log("P3_PROFILE_HTML_BOOTSTRAP " + JSON.stringify({
        startMs: bootstrapStartMs,
        readyMs: bootstrapReadyMs,
        result: "PASS",
      }))
      const profileCmsReadyMs = firstFold.marks["p3:profile-cms-ready"]
      const fullGraphReadyMs = firstFold.marks["p3:portfolio-primary-ready"]
      const seoStartMs = firstFold.marks["p3:seo-fetch-start"]
      if (!Number.isFinite(profileCmsReadyMs) ||
          !Number.isFinite(profileCommitMs) ||
          !Number.isFinite(fullGraphReadyMs) ||
          !(profileCmsReadyMs <= profileCommitMs && profileCommitMs < fullGraphReadyMs)) {
        throw new Error("Profile DOM still waits for the complete CMS graph")
      }
      console.log("P3_PROFILE_EARLY_RENDER " + JSON.stringify({
        cmsReadyMs: profileCmsReadyMs,
        domCommittedMs: profileCommitMs,
        fullGraphReadyMs,
        result: "PASS",
      }))
      if (
        !Number.isFinite(profileCommitMs) ||
        !Number.isFinite(seoStartMs) ||
        seoStartMs <= profileCommitMs
      ) {
        throw new Error("Public SEO metadata requests started before the Profile mounted")
      }
      console.log("P3_SEO_DEFERRED " + JSON.stringify({
        profileCommitMs,
        seoStartMs,
        deferred: true,
      }))
      const earlyTablet = await page.evaluate(() =>
        performance.getEntriesByType("resource").some((entry) =>
          entry.name.includes("a46a4091-bce1-4345-a17f-7d7947a8e903-tulius_tablet.png"),
        ),
      )
      console.log("P3_ABOUT_IMAGE_FIRST_FOLD " + JSON.stringify({
        deferred: !earlyTablet,
        image: "published_about_tablet",
      }))
      if (earlyTablet) throw new Error("Oversized About thumbnail loaded before scroll")
      if (firstFold.adminRouterPreloaded || firstFold.adminRouterRequested) {
        throw new Error("Admin router requested on the public first fold")
      }
      if (firstFold.fullSupabaseSdkRequested || !firstFold.publicPostgrestRequested) {
        throw new Error("Full Supabase SDK requested on the public first fold")
      }

      stage = "profile mobile responsive screens"
      const profileViewports = [
        { width: 320, height: 568 },
        { width: 360, height: 740 },
        { width: 375, height: 667 },
        { width: 390, height: 844 },
        { width: 414, height: 896 },
        { width: 430, height: 932 },
      ]
      for (const viewport of profileViewports) {
        await page.setViewport({ ...viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
        const result = await page.evaluate(() => {
          const panelA = document.querySelector("#perfil-a")
          const panelB = document.querySelector("#perfil-b")
          const portrait = panelA?.querySelector(".mobile-profile-hero img, .mobile360-photo img")
          const badge = panelA?.querySelector(".badge-360")
          const years = panelA?.querySelector(".profile-mobile-years, .mobile360-experience")
          const name = panelA?.querySelector(".mobile-name, .mobile360-person-name")
          const editorialHeadline = panelA?.querySelector(".mobile360-headline")
          const arrow = panelA?.querySelector('a[href="#perfil-b"]')
          const areas = panelB?.querySelectorAll(".profile-mobile-area-list > li")
          const careers = panelB?.querySelectorAll(".profile-mobile-career-list > li")
          const lastCareer = careers?.[careers.length - 1]
          const fitsWidth = (element) => {
            const rect = element?.getBoundingClientRect()
            return Boolean(rect && rect.left >= -2 && rect.right <= innerWidth + 2)
          }
          const badgeRect = badge?.getBoundingClientRect()
          const yearsRect = years?.getBoundingClientRect()
          const overlap = badgeRect && yearsRect &&
            badgeRect.left < yearsRect.right && badgeRect.right > yearsRect.left &&
            badgeRect.top < yearsRect.bottom && badgeRect.bottom > yearsRect.top
          return {
            areas: areas?.length ?? 0,
            careers: careers?.length ?? 0,
            editorialHeadline: Boolean(editorialHeadline?.textContent?.trim()),
            introHidden: !panelA?.querySelector(".mobile360") ||
              !panelA?.textContent?.includes("Foco em gerar conexões autênticas"),
            portraitLoaded: Boolean(portrait?.complete && portrait.naturalWidth > 0),
            badgePresent: Boolean(badge),
            arrowAccessible: Boolean(arrow?.getAttribute("aria-label")),
            nameFits: fitsWidth(name) && [...(name?.children ?? [])].every(fitsWidth),
            panelsFit: fitsWidth(panelA) && fitsWidth(panelB),
            noOverlap: !overlap,
            careerVisible: careers?.length === 0 || Boolean(lastCareer && panelB &&
              lastCareer.getBoundingClientRect().bottom <= panelB.getBoundingClientRect().bottom + 2),
            noOldActions: !panelA?.textContent?.includes("EXPLORAR MINHA ATUAÇÃO") &&
              !panelB?.textContent?.includes("VER AS 6 EXPERIÊNCIAS"),
            nextSection: document.querySelector("#perfil")?.nextElementSibling?.id,
          }
        })
        console.log("P3_PROFILE_MOBILE " + JSON.stringify({ viewport, ...result }))
        if (result.areas !== 5 || result.careers !== 0 || !result.portraitLoaded ||
            !result.badgePresent || !result.editorialHeadline || !result.introHidden ||
            !result.arrowAccessible || !result.nameFits ||
            !result.panelsFit || !result.noOverlap || !result.careerVisible ||
            !result.noOldActions || result.nextSection !== "sobre") {
          throw new Error("Responsive profile failed at " + viewport.width + "px")
        }
      }
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.click('#perfil-a a[href="#perfil-b"]')
      await page.waitForFunction(() =>
        location.hash === "#perfil-b" &&
        Math.abs(document.getElementById("perfil-b")?.getBoundingClientRect().top ?? 9999) < 10,
        { timeout: 10000 },
      )
      console.log("P3_PROFILE_ANCHOR " + JSON.stringify({ result: "PASS", target: "#perfil-b" }))

      stage = "about and results editorial mobile verification"
      const editorialViewports = [
        { width: 320, height: 568 },
        { width: 360, height: 740 },
        { width: 375, height: 667 },
        { width: 390, height: 844 },
        { width: 430, height: 932 },
      ]
      for (const viewport of editorialViewports) {
        await page.setViewport({ ...viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
        const editorial = await page.evaluate(() => {
          const aboutHeadings = document.querySelectorAll("#sobre .about-mobile-copy h2")
          const repeatedHeadings = document.querySelectorAll("#sobre-b h2")
          const differences = document.querySelectorAll("#sobre-b .about-mobile-differences .content-item")
          const aboutPhoto = document.querySelector("#sobre-a .about-mobile-photo img")
          const resultPanel = document.querySelector("#resultados-a")
          const selector = document.querySelector("#resultados-mobile-selector")
          const grid = resultPanel?.querySelector(".results-metrics-grid")
          const metrics = [...(grid?.querySelectorAll(".content-item") ?? [])]
          const colSizes = grid ? getComputedStyle(grid).gridTemplateColumns.split(/\s+/) : []
          const rect = aboutPhoto?.getBoundingClientRect()
          const valueOverflow = metrics.some((metric) => {
            const parent = metric.getBoundingClientRect()
            const value = metric.querySelector(".item-value")?.getBoundingClientRect()
            return Boolean(value && (value.right > parent.right + 2 || value.left < parent.left - 2))
          })
          return {
            aboutTitleCount: aboutHeadings.length,
            duplicateTitles: repeatedHeadings.length,
            differenceCount: differences.length,
            photoWidthRatio: rect ? rect.width / innerWidth : 0,
            categoryOptions: selector?.options.length ?? 0,
            metricCount: metrics.length,
            columns: colSizes.length,
            valueOverflow,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
            resultHeight: resultPanel?.getBoundingClientRect().height ?? 0,
            viewportHeight: innerHeight,
          }
        })
        console.log("P3_ABOUT_RESULTS_MOBILE " + JSON.stringify({ viewport, ...editorial }))
        if (editorial.aboutTitleCount !== 1 || editorial.duplicateTitles !== 0 ||
            editorial.differenceCount !== 5 || editorial.photoWidthRatio < .72 ||
            editorial.categoryOptions !== 6 || editorial.metricCount !== 4 ||
            editorial.columns !== 2 || editorial.valueOverflow || editorial.horizontalOverflow) {
          throw new Error("Mobile About/Results layout mismatch at " + viewport.width + "px")
        }
      }
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.evaluate(() => document.querySelector("#sobre-a")?.scrollIntoView({ behavior: "instant" }))
      await page.waitForFunction(() => {
        const photo = document.querySelector("#sobre-a .about-mobile-photo img")
        return Boolean(photo?.complete && photo.naturalWidth > 0)
      }, { timeout: 15000 })
      await page.select("#resultados-mobile-selector", "marketing")
      await page.waitForFunction(() =>
        document.querySelector("#resultados-a .results-topic h3")?.textContent?.toLowerCase()
          .includes("resultados que orientam decisões") &&
        document.querySelectorAll("#resultados-a .results-metrics-grid .content-item").length === 2,
        { timeout: 10000 },
      )
      await page.select("#resultados-mobile-selector", "")
      await page.waitForFunction(() =>
        !document.querySelector("#resultados-a .results-topic") &&
        document.querySelectorAll("#resultados-a .results-metrics-grid .content-item").length === 4,
        { timeout: 10000 },
      )
      console.log("P3_ABOUT_RESULTS_INTERACTION " + JSON.stringify({
        photoLoaded: true, categoryChanged: true, overviewRestored: true, result: "PASS",
      }))

      stage = "mobile experience sticky progress and project details"
      for (const viewport of [
        { width: 320, height: 568 },
        { width: 360, height: 740 },
        { width: 375, height: 667 },
        { width: 390, height: 844 },
        { width: 430, height: 932 },
      ]) {
        await page.setViewport({ ...viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
        await page.evaluate(() => document.getElementById("invest-rs")?.scrollIntoView({ behavior: "instant" }))
        await page.waitForFunction(() =>
          document.querySelector('.experience-index a[aria-current="location"]')?.getAttribute("href") === "#invest-rs",
          { timeout: 10000 },
        )
        const snapshot = await page.evaluate(() => {
          const strip = document.querySelector(".experience-index")
          const cards = [...document.querySelectorAll(".experience-stack > .experience-card")]
          const projectPanel = document.querySelector("#invest-rs-b")
          const contentPanel = document.querySelector("#invest-rs-a")
          const mainHeader = document.querySelector(".site-header")
          const logos = strip?.querySelectorAll("a") ?? []
          const copy = contentPanel?.getBoundingClientRect()
          const nav = strip?.getBoundingClientRect()
          const tabs = contentPanel?.querySelectorAll(".experience-view-switch button") ?? []
          return {
            companies: cards.length,
            activeCompany: cards[0]?.id,
            logos: logos.length,
            panels: cards.map(card => card.querySelectorAll(".mobile-panel").length),
            opaqueHeader: contentPanel ? getComputedStyle(contentPanel).backgroundColor === "rgb(250, 250, 250)" : false,
            tabs: tabs.length,
            navBelowHeader: Boolean(nav && mainHeader && nav.top >= mainHeader.getBoundingClientRect().bottom - 3),
            summaryBelowNav: Boolean(nav && copy && copy.top >= nav.bottom - 3),
            summarySticky: contentPanel ? getComputedStyle(contentPanel).position === "sticky" : false,
            naturalScroll: projectPanel ? getComputedStyle(projectPanel).overflowY === "visible" : false,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
          }
        })
        console.log("P3_EXPERIENCE_MOBILE_STRUCTURE " + JSON.stringify({ viewport, ...snapshot }))
        if (snapshot.companies !== 1 || snapshot.activeCompany !== "invest-rs" ||
            snapshot.logos !== 6 || snapshot.panels.join(",") !== "2" || snapshot.tabs !== 2 ||
            !snapshot.opaqueHeader || !snapshot.navBelowHeader || !snapshot.summaryBelowNav ||
            (viewport.height > 620 && !snapshot.summarySticky) ||
            !snapshot.naturalScroll || snapshot.horizontalOverflow) {
          throw new Error("Experience sticky structure mismatch: " + JSON.stringify(viewport))
        }
        if (viewport.height > 620) {
          await page.evaluate(() => {
            const panel = document.getElementById("invest-rs-b")
            const body = panel?.querySelector(".experience-mobile-body")
            if (!body) return
            window.scrollTo({ top: window.scrollY + body.getBoundingClientRect().top + 220, behavior: "instant" })
          })
          const sticky = await page.evaluate(() => {
            const index = document.querySelector(".experience-index")?.getBoundingClientRect()
            const head = document.querySelector("#invest-rs-a")?.getBoundingClientRect()
            return { navBottom: index?.bottom ?? -1, headTop: head?.top ?? -1,
              headBottom: head?.bottom ?? -1 }
          })
          console.log("P3_EXPERIENCE_STICKY " + JSON.stringify({ viewport, ...sticky }))
          if (sticky.headTop < sticky.navBottom - 3 ||
              sticky.headTop > sticky.navBottom + 30 ||
              sticky.headBottom >= viewport.height - 70) {
            throw new Error("Experience sticky overlap or insufficient reading area")
          }
        }
      }
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.evaluate(() => document.getElementById("invest-rs")?.scrollIntoView({ behavior: "instant" }))
      await page.waitForFunction(() =>
        document.querySelector("#invest-rs-b .experience-project-choice") !== null,
        { timeout: 10000 },
      )
      await page.click("#invest-rs-b .experience-project:nth-child(2) .experience-project-choice")
      const project = await page.evaluate(() => {
        const list = document.querySelector("#invest-rs-b .experience-mobile-project-list")
        const open = [...(list?.querySelectorAll('.experience-project-choice[aria-expanded="true"]') ?? [])]
        const selected = open[0]?.closest(".experience-project")
        const gallery = selected?.querySelector(".experience-gallery")
        const title = selected?.querySelector(".experience-project-heading")?.textContent?.trim()
        const galleryTitle = gallery?.querySelector(".experience-gallery-footer h3")?.textContent?.trim()
        return { title, galleryTitle, openCount: open.length, gallery: Boolean(gallery),
          noPlaceholder: !list?.textContent?.includes("Fotografia do projeto pendente") }
      })
      console.log("P3_EXPERIENCE_MOBILE_PROJECT " + JSON.stringify(project))
      if (project.openCount !== 1 || !project.gallery || project.galleryTitle !== project.title ||
          !project.noPlaceholder) throw new Error("Project/gallery linkage failure")
      await page.waitForFunction(() =>
        !document.querySelector("#invest-rs-a .experience-view-trajectory")?.disabled,
        { timeout: 15000 },
      )
      await page.click("#invest-rs-a .experience-view-trajectory")
      const trajectory = await page.evaluate(() => ({
        pressed: document.querySelector("#invest-rs-a .experience-view-trajectory")?.getAttribute("aria-pressed"),
        paragraphs: document.querySelectorAll("#invest-rs-b .experience-full-body p").length,
        projectsHidden: document.querySelector("#invest-rs-b .experience-mobile-project-list") === null,
        overflow: getComputedStyle(document.querySelector("#invest-rs-b .experience-full-body")).overflowY,
      }))
      console.log("P3_EXPERIENCE_MOBILE_TRAJECTORY " + JSON.stringify(trajectory))
      if (trajectory.pressed !== "true" || trajectory.paragraphs < 2 ||
          !trajectory.projectsHidden || trajectory.overflow !== "visible") {
        throw new Error("Trajectory must expose full, naturally scrolling text")
      }
      await page.click("#invest-rs-a .experience-view-projects")
      await page.waitForFunction(() =>
        document.querySelector("#invest-rs-b .experience-project-choice[aria-expanded='true']") !== null,
        { timeout: 10000 },
      )
      await page.click('.experience-index a[href="#vale"]')
      await page.waitForFunction(() =>
        document.querySelector('.experience-index a[aria-current="location"]')?.getAttribute("href") === "#vale",
        { timeout: 10000 },
      )
      const changed = await page.evaluate(() => ({
        company: document.querySelector("#vale-a .experience-heading h2")?.textContent?.trim(),
        active: document.querySelector('.experience-index a[aria-current="location"]')?.getAttribute("href"),
        firstProject: document.querySelector("#vale-b .experience-project-choice .experience-project-heading")?.textContent?.trim(),
        onlySelectedCard: document.querySelectorAll(".experience-stack > .experience-card").length === 1 &&
          document.querySelector(".experience-stack > .experience-card")?.id === "vale" &&
          document.querySelector("#invest-rs") === null,
      }))
      console.log("P3_EXPERIENCE_MOBILE_COMPANY_CHANGE " + JSON.stringify(changed))
      if (changed.company !== "Vale" || changed.active !== "#vale" ||
          !changed.firstProject || !changed.onlySelectedCard) {
        throw new Error("Company navigation did not update editorial identity")
      }
      // Let the scheduled logo-triggered scroll settle before testing natural navigation onward.
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      await page.evaluate(() => document.getElementById("ferramentas")?.scrollIntoView({ behavior: "instant" }))
      await page.waitForFunction(() =>
        document.getElementById("ferramentas")?.getBoundingClientRect().top <= innerHeight * .5,
        { timeout: 10000 },
      )
      const after = await page.evaluate(() => {
        const tools = document.getElementById("ferramentas")?.getBoundingClientRect()
        const index = document.querySelector(".experience-index")?.getBoundingClientRect()
        return { toolsTop: tools?.top ?? -1, navBottom: index?.bottom ?? -1,
          toolsVisible: Boolean(tools && tools.top <= innerHeight * .5) }
      })
      console.log("P3_EXPERIENCE_TO_TOOLS " + JSON.stringify(after))
      if (!after.toolsVisible || after.navBottom > after.toolsTop + 5) {
        throw new Error("Experience header remains over Tools")
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
      stage = "training and tools compact mobile layout"
      const compactViewports = [
        { width: 320, height: 568 },
        { width: 360, height: 740 },
        { width: 375, height: 667 },
        { width: 390, height: 844 },
        { width: 430, height: 932 },
      ]
      for (const viewport of compactViewports) {
        await page.setViewport({ ...viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
        const state = await page.evaluate(() => {
          const form = document.getElementById("formacao")
          const tools = document.getElementById("ferramentas")
          const formItems = [...(form?.querySelectorAll(".mobile-items .content-item") ?? [])]
          const toolItems = [...(tools?.querySelectorAll(".mobile-items .content-item") ?? [])]
          const formSubtitle = form?.querySelector(".mobile-panel-subheading")
          const toolsSubtitle = tools?.querySelector(".mobile-panel-secondary-heading")
          const fullVisible = (container, items) => {
            const box = container?.getBoundingClientRect()
            return Boolean(box && items.every((item) => {
              const rect = item.getBoundingClientRect()
              return rect.top >= box.top - 2 && rect.bottom <= box.bottom + 2
            }))
          }
          const toolPositions = toolItems.map((item) => {
            const icon = item.querySelector(".tools-icon-cluster")?.getBoundingClientRect()
            const copy = item.querySelector(".item-copy")?.getBoundingClientRect()
            if (!icon || !copy) return "missing"
            return icon.right < copy.left + 2 ? "left" :
              copy.right < icon.left + 2 ? "right" : "overlap"
          })
          const fullDocumentWidth = document.documentElement.scrollWidth
          return {
            formCount: formItems.length,
            formPanelA: document.querySelectorAll("#formacao-a .content-item").length,
            formPanelB: document.querySelectorAll("#formacao-b .content-item").length,
            toolsCount: toolItems.length,
            toolsPanelA: document.querySelectorAll("#ferramentas-a .content-item").length,
            toolsPanelB: document.querySelectorAll("#ferramentas-b .content-item").length,
            formHeadings: form?.querySelectorAll(".panel-heading h2").length ?? 0,
            toolsHeadings: tools?.querySelectorAll(".panel-heading h2").length ?? 0,
            formSubtitle: Boolean(formSubtitle && getComputedStyle(formSubtitle).display !== "none"),
            toolsSubtitleHidden: !toolsSubtitle || getComputedStyle(toolsSubtitle).display === "none",
            toolPositions,
            formVisible: fullVisible(form, formItems),
            toolsVisible: fullVisible(tools, toolItems),
            formHeight: Math.round(form?.getBoundingClientRect().height ?? 0),
            toolsHeight: Math.round(tools?.getBoundingClientRect().height ?? 0),
            viewportHeight: innerHeight,
            horizontalOverflow: fullDocumentWidth > innerWidth + 2,
            toolOverflow: toolItems.some((item) => {
              const box = item.getBoundingClientRect()
              const icon = item.querySelector(".tools-icon-cluster")?.getBoundingClientRect()
              const copy = item.querySelector(".item-copy")?.getBoundingClientRect()
              return Boolean((icon && (icon.left < box.left - 2 || icon.right > box.right + 2)) ||
                (copy && (copy.left < box.left - 2 || copy.right > box.right + 2)))
            }),
          }
        })
        console.log("P3_TRAINING_TOOLS_MOBILE " + JSON.stringify({ viewport, ...state }))
        if (state.formCount !== 5 || state.formPanelA !== 3 || state.formPanelB !== 2 ||
            state.toolsCount !== 5 || state.toolsPanelA !== 3 || state.toolsPanelB !== 2 ||
            state.formHeadings !== 1 || state.toolsHeadings !== 1 ||
            !state.formSubtitle || !state.toolsSubtitleHidden ||
            state.toolPositions.join(",") !== "left,right,left,right,left" ||
            !state.formVisible || !state.toolsVisible ||
            state.horizontalOverflow || state.toolOverflow) {
          throw new Error("Training/Tools layout invalid at " + viewport.width + "px")
        }
      }
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))

      await page.click(".menu-button")
      await page.waitForSelector(".nav-backdrop.is-open", { timeout: 10000 })
      stage = "menu initial focus"
      await page.waitForFunction(() => document.activeElement?.classList.contains("icon-button"), { timeout: 10000 })
      const mainInert = await page.$eval(".public-site main", el => el.hasAttribute("inert"))
      if (!mainInert) throw new Error("Conteúdo de fundo não recebeu inert")
      stage = "menu fits the mobile viewport"
      const mobileMenu = await page.evaluate(() => {
        const drawer = document.querySelector(".nav-drawer")
        const items = [...drawer.querySelectorAll("ol li button")]
        const last = items.at(-1)?.getBoundingClientRect()
        const container = drawer.getBoundingClientRect()
        return {
          count: items.length,
          groupLabels: drawer.querySelectorAll(".menu-group-label").length,
          footer: !!drawer.querySelector(".drawer-foot"),
          scrollHeight: drawer.scrollHeight,
          clientHeight: drawer.clientHeight,
          lastBottom: last?.bottom,
          containerBottom: container.bottom,
        }
      })
      console.log("P3_MENU_FIT_MOBILE " + JSON.stringify(mobileMenu))
      if (mobileMenu.count !== 8 || mobileMenu.groupLabels !== 0 || mobileMenu.footer ||
          mobileMenu.scrollHeight > mobileMenu.clientHeight + 2 ||
          mobileMenu.lastBottom > mobileMenu.containerBottom + 2) {
        throw new Error("Menu mobile não cabe na viewport: " + JSON.stringify(mobileMenu))
      }
      stage = "focus trap"
      await page.keyboard.down("Shift")
      await page.keyboard.press("Tab")
      await page.keyboard.up("Shift")
      const wrappedToLast = await page.evaluate(() => document.activeElement === document.querySelector(".nav-drawer ol li:last-child button"))
      if (!wrappedToLast) throw new Error("Focus trap: Shift+Tab não voltou ao último botão")
      await page.keyboard.press("Tab")
      const wrappedToFirst = await page.evaluate(() => document.activeElement?.classList.contains("icon-button"))
      if (!wrappedToFirst) throw new Error("Focus trap: Tab não voltou ao botão de fechamento")
      await page.keyboard.press("Escape")
      await page.waitForFunction(() => !document.querySelector(".nav-backdrop")?.classList.contains("is-open"), { timeout: 10000 })
      const focusRestored = await page.evaluate(() => document.activeElement?.classList.contains("menu-button"))
      if (!focusRestored) throw new Error("Foco não voltou ao botão de menu")
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
      const reducedMotion = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)
      if (!reducedMotion) throw new Error("Preferência de movimento reduzido não detectada")
      stage = "menu reopened after Escape"
      await page.click(".menu-button")
      await page.waitForSelector(".nav-backdrop.is-open", { timeout: 10000 })
      stage = "navigate to sobre"
      await page.click(".nav-drawer ol li:nth-child(2) button")
      await page.waitForFunction(() => location.hash === "#sobre", { timeout: 10000 })
      await page.click(".menu-button")
      await page.waitForSelector(".nav-backdrop.is-open", { timeout: 10000 })
      stage = "navigate to resultados"
      // The backdrop class changes before the drawer transform animation settles.
      // Wait until the actual target is onscreen to avoid intermittent click failures.
      await page.waitForFunction(() => {
        const target = document.querySelector(".nav-drawer ol li:nth-child(3) button")
        if (!target) return false
        const rect = target.getBoundingClientRect()
        return rect.left >= 0 && rect.right <= innerWidth && rect.width > 0
      }, { timeout: 10000 })
      await page.click(".nav-drawer ol li:nth-child(3) button")
      await page.waitForFunction(() => location.hash === "#resultados", { timeout: 10000 })
      stage = "history back"
      await page.evaluate(() => history.back())
      await page.waitForFunction(() => location.hash === "#sobre", { timeout: 10000 })
      stage = "history back focus"
      await page.waitForFunction(() => document.activeElement?.id === "sobre", { timeout: 10000 })
      console.log("P3_INTERACTION " + JSON.stringify({ menuEscape: true, focusRestored, mainInert, focusTrap: true, hashBack: true, reducedMotion, result: "PASS" }))
    } catch (error) {
      failures++
      console.log("P3_INTERACTION " + JSON.stringify({ result: "FAIL", stage, error: String(error).slice(0, 260) }))
    } finally {
      await page.close()
    }
  }

  // Menu height and content at the compact desktop screenshot viewport.
  {
    const page = await browser.newPage()
    try {
      await page.setViewport({ width: 1512, height: 691 })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      await page.click(".menu-button")
      await page.waitForSelector(".nav-backdrop.is-open", { timeout: 10000 })
      // A drawer with zero links while the CMS is loading is not evidence
      // that eight links no longer fit. Wait for populated navigation, then
      // perform the unchanged geometric assertions. A real read failure
      // still times out and fails this test.
      await page.waitForFunction(() =>
        document.querySelectorAll(".nav-drawer ol li button").length === 8,
        { timeout: 20000 })
      const info = await page.evaluate(() => {
        const drawer = document.querySelector(".nav-drawer")
        const buttons = [...drawer.querySelectorAll("ol li button")]
        const lastRect = buttons.at(-1)?.getBoundingClientRect()
        return {
          count: buttons.length,
          groupLabels: drawer.querySelectorAll(".menu-group-label").length,
          footer: !!drawer.querySelector(".drawer-foot"),
          scrollHeight: drawer.scrollHeight,
          clientHeight: drawer.clientHeight,
          lastBottom: lastRect?.bottom,
          viewportHeight: innerHeight,
        }
      })
      console.log("P3_MENU_FIT_DESKTOP " + JSON.stringify(info))
      if (info.count !== 8 || info.groupLabels !== 0 || info.footer ||
          info.scrollHeight > info.clientHeight + 2 ||
          info.lastBottom > info.viewportHeight + 2) {
        throw new Error("Menu desktop não cabe na viewport: " + JSON.stringify(info))
      }
      await page.screenshot({ path: path.join(shots, "p3-menu-1512x691.png"), fullPage: false })
    } catch (error) {
      failures++
      console.log("P3_MENU_FIT_DESKTOP " + JSON.stringify({ result: "FAIL", error: String(error).slice(0, 350) }))
    } finally {
      await page.close()
    }
  }

  // Cross-section selection: a card in section 01 opens its corresponding theme in section 03.
  {
    const page = await browser.newPage()
    let stage = "load"
    try {
      await page.setViewport({ width: 1440, height: 900 })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      stage = "click opening marketing card"
      await page.click("#perfil .area-grid .area-card-link:nth-child(4)")
      await page.waitForFunction(() => location.hash === "#resultados", { timeout: 10000 })
      stage = "assert selected topic"
      await page.waitForFunction(() => {
        const active = document.querySelector('#resultados .desktop-panel .results-theme-list button[aria-pressed="true"]')
        const text = document.querySelector("#resultados .desktop-panel .results-topic h3")
        return active?.textContent?.toLocaleLowerCase("pt-BR").includes("marketing") &&
          text?.textContent?.toLocaleLowerCase("pt-BR").includes("resultados que orientam decisões")
      }, { timeout: 10000 })
      stage = "switch topic"
      await page.click("#resultados .desktop-panel .results-theme-list button:nth-child(6)")
      await page.waitForFunction(() => {
        const title = document.querySelector("#resultados .desktop-panel .results-topic h3")
        const metrics = document.querySelectorAll("#resultados .desktop-panel .results-metrics-grid .content-item")
        return title?.textContent?.toLowerCase().includes("visão editorial") && metrics.length === 2
      }, { timeout: 10000 })
      stage = "restore overview"
      await page.click("#resultados .desktop-panel .results-theme-list button:first-child")
      await page.waitForFunction(() =>
        document.querySelectorAll("#resultados .desktop-panel .results-metrics-grid .result-metric-icon").length === 4,
        { timeout: 10000 },
      )
      console.log("P3_RESULTS_THEMES " + JSON.stringify({ fromHero: true, switchTheme: true, overviewIcons: 4, result: "PASS" }))
      await page.screenshot({ path: path.join(shots, "p3-results-overview-1440.png") })
    } catch (error) {
      failures++
      console.log("P3_RESULTS_THEMES " + JSON.stringify({ result: "FAIL", stage, error: String(error).slice(0, 350) }))
    } finally {
      await page.close()
    }
  }


  // Company experience stack: navigation stays pinned while the next employer covers the previous.
  {
    const page = await browser.newPage()
    let stage = "load"
    try {
      await page.setViewport({ width: 1440, height: 900 })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      stage = "sections and themes"
      const initial = await page.evaluate(() => ({
        stack: !!document.querySelector(".experience-stack"),
        cards: document.querySelectorAll(".experience-stack .experience-card").length,
        tabs: document.querySelectorAll(".experience-index a").length,
        formationInk: getComputedStyle(document.querySelector("#formacao")).backgroundColor,
        gallery: document.querySelectorAll(".experience-gallery").length,
      }))
      if (!initial.stack || initial.cards !== 6 || initial.tabs !== 6 || initial.gallery < 6)
        throw new Error("Estrutura das seis empresas incompleta: " + JSON.stringify(initial))
      stage = "sticky navigation"
      await page.$eval("#prefeitura-sp", (node) => node.scrollIntoView({ behavior: "instant", block: "start" }))
      await page.waitForFunction(() => {
        const bar = document.querySelector(".experience-index")?.getBoundingClientRect()
        const panel = document.querySelector("#prefeitura-sp")?.getBoundingClientRect()
        const header = document.querySelector(".site-header")?.getBoundingClientRect()
        return !!bar && !!panel && !!header && Math.abs(bar.top - header.bottom) <= 3 && panel.top <= 3
      }, { timeout: 10000 })
      stage = "slide controls"
      const before = await page.evaluate(() => {
        const btn = document.querySelector("#prefeitura-sp .desktop-panel .experience-gallery-controls button:last-child")
        const counter = document.querySelector("#prefeitura-sp .desktop-panel .experience-gallery-controls > span")
        const rect = btn?.getBoundingClientRect()
        return { counter: counter?.textContent, rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
          covering: rect ? document.elementFromPoint(rect.x + rect.width/2, rect.y + rect.height/2)?.closest(".experience-card")?.id : null }
      })
      await page.click("#prefeitura-sp .desktop-panel .experience-gallery-controls button:last-child")
      const after = await page.$eval("#prefeitura-sp .desktop-panel .experience-gallery-controls > span", (node) => node.textContent)
      console.log("P3_EXPERIENCE_SLIDE_CLICK " + JSON.stringify({ before, after }))
      await page.waitForFunction(() =>
        document.querySelector("#prefeitura-sp .desktop-panel .experience-gallery-controls > span")?.textContent?.includes("2 / 3"),
        { timeout: 10000 },
      )
      console.log("P3_EXPERIENCE_STACK " + JSON.stringify({ companies: 6, fixedSelector: true, galleryNavigation: true, result: "PASS" }))
      await page.screenshot({ path: path.join(shots, "p3-experience-stack-1440.png") })
    } catch (error) {
      failures++
      console.log("P3_EXPERIENCE_STACK " + JSON.stringify({ result: "FAIL", stage, error: String(error).slice(0, 350) }))
    } finally {
      await page.close()
    }
  }

  // Approved employer and introduction first folds at native 100% zoom.
  {
    const page = await browser.newPage()
    try {
      await page.setViewport({ width: 1512, height: 691 })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      await page.waitForSelector("#invest-rs .desktop-panel .experience-project", { timeout: 10000 })
      const composition = await page.evaluate(() => {
        const about = document.querySelector("#sobre .about-portrait")
        const portrait = about?.querySelector("img")
        const projects = document.querySelector("#invest-rs .desktop-panel .experience-projects")
        const logo = document.querySelector("#invest-rs .experience-heading > .company-mark")
        const navigationLogo = document.querySelector(".experience-index .company-mark-small")
        return {
          aboutBottom: about?.getBoundingClientRect().bottom ?? null,
          portraitBottom: portrait?.getBoundingClientRect().bottom ?? null,
          count: projects?.querySelectorAll(".experience-project").length ?? 0,
          competenceBadges: document.querySelectorAll("#invest-rs .desktop-panel .experience-competencies li").length,
          trajectoryButton: Boolean(projects?.querySelector(".experience-view-trajectory")),
          listHeight: projects?.clientHeight ?? 0,
          listScrollHeight: projects?.scrollHeight ?? 0,
          headingLogoBorder: logo ? getComputedStyle(logo).borderTopWidth : null,
          indexLogoBorder: navigationLogo ? getComputedStyle(navigationLogo).borderTopWidth : null,
        }
      })
      console.log("P3_ABOUT_INVEST_FIT " + JSON.stringify(composition))
      const fits = composition.aboutBottom !== null &&
        composition.portraitBottom !== null &&
        Math.abs(composition.portraitBottom - composition.aboutBottom) <= 2 &&
        // The current published Invest RS has six competencies approved in CMS.
        composition.count === 4 &&
        composition.competenceBadges === 6 &&
        composition.trajectoryButton &&
        // The four published projects may scroll inside their existing bounded column.
        composition.listHeight > 0 && composition.listScrollHeight >= composition.listHeight &&
        composition.headingLogoBorder === "0px" &&
        composition.indexLogoBorder !== null &&
        composition.indexLogoBorder === "0px"
      if (!fits) {
        failures++
        console.log("P3_ABOUT_INVEST_FIT_REGRESSION " + JSON.stringify(composition))
      }
      // Six experience sections must expose owner-approved, CMS-editable competencies.
      const competenciesAndCdi = await page.evaluate(() => {
        const slugs = ["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"]
        const badges = Object.fromEntries(
          slugs.map((slug) => [slug, document.querySelectorAll(`#${slug} .desktop-panel .experience-competencies li`).length]),
        )
        const src = document.querySelector("#cdi .desktop-panel .experience-media-frame img")?.getAttribute("src") ?? ""
        const projects = document.querySelector("#invest-rs .desktop-panel .experience-view-projects")
        const trajectory = document.querySelector("#invest-rs .desktop-panel .experience-view-trajectory")
        const p = projects ? getComputedStyle(projects) : null
        const t = trajectory ? getComputedStyle(trajectory) : null
        return {
          badges,
          cdiTextFree: src.includes("/2026-10-31-cdi-no-text/"),
          sameFont: Boolean(p && t && p.fontFamily === t.fontFamily),
          uppercase: p?.textTransform === "uppercase" && t?.textTransform === "uppercase",
          projectsLargerInitially: Boolean(p && t && parseFloat(p.fontSize) > parseFloat(t.fontSize)),
        }
      })
      if (
        Object.entries(competenciesAndCdi.badges).some(
          ([slug, count]) => count !== (slug === "invest-rs" ? 6 : 5),
        ) ||
        !competenciesAndCdi.cdiTextFree ||
        !competenciesAndCdi.sameFont ||
        !competenciesAndCdi.uppercase ||
        !competenciesAndCdi.projectsLargerInitially
      ) {
        failures++
        console.log("P3_CMS_COMPETENCIES_MEDIA_REGRESSION " + JSON.stringify(competenciesAndCdi))
      } else {
        console.log("P3_CMS_COMPETENCIES_MEDIA " + JSON.stringify({ result: "PASS", ...competenciesAndCdi }))
      }
      // New owner-approved exclusive switch must hide projects when the full career is shown.
      await page.waitForSelector(
        "#invest-rs .desktop-panel .experience-view-trajectory:not([disabled])",
        { timeout: 10000 },
      )
      await page.click("#invest-rs .desktop-panel .experience-view-trajectory")
      await new Promise((resolve) => setTimeout(resolve, 300))
      const trajectoryState = await page.evaluate(() => ({
        projectsFont: getComputedStyle(document.querySelector("#invest-rs .desktop-panel .experience-view-projects")).fontSize,
        trajectoryFont: getComputedStyle(document.querySelector("#invest-rs .desktop-panel .experience-view-trajectory")).fontSize,
        projects: document.querySelectorAll("#invest-rs .desktop-panel .experience-project").length,
        paragraphs: document.querySelectorAll("#invest-rs .desktop-panel .experience-full-body p").length,
        hasText: Boolean(document.querySelector("#invest-rs .desktop-panel .experience-full-body")?.textContent?.trim()),
        selected: document.querySelector("#invest-rs .desktop-panel .experience-view-trajectory")?.getAttribute("aria-pressed"),
      }))
      await page.click("#invest-rs .desktop-panel .experience-view-projects")
      const projectsRestored = await page.evaluate(() => ({
        projects: document.querySelectorAll("#invest-rs .desktop-panel .experience-project").length,
        selected: document.querySelector("#invest-rs .desktop-panel .experience-view-projects")?.getAttribute("aria-pressed"),
      }))
      if (
        trajectoryState.projects !== 0 ||
        trajectoryState.paragraphs < 2 ||
        !trajectoryState.hasText ||
        trajectoryState.selected !== "true" ||
        parseFloat(trajectoryState.trajectoryFont) <= parseFloat(trajectoryState.projectsFont) ||
        projectsRestored.projects !== 4 ||
        projectsRestored.selected !== "true"
      ) {
        failures++
        console.log("P3_EXPERIENCE_SWITCH_REGRESSION " + JSON.stringify({ trajectoryState, projectsRestored }))
      } else {
        console.log("P3_EXPERIENCE_SWITCH " + JSON.stringify({ result: "PASS", trajectoryState, projectsRestored }))
      }
      const secondProject = "#invest-rs .desktop-panel .experience-project-choice[aria-label='Exibir imagem de Organização de eventos']"
      // Bring the selected company into the foreground before interacting with its
      // project controls; later sticky company cards can otherwise cover the click target.
      await page.evaluate(() =>
        document.getElementById("invest-rs")?.scrollIntoView({ behavior: "instant", block: "start" }),
      )
      await page.focus(secondProject)
      await page.keyboard.press("Enter")
      await page.waitForFunction(() =>
        document.querySelector("#invest-rs .desktop-panel .experience-gallery-footer h3")?.textContent?.trim()?.toLocaleLowerCase("pt-BR") === "organização de eventos",
        { timeout: 10000 },
      )
      const projectToGallery = await page.evaluate(() => ({
        activeProject: document.querySelector("#invest-rs .desktop-panel .experience-project.is-active .experience-project-heading")?.textContent?.trim(),
        galleryTitle: document.querySelector("#invest-rs .desktop-panel .experience-gallery-footer h3")?.textContent?.trim(),
        count: document.querySelector("#invest-rs .desktop-panel .experience-gallery-controls [aria-live]")?.textContent?.trim(),
      }))
      await page.focus("#invest-rs .desktop-panel .experience-gallery-controls button[aria-label^='Próxima foto']")
      await page.keyboard.press("Enter")
      await page.waitForFunction(() =>
        document.querySelector("#invest-rs .desktop-panel .experience-gallery-footer h3")?.textContent?.trim()?.toLocaleLowerCase("pt-BR") === "plataforma de eventos e relacionamento",
        { timeout: 10000 },
      )
      const galleryToProject = await page.evaluate(() => ({
        activeProject: document.querySelector("#invest-rs .desktop-panel .experience-project.is-active .experience-project-heading")?.textContent?.trim(),
        galleryTitle: document.querySelector("#invest-rs .desktop-panel .experience-gallery-footer h3")?.textContent?.trim(),
      }))
      if (
        projectToGallery.activeProject !== "ORGANIZAÇÃO DE EVENTOS" &&
        projectToGallery.activeProject !== "Organização de eventos"
      ) {
        failures++
        console.log("P3_PROJECT_GALLERY_REGRESSION " + JSON.stringify({ projectToGallery, galleryToProject }))
      } else if (
        projectToGallery.galleryTitle?.toLocaleLowerCase("pt-BR") !== "organização de eventos" ||
        projectToGallery.count !== "2 / 4" ||
        galleryToProject.activeProject?.toLocaleLowerCase("pt-BR") !== "plataforma de eventos e relacionamento" ||
        galleryToProject.galleryTitle?.toLocaleLowerCase("pt-BR") !== "plataforma de eventos e relacionamento"
      ) {
        failures++
        console.log("P3_PROJECT_GALLERY_REGRESSION " + JSON.stringify({ projectToGallery, galleryToProject }))
      } else {
        console.log("P3_PROJECT_GALLERY_LINK " + JSON.stringify({ result: "PASS", projectToGallery, galleryToProject }))
      }
      const refinements = await page.evaluate(() => {
        const section = document.querySelector("#contato")
        const photo = section?.querySelector(".contact-portrait")
        const image = photo?.querySelector("img")
        const border = section?.querySelector(".contact-footer")
        const cards = Array.from(document.querySelectorAll("#depoimentos .testimonial-card"))
        return {
          contactSectionBottom: section?.getBoundingClientRect().bottom ?? null,
          contactPhotoBottom: photo?.getBoundingClientRect().bottom ?? null,
          contactImageBottom: image?.getBoundingClientRect().bottom ?? null,
          contactLineTop: border?.getBoundingClientRect().top ?? null,
          testimonialCount: cards.length,
          tallestCard: cards.length ? Math.max(...cards.map((card) => card.getBoundingClientRect().height)) : null,
          testimonialOverflow: cards.some((card) => card.scrollHeight > card.clientHeight + 2),
        }
      })
      console.log("P3_EDITORIAL_REFINEMENTS " + JSON.stringify(refinements))
      // New owner request (05/11): the portrait ends at the section's bottom,
      // while the footer divider keeps its separate position above the photo edge.
      const contactAligned = refinements.contactSectionBottom !== null &&
        refinements.contactPhotoBottom !== null &&
        refinements.contactImageBottom !== null &&
        refinements.contactLineTop !== null &&
        Math.abs(refinements.contactPhotoBottom - refinements.contactSectionBottom) <= 2 &&
        refinements.contactImageBottom >= refinements.contactSectionBottom - 2 &&
        refinements.contactLineTop < refinements.contactSectionBottom - 12
      // Owner-approved editorial revision (31/10): exactly three real testimonials stay published.
      const cardsCompact = refinements.testimonialCount === 3 &&
        refinements.tallestCard !== null &&
        refinements.tallestCard < 280 &&
        !refinements.testimonialOverflow
      if (!contactAligned || !cardsCompact) {
        failures++
        console.log("P3_EDITORIAL_REFINEMENTS_REGRESSION " + JSON.stringify(refinements))
      }
      await page.screenshot({ path: path.join(shots, "p3-about-invest-1512.png"), fullPage: false })
    } catch (error) {
      failures++
      console.log("P3_ABOUT_INVEST_FIT " + JSON.stringify({ result: "FAIL", error: String(error).slice(0, 500) }))
    } finally {
      await page.close()
    }
  }

  const viewports = [
    [1920, 1080],
    [1757, 832], // Desktop reference at native 100%, matching the owner's screenshot width.
    [1512, 691], // Owner's 100% desktop-zoom reference; editorial density contract.
    [1440, 900],
    [1200, 800], // Wide-layout boundary; must not depend on CSS zoom.
    [1101, 800],
    [1100, 800],
    [1366, 768],
    [768, 1024],
    [720, 450], // CSS viewport equivalent to a 1440px screen at ~200% zoom; not native zoom
    [390, 844],
    [360, 800],
    [320, 700],
  ]
  for (const [width, height] of viewports) {
    const page = await browser.newPage()
    try {
      await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      await page.waitForSelector("section.portfolio-section", { timeout: 15000 })
      const findings = await page.evaluate((requestedWidth) => {
        const portrait = document.querySelector(".profile-portrait img, .mobile-profile-hero img, .mobile360-photo img")
        const desktop = document.querySelector(".desktop-panel")
        const mobile = document.querySelector(".mobile-panels")
        return {
          sectionCount: document.querySelectorAll("section.portfolio-section").length,
          mobilePanelCount: document.querySelectorAll(".mobile-panel").length,
          viewportWidth: window.innerWidth,
          layoutViewportWidth: document.documentElement.clientWidth,
          visualViewportWidth: window.visualViewport?.width ?? null,
          requestedWidth,
          // Global CSS zoom changes size again after browser zoom; forbid it.
          siteZoom: getComputedStyle(document.querySelector(".public-site")).zoom,
          siteTransform: getComputedStyle(document.querySelector(".public-site")).transform,
          nameLockupWidth: Math.round(document.querySelector(".name-lockup")?.getBoundingClientRect().width ?? 0),
          nameLockupFontSize: document.querySelector(".name-lockup")
            ? parseFloat(getComputedStyle(document.querySelector(".name-lockup")).fontSize)
            : null,
          documentWidth: document.documentElement.scrollWidth,
          overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          desktopDisplay: desktop ? getComputedStyle(desktop).display : null,
          mobileDisplay: mobile ? getComputedStyle(mobile).display : null,
          headerWidth: document.querySelector(".site-header")?.getBoundingClientRect().width ?? null,
          menuRight: document.querySelector(".menu-button")?.getBoundingClientRect().right ?? null,
          brandRight: document.querySelector(".brand-button")?.getBoundingClientRect().right ?? null,
          documentScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          overflowCandidates: Array.from(document.querySelectorAll(".public-site main *"))
            .filter((el) => el.clientWidth > 0 && getComputedStyle(el).display !== "none")
            .map((el) => {
              const rect = el.getBoundingClientRect()
              return { el, right: Math.round(rect.left + el.scrollWidth), actualRight: Math.round(rect.right) }
            })
            .filter(({ right }) => right > requestedWidth + 2)
            .sort((a, b) => b.right - a.right)
            .slice(0, 12)
            .map(({ el, right, actualRight }) => ({
              tag: el.tagName,
              className: String(el.className).slice(0, 70),
              right, actualRight,
              width: el.clientWidth,
              scroll: el.scrollWidth,
            })),
          rootScrollWidth: document.getElementById("root")?.scrollWidth ?? null,
          publicSiteScrollWidth: document.querySelector(".public-site")?.scrollWidth ?? null,
          mobileName: Array.from(document.querySelectorAll(".mobile-name, .mobile-name span, .mobile360-person-name, .mobile360-person-name span, .mobile360-person-name strong")).slice(0, 3).map((el) => ({ tag: el.tagName, text: el.textContent?.slice(0, 28), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, right: Math.round(el.getBoundingClientRect().right) })),
          headerControls: Array.from(document.querySelectorAll(".site-header > *")).map((el) => ({ tag: el.tagName, className: String(el.className), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, right: Math.round(el.getBoundingClientRect().right) })),
          overflownContainers: Array.from(document.querySelectorAll(".public-site *"))
            .filter((el) => el.scrollWidth > el.clientWidth + 3 && el.clientWidth > 0 && getComputedStyle(el).display !== "none")
            .slice(0, 20)
            .map((el) => ({ tag: el.tagName, className: String(el.className).slice(0, 45), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, cssOverflow: getComputedStyle(el).overflow, right: Math.round(el.getBoundingClientRect().right) })),
          portraitComplete: portrait?.complete ?? null,
          portraitNaturalWidth: portrait?.naturalWidth ?? null,
          appError: document.querySelector(".data-error")?.textContent?.slice(0, 140) ?? null,
          widestElements: Array.from(document.querySelectorAll(".public-site main *"))
            .map((element) => ({ element, rect: element.getBoundingClientRect() }))
            .filter(({ rect }) => rect.width > 0 && rect.right > requestedWidth + 2)
            .sort((a, b) => b.rect.right - a.rect.right)
            .slice(0, 8)
            .map(({ element, rect }) => ({
              tag: element.tagName.toLowerCase(),
              className: String(element.className).slice(0, 100),
              text: element.textContent?.trim().slice(0, 45) ?? "",
              right: Math.round(rect.right),
              left: Math.round(rect.left),
            })),
        }
      }, width)
      if (width === 1512 && height === 691) {
        const density = await page.evaluate(() => {
          const rect = (sel) => {
            const r = document.querySelector(sel)?.getBoundingClientRect()
            return r ? { top: Math.round(r.top), bottom: Math.round(r.bottom),
              left: Math.round(r.left), right: Math.round(r.right) } : null
          }
          const heading = document.querySelector(".name-lockup")
          const computedFont = (selector) => {
            const el = document.querySelector(selector)
            return el ? Number.parseFloat(getComputedStyle(el).fontSize) : null
          }
          const badge = rect(".profile-portrait .badge-360")
          const yearsCopy = rect(".years span")
          const overlap = badge && yearsCopy
            ? Math.max(0, Math.min(badge.bottom, yearsCopy.bottom) - Math.max(badge.top, yearsCopy.top)) *
              Math.max(0, Math.min(badge.right, yearsCopy.right) - Math.max(badge.left, yearsCopy.left))
            : null
          return {
            headerHeight: rect(".site-header")?.bottom ?? null,
            nameTop: rect(".name-lockup")?.top ?? null,
            nameFontPx: heading ? Math.round(parseFloat(getComputedStyle(heading).fontSize)) : null,
            introFontPx: computedFont(".profile-intro"),
            highlightTextFontPx: computedFont(".profile-highlights .content-item p"),
            careerTextFontPx: computedFont(".career-grid .content-item p"),
            cardLabelFontPx: computedFont(".area-grid .item-label"),
            cardsTop: rect(".area-grid")?.top ?? null,
            cardsBottom: rect(".area-grid")?.bottom ?? null,
            finalHighlightBottom: document.querySelector(".profile-highlights .content-item:last-child")?.getBoundingClientRect().bottom ?? null,
            badgeYearsOverlapPx2: overlap,
          }
        })
        console.log("P3_DESKTOP_DENSITY " + JSON.stringify(density))
        const compact = density.headerHeight !== null && density.headerHeight <= 59 &&
          density.nameTop !== null && density.nameTop < 80 &&
          density.nameFontPx >= 73 && density.nameFontPx <= 90 &&
          density.cardsTop !== null && density.cardsTop >= 175 && density.cardsTop <= 215 &&
          density.cardsBottom !== null && density.cardsBottom <= 320 &&
          density.finalHighlightBottom !== null && density.finalHighlightBottom <= height + 3 &&
          density.introFontPx !== null && density.introFontPx >= 12 &&
          density.highlightTextFontPx !== null && density.highlightTextFontPx >= 11.5 &&
          density.careerTextFontPx !== null && density.careerTextFontPx >= 11.5 &&
          density.cardLabelFontPx !== null && density.cardLabelFontPx >= 9.7 &&
          density.badgeYearsOverlapPx2 !== null && density.badgeYearsOverlapPx2 < 200
        if (!compact) {
          failures++
          console.log("P3_DESKTOP_DENSITY_REGRESSION " + JSON.stringify({ result: "FAIL", density }))
        }
      }
      await page.screenshot({ path: path.join(shots, `p3-${width}x${height}.png`), fullPage: false })
      console.log("P3_VIEWPORT " + JSON.stringify({ width, height, ...findings }))
      const nativeScale = Math.abs(Number(findings.siteZoom || 1) - 1) < 0.001 &&
        findings.siteTransform === "none"
      if (!nativeScale) {
        console.log("P3_DESKTOP_ZOOM_REGRESSION " + JSON.stringify({
          width, siteZoom: findings.siteZoom, siteTransform: findings.siteTransform, result: "FAIL",
        }))
      }
      // The mobile employer selector mounts one active company (two panels).
      // Desktop still mounts all six; only the inactive responsive tree is omitted.
      const responsivePanels = findings.mobilePanelCount === (width < 768 ? 15 : 0) &&
        (width < 768 ? findings.desktopDisplay === null : findings.mobileDisplay === null)
      if (!responsivePanels) {
        console.log("P3_RESPONSIVE_DOM_REGRESSION " + JSON.stringify({
          width, mobilePanelCount: findings.mobilePanelCount,
          desktopDisplay: findings.desktopDisplay, mobileDisplay: findings.mobileDisplay,
          result: "FAIL",
        }))
      }
      if (findings.sectionCount !== (width < 768 ? 8 : 13) || !responsivePanels ||
          findings.documentWidth > width + 2 || !nativeScale) failures++
    } catch (error) {
      failures++
      console.log("P3_VIEWPORT_ERROR " + JSON.stringify({ width, height, error: String(error).slice(0, 250) }))
    } finally {
      await page.close()
    }
  }

  // Mobile owner screenshots: verify parity, no repeated titles or oversized boxes.
  for (const width of [360, 390, 430]) {
    const page = await browser.newPage()
    try {
      await page.setViewport({ width, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 45000 })
      await page.waitForSelector("#contato-a .contact-mobile-photo img", { timeout: 15000 })
      const details = await page.evaluate(() => {
        const getRect = (selector) => {
          const r = document.querySelector(selector)?.getBoundingClientRect()
          return r ? { left: r.left, right: r.right, top: r.top, bottom: r.bottom, height: r.height } : null
        }
        const name = document.querySelector("#perfil-a .mobile-name, #perfil-a .mobile360-person-name")
        const spans = [...(name?.querySelectorAll("span, strong") ?? [])].map((el) => {
          const r = el.getBoundingClientRect()
          return { left: r.left, right: r.right }
        })
        const firstCard = document.querySelector("#depoimentos .testimonial-card")
        const portrait = getRect("#contato-a .contact-mobile-photo img")
        const contact = getRect("#contato-a")
        const headingFonts = ["#formacao-a .panel-heading h2", "#ferramentas-a .panel-heading h2", "#depoimentos-a .panel-heading h2"]
          .map((sel) => {
            const el = document.querySelector(sel)
            return el ? parseFloat(getComputedStyle(el).fontSize) : null
          })
        return {
          viewportWidth: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          name: getRect("#perfil-a .mobile-name, #perfil-a .mobile360-person-name"),
          nameWords: spans,
          aboutHeight: getRect("#sobre-a")?.height,
          formationHeadings: document.querySelectorAll("#formacao .panel-heading h2").length,
          toolsHeadings: document.querySelectorAll("#ferramentas .panel-heading h2").length,
          formationCounts: [document.querySelectorAll("#formacao-a .mobile-items .content-item").length, document.querySelectorAll("#formacao-b .mobile-items .content-item").length],
          toolsCounts: [document.querySelectorAll("#ferramentas-a .mobile-items .content-item").length, document.querySelectorAll("#ferramentas-b .mobile-items .content-item").length],
          testimonialCount: document.querySelectorAll("#depoimentos .testimonial-card").length,
          firstTestimonialHeight: firstCard?.getBoundingClientRect().height,
          headingFonts,
          portrait,
          contact,
        }
      })
      const { name, nameWords, portrait, contact, headingFonts } = details
      const valid =
        details.scrollWidth <= width + 2 &&
        !!name && name.left >= -2 && name.right <= width + 2 &&
        nameWords.length === 2 && nameWords.every(({ left, right }) => left >= -2 && right <= width + 2) &&
        details.formationHeadings === 1 && details.toolsHeadings === 1 &&
        details.formationCounts.join(",") === "3,2" &&
        details.toolsCounts.join(",") === "3,2" &&
        details.testimonialCount === 3 &&
        details.firstTestimonialHeight > 0 && details.firstTestimonialHeight < 290 &&
        !!portrait && portrait.height >= Math.min(280, details.viewportWidth * .65) &&
        !!contact && Math.abs(portrait.bottom - contact.bottom) < 4 &&
        headingFonts.every((n) => n !== null && Math.abs(n - headingFonts[0]) < 1)
      if (!valid) {
        failures++
        console.log("P3_MOBILE_EDITORIAL_PARITY_REGRESSION " + JSON.stringify({ width, details }))
      } else {
        console.log("P3_MOBILE_EDITORIAL_PARITY " + JSON.stringify({ width, result: "PASS", details }))
      }
      if (width === 390) {
        await page.$eval("#depoimentos .testimonial-card", (node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
        const before = await page.$eval("#depoimentos .testimonial-card", (node) => node.getBoundingClientRect().height)
        await page.click("#depoimentos .testimonial-card")
        const expanded = await page.$eval("#depoimentos .testimonial-card", (node) => ({
          expanded: node.getAttribute("aria-expanded"),
          height: node.getBoundingClientRect().height,
        }))
        if (expanded.expanded !== "true" || expanded.height < before) {
          failures++
          console.log("P3_MOBILE_TESTIMONIAL_EXPAND_REGRESSION " + JSON.stringify({ before, expanded }))
        } else {
          console.log("P3_MOBILE_TESTIMONIAL_EXPAND " + JSON.stringify({ result: "PASS", before, expanded }))
        }
      }
    } catch (error) {
      failures++
      console.log("P3_MOBILE_EDITORIAL_PARITY_ERROR " + JSON.stringify({ width, error: String(error).slice(0, 400) }))
    } finally {
      await page.close()
    }
  }

} finally {
  await browser.close()
}
console.log("P3_BROWSER_AUDIT " + JSON.stringify({ failures }))
if (failures > 0) process.exitCode = 1
