# Pôsteres das produções

19 pôsteres, todos normalizados em **600×900 (2:3)**, JPG progressivo
qualidade 82. Total 1,69 MB. Entram no contact sheet dentro de cada painel de
trabalho do `index.html` e do `en/index.html`.

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

1. **Moldura aparada.** Alguns arquivos traziam moldura branca sólida (Galera
   FC e A Estranha na Cama). Detectada pelos quatro cantos e removida, senão
   viravam bloco claro no fundo preto e quebravam a uniformidade da fileira.
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

Cada uma das 19 foi conferida visualmente numa montagem depois do processo,
para garantir que rosto e nome da produção continuam legíveis na miniatura.

Ao trocar ou acrescentar pôster, refazer o mesmo caminho: aparar moldura,
recortar para 600×900 escolhendo a âncora que preserva o título, salvar JPG
qualidade 82 progressivo, e olhar a miniatura antes de publicar.
