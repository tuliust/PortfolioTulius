# Bloco 2 — Checklist vigente P4, P5 e P6

**Data de início:** 02/11/2026. **Situação:** planejamento e proteção preparatória iniciados. **Nenhuma aprovação de infraestrutura ou de escrita foi presumida.** O [Bloco 1](CHECKLIST_BLOCO_1_P1_P2_P3_2026-11-02.md) permanece **parcial** (pendentes homologações editoriais e meta LCP).

## P4 — Staging isolado e ensaios transacionais

- [x] Identificar o workflow existente `p2-transactional-staging.yml`, disponível só por `workflow_dispatch`, e seu executor com guardas contra produção.
- [x] Preparar fixtures com dados fictícios sem copiar `supabase/seed.sql`, que contém material editorial.
- [x] Criar função única de validação de destino `scripts/p2-stage-destination.mjs` e preflight executado antes de instalar dependências.
- [x] Executar **5/5 testes offline** da guarda, incluindo ref de produção conhecido, URL sem HTTPS, host divergente e frase de autorização; [CI](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41514624001).
- [x] **Escolha autorizada:** Supabase CLI + Docker **local isolado**, sem criar segundo projeto Supabase na nuvem. [Procedimento seguro](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md).
- [x] Preparar `supabase/config.toml` com seed **somente sintético** e script de validação de URL local `127.0.0.1:54321`; nenhuma cópia de produção.
- [ ] Verificar a execução **real** do stack local e a aplicação das migrations antes de qualquer teste transacional; este ambiente não tem Docker/CLI.
- [ ] Iniciar stack **local** em Docker, aplicar as migrations/buckets e preparar contas admin/não admin **fictícias**. Usar somente chaves localhost, nunca secrets Vercel/GitHub ou Supabase cloud.
- [ ] Validar publicação e rollback de páginas, seções, placements, blocos, mídia privada e pública, revisão e restauração, com log e limpeza.
- [ ] Executar testes negativos com JWT de usuário comum/anônimo, verificar que RPCs privilegiadas não permitem ações proibidas.
- [ ] Reexecutar limpeza e confirmar ausência de resíduos, deixando evidência transacional real.
- [ ] Autorizar uso posterior de correções no CMS real **separadamente**. Sem operações automáticas em produção.

## P5 — Integração editorial e fotografia

- [x] Identificar os 26 blocos manuais e as **nove projeções estruturadas candidatas**, com **139 diferenças brutas**; [matriz P1](BLOCO_1_P1_COMPARACAO_ATRIBUTOS_2026-11-02.md).
- [x] Preparar modo opcional protegido de Formação/A, com três nomes institucionais completos e períodos preservados; teste P5 read-only **7/7** [aqui](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41404376390).
- [x] Registrar escopo uniforme dos seis grupos adicionais de dados para as seis experiências e confirmação das três fotos de depoimentos.
- [ ] Revisar visualmente o modo de Formação/A em desktop/mobile e aprovar a composição definitiva; **aprovação de campos não é autorização de publicar**.
- [ ] Desenhar e validar adaptador para Formação/A que **preserve `meta`**, garantindo comportamento da coleção após novas edições; sem vínculo até aceite.
- [ ] Revisar individualmente cada diferença dos 25 demais blocos antes de qualquer sincronização; 17 não têm fonte integral adequada.
- [ ] Aprovar por experiência empresa, cargo, localização, período, projetos e associação de logos/galerias; preservar 19 slides e estados ocultos.
- [ ] Aprovar inclusão no catálogo e associação por ID dos três retratos, sem substituir imagens existentes.
- [ ] Publicar **somente** blocos autorizados, testando renderização, acessibilidade, mobile e possibilidade de restaurar versão anterior.

## P6 — SEO automático e hardening

- [x] Manter plano de trigger seguro pós-publicação, com credenciais de deploy exclusivas do servidor; nenhum webhook instalado.
- [x] Reconsultar Advisors de segurança/performance em 02/11/2026: **6 alertas RPC `SECURITY DEFINER` para authenticated**, proteção contra senhas vazadas desativada, **19 políticas SELECT permissivas sobrepostas** e **9 índices não usados**. São alertas a analisar, não alterações autorizadas.
- [ ] Aprovar opção de acionamento do deploy SEO (servidor/provedor/segredo) com autenticação admin, rate-limit, deduplicação e auditoria.
- [ ] Testar publicação de SEO **apenas em staging**: rascunho não dispara, salvar publicado dispara uma vez, falha exibe erro e permite retentativa; comparar oito metatags estáticas.
- [ ] Ativar gatilho de deploy SEO em produção somente após aceite e rollback documentado.
- [ ] Auditar `SECURITY DEFINER`, `search_path` e grants com testes negativos usando identidades isoladas; não remover permissões usadas pelo CMS sem alternativa.
- [ ] Avaliar proteção contra senha vazada, RLS e índices com testes, orçamento de risco e rollback; mudanças em Auth/RLS/DDL exigem aprovação **individual**.
- [ ] Encaminhar testes de teclado, leitores de tela e zoom à vistoria humana.

**Referências oficiais de segurança:** [RPCs definer](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [senhas vazadas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection), [políticas permissivas](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies) e [índices](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).

## Portões de autorização

**Antes de staging com escritas:** usar **somente Docker/CLI local** (seleção aprovada), confirmar isolamento por loopback, migrations, seed fictício e contas de teste. Nenhuma escrita na produção; o workflow cloud antigo não se aplica.

**Antes de publicação editorial:** aprovar composição/valores de cada bloco e teste responsivo. O proprietário já autorizou o **escopo**, não valores divergentes ou a ligação das mídias.

**Antes de SEO e segurança em produção:** aprovar integração, credenciais, política de publicação e alterações por objeto, com rollback.

**Próximo passo executável sem novo aceite:** continuar auditorias somente de leitura, automação de testes offline e comparação de campos sem alterar conteúdo.

## Nova decisão para qualidade — 02/11/2026

A meta oficial de LCP mobile passou a **≤ 3,5 s**, com mediana de três amostras Lighthouse. Última mediana registrada: **3,314 s**, atendida naquele ensaio; revalidar por versão. [Decisão vigente](DECISOES_LCP_3_5_STAGING_LOCAL_2026-11-02.md).
