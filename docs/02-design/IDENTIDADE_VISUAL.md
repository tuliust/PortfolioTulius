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
