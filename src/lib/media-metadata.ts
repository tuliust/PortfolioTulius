import { mediaFileName } from "./media-framing"

export type StoredMediaMetadata = {
  storage_path: string
  title?: string | null
  alt_text?: string | null
  credit?: string | null
  focal_point?: { x?: number; y?: number } | null
}

export type MediaMetadataDraft = {
  title: string
  altText: string
  credit: string
  focalX: string
  focalY: string
}

export function mediaDisplayTitle(asset: StoredMediaMetadata) {
  return asset.title?.trim() || mediaFileName(asset.storage_path)
}

function focalValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100
    ? value
    : 50
}

export function createMediaMetadataDraft(asset: StoredMediaMetadata): MediaMetadataDraft {
  return {
    title: mediaDisplayTitle(asset),
    altText: asset.alt_text ?? "",
    credit: asset.credit ?? "",
    focalX: String(focalValue(asset.focal_point?.x)),
    focalY: String(focalValue(asset.focal_point?.y)),
  }
}

export function hasMediaMetadataChanges(
  asset: StoredMediaMetadata,
  draft: MediaMetadataDraft,
) {
  const previous = createMediaMetadataDraft(asset)
  return (Object.keys(previous) as (keyof MediaMetadataDraft)[]).some(
    (key) => draft[key] !== previous[key],
  )
}

export function buildMediaMetadataPayload(draft: MediaMetadataDraft):
  | {
      ok: true
      payload: {
        title: string
        alt_text: string
        credit: string | null
        focal_point: { x: number; y: number }
      }
    }
  | { ok: false; error: string } {
  const title = draft.title.trim()
  if (title.length < 2 || title.length > 180) {
    return { ok: false, error: "Informe um título editorial de 2 a 180 caracteres." }
  }
  if (draft.altText.length > 500 || draft.credit.length > 300) {
    return { ok: false, error: "Texto alternativo ou crédito acima do limite permitido." }
  }
  const validPoint = (value: string) =>
    value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100
  if (!validPoint(draft.focalX) || !validPoint(draft.focalY)) {
    return { ok: false, error: "O ponto focal deve ficar entre 0% e 100%." }
  }
  return {
    ok: true,
    payload: {
      title,
      alt_text: draft.altText.trim(),
      credit: draft.credit.trim() || null,
      focal_point: { x: Number(draft.focalX), y: Number(draft.focalY) },
    },
  }
}
