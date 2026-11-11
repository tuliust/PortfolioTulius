# P3 — Fechamento técnico e pendências de homologação

Data: **25/10/2026** · **Estado: validação técnica automatizada aprovada**, com aceites manuais discriminados abaixo. · Projeto: **PortfolioTulius** · Branch única: **`main`** · Site: **https://tulius.work/**.

## Decisão de escopo e integridade

P3 executada como estabilização, segurança, validação funcional não destrutiva, Lighthouse, regressão e documentação. **Não equivale a homologação de escrita com credenciais administrativas**, comparação visual humana com Figma/PDF ou aprovação editorial. Essas etapas exigem contexto autorizado que não deve ser fabricado. Não foram criados usuários, modificados textos editoriais, feitos uploads reais, alterados DNS nem reaplicada a baseline.

## P3.1 — Segurança

- Supabase: 22/22 tabelas públicas com RLS habilitado; Auth com **1 administrador, 0 outros usuários**; buckets `portfolio-public` (público) e `portfolio-private` (privado), ambos sem objetos na revisão.
- Executada a migration `20261025203559_p3_revoke_excess_table_privileges` (arquivo versionado em `supabase/migrations/`). `TRUNCATE/TRIGGER/REFERENCES` revogados de `anon` e `authenticated` nas 22 tabelas, mantendo DML sob RLS. Estado conferido após a aplicação: 14 seções, 28 blocos, 9 pendências editoriais e 1 administrador.
- Teste simulado do papel `authenticated` com claim de usuário não cadastrado em transação `READ ONLY`: acesso a 14 seções publicadas, zero a administradores e pendências. **6 de 6 RPCs administrativas retornaram `portfolio_admin_required`**, com transação revertida. Teste simulado do administrador existente: acesso a um vínculo, 9 pendências e 14 seções.
- **Limites:** testes SQL com claim simulada não substituem JWT real/Storage E2E. Security Advisor mantém 6 alertas de RPC `SECURITY DEFINER` por desenho intencional com guarda administrativa explícita. `Leaked Password Protection` está desativada e depende de configuração Auth manual. Inventário de grants já corrigido; a avaliação de 9 índices FK e políticas RLS não otimizadas fica para ciclo de performance de banco, sem urgência provada pela carga atual.
- Histórico remoto de migrations não relaciona a baseline inicial `202610220001_portfolio_cms.sql`, apesar do schema instalado. Não a executar novamente.

## P3.2 — CMS

- Homologação informada pelo proprietário: login administrativo, navegação dos módulos, prévia protegida e logout aprovados. `/admin` e `/admin/preview` sem autenticação foram redirecionados para `/admin/login` em navegador automatizado.
- Corrigido o dashboard: quantidade de seções e pendências editoriais com consulta dinâmica, estado real do Supabase e mensagem de erro atualizada. Tratamento de erro no guard agora nega acesso se a verificação falhar.
- **Não executado:** operações de salvar/duplicar/arquivar/publicar/rollback, upload e substituição de mídia, checagem E2E com sessão administrativa JWT real; são operações persistentes em produção, e não há credenciais da sessão via integração. Homologar em cenário reversível, com snapshot e limpeza.
- SEO do CMS pode variar dinamicamente no banco, mas metadados HTML são gerados no build da Vercel. Mudanças editoriais de SEO exigem novo deployment para refletir no HTML publicado.

## P3.3 — UI, responsividade e acessibilidade

- Auditoria automatizada via `scripts/p3-browser-smoke.mjs` e workflow `.github/workflows/audit-p3-lighthouse.yml`: 14 seções e 28 painéis, desktop 1920×1080/1440×900/1366×768, mobile 390×844/360×800/320×700, além de 768×1024 e 720×450 para inspeção de tela estreita. O teste de 720 CSS px **não é** equivalente perfeito a zoom nativo de 200%.
- Menu testado por teclado: Escape fecha, foco retorna ao botão; `prefers-reduced-motion` detectado. Capturas de tela anexadas como artifact nos runs, com retenção de sete dias.
- Corrigidos nomes acessíveis, semântica de SVG, heading order, contrastes e overflow de contatos mobile; Lighthouse atingiu **100/100 em acessibilidade** nos perfis mobile e desktop.
- **Resultado automatizado final (run 40232589301): 8/8 viewports passaram, sem overflow horizontal inclusive em 768×1024;** menus, Escape, foco e movimento reduzido aprovados. Pendente somente confronto visual humano com a referência, zoom nativo de 200% e leitores de tela reais.

