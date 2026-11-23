/** The same timer contract is used by desktop and mobile experience galleries. */
export const EXPERIENCE_AUTOPLAY_INTERVAL_MS = 3000
export const EXPERIENCE_AUTOPLAY_AFTER_CLICK_MS = 8000

export function nextExperienceSlideIndex(current: number, count: number): number {
  if (count <= 1) return 0
  return (current + 1) % count
}
