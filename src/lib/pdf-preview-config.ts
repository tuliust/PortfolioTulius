import type { PdfColorMode, PdfDevice } from "./pdf-export-options"

export type PdfPreviewConfig = {
  device: PdfDevice
  colorMode: PdfColorMode
  includedSlugs: string[]
}

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function buildPdfPreviewUrl(config: PdfPreviewConfig): string | null {
  const slugs = [...new Set(config.includedSlugs.filter((s) => VALID_SLUG.test(s)))]
  if (!slugs.length) return null
  const query = new URLSearchParams({ device: config.device, palette: config.colorMode })
  for (const slug of slugs) query.append("section", slug)
  return "/admin/pdf-preview?" + query.toString()
}

export function parsePdfPreviewConfig(search: string): PdfPreviewConfig | null {
  const params = new URLSearchParams(search)
  const device = params.get("device")
  const palette = params.get("palette")
  const slugs = params.getAll("section")
  if (device !== "desktop" && device !== "mobile") return null
  if (palette !== "original" && palette !== "clean") return null
  if (!slugs.length || slugs.some((slug) => !VALID_SLUG.test(slug))) return null
  return { device, colorMode: palette, includedSlugs: [...new Set(slugs)] }
}
