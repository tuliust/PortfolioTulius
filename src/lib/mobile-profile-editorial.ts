import type { MobileEditorialFont, MobileProfileEditorial } from "../types/content"

export const MOBILE_EDITORIAL_FONTS: readonly MobileEditorialFont[] = [
  "Big Shoulders Display",
  "Inter",
  "Georgia",
]

export const MOBILE_PROFILE_EDITORIAL_DEFAULTS = {
  enabled: false,
  headline: "CONEXÕES\nAUTÊNTICAS.\nINOVAÇÃO.",
  badgeText: "VISÃO 360° DA COMUNICAÇÃO E MARKETING ·",
  top: {
    background: "#171617",
    fontFamily: "Big Shoulders Display",
    textColor: "#FFFFFF",
    accentColor: "#FF5414",
    supportColor: "#FFFFFF",
    supportFontFamily: "Inter",
    headlineSize: 82,
    paddingY: 38,
    showHeadline: true,
    showSupport: true,
  },
  middle: {
    background: "#FAFAFA",
    fontFamily: "Big Shoulders Display",
    textColor: "#FF5414",
    badgeSize: 240,
    paddingY: 26,
    showBadge: true,
  },
  bottom: {
    background: "#FAFAFA",
    fontFamily: "Big Shoulders Display",
    textColor: "#171617",
    accentColor: "#FF5414",
    descriptionColor: "#171617",
    descriptionFontFamily: "Inter",
    photoWidth: 45,
    nameSize: 48,
    yearsSize: 64,
    paddingY: 28,
    showPhoto: true,
    showName: true,
    showExperience: true,
    showArrow: true,
  },
} satisfies MobileProfileEditorial

/** Merge persisted values per zone so older JSONB documents keep safe defaults. */
export function mobileProfileEditorial(value?: MobileProfileEditorial) {
  return {
    ...MOBILE_PROFILE_EDITORIAL_DEFAULTS,
    ...value,
    top: { ...MOBILE_PROFILE_EDITORIAL_DEFAULTS.top, ...value?.top },
    middle: { ...MOBILE_PROFILE_EDITORIAL_DEFAULTS.middle, ...value?.middle },
    bottom: { ...MOBILE_PROFILE_EDITORIAL_DEFAULTS.bottom, ...value?.bottom },
  }
}

export function mobileEditorialLines(value?: string) {
  const lines = (value ?? MOBILE_PROFILE_EDITORIAL_DEFAULTS.headline)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  return lines.length ? lines.slice(0, 5) : MOBILE_PROFILE_EDITORIAL_DEFAULTS.headline.split("\n")
}

export function mobileEditorialFont(value?: string): string {
  if (value === "font.heading") return "var(--font-heading)"
  if (value === "font.body") return "var(--font-body)"
  if (value === "font.serif") return "var(--font-serif)"
  return MOBILE_EDITORIAL_FONTS.find((font) => font === value) ?? "Big Shoulders Display"
}
