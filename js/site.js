/* RÉGIS REGI · portfólio — comportamento
   Efeito assinatura: nome da hero entra letra a letra (porte vanilla de SplitText).
   Suporte: reveals por IntersectionObserver, rail de cenas, índice expansível,
   contagem dos números do panorama. Tudo respeita prefers-reduced-motion. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    ["sobre", "trabalho", "competencias", "escrita", "contato"].forEach(function (id) {
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
    });
  });
})();
