import { isCollectionSource, type CollectionSource } from "./collections"

export type AcervoBlockRef = {
  id: string
  section_id: string
  mobile_panel: string
  status: string
  content_json: {
    source_collection?: unknown
    collection_start?: unknown
    collection_limit?: unknown
  } | null
}

export type AcervoSectionRef = {
  id: string
  slug: string
  title: string
  status: string
  is_visible: boolean
}

export type AcervoUsage = {
  source: CollectionSource
  blockId: string
  sectionId: string
  sectionSlug: string
  sectionTitle: string
  panel: "a" | "b"
  start: number
  limit?: number
  published: boolean
}

/**
 * Only explicit source_collection links are shared-acervo entries.
 * Section-specific CMS content and direct Experience trajectories remain
 * edited in their own section, not duplicated as shared catalog forms.
 */
export function discoverAcervoUsages(
  blocks: readonly AcervoBlockRef[],
  sections: readonly AcervoSectionRef[],
): AcervoUsage[] {
  const byId = new Map(sections.map((section) => [section.id, section]))
  return blocks.flatMap((block) => {
    const section = byId.get(block.section_id)
    const source = block.content_json?.source_collection
    if (!section || !isCollectionSource(source)) return []
    if (block.mobile_panel !== "a" && block.mobile_panel !== "b") return []
    const start = block.content_json?.collection_start
    const limit = block.content_json?.collection_limit
    return [{
      source,
      blockId: block.id,
      sectionId: section.id,
      sectionSlug: section.slug,
      sectionTitle: section.title,
      panel: block.mobile_panel,
      start: Number.isInteger(start) && Number(start) >= 0 ? Number(start) : 0,
      limit: Number.isInteger(limit) && Number(limit) > 0 ? Number(limit) : undefined,
      published:
        block.status === "published" &&
        section.status === "published" &&
        section.is_visible,
    }]
  })
}

/** Show only collections feeding at least one currently published block. */
export function activeAcervoSources(usages: readonly AcervoUsage[]): CollectionSource[] {
  return [...new Set(usages.filter((usage) => usage.published).map((usage) => usage.source))]
    .sort((a, b) => a.localeCompare(b))
}

export function acervoUsageLabel(usage: AcervoUsage): string {
  return `${usage.sectionTitle} · ${usage.panel === "a" ? "Esquerda" : "Direita"}`
}

export type AcervoRecordRef = {
  id?: string | null
  status?: string
  sort_order?: number | string | null
}

/**
 * Replicate collectionToItems / resolveCollectionBlocks: sort published records
 * by sort_order, then apply each source_collection start/limit window.
 */
export function usagesForAcervoRecord(
  source: CollectionSource,
  record: AcervoRecordRef,
  records: readonly AcervoRecordRef[],
  usages: readonly AcervoUsage[],
): AcervoUsage[] {
  if (!record.id || record.status !== "published") return []
  const published = records
    .filter((item) => item.status === "published")
    .slice()
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
  const index = published.findIndex((item) => item.id === record.id)
  if (index < 0) return []
  return usages.filter(
    (usage) =>
      usage.source === source &&
      usage.published &&
      index >= usage.start &&
      (usage.limit === undefined || index < usage.start + usage.limit),
  )
}
