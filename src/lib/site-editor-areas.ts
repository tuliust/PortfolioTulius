import { adminVisualAreas, type AdminVisualArea } from "./admin-visual-areas"

/** CMS navigation follows the published composition, never inventing a center column. */
export type SiteEditorArea =
  | AdminVisualArea
  | {
      id: "section"
      label: "Seção"
      description: string
      source: "section"
    }

export function siteEditorAreas(slug?: string): SiteEditorArea[] {
  const section: SiteEditorArea = {
    id: "section",
    label: "Seção",
    description: "Título administrativo, âncora e transições",
    source: "section",
  }
  if (!slug) return [section]
  if (slug === "perfil")
    return [
      section,
      {
        id: "left",
        label: "Esquerda",
        description: "Mensagem, selo, apresentação e destaques",
        source: "a",
      },
      { id: "right", label: "Direita", description: "Título, botões e experiências", source: "b" },
    ]
  const specialized = adminVisualAreas(slug)
  if (specialized.length) return [section, ...specialized]
  return [
    section,
    { id: "left", label: "Esquerda", description: "Textos e elementos do painel A", source: "a" },
    { id: "right", label: "Direita", description: "Textos e elementos do painel B", source: "b" },
  ]
}

/** Section-level public copy is edited alongside its left visual area, not settings. */
export function editorCopyInArea(slug: string, area: string): boolean {
  return slug !== "perfil" && area === "left"
}
