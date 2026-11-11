# P4/P5 — Execução, evidências e próximos aceites

Data: 25/10/2026 · Branch: `main` · URL: https://tulius.work/

## Decisão do proprietário sobre a segurança

O proprietário decidiu expressamente **não revogar o PAT Supabase exposto** e **não ativar Leaked Password Protection**. Essas duas intervenções ficam fora do escopo das próximas tarefas e não devem ser reiteradas como solicitações. O risco de uso do token exposto, caso ainda válido, e a ausência da proteção de senhas continuam conhecidos e **não corrigidos**. Não houve revogação, alteração de Auth nem upgrade de plano.

## P4 — Homologação visual progressiva

Referências acessíveis:
- Canva desktop (14 páginas 1920 × 1080): https://www.canva.com/design/DAHYe7ROgwM/lqdQLRd9sHRnkAgMMyv0Dw/edit
- Canva mobile (2 páginas 1080 × 1920): https://www.canva.com/design/DAHYtZDmKqs/qYMTfd2sEC4-hOJ9VhGmfw/edit
- Documento histórico `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` no material de projeto: distinção entre referências originais e melhorias posteriores do Figma.

**Auditoria já executada:** `scripts/p4-visual-audit.mjs` captura os 14 painéis desktop em 1440×900 e os 28 mobile em 390×844. A execução inicial do workflow 40234957804 produziu 42 capturas, sem erros de carregamento, painéis vazios ou overflow. As capturas são anexadas como artifact `p4-editorial-42-panels`, com retenção de sete dias. O teste atual inclui também inspeção de contato a 320 px.

**Inspeção qualitativa das capturas:**
- A primeira seção apresenta a separação editorial grafite/branco desktop e laranja/grafite no mobile, retrato P&B, marcador +15 anos e selo 360°. Os elementos essenciais da referência estão presentes.
- As seções 02–14 usam majoritariamente um renderer editorial compartilhado, com identidades de tema e conteúdos distintos. Sua presença e responsividade foram verificadas, mas isso **não garante equivalência visual tela a tela** com os PDFs originais.
- O conteúdo provisório `XXXXX · X/Y/Z` continua aparente em Resultados e deve seguir tratado como pendência editorial, sem preenchimento fictício.
- Ajuste pontual em Contato mobile: valores extensos de e-mail e LinkedIn recebendo tipografia de menor escala para evitar quebra de um único caractere; conferir visualmente após novo deploy.
- Não houve redesign, troca de identidade visual, mudança na coluna direita da primeira seção, nem alteração de dados no CMS.

**Pendente para aprovação visual final:** comparação lado a lado da composição de cada uma das 14 páginas Canva com a seção correspondente do site, considerando que alterações feitas posteriormente no Figma podem prevalecer sobre o Canva/PDF; validação humana de legibilidade, composição, a11y com leitor de tela real e zoom **nativo** de 200%. A automação comprova renderização e dimensão, não julgamento de fidelidade estética.

## Fechamento da auditoria automatizada ampliada (25/10/2026)

**Execução final aprovada:** https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40236047027.

- P4: **42/42 capturas** (14 desktop, 28 mobile), nenhum painel vazio, erro de carregamento ou overflow; **8 viewports** no smoke principal sem regressão.
- Menu mobile: transferência inicial de foco após abertura, focus trap de Tab/Shift+Tab, fundo `inert`, Escape, retorno de foco, reabertura imediata e histórico hash/Voltar: **PASS**.
- Contato a 320 px: WhatsApp, e-mail e LinkedIn renderizados em **uma linha cada**, sem quebra irregular de texto: **PASS**. CSS ajustado somente para valores de Contato na vista mobile.
- Lighthouse de laboratório: Performance **76 mobile / 98 desktop**; LCP **4,38 s mobile / 1,06 s desktop**; Acessibilidade, Boas Práticas e SEO **100/100** em ambos. Performance mobile permanece no backlog P6.
- CI geral da execução: **aprovado**. Este aceite é de **automação/estrutura e navegação**, não de equivalência visual pixel a pixel com Canva.

## P5 — Ampliação de testes

**Executado anteriormente:** 8 cenários transacionais de CRUD/RPC/publicação/SEO e gatilhos de revisão/auditoria; metadados de Storage públicos/privados e bloqueios de não administrador; todas as alterações ocorreram em `BEGIN … ROLLBACK`. Ver `docs/P3_FECHAMENTO.md`.

**Novo teste disponível:** `scripts/p5-admin-readonly.mjs` no workflow manual `.github/workflows/p5-admin-readonly.yml`. Com uma conta administrativa *real* em Secrets do GitHub Actions, verifica login, oito módulos, preview e logout/reacesso bloqueado. **Não altera conteúdo** e não imprime os segredos. Nunca declare esse teste aprovado enquanto o workflow não executar com credenciais válidas.

### Execução autorizada com GitHub Actions

Configurar (fora do chat) secrets de repositório `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD` em GitHub → Settings → Secrets and variables → Actions. Em Actions, selecionar **P5 Admin Read-Only E2E → Run workflow**, branch `main`. Os segredos não são copiados para o repositório. Se estiverem ausentes, o teste falha explicitamente como *não executado*. A criação de uma sessão de login no Supabase Auth é esperada, sem mudanças editoriais.

**Limite ainda aberto:** upload/download e substituição reais de Storage, edição/persistência e publicação de conteúdo via interface, restauração editorial de revisão (o rollback SQL não equivale a restaurar uma versão). Esses testes requerem ambiente ou dados de ensaio isolados e um plano de limpeza; não executar mutações de conteúdo real como teste.

## Links úteis

- Auditoria P4: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/audit-p3-lighthouse.yml
- E2E autenticado de leitura: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/p5-admin-readonly.yml
- Relatório P3: https://github.com/tuliustsangaropulos/PortfolioTulius/blob/main/docs/P3_FECHAMENTO.md
