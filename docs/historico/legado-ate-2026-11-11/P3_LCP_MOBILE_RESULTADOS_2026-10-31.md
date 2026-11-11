# PortfolioTulius — Resultado das intervenções P3 no LCP mobile

## Adendo de continuidade — medição posterior no último SHA funcional (31/10/2026)

**A medição original deste relatório permanece válida para `9f5b6285`, mas NÃO é a medição mais recente.** Após a reformulação mobile de Perfil, Olá!, Resultados, Formação, Ferramentas e Experiências, o código `aa71737e` teve [CI #41246204902](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204902) **success** e [auditoria P3 #41246204897](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204897) **failure** geral por quatro verificações já existentes do layout de Contato.

- **LCP Lighthouse mobile simulado:** 3.285,321 ms; 3.491,881 ms; 3.493,745 ms — **mediana 3.491,881 ms (~3,492 s)**.
- **DevTools aplicado:** 2.323,998 ms — **amostra única diagnóstica**, não mediana validada.
- **P6 interno:** critério operacional mobile configurado passou, mas **não** significa que a meta de LCP ≤2.500 ms foi cumprida.
- **P4:** 38 capturas (13 desktop e 25 mobile), zero falhas na verificação automatizada; **P5 público:** 3/3 read-only sem mutações.
- **P3-PERF-01:** **ABERTA**; p75 de campo não coletado. Os resultados dos diferentes métodos não são intercambiáveis.

O histórico de experimentos e medições anteriores está mantido abaixo, com seus SHAs originais. [Estado atual](ESTADO_ATUAL_VIGENTE.md) · [Pendências](OPEN_ISSUES.md).

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

**Data:** 31/10/2026  
**Site:** https://tulius.work/  
**Repositório:** `tuliustsangaropulos/PortfolioTulius`  
**SHA funcional final auditado:** [`9f5b6285a236a0017571cb28233ed886b566b789`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/9f5b6285a236a0017571cb28233ed886b566b789)  
**CI:** [Validate #41235675486](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41235675486) — **success**  
**P3:** [Audit P3 #41235675503](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41235675503) — **success**  
**Situação da meta:** **LCP mobile ≤2,5 s ainda não comprovado** no Lighthouse simulado nem no percentil 75 de usuários reais. Um teste DevTools com limitação aplicada ficou abaixo de 2,5 s; isoladamente, ele não valida o objetivo.

## 1. Alterações efetivas

1. **Perfil desacoplado da composição integral:** `src/hooks/usePortfolio.ts` lê primeiro a seção `perfil` do PostgREST, com `content_blocks`, `section_panels` e `block_placements` vinculados pelas relações existentes. Aplica os filtros `status=published`, `is_visible=true` e as regras RLS públicas existentes. Renderiza a primeira dobra real antes de buscar e compor as demais seções. Em caso de falha, o grafo completo continua sendo consultado; não exibe conteúdo inventado ou fallback editorial obsoleto quando o CMS está configurado.
2. **Prefetch real desde o HTML:** `index.html` inicia a mesma consulta ao CMS assim que o documento começa a ser interpretado, antes da execução do React. A resposta é reutilizada pelo hook; não há uma segunda consulta ao Perfil no caminho normal. A chamada ocorre somente na rota pública `/`; não é gerado HTML estático com conteúdo editorial ou chave secreta. As credenciais usadas são exclusivamente variáveis publicáveis do Vite, já próprias do cliente público.
3. **JavaScript menos pesado:** `defaultTokens` foi isolado em `src/content/defaultTokens.ts`; o catálogo editorial local de fallback só é importado dinamicamente quando o Supabase público não está configurado. O modo offline de desenvolvimento é preservado e a produção continua usando exclusivamente o CMS publicado.
4. **Instrumentação verificável:** marcas `p3:profile-bootstrap-start`, `p3:profile-bootstrap-ready`, `p3:profile-cms-ready` e `p3:profile-dom-committed` comprovam a ordem. O registro do primeiro DOM/imagem não é sobrescrito quando o portfólio inteiro chega. `scripts/p3-browser-smoke.mjs` exige que o Perfil real apareça antes do grafo completo.

**Arquivos funcionais envolvidos:** `index.html`, `src/hooks/usePortfolio.ts`, `src/components/public/PublicSite.tsx`, `src/content/defaultTokens.ts`, `src/content/fallback.ts` e `scripts/p3-browser-smoke.mjs`. Sem alterações de SQL, schema, migrations, políticas RLS, Auth, Storage, recursos Vercel, fotografias, textos publicados, fontes ou CSS.

## 2. Métricas antes e depois

Todas as amostras são laboratório Lighthouse 13.5.0. O método **simulado** projeta a limitação de rede/CPU; o método **DevTools** aplica a limitação durante a navegação. Não são escalas intercambiáveis. As execuções ocorreram em runners compartilhados e não constituem um experimento estatisticamente controlado.

| Etapa | SHA auditado | LCP mobile simulado, mediana de 3 | LCP aplicado DevTools, 1 execução | Auditoria |
|---|---|---:|---:|---|
| Referência anterior | `3f7d3d0` | **3.942,5 ms** | **3.148,0 ms** | [P3 #41208081753](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41208081753), PASS |
| Leitura prioritária do Perfil + marcas corrigidas | `9eedb3e` | **3.797,7 ms** | **2.935,5 ms** | [P3 #41235065064](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41235065064), PASS |
| Fallback editorial fora do bundle inicial | `87a7a75` (formatação em `ec26319`) | **3.576,8 ms** | **2.878,3 ms** | [P3 #41235359942](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41235359942), PASS |
| Prefetch live do Perfil no HTML | `9f5b628` | **3.363,5 ms** | **2.272,4 ms** | [P3 #41235675503](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41235675503), PASS |

A mediana simulada final inclui amostras individuais **4.212,5 / 3.338,2 / 3.363,5 ms**; a variabilidade impede usar apenas a melhor amostra como prova de meta. A comparação entre as duas referências escolhidas resulta em **−579,0 ms** na mediana simulada e **−875,6 ms** nas duas capturas únicas aplicadas, sem inferência causal ou estatística robusta.

**Objetivo restante:** faltam **863,5 ms** para que a **mediana simulada** final alcance 2.500 ms. A captura aplicada final ficou **227,6 ms abaixo** do limite, mas foi apenas **uma** execução. O p75 real mobile não foi medido; portanto nenhuma dessas métricas comprova Web Vitals de campo.

### Medição de caminho crítico no navegador sem limitação

Na auditoria do SHA final:
- `p3:profile-bootstrap-start`: **50 ms**;
- `p3:profile-bootstrap-ready`: **150 ms**;
- `p3:profile-cms-ready`: **156 ms**;
- `p3:profile-dom-committed`: **168 ms**;
- `p3:portfolio-primary-ready`: **364 ms**.

A ordem comprova que o Perfil publicado já está no DOM antes da conclusão das demais seções. Esses tempos observados em rede rápida **não** são substitutos do LCP simulado de 3,364 s nem do LCP DevTools de 2,272 s.

### JavaScript do bundle

O entrypoint Vite caiu de aproximadamente **80,33 kB minificados / 22,55 kB gzip** (etapa anterior) para **61,28 kB minificados / 18,51 kB gzip** no CI final: economia de aproximadamente **19,05 kB minificados / 4,04 kB gzip**. O grupo React/vendor permanece aproximadamente **189,63 kB minificados / 59,64 kB gzip**. O CSS público/administrativo permanece cerca de **102,57 kB minificados / 20,78 kB gzip**, não alterado.

## 3. Integridade verificada

- [CI #41235675486](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41235675486): formatação, TypeScript, testes Vitest, build, smoke offline e sintaxe das suítes aprovados.
- [P3 #41235675503](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41235675503): `P3_BROWSER_AUDIT {"failures":0}`, rotas `/admin` e `/admin/preview` anônimas protegidas, e `P5_PUBLIC_RESULT {"passed":3,"expected":3,"mutations":0}`.
- `P4_EDITORIAL_SUMMARY {"captures":38,"desktop":13,"mobile":25,"failures":0}`. As capturas e relatórios estão nos **artifacts** anexos ao run P3. Isso é aprovação dos gates automatizados existentes, **não** uma aprovação humana nem um comparador pixel a pixel das 38 imagens.
- `P6_LCP_CONTENT_GATE`: o retrato CMS aprovado continuou como LCP no mobile e no desktop. SEO e navegação passaram os gates P3 existentes.
- O workflow P3 confirmou o SHA de produção efetivamente servido antes de atribuir as métricas. A Vercel marcou o SHA funcional como `success`.

Os testes de escrita autenticada P2 continuam suspensos por decisão prévia; não foram realizados uploads, edições reais, gravações ou alterações de infraestrutura.

## 4. CSS, fontes e prerenderização/SSR

O caminho CSS/fontes continua um possível limitador do FCP/LCP: folha principal pública + administrativa compartilhada, Google Fonts bloqueante e duas fontes remotas. A auditoria de causa-raiz registrou um episódio isolado de CLS **0,117** após carregamento de Big Shoulders Display. Não foi alterado `font-display`, tamanho ou família para evitar mudança de layout/tipografia sem medição visual específica. As análises anteriores mostraram oportunidade de FCP, **não** economia de LCP comprovada apenas por carregar fontes assincronamente. As intervenções nesta rodada priorizaram dados/JS, com CSS e fotografia preservados.

Prerender/SSG baseado em snapshot do CMS **não** é uma solução aceitável sem invalidação confiável ao publicar, atualizar ou despublicar. Adotar webhook, gatilho editorial, renderização server-side ou configuração de hospedagem exigiria desenho de atualização e autorização específica de infraestrutura, **não concedida nesta rodada**. Nada disso foi implantado.

## 5. Critérios ainda abertos

**P3-PERF-01 permanece aberto.** Para aceitar ≤2,5 s sem ressalvas, é necessário medir novamente em condições controladas e **sequenciais**, preferencialmente ao menos cinco amostras mobile em cada método (simulado e aplicado), conferir todos os gates visuais e nenhuma regressão de CLS/SEO/admin, e coletar p75 real por CrUX/RUM válido quando houver amostragem e consentimento. O P3 automatizado atual repete três vezes o método simulado e uma vez o método aplicado; seu gate conservador de regressão de **6.500 ms** não valida a meta de **2.500 ms**.

**Conclusão:** a dependência arquitetural do Perfil ao CMS completo foi removida e verificada, com menor bundle inicial e uma leitura pública iniciada antes do React. Houve melhora laboratorial, e uma medição aplicada ficou abaixo de 2,5 s, porém a mediana simulada continua acima do limite e não existem dados de campo suficientes para declarar o objetivo alcançado.
