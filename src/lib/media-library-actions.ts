import { supabase } from "./supabase"
import { mediaFileName } from "./media-framing"
import { stagePrivateMediaChange } from "./media-operations"

export type PrivateMediaAsset = {
  id: string
  storage_bucket: string
  storage_path: string
  mime_type: string | null
}

type MediaAction = { ok: boolean; message: string; warning?: string }

export async function uploadPublishedMedia(file: File): Promise<MediaAction> {
  const client = supabase
  if (!client) return { ok: false, message: "Supabase não está configurado." }
  if (
    !["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type) ||
    file.size > 8_000_000
  )
    return { ok: false, message: "Use JPG, PNG, WebP ou SVG de até 8 MB." }
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
  const result = await stagePrivateMediaChange({
    stage: () =>
      client.storage.from("portfolio-public").upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      }),
    persist: async () =>
      client.from("media_assets").insert({
        storage_bucket: "portfolio-public",
        storage_path: path,
        mime_type: file.type,
        file_size: file.size,
        alt_text: "",
        title: file.name.trim() || mediaFileName(path),
        status: "published",
      }),
    undoStage: () => client.storage.from("portfolio-public").remove([path]),
  })
  return {
    ok: result.ok,
    message: result.ok
      ? "Mídia enviada e publicada automaticamente na biblioteca pública."
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

  // A timeout may happen after Postgres has committed. Never delete the
  // freshly copied public object until a subsequent catalog read proves the
  // row still points to its private source.
  let writeError: string | null = null
  try {
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
    writeError = update.error?.message ?? (update.data?.id ? null : "Gravação não confirmada.")
  } catch (error) {
    writeError = String(error)
  }
  if (writeError) {
    let current: { storage_bucket: string; storage_path: string; status: string } | null = null
    try {
      const rechecked = await client
        .from("media_assets")
        .select("storage_bucket,storage_path,status")
        .eq("id", asset.id)
        .maybeSingle()
      if (!rechecked.error) current = rechecked.data
    } catch {
      // Unknown result is safer than deleting a possibly published object.
    }
    const confirmedPublished =
      current?.storage_bucket === "portfolio-public" &&
      current?.storage_path === asset.storage_path &&
      current?.status === "published"
    if (!confirmedPublished) {
      const definitelyPrivate =
        current?.storage_bucket === "portfolio-private" &&
        current?.storage_path === asset.storage_path
      if (!definitelyPrivate)
        return {
          ok: false,
          message:
            writeError +
            " A publicação não pôde ser confirmada. A cópia pública foi preservada para reconciliação; recarregue o catálogo antes de tentar novamente.",
        }
      try {
        const cleanup = await client.storage.from("portfolio-public").remove([asset.storage_path])
        return {
          ok: false,
          message:
            writeError +
            (cleanup.error
              ? " Atenção: a cópia pública precisa de remoção manual."
              : " Cópia pública revertida após confirmação de que o catálogo segue privado."),
        }
      } catch (error) {
        return {
          ok: false,
          message: writeError + " Atenção: remoção da cópia pública não confirmada: " + String(error),
        }
      }
    }
  }
  // The catalog now points at the public object. Keep no unreferenced
  // private duplicate after publication; report an explicit clean-up warning
  // rather than treating a successful DB transition as a failed publish.
  try {
    const cleanup = await client.storage.from("portfolio-private").remove([asset.storage_path])
    if (cleanup.error)
      return {
        ok: true,
        message: "Mídia disponibilizada no site após publicação explícita.",
        warning: "Atenção: a cópia privada não pôde ser removida: " + cleanup.error.message,
      }
  } catch (error) {
    return {
      ok: true,
      message: "Mídia disponibilizada no site após publicação explícita.",
      warning: "Atenção: exclusão da cópia privada não confirmada: " + String(error),
    }
  }
  return { ok: true, message: "Mídia disponibilizada no site após publicação explícita." }
}
