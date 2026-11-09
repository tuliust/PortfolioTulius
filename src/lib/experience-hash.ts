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
