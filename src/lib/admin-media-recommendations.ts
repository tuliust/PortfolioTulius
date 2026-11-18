/**
 * Editorial upload guidance. These are recommended preparation dimensions,
 * never validation constraints or instructions to replace existing assets.
 */
export type AdminMediaRecommendation = {
  recommendedSize: string
  guidance: string
  ratio: string
}

const SQUARE_THUMBNAIL: AdminMediaRecommendation = {
  recommendedSize: "600 × 600 px (desktop e mobile)",
  guidance: "Miniatura editorial quadrada 1:1, preferencialmente WebP ou PNG.",
  ratio: "1 / 1",
}

export function getItemMediaRecommendation(
  sectionSlug: string | undefined,
  panel: "a" | "b",
  index: number,
  aboutImageTarget: "mobile" | "desktop",
): AdminMediaRecommendation {
  if (panel !== "a" || index !== 0) return SQUARE_THUMBNAIL

  switch (sectionSlug) {
    case "perfil":
      return {
        recommendedSize: "1200 × 1600 px (desktop); 900 × 1200 px (variante mobile otimizada)",
        guidance: "Retrato vertical 3:4; o enquadramento editorial aprovado é preservado.",
        ratio: "3 / 4",
      }
    case "sobre":
      return aboutImageTarget === "desktop"
        ? {
            recommendedSize: "1200 × 1600 px (desktop)",
            guidance: "Retrato vertical 3:4; prefira PNG ou WebP com transparência.",
            ratio: "3 / 4",
          }
        : {
            recommendedSize: "900 × 1200 px (mobile)",
            guidance: "Retrato vertical 3:4; prefira PNG ou WebP com transparência.",
            ratio: "3 / 4",
          }
    case "contato":
      return {
        recommendedSize: "1200 × 1600 px (mesmo arquivo no desktop e mobile)",
        guidance: "Retrato vertical 3:4 com transparência em PNG ou WebP; preserve a silhueta.",
        ratio: "3 / 4",
      }
    default:
      return SQUARE_THUMBNAIL
  }
}
