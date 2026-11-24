import { describe, expect, it } from "vitest"
import {
  experienceVideoUrl,
  isExperienceVideoPath,
  validateExperienceVideoFile,
} from "./experience-video"

describe("Vídeos de experiências", () => {
  const path = "00000000-0000-4000-8000-000000000001.mp4"
  it("deriva a URL exclusivamente do Storage configurado", () => {
    expect(experienceVideoUrl(path, "https://example.supabase.co")).toBe(
      "https://example.supabase.co/storage/v1/object/public/portfolio-videos/" + path,
    )
    expect(
      experienceVideoUrl("https://example.com/file.mp4", "https://example.supabase.co"),
    ).toBeUndefined()
    expect(isExperienceVideoPath("../" + path)).toBe(false)
    expect(experienceVideoUrl(path, "http://example.com")).toBeUndefined()
    expect(experienceVideoUrl(path, "http://127.0.0.1:54321")).toContain("/portfolio-videos/")
  })
  it("aceita apenas arquivos MP4 não vazios dentro do limite", () => {
    expect(
      validateExperienceVideoFile({ name: "clip.mp4", type: "video/mp4", size: 50_000_000 }),
    ).toBeUndefined()
    expect(
      validateExperienceVideoFile({ name: "clip.mp4", type: "video/mp4", size: 50_000_001 }),
    ).toBeTruthy()
    expect(
      validateExperienceVideoFile({ name: "clip.mp4", type: "video/mp4", size: 0 }),
    ).toBeTruthy()
    expect(
      validateExperienceVideoFile({ name: "clip.mov", type: "video/quicktime", size: 100 }),
    ).toBeTruthy()
  })
})
