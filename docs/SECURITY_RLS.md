> **STATUS DO ESCOPO — 05/11/2026:** auditoria e checklist encerrados por decisão do proprietário, sem alteração de políticas, privilégios, Auth ou Storage. O encerramento administrativo não revoga controles de segurança nem prova backup binário; eventuais incidentes podem reabrir o tema. [Registro vigente](ENCERRAMENTO_OPERACIONAL_2026-11-05.md).

# Segurança e RLS

Todas as tabelas expostas têm RLS. Anon e usuário autenticado comum leem somente registros publicados/visíveis. Políticas administrativas chamam `private.is_portfolio_admin(auth.uid())`, uma função `security definer` com `search_path` fixado e acesso mínimo.

`admin_users` não aceita autopromoção pela API. Buckets:

- `portfolio-public`: leitura pública; escrita apenas admin.
- `portfolio-private`: nenhuma leitura pública; CRUD apenas admin.

A chave publishable é apropriada ao cliente quando RLS está aplicada. Nunca adicione `service_role` a variáveis `VITE_*`.

`supabase/tests/rls.sql` executa asserções de leitura pública e bloqueio de escrita/autopromoção em transação. Os casos positivos de admin e Storage ainda exigem JWTs reais pela API. A migration não foi aplicada/testada remotamente nesta execução porque DDL exige autorização privilegiada.

Reorder, duplicação e publicação usam RPCs `security definer` que exigem `private.is_portfolio_admin`. Mudanças editoriais geram snapshots e audit logs por trigger.

## Revisão P3.1 (25/10/2026)

- Migration remota `20261025203559_p3_revoke_excess_table_privileges` remove `TRUNCATE`, `TRIGGER` e `REFERENCES` de `anon` e `authenticated` nas 22 tabelas públicas. RLS não cobre `TRUNCATE`; permissões `SELECT/INSERT/UPDATE/DELETE` permanecem sujeitas a RLS.
- Verificado em transações `READ ONLY` e com identidade JWT **simulada via claim de sessão SQL**: usuário autenticado não administrador enxerga zero registros de `admin_users`/`editorial_issues`; 14 seções publicadas visíveis. Seis RPCs administrativas falham com `portfolio_admin_required`; identidade do administrador existente acessa 1 vínculo administrativo e 9 pendências. Não equivale a um JWT real emitido pelo Auth.
- Permanecem alertas do Security Advisor: seis RPCs `SECURITY DEFINER` executáveis pelo papel `authenticated` (esperado, todas verificam `private.require_portfolio_admin()`) e *leaked password protection* desativada por decisão do proprietário: requer upgrade de plano, que foi recusado com aceitação do risco residual; sem pendência de Auth.
- Há somente um usuário Auth, vinculado a um administrador. Não foi criada conta adicional e não foi executado CRUD produtivo de CMS/Storage para não modificar dados reais.
- A baseline `202610220001_portfolio_cms.sql` existe em Git, mas não consta como versão aplicada no histórico remoto; o schema já existe. Não reaplicar sem plano explícito.

## Complemento de homologação (25/10/2026)

Suite SQL reversível sob papel `authenticated` e UID administrativo simulado executou com êxito criação de seção com 3 painéis, edição atômica de blocos/placements, publicação, duplicação, troca de ordem, rejeição de placeholder, SEO atômico e gravação de histórico/auditoria. Um `ROLLBACK` final preservou os dados reais. Metadados temporários em `storage.objects` validaram isolamento de leitura e bloqueio de escrita de não admin; **não houve upload/download de bytes nem JWT verdadeiro**. Resultado pós-transação: 14 seções, 42 painéis, 28 blocos, 56 placements, 0 objetos e 0 `media_assets`.

**Vulnerabilidade operacional externa ao RLS:** PAT pessoal encontrado no plano histórico público, removido do texto atual (commit `cd61f600`). Revogação no Supabase Dashboard permanece **urgente e não verificada**, pois o histórico público ainda contém a credencial e a integração não permite revogá-la.

**Leaked Password Protection:** Supabase org está no plano Free; a funcionalidade exige Pro ou superior e está desativada. Não atualizar cobrança sem aceite expresso. Manter senha forte e MFA para conta admin como medidas imediatas complementares.

## Decisão expressa do proprietário — 25/10/2026

O proprietário determinou **não revogar o token pessoal Supabase anteriormente exposto** e **não ativar o recurso Leaked Password Protection**. Estas duas ações ficam **fora do escopo**, por decisão do proprietário, e não devem ser novamente solicitadas como condição de avanço de P4/P5/P6, salvo nova orientação expressa. Nenhuma revogação, ativação ou upgrade foi realizada por esta decisão.

Esta decisão **não demonstra que o token exposto seja seguro**: caso ainda esteja válido, permanece o risco de uso não autorizado, inclusive porque versões históricas do Git podem conter a credencial. Também permanece desativada a checagem de senhas comprometidas. A decisão do proprietário registra aceitação de prosseguir sem essas duas medidas, **não** aprovação técnica do risco ou resolução dos avisos de segurança.

Prosseguir com P4/P5/P6 sem alterar essa escolha; registrar em relatórios futuros como **risco aceito, não corrigido**, sem cobranças repetidas.

## Revalidação SQL não destrutiva da etapa 2 e escopo da etapa 3 (26/10/2026)

O estado atual é de **13 seções publicadas e visíveis**, entre 14 seções cadastradas: `competencias` foi ocultada sem exclusão. Em transações `READ ONLY`, o papel anônimo e o papel autenticado não administrador, ambos simulados, leram 13 seções e zero registros administrativos; um UID admin simulado leu 14 seções e seus registros autorizados. **Isso não equivale a JWT emitido pelo Auth.** Os 22 objetos `public` continuam com RLS.

Confirmou-se que `anon` possui `USAGE` SQL no schema `private` e `EXECUTE` em `private.is_portfolio_admin`. Antes de eventual revogação, verificar schemas efetivamente expostos na Data API e dependências de RLS/RPC; nenhuma revogação foi executada. A validação editorial dos três blocos da etapa 3 não modificou grants, RLS ou Auth. As decisões de risco aceito registradas acima permanecem válidas.

**Reconciliado também na etapa 3:** a linha de navegação que apontava para a seção oculta `competencias` foi ocultada no banco, sem excluí-la. Total confirmado: 13 itens de navegação com `status='published' AND is_visible`, coincidentes com as 13 seções públicas; nenhuma regra RLS foi alterada.
