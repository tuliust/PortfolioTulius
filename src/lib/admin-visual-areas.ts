/** Mapeia áreas visuais desktop para as fontes já existentes no CMS. */
export type AdminVisualArea = {
  id: "left" | "center" | "right"
  label: string
  description: string
  source: "section" | "a" | "b"
  focus?: "about-photo" | "experience-gallery"
}
const experiences = new Set([
  "invest-rs",
  "prefeitura-sp",
  "vale",
  "globo-sportv",
  "inpress",
  "cdi",
])
export function adminVisualAreas(slug?: string): AdminVisualArea[] {
  if (slug === "sobre")
    return [
      { id: "left", label: "Esquerda", description: "Título e introdução", source: "section" },
      {
        id: "center",
        label: "Centro",
        description: "Fotografia desktop · bloco A",
        source: "a",
        focus: "about-photo",
      },
      { id: "right", label: "Direita", description: "Textos e destaques · bloco B", source: "b" },
    ]
  if (slug === "resultados")
    return [
      { id: "left", label: "Esquerda", description: "Título e introdução", source: "section" },
      { id: "center", label: "Centro", description: "Indicadores · bloco A", source: "a" },
      { id: "right", label: "Direita", description: "Categorias · bloco B", source: "b" },
    ]
  if (slug && experiences.has(slug))
    return [
      {
        id: "left",
        label: "Esquerda",
        description: "Empresa, logo e competências · bloco A",
        source: "a",
      },
      { id: "center", label: "Centro", description: "Projetos · blocos A e B", source: "b" },
      {
        id: "right",
        label: "Direita",
        description: "Galeria de imagens · bloco A",
        source: "a",
        focus: "experience-gallery",
      },
    ]
  return []
}
