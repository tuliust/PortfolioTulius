import puppeteer from "puppeteer-core"

// Read-only fault injection. Only GET responses are replaced inside Chromium.
// No production SQL, Auth, Storage or CMS writes are performed.
const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
try {
  for (const endpoint of ["section_panels", "testimonials"]) {
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
      await page.waitForFunction((source) => {
        const count = document.querySelectorAll("section.portfolio-section").length
        return !!document.querySelector(".public-site .data-error") &&
          !!document.querySelector("section#perfil") &&
          !!document.querySelector("#perfil-a .mobile-profile-hero img") &&
          (source === "testimonials" ? count === 13 : count >= 1)
      }, { timeout: 20000 }, endpoint)
      const result = await page.evaluate(() => ({
        sections: document.querySelectorAll("section.portfolio-section").length,
        profileVisible: !!document.querySelector("section#perfil"),
        errorNotice: !!document.querySelector(".public-site .data-error"),
        portraitLoaded: (() => {
          const image = document.querySelector("#perfil-a .mobile-profile-hero img")
          return !!image && image.complete && image.naturalWidth > 0
        })(),
        testimonials: document.querySelectorAll("#depoimentos .testimonial-card").length,
        savedPortraits: [...document.querySelectorAll("#depoimentos .testimonial-person img")]
          .filter((img) => img.getAttribute("src")?.startsWith("/media/")).length,
      }))
      if (!failuresInjected || !result.profileVisible || !result.errorNotice ||
          !result.portraitLoaded || (endpoint === "testimonials" &&
            (result.sections !== 13 || result.testimonials !== 3 || result.savedPortraits !== 3))) {
        throw new Error("Recovery contract failed: " + JSON.stringify({ endpoint, failuresInjected, result }))
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