## P3.4 — Lighthouse e SEO

- Lighthouse 13.5.0 em produção: **100/100 em acessibilidade, boas práticas e SEO** em mobile e desktop. Na auditoria final (run 40232589301), Performance **80 mobile / 98 desktop**, LCP **4,10 s mobile / 1,09 s desktop**, TBT **228 ms mobile / 0 desktop**, CLS praticamente zero. Scores mobile oscilaram entre aproximadamente 60 e 84 durante a série; manter otimização de LCP mobile como backlog, sem confundir laboratório com dados de campo.
- Canonical, títulos, robots e sitemap verificados. A rota exata `/admin`, além de `/admin/*`, recebe agora cabeçalho `X-Robots-Tag: noindex`; `robots.txt` também cobre as duas formas.
- Core Web Vitals de campo e INP real não foram medidos; Lighthouse não substitui dados de usuários. Os scores variam com rede/CPU no runner.

## P3.5 — Regressão e CI

- `.github/workflows/validate.yml`: `pnpm format:check`, `pnpm typecheck`, `pnpm test` (**21 testes**) e `pnpm build`, mais `pnpm smoke:build`.
- `.github/workflows/audit-p3-lighthouse.yml`: `node scripts/smoke-production.mjs`, Lighthouse mobile/desktop, rotas anônimas, menu/foco/motion e matriz de viewports, screenshots como artifact.
- Última auditoria completa de UI/Lighthouse aprovada: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40232589301. Última validação funcional (código/tablet) aprovada: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40232589360. Em cada commit, checar conclusão de ambos os workflows e estado READY da Vercel. `main` é a única branch de trabalho; não fazer force push.

## P3.6 — Fechamento e aceites remanescentes

**Concluível tecnicamente:** código/CI, isolamento SQL simulado, restrição de grants e SEO, métricas Lighthouse e diagnóstico automatizado de viewport; documentação presente.

**Decisão registrada do proprietário:** a proteção contra senhas vazadas ficará desativada porque exige upgrade de plano; custo recusado e risco residual aceito. Não é pendência. Os demais aceites de CRUD/publicação/Storage, revisão visual e itens editoriais descritos neste documento são históricos e devem ser conferidos contra o estado vigente antes de retomada. Performance e otimizações de banco permanecem ressalvas distintas.

## Referências reprodutíveis

- Repositório: https://github.com/tuliustsangaropulos/PortfolioTulius
- CI: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/validate.yml
- Auditoria: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/audit-p3-lighthouse.yml
- Supabase Security Advisor: https://supabase.com/docs/guides/database/database-linter
- Referência da decisão aceita sobre proteção contra senhas vazadas: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

Para reproduzir localmente (PowerShell, sem ler segredos):

```powershell
git pull --ff-only origin main
pnpm.cmd check
pnpm.cmd smoke:build
pnpm.cmd smoke:prod
git status -sb
```

## Complemento P5 antecipada — 25/10/2026: homologação transacional sem persistência

**Escopo validado:** sessão PostgreSQL com role `authenticated` e UID administrativo simulado via claim SQL, transação explícita `BEGIN; ... ROLLBACK;`. Não houve JWT emitido pelo Supabase Auth nem sessão administrativa real no navegador. Todos os fixtures temporários foram descartados.

