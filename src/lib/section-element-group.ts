/**
 * Editorial titles are an editor-only reading of the existing two JSONB blocks.
 * They do not alter the published layout or create new content records.
 */
export function sectionElementGroup(slug: string | undefined, area: string, panel: "a" | "b") {
  if (slug === "sobre")
    return area === "center"
      ? (["Fotografia desktop", "Imagem central da seção"] as const)
      : (["Textos e destaques", "Conteúdo editorial da direita"] as const)
  if (slug === "resultados")
    return panel === "a"
      ? (["Indicadores e métricas", "Resultados do painel central"] as const)
      : (["Temas e categorias", "Categorias de projetos e comunicação"] as const)
  if (slug === "competencias")
    return panel === "a"
      ? (["Habilidades e gestão", "Áreas de atuação da esquerda"] as const)
      : (["Competências e relações", "Áreas de atuação da direita"] as const)
  if (slug === "formacao")
    return panel === "a"
      ? (["Formação acadêmica", "Graduação e especializações"] as const)
      : (["Idiomas", "Certificações e escolas de idiomas"] as const)
  if (slug === "ferramentas")
    return panel === "a"
      ? (["Análise, mídia e CRM", "Ferramentas e plataformas"] as const)
      : (["Projetos, conteúdo e design", "Ferramentas e plataformas"] as const)
  if (slug === "contato")
    return panel === "a"
      ? (["Apresentação", "Foto e mensagem de contato"] as const)
      : (["Canais de contato", "Links e informações de contato"] as const)
  if (slug === "depoimentos")
    return ["Registros de depoimentos", "Itens preservados no painel"] as const
  if (
    ["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"].includes(slug ?? "")
  ) {
    if (area === "center") return ["Projetos e entregas", "Itens dos blocos A e B"] as const
    if (area === "right")
      return ["Galeria e mídia", "Fotografias e imagens da experiência"] as const
    return ["Competências e realizações", "Resultados e atividades da experiência"] as const
  }
  return panel === "a"
    ? (["Elementos da esquerda", "Conteúdo do painel A"] as const)
    : (["Elementos da direita", "Conteúdo do painel B"] as const)
}
