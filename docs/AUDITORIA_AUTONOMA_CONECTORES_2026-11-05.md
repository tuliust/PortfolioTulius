# PortfolioTulius — auditoria autônoma por conectores (05/11/2026)

> Documento de evidência e classificação **somente leitura**. Branch consultada: `main`, baseline GitHub `2a121f05be601f18b0521c7ce2a939fe86084d4a` antes deste commit documental. Não representa implantação dos commits ainda locais, nem autoriza alteração de banco, exclusão de Storage ou substituição editorial. Fontes: SELECT agregados no Supabase `portfolio`, revisão de arquivos GitHub e histórico Actions/Vercel, logs de PowerShell fornecidos pelo proprietário e relatórios P1 de 02/11. O aceite manual do proprietário encerrou as **Etapas 4–7**, sem reabri-las.

## 1. CMS, paridade editorial e consumidores

- Produção: 14 seções (uma oculta), 28 blocos (**26 manuais + dois vinculados a `testimonials`**), 42 painéis, 56 placements, 6 experiências, 4 projetos, 6 logos e 19 slides no JSON `experienceMedia`. `content_json.source_collection` existe somente nos dois blocos de depoimentos; não é coluna de `content_blocks`. 9 ocorrências editoriais resolvidas, 0 abertas.
- A matriz histórica de [139 diferenças](BLOCO_1_P1_COMPARACAO_ATRIBUTOS_2026-11-02.md) é comparação **hipotética por posição**, não 139 bugs novos ou perdas atuais. Por área: Competências A/B 14+14; Contato/B 6; Ferramentas A/B 5+4; Formação A/B 6+8; Perfil/B 50; Resultados/A 32. Total 139 no ordenamento histórico. Empates em `metrics.sort_order=1` (dois registros) e `portfolio_projects.sort_order=1` (três) tornam a contagem por posição sensível a desempate; já havia indicação histórica de 138 em outra ordem. **Não foi executado novo diff campo a campo reproduzindo os 139** neste acompanhamento.
- Classificação técnica: diferença de *apresentação/editorial* (ícones, valores, meta, texto e rótulos), atributo sem equivalência direta (themeKey, targetSlug, isHidden, galeria e mídias em JSON) e risco potencial de perda **somente se** houver substituição automática. Não foi demonstrada perda de dados na versão vigente.
- Os outros 17 blocos manuais são heterogêneos, sem conversão integral segura. Preservar `content_json`, IDs, status, ordem, placements, links e fotos; não realizar `source_collection` em massa. A decisão manual das Etapas 4–7 permanece concluída; nenhuma alteração editorial foi feita nesta auditoria.
- Consumidores estáticos verificados na `main` de origem: `src/hooks/usePortfolio.ts` lê `source_collection` e `seo_json`; `src/components/public/ExperienceStack.tsx` lê `experienceMedia`; `src/components/admin/AdminModules.tsx` edita os mesmos campos; `scripts/generate-seo.mjs` lê SEO de `site_settings`; `src/content/fallback.ts` contém dados de fallback. Não inferir ausência de uso por uma FK nula.

## 2. Storage e biblioteca — preservação, sem limpeza

- Consulta 05/11: **129 objetos** = 72 em `portfolio-public` (bucket público) + 57 em `portfolio-private` (bucket privado); **76 entradas** em `media_assets`, todas com objeto físico correspondente. Dos privados, quatro têm catálogo e 53 não.
- **53/53 objetos privados não catalogados** possuem objeto público com o **mesmo caminho, tamanho e ETag**. Zero pares sem correspondência ou com metadados divergentes. ETag/tamanho **não são hash SHA-256 independente**, logo equivalência binária e restauração não comprovadas.
- Dos 72 públicos, **28** têm URL direta de `portfolio-public` em blocos publicados de seções visíveis; **44** não têm essa URL direta, nem mera ocorrência do nome de caminho, nem ocorrência no `site_settings.seo_json`, mas **44/44 aparecem em `content_revisions.snapshot_json`**. O relatório histórico subdivide esses 44 em 19 ilustrações históricas, 22 gerações anteriores e 3 uploads avulsos.
- Não se comprovou ausência de uso externo (URLs compartilhadas, caches, consumidores terceiros), no código estático completo, backups ou mídia histórica. **Classificação conservadora para todos os 53+44: PRESERVAR / dependência externa ou uso histórico não descartados**. Não autorizar nenhuma remoção nem migração.
- Exceção nova: **uma mídia catalogada em bucket privado possui `alt_text` vazio** e estado editorial `published`; a mesma janela de 04/11 registrou uma nova mídia, um novo objeto e 25 revisões (24 `design_tokens`, uma mídia). Não revelar nome/caminho do objeto em GitHub; o status `published` **não torna o bucket privado público**.
- Ainda faltam hashes binários, backup recuperável testado e inspeção de URLs externas para conclusão de custódia. LOC-10 permanece bloqueado quanto à procedência dos 131 arquivos do ambiente local; a detecção de 11 contêineres e 3 mounts não fornece essa prova.

## 3. PostgreSQL, RPCs, RLS e avisos

