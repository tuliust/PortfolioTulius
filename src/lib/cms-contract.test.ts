import { describe, expect, it } from "vitest"
import type { ContentBlockRow } from "./placements"
import { selectSectionExperienceMedia } from "./cms-contract"

const blocks: ContentBlockRow[] = [
  {
    id: "draft",
    section_id: "experience",
    sort_order: 1,
    mobile_panel: "a",
    status: "draft",
    content_json: {
      items: [],
      experienceMedia: { logo: "/media/draft.webp", slides: [{ title: "Em revisão" }] },
    },
  },
  {
    id: "published",
    section_id: "experience",
    sort_order: 2,
    mobile_panel: "a",
    status: "published",
    content_json: {
      items: [],
      experienceMedia: { logo: "/media/published.webp", slides: [{ title: "Publicado" }] },
    },
  },
]

describe("galerias e logos no CMS público e na prévia", () => {
  it("a página pública ignora mídia ainda em rascunho", () => {
    expect(selectSectionExperienceMedia(blocks, false)?.logo).toBe("/media/published.webp")
  })
  it("a prévia autenticada consegue apresentar a galeria de um rascunho", () => {
    expect(selectSectionExperienceMedia(blocks, true)?.logo).toBe("/media/draft.webp")
  })
  it("um bloco arquivado nunca entra na seleção de mídia", () => {
    const archived = blocks.map((block) => ({ ...block, status: "archived" }))
    expect(selectSectionExperienceMedia(archived, true)).toBeUndefined()
  })
})
