import puppeteer from "puppeteer-core"

// All failures are injected inside Chromium on GET requests, without writes.
const scenarios = [
  { endpoint: "section_panels", expectedSections: 1, errorNotice: true },
  { endpoint: "testimonials", expectedSections: 8, errorNotice: true, preservePortraits: true },
  { endpoint: "design_tokens", expectedSections: 8, errorNotice: false },
  { endpoint: "pages", expectedSections: 8, errorNotice: false },
]
const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
try {
  for (const scenario of scenarios) {
    const { endpoint, expectedSections, errorNotice, preservePortraits = false } = scenario
    const page = await browser.newPage()
    let failuresInjected = 0
    let supabaseReadsObserved = 0
    let documentRequestsObserved = 0
    let requestInterceptionErrors = 0
    const pageErrors = []
    const failedRequests = []
    try {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.setBypassServiceWorker(true)
      await page.setCacheEnabled(false)
      page.on("pageerror", (error) => {
        pageErrors.push(String(error?.message || error).slice(0, 240))
      })
      page.on("requestfailed", (request) => {
        const url = new URL(request.url())
        failedRequests.push({
          type: request.resourceType(),
          host: url.hostname,
          path: url.pathname,
          reason: request.failure()?.errorText || "unknown",
        })
      })
      await page.setRequestInterception(true)
      page.on("request", async (request) => {
        const url = new URL(request.url())
        if (request.resourceType() === "document") documentRequestsObserved++
        if (request.method() === "GET" && url.hostname.endsWith(".supabase.co")) {
          supabaseReadsObserved++
        }
        try {
          if (
            request.method() === "GET" &&
            url.hostname.endsWith(".supabase.co") &&
            url.pathname === "/rest/v1/" + endpoint
          ) {
            failuresInjected++
            await request.respond({
              status: 503,
              contentType: "application/json",
              headers: { "access-control-allow-origin": "*" },
              body: JSON.stringify({ message: "P4 simulated read failure" }),
            })
          } else {
            await request.continue()
          }
        } catch {
          requestInterceptionErrors++
        }
      })
      // A unique URL plus disabled cache/service workers prevents a preceding
      // browser audit from satisfying this fault-injection probe from cache.
      // DOM readiness plus the field assertions below remain the contract.
      const probeUrl = "https://tulius.work/?p4FailureProbe=" +
        encodeURIComponent(endpoint + "-" + Date.now())
      await page.goto(probeUrl, { waitUntil: "load", timeout: 45000 })
      // When production returned no application bootstrap at all, retry a
      // single navigation. Do not suppress failed injected requests or DOM
      // contract mismatches: only retry a zero-Supabase-request blank page.
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          await page.waitForFunction(
            ({ expectedSections, errorNotice }) =>
              document.querySelectorAll("section.portfolio-section").length === expectedSections &&
              Boolean(document.querySelector(".public-site .data-error")) === errorNotice &&
              (() => {
                const portrait = document.querySelector(
                  "#perfil-a .mobile-profile-hero img, #perfil-a .mobile360-photo img",
                )
                return Boolean(portrait?.complete && portrait.naturalWidth > 0)
              })(),
            { timeout: 22000 },
            { expectedSections, errorNotice },
          )
          break
        } catch (error) {
          const observed = await page.evaluate(() => ({
            readyState: document.readyState,
            title: document.title,
            bodyChildren: document.body?.children.length || 0,
            rootChildren: document.querySelector("#root")?.children.length || 0,
            sectionCount: document.querySelectorAll("section.portfolio-section").length,
            dataError: Boolean(document.querySelector(".public-site .data-error")),
            profileImagePresent: Boolean(document.querySelector("#perfil-a .mobile-profile-hero img, #perfil-a .mobile360-photo img")),
          }))
          if (attempt === 1 && failuresInjected === 0 && observed.sectionCount === 0) {
            console.log("P4_PUBLIC_BOOTSTRAP_RETRY " +
              JSON.stringify({ endpoint, attempt, reason: "no_injected_request_and_no_sections" }))
            await page.reload({ waitUntil: "load", timeout: 45000 })
            continue
          }
          throw new Error("P4 recovery wait did not satisfy its contract: " +
            JSON.stringify({
              endpoint,
              expectedSections,
              errorNotice,
              failuresInjected,
              supabaseReadsObserved,
              documentRequestsObserved,
              requestInterceptionErrors,
              pageErrors,
              failedRequests: failedRequests.slice(0, 8),
              observed,
            }) +
            "; cause=" + error.message)
        }
      }
      // Some public reads (notably SEO pages) start after the primary UI is
      // already ready. Require the selected request to be observed and
      // intercepted before evaluating a same-UI fallback scenario.
      const injectionDeadline = Date.now() + 10000
      while (failuresInjected === 0 && Date.now() < injectionDeadline) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      const result = await page.evaluate(() => ({
        sections: document.querySelectorAll("section.portfolio-section").length,
        profileVisible: Boolean(document.querySelector("section#perfil")),
        errorNotice: Boolean(document.querySelector(".public-site .data-error")),
        portraitLoaded: (() => {
          const image = document.querySelector("#perfil-a .mobile-profile-hero img, #perfil-a .mobile360-photo img")
          return Boolean(image && image.complete && image.naturalWidth > 0)
        })(),
        testimonials: document.querySelectorAll("#depoimentos .testimonial-card").length,
        savedPortraits: [...document.querySelectorAll("#depoimentos .testimonial-person img")]
          .filter((image) => image.getAttribute("src")?.startsWith("/media/")).length,
      }))
      if (
        !failuresInjected || result.sections !== expectedSections ||
        !result.profileVisible || result.errorNotice !== errorNotice ||
        !result.portraitLoaded ||
        (preservePortraits && (result.testimonials !== 3 || result.savedPortraits !== 3))
      ) {
        throw new Error("P4 recovery contract failed: " + JSON.stringify({
          scenario,
          failuresInjected,
          supabaseReadsObserved,
          documentRequestsObserved,
          requestInterceptionErrors,
          pageErrors,
          failedRequests: failedRequests.slice(0, 8),
          result,
        }))
      }
      console.log("P4_PUBLIC_PARTIAL_FAILURE " + JSON.stringify({
        endpoint, result: "PASS", injected: failuresInjected, ...result, mutations: 0,
      }))
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
