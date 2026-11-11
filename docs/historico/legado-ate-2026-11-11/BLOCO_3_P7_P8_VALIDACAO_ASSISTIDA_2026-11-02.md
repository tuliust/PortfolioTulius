# Bloco 3 — P7/P8: inspeção, decisões e aceite assistido

**Criado em:** 02/11/2026. **Status:** documentação e conferências automáticas parciais prontas; **vistoria humana não concluída**. **Fonte de controle:** [dossiê privado de continuidade](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/main/docs/CHECKLIST_BLOCO_2_P4_P5_P6_2026-11-02.md) e checklists dos [Blocos 1](CHECKLIST_BLOCO_1_P1_P2_P3_2026-11-02.md) e [2](CHECKLIST_BLOCO_2_P4_P5_P6_2026-11-02.md). O dossiê privado anexado ao ChatGPT não é espelhado neste repositório.

## P7.0 — Evidência automática disponível (não equivale a inspeção humana)

Leitura SQL **somente SELECT**, realizada em 02/11/2026 no Supabase vigente:

| Verificação | Resultado observado | Status |
| --- | --- | --- |
| Seções e blocos | 14 seções publicadas: 13 visíveis; 28 blocos publicados, 2 por seção | Confirmado em SQL |
| Navegação cadastrada | 14 alvos existentes, 8 links visíveis; zero alvo ausente; zero link visível apontando para seção oculta | Confirmado em SQL |
| Cards do Perfil | 6 cards de experiências com `targetSlug` existente, visível e publicado | Confirmado em SQL |
| Catálogo de mídia | 75 registros, todos com objeto existente em Storage; 72 em bucket público, 3 em bucket privado | Confirmado em SQL |
| Mídia publicada ausente | 0 referências de catálogo a objetos inexistentes | Confirmado em SQL |
| Contato | 4 linhas publicadas; 3 com URL HTTPS, mailto ou tel; nenhuma URL não vazia em formato inesperado | Confirmado em SQL |
| Formação/A | Ainda manual, `source_collection=NULL`; os 3 textos completos existem só na prévia opcional | Confirmado anteriormente e no último snapshot |
| Testes visuais automáticos anteriores | 38 capturas; auditoria mobile Lighthouse com mediana 3,386 s, gate ≤3,5 s | Evidência histórica datada, **não é inspeção em dispositivo** |

**Ponto a inspecionar:** o quarto registro de contato não possui URL segundo o agrupamento SQL; verificar se é intencional e se está ou não visível no painel. **Não criar URL automaticamente.** O sucesso no Storage comprova presença de objeto, não legibilidade, conteúdo correto, licenças, alt ou recorte.

## P7.1 — Inspeção da página pública (não usar gravação)

Antes: abrir https://tulius.work em uma janela comum e, separadamente, no telefone real, registrando modelo, sistema, navegador, largura, altura aproximada e SHA da versão.

- [ ] **PV-01** Abrir e rolar pelas 13 seções visíveis, na ordem; confirmar que Competências continua oculta por decisão editorial.
- [ ] **PV-02** Abrir o menu em desktop e mobile; conferir 8 links, navegação por âncoras e retorno ao conteúdo sem rolagem presa.
- [ ] **PV-03** Em Perfil/A e B, verificar retrato, selo, animação respeitando movimento reduzido e cinco cards de especialidades, além dos seis links de experiências com destino individual.
- [ ] **PV-04** Em Olá!/Sobre, revisar a foto, cinco textos, linhas, alinhamento, crop e ritmo da rolagem; não reverter refinamentos visuais antigos.
- [ ] **PV-05** Em Resultados, comparar seletor, quatro métricas, ícones, contraste, layout 2×2 no mobile, textos e responsividade.
- [ ] **PV-06** Em Formação, verificar os três cursos e **os períodos originais**. O site público ainda não deve mostrar a simulação administrativa como publicação.
- [ ] **PV-07** Revisar cada uma das seis experiências (Invest RS, Prefeitura SP, Vale, Globo/SporTV, InPress, CDI): logo certo, período, textos, projetos, `isHidden` intencional, imagens, expansão/colapso, trajetória sem rolagem aprisionada e transição para a seção seguinte.
- [ ] **PV-08** Conferir os **seis logos e 19 slides** em conjunto: carregamento, correspondência com empresa, ordem, legenda, alt, botão de galeria e ausência de duplicação visual.
- [ ] **PV-09** Em Ferramentas, confirmar ícones, grupos e ausência de troca editorial de texto após visita ao CMS.
- [ ] **PV-10** Em Depoimentos, confirmar três retratos estáticos e créditos/autores corretos. `photo_media_id` ainda está nulo e isso não deve causar desaparecimento.
- [ ] **PV-11** Em Contato, inspecionar a borda inferior da foto, espaçamentos, três cards exibidos e efetivamente abrir WhatsApp/e-mail/LinkedIn. Conferir no CMS o quarto canal estruturado sem URL; não presumir que precise ser exibido.
- [ ] **PV-12** Verificar o HTML SEO (title, description, OG, Twitter, canonical, robots, locale e imagem social, quando houver), e registrar se veio do HTML estático ou somente após JS.
- [ ] **PV-13** Testar teclado em todas as seções, Escape, foco visível, leitor de tela real, zoom 200% e 400%, contraste e `prefers-reduced-motion`. Lighthouse 100 não substitui esses testes.
- [ ] **PV-14** Registrar capturas de desktop e celular das áreas com defeito; descrever comportamento observado e esperado, não substituir imagens ou CSS por intuição.

## P7.2 — Inspeção do CMS de produção (**somente leitura e prévia**)

