import { describe, expect, it } from "vitest"
import { compareCollectionItemChanges } from "./collection-link-review"

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
})