- `public`: **22 tabelas, 14 FKs, 51 índices, 36 triggers de usuário, 41 políticas, zero views**. RLS habilitada nas 22 tabelas.
- Sete funções `SECURITY DEFINER` em `public`: seis RPCs administrativas expostas para `authenticated`, com **EXECUTE negado a `anon`** e chamadas detectadas ao guard `private.require_portfolio_admin()`; a sétima (`capture_content_change`) não é executável por `anon` ou `authenticated` conforme as permissões consultadas. A análise de texto da função não equivale ao ensaio com JWT real nem garante ausência de BOLA/IDOR.
- Advisors Supabase no momento da consulta: **6 achados** sobre funções `SECURITY DEFINER` executáveis por autenticados; **1** aviso de proteção de senhas vazadas desabilitada; **19** ocorrências de políticas permissivas múltiplas (performance); **8** índices sem leituras registradas. São avisos para avaliação, não prova de vulnerabilidade nem autorização para revogar, fazer `DROP` ou alterar Auth.
- Os campos `content_blocks.media_id`, `testimonials.photo_media_id`, `site_settings.favicon_media_id`, `media_assets.credit/alt_text/focal_point`, `career_experiences.skills` e `portfolio_projects.experience_id` continuam no contrato. **safeToDrop=false** para todas as tabelas e campos nesta fase.
- Referências oficiais: [Supabase definer](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [políticas permissivas](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies), [proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## 4. Código de mídia, SEO e desempenho — decisão de integração

- Código **remoto do baseline** preserva `uploadPrivateMedia` para `portfolio-private`; a promoção para `portfolio-public` é uma operação separada. A cópia integrada analisada anteriormente pretendia inserir mídia nova diretamente no bucket público com `status=published`, além de retirar campo de crédito em `AdminModules.tsx`. **Não realizar transferência integral** dessas variantes: muda fronteira de revisão, exposição e procedência.
- `media-operations.ts`: compensação em falha de rede exige distinguir rejeição confirmada de resultado incerto; preparar alterações atômicas e testes antes da publicação, sem exclusão destrutiva de objetos de resultado desconhecido. Não foi aplicado patch de mídia nesta etapa.
- Logs Windows do proprietário: patch CSS UI-01 já aplicado **somente no repositório ORIGINAL**; kit SEO sintético aplicado ao ORIGINAL, com **157/157 Vitest + 4/4 Node, formatação, TypeScript e build PASS**. O serviço SEO tem autenticação e envio injetados por callbacks; não é endpoint produtivo, não habilita gatilho Vercel e requer tratamento de `sending` interrompido e concorrência multi-instância antes de uso produtivo. Nada disso é inferido como publicado.
- Build Windows relatado: 13 chunks JS, 718,81 kB minificados; maior chunk 198,20 kB abaixo do limite de 500 kB. O build avisou que o fingerprint do SHA P3 não foi gerado. A meta Lighthouse mobile permanece mediana **≤3,5 s** de três execuções comparáveis; **não** há medição nova desse gate para o código local.
- Duas consultas a `sections` no carregamento inicial são conhecidas e devem ser avaliadas em contexto de prefetch/cache, não deduplicadas por aparência. Recuperação HTTP 503 real continua sem evidência adicional no SHA publicado.

## 5. GitHub, CI e Vercel: fronteira de publicação

- No início desta auditoria `main` remota: `2a121f05be601f18b0521c7ce2a939fe86084d4a`. [Validate — PASS no mesmo SHA](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41834824615). [Vercel produção READY no mesmo SHA](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/B4ESFSpZwBh9Xe7Cw3qRoWFB2c7b).
- Hygiene [PASS](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41589599582), Export [PASS](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41589618121) e P3 [PASS](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41596601615) têm evidência de **SHA anterior** `ac992053...`; não atribuir automaticamente ao commit final.
- Dois commits **ainda locais e não encontrados no GitHub**: `381befb29a6096b42634e7281535fce9e0cbfba3` e `d3c3cee75966da46870e3081fdbe030994bd51c9`. Git status local após testes inclui mudanças em `package.json`, `src/index.css`, `vite.config.ts` e dois scripts SEO, mais quatro arquivos de infraestrutura excluídos. Nenhum arquivo de código dessa árvore local foi transferido por esta auditoria.
- Esta alteração em `main` é **somente documental**, sem simular a implantação do código local. Como uma nova versão GitHub documental sucede o baseline remoto, a reconciliação posterior dos commits locais deve ser planejada por ancestralidade, nunca por `--force`, reset destrutivo ou cópia cega.

## 6. Classificação para fechamento

| Frente | Situação após auditoria |
| --- | --- |
| Contagens e contratos lógicos de CMS | Verificados por SELECT, sem transformação |
| 139 diferenças históricas / nove projeções | Reclassificadas como hipótese editorial; **sem diff novo 1:1** |
| 53 pares privados / 44 públicos | Inventário agregado revalidado; **preservar todos**; hash binário/uso externo pendentes |
| RLS, RPCs, policies, índices | Inspeção estática concluída com riscos documentados; **sem alterações** |
| Fluxo de mídia | Risco de promoção automática detectado; **não integrar variante insegura** |
| CI e deployment do SHA inicial | Validate/Vercel confirmados; demais checks por SHA pendentes |
| Etapas 4–7 | **Concluídas por aceite humano de 05/11**, sem reabrir |
| Backup físico, LOC-10, novo SHA de código, P3 final e aceite final | **Não concluídos nesta auditoria documental** |

**Invariantes:** nenhuma escrita no Supabase; nenhuma mídia removida; nenhuma troca de fonte/ordem/ID; nenhum código local perdido ou sobrescrito; nenhuma chave/JWT/caminho privado publicado. Links e contagens são snapshot do horário da consulta, não monitoramento permanente.
