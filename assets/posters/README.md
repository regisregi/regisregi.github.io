# Pôsteres das produções

20 pôsteres, todos normalizados em **600×900 (2:3)**, JPG progressivo
qualidade 82. Total 1,70 MB. Entram no contact sheet dentro de cada painel de
trabalho do `index.html` e do `en/index.html`.

Os painéis de Mellin Studio, Maracutaia.fm, Porta dos Fundos, Dafina ·
Formatos, Descomplica e Mulheres que Escrevem não usam pôster: usam bloco
vivo, com marcas em `marcas/` e fotos em `maracutaia/`. Ver a seção final.

Originais em `D:\Users\regis\Desktop\Régis\CLAUDE\SITE\POSTER\OK`.

| Arquivo | Produção | Painel |
|---|---|---|
| `galera-fc.jpg` | Galera FC | A Fábrica |
| `agentes-muito-especiais.jpg` | Agentes Muito Especiais | A Fábrica |
| `temporada-de-bonus.jpg` | Temporada de Bônus | A Fábrica |
| `a-estranha-na-cama.jpg` | A Estranha na Cama | A Fábrica |
| `e-tudo-delas.jpg` | É Tudo Delas | Grupo Sal |
| `ninguem-me-domina.jpg` | Ninguém Me Domina | Grupo Sal |
| `historias-do-coletivo.jpg` | Histórias do Coletivo | Grupo Sal |
| `por-tras-do-desafio.jpg` | Por Trás do Desafio | Grupo Sal |
| `bom-dia-veronica.jpg` | Bom Dia, Verônica | DOT Cine |
| `a-magia-de-aruna.jpg` | A Magia de Aruna | DOT Cine |
| `desejos-sa.jpg` | Desejos S.A. | DOT Cine |
| `o-lado-bom-de-ser-traida.jpg` | O Lado Bom de Ser Traída | DOT Cine |
| `luva-de-pedreiro.jpg` | Luva de Pedreiro | DOT Cine |
| `isabella-o-caso-nardoni.jpg` | Isabella: o Caso Nardoni | DOT Cine |
| `as-seguidoras.jpg` | As Seguidoras | Paramount+ |
| `coracao-suburbano.jpg` | Coração Suburbano | Paramount+ |
| `serie-302.jpg` | Série 302 | Dafina · Finalização |
| `serie-502.jpg` | Série 502 | Dafina · Finalização |
| `era-de-ouro.jpg` | Era de Ouro: O Nascimento dos Super-Heróis | Dafina · Finalização |

## Como foram normalizados

Os originais vinham em proporções de 0,605 a 0,802, e em PNG de até 8,9 MB.
O tratamento foi feito para deixar tudo igual sem perder rosto nem título:

1. **Moldura aparada.** Alguns arquivos traziam moldura branca sólida. Em
   Galera FC os quatro cantos batiam e o script antigo (que só apara quando
   os quatro cantos são idênticos) resolveu sozinho. Em A Estranha na Cama o
   original vinha com cantos arredondados: a cor de cada canto varia por
   causa do arredondamento, então a checagem de "4 cantos iguais" falhava e
   a função devolvia a imagem intocada. Por coincidência, o recorte 2:3
   seguinte (centralizado, âncora `center`) cortou fora a moldura de
   topo/base/esquerda no processo normal de enquadrar a proporção, mas
   sobrou uma faixa clara de ~24px no lado direito, que ficou no ar sem
   ninguém notar até o pedido de correção. Reprocessada com detecção de
   borda por lado, independente por topo/base/esquerda/direita, sem exigir
   cantos iguais: achou a moldura real de 27px nos quatro lados do
   original (687×1024) e cortou os quatro antes do recorte 2:3. Se outro
   pôster aparecer com moldura em cantos arredondados, usar esse método,
   não o antigo baseado em 4 cantos idênticos.
2. **Recorte para 2:3, sempre centralizado na horizontal.** Onze pôsteres já
   estavam entre 0,667 e 0,680, então o corte é desprezível. Os três mais
   largos (Coração Suburbano 0,727, Desejos S.A. 0,796, O Lado Bom 0,802)
   perdem só laterais, e a altura inteira sobrevive, o que preserva o título.
