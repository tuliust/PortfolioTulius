import assert from "node:assert/strict"
import { test } from "node:test"
import {
  assertIsolatedStagingDestination,
  PRODUCTION_PROJECT_REF,
} from "./p2-stage-destination.mjs"

const ref = "abcdefghijklmnopqrst"
const valid = {
  ref,
  endpoint: "https://" + ref + ".supabase.co/",
  acknowledgement: "CONFIRMO-HOMOLOGACAO-ISOLADA",
}

test("destination guard accepts an isolated test ref with exact acknowledgement", () => {
  assert.equal(assertIsolatedStagingDestination(valid), true)
})

test("destination guard denies production even with the correct acknowledgment", () => {
  assert.throws(
    () => assertIsolatedStagingDestination({
      ...valid, ref: PRODUCTION_PROJECT_REF,
      endpoint: "https://" + PRODUCTION_PROJECT_REF + ".supabase.co/",
    }),
    { message: "P2_STAGE_PRODUCTION_OR_INVALID_REF" },
  )
})

test("destination guard rejects invalid or missing refs", () => {
  for (const invalid of [undefined, "", "short", "../abcdefghijklmnop", "ABCDEFGHIJKLMNOPQRST"]) {
    assert.throws(
      () => assertIsolatedStagingDestination({ ...valid, ref: invalid }),
      { message: "P2_STAGE_PRODUCTION_OR_INVALID_REF" },
    )
  }
})

test("destination guard rejects mismatched, insecure or decorated URLs", () => {
  for (const endpoint of [
    "https://" + PRODUCTION_PROJECT_REF + ".supabase.co/",
    "https://" + ref + ".supabase.co.evil.test/",
    "http://" + ref + ".supabase.co/",
    "https://user:secret@" + ref + ".supabase.co/",
    "https://" + ref + ".supabase.co/rest/v1/",
    "https://" + ref + ".supabase.co/?x=1",
    "https://" + ref + ".supabase.co/#fragment",
    "https://" + ref + ".supabase.co:8443/",
    "invalid-url",
    undefined,
  ]) {
    assert.throws(
      () => assertIsolatedStagingDestination({ ...valid, endpoint }),
      { message: "P2_STAGE_URL_REF_MISMATCH" },
    )
  }
})

test("destination guard requires the exact independent approval phrase", () => {
  for (const acknowledgement of [undefined, "", "CONFIRMO", "CONFIRMO-HOMOLOGACAO-ISOLADA "]) {
    assert.throws(
      () => assertIsolatedStagingDestination({ ...valid, acknowledgement }),
      { message: "P2_STAGE_ACK_REQUIRED" },
    )
  }
})
