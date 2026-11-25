/** Resolve only published experience destinations from a URL fragment. */
export function experienceSlugFromHash(
  hash: string,
  publishedSlugs: readonly string[],
): string | undefined {
  try {
    const slug = decodeURIComponent(hash.replace(/^#/, "")).replace(/-b$/, "")
    return publishedSlugs.includes(slug) ? slug : undefined
  } catch {
    return undefined
  }
}

/** Desktop anchors stay in document flow, unlike the overlaid sticky company cards. */
export function experienceScrollAnchor(slug: string): HTMLElement | null {
  return document.getElementById(`experience-anchor-${slug}`)
}

export function scrollToExperienceAnchor(slug: string): boolean {
  const anchor = experienceScrollAnchor(slug)
  if (!anchor) return false
  window.scrollTo({ top: window.scrollY + anchor.getBoundingClientRect().top, behavior: "instant" })
  return true
}
