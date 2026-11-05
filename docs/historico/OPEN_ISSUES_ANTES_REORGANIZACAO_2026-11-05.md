> **ARQUIVO HISTÓRICO — fonte:** [`docs/OPEN_ISSUES.md`](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2/docs/OPEN_ISSUES.md), commit `79aa3c07`. Os textos e evidências foram preservados; somente links relativos foram ajustados à localização no arquivo histórico. Não usar como estado vigente.

> **AUDITORIA CONSOLIDADA DOS PEDIDOS DO CHAT — 05/11/2026:** o último **SHA funcional** verificado é [`31943c12`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/31943c12b8214aa1d4aad957d159ddcea010835e), [Validate #42016989021](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016989021) **success** e Vercel produção **READY** com o mesmo SHA servido por `tulius.work`. A P3 [#42016688466](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016688466) **falhou globalmente** em sete verificações de navegador para `04cf1240`, ainda que o LCP mobile mediano do subgate de performance tenha sido **3,484 s** (≤3,5 s). Não há P3 própria do `31943c12` localizada nesta auditoria.
> **SQL somente leitura atualizado:** 14 seções (13 visíveis), 14 itens de navegação publicados, **75 mídias catalogadas** (72 públicas/3 privadas), 128 objetos no Storage (72 públicos/56 privados) e 0 pendências abertas. Snapshots anteriores 76/4 e 129 são históricos. Implementação de UI **não equivale** a homologação de writes com sessão administrativa ou teste visual de iPhone. [Auditoria completa](../AUDITORIA_PEDIDOS_CHAT_2026-11-05.md).
**Verificações posteriores ainda sem aceite técnico:** P3 público/Perfil a 320 px, seta visível na primeira dobra em aparelho, operação de mídia e salvamento autenticado, sincronização de alt em referências JSON, diferenças do catálogo 76→75 e rastreabilidade exata da migration. **Não reabrir automaticamente o encerramento histórico.**

> **CONSULTA ATUALIZADA — 05/11/2026:** implementação funcional até [`5ed489af`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5ed489af5879589565cb0101e420065bfbf50552) e última rodada CMS [`94466303`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/94466303617b18e343dddeb64d2ca7e39f131475), ambas com CI validado e publicação de produção confirmada. Os itens do encerramento anterior permanecem **encerrados por decisão**; verificações sobre funcionalidades **pedidas depois** dele são limites de homologação, não regressões presumidas. [Registro e matriz](../RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md).

## Verificações da nova rodada (não reabertura automática do encerramento)

**P3 do SHA funcional `5ed489af`:** [Audit P3 #42014121880](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014121880) **failure global** em `Browser routes and responsive viewports` (7 falhas automatizadas; Perfil mobile a 320 px entre elas). Em subgates separados, `P6_PERFORMANCE_BUDGET PASS`: LCP mediano de 3 simulações mobile **3,372 s** sob a meta **≤3,5 s**; desktop **0,905 s**. P5 read-only **3/3**, P4 **38 capturas sem falha automática**. Esses resultados parciais não equivalem a P3 aprovado, p75 real ou aceite visual humano.

O teste responsivo de 320 px é falha comprovada do SHA mais recente. Upload, exclusão e renomeação de arquivos reais, salvamento autenticado do Editor, fotografia de Contato e transições em aparelho permanecem sem homologação final. O histórico anterior não se transforma em backlog por inferência.

# PortfolioTulius — pendências encerradas por decisão do proprietário

**05/11/2026: backlog ativo vazio.** Todas as ações remanescentes foram marcadas **[x] ENCERRADAS ADMINISTRATIVAMENTE**, com possibilidade de reabrir apenas por novo pedido ou erro concreto. Este fechamento **não converte** testes não executados, backups ausentes ou commits locais não enviados em resultados comprovados. Fonte vigente: [encerramento operacional](../ENCERRAMENTO_OPERACIONAL_2026-11-05.md).

## Registro histórico (não é backlog vigente)

> **ATUALIZAÇÃO DE STATUS — 05/11/2026:** as **Etapas 4–7** foram declaradas concluídas pelo proprietário e não integram mais o backlog ativo; este arquivo conserva o quadro antigo como registro histórico. A situação corrente dos 53 pares privados, 44 públicos, um `alt_text` vazio novo, 139 diferenças hipotéticas, alertas RLS/SECURITY DEFINER, fluxos de mídia, CI/Vercel e limites da versão local consta da [auditoria autônoma de 05/11](../AUDITORIA_AUTONOMA_CONECTORES_2026-11-05.md). **Backlog técnico remanescente:** backup recuperável/LOC-10, integração dos commits locais + SEO/CSS sem perda, preservação do upload privado, testes e CI/Lighthouse no SHA do código realmente publicado, aceite final. Nenhuma edição de produção ou exclusão está autorizada por este registro.

### Quadro datado de 02/11 — referência histórica

> **Atualização operacional de 02/11/2026:** a meta de LCP mobile foi alterada expressamente para **≤3,5 s** (mediana de três Lighthouse); [auditoria #41518032045](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41518032045) registrou **3,386 s** e passou sob esse gate. A homologação transacional passou a depender exclusivamente do **Supabase local + Docker**, sem segundo projeto cloud. A vistoria humana completa de CMS/site e o aceite P7/P8 continuam pendentes. Ver [checklist assistido do Bloco 3](../BLOCO_3_P7_P8_VALIDACAO_ASSISTIDA_2026-11-02.md). A tabela abaixo é histórica e **não altera as decisões vigentes**.

**Reconciliado em 01/11/2026** com o último commit funcional auditado `aa71737e`. Este documento é uma **lista de acompanhamento**, não o arquivo cronológico. [Histórico integral até 31/10](OPEN_ISSUES_ATE_2026-10-31.md) · [estado vigente](../ESTADO_ATUAL_VIGENTE.md). Revalidar antes de encerrar qualquer item.

| ID / prioridade | Situação | Próximo critério de aceite |
|---|---|---|
| **P3-PERF-01 — alta** | **Aberta**: mediana mobile Lighthouse simulada de 3,492 s no SHA `aa71737e`; diagnóstico aplicado 2,324 s (apenas uma amostra). | Repetir medições controladas, avaliar FCP/CSS/fontes/JS sem regressões visuais e coletar p75 de campo quando disponível. Não alterar gate para simular sucesso. |
| **P3-CONTATO-VISUAL — alta** | **Aberta**: quatro verificações da foto/limite inferior de Contato reprovam a [P3 #41246204897](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204897), e já apareciam antes do refactor de Experiências. | Revisar layout/critério com o proprietário; só modificar Contato mediante escopo explícito. Não confundir com falha nos 38 screenshots automáticos. |
| **P2-TRANSACIONAL — bloqueada por decisão** | **Suspensa**: CRUD, publicação, revisão, Storage e JWT reais não homologados em ambiente isolado. | Autorização para fixture/ambiente controlado e definição de custo/risco. Não gravar dados de teste em produção. |
| **CMS-UX-ACEITE — média** | Código de popover de ícones, campos alinhados e modal de biblioteca registrado; inspeção humana final e testes autenticados de mutação ainda não realizados. | Aceite visual e, posteriormente, testes autorizados com credenciais e ambiente apropriado. **Não reabrir CMS-UX-01/02/03 como falta de implementação.** |
| **SEGURANÇA/P1 — decisão preservada** | Riscos históricos aceitos e itens de manutenção/proveniência, incluindo credenciais antigas e proteção de senhas, registrados nos relatórios P1/P3; esta revisão não revoga nem resolve aceites. | Reavaliar por decisão expressa do proprietário; não executar alterações sensíveis sem consentimento específico. |
| **EDITORIAL — média** | Ocorrências editoriais existentes, atribuição/procedência de mídias e depoimentos de natureza fictícia documentados historicamente. | Conferir registros atuais via Supabase read-only e obter aprovação editorial antes de publicar correções. Quantidades de outubro são **snapshots**, não valores atuais garantidos. |
| **ACEITE HUMANO — média** | 38 capturas sem falhas automatizadas no último SHA, mas sem equivalência com comparação pixel a pixel ou testes em dispositivos físicos. | Revisão visual mobile e desktop com atenção a Contato, tipografia, fotografia e navegação `sticky`. |

## Fechado em código, não abrir novamente sem regressão

- Perfil com carregamento prioritário CMS, retrato WebP e painéis 01A/01B.
- Olá! contínuo, Resultados com seletor e quatro indicadores em 2×2.
- Formação/Ferramentas compactadas e alternância dos seis grupos.
- Seis experiências com logos, projetos expansíveis e imagens vinculadas, Trajetória integral em mobile e retorno natural a Ferramentas.
- CMS-UX-01/02/03 implementados em código, **com homologação humana/transacional separada**.
- P5 público read-only 3/3 e CI do SHA funcional aprovado; isso não encerra P2.

## Política de evidências

Cada encerramento deve registrar **SHA + CI + resultado P3 + alteração de conteúdo (se houver) + aceite humano (se exigido)**. Lighthouse simulado, DevTools aplicado e percentil 75 real são critérios diferentes. Versões datadas e testes anteriores pertencem a [docs/historico/]() ou aos relatórios específicos; não copiar resultados antigos como se fossem o último status.


### Verificações da nova rodada (05/11/2026 — não são reaberturas históricas)

1. **Homologação autenticada de mídia (nova funcionalidade):** testar publicação automática de arquivo de teste, confirmação “Sim”/cancelamento, limpeza das referências e do Storage; não tocar na biblioteca real para ensaios sem backup e autorização explícita.
2. **Referências estáticas fora do CMS:** os dois retratos aprovados referidos diretamente em `PublicSite.tsx` são protegidos; remoção integral exige migrar código e derivados antes de liberar exclusão.
3. **SEO / canonical:** domínio confirmado é `tulius.work`. Não apontar para `tuliust.work` sem verificar posse, domínio Vercel e redirecionamentos. HTML e sitemap são reconstruídos no deployment, não em cada clique de salvar.
4. **Validação de transições:** testar opções, `prefers-reduced-motion`, layouts especiais e passagem desktop/mobile em dispositivo real. CI green não equivale a aceite visual humano.
