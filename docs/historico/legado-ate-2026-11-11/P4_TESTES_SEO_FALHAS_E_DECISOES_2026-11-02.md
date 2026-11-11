# P4 — Testes automáticos adicionais e decisões a responder

**Data:** 02/11/2026. **SHA funcional:** `a0dfbebe9a166e4a29e6355a4300727725d03a16`.

## Evidências de execução

- [Validate CI — aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41391579816): formatação, TypeScript, unitários, build e smoke.
- [P3/P4 navegador — aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41391579658): zero falhas de navegação, 38 capturas sem regressões detectadas, P5 anônimo 3/3.
- **P4_PUBLIC_PARTIAL_FAILURE:** os quatro endpoints `section_panels`, `testimonials`, `design_tokens`, `pages` foram substituídos por GET 503 dentro do navegador (4/4 PASS). O caso de depoimentos manteve 13 seções e três retratos editoriais. Nenhum dado foi modificado.
- **P4_SEO_PARITY:** PASS — 8 campos estáticos conferidos com as leituras públicas do CMS: `title`, `description`, `og:title`, `og:description`, `twitter:description`, `og:locale`, `canonical`, `robots`. A verificação é pontual; salvar SEO no CMS **não dispara** automaticamente novo deployment.
- **Lighthouse mobile:** três medidas simuladas de 4.119, 3.419 e 3.381 segundos, mediana **3,419 s**. Meta de 2,5 s **ainda pendente**.
- Os 26 blocos manuais, 75 registros de mídia, 53 objetos privados sem cadastro, 19 slides e três fotografias editoriais de depoimento não foram alterados.

## Escolhas para o proprietário

As decisões editoriais anteriores **B/C/D/A/A/A continuam válidas**. As questões abaixo tratam apenas da execução que ainda depende de direcionamento. Respostas de planejamento **não** autorizam substituir textos, fotos ou produzir gravações na base sem revisão das diferenças.

### 1. Primeiro piloto de comparação editorial

- **A — Formação, painel A:** 3 títulos iguais entre bloco e `education`, mas outros campos divergem (**recomendado para começar**).
- **B — Ferramentas, painéis A+B:** 6 títulos iguais no conjunto; divisão 3+3 requer aprovação de ordem.
- **C — Contato, painel B:** 3 títulos coincidem com 4 registros publicados; requer decisão sobre registro extra.
- **D — Apenas relatórios de diferenças, sem candidato de vínculo ainda**.

### 2. Campos das experiências

- Manter **descrição da trajetória** (contrato já existente), escolher opcionalmente empresa, cargo, localização, período, projetos e mídias. Precisamos também saber se os campos adicionais valem para **todas as seis** ou serão escolhidos **por experiência**.
- Não migrar galeria, retratos, logos, títulos ou projetos só por coincidência de nome.

### 3. Fotografias dos depoimentos

- **A — Confirmo que as três fotografias atualmente exibidas correspondem aos três autores**, e autorizo preparar *proposta* de associação por ID após conferir os arquivos; sem alterar o banco automaticamente.
- **B — Quero revisar a correspondência de cada um separadamente**.
- **C — Manter as fotografias atuais sem criar vínculos por ID ainda**.

### 4. Revisão dos textos alternativos

- **A — Analisar os 14 itens um a um com a fotografia e seu contexto** (**recomendado**).
- **B — Preparar propostas de textos e submetê-las antes de qualquer gravação**.
- **C — Deixar os campos do catálogo como estão por enquanto**.

### 5. Testes transacionais (staging)

- **A — Aprovar planejamento de ambiente de staging isolado, com dados sintéticos, sem copiar o banco de produção** (**recomendado**).
- **B — Solicitar proposta de staging com dados anonimizados; nenhum dado real será copiado sem autorização separada**.
- **C — Permanecer somente com testes de leitura; não autorizar staging agora**.

### 6. Atualização do SEO depois de salvar

- **A — Preparar proposta de deploy seguro automático após publicar alterações de SEO** (**recomendado**).
- **B — Preparar proposta de botão explícito `Publicar SEO` no CMS**.
- **C — Manter novo deployment manual sempre que alterar SEO**.

### 7. Endurecimento de segurança

- **A — Preparar plano de mudanças de RLS/Auth/RPC para aprovação separada, sem modificar configurações** (**recomendado**).
- **B — Priorizar proposta de habilitação da proteção contra senhas vazadas, com teste e rollback antes de aplicação**.
- **C — Adiar propostas de mudanças de segurança; manter apenas a auditoria de leitura**.

### 8. Margem para otimizar LCP

- **A — Tentar apenas alterações técnicas medidas que preservem fontes, imagens e layout aprovados** (**recomendado**).
- **B — Comparar alternativas de carregamento de fontes e recursos, mas sem mudar a fonte ou o visual efetivo antes de novo aceite**.
- **C — Suspender outras tentativas de LCP até a vistoria manual**.

## Restrições permanentes

Não alterar automaticamente conteúdo editorial, IDs de depoimentos, objetos Storage, RLS, autenticação ou imagem publicada. Os testes de escrita requerem staging e autorização específica. A decisão da área prioritária **não substitui** a aprovação individual de cada campo divergente. O relatório de SEO comprova a situação atual, não a atualização pós-salvamento.

[Checklist consolidado](CHECKLIST_CONSOLIDADO_P0_P2_P3_P4_2026-11-02.md) · [Relatório geral P4](P4_ENCERRAMENTO_AUTOMATICO_2026-11-02.md).
