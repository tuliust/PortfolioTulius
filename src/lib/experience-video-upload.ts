import { supabase } from "./supabase"
import { stagePrivateMediaChange } from "./media-operations"
import { EXPERIENCE_VIDEO_BUCKET, validateExperienceVideoFile } from "./experience-video"

type VideoUploadResult =
  | { ok: true; path: string; message: string }
  | { ok: false; message: string }

/** Explicit public upload by an authenticated administrator; no URL input. */
export async function uploadExperienceVideo(file: File): Promise<VideoUploadResult> {
  const client = supabase
  if (!client) return { ok: false, message: "Supabase não está configurado." }
  const invalid = validateExperienceVideoFile(file)
  if (invalid) return { ok: false, message: invalid }
  const path = crypto.randomUUID() + ".mp4"
  const read = () =>
    client
      .from("media_assets")
      .select("id,status,mime_type")
      .eq("storage_bucket", EXPERIENCE_VIDEO_BUCKET)
      .eq("storage_path", path)
      .maybeSingle()
  const result = await stagePrivateMediaChange({
    stage: () =>
      client.storage.from(EXPERIENCE_VIDEO_BUCKET).upload(path, file, {
        contentType: "video/mp4",
        cacheControl: "3600",
        upsert: false,
      }),
    persist: async () =>
      await client.from("media_assets").insert({
        storage_bucket: EXPERIENCE_VIDEO_BUCKET,
        storage_path: path,
        mime_type: "video/mp4",
        file_size: file.size,
        alt_text: "",
        title: file.name.trim().slice(0, 180),
        status: "published",
      }),
    reconcile: async () => {
      const result = await read()
      if (result.error) return "unknown"
      if (!result.data) return "unchanged"
      return result.data.status === "published" && result.data.mime_type === "video/mp4"
        ? "committed"
        : "unknown"
    },
    undoStage: () => client.storage.from(EXPERIENCE_VIDEO_BUCKET).remove([path]),
  })
  if (!result.ok) return { ok: false, message: result.message }
  try {
    const checked = await read()
    if (
      checked.error ||
      checked.data?.status !== "published" ||
      checked.data?.mime_type !== "video/mp4"
    )
      return {
        ok: false,
        message: "Cadastro não confirmado. O arquivo foi preservado; confira a biblioteca.",
      }
  } catch {
    return { ok: false, message: "Cadastro não confirmado. O arquivo foi preservado." }
  }
  return { ok: true, path, message: "Vídeo enviado. Salve o projeto para vinculá-lo ao slide." }
}
