/** The visual catalog is the single source of truth for all icon selectors. */
export type VisualIconName = (typeof import("../lib/icon-catalog").allowedVisualIcons)[number]
export type ToolIconName = VisualIconName
export type MetricIconName = VisualIconName

export type ThemeName = "paper" | "cream" | "ink" | "orange"

export type DeviceItemStyle = {
  visible?: boolean
  order?: number
  spacing?: number
  width?: number
  titleSize?: number
  textSize?: number
  textAlign?: "left" | "center" | "right"
}

export type HeroDeviceStyle = {
  visualHeight?: number
  imageWidth?: number
  imageHeight?: number
  imagePositionX?: number
  imagePositionY?: number
  yearsX?: number
  yearsY?: number
  yearsWidth?: number
  badgeSize?: number
  badgeX?: number
  badgeY?: number
  contentGap?: number
  introSize?: number
  introSpacing?: number
  introAlign?: "left" | "center" | "right"
}

export type HeroVisualConfig = {
  panelBackground?: string
  badgeText?: string
  badgeVisible?: boolean
  badgeBackground?: string
  badgeColor?: string
  introColor?: string
  desktop?: HeroDeviceStyle
  mobile?: HeroDeviceStyle
}

import type { MediaFraming } from "../lib/media-framing"

export type ContentItem = {
  // Device-specific presentation from block_placements (never duplicated content).
  placement?: {
    layoutVariant: string
    styleConfig: Record<string, unknown>
    motionConfig: Record<string, unknown>
  }
  title: string
  label?: string
  text?: string
  meta?: string
  value?: string
  image?: string
  alt?: string
  mediaFraming?: MediaFraming
  /** Independent full-height image for section 02 on desktop; mobile retains image. */
  aboutDesktopImage?: string
  aboutDesktopAlt?: string
  aboutDesktopFraming?: MediaFraming
  tags?: string[]
  placeholder?: boolean
  /** Editorial card retained in the CMS but excluded from public experience lists. */
  isHidden?: boolean
  icon?: "arrow" | "none"
  targetSlug?: string
  metricIcon?: MetricIconName
  relatedThemeKeys?: string[]
  toolIcons?: ToolIconName[]
  themeKey?: string
  themeAxis?: string
  themeTitle?: string
  themeSubtitle?: string
  themeTopics?: string
  themeSummary?: string
  inheritedHighlights?: string[]
  titleColor?: string
  textColor?: string
  backgroundColor?: string
  desktop?: DeviceItemStyle
  mobile?: DeviceItemStyle
  hero?: HeroVisualConfig
}

export type ExperienceSlide = {
  title: string
  image?: string
  alt?: string
  caption?: string
  framing?: MediaFraming
}

export type ExperienceMedia = {
  logo?: string
  logoAlt?: string
  logoFraming?: MediaFraming
  slides?: ExperienceSlide[]
}

export type PortfolioSection = {
  id: string
  slug: string
  number: number
  title: string
  eyebrow?: string
  intro?: string
  theme: ThemeName
  layout: "hero" | "editorial" | "metrics" | "timeline" | "quotes" | "contact"
  animation?: "none" | "fade-in" | "fade-up" | "stagger" | "image-reveal" | "metric-count"
  status: "draft" | "in_review" | "published" | "archived"
  visible: boolean
  navLabel?: string
  experienceMedia?: ExperienceMedia
  panelA: ContentItem[]
  panelB: ContentItem[]
  desktopPanelA?: ContentItem[]
  desktopPanelB?: ContentItem[]
}

export type DesignTokens = {
  orange: string
  ink: string
  paper: string
  cream: string
  muted: string
  orangeDark: string
  headingFont: "Big Shoulders Display" | "Inter"
  bodyFont: "Inter" | "Big Shoulders Display"
  container: number
  sectionSpace: number
  cardRadius: number
  motionDuration: number
}
