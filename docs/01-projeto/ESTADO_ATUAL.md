# Estado atual — PortfolioTulius

## Browser aprovado e ajuste final de performance em validação — 25/11/2026

`4b858d4`: Validate, Export Docs, PDF QA SUCCESS e Production READY; P3 com **zero falhas de navegador e 30/30 transições**, mas global FAILURE exclusivamente por LCP mobile **3,635 s**, desktop **0,991 s** PASS. A implementação seguinte prioriza a pintura do retrato antes da composição do restante da página, com limite de 1 s e sem esperar em deep links/preview/aba oculta. Validação local SUCCESS (315 testes); CI e Lighthouse do novo código ainda a confirmar. [Matriz e limites](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Correção técnica em validação — 25/11/2026

A primeira rodada `582e65d` obteve Validate, Export Docs e PDF QA SUCCESS, Production READY; P3 FAILURE com duas falhas de browser e LCP mobile 4,532 s (antes 5,313 s). A rodada atual acrescenta compressão exclusiva da foto para tela mobile, mantendo desktop/impressão sem perda; corrige o contrato do acordeão mobile e aguarda fontes antes da matriz desktop. Validação local SUCCESS, publicação/P3 deste novo código ainda **não confirmados**. Não interpretar a redução parcial como cumprimento de ≤3,5 s. [Evidências](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Rodada de correção técnica autorizada — 25/11/2026

Após a consolidação `1e217ae`, o proprietário solicitou correção autônoma das falhas de navegador e performance descritas. A implementação atualiza as expectativas do smoke para o CMS publicado e serve uma derivada WebP sem perda da fotografia atual (redução de 47,1% nos bytes). A meta de LCP e o design permanecem. CI/P3/deployment do novo SHA ainda precisam de conferência; não considerar o LCP corrigido apenas pela otimização. [Detalhes e limitações](../05-operacao/TESTES_E_HOMOLOGACAO.md).


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
