# PortfolioTulius — Continuidade: Formação e experiências sobrepostas

**Data:** 26/10/2026. **Site:** https://tulius.work/. **Repositório:** https://github.com/tuliustsangaropulos/PortfolioTulius (`main`).

## 1. Pedido original

- Formação: fundo cinza-escuro da identidade (`#171617`) e fontes brancas/laranja.
- Seis experiências (**Invest RS**, **Prefeitura de São Paulo**, **Vale**, **TV Globo/SporTV**, **Grupo InPress** e **CDI Comunicação**) com fundo branco e rolagem vertical **sobreposta**, em vez de painéis aparecendo um abaixo do outro. A próxima seção deve subir e cobrir a anterior.
- Barra superior com marca pequena e título de cada empresa, acessível e fixa durante a navegação pelo grupo.
- Logotipo pequeno acima do título no painel de cada empresa.
- Galeria de fotografias no lado direito, cada imagem associada a projeto/tema da seção, em formato de slides.
- Edição desses ativos pelo painel admin, preservando todo o conteúdo original.

## 2. Implementação

### Formação

O campo `sections.theme` de `formacao` foi alterado de `paper` para `ink`, sem modificar itens de graduação, pós-graduação, MBA, inglês ou espanhol. O CSS usa `#formacao` para forçar texto de apoio claro, títulos brancos e acentos laranja.

### Seis empresas

`sections.theme` foi definido como `paper` para todos os seis slugs. `PublicSite` agrupa as seis experiências consecutivas em `ExperienceStack` (`src/components/public/ExperienceStack.tsx`). Cada painel usa `position:sticky; top:0`, camadas progressivamente mais altas e fundo branco, proporcionando o efeito de sobreposição ao descer pela página. Uma barra `experience-index` sticky abaixo do header global mostra título e marca de cada empresa, links por âncora e destaque da empresa ativa.

Desktop: cabeçalho da empresa com área de marca, título e descrição à esquerda; conteúdos A/B existentes no meio com rolagem controlada; galeria à direita com foto, nome, legenda, contador, setas Anterior/Próximo e pontos indicadores. Mobile: barra horizontal rolável, textos e galeria em dois painéis, mantendo a experiência acessível.

### Estrutura do CMS

Sem nova tabela/migration. Em cada bloco publicado **A** das seis experiências, `content_json.experienceMedia` contém:

```json
{
  "logo": "/media/logo-aprovado.svg",
  "logoAlt": "Logotipo da empresa",
  "slides": [
    {
      "title": "Tema ou projeto",
      "image": "/media/fotografia-aprovada.jpg",
      "alt": "Descrição da imagem",
      "caption": "Legenda opcional"
    }
  ]
}
```

**Atenção:** o exemplo acima mostra o *formato*, não dados efetivamente preenchidos. Na gravação inicial, apenas `slides[].title` foi incluído. As propriedades de logo e imagem ainda aguardam arquivos aprovados. O primeiro bloco A publicado fornece essa configuração a ambos os layouts; os itens originais A/B foram preservados.

Admin: `/admin` → **Blocos e painéis** → **empresa** → **Painel A**, seção **Identidade da empresa e galeria de projetos**. Há campos para logo/alt, inclusão/edição/remoção/reordenação de slides, URL da foto/alt/legenda. A gravação usa a RPC existente `save_content_block_atomic`. URLs devem ser `https://` ou `/media/arquivo`, com texto alternativo obrigatório para toda imagem informativa.

## 3. Slides editoriais preparados

Três títulos de projetos por empresa, sem fotografia inserida:

| Empresa | Slide 1 | Slide 2 | Slide 3 |
|---|---|---|---|
| Invest RS | Guia de Boas-Vindas | Organização de eventos | Plataforma de eventos e relacionamento |
| Prefeitura de São Paulo | Planejamento de comunicação | Conteúdo institucional e executivo | Plataforma SUBPI |
| Vale | Projetos digitais de ponta a ponta | Comunicação executiva e reputação | Mídia paga e inteligência de dados |
| TV Globo/SporTV | Produção de ponta a ponta | Jornalista em Pequim | Reportagens e entradas ao vivo |
| Grupo InPress | Assessoria de imprensa | Relações públicas | Campanhas integradas |
| CDI Comunicação | Planejamento estratégico | Comunicação institucional | Gestão de stakeholders |

