/* RÉGIS REGI · portfólio — comportamento
   Efeito assinatura: nome da hero entra letra a letra (porte vanilla de SplitText).
   Suporte: reveals por IntersectionObserver, rail de cenas, índice expansível,
   contagem dos números do panorama. Tudo respeita prefers-reduced-motion. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* PIXEL DA META — LIGADO.

     Interruptor único do site: trocar ATIVO para false desliga de verdade,
     sem meio-termo. Nada é baixado da Meta, nenhuma requisição sai e nenhum
     cookie de anúncio é criado. Vale para os dois idiomas de uma vez, porque
     este arquivo serve as duas páginas.

     Isto é rastreamento publicitário de terceiro, categoria diferente do
     Analytics, e o site não pede consentimento a ninguém. Ligado por decisão
     do dono. Se um dia entrar aviso de cookies, o lugar de amarrar o disparo
     ao aceite é aqui, na chamada de carregarPixel(). */
  var META_PIXEL = {
    ATIVO: true,
    ID: "4734001130163052"          // conjunto de dados "RegisRegiHome"
  };

  /* Fila oficial do fbq: segura as chamadas até o fbevents.js terminar de
     carregar, então evento disparado no primeiro segundo não se perde. */
  function carregarPixel() {
    if (window.fbq) { return; }
    var fbq = window.fbq = function () {
      if (fbq.callMethod) { fbq.callMethod.apply(fbq, arguments); }
      else { fbq.queue.push(arguments); }
    };
    window._fbq = window._fbq || fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);

    fbq("init", META_PIXEL.ID);
    fbq("track", "PageView");
  }

  /* Ponto único de envio. Com o pixel desligado, bloqueado por extensão ou
     fora do ar, vira no-op e nada no site quebra. */
  function pixel(evento, dados) {
    if (META_PIXEL.ATIVO && typeof window.fbq === "function") {
      window.fbq("track", evento, dados || {});
    }
  }

  if (META_PIXEL.ATIVO) { carregarPixel(); }

  /* Contact: clique em qualquer e-mail da página. Lead: download do CV.
     Um listener só no documento cobre os dois idiomas e qualquer link novo
     que apareça depois, sem precisar religar nada. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a") : null;
    if (!a) { return; }
    if (a.protocol === "mailto:") {
      pixel("Contact");
    } else if (a.classList.contains("cv")) {
      pixel("Lead", { content_name: "CV em PDF" });
    }
  });

  /* toque: destrava o :active no Safari do iPhone. Sem ao menos UM listener
     de touchstart no documento, o iOS não aplica :active a elemento nenhum —
     e o "corte seco no toque" do CSS ficaria mudo exatamente onde foi feito
     para falar. Passivo e vazio de propósito: o efeito colateral É o
     recurso. */
  document.addEventListener("touchstart", function () {}, { passive: true });

  /* segurar a fita: pousar o dedo pausa o marquee de marcas, o mesmo gesto
     que o hover já faz no desktop — a lista é credencial e precisa ser
     legível também no toque. Pointer Events passivos, nenhum preventDefault:
     o scroll vertical segue intacto. pointercancel é inegociável — quando o
     navegador toma o gesto para si (scroll), sem ele a fita ficaria presa.
     Com reduce-motion o trilho nem anda, então nem ligamos. */
  var faixaMarcas = document.querySelector(".marcas-faixa");
  if (faixaMarcas && !reduceMotion) {
    var soltarFita = function () { faixaMarcas.classList.remove("presa"); };
    faixaMarcas.addEventListener("pointerdown", function () {
      faixaMarcas.classList.add("presa");
    }, { passive: true });
    faixaMarcas.addEventListener("pointerup", soltarFita, { passive: true });
    faixaMarcas.addEventListener("pointercancel", soltarFita, { passive: true });
    faixaMarcas.addEventListener("pointerleave", soltarFita, { passive: true });
  }

  /* playhead: o timecode do rail corre com a rolagem, 3px = 1 quadro a
     24fps. O rail diz QUAL cena; o timecode dá a posição contínua, como o
     playhead numa timeline. O gate é o complemento EXATO da consulta que
     esconde o rail no CSS (max-width: 860px) — min-width: 861px deixava
     larguras fracionárias entre 860 e 861 com rail visível e módulo morto,
     a mesma colisão que o recuo do índice já documenta no site.css. Só o
     módulo armado põe .tc-vivo no html, e só .tc-vivo mostra o span: boot
     em tela estreita ou com menos-movimento degrada para "timecode
     ausente", nunca "congelado em 00:00:00:00". Avaliado uma vez no boot:
     religar em resize custaria mais que o caso de borda vale. textContent
     só quando o quadro muda, para scroll subpixel não repintar à toa. */
  var railTc = document.querySelector(".rail-tc");
  if (railTc && !reduceMotion && !window.matchMedia("(max-width: 860px)").matches) {
    var tcDois = function (n) { return (n < 10 ? "0" : "") + n; };
    var tcQuadro = -1;
    var tcAgendado = false;
    var tcPintar = function () {
      tcAgendado = false;
      /* Math.max: o overscroll elástico do Safari (macOS e iPad) deixa o
         pageYOffset NEGATIVO durante o rubber band, e -3 sairia impresso
         como "0-1:0-1:0-1:0-3" no rail */
      var q = Math.round(Math.max(0, window.pageYOffset || 0) / 3);
      if (q === tcQuadro) { return; }
      tcQuadro = q;
      var s = Math.floor(q / 24);
      railTc.textContent = tcDois(Math.floor(s / 3600)) + ":" +
        tcDois(Math.floor(s / 60) % 60) + ":" + tcDois(s % 60) + ":" +
        tcDois(q % 24);
    };
    window.addEventListener("scroll", function () {
      if (!tcAgendado) { tcAgendado = true; window.requestAnimationFrame(tcPintar); }
    }, { passive: true });
    document.documentElement.classList.add("tc-vivo");
    tcPintar();                    /* estado inicial: quem chega por âncora não começa em zero */
  }

  /* assinatura: quebra cada linha do nome em letras com atraso escalonado.
     O h1 leva aria-label com o nome íntegro; as letras ficam aria-hidden. */
  var name = document.querySelector(".hero-name");
  if (name && !reduceMotion) {
    var lines = Array.prototype.map.call(name.querySelectorAll(".ln"), function (ln) {
      return ln.textContent.trim();
    });
    name.setAttribute("aria-label", lines.join(" "));
    var delay = 0;
    name.querySelectorAll(".ln").forEach(function (ln) {
      ln.setAttribute("aria-hidden", "true");
      var text = ln.textContent;
      ln.textContent = "";
      text.split("").forEach(function (chr) {
        var s = document.createElement("span");
        s.className = "ch";
        s.textContent = chr;
        s.style.setProperty("--d", (delay * 0.035) + "s");
        delay += 1;
        ln.appendChild(s);
      });
    });
    name.classList.add("split");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { name.classList.add("go"); });
    });
  }

  /* corte: cada bloco entra quando aparece */
  var cuts = document.querySelectorAll(".cut");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    cuts.forEach(function (c) { io.observe(c); });
  } else {
    cuts.forEach(function (c) { c.classList.add("in"); });
  }

  /* panorama: números contam até o valor ao entrar em cena */
  var stats = document.querySelectorAll(".stat dd");
  if (stats.length && !reduceMotion && "IntersectionObserver" in window) {
    var animateCount = function (el) {
      var raw = el.textContent.trim();
      var target = parseInt(raw, 10);
      if (isNaN(target)) { return; }
      var suffix = raw.replace(/^\d+/, "");
      var pad = raw.length - suffix.length;
      var t0 = null;
      var dur = 900;
      var step = function (ts) {
        if (!t0) { t0 = ts; }
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var v = String(Math.round(target * eased));
        while (v.length < pad) { v = "0" + v; }
        el.textContent = v + suffix;
        if (p < 1) { requestAnimationFrame(step); }
      };
      requestAnimationFrame(step);
    };
    var seen = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); seen.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { seen.observe(s); });
  }

  /* rail: cena ativa */
  var railLinks = {};
  document.querySelectorAll(".rail a").forEach(function (a) { railLinks[a.dataset.sec] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        Object.keys(railLinks).forEach(function (k) { railLinks[k].classList.remove("on"); });
        var link = railLinks[e.target.id];
        if (link) { link.classList.add("on"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    /* os ids das seções vêm do próprio rail, então o mesmo script serve
       para a página em português e para a versão em inglês em /en/ */
    Object.keys(railLinks).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { spy.observe(el); }
    });
  }

  /* linhas do índice: a linha inteira expande, o nome é o botão.
     Cliques em links de dentro do painel passam direto. */
  document.querySelectorAll(".row").forEach(function (row) {
    var btn = row.querySelector("button.row-name");
    if (!btn) { return; }

    row.addEventListener("click", function (e) {
      /* qualquer clique DENTRO do painel aberto não deve alternar a linha,
         só o cabeçalho (número, nome, meta, +) deve. Antes só link era
         ignorado, e clicar num pôster sem material (sem <a>, caso de
         Temporada de Bônus e A Estranha na Cama) ou até no parágrafo de
         descrição borbulhava até aqui e fechava a subseção sozinho. .panel é
         irmão do cabeçalho, nunca o envolve, então este guard não impede
         abrir a linha pelo nome. */
      if (e.target.closest(".panel")) { return; }
      if (e.target.closest("a")) { return; }
      var open = row.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");

      /* medição: abrir o painel não gera navegação, então o Analytics não
         enxerga sozinho. Enviamos só na abertura. Se o gtag não estiver
         ativo (bloco do GA ainda comentado, ou bloqueador), não faz nada. */
      if (open && typeof window.gtag === "function") {
        window.gtag("event", "abrir_projeto", { projeto: btn.textContent.trim() });
      }
      if (open) {
        pixel("ViewContent", { content_name: btn.textContent.trim() });
      }
    });
  });

  /* faixa "Exibido em": cada canal leva à subseção mais relevante. O alvo
     vem de data-alvo (id do painel); daqui a gente abre a linha, rola até
     ela e passa o foco pro botão, para teclado e leitor de tela seguirem
     do lugar certo. Modificador de teclado ou id inexistente: o href age
     sozinho (nova aba, ou âncora da seção de Trabalho). A rolagem
     respeita menos-movimento consultando o MediaQueryList na hora. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest(".marcas-trilho a[data-alvo]") : null;
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
    var painel = document.getElementById(a.getAttribute("data-alvo"));
    var row = painel && painel.closest(".row");
    var btn = row && row.querySelector("button.row-name");
    if (!btn) { return; }
    e.preventDefault();
    if (!row.classList.contains("open")) {
      row.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      if (typeof window.gtag === "function") {
        window.gtag("event", "abrir_projeto", { projeto: btn.textContent.trim(), origem: "exibido_em" });
      }
      pixel("ViewContent", { content_name: btn.textContent.trim() });
    }
    var quer = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    row.scrollIntoView({ behavior: quer, block: "start" });
    btn.focus({ preventScroll: true });
  });

  /* ---------- sala de projeção ----------
     Clicar num pôster abre o vídeo aqui dentro em vez de mandar o visitante
     para o YouTube. O <a href> continua no HTML: sem JS, sem <dialog> ou com
     data-embed="off", o clique volta a levar para fora, que é a degradação
     honesta. Nenhum iframe existe antes do clique e nenhum sobrevive ao
     fechamento, então a página em repouso continua sem player nenhum. */
  var proj = document.getElementById("proj");
  if (proj && typeof proj.showModal === "function") (function () {

    /* INSTAGRAM DESLIGADO. O embed carrega como documento cross-origin
       legítimo, mas nunca foi confirmado VISUALMENTE o que ele desenha, e o
       modo de falha é o pior possível num portfólio: a sala abre bonita e no
       meio dela um retângulo branco ou um pedido de login, e quem olha conclui
       que o material não existe. São 4 pôsteres contra 13, e o painel do Grupo
       Sal é 100% Instagram, então a falha não seria um pôster estranho, seria
       um trabalho inteiro quebrado. Enquanto for false, esses 4 seguem como
       link externo, que é o comportamento conhecido e correto de hoje.
       Para ligar: conferir os quatro embeds em janela anônima e no celular, e
       trocar para true. Vale para os dois idiomas de uma vez. */
    var EMBED_IG = false;

    var room = proj.querySelector(".proj-room"), slot = proj.querySelector(".proj-slot");
    var elIdx = proj.querySelector(".proj-idx"), elSrc = proj.querySelector(".proj-src");
    var elTit = proj.querySelector(".proj-title"), elOut = proj.querySelector(".proj-out");
    var elBlind = proj.querySelector(".proj-blind"), btnX = proj.querySelector(".proj-x");
    var elNav = proj.querySelector(".proj-nav"), elCount = proj.querySelector(".proj-count");
    var btnPrev = proj.querySelector(".proj-prev"), btnNext = proj.querySelector(".proj-next");
    var elLive = proj.querySelector(".proj-live");
    var elList = proj.querySelector(".proj-list"), elListOl = elList.querySelector("ol");

    /* faixas de cada playlist, assadas no HTML. Extraídas uma vez da própria
       lista do YouTube, então a sala monta o índice sem chave de API e sem
       script externo rodando no navegador de quem visita. */
    var LISTAS = {};
    try {
      var brutas = document.getElementById("proj-listas");
      if (brutas) { LISTAS = JSON.parse(brutas.textContent); }
    } catch (err) { LISTAS = {}; }
    var faixa = 0;                      /* episódio atual dentro da playlist */
    var mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var LANG = (document.documentElement.lang || "en").slice(0, 2);
    var opener = null, closing = false, guard = 0, igTimer = 0, igOk = false;
    var scrollY = 0, downInRoom = false, warmed = {};
    var rolo = [], pos = 0, atual = null;

    /* data-* manda; sem ele, deduz do href, então pôster colado amanhã
       funciona sem tocar no JS. list= é testado ANTES de v= porque
       watch?v=X&list=Y deve abrir a lista. */
    function receita(a) {
      var kind = a.getAttribute("data-embed") || "", id = a.getAttribute("data-id") || "";
      if (kind === "off") { return null; }
      var href = a.getAttribute("href") || "", m;
      if (!kind || !id) {
        if ((m = href.match(/[?&]list=([\w-]+)/))) { kind = "yt-list"; id = m[1]; }
        else if ((m = href.match(/(?:v=|youtu\.be\/|\/embed\/)([\w-]{11})/))) { kind = "yt"; id = m[1]; }
        else if ((m = href.match(/instagram\.com\/(?:[^\/?#]+\/)?(p|reel|tv)\/([\w-]+)/))) { kind = "ig"; id = m[1] + "/" + m[2]; }
        /* Spotify tem endpoint de embed próprio (/embed/show/ID), então o
           podcast toca aqui dentro como o vídeo toca */
        else if ((m = href.match(/open\.spotify\.com\/(show|episode|playlist|album)\/([\w]+)/))) { kind = "sp-" + m[1]; id = m[2]; }
      }
      if (kind === "ig" && !EMBED_IG) { return null; }
      return (kind && id) ? { kind: kind, id: id } : null;
    }

    /* playsinline=1 é o parâmetro decisivo: sem ele o iOS arranca o vídeo para
       o player nativo em tela cheia e a premissa de reter morre. color=white
       apaga a barra vermelha, a única cor forte que entraria na sala. */
    function fonte(r) {
      var q = "autoplay=1&playsinline=1&rel=0&color=white&iv_load_policy=3&hl=" + LANG;
      if (r.kind === "yt") { return "https://www.youtube-nocookie.com/embed/" + r.id + "?" + q; }
      if (r.kind === "yt-list") {
        var itens = LISTAS[r.id];
        /* com as faixas em mãos tocamos VÍDEO A VÍDEO e a navegação é a nossa
           lista, não a do YouTube. Sem elas, cai no endpoint de playlist do
           YouTube, que ainda funciona, só sem índice próprio. */
        if (itens && itens[faixa]) {
          return "https://www.youtube-nocookie.com/embed/" + itens[faixa].id + "?" + q;
        }
        return "https://www.youtube-nocookie.com/embed/videoseries?list=" + r.id + "&" + q;
      }
      if (r.kind.indexOf("sp-") === 0) {
        return "https://open.spotify.com/embed/" + r.kind.slice(3) + "/" + r.id + "?theme=0";
      }
      return "https://www.instagram.com/" + r.id + "/embed/captioned/";
    }

    /* desenha o índice de episódios. aria-current marca a faixa em exibição,
       que é o que leitor de tela usa para dizer "item atual". */
    function montarLista(r) {
      var itens = (r.kind === "yt-list") ? LISTAS[r.id] : null;
      elListOl.textContent = "";
      if (!itens || itens.length < 2) { elList.hidden = true; return false; }
      itens.forEach(function (item, i) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.className = "proj-faixa";
        b.setAttribute("aria-current", i === faixa ? "true" : "false");
        var n = document.createElement("span");
        n.className = "n"; n.textContent = zero(i + 1);
        /* o número é ordinal visual: a <ol> já anuncia "item 3 de 6", e sem
           isto o nome acessível do botão sairia colado, "03A Força de Arte" */
        n.setAttribute("aria-hidden", "true");
        var t = document.createElement("span");
        t.className = "t"; t.textContent = item.t;
        b.appendChild(n); b.appendChild(t);
        b.addEventListener("click", function () {
          if (i === faixa) { return; }
          faixa = i;
          pintar(true);
        });
        li.appendChild(b);
        elListOl.appendChild(li);
      });
      elList.hidden = false;
      return true;
    }
    function host(r) { return r.kind === "ig" ? "https://www.instagram.com" : "https://www.youtube-nocookie.com"; }
    function aquecer(r) {
      var h = host(r); if (warmed[h]) { return; } warmed[h] = 1;
      var l = document.createElement("link");
      l.rel = "preconnect"; l.href = h; l.crossOrigin = "";
      document.head.appendChild(l);
    }
    function ouvirIG(e) { if (e.origin === "https://www.instagram.com") { igOk = true; } }
    function zero(n) { return (n < 10 ? "0" : "") + n; }

    function pintar(troca) {
      var a = rolo[pos], r = receita(a);
      var fig = a.closest("figure"), cap = fig && fig.querySelector("figcaption");
      var titulo = cap ? cap.textContent.trim() : ((a.querySelector("img") || {}).alt || "");

      elTit.textContent = titulo;        /* nome vem do HTML: bilíngue de graça */
      elOut.href = a.href;
      elBlind.hidden = true;

      var temLista = montarLista(r);
      /* som não é vídeo: o embed do Spotify tem altura própria e ficaria
         perdido dentro de um retângulo 16:9 */
      var forma = r.kind === "ig" ? "ig"
        : (r.kind.indexOf("sp-") === 0 ? "som" : (temLista ? "list" : "wide"));
      room.setAttribute("data-shape", forma);

      elNav.hidden = rolo.length < 2;
      elCount.textContent = zero(pos + 1) + " / " + zero(rolo.length);
      btnPrev.disabled = (pos === 0);
      btnNext.disabled = (pos === rolo.length - 1);

      /* 302 e 502 apontam para a MESMA playlist, mas abrem em faixas
         diferentes (data-start), então a faixa entra na comparação: mesmo
         kind+id+faixa não recria o iframe e o vídeo em andamento não
         reinicia; faixa diferente troca o vídeo. */
      var mesma = atual && atual.kind === r.kind && atual.id === r.id && atual.faixa === faixa;
      if (!mesma) {
        window.clearTimeout(igTimer);
        window.removeEventListener("message", ouvirIG);
        slot.textContent = "";
        var f = document.createElement("iframe");
        f.src = fonte(r);
        f.title = titulo;                /* iframe sem title é falha de WCAG 4.1.2 */
        f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        f.setAttribute("allowfullscreen", "");
        f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        slot.appendChild(f);
        if (r.kind === "ig") {
          igOk = false;
          window.addEventListener("message", ouvirIG);
          igTimer = window.setTimeout(function () { if (!igOk) { elBlind.hidden = false; } }, 3000);
        }
      }
      atual = { kind: r.kind, id: r.id, faixa: faixa };

      /* dígitos e ponto médio são neutros de idioma: nenhuma string em JS.
         Com índice de episódios, quem é anunciado é a faixa, que é o que
         mudou de fato. */
      var itensAgora = (r.kind === "yt-list") ? LISTAS[r.id] : null;
      elLive.textContent = (itensAgora && itensAgora[faixa])
        ? itensAgora[faixa].t + " · " + (faixa + 1) + "/" + itensAgora.length
        : titulo + " · " + (pos + 1) + "/" + rolo.length;

      if (troca && !mqMotion.matches) {
        proj.classList.remove("is-cut"); void proj.offsetWidth; proj.classList.add("is-cut");
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", "abrir_video", { producao: titulo, fonte: r.kind });
      }
      pixel("ViewContent", { content_name: titulo, content_type: "video" });
    }

    /* as setas do rodapé andam entre PRODUÇÕES da folha de contato; o índice
       ao lado da tela anda entre EPISÓDIOS da produção atual. Trocar de
       produção volta a faixa para o começo, ou para a que o pôster pede. */
    function andar(d) {
      var n = pos + d;
      if (n < 0 || n >= rolo.length) { return; }
      pos = n;
      faixa = parseInt(rolo[pos].getAttribute("data-start") || "0", 10) || 0;
      pintar(true);
      /* se a seta que tinha o foco acabou de ser desabilitada, o foco cairia
         no body e a prisão do dialog ficaria sem alvo: passa para a outra */
      if (document.activeElement === btnPrev && btnPrev.disabled) { btnNext.focus(); }
      if (document.activeElement === btnNext && btnNext.disabled) { btnPrev.focus(); }
    }

    function abrir(a) {
      var r = receita(a); if (!r) { return false; }
      if (proj.open) { return true; }
      /* o contêiner do rolo é o contact sheet OU a peça inteira: o botão da
         peça (playlist da Maracutaia, esquete do Porta, podcast do MQE) mora
         fora do .sheet, e sem isso ele caía para fora do site em vez de abrir
         a sala */
      var sheet = a.closest(".sheet") || a.closest(".peca"), row = a.closest(".row");
      if (!sheet) { return false; }

      /* o rolo é a folha de contato daquele trabalho: quem entrou por um
         trailer pode ver os outros sem voltar. Figuras .mute não têm <a> e
         saem sozinhas; com EMBED_IG false os 4 do Instagram também saem, então
         o contador nunca promete o que não existe. */
      rolo = Array.prototype.filter.call(sheet.querySelectorAll("a[href]"), function (x) { return !!receita(x); });
      pos = rolo.indexOf(a); if (pos < 0) { return false; }

      var idx = row && row.querySelector(".row-idx"), nom = row && row.querySelector(".row-name");
      elIdx.textContent = idx ? idx.textContent.trim() : "";
      elSrc.textContent = nom ? nom.textContent.trim() : "";

      opener = a; atual = null; limpo = false;
      faixa = parseInt(a.getAttribute("data-start") || "0", 10) || 0;
      pintar(false);

      travarRolagem();
      proj.showModal();
      btnX.focus({ preventScroll: true });
      try { history.pushState({ proj: 1 }, ""); } catch (err) {}   /* voltar do Android fecha */
      return true;
    }

    function pedirFechar(viaPop) {
      if (!proj.open || closing) { return; }
      closing = true;
      slot.textContent = "";             /* o som corta ANTES da animação */
      if (!viaPop && history.state && history.state.proj) { try { history.back(); } catch (err) {} }
      /* consulta o MediaQueryList VIVO, não a var do boot: com animation:none
         o animationend nunca dispara e o modal ficaria preso com a página
         travada sem rolagem. */
      if (mqMotion.matches) { fecharAgora(); return; }
      proj.classList.add("is-closing");
      proj.addEventListener("animationend", noFim);
      guard = window.setTimeout(fecharAgora, 500);   /* segunda rede */
    }
    function noFim(e) { if (e.target === proj) { fecharAgora(); } }
    function fecharAgora() {
      window.clearTimeout(guard);
      proj.removeEventListener("animationend", noFim);
      proj.classList.remove("is-closing", "is-cut");
      if (proj.open) { proj.close(); }
      limpar();
    }

    /* LIMPEZA. Chamada direto por fecharAgora, que é o funil por onde passam
       Esc, o ×, o clique no preto e o botão voltar. Não dependemos do evento
       close do <dialog> para isto: ele existe na especificação, mas medindo
       aqui num showModal/close direto, sem nosso código no meio, ele não
       disparou, e a página ficava com body position:fixed, ou seja, travada
       sem rolagem depois de fechar o vídeo. O listener de close continua
       abaixo como rede para o caso de o navegador fechar o diálogo por conta
       própria; por isso esta função é idempotente e rodar duas vezes não faz
       nada na segunda. */
    var limpo = true;
    function limpar() {
      if (limpo) { return; }
      limpo = true;
      slot.textContent = "";
      window.clearTimeout(igTimer);
      window.removeEventListener("message", ouvirIG);
      closing = false; atual = null; rolo = [];
      destravarRolagem();
      if (opener) { opener.focus({ preventScroll: true }); opener = null; }
    }
    proj.addEventListener("close", limpar);
    proj.addEventListener("cancel", function (e) { e.preventDefault(); pedirFechar(); });
    window.addEventListener("popstate", function () { if (proj.open) { pedirFechar(true); } });

    btnPrev.addEventListener("click", function () { andar(-1); });
    btnNext.addEventListener("click", function () { andar(1); });
    proj.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); andar(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); andar(-1); }
    });

    /* clique no preto fecha; a guarda de pointerdown evita que arrastar de
       dentro para fora feche a sala sem querer */
    function noVazio(t) {
      return t === proj || t.classList.contains("proj-stage") || t.classList.contains("proj-room");
    }
    proj.addEventListener("pointerdown", function (e) { downInRoom = noVazio(e.target); });
    proj.addEventListener("click", function (e) {
      if (e.target.closest("[data-proj-close]")) { pedirFechar(); return; }
      if (downInRoom && noVazio(e.target)) { pedirFechar(); }
    });

    /* position:fixed com top negativo é a única técnica que segura o Safari do
       iPhone; overflow:hidden sozinho não segura. A compensação de barra evita
       a página pular de lado ao abrir. */
    function travarRolagem() {
      scrollY = window.pageYOffset || 0;
      var barra = window.innerWidth - document.documentElement.clientWidth;
      var b = document.body.style;
      b.position = "fixed"; b.top = (-scrollY) + "px";
      b.left = "0"; b.right = "0"; b.width = "100%";
      if (barra > 0) { b.paddingRight = barra + "px"; }
    }
    function destravarRolagem() {
      var b = document.body.style, h = document.documentElement.style, antes = h.scrollBehavior;
      b.position = b.top = b.left = b.right = b.width = b.paddingRight = "";
      h.scrollBehavior = "auto";         /* html{scroll-behavior:smooth} animaria a volta */
      window.scrollTo(0, scrollY);
      h.scrollBehavior = antes;
    }

    /* com o JS de pé o link deixa de "abrir fora": tira o target para o leitor
       de tela não prometer nova aba, e entra aria-haspopup="dialog". O href
       FICA, então ctrl+clique e "abrir em nova aba" continuam funcionando. */
    document.querySelectorAll(".sheet a[href], .peca a[href]").forEach(function (a) {
      if (!receita(a)) { return; }
      a.removeAttribute("target");
      a.setAttribute("aria-haspopup", "dialog");
      a.addEventListener("pointerenter", function () { var r = receita(a); if (r) { aquecer(r); } });
      a.addEventListener("focus", function () { var r = receita(a); if (r) { aquecer(r); } });
    });
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest(".sheet a[href], .peca a[href]") : null;
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
      if (abrir(a)) { e.preventDefault(); }
    });
    /* rede de segurança: se o foco escapar da sala, volta para o × */
    document.addEventListener("focusin", function (e) {
      if (proj.open && !proj.contains(e.target)) { btnX.focus({ preventScroll: true }); }
    });
  })();
})();
