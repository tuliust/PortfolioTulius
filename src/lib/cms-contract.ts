import type { ExperienceMedia } from "../types/content"
import type { ContentBlockRow } from "./placements"

/**
 * The public view must use published media only. In the protected preview,
 * media belonging to a draft or in-review block is also available. This does
 * not change any publication flag or write back to content_json.
 */
export function selectSectionExperienceMedia(
  blocks: ContentBlockRow[] | undefined,
  includeDrafts: boolean,
): ExperienceMedia | undefined {
  return blocks
    ?.filter(
      (block) =>
        block.mobile_panel === "a" &&
        (includeDrafts ? block.status !== "archived" : block.status === "published"),
    )
    .sort((a, b) => a.sort_order - b.sort_order)
    .find((block) => block.content_json?.experienceMedia)?.content_json?.experienceMedia
}