**Ausência de arquivos:** buscas no repositório `public/media`, `media_assets` e Supabase Storage não localizaram logotipos ou fotografias de projetos autorizadas. Para não criar falsa documentação profissional, a interface exibe um espaço reservado de mídia pendente e monograma tipográfico que não se apresenta como marca oficial. Requisito de **fotos reais e logos reais** permanece pendente até envio/aprovação.

## 4. Dados e arquivos afetados

Supabase: projeto `zfnrhzplwpjpdljraypt`; uma transação SQL verificou estado anterior, atualizou `sections.theme` dos sete slugs e acrescentou `experienceMedia` nos blocos A publicados das seis empresas. Não houve alteração de schema, Auth, RLS, Storage, regras de deployment ou dados das demais seções.

Código:
- `src/types/content.ts`, `src/lib/placements.ts`, `src/hooks/usePortfolio.ts`: tipos e carregamento de metadados.
- `src/components/public/ExperienceStack.tsx`, `src/components/public/PublicSite.tsx`, `src/index.css`: layout, navegação, pilha de seções e galeria.
- `src/components/admin/AdminModules.tsx`: CRUD da mídia e validação de URLs/alt.
- `src/content/fallback.ts`, `src/content/fallback.test.ts`: conteúdo local alinhado às mudanças.
- `scripts/p3-browser-smoke.mjs`: teste de navegação da pilha sticky e dos controles de slides.

Documentação: `README.md`, `docs/ADMIN_CMS.md`, `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/OPEN_ISSUES.md`, `docs/ESTADO_ATUAL_AUDITORIA_2026-10-25.md`, este relatório.

## 5. Situação de CI, Vercel e homologação

Os jobs `Validate PortfolioTulius` passaram após formatação, TypeScript, testes, build e smoke. A auditoria automatizada da sobreposição e galeria foi refinada, pois o primeiro teste selecionava o `span` da seta esquerda em vez do `span` do contador; a nova verificação usa o filho direto `.experience-gallery-controls > span`. Conferir o resultado no SHA final.

**Deploy Vercel:** tentativa de publicação manual recebeu `402 payment_required` (`api-deployments-free-per-day`, limite superior a 100 deployments/24 h). Uma publicação automática anterior ficou `READY` no commit `f8bc345c`, que já inclui os componentes e estilos principais; alterações de documentação e do teste ocorreram posteriormente. O SHA em produção **não equivale necessariamente ao HEAD do GitHub**. Não alterar billing sem autorização; verificar status do domínio e aguardar liberação da quota ou agir no painel Vercel por conta própria.

**Pendências:** fotografias/logotipos finais (com fonte/direitos), homologação admin JWT real (incluir/alterar/excluir, salvar, rollback), navegação/tabs/slides em browsers mobile e telas baixas, refinamento visual e implantação do último commit se necessário. Os dados e o código estão implementados, mas a etapa de mídia real não pode ser declarada concluída.

## 6. Fontes do projeto ChatGPT

Adicionar este arquivo como fonte de continuidade e atualizar a cópia anexada de `ESTADO_ATUAL_AUDITORIA_2026-10-25.md` se estiver desatualizada. Preservar os arquivos históricos de contexto, ambiente, seção 01, seção 02 e seção 03.

### Correção após auditoria de capturas

A auditoria automatizada no ambiente publicado confirmou a pilha fixa e a navegação dos slides em desktop, mas a captura `p4-mobile-05-invest-rs-b.png` mostrou texto da Prefeitura de São Paulo cobrindo a galeria Invest RS no mobile. O componente foi corrigido por CSS no commit `6cfe4d04`: **desktop/tablet permanece sticky e sobreposto**; **mobile até 767px utiliza cards relativos, sem sobreposição**, mantendo o seletor fixo para evitar perda de conteúdo. O deployment de produção ainda está limitado pela quota da Vercel; esta correção não deve ser descrita como publicada sem novo deploy e inspeção. A galeria mantém os 18 espaços editoriais sem fotos reais aprovadas.
