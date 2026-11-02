# PortfolioTulius — estado operacional vigente

**Revisão consolidada:** 01/11/2026. **Natureza:** marco documental, não monitoramento em tempo real. A prioridade é conferir a [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), o SHA publicado e os workflows desse SHA. [Histórico anterior preservado](historico/ESTADO_ATUAL_VIGENTE_ATE_2026-10-31.md).

## Último código funcional auditado

| Evidência | Resultado no commit `aa71737e48834bb987c4a7cb6a3353ae1cf221fb` |
|---|---|
| [CI Validate #41246204902](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204902) | **success**: formatação, TypeScript, testes, build e smoke |
| [Auditoria P3 #41246204897](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204897) | **failure** global; quatro critérios de Contato já falhavam antes do último refactor |
| P4 visual | 13 desktop + 25 mobile = **38 capturas**, sem falhas nos critérios automatizados |
| P5 público | 3/3, **sem mutações** |
| LCP mobile simulado | **3,492 s**, mediana de 3 execuções |
| LCP mobile aplicado | **2,324 s**, uma amostra diagnóstica, não aceite |
| Lighthouse P6 | Gate operacional mais permissivo passou; **não comprova** objetivo de LCP ≤2,5 s |
| Aceite humano | Comparação estética e comportamento em dispositivo físico **não substituídos** pelos robôs |

Não há medição válida de **p75 de usuários reais** para concluir a meta. A auditoria P3 geral continua **reprovada**; não atribuir as quatro falhas ao trabalho em Experiências sem evidência. A P3 identificou a versão do site correspondente ao SHA auditado; confirmar Vercel em cada mudança futura.

## Contrato público atualmente implementado

1. **Perfil (Seção 01):** telas `perfil-a` e `perfil-b`; identidade editorial, retrato WebP e selo 360°, áreas de atuação e experiências em listas; composição dinâmica do CMS. Referência [`5dde6ce`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5dde6ce93b8aa8d7181f336071145a9830a56e4f).
2. **Olá! (Seção 02):** um título de abertura; fotografia original ampliada; continuidade sem repetição de `OLÁ!` e cinco diferenciais publicados.
3. **Resultados (Seção 03):** seletor mobile com categorias do CMS e indicadores em grade 2×2. As duas seções usam [`55c4049`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/55c40499a4d8191718315f99150998e93269693a); no mobile baixo, altura cresce naturalmente.
4. **Formação:** 3 registros acadêmicos + 2 de idiomas, tipografia e espaçamentos compactados só no mobile.
5. **Ferramentas:** 6 grupos do CMS, distribuição alternada de ícones/textos, subtítulo redundante oculto e tipografia principal preservada; referência [`fadfbceb`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fadfbcebbe483c5a050500ef0cd06cd8d4a6a2fa).
6. **Experiências Profissionais:** Invest RS, Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress e CDI Comunicação, com seis logos, identificação automática e navegação por âncoras. Mobile: ficha com abas Projetos/Trajetória sticky por empresa, projetos expansíveis com galeria vinculada ao selecionado, trajetória completa e rolagem natural. Abaixo de ou igual a 620 px de altura, a ficha deixa de ser sticky para permitir leitura. Desktop não foi remodelado. Referência [`aa71737e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/aa71737e48834bb987c4a7cb6a3353ae1cf221fb).
7. **Outras seções:** componentes públicos e CMS não modificados por esta sequência; quatro critérios da fotografia de Contato permanecem pendentes.

Os dados e metadados são publicados via Supabase RLS e CMS, com filtros de visibilidade; capturas conceituais não são fonte de conteúdo a fixar em código. `AGENTS.md` rege as alterações. **13/25/38** são números da auditoria do SHA indicado, não promessa de contagem imutável.

## Caminho crítico de desempenho

A primeira seção é consultada cedo via PostgREST no HTML e reutilizada pelo hook; a composição integral do CMS ocorre em paralelo. O fallback offline é lazy. A foto da abertura é entregue em WebP (600×800: 29.568 B; 900×1200: 51.458 B); original preservado no Supabase. [Relatório da intervenção inicial](P3_LCP_MOBILE_RESULTADOS_2026-10-31.md) é histórico, não o último Lighthouse. **P3-PERF-01 permanece aberta**, meta de LCP mobile ≤2,5 s não comprovada.

## CMS e limites da homologação

- Melhorias CMS-UX-01 (popover 50 ícones / 5 categorias), CMS-UX-02 (alinhamento de campos de logos/slides) e CMS-UX-03 (biblioteca de mídia em modal com upload e publicação deliberada) estão **implementadas em código segundo [ADMIN_CMS.md](ADMIN_CMS.md)**. O arquivo [CONTINUIDADE_CMS de 31/10](CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md) representa um **backlog anterior** e não deve ser usado como lista vigente.
- CMS-UX-04: manter Salvar somente quando houver alterações, aviso interno ao navegar e `beforeunload` nativo ao fechar/recarregar.
- Aceite visual humano e **testes de gravação, upload, CRUD ou publicação com JWT real** não foram concluídos por esta revisão. **P2 transacional suspensa**: sem testes destrutivos em produção nem custos de staging sem autorização.
- Manter as decisões de segurança, procedência de mídias, registros editoriais, limitações de conteúdo e riscos aceitos em [OPEN_ISSUES.md](OPEN_ISSUES.md) e [SECURITY_RLS.md](SECURITY_RLS.md); snapshots antigos não são inventário atual do banco.

## Invariantes

Preservar textos, fotografias, tipografia, metadados SEO, links, ordem e dados aprovados; não inventar exemplos. Não modificar Supabase (schema, RLS, Auth, Storage), infraestrutura, Vercel, conteúdo de produção ou segurança sem autorização explícita. Operar exclusivamente na `main`, sem branch nem PR. Para requisitos de cada painel e limites de viewport, ver [RESPONSIVE_LAYOUT.md](RESPONSIVE_LAYOUT.md) e [EXPERIENCIAS_UNIFICADAS_2026-10-31.md](EXPERIENCIAS_UNIFICADAS_2026-10-31.md).
