# Protocolo permanente de atualização documental

**Status:** regra operacional vigente para futuras intervenções no `PortfolioTulius`. **Natureza:** instrução de manutenção, não job agendado, não execução automática de backlog. Aplicável a ChatGPT, ChatGPT Work, Codex, VS Code e qualquer agente/colaborador que modifique o projeto.

## Objetivo

Manter código, CMS, produção e a documentação **coerentes após cada mudança material efetivamente executada**, sem depender da atualização periódica das instruções do Projeto ChatGPT. O índice estável [`docs/README.md`](../README.md) identifica o guia canônico por assunto; [`AGENTS.md`](../../AGENTS.md) continua sendo a regra inicial dos agentes.

## Regra obrigatória de conclusão

**Uma mudança relevante não está pronta para entrega até que o guia canônico correspondente esteja atualizado e a atualização seja verificada.** Não criar relatórios avulsos concorrentes com a documentação vigente.

1. **Antes de agir:** verificar `git status -sb`, `main`/SHA, `AGENTS.md`, [índice](../README.md), documento temático, código/banco/deploy real relevante. Distinguir alterações do usuário de trabalho próprio; não sobrescrever mudanças preexistentes.
2. **Durante a implementação:** determinar quais contratos são afetados: interface, design, CMS/campos, SQL/RPC/RLS, mídia, integração, SEO, operações, segurança, testes ou decisões. Marcar quais documentos terão de mudar.
3. **Após executar e testar:** atualizar **os guias afetados** no mesmo trabalho, em linguagem de *estado atual*, com comportamento efetivo, caminhos, novos campos/padrões, limitações, testes e riscos. Registrar data e SHA/ambiente da evidência, **não** uma lista genérica de tarefas. Preservar a documentação histórica e as decisões não revogadas.
4. **Mudanças de código no GitHub:** incluir as atualizações Markdown **no mesmo commit funcional, sempre que viável**, ou em commit documental imediatamente consecutivo e associado ao SHA funcional. Conferir diff, links internos, lint/testes relevantes, GitHub Actions e deploy por SHA.
5. **Mudanças externas sem alteração de código** (CMS Supabase, domínio/configuração Vercel, parâmetros autorizados): criar commit exclusivamente documental na `main`, indicando serviço, data/ambiente, escopo e evidência, sem copiar credenciais ou dados pessoais. Não forçar deploy nem modificar infraestrutura só para produzir documentação.
6. **Mudanças apenas editoriais de rotina** (por exemplo, correção simples de texto em um único registro existente): não exigir reescrita de documentação se contratos, padrão, esquema, conteúdo-modelo ou instruções operacionais **não mudaram**; registrar a conclusão e evidência no contexto da tarefa.
7. **Se a alteração não foi executada ou comprovada:** não atualizar guias como se estivesse em produção. Manter como proposta, diagnóstico ou item de standby, conforme decisão do proprietário.
8. **Se não houver acesso de escrita/ambiente:** informar precisamente o que não foi atualizado e fornecer o conteúdo/patch para aplicação. **Nunca afirmar sincronização automática só por ter respondido na conversa.**

## Roteamento dos assuntos

| Mudança efetivamente feita | Atualizar primeiramente |
|---|---|
| Componentes, rotas, dados/fonte de verdade | [Arquitetura](../01-projeto/ARQUITETURA.md) |
| Paleta, fonte, fotografias, tokens, linguagem visual | [Identidade visual](../02-design/IDENTIDADE_VISUAL.md) |
| Layout desktop/mobile, navegação, UX/A11y/motion | [Responsividade](../02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) |
| Telas, ações, experiência do editor | [Guia CMS](../03-cms/GUIA_ADMINISTRATIVO.md) |
| Campos, JSONB, coleções e renderer | [Modelo de dados](../03-cms/MODELO_DE_DADOS.md) |
| Upload, metadados e Storage | [Mídias](../03-cms/MIDIAS_E_STORAGE.md) |
| Migrations, banco, Auth, RPCs, RLS | [Supabase](../04-infraestrutura/SUPABASE.md) e, quando pertinente, [segurança](../04-infraestrutura/SEGURANCA_E_ACESSOS.md) |
| Vercel, domínio, build e SEO | [Vercel](../04-infraestrutura/VERCEL_DEPLOY_SEO.md) e [configurações](CONFIGURACOES_E_INTEGRACOES.md) |
| CI, metodologia ou resultados de validação | [Testes](../05-operacao/TESTES_E_HOMOLOGACAO.md) |
| Backups, restore, retenção | [Backup e recuperação](../05-operacao/BACKUP_E_RECUPERACAO.md) |
| Nova decisão, autorização ou suspensão | [Decisões vigentes](DECISOES_VIGENTES.md) e [backlog standby](BACKLOG_STANDBY.md), conforme aplicável |

Se a mudança alterar **o mapa documental**, atualizar também [`docs/README.md`](../README.md), o [guia para IA](GUIA_USO_POR_IA.md) e, apenas se necessário, [`AGENTS.md`](../../AGENTS.md). Não modificar o termo histórico de encerramento das etapas 01–05; novos ciclos têm seus próprios SHAs.

## Fontes privadas do Projeto ChatGPT

As cinco fontes Markdown anexadas ao Projeto ChatGPT são **snapshots privados**, não links sincronizados com o GitHub. O protocolo de manutenção e as informações técnicas públicas atualizadas ficam **no GitHub**; em caso de divergência, consultar a `main` e os serviços efetivos por SHA antes de usar anexos antigos.

Se houver nova informação **privada de produto** que não possa ir ao GitHub, consolidar o arquivo privado temático pertinente e indicar expressamente a necessidade de substituí-lo nas Fontes do projeto. Não publicar links privados, backups, tokens, dumps, fontes tipográficas ou informações confidenciais em repositório público.

## Checagem para encerrar cada intervenção

- [ ] Mudança pedida realmente executada, escopo preservado e evidência identificada.
- [ ] Guias afetados atualizados, sem criar versões contraditórias.
- [ ] Links, caminhos, exemplos e contratos conferidos no SHA pertinente.
- [ ] Testes/CI e deployment reportados com **SUCCESS**, **FAILURE**, **pendente** ou **não executado** conforme observado.
- [ ] Nenhum segredo ou arquivo privado publicado; riscos e standby preservados.
- [ ] Resposta final informa **o que mudou**, **qual commit**, **quais guias foram atualizados** e **o que ficou pendente**.

**Nota:** a regra cria um dever de execução **quando houver uma intervenção**, e não um processo autônomo em segundo plano. Nada será alterado apenas porque uma conversa foi aberta.
