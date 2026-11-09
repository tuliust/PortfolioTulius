import { useEffect, useState, type ChangeEvent } from "react"
import { supabase } from "../../lib/supabase"
import { stagePrivateMediaChange } from "../../lib/media-operations"
import { uploadPublishedMedia, publishPrivateMedia } from "../../lib/media-library-actions"
import { deleteMediaAssetEverywhere } from "../../lib/media-deletion"
import { resolveMediaPreview, type MediaPreview } from "../../lib/media-preview"
import { mediaFileName } from "../../lib/media-framing"
import {
  buildMediaMetadataPayload,
  createMediaMetadataDraft,
  hasMediaMetadataChanges,
  mediaDisplayTitle,
  validatePrivateMediaFileName,
  type MediaMetadataDraft,
  type StoredMediaMetadata,
} from "../../lib/media-metadata"
import { MediaFramingDialog } from "./MediaFramingDialog"
import { AdminNotice } from "./AdminNotice"
import { adminConfirm, adminConfirmUnsaved, registerAdminSaveAction } from "./AdminConfirmationHost"
import { Icon } from "../ui/Icons"

/** Owns catalog loading, previews, protected writes and media editor UI. */
type MediaLibraryAsset = StoredMediaMetadata & Record<string, any>

export function EnhancedMediaLibrary({
  onDirtyChange,
}: {
  onDirtyChange?: (dirty: boolean) => void
}) {
  const [assets, setAssets] = useState<MediaLibraryAsset[]>([])
  const [previews, setPreviews] = useState<Record<string, MediaPreview>>({})
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)
  const [mediaDraft, setMediaDraft] = useState<MediaMetadataDraft | null>(null)
  const [framingOpen, setFramingOpen] = useState(false)
  const [mediaBusy, setMediaBusy] = useState(false)
  const [message, setMessage] = useState("")
  const selectedAsset = assets.find((asset) => asset.id === selectedMediaId)
  const mediaDirty = Boolean(
    selectedAsset && mediaDraft && hasMediaMetadataChanges(selectedAsset, mediaDraft),
  )
  useEffect(() => onDirtyChange?.(mediaDirty), [mediaDirty, onDirtyChange])
  const load = async () => {
    const client = supabase
    if (!client) return
    const { data, error } = await client
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) {
      // A failed refresh must not discard an open unsaved draft or its preview.
      // A preceding upload may have succeeded independently of this read.
      setMessage("Falha ao atualizar o catálogo; edições em aberto preservadas. " + error.message)
      return
    }
    const nextAssets = data ?? []
    setAssets(nextAssets)
    setSelectedMediaId((current) =>
      nextAssets.some((item) => item.id === current) ? current : null,
    )
    setFailedImages({})
    const resolved = await Promise.all(
      nextAssets.map(async (asset) => ({
        id: asset.id,
        preview: await resolveMediaPreview(client.storage, asset),
      })),
    )
    setPreviews(Object.fromEntries(resolved.map(({ id, preview }) => [id, preview])))
  }
  useEffect(() => {
    void load()
  }, [])
  async function save(asset: MediaLibraryAsset): Promise<boolean> {
    if (!supabase || !mediaDraft) return false
    const client = supabase
    const result = buildMediaMetadataPayload(mediaDraft)
    if (!result.ok) {
      setMessage(result.error)
      return false
    }
    const oldName = mediaFileName(asset.storage_path)
    const renameRequested = mediaDraft.fileName.trim() !== oldName
    if (renameRequested && asset.storage_bucket !== "portfolio-private") {
      setMessage(
        "A renomeação física de mídia pública está bloqueada para preservar as URLs existentes.",
      )
      return false
    }
    const validatedName = renameRequested
      ? validatePrivateMediaFileName(mediaDraft.fileName, oldName)
      : ({ ok: true, fileName: oldName } as const)
    if (!validatedName.ok) {
      setMessage(validatedName.error)
      return false
    }
    const payload = {
      ...result.payload,
      title:
        renameRequested && result.payload.title === oldName
          ? validatedName.fileName
          : result.payload.title,
    }
    const publishTargetPath = asset.storage_path.includes("/")
      ? asset.storage_path.slice(0, asset.storage_path.lastIndexOf("/") + 1) +
        validatedName.fileName
      : validatedName.fileName
    setMessage(renameRequested ? "Renomeando arquivo privado…" : "Salvando metadados…")
    if (renameRequested) {
      const folder = asset.storage_path.includes("/")
        ? asset.storage_path.slice(0, asset.storage_path.lastIndexOf("/") + 1)
        : ""
      const nextPath = folder + validatedName.fileName
      if (nextPath === asset.storage_path) return false
      // Copy before changing the DB pointer. Roll back the copy if CAS fails;
      // the old object remains until the DB confirms the new path.
      const saved = await stagePrivateMediaChange({
        stage: () => client.storage.from("portfolio-private").copy(asset.storage_path, nextPath),
        persist: async () =>
          await client
            .from("media_assets")
            .update({ ...payload, storage_path: nextPath })
            .eq("id", asset.id)
            .eq("updated_at", asset.updated_at)
            .select("id")
            .single(),
        undoStage: () => client.storage.from("portfolio-private").remove([nextPath]),
        cleanupOld: () => client.storage.from("portfolio-private").remove([asset.storage_path]),
      })
      if (!saved.ok) {
        setMessage(saved.message)
        return false
      }
      setMessage(
        "Nome físico atualizado no Storage e no Supabase." +
          (saved.warning ? " " + saved.warning : ""),
      )
    } else {
      // CAS prevents overwriting another editor's recent metadata update.
      const { data, error } = await client
        .from("media_assets")
        .update(payload)
        .eq("id", asset.id)
        .eq("updated_at", asset.updated_at)
        .select("id,title,alt_text,credit,focal_point")
        .maybeSingle()
      if (
        error ||
        !data ||
        data.title !== payload.title ||
        data.alt_text !== payload.alt_text ||
        data.credit !== payload.credit ||
        data.focal_point?.x !== payload.focal_point.x ||
        data.focal_point?.y !== payload.focal_point.y ||
        data.focal_point?.zoom !== payload.focal_point.zoom
      ) {
        setMessage(
          error?.message ??
            "Não foi possível confirmar todos os metadados. Reabra a mídia antes de salvar novamente.",
        )
        return false
      }
      setMessage("Metadados salvos e conferidos.")
    }
    if (asset.storage_bucket === "portfolio-private") {
      const finalPath = renameRequested ? publishTargetPath : asset.storage_path
      const publication = await publishPrivateMedia({
        id: asset.id,
        storage_bucket: asset.storage_bucket,
        storage_path: finalPath,
        mime_type: asset.mime_type,
      })
      if (!publication.ok) {
        setMessage("Metadados salvos, mas a publicação automática falhou: " + publication.message)
        await load()
        return false
      }
      setMessage("Metadados salvos e mídia publicada." + (publication.warning ? " " + publication.warning : ""))
    }
    setFramingOpen(false)
    setMediaDraft(null)
    setSelectedMediaId(null)
    await load()
    return true
  }
  useEffect(
    () =>
      registerAdminSaveAction(
        async () => (selectedAsset ? save(selectedAsset) : false),
        () => mediaDirty,
      ),
    [selectedAsset, mediaDraft, mediaDirty],
  )
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ""
    if (mediaBusy) return
    setMediaBusy(true)
    try {
      const result = await uploadPublishedMedia(file)
      setMessage(result.message)
      if (result.ok) await load()
    } finally {
      setMediaBusy(false)
    }
  }
  async function removeAsset(asset: MediaLibraryAsset) {
    if (mediaBusy) return
    const confirmed = await adminConfirm("Deseja remover a imagem?", {
      title: "Excluir mídia definitivamente",
      confirmLabel: "Sim",
      tone: "danger",
    })
    if (!confirmed) return
    setMediaBusy(true)
    setMessage("Removendo mídia e referências do Supabase…")
    try {
      const result = await deleteMediaAssetEverywhere({
        id: asset.id,
        updated_at: asset.updated_at,
        storage_bucket: asset.storage_bucket,
        storage_path: asset.storage_path,
      })
      setMessage(result.message)
      if (result.databaseDeleted) {
        setSelectedMediaId(null)
        setMediaDraft(null)
        setFramingOpen(false)
        await load()
      }
    } finally {
      setMediaBusy(false)
    }
  }
  return (
    <>
      <header className="admin-header">
        <div>
          <p>Assets editoriais</p>
          <h1>Biblioteca de mídia</h1>
          <span>Miniaturas, nomes de arquivo e publicação</span>
        </div>
        <label className="primary-button upload-button">
          Enviar mídia
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            disabled={mediaBusy}
            onChange={upload}
          />
        </label>
      </header>
      <AdminNotice message={message} />
      <div className="media-grid media-library-grid" aria-label="Arquivos da biblioteca">
        {assets.map((asset) =>
          selectedMediaId === asset.id && mediaDraft ? (
            <section
              className="admin-card media-library-detail"
              key={asset.id}
              aria-label={"Editar mídia " + mediaDisplayTitle(asset)}
            >
              <div className="card-heading">
                <div>
                  <p>Mídia selecionada</p>
                  <h2>{mediaDisplayTitle(asset)}</h2>
                </div>
                <button
                  type="button"
                  className="icon-button media-detail-close"
                  aria-label="Fechar detalhes da mídia"
                  title="Fechar detalhes"
                  onClick={async () => {
                    if (
                      mediaDirty &&
                      !(await adminConfirmUnsaved(
                        "Existem alterações não salvas nesta mídia. Como deseja continuar?",
                        { title: "Alterações não salvas" },
                      ))
                    )
                      return
                    setSelectedMediaId(null)
                    setMediaDraft(null)
                    setFramingOpen(false)
                  }}
                >
                  <Icon name="close" />
                </button>
              </div>
              <label>
                Título editorial
                <input
                  maxLength={180}
                  value={mediaDraft.title}
                  onChange={(event) => setMediaDraft({ ...mediaDraft, title: event.target.value })}
                />
              </label>
              <label>
                Texto alternativo (opcional)
                <textarea
                  rows={3}
                  maxLength={500}
                  value={mediaDraft.altText}
                  onChange={(event) =>
                    setMediaDraft({ ...mediaDraft, altText: event.target.value })
                  }
                />
              </label>
              <label>
                Crédito (opcional)
                <input
                  maxLength={300}
                  value={mediaDraft.credit}
                  onChange={(event) => setMediaDraft({ ...mediaDraft, credit: event.target.value })}
                />
              </label>
              <div className="media-library-frame-control">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={!previews[asset.id]?.url}
                  onClick={() => setFramingOpen(true)}
                >
                  <Icon name="sliders" size={18} /> Ajustar posição e zoom
                </button>
                <small>
                  Posição: {mediaDraft.focalX}% / {mediaDraft.focalY}% · Zoom:{" "}
                  {Math.round(Number(mediaDraft.focalZoom) * 100)}%
                </small>
              </div>
              {framingOpen && previews[asset.id]?.url && (
                <MediaFramingDialog
                  src={previews[asset.id]?.url ?? ""}
                  label={mediaDisplayTitle(asset)}
                  guidance="Enquadramento da mídia no acervo."
                  ratio="3 / 4"
                  value={{
                    x: Number(mediaDraft.focalX),
                    y: Number(mediaDraft.focalY),
                    zoom: Number(mediaDraft.focalZoom),
                  }}
                  onChange={(framing) =>
                    setMediaDraft({
                      ...mediaDraft,
                      focalX: String(framing.x),
                      focalY: String(framing.y),
                      focalZoom: String(framing.zoom),
                    })
                  }
                  onClose={() => setFramingOpen(false)}
                  saveHint="O enquadramento será salvo nos metadados da mídia. O arquivo original não é modificado."
                />
              )}
              <label>
                Nome do arquivo físico
                <input
                  maxLength={180}
                  value={mediaDraft.fileName}
                  disabled={asset.storage_bucket !== "portfolio-private"}
                  onChange={(event) =>
                    setMediaDraft({ ...mediaDraft, fileName: event.target.value })
                  }
                />
              </label>
              <div className="media-actions">
                <button
                  type="button"
                  className="primary-button"
                  disabled={
                    mediaBusy ||
                    (asset.storage_bucket !== "portfolio-private" &&
                      !hasMediaMetadataChanges(asset, mediaDraft))
                  }
                  onClick={() => save(asset)}
                >
                  Salvar
                </button>
              </div>
            </section>
          ) : (
            <div key={asset.id} className="media-library-card-wrap">
              <button
                type="button"
                className="media-library-card"
                aria-expanded={false}
                disabled={mediaBusy}
                onClick={async () => {
                  if (
                    mediaDirty &&
                    !(await adminConfirmUnsaved(
                      "Existem alterações não salvas nesta mídia. Como deseja continuar?",
                      { title: "Alterações não salvas" },
                    ))
                  )
                    return
                  setFramingOpen(false)
                  setSelectedMediaId(asset.id)
                  setMediaDraft(createMediaMetadataDraft(asset))
                }}
              >
                <div className="media-placeholder media-preview">
                  {previews[asset.id]?.url && !failedImages[asset.id] ? (
                    <img
                      src={previews[asset.id].url}
                      alt={asset.alt_text?.trim() || mediaDisplayTitle(asset)}
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setFailedImages((current) => ({ ...current, [asset.id]: true }))
                      }
                    />
                  ) : (
                    <div className="media-preview-fallback">
                      <Icon name="image" size={32} />
                      <small>
                        {failedImages[asset.id]
                          ? "Imagem indisponível"
                          : (previews[asset.id]?.error ?? "Carregando prévia…")}
                      </small>
                    </div>
                  )}
                </div>
                <strong>{mediaDisplayTitle(asset)}</strong>
              </button>
              <button
                type="button"
                className="media-library-remove"
                aria-label={`Remover imagem ${mediaDisplayTitle(asset)}`}
                title="Remover imagem"
                disabled={mediaBusy}
                onClick={() => void removeAsset(asset)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          ),
        )}
      </div>
    </>
  )
}
