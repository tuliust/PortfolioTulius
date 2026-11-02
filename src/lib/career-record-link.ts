/**
 * Stable editorial identities of the six existing career records.
 * A company title is editable, so it cannot be the only join key.
 * The legacy name fallback permits local fixtures and restored databases.
 * New companies need an explicit editorial link before appearing in the stack.
 */
const CAREER_ID_TO_SLUG: Record<string, string> = {
  "73235f75-d104-4213-821a-4956688a3375": "invest-rs",
  "31d0afd1-2d5c-4238-9a66-28fc6b02e001": "prefeitura-sp",
  "83b94934-af15-43ea-a1e9-125c376eddd3": "vale",
  "a5ef45bb-4347-4bd3-89ef-e35222a3d12f": "inpress",
  "d2d19ae8-0fbe-4afb-bb45-f71d02d84068": "globo-sportv",
  "9b38d29f-fb51-4fb9-9ecc-16ef28616626": "cdi",
}

const LEGACY_CAREER_NAMES: Record<string, string> = {
  "Invest RS": "invest-rs",
  "Prefeitura de São Paulo": "prefeitura-sp",
  Vale: "vale",
  "TV Globo/SporTV": "globo-sportv",
  "Grupo InPress": "inpress",
  "CDI Comunicação": "cdi",
}

export function resolveCareerSectionSlug(row: {
  id?: string | null
  company?: string | null
}): string | undefined {
  return (
    (row.id && CAREER_ID_TO_SLUG[row.id]) ||
    (row.company ? LEGACY_CAREER_NAMES[row.company] : undefined) ||
    undefined
  )
}
