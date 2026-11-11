# Branches históricas — exclusão verificada em 11/11/2026

**Status: LIMPEZA CONCLUÍDA.** As duas branches históricas foram excluídas manualmente pelo proprietário e a consulta à API GitHub de 11/11/2026 retornou **somente `main`**, no SHA `603fe3aafe9e883ce73ecb461d02b8e67830acf6`. As referências e a relação dos commits abaixo representam a **fotografia anterior à exclusão**, preservada para rastreabilidade.

## Branches identificadas antes da exclusão

| Branch | SHA antes da limpeza | Relação com `main` na auditoria | Decisão |
|---|---|---|---|
| `main` | [`c4bc83ced8fd94e78d44fef5de5f0a58df5065be`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c4bc83ced8fd94e78d44fef5de5f0a58df5065be) | Publicação principal | Preservar; nunca excluir |
| `fix/p3-motion-units-20261024` | [`909badf42a95`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/909badf42a95d2a4a84bdb77a0129811c9e952db) | Ancestral, 0 commits exclusivos / 842 atrás da `main` da auditoria | Pode ser removida |
| `fix/header-hero-section-navigation-20261025` | [`c5d17f4ee904`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c5d17f4ee9041ae59f03691585a1ea60b1c06d9f) | Divergente: 4 exclusivos / 786 atrás | Pode ser removida após preservar este registro; não fazer cherry-pick |

Quatro commits exclusivos de header, identificados em [auditoria original](../P1_INVESTIGACAO_HIGIENE_2026-10-28.md): [`62230b6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/62230b6a4e5ec6f01ba5cd6bc0d7d3e34e506b14), [`d12baba`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d12babad9a0049a35db95be98407927fc39dc201), [`a60f106`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/a60f10649c968f9cdc21add4b41e73c1f090d07b) e [`c5d17f4`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c5d17f4ee9041ae59f03691585a1ea60b1c06d9f). Os recursos relevantes foram evoluídos na `main`; não reintegrar esses commits automaticamente. Os arquivos atuais de docs têm os caminhos antigos preservados como apontadores para o histórico.

## Verificação pós-exclusão — CONCLUÍDA

- `main`: **única branch existente**, SHA `603fe3aafe9e883ce73ecb461d02b8e67830acf6` na conferência desta Etapa 05.
- `fix/p3-motion-units-20261024`: **removida**.
- `fix/header-hero-section-navigation-20261025`: **removida**.
- Nenhum merge, cherry-pick, force-push ou alteração de conteúdo do site acompanhou a limpeza; commits exclusivos anteriores permanecem documentados acima, mas links não garantem retenção permanente de objetos não referenciados.
- **Não há ação manual pendente de branches**. [Termo de encerramento](ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md).
