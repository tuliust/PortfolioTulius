import type { ContentItem, PortfolioSection } from "../types/content"
import { normalizeMediaFraming, type MediaFraming } from "./media-framing"

export type PublishedMediaAlt = {
  storage_path: string
  alt_text: string | null
  focal_point?: Partial<MediaFraming> | null
}

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

/** Apply canonical media metadata to all published compositions without rewriting CMS JSON. */
export function synchronizePublishedMediaAlts(
  sections: PortfolioSection[],
  assets: readonly PublishedMediaAlt[],
): PortfolioSection[] {
  if (!assets.length) return sections
  const catalog = new Map(assets.map((asset) => [asset.storage_path, asset]))
  const altFor = (image: string | undefined, previous: string | undefined) => {
    const path = publishedMediaStoragePath(image)
    const asset = path ? catalog.get(path) : undefined
    return asset ? (asset.alt_text ?? "") : previous
  }
  const framingFor = (
    image: string | undefined,
    perUse: MediaFraming | undefined,
  ): MediaFraming | undefined => {
    // An editorial override for this placement takes precedence even when
    // the global media record is changed in a different editor.
    if (perUse) return perUse
    const path = publishedMediaStoragePath(image)
    const focalPoint = path ? catalog.get(path)?.focal_point : undefined
    if (!focalPoint) return perUse
    const normalized = normalizeMediaFraming(focalPoint)
    // Default global metadata is not a styling instruction. Keep the
    // original composition/CSS untouched for all currently approved media.
    if (normalized.x === 50 && normalized.y === 50 && normalized.zoom === 1) return perUse
    return normalized
  }
  const withItemAlts = (item: ContentItem): ContentItem => {
    const mobile = item.hero?.mobileEditorial
    return {
      ...item,
      alt: altFor(item.image, item.alt),
      mediaFraming: framingFor(item.image, item.mediaFraming),
      aboutDesktopAlt: altFor(item.aboutDesktopImage, item.aboutDesktopAlt),
      aboutDesktopFraming: framingFor(item.aboutDesktopImage, item.aboutDesktopFraming),
      ...(mobile
        ? {
            hero: {
              ...item.hero,
              mobileEditorial: {
                ...mobile,
                mobileAlt: altFor(mobile.mobileImage, mobile.mobileAlt),
                mobileFraming: framingFor(mobile.mobileImage, mobile.mobileFraming),
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
          logoFraming: framingFor(
            section.experienceMedia.logo,
            section.experienceMedia.logoFraming,
          ),
          slides: section.experienceMedia.slides?.map((slide) => ({
            ...slide,
            alt: altFor(slide.image, slide.alt),
            framing: framingFor(slide.image, slide.framing),
          })),
        }
      : undefined,
  }))
}
