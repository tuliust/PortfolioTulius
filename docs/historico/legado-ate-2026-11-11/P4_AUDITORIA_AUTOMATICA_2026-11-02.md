# P4 — Auditoria automática de leitura e comparação editorial (02/11/2026)

**Escopo:** P4.1–P4.4; execução por conectores com `SELECT` nas tabelas públicas e `storage.objects`, inspeção de código e CI. Nenhuma instrução de migração, `INSERT`, `UPDATE`, `DELETE`, transformação de fotos ou alteração de Auth/RLS/DDL foi aplicada no Supabase.

## P4.1 — Inventário dos 26 blocos manuais

Os **28 blocos publicados** permanecem: 26 manuais e 2 com `source_collection=testimonials` (com paginação 0–2 e 2+). A matriz abaixo é uma **comparação preliminar**, não uma decisão editorial, e não altera vínculos. Campos adicionais e fotografia podem demandar aprovação mesmo quando os títulos coincidirem.

| Bloco / painel | Itens manuais | Coleção candidata, se houver | Itens propostos | Títulos coincidentes | Diferenças brutas de atributos |
|---|---:|---|---:|---:|---:|
| `perfil/a` | 5 | Sem candidato seguro | — | — | — |
| `perfil/b` | 11 | Sem candidato seguro | — | — | — |
| `sobre/a` | 1 | Sem candidato seguro | — | — | — |
| `sobre/b` | 5 | Sem candidato seguro | — | — | — |
| `resultados/a` | 4 | `metrics` | 6 | 0 | 31 |
| `resultados/b` | 5 | Sem candidato seguro | — | — | — |
| `competencias/a` | 2 | `skills` | 7 | 0 | 14 |
| `competencias/b` | 3 | `skills` | 7 | 0 | 14 |
| `formacao/a` | 3 | `education` | 3 | 3 | 6 |
| `formacao/b` | 2 | `language_levels` | 2 | 0 | 8 |
| `invest-rs/a` | 3 | Sem candidato seguro | — | — | — |
| `invest-rs/b` | 5 | Sem candidato seguro | — | — | — |
| `prefeitura-sp/a` | 6 | Sem candidato seguro | — | — | — |
| `prefeitura-sp/b` | 4 | Sem candidato seguro | — | — | — |
| `vale/a` | 4 | Sem candidato seguro | — | — | — |
| `vale/b` | 3 | Sem candidato seguro | — | — | — |
| `globo-sportv/a` | 4 | Sem candidato seguro | — | — | — |
| `globo-sportv/b` | 11 | Sem candidato seguro | — | — | — |
| `inpress/a` | 3 | Sem candidato seguro | — | — | — |
| `inpress/b` | 2 | Sem candidato seguro | — | — | — |
| `cdi/a` | 3 | Sem candidato seguro | — | — | — |
| `cdi/b` | 2 | Sem candidato seguro | — | — | — |
| `ferramentas/a` | 3 | `tool_categories` | 3 | 3 | 5 |
| `ferramentas/b` | 3 | `tool_categories` | 3 | 3 | 4 |
| `contato/a` | 1 | Sem candidato seguro | — | — | — |
| `contato/b` | 3 | `contact_channels` | 4 | 3 | 9 |

**Como ler:** diferenças são calculadas com os itens pela **posição atual**, incluindo atributos editoriais/manuais ausentes na projeção da coleção; um valor alto não é uma medida de qualidade. Títulos coincidentes são apenas uma pista, não identidade comprovada. As sugestões de `competencias`, `resultados` e `formacao/b` exigem revisão semântica. A divisão 3+3 de `tool_categories` é uma hipótese somente para o relatório; **não** será aplicada a blocos sem autorização. Nos demais blocos, inclusive as seis experiências, não se inferiu vínculo por coincidência ou ordem. Não existe aprovação por bloco nesta consulta.

**Acervo publicado (somente leitura):**

| Coleção | Registros publicados |
|---|---:|
| `career_experiences` | 6 |
| `portfolio_projects` | 4 |
| `metrics` | 6 |
| `skills` | 7 |
| `education` | 3 |
| `language_levels` | 2 |
| `tool_categories` | 6 |
| `testimonials` | 3 |
| `contact_channels` | 4 |

