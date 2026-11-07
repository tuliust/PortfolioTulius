/** Keep the CMS title as the source of the monumental name and header wordmark. */
export function splitProfileTitle(title?: string | null) {
  const parts = (title ?? "").trim().split(/\s+/).filter(Boolean)
  return {
    first: (parts[0] || "Tulius").toLocaleUpperCase("pt-BR"),
    rest: (parts.slice(1).join(" ") || "Tsangaropulos").toLocaleUpperCase("pt-BR"),
  }
}
