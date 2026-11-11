# Origem histórica: Figma Make — arquivamento de 11/11/2026

**Estado: histórico não operacional.** Esta pasta conserva as especificações originais utilizadas durante a concepção no Figma Make, antes de a aplicação React/Vite/Supabase ser concluída e aprovada. Elas **não são instruções atuais**, não devem disparar novas implementações e não determinam comportamento do site.

| Origem anterior | Cópia íntegra por Git blob | SHA original |
|---|---|---|
| [`guidelines.md`](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/952a959d5a5279167a6cc615494311b1cc39be34/guidelines.md) (raiz) | [Documento original](guidelines.md) | `68a66037933238ce0b83c704b3db35ff127dcdd6` |
| [`plans/auditoria-portfolio-tulius.md`](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/952a959d5a5279167a6cc615494311b1cc39be34/plans/auditoria-portfolio-tulius.md) | [Auditoria original](auditoria-portfolio-tulius.md) | `3862650ccfd82cea61e806caec201b47996b4cb0` |

Os dois Markdown foram arquivados **byte a byte** (sem reescrever conteúdo, histórico ou SHA Git). Como os caminhos foram alterados, referências relativas **dentro das cópias** podem não funcionar; usar os permalinks ao commit `952a959d5a5279167a6cc615494311b1cc39be34` acima para navegar pelos links no contexto original. Os guias canônicos atualizados estão em [documentação vigente](../../README.md), não aqui.

## Resíduo de configuração autogerada

O arquivo `utils/supabase/info.tsx` (blob original `344494b403d4754b575f033000be0c2f3ab669c7`) foi retirado **sem cópia na documentação**, pois continha um identificador de projeto e uma chave publicável Supabase embutidos. O repositório usa `src/lib/supabase.ts` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` por ambiente, sem necessidade desse arquivo autogerado. O blob antigo continua consultável em versões históricas do Git, que não foram reescritas. Uma chave publicável não é `service_role`, mas seu valor não deve ser repetido em guias.

## O que permaneceu

- **Figma como ferramenta profissional**: `src/content/fallback.ts`, `src/components/public/ToolIcons.tsx` e `src/lib/icon-catalog.ts` mantidos. A ferramenta pertence ao currículo/catálogo visual, não ao build da aplicação.
- **Identidade visual**: código, `src/index.css`, tokens, assets e telas públicas intactos.
- **Operação**: `src/lib/supabase.ts`, `supabase/`, workflows e configuração Vercel preservados.
- **Segurança e rastreabilidade**: sem excluir banco, dados de usuários, buckets ou modificar histórico Git.

[Índice do arquivo histórico](../README.md) · [Identidade visual vigente](../../02-design/IDENTIDADE_VISUAL.md) · [Arquitetura vigente](../../01-projeto/ARQUITETURA.md) · [Protocolo de documentação](../../06-governanca/PROTOCOLO_ATUALIZACAO_DOCUMENTAL.md).
