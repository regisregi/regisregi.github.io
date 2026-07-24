# Régis Regi · Portfólio 2026

Site estático (HTML + CSS + JS puros, sem build) servido pelo GitHub Pages como **user site** (`regisregi.github.io`) com domínio próprio `regisregi.com`. O conceito visual é **minimalista em preto absoluto**: o trabalho vira um índice tipográfico gigante, com um único acento violeta, rail lateral de cenas e um efeito assinatura na abertura (o nome entra letra a letra). As quatro cores de frente de atuação (coordenação, roteiro, edição, curadoria) aparecem apenas nos pontos sob o nome, como identidade herdada das trilhas de NLE.

## Estrutura

```
├── index.html                  → página única com todas as seções
├── analise.html                → Lab NLP (análise dos textos do Medium no navegador)
├── css/tokens.css              → design tokens (cores, fontes, ritmo) do index
├── css/site.css                → estilos do index
├── css/style.css               → estilos do Lab NLP (analise.html)
├── js/site.js                  → interação do index (assinatura, reveals, rail, índice, contagem)
├── js/analise.js               → motor de NLP + gráficos SVG do Lab
├── assets/
│   ├── RE_GIS_REGI_PORTFOLIO_CV_2026.pdf   → CV linkado nos botões "Baixar CV"
│   ├── regis-retrato.jpg       → retrato na seção Sobre
│   └── favicon.svg
├── CNAME                       → domínio custom (regisregi.com); não remover
├── .nojekyll                   → evita processamento Jekyll no Pages
└── README.md
```

## Deploy

Este repositório é o user site da conta `regisregi`: **todo push na `main` publica direto**, sem workflow e sem branch `gh-pages`. O Pages está configurado em Settings → Pages com *Deploy from a branch* (`main`, `/ (root)`) e o domínio custom `regisregi.com`.

- O arquivo `CNAME` na raiz mantém o domínio configurado entre deploys. Não apagar.
- A branch `gh-pages` e o workflow antigos (herdados do project site) foram aposentados; se a branch `gh-pages` ainda existir no remoto, pode ser excluída.
- Depois que o certificado TLS do domínio for emitido pelo GitHub, marcar **Enforce HTTPS** em Settings → Pages.

## Google Analytics (planejado, ainda não ativo)

O bloco do GA4 já está pronto, comentado, no `<head>` de `index.html` e `analise.html`. Para ativar:

1. Criar a propriedade GA4 em [analytics.google.com](https://analytics.google.com) (conta do Régis) e copiar o **ID de medição** (`G-...`).
2. Nos dois arquivos, trocar `G-XXXXXXXXXX` pelo ID real (duas ocorrências por arquivo).
3. Descomentar o bloco nos dois arquivos e fazer push.

O snippet usa `anonymize_ip`. Se o tráfego da UE/LGPD virar preocupação, avaliar um aviso de cookies antes de ativar.

## Pendências (TODO)

- **Vídeos hospedados localmente**: hoje os materiais das produções abrem via links do YouTube dentro de cada experiência (mapeados a partir dos hyperlinks do PDF do CV). O Régis vai baixar os vídeos ele mesmo mais tarde; quando existirem os arquivos, servir localmente (ou via storage próprio) e trocar os links por `<video>`.
- **Enforce HTTPS**: aguardando emissão do certificado do domínio (ver Deploy).

## Para testar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

O Lab NLP depende de `api.rss2json.com` (o Medium bloqueia leitura server-side, então o feed é lido no navegador). Modo demo do Lab: `analise.html?demo=1`.

## O que personalizar

- **CV**: substituir o PDF em `assets/` mantendo o mesmo nome de arquivo.
- **Cores do index**: tudo em `css/tokens.css`, com a regra de uso de cada cor comentada. `--accent` (violeta) é a única cor de interface; as quatro cores de frente (`--coord`, `--roteiro`, `--edicao`, `--curadoria`) só aparecem nos pontos sob o nome.
- **Cores do Lab**: `:root` no topo do `css/style.css` (paleta de dados validada para daltonismo).
- **Trabalhos**: cada experiência é um `<li class="row">` no `index.html` (número, nome-botão, meta, painel expansível com descrição e links de material). Para adicionar, copiar uma linha e renumerar.
- **Contato**: e-mail, WhatsApp e LinkedIn na seção `#contato`.

## Créditos técnicos

Fontes via Google Fonts (Anton, Archivo e Space Mono). Sem dependências, sem frameworks, com skip link, foco visível, contraste AA, paleta de dados do Lab validada para daltonismo e `prefers-reduced-motion` respeitado (a abertura letra a letra e a contagem dos números desligam).
