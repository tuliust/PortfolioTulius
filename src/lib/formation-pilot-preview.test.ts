import { describe, expect, it } from "vitest"
import {
  buildApprovedFormationAPreview,
  FORMATION_A_BLOCK_ID,
  type FormationPilotEducationRow,
} from "./formation-pilot-preview"

const block = {
  id: FORMATION_A_BLOCK_ID,
  mobile_panel: "a" as const,
  status: "published",
  content_json: {
    items: [
      { title: "Comunicação Social — Jornalismo", label: "Graduação", meta: "UFRN · 2007–2012" },
      {
        title: "Comunicação Integrada e Marketing Digital",
        label: "Pós-graduação",
        meta: "UnP · 2013",
      },
      {
        title: "Marketing Digital, BI e Estratégia Data Driven",
        label: "MBA",
        meta: "PUCRS · 2020–2021",
      },
    ],
  },
}

const rows: FormationPilotEducationRow[] = [
  {
    id: "0a09485d-29a0-4e09-ae19-6822979071a4",
    course: "Comunicação Social — Jornalismo",
    degree_type: "Graduação",
    institution: "Universidade Federal do Rio Grande do Norte (UFRN)",
    status: "published",
    sort_order: 1,
  },
  {
    id: "29c35ec7-6140-4c0e-9e93-5d9b691e2823",
    course: "Comunicação Integrada e Marketing Digital",
    degree_type: "Pós-graduação",
    institution: "Universidade Potiguar (UnP)",
    status: "published",
    sort_order: 2,
  },
  {
    id: "2915e819-4974-4e80-8bb8-bb332567a4d3",
    course: "Marketing Digital, BI e Estratégia Data Driven",
    degree_type: "MBA",
    institution: "Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)",
    status: "published",
    sort_order: 3,
  },
]

describe("prévia isolada das seis decisões Formação/A", () => {
  it("conserva todos os períodos e acrescenta apenas os três nomes completos", () => {
    const original = structuredClone(block)
    const originalRows = structuredClone(rows)
    const { items, differences } = buildApprovedFormationAPreview(block, rows)
    expect(items.map(({ title, label, meta }) => ({ title, label, meta }))).toEqual(
      block.content_json.items,
    )
    expect(items.map(({ text }) => text)).toEqual(rows.map((row) => row.institution))
    expect(
      differences.map(({ position, field, before, after }) => ({
        position,
        field,
        before,
        after,
      })),
    ).toEqual(
      rows.map((row, i) => ({
        position: i + 1,
        field: "text",
        before: "(ausente)",
        after: JSON.stringify(row.institution),
      })),
    )
    expect(block).toEqual(original)
    expect(rows).toEqual(originalRows)
  })

  it("reprova desvios de ID, estado, ordem, texto editorial e fonte", () => {
    expect(() =>
      buildApprovedFormationAPreview(block, [{ ...rows[0], id: "invalid" }, ...rows.slice(1)]),
    ).toThrow("P4_FORMATION_PREVIEW_REQUIRES_NEW_REVIEW")
    expect(() =>
      buildApprovedFormationAPreview(block, [
        { ...rows[0], institution: "Nome alterado" },
        ...rows.slice(1),
      ]),
    ).toThrow("P4_FORMATION_PREVIEW_REQUIRES_NEW_REVIEW")
    expect(() =>
      buildApprovedFormationAPreview(block, [{ ...rows[0], status: "draft" }, ...rows.slice(1)]),
    ).toThrow("P4_FORMATION_PREVIEW_REQUIRES_NEW_REVIEW")
    expect(() =>
      buildApprovedFormationAPreview(
        { ...block, content_json: { ...block.content_json, source_collection: "education" } },
        rows,
      ),
    ).toThrow("P4_FORMATION_PREVIEW_REQUIRES_NEW_REVIEW")
    expect(() =>
      buildApprovedFormationAPreview(
        {
          ...block,
          content_json: {
            items: [
              { ...block.content_json.items[0], meta: "Período diferente" },
              ...block.content_json.items.slice(1),
            ],
          },
        },
        rows,
      ),
    ).toThrow("P4_FORMATION_PREVIEW_REQUIRES_NEW_REVIEW")
  })
})
