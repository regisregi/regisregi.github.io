# Régis Regi · Portfólio 2026

Site estático (HTML + CSS + JS puros, sem build) servido pelo GitHub Pages como **user site** (`regisregi.github.io`) com domínio próprio `regisregi.com`. O conceito visual é **minimalista em preto absoluto**: o trabalho vira um índice tipográfico gigante, com um único acento violeta, rail lateral de cenas e um efeito assinatura na abertura (o nome entra letra a letra). As quatro cores de frente de atuação (coordenação, roteiro, edição, curadoria) aparecem apenas nos pontos sob o nome, como identidade herdada das trilhas de NLE.

## Estrutura

```
├── index.html                  → página única com todas as seções (pt-BR)
├── en/index.html               → mesma página em inglês, servida em /en/
├── analise.html                → Lab NLP (análise dos textos do Medium no navegador)
├── css/tokens.css              → design tokens (cores, fontes, ritmo) do index
├── css/site.css                → estilos do index
├── css/style.css               → estilos do Lab NLP (analise.html)
├── js/site.js                  → interação do index (assinatura, reveals, rail, índice, contagem)
├── js/analise.js               → motor de NLP + gráficos SVG do Lab
├── assets/
│   ├── RE_GIS_REGI_PORTFOLIO_CV_2026.pdf   → CV linkado nos botões "Baixar CV"
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

## Idiomas

O português vive em `/` e o inglês em `/en/`, cada um com URL própria e HTML próprio. Não há tradução por JavaScript: a página inglesa é indexável e não pisca no idioma errado ao carregar.

- Os dois arquivos se apontam com `hreflang` (`pt-BR`, `en` e `x-default` no português), e o seletor `PT` / `EN` fica no cabeçalho.
- CSS, JS e assets são compartilhados. A página em `/en/` referencia tudo com `../`.
- Os ids das seções são traduzidos (`about`, `work`, `skills`, `writing`, `contact`). O scrollspy do `js/site.js` lê esses ids do próprio rail, então não há lista de ids fixa no código e o mesmo script serve aos dois idiomas.
- As classes de cor de trilha (`dot-roteiro`, `dot-curadoria`) seguem em português nos dois: são nomes de classe do CSS, não texto visível.
- Ao editar um trabalho, editar nos dois arquivos. São páginas independentes de propósito.
- O CV em PDF é o mesmo nos dois idiomas e está em português.

## Google Analytics

GA4 ativo nas duas páginas, propriedade `G-R19SB2FGP1`, com o bloco `gtag.js` no `<head>` de `index.html` e `analise.html`.

A medição aprimorada do GA4 já cobre sozinha as visualizações de página, a rolagem, os cliques em links externos (YouTube, Instagram, Academia, LinkedIn) e o download do CV em PDF. Não há código nosso para nada disso.

O único evento manual é **`abrir_projeto`**, em `js/site.js`: expandir uma linha do índice não gera navegação, então o GA4 não enxerga sozinho qual projeto interessou a quem visitou. O evento sai só na abertura (não ao fechar), leva o parâmetro `projeto` com o nome da produção, e só dispara se `window.gtag` existir, de modo que nada quebra com o Analytics desligado ou bloqueado no navegador.

Para ver `projeto` como dimensão nos relatórios, é preciso registrá-la uma vez em Administrador → Definições personalizadas → Dimensão personalizada, com o parâmetro `projeto` e escopo de evento. Sem isso o evento é contado, mas o nome do projeto não aparece quebrado por produção.

Não há aviso de cookies no site. Se o tráfego da UE/LGPD virar preocupação, avaliar um banner de consentimento.

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
- **Contato**: e-mail e LinkedIn na seção `#contato`. Por decisão do dono, o site não expõe telefone nem retrato; não reintroduzir.

## Créditos técnicos

Fontes via Google Fonts (Anton, Archivo e Space Mono). Sem dependências, sem frameworks, com skip link, foco visível, contraste AA, paleta de dados do Lab validada para daltonismo e `prefers-reduced-motion` respeitado (a abertura letra a letra e a contagem dos números desligam).
