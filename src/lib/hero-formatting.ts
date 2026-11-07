import type { CSSProperties } from "react"
import type { HeroTextFormat } from "../types/content"

const colorVariables: Record<string, string> = {
  "color.orange": "--orange",
  "color.ink": "--ink",
  "color.paper": "--paper",
  "color.cream": "--cream",
  "color.muted": "--muted",
  "color.orangeDark": "--orange-dark",
  "color.white": "--white",
}
const fontVariables: Record<string, string> = {
  "font.heading": "--font-heading",
  "font.body": "--font-body",
  "font.serif": "--font-serif",
}

export function heroColor(value?: string): string | undefined {
  if (!value) return undefined
  if (value === "transparent") return value
  const variable = colorVariables[value]
  if (variable) return "var(" + variable + ")"
  if (/^#[0-9a-fA-F]{6}$/.test(value) || /^var\(--[a-z-]+\)$/.test(value)) return value
  return undefined
}

export function heroFont(value?: string): string | undefined {
  if (!value) return undefined
  const variable = fontVariables[value]
  return variable ? "var(" + variable + ")" : undefined
}

function styleName(format?: HeroTextFormat): string | undefined {
  const key = format?.styleToken
  return key && /^typography\.[a-z0-9-]+$/.test(key)
    ? key.slice("typography.".length)
    : undefined
}

export function heroSizeClass(format?: HeroTextFormat): string | undefined {
  return styleName(format) || format?.desktopSize != null || format?.mobileSize != null
    ? "hero-formatted-size"
    : undefined
}

function size(value: number | undefined): string | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 8 && value <= 160
    ? value + "px"
    : undefined
}

export function heroTextStyle(format?: HeroTextFormat): CSSProperties | undefined {
  if (!format) return undefined
  const key = styleName(format)
  const desktop = size(format.desktopSize) || (key ? "var(--hero-style-" + key + "-desktop)" : undefined)
  const mobile = size(format.mobileSize) || (key ? "var(--hero-style-" + key + "-mobile)" : undefined)
  const color = heroColor(format.colorToken) || (key ? "var(--hero-style-" + key + "-color)" : undefined)
  const fontFamily = heroFont(format.fontToken) || (key ? "var(--hero-style-" + key + "-font)" : undefined)
  return {
    ...(color ? { color } : {}),
    ...(fontFamily ? { fontFamily } : {}),
    ...(desktop ? { "--hero-format-desktop": desktop } : {}),
    ...(mobile ? { "--hero-format-mobile": mobile } : {}),
  } as CSSProperties
}
