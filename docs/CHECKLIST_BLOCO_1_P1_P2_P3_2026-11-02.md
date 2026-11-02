# Bloco 1 — Checklist operacional P1–P3

**Data:** 02/11/2026. **Escopo:** somente trabalho automático por conectores GitHub, Supabase e Vercel sem publicar conteúdo editorial não aprovado. Este checklist complementa o [histórico P0–P4](CHECKLIST_CONSOLIDADO_P0_P2_P3_P4_2026-11-02.md); não substitui o aceite do proprietário.

## P1 — Inventário, comparação e cobertura do CMS

- [x] Auditar os 28 blocos publicados, identificar **26 manuais** e **2 vinculados** e listar os campos de cada bloco em [inventário integral](BLOCO_1_P1_INVENTARIO_2026-11-02.md).
- [x] Inventariar as **14 seções** (13 visíveis e Competências oculta), 42 painéis e coleções.
- [x] Listar candidatos estruturados por títulos iguais, distinguindo coincidência de título de equivalência editorial; não vincular.
- [x] Comparar empresa, cargo, localização, período, projetos e galeria nas seis experiências, com [relatório por empresa](BLOCO_1_P1_EXPERIENCIAS_2026-11-02.md).
- [x] Identificar quatro projetos estruturados e as diferenças de texto/visibilidade dos cards associados.
- [x] Relacionar os nove formulários de coleções aos campos do esquema e identificar atributos sem campo direto (`experience_id`, `photo_media_id`, `skills` etc.).
- [x] Triar [53 objetos privados sem cadastro por MIME e diretório](BLOCO_1_P1_STORAGE_2026-11-02.md), sem leitura dos bytes privados ou exclusões.
- [x] Reaproveitar o mapa dos três retratos confirmados dos depoimentos, sem inventar UUIDs e sem ingestão.
- [ ] Comparar **cada valor** (inclusive imagem, link, estado e estilo responsivo) dos 26 blocos com uma projeção específica revisada; relatório inicial traz candidatos e campos, não equivalência nem migração.
- [ ] Determinar uso real, dependências em revisões/rascunhos e eventuais duplicidades dos 53 objetos privados antes de qualquer proposta de limpeza.
- [ ] Homologar ciclo completo formulário → gravação → banco → recuperação → prévia → público em staging; leitura de esquema não substitui teste transacional.

## P2 — Prévia isolada, dados sintéticos e testes preparatórios

- [x] Preservar em código a prévia aprovável de Formação/A, mantendo períodos `meta=A` e novos textos de instituição `text=B` **sem alterar o bloco público** (`src/lib/formation-pilot-preview.ts`).
- [x] Validar a proteção de IDs, títulos, rótulos, ordem e versões do texto em testes unitários existentes.
- [x] Adicionar [teste de navegador com injeção DOM somente em memória](../scripts/p4-formation-visual-preview.mjs).
- [x] Executar prévia em **desktop 1440px, mobile 390px e mobile 360px**, comparando antes e depois: **3/3 PASS**, sem overflow horizontal ou escritas; [workflow e seis capturas](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41402653744).
- [x] Gerar [fixtures independentes totalmente sintéticas](../scripts/p2-synthetic-fixtures.mjs), com verificação de nomes proibidos e unicidade, sem copiar `supabase/seed.sql`; testes nativos Node e Validate CI aprovados.
- [x] Criar workflow específico para auditoria read-only de prévia e rede, com gate de SHA da produção e upload de seis capturas.
- [ ] Integrar **prévia visual propriamente no CMS** (a execução atual gera capturas isoladas do site, não habilita botão/rota admin).
- [ ] Receber inspeção humana das seis capturas e autorização separada antes de qualquer vínculo `Formação/A` com `education`.
- [ ] Preparar/validar mais testes sintéticos para duplicação, ordenação, arquivamento, histórico, rollback e restauração em staging; fixture pronta não significa fluxo transacional testado.
- [ ] Executar com credenciais distintas os ensaios administrativos e operações privadas **somente depois de staging provisionado e autorizado**.
- [ ] Testar falhas/reconexão de mídia e publicação estática de SEO com servidor de teste isolado.
- [ ] Implantar o gatilho real de SEO apenas após autorização específica para infraestrutura e segredos.

## P3 — Diagnóstico de desempenho e otimizações não visuais

- [x] Coletar **baseline de GETs por endpoint** no navegador em desktop/mobile, no mesmo workflow de P2, sem dados sensíveis nas URLs e sem escritas.
- [x] Medir **dez GETs para nove endpoints** em cada viewport de teste; `sections` aparece **duas vezes** (Perfil antecipado + grafo completo).
- [x] Registrar como **candidato técnico, não erro**, a dupla leitura de `sections`; ela dá prioridade à primeira dobra. Não remover sem comparação de LCP e regressão visual.
- [x] Preservar as medições Lighthouse anteriores como baseline (~3,419 s de LCP mobile mediano simulado); não alegar melhoria por mudanças restritas aos testes.
- [ ] Medir **três ou mais** Lighthouse mobile comparáveis no SHA de uma futura otimização, incluindo CSS/JS/fontes, primeiras respostas do PostgREST e atraso de renderização.
- [ ] Implementar somente ajustes técnicos com benefício medido, mantendo **fonte, retratos, cortes, conteúdo, animações editoriais e layout idênticos**.
- [ ] Testar alternativas de reuso/desduplicação das duas leituras `sections`, preservando o primeiro Perfil; rejeitar atrasos ou conteúdo alterado.
- [ ] Comparar snapshots, P3/P4/P5, responsividade, SEO e RLS de qualquer alteração técnica antes/depois.
- [ ] Reduzir LCP mobile para ≤2,5 s com amostras comparáveis; **não atingido**.
- [ ] Revisar outras oportunidades técnicas de cache, bundle admin e responsabilidades de componentes mediante métricas; nenhuma exclusão/refatoração especulativa.

## Integridade e critérios de aceite

- [x] Nenhum `UPDATE`, `INSERT`, `DELETE`, DDL, upload, alteração Auth/RLS ou vínculo editorial executado nesta rodada.
- [x] Projeção de Formação/A e capturas geradas apenas por JS/DOM no navegador de teste; o site e o CMS publicados continuam usando os blocos originais.
- [x] CI da suíte sintética e do código de auditoria validado no SHA funcional indicado pelo [workflow](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41402653744).
- [ ] Concluir o Bloco 1 **integralmente** somente após concluir as pendências de campo/visual/performance que ainda são técnicas; P4–P8 do novo plano continuam separados para aprovação e vistoria humana.
- [x] Validar CI, exportação de documentação e Vercel `READY` no commit do dossiê `6b651c6` ([CI](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41402900908), [exportação](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41402900905)).

**Dossiês:** [inventário 26 blocos](BLOCO_1_P1_INVENTARIO_2026-11-02.md) · [seis experiências](BLOCO_1_P1_EXPERIENCIAS_2026-11-02.md) · [53 objetos privados](BLOCO_1_P1_STORAGE_2026-11-02.md).
