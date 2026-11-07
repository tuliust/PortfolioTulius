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
    try {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.setRequestInterception(true)
      page.on("request", (request) => {
        const url = new URL(request.url())
        if (
          request.method() === "GET" &&
          url.hostname.endsWith(".supabase.co") &&
          url.pathname === "/rest/v1/" + endpoint
        ) {
          failuresInjected++
          void request.respond({
            status: 503,
            contentType: "application/json",
            headers: { "access-control-allow-origin": "*" },
            body: JSON.stringify({ message: "P4 simulated read failure" }),
          })
        } else {
          void request.continue()
        }
      })
      await page.goto("https://tulius.work/", { waitUntil: "networkidle2", timeout: 45000 })
      await page.waitForFunction(
        ({ expectedSections, errorNotice }) =>
          document.querySelectorAll("section.portfolio-section").length === expectedSections &&
          Boolean(document.querySelector(".public-site .data-error")) === errorNotice &&
          Boolean(document.querySelector("#perfil-a .mobile-profile-hero img, #perfil-a .mobile360-photo img")),
        { timeout: 22000 },
        { expectedSections, errorNotice },
      )
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
        throw new Error("P4 recovery contract failed: " + JSON.stringify({ scenario, failuresInjected, result }))
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
