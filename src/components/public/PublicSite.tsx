import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState } from "react"
import { usePortfolio } from "../../hooks/usePortfolio"
import { splitProfileTitle } from "../../lib/profile-title"
import type {
  ContentItem,
  HeroVisualConfig,
  MetricIconName,
  PortfolioSection,
} from "../../types/content"
import { Icon } from "../ui/Icons"
import { Navigation } from "./Navigation"
import { EXPERIENCE_SLUGS } from "../../lib/experience-slugs"
import { ToolIcons } from "./ToolIcons"
import { placementMotionVariables } from "../../lib/placement-motion"
import { imageFramingStyle } from "../../lib/media-framing"
import { heroColor, heroFont, heroSizeClass, heroTextStyle } from "../../lib/hero-formatting"
import { isSafeEditorialImage, resolveHeroCardDestination } from "../../lib/validation"
import {
  mobileEditorialFont,
  mobileEditorialLines,
  mobileProfileEditorial,
} from "../../lib/mobile-profile-editorial"

// The professional experience gallery is below the initial Profile fold.
// Keep its substantial view module out of the critical Hero JavaScript.
const ExperienceStack = lazy(() =>
  import("./ExperienceStack").then((module) => ({ default: module.ExperienceStack })),
)

const heroDefaults = {
  badgeText: "VISÃO 360° DA COMUNICAÇÃO E MARKETING ·",
  panelBackground: "#171617",
  badgeBackground: "#FF5414",
  badgeColor: "#171617",
  introColor: "#FFFFFF",
}

function Badge360({ config }: { config?: HeroVisualConfig }) {
  const pathId = `badge-path-${useId().replace(/:/g, "")}`
  if (config?.badgeVisible === false) return null
  return (
    <div className="badge-360">
      <svg viewBox="0 0 160 160" role="img" aria-label="Visão 360 graus da comunicação e marketing">
        <defs>
          <path id={pathId} d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
        </defs>
        <text
          className={heroSizeClass(config?.fieldFormats?.badgeText)}
          style={heroTextStyle(config?.fieldFormats?.badgeText)}
        >
          <textPath href={`#${pathId}`} textLength="350" lengthAdjust="spacingAndGlyphs">
            {config?.badgeText || heroDefaults.badgeText}
          </textPath>
        </text>
        {config?.badgeIcon === "plus" ? (
          <path d="M80 53v54M53 80h54" />
        ) : config?.badgeIcon === undefined || config.badgeIcon === "arrow" ? (
          <path d="M55 100 102 53M70 53h32v32" />
        ) : null}
      </svg>
      {config?.badgeIcon && !["none", "arrow", "plus"].includes(config.badgeIcon) && (
        <span className="badge-360-symbol">
          <Icon name={config.badgeIcon as MetricIconName} size={46} />
        </span>
      )}
    </div>
  )
}

// Exactly this published CMS image is oversized for the mobile About thumbnail.
// Reserve its original intrinsic ratio but start downloading it only near view.
// Other images and any future CMS replacement preserve their normal loading.
const APPROVED_ABOUT_TABLET =
  "https://zfnrhzplwpjpdljraypt.supabase.co/storage/v1/object/public/portfolio-public/a46a4091-bce1-4345-a17f-7d7947a8e903-tulius_tablet.png"

