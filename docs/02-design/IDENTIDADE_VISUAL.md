# Identidade visual e editorial
**Status:** identidade publicada aprovada · **Revisão:** 11/11/2026.

Direção editorial autoral: contraste entre claros, grafite e laranja; fotografia preto e branco, títulos condensados monumentais, selos circulares, números, filetes, setas e composições assimétricas. Não converter o site em template genérico.

## Paleta e fontes
Os materiais originais propuseram **valores de referência**: `#FF5414` (laranja), `#171617` (grafite), `#FAFAFA`/`#F8F4F1` (claros), `#514742` (texto secundário), `#BC390C` (contraste para textos menores). Esses valores **não provam que sejam os tokens atuais**. Conferir [`src/index.css`](../../src/index.css), [`defaultTokens.ts`](../../src/content/defaultTokens.ts), `design_tokens` e [inventário de estilos](../INVENTARIO_ESTILOS_BASELINE_2026-11-07.md).

Famílias citadas nas fontes de criação: Heading Now, Big Shoulders/Big Shoulders Display, Neue Montreal, Inter. Não publicar arquivos tipográficos nem pressupor licença de fonte trial; conferir o CSS efetivo.

## Composições
Abertura com nome monumental, retrato, indicador de experiência, selo laranja, cinco áreas de atuação e destaques; composição Editorial 360° própria do mobile. Experiências com logos, projetos, trajetória e slides, vinculados ao CMS. O Canva/PDF/Figma original foi referência criativa, mas **a versão atualmente publicada, já aceita, tem precedência** sobre prints antigos. As [especificações Figma Make originais](../historico/figma-make-2026-11-11/README.md) foram arquivadas e **não constituem dependência atual**.

## Regras
Antes de modificar visual, localizar CSS/renderer/tokens e verificar desktop/mobile, altura baixa, foco, contraste e `prefers-reduced-motion`. Não redesenhar ou substituir mídia por inferência. [Responsividade](RESPONSIVIDADE_E_ACESSIBILIDADE.md), [referências visuais](../baselines/2026-11-07/REFERENCIAS_VISUAIS.md).

## Cinza claro da faixa do selo (12/11/2026)

O token canônico `color.lightGray` (nome exibido **Cinza claro**, referência `#ECECEC`) complementa os sete tons existentes sem alterar Creme (`#F8F4F1`) ou Papel (`#FAFAFA`). É administrado em **Identidade → Cores da marca** e persistido em `design_tokens` com `status=published`, `scope=global` e `value_type=color`. O renderer expõe `--light-gray` a partir do valor publicado e aplica a referência apenas à faixa de selo de Perfil/B **no mobile**, mantendo o fundo branco abaixo da linha laranja. Não altera as cores do desktop nem outras seções.

## Hierarquia tipográfica desktop — 12/11/2026

A frase do Perfil, os destaques, os títulos das empresas e a Formação usam fontes e cores já aprovadas, com tamanhos maiores exclusivos do desktop. Os valores são controlados por campos de estilo desktop existentes/expandidos no CMS; não há novos arquivos tipográficos. A foto de Sobre permanece a mesma mídia, com correção geométrica somente no desktop.

### Escala desktop — valores atuais após 13/11/2026

A escala abaixo está **persistida** nos blocos de conteúdo existentes (não em novos tokens globais); apenas o layout de Resultados e a foto de Sobre são correções geométricas em CSS:

| Elemento | Valor publicado | Referência |
|---|---:|---|
| Frase “Foco em gerar conexões autênticas e projetos inovadores.” | 20 px (vigente em 13/11/2026) | `perfil` A, `items[0].hero.desktop.introSize` |
| Quatro destaques laterais: título / texto / espaçamento | 13 px / 15 px / 10 px (vigentes em 13/11/2026) | `perfil` A, `items[1..4].desktop` |
| Títulos das seis empresas (Invest RS, Prefeitura etc.) | 23 px | `perfil` B, `items[5..10].desktop.titleSize` |
| Três títulos de cursos | 30 px | `formacao` bloco 1, `items[0..2].desktop.titleSize` |
| Duas instituições de idiomas | 29 px | `formacao` bloco 2, `items[0..1].desktop.titleSize` |

Cores, famílias tipográficas, conteúdo, logo e fotos originais não foram substituídos. O CMS pode modificar esses tamanhos desktop sem atualizar o campo mobile. As regras CSS devem permanecer subordinadas aos valores desktop explícitos. A foto de Sobre usa deslocamento vertical **dentro do contêiner com máscara**; não há crop salvo no Storage. Referência visual e evidências em [Responsividade](RESPONSIVIDADE_E_ACESSIBILIDADE.md).

## Histórico: primeira redução da tipografia do Perfil desktop — 13/11/2026

No bloco A publicado de `perfil` (`content_blocks.id = a2f4770b-7964-4f3c-b816-c778b66ac15c`), os valores do CMS foram alterados em produção, preservando os campos mobile e o restante do JSONB: `items[0].hero.desktop.introSize: 24 → 22`; `items[1..4].desktop.titleSize: 17 → 16`; `items[1..4].desktop.textSize: 16 → 15`. `items[1..4].desktop.spacing` continua 2 px. Aplicação por atualização condicionada do registro publicado e releitura dos valores via retorno do banco em 13/11/2026; nenhuma mudança no CSS, nas famílias tipográficas, nas cores, na coluna direita ou em outras seções. A renderização lê essas propriedades desktop pelo `ProfileDesktop` e por `itemStyle` em `src/components/public/PublicSite.tsx`; os seletores desktop existentes em `src/index.css` usam as variáveis do CMS. Esta alteração foi editorial no Supabase, sem novo build do frontend.

## Ajuste adicional da hierarquia e do respiro dos destaques — 13/11/2026

No bloco A publicado de `perfil` (`content_blocks.id = a2f4770b-7964-4f3c-b816-c778b66ac15c`), a pedido do proprietário, os campos específicos do **desktop** passaram de `hero.desktop.introSize = 22` para **20 px** e de `items[1..4].desktop.titleSize = 16` para **13 px**. As quatro descrições continuam em **15 px** (`desktop.textSize`). Para separar os itens verticalmente abaixo de cada descrição branca, o controle `items[1..4].desktop.spacing` passou de **2 px para 10 px**. Esse último campo é consumido como `--item-desktop-spacing` no CSS e aplicado ao preenchimento vertical de cada destaque; não se trata de margem independente só no lado inferior. Os quatro itens e sua ordem foram preservados.

A atualização foi restrita ao JSONB do bloco A publicado no Supabase de produção, com condição de versão e releitura dos valores por `UPDATE ... RETURNING`. Sem mudanças de CSS, esquemas, conteúdo compartilhado ou propriedades mobile, sem modificação da coluna direita ou de outras seções. Este é o estado **vigente**; os valores 22/16/15/2 acima referem-se à primeira revisão do mesmo dia, preservada como histórico.
