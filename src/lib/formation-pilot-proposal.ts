import type { ContentItem } from "../types/content"
import type { ContentBlockRow } from "./placements"
import {
  buildApprovedFormationAPreview,
  type FormationPilotEducationRow,
} from "./formation-pilot-preview"

/**
 * Unconnected, read-only draft for a FUTURE individually approved publishing flow.
 * It never writes, never sets source_collection, and does not alter the public renderer.
 */
export function prepareFormationAPublicationProposal(
  block: Pick<ContentBlockRow, "id" | "mobile_panel" | "status" | "content_json">,
  rows: readonly FormationPilotEducationRow[],
): {
  blockId: string
  currentItems: ContentItem[]
  proposedItems: ContentItem[]
  changedFields: { position: number; field: string }[]
} {
  const preview = buildApprovedFormationAPreview(block, rows)
  if (
    preview.differences.length !== 3 ||
    preview.differences.some(
      (change, index) => change.field !== "text" || change.position !== index + 1,
    )
  )
    throw new Error("P4_FORMATION_PREVIEW_REQUIRES_NEW_REVIEW")
  return {
    blockId: block.id,
    currentItems: structuredClone(block.content_json?.items ?? []),
    proposedItems: structuredClone(preview.items),
    changedFields: preview.differences.map(({ position, field }) => ({ position, field })),
  }
}
