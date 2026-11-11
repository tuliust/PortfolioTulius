# P2 — homologação transacional em ambiente isolado

**Preparação:** 28/10/2026 · **Status:** infraestrutura de teste preparada, execução transacional ainda pendente.

## Decisão do proprietário — 28/10/2026: custo NÃO aprovado

A cotação recebida para uma branch de homologação na organização do projeto `portfolio` foi **US$ 0,01344 por hora**, além de eventuais valores de consumo. **O proprietário decidiu não aprovar custos neste momento.** Nenhum custo foi confirmado, nenhuma branch foi criada e nenhum teste transacional foi executado.

**Status vinculante: P2 transacional SUSPENSO, por decisão do proprietário.** O workflow abaixo é apenas uma preparação técnica. **Não executar**, não criar/provisionar ambiente pago, não cadastrar usuários de teste, não configurar Secrets de staging e não tentar testes de escrita na produção como alternativa. **Não há data prevista para retomar.**

**Condições para reabertura:** pedido explícito do proprietário; revisão da cotação ou oferta de ambiente isolado já existente e autorizado; aprovação específica de qualquer cobrança; validação de schema/policies e contas JWT; plano de reversão/limpeza. P5 de leitura, já aprovado, não precisa ser refeito. [Índice operacional](ESTADO_ATUAL_VIGENTE.md).

## Situação do ambiente

A consulta Supabase retornou **zero branches de homologação** do projeto portfolio. A tentativa de criar uma branch foi bloqueada pelo requisito de **confirmação de custo**; nenhum recurso, objeto ou dado foi criado. Não substituir a produção por homologação sem autorização expressa.

Supabase Branching cria ambientes separados, mas **não copia dados ou usuários Auth por padrão**. É necessário configurar as contas de teste e os buckets de forma exclusiva no staging. Atenção: o remoto tem sete migrations incrementais, enquanto a baseline de schema no GitHub **não consta no histórico de migrations**. A equivalência das 22 tabelas deverá ser comprovada na branch antes da execução; **não reaplicar a baseline na produção**.

Documentação: https://supabase.com/docs/guides/deployment/branching

## Suíte preparada no GitHub

- Workflow manual: [P2 Transactional Staging](../.github/workflows/p2-transactional-staging.yml)
- Script: [p2-transactional-staging.mjs](../scripts/p2-transactional-staging.mjs)

A suíte exige ref específico do staging, URL HTTPS correspondente ao ref, dois JWTs reais emitidos por Supabase Auth (admin e não admin) e confirmação textual de isolamento. O ref da produção `zfnrhzplwpjpdljraypt` é bloqueado **antes da primeira gravação**.

**Secrets para configurar somente em GitHub Actions:** `P2_STAGE_URL`, `P2_STAGE_PUBLISHABLE_KEY`, `P2_STAGE_ADMIN_EMAIL`, `P2_STAGE_ADMIN_PASSWORD`, `P2_STAGE_NONADMIN_EMAIL` e `P2_STAGE_NONADMIN_PASSWORD`. Não registrar valores no chat, documentação ou logs.

O teste cria página/ seção/ bloco de **fixture**, grava com a RPC administrativa `save_content_block_atomic`, valida negação real para não administrador, publica, confere leitura anônima, despublica e restaura o JSON original pela API. No Storage testa upload e download privado (SHA-256), rejeição para JWT não admin, promoção pública e download anônimo, com exclusão restrita ao path temporário.

**Cleanup:** a suíte remove somente página, mídia e arquivos próprios usando um UUID único; reporta erro e falha se não conseguir limpar. Não exclui os dois PNGs privados de produção nem registros reais. A restauração operacional por RPC **não equivale** a funcionalidade de rollback visual implementada no CMS.

## Para executar de verdade

1. Escolher a organização Supabase e aprovar o custo de uma branch ou disponibilizar projeto isolado já existente.
2. Validar o schema, políticas, buckets e migrations no staging; preparar usuários de teste dedicados.
3. Configurar os seis Secrets do staging no GitHub e disparar manualmente o workflow na `main` com a confirmação `CONFIRMO-HOMOLOGACAO-ISOLADA`.
4. Registrar logs/resultado e comprovar zero resíduos. A homologação **pela interface visual** exigirá etapa adicional em navegador no staging.

**Não executado:** nenhuma transferência binária nem CRUD persistente foi feito nesta sessão, por ausência de staging autorizado. P5 read-only de produção segue aprovado.
