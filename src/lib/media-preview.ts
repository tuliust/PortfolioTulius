import type { SupabaseClient } from "@supabase/supabase-js"

export type MediaPreview = { url?: string; error?: string }

export async function resolveMediaPreview(
  storage: SupabaseClient["storage"],
  asset: { storage_bucket: string; storage_path: string },
): Promise<MediaPreview> {
  if (!asset.storage_path) return { error: "Arquivo sem caminho de armazenamento." }
  if (asset.storage_bucket === "portfolio-public" || asset.storage_bucket === "portfolio-videos") {
    const { data } = storage.from(asset.storage_bucket).getPublicUrl(asset.storage_path)
    return data.publicUrl ? { url: data.publicUrl } : { error: "URL pública indisponível." }
  }
  if (asset.storage_bucket === "portfolio-private") {
    try {
      // The authenticated admin receives a temporary preview, never a public URL.
      const { data, error } = await storage
        .from("portfolio-private")
        .createSignedUrl(asset.storage_path, 3600)
      if (error) return { error: `Não foi possível abrir a prévia: ${error.message}` }
      return data?.signedUrl
        ? { url: data.signedUrl }
        : { error: "Link privado da prévia indisponível." }
    } catch {
      return { error: "Falha ao solicitar a prévia privada." }
    }
  }
  return { error: "Bucket de mídia não reconhecido." }
}
