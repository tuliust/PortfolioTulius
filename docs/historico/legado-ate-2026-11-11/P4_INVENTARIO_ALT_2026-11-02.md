# P4 — Inventário para revisão editorial de textos alternativos (02/11/2026)

Consulta de **leitura** a `public.media_assets`. Esta lista identifica metadados a verificar; não é recomendação automática de texto nem autorização de alteração dos arquivos ou do banco.

**Critério de triagem:** `length(trim(alt_text)) < 6`. Dos 75 registros atuais, **13 estão vazios** e **1 tem texto curto (`Vale`)**. Uma descrição curta pode estar correta para um logotipo e `alt=""` pode ser apropriado quando a imagem é decorativa. Avaliar a função visual e o atributo `alt` efetivamente renderizado antes de escrever no catálogo.

| Bucket | Arquivo | Identificador | Alt atual | Dimensões cadastradas |
| --- | --- | --- | --- | --- |
| `portfolio-private` | `3d2a26a9-4560-4792-8387-6136ad40da44-tulius_tablet.png` | `43ef4b05-9c3b-4843-919e-71f240d06b78` | *(vazio)* | — × — |
| `portfolio-private` | `59440cd7-4c14-4a7e-82fd-3083a03b3a92-tulius-contact.jpg` | `97b3ff2e-4b22-4334-a961-b554e30d323f` | *(vazio)* | — × — |
| `portfolio-private` | `ee0eab0d-5ed6-45bc-88c9-aae9c5a8baee-tulius_site.png` | `b8e48a8e-7fe8-4f3f-9f71-29c417ef96bf` | *(vazio)* | — × — |
| `portfolio-public` | `03026f18-b066-46b5-9936-737f23f944e5-invest-01.png` | `c78d08b8-60f4-49e8-b607-181c6939b315` | *(vazio)* | — × — |
| `portfolio-public` | `1d6b07af-661c-4adf-b8a1-a118df235eca-prefeitura-sp.png` | `fd2d2ff9-c1e6-4050-986d-0bc4961511ce` | *(vazio)* | — × — |
| `portfolio-public` | `34692491-00f2-4f23-8483-97461ce2d76a-cdi-com.png` | `2c6b5258-661e-46f1-859f-2fe5e43996f7` | *(vazio)* | — × — |
| `portfolio-public` | `a1bf9f8f-dae0-4c6e-ab9a-8d75bba0adb7-2.png` | `1066969c-b234-4e59-a950-020fe71279d0` | `Vale` | — × — |
| `portfolio-public` | `a46a4091-bce1-4345-a17f-7d7947a8e903-tulius_tablet.png` | `d0e388bc-7644-47b2-812f-fb573a73a53f` | *(vazio)* | — × — |
| `portfolio-public` | `afb641b5-6eba-43af-816e-049135aa1278-tulius-contact.jpg` | `4e945bf4-1958-4550-8291-1de2bffab453` | *(vazio)* | — × — |
| `portfolio-public` | `b171afda-2708-44eb-b3e5-ab2b7ff13236-tulius_site.png` | `c6767606-f8c5-4ea0-91ec-ebc0f0abcc39` | *(vazio)* | — × — |
| `portfolio-public` | `d2e8938d-8a35-41c0-9884-7666378ab0b7-invesrts.png` | `75713430-5cef-469c-b6d5-c465c75bd701` | *(vazio)* | — × — |
| `portfolio-public` | `e74c4cf7-ef7f-461b-8ba0-cc6b6a877b90-inpress.png` | `d95f8b6b-ce3e-437a-bc27-30df11f709fc` | *(vazio)* | — × — |
| `portfolio-public` | `f28c7a85-83ea-4938-816d-790dcb2a3ec7-globo.png` | `41933be3-4cb5-4684-b504-7a54d135cd51` | *(vazio)* | — × — |
| `portfolio-public` | `fd96dfb4-4ecc-4ad6-a6fe-f74bca35fb30-vale.png` | `6d4d3330-8af1-4031-8dc9-223617d1f5b3` | *(vazio)* | — × — |

## Procedimento de aprovação

1. Verificar a imagem real na biblioteca e onde aparece (retrato, logo, ilustração ou decoração).
2. Conferir se o bloco já inclui um `alt` editorial adequado; o campo do catálogo não substitui automaticamente os atributos de conteúdo.
3. Manter `alt=""` para mídias decorativas quando pertinente; redigir descrições descritivas apenas com correspondência visual.
4. Validar cada edição pelo proprietário e salvar pelo CMS. Não atualizar esses 14 registros em lote por suposição.

Os seis logos e os 19 slides das experiências possuem `logoAlt` e `alt` específicos nos respectivos blocos editoriais, conforme leitura automatizada. Isso não constitui aprovação dos 14 atributos do catálogo.

**Mídia:** 75 registros associados a objetos existentes; 53 objetos privados sem registro são preservados e não constituem, por si, lixo ou duplicação.
