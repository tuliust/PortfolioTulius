import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

// Owner-approved mobile LCP target: median of three Lighthouse lab samples <= 3.5s
// (02/11/2026). Keep strict accessibility/SEO checks across all samples.
// Lighthouse simulated results do not replace field Core Web Vitals.
const directory = process.argv[2]
if (!directory) throw new Error("Usage: node p6-lighthouse-guard.mjs <reports-directory>")
const bounds = {
  mobile: { performance: 0.55, lcpMs: 3500 },
  desktop: { performance: 0.90, lcpMs: 3000 },
}
const median = (values) => {
  if (!values.every((v) => typeof v === "number" && Number.isFinite(v))) return null
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
const errors = []
for (const device of ["mobile", "desktop"]) {
  const names = [
    "lighthouse-" + device + ".json",
    "lighthouse-" + device + "-2.json",
    "lighthouse-" + device + "-3.json",
  ]
  const reports = []
  for (const name of names) {
    const file = path.join(directory, name)
    if (!existsSync(file)) {
      errors.push(device + ": missing sample " + name)
      continue
    }
    reports.push(JSON.parse(readFileSync(file, "utf8")))
  }
  if (reports.length !== names.length) continue
  const performance = median(reports.map((r) => r.categories?.performance?.score))
  const lcpMs = median(reports.map((r) => r.audits?.["largest-contentful-paint"]?.numericValue))
  // Require the actual hero portrait as LCP in every run. Its URL is CMS-
  // controlled: a newly published image can be a Supabase Storage PNG, not
  // the older bundled JPEG. Do not mistake that legitimate edit for an empty
  // page, but never accept a headline/text or an unrelated image as the LCP.
  const portraitHost = device === "mobile" ? "mobile-profile-hero" : "profile-portrait"
  const containsPortrait = (value) => {
    if (!value || typeof value !== "object") return false
    if (Array.isArray(value)) return value.some(containsPortrait)
    if (typeof value.selector === "string" &&
        value.selector.includes(portraitHost + " > ") &&
        /(?:^| > )img$/.test(value.selector)) {
      // The approved image can be a direct <img> or an <img> in <picture>
      // with an optimized source. Preserve the LCP-content requirement.
      const snippet = typeof value.snippet === "string" ? value.snippet : ""
      if (/<img\b/.test(snippet) && /\bsrc=["'](?:\/|https:\/\/)/.test(snippet)) return true
    }
    return Object.values(value).some(containsPortrait)
  }
  const lcpContentPresent = reports.every((report) => {
    const audits = report.audits ?? {}
    return [
      audits["lcp-breakdown-insight"]?.details?.items,
      audits["lcp-discovery-insight"]?.details?.items,
      audits["largest-contentful-paint-element"]?.details?.items,
    ].some(containsPortrait)
  })
  console.log("P6_LCP_CONTENT_GATE " + JSON.stringify({
    device, result: lcpContentPresent ? "PASS" : "FAIL", expected: "approved_profile_portrait",
  }))
  if (!lcpContentPresent) errors.push(device + ": expected published profile portrait missing from LCP")
  const cls = Math.max(...reports.map((r) => r.audits?.["cumulative-layout-shift"]?.numericValue ?? Infinity))
  if (performance === null || performance < bounds[device].performance)
    errors.push(device + ": median performance below budget")
  for (const category of ["accessibility", "seo", "best-practices"]) {
    if (reports.some((r) => (r.categories?.[category]?.score ?? 0) < 0.95))
      errors.push(device + ": " + category + " below 95 on a sample")
  }
  if (lcpMs === null || lcpMs > bounds[device].lcpMs)
    errors.push(device + ": median LCP exceeds synthetic budget")
  if (!Number.isFinite(cls) || cls > 0.1)
    errors.push(device + ": maximum CLS exceeds 0.1")
  if (reports.some((r) => r.runtimeError)) errors.push(device + ": runtime error")
  console.log("P6_PERFORMANCE_BUDGET " + JSON.stringify({
    device, result: errors.some((x) => x.startsWith(device + ":")) ? "FAIL" : "PASS",
    sampleCount: reports.length, performance: performance === null ? null : Math.round(performance * 100),
    lcpMs, cls, statistic: "median_three_runs_worst_a11y",
  }))
}
if (errors.length) {
  console.error("P6_RELEASE_REGRESSIONS " + JSON.stringify(errors))
  process.exitCode = 1
}
