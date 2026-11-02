import { assertIsolatedStagingDestination } from "./p2-stage-destination.mjs"

assertIsolatedStagingDestination({
  ref: process.env.P2_STAGE_REF,
  endpoint: process.env.P2_STAGE_URL,
  acknowledgement: process.env.P2_STAGE_CONFIRM,
})
console.log("P2_STAGING_DESTINATION_PREFLIGHT_PASS (somente validação local; sem operações de rede)")
