import type { ContentItem, PortfolioSection } from "../types/content"
import { allowedVisualIcons } from "./icon-catalog"

export const allowedLayouts: PortfolioSection["layout"][] = [
  "hero",
  "editorial",
  "metrics",
  "timeline",
  "quotes",
  "contact",
]

export const allowedMotion: NonNullable<PortfolioSection["animation"]>[] = [
  "none",
  "fade-in",
  "fade-up",
  "stagger",
  "image-reveal",
  "metric-count",
]

export function clampNumber(
  value: string | number,
  minimum: number,
  maximum: number,
  fallback: number,
) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(maximum, Math.max(minimum, parsed))
}

export function isSafePublicUrl(value: string) {
  if (value.startsWith("mailto:")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.slice(7))
  if (value.startsWith("https://")) {
    try {
      return new URL(value).protocol === "https:"
    } catch {
      return false
    }
  }
  return false
}

/** Resolve a CMS-controlled anchor only against section slugs actually published. */
export function resolveHeroCardDestination(
  requested: string | undefined,
  publishedSlugs: readonly string[],
): string | undefined {
  if (requested && publishedSlugs.includes(requested)) return requested
  return publishedSlugs.includes("resultados") ? "resultados" : undefined
}

export function isSafeEditorialImage(value: string) {
  if (value.startsWith("/media/")) return /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value.slice(7))
  if (value.startsWith("https://")) {
    try {
      return new URL(value).protocol === "https:"
    } catch {
      return false
    }
  }
  return false
}

export function validateContentItems(items: ContentItem[]) {
  const errors: string[] = []
  const metricIcons: readonly string[] = allowedVisualIcons
  const allowedToolIcons: readonly string[] = allowedVisualIcons
  const usedThemeKeys = new Set<string>()
  items.forEach((item, index) => {
    if (item.toolIcons) {
      if (
        item.toolIcons.length > 3 ||
        new Set(item.toolIcons).size !== item.toolIcons.length ||
        item.toolIcons.some((icon) => !allowedToolIcons.includes(icon))
      )
        errors.push(
          `Item ${index + 1}: ícones de ferramentas inválidos (máximo três e sem repetições).`,
        )
    }
    if (item.metricIcon && !metricIcons.includes(item.metricIcon))
      errors.push(`Item ${index + 1}: ícone de indicador inválido.`)
    if (item.themeKey) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.themeKey))
        errors.push(`Item ${index + 1}: identificador de tema inválido.`)
      if (usedThemeKeys.has(item.themeKey))
        errors.push(`Item ${index + 1}: identificador de tema repetido.`)
      usedThemeKeys.add(item.themeKey)
    }
    if (item.relatedThemeKeys?.some((key) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)))
      errors.push(`Item ${index + 1}: associação temática inválida.`)
    if (!item.title.trim()) errors.push(`Item ${index + 1}: título obrigatório.`)
    if (item.targetSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.targetSlug))
      errors.push(`Item ${index + 1}: destino de seção inválido.`)
    if (
      item.hero?.mobileEditorial?.mobileImage &&
      !isSafeEditorialImage(item.hero.mobileEditorial.mobileImage)
    )
      errors.push(`Item ${index + 1}: imagem exclusiva mobile deve ser HTTPS ou /media/arquivo.`)
    if (item.aboutDesktopImage && !isSafeEditorialImage(item.aboutDesktopImage))
      errors.push(`Item ${index + 1}: imagem desktop deve ser HTTPS ou /media/arquivo.`)
    if (
      item.meta &&
      (/^(javascript|data|vbscript):/i.test(item.meta) ||
        (/^(https|mailto)/.test(item.meta) && !isSafePublicUrl(item.meta)))
    )
      errors.push(`Item ${index + 1}: URL inválida ou insegura.`)
  })
  return errors
}
