import type { PortfolioSection } from "../types/content"

/** Published and visible CMS order; this does not alter the supplied array. */
export function selectPublishedPdfSections(
  sections: readonly PortfolioSection[],
  includedSlugs?: readonly string[],
): PortfolioSection[] {
  const included = includedSlugs ? new Set(includedSlugs) : null
  return sections
    .filter(
      (section) =>
        section.status === "published" &&
        section.visible &&
        (included === null || included.has(section.slug)),
    )
    .sort((a, b) => a.number - b.number || a.slug.localeCompare(b.slug))
}
