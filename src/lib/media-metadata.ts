import { mediaFileName } from "./media-framing"

export type StoredMediaMetadata = {
  storage_path: string
  title?: string | null
  alt_text?: string | null
  focal_point?: { x?: number; y?: number; zoom?: number } | null
}

export type MediaMetadataDraft = {
  title: string
  altText: string
  focalX: string
  focalY: string
  focalZoom: string
  fileName: string
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
    focalX: String(focalValue(asset.focal_point?.x)),
    focalY: String(focalValue(asset.focal_point?.y)),
    focalZoom: String(
      typeof asset.focal_point?.zoom === "number" &&
        asset.focal_point.zoom >= 1 &&
        asset.focal_point.zoom <= 3
        ? asset.focal_point.zoom
        : 1,
    ),
    fileName: mediaFileName(asset.storage_path),
  }
}

export function hasMediaMetadataChanges(asset: StoredMediaMetadata, draft: MediaMetadataDraft) {
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
        focal_point: { x: number; y: number; zoom: number }
      }
    }
  | { ok: false; error: string } {
  const title = draft.title.trim()
  if (title.length < 2 || title.length > 180) {
    return { ok: false, error: "Informe um título editorial de 2 a 180 caracteres." }
  }
  if (draft.altText.length > 500) {
    return { ok: false, error: "Texto alternativo acima do limite permitido." }
  }
  const validPoint = (value: string) =>
    value.trim() !== "" &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 100
  if (!validPoint(draft.focalX) || !validPoint(draft.focalY)) {
    return { ok: false, error: "O ponto focal deve ficar entre 0% e 100%." }
  }
  const zoom = Number(draft.focalZoom)
  if (draft.focalZoom.trim() === "" || !Number.isFinite(zoom) || zoom < 1 || zoom > 3) {
    return { ok: false, error: "Zoom deve estar entre 100% e 300%." }
  }
  return {
    ok: true,
    payload: {
      title,
      alt_text: draft.altText.trim(),
      focal_point: { x: Number(draft.focalX), y: Number(draft.focalY), zoom },
    },
  }
}

export function validatePrivateMediaFileName(
  name: string,
  existing: string,
): { ok: true; fileName: string } | { ok: false; error: string } {
  const candidate = name.trim()
  if (
    candidate.length < 3 ||
    candidate.length > 180 ||
    candidate === "." ||
    candidate === ".." ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(candidate)
  ) {
    return {
      ok: false,
      error: "Use até 180 caracteres, sem espaços, barras ou símbolos especiais.",
    }
  }
  const extension = (value: string) => value.match(/\.[^.]+$/)?.[0]?.toLowerCase() ?? ""
  if (extension(candidate) !== extension(existing)) {
    return { ok: false, error: "Mantenha a extensão original do arquivo." }
  }
  return { ok: true, fileName: candidate }
}
