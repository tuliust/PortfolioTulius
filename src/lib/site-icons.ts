/** Public favicon configuration: static fallback + published HTTPS library media. */
export const FALLBACK_FAVICON = "/favicon.png"
export const FALLBACK_APPLE_ICON = "/apple-touch-icon.png"

export function safeSiteIconUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null
  const candidate = value.trim()
  if (/^\/[a-zA-Z0-9/_-]+(?:\.[a-zA-Z0-9_-]+)?$/.test(candidate) && !candidate.includes(".."))
    return candidate
  if (!candidate.startsWith("https://")) return null
  try {
    const url = new URL(candidate)
    return url.protocol === "https:" && !url.username && !url.password && !candidate.includes("\\")
      ? url.href
      : null
  } catch {
    return null
  }
}

/** Preserve all unrelated SEO fields while replacing the favicon selection. */
export function withSiteFavicon(
  seoJson: Record<string, unknown> | null | undefined,
  url: string,
): Record<string, unknown> {
  return { ...(seoJson ?? {}), faviconUrl: safeSiteIconUrl(url) ?? FALLBACK_FAVICON }
}

/** Update the already rendered document without blocking the first fold. */
export function applySiteIcons(value: unknown): void {
  if (typeof document === "undefined") return
  const favicon = safeSiteIconUrl(value) ?? FALLBACK_FAVICON
  for (const [rel, src] of [
    ["icon", favicon],
    ["apple-touch-icon", favicon === FALLBACK_FAVICON ? FALLBACK_APPLE_ICON : favicon],
  ]) {
    let link = document.querySelector<HTMLLinkElement>(`head link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement("link")
      link.rel = rel
      document.head.append(link)
    }
    link.href = src
    link.removeAttribute("type")
  }
}
