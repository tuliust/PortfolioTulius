# Guia para ChatGPT, Codex e outras IAs
**Status:** roteiro de manutenção · **Revisão:** 11/11/2026. Complementa [`AGENTS.md`](../../AGENTS.md), sem substituí-lo.

## Procedimento antes de alterar qualquer coisa
1. Ler regras [`AGENTS.md`](../../AGENTS.md) e [índice central](../README.md).
2. Localizar **o documento temático canônico** e ler código/schema real correspondente; não usar o relatório datado mais longo como autoridade automática.
3. Identificar SHA da `main`, deployment Vercel, dados Supabase relevantes e testes realmente executados para o mesmo SHA.
4. Separar **fato de código**, **dado de produção**, **documentação histórica**, **hipótese**, **resultado CI** e **aceite do proprietário**.
5. Fazer mudanças localizadas no escopo pedido; preservar layout e conteúdo; testar e registrar diff/resultado.
6. Atualizar o guia temático certo e citar evidências, em vez de empilhar adendos nos antigos.

## Roteamento rápido
| Tarefa | Abrir |
|---|---|
| Edição de seção/campo | [CMS](../03-cms/GUIA_ADMINISTRATIVO.md) + [modelo](../03-cms/MODELO_DE_DADOS.md) |
| Layout, cor, fonte e mobile | [design](../02-design/IDENTIDADE_VISUAL.md) + [responsividade](../02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) |
| Foto, upload, alt | [mídias](../03-cms/MIDIAS_E_STORAGE.md) |
| SQL, Auth, RPC, RLS | [Supabase](../04-infraestrutura/SUPABASE.md) + [segurança](../04-infraestrutura/SEGURANCA_E_ACESSOS.md) |
| Deploy, DNS, SEO | [Vercel](../04-infraestrutura/VERCEL_DEPLOY_SEO.md) |
| CI, QA, falha de regressão | [testes](../05-operacao/TESTES_E_HOMOLOGACAO.md) |
| Recuperação de dados | [backup](../05-operacao/BACKUP_E_RECUPERACAO.md) |
| Retomar pendência antiga | [standby](BACKLOG_STANDBY.md) + [decisões](DECISOES_VIGENTES.md) |

## Incompatibilidades de relatórios anteriores já resolvidas
A RPC `save_section_block_atomic` **está instalada**; `media_assets.credit` **já não existe**; o staging aprovado é **local sintético**. P3 do SHA original teve FAILURE no budget mobile, embora o site já tenha sido aceito pelo proprietário. Não reabrir P0–P6 automaticamente.

Nunca copiar fontes privadas do Projeto ChatGPT, tokens, segredos, dumps, hashes privados de objetos ou arquivos de fonte para o repositório público. O inventário pré-consolidação está [preservado](../historico/preconsolidacao-2026-11-11/ESTADO_PRE_CONSOLIDACAO.md).
