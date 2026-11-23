import { describe, expect, it } from "vitest"
import {
  experienceProjectItems,
  experienceProjectSlides,
  legacyExperienceProjects,
  validateExperienceProjects,
} from "./experience-projects"

describe("Projetos de Experiências: duas áreas independentes", () => {
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
            {
              title: "Guia ilustrado",
              caption: "Legenda publicada",
              image: "https://example.com/guia.webp",
            },
            { title: "Sem vínculo", caption: "Histórico", image: "https://example.com/antigo.webp" },
            {
              title: "Conteúdo",
              caption: "Conteúdo da galeria",
              image: "https://example.com/conteudo.webp",
            },
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
          { title: "Arquivo", text: "Arquivo", isHidden: true },
        ],
      },
    },
  ]

  it("não resgata itens históricos ocultos nem slides sem vínculo inequívoco", () => {
    const projects = legacyExperienceProjects(blocks)
    expect(projects).toHaveLength(3)
    expect(projects.filter((project) => project.slide)).toHaveLength(0)
    expect(experienceProjectItems(projects)).toHaveLength(3)
    expect(experienceProjectSlides(projects)).toHaveLength(0)
  })

  it("mantém títulos e descrições independentes quando há vínculo estável", () => {
    const source = structuredClone(blocks)
    source[0].content_json.experienceMedia!.slides = [
      { title: "Guia", caption: "Descrição do slide", image: "https://example.com/guia.webp" },
    ]
    const projects = legacyExperienceProjects(source)
    projects[0].item!.title = "Título do centro revisado"
    projects[0].slide!.title = "Título diferente na galeria"
    expect(experienceProjectItems(projects)[0].title).toBe("Título do centro revisado")
    expect(experienceProjectSlides(projects)[0]).toMatchObject({
      title: "Título diferente na galeria",
      caption: "Descrição do slide",
      projectId: "a:1",
    })
  })

  it("exibe centro, somente slide, somente centro ou nenhum sem eliminar a ficha", () => {
    const source = structuredClone(blocks)
    source[0].content_json.experienceMedia!.slides = [
      { title: "Guia", caption: "Legenda", image: "https://example.com/guia.webp" },
    ]
    const projects = legacyExperienceProjects(source)
    projects[0].showInCenter = false
    expect(experienceProjectItems(projects)).toHaveLength(2)
    expect(experienceProjectSlides(projects)).toHaveLength(1)
    projects[0].showInCenter = true
    projects[0].includeInGallery = false
    expect(experienceProjectItems(projects)).toHaveLength(3)
    expect(experienceProjectSlides(projects)).toHaveLength(0)
    projects[0].showInCenter = false
    expect(experienceProjectItems(projects)).toHaveLength(2)
    expect(experienceProjectSlides(projects)).toHaveLength(0)
    expect(projects[0].slide?.image).toContain("guia.webp")
  })

  it("não exige uma galeria se todos os slides estiverem desativados", () => {
    const projects = legacyExperienceProjects(blocks)
    expect(validateExperienceProjects(projects)).toEqual([])
  })

  it("valida título, descrição e imagem apenas da área marcada como visível", () => {
    const projects = legacyExperienceProjects(blocks)
    projects[0].slide = { title: "", caption: "", image: "" }
    projects[0].includeInGallery = true
    expect(validateExperienceProjects(projects)).toEqual([
      "Projeto 1: título do slide obrigatório.",
      "Projeto 1: descrição do slide obrigatória.",
      "Projeto 1: imagem do slide obrigatória.",
    ])
  })

  it("rejeita IDs duplicados", () => {
    const projects = legacyExperienceProjects(blocks)
    projects[1].id = projects[0].id
    expect(validateExperienceProjects(projects)).toContain("Projeto 2: identificador duplicado.")
  })
})
