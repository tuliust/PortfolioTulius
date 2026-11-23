import { describe, expect, it } from "vitest"
import {
  EXPERIENCE_AUTOPLAY_AFTER_CLICK_MS,
  EXPERIENCE_AUTOPLAY_INTERVAL_MS,
  nextExperienceSlideIndex,
} from "./experience-slide-timing"

describe("Temporização dos slides de Experiências", () => {
  it("avança após 3 s sem interação e espera 8 s após clique", () => {
    expect(EXPERIENCE_AUTOPLAY_INTERVAL_MS).toBe(3000)
    expect(EXPERIENCE_AUTOPLAY_AFTER_CLICK_MS).toBe(8000)
  })
  it("avança ciclicamente sem extrapolar, inclusive com galeria vazia", () => {
    expect(nextExperienceSlideIndex(0, 4)).toBe(1)
    expect(nextExperienceSlideIndex(3, 4)).toBe(0)
    expect(nextExperienceSlideIndex(0, 1)).toBe(0)
    expect(nextExperienceSlideIndex(0, 0)).toBe(0)
  })
})