**Ação dependente do proprietário:** para cada bloco, aprovar (ou rejeitar) o destino, a posição, os campos e as diferenças. Fotografias e conteúdo já publicado continuam prevalecendo até essa aprovação. As seis experiências seguem com sincronização de descrição vigente; o restante aguarda seleção de campos.

## P4.2 — CMS e operações

- Login administrativo com credencial protegida via GitHub Actions; oito módulos navegáveis.
- Consulta autenticada de leitura confirmou nove abas do acervo, campo `radius.card`, 50 ícones com rótulo, editor mobile a 390×844, proteção de alterações não salvas, prévia com 14 seções incluindo uma oculta e bloqueio após logout.
- **P5 autenticado:** [run 41384753740](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41384753740) — 6/6, zero escrita de conteúdo. Inclui cancelamento da biblioteca sem alteração da imagem salva.
- Código corrigido para reter seções já exibidas se nova leitura falhar, tanto no hook público quanto na lista do painel; leitura de blocos com erro não zera o estado editável. Essas salvaguardas **não** equivalem à injeção de falhas em rede em navegador.
- Permanecem pendentes: transações CRUD (criar/duplicar/arquivar/publicar/recuperar), testes com usuário não administrador e recuperação histórica num staging isolado com autorização específica.

## P4.3 — Mídias

- `media_assets`: **75 registros**, cada um com objeto correspondente no Storage por `bucket_id + name`: 72 públicos e 3 privados.
- `storage.objects`: **128 objetos**, 72 públicos e 56 privados. Os 53 objetos sem cadastro estão **todos no bucket privado**, de 26/10/2026 a 31/10/2026. Não são necessariamente lixo; **não apagar**.
- **13 registros** têm `alt_text` vazio e **1** contém um texto curto (`Vale`); os 14 estão listados no [inventário de revisão de alt](P4_INVENTARIO_ALT_2026-11-02.md). Comprimento não é critério absoluto de acessibilidade: conferência contextual e eventual aprovação continuam pendentes.
- **Seis logotipos de experiências** referenciam objetos existentes no Storage e têm `logoAlt`. Os **19 slides** (Invest RS 4; Prefeitura 3; Vale 3; Globo/SporTV 3; InPress 3; CDI 3) têm título, descrição alternativa e legenda, e cada URL corresponde a um objeto público existente. Isso confirma integridade dos arquivos e metadados, **não o enquadramento visual dos 19 slides**.
- Os três depoimentos publicados permanecem sem `photo_media_id`. Seus três retratos históricos ficam nos blocos manuais como `/media/` e não foram atribuídos a algum objeto do catálogo pela semelhança de nomes. Exige correspondência e aprovação explícita.
- **Cancelamento do seletor de imagens** validado em navegador autenticado, com fotografia anterior preservada e sem requisição de gravação. Testes de upload, promoção, substituição e cancelamento de operações com gravação aguardam staging isolado.

## P4.4 — Site público, desempenho e SEO

- Os quatro critérios antes pendentes do contato foram corrigidos por ajustes localizados de alinhamento: rodapé do desktop coincide com base da coluna de fotografia e imagem mobile coincide com a borda inferior do painel em 360, 390 e 430 px.
- [Auditoria P3 após correção](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41383597122): **0 falhas** de navegador; **38/38** capturas editoriais sem violações capturadas; RLS anônima **3/3**; Lighthouse acessibilidade **100** mobile e desktop.
- `radius.card` publicado no banco como `4` agora tem leitura validada 0–32 e aplica-se como CSS variável ao cartão de depoimento. Fotos não mudaram.
- Falhas injetadas no navegador em chamadas GET de **section_panels** e **testimonials** confirmaram **2/2 cenários aprovados**: Perfil e retrato preservados com aviso de erro. Os requests simulados não escreveram no banco. A falha inicial, antes de qualquer conteúdo recuperado, continua mostrando erro e não utiliza fallback editorial obsoleto em produção. [Auditoria de falhas parciais](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41384467574).
- A mediana do último Lighthouse mobile concluído nessa revisão é aproximadamente **3,34 s** (LCP simulado), maior que a meta ≤2,5 s; score de performance mediano 87. Otimização adicional de fontes/CSS/JS exige avaliação para não comprometer a tipografia e os blocos aprovados.
- O SEO publicado no banco tem título e descrição reais, `robots=index,follow`, `locale=pt-BR`. O build `scripts/generate-seo.mjs` gera HTML e sitemap a partir do banco e registra fallback quando não consegue consultá-lo. **Salvar no CMS isoladamente não dispara novo deploy**; portanto, atualização para crawlers permanece dependente do fluxo de publicação/novo build e requer decisão de integração sem divulgar credenciais.
- Restam testar outras falhas parciais (incluindo recuperação de mídia), rede real e Core Web Vitals de campo, além da propagação de SEO pós-salvamento.