Abrir https://tulius.work/admin com a conta existente. Não clicar em ações de salvar, restaurar, publicar, arquivar, promover mídia, vincular coleção ou excluir como forma de teste na produção.

- [ ] **CMS-01** Conferir autenticação, logout e acesso bloqueado sem sessão; não criar conta nova em produção.
- [ ] **CMS-02** Abrir **Editor do site** e navegar entre Conteúdo e painéis, Informações da seção, Acervo estruturado e Prévia; conferir persistência da seção selecionada.
- [ ] **CMS-03** Conferir agrupamento das seis experiências e a seleção individual de cada empresa; revisar os campos sem gravar.
- [ ] **CMS-04** Conferir apresentação mobile administrativa, 50 ícones, até três ícones por item em Ferramentas, biblioteca de mídia, alt, zoom/crop e avisos.
- [ ] **CMS-05** Em Formação → Prévia, comparar com checkbox opcional **desativado** e **ativado**. Na simulação, confirmar exatamente os três nomes completos e conservar `UFRN · 2007–2012`, `UnP · 2013`, `PUCRS · 2020–2021`. Fazer inspeção em desktop/mobile, sem salvar nem vincular.
- [ ] **CMS-06** Em cada um dos **26 blocos manuais**, registrar UUID, conteúdo, ordem, links, estado oculto, mídias, desktop/mobile e decisão individual: *manter manual / corrigir apenas campo / propor vínculo específico*. A igualdade de títulos com acervo não autoriza vinculação automática.
- [ ] **CMS-07** Abrir Acervo estruturado e comparar as nove coleções; focar os quatro projetos estruturados, as seis experiências, links e campos sem interface direta.
- [ ] **CMS-08** Conferir três retratos aprovados, sem cadastrar ou associar. Confirmar que as 14 ocorrências de alt seguem a escolha de **manter**.
- [ ] **CMS-09** Conferir Revisões sem clicar em Restaurar; a recuperação existente é **limitada**, não restaura mídias, posições ou status.
- [ ] **CMS-10** Conferir Identidade, Navegação, SEO e Contato em modo de consulta; registrar eventual divergência sem acionar publicação.
- [ ] **CMS-11** Registrar telas, diferenças e a decisão expressa de publicação para cada campo antes de solicitar mudança de produção.

## P7.3 — Testes transacionais no computador (local, exclusivamente fictícios)

- [ ] **LOC-01** Docker/CLI local e migrações + seed **sintético** aplicados; smoke RLS anônimo aprovado.
- [ ] **LOC-02** Contas artificiais: admin, usuário comum e anon; nada de credenciais reais.
- [ ] **LOC-03** Criar, editar, duplicar, ordenar, publicar/ocultar/arquivar e limpar página/seção/bloco/coleções fictícios; comprovar banco antes/depois e rollback.
- [ ] **LOC-04** Upload privado/local, cancelamento, promoção pública/local, falha e restauração sem resíduo.
- [ ] **LOC-05** Revisões limitadas e tratamento de falha/reconexão; confirmar ausência de falso toast de sucesso.
- [ ] **LOC-06** Executar as seis RPCs administrativas com três perfis locais; validar bloqueios, IDs e limites de função privada.
- [ ] **LOC-07** Testar SEO fictício em servidor local: rascunho não publica, evento legítimo idempotente, falha retentável, oito metatags estáticas, **sem chamar Vercel**.
- [ ] **LOC-08** Guardar evidências sem segredos e executar `supabase stop`.

[Guia de Supabase local](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md).

## P8 — Critérios de encerramento final, sem antecipar aceite

- [ ] **FIN-01** Revisar as decisões de cada bloco manual, inclusive os 17 heterogêneos, e confirmar conteúdo/mídia preservados ou publicação especificamente aprovada.
- [ ] **FIN-02** Concluir as autorizações de Formação/A, seis experiências, três retratos, SEO e segurança **ou** registrar manutenção do estado atual e riscos aceitos expressamente, sem dizer que correções inexistentes foram implantadas.
- [ ] **FIN-03** Concluir P4 em Supabase local com evidências reais de Auth/RLS/CRUD/Storage/rollback; testes offline não bastam.
- [ ] **FIN-04** Confirmar SHA do código final, CI, exportação documental, Vercel `READY`, SEO e auditorias de regressão no mesmo SHA.
- [ ] **FIN-05** Confirmar três medições Lighthouse mobile comparáveis e mediana ≤**3,5 s** sem regressões visuais, atualizando resultado se o SHA tiver mudado.
- [ ] **FIN-06** Conferir leitores de tela, teclado, zoom e dispositivos físicos; registrar defeitos remanescentes e responsáveis.
- [ ] **FIN-07** Emitir relatório de mudanças realizadas, pendências transferidas, decisões de não alterar e riscos aceitos.
- [ ] **FIN-08** Obter aceite final humano **expresso** e datado antes de declarar os Blocos 1, 2 e 3 concluídos.

## Registro mínimo a preencher para cada divergência

```text
ID/área/campo:
SHA do código e URL da evidência:
Ambiente: produção (leitura) | localhost (teste sintético) | dispositivo real
Estado anterior / estado proposto:
Desktop: PASS | FAIL | não conferido
Mobile: PASS | FAIL | não conferido
Teclado/leitor de tela/zoom: PASS | FAIL | não conferido
Decisão: manter manual | ajustar | publicar | adiar | aceitar risco
Aprovação específica de mudança em produção: SIM | NÃO
Resultado após correção (se autorizada):
Data/responsável:
```

**Invariantes:** nada neste documento autoriza gravar produção, duplicar usuários reais, mexer em RLS/Auth/grants/índices, mudar layout ou publicar dados de uma coleção sem aprovação por campo. As inspeções humanas não estão concluídas.
