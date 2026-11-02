import { describe, expect, it } from "vitest"
import { compareCollectionItemChanges } from "./collection-link-review"
import { collectionToItems } from "./collections"

describe("aprovação individual de divergências antes de vincular uma coleção", () => {
  it("aponta diferenças textuais e fotográficas do mesmo item", () => {
    const differences = compareCollectionItemChanges(
      [{ title: "Pessoa", text: "Original", image: "/media/original.jpg" }],
      [{ title: "Pessoa", text: "Coleção" }],
    )
    expect(differences.map(({ field }) => field)).toEqual(["text", "image"])
    expect(differences[1]).toMatchObject({
      position: 1,
      before: '"/media/original.jpg"',
      after: "(ausente)",
    })
  })
  it("evidencia itens adicionados, removidos ou reordenados", () => {
    const current = [{ title: "Primeiro" }, { title: "Segundo" }]
    expect(compareCollectionItemChanges(current, [{ title: "Segundo" }])).toEqual([
      { position: 1, field: "title", before: '"Primeiro"', after: '"Segundo"' },
      { position: 2, field: "title", before: '"Segundo"', after: "(ausente)" },
    ])
    expect(current[0].title).toBe("Primeiro")
  })
  it("não solicita aprovação quando os campos coincidem", () => {
    expect(
      compareCollectionItemChanges(
        [{ title: "Card", text: "Correto", toolIcons: ["analytics"] }],
        [{ title: "Card", text: "Correto", toolIcons: ["analytics"] }],
      ),
    ).toEqual([])
  })

  it("sinaliza as seis divergências do piloto Formação/A sem modificar o texto atual", () => {
    // Snapshot editorial publicado, somente como fixture; não é autorização
    // para migrar o bloco 1bc36dc9-c301-4873-8c53-21c3e048737b.
    const manual = [
      { title: "Comunicação Social — Jornalismo", label: "Graduação", meta: "UFRN · 2007–2012" },
      { title: "Comunicação Integrada e Marketing Digital", label: "Pós-graduação", meta: "UnP · 2013" },
      { title: "Marketing Digital, BI e Estratégia Data Driven", label: "MBA", meta: "PUCRS · 2020–2021" },
    ]
    const original = structuredClone(manual)
    const proposed = collectionToItems("education", [
      {
        status: "published",
        sort_order: 1,
        course: "Comunicação Social — Jornalismo",
        degree_type: "Graduação",
        institution: "Universidade Federal do Rio Grande do Norte (UFRN)",
        start_date: "2007",
        end_date: "2012",
      },
      {
        status: "published",
        sort_order: 2,
        course: "Comunicação Integrada e Marketing Digital",
        degree_type: "Pós-graduação",
        institution: "Universidade Potiguar (UnP)",
        start_date: "2013",
        end_date: "2013",
      },
      {
        status: "published",
        sort_order: 3,
        course: "Marketing Digital, BI e Estratégia Data Driven",
        degree_type: "MBA",
        institution: "Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)",
        start_date: "2020",
        end_date: "2021",
      },
    ])
    const changes = compareCollectionItemChanges(manual, proposed)
    expect(proposed.map((item) => item.title)).toEqual(manual.map((item) => item.title))
    expect(proposed.map((item) => item.label)).toEqual(manual.map((item) => item.label))
    expect(changes.map((change) => [change.position, change.field])).toEqual([
      [1, "meta"], [1, "text"], [2, "meta"], [2, "text"], [3, "meta"], [3, "text"],
    ])
    expect(manual).toEqual(original)
  })
})
