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
})();
