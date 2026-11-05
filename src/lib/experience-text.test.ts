import { describe, expect, it } from "vitest"
import {
  complementaryCareerLines,
  matchExperienceSlides,
  splitExperienceBullet,
  parseTrajectoryInline,
  trajectoryVisibleLength,
  TRAJECTORY_RECOMMENDED_CHARS,
} from "./experience-text"

describe("Experience trajectory bullets", () => {
  it("emphasizes only the label preceding a colon, preserving the original copy", () => {
    expect(
      splitExperienceBullet("• Comunicação institucional e posicionamento: Planejamento de ações."),
    ).toEqual({
      heading: "• Comunicação institucional e posicionamento:",
      body: " Planejamento de ações.",
    })
  })
  it("preserves introductory paragraphs and bullets without a heading", () => {
    expect(splitExperienceBullet("Atuação em comunicação institucional.")).toBeNull()
    expect(splitExperienceBullet("• Apoio em projetos digitais")).toBeNull()
  })
})

describe("Trajetória formatada de maneira segura", () => {
  it("interpreta apenas bullets e marcas explícitas, sem aceitar HTML arbitrário", () => {
    expect(parseTrajectoryInline("**Forte** *ênfase* __sublinhado__")).toEqual([
      { text: "Forte", style: "bold" },
      { text: " " },
      { text: "ênfase", style: "italic" },
      { text: " " },
      { text: "sublinhado", style: "underline" },
    ])
    expect(parseTrajectoryInline("<script>alert(1)</script>")).toEqual([
      { text: "<script>alert(1)</script>" },
    ])
  })

  it("conta caracteres visíveis sem penalizar a marcação editorial", () => {
    expect(trajectoryVisibleLength("• **Objetivo:** *Texto* __destacado__")).toBe(
      "Objetivo: Texto destacado".length,
    )
    expect(TRAJECTORY_RECOMMENDED_CHARS).toBe(650)
  })
})

describe("Slide-to-project matching and trajectory deduplication", () => {
  it("links slide titles in their published order without exposing hidden items", () => {
    const slides = [
      { title: "Guia de Boas-Vindas" },
      { title: "Organização de eventos" },
      { title: "Plataforma de eventos e relacionamento" },
      { title: "Estratégia de CRM e mailing institucional" },
    ]
    const items = [
      { title: "Organização de eventos", text: "Mais de dez eventos." },
      { title: "Guia de Boas-Vindas", text: "Guia institucional." },
      { title: "Estratégia de CRM e mailing institucional", isHidden: true },
    ]
    const mapped = matchExperienceSlides(slides, items)
    expect(mapped.map((item) => item.title)).toEqual(slides.map((slide) => slide.title))
    expect(mapped[0].item?.title).toBe("Guia de Boas-Vindas")
    expect(mapped[1].item?.title).toBe("Organização de eventos")
    expect(mapped[2].item).toBeUndefined()
    expect(mapped[3].item).toBeUndefined()
  })
  it("keeps unrelated career responsibilities and non-bullet introductions", () => {
    const source = [
      "Atuação institucional com interlocução internacional.",
      "• Guia de Boas-Vindas: Organização editorial do guia.",
      "• Investidores e stakeholders: Interface com empresas parceiras.",
      "• Relações públicas e eventos: Apoio à Expointer.",
    ].join("\n")
    expect(complementaryCareerLines(source, "invest-rs")).toEqual([
      "Atuação institucional com interlocução internacional.",
      "• Investidores e stakeholders: Interface com empresas parceiras.",
    ])
    expect(complementaryCareerLines(source, "unknown")).toHaveLength(4)
  })
})
