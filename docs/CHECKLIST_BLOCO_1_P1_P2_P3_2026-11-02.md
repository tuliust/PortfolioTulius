> **CHECKLIST HISTÓRICO — ENCERRADO ADMINISTRATIVAMENTE EM 05/11/2026.** Todos os itens pendentes abaixo foram marcados **[x] por decisão do proprietário**, com possibilidade de retomada futura. Contagens e caixas [ ] no texto original reproduzem o **snapshot de 02/11**, não tarefas atuais. Fonte vigente: [Fechamento operacional](ENCERRAMENTO_OPERACIONAL_2026-11-05.md). Não confundir aceite com CI, backup ou implantação realmente executados.

# Bloco 1 — Trabalho executável automaticamente pelos conectores

**Status vigente:** execução parcial · **Nova meta LCP mobile: ≤ 3,5 s** · **Staging aprovado: local/isolado** · **Atualizado em:** 02/11/2026 · **Fonte:** evidências técnicas e checklists versionados no PortfolioTulius. Este quadro organiza tarefas concluídas, pendências técnicas e decisões transferidas ao Bloco 2; **não declara encerrado o Bloco 1**.

## Painel de acompanhamento

| Frente | Realizadas | Pendentes técnicas | Estado |
| --- | ---: | ---: | --- |
| **P1** — Inventário e comparação editorial | 9 | 2 | Parcial |
| **P2** — Prévias e testes preparatórios | 9 | 3 | Parcial |
| **P3** — Desempenho e confiabilidade | 7 | 5 | Parcial |
| **Total** | **25** | **10** | **Bloco 1 parcialmente concluído** |

Há ainda **4 itens transferidos ao Bloco 2**, fora das contagens acima, porque precisam de autorização, ambiente isolado ou aceite editorial.

## Atividades realizadas e pendentes por frente

### P1 — Inventário e comparação editorial

**Realizado (9)**

- [x] Auditar 28 blocos publicados: **26 manuais e 2 vinculados**; mapear 14 seções (13 visíveis) e 42 painéis.
- [x] Identificar coleções candidatas por título, sem presumir equivalência editorial nem criar vínculos.
- [x] Comparar os seis registros de experiências, seus campos comuns e os quatro projetos publicados, inclusive visibilidade dos cards.
- [x] Mapear campos disponíveis e lacunas dos formulários das nove coleções do CMS (`experience_id`, `photo_media_id`, `skills` etc.).
- [x] Verificar os três arquivos de retratos de depoimentos confirmados, sem associar UUIDs nem enviar arquivos.
- [x] Classificar os 53 objetos privados sem catálogo por MIME/diretório, preservando todos os arquivos.
- [x] Localizar referências textuais dos 53 objetos em 145 revisões históricas; 28 também aparecem nos blocos atuais.
- [x] Medir **139 divergências de atributos** em nove projeções estruturadas hipotéticas, sem modificar conteúdo.
- [x] Identificar **17 blocos manuais** que não possuem uma projeção estruturada integral segura.

**Pendente (2)**

- [ ] Revisar **valor por valor** dos 26 blocos, sobretudo os 17 heterogêneos: textos, fotos, links, estados ocultos, ordem, estilos e responsividade; preparar diferenças para aceite individual.
- [ ] Determinar uso efetivo, dependências em rascunhos e eventual duplicidade por comparação de bytes dos 53 objetos privados; a referência histórica não comprova que sejam descartáveis.

### P2 — Prévias e testes preparatórios

**Realizado (9)**

- [x] Preparar a prévia de Formação/A em memória, mantendo os três períodos (`meta=A`) e acrescentando apenas os três nomes das instituições (`text=B`).
- [x] Testar os IDs, títulos, tipos, ordem, metadados e bloqueio de divergências na projeção de Formação/A.
- [x] Validar a simulação em navegador em 1440 px, 390 px e 360 px, com seis capturas antes/depois, **3/3 PASS** e zero escritas.
- [x] Preparar fixtures inteiramente fictícias para staging, sem utilizar `supabase/seed.sql`, e validar unicidade/status.
- [x] Adicionar workflow de auditoria somente leitura com verificação do SHA e coleta de capturas e requisições.
- [x] Integrar opção **desativada por padrão** de Formação/A à prévia protegida do CMS; validar **P5 7/7** em desktop/mobile e zero mutações.
- [x] Adicionar guarda fail-closed de destino do staging (bloqueio de produção, URLs divergentes e confirmação inválida), aprovada em **5 testes offline**.
- [x] Preparar **cinco cenários offline de CMS fictício** ([contrato de testes](../scripts/p2-cms-offline-contract.check.mjs)): edição/publicação, arquivamento/restauração, duplicação/ordem, bloqueio não administrador e rollback por erro injetado. **Não são CRUD reais.**
- [x] Simular **quatro contratos SEO** ([simulador offline](../scripts/p6-seo-publish-simulation.mjs)): rascunho bloqueado, permissão fictícia, deduplicação e retentativa; sem rede ou integração Vercel.

