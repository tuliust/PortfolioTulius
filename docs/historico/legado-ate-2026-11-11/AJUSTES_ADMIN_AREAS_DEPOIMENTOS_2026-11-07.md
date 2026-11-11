# Ajuste de navegação do CMS — áreas visuais, rótulos e Depoimentos

**Data:** 07/11/2026. **Escopo:** somente React/CSS administrativo, testes e documentação. **Sem migração, UPDATE, DELETE ou criação de tabelas na produção Supabase; sem mudança no CSS ou na composição do site público.** Substitui a navegação independente de Acervo descrita na Etapa 4 histórica.

## Alterações

### 1. Rótulos de Identidade

O problema reproduzido nos anexos era a diferença entre os `label` de `IdentityCatalogEditor` e os rótulos já padronizados de `SectionsEditor`, que usa `.field-grid label`. Foram aplicados ao escopo `.identity-catalog label` a mesma cor, peso 600 e tamanho 0,8 rem; inputs e selects recebem borda, preenchimento e família coerentes com o formulário. **Somente a interface administrativa foi alterada.** O domínio público mantém seus tokens e fontes originais.

### 2. Correspondência com áreas visuais do desktop

A função pura `adminVisualAreas`, em `src/lib/admin-visual-areas.ts`, declara os vínculos sem tocar no banco. Ela não inventa um terceiro `content_blocks`.

| Seção | Esquerda | Centro | Direita |
|---|---|---|---|
| **Olá!** (`sobre`) | Título e introdução em `sections` | Foto original de `content_blocks` **A**, item 01, campo `aboutDesktopImage`; existe seletor desktop/mobile | Textos e destaques de **B** |
| **Resultados** (`resultados`) | Título e introdução da seção | Indicadores de **A** | Categorias/temas de **B** |
| **Experiências** (`invest-rs`, `prefeitura-sp`, `vale`, `globo-sportv`, `inpress`, `cdi`) | Empresa, logo e competências, com campos da seção e bloco **A** | Projetos de **A e B**, com escolhas internas por bloco | Galeria de imagens já gravada em `experienceMedia` do bloco **A** |

Ao clicar **Esquerda** em Sobre ou Resultados, o editor navega até **Informações da seção**. Em **Centro** de Sobre, seleciona o bloco A e abre o primeiro item com a foto desktop ativa; em **Direita**, seleciona o bloco B. Nas experiências, **Centro** disponibiliza os blocos A e B sem duplicação; **Direita** seleciona o bloco A e localiza a galeria existente.

Outras seções de duas áreas mantêm os controles originais. As áreas da navegação são uma representação **desktop**, enquanto os painéis A/B mobile mantêm o comportamento publicado.

### 3. Depoimentos na seção correspondente

- O menu **Acervo Estruturado** foi removido, assim como o atalho **Editar no Acervo**.
- Em **Editor do Site → Depoimentos → Gerenciar depoimentos**, a interface reutiliza o componente `CollectionsStudio` restrito à fonte `testimonials`.
- O formulário trabalha na tabela **`testimonials` original** com os cinco registros existentes (incluindo arquivados), preservando identificadores, `sort_order`, `status`, dados e janelas de distribuição entre os dois blocos publicados. A lista suporta novos registros e alterações, sem criar um acervo paralelo.
- O gerenciamento preserva `buildCollectionSavePayload`, releitura após gravação, confirmação de arquivamento e proteção contra navegação com alterações não salvas. O controle agregado de salvamento do Editor inclui o formulário de depoimentos.
- Os itens manuais de fallback continuam intactos em `content_blocks.content_json`. Enquanto os blocos estiverem ligados por `source_collection='testimonials'`, os cards públicos leem os registros publicados da coleção.

### 4. Limites e testes

- **Não há edição de layout público** nesta mudança; `src/index.css`, `src/components/public/**` e migrations continuam com os mesmos blobs Git.
- As verificações de CI incluem formatação, TypeScript, testes, build, e testes adicionais do mapeamento visual e do retorno do módulo Depoimentos.
- O navegador de homologação real testa o login, oito módulos, rótulos de Identidade, as três áreas de Sobre, Resultados e Experiências, a origem da fotografia desktop, as duas fontes dos projetos centrais e os cinco depoimentos com descarte seguro. **O roteiro bloqueia gravações de conteúdo de produção.**
- O sistema de edição de produção permanece sujeito às pendências P3 e de performance documentadas previamente; nenhuma delas é declarada resolvida por este ajuste administrativo.

## Referências

[Contrato do CMS](ADMIN_CMS.md) · [Histórico da Etapa 4](ACERVO_ESTRUTURADO_ETAPA4_2026-11-07.md) · [Relatório de homologação anterior](HOMOLOGACAO_CMS_ETAPA5_2026-11-07.md) · [AGENTS](../AGENTS.md).
