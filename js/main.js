/* RÉGIS REGI · PORTFÓLIO 2026 */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pad = function (n) { return String(n).padStart(2, "0"); };

  /* ---------- timecode dirigido pelo scroll ----------
     A página é um "filme" de 8 minutos (00:08:00:00 = PICTURE LOCK).
     Rolar a página é fazer scrubbing no corte. */

  var tcEl = document.getElementById("timecode");
  var barEl = document.getElementById("progressbar");
  var FILM_SECONDS = 8 * 60;

  var tcPending = false;
  function renderTimecode() {
    tcPending = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    if (tcEl) {
      var t = p * FILM_SECONDS;
      var frames = Math.floor((t % 1) * 24);
      var s = Math.floor(t) % 60;
      var m = Math.floor(t / 60) % 60;
      tcEl.textContent = "00:" + pad(m) + ":" + pad(s) + ":" + pad(frames);
    }
    if (barEl) { barEl.style.width = (p * 100).toFixed(2) + "%"; }
  }
  function queueTimecode() {
    if (!tcPending) { tcPending = true; requestAnimationFrame(renderTimecode); }
  }
  window.addEventListener("scroll", queueTimecode, { passive: true });
  window.addEventListener("resize", queueTimecode);
  renderTimecode();

  /* ---------- scrollspy: seção ativa na navegação ---------- */

  var navLinks = document.querySelectorAll(".topnav a");
  var navMap = {};
  navLinks.forEach(function (a) {
    var id = (a.getAttribute("href") || "").slice(1);
    var sec = id && document.getElementById(id);
    if (sec) { navMap[id] = a; }
  });

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        navLinks.forEach(function (l) { l.classList.remove("active"); });
        var link = navMap[entry.target.id];
        if (link) { link.classList.add("active"); }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

    Object.keys(navMap).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---------- reveal ao rolar ---------- */

  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- estatísticas: contagem crescente ---------- */

  var statsEl = document.querySelector(".stats");

  function animateCount(dd) {
    var raw = dd.textContent.trim();
    var match = raw.match(/^(\d+)(.*)$/);
    if (!match) { return; }
    var target = parseInt(match[1], 10);
    var suffix = match[2];
    var width = match[1].length;
    var t0 = null;
    var dur = 1300;

    function step(ts) {
      if (t0 === null) { t0 = ts; }
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      dd.textContent = String(Math.round(eased * target)).padStart(width, "0") + suffix;
      if (p < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  if (statsEl && !prefersReduced && "IntersectionObserver" in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          statsEl.querySelectorAll("dd").forEach(animateCount);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsEl);
  }

  /* ---------- timeline NLE ---------- */

  var nle = document.getElementById("nle");
  var lanesEl = nle && nle.querySelector(".lanes");
  var playhead = nle && nle.querySelector(".playhead");
  var PLAYHEAD_REST = "99.55%";

  /* entra "renderizando" quando visível */
  if (nle && "IntersectionObserver" in window) {
    var nleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nle.classList.add("playing");
          nleObserver.disconnect();
        }
      });
    }, { threshold: 0.35 });
    nleObserver.observe(nle);
  } else if (nle) {
    nle.classList.add("playing");
  }

  /* scrubbing: o playhead segue o mouse, com tooltip de data/clipe */
  if (lanesEl && playhead && window.matchMedia("(hover: hover)").matches) {
    var tip = document.createElement("div");
    tip.className = "scrub-tip";
    tip.setAttribute("aria-hidden", "true");
    lanesEl.appendChild(tip);

    /* tooltips nativos viram data-tip para não duplicar com o custom */
    var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    var YEAR_SPAN = 100 / 11.63; /* a régua marca 11,63% por ano a partir de 2018 */

    lanesEl.querySelectorAll(".clip").forEach(function (clip) {
      clip.dataset.tip = clip.getAttribute("title") || "";
      clip.removeAttribute("title");
    });

    lanesEl.addEventListener("mouseenter", function () {
      nle.classList.add("playing", "scrubbed");
      playhead.style.animation = "none";
      playhead.style.opacity = "1";
      tip.classList.add("show");
    });

    lanesEl.addEventListener("mousemove", function (e) {
      var rect = lanesEl.getBoundingClientRect();
      var x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      playhead.style.left = x + "px";

      var clip = e.target.closest && e.target.closest(".clip");
      if (clip && clip.dataset.tip) {
        tip.textContent = clip.dataset.tip;
      } else {
        var yearFloat = 2018 + (x / rect.width) * YEAR_SPAN;
        var year = Math.floor(yearFloat);
        var month = MESES[Math.min(Math.floor((yearFloat - year) * 12), 11)];
        tip.textContent = "▸ " + month + " " + year;
      }
      var half = tip.offsetWidth / 2;
      tip.style.left = Math.min(Math.max(x, half), rect.width - half) + "px";
    });

    lanesEl.addEventListener("mouseleave", function () {
      playhead.style.left = PLAYHEAD_REST;
      tip.classList.remove("show");
    });

    /* quando a animação inicial termina, o playhead "estaciona" em hoje */
    playhead.addEventListener("animationend", function () {
      nle.classList.add("scrubbed");
      playhead.style.left = PLAYHEAD_REST;
      playhead.style.opacity = "1";
    });
  }

  /* solo de trilha, como numa NLE: uma trilha toca, as outras silenciam */
  if (nle) {
    var heads = nle.querySelectorAll(".track-head");
    var lanes = nle.querySelectorAll(".lanes .lane");

    heads.forEach(function (head, i) {
      head.addEventListener("click", function () {
        var wasSolo = head.classList.contains("solo");
        heads.forEach(function (h) {
          h.classList.remove("solo");
          h.setAttribute("aria-pressed", "false");
        });
        lanes.forEach(function (l) { l.classList.remove("muted"); });
        if (!wasSolo) {
          head.classList.add("solo");
          head.setAttribute("aria-pressed", "true");
          lanes.forEach(function (l, j) {
            if (j !== i) { l.classList.add("muted"); }
          });
        }
      });
    });
  }

  /* ---------- filtros de experiência ---------- */

  var filterBtns = document.querySelectorAll(".filter");
  var cards = document.querySelectorAll(".cards .card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });

      var key = btn.dataset.filter;
      cards.forEach(function (card) {
        var show = key === "all" || card.classList.contains("card-" + key);
        if (show) {
          card.style.display = "";
          card.classList.add("in");
          requestAnimationFrame(function () { card.classList.remove("hide"); });
        } else {
          card.classList.add("hide");
          window.setTimeout(function () {
            if (card.classList.contains("hide")) { card.style.display = "none"; }
          }, 240);
        }
      });
    });
  });

  /* ---------- spotlight nos cards ---------- */

  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card, .skill-panel, .ficha").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        el.style.setProperty("--my", (e.clientY - rect.top) + "px");
      });
    });
  }

  /* ---------- modo REC ---------- */

  var recBtn = document.getElementById("rec-toggle");
  if (recBtn) {
    recBtn.addEventListener("click", function () {
      var on = document.body.classList.toggle("recording");
      recBtn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---------- shuttle J·K·L, como numa ilha de edição ---------- */

  var hud = document.createElement("div");
  hud.className = "shuttle-hud";
  hud.setAttribute("aria-hidden", "true");
  document.body.appendChild(hud);

  var shuttleV = 0;
  var shuttleRaf = null;
  var hudTimer = null;
  var BASE_SPEED = 9;
  var MAX_SPEED = 72;

  function shuttleTick() {
    if (shuttleV !== 0) {
      window.scrollBy({ top: shuttleV, left: 0, behavior: "instant" });
      var doc = document.documentElement;
      var atEnd = shuttleV > 0 && window.scrollY >= doc.scrollHeight - window.innerHeight - 1;
      var atStart = shuttleV < 0 && window.scrollY <= 0;
      if (atEnd || atStart) { stopShuttle(); return; }
      shuttleRaf = requestAnimationFrame(shuttleTick);
    } else {
      shuttleRaf = null;
    }
  }

  function showHud(text, sticky) {
    hud.textContent = text;
    hud.classList.add("show");
    window.clearTimeout(hudTimer);
    if (!sticky) {
      hudTimer = window.setTimeout(function () { hud.classList.remove("show"); }, 900);
    }
  }

  function stopShuttle(silent) {
    if (shuttleV !== 0 && !silent) { showHud("⏸ K", false); }
    shuttleV = 0;
    if (silent) { hud.classList.remove("show"); }
  }

  function engageShuttle(dir) {
    if (prefersReduced) {
      window.scrollBy({ top: dir * window.innerHeight * 0.85, behavior: "auto" });
      return;
    }
    var sameDir = shuttleV !== 0 && (shuttleV > 0) === (dir > 0);
    var speed = sameDir ? Math.min(Math.abs(shuttleV) * 2, MAX_SPEED) : BASE_SPEED;
    shuttleV = dir * speed;
    showHud((dir > 0 ? "▶" : "◀") + " " + (speed / BASE_SPEED) + "×", true);
    if (!shuttleRaf) { shuttleRaf = requestAnimationFrame(shuttleTick); }
  }

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) { return; }
    var target = e.target;
    if (target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)) { return; }
    var key = e.key.toLowerCase();
    if (key === "l") { engageShuttle(1); }
    else if (key === "j") { engageShuttle(-1); }
    else if (key === "k") { stopShuttle(); }
  });

  /* o usuário assume o controle: roda do mouse/toque interrompe o shuttle */
  window.addEventListener("wheel", function () { stopShuttle(true); }, { passive: true });
  window.addEventListener("touchstart", function () { stopShuttle(true); }, { passive: true });
})();
