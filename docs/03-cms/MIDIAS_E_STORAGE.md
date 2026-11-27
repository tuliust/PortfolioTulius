# Biblioteca de mídias e Storage

## Carregamento sob demanda da fotografia atual de Olá — 26/11/2026

O componente público `DeferredAboutTablet` mantém o caso anterior e reconhece também o PNG publicado `41687064-3d60-43c3-9ee2-ab52c8b609a8-Tulius---Foto-Profissional.png` em Olá mobile, reservando 1086×1448 e iniciando a requisição na aproximação de 600 px à viewport, com fallback de observador, lazy loading e prioridade baixa. Outras URLs continuam no caminho normal; PDF mantém o original. O alt e o enquadramento são os do CMS, sem substituição ou upload. Uma derivada WebP sem perdas foi ensaiada, mas não incorporada ao repositório ou publicada. [Testes](../05-operacao/TESTES_E_HOMOLOGACAO.md).

## Compressão de transporte exclusiva da tela mobile — 25/11/2026

Para a mesma URL exata do retrato atual, `ApprovedProfileImage` oferece `public/media/tulius-inicial-600.webp` somente em `screen and (max-width: 767px)`: 35.322 bytes, 600×800, WebP qualidade 90. Alfa idêntico ao PNG; RGB comprimido (RMS pré-multiplicado 0,986/255). Desktop e impressão usam a derivada sem perda descrita abaixo. Nenhuma substituição do original no CMS, upload ou alteração do enquadramento. O preload de build acompanha a mesma separação de viewport. Futuras URLs não reconhecidas usam o original CMS. [Evidências e limites](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Derivada sem perda do retrato publicado — 25/11/2026

`public/media/tulius-inicial-lossless.webp` é uma cópia de transporte da fotografia pública `51f7d981-6f63-453c-8575-a5dcbe409104-Tulius---Foto-Inicial.png`, sem upload nem alteração do catálogo/Storage. PNG SHA-256 `446ec5944c3249daf51de7938e653836aa5fa953329efa9beba6286030f1d9e6`, 375.258 bytes; WebP 198.360 bytes, 600×800. Verificação local confirmou canal alfa idêntico e RGB idêntico em todos os pixels com alfa positivo. O alfa original varia de 0 a 254. `ApprovedProfileImage` e `scripts/portrait-preload.mjs` reconhecem apenas essa URL exata; troca editorial futura usa o original publicado, sem reaproveitar esta cópia. Layout, cores e enquadramento preservados. O canal alfa foi agora inspecionado; as limitações históricas abaixo descrevem consultas anteriores. [Validação](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Retrato mobile e imagem de compartilhamento — 25/11/2026

O fundo grafite da moldura do Perfil público mobile foi removido por CSS; não se alterou o PNG, seu recorte nem o Storage. O canal alfa remoto não foi validado independentemente. O P3 posterior confirmou transparência computada da moldura em seis larguras mobile. SEO usa mídia pública `tulius-site-600.webp` para Open Graph e o favicon padrão `/favicon.png`; preservar a distinção entre esses campos. A recomendação OG continua 1200 × 630 px, não uma afirmação da dimensão do arquivo selecionado. [SEO](../04-infraestrutura/VERCEL_DEPLOY_SEO.md).

## Geometria da galeria pública — 25/11/2026

Mantém-se a referência administrativa de **1600 × 1600 px** para slides de imagem das seis experiências. O quadro público passa a ser 1:1 em desktop e mobile (desktop limitado simultaneamente pela largura da coluna e por `57svh`; mobile ocupa a largura disponível). `contain` preserva a imagem inteira; margens internas ainda podem existir para arquivos não quadrados ou enquadramento personalizado. Vídeos mantêm `cover` e podem sofrer recorte no quadro quadrado; fullscreen mantém `contain`. Nenhum upload, conversão, alteração de Storage, metadados ou campo administrativo decorre deste ajuste. Ver [Responsividade](../02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md).

## Upload administrativo de vídeos — 24/11/2026

Migration `20261124051349_portfolio_experience_videos.sql` aplicada e relida em produção: `portfolio-videos` público para reprodução, limite 50.000.000 bytes, somente `video/mp4`. A política `admins manage portfolio videos` restringe escrita a administradores autenticados pela guarda existente; catálogo admite o bucket apenas para MP4. Os dois buckets de imagens mantêm os limites e MIME anteriores. Antes/depois: 91 registros de mídia e 144 objetos dos buckets anteriores; novo bucket vazio. Objetos de vídeo tornam-se públicos no envio; salvar a ficha vincula ao slide. Remover o vínculo não exclui o arquivo; exclusão física de vídeo bloqueada na biblioteca. Incluir o novo bucket nos próximos backups; snapshots anteriores não cobrem vídeos. Upload real e autorização testados exclusivamente em ambiente sintético, sem objeto de teste em produção.

**Inventário de produção atualizado após uploads em 18/11/2026 (somente leitura):**
`media_assets` possui **90 registros publicados**. O Storage
contém **87 objetos** no bucket `portfolio-public` (13.105.754 bytes em metadados) e **56 objetos**
no bucket `portfolio-private` (2.840.299 bytes), totalizando **143 objetos físicos**
(15.946.053 bytes em metadados). A fotografia anterior do mesmo dia
registrou 87 mídias e 140 objetos (84 públicos + 56 privados); **não representa o inventário atual**.
Os inventários anteriores de 75/82 mídias e 128 objetos pertencem
a fotografias históricas. Não existe correspondência obrigatória
de 1:1 entre registros do catálogo e arquivos físicos.
Nenhuma gravação, exclusão ou alteração de mídia foi realizada
nesta conferência.

---

**Status:** preservação; limpeza não autorizada por este guia · **Revisão:** 18/11/2026.

| Origem | Quantidade | Acesso |
|---|---:|---|
| Bucket `portfolio-public` | 87 objetos | Público |
| Bucket `portfolio-private` | 56 objetos | Privado |
| `media_assets` | 90 registros publicados | Sob RLS |
| **Total Storage** | **143 objetos** | Público + privado |

A cópia privada de origem, a pública promovida e o catálogo podem não coincidir 1:1. Upload/promoção/exclusão incluem Storage e PostgreSQL **sem uma transação distribuída**. A remoção deve verificar referências e ter compensação/backup.

Nos logotipos das Experiências, `experienceMedia.logoAlt` é **opcional**. O `CompanyMark` exibe um logotipo sempre que há URL, com `alt=""` quando o nome da empresa já o acompanha e o texto alternativo não foi informado; na ausência de URL, exibe o monograma. Não há exigência de preencher alt para o logo ficar visível. `src/components/public/ExperienceStack.test.tsx` protege essa regra em desktop/mobile.

**Backup físico de 18/11/2026:** o proprietário apresentou log local do rclone com **143/143 arquivos transferidos** (87 públicos, 56 privados), `rclone check --download` com **0 diferenças e 143 correspondências**, contagem local de **15.946.053 bytes** e geração reportada de manifesto SHA-256 fora do Git. **Cópia primária: SUCCESS conforme evidência de terminal.** Inspeção independente do CSV, segunda cópia protegida e restauração de teste **não confirmadas**. A falha anterior de autorização da CLI não impediu a cópia por conexão S3 já existente; nenhuma política/objeto produtivo foi alterado para esse fim. [Detalhes no guia de backup](../05-operacao/BACKUP_E_RECUPERACAO.md).

`media_assets.alt_text` publicado é propagado para usos desktop/mobile pelo [`media-alt-sync.ts`](../../src/lib/media-alt-sync.ts), sem reescrever JSONB antigo. Ponto focal global tem efeito quando não há override de enquadramento por uso; URL externa/não catalogada mantém texto local. Pode ser necessário recarregar a página. A migration `20261110153000` retirou `media_assets.credit`.

Auditoria anterior aponta **19 SVGs** de versões diferentes entre Git e Storage e dois PNGs usados como logos, com proveniência/licença não certificadas. Preservar versões e originais privados, sem deduplicação automática. [Investigação original](../P1_INVESTIGACAO_HIGIENE_2026-10-28.md).

Backup histórico de 11/11: 128/128 objetos, 4.661.351 bytes; bytes e hashes individuais privados, fora do Git. [Recuperação](../05-operacao/BACKUP_E_RECUPERACAO.md). **Não excluir objetos ou executar workflows de mídia por tarefa documental.**

## Ícone do site (12/11/2026)

O favicon TT fornecido pelo proprietário é empacotado como `public/favicon.png`, com versão Apple 180×180 em `public/apple-touch-icon.png`. São arquivos estáticos versionados, não novos registros artificiais em `media_assets`. No admin, o seletor de favicon em SEO reutiliza `PublishedMediaPicker` e seu diálogo de upload/publicação; novos arquivos entram no bucket `portfolio-public` com metadados em `media_assets`, e a URL selecionada é salva em `site_settings.seo_json.faviconUrl`. Não modificar ou excluir mídias anteriores para ativar esse recurso. URLs inseguras são rejeitadas no runtime/build.

## Fotografia da seção “Olá!” — apresentação desktop em 12/11/2026

A intervenção **não realizou upload, substituição, exclusão, recorte, mudança de alt ou mudança de metadados da mídia**. A referência `aboutDesktopImage` publicada permanece a original; `aboutDesktopFraming` não foi persistido/alterado. O alinhamento na borda inferior decorre exclusivamente de `#sobre .about-portrait.has-custom-image img` em [`src/index.css`](../../src/index.css): deslocamento `top: clamp(2rem, 5.8dvh, 3.5rem)` dentro do contêiner que aplica `overflow:hidden`. Portanto, a caixa da imagem pode exceder a borda do quadro, mas seu desenho visível deve permanecer recortado na seção. O [smoke desktop](../05-operacao/TESTES_E_HOMOLOGACAO.md) conferiu a máscara, sem comprovar pixels transparentes em todos os aparelhos/zoom. O mobile mantém a imagem e enquadramento próprios; nenhuma operação no Storage deve ser executada para repetir esse ajuste.

## Dimensões de preparo e apresentação pública (17/11/2026)

Estas são **dimensões recomendadas de arquivo**, não garantias de dimensões existentes no Storage nem instruções para forçar pixels CSS. A transparência depende do arquivo original. Manter as mídias publicadas e seus alts, URLs e pontos focais.

| Uso | Desktop recomendado | Mobile recomendado | Formato / regra visual |
| --- | --- | --- | --- |
| Galerias de projetos, seis experiências | 1600 × 1600 px | Mesmo arquivo | WebP/PNG; quadro 1:1 e `contain`; arquivos não quadrados podem deixar margens |
| Perfil — abertura “+15 anos” | 1200 × 1600 px | Mesmo conteúdo, versão otimizada 900 × 1200 px | WebP/PNG; composição desktop aprovada e `contain` mobile |
| “Olá!” — foto com tablet | 1200 × 1600 px | 900 × 1200 px | PNG ou WebP com transparência; `contain`, máscara/deslocamento desktop existentes |
| Contato — foto com tablet | 1200 × 1600 px | Mesmo arquivo | PNG ou WebP com transparência; alinhamento desktop aprovado e `contain` mobile |
| Logotipos das empresas | 512 × 512 px se raster | Mesmo arquivo | Preferir SVG; `contain` preserva proporção |

A mudança de código afeta **somente** `.experience-media-frame > img` (`cover` → `contain`), sem criar novas cópias, processar uploads ou modificar dados. Consulta somente leitura ao Supabase em 17/11/2026 encontrou **19 slides** publicados nas seis experiências: todos com zoom **1×** e sem ponto focal deslocado. O CMS continua permitindo enquadramento/zoom explícito, que pode produzir corte intencional. O quadro responsivo e as demais fotografias são preservados.

## Ajuda contextual de tamanho no CMS (18/11/2026)

O seletor de mídias `PublishedMediaPicker` exibe, por ícone “i” ao lado do nome do campo, a dimensão recomendada específica de **galerias, logos, retratos de Perfil/Sobre/Contato, miniaturas e imagens de SEO**. A dica funciona com hover, clique/toque e ativação pelo teclado (Enter/Espaço); Esc fecha a dica aberta por clique. No mobile, o alvo conserva 44 px. As referências da tabela acima continuam **orientações de preparo**: não existe bloqueio por resolução, transformação automática, substituição de objetos ou alteração de metadata/Storage. Retratos transparentes devem conservar canal alfa e composição aprovada. Para SEO, acrescem referências próprias de Open Graph (1200 × 630 px) e favicon (512 × 512 px). Contrato de UI no [Guia administrativo](GUIA_ADMINISTRATIVO.md).
