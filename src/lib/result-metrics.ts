import type { ContentItem } from "../types/content"

export function selectResultMetrics(metrics: ContentItem[], topic?: ContentItem) {
  if (topic) {
    return metrics.filter((item) => item.relatedThemeKeys?.includes(topic.themeKey ?? ""))
  }
  return metrics
    .filter((item) => item.showInOverview !== false)
    .sort((a, b) => (a.overviewOrder ?? 999) - (b.overviewOrder ?? 999))
}
