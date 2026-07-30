# Pôsteres das produções

O `index.html` e o `en/index.html` já esperam estes 17 arquivos, com estes
nomes exatos. Enquanto eles não existirem, o contact sheet aparece quebrado.

Nome do arquivo, tudo minúsculo, sem acento, `.jpg`:

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
| `as-seguidoras.jpg` | As Seguidoras | Paramount+ |
| `coracao-suburbano.jpg` | Coração Suburbano | Paramount+ |
| `serie-302.jpg` | Série 302 | Dafina · Finalização |
| `serie-502.jpg` | Série 502 | Dafina · Finalização |

## Formato

A célula do contact sheet é recortada em 2:3 por `object-fit: cover`, então
pôster de qualquer proporção funciona; o corte tira das bordas, não deforma.
Como o corte é centralizado, pôster com o título muito na borda inferior pode
perder o texto na miniatura. Isso não é problema: a miniatura é chamariz, o
nome da produção vem na legenda embaixo.

Recomendado: **600px de largura**, JPG qualidade 80, abaixo de 150 KB cada.
Os 17 juntos devem ficar por volta de 1,5 MB. Todos entram com
`loading="lazy"` e só carregam quando a linha do trabalho é aberta, então não
pesam na primeira visita.
