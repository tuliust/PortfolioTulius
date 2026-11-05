import { supabase } from "./supabase"

export type DeletableMediaAsset = {
  id: string
  storage_bucket: string
  storage_path: string
  updated_at: string
}

/** The metadata transaction runs first; physical removal is reported separately. */
export async function runMediaDeletion(
  removeReferences: () => Promise<{ error: { message: string } | null }>,
  removeFile: () => Promise<{ error: { message: string } | null }>,
): Promise<{ ok: boolean; databaseDeleted: boolean; message: string }> {
  try {
    const db = await removeReferences()
    if (db.error) {
      return {
        ok: false,
        databaseDeleted: false,
        message: "Não foi possível remover as referências: " + db.error.message,
      }
    }
  } catch (error) {
    return {
      ok: false,
      databaseDeleted: false,
      message: "Falha ao remover referências: " + String(error),
    }
  }
  try {
    const storage = await removeFile()
    if (storage.error) {
      return {
        ok: false,
        databaseDeleted: true,
        message:
          "Referências e registro removidos do Supabase, mas não foi possível excluir o arquivo físico do Storage: " +
          storage.error.message +
          ". Solicite a limpeza do objeto remanescente.",
      }
    }
    return {
      ok: true,
      databaseDeleted: true,
      message: "Imagem removida da biblioteca, das referências do site e do Storage.",
    }
  } catch (error) {
    return {
      ok: false,
      databaseDeleted: true,
      message:
        "Registro removido, mas a exclusão física não foi confirmada: " + String(error),
    }
  }
}

/** Run only after explicit confirmation by an authenticated administrator. */
export async function deleteMediaAssetEverywhere(asset: DeletableMediaAsset) {
  if (
    !supabase ||
    !asset.id ||
    !asset.storage_path ||
    !["portfolio-public", "portfolio-private"].includes(asset.storage_bucket)
  ) {
    return {
      ok: false,
      databaseDeleted: false,
      message: "Dados insuficientes para remover a mídia.",
    }
  }
  // Two approved public portraits are still referenced directly by the
  // shipped React code and optimised static assets, beyond editable CMS JSON.
  // Refuse deletion until those code references have been migrated too.
  const staticPortraits = [
    "b171afda-2708-44eb-b3e5-ab2b7ff13236-tulius_site.png",
    "a46a4091-bce1-4345-a17f-7d7947a8e903-tulius_tablet.png",
  ]
  if (asset.storage_bucket === "portfolio-public" &&
      staticPortraits.some((name) => asset.storage_path.endsWith(name))) {
    return {
      ok: false,
      databaseDeleted: false,
      message: "Esta imagem integra arquivos estáticos e componentes do site. Substitua primeiro as referências fixas no código antes de excluí-la.",
    }
  }
  const client = supabase
  return runMediaDeletion(
    async () => {
      const { error } = await client.rpc("delete_media_asset_everywhere", {
        p_media_id: asset.id,
        p_expected_updated_at: asset.updated_at,
      })
      return { error }
    },
    async () => {
      const { error } = await client.storage.from(asset.storage_bucket).remove([asset.storage_path])
      return { error }
    },
  )
}
