/**
 * An editorial anchor is an optional public hash alias.
 * Keep the canonical section slug intact: it is also a component routing key.
 */
export function normalizeEditorAnchor(value: string): string {
  return value.trim().toLowerCase()
}

export function validEditorAnchor(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= 64 &&
    /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value)
  )
}

export function editorAnchorError(
  value: string,
  canonicalSlug: string,
  reservedSlugs: string[],
): string | undefined {
  const normalized = normalizeEditorAnchor(value)
  if (!validEditorAnchor(normalized)) {
    return "A âncora deve começar com uma letra e conter apenas letras minúsculas, números e hífens (máximo de 64 caracteres)."
  }
  if (normalized !== canonicalSlug && reservedSlugs.includes(normalized)) {
    return "Esta âncora já é utilizada por outra seção."
  }
  return undefined
}

/** Invalid/duplicate-looking legacy values never become DOM ids. */
export function publicEditorAnchor(alias: unknown, canonicalSlug: string): string | undefined {
  if (typeof alias !== "string") return undefined
  const normalized = normalizeEditorAnchor(alias)
  if (!validEditorAnchor(normalized) || normalized === canonicalSlug) return undefined
  return normalized
}