function DeferredAboutTablet({ alt, style }: { alt: string; style?: React.CSSProperties }) {
  const elementRef = useRef<HTMLImageElement>(null)
  const [nearViewport, setNearViewport] = useState(false)

  useEffect(() => {
    if (nearViewport) return
    const element = elementRef.current
    if (!element) return
    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [nearViewport])

  return (
    <img
      ref={elementRef}
      src={nearViewport ? APPROVED_ABOUT_TABLET : undefined}
      alt={alt}
      style={style}
      width={900}
      height={1200}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
    />
  )
}

function ItemCard({
  item,
  index,
  layout,
  showArrow = false,
  targetSlug,
  onNavigate,
}: {
  item: ContentItem
  index: number
  layout: PortfolioSection["layout"]
  showArrow?: boolean
  targetSlug?: string
  onNavigate?: () => void
}) {
  const contact = layout === "contact" && item.meta?.match(/^(https|mailto)/)
  const presentation = item.placement
  const variant = ["compact", "featured", "wide"].includes(presentation?.layoutVariant ?? "")
    ? presentation?.layoutVariant
    : "default"
  const motionPreset = [
    "none",
    "fade-in",
    "fade-up",
    "stagger",
    "image-reveal",
    "metric-count",
  ].includes(String(presentation?.motionConfig?.preset ?? ""))
    ? String(presentation?.motionConfig?.preset)
    : undefined
  const className = [
    "content-item",
    "reveal",
    variant !== "default" ? `placement-${variant}` : "",
    motionPreset ? `placement-motion-${motionPreset}` : "",
    motionPreset === "fade-up" &&
    typeof presentation?.motionConfig?.distance === "number" &&
    presentation.motionConfig.distance !== 18
      ? "placement-motion-distance-custom"
      : "",
    item.image ? "has-image" : "",
    item.desktop?.visible === false ? "item-hidden-desktop" : "",
    item.mobile?.visible === false ? "item-hidden-mobile" : "",
    targetSlug ? "area-card-link" : "",
  ]
    .filter(Boolean)
    .join(" ")
  const style = itemStyle(item)
  const content = (
    <>
      {layout === "metrics" && item.value && (
        <span className="result-metric-icon">
          <Icon name={item.metricIcon ?? "chart"} size={23} />
        </span>
      )}
      {item.toolIcons && item.toolIcons.length > 0 && <ToolIcons icons={item.toolIcons} />}
      {item.image &&
        (item.image === APPROVED_ABOUT_TABLET ? (
          <DeferredAboutTablet alt={item.alt ?? ""} style={imageFramingStyle(item.mediaFraming)} />
        ) : (
          <img
            src={item.image}
            alt={item.alt ?? ""}
            style={imageFramingStyle(item.mediaFraming)}
            loading="lazy"
            decoding="async"
            fetchPriority={index === 0 ? "auto" : "low"}
          />
        ))}
      <div className="item-copy">
        {item.label && (
          <span
            className={"item-label " + (heroSizeClass(item.fieldFormats?.label) ?? "")}
            style={heroTextStyle(item.fieldFormats?.label)}
          >
            {item.label}
          </span>
        )}
        {item.value && (
          <strong
            className={["item-value", heroSizeClass(item.fieldFormats?.value)]
              .filter(Boolean)
              .join(" ")}
            style={heroTextStyle(item.fieldFormats?.value)}
          >
            {item.value}
          </strong>
        )}
        <h3
          className={heroSizeClass(item.fieldFormats?.title)}
          style={heroTextStyle(item.fieldFormats?.title)}
        >
          {item.title}
        </h3>
        {item.meta && !contact && (
          <p
            className={"item-meta " + (heroSizeClass(item.fieldFormats?.meta) ?? "")}
            style={heroTextStyle(item.fieldFormats?.meta)}
          >
            {item.meta}
          </p>
        )}
        {item.text && (
          <p
            className={heroSizeClass(item.fieldFormats?.text)}
            style={heroTextStyle(item.fieldFormats?.text)}
          >
            {item.text}
          </p>
        )}
        {item.tags && (
          <ul className="tags">
            {item.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        {item.placeholder && <span className="draft-chip">Rascunho editorial</span>}
      </div>
      {(contact || (showArrow && item.icon !== "none")) && (
        <span className="item-arrow">
          <Icon name="arrow" />
        </span>
      )}
    </>
  )
  return contact || targetSlug ? (
    <a
      className={`${className}${contact ? " contact-link" : ""}`}
      data-motion-once={presentation?.motionConfig?.once === false ? "false" : undefined}
      style={style}
      href={targetSlug ? `#${targetSlug}` : item.meta}
      onClick={onNavigate}
      target={contact && item.meta?.startsWith("http") ? "_blank" : undefined}
      rel={contact ? "noreferrer" : undefined}
    >
      {content}
    </a>
  ) : (
    <article
      className={className}
      data-motion-once={presentation?.motionConfig?.once === false ? "false" : undefined}
      style={style}
    >
      {content}
    </article>
  )
}

/** WebP derivatives of the SHA-256 verified CMS portrait (source remains untouched). */
const APPROVED_PROFILE_PORTRAIT =
  "https://zfnrhzplwpjpdljraypt.supabase.co/storage/v1/object/public/portfolio-public/b171afda-2708-44eb-b3e5-ab2b7ff13236-tulius_site.png"
const RESPONSIVE_PROFILE_SOURCE =
  "/media/tulius-site-600.webp 600w, /media/tulius-site-900.webp 900w"

function ApprovedProfileImage({
  src,
  alt,
  mobile = false,
  style,
}: {
  src?: string
  alt?: string
  mobile?: boolean
  style?: React.CSSProperties
}) {
  const image = (
    <img
      src={src}
      alt={alt ?? ""}
      style={style}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  )
  if (src !== APPROVED_PROFILE_PORTRAIT) return image
  return (
    <picture className="approved-profile-picture">
      <source
        type="image/webp"
        srcSet={RESPONSIVE_PROFILE_SOURCE}
        sizes={mobile ? "(max-width: 600px) 45vw, 450px" : "(max-width: 1100px) 50vw, 420px"}
      />
      {image}
    </picture>
  )
}

function ProfileDesktop({
  section,
  nextSectionSlug,
  publishedSlugs,
  onSelectTheme,
}: {
  section: PortfolioSection
  nextSectionSlug?: string
  publishedSlugs: string[]
  onSelectTheme: (themeKey: string) => void
}) {
  const panelA = section.desktopPanelA ?? section.panelA
  const panelB = section.desktopPanelB ?? section.panelB
  const areas = panelB.slice(0, 5)
  const careers = panelB.slice(5)
  const profile = panelA[0]
  const hero = profile?.hero
  const rightHero = panelB[0]?.hero
  const profileName = splitProfileTitle(section.title)
  if (!profile)
    return (
      <div className="desktop-editorial">
        <h2>{section.title}</h2>
        <p>Nenhum conteúdo publicado para este painel.</p>
      </div>
    )
  return (
    <div
      className="profile-desktop"
      style={hero?.rootBackground ? { backgroundColor: heroColor(hero.rootBackground) } : undefined}
    >
      <aside className="profile-sidebar" style={{ ...itemStyle(profile), ...heroStyle(hero) }}>
        <div className="profile-portrait">
          <ApprovedProfileImage
            src={profile.image}
            alt={profile.alt}
            style={imageFramingStyle(profile.mediaFraming)}
          />
          <div className="years">
            <strong
              className={heroSizeClass(profile.fieldFormats?.title)}
              style={heroTextStyle(profile.fieldFormats?.title)}
            >
              {profile.title}
            </strong>
            <span
              className={heroSizeClass(profile.fieldFormats?.text)}
              style={heroTextStyle(profile.fieldFormats?.text)}
            >
              {profile.text}
            </span>
          </div>
          <Badge360 config={hero} />
        </div>
        <div className="profile-sidebar-content">
          <p
            className={"profile-intro " + (heroSizeClass(hero?.fieldFormats?.intro) ?? "")}
            style={heroTextStyle(hero?.fieldFormats?.intro)}
          >
            {section.intro}
          </p>
          <div className="profile-highlights">
            <h2 className="sr-only">Destaques</h2>
            {panelA.slice(1).map((item, i) => (
              <ItemCard key={item.title} item={item} index={i} layout="hero" showArrow />
            ))}
          </div>
        </div>
      </aside>
      <div className="profile-main">
        <div className="name-lockup">
          <span
            className={heroSizeClass(rightHero?.fieldFormats?.title)}
            style={heroTextStyle(rightHero?.fieldFormats?.title)}
          >
            {profileName.first}
          </span>
          <span
            className={heroSizeClass(rightHero?.fieldFormats?.title)}
            style={heroTextStyle(rightHero?.fieldFormats?.title)}
          >
            {profileName.rest}
          </span>
        </div>
        <p
          className={"profile-role " + (heroSizeClass(rightHero?.fieldFormats?.role) ?? "")}
          style={heroTextStyle(rightHero?.fieldFormats?.role)}
        >
          {section.eyebrow}
        </p>
        <div className="area-grid">
          {areas.map((item, index) => (
            <ItemCard
              key={item.label}
              item={item}
              index={0}
              layout="hero"
              targetSlug={resolveHeroCardDestination(item.targetSlug, publishedSlugs)}
              onNavigate={
                resolveHeroCardDestination(item.targetSlug, publishedSlugs) === "resultados"
                  ? () => onSelectTheme(item.themeKey || RESULT_THEME_KEYS[index])
                  : undefined
              }
            />
          ))}
        </div>
        <h2
          className={heroSizeClass(rightHero?.fieldFormats?.secondaryTitle)}
          style={heroTextStyle(rightHero?.fieldFormats?.secondaryTitle)}
        >
          {rightHero?.secondaryTitle || "Experiência e atuação"}
        </h2>
        <div className="career-grid">
          {careers.map((item, i) => (
            <ItemCard
              key={item.title}
              item={item}
              index={i}
              layout="hero"
              targetSlug={
                publishedSlugs.includes(item.targetSlug ?? "") ? item.targetSlug : undefined
              }
            />
          ))}
        </div>
        {nextSectionSlug && (
          <a
            className="profile-next-section"
            style={{
              color: heroColor(rightHero?.nextColor),
              backgroundColor: heroColor(rightHero?.nextBackground),
            }}
            href={`#${rightHero?.nextTarget && publishedSlugs.includes(rightHero.nextTarget) ? rightHero.nextTarget : nextSectionSlug}`}
            aria-label="Ir para a próxima seção"
            title="Ir para a próxima seção"
          >
            {rightHero?.nextIcon !== "none" && (
              <Icon name={(rightHero?.nextIcon ?? "down") as MetricIconName} size={28} />
            )}
          </a>
        )}
      </div>
    </div>
  )
}

/** A separate mobile-only composition; desktop keeps ProfileDesktop and its original data. */
function ProfileMobileEditorial({
  section,
  profile,
}: {
  section: PortfolioSection
  profile: ContentItem
}) {
  const config = mobileProfileEditorial(profile.hero?.mobileEditorial)
  const rightHero = section.panelB[0]?.hero
  const positioning = (section.eyebrow ?? "").split(" · ").slice(1).join(" · ")
  const profileName = splitProfileTitle(section.title)
  const firstName = profileName.first
  const surname = profileName.rest
  const portrait =
    config.mobileImage && isSafeEditorialImage(config.mobileImage)
      ? config.mobileImage
      : profile.image

  return (
    <div
      className="mobile360"
      style={{
        ...heroStyle(profile.hero),
        ...(profile.hero?.rootBackground
          ? { backgroundColor: heroColor(profile.hero.rootBackground) }
          : {}),
      }}
    >
      <div
        className="mobile360-top"
        style={
          {
            backgroundColor: config.top.background,
            color: config.top.textColor,
            paddingBlock: `${config.top.paddingY}px`,
            "--mobile360-top-font": mobileEditorialFont(config.top.fontFamily),
            "--mobile360-headline-color": config.top.textColor,
            "--mobile360-headline-accent": config.top.accentColor,
            "--mobile360-support-color": config.top.supportColor,
            "--mobile360-support-font": mobileEditorialFont(config.top.supportFontFamily),
            "--mobile360-headline-size": `${config.top.headlineSize}px`,
          } as React.CSSProperties
        }
      >
        {config.top.showHeadline !== false && (
          <h1 className="mobile360-headline">
            {mobileEditorialLines(config.headline).map((line, index, lines) => (
              <span
                className={index === lines.length - 1 ? "mobile360-headline-accent" : undefined}
                key={`${index}-${line}`}
              >
                {line}
              </span>
            ))}
          </h1>
        )}
        {config.top.showSupport !== false && positioning && (
          <p
            className={"mobile360-support " + (heroSizeClass(rightHero?.fieldFormats?.role) ?? "")}
            style={heroTextStyle(rightHero?.fieldFormats?.role)}
          >
            {positioning}
          </p>
        )}
      </div>
      <div
        className="mobile360-middle"
        style={
          {
            backgroundColor: config.middle.background,
            paddingBlock: `${config.middle.paddingY}px`,
            "--hero-badge-background": "transparent",
            "--hero-badge-color": config.middle.textColor,
            "--mobile360-badge-font": mobileEditorialFont(config.middle.fontFamily),
            "--mobile360-badge-size": `${config.middle.badgeSize}px`,
          } as React.CSSProperties
        }
      >
        {config.middle.showBadge !== false && (
          <Badge360
            config={{
              ...profile.hero,
              badgeVisible: true,
              badgeText: config.badgeText || profile.hero?.badgeText,
            }}
          />
        )}
      </div>
      <div
        className="mobile360-bottom"
        style={
          {
            backgroundColor: config.bottom.background,
            color: config.bottom.textColor,
            paddingBlock: `${config.bottom.paddingY}px`,
            "--mobile360-bottom-font": mobileEditorialFont(config.bottom.fontFamily),
            "--mobile360-bottom-accent": config.bottom.accentColor,
            "--mobile360-bottom-text": config.bottom.textColor,
            "--mobile360-description-color": config.bottom.descriptionColor,
            "--mobile360-description-font": mobileEditorialFont(
              config.bottom.descriptionFontFamily,
            ),
            "--mobile360-photo-width": `${config.bottom.photoWidth}%`,
            "--mobile360-name-size": `${config.bottom.nameSize}px`,
            "--mobile360-years-size": `${config.bottom.yearsSize}px`,
          } as React.CSSProperties
        }
      >
        <div
          className={`mobile360-bottom-grid${config.bottom.showPhoto === false || !portrait ? " no-photo" : ""}`}
        >
          {config.bottom.showPhoto !== false && portrait && (
            <div className="mobile360-photo">
              <ApprovedProfileImage
                src={portrait}
                alt={config.mobileImage ? config.mobileAlt : profile.alt}
                mobile
                style={imageFramingStyle(
                  config.mobileImage ? config.mobileFraming : profile.mediaFraming,
                )}
              />
            </div>
          )}
          <div className="mobile360-bottom-copy">
            {config.bottom.showName !== false && (
              <div className="mobile360-person-name">
                <span
                  className={heroSizeClass(rightHero?.fieldFormats?.title)}
                  style={heroTextStyle(rightHero?.fieldFormats?.title)}
                >
                  {firstName}
                </span>
                <strong
                  className={heroSizeClass(rightHero?.fieldFormats?.title)}
                  style={heroTextStyle(rightHero?.fieldFormats?.title)}
                >
                  {surname}
                </strong>
              </div>
            )}
            {config.bottom.showExperience !== false && (
              <div className="mobile360-experience">
                <strong
                  className={heroSizeClass(profile.fieldFormats?.title)}
                  style={heroTextStyle(profile.fieldFormats?.title)}
                >
                  {profile.title}
                </strong>
                {profile.text && (
                  <p
                    className={heroSizeClass(profile.fieldFormats?.text)}
                    style={heroTextStyle(profile.fieldFormats?.text)}
                  >
                    {profile.text}
                  </p>
                )}
              </div>
            )}
            {config.bottom.showArrow !== false && (
              <a
                className="mobile360-down"
                href="#perfil-b"
                aria-label="Ir para áreas de atuação e experiências"
                title="Ir para áreas de atuação e experiências"
              >
                <Icon name="down" size={27} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileMobilePresentation({
  section,
  profile,
}: {
  section: PortfolioSection
  profile: ContentItem
}) {
  const hero = profile.hero
  const rightHero = section.panelB[0]?.hero
  if (hero?.mobileEditorial?.enabled) {
    return <ProfileMobileEditorial section={section} profile={profile} />
  }
  const [kicker, ...positioning] = (section.eyebrow ?? "").split(" · ")
  const profileName = splitProfileTitle(section.title)
  return (
    <>
      <div className="profile-mobile-identity">
        {kicker && <p className="profile-mobile-kicker">{kicker}</p>}
        <div className="mobile-name">
          <span
            className={heroSizeClass(rightHero?.fieldFormats?.title)}
            style={heroTextStyle(rightHero?.fieldFormats?.title)}
          >
            {profileName.first}
          </span>
          <span
            className={heroSizeClass(rightHero?.fieldFormats?.title)}
            style={heroTextStyle(rightHero?.fieldFormats?.title)}
          >
            {profileName.rest}
          </span>
        </div>
        {positioning.length > 0 && (
          <p
            className={
              "profile-mobile-positioning " + (heroSizeClass(rightHero?.fieldFormats?.role) ?? "")
            }
            style={heroTextStyle(rightHero?.fieldFormats?.role)}
          >
            {positioning.join(" · ")}
          </p>
        )}
      </div>
      <div className="profile-mobile-stage" style={{ ...itemStyle(profile), ...heroStyle(hero) }}>
        <div className="mobile-profile-hero">
          <ApprovedProfileImage
            src={profile.image}
            alt={profile.alt}
            style={imageFramingStyle(profile.mediaFraming)}
            mobile
          />
          <div className="profile-mobile-years">
            <strong
              className={heroSizeClass(profile.fieldFormats?.title)}
              style={heroTextStyle(profile.fieldFormats?.title)}
            >
              {profile.title}
            </strong>
            {profile.text && (
              <p
                className={heroSizeClass(profile.fieldFormats?.text)}
                style={heroTextStyle(profile.fieldFormats?.text)}
              >
                {profile.text}
              </p>
            )}
          </div>
          <Badge360 config={hero} />
        </div>
        {section.intro && (
          <p
            className={"mobile-intro " + (heroSizeClass(hero?.fieldFormats?.intro) ?? "")}
            style={heroTextStyle(hero?.fieldFormats?.intro)}
          >
            {section.intro}
          </p>
        )}
        <a
          className="profile-mobile-next"
          href="#perfil-b"
          aria-label="Ir para áreas de atuação e experiências"
          title="Ir para áreas de atuação e experiências"
        >
          <Icon name="down" size={28} />
        </a>
      </div>
    </>
  )
}

function ProfileMobileDetails({
  items,
  publishedSlugs,
  onSelectTheme,
}: {
  items: ContentItem[]
  publishedSlugs: string[]
  onSelectTheme: (themeKey: string) => void
}) {
  const areas = items.slice(0, 5)
  return (
    <div className="profile-mobile-details">
      <header className="profile-mobile-block-heading">
        <h2>Áreas de atuação</h2>
      </header>
      <ol className="profile-mobile-area-list">
        {areas.map((item, index) => {
          const destination = resolveHeroCardDestination(item.targetSlug, publishedSlugs)
          const content = (
            <>
              <span
                className={["profile-mobile-area-number", heroSizeClass(item.fieldFormats?.label)]
                  .filter(Boolean)
                  .join(" ")}
                style={heroTextStyle(item.fieldFormats?.label)}
              >
                {item.label || String(index + 1).padStart(2, "0")}
              </span>
              <strong
                className={heroSizeClass(item.fieldFormats?.title)}
                style={heroTextStyle(item.fieldFormats?.title)}
              >
                {item.title}
              </strong>
              {destination && <Icon name="arrow" size={19} />}
            </>
          )
          return (
            <li
              key={`${item.title}-${index}`}
              className={item.mobile?.visible === false ? "item-hidden-mobile" : undefined}
              style={itemStyle(item)}
            >
              {destination ? (
                <a
                  href={`#${destination}`}
                  onClick={
                    destination === "resultados"
                      ? () => onSelectTheme(item.themeKey || RESULT_THEME_KEYS[index])
                      : undefined
                  }
                >
                  {content}
                </a>
              ) : (
                <div>{content}</div>
              )}
            </li>
          )
        })}
      </ol>
      {/* Área inferior reservada para conteúdo futuro; experiências mantidas no CMS. */}
    </div>
  )
}

function MobilePanel({
  section,
  panel,
  items,
  publishedSlugs,
  onSelectTheme,
}: {
  section: PortfolioSection
  panel: "a" | "b"
  items: ContentItem[]
  publishedSlugs: string[]
  onSelectTheme: (themeKey: string) => void
}) {
  const isProfile = section.slug === "perfil"
  const isAbout = section.slug === "sobre"
  const aboutStatement = section.panelB[0]
  const visibleItems = isAbout && panel === "b" ? items.slice(1) : items
  const profile = items[0]
  const hero = profile?.hero
  return (
    <div
      id={`${section.slug}-${panel}`}
      data-panel={panel}
      className={`mobile-panel panel-${panel}${isProfile && panel === "a" && hero?.mobileEditorial?.enabled ? " editorial360-mobile" : ""}`}
    >
      {section.slug === "depoimentos" ? (
        <>
          <header className="panel-heading">
            <h2>{section.title}</h2>
          </header>
          <TestimonialCards items={items} />
        </>
      ) : section.slug === "contato" && panel === "a" ? (
        <>
          <header className="panel-heading">
            <h2>{section.title}</h2>
          </header>
          <div className="contact-mobile-photo">
            {profile?.image && (
              <img
                src={profile.image}
                alt={profile.alt ?? ""}
                style={imageFramingStyle(profile.mediaFraming)}
                loading="lazy"
              />
            )}
          </div>
        </>
      ) : isProfile && panel === "a" && profile ? (
        <ProfileMobilePresentation section={section} profile={profile} />
      ) : isProfile && panel === "b" ? (
        <ProfileMobileDetails
          items={items}
          publishedSlugs={publishedSlugs}
          onSelectTheme={onSelectTheme}
        />
      ) : (
        <>
          <header
            className={
              panel === "b" && ["formacao", "ferramentas", "contato"].includes(section.slug)
                ? "panel-heading mobile-panel-secondary-heading"
                : "panel-heading"
            }
          >
            {panel === "b" && ["formacao", "ferramentas", "contato"].includes(section.slug) ? (
              <h3 className="mobile-panel-subheading">
                {section.slug === "formacao"
                  ? "Idiomas e formação complementar"
                  : section.slug === "ferramentas"
                    ? "Outras ferramentas"
                    : "Canais de contato"}
              </h3>
            ) : (
              <h2>{isProfile ? "Experiência e atuação" : section.title}</h2>
            )}
            {panel === "a" && section.eyebrow && <p>{section.eyebrow}</p>}
            {panel === "a" && section.intro && <p className="section-intro">{section.intro}</p>}
          </header>
          <div className={`mobile-items ${isProfile && panel === "b" ? "profile-b-items" : ""}`}>
            {visibleItems.map((item, i) => (
              <ItemCard
                key={`${item.title}-${i}`}
                item={
                  isAbout && panel === "a" && i === 0
                    ? {
                        ...item,
                        title: aboutStatement?.title ?? "",
                        text: aboutStatement?.text,
                        label: aboutStatement?.label,
                      }
                    : item
                }
                index={i}
                layout={section.layout}
                targetSlug={
                  isProfile && panel === "b"
                    ? i < 5
                      ? resolveHeroCardDestination(item.targetSlug, publishedSlugs)
                      : publishedSlugs.includes(item.targetSlug ?? "")
                        ? item.targetSlug
                        : undefined
                    : undefined
                }
                onNavigate={
                  isProfile &&
                  panel === "b" &&
                  i < 5 &&
                  resolveHeroCardDestination(item.targetSlug, publishedSlugs) === "resultados"
                    ? () => onSelectTheme(item.themeKey || RESULT_THEME_KEYS[i])
                    : undefined
                }
              />
            ))}
          </div>
          {section.slug === "contato" && panel === "b" && (
            <ContactFooter section={section} location={section.panelA[0]?.text} />
          )}
        </>
      )}
    </div>
  )
}

function itemStyle(item: ContentItem) {
  const placement = item.placement
  const config = placement?.styleConfig ?? {}
  const number = (key: string, min: number, max: number): number | undefined => {
    const value = config[key]
    return typeof value === "number" && Number.isFinite(value)
      ? Math.max(min, Math.min(max, value))
      : undefined
  }
  const align = ["left", "center", "right"].includes(String(config.textAlign))
    ? String(config.textAlign)
    : undefined
  return {
    ...placementMotionVariables(placement?.motionConfig),
    "--placement-width": toPercent(number("width", 10, 100)),
    "--placement-spacing": toPixels(number("spacing", 0, 120)),
    "--placement-title-size": toPixels(number("titleSize", 8, 120)),
    "--placement-text-size": toPixels(number("textSize", 8, 72)),
    "--placement-align": align,
    "--item-title-color": item.titleColor || undefined,
    "--item-text-color": item.textColor || undefined,
    "--item-background": item.backgroundColor || undefined,
    "--item-desktop-order": number("order", -20, 20) ?? item.desktop?.order,
    "--item-desktop-spacing": toPixels(number("spacing", 0, 120) ?? item.desktop?.spacing),
    "--item-desktop-width": toPercent(number("width", 10, 100) ?? item.desktop?.width),
    "--item-desktop-title-size": toPixels(number("titleSize", 8, 120) ?? item.desktop?.titleSize),
    "--item-desktop-text-size": toPixels(number("textSize", 8, 72) ?? item.desktop?.textSize),
    "--item-desktop-align": align ?? item.desktop?.textAlign ?? undefined,
    "--item-mobile-order": number("order", -20, 20) ?? item.mobile?.order,
    "--item-mobile-spacing": toPixels(number("spacing", 0, 120) ?? item.mobile?.spacing),
    "--item-mobile-width": toPercent(number("width", 10, 100) ?? item.mobile?.width),
    "--item-mobile-title-size": toPixels(number("titleSize", 8, 120) ?? item.mobile?.titleSize),
    "--item-mobile-text-size": toPixels(number("textSize", 8, 72) ?? item.mobile?.textSize),
    "--item-mobile-align": align ?? item.mobile?.textAlign ?? undefined,
  } as React.CSSProperties
}

function heroStyle(config?: HeroVisualConfig) {
  const desktop = config?.desktop
  const mobile = config?.mobile
  return {
    "--hero-panel-background": heroColor(config?.panelBackground) || heroDefaults.panelBackground,
    "--hero-badge-background": heroColor(config?.badgeBackground) || heroDefaults.badgeBackground,
    "--hero-badge-color": heroColor(config?.badgeColor) || heroDefaults.badgeColor,
    "--hero-intro-color": heroColor(config?.introColor) || heroDefaults.introColor,
    "--hero-desktop-visual-height": toDvh(desktop?.visualHeight),
    "--hero-desktop-image-width": toPercent(desktop?.imageWidth),
    "--hero-desktop-image-height": toPercent(desktop?.imageHeight),
    "--hero-desktop-image-x": toPercent(desktop?.imagePositionX),
    "--hero-desktop-image-y": toPercent(desktop?.imagePositionY),
    "--hero-desktop-years-x": toPercent(desktop?.yearsX),
    "--hero-desktop-years-y": toPercent(desktop?.yearsY),
    "--hero-desktop-years-width": toPercent(desktop?.yearsWidth),
    "--hero-desktop-badge-size": toPercent(desktop?.badgeSize),
    "--hero-desktop-badge-x": toPercent(desktop?.badgeX),
    "--hero-desktop-badge-y": toPercent(desktop?.badgeY),
    "--hero-desktop-content-gap": toPixels(desktop?.contentGap),
    "--hero-desktop-intro-size": toPixels(desktop?.introSize),
    "--hero-desktop-intro-spacing": toPixels(desktop?.introSpacing),
    "--hero-desktop-intro-align": desktop?.introAlign ?? undefined,
    "--hero-mobile-image-width": toPercent(mobile?.imageWidth),
    "--hero-mobile-image-height": toPercent(mobile?.imageHeight),
    "--hero-mobile-image-x": toPercent(mobile?.imagePositionX),
    "--hero-mobile-image-y": toPercent(mobile?.imagePositionY),
    "--hero-mobile-badge-size": toPercent(mobile?.badgeSize),
    "--hero-mobile-badge-x": toPercent(mobile?.badgeX),
    "--hero-mobile-badge-y": toPercent(mobile?.badgeY),
    "--hero-mobile-intro-size": toPixels(mobile?.introSize),
    "--hero-mobile-intro-spacing": toPixels(mobile?.introSpacing),
    "--hero-mobile-intro-align": mobile?.introAlign ?? undefined,
  } as React.CSSProperties
}

function toPixels(value?: number) {
  return value == null ? undefined : `${value}px`
}

function toPercent(value?: number) {
  return value == null ? undefined : `${value}%`
}

function toDvh(value?: number) {
  return value == null ? undefined : `${value}dvh`
}

/**
 * Desktop-only editorial composition for section 02.
 * All copy remains in the existing CMS rows; the image has its own optional
 * desktop asset key so the original mobile thumbnail is not changed.
 */

function AboutMobile({ section }: { section: PortfolioSection }) {
  const photo = section.panelA[0]
  const imageSource = photo?.image || photo?.aboutDesktopImage
  const imageAlt = photo?.alt || photo?.aboutDesktopAlt || "Tulius Tsangaropulos com um tablet"

  return (
    <>
      <div
        className="mobile-panel about-mobile-panel about-mobile-intro"
        id="sobre-a"
        data-panel="a"
      >
        <header className="about-mobile-copy">
          <h2>{section.title}</h2>
          {section.eyebrow && <p className="about-mobile-eyebrow">{section.eyebrow}</p>}
          {section.intro && <p className="about-mobile-description">{section.intro}</p>}
        </header>
        {imageSource && (
          <div className="about-mobile-photo">
            {imageSource === APPROVED_ABOUT_TABLET ? (
              <DeferredAboutTablet alt={imageAlt} style={imageFramingStyle(photo?.mediaFraming)} />
            ) : (
              <img
                src={imageSource}
                alt={imageAlt}
                style={imageFramingStyle(photo?.mediaFraming)}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        )}
      </div>
      <div
        className="mobile-panel about-mobile-panel about-mobile-continuation"
        id="sobre-b"
        data-panel="b"
      >
        <div className="about-mobile-differences">
          {section.panelB.map((item, index) => (
            <ItemCard
              key={`${item.title}-${index}`}
              item={item}
              index={index}
              layout={section.layout}
            />
          ))}
        </div>
      </div>
    </>
  )
}

function AboutDesktop({ section }: { section: PortfolioSection }) {
  const itemsA = section.desktopPanelA ?? section.panelA
  const itemsB = section.desktopPanelB ?? section.panelB
  const introductoryItem = itemsA[0]
  const customDesktopImage = introductoryItem?.aboutDesktopImage?.trim()
  const desktopImage = customDesktopImage || "/media/tulius-contact.jpg"

  return (
    <div className="about-desktop">
      <header className="section-heading about-heading">
        <h2>{section.title}</h2>
        {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
        {section.intro && <p className="section-intro">{section.intro}</p>}
      </header>
      <div className={`about-portrait${customDesktopImage ? " has-custom-image" : ""}`}>
        {introductoryItem && (
          <img
            src={desktopImage}
            style={imageFramingStyle(introductoryItem.aboutDesktopFraming)}
            alt={introductoryItem.aboutDesktopAlt || "Tulius Tsangaropulos segurando um tablet"}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div className="about-statements">
        {itemsB.map((item, index) => (
          <ItemCard
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            layout={section.layout}
          />
        ))}
      </div>
    </div>
  )
}

const RESULT_THEME_KEYS = ["corporativa", "projetos", "eventos", "marketing", "imprensa"]

function ResultsCenter({
  section,
  selectedTheme,
  mobile = false,
}: {
  section: PortfolioSection
  selectedTheme: string | null
  mobile?: boolean
}) {
  const topics = mobile ? section.panelB : (section.desktopPanelB ?? section.panelB)
  const metrics = mobile ? section.panelA : (section.desktopPanelA ?? section.panelA)
  const topic = topics.find(
    (item, index) => (item.themeKey || RESULT_THEME_KEYS[index]) === selectedTheme,
  )
  const filteredMetrics = topic
    ? metrics.filter((item) => item.relatedThemeKeys?.includes(topic.themeKey || ""))
    : metrics

  return (
    <div className="results-center" aria-live="polite">
      {topic && (
        <article className="results-topic">
          {topic.themeAxis && <p className="results-axis">{topic.themeAxis}</p>}
          <h3>{topic.themeTitle || topic.title}</h3>
          {topic.themeSubtitle && <p className="results-subtitle">{topic.themeSubtitle}</p>}
          {topic.themeTopics && (
            <div className="results-related">
              <strong>Temas relacionados</strong>
              <p>{topic.themeTopics}</p>
            </div>
          )}
          {topic.themeSummary && <p className="results-summary">{topic.themeSummary}</p>}
          {Boolean(topic.inheritedHighlights?.length) && (
            <div className="results-inherited">
              <strong>Competências e experiência</strong>
              <ul>
                {topic.inheritedHighlights?.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}
      {filteredMetrics.length > 0 && (
        <div className="results-metrics-grid">
          {filteredMetrics.map((item, index) => (
            <ItemCard
              key={`${item.title}-${index}`}
              item={{ ...item, label: undefined }}
              index={index}
              layout="metrics"
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ResultsThemeChooser({
  section,
  selectedTheme,
  onSelectTheme,
}: {
  section: PortfolioSection
  selectedTheme: string | null
  onSelectTheme: (themeKey: string | null) => void
}) {
  const items = section.desktopPanelB ?? section.panelB
  return (
    <div className="results-theme-list" aria-label="Filtrar resultados por especialidade">
      <button
        type="button"
        className={selectedTheme === null ? "is-active" : ""}
        aria-pressed={selectedTheme === null}
        onClick={() => onSelectTheme(null)}
      >
        Visão geral — indicadores
      </button>
      {items.map((item, index) => {
        const key = item.themeKey || RESULT_THEME_KEYS[index]
        return (
          <button
            key={key}
            type="button"
            aria-pressed={selectedTheme === key}
            className={selectedTheme === key ? "is-active" : ""}
            onClick={() => onSelectTheme(key)}
          >
            {item.title}
          </button>
        )
      })}
    </div>
  )
}

function ResultsDesktop({
  section,
  selectedTheme,
  onSelectTheme,
}: {
  section: PortfolioSection
  selectedTheme: string | null
  onSelectTheme: (themeKey: string | null) => void
}) {
  return (
    <div className="desktop-editorial results-editorial">
      <header className="section-heading">
        <h2>{section.title}</h2>
        {section.intro && <p className="section-intro">{section.intro}</p>}
      </header>
      <div className="desktop-content">
        <ResultsCenter section={section} selectedTheme={selectedTheme} />
        <ResultsThemeChooser
          section={section}
          selectedTheme={selectedTheme}
          onSelectTheme={onSelectTheme}
        />
      </div>
    </div>
  )
}

function ResultsMobile({
  section,
  selectedTheme,
  onSelectTheme,
}: {
  section: PortfolioSection
  selectedTheme: string | null
  onSelectTheme: (themeKey: string | null) => void
}) {
  return (
    <div className="mobile-panel results-mobile-panel" id="resultados-a" data-panel="a">
      <header className="panel-heading">
        <h2>{section.title}</h2>
        {section.intro && <p className="section-intro">{section.intro}</p>}
      </header>
      <label htmlFor="resultados-mobile-selector" className="sr-only">
        Selecionar categoria de resultados
      </label>
      <select
        id="resultados-mobile-selector"
        className="results-mobile-selector"
        value={selectedTheme ?? ""}
        onChange={(event) => onSelectTheme(event.target.value || null)}
      >
        <option value="">Visão geral — indicadores</option>
        {section.panelB.map((item, index) => (
          <option key={`${item.title}-${index}`} value={item.themeKey || RESULT_THEME_KEYS[index]}>
            {item.title}
          </option>
        ))}
      </select>
      <ResultsCenter section={section} selectedTheme={selectedTheme} mobile />
    </div>
  )
}

function TestimonialCards({ items }: { items: ContentItem[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="testimonials-grid">
      {items.map((item, index) => {
        const key = item.title + "-" + index
        const isExpanded = expanded === key
        return (
          <button
            type="button"
            key={key}
            className={`testimonial-card${isExpanded ? " is-expanded" : ""}`}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "Recolher" : "Expandir"} depoimento de ${item.title}`}
            onClick={() => setExpanded(isExpanded ? null : key)}
          >
            <div className="testimonial-person">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.alt ?? ""}
                  style={imageFramingStyle(item.mediaFraming)}
                  loading="lazy"
                />
              )}
              <div>
                <h3>{item.title}</h3>
                {item.meta && <span>{item.meta}</span>}
              </div>
            </div>
            <p className="testimonial-quote">{item.text}</p>
            <span className="testimonial-action">
              {isExpanded ? "Recolher −" : "Ler depoimento completo +"}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function TestimonialsDesktop({ section }: { section: PortfolioSection }) {
  const items = [
    ...(section.desktopPanelA ?? section.panelA),
    ...(section.desktopPanelB ?? section.panelB),
  ]
  return (
    <div className="desktop-editorial testimonials-editorial">
      <header className="section-heading">
        <h2>{section.title}</h2>
        {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
      </header>
      <TestimonialCards items={items} />
    </div>
  )
}

function ContactFooter({ section, location }: { section: PortfolioSection; location?: string }) {
  return (
    <footer className="contact-footer">
      <span>{section.intro}</span>
      {location && <span>{location}</span>}
    </footer>
  )
}

function ContactDesktop({ section }: { section: PortfolioSection }) {
  const portrait = (section.desktopPanelA ?? section.panelA)[0]
  const links = section.desktopPanelB ?? section.panelB
  return (
    <div className="contact-desktop">
      <header className="section-heading contact-heading">
        <h2>{section.title}</h2>
        {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
      </header>
      <div className="contact-portrait">
        {portrait?.image && (
          <img
            src={portrait.image}
            alt={portrait.alt ?? ""}
            style={imageFramingStyle(portrait.mediaFraming)}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div className="contact-links">
        {links.map((item, i) => (
          <ItemCard key={item.title + i} item={item} index={i} layout="contact" />
        ))}
      </div>
      <ContactFooter section={section} location={portrait?.text} />
    </div>
  )
}

function Section({
  section,
  nextSectionSlug,
  publishedSlugs,
  selectedTheme,
  isMobile,
  onSelectTheme,
}: {
  section: PortfolioSection
  nextSectionSlug?: string
  publishedSlugs: string[]
  selectedTheme: string | null
  isMobile: boolean
  onSelectTheme: (themeKey: string | null) => void
}) {
  return (
    <section
      id={section.slug}
      data-section={section.slug}
      className={`portfolio-section theme-${section.theme} layout-${section.layout} motion-${section.animation ?? "fade-up"} cms-entrance-${section.animation ?? "fade-up"}`}
    >
      {section.anchor && (
        <span className="portfolio-anchor-alias" id={section.anchor} aria-hidden="true" />
      )}
      {!isMobile && (
        <div className="desktop-panel">
          {section.slug === "perfil" ? (
            <ProfileDesktop
              section={section}
              nextSectionSlug={nextSectionSlug}
              publishedSlugs={publishedSlugs}
              onSelectTheme={onSelectTheme}
            />
          ) : section.slug === "sobre" ? (
            <AboutDesktop section={section} />
          ) : section.slug === "resultados" ? (
            <ResultsDesktop
              section={section}
              selectedTheme={selectedTheme}
              onSelectTheme={onSelectTheme}
            />
          ) : section.slug === "depoimentos" ? (
            <TestimonialsDesktop section={section} />
          ) : section.slug === "contato" ? (
            <ContactDesktop section={section} />
          ) : (
            <div
              className={
                section.slug === "ferramentas"
                  ? "desktop-editorial tools-editorial"
                  : "desktop-editorial"
              }
            >
              <header className="section-heading">
                <h2>{section.title}</h2>
                {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
                {section.intro && <p className="section-intro">{section.intro}</p>}
              </header>
              <div className="desktop-content">
                <div>
                  {(section.desktopPanelA ?? section.panelA).map((item, i) => (
                    <ItemCard
                      key={`${item.title}-${i}`}
                      item={item}
                      index={i}
                      layout={section.layout}
                    />
                  ))}
                </div>
                <div>
                  {(section.desktopPanelB ?? section.panelB).map((item, i) => (
                    <ItemCard
                      key={`${item.title}-${i}`}
                      item={item}
                      index={i}
                      layout={section.layout}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {isMobile && (
        <div className="mobile-panels">
          {section.slug === "sobre" ? (
            <AboutMobile section={section} />
          ) : section.slug === "resultados" ? (
            <ResultsMobile
              section={section}
              selectedTheme={selectedTheme}
              onSelectTheme={onSelectTheme}
            />
          ) : (
            <>
              <MobilePanel
                section={section}
                panel="a"
                items={section.panelA}
                publishedSlugs={publishedSlugs}
                onSelectTheme={onSelectTheme}
              />
              <MobilePanel
                section={section}
                panel="b"
                items={section.panelB}
                publishedSlugs={publishedSlugs}
                onSelectTheme={onSelectTheme}
              />
            </>
          )}
        </div>
      )}
    </section>
  )
}

export function PublicSite({
  preview = false,
  formationPilot = false,
}: {
  preview?: boolean
  formationPilot?: boolean
}) {
  const { sections, navigation, tokens, source, loading, error } = usePortfolio(
    preview,
    preview && formationPilot,
  )
  const visible = useMemo(
    () => sections.filter((section) => preview || section.visible),
    [sections, preview],
  )
  const [current, setCurrent] = useState("perfil")
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  // Avoid mounting invisible desktop/mobile subtrees and duplicating their
  // DOM, photos, SVGs and galleries on the initial render.
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches)

  // Timing markers only: neither alter the portrait nor gate the first paint.
  useEffect(() => {
    if (loading || error || preview || !visible.length) return
    const portrait = document.querySelector<HTMLImageElement>(
      "#perfil-a .mobile-profile-hero img, #perfil-a .mobile360-photo img, .profile-portrait img",
    )
    if (!portrait) return
    // Preserve the first DOM/image timestamp. The complete CMS graph can
    // update visible sections later and must not overwrite the initial mark.
    if (performance.getEntriesByName("p3:profile-dom-committed").length === 0) {
      performance.mark("p3:profile-dom-committed")
    }
    const loaded = () => {
      if (performance.getEntriesByName("p3:profile-image-loaded").length === 0) {
        performance.mark("p3:profile-image-loaded")
      }
    }
    if (portrait.complete && portrait.naturalWidth > 0) loaded()
    else portrait.addEventListener("load", loaded, { once: true })
    const frame = requestAnimationFrame(() => performance.mark("p3:profile-next-frame"))
    return () => {
      portrait.removeEventListener("load", loaded)
      cancelAnimationFrame(frame)
    }
  }, [loading, error, preview, visible])

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const syncViewport = () => setIsMobile(media.matches)
    media.addEventListener("change", syncViewport)
    return () => media.removeEventListener("change", syncViewport)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const item of entries) {
          if (!item.isIntersecting) {
            item.target
              .querySelectorAll('.reveal[data-motion-once="false"]')
              .forEach((element) => element.classList.remove("is-visible"))
          }
        }
        const entry = entries
          .filter((item) => item.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!entry) return
        const section = (entry.target as HTMLElement).closest(
          "[data-section]",
        ) as HTMLElement | null
        if (section) {
          setCurrent(section.dataset.section ?? "perfil")
          section.classList.add("cms-section-entered")
        }
        entry.target
          .querySelectorAll(".reveal")
          .forEach((element) => element.classList.add("is-visible"))
      },
      { threshold: [0.2, 0.55], rootMargin: "-10% 0px -25%" },
    )
    document
      .querySelectorAll("[data-section], [data-panel]")
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    const restoreHash = () => {
      const slug = decodeURIComponent(location.hash.slice(1)).replace(/-b$/, "")
      if (!slug) return
      const target =
        document.getElementById(location.hash.slice(1)) ?? document.getElementById(slug)
      if (!target) return
      target.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      })
      target.tabIndex = -1
      target.focus({ preventScroll: true })
    }
    addEventListener("popstate", restoreHash)
    addEventListener("hashchange", restoreHash)
    if (!loading) requestAnimationFrame(restoreHash)
    return () => {
      removeEventListener("popstate", restoreHash)
      removeEventListener("hashchange", restoreHash)
    }
  }, [loading, visible])

  const typographyVariables: Record<string, string> = {}
  for (const [key, config] of Object.entries(tokens.editorialStyles ?? {})) {
    if (!/^typography\.[a-z0-9-]+$/.test(key)) continue
    const name = key.slice("typography.".length)
    if (typeof config.desktopPx === "number" && Number.isFinite(config.desktopPx)) {
      typographyVariables["--hero-style-" + name + "-desktop"] = config.desktopPx + "px"
    }
    if (typeof config.mobilePx === "number" && Number.isFinite(config.mobilePx)) {
      typographyVariables["--hero-style-" + name + "-mobile"] = config.mobilePx + "px"
    }
    const font = heroFont(config.fontToken)
    const color = heroColor(config.colorToken)
    if (font) typographyVariables["--hero-style-" + name + "-font"] = font
    if (color) typographyVariables["--hero-style-" + name + "-color"] = color
  }
  const style = {
    ...typographyVariables,
    "--white": tokens.white,
    "--font-serif": '"Georgia", serif',
    "--orange": tokens.orange,
    "--ink": tokens.ink,
    "--paper": tokens.paper,
    "--cream": tokens.cream,
    "--muted": tokens.muted,
    "--orange-dark": tokens.orangeDark,
    "--container": `${tokens.container}px`,
    "--section-space": `${tokens.sectionSpace}px`,
    "--card-radius": `${tokens.cardRadius}px`,
    "--motion-duration": `${tokens.motionDuration}ms`,
    "--font-heading": `"${tokens.headingFont}", "Arial Narrow", sans-serif`,
    "--font-display": `"${tokens.headingFont}", "Arial Narrow", sans-serif`,
    "--font-body": `"${tokens.bodyFont}", system-ui, sans-serif`,
  } as React.CSSProperties

  return (
    <div className="public-site" style={style}>
      <a
        className="skip-link"
        href={`#${visible.some((section) => section.slug === "perfil") ? "perfil" : (visible[0]?.slug ?? "perfil")}`}
      >
        Pular para o conteúdo
      </a>
      {preview && (
        <div className="preview-banner">Pré-visualização protegida · conteúdo em rascunho</div>
      )}
      <Navigation
        sections={visible}
        navigation={navigation}
        current={current}
        brandTitle={sections.find((section) => section.slug === "perfil")?.title}
      />
      {loading && <div className="data-status">Sincronizando conteúdo…</div>}
      {error && (
        <div className="data-error" role="status">
          {error}
        </div>
      )}
      {source === "fallback" && (
        <div className="sr-only" role="status">
          Conteúdo editorial local exibido enquanto a base Supabase aguarda as migrations.
        </div>
      )}
      <main>
        {!loading && !error && visible.length === 0 && (
          <div className="data-status" role="status">
            Nenhuma seção publicada no momento.
          </div>
        )}
        <h1 className="sr-only">
          {sections.find((section) => section.slug === "perfil")?.title || "Tulius Tsangaropulos"}
          {" — Comunicação e Estratégia"}
        </h1>
        {visible.map((section, index) => {
          if (EXPERIENCE_SLUGS.includes(section.slug as (typeof EXPERIENCE_SLUGS)[number])) {
            if (
              visible
                .slice(0, index)
                .some((entry) =>
                  EXPERIENCE_SLUGS.includes(entry.slug as (typeof EXPERIENCE_SLUGS)[number]),
                )
            )
              return null
            return (
              <Suspense key="experience-stack" fallback={null}>
                <ExperienceStack
                  sections={visible.filter((entry) =>
                    EXPERIENCE_SLUGS.includes(entry.slug as (typeof EXPERIENCE_SLUGS)[number]),
                  )}
                  isMobile={isMobile}
                  preview={preview}
                />
              </Suspense>
            )
          }
          return (
            <Section
              key={section.id}
              section={section}
              nextSectionSlug={visible[index + 1]?.slug}
              publishedSlugs={visible
                .filter((entry) => entry.status === "published" && entry.visible)
                .map((entry) => entry.slug)}
              isMobile={isMobile}
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
            />
          )
        })}
      </main>
    </div>
  )
}
