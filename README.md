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
├── robots.txt                  → libera os buscadores e aponta o sitemap
├── sitemap.xml                 → as duas páginas públicas, com hreflang
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

## Busca (SEO)

Cada página tem `title`, `description`, `canonical` e o par `hreflang` ligando
português e inglês. Além disso:

- **`robots.txt`** libera tudo e aponta o `sitemap.xml`. O que não deve ser
  indexado é marcado com `noindex` na própria página, nunca bloqueado aqui:
  página bloqueada no `robots.txt` não chega a ser lida, então o buscador
  nunca veria o `noindex`.
- **`sitemap.xml`** lista só `/` e `/en/`, cada uma com os três `hreflang`.
  Ao publicar mudança grande de conteúdo, atualizar o `lastmod`.
- **`analise.html` está `noindex,follow`** enquanto o Lab estiver fora do ar,
  para não competir com a home. Ao religar o Lab, voltar a `index,follow` e
  reincluir a URL no sitemap.
- **Ficha `Person` (JSON-LD)** no `<head>` dos dois index. O `@id` é o mesmo
  nos dois de propósito: diz ao Google que as páginas descrevem a mesma
  pessoa, não dois homônimos. Regra ao editar: só afirmar ali o que o site já
  afirma em texto visível. Ao mudar cargo, cidade ou perfis, mudar nos dois.
- **Não há `og:image`.** O cartão de compartilhamento sai só com texto, e o
  `twitter:card` está em `summary`. Quando existir a imagem 1200x630, ligar
  `og:image` nos dois index e trocar os dois para `summary_large_image`.

## Google Analytics

GA4 ativo, propriedade `G-R19SB2FGP1`, com o mesmo bloco `gtag.js` no `<head>` de três arquivos: `index.html`, `en/index.html` e `analise.html`. Ao mexer no snippet, mexer nos três.

A medição aprimorada do GA4 já cobre sozinha as visualizações de página, a rolagem, os cliques em links externos (YouTube, Instagram, Academia, LinkedIn) e o download do CV em PDF. Não há código nosso para nada disso.

O único evento manual é **`abrir_projeto`**, em `js/site.js`: expandir uma linha do índice não gera navegação, então o GA4 não enxerga sozinho qual projeto interessou a quem visitou. O evento sai só na abertura (não ao fechar), leva o parâmetro `projeto` com o nome da produção, e só dispara se `window.gtag` existir, de modo que nada quebra com o Analytics desligado ou bloqueado no navegador.

Para ver `projeto` como dimensão nos relatórios, é preciso registrá-la uma vez em Administrador → Definições personalizadas → Dimensão personalizada, com o parâmetro `projeto` e escopo de evento. Sem isso o evento é contado, mas o nome do projeto não aparece quebrado por produção.

Não há aviso de cookies no site. Se o tráfego da UE/LGPD virar preocupação, avaliar um banner de consentimento.

## Topo do site: glitch e faixa de marcas

Duas peças novas na hero, escolhidas entre variantes prototipadas:

- **Glitch "corte de fita"** no nome (`.hero-name .ln::before/::after` em
  `css/site.css`). Duas fatias saltam na lateral em amarelo (`--roteiro`) e
  violeta (`--curadoria`), como emenda mal alinhada na ilha de edição. Ciclo
  de 3,5s. As cópias nascem de `content: attr(data-txt)`, então o HTML
  carrega o `data-txt` em cada `.ln` com o mesmo texto visível — se um dia
  o nome mudar, mudar os dois juntos ou o glitch mostra o nome antigo.
- **Faixa de marcas com rótulo fixo** (`.marcas` logo abaixo do `.hero-foot`).
  Rolagem infinita sem JavaScript: a lista de marcas existe duas vezes dentro
  de `.marcas-trilho` e a faixa anda `-50%`, então o ponto de emenda cai onde
  a segunda cópia começa e o laço não salta. A segunda cópia é
  `aria-hidden="true"`, para não duplicar para leitor de tela. As marcas são
  wordmark tipográfico, não logo de arquivo, e vêm só do que o CV lista:
  Netflix, Disney+, Star+, HBO Max, Paramount+, Discovery+, A&E, Canal
  Brasil, Canal OFF, TNT, Porta dos Fundos. Em telas até 640px o rótulo some
  e só a faixa fica, para não brigar por espaço com o nome.

Os dois desligam em `prefers-reduced-motion: reduce`: o glitch para e some,
a faixa vira lista estática sem a segunda cópia oculta.

## Incentivo a abrir as linhas de Trabalho

Feedback real: no celular ninguém percebia que cada linha de trabalho abre
(o único sinal era um "+" pequeno). Decidido por um painel de design com
quatro abordagens independentes, julgadas e sintetizadas em duas camadas
que reusam o vocabulário visual que o site já tem, sem inventar cor, ícone
ou tooltip novo (`css/site.css`):

- **Peso Assentado (permanente, sem JS/animação).** O `.row-plus` ("+") para
  de se comportar como metadado sussurrado (mono pequeno, `--dim`) e passa a
  pesar como controle secundário: `font-weight: 700`,
  `font-size: clamp(1.3rem, 3vw, 1.9rem)`, `color: var(--ink)`. Escopado com
  `:not(.row-ext):not(.row-go)` porque essas duas classes reusam `.row-plus`
  só pelo grid, na seta de saída de Escrita (↗ →), que precisa continuar
  leve. Funciona em toda linha, sempre, com ou sem JavaScript, com ou sem
  `prefers-reduced-motion` — é a correção que nunca falha.
