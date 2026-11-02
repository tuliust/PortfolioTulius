import { describe, expect, it } from "vitest"
import {
  buildMediaMetadataPayload,
  createMediaMetadataDraft,
  hasMediaMetadataChanges,
  mediaDisplayTitle,
} from "./media-metadata"

const asset = {
  storage_path: "private/uuid-portrait.png",
  title: "Retrato editorial do Perfil",
  alt_text: "Retrato de Tulius",
  credit: "Fotografia enviada pelo proprietário",
  focal_point: { x: 45, y: 60 },
}

describe("metadata editor without changing physical media references", () => {
  it("uses the editorial title and keeps the filename as a fallback", () => {
    expect(mediaDisplayTitle(asset)).toBe("Retrato editorial do Perfil")
    expect(mediaDisplayTitle({ storage_path: "folder/photo.png", title: "" })).toBe("photo.png")
  })

  it("preserves existing description, credit and focal point", () => {
    const draft = createMediaMetadataDraft(asset)
    expect(hasMediaMetadataChanges(asset, draft)).toBe(false)
    expect(buildMediaMetadataPayload(draft)).toEqual({
      ok: true,
      payload: {
        title: asset.title,
        alt_text: asset.alt_text,
        credit: asset.credit,
        focal_point: { x: 45, y: 60 },
      },
    })
    expect(hasMediaMetadataChanges(asset, { ...draft, title: "Outro título" })).toBe(true)
  })

  it("does not write paths, status or bucket in the metadata payload", () => {
    const result = buildMediaMetadataPayload(createMediaMetadataDraft(asset))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.payload).not.toHaveProperty("storage_path")
      expect(result.payload).not.toHaveProperty("storage_bucket")
      expect(result.payload).not.toHaveProperty("status")
    }
  })

  it("rejects blank titles and invalid focal coordinates", () => {
    const draft = createMediaMetadataDraft(asset)
    expect(buildMediaMetadataPayload({ ...draft, title: " " }).ok).toBe(false)
    expect(buildMediaMetadataPayload({ ...draft, focalX: "" }).ok).toBe(false)
    expect(buildMediaMetadataPayload({ ...draft, focalY: "101" }).ok).toBe(false)
    expect(buildMediaMetadataPayload({ ...draft, focalY: "NaN" }).ok).toBe(false)
  })
})
