import type { ContentItem, ExperienceMedia } from "../types/content"

// Presentation lives in block_placements; content_json remains the sole content source.
export type PlacementPresentation = {
  layoutVariant: string
  styleConfig: Record<string, unknown>
  motionConfig: Record<string, unknown>
}

export type PlacedItem = ContentItem & {
  placement?: PlacementPresentation
}

export type ContentBlockRow = {
  id: string
  section_id: string
  sort_order: number
  mobile_panel: "a" | "b"
  status: string
  content_json: {
    items?: ContentItem[]
    source_collection?: string | null
    /** Zero-based start index in an ordered linked collection. */
    collection_start?: number
    /** Optional positive number of linked items for this block. */
    collection_limit?: number
    experienceMedia?: ExperienceMedia
    editorAnchor?: string
  } | null
}

export type SectionPanelRow = {
  id: string
  section_id: string
  panel_key: string
}

export type BlockPlacementRow = {
  block_id: string
  panel_id: string
  sort_order: number
  layout_variant: string
  is_visible: boolean
  style_config: Record<string, unknown> | null
  motion_config: Record<string, unknown> | null
}

export type DeviceComposition = {
  desktopA: PlacedItem[]
  desktopB: PlacedItem[]
  mobileA: PlacedItem[]
  mobileB: PlacedItem[]
}

export function composeSectionPlacements(
  sectionId: string,
  blocks: ContentBlockRow[],
  panels: SectionPanelRow[],
  placements: BlockPlacementRow[],
  includeDrafts = false,
): DeviceComposition {
  const panelById = new Map(
    panels
      .filter((panel) => panel.section_id === sectionId)
      .map((panel) => [panel.id, panel.panel_key]),
  )
  const blockById = new Map(
    blocks
      .filter((block) => block.section_id === sectionId)
      .filter((block) =>
        includeDrafts ? block.status !== "archived" : block.status === "published",
      )
      .map((block) => [block.id, block]),
  )
  const composition: DeviceComposition = {
    desktopA: [],
    desktopB: [],
    mobileA: [],
    mobileB: [],
  }
  const matches = placements
    .filter((placement) => placement.is_visible)
    .map((placement) => ({
      placement,
      block: blockById.get(placement.block_id),
      key: panelById.get(placement.panel_id),
    }))
    .filter((entry) => entry.block && entry.key)
    .sort(
      (a, b) =>
        a.placement.sort_order - b.placement.sort_order ||
        (a.block?.sort_order ?? 0) - (b.block?.sort_order ?? 0) ||
        a.placement.block_id.localeCompare(b.placement.block_id),
    )

  for (const { block, key, placement } of matches) {
    if (!block) continue
    const destination =
      key === "desktop"
        ? block.mobile_panel === "a"
          ? "desktopA"
          : "desktopB"
        : key === "mobile-a"
          ? "mobileA"
          : key === "mobile-b"
            ? "mobileB"
            : null
    if (!destination) continue
    const presentation: PlacementPresentation = {
      layoutVariant: placement.layout_variant || "default",
      styleConfig: placement.style_config ?? {},
      motionConfig: placement.motion_config ?? {},
    }
    for (const item of block.content_json?.items ?? []) {
      composition[destination].push({ ...item, placement: presentation })
    }
  }
  return composition
}
