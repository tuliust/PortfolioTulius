import type { ContentItem, ExperienceProject, ExperienceSlide } from "../types/content"
import { experienceTitleKey } from "./experience-text"

export type LegacyExperienceBlock = {
  id: string
  mobile_panel: "a" | "b"
  content_json: {
    items?: ContentItem[]
    experienceMedia?: { slides?: ExperienceSlide[] }
    experienceProjects?: ExperienceProject[]
  }
}

/**
 * Creates a non-destructive draft from the existing A/B blocks. Both source
 * arrays and all unlinked slide media are retained until the editor is saved.
 * Never guess which duplicate title owns a slide.
 */
export function legacyExperienceProjects(blocks: LegacyExperienceBlock[]): ExperienceProject[] {
  const a = blocks.find((block) => block.mobile_panel === "a")
  if (a?.content_json.experienceProjects) {
    return structuredClone(a.content_json.experienceProjects)
  }
  const projects: ExperienceProject[] = []
  for (const block of blocks.filter((entry) => entry.mobile_panel === "a" || entry.mobile_panel === "b").sort((left, right) => left.mobile_panel.localeCompare(right.mobile_panel))) {
    for (const [index, item] of (block.content_json.items ?? []).entries()) {
      if (experienceTitleKey(item.title) === "competencias aplicadas") continue
      projects.push({
        id: block.id + ":" + index,
        item: structuredClone(item),
      })
    }
  }
  for (const [index, slide] of (a?.content_json.experienceMedia?.slides ?? []).entries()) {
    const matches = projects.filter((project) =>
      project.item &&
      project.item.isHidden !== true &&
      experienceTitleKey(project.item.title) === experienceTitleKey(slide.title),
    )
    if (matches.length === 1 && !matches[0].slide) {
      matches[0].slide = structuredClone(slide)
      matches[0].slideOrder = index
    } else {
      projects.push({
        id: a!.id + ":unlinked-slide:" + index,
        slide: structuredClone(slide),
        slideOrder: index,
      })
    }
  }
  return projects
}

/** The public view derives both columns from one canonical collection. */
export function experienceProjectItems(projects: ExperienceProject[]): ContentItem[] {
  return projects
    .filter((project) => Boolean(project.item) && project.item?.isHidden !== true)
    .map((project) => ({ ...project.item!, experienceProjectId: project.id }))
}

export function experienceProjectSlides(projects: ExperienceProject[]): ExperienceSlide[] {
  return projects
    .filter((project) => Boolean(project.slide) && project.includeInGallery !== false)
    .sort((left, right) => (left.slideOrder ?? 9999) - (right.slideOrder ?? 9999))
    .map((project) => ({
      ...project.slide!,
      title: project.item?.title ?? project.slide!.title,
      projectId: project.item ? project.id : undefined,
    }))
}

export function validateExperienceProjects(projects: ExperienceProject[]): string[] {
  const errors: string[] = []
  if (!projects.some((project) => project.slide && project.includeInGallery !== false)) {
    errors.push("Mantenha pelo menos um slide na galeria.")
  }
  const ids = new Set<string>()
  for (const [index, project] of projects.entries()) {
    if (!project.id || ids.has(project.id)) errors.push("Projeto " + (index + 1) + ": identificador duplicado.")
    ids.add(project.id)
    if (project.item && !project.item.title.trim()) errors.push("Projeto " + (index + 1) + ": título obrigatório.")
    if (project.slide && !project.slide.title.trim()) errors.push("Slide " + (index + 1) + ": título obrigatório.")
  }
  return errors
}
