/** Ignore malformed CMS tokens and enforce a bounded, safe CSS length. */
export function parseCardRadius(value: string): number {
  const parsed = Number(value)
  if (!value.trim() || !Number.isFinite(parsed)) return 4
  return Math.min(32, Math.max(0, parsed))
}
