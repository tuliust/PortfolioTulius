# Referências de branches antigas — corte 11/11/2026

**Status:** análise técnica concluída; **exclusão remota não executada** (o conector GitHub disponível só permite leitura e atualização de refs, não a operação DELETE de branch). Registro para permitir limpeza manual sem perda da decisão e dos SHAs.

## Branches conservadas

| Branch | SHA antes da limpeza | Relação com `main` na auditoria | Decisão |
|---|---|---|---|
| `main` | [`c4bc83ced8fd94e78d44fef5de5f0a58df5065be`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c4bc83ced8fd94e78d44fef5de5f0a58df5065be) | Publicação principal | Preservar; nunca excluir |
| `fix/p3-motion-units-20261024` | [`909badf42a95`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/909badf42a95d2a4a84bdb77a0129811c9e952db) | Ancestral, 0 commits exclusivos / 842 atrás da `main` da auditoria | Pode ser removida |
| `fix/header-hero-section-navigation-20261025` | [`c5d17f4ee904`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c5d17f4ee9041ae59f03691585a1ea60b1c06d9f) | Divergente: 4 exclusivos / 786 atrás | Pode ser removida após preservar este registro; não fazer cherry-pick |

Quatro commits exclusivos de header, identificados em [auditoria original](../P1_INVESTIGACAO_HIGIENE_2026-10-28.md): [`62230b6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/62230b6a4e5ec6f01ba5cd6bc0d7d3e34e506b14), [`d12baba`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d12babad9a0049a35db95be98407927fc39dc201), [`a60f106`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/a60f10649c968f9cdc21add4b41e73c1f090d07b) e [`c5d17f4`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c5d17f4ee9041ae59f03691585a1ea60b1c06d9f). Os recursos relevantes foram evoluídos na `main`; não reintegrar esses commits automaticamente. Os arquivos atuais de docs têm os caminhos antigos preservados como apontadores para o histórico.

## Única ação manual de limpeza restante

No [painel **Branches** do GitHub](https://github.com/tuliustsangaropulos/PortfolioTulius/branches), excluir **somente**:

1. `fix/p3-motion-units-20261024`;
2. `fix/header-hero-section-navigation-20261025`.

GitHub: selecionar branch → ícone de exclusão (**Delete branch**) → confirmar. Verificar depois que apenas `main` permanece. **Não excluir a `main`, reescrever histórico ou criar PR.** Se desejar conservar independentemente os quatro commits exclusivos após a exclusão, fazer mirror/backup privado do Git antes; links de commits não garantem retenção indefinida de objetos não referenciados.

**Ação em standby, não bloqueia site:** o projeto está concluído e o serviço de publicação não depende das branches antigas. [Fonte operacional](../README.md) · [baseline](../historico/preconsolidacao-2026-11-11/ESTADO_PRE_CONSOLIDACAO.md).
