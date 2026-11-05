/** Bold only the descriptive heading of an existing career bullet, without altering its text. */
export function splitExperienceBullet(line: string): { heading: string; body: string } | null {
  const match = /^([•-]\s+[^:]+:)(.*)$/u.exec(line)
  if (!match) return null
  return { heading: match[1], body: match[2] }
}

/** Formatação editorial restrita; tokens são renderizados como elementos React, nunca como HTML. */
export type TrajectoryInlinePart = {
  text: string
  style?: "bold" | "italic" | "underline"
}
export const TRAJECTORY_RECOMMENDED_CHARS = 650

export function parseTrajectoryInline(text: string): TrajectoryInlinePart[] {
  const parts: TrajectoryInlinePart[] = []
  const marks = /\*\*([^*\n]+)\*\*|__([^_\n]+)__|\*([^*\n]+)\*/g
  let cursor = 0
  for (const match of text.matchAll(marks)) {
    const offset = match.index ?? cursor
    if (offset > cursor) parts.push({ text: text.slice(cursor, offset) })
    parts.push({
      text: match[1] ?? match[2] ?? match[3],
      style: match[1] ? "bold" : match[2] ? "underline" : "italic",
    })
    cursor = offset + match[0].length
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) })
  return parts
}

export function trajectoryVisibleLength(text: string): number {
  return text
    .split("\n")
    .map((line) =>
      parseTrajectoryInline(line)
        .map((part) => part.text)
        .join("")
        .replace(/^[•-]\s+/u, ""),
    )
    .join("\n").length
}

/** Normaliza títulos para casar slides com projetos. */
export function experienceTitleKey(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

export function matchExperienceSlides<T extends { title: string; isHidden?: boolean }>(
  slides: readonly { title: string }[],
  items: readonly T[],
): { slideIndex: number; title: string; item?: T }[] {
  return slides.map((slide, slideIndex) => ({
    slideIndex,
    title: slide.title,
    item: items.find(
      (item) =>
        !item.isHidden && experienceTitleKey(item.title) === experienceTitleKey(slide.title),
    ),
  }))
}

// Only the project-specific summaries are hidden from the public trajectory view.
// Original, complete career descriptions in the CMS remain unchanged and editable.
const overlappingCareerBulletPrefixes: Record<string, string[]> = {
  "invest-rs": [
    "Relações públicas e eventos:",
    "Guia de Boas-Vindas:",
    "Plataforma de eventos e relacionamento — proposta:",
    "CRM e mailing institucional — proposta:",
  ],
  "prefeitura-sp": [
    "Planejamento de comunicação pública:",
    "Comunicação executiva:",
    "Plataforma SUBPI — projeto concebido:",
    "Comunicação digital:",
    "Equipes e território:",
  ],
  vale: [
    "Mídia paga e orçamento:",
    "Comunicação executiva:",
    "Articulação internacional:",
    "Projetos de ponta a ponta:",
    "Inteligência de dados:",
  ],
  "globo-sportv": ["2016 — Correspondência na China:", "Entradas ao vivo e produção completa:"],
  inpress: [
    "Campanhas integradas:",
    "Assessoria de imprensa:",
    "Relações públicas:",
    "Resultados em mídia:",
  ],
  cdi: [
    "Conduzi planejamento anual de comunicação",
    "Desenvolvi mensagens-chave",
    "Elaborei apresentações corporativas",
    "Avaliei cenários e recomendei oportunidades",
    "Apoiei preparação e acompanhamento de entrevistas",
  ],
}

export function complementaryCareerLines(description: string, slug: string): string[] {
  const excluded = (overlappingCareerBulletPrefixes[slug] ?? []).map(experienceTitleKey)
  return description
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const bullet = /^[•-]\s+(.+)$/u.exec(line)
      if (!bullet) return true
      const heading = (splitExperienceBullet(line)?.heading ?? bullet[1]).replace(/^[•-]\s+/, "")
      const key = experienceTitleKey(heading)
      return !excluded.some((prefix) => key.startsWith(prefix))
    })
}
