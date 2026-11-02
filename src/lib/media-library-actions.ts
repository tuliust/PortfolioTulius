import { supabase } from "./supabase"
import { mediaFileName } from "./media-framing"
import { stagePrivateMediaChange } from "./media-operations"

export type PrivateMediaAsset = {
  id: string
  storage_bucket: string
  storage_path: string
  mime_type: string | null
}

type MediaAction = { ok: boolean; message: string }

export async function uploadPrivateMedia(file: File): Promise<MediaAction> {
  const client = supabase
  if (!client) return { ok: false, message: "Supabase não está configurado." }
  if (
    !["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type) ||
    file.size > 8_000_000
  )
    return { ok: false, message: "Use JPG, PNG, WebP ou SVG de até 8 MB." }
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
  const result = await stagePrivateMediaChange({
    stage: () => client.storage.from("portfolio-private").upload(path, file),
    persist: async () =>
      client.from("media_assets").insert({
        storage_bucket: "portfolio-private",
        storage_path: path,
        mime_type: file.type,
        file_size: file.size,
        alt_text: "",
        title: file.name.trim() || mediaFileName(path),
        status: "published",
      }),
    undoStage: () => client.storage.from("portfolio-private").remove([path]),
  })
  return {
    ok: result.ok,
    message: result.ok
      ? "Arquivo enviado ao acervo privado. Revise e use Disponibilizar no site para publicá-lo."
      : result.message,
  }
}

export async function publishPrivateMedia(asset: PrivateMediaAsset): Promise<MediaAction> {
  const client = supabase
  if (!client) return { ok: false, message: "Supabase não está configurado." }
  if (asset.storage_bucket !== "portfolio-private")
    return { ok: false, message: "Apenas arquivos privados podem ser promovidos." }

  const { data, error } = await client.storage
    .from("portfolio-private")
    .download(asset.storage_path)
  if (error || !data) return { ok: false, message: error?.message ?? "Arquivo não encontrado." }

  const upload = await client.storage.from("portfolio-public").upload(asset.storage_path, data, {
    contentType: asset.mime_type ?? undefined,
    upsert: false,
  })
  if (upload.error) return { ok: false, message: upload.error.message }

  const update = await client
    .from("media_assets")
    .update({
      storage_bucket: "portfolio-public",
      status: "published",
    })
    .eq("id", asset.id)
    .eq("storage_bucket", "portfolio-private")
    .eq("storage_path", asset.storage_path)
    .select("id")
    .single()

  if (update.error) {
    const cleanup = await client.storage.from("portfolio-public").remove([asset.storage_path])
    return {
      ok: false,
      message:
        update.error.message +
        (cleanup.error
          ? " Atenção: a cópia pública precisa de remoção manual."
          : " Cópia pública revertida."),
    }
  }
  return { ok: true, message: "Mídia disponibilizada no site após publicação explícita." }
}