3. **Âncora vertical por imagem.** Duas exigiam corte vertical de verdade.
   A Magia de Aruna (0,605) leva `top`, porque a marca Disney e o título
   ficam no alto e o corte centralizado comeria o título. Isabella: o Caso
   Nardoni (0,562, o mais alto de todos) leva `center`, porque nela o título
   fica no meio exato e as duas tarjas de topo e pé sobrevivem ao corte de
   15,7%. Todas as outras usam `center` sem ter o que perder. Era de Ouro
   chegou em 0,671, a 0,6% de 2:3: o corte é de meia dúzia de pixels e o
   `center` preserva do topo (título) ao pé (assinatura Omelete e A&E). É o
   arquivo mais pesado da pasta, 199 KB, porque é ilustração cheia de detalhe
   fino, que o JPG não compacta bem; carrega em `lazy` dentro do painel.

Cada uma das 19 fotos de produção foi conferida visualmente numa montagem
depois do processo, para garantir que rosto e nome da produção continuam
legíveis na miniatura.

Ao trocar ou acrescentar pôster, refazer o mesmo caminho: aparar moldura
(por lado, não por 4 cantos iguais, se houver canto arredondado), recortar
para 600×900 escolhendo a âncora que preserva o título, salvar JPG qualidade
82 progressivo, e olhar a miniatura antes de publicar.

## Blocos vivos: os seis painéis que não usam pôster

Seis painéis foram desenhados como peça 16:9 (Mellin Studio, Maracutaia.fm,
Porta dos Fundos, Dafina · Formatos, Descomplica e Mulheres que Escrevem) e
depois convertidos em **bloco vivo** — HTML e CSS, não imagem. Os JPGs saíram
daqui; os masters 1920×1080 ficaram em
`D:\Users\regis\Desktop\Régis\CLAUDE\SITE\POSTER`, que é onde servem:
Instagram, LinkedIn, PDF.

O motivo é aritmético. O pôster nascia em 1920px e entrava no painel a ~330px
num celular: tudo escalava por 0,17, o mono de 13px virava 2px e a ficha
sumia. Em bloco, a peça reflui, o texto indexa na busca, a tipografia fica
nítida em qualquer densidade e o peso cai — só as marcas continuam sendo
arquivo.

A peça **substitui** o parágrafo do painel, não convive com ele: antes o
pôster repetia em imagem o que o texto ao lado já dizia. Os hyperlinks que
moravam no parágrafo viraram o botão da peça, e `js/site.js` passou a alcançar
`.peca a[href]` junto com `.sheet a[href]`, então Maracutaia e Porta continuam
abrindo na sala de projeção; o Dez Segundos leva para a matéria do TechTudo,
marcado com `data-embed="off"` porque reportagem não é vídeo.

Cada painel tem sua textura, sempre decorativa e sempre com `aria-hidden`:

| Painel | Textura |
|---|---|
| Mellin Studio | fileira das marcas atendidas (C6, Praya, BSC) |
| Maracutaia.fm | tira de quatro fotos dos sets, com o nome do artista |
| Porta dos Fundos | frase repetida, cortada por uma chapa sólida |
| Dafina · Formatos | algarismos 01/02/03 atrás de cada frente |
| Descomplica | cronômetro de dez casas, a última no acento |
| Mulheres que Escrevem | onda de áudio de 46 barras, trecho aceso |

### `marcas/`

As logos dos clientes, todas keyed para branco sobre transparente. Vinham em
fundos e cores próprias (verde do Descomplica, navy do Mellin, oliva do BSC,
lavanda do MQE) e cor de marca de terceiro sobre o preto do site quebra a
unidade. A normalização é por altura de caixa, não por largura de arquivo:
o C6 é 5:1 e a Praya é 1:1,25, então a Praya e o BSC ganham o modificador
`.alta` para terem a mesma mancha visual.

### `maracutaia/`

Quatro frames dos sets (Azo, Caiao, Marta Supernova, Rafael Não Existe) em
480×360, tratados com casamento de cor em CIELAB tendo os dois primeiros como
referência, mais grão e vinheta iguais para os quatro. Os frames originais
traziam marca d'água queimada no topo e no rodapé; o recorte tira as duas.
