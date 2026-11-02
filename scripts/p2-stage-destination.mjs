// Pure, fail-closed destination guard shared by manual staging tools.
// Do not weaken without separate approval; validation itself makes no network calls.
export const PRODUCTION_PROJECT_REF = "zfnrhzplwpjpdljraypt"

export function assertIsolatedStagingDestination({ ref, endpoint, acknowledgement }) {
  if (acknowledgement !== "CONFIRMO-HOMOLOGACAO-ISOLADA") {
    throw new Error("P2_STAGE_ACK_REQUIRED")
  }
  if (ref === PRODUCTION_PROJECT_REF || typeof ref !== "string" || !/^[a-z0-9]{20}$/.test(ref)) {
    throw new Error("P2_STAGE_PRODUCTION_OR_INVALID_REF")
  }
  let url
  try {
    url = new URL(endpoint)
  } catch {
    throw new Error("P2_STAGE_URL_REF_MISMATCH")
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== ref + ".supabase.co" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    url.port
  ) {
    throw new Error("P2_STAGE_URL_REF_MISMATCH")
  }
  return true
}
