import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const component = readFileSync(
  new URL("../components/public/PublicSite.tsx", import.meta.url),
  "utf8",
)
const css = readFileSync(new URL("../index.css", import.meta.url), "utf8")
const experiences = readFileSync(
  new URL("../components/public/ExperienceStack.tsx", import.meta.url),
  "utf8",
)

describe("mobile editorial parity: content preserved, responsive presentation", () => {
  it("has one title for each of Formação and Ferramentas, with different secondary groups", () => {
    expect(component).toContain('["formacao", "ferramentas", "contato"].includes(section.slug)')
    expect(component).toContain('"Idiomas e formação complementar"')
    expect(component).toContain('"Outras ferramentas"')
    expect(component).toContain('"Canais de contato"')
    expect(component).toContain("<h2>{section.title}</h2>")
  })
  it("shows only the selected company on mobile and keeps the heading opaque", () => {
    expect(experiences).toContain("const displayedSections = isMobile")
    expect(experiences).toContain("displayedSections.map((section, index)")
    expect(experiences).toContain("event.preventDefault()")
    expect(css).toContain("background: var(--paper);")
    expect(css).toContain(".experience-card .experience-mobile-copy")
  })
  it("keeps the contact image in the first mobile panel without changing its source", () => {
    expect(component).toContain('className="contact-mobile-photo"')
    expect(css).toContain("#contato-a .contact-mobile-photo img")
    expect(css).toContain("object-position: bottom center")
  })
  it("constrains first fold, editorial, tools and compact expandable quotes", () => {
    for (const selector of [
      "#perfil-a .mobile-name",
      "#perfil-a .mobile-profile-hero",
      "#sobre .mobile-panel",
      "#formacao .mobile-panel",
      "#ferramentas .mobile-panel",
      "#depoimentos .testimonial-card",
    ]) {
      expect(css).toContain(selector)
    }
    expect(css).toContain("-webkit-line-clamp: 3")
    expect(css).toContain("#depoimentos .testimonial-card.is-expanded .testimonial-quote")
  })
})
