# Régis Regi · Portfólio 2026

Site estático (HTML + CSS + JS puros, sem build) servido pelo GitHub Pages como **user site** (`regisregi.github.io`) com domínio próprio `regisregi.com`. O conceito visual é **minimalista em preto absoluto**: o trabalho vira um índice tipográfico gigante, com um único acento violeta, rail lateral de cenas e um efeito assinatura na abertura (o nome entra letra a letra). As quatro cores de frente de atuação (coordenação, roteiro, edição, curadoria) aparecem apenas nos pontos sob o nome, como identidade herdada das trilhas de NLE.

## Estrutura

```
├── index.html                  → página única com todas as seções (pt-BR)
├── en/index.html               → mesma página em inglês, servida em /en/
├── analise.html                → Lab NLP (fora do ar: link comentado no index, ver Idiomas)
├── css/tokens.css              → design tokens (cores, fontes, ritmo) do index
├── css/site.css                → estilos do index
├── css/style.css               → estilos do Lab NLP (analise.html)
├── js/site.js                  → interação do index (assinatura, reveals, rail, índice, contagem)
├── js/analise.js               → motor de NLP + gráficos SVG do Lab
├── assets/
│   ├── RE_GIS_REGI_PORTFOLIO_CV_2026.pdf   → CV linkado nos botões "Baixar CV"
│   └── favicon.svg
├── .github/workflows/atualiza-cv.yml → sincroniza o CV do Drive todo dia
├── CNAME                       → domínio custom (regisregi.com); não remover
├── .nojekyll                   → evita processamento Jekyll no Pages
└── README.md
```

## CV sincronizado do Drive

O `assets/RE_GIS_REGI_PORTFOLIO_CV_2026.pdf` é mantido igual ao arquivo do
Google Drive pelo workflow `.github/workflows/atualiza-cv.yml`. O caminho do
arquivo nunca muda, então os botões "Baixar CV" continuam apontando para o
mesmo lugar e o site serve o PDF localmente, sem depender do Drive no clique.

Roda todo dia às 06:00 UTC e também no botão **Run workflow** da aba Actions,
para usar logo depois de atualizar o Drive sem esperar o dia seguinte.

**Como atualizar o CV:** no Drive, abrir o menu do arquivo e usar
**Gerenciar versões → Fazer upload de nova versão**. Não apagar e subir de
novo: arquivo novo ganha ID novo, e o workflow continuaria buscando o ID
antigo. O ID em uso está na variável `DRIVE_FILE_ID` do workflow.

O compartilhamento precisa continuar em **qualquer pessoa com o link, leitor**.
Se virar restrito, o Drive passa a responder HTML em vez do PDF; o workflow
detecta e falha em vez de gravar lixo por cima do CV bom.

Antes de gravar, o workflow confere que a resposta começa com `%PDF`, que tem
entre 50 KB e 25 MB e que termina com `%%EOF`. Só faz commit se o conteúdo
mudou de verdade, então dia sem alteração não gera commit nem rebuild.

## Deploy

Este repositório é o user site da conta `regisregi`: **todo push na `main` publica direto**, sem workflow de build e sem branch `gh-pages`. O único workflow é o que sincroniza o CV, e ele publica dando push na `main` como qualquer commit. O Pages está configurado em Settings → Pages com *Deploy from a branch* (`main`, `/ (root)`) e o domínio custom `regisregi.com`.

- O arquivo `CNAME` na raiz mantém o domínio configurado entre deploys. Não apagar.
- A branch `gh-pages` e o workflow antigos (herdados do project site) foram aposentados; se a branch `gh-pages` ainda existir no remoto, pode ser excluída.
- Certificado TLS emitido e **Enforce HTTPS** ativo: `http://regisregi.com` redireciona para `https://`.

## Idiomas

O português vive em `/` e o inglês em `/en/`, cada um com URL própria e HTML próprio. Não há tradução por JavaScript: a página inglesa é indexável e não pisca no idioma errado ao carregar.

