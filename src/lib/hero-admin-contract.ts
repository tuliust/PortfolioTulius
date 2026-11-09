import type { ContentItem } from "../types/content"

export type HeroAvailableSection = {
  slug: string
  status: string
  is_visible: boolean
}

/** Only published, visible sections can be selected as Hero link destinations. */
export function publishedHeroDestinations<T extends HeroAvailableSection>(
  sections: readonly T[],
): T[] {
  return sections.filter(
    (section) => section.slug !== "perfil" && section.status === "published" && section.is_visible,
  )
}

/** Reject stale destinations before persisting the Hero's public links. */
export function unavailableHeroDestination(
  items: readonly ContentItem[],
  nextTarget: string | undefined,
  sections: readonly HeroAvailableSection[],
): string | undefined {
  const available = new Set(publishedHeroDestinations(sections).map((section) => section.slug))
  const unavailable = items.find((item) => item.targetSlug && !available.has(item.targetSlug))
  if (unavailable?.targetSlug) return unavailable.targetSlug
  if (nextTarget && !available.has(nextTarget)) return nextTarget
  return undefined
}

/** Panel B's first item owns shared Hero metadata; item order must not relocate it. */
export function reorderHeroItems(
  items: readonly ContentItem[],
  index: number,
  direction: -1 | 1,
  panel: "a" | "b",
): ContentItem[] {
  const target = index + direction
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return [...items]
  if (panel === "a" && (index === 0 || target === 0)) return [...items]
  // The five principal buttons and the career highlights are separate editorial groups.
  if (panel === "b" && index < 5 !== target < 5) return [...items]

  const reordered = [...items]
  ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
  if (panel === "b" && (index === 0 || target === 0)) {
    const first = { ...reordered[0] }
    const second = { ...reordered[1] }
    if (items[0].hero) first.hero = items[0].hero
    else delete first.hero
    if (items[1].hero) second.hero = items[1].hero
    else delete second.hero
    reordered[0] = first
    reordered[1] = second
  }
  return reordered
}

/** Media/badge geometry belongs to the left Hero image, never to panel B. */
export function hasHeroMediaControls(
  sectionSlug: string | undefined,
  panel: "a" | "b",
  index: number,
): boolean {
  return sectionSlug === "perfil" && panel === "a" && index === 0
}