## Proteção de dados, identidade visual e limites

- Todos os conteúdos manuais, links, fotos, logos, legendas e arquivos Storage foram preservados.
- Nenhuma política RLS, objeto SQL, usuário, função privilegiada ou configuração de Vercel foi alterada.
- A CI de código verifica formatação, TypeScript, testes unitários, build e smoke; a auditoria browser e o P5 autenticado são verificações independentes. Nenhuma pontuação automatizada constitui vistoria humana.
- O relatório foi produzido sem substituir fotos, migrar textos ou reconfigurar o sistema de publicação.

## Evidências

- [CI código P4](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41383983117)
- [P3: layout, RLS, acessibilidade, desempenho](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41383597122)
- [P5: autenticação, 9 coleções, prévia e cancelamento de mídia 6/6](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41384753740)
- [P4: cenários de falha de leitura e recuperação 2/2](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41384467574)

## Continuação automática — fallbacks e tokens

- Se um endpoint de coleção falhar mas o grafo das seções continuar íntegro, a aplicação agora usa a cópia editorial manual **apenas para a coleção indisponível**. O resultado publicado de uma coleção validamente vazia continua vazio. Os blocos reais de depoimentos incluem duas fotos no painel A e uma no B, todos mantidos em `content_json`; o novo teste browser verifica essa preservação.
- Leitura dos 12 tokens publicados confirma seis cores, duas fontes, contêiner, espaçamento, movimento e raio. Os seletores CSS `--font-display` passaram a derivar de `font.heading`, tal como `--font-heading`; com o token atual (Big Shoulders Display), não há mudança intencional da identidade visual.
- Falta homologar o resultado do novo workflow de navegador, otimização de LCP, sincronização automática do SEO estático após salvar e gravações transacionais em staging.

## Verificação final da continuidade automatizada

- **Commit funcional:** `38097a4ad2a03d421cb4e4e6badce63bde4108d2`; [Validate CI aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455931); [Auditoria P3/P4 aprovada](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455933).
- **Recuperação de coleção:** GET `testimonials` 503 simulado quatro vezes, **13 seções mantidas**, três cartões e três fotografias `/media/` preservadas, com aviso de indisponibilidade e zero gravações. GET `section_panels` 503 simulado quatro vezes preservou o Perfil, seu retrato e o aviso; duas situações aprovadas. Uma coleção efetivamente consultada e vazia continua vazia, sem usar conteúdo antigo inadvertidamente.
- **P3 navegador:** zero falhas; **38** capturas sem erros nos critérios testados; **P5 anônimo 3/3**, com zero escritas.
- **Lighthouse:** acessibilidade mobile/desktop **100/100**, desempenho mobile mediano **87/100**, LCP mobile simulado mediano **3.388,722 ms** (amostras **3.970,645**, **3.341,863**, **3.388,722 ms**). Ainda acima da meta 2.500 ms; não declarar P4.4 de desempenho concluída.
- **Design:** auditados os doze tokens publicados; `font.heading` agora alimenta também `--font-display` nos elementos públicos. Valor publicado igual ao padrão, sem alteração tipográfica intencional; futuras escolhas diferentes de fonte exigem vistoria do proprietário.
- **Mídia:** os quatorze alts de catálogo triados estão no [inventário individual](P4_INVENTARIO_ALT_2026-11-02.md); o preenchimento requer descrição visual comprovada e aprovação.
- **P2/P4.5 ainda sinalizados pelos Advisors:** seis RPCs `SECURITY DEFINER` executáveis por `authenticated` (verificações internas de administrador existem), proteção contra senhas vazadas desativada, 19 RLS sobrepostas e nove índices não utilizados. Nenhuma permissão ou configuração foi alterada.