- `create_section_with_panels`: seção de teste e 3 painéis; **PASS**.
- `save_content_block_atomic`: bloco `rich_text` atualizado e placements desktop/mobile-a; **PASS**.
- `publish_section`: publicação de seção e bloco sem placeholders; **PASS**.
- `duplicate_section`: cópia em draft de seção, 3 painéis, 1 bloco e 2 placements; **PASS**.
- `swap_section_order`: troca das duas seções de teste sem colisão de unicidade; **PASS**.
- Publicação de seção de teste com placeholder: rejeitada com `section_contains_placeholders`; **PASS**.
- `save_home_seo_atomic`: alteração temporária lida dentro da transação; **PASS**.
- `content_revisions` e `audit_logs`: ambos cresceram durante a transação por trigger; **PASS**.
- `storage.objects`: duas linhas de metadados criadas somente na transação, leitura pública restrita a `portfolio-public`; não admin não leu privado nem conseguiu inserir em privado; **PASS para RLS de metadados**. Não comprova upload/download binário.
- Após `ROLLBACK`: 14 seções, 42 painéis, 28 blocos, 56 placements, zero `media_assets`, zero objetos nos buckets e zero slugs/SEO de teste remanescentes. As 2 revisões e 2 linhas de auditoria presentes datam de 24/10/2026, anteriores ao teste; não foram produzidas persistentemente pelo ensaio.

**Impedimentos para homologação E2E completa:** credenciais/sessão reais do administrador não estão disponíveis por esta integração; upload de arquivo real, publicação seguida de prévia pública, exclusão/substituição de mídia e restauração por revisão exigem processo controlado. O rollback SQL dos fixtures não é o mesmo que a função editorial de restauração de revisões.

## Segurança prioritária — token exposto e proteção de senhas

- O arquivo `plans/auditoria-portfolio-tulius.md` continha um PAT Supabase em texto claro no GitHub público. Removido da **versão atual da main** no commit `cd61f6004c25e0480e7baf593823d7c7b2c6fe2d`. Busca de código atual por prefixo `sbp_` retornou zero resultados. **Token ainda pode ser recuperado do histórico Git, forks ou caches. Revogação não realizada nem verificada**: a integração disponível não gerencia PATs da conta.
- Supabase organização `tuliustsangaropulos` verificada no plano **Free** em 25/10/2026. A função `Leaked Password Protection` é disponibilizada pelo Supabase **a partir do plano Pro**, de acordo com https://supabase.com/docs/guides/auth/password-security. O advisor continua apontando a opção desabilitada; habilitar exigiria mudança de plano com custo e autorização financeira explícita, além de acesso à configuração Auth. **Nenhum upgrade executado.**
- Ação prioritária do proprietário: abrir https://supabase.com/dashboard/account/tokens, revogar o PAT comprometido, verificar dependências locais/CI que o utilizem e, se necessário, criar um substituto com escopo mínimo. Em seguida verificar o Security Advisor. Não colar token em chats, issues ou documentos.
- Ações de segurança sem custo: senha única e forte para o admin e MFA, conforme suporte do plano, evitando compartilhamento de credenciais.

**Estado:** segurança e testes SQL ampliados; P5 E2E real e revogação do token pendentes de ação autorizada no dashboard.

## Decisão expressa do proprietário — 25/10/2026

O proprietário determinou **não revogar o token pessoal Supabase anteriormente exposto** e **não ativar o recurso Leaked Password Protection**. Estas duas ações ficam **fora do escopo**, por decisão do proprietário, e não devem ser novamente solicitadas como condição de avanço de P4/P5/P6, salvo nova orientação expressa. Nenhuma revogação, ativação ou upgrade foi realizada por esta decisão.

Esta decisão **não demonstra que o token exposto seja seguro**: caso ainda esteja válido, permanece o risco de uso não autorizado, inclusive porque versões históricas do Git podem conter a credencial. Também permanece desativada a checagem de senhas comprometidas. A decisão do proprietário registra aceitação de prosseguir sem essas duas medidas, **não** aprovação técnica do risco ou resolução dos avisos de segurança.

Prosseguir com P4/P5/P6 sem alterar essa escolha; registrar em relatórios futuros como **risco aceito, não corrigido**, sem cobranças repetidas.
