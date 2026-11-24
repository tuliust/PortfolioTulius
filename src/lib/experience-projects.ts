import type { ContentItem, ExperienceProject, ExperienceSlide } from "../types/content"
import { experienceTitleKey } from "./experience-text"
import { isExperienceVideoPath } from "./experience-video"

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
 * Compatibility for experiences not yet converted: only public, visible
 * projects and slides with one unequivocal text match are adopted.
 * Historical hidden entries and orphan slides are not regenerated in CMS.
 */
export function legacyExperienceProjects(blocks: LegacyExperienceBlock[]): ExperienceProject[] {
  const a = blocks.find((block) => block.mobile_panel === "a")
  if (a?.content_json.experienceProjects) {
    return structuredClone(a.content_json.experienceProjects)
  }
  const projects: ExperienceProject[] = []
  for (const block of blocks
    .filter((entry) => entry.mobile_panel === "a" || entry.mobile_panel === "b")
    .sort((left, right) => left.mobile_panel.localeCompare(right.mobile_panel))) {
    for (const [index, item] of (block.content_json.items ?? []).entries()) {
      if (experienceTitleKey(item.title) === "competencias aplicadas" || item.isHidden === true)
        continue
      projects.push({
        id: block.id + ":" + index,
        item: structuredClone(item),
        showInCenter: true,
        includeInGallery: false,
      })
    }
  }
  for (const [index, slide] of (a?.content_json.experienceMedia?.slides ?? []).entries()) {
    const matches = projects.filter(
      (project) =>
        project.item && experienceTitleKey(project.item.title) === experienceTitleKey(slide.title),
    )
    if (matches.length === 1 && !matches[0].slide) {
      matches[0].slide = structuredClone(slide)
      matches[0].slideOrder = index
      matches[0].includeInGallery = true
    }
  }
  return projects
}

export function experienceProjectItems(projects: ExperienceProject[]): ContentItem[] {
  return projects
    .filter((project) => project.item && project.showInCenter !== false && !project.item.isHidden)
    .map((project) => ({ ...project.item!, experienceProjectId: project.id }))
}

export function experienceProjectSlides(projects: ExperienceProject[]): ExperienceSlide[] {
  return projects
    .filter((project) => project.item && project.slide && project.includeInGallery !== false)
    .sort((left, right) => (left.slideOrder ?? 9999) - (right.slideOrder ?? 9999))
    .map((project) => ({
      ...project.slide!,
      projectId: project.id,
    }))
}

export function validateExperienceProjects(projects: ExperienceProject[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const [index, project] of projects.entries()) {
    const label = "Projeto " + (index + 1)
    if (!project.id || ids.has(project.id)) errors.push(label + ": identificador duplicado.")
    ids.add(project.id)
    if (!project.item) {
      errors.push(label + ": ficha central ausente.")
      continue
    }
    if (project.showInCenter !== false) {
      if (!project.item.title.trim()) errors.push(label + ": título central obrigatório.")
      if (!project.item.text?.trim()) errors.push(label + ": descrição central obrigatória.")
    }
    if (project.includeInGallery === true && !project.slide) {
      errors.push(label + ": slide habilitado sem dados.")
    }
    if (project.includeInGallery !== false && project.slide) {
      if (!project.slide.title.trim()) errors.push(label + ": título do slide obrigatório.")
      if (!project.slide.caption?.trim()) errors.push(label + ": descrição do slide obrigatória.")
      if (project.slide.mediaType === "video") {
        if (!isExperienceVideoPath(project.slide.videoPath))
          errors.push(label + ": envie um vídeo MP4 válido.")
      } else if (!project.slide.image?.trim()) {
        errors.push(label + ": imagem do slide obrigatória.")
      }
    }
  }
  return errors
}
