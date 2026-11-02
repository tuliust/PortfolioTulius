/** Keep CMS-only presentation fields out of the Supabase Data API payload. */
export function normalizeCollectionRecord<T extends Record<string, any>>(
  record: T,
  table: string,
): T & { tools_text?: string } {
  if (table !== "tool_categories") return { ...record }
  return {
    ...record,
    tools_text: Array.isArray(record.tools)
      ? record.tools
          .map((tool: { name?: string } | string) =>
            typeof tool === "string" ? tool : (tool.name ?? ""),
          )
          .join("\n")
      : "",
  }
}

export function buildCollectionSavePayload(draft: Record<string, any>, table: string) {
  const payload = { ...draft }
  delete payload.id
  delete payload.updated_at
  delete payload.tools_text
  if (table === "tool_categories") {
    payload.tools = String(draft.tools_text ?? "")
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name }))
  }
  return payload
}

/** Some CMS collections have only draft/published status in the database. */
export function isUnpublishOnlyCollection(table: string): boolean {
  return ["skills", "tool_categories", "contact_channels"].includes(table)
}

/** Restrict invalid CMS states and required fields before any Data API write. */
const REQUIRED_FIELDS: Record<string, string[]> = {
  career_experiences: ["company", "role"],
  portfolio_projects: ["title"],
  metrics: ["label", "value_text"],
  skills: ["name", "category"],
  education: ["institution", "course"],
  language_levels: ["language", "level_label"],
  tool_categories: ["title"],
  testimonials: ["author_name", "quote_text"],
  contact_channels: ["channel_type", "label", "value"],
}

export const CONTACT_CHANNEL_TYPES = [
  "whatsapp",
  "email",
  "linkedin",
  "location",
  "website",
] as const

export function validateCollectionSaveDraft(
  draft: Record<string, unknown>,
  table: string,
): string[] {
  const problems: string[] = []
  for (const field of REQUIRED_FIELDS[table] ?? []) {
    if (typeof draft[field] !== "string" || !draft[field].trim()) {
      problems.push(`Campo obrigatório não preenchido: ${field}.`)
    }
  }
  if (
    typeof draft.sort_order !== "number" ||
    !Number.isInteger(draft.sort_order) ||
    draft.sort_order < 1
  ) {
    problems.push("A ordem precisa ser um número inteiro maior que zero.")
  }
  const allowedStatuses = isUnpublishOnlyCollection(table)
    ? ["draft", "published"]
    : ["draft", "in_review", "published", "archived"]
  if (draft.status != null && !allowedStatuses.includes(String(draft.status))) {
    problems.push("Este status não é aceito para a coleção.")
  }
  if (
    table === "contact_channels" &&
    typeof draft.channel_type === "string" &&
    draft.channel_type.trim() !== "" &&
    !(CONTACT_CHANNEL_TYPES as readonly string[]).includes(draft.channel_type)
  ) {
    problems.push("Tipo de contato não reconhecido.")
  }
  if (table === "contact_channels" && typeof draft.url === "string" && draft.url.trim()) {
    const url = draft.url.trim()
    const isMailto = /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(url)
    let isHttps = false
    try {
      isHttps = new URL(url).protocol === "https:"
    } catch {
      // Invalid URLs are never written to a contact record.
    }
    if (!isMailto && !isHttps) {
      problems.push("A URL de contato precisa usar HTTPS ou um endereço mailto válido.")
    }
  }
  return problems
}
