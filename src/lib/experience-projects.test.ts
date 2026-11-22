import { describe, expect, it } from "vitest"
import {
  experienceProjectItems,
  experienceProjectSlides,
  legacyExperienceProjects,
  validateExperienceProjects,
} from "./experience-projects"

describe("Experiências unificadas sem perda de conteúdo", () => {
  const blocks = [
    {
      id: "a",
      mobile_panel: "a" as const,
      content_json: {
        items: [
          { title: "Competências aplicadas", tags: ["Comunicação"] },
          { title: "Guia", text: "Guia publicado" },
          { title: "Conteúdo", text: "Plataforma" },
        ],
        experienceMedia: {
          slides: [
            { title: "Guia", image: "https://example.com/guia.webp" },
            { title: "Slide histórico", caption: "Legenda preservada" },
          ],
        },
      },
    },
    {
      id: "b",
      mobile_panel: "b" as const,
      content_json: {
        items: [
          { title: "Conteúdo", text: "Identidade digital" },
          { title: "Arquivo", isHidden: true },
        ],
      },
    },
  ]
  it("retém projeto oculto, título duplicado e slide sem correspondente", () => {
    const projects = legacyExperienceProjects(blocks)
    expect(projects).toHaveLength(5)
    expect(projects.filter((project) => project.item)).toHaveLength(4)
    expect(projects.filter((project) => project.slide)).toHaveLength(2)
    expect(projects.some((project) => project.item?.isHidden)).toBe(true)
    expect(experienceProjectItems(projects)).toHaveLength(3)
    expect(experienceProjectSlides(projects).map((slide) => slide.title)).toEqual([
      "Guia",
      "Slide histórico",
    ])
  })
  it("a mudança do título acompanha o slide pelo ID, sem alterar a legenda", () => {
    const projects = legacyExperienceProjects(blocks)
    projects[0].item!.title = "Guia novo"
    const slides = experienceProjectSlides(projects)
    expect(slides[0].title).toBe("Guia novo")
    expect(slides[1].caption).toBe("Legenda preservada")
    expect(slides[0].projectId).toBe("a:1")
  })
  it("ocultar um slide não apaga a imagem e não altera a lista textual", () => {
    const projects = legacyExperienceProjects(blocks)
    projects[0].includeInGallery = false
    expect(experienceProjectItems(projects)).toHaveLength(3)
    expect(projects[0].slide?.image).toContain("guia.webp")
    expect(experienceProjectSlides(projects)).toHaveLength(1)
  })
  it("rejeita identificadores repetidos sem descartar dados de origem", () => {
    const projects = legacyExperienceProjects(blocks)
    projects[1].id = projects[0].id
    expect(validateExperienceProjects(projects)).toContain("Projeto 2: identificador duplicado.")
  })
})
