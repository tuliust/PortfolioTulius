# P4 — Encerramento do trabalho automatizável com conectores

**Data:** 02/11/2026. **Commit funcional validado:** `38097a4ad2a03d421cb4e4e6badce63bde4108d2`. A atualização documental subsequente não executa migrações nem substitui a vistoria humana.

## Concluído ou verificado automaticamente

| Frente | Evidência | Alcance real |
| --- | --- | --- |
| P4.1 — blocos | [matriz de 26 blocos](P4_AUDITORIA_AUTOMATICA_2026-11-02.md) | 26 manuais inventariados, 8 candidatos sem vinculação automática; 2 blocos de depoimentos continuam ligados |
| P4.2 — CMS | [P5 autenticado, 6/6](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41384753740) | login, oito módulos, nove coleções, prévia com 14 seções, salvaguarda de edição não salva, seleção e cancelamento de fotografia, logout; zero gravações |
| P4.3 — Storage | [auditoria de mídia](P4_AUDITORIA_AUTOMATICA_2026-11-02.md) | 75/75 registros com objeto, 53 privados sem cadastro (41 SVG, 11 PNG, 1 JPEG) preservados; 6 logos e 19 slides presentes e com descrições/legendas |
| P4.3 — acessibilidade de mídia | [lista dos 14 alts](P4_INVENTARIO_ALT_2026-11-02.md) | 13 vazios e um curto, triagem não equivale à deficiência automática |
| P4.4 — Contato e visual | [P3/P4 41389455933](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455933) | quatro falhas anteriores corrigidas; 0 regressões de navegador nos critérios testados, 38 capturas |
| P4.4 — tolerância a falhas | [P3/P4 41389455933](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455933) | GET 503 de painel mantém primeiro perfil; GET 503 de depoimentos mantém 13 seções, 3 retratos; zero mutações |
| P4.4 — identidade | [CI 41389455931](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455931) | `radius.card` nos cartões de depoimentos e `font.heading` em `--font-display`, conservando valores visuais publicados |
| CI código | [Validate 41389455931](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455931) | formatação, TypeScript, unitários, build e smoke aprovados |
| SEO | [script de geração no build](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/main/scripts/generate-seo.mjs) | dados atuais publicados e metadados gerados em build; novo salvamento no CMS não inicia deploy automaticamente |

## Desempenho

Lighthouse 13.5.0, mobile simulado na auditoria do SHA funcional: **LCP mediano de 3,389 segundos**, desempenho mediano de **87/100**. A meta LCP ≤2,5 s **não foi atendida**. Desktop teve nota de performance 99/100 na primeira medição; acessibilidade 100/100 em mobile/desktop. Esses números são de laboratório, não Web Vitals de campo. Diagnóstico aponta bloqueio por Google Fonts/CSS e execução de JavaScript, mas qualquer otimização que altere fontes, carregamento ou composição precisa de comparação e proteção visual antes da aprovação.

## Pendências que não podem ser encerradas automaticamente com as autorizações atuais

- **Editorial:** aprovação por bloco das divergências e vínculos para os 26 blocos manuais; escolha dos campos sincronizados nas seis experiências; não presumir associação por posição ou título.
- **Fotografias:** verificar identidade de cada depoente e vincular explicitamente sua fotografia por ID; revisar as 14 ocorrências de alt em contexto; sem exclusão de 53 objetos privados.
- **Transações:** testar criação, duplicação, ordem, arquivamento, publicação, recuperação histórica, upload privado e promoção de mídia **em staging isolado com autorização específica**; não executar em produção só para testar.
- **SEO:** publicação de metadados estáticos para rastreadores após salvar no CMS precisa de mecanismo seguro de novo build/deploy, com configuração e autorização específicas; atualização em runtime não substitui Open Graph HTML estático.
- **Performance:** reduzir LCP mobile até a meta com medições repetidas e sem mudanças indesejadas no design aprovado.
- **Segurança (P4.5):** decidir proteção de senha vazada, restrição/hardening de execução de seis RPCs, RLS/índices e testes realistas com usuário não admin sem modificar produção.
- **Acessibilidade/manual:** leitores de tela, zoom, navegação humana, revisão de galeria/dispositivos e aceite editorial do proprietário.

## Limites e integridade

Nenhuma escrita SQL, alteração de RLS/Auth/Storage, edição de 26 blocos ou associação automática de fotos foi realizada. Nenhuma correção ou validação automatizada foi interpretada como aprovação editorial. O código e a documentação estão versionados na `main`, que publica na Vercel automaticamente. Conferir o deployment final após este documento.

**Checklist vigente:** [P0/P2/P3/P4 consolidado](CHECKLIST_CONSOLIDADO_P0_P2_P3_P4_2026-11-02.md).
