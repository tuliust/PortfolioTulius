export const EXPERIENCE_VIDEO_BUCKET = "portfolio-videos"
export const EXPERIENCE_VIDEO_MAX_BYTES = 50_000_000

export function isExperienceVideoPath(path: unknown): path is string {
  return (
    typeof path === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.mp4$/i.test(path)
  )
}

export function experienceVideoUrl(
  path: unknown,
  baseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL,
): string | undefined {
  if (!isExperienceVideoPath(path) || !baseUrl) return undefined
  try {
    const base = new URL(baseUrl)
    if (
      base.protocol !== "https:" &&
      !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname))
    )
      return undefined
    return new URL(
      `/storage/v1/object/public/${EXPERIENCE_VIDEO_BUCKET}/${path}`,
      base,
    ).href
  } catch {
    return undefined
  }
}

export function validateExperienceVideoFile(file: Pick<File, "name" | "type" | "size">) {
  return file.type === "video/mp4" &&
    /\.mp4$/i.test(file.name) &&
    file.size > 0 &&
    file.size <= EXPERIENCE_VIDEO_MAX_BYTES
    ? undefined
    : "Selecione um MP4 de até 50 MB (recomendado H.264/AAC)."
}
