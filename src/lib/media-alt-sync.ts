import type { ContentItem, PortfolioSection } from "../types/content"

export type PublishedMediaAlt = { storage_path: string; alt_text: string | null }

/** Only catalog-owned public Storage images have canonical alt text. */
export function publishedMediaStoragePath(image: string | undefined): string | undefined {
  if (!image) return undefined
  try {
    const path = new URL(image, "https://portfolio.invalid").pathname
    const prefix = "/storage/v1/object/public/portfolio-public/"
    if (path.startsWith(prefix)) return decodeURIComponent(path.slice(prefix.length))
    if (path.startsWith("/media/")) return decodeURIComponent(path.slice("/media/".length))
  } catch {
    // Keep local editorial text for unrelated and malformed sources.
  }
  return undefined
}

/** Apply media_assets.alt_text to both device compositions without rewriting CMS JSON. */
export function synchronizePublishedMediaAlts(
  sections: PortfolioSection[],
  assets: readonly PublishedMediaAlt[],
): PortfolioSection[] {
  if (!assets.length) return sections
  const catalog = new Map(assets.map((asset) => [asset.storage_path, asset.alt_text ?? ""]))
  const altFor = (image: string | undefined, previous: string | undefined) => {
    const path = publishedMediaStoragePath(image)
    return path && catalog.has(path) ? catalog.get(path) : previous
  }
  const withItemAlts = (item: ContentItem): ContentItem => {
    const mobile = item.hero?.mobileEditorial
    return {
      ...item,
      alt: altFor(item.image, item.alt),
      aboutDesktopAlt: altFor(item.aboutDesktopImage, item.aboutDesktopAlt),
      ...(mobile
        ? {
            hero: {
              ...item.hero,
              mobileEditorial: {
                ...mobile,
                mobileAlt: altFor(mobile.mobileImage, mobile.mobileAlt),
              },
            },
          }
        : {}),
    }
  }
  return sections.map((section) => ({
    ...section,
    panelA: section.panelA.map(withItemAlts),
    panelB: section.panelB.map(withItemAlts),
    desktopPanelA: section.desktopPanelA?.map(withItemAlts),
    desktopPanelB: section.desktopPanelB?.map(withItemAlts),
    experienceMedia: section.experienceMedia
      ? {
          ...section.experienceMedia,
          logoAlt: altFor(section.experienceMedia.logo, section.experienceMedia.logoAlt),
          slides: section.experienceMedia.slides?.map((slide) => ({
            ...slide,
            alt: altFor(slide.image, slide.alt),
          })),
        }
      : undefined,
  }))
}