- Os dois arquivos se apontam com `hreflang` (`pt-BR`, `en` e `x-default` no português), e o seletor `PT` / `EN` fica no cabeçalho.
- CSS, JS e assets são compartilhados. A página em `/en/` referencia tudo com `../`.
- Os ids das seções são traduzidos (`about`, `work`, `skills`, `writing`, `contact`). O scrollspy do `js/site.js` lê esses ids do próprio rail, então não há lista de ids fixa no código e o mesmo script serve aos dois idiomas.
- As classes de cor de trilha (`dot-roteiro`, `dot-curadoria`) seguem em português nos dois: são nomes de classe do CSS, não texto visível.
- Ao editar um trabalho, editar nos dois arquivos. São páginas independentes de propósito.
- O CV em PDF é o mesmo nos dois idiomas e está em português.

## Google Analytics

GA4 ativo, propriedade `G-R19SB2FGP1`, com o mesmo bloco `gtag.js` no `<head>` de três arquivos: `index.html`, `en/index.html` e `analise.html`. Ao mexer no snippet, mexer nos três.

A medição aprimorada do GA4 já cobre sozinha as visualizações de página, a rolagem, os cliques em links externos (YouTube, Instagram, Academia, LinkedIn) e o download do CV em PDF. Não há código nosso para nada disso.

O único evento manual é **`abrir_projeto`**, em `js/site.js`: expandir uma linha do índice não gera navegação, então o GA4 não enxerga sozinho qual projeto interessou a quem visitou. O evento sai só na abertura (não ao fechar), leva o parâmetro `projeto` com o nome da produção, e só dispara se `window.gtag` existir, de modo que nada quebra com o Analytics desligado ou bloqueado no navegador.

Para ver `projeto` como dimensão nos relatórios, é preciso registrá-la uma vez em Administrador → Definições personalizadas → Dimensão personalizada, com o parâmetro `projeto` e escopo de evento. Sem isso o evento é contado, mas o nome do projeto não aparece quebrado por produção.

Não há aviso de cookies no site. Se o tráfego da UE/LGPD virar preocupação, avaliar um banner de consentimento.

## Pixel da Meta (ligado)

Conjunto de dados **`RegisRegiHome`**, ID `4734001130163052`, no portfólio
Maratonistas Podcast do Meta Business. O código está em `js/site.js`, no
objeto `META_PIXEL`, hoje com **`ATIVO: true`**.

O interruptor é único e não tem meio-termo: em `false`, nada é baixado da
Meta, nenhuma requisição sai e nenhum cookie de anúncio é criado. Não é evento
suprimido, é o pixel inexistente para quem visita. Vale para os dois idiomas
de uma vez, porque o arquivo serve as duas páginas.

Eventos ligados aos gestos que já existem na página:

| Evento | Gatilho |
|---|---|
| `PageView` | carga da página |
| `Contact` | clique em qualquer link `mailto:` |
| `Lead` | clique no botão "Baixar CV" |
| `ViewContent` | abrir uma linha do índice; leva o nome da produção |

`Contact` e `Lead` saem de um único listener no `document`, então valem para
os dois idiomas e para link novo que apareça depois, sem religar nada.

**Não há aviso de cookies, e o pixel está ligado assim mesmo, por decisão do
dono.** Isto é rastreamento publicitário de terceiro, categoria diferente do
Analytics. Se um dia entrar um banner de consentimento, o ponto de amarrar o
disparo ao aceite é a chamada de `carregarPixel()`, não os eventos: o certo é
não carregar nada antes do aceite.

Sem campanha rodando, o pixel não mostra relatório de visitantes: ele acumula
público de remarketing para uso futuro. Quem responde "quem visitou o site" é
o GA4.

## Pendências (TODO)

- **Vídeos hospedados localmente**: hoje os materiais das produções abrem via links do YouTube dentro de cada experiência (mapeados a partir dos hyperlinks do PDF do CV). O Régis vai baixar os vídeos ele mesmo mais tarde; quando existirem os arquivos, servir localmente (ou via storage próprio) e trocar os links por `<video>`.

## Para testar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

