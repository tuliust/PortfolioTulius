/** Ignore malformed CMS tokens and enforce a bounded, safe CSS length. */
export function parseCardRadius(value: string): number {
  const parsed = Number(value)
  if (!value.trim() || !Number.isFinite(parsed)) return 4
  return Math.min(32, Math.max(0, parsed))
}

/**
 * Build the saved DesignEditor baseline even when design_tokens has no rows.
 * Only actual query errors should prevent the editor from becoming ready.
 */
export function hydrateDesignTokens<T extends Record<string, string>>(
  defaultTokens: T,
  defaultExtraTokens: Record<string, string>,
  rows: ReadonlyArray<{ token_key: string; token_value: string }>,
): { tokens: T; extraTokens: Record<string, string>; savedDesign: string } {
  const tokens = { ...defaultTokens }
  const extraTokens = { ...defaultExtraTokens }
  for (const { token_key, token_value } of rows) {
    if (token_key.startsWith("color.")) {
      const key = token_key.slice("color.".length)
      if (Object.prototype.hasOwnProperty.call(tokens, key)) {
        (tokens as Record<string, string>)[key] = token_value
      }
    } else {
      extraTokens[token_key] = token_value
    }
  }
  return { tokens, extraTokens, savedDesign: JSON.stringify({ tokens, extraTokens }) }
}
