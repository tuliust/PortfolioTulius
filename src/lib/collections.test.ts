import { describe, it, expect } from "vitest"
import { collectionToItems, isCollectionSource, resolveCollectionBlocks } from "./collections"
import type { ContentBlockRow } from "./placements"
import type { CollectionSource } from "./collections"
import type { ContentItem } from "../types/content"

describe("fontes de coleção editoriais", () => {
  it("valida as fontes permitidas", () => {
    expect(isCollectionSource("metrics")).toBe(true)
    expect(isCollectionSource("admin_users")).toBe(false)
  })

  it("mapeia os nove contratos de campos do acervo para cards sem escrever nos blocos", () => {
    const fixtures: {
      source: CollectionSource
      row: Record<string, unknown>
      expected: Partial<ContentItem>
    }[] = [
      {
        source: "career_experiences",
        row: { company: "Invest RS", role: "Direção", description: "Texto", location: "RS" },
        expected: { title: "Invest RS", label: "Direção", text: "Texto", meta: "RS" },
      },
      {
        source: "portfolio_projects",
        row: { title: "Projeto", summary: "Resumo", project_status: "Concluído" },
        expected: { title: "Projeto", text: "Resumo", meta: "Concluído" },
      },
      {
        source: "metrics",
        row: { label: "Alcance", value_text: "120", unit: "%", context: "Ano" },
        expected: { title: "Alcance", value: "120", meta: "%", text: "Ano" },
      },
      {
        source: "skills",
        row: { name: "Estratégia", category: "Planejamento" },
        expected: { title: "Estratégia", text: "Planejamento" },
      },
      {
        source: "education",
        row: {
          course: "Comunicação",
          degree_type: "Bacharelado",
          institution: "Instituição",
          start_date: "2010",
          end_date: "2014",
        },
        expected: {
          title: "Comunicação",
          label: "Bacharelado",
          text: "Instituição",
          meta: "2010 — 2014",
        },
      },
      {
        source: "language_levels",
        row: { language: "Português", level_label: "Nativo", evidence_note: "Uso diário" },
        expected: { title: "Português", text: "Nativo", meta: "Uso diário" },
      },
      {
        source: "tool_categories",
        row: { title: "Dados", tools: [{ name: "Planilhas" }, { name: "Indicadores" }] },
        expected: { title: "Dados", text: "Planilhas · Indicadores" },
      },
      {
        source: "testimonials",
        row: { author_name: "Pessoa", author_role: "Cargo", quote_text: "Depoimento" },
        expected: { title: "Pessoa", meta: "Cargo", text: "Depoimento" },
      },
      {
        source: "contact_channels",
        row: { label: "Site", value: "Acessar", url: "https://example.com/" },
        expected: { title: "Site", text: "Acessar", meta: "https://example.com/" },
      },
    ]

    for (const { source, row, expected } of fixtures) {
      const records = [{ ...row, status: "published", sort_order: 1 }]
      expect(collectionToItems(source, records)[0]).toMatchObject(expected)
      expect(records[0]).toHaveProperty("status", "published")
    }
  })

  it("somente registros publicados, ordenados e sem notas privadas", () => {
    const items = collectionToItems("metrics", [
      {
        label: "Segundo",
        value_text: "2",
        sort_order: 2,
        status: "published",
        editorial_note: "interno",
      },
      { label: "Rascunho", value_text: "9", sort_order: 0, status: "draft" },
      { label: "Primeiro", value_text: "1", sort_order: 1, status: "published" },
    ])
    expect(items.map((item) => item.title)).toEqual(["Primeiro", "Segundo"])
    expect(items[0]).not.toHaveProperty("editorial_note")
  })

  it("filtra URLs não seguras sem copiar a coleção para os blocos", () => {
    const items = collectionToItems("contact_channels", [
      { label: "Contato", url: "javascript:alert(1)", value: "Texto", status: "published" },
    ])
    expect(items).toEqual([{ title: "Contato", text: "Texto", meta: "" }])
  })

  it("converte depoimentos e ferramentas em cards existentes", () => {
    const quote = collectionToItems("testimonials", [
      { author_name: "Pessoa", quote_text: "Depoimento", status: "published" },
    ])
    const tools = collectionToItems("tool_categories", [
      { title: "Análise", tools: [{ name: "Planilhas" }, { name: "Dados" }], status: "published" },
    ])
    expect(quote[0].text).toBe("Depoimento")
    expect(tools[0].text).toBe("Planilhas · Dados")
  })
  it("preserva cards manuais sem vínculo e nunca os altera ao resolver coleção", () => {
    const manual: ContentBlockRow = {
      id: "block",
      section_id: "section",
      sort_order: 1,
      mobile_panel: "a",
      status: "published",
      content_json: { items: [{ title: "Manual" }] },
    }
    const linked: ContentBlockRow = {
      ...manual,
      id: "linked",
      content_json: {
        items: [{ title: "Versão editorial original" }],
        source_collection: "metrics",
      },
    }
    const resolved = resolveCollectionBlocks(
      [manual, linked],
      new Map<CollectionSource, ContentItem[]>([["metrics", [{ title: "Coleção atualizada" }]]]),
    )
    expect(resolved[0]).toEqual(manual)
    expect(resolved[1].content_json?.items?.[0].title).toBe("Coleção atualizada")
    expect(linked.content_json?.items?.[0].title).toBe("Versão editorial original")
    expect(
      resolveCollectionBlocks([linked], new Map<CollectionSource, ContentItem[]>())[0].content_json
        ?.items,
    ).toEqual([{ title: "Versão editorial original" }])
    expect(
      resolveCollectionBlocks(
        [linked],
        new Map<CollectionSource, ContentItem[]>([["metrics", []]]),
      )[0].content_json?.items,
    ).toEqual([])
  })
  it("distribui os depoimentos em dois painéis preservando fotos e blocos manuais", () => {
    const records: ContentItem[] = [
      { title: "Pessoa A", text: "A" },
      { title: "Pessoa B", text: "B" },
      { title: "Pessoa C", text: "C" },
      { title: "Exemplo fictício 01", text: "D" },
      { title: "Exemplo fictício 02", text: "E" },
    ]
    const a: ContentBlockRow = {
      id: "a",
      section_id: "depoimentos",
      sort_order: 1,
      mobile_panel: "a",
      status: "published",
      content_json: {
        source_collection: "testimonials",
        collection_start: 0,
        collection_limit: 2,
        items: [{ title: "Pessoa A", image: "/media/pessoa-a.jpg", alt: "Pessoa A" }],
      },
    }
    const b: ContentBlockRow = {
      ...a,
      id: "b",
      mobile_panel: "b",
      content_json: {
        source_collection: "testimonials",
        collection_start: 2,
        items: [{ title: "Pessoa C", image: "/media/pessoa-c.jpg", alt: "Pessoa C" }],
      },
    }
    const result = resolveCollectionBlocks(
      [a, b],
      new Map<CollectionSource, ContentItem[]>([["testimonials", records]]),
    )
    expect(result[0].content_json?.items?.map((item) => item.title)).toEqual([
      "Pessoa A",
      "Pessoa B",
    ])
    expect(result[1].content_json?.items?.map((item) => item.title)).toEqual([
      "Pessoa C",
      "Exemplo fictício 01",
      "Exemplo fictício 02",
    ])
    expect(result[0].content_json?.items?.[0].image).toBe("/media/pessoa-a.jpg")
    expect(result[1].content_json?.items?.[0].image).toBe("/media/pessoa-c.jpg")
    expect(a.content_json?.items).toHaveLength(1)
  })

  it("preserva três depoimentos e fotografias originais quando a fonte falha", () => {
    const original: ContentBlockRow = {
      id: "a",
      section_id: "depoimentos",
      sort_order: 1,
      mobile_panel: "a",
      status: "published",
      content_json: {
        source_collection: "testimonials",
        collection_start: 0,
        collection_limit: 2,
        items: [
          { title: "Matheus", image: "/media/matheus.jpg", text: "Texto editorial A" },
          { title: "Ana", image: "/media/ana.jpg", text: "Texto editorial B" },
        ],
      },
    }
    const second: ContentBlockRow = {
      ...original,
      id: "b",
      mobile_panel: "b",
      content_json: {
        source_collection: "testimonials",
        collection_start: 2,
        items: [{ title: "Fábio", image: "/media/fabio.jpg", text: "Texto editorial C" }],
      },
    }
    const snapshot = structuredClone([original, second])
    const missing = resolveCollectionBlocks([original, second], new Map())
    expect(missing).toEqual(snapshot)
    expect(missing.flatMap((block) => block.content_json?.items ?? []).map((item) => item.image)).toEqual([
      "/media/matheus.jpg",
      "/media/ana.jpg",
      "/media/fabio.jpg",
    ])
    const loadedEmpty = resolveCollectionBlocks(
      [original, second],
      new Map<CollectionSource, ContentItem[]>([["testimonials", []]]),
    )
    expect(loadedEmpty.every((block) => block.content_json?.items?.length === 0)).toBe(true)
    expect([original, second]).toEqual(snapshot)
  })
})
