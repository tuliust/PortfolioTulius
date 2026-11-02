import type { ContentItem } from "../types/content"
import type { ContentBlockRow } from "./placements"

export const COLLECTION_SOURCES = [
  "career_experiences",
  "portfolio_projects",
  "metrics",
  "skills",
  "education",
  "language_levels",
  "tool_categories",
  "testimonials",
  "contact_channels",
] as const

export type CollectionSource = (typeof COLLECTION_SOURCES)[number]

export function isCollectionSource(value: unknown): value is CollectionSource {
  return typeof value === "string" && (COLLECTION_SOURCES as readonly string[]).includes(value)
}

type RecordRow = Record<string, unknown>

function field(row: RecordRow, key: string): string {
  const value = row[key]
  return typeof value === "string" ? value.trim() : ""
}

function safeLink(url: string): string {
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(url)) return url
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" ? url : ""
  } catch {
    return ""
  }
}

/**
 * A block with an explicit collection source renders published collection rows.
 * Original content_json.items stay untouched and available when unlinked.
 * Editorial notes are deliberately excluded from public cards.
 */
export function collectionToItems(
  source: CollectionSource,
  records: RecordRow[],
  includeDrafts = false,
): ContentItem[] {
  return records
    .filter((row) => (includeDrafts ? row.status !== "archived" : row.status === "published"))
    .slice()
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((row): ContentItem => {
      switch (source) {
        case "career_experiences":
          return {
            title: field(row, "company"),
            label: field(row, "role"),
            text: field(row, "description"),
            meta: field(row, "location"),
          }
        case "portfolio_projects":
          return {
            title: field(row, "title"),
            text: field(row, "summary"),
            meta: field(row, "project_status"),
          }
        case "metrics":
          return {
            title: field(row, "label"),
            value: field(row, "value_text"),
            meta: field(row, "unit"),
            text: field(row, "context"),
          }
        case "skills":
          return {
            title: field(row, "name"),
            text: field(row, "category"),
          }
        case "education":
          return {
            title: field(row, "course"),
            label: field(row, "degree_type"),
            text: field(row, "institution"),
            meta: [field(row, "start_date"), field(row, "end_date")].filter(Boolean).join(" — "),
          }
        case "language_levels":
          return {
            title: field(row, "language"),
            text: field(row, "level_label"),
            meta: field(row, "evidence_note"),
          }
        case "tool_categories":
          return {
            title: field(row, "title"),
            text: Array.isArray(row.tools)
              ? row.tools
                  .map((tool) =>
                    typeof tool === "object" && tool !== null && "name" in tool
                      ? String(tool.name ?? "")
                      : "",
                  )
                  .filter(Boolean)
                  .join(" · ")
              : "",
          }
        case "testimonials":
          return {
            title: field(row, "author_name"),
            meta: field(row, "author_role"),
            text: field(row, "quote_text"),
          }
        case "contact_channels":
          return {
            title: field(row, "label"),
            text: field(row, "value"),
            meta: safeLink(field(row, "url")),
          }
      }
    })
    .filter((item) => item.title.length > 0)
}

/** Materialize linked cards only for rendering; never write them back to the CMS. */
export function resolveCollectionBlocks(
  blocks: ContentBlockRow[],
  sources: ReadonlyMap<CollectionSource, ContentItem[]>,
): ContentBlockRow[] {
  return blocks.map((block) => {
    const source = block.content_json?.source_collection
    if (!isCollectionSource(source)) return block
    // A failed collection request is not an instruction to remove approved
    // cards. Render the original manual snapshot until the source recovers.
    // An explicitly loaded, empty collection remains empty as intended.
    if (!sources.has(source)) return block
    const records = sources.get(source) ?? []
    const start = Number.isInteger(block.content_json?.collection_start)
      ? Math.max(0, block.content_json?.collection_start ?? 0)
      : 0
    const limit =
      Number.isInteger(block.content_json?.collection_limit) &&
      (block.content_json?.collection_limit ?? 0) > 0
        ? block.content_json!.collection_limit!
        : undefined
    const selection = records.slice(start, limit == null ? undefined : start + limit)
    const originals = block.content_json?.items ?? []
    return {
      ...block,
      content_json: {
        ...block.content_json,
        items: selection.map((record) => {
          const original = originals.find((item) => item.title === record.title)
          return original?.image ? { ...record, image: original.image, alt: original.alt } : record
        }),
      },
    }
  })
}
