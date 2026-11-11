# Biblioteca de mídias e Storage
**Status:** preservação; limpeza não autorizada por este guia · **Revisão:** 11/11/2026.

| Origem | Quantidade | Acesso |
|---|---:|---|
| Bucket `portfolio-public` | 72 objetos | Público |
| Bucket `portfolio-private` | 56 objetos | Privado |
| `media_assets` | 75 registros | Sob RLS |

A cópia privada de origem, a pública promovida e o catálogo podem não coincidir 1:1. Upload/promoção/exclusão incluem Storage e PostgreSQL **sem uma transação distribuída**. A remoção deve verificar referências e ter compensação/backup.

`media_assets.alt_text` publicado é propagado para usos desktop/mobile pelo [`media-alt-sync.ts`](../../src/lib/media-alt-sync.ts), sem reescrever JSONB antigo. Ponto focal global tem efeito quando não há override de enquadramento por uso; URL externa/não catalogada mantém texto local. Pode ser necessário recarregar a página. A migration `20261110153000` retirou `media_assets.credit`.

Auditoria anterior aponta **19 SVGs** de versões diferentes entre Git e Storage e dois PNGs usados como logos, com proveniência/licença não certificadas. Preservar versões e originais privados, sem deduplicação automática. [Investigação original](../P1_INVESTIGACAO_HIGIENE_2026-10-28.md).

Backup histórico de 11/11: 128/128 objetos, 4.661.351 bytes; bytes e hashes individuais privados, fora do Git. [Recuperação](../05-operacao/BACKUP_E_RECUPERACAO.md). **Não excluir objetos ou executar workflows de mídia por tarefa documental.**