**Pendente (3)**

- [ ] Validar esses mesmos fluxos **contra Supabase local/Docker**, incluindo histórico real, RLS, limpeza e rollback; adiado até a inicialização local.
- [ ] Testar falhas de leitura, perda de conexão e recuperação de mídia em ambiente de testes isolado.
- [ ] Validar o mesmo contrato em **servidor de teste local**, com JWTs efetivos e acionamento simulado de deployment; não configurar o gatilho de produção.

### P3 — Desempenho e confiabilidade

**Realizado (7)**

- [x] Medir a rede pública nos três viewports: **10 GETs a nove endpoints** por viewport, sem gravações.
- [x] Identificar as duas consultas a `sections` (Perfil antecipado + grafo completo) como oportunidade de investigação, não erro comprovado.
- [x] Registrar baseline anterior de LCP mobile mediano **3,419 s** em laboratório.
- [x] Repetir três medições Lighthouse mobile: nova mediana **3,314 s**, sem atribuir a diferença a uma otimização.
- [x] Reexecutar verificações de navegador, SEO estático e capturas editoriais, sem regressões detectadas no ciclo registrado.
- [x] **Meta vigente LCP mobile ≤ 3,5 s:** último ensaio de três amostras (mediana **3,386 s**, [Lighthouse #41518032045](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41518032045)) atende ao novo gate. Não é medida de campo nem comprovação de melhora causada por código.
- [x] Revalidar o limite de **3,5 s** com o **novo gate** após a alteração de código, em três amostras (mediana **3,386 s**; nenhuma regressão visual na auditoria). Repetir após futuras mudanças relevantes.

**Pendente (5)**

- [ ] Medir Lighthouse mobile em **três ou mais execuções antes e depois** de cada otimização candidata, incluindo rede, CSS, fontes, JavaScript e tempo de renderização.
- [ ] Implementar somente otimizações técnicas não visuais com benefício demonstrado e plano de reversão.
- [ ] Testar desduplicação ou reuso das consultas a `sections`, sem atrasar o Perfil nem alterar os dados exibidos.
- [ ] Investigar estratégias de cache e invalidação, bundles administrativos e responsabilidades dos componentes com métricas comparáveis.
- [ ] Reexecutar testes unitários, TypeScript, build, smoke, SEO, acessibilidade, RLS e capturas desktop/mobile depois de cada alteração técnica.

## Dependências transferidas ao Bloco 2

- [x] **Bloco 2 / P4 — Staging:** proprietário escolheu **Supabase local isolado**, sem novo projeto cloud; config, seed fictício e testes de isolamento offline foram preparados. [Guia](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md).
- [ ] **Bloco 2 / P4 — Execução local:** iniciar Docker/CLI no computador de homologação, verificar schema, criar contas fictícias e testar CRUD/RLS/Storage/rollback. Não iniciado neste ambiente sem Docker.
- [ ] **Bloco 2 / P5 — Editorial:** revisar visualmente a prévia real de Formação/A e as seis capturas; obter autorização individual antes de vincular `education` ou editar outros blocos.
- [ ] **Bloco 2 / P5 — Mídias:** avaliar e aprovar separadamente associação dos retratos, logos, galerias e outras diferenças editoriais.
- [ ] **Bloco 2 / P6 — SEO e segurança:** autorizar separadamente o gatilho de deploy SEO e qualquer mudança em Auth, RLS, RPCs, índices ou credenciais.

## Integridade e evidências de validação

- [x] As auditorias SQL desta fase foram apenas **SELECT**. Nenhum bloco foi vinculado, publicado ou substituído; não houve upload, exclusão, DDL ou alteração Auth/RLS no Supabase.
- [x] Formação/A permanece manual, com a opção de prévia no CMS protegida por login e desativada por padrão.
- [x] Os testes autenticados do CMS passaram **7/7**, com zero mutações ([P5 read-only #41404376390](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41404376390)).
- [x] Os cinco testes offline de isolamento de staging passaram no [CI #41514624001](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41514624001).
- [x] O commit de referência `51825abf` passou na [validação](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41515245255), teve [exportação de documentação aprovada](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41515245364) e deployment Vercel **READY**.
- [x] Confirmar CI, exportação e Vercel `READY` do commit documental `262240f5`: [validação](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41516613463) e [exportação](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41516613444). Uma documentação validada **não** encerra as 11 pendências técnicas.

## Arquivos de evidência

- [Inventário dos 26 blocos](BLOCO_1_P1_INVENTARIO_2026-11-02.md)
- [Comparação das seis experiências](BLOCO_1_P1_EXPERIENCIAS_2026-11-02.md)
- [Matriz de 139 diferenças](BLOCO_1_P1_COMPARACAO_ATRIBUTOS_2026-11-02.md)
- [Auditoria dos 53 arquivos](BLOCO_1_P1_STORAGE_2026-11-02.md)
- [Prévias, rede e Lighthouse](BLOCO_1_P2_P3_EVIDENCIAS_2026-11-02.md)
- [Checklist do Bloco 2](CHECKLIST_BLOCO_2_P4_P5_P6_2026-11-02.md)

**Regra de continuidade:** mudanças editoriais, vínculos de coleção, migrações de mídia, provisionamento/execução de staging e alterações de segurança só avançam após a autorização específica correspondente. O checklist é um painel de acompanhamento, não uma autorização de publicação.

## Decisões atualizadas em 02/11/2026

- [x] O limite operacional de **LCP mobile mudou de 2,5 s para 3,5 s**, por decisão do proprietário; o gate Lighthouse mobile foi atualizado para **3.500 ms**. [Registro](DECISOES_LCP_3_5_STAGING_LOCAL_2026-11-02.md).
- [x] O ensaio atualizado (mediana **3,386 s**, três Lighthouse) satisfaz a nova meta **nesse ensaio**, com gate móvel de 3.500 ms. O resultado anterior de **3,314 s** permanece registrado para comparação histórica; nenhum ganho de desempenho foi inferido.
- [x] Seleção de **Supabase local** como único ambiente de staging; preparado `supabase/config.toml` com `seed.local.synthetic.sql`, sem segundo projeto cloud.
- [ ] Rodar Docker/CLI local, testar migrations e o fluxo transacional com contas fictícias; **não executado aqui**.

## Continuidade automática — 02/11/2026 (sem seu computador)

- [x] Criar o [rascunho técnico de Formação/A](../src/lib/formation-pilot-proposal.ts): **três campos `text` apenas**, sem `source_collection`, armazenamento ou chamadas de produção. Testes preservam `meta` e bloqueiam alterações editoriais não revisadas.
- [x] Preparar ensaios sintéticos de CRUD/editorial, rollback e autorização em memória, sem rede nem dados reais; isso não substitui staging local.
- [x] Preparar ensaios offline de deduplicação e retentativa SEO. Nenhum gatilho ou webhook foi instalado.
- [x] Auditar grants e guardas das seis RPCs privilegiadas via `SELECT` em produção, sem alterações; [relatório P6](BLOCO_2_P6_SEGURANCA_LEITURA_2026-11-02.md).
- [ ] Homologar processos transacionais, recuperação de mídia, RLS por JWTs e publicação SEO com o stack Docker/Supabase local quando disponível.

## Evidência complementar de navegação e mídia — 02/11/2026

- [x] Verificar, via SELECT, que **14/14** destinos da navegação têm seção cadastrada, sendo **8** links visíveis, nenhum com destino inexistente ou oculto.
- [x] Confirmar que os **6** destinos `targetSlug` do Perfil apontam para experiências publicadas e visíveis.
- [x] Conferir **75/75** registros do catálogo contra objetos em Storage, com **0** referências a objeto ausente.
- [ ] Validar cliques e destinos externos de Contato, conteúdo visual/alt dos objetos, zoom e dispositivos reais; [roteiro Bloco 3](BLOCO_3_P7_P8_VALIDACAO_ASSISTIDA_2026-11-02.md).

*Estas checagens são evidências adicionais do inventário, não foram adicionadas às contagens antigas de 25 realizadas/10 pendentes, para evitar mudar critérios retroativamente.*
