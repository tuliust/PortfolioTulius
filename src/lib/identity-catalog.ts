/** CMS Identity catalog. All new typography entries are metadata only until Stage 3. */
export type IdentityTokenRow = {
  token_key: string
  token_value: string
  value_type: "color" | "font" | "size" | "space" | "radius" | "motion"
  scope: string
  status: "published" | "draft"
  display_name: string
  style_config: Record<string, unknown>
}

export const IDENTITY_CATALOG_DEFAULTS: readonly IdentityTokenRow[] = [
  {
    "token_key": "color.orange",
    "display_name": "Laranja principal",
    "token_value": "#FF5414",
    "value_type": "color",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "color.ink",
    "display_name": "Grafite",
    "token_value": "#171617",
    "value_type": "color",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "color.paper",
    "display_name": "Papel",
    "token_value": "#FAFAFA",
    "value_type": "color",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "color.cream",
    "display_name": "Creme",
    "token_value": "#F8F4F1",
    "value_type": "color",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "color.muted",
    "display_name": "Texto secundário",
    "token_value": "#514742",
    "value_type": "color",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "color.orangeDark",
    "display_name": "Laranja escuro",
    "token_value": "#BC390C",
    "value_type": "color",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "color.white",
    "display_name": "Branco",
    "token_value": "#FFFFFF",
    "value_type": "color",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "font.heading",
    "display_name": "Títulos e destaques",
    "token_value": "Big Shoulders Display",
    "value_type": "font",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "font.body",
    "display_name": "Textos e descrições",
    "token_value": "Inter",
    "value_type": "font",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "font.serif",
    "display_name": "Texto serifado",
    "token_value": "Georgia",
    "value_type": "font",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "typography.profile-main",
    "display_name": "Nome principal",
    "token_value": "112",
    "value_type": "size",
    "scope": "typography",
    "status": "published",
    "style_config": {
      "fontToken": "font.heading",
      "colorToken": "color.ink",
      "desktopPx": 112,
      "mobilePx": 48,
      "desktopCss": "clamp(3.4rem, 5.6vw, 7rem)",
      "mobileCss": "clamp(1.35rem, 5.9vw, 48px)",
      "sourceDesktop": ".name-lockup",
      "sourceMobile": ".mobile360-person-name",
      "note": "Limite máximo da escala responsiva",
      "appliedToPublic": false
    }
  },
  {
    "token_key": "typography.editorial-title",
    "display_name": "Título editorial",
    "token_value": "82",
    "value_type": "size",
    "scope": "typography",
    "status": "published",
    "style_config": {
      "fontToken": "font.heading",
      "colorToken": "color.white",
      "desktopPx": 82,
      "mobilePx": 82,
      "desktopCss": "—",
      "mobileCss": "clamp(2.35rem, 13.8vw, 82px)",
      "sourceDesktop": "—",
      "sourceMobile": ".mobile360-headline",
      "note": "Limite máximo; a última linha mobile possui cor de destaque própria",
      "appliedToPublic": false
    }
  },
  {
    "token_key": "typography.section-title",
    "display_name": "Título de seção",
    "token_value": "124.8",
    "value_type": "size",
    "scope": "typography",
    "status": "published",
    "style_config": {
      "fontToken": "font.heading",
      "colorToken": "color.ink",
      "desktopPx": 124.8,
      "mobilePx": 60.8,
      "desktopCss": "clamp(3.2rem, 6vw, 7.8rem)",
      "mobileCss": "clamp(2.9rem, 12vw, 3.8rem)",
      "sourceDesktop": ".section-heading h2, .panel-heading h2",
      "sourceMobile": "--mobile-heading-size",
      "note": "Limite máximo; varia por seção",
      "appliedToPublic": false
    }
  },
  {
    "token_key": "typography.card-title",
    "display_name": "Título de card",
    "token_value": "28",
    "value_type": "size",
    "scope": "typography",
    "status": "published",
    "style_config": {
      "fontToken": "font.heading",
      "colorToken": "color.ink",
      "desktopPx": 28,
      "mobilePx": 26.4,
      "desktopCss": "clamp(1.25rem, 1.6vw, 1.75rem)",
      "mobileCss": "clamp(1.2rem, 5.2vw, 1.65rem)",
      "sourceDesktop": ".content-item h3",
      "sourceMobile": ".public-site .mobile-items .content-item h3",
      "note": "Limite máximo; alguns cards têm estilos específicos",
      "appliedToPublic": false
    }
  },
  {
    "token_key": "typography.subtitle",
    "display_name": "Subtítulo",
    "token_value": "32",
    "value_type": "size",
    "scope": "typography",
    "status": "published",
    "style_config": {
      "fontToken": "font.heading",
      "colorToken": "color.ink",
      "desktopPx": 32,
      "mobilePx": 30.4,
      "desktopCss": "clamp(1.3rem, 2vw, 2rem)",
      "mobileCss": "clamp(1.35rem, 6vw, 1.9rem)",
      "sourceDesktop": ".profile-main > h2",
      "sourceMobile": ".public-site .mobile-panel-subheading",
      "note": "Limite máximo; exemplos representativos",
      "appliedToPublic": false
    }
  },
  {
    "token_key": "typography.support-text",
    "display_name": "Texto de apoio",
    "token_value": "18.4",
    "value_type": "size",
    "scope": "typography",
    "status": "published",
    "style_config": {
      "fontToken": "font.body",
      "colorToken": "color.ink",
      "desktopPx": 18.4,
      "mobilePx": 18.88,
      "desktopCss": "clamp(1rem, 1.2vw, 1.15rem)",
      "mobileCss": "clamp(.95rem, 3.5vw, 1.18rem)",
      "sourceDesktop": ".section-intro",
      "sourceMobile": ".mobile360-support",
      "note": "Limite máximo; cores e valores variam por contexto",
      "appliedToPublic": false
    }
  },
  {
    "token_key": "typography.caption",
    "display_name": "Legenda",
    "token_value": "12",
    "value_type": "size",
    "scope": "typography",
    "status": "published",
    "style_config": {
      "fontToken": "font.body",
      "colorToken": "color.orangeDark",
      "desktopPx": 12,
      "mobilePx": 12,
      "desktopCss": ".75rem",
      "mobileCss": ".75rem",
      "sourceDesktop": ".section-heading > span",
      "sourceMobile": ".section-heading > span",
      "note": "Referência de 16 px/rem; variantes específicas preservadas",
      "appliedToPublic": false
    }
  },
  {
    "token_key": "layout.container",
    "display_name": "Largura máxima do conteúdo",
    "token_value": "1680",
    "value_type": "size",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "space.section",
    "display_name": "Espaçamento de seção",
    "token_value": "64",
    "value_type": "space",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "radius.card",
    "display_name": "Raio de cartão",
    "token_value": "4",
    "value_type": "radius",
    "scope": "global",
    "status": "published",
    "style_config": {}
  },
  {
    "token_key": "motion.duration",
    "display_name": "Duração de transição",
    "token_value": "520",
    "value_type": "motion",
    "scope": "global",
    "status": "published",
    "style_config": {}
  }
] as const

