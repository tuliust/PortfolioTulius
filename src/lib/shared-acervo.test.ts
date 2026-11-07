import { describe, expect, it } from "vitest"
import {
  activeAcervoSources,
  acervoUsageLabel,
  discoverAcervoUsages,
  usagesForAcervoRecord,
} from "./shared-acervo"

const sections = [
  { id: "s1", slug: "depoimentos", title: "Depoimentos", status: "published", is_visible: true },
  { id: "s2", slug: "resultados", title: "Resultados", status: "archived", is_visible: false },
]
const blocks = [
  { id: "a", section_id: "s1", mobile_panel: "a", status: "published",
    content_json: { source_collection: "testimonials", collection_start: 0, collection_limit: 2 } },
  { id: "b", section_id: "s1", mobile_panel: "b", status: "published",
    content_json: { source_collection: "testimonials", collection_start: 2 } },
  { id: "hidden", section_id: "s2", mobile_panel: "a", status: "published",
    content_json: { source_collection: "metrics" } },
  { id: "manual", section_id: "s1", mobile_panel: "a", status: "published",
    content_json: {} },
]
const records = [
  { id: "r1", status: "published", sort_order: 1 },
  { id: "draft", status: "draft", sort_order: 2 },
  { id: "r2", status: "published", sort_order: 3 },
  { id: "r3", status: "published", sort_order: 4 },
]

describe("Acervo Estruturado — vínculos reais sem duplicar seções", () => {
  it("descobre apenas fontes explícitas e filtra as publicações ativas", () => {
    const links = discoverAcervoUsages(blocks, sections)
    expect(links).toHaveLength(3)
    expect(activeAcervoSources(links)).toEqual(["testimonials"])
    expect(acervoUsageLabel(links[0])).toBe("Depoimentos · Esquerda")
  })
  it("localiza cada registro nos painéis conforme o recorte publicado", () => {
    const links = discoverAcervoUsages(blocks, sections)
    expect(usagesForAcervoRecord("testimonials", records[0], records, links).map(x => x.panel)).toEqual(["a"])
    expect(usagesForAcervoRecord("testimonials", records[2], records, links).map(x => x.panel)).toEqual(["a"])
    expect(usagesForAcervoRecord("testimonials", records[3], records, links).map(x => x.panel)).toEqual(["b"])
    expect(usagesForAcervoRecord("testimonials", records[1], records, links)).toEqual([])
  })
  it("não mostra tabelas sem fonte_collection e nem publicação oculta", () => {
    const links = discoverAcervoUsages(blocks, sections)
    expect(links.some(x => x.source === "career_experiences")).toBe(false)
    expect(usagesForAcervoRecord("metrics", {id:"m",status:"published",sort_order:1},
      [{id:"m",status:"published",sort_order:1}], links)).toEqual([])
  })
})
