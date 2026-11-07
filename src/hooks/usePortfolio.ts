import { useEffect, useState } from "react"
import type { PostgrestClient } from "@supabase/postgrest-js"
import { defaultTokens } from "../content/defaultTokens"
import { publicReadClient } from "../lib/public-read"
import {
  buildPublicNavigation,
  type PublicNavigationItem,
  type NavigationRow,
} from "../lib/navigation"
import {
  collectionToItems,
  isCollectionSource,
  resolveCollectionBlocks,
  type CollectionSource,
} from "../lib/collections"
import {
  composeSectionPlacements,
  type BlockPlacementRow,
  type ContentBlockRow,
  type SectionPanelRow,
} from "../lib/placements"
import type { DesignTokens, PortfolioSection } from "../types/content"
import { selectSectionExperienceMedia } from "../lib/cms-contract"
import { parseCardRadius } from "../lib/design-tokens"
import type { FormationPilotEducationRow } from "../lib/formation-pilot-preview"

type SectionResult = {
  id: string
  slug: string
  sort_order: number
  title: string
  eyebrow: string | null
  intro: string | null
  theme: PortfolioSection["theme"] | null
  layout_variant: PortfolioSection["layout"] | null
  animation_preset: PortfolioSection["animation"] | null
  status: PortfolioSection["status"]
  is_visible: boolean
  content_blocks?: ContentBlockRow[]
}

type PublishedProfileResult = SectionResult & {
  section_panels: (SectionPanelRow & { block_placements: BlockPlacementRow[] })[]
}

function toSection(
  row: SectionResult,
  panels: SectionPanelRow[],
  placements: BlockPlacementRow[],
  includeDrafts: boolean,
  collectionItems: Map<CollectionSource, import("../types/content").ContentItem[]>,
): PortfolioSection {
  const blocks = resolveCollectionBlocks(row.content_blocks ?? [], collectionItems)
  const composition = composeSectionPlacements(row.id, blocks, panels, placements, includeDrafts)
  return {
    id: row.id,
    slug: row.slug,
    number: row.sort_order,
    title: row.title,
    eyebrow: row.eyebrow ?? undefined,
    intro: row.intro ?? undefined,
    theme: row.theme ?? "paper",
    layout: row.layout_variant ?? "editorial",
    animation: row.animation_preset ?? "fade-up",
    status: row.status,
    visible: row.is_visible,
    panelA: composition.mobileA,
    panelB: composition.mobileB,
    desktopPanelA: composition.desktopA,
    desktopPanelB: composition.desktopB,
    experienceMedia: selectSectionExperienceMedia(row.content_blocks, includeDrafts),
  }
}