- **Varredura de entrada (reforço animado, uma vez por carregamento).** Ao
  a lista de Trabalho entrar em cena, uma passagem única de cima a baixo
  reproduz, linha a linha, os MESMOS valores que `.row:hover` já usa (cor
  accent, deslocamento do nome, fio embaixo) — não é vocabulário novo, é o
  estado de interação real acontecendo sem precisar de dedo ou mouse.
  Reaproveita o `IntersectionObserver` que já existe para `.cut` em
  `js/site.js` (fire-once, nenhum observer novo). Escopado com
  `:is(#trabalho, #work)` porque o id da seção muda por idioma (`#trabalho`
  no pt-BR, `#work` no en) e as duas páginas carregam este mesmo CSS.

Também corrigido no caminho, pré-requisito técnico independente da escolha
acima: `.row:hover` não estava escopado a dispositivo com hover de verdade.
Sem esse escopo, um toque no celular deixava a linha "presa" na cor de hover
até o próximo toque em outro lugar da tela, porque touch simula hover ao
tocar mas não tem como "tirar o mouse de cima" para sair dele. Agora vive em
`@media (hover: hover) and (pointer: fine)`; `:focus-within` continua fora
do escopo, porque navegação por teclado não deve depender de hover.

As quatro propostas descartadas (incluindo um coachmark de abertura
automática e um efeito de dobradiça ligado ao scroll via
`animation-timeline: view()`) e o raciocínio completo do julgamento ficam
fora do repositório — foram avaliação de processo, não decisão final.

## Sala de projeção (vídeo dentro do site)

Clicar num pôster abre o vídeo em `<dialog>` nativo em vez de mandar o
visitante para o YouTube. O `<a href target="_blank">` continua no HTML: sem
JS, sem suporte a `<dialog>` ou com `data-embed="off"` num pôster, o clique
volta a levar para fora, que é a degradação honesta.

- **Nenhum iframe existe antes do clique** e nenhum sobrevive ao fechamento,
  então a página em repouso continua sem player. Verificado: 0 iframes antes,
  1 com a sala aberta, 0 depois de fechar.
- **`<dialog>` nativo de propósito**: entrega prisão de foco real, resto do
  documento inerte, Esc e top layer sem disputa de `z-index` com o rail (30),
  o topo (30), o grão (40) e o skip link (50).
- **A limpeza NÃO depende do evento `close`.** Ele existe na especificação,
  mas medindo aqui num `showModal()`/`close()` direto, sem nosso código no
  meio, ele não disparou, e a página ficava com `body position: fixed`, ou
  seja, travada sem rolagem depois de fechar o vídeo. `fecharAgora()` chama
  `limpar()` direto; o listener de `close` continua como rede, e `limpar()` é
  idempotente para rodar duas vezes não fazer nada na segunda.
- **Índice de episódios** quando o pôster é playlist: a sala ganha ao lado da
  tela o mesmo índice tipográfico que o site usa na seção de Trabalho, número
  em mono e título ao lado, faixa em exibição no acento. No celular ele desce
  para baixo do vídeo com rolagem própria e altura limitada.
- As faixas vêm de `<script type="application/json" id="proj-listas">` assado
  no HTML, extraído uma vez da própria lista do YouTube. **Nenhuma chave de
  API e nenhum script externo rodam no navegador de quem visita.** Ao mudar
  uma playlist, atualizar esse bloco nos dois arquivos.
- 302 e 502 apontam para a MESMA playlist de 6 vídeos (3 de cada série), então
  cada pôster carrega `data-start` e abre na sua própria faixa: `0` e `3`.
- As setas do rodapé andam entre **produções** da folha de contato; o índice
  ao lado da tela anda entre **episódios** da produção atual.
- Parâmetros do embed: `youtube-nocookie`, `playsinline=1` (sem ele o iOS
  arranca o vídeo para o player nativo em tela cheia e a premissa de reter
  morre), `color=white` para a barra vermelha não entrar na sala, `hl` vindo
  do `lang` da página.

**Instagram sobe DESLIGADO** (`EMBED_IG = false` em `js/site.js`). O embed
carrega como documento cross-origin legítimo, mas nunca foi confirmado
visualmente o que ele desenha, e o modo de falha é o pior possível num
portfólio: a sala abre e no meio dela um retângulo branco ou um pedido de
login, e quem olha conclui que o material não existe. São 4 pôsteres contra
13, e o painel do Grupo Sal é 100% Instagram, então a falha não seria um
pôster estranho, seria um trabalho inteiro quebrado. Para ligar: conferir os
quatro `.../embed/captioned/` em janela anônima e no celular; se os quatro
renderizarem o vídeo, trocar para `true`.

**Painel da Maracutaia.fm tem pôster e sala, com uma ressalva conhecida.**
O painel ganhou `assets/posters/maracutaia.jpg` (a marca, não uma foto de
produção; ver `assets/posters/README.md`) ligado à playlist "Sets
Maracutaia.fm". A sala monta o índice com as 9 faixas reais da playlist,
mas **7 das 9 devolvem erro 150 da IFrame Player API**: o dono do canal
desativou a exibição fora do YouTube para esses vídeos especificamente.
É configuração do canal (`@casa33rio`), não bug do site.

Decidido subir os 9 mesmo assim, ao contrário do Instagram, porque aqui o
modo de falha é CONHECIDO e contido, não uma incógnita: o YouTube desenha o
próprio card "assistir no YouTube" dentro do nosso retângulo preto (feio,
não quebrado), e "Ver original ↗" continua visível o tempo todo apontando
para a playlist completa. As duas faixas que hoje tocam embutidas são
`fNN-2GiPE0M` (Drama EFX Openhouse) e `u0Lxj6oraJk` (Mateus tuK). Se o dono
do canal liberar embed nas outras 7 no YouTube Studio, elas passam a tocar
sem eu precisar mudar nada: a permissão é checada pelo YouTube a cada
carregamento, não fica guardada no site.

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