export const IDENTITY_COLOR_KEYS = ["color.orange","color.ink","color.paper","color.cream","color.muted","color.orangeDark","color.white"] as const
export const IDENTITY_FONT_KEYS = ["font.heading","font.body","font.serif"] as const
export const IDENTITY_TYPOGRAPHY_KEYS = ["typography.profile-main","typography.editorial-title","typography.section-title","typography.card-title","typography.subtitle","typography.support-text","typography.caption"] as const
export const IDENTITY_LAYOUT_KEYS = ["layout.container","space.section","radius.card","motion.duration"] as const
export const IDENTITY_ALLOWED_FONTS = ["Big Shoulders Display", "Inter", "Georgia"] as const

/** Numeric selections include existing non-integer responsive maxima. */
export const IDENTITY_NUMERIC_SIZES = [
  10, 11, 12, 13, 14, 15, 16, 18, 18.4, 18.88, 20, 22, 24, 26, 26.4, 28, 30,
  30.4, 32, 36, 38, 40, 42, 44, 48, 52, 54, 56, 60, 60.8, 64, 68,
  72, 76, 80, 82, 88, 96, 104, 112, 120, 124.8, 128, 140,
] as const

export function identityCatalogFromRows(
  persisted: ReadonlyArray<Partial<IdentityTokenRow> & { token_key: string }>,
): Record<string, IdentityTokenRow> {
  const byKey = new Map(persisted.map((row) => [row.token_key, row]))
  return Object.fromEntries(
    IDENTITY_CATALOG_DEFAULTS.map((fallback) => {
      const row = byKey.get(fallback.token_key)
      return [
        fallback.token_key,
        {
          ...fallback,
          ...row,
          display_name: row?.display_name?.trim() || fallback.display_name,
          style_config: { ...fallback.style_config, ...(row?.style_config ?? {}) },
        },
      ]
    }),
  )
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, canonical(item)]),
    )
  }
  return value
}

export function serializeIdentityCatalog(rows: Record<string, IdentityTokenRow>) {
  return JSON.stringify(canonical(rows))
}

export function identityChangedRows(
  current: Record<string, IdentityTokenRow>,
  previous: Record<string, IdentityTokenRow>,
): IdentityTokenRow[] {
  return IDENTITY_CATALOG_DEFAULTS.map((definition) => current[definition.token_key]).filter(
    (row) =>
      row &&
      serializeIdentityCatalog({ current: row }) !==
        serializeIdentityCatalog({ current: previous[row.token_key] }),
  )
}

export function identityTokenError(
  row: IdentityTokenRow,
  catalog: Record<string, IdentityTokenRow>,
): string | null {
  if (!row.display_name.trim() || row.display_name.trim().length > 90)
    return "O nome deve ter de 1 a 90 caracteres."
  if (row.value_type === "color" && !/^#[0-9A-Fa-f]{6}$/.test(row.token_value))
    return "A cor precisa ter seis dígitos HEX."
  if (row.value_type === "font" && !IDENTITY_ALLOWED_FONTS.includes(row.token_value as (typeof IDENTITY_ALLOWED_FONTS)[number]))
    return "Selecione uma fonte autorizada."
  if (row.token_key.startsWith("typography.")) {
    const config = row.style_config
    const desktopPx = Number(config.desktopPx)
    const mobilePx = Number(config.mobilePx)
    if (
      !Number.isFinite(desktopPx) ||
      !Number.isFinite(mobilePx) ||
      desktopPx < 8 ||
      mobilePx < 8 ||
      desktopPx > 200 ||
      mobilePx > 200 ||
      Number(row.token_value) !== desktopPx
    )
      return "Escolha tamanhos numéricos válidos para desktop e mobile."
    if (!catalog[String(config.fontToken)] || !catalog[String(config.colorToken)])
      return "Selecione uma fonte e uma cor cadastradas."
  }
  return null
}
