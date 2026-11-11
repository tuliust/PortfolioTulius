# Atualização operacional — P2/P4, 09/11/2026

> **Atualização de continuidade — 09/11/2026.** Este trecho prevalece sobre quaisquer snapshots datados abaixo. Código inicialmente auditado em `7e8d7f82`, agora incluindo correção de fallback P2 (`4e739dbf`), suíte de mídia sintética (`630fb712`) e experimentos de prioridade da consulta inicial de Perfil (`b3dc0a5f` e `93176222`). **Não foi aplicada migration nem houve escrita de ensaio no Supabase de produção.** A migration `20261109024100_p2_composite_section_block_save.sql` existe em Git, mas `public.save_section_block_atomic` está **ausente no banco produtivo** (SELECT em `pg_proc`); usar o caminho legado até autorização separada. Veja [relatório de execução](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md), [plano de aceite](P2_P4_PLANO_ACEITE_2026-11-08.md) e [mapa CMS → renderer](MAPA_CAMPOS_CMS_RENDERER.md).

## Evidência adicional de isolamento e Storage sintético (09/11)
O workflow `p5-local-transactional.yml` liga Docker/Supabase CLI v3 apenas em `http://127.0.0.1:54321` com `supabase/seed.local.synthetic.sql`. `scripts/p4-local-media.mjs` exige `GITHUB_WORKSPACE` e endpoint loopback, usa usuários `example.invalid` e objetos SVG inventados, testa 8 cenários: JWT admin/non-admin, RLS privado, mutação proibida, metadados com CAS, renomeação privada, injeção de falha SQL e compensação de arquivo, promoção pública e exclusão controlada. Run #42561707707 SUCCESS, 8/8. A suíte não aborda ainda a UI da Biblioteca nem garante compensação automática em todas as falhas incertas do mundo real.

---

## Documento anterior preservado para rastreabilidade

# Homologação P4 — Supabase local isolado (sem segundo projeto cloud)

**Decisão explícita do proprietário, 02/11/2026:** usar exclusivamente uma instância local do Supabase para P4. Não criar projeto cloud, nem executar migrações, testes de escrita ou alterações no Supabase de produção.

## Estado deste ambiente

- [x] Preparado `supabase/config.toml` com projeto local dedicado e caminho **exclusivo** para `seed.local.synthetic.sql`.
- [x] Criado `supabase/seed.local.synthetic.sql` com **somente** página, seção, painéis e bloco fictícios, em `draft`, além de configurações locais `noindex`. Nenhum conteúdo real do site.
- [x] Preservadas as oito migrations de esquema existentes: **não foram executadas contra o banco de produção**.
- [x] Incluídas verificações offline (`scripts/p2-local-isolation.check.mjs`) da configuração, dos arquivos e da API **somente** em `http://127.0.0.1:54321/`.
- [x] Incluído teste de leitura RLS local (`scripts/p2-local-readonly.mjs`): cinco tabelas acessíveis, página fictícia em rascunho invisível para `anon`; **zero escritas**.
- [ ] Inicializar contêineres e aplicar migrations **num computador com Docker e Supabase CLI**. **Este ambiente de execução não possui Docker nem CLI; nenhuma instância local está rodando aqui.**
- [ ] Executar smoke de leitura, corrigir incompatibilidades de migration que apareçam e homologar operações transacionais **somente** na instância local.
- [ ] Criar duas identidades fictícias em Auth local, uma admin e outra não admin, para ensaios de RLS, RPCs, histórico, publicação e Storage. Não usar usuários/credenciais reais.

## Requisitos

