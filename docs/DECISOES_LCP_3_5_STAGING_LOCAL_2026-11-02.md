# Decisão operacional vigente — LCP 3,5 s e Supabase exclusivamente local

**Vigência:** 02/11/2026. Escolhas explicitamente feitas pelo proprietário. Esta decisão substitui referências operacionais anteriores à meta de LCP mobile ≤2,5 s; medições históricas devem permanecer registradas como evidência, sem reescrever datas ou números.

## Nova meta para LCP mobile

- **Limite de aceite:** LCP mobile ≤ **3,5 segundos** (**3.500 ms**).
- **Método vigente de laboratório:** mediana de **três execuções Lighthouse mobile comparáveis**. Uma única amostra boa não prova atendimento repetível.
- **Última mediana registrada na auditoria anterior:** **3,314 s**, inferior ao novo limite. A meta passou no *ensaio registrado*, sem demonstrar melhora causal; o p75 real de campo **não** está comprovado.
- **Gate automatizado:** `scripts/p6-lighthouse-guard.mjs` passa a usar `mobile.lcpMs = 3500`. A meta mobile não altera o limite desktop, categorias de acessibilidade, SEO, CLS ou a identificação da fotografia do Perfil como LCP.
- **Proteção:** não mudar tipografia, conteúdo editorial, imagens, enquadramento, layout ou animações apenas para baixar uma pontuação. Se futuras medições comparáveis excederem 3.500 ms, a meta volta a ficar aberta para essa versão.

## Staging escolhido

- **Ambiente:** Supabase CLI + Docker **local**, esquema reproduzido pelas migrations versionadas e apenas dados fictícios.
- **Sem projeto cloud adicional**, sem custo de um segundo projeto Supabase e sem migração/sincronização de dados de produção.
- **Configuração:** `supabase/config.toml` fixa o seed exclusivamente em `seed.local.synthetic.sql`; o histórico `supabase/seed.sql` nunca será usado na homologação local.
- **Conexão permitida pelo smoke local:** `http://127.0.0.1:54321/` com chave anon **gerada localmente**.
- **Situação:** arquivos e verificações offline preparados; Docker e CLI indisponíveis no ambiente de execução desta conversa, portanto contêineres e testes transacionais locais ainda **não foram executados**.

**Guia de execução:** [Supabase local isolado](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md). [Checklist Bloco 1](CHECKLIST_BLOCO_1_P1_P2_P3_2026-11-02.md) · [Bloco 2](CHECKLIST_BLOCO_2_P4_P5_P6_2026-11-02.md).
