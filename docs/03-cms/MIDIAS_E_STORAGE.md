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

## Ícone do site (12/11/2026)

O favicon TT fornecido pelo proprietário é empacotado como `public/favicon.png`, com versão Apple 180×180 em `public/apple-touch-icon.png`. São arquivos estáticos versionados, não novos registros artificiais em `media_assets`. No admin, o seletor de favicon em SEO reutiliza `PublishedMediaPicker` e seu diálogo de upload/publicação; novos arquivos entram no bucket `portfolio-public` com metadados em `media_assets`, e a URL selecionada é salva em `site_settings.seo_json.faviconUrl`. Não modificar ou excluir mídias anteriores para ativar esse recurso. URLs inseguras são rejeitadas no runtime/build.

## Fotografia da seção “Olá!” — apresentação desktop em 12/11/2026

A intervenção **não realizou upload, substituição, exclusão, recorte, mudança de alt ou mudança de metadados da mídia**. A referência `aboutDesktopImage` publicada permanece a original; `aboutDesktopFraming` não foi persistido/alterado. O alinhamento na borda inferior decorre exclusivamente de `#sobre .about-portrait.has-custom-image img` em [`src/index.css`](../../src/index.css): deslocamento `top: clamp(2rem, 5.8dvh, 3.5rem)` dentro do contêiner que aplica `overflow:hidden`. Portanto, a caixa da imagem pode exceder a borda do quadro, mas seu desenho visível deve permanecer recortado na seção. O [smoke desktop](../05-operacao/TESTES_E_HOMOLOGACAO.md) conferiu a máscara, sem comprovar pixels transparentes em todos os aparelhos/zoom. O mobile mantém a imagem e enquadramento próprios; nenhuma operação no Storage deve ser executada para repetir esse ajuste.
