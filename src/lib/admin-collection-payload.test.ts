import { describe, it, expect } from "vitest"
import {
  buildCollectionSavePayload,
  normalizeCollectionRecord,
  isUnpublishOnlyCollection,
} from "./admin-collection-payload"

describe("Campos do acervo ao salvar", () => {
  it("não introduz tools_text em experiências ou outras coleções", () => {
    const original = { id: "1", company: "Invest RS", sort_order: 1, updated_at: "2026-10-30" }
    const normalized = normalizeCollectionRecord(original, "career_experiences")
    expect(normalized).toEqual(original)
    const payload = buildCollectionSavePayload(
      { ...normalized, tools_text: "" },
      "career_experiences",
    )
    expect(payload).toEqual({ company: "Invest RS", sort_order: 1 })
    expect(original.id).toBe("1")
  })
  it("mantém tools como JSONB somente na coleção Ferramentas", () => {
    const normalized = normalizeCollectionRecord(
      {
        id: "2",
        title: "Editor",
        tools: [{ name: "React" }, { name: "Vite" }],
        sort_order: 1,
      },
      "tool_categories",
    )
    expect(normalized.tools_text).toBe("React\nVite")
    expect(buildCollectionSavePayload(normalized, "tool_categories")).toEqual({
      title: "Editor",
      tools: [{ name: "React" }, { name: "Vite" }],
      sort_order: 1,
    })
  })
  it("não envia o estado archived a tabelas que não o aceitam", () => {
    expect(isUnpublishOnlyCollection("skills")).toBe(true)
    expect(isUnpublishOnlyCollection("tool_categories")).toBe(true)
    expect(isUnpublishOnlyCollection("contact_channels")).toBe(true)
    expect(isUnpublishOnlyCollection("testimonials")).toBe(false)
    expect(isUnpublishOnlyCollection("career_experiences")).toBe(false)
  })

  it("não altera o input original e remove campos de interface", () => {
    const draft = { id: "3", updated_at: "today", tools_text: "x", status: "draft" }
    expect(buildCollectionSavePayload(draft, "skills")).toEqual({ status: "draft" })
    expect(draft.tools_text).toBe("x")
  })
})
