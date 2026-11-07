# Perfil — composição Editorial 360° exclusiva do mobile

**Novo escopo autorizado:** 06/11/2026. **Seção:** `#perfil-a`, sem alteração da composição desktop ou do segundo painel `#perfil-b`.

## Contrato de exibição

A nova variante é ativada apenas quando `content_blocks.content_json.items[0].hero.mobileEditorial.enabled` é `true`. Ausente ou `false`, preserva a abertura mobile anterior. O desktop continua usando `ProfileDesktop` e não consulta as opções da nova variante.

1. **Área superior (grafite):** título editorial próprio do mobile, inicialmente com as linhas `CONEXÕES`, `AUTÊNTICAS.`, `INOVAÇÃO.` (a última em laranja), seguido do complemento da linha editorial em `sections.eyebrow` após o primeiro separador ` · `. A expressão `Comunicação Corporativa e Institucional` não é reproduzida. A introdução `sections.intro` permanece no banco e no desktop, mas não é exibida neste layout mobile.
2. **Área central (laranja):** o componente SVG `Badge360`, com texto circular e seta diagonal. Inscrição, fonte, tamanho, cor, fundo e visibilidade possuem controles móveis independentes.
3. **Área inferior (papel claro):** imagem exclusiva escolhida na Biblioteca de Mídia, o nome compartilhado de `sections.title`, o indicador `+15 ANOS` e a descrição do primeiro item do painel A. O botão circular (sem texto visível) mantém o destino `#perfil-b`. Se ainda não houver foto móvel exclusiva cadastrada, a imagem publicada do perfil é um fallback temporário; isso não deve ser confundido com foto nova já aprovada.

A composição tem altura natural, sem forçar o conteúdo das três áreas dentro de um único viewport. O header escuro se aplica somente enquanto o painel `#perfil-a` estiver visível; o painel B preserva seu fundo claro. Sob `prefers-reduced-motion`, a dica da seta deixa de animar.

## Dados, CMS e persistência

Não foram necessárias colunas, tabelas, buckets ou migrations. O objeto `hero.mobileEditorial` é uma nova propriedade estruturada do JSONB de conteúdo já existente, salva pela RPC administrativa `save_content_block_atomic`. Campos:

- `enabled`, `headline`, `badgeText`.
- `mobileImage`, `mobileAlt`, `mobileFraming` (foto independente; seleção/publicação pela Biblioteca de Mídia existente).
- `top`: `background`, `fontFamily`, `supportFontFamily`, `textColor`, `accentColor`, `supportColor`, `headlineSize`, `paddingY`, `showHeadline`, `showSupport`.
- `middle`: `background`, `fontFamily`, `textColor`, `badgeSize`, `paddingY`, `showBadge`.
- `bottom`: `background`, `fontFamily`, `descriptionFontFamily`, `textColor`, `accentColor`, `descriptionColor`, `photoWidth`, `nameSize`, `yearsSize`, `paddingY`, `showPhoto`, `showName`, `showExperience`, `showArrow`.

Os valores padrão ficam em `src/lib/mobile-profile-editorial.ts`; as famílias de fonte são selecionadas dentre Big Shoulders Display, Inter e Georgia. O acesso administrativo é `/admin` → seção **Perfil** → **Blocos e painéis** → **Painel A** → **Item 01** → **Abertura Editorial 360° — somente mobile**. O nome, a descrição profissional, o histórico de projetos e as demais seções continuam compartilhados e não são copiados.

## Restrições e verificação

- Não modificar a imagem desktop, seu texto, a composição das colunas ou `#perfil-b`.
- Não criar fotografia sintética nem gravar a imagem de referência como foto publicada.
- Não executar limpeza de Storage, alterações de RLS/Auth, configurações Vercel, migrations ou mudanças SEO.
- Verificar `pnpm check`, prévia desktop/mobile, largura 320/360/390/430 px, rolagem, selo, fontes, botão `#perfil-b`, seleção e remoção da fotografia exclusiva, persistência e recuperação pelo CMS. Um CI bem-sucedido não substitui teste visual nem fluxo de gravação com JWT real.

**Situação das provas:** implementação e configuração inicial sob execução em 06/11/2026. Não interpretar este documento como laudo de homologação até o relatório do SHA e dos testes correspondentes.
