import { describe, it, expect } from "vitest"
import {
  buildCollectionSavePayload,
  normalizeCollectionRecord,
  isUnpublishOnlyCollection,
  validateCollectionSaveDraft,
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

  it("bloqueia campos obrigatórios ausentes, sem depender de gravação real", () => {
    expect(
      validateCollectionSaveDraft(
        { company: "Invest RS", role: "", sort_order: 1, status: "published" },
        "career_experiences",
      ),
    ).toEqual(["Campo obrigatório não preenchido: role."])
    expect(
      validateCollectionSaveDraft(
        { label: "Resultado", value_text: "12", sort_order: 1, status: "published" },
        "metrics",
      ),
    ).toEqual([])
  })

  it("não rejeita períodos editoriais livres como datas SQL", () => {
    expect(
      validateCollectionSaveDraft(
        {
          company: "Invest RS",
          role: "Direção",
          start_date: "2020–2024",
          end_date: "Atual",
          sort_order: 1,
          status: "published",
        },
        "career_experiences",
      ),
    ).toEqual([])
  })

  it("respeita os estados permitidos e URLs seguras de contato", () => {
    expect(
      validateCollectionSaveDraft(
        { title: "Design", sort_order: 1, status: "archived" },
        "tool_categories",
      ),
    ).toContain("Este status não é aceito para a coleção.")
    expect(
      validateCollectionSaveDraft(
        {
          channel_type: "website",
          label: "Site",
          value: "Visite",
          url: "javascript:alert(1)",
          sort_order: 1,
          status: "published",
        },
        "contact_channels",
      ),
    ).toContain("A URL de contato precisa usar HTTPS ou um endereço mailto válido.")
    expect(
      validateCollectionSaveDraft(
        {
          channel_type: "email",
          label: "Email",
          value: "Contato",
          url: "mailto:contato@example.com",
          sort_order: 1,
          status: "published",
        },
        "contact_channels",
      ),
    ).toEqual([])
  })

  it("não altera o input original e remove campos de interface", () => {
    const draft = { id: "3", updated_at: "today", tools_text: "x", status: "draft" }
    expect(buildCollectionSavePayload(draft, "skills")).toEqual({ status: "draft" })
    expect(draft.tools_text).toBe("x")
  })
})
