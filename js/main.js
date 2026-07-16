/* RÉGIS REGI · PORTFÓLIO 2026 */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pad = function (n) { return String(n).padStart(2, "0"); };

  /* ---------- timecode dirigido pelo scroll ----------
     A página é um "filme" de 8 minutos (00:08:00:00 = PICTURE LOCK).
     Rolar a página é fazer scrubbing no corte. */

  var tcEl = document.getElementById("timecode");
  var monitorTcEl = document.getElementById("monitor-tc");
  var barEl = document.getElementById("progressbar");
  var FILM_SECONDS = 8 * 60;

  var tcPending = false;
  function renderTimecode() {
    tcPending = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    if (tcEl || monitorTcEl) {
      var t = p * FILM_SECONDS;
      var frames = Math.floor((t % 1) * 24);
      var s = Math.floor(t) % 60;
      var m = Math.floor(t / 60) % 60;
      var tc = "00:" + pad(m) + ":" + pad(s) + ":" + pad(frames);
      if (tcEl) { tcEl.textContent = tc; }
      if (monitorTcEl) { monitorTcEl.textContent = tc; }
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
    else if (key === "g") { cycleLut(); }
  });

  /* o usuário assume o controle: roda do mouse/toque interrompe o shuttle */
  window.addEventListener("wheel", function () { stopShuttle(true); }, { passive: true });
  window.addEventListener("touchstart", function () { stopShuttle(true); }, { passive: true });

  /* ---------- ilha de cor: o visitante é o colorista ---------- */

  var LUTS = ["", "blockbuster", "noir", "tarde", "giallo", "vhs"];
  var LUT_NAMES = {
    "": "REC 709",
    "blockbuster": "BLOCKBUSTER",
    "noir": "NOIR",
    "tarde": "SESSÃO DA TARDE",
    "giallo": "GIALLO",
    "vhs": "VHS 1987"
  };

  var colorKnob = document.getElementById("color-knob");
  var colorPanel = document.getElementById("color-panel");
  var lutChips = document.querySelectorAll(".lut-chip");

  function applyLut(lut, announce) {
    if (LUTS.indexOf(lut) === -1) { lut = ""; }
    if (lut) {
      document.body.setAttribute("data-lut", lut);
    } else {
      document.body.removeAttribute("data-lut");
    }
    lutChips.forEach(function (chip) {
      var active = (chip.dataset.lut || "") === lut;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try { localStorage.setItem("rr_lut", lut); } catch (e) { /* navegação privada */ }
    if (announce) { showHud("LUT: " + LUT_NAMES[lut], false); }
  }

  function cycleLut() {
    var current = document.body.getAttribute("data-lut") || "";
    var next = LUTS[(LUTS.indexOf(current) + 1) % LUTS.length];
    applyLut(next, true);
  }

  if (colorKnob && colorPanel) {
    colorKnob.addEventListener("click", function () {
      var open = colorPanel.hidden;
      colorPanel.hidden = !open;
      colorKnob.setAttribute("aria-expanded", open ? "true" : "false");
    });

    lutChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        applyLut(chip.dataset.lut || "", true);
      });
    });

    document.addEventListener("click", function (e) {
      if (!colorPanel.hidden && !e.target.closest("#color-suite")) {
        colorPanel.hidden = true;
        colorKnob.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !colorPanel.hidden) {
        colorPanel.hidden = true;
        colorKnob.setAttribute("aria-expanded", "false");
      }
    });

    /* o grade escolhido sobrevive à sessão, como um projeto salvo */
    try { applyLut(localStorage.getItem("rr_lut") || "", false); } catch (e) { /* sem storage */ }
  }

  /* ---------- bin de mídia: catálogo do Medium ---------- */

  var binList = document.getElementById("bin-list");
  var binCount = document.getElementById("bin-count");
  var binSearch = document.getElementById("bin-search");

  if (binList) {
    var MEDIUM_USER = "extvnerd";
    var MEDIUM_HOME = "https://" + MEDIUM_USER + ".medium.com";
    var FEED_API = "https://api.rss2json.com/v1/api.json?rss_url=" +
      encodeURIComponent("https://medium.com/feed/@" + MEDIUM_USER);

    /* textos conhecidos que podem já ter saído da janela do feed RSS */
    var SEED_POSTS = [
      {
        title: "Melhores da Década",
        link: "https://extvnerd.medium.com/melhores-da-d%C3%A9cada-628cf13c935e",
        pubDate: "",
        description: "",
        categories: []
      }
    ];

    var MESES_BIN = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

    var normalizeLink = function (url) {
      return (url || "").split("?")[0].replace(/\/$/, "");
    };

    var stripHtml = function (html) {
      var el = document.createElement("div");
      el.innerHTML = html || "";
      return (el.textContent || "").replace(/\s+/g, " ").trim();
    };

    var formatDate = function (pubDate) {
      var d = new Date(pubDate);
      if (!pubDate || isNaN(d.getTime())) { return ""; }
      return MESES_BIN[d.getMonth()] + " " + d.getFullYear();
    };

    var renderBin = function (posts) {
      binList.textContent = "";
      posts.forEach(function (post, i) {
        var li = document.createElement("li");
        li.className = "bin-item";
        li.style.setProperty("--d", (i * 0.05) + "s");

        var a = document.createElement("a");
        a.href = post.link;
        a.target = "_blank";
        a.rel = "noopener";

        var num = document.createElement("span");
        num.className = "bin-num";
        num.textContent = String(i + 1).padStart(3, "0");

        var main = document.createElement("span");
        main.className = "bin-main";

        var title = document.createElement("span");
        title.className = "bin-title";
        title.textContent = post.title;
        main.appendChild(title);

        var snippet = stripHtml(post.description);
        if (snippet) {
          var desc = document.createElement("span");
          desc.className = "bin-desc";
          desc.textContent = snippet.length > 150 ? snippet.slice(0, 150).trimEnd() + "…" : snippet;
          main.appendChild(desc);
        }

        if (post.categories && post.categories.length) {
          var tags = document.createElement("span");
          tags.className = "bin-tags";
          tags.textContent = post.categories.slice(0, 4).join(" · ");
          main.appendChild(tags);
        }

        var date = document.createElement("span");
        date.className = "bin-date";
        date.textContent = formatDate(post.pubDate) || "arquivo";

        a.appendChild(num);
        a.appendChild(main);
        a.appendChild(date);
        li.appendChild(a);
        binList.appendChild(li);
      });
    };

    var updateCount = function (visible, total) {
      if (!binCount) { return; }
      binCount.textContent = (visible === total ? total : visible + "/" + total) +
        (total === 1 ? " CLIPE NO BIN" : " CLIPES NO BIN");
    };

    var binFail = function () {
      var status = document.getElementById("bin-status");
      if (binCount) { binCount.textContent = "OFFLINE"; }
      if (!status) { return; }
      status.textContent = "Não deu para sincronizar com o Medium agora. ";
      var a = document.createElement("a");
      a.href = MEDIUM_HOME;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Abra o catálogo direto no Medium ↗";
      status.appendChild(a);
    };

    fetch(FEED_API)
      .then(function (res) {
        if (!res.ok) { throw new Error("HTTP " + res.status); }
        return res.json();
      })
      .then(function (data) {
        var items = (data && data.status === "ok" && data.items) ? data.items : [];
        var seen = {};
        var posts = [];

        items.concat(SEED_POSTS).forEach(function (item) {
          var key = normalizeLink(item.link);
          if (!key || seen[key]) { return; }
          seen[key] = true;
          posts.push(item);
        });

        if (!posts.length) { throw new Error("feed vazio"); }

        /* mais recentes primeiro; itens sem data vão para o fim (arquivo) */
        posts.sort(function (a, b) {
          var ta = Date.parse(a.pubDate) || 0;
          var tb = Date.parse(b.pubDate) || 0;
          return tb - ta;
        });

        renderBin(posts);
        updateCount(posts.length, posts.length);

        if (binSearch) {
          binSearch.addEventListener("input", function () {
            var q = binSearch.value.trim().toLowerCase();
            var visible = 0;
            binList.querySelectorAll(".bin-item").forEach(function (li) {
              var hit = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
              li.classList.toggle("off", !hit);
              if (hit) { visible += 1; }
            });
            updateCount(visible, posts.length);
          });
        }
      })
      .catch(binFail);
  }
})();