export function usePortfolio(includeDrafts = false, formationPilot = false) {
  const [data, setData] = useState<PortfolioSection[]>([])
  const [tokens, setTokens] = useState(defaultTokens)
  const [navigation, setNavigation] = useState<PublicNavigationItem[]>([])
  const [source, setSource] = useState<"supabase" | "fallback">(
    publicReadClient ? "supabase" : "fallback",
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!publicReadClient) {
      // The editorial seed belongs to offline development only. Do not ship
      // its large static content graph in the CMS-backed production entry.
      let cancelledFallback = false
      void import("../content/fallback")
        .then(({ sections }) => {
          if (cancelledFallback) return
          setData(sections)
          setLoading(false)
        })
        .catch(() => {
          if (cancelledFallback) return
          setError("Não foi possível carregar o conteúdo local.")
          setLoading(false)
        })
      return () => {
        cancelledFallback = true
      }
    }
    let cancelled = false
    let seoFirstFrame = 0
    let seoSecondFrame = 0
    setLoading(true)
    // Only the protected preview imports the authenticated Supabase SDK.
    // The public home uses PostgREST with the same anonymous key and RLS.
    void (async () => {
      const supabase = (includeDrafts
        ? (await import("../lib/supabase")).supabase
        : publicReadClient) as unknown as PostgrestClient
      if (cancelled || !supabase) return
      const supabaseClient = supabase
      if (!includeDrafts) performance.mark("p3:portfolio-fetch-start")
      // SEO metadata is not required to compose the first fold. Request it in
      // parallel but do not make the initial visible content wait for those calls.
      const pageRequest = supabase
        .from("pages")
        .select("seo_title,seo_description")
        .eq("slug", "home")
        .eq("status", "published")
        .maybeSingle()
      const settingsRequest = supabase
        .from("site_settings")
        .select("site_title,description,seo_json,locale")
        .eq("status", "published")
        .limit(1)
        .maybeSingle()
      // The current published portfolio binds only its testimonials collection.
      // Start that independent request alongside the section graph, rather than
      // imposing another network round trip before the first fold can render.
      const testimonialsQuery = supabase.from("testimonials").select("*").order("sort_order")
      let query = supabase
        .from("sections")
        .select(
          "id,slug,sort_order,title,eyebrow,intro,theme,layout_variant,animation_preset,status,is_visible,content_blocks(id,section_id,sort_order,mobile_panel,status,content_json)",
        )
        .order("sort_order")
      if (!includeDrafts) query = query.eq("status", "published").eq("is_visible", true)

      // Load the published first fold from live PostgREST before fetching the
      // other sections. Foreign-key embeds retain the current RLS and CMS.
      // Preview continues to use the complete authenticated data graph.
      const profileReady = includeDrafts
        ? Promise.resolve()
        : Promise.resolve(
            (
              window as Window & {
                __p3ProfileBootstrap?: Promise<{ data: unknown; error: unknown }>
              }
            ).__p3ProfileBootstrap ??
              supabase
                .from("sections")
                .select(
                  "id,slug,sort_order,title,eyebrow,intro,theme,layout_variant,animation_preset,status,is_visible,content_blocks(id,section_id,sort_order,mobile_panel,status,content_json),section_panels(id,section_id,panel_key,block_placements(block_id,panel_id,sort_order,layout_variant,is_visible,style_config,motion_config))",
                )
                .eq("slug", "perfil")
                .eq("status", "published")
                .eq("is_visible", true)
                .maybeSingle(),
          )
            .then(async ({ data, error: profileError }) => {
              if (cancelled || profileError || !data) return
              const profileRow = data as unknown as PublishedProfileResult
              const activeSources = new Set<CollectionSource>()
              for (const block of profileRow.content_blocks ?? []) {
                if (isCollectionSource(block.content_json?.source_collection)) {
                  activeSources.add(block.content_json.source_collection)
                }
              }
              // Future collection bindings must also resolve from published
              // CMS records; never render invented or emptied first-fold cards.
              const collectionItems = new Map<
                CollectionSource,
                import("../types/content").ContentItem[]
              >()
              if (activeSources.size) {
                const entries = await Promise.all(
                  Array.from(activeSources).map(async (collection) => {
                    const result = await supabaseClient
                      .from(collection)
                      .select("*")
                      .eq("status", "published")
                      .order("sort_order")
                    if (result.error) throw result.error
                    return [
                      collection,
                      collectionToItems(collection, result.data ?? [], false),
                    ] as const
                  }),
                )
                if (cancelled) return
                for (const [collection, items] of entries) collectionItems.set(collection, items)
              }
              const panels = profileRow.section_panels ?? []
              const placements = panels.flatMap((panel) => panel.block_placements ?? [])
              const profile = toSection(profileRow, panels, placements, false, collectionItems)
              // Empty/unpublished panels do not qualify as a first-fold success.
              // The full graph remains the authoritative failure/recovery path.
              if (!profile.panelA.length || !profile.desktopPanelA?.length || cancelled) return
              performance.mark("p3:profile-cms-ready")
              setData([profile])
              setLoading(false)
            })
            .catch(() => {
              // On any fast-path failure, the complete CMS read still runs.
            })

      // Noncritical testimonials and the section graph start after the real
      // Profile read, without waiting for unrelated data before first paint.
      const testimonialsRequest = profileReady.then(() =>
        Promise.resolve(
          includeDrafts
            ? testimonialsQuery.neq("status", "archived")
            : testimonialsQuery.eq("status", "published"),
        ),
      )
      const primaryContent = profileReady
        .then(() =>
          Promise.all([
            query,
            supabase.from("section_panels").select("id,section_id,panel_key"),
            supabase
              .from("block_placements")
              .select(
                "block_id,panel_id,sort_order,layout_variant,is_visible,style_config,motion_config",
              ),
            supabase
              .from("design_tokens")
              .select("token_key,token_value")
              .eq("status", "published"),
            supabase
              .from("navigation_items")
              .select("label,target_slug,group_name,sort_order,is_visible,status")
              .eq("status", "published")
              .eq("is_visible", true)
              .order("sort_order"),
          ]),
        )
        .then(
          async ([
            sectionsResult,
            panelsResult,
            placementsResult,
            tokenResult,
            navigationResult,
          ]) => {
            if (cancelled) return
            if (!includeDrafts) performance.mark("p3:portfolio-primary-ready")
            const contentError =
              sectionsResult.error ?? panelsResult.error ?? placementsResult.error
            if (contentError) {
              // Fail closed: never substitute stale fallback content when
              // an explicitly configured publication database is unavailable.
              // Preserve any live first-fold content already painted. Never
              // replace configured Supabase content with the local fallback.
              setSource("supabase")
              setError("Não foi possível carregar o conteúdo do site. Tente novamente.")
            } else {
              const sectionRows = sectionsResult.data as SectionResult[]
              const activeSources = new Set<CollectionSource>()
              for (const section of sectionRows) {
                for (const block of section.content_blocks ?? []) {
                  if (isCollectionSource(block.content_json?.source_collection)) {
                    activeSources.add(block.content_json.source_collection)
                  }
                }
              }
              // Fetch only explicitly bound collections; existing manual blocks
              // require no extra queries and retain their exact visual content.
              const collectionItems = new Map<
                CollectionSource,
                import("../types/content").ContentItem[]
              >()
              let collectionReadFailed = false
              if (activeSources.size) {
                const results = await Promise.all(
                  Array.from(activeSources).map(async (source) => {
                    try {
                      const response =
                        source === "testimonials"
                          ? await testimonialsRequest
                          : includeDrafts
                            ? await supabaseClient
                                .from(source)
                                .select("*")
                                .order("sort_order")
                                .neq("status", "archived")
                            : await supabaseClient
                                .from(source)
                                .select("*")
                                .order("sort_order")
                                .eq("status", "published")
                      if (response.error) {
                        collectionReadFailed = true
                        return null
                      }
                      return [
                        source,
                        collectionToItems(source, response.data ?? [], includeDrafts),
                      ] as const
                    } catch {
                      collectionReadFailed = true
                      return null
                    }
                  }),
                )
                if (cancelled) return
                for (const entry of results) {
                  if (entry) collectionItems.set(entry[0], entry[1])
                }
              }
              const mappedSections = sectionRows.map((section) =>
                toSection(
                  section,
                  (panelsResult.data ?? []) as SectionPanelRow[],
                  (placementsResult.data ?? []) as BlockPlacementRow[],
                  includeDrafts,
                  collectionItems,
                ),
              )
              let previewError = false
              let preparedSections = mappedSections
              if (includeDrafts && formationPilot) {
                try {
                  const {
                    buildApprovedFormationAPreview,
                    FORMATION_A_BLOCK_ID,
                    overlayApprovedFormationA,
                  } = await import("../lib/formation-pilot-preview")
                  if (cancelled) return
                  const formRow = sectionRows.find((section) => section.slug === "formacao")
                  const formBlock = formRow?.content_blocks?.find(
                    (block) => block.id === FORMATION_A_BLOCK_ID,
                  )
                  if (!formBlock) throw new Error("Bloco Formação/A ausente")
                  const result = await supabaseClient
                    .from("education")
                    .select("id,course,degree_type,institution,sort_order,status")
                    .eq("status", "published")
                    .order("sort_order")
                  if (result.error) throw result.error
                  if (cancelled) return
                  const proposal = buildApprovedFormationAPreview(
                    formBlock,
                    (result.data ?? []) as FormationPilotEducationRow[],
                  )
                  preparedSections = mappedSections.map((section) =>
                    section.slug === "formacao"
                      ? overlayApprovedFormationA(section, proposal.items)
                      : section,
                  )
                } catch {
                  // Fail closed: the CMS still shows original saved content.
                  previewError = true
                }
              }
              const navRecords = (navigationResult.data ?? []) as NavigationRow[]
              const linked = buildPublicNavigation(mappedSections, navRecords)
              setNavigation(
                navigationResult.error
                  ? mappedSections
                      .filter((section) => section.status === "published" && section.visible)
                      .map((section) => ({
                        slug: section.slug,
                        label: section.title,
                        group: "Principal",
                        number: section.number,
                      }))
                  : linked,
              )
              setData(
                preparedSections.map((section) => ({
                  ...section,
                  navLabel:
                    navRecords.find(
                      (record) =>
                        record.target_slug === section.slug &&
                        record.is_visible &&
                        record.status === "published",
                    )?.label ?? section.title,
                })),
              )
              setSource("supabase")
              setError(
                previewError
                  ? "Prévia experimental de Formação/A bloqueada: confira os dados aprovados. Nenhum conteúdo foi alterado."
                  : collectionReadFailed
                    ? "Parte do acervo não pôde ser atualizada. Exibindo conteúdo editorial salvo."
                    : null,
              )
            }
            if (!tokenResult.error && tokenResult.data?.length) {
              const next = { ...defaultTokens }
              tokenResult.data.forEach((t) => {
                const key = t.token_key.replace("color.", "")
                if (
                  ["orange", "ink", "paper", "cream", "muted", "orangeDark", "white"].includes(key)
                )
                  Object.assign(next, { [key]: t.token_value })
                if (t.token_key === "font.heading")
                  next.headingFont = t.token_value === "Inter" ? "Inter" : "Big Shoulders Display"
                if (t.token_key === "font.body")
                  next.bodyFont =
                    t.token_value === "Big Shoulders Display" ? "Big Shoulders Display" : "Inter"
                if (t.token_key === "layout.container")
                  next.container = Math.min(1920, Math.max(960, Number(t.token_value) || 1680))
                if (t.token_key === "space.section")
                  next.sectionSpace = Math.min(120, Math.max(32, Number(t.token_value) || 64))
                if (t.token_key === "radius.card") next.cardRadius = parseCardRadius(t.token_value)
                if (t.token_key === "motion.duration")
                  next.motionDuration = Math.min(1200, Math.max(0, Number(t.token_value) || 520))
              })
              setTokens(next)
            }
            if (!includeDrafts) performance.mark("p3:portfolio-compose-finished")
            setLoading(false)
          },
        )
        .catch(() => {
          if (cancelled) return
          // A failed collection query must not erase a profile already shown.
          setSource("supabase")
          setError("Não foi possível carregar o conteúdo do site. Tente novamente.")
          setLoading(false)
        })
      // Public SEO is already represented in the build HTML. Wait for the
      // first-fold state to be committed and a frame opportunity before issuing
      // two optional REST requests; the protected preview remains immediate.
      // A frame opportunity is not proof that the LCP paint has completed.
      const updateSeo = () => {
        if (cancelled) return
        if (!includeDrafts) performance.mark("p3:seo-fetch-start")
        void Promise.all([pageRequest, settingsRequest])
          .then(([pageResult, settingsResult]) => {
            if (cancelled) return
            const title = pageResult.data?.seo_title ?? settingsResult.data?.site_title
            const description = pageResult.data?.seo_description ?? settingsResult.data?.description
            if (title) {
              document.title = title
              setMeta("og:title", title, "property")
            }
            if (description) {
              setMeta("description", description)
              setMeta("og:description", description, "property")
              setMeta("twitter:description", description)
            }
            const seo = settingsResult.data?.seo_json as
              | {
                  ogImage?: string
                  canonical?: string
                  robots?: string
                }
              | undefined
            if (seo?.ogImage?.startsWith("https://")) {
              setMeta("og:image", seo.ogImage, "property")
              setMeta("twitter:image", seo.ogImage)
              setMeta("twitter:card", "summary_large_image")
            }
            if (/^(index|noindex),(follow|nofollow)$/.test(seo?.robots ?? ""))
              setMeta("robots", seo!.robots!)
            if (settingsResult.data?.locale?.match(/^[a-z]{2}-[A-Z]{2}$/))
              setMeta("og:locale", settingsResult.data.locale.replace("-", "_"), "property")
            setCanonical(
              seo?.canonical?.startsWith("https://") ? seo.canonical : "https://tulius.work/",
            )
          })
          .catch(() => {
            // The pre-rendered HTML already contains safe canonical/SEO defaults.
            // Optional metadata failure must never block the public content.
          })
      }
      if (includeDrafts) {
        updateSeo()
      } else {
        void primaryContent.then(() => {
          if (cancelled) return
          seoFirstFrame = requestAnimationFrame(() => {
            seoSecondFrame = requestAnimationFrame(updateSeo)
          })
        })
      }
    })().catch(() => {
      if (cancelled) return
      // Retain any published first-fold content on a partial network failure.
      setSource("supabase")
      setError("Não foi possível carregar o conteúdo do site. Tente novamente.")
      setLoading(false)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(seoFirstFrame)
      cancelAnimationFrame(seoSecondFrame)
    }
  }, [includeDrafts, formationPilot])

  return { sections: data, navigation, tokens, source, loading, error }
}

function setMeta(name: string, content: string, attribute = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.content = content
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement("link")
    element.rel = "canonical"
    document.head.appendChild(element)
  }
  element.href = href
}
