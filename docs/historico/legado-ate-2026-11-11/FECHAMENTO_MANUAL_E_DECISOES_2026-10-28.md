# PortfolioTulius — decisões restantes após o aceite manual (28/10/2026)

**Premissa atual:** o proprietário declarou encerrada e validada toda a frente de conferência manual das alterações deste chat. Isso substitui as referências históricas que ainda dizem "aceite visual pendente", sem apagar relatórios anteriores.

## Técnicas corrigidas nesta rodada
- Dashboard de Seções deixou de anunciar duas distribuições mobile por seção como constante. Exibe contagens atuais com base no estado retornado pelo Supabase e filtra o contador de pendências pelo estado aberto.
- Grade de cinco depoimentos: proporções 3 × 2 e duas linhas iguais desktop, com expansão por duas linhas; responsividade mobile separada, sem alterar conteúdos.
- Diálogo de enquadramento: gestão de foco inicial, confinamento de Tab/Shift+Tab, Escape e retorno ao botão de origem.
- Consulta `testimonials`: iniciada junto com as outras leituras necessárias, eliminando a etapa sequencial da única coleção vinculada atualmente. A meta de LCP mobile permanece medida pela auditoria P3, **não** presumida como resolvida.

## Fora do escopo de execução automática (decisão/segurança/custo)
1. **P2-TRANS-00/01/02/04**: transações CMS/Storage com JWT real, contas de teste e alternativa isolada sem custo, quando autorizadas; **nenhuma execução ou criação de staging**.
2. **P2-TRANS-03**: decidir implementação de restauração pela UI ou homologação de procedimento operacional reversível; nenhum botão de restauração foi inventado.
3. **P1**: direitos/proveniência dos 19 SVGs e 2 PNGs, retenção dos 2 objetos privados, função de importação 410 e branches antigas. Nenhuma exclusão/atribuição de licença/undeploy foi realizada.
4. **Segurança**: não revogar o token historicamente exposto nem ativar Leaked Password Protection sem decisão pontual.
5. **Fontes do ChatGPT**: limpeza manual da lista de fontes, preservando a variante exclusiva de 80 linhas da seção 01; o GitHub não controla essa lista.
6. **Conteúdo editorial**: oito ocorrências abertas no banco aguardam avaliação factual/editorial; não se fecham por aceitar a UI.
7. **Mídia de compartilhamento (OG)**: CSS não modifica os pixels enviados a serviços externos. Enviar arquivo já recortado 1200×630 ou aprovar separadamente criação/publicação de derivativos em Storage. Os nomes atuais da biblioteca são **nomes reais em Storage** com extensão, incluindo prefixo UUID, não nomes originais sem UUID.
8. **Responsividade do recorte**: X/Y/zoom atualmente compartilhados entre dispositivos, exceto imagem desktop específica em Olá!. Uma configuração independente por breakpoint seria uma ampliação de produto, não um defeito reconhecido do aceite manual.
9. **LCP mobile ≤2,5 s**: objetivo independente e ainda sujeito a medição e diagnóstico no mesmo SHA.

## Proteções
Não mexer em dados editoriais aprovados, mídias originais, créditos legados, esquema SQL, RLS, credenciais, custos, Storage binário ou branches apenas para reduzir a lista de pendências. O CI e o P3 têm validade técnica limitada aos commits em que foram executados.

### Auditoria da versão funcional de correções — 28/10/2026

[CI de implementação #40781440231](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781440231) **success** no SHA [`ae4033e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ae4033e3720d8252e5af3270c71f7470877341ec). [Auditoria P3 #40781440227](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781440227) **success**, 8 viewports sem overflow, 13 seções, 25 painéis, 38 capturas sem falhas, 6 experiências navegáveis, P5 anônimo 3/3, nenhum dado de produção escrito. Lighthouse mediana de três amostras: **mobile Performance 80, LCP 4,38 s**; **desktop Performance 97, LCP 1,09 s**. A meta mobile ≤2,5 s não foi alcançada. Diagnóstico registrou fonte Google render-blocking e custo de execução/avaliação do bundle JavaScript, além da variabilidade de laboratório. A antecipação da consulta de depoimentos remove etapa sequencial de rede, mas não comprova ganho sustentável de LCP. **Não alterar orçamento de regressão para declarar o requisito aprovado.** A auditoria de browser foi executada no SHA funcional; os commits posteriores apenas documentam o aceite manual.

As verificações da versão documental de `main` são [CI #40781599089](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781599089) e [Export Docs #40781598923](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781598923), ambas **success**. Vercel Production `READY` no mesmo commit documental antes deste registro. A declaração expressa do proprietário encerra a fase de aceite manual do chat; não encerra metas de performance ou P2 transacional.

