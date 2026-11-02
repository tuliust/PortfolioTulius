import { randomUUID } from "node:crypto"

// Synthetic payloads for a future *isolated* staging installation only.
// Do not import supabase/seed.sql: it contains real editorial material.
export function createSyntheticStagingFixtures() {
  const nonce = randomUUID()
  const key = nonce.slice(0, 8)
  return {
    nonce,
    page: { slug: "p2-synthetic-" + nonce, title: "Página fictícia " + key, status: "draft" },
    section: { slug: "secao-ficticia-" + key, title: "Seção fictícia " + key, status: "draft", is_visible: false },
    block: {
      block_type: "cards",
      mobile_panel: "a",
      sort_order: 1,
      status: "draft",
      content_json: { items: [{ title: "Cartão fictício " + key, text: "Conteúdo apenas para homologação isolada" }] },
    },
    career: {
      company: "Empresa Fictícia " + key, role: "Cargo de teste", location: "Localidade fictícia",
      start_date: "jan/2025", end_date: "dez/2025",
      description: "Trajetória criada exclusivamente para teste", sort_order: 1, status: "draft",
    },
    project: {
      title: "Projeto sintético " + key,
      summary: "Proposta de demonstração, sem relação com experiências reais",
      project_status: "fictício", status: "draft", sort_order: 1,
    },
    education: {
      institution: "Instituição Fictícia " + key, course: "Curso fictício",
      degree_type: "Teste", start_date: "2025", end_date: "2025",
      sort_order: 1, status: "draft",
    },
    testimonial: {
      author_name: "Pessoa Fictícia " + key, author_role: "Exemplo não real",
      quote_text: "Depoimento sintético para testar o CMS, sem recomendação pessoal verdadeira",
      status: "draft", sort_order: 1,
    },
    media: {
      storage_bucket: "portfolio-private",
      storage_path: "p2-fixture/" + nonce + "/pixel.png",
      mime_type: "image/png",
      alt_text: "Pixel artificial usado em testes", status: "draft",
    },
  }
}
