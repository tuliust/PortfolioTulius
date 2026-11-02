import type { ContentItem } from "../types/content"
import { compareCollectionItemChanges } from "./collection-link-review"
import type { ContentBlockRow } from "./placements"

/**
 * Read-only, pre-publication projection of the six explicitly approved
 * Formation/A field choices. This module NEVER links or saves a CMS block.
 * IDs and original text are pinned so changed content requires a new review.
 */
export const FORMATION_A_BLOCK_ID = "1bc36dc9-c301-4873-8c53-21c3e048737b"

const approvedItems = [
  {
    id: "0a09485d-29a0-4e09-ae19-6822979071a4",
    title: "Comunicação Social — Jornalismo",
    label: "Graduação",
    meta: "UFRN · 2007–2012",
    institution: "Universidade Federal do Rio Grande do Norte (UFRN)",
  },
  {
    id: "29c35ec7-6140-4c0e-9e93-5d9b691e2823",
    title: "Comunicação Integrada e Marketing Digital",
    label: "Pós-graduação",
    meta: "UnP · 2013",
    institution: "Universidade Potiguar (UnP)",
  },
  {
    id: "2915e819-4974-4e80-8bb8-bb332567a4d3",
    title: "Marketing Digital, BI e Estratégia Data Driven",
    label: "MBA",
    meta: "PUCRS · 2020–2021",
    institution: "Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)",
  },
] as const

export type FormationPilotEducationRow = {
  id: string
  course: string
  degree_type: string | null
  institution: string
  sort_order: number
  status: string
}

export function buildApprovedFormationAPreview(
  block: Pick<ContentBlockRow, "id" | "mobile_panel" | "status" | "content_json">,
  publishedRows: readonly FormationPilotEducationRow[],
): {
  items: ContentItem[]
  differences: ReturnType<typeof compareCollectionItemChanges>
} {
  const originals = block.content_json?.items ?? []
  if (
    block.id !== FORMATION_A_BLOCK_ID ||
    block.mobile_panel !== "a" ||
    block.status !== "published" ||
    block.content_json?.source_collection ||
    originals.length !== approvedItems.length ||
    publishedRows.length !== approvedItems.length
  ) {
    throw new Error("P4_FORMATION_PREVIEW_REQUIRES_NEW_REVIEW")
  }

  const rows = [...publishedRows].sort((a, b) => a.sort_order - b.sort_order)
  const proposed = approvedItems.map((approved, index): ContentItem => {
    const original = originals[index]
    const row = rows[index]
    if (
      !original ||
      !row ||
      row.id !== approved.id ||
      row.status !== "published" ||
      row.sort_order !== index + 1 ||
      row.course !== approved.title ||
      row.degree_type !== approved.label ||
      row.institution !== approved.institution ||
      original.title !== approved.title ||
      original.label !== approved.label ||
      original.meta !== approved.meta ||
      Object.keys(original).sort().join(",") !== "label,meta,title"
    ) {
      throw new Error("P4_FORMATION_PREVIEW_REQUIRES_NEW_REVIEW")
    }
    return { ...original, text: approved.institution }
  })

  return {
    items: proposed,
    differences: compareCollectionItemChanges(originals, proposed),
  }
}