Docker Desktop/Engine iniciado; Node.js 20+; Supabase CLI instalado conforme a [documentação oficial](https://supabase.com/docs/guides/local-development/cli/getting-started). Não usar `supabase login`, `supabase link`, nem instalar Supabase Branching para esta tarefa.

O projeto tem um `supabase/seed.sql` legado com **conteúdo editorial real**. Ele foi **explicitamente excluído** do [config local](../supabase/config.toml). Nunca o aplique na homologação. A CLI executa as migrations da pasta `supabase/migrations` e depois **somente** `seed.local.synthetic.sql`.

## Procedimento na cópia local do repositório

1. No terminal, na pasta raiz `PortfolioTulius`, confirme a branch `main`, mudanças locais preservadas e atualização com `git pull --ff-only origin main` **apenas quando seguro**.
2. Verifique as ferramentas e o destino configurado:
   ```sh
   docker info
   supabase --version
   node --test scripts/p2-local-isolation.check.mjs
   node scripts/p2-local-preflight.mjs
   ```
3. Confira `supabase/config.toml` e `supabase/seed.local.synthetic.sql` antes de iniciar. A conexão do stack será exclusivamente local:
   ```sh
   supabase start
   supabase status
   ```
4. Obtenha a chave **anon/publishable local** exclusivamente na saída local da CLI. Execute o smoke read-only sem imprimir, compartilhar ou commitar a chave. Exemplo para terminal Unix, com valores locais inseridos pelo operador:
   ```sh
   P2_LOCAL_URL=http://127.0.0.1:54321/ \
   P2_LOCAL_ANON_KEY='<CHAVE_ANON_LOCAL>' \
   node scripts/p2-local-readonly.mjs
   ```
   No PowerShell, atribua `$env:P2_LOCAL_URL` e `$env:P2_LOCAL_ANON_KEY` com valores locais e rode o mesmo script. Não coloque valores de produção em nenhuma dessas variáveis.
5. Se e **somente se** o banco local precisar ser recriado, após confirmar a conexão local e descartar fixtures descartáveis:
   ```sh
   supabase db reset --local
   ```
   Isso apaga o banco **local** e reaplica migrations + seed sintético. Nunca usar `--linked` e nunca executar `db push`/`db pull` nesta homologação.
6. Ao concluir, parar os contêineres locais com `supabase stop`; revisar arquivos não versionados antes de qualquer commit.

## Como conectar o frontend apenas ao stack local

Com o projeto rodando e a chave **anon local**, criar/editar **somente** o seu `.env.local` não versionado:
```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<CHAVE_ANON_LOCAL>
```
É um ambiente sintético: as páginas ficam em `draft`; a ausência de conteúdo público é **esperada**. O site de produção e as variáveis de ambiente da Vercel **não** mudam.

## Limites e proteções

- `scripts/p2-local-isolation.mjs` só aceita a API local em `127.0.0.1:54321`; rejeita `localhost` alternativo, HTTPS, credenciais na URL, portas diferentes, caminhos ou query strings.
- As verificações offline confirmam que a configuração ativa usa exclusivamente o seed fictício; os comentários históricos não contam como parâmetros.
- Não existe etapa que envie dados do Supabase de produção ao stack local; sem cópia de usuários, dados privados, mídias, secrets ou conteúdo editorial.
- A instância local **não** é segura para exposição na internet; manter acesso apenas ao computador e Docker restrito.
- O workflow cloud antigo `p2-transactional-staging.yml` permanece **manual**, mas **não será usado** para a opção local. Seu roteiro de ref `.supabase.co` não é compatível com loopback; não contorná-lo.
- O smoke de leitura não demonstra operações CRUD, upload, restauração, autenticação por papéis ou aprovação editorial. Estes cenários permanecem `[ ]` até ensaios reais locais.

## Portão para a próxima etapa

Confirmar a primeira inicialização e a aplicação bem-sucedida das migrations no stack local, sem utilizar recursos da plataforma cloud. Só depois criar identidades fictícias de teste e habilitar o roteiro transacional **local**, com limpeza e rollback. Qualquer aplicação no Supabase de produção continua proibida sem autorização individual.

**Referências:** [Supabase local CLI](https://supabase.com/docs/guides/local-development/cli-workflows) · [seeding](https://supabase.com/docs/guides/local-development/seeding-your-database) · [config e secrets](https://supabase.com/docs/guides/local-development/managing-config).
