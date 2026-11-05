import { useEffect, useRef, useState } from "react"
import type { PostgrestClient } from "@supabase/postgrest-js"
import type { ContentItem, ExperienceSlide, PortfolioSection } from "../../types/content"
import { imageFramingStyle } from "../../lib/media-framing"
import { Icon } from "../ui/Icons"
import {
  complementaryCareerLines,
  matchExperienceSlides,
  experienceTitleKey,
  splitExperienceBullet,
  parseTrajectoryInline,
} from "../../lib/experience-text"
import { publicReadClient } from "../../lib/public-read"
import { resolveCareerSectionSlug } from "../../lib/career-record-link"

export const EXPERIENCE_SLUGS = [
  "invest-rs",
  "prefeitura-sp",
  "vale",
  "globo-sportv",
  "inpress",
  "cdi",
] as const

function Monogram({ name }: { name: string }) {
  const letters = name
    .split(/[\s/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
  return (
    <span className="experience-monogram" aria-hidden="true">
      {letters}
    </span>
  )
}

function CompanyMark({ section, small = false }: { section: PortfolioSection; small?: boolean }) {
  const { logo, logoAlt } = section.experienceMedia ?? {}
  return (
    <span className={small ? "company-mark company-mark-small" : "company-mark"}>
      {logo && logoAlt ? (
        <img
          src={logo}
          alt={logoAlt}
          style={imageFramingStyle(section.experienceMedia?.logoFraming)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <Monogram name={section.title} />
      )}
    </span>
  )
}

function PhotoGallery({
  section,
  active,
  onSlideChange,
  gallerySlides,
}: {
  section: PortfolioSection
  active: number
  onSlideChange: (index: number) => void
  gallerySlides?: ExperienceSlide[]
}) {
  const slides = gallerySlides ?? section.experienceMedia?.slides ?? []
  const count = slides.length
  const index = count ? Math.min(active, count - 1) : 0
  const slide: ExperienceSlide | undefined = slides[index]
  const hasImage = Boolean(slide?.image?.trim())

  return (
    <div className="experience-gallery" aria-label={`Galeria de projetos: ${section.title}`}>
      <div
        className={hasImage ? "experience-media-frame" : "experience-media-frame media-awaiting"}
      >
        {hasImage ? (
          <img
            src={slide!.image}
            alt={slide!.alt?.trim() || slide!.title}
            style={imageFramingStyle(slide!.framing)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="experience-image-pending">
            <span>REGISTRO VISUAL</span>
            <strong>{slide?.title ?? "Galeria de projetos"}</strong>
            <p>Fotografia do projeto pendente de inclusão no painel administrativo.</p>
          </div>
        )}
      </div>
      <div className="experience-gallery-footer">
        <div>
          <span className="experience-gallery-kicker">PROJETO EM DESTAQUE</span>
          <h3>{slide?.title ?? "Galeria de projetos"}</h3>
          {slide?.caption && <p>{slide.caption}</p>}
        </div>
        {count > 1 && (
          <div className="experience-gallery-controls">
            <button
              type="button"
              aria-label={`Foto anterior de ${section.title}`}
              onClick={() => onSlideChange((index + count - 1) % count)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <span aria-live="polite">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              aria-label={`Próxima foto de ${section.title}`}
              onClick={() => onSlideChange((index + 1) % count)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
      {count > 1 && (
        <div className="experience-gallery-dots" aria-label="Selecionar projeto">
          {slides.map((item, slideIndex) => (
            <button
              type="button"
              key={`${item.title}-${slideIndex}`}
              className={slideIndex === index ? "is-active" : ""}
              onClick={() => onSlideChange(slideIndex)}
              aria-label={`Exibir projeto ${item.title}`}
              aria-current={slideIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ExperienceCompetencies({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <ul className="experience-competencies" aria-label="Competências aplicadas">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}

function TrajectoryInline({ text }: { text: string }) {
  return (
    <>
      {parseTrajectoryInline(text).map((part, index) =>
        part.style === "bold" ? (
          <strong key={index}>{part.text}</strong>
        ) : part.style === "italic" ? (
          <em key={index}>{part.text}</em>
        ) : part.style === "underline" ? (
          <u key={index}>{part.text}</u>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  )
}

function ExperienceDetails({
  description,
  slug,
  complete = false,
}: {
  description: string
  slug: string
  complete?: boolean
}) {
  const lines = complete
    ? description
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
    : complementaryCareerLines(description, slug)
  return (
    <div className="experience-full-body">
      {lines.map((line, index) => {
        const bullet = splitExperienceBullet(line)
        return (
          <p key={index} className={/^[•-]\s+/u.test(line) ? "experience-full-point" : undefined}>
            {bullet ? (
              <>
                <strong>
                  <TrajectoryInline text={bullet.heading} />
                </strong>
                <TrajectoryInline text={bullet.body} />
              </>
            ) : (
              <TrajectoryInline text={line} />
            )}
          </p>
        )
      })}
    </div>
  )
}

function ExperienceContent({
  section,
  items,
  detail,
  activeSlide,
  onSlideChange,
}: {
  section: PortfolioSection
  items: PortfolioSection["panelA"]
  detail?: string
  activeSlide: number
  onSlideChange: (index: number) => void
}) {
  const [view, setView] = useState<"projects" | "trajectory">("projects")
  const containerRef = useRef<HTMLDivElement>(null)
  const trajectoryAvailable = Boolean(detail?.trim())
  const showingTrajectory = view === "trajectory" && trajectoryAvailable
  const chooseView = (next: "projects" | "trajectory") => {
    setView(next)
    if (containerRef.current) containerRef.current.scrollTop = 0
  }
  const slides = section.experienceMedia?.slides ?? []
  const projectSlides = matchExperienceSlides(slides, items)
  const extraMetrics = items.filter(
    (item) => Boolean(item.value) && !projectSlides.some(({ item: selected }) => selected === item),
  )

  return (
    <div className="experience-projects" ref={containerRef}>
      <div
        className="experience-view-switch"
        role="group"
        aria-label={`Conteúdo de ${section.title}`}
      >
        <button
          type="button"
          className={
            showingTrajectory ? "experience-view-projects" : "experience-view-projects is-active"
          }
          aria-pressed={!showingTrajectory}
          aria-controls={`${section.slug}-experience-content`}
          onClick={() => chooseView("projects")}
        >
          Projetos e realizações
        </button>
        <button
          type="button"
          className={
            showingTrajectory
              ? "experience-view-trajectory is-active"
              : "experience-view-trajectory"
          }
          aria-pressed={showingTrajectory}
          aria-controls={`${section.slug}-experience-content`}
          disabled={!trajectoryAvailable}
          onClick={() => chooseView("trajectory")}
        >
          <span>Trajetória</span>
          <Icon name="arrow" size={16} />
        </button>
      </div>
      <div id={`${section.slug}-experience-content`} className="experience-view-body">
        {showingTrajectory ? (
          <ExperienceDetails description={detail!} slug={section.slug} />
        ) : (
          <>
            {projectSlides.map(({ title, item, slideIndex }) => (
              <article
                className={
                  slideIndex === activeSlide ? "experience-project is-active" : "experience-project"
                }
                key={`${title}-${slideIndex}`}
              >
                <button
                  type="button"
                  className="experience-project-choice"
                  aria-label={`Exibir imagem de ${title}`}
                  aria-current={slideIndex === activeSlide ? "true" : undefined}
                  onClick={() => onSlideChange(slideIndex)}
                >
                  {item?.meta && <span className="experience-project-meta">{item.meta}</span>}
                  <span className="experience-project-heading" role="heading" aria-level={3}>
                    {title}
                  </span>
                  {item?.value && <strong className="experience-value">{item.value}</strong>}
                  {item?.text && <p>{item.text}</p>}
                  {item?.tags && <p>{item.tags.join(" · ")}</p>}
                </button>
              </article>
            ))}
            {extraMetrics.length > 0 && (
              <div className="experience-extra-metrics" aria-label="Indicadores complementares">
                {extraMetrics.map((item, index) => (
                  <div key={`${item.title}-${index}`}>
                    <span>{item.title}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Mobile keeps the CMS order and the existing slide association, but combines
 * each project's copy and its own images in a single natural page flow.
 * Desktop ExperienceContent and PhotoGallery retain their original layout.
 */
function ExperienceMobileBody({
  section,
  items,
  detail,
  view,
  activeSlide,
  onSlideChange,
}: {
  section: PortfolioSection
  items: ContentItem[]
  detail?: string
  view: "projects" | "trajectory"
  activeSlide: number
  onSlideChange: (index: number) => void
}) {
  const [selectedProject, setSelectedProject] = useState(0)
  const slides = section.experienceMedia?.slides ?? []
  const matches = matchExperienceSlides(slides, items)
  const projects: { title: string; item?: ContentItem; slideIndices: number[] }[] = []

  for (const { title, item, slideIndex } of matches) {
    const project = projects.find(
      (entry) => experienceTitleKey(entry.title) === experienceTitleKey(title),
    )
    if (project) {
      project.slideIndices.push(slideIndex)
    } else {
      projects.push({ title, item, slideIndices: [slideIndex] })
    }
  }
  for (const item of items) {
    if (
      item.value ||
      projects.some((entry) => experienceTitleKey(entry.title) === experienceTitleKey(item.title))
    )
      continue
    projects.push({ title: item.title, item, slideIndices: [] })
  }
  const extraMetrics = items.filter(
    (item) => Boolean(item.value) && !matches.some(({ item: matched }) => matched === item),
  )
  const selectProject = (index: number) => {
    setSelectedProject(index)
    if (projects[index]?.slideIndices.length) {
      onSlideChange(projects[index].slideIndices[0])
    }
  }
  const showTrajectory = view === "trajectory" && Boolean(detail?.trim())

  return (
    <div className="experience-mobile-body" aria-live="polite">
      {showTrajectory ? (
        <ExperienceDetails description={detail!} slug={section.slug} complete />
      ) : (
        <>
          <div
            className="experience-mobile-project-list"
            aria-label={`Projetos de ${section.title}`}
          >
            {projects.map((project, index) => {
              const isOpen = index === selectedProject
              const projectSlides = project.slideIndices.map((slideIndex) => slides[slideIndex])
              const galleryIndex = Math.max(0, project.slideIndices.indexOf(activeSlide))
              const currentSlide = projectSlides[galleryIndex]
              const hasMedia = Boolean(currentSlide?.image?.trim())
              const contentId = `${section.slug}-mobile-project-${index}`
              return (
                <article
                  key={`${experienceTitleKey(project.title)}-${index}`}
                  className={isOpen ? "experience-project is-active" : "experience-project"}
                >
                  <button
                    type="button"
                    className="experience-project-choice"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => selectProject(index)}
                  >
                    {project.item?.meta && (
                      <span className="experience-project-meta">{project.item.meta}</span>
                    )}
                    <span className="experience-mobile-project-title">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="experience-project-heading" role="heading" aria-level={3}>
                        {project.title}
                      </span>
                      <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="experience-mobile-project-detail" id={contentId}>
                      {project.item?.value && (
                        <strong className="experience-value">{project.item.value}</strong>
                      )}
                      {project.item?.text && <p>{project.item.text}</p>}
                      {project.item?.tags?.length ? <p>{project.item.tags.join(" · ")}</p> : null}
                      {hasMedia && (
                        <PhotoGallery
                          section={section}
                          gallerySlides={projectSlides}
                          active={galleryIndex}
                          onSlideChange={(slideIndex) =>
                            onSlideChange(project.slideIndices[slideIndex])
                          }
                        />
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
          {extraMetrics.length > 0 && (
            <div className="experience-extra-metrics" aria-label="Indicadores complementares">
              {extraMetrics.map((item, index) => (
                <div key={`${item.title}-${index}`}>
                  <span>{item.title}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ExperienceIntro({ section }: { section: PortfolioSection }) {
  if (!section.intro) return null
  if (section.slug !== "invest-rs") return <p>{section.intro}</p>
  const [role, ...period] = section.intro.split(" · ")
  if (!period.length) return <p>{section.intro}</p>
  return (
    <p className="experience-intro">
      {role}
      <span className="experience-period">{period.join(" · ")}</span>
    </p>
  )
}

function ExperienceCard({
  section,
  order,
  isMobile,
  detail,
}: {
  section: PortfolioSection
  order: number
  isMobile: boolean
  detail?: string
}) {
  const items = [
    ...(section.desktopPanelA ?? section.panelA),
    ...(section.desktopPanelB ?? section.panelB),
  ].filter((item) => item.isHidden !== true)
  const competencies =
    items.find((item) => item.title.toLowerCase() === "competências aplicadas")?.tags ?? []
  const projectItems = items.filter((item) => item.title.toLowerCase() !== "competências aplicadas")
  const [activeSlide, setActiveSlide] = useState(0)
  const [mobileView, setMobileView] = useState<"projects" | "trajectory">("projects")
  const changeMobileView = (next: "projects" | "trajectory") => {
    setMobileView(next)
    requestAnimationFrame(() => {
      const header = document.getElementById(`${section.slug}-a`)
      const content = document.getElementById(`${section.slug}-b`)
      if (!header || !content) return
      window.scrollTo({
        top:
          window.scrollY +
          content.getBoundingClientRect().top -
          header.getBoundingClientRect().bottom,
        behavior: "instant",
      })
    })
  }
  return (
    <section
      id={section.slug}
      data-section={section.slug}
      className={`portfolio-section experience-card theme-${section.theme} motion-${section.animation ?? "fade-up"} cms-entrance-${section.animation ?? "fade-up"}`}
      style={{ zIndex: order + 1 }}
    >
      {!isMobile && (
        <div className="desktop-panel experience-desktop">
          <header className="experience-heading">
            <CompanyMark section={section} />
            <h2>{section.title}</h2>
            {section.eyebrow && <p className="experience-eyebrow">{section.eyebrow}</p>}
            <ExperienceIntro section={section} />
            <ExperienceCompetencies tags={competencies} />
          </header>
          <ExperienceContent
            section={section}
            items={projectItems}
            detail={detail}
            activeSlide={activeSlide}
            onSlideChange={setActiveSlide}
          />
          <PhotoGallery section={section} active={activeSlide} onSlideChange={setActiveSlide} />
        </div>
      )}
      {isMobile && (
        <div className="mobile-panels">
          <div
            id={`${section.slug}-a`}
            className="mobile-panel experience-mobile-copy"
            data-panel="a"
          >
            <header className="experience-heading">
              <h2>{section.title}</h2>
              {section.eyebrow && <p className="experience-eyebrow">{section.eyebrow}</p>}
              <ExperienceIntro section={section} />
              <ExperienceCompetencies tags={competencies} />
            </header>
            <div
              className="experience-view-switch"
              role="group"
              aria-label={`Conteúdo de ${section.title}`}
            >
              <button
                type="button"
                className={
                  mobileView === "projects"
                    ? "experience-view-projects is-active"
                    : "experience-view-projects"
                }
                aria-pressed={mobileView === "projects"}
                aria-controls={`${section.slug}-b`}
                onClick={() => changeMobileView("projects")}
              >
                Projetos e realizações
              </button>
              <button
                type="button"
                className={
                  mobileView === "trajectory"
                    ? "experience-view-trajectory is-active"
                    : "experience-view-trajectory"
                }
                aria-pressed={mobileView === "trajectory"}
                aria-controls={`${section.slug}-b`}
                disabled={!detail?.trim()}
                onClick={() => changeMobileView("trajectory")}
              >
                <span>Trajetória</span>
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </div>
          <div
            id={`${section.slug}-b`}
            className="mobile-panel experience-mobile-gallery"
            data-panel="b"
          >
            <ExperienceMobileBody
              section={section}
              items={projectItems}
              detail={detail}
              view={mobileView}
              activeSlide={activeSlide}
              onSlideChange={setActiveSlide}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export function ExperienceStack({
  sections,
  isMobile,
  preview = false,
}: {
  sections: PortfolioSection[]
  isMobile: boolean
  preview?: boolean
}) {
  const [active, setActive] = useState(sections[0]?.slug ?? "")
  const [careerDetails, setCareerDetails] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    void (async () => {
      // Draft career descriptions may be read only inside the protected admin preview.
      const client = (preview
        ? (await import("../../lib/supabase")).supabase
        : publicReadClient) as unknown as PostgrestClient | null
      if (cancelled || !client) return
      const query = client.from("career_experiences").select("id,company,description")
      const { data, error } = await (preview
        ? query.neq("status", "archived")
        : query.eq("status", "published"))
      if (cancelled || error) return
      const published: Record<string, string> = {}
      for (const row of data ?? []) {
        const slug = resolveCareerSectionSlug(row)
        if (slug && row.description) published[slug] = row.description
      }
      setCareerDetails(published)
    })()
    return () => {
      cancelled = true
    }
  }, [preview])

  useEffect(() => {
    if (isMobile) {
      setActive((current) =>
        sections.some((section) => section.slug === current) ? current : (sections[0]?.slug ?? ""),
      )
      return
    }
    const onScroll = () => {
      let selected = sections[0]?.slug ?? ""
      for (const section of sections) {
        const node = document.getElementById(section.slug)
        if (node && node.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          selected = section.slug
        }
      }
      setActive(selected)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [sections, isMobile])

  const displayedSections = isMobile
    ? sections.filter((section) => section.slug === active)
    : sections

  function chooseCompany(event: React.MouseEvent<HTMLAnchorElement>, slug: string) {
    if (!isMobile) {
      setActive(slug)
      return
    }
    event.preventDefault()
    setActive(slug)
    requestAnimationFrame(() => {
      document.getElementById(slug)?.scrollIntoView({
        block: "start",
        behavior: "instant",
      })
    })
  }

  return (
    <div className="experience-stack" aria-label="Experiências profissionais">
      <nav className="experience-index" aria-label="Selecionar empresa">
        {sections.map((section) => (
          <a
            href={`#${section.slug}`}
            key={section.slug}
            className={active === section.slug ? "is-active" : ""}
            aria-label={section.title}
            aria-current={active === section.slug ? "location" : undefined}
            onClick={(event) => chooseCompany(event, section.slug)}
          >
            <CompanyMark section={section} small />
            <span className="experience-index-name">{section.title}</span>
          </a>
        ))}
      </nav>
      {displayedSections.map((section, index) => (
        <ExperienceCard
          key={section.id}
          section={section}
          order={index}
          isMobile={isMobile}
          detail={careerDetails[section.slug]}
        />
      ))}
    </div>
  )
}
