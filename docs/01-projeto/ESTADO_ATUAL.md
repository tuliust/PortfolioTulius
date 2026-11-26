# Estado atual — PortfolioTulius

## Revalidação técnica — 26/11/2026

SHA funcional `2982583`: Production READY, Validate, Export Docs e P3 SUCCESS; zero falhas browser, LCP mobile 3,237 s e desktop 1,023 s (medianas). A caixa da fotografia de Contato coincide com a divisória nas três larguras auditadas em produção. P5 Read-Only FAILURE por timeout durante descarte em Depoimentos, antes do novo teste de Olá. Ajustada a sequência P5 para aguardar a ativação do módulo após descartar alterações, antes de voltar ao anterior; os três fluxos de descarte mantêm as verificações e proteção contra gravação. A nova CI ainda precisa confirmar o resultado. [Evidências por SHA](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Ajustes de auditoria autorizados — 26/11/2026

Atualização restrita aos scripts P3/P5: verificação real dos dois seletores de fotografia de Olá, sem gravações, e contrato de alinhamento de Contato à divisória computada. P3 aguarda composição CMS nas matrizes afetadas e reconfirma o SHA servido antes de cada nova página e ao finalizar, para impedir atribuição de resultados após publicação concorrente. Meta LCP, critérios anteriores não afetados, interface, dados e infraestrutura preservados. Nova CI/homologação por SHA ainda não confirmada. [Testes e limites](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Manutenção pontual de 26/11/2026 — retratos mobile e CMS

Referência funcional atual: [0314101](https://github.com/tuliust/PortfolioTulius/commit/03141016fcc0911f73388f9e785f87cc8ea3171a), na `main`, com Production READY e domínio `tulius.work` vinculado ao mesmo SHA, confirmado via consulta Vercel. As intervenções sucedem a correção técnica de 25/11 (preservada abaixo).

- [535df8d](https://github.com/tuliust/PortfolioTulius/commit/535df8d55f701c649c991844a9d0e3d5296b6cf5): retrato da abertura Hero mobile ancorado à direita da moldura no enquadramento horizontal neutro, deslocando a imagem para a esquerda quando há corte horizontal.
- [d3e45c6](https://github.com/tuliust/PortfolioTulius/commit/d3e45c68a608fa21a25e1fa68565e39eefaefd7c): retrato de Contato mobile alinhado à transição laranja/grafite; reversão do ajuste equivocadamente aplicado a Olá em [1c54047](https://github.com/tuliust/PortfolioTulius/commit/1c54047c88d2af51477459b08252033952240fbf). Hero, desktop e PDF preservados.
- [0314101](https://github.com/tuliust/PortfolioTulius/commit/03141016fcc0911f73388f9e785f87cc8ea3171a): **Editor do site → Olá! → Centro** com seletores independentes de fotografia desktop e mobile, sobre os campos já existentes. Nenhuma migration, escrita direta no banco, alteração de Auth/RLS/Storage, mídia original ou configuração Vercel nesta rodada.

Consulta somente leitura posterior confirmou imagens presentes nos blocos A publicados de Perfil, Sobre e Contato; os dois campos de Sobre estão preenchidos e apontam à mesma referência no momento desta consulta. Isso não prova o mecanismo de uma edição autenticada; o editor permite escolher referências diferentes. Nenhuma gravação foi feita nesta consolidação.

**Qualidade:** Validate e Export Docs SUCCESS nos quatro commits; P3 e PDF QA SUCCESS em `535df8d`; P3 SUCCESS em `1c54047` (ajuste depois revertido). P3 FAILURE em `d3e45c6` por seis timeouts de navegador, apesar de orçamento de performance PASS (LCP mobile mediano 3,325 s). No SHA funcional atual, Validate, Export Docs e P5 local sintético SUCCESS; P5 Admin Read-Only FAILURE por expectativa anterior do editor de Olá, que não reconhece o novo título/contrato. Não há nova P3 ou QA PDF nesse SHA. Inspeção visual no iPhone, reconfirmação de P3 e atualização/validação do contrato P5 continuam pendentes; não inferir aprovação do deployment READY. [Matriz por SHA](../05-operacao/TESTES_E_HOMOLOGACAO.md) · [Publicação](../04-infraestrutura/VERCEL_DEPLOY_SEO.md) · [Responsividade](../02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) · [CMS](../03-cms/GUIA_ADMINISTRATIVO.md).


## Estado técnico após correção autorizada — 25/11/2026

Referência funcional **[`65b9e69`](https://github.com/tuliust/PortfolioTulius/commit/65b9e69ba3cc875ca4960cd71ac1e7eed9d5dd53)**, posterior à consolidação documental abaixo. **P3 SUCCESS** ([#45704116739](https://github.com/tuliust/PortfolioTulius/actions/runs/45704116739)): browser com **zero falhas**, 30/30 transições; LCP mobile **3,134 s** (meta ≤3,5 s), desktop **0,881 s**. Performance 92/99; acessibilidade, SEO e boas práticas 100 em todas as amostras. Validate e Export Docs SUCCESS; PDF QA sintética **SUCCESS** no mesmo SHA. Production `dpl_8eKAE5yECdKaiHvbLvAV1paPUs7u` **READY**, SHA confirmado pelo gate do domínio.

Correções efetivas: imagem de transporte mobile de 35.322 bytes, transparência preservada e desktop/impressão sem perda; descoberta antecipada das mesmas fontes; snap desktop nos marcadores estáticos para evitar desvio da caixa animada; testes coerentes com IDs, flags e títulos do CMS atual. O experimento de espera no hook foi removido. Textos, design, animações e dados preservados. Nenhuma escrita em Supabase ou configuração de infraestrutura. Validação local SUCCESS (311 testes). [Evidências completas e limites](../05-operacao/TESTES_E_HOMOLOGACAO.md).

A P3 está vinculada ao SHA funcional; eventual HEAD documental posterior precisa de conferência própria de CI/deployment e não constitui nova medição. A consolidação e os riscos históricos abaixo permanecem datados; não reclassificar falhas antigas nem considerar os demais itens standby encerrados.


**Consolidação de 25/11/2026.** Referência funcional `444fee647f96adf61ce72f9a2c07f3ec4af1cc4b`, consultada antes deste commit documental. O produto permanece em manutenção pontual; o histórico de aceites não equivale a homologação automática de alterações posteriores.

## Publicação e qualidade

Vercel Production [dpl_9dpicxsm3zgWuBiE4zwAZfL8EqJB](https://vercel.com/tuliust/portfolio-tulius/9dpicxsm3zgWuBiE4zwAZfL8EqJB) **READY**, aliases `tulius.work` e `www.tulius.work`, SHA funcional `444fee647f96adf61ce72f9a2c07f3ec4af1cc4b`. A consulta administrativa e o gate P3 comprovaram o mesmo SHA servido. O próximo commit exclusivamente documental pode gerar novo deployment; conferir separadamente.

[P3 #45691463355](https://github.com/tuliust/PortfolioTulius/actions/runs/45691463355) confirmou `P3_DEPLOYMENT_GATE` para `444fee647f96adf61ce72f9a2c07f3ec4af1cc4b` em produção. Evidências parciais **PASS**: 30/30 transições bidirecionais, máscara do cabeçalho na Prefeitura e CDI, molduras quadradas e centralizadas nos dez viewports desktop (incluindo 900 × 600), transparência computada da foto nos seis viewports mobile (320, 360, 375, 390, 414 e 430 px), paridade SEO (incluindo `ogImage`) e leitura pública RLS. **P3 global FAILURE**: cinco falhas no browser; entre elas, timeout de controles de slide e seletor de projeto Invest RS não encontrado. LCP mobile mediano **5.313,371 ms** (meta ≤3.500 ms; amostras 5.445,061 / 5.313,371 / 5.285,598 ms), desktop **1.181,706 ms** PASS. Não atribuir a piora à foto ou a um commit sem investigação específica. Em `a21c55f`, o P3 falhou no teste de navegação por timeout e registrou cinco falhas de browser, apesar do LCP mobile de 3.390,356 ms PASS; a verificação posterior de 30/30 em produção é evidência nova, não reclassificação do run anterior. Canal alfa do PNG, WhatsApp em dispositivo real, aceite visual final e PDF real após as alterações de 25/11 permanecem não confirmados.

## Ajustes recentes registrados no GitHub

| Commit | Alteração | Validate | Export Docs | P3 | PDF Visual QA |
|---|---|---|---|---|---|
| [f729cbd](https://github.com/tuliust/PortfolioTulius/commit/f729cbdb2a17d84dc234de283e0a2d5c6bb721e1) | Moldura 1:1 das seis galerias; 1600 × 1600 mantidos | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45677759353) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45677759321) | [FAILURE](https://github.com/tuliust/PortfolioTulius/actions/runs/45677759329) | Não executado |
| [3928ccb](https://github.com/tuliust/PortfolioTulius/commit/3928ccb15be6d5e80924ecae60a20fce5d106538) | Cargo/unidade separados de período/local; PDF compartilhado | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45680130821) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45680130790) | [FAILURE](https://github.com/tuliust/PortfolioTulius/actions/runs/45680130846) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45680130874) |
| [f480982](https://github.com/tuliust/PortfolioTulius/commit/f480982b2bb5bbd76b70c4a6e17735b6745992ef) | Cabeçalho desktop opaco quando índice sticky | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45681570711) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45681570850) | [FAILURE](https://github.com/tuliust/PortfolioTulius/actions/runs/45681570713) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45681570741) |
| [a21c55f](https://github.com/tuliust/PortfolioTulius/commit/a21c55f97c5f6652ba884ae7df0e94c5c384cd7e) | Âncoras estáveis; navegação em ambos os sentidos | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45682877866) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45682878044) | [FAILURE](https://github.com/tuliust/PortfolioTulius/actions/runs/45682878068) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45682878021) |
| [5cf8e3c](https://github.com/tuliust/PortfolioTulius/commit/5cf8e3c4b44c79b95ea6162a5a7a8d5963b3eda0) | Rebuild intermediário: favicon alterado, OG vazio (superado) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45689857624) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45689857696) | Não executado | Não executado |
| [ad8d183](https://github.com/tuliust/PortfolioTulius/commit/ad8d18376721d9aa2a57b5d3750164f80044b1f0) | OG corrigido no CMS; favicon TT restaurado; rebuild | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45690261031) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45690260945) | Não executado | Não executado |
| [444fee6](https://github.com/tuliust/PortfolioTulius/commit/444fee647f96adf61ce72f9a2c07f3ec4af1cc4b) | Fundo transparente da foto do Perfil mobile público | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45691463363) | [SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/45691463181) | [FAILURE](https://github.com/tuliust/PortfolioTulius/actions/runs/45691463355) | Não executado |

Os guias canônicos mantêm detalhes de implementação: [responsividade](../02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md), [arquitetura](ARQUITETURA.md), [modelo](../03-cms/MODELO_DE_DADOS.md), [mídias](../03-cms/MIDIAS_E_STORAGE.md), [SEO](../04-infraestrutura/VERCEL_DEPLOY_SEO.md) e [testes](../05-operacao/TESTES_E_HOMOLOGACAO.md).

## Dados publicados e comportamento atual

Consulta read-only de 25/11: as seis Experiências permanecem visíveis, com 28 fichas, 24 projetos centrais, 22 slides ativos e quatro fichas ocultas preservadas. Contagens de centro/galeria: Invest RS 4/4, Prefeitura 4/4, Vale 5/5, Globo 5/3, InPress 3/3, CDI 3/3. Zero fichas com `slide.mediaType=video` na coleção publicada consultada; dois vídeos Globo pendentes, sem autorização para vincular automaticamente. As seis Trajetórias haviam sido compactadas para 3.346 caracteres e 27 bullets, com releitura documentada em [8f22d34](https://github.com/tuliust/PortfolioTulius/commit/8f22d34212a1b965b82388001b3fa6036db8ce44) e [5e67cc8](https://github.com/tuliust/PortfolioTulius/commit/5e67cc877c141573960394742314b2546f3f2708); textos não recontados nesta consolidação. Os seis `sections.intro` foram relidos, preservando cargo, unidade, data e localização existentes (Globo sem localização).

- Galerias 1:1: 1600 × 1600 px recomendados; `contain` para imagem, `cover` para vídeo e `contain` em fullscreen. Desktop limitado a 57svh e largura da coluna; mobile 100% da área disponível. Temporização 3 s / reinício 8 s conforme contrato anterior; controles não totalmente homologados no último P3.
- Identificação profissional: cargo/unidade no primeiro bloco; período/localização em fonte menor peso 600; barra terminal órfã retirada apenas na renderização. PDF usa o mesmo componente de identificação, sem galeria.
- Navegação desktop: índice sticky com cabeçalho opaco durante fixação; destinos não-sticky independentes para os seis slugs e indicador ativo; comportamento mobile preservado.
- Perfil: PNG `Tulius---Foto-Inicial.png` referenciado nos campos desktop e mobile do CMS na leitura anterior à correção; área inferior #FAFAFA; fundo da moldura pública mobile transparente, sem alterar arquivo, desktop ou PDF. O canal alfa remoto não foi inspecionado independentemente.
- SEO: releitura atual confirma `faviconUrl=/favicon.png` e `ogImage` para mídia pública `tulius-site-600.webp`; paridade SEO estática passou no último P3. Prévia WhatsApp pode permanecer em cache.

## Continuidade e limites

- Resultados: contrato anterior de 20 métricas em cinco categorias e quatro na visão geral; não recontado nesta consolidação. [Modelo](../03-cms/MODELO_DE_DADOS.md).
- PDF: Desktop/Mobile aceitos em 18/11 no SHA `609218b`; novos testes de fixture PDF SUCCESS nos SHAs indicados acima. PDFs reais posteriores à revisão editorial não reexportados nesta auditoria. [Guia PDF](../05-operacao/EXPORTACAO_PDF.md).
- Vídeos: upload MP4 até 50 MB, capa opcional, autoplay mudo se visível; migration de 24/11 e contrato existentes, não reaplicados. [Mídias](../03-cms/MIDIAS_E_STORAGE.md).
- Backup: auditoria encerrada em 20/11 por aceite explícito do risco de restauração integral não comprovada; registro de 21/11 confirma Storage local↔Drive 143/143 e zero diferenças no `rclone check --download`, presença de backup PostgreSQL no Drive, sem restore integral real. RPO/RTO não definidos. Números são da auditoria datada, não inventário atual de mídia. [Backup](../05-operacao/BACKUP_E_RECUPERACAO.md) · [Segurança](../04-infraestrutura/SEGURANCA_E_ACESSOS.md).
- Nenhuma escrita no banco, Storage, Auth/RLS, migrations, DNS ou configuração de CI/Vercel nesta consolidação. Não alterar limites de desempenho, não reabrir [standby](../06-governanca/BACKLOG_STANDBY.md) nem presumir correção das falhas.

## Histórico preservado

As versões extensas anteriores dos pontos de entrada estão no [arquivo histórico de 25/11](../historico/consolidacao-2026-11-25/README.md); os guias temáticos conservam os registros datados. As cinco fontes privadas do Projeto ChatGPT são snapshots externos e não sincronizam automaticamente com GitHub; atualizar por consolidação separada, sem publicar conteúdo privado.
