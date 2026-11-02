import type { ContentItem } from "../types/content"

/** Difference list for the owner's per-field approval before changing a block source. */
export type CollectionItemChange = {
  position: number
  field: string
  before: string
  after: string
}

function display(value: unknown): string {
  if (value === undefined) return "(ausente)"
  if (value === null) return "(vazio)"
  return JSON.stringify(value)
}

/**
 * Compare every stored attribute and the number/order of cards; include visual
 * attributes so a collection binding cannot silently discard photography,
 * links, responsive styling or editorial text.
 */
export function compareCollectionItemChanges(
  current: readonly ContentItem[],
  proposed: readonly ContentItem[],
): CollectionItemChange[] {
  const changes: CollectionItemChange[] = []
  for (let index = 0; index < Math.max(current.length, proposed.length); index++) {
    const original = current[index] as Record<string, unknown> | undefined
    const replacement = proposed[index] as Record<string, unknown> | undefined
    const fields = new Set([...Object.keys(original ?? {}), ...Object.keys(replacement ?? {})])
    for (const field of fields) {
      const before = original?.[field]
      const after = replacement?.[field]
      if (JSON.stringify(before) === JSON.stringify(after)) continue
      changes.push({
        position: index + 1,
        field,
        before: display(before),
        after: display(after),
      })
    }
  }
  return changes
}
