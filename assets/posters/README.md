# Pôsteres das produções

20 pôsteres, todos normalizados em **600×900 (2:3)**, JPG progressivo
qualidade 82. Total 1,70 MB. Entram no contact sheet dentro de cada painel de
trabalho do `index.html` e do `en/index.html`.

`maracutaia-banner.jpg` foge do padrão 2:3: é um mockup de página inteira
em 16:9, não pôster de produção. Ver a seção própria abaixo.

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
| `maracutaia-banner.jpg` | Maracutaia.fm (mockup 16:9, não pôster) | Maracutaia.fm |

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

## Maracutaia.fm: mockup 16:9, não pôster

`maracutaia-banner.jpg` é o arquivo `maracutaia.png` original inteiro
(1920×1080, mockup de página com o título "SETS AUDIOVISUAIS", a grade de
seis fotos de DJs — Azo, Caiao, Marta Supernova, Rafael Não Existe e mais
dois — e o botão "Ver a playlist completa"), só redimensionado para 1600px
de largura (132 KB, qualidade 88), sem cortar nada.

Primeira tentativa foi recortar só o símbolo da marca (quadrado violeta) e
tratá-lo como pôster 2:3, para não usar a foto de artistas que não são o
Régis. Ficou pequeno demais para reconhecer como "o arquivo" ao ver no site,
e o mockup já credita o trabalho dele em texto ("RÉGIS REGI · CURADORIA,
EDIÇÃO E FINALIZAÇÃO"), então mostrar a peça inteira é mais honesto que um
recorte abstrato: documenta a curadoria visual e não faz identidade alheia
de "pôster de produção".

Por não ser 2:3, ganhou modificador próprio: `<figure class="wide">` dentro
do mesmo `.sheet` (CSS em `css/site.css`, regra `.sheet figure.wide`).
Continua dentro de `.sheet` de propósito, para o seletor `.sheet a[href]`
que liga pôsteres à sala de projeção alcançar sem precisar de JS novo.

O banner está ligado ao mesmo player embutido dos outros: clicar nele abre
a playlist "Sets Maracutaia.fm" dentro do site, com índice dos 9 episódios
(ver `## Sala de projeção` no README principal para o porquê de 7 dos 9
vídeos não tocarem embutidos, e o que fazer se isso mudar).
