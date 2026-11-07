# Etapa 2 — Identidade como biblioteca central de estilos

**Execução:** 07/11/2026. **Autorização:** pedido explícito de executar a próxima etapa após o inventário. **Origem visual intacta:** [SHA funcional `207327b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/207327b1ebe974e768a81f752fe1184249d210ba). **Migração do Supabase aplicada:** `20261107042248_identity_catalog_stage2`. **Etapas 3–5 não iniciadas.**

## Contrato implementado

A área **Identidade** do CMS passa a carregar um catálogo persistido em `public.design_tokens`, com:
- **7 cores** identificadas por nomes editáveis, incluindo `color.white=#FFFFFF`. A edição dos valores HEX ocorre exclusivamente em Identidade nesta etapa; os demais formulários serão atualizados na Etapa 3.
- **3 famílias autorizadas:** Big Shoulders Display, Inter e Georgia, com rótulos editáveis e vínculos técnicos estáveis. Os dois tokens globais originais permanecem com valores idênticos.
- **7 estilos tipográficos semânticos iniciais:** Nome principal, Título editorial, Título de seção, Título de card, Subtítulo, Texto de apoio e Legenda. **Não** são 159 estilos. As 159 expressões CSS originais continuam no inventário e não foram simplificadas automaticamente.
- **Seletores numéricos desktop/mobile** nas definições de estilo; cada número representa limite ou referência da regra CSS, não tamanho fixo para todos os viewports. Valores originais irregulares (por exemplo 18,4; 18,88; 60,8; 124,8) são preservados e oferecidos na seleção.
- **Fontes e cores associadas aos estilos por chave estável**, com exibição do nome cadastrado e indicação de CSS de referência para o editor não confundir tamanho máximo com tamanho calculado.
- **Parâmetros de layout e movimento existentes** continuam editáveis e preservados.

Cada token mantém `token_key` como identificador estável. O nome editável é armazenado na coluna **`display_name`**. Metadados específicos (fonte/cor vinculada, referência desktop/mobile, expressões CSS de origem e status da associação) são armazenados em **`style_config jsonb`**. As verificações do banco limitam nome a 1–90 caracteres e impõem `style_config` do tipo objeto.

## Compatibilidade e preservação da página pública

- Foram mantidos os **12 valores de `token_value` publicados antes da Etapa 2**. A migração só acrescentou rótulos e novas linhas; não alterou a paleta, as famílias base, a duração de movimento, o layout nem o espaçamento atuais.
- Foram adicionados **9 tokens**: `color.white`, `font.serif` e 7 `typography.*`, totalizando **21** entradas.
- `usePortfolio.ts` interpreta somente a lista restrita de seis cores e dois tokens de fonte já existentes. **Nenhum novo token tipográfico é aplicado à página pública automaticamente.**
- Nenhum seletor do site, CSS responsivo, markup público, fotografia ou conteúdo editorial foi alterado.
- Os estilos são **catálogo disponível para vinculação futura**, não uma migração de 159 valores CSS nem substituição do design. O vínculo entre campo específico do Editor do Site e estilo cadastrado pertence à Etapa 3.
- A alteração deliberada de um token **global** existente (por exemplo `color.orange` ou `font.heading`) continuará afetando o site, como já ocorria. A migração não realizou essa mudança.

## Persistência no CMS

O editor de Identidade carrega `token_key,token_value,value_type,scope,status,display_name,style_config` via Supabase, altera os controles locais, mostra alterações não salvas, grava **apenas os registros modificados** e relê os mesmos registros depois do upsert antes de informar sucesso.

Valores inválidos de cor, família ou tamanho não são aceitos pelo validador. O módulo continua integrado ao controle global de navegação com mudanças pendentes e é remontado ao reentrar, para não manter rascunhos descartados.

## Estrutura de dados e versionamento

- [Migração SQL exata aplicada](../supabase/migrations/20261107042248_identity_catalog_stage2.sql) — versão obtida do histórico real de produção, sem alteração de RLS.
- [Implementação do catálogo](../src/lib/identity-catalog.ts), [editor administrativo](../src/components/admin/IdentityCatalogEditor.tsx) e [estilo exclusivamente administrativo](../src/components/admin/IdentityCatalogEditor.css).
- [Inventário anterior](INVENTARIO_ESTILOS_BASELINE_2026-11-07.md) e [snapshot dos dados antigos](baselines/2026-11-07/cms-estilos-supabase.json) mantidos integralmente.

## Homologação e limitações

O histórico do banco confirma a execução da migração `20261107042248`, e a releitura de `design_tokens` retornou **21/21 registros**, incluindo os 12 valores legados intactos. A homologação do formulário administrativo **com uma sessão autenticada real**, inclusive salvamento/releitura após interação humana, deverá ser executada antes de declarar aceite transacional completo.

As comparações visuais automatizadas e os gates de CI são evidências específicas do SHA em que rodarem; não afirmar homologação visual completa por existir migração ou código compilado.

## Próxima etapa, não executada

**Etapa 3 — Editor do Site:** passar a escolher nomes de cores e fontes e tamanhos numéricos do catálogo, mantendo seleção de estilo padrão ou override; corrigir Título do Perfil/header, Transições, Arquivar/Exibir, rótulos dos painéis e simplificação de controles.