O Lab NLP depende de `api.rss2json.com` (o Medium bloqueia leitura server-side, então o feed é lido no navegador). Modo demo do Lab: `analise.html?demo=1`.

**O Lab está fora do ar por decisão do Régis.** A página e o `js/analise.js` continuam versionados e acessíveis pela URL direta; o que saiu foi o link na seção Escrita, comentado em HTML nos dois idiomas. Para religar, descomentar o bloco marcado nos dois arquivos (atenção ao caminho: `analise.html` no pt, `../analise.html` no en).

## O que personalizar

- **CV**: não trocar o PDF na mão. Ele é sincronizado do Google Drive por GitHub Actions (ver *CV sincronizado do Drive*). Basta subir a versão nova no Drive.
- **Cores do index**: tudo em `css/tokens.css`, com a regra de uso de cada cor comentada. `--accent` (violeta) é a única cor de interface; as quatro cores de frente (`--coord`, `--roteiro`, `--edicao`, `--curadoria`) só aparecem nos pontos sob o nome.
- **Cores do Lab**: `:root` no topo do `css/style.css` (paleta de dados validada para daltonismo).
- **Trabalhos**: cada experiência é um `<li class="row">` no `index.html` (número, nome-botão, meta, painel expansível com descrição). Para adicionar, copiar uma linha e renumerar.
- **Dois tipos de linha**: a que **expande** um painel é `<li class="row">` com `<button class="row-name">` e afordância `+`. A que **leva para fora** é `<li class="row row-out">` com um único `<a class="row-hit">` envolvendo os quatro spans: o `<a>` assume o grid e o padding, então a faixa inteira é clicável, e o nome vem sublinhado com a seta `↗` em violeta. Não misturar os dois numa linha só.
- **Recuo do índice**: `.work` recebe `margin-left` acima de 861px para os números não colidirem com o rail de cenas, que é fixo à esquerda e some abaixo desse ponto. O título da seção fica na margem, a lista recua: o degrau é intencional.
- **Pôsteres**: cada painel de trabalho pode ter um `<div class="sheet">` no fim, com um `<figure>` por produção. Célula recortada em 2:3, **em cor cheia desde o repouso**; no hover a moldura interna acende no acento e a imagem clareia de leve. A fileira é **centrada** e o `.sheet` é **flex**, não grid: o `justify-content` do grid centra as trilhas e deixava o pôster de uma última fileira incompleta encostado à esquerda. Célula com base de 130px que cresce até 185px, com teto de 1240px e `width: 100%` junto do `margin-inline: auto` (sem o `width` a margem automática tira o stretch do item de grid e o bloco encolhe). O maior painel tem 6 pôsteres (DOT Cine) e sai em fileira única a partir de ~1060px; abaixo disso quebra, e cada fileira sai centrada. Pôster de produção com material público é link para o mesmo destino do `.plink` do texto; sem material, entra como `<figure class="mute">` sem link. Arquivos e nomes em `assets/posters/README.md`.
- **Medida do painel**: o `max-width: 70ch` fica nos `<p>` e na `.tagline`, não no `.panel-inner`. Assim o texto mantém a medida de leitura e o contact sheet usa a largura inteira da linha.
- **Links de material**: inline no corpo do parágrafo, com a classe `.plink` (itálico, sublinhado, azul, seta ↗), no lugar exato onde o título do projeto é citado — não em lista de chips no fim do parágrafo. Se o texto não citar o título por nome, inserir a citação para o link ter onde pousar (ver DOT Cine e Porta dos Fundos como exemplo). Sem link conhecido, o título fica só em `<strong>`.
- **Contato**: e-mail e LinkedIn na seção `#contato`. Por decisão do dono, o site não expõe telefone nem retrato; não reintroduzir.

## Créditos técnicos

Fontes via Google Fonts (Anton, Archivo e Space Mono). Sem dependências, sem frameworks, com skip link, foco visível, contraste AA, paleta de dados do Lab validada para daltonismo e `prefers-reduced-motion` respeitado (a abertura letra a letra e a contagem dos números desligam).
