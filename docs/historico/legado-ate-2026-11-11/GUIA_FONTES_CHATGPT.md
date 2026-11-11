# Guia de fontes GitHub / ChatGPT — PortfolioTulius

**Revisado em 05/11/2026.** O objetivo é impedir que snapshots anteriores passem a ser tratados como estado atual. A versão detalhada anterior está [preservada](historico/GUIA_FONTES_CHATGPT_ANTES_REORGANIZACAO_2026-11-05.md). **Nenhuma fonte privada do ChatGPT foi enviada ou substituída no GitHub.**

## Ordem de precedência para decisões

1. **Requisitos expressos no pedido mais recente** do proprietário, inclusive o de **não modificar a aparência atual do site**.
2. **Código funcional efetivo** da branch [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), comparado ao SHA realmente servido no domínio e aos registros do Supabase quando a tarefa envolver dados.
3. **Testes que rodaram naquele SHA**: [CI Validate](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/validate.yml), [P3 Lighthouse](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/audit-p3-lighthouse.yml), documentação de aceites manuais e inspeções físicas quando realizadas.
4. **Contratos operacionais curtos**: [Estado](ESTADO_ATUAL_VIGENTE.md), [CMS](ADMIN_CMS.md), [responsividade](RESPONSIVE_LAYOUT.md), [deploy](DEPLOYMENT.md) e [pendências técnicas](OPEN_ISSUES.md).
5. **Registros cronológicos**: [auditoria dos pedidos de 05/11](AUDITORIA_PEDIDOS_CHAT_2026-11-05.md), [reconciliação acumulada](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md) e [arquivo histórico](historico/README.md), válidos somente nas datas/SHAs documentados.
6. **Especificações originais**: [`guidelines.md`](../guidelines.md) (22/10) e [plano inicial](../plans/auditoria-portfolio-tulius.md) (23/10), úteis para contexto, **não** descrições do CMS atual.

## Snapshot funcional antes desta revisão

- [Commit `79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2), [CI #42020574434 success](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434); Vercel Production READY e domínio servindo o mesmo SHA na consulta.
- [P3 #42020342275](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275) em **`0873eeff`**, **failure global**. Não há P3 própria localizada em `79aa3c07`.
- A reorganização documental cria commits posteriores, **sem alterar o baseline funcional**. Sempre consultar a branch antes de afirmar “último commit”.

## Preservação e sigilo

Os anexos de continuidade, backups privados e outras Fontes do **projeto ChatGPT** não são publicáveis no GitHub. As Fontes de produto/design e de memória operacional somente podem ser atualizadas dentro do ambiente privado apropriado, mediante autorização. Não copiar dados pessoais, credenciais, tokens, chaves nem versões de arquivos privados para Markdown público.

Ao reestruturar documentos, arquivar a íntegra e corrigir links relativos; manter decisões, contagens, aceites humanos e resultados de CI **com seus SHAs e datas**. CI verde não comprova gravações administrativas nem performance em campo.

