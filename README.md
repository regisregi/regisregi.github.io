# Régis Regi · Portfólio 2026

Site estático (HTML + CSS + JS puros, sem build) servido pelo GitHub Pages como **user site** (`regisregi.github.io`) com domínio próprio `regisregi.com`. O conceito visual é uma **sala de edição em preto e roxo**: paleta de suíte escura com casta violeta, timecode rodando no topo, slate no hero e a carreira montada como uma **timeline de NLE**, com trilhas (V1 Coordenação, V2 Roteiro, V3 Edição, A1 Curadoria) e clipes coloridos clicáveis que levam à experiência correspondente.

## Estrutura

```
├── index.html                  → página única com todas as seções
├── analise.html                → Lab NLP (análise dos textos do Medium no navegador)
├── css/style.css               → todos os estilos (tokens em :root)
├── js/main.js                  → interação do index (timecode, timeline, bin, projeção)
├── js/analise.js               → motor de NLP + gráficos SVG do Lab
├── assets/
│   ├── RE_GIS_REGI_PORTFOLIO_CV_2026.pdf   → CV linkado nos botões "Baixar CV"
│   ├── regis-retrato.jpg       → retrato do hero
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

- **Vídeos hospedados localmente**: hoje os materiais das produções abrem via YouTube na Sala de Projeção (mapeados a partir dos hyperlinks do PDF do CV). O Régis vai baixar os vídeos ele mesmo mais tarde; quando existirem os arquivos, servir localmente (ou via storage próprio) e trocar os `data-yt`/`data-list` por `<video>`.
- **Enforce HTTPS**: aguardando emissão do certificado do domínio (ver Deploy).

## Para testar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

O bin do Medium e o Lab NLP dependem de `api.rss2json.com` (o Medium bloqueia leitura server-side, então o feed é lido no navegador). Modo demo do Lab: `analise.html?demo=1`.

## O que personalizar

- **CV**: substituir o PDF em `assets/` mantendo o mesmo nome de arquivo.
- **Cores**: tudo em `:root` no topo do `css/style.css`. As quatro cores de trilha (`--rec`, `--amber`, `--teal`, `--violet`) são semânticas de NLE; o cromo da interface usa `--violet` como acento dominante, com `--electric` e `--magenta` restritos a brilhos e à barra de progresso.
- **Timeline**: cada clipe é um `<a class="clip">` com `left` e `width` em % (escala: 2018 = 0% e meados de 2026 ≈ 100%, ou seja, 1 ano ≈ 11,63%). Para adicionar um trabalho novo, copiar um clipe, ajustar posição, título e o `href` para o id do card.
- **Decupagens**: a versão estendida de cada experiência vive num `<details class="card-more">` dentro do card correspondente no `index.html`.
- **Contato**: e-mail, WhatsApp e LinkedIn estão no rodapé (`#contato`).

## Créditos técnicos

Fontes via Google Fonts (Anton, Archivo e Space Mono). Sem dependências, sem frameworks, com skip link, foco visível, contraste AA, paleta de dados do Lab validada para daltonismo, legendas ligadas por padrão nos players e `prefers-reduced-motion` respeitado.
