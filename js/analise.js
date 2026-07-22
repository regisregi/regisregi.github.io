/* RÉGIS REGI · LAB NLP — análise do corpus Ex-TV Nerd, 100% no navegador */

(function () {
  "use strict";

  var FEED_API = "https://api.rss2json.com/v1/api.json?rss_url=" +
    encodeURIComponent("https://medium.com/feed/@extvnerd");

  /* paleta de dados validada para o dark (validate_palette.js, superfície #1b1b21):
     #c07f24 âmbar · #2a9a85 teal · #f0392c vermelho · #8474e8 violeta */
  var C = {
    amber: "#c07f24",
    teal: "#2a9a85",
    rec: "#f0392c",
    violet: "#8474e8",
    ink: "#f2f0eb",
    ink2: "#c9c8cf",
    muted: "#9c9ca6",
    grid: "#2c2c35",
    surface: "#1b1b21",
    dim: "#4a4a55"
  };

  var STOP = ("a o e é de do da dos das em no na nos nas um uma uns umas por para com sem sob sobre entre até após " +
    "que quem qual quais como quando onde porque porquê se não sim mais menos muito muita muitos muitas pouco pouca " +
    "poucos poucas todo toda todos todas outro outra outros outras mesmo mesma mesmos mesmas tal tais cada qualquer " +
    "ao aos à às pelo pela pelos pelas num numa nuns numas dum duma neste nesta nestes nestas nesse nessa nesses " +
    "nessas naquele naquela naqueles naquelas deste desta destes destas desse dessa desses dessas daquele daquela " +
    "isso isto aquilo ele ela eles elas eu tu você vocês nós vos lhe lhes me te se seu sua seus suas meu minha meus " +
    "minhas teu tua teus tuas nosso nossa nossos nossas dele dela deles delas o(s) já ainda também só apenas então " +
    "assim aqui ali lá cá agora antes depois sempre nunca jamais talvez quase bem mal muito pouco ser estar ter " +
    "haver fazer ir vir foi era são está estão estava estavam ser sido sendo tem têm tinha tinham teve houve há " +
    "vai vão vou fica ficou ficam fazer fez feito faz mas porém contudo todavia entretanto ou nem tanto quanto " +
    "enquanto durante contra desde dentro fora perto longe além aquém coisa coisas vez vezes ano anos dia dias " +
    "parte pode podem podia poderia pra pro pros pras né tá eh ah oh uso usa ela(s) etc dois duas três primeiro " +
    "primeira segunda segundo terceiro grande grandes maior menor melhor pior novo nova novos novas velho velha " +
    "the of and in on to for with a an is are was were it its this that").split(/\s+/);

  var STOPSET = {};
  STOP.forEach(function (w) { STOPSET[w] = true; });

  var POS_LEX = ("bom boa bons boas ótimo ótima excelente incrível brilhante genial maravilhoso maravilhosa perfeito " +
    "perfeita sucesso êxito acerto acertos elogio elogios favorito favorita adorável divertido divertida engraçado " +
    "engraçada emocionante encantador encantadora belo bela bonito bonita forte fortes potente inteligente sofisticado " +
    "sofisticada elegante inovador inovadora original criativo criativa surpreendente memorável marcante essencial " +
    "imperdível fascinante cativante delicioso deliciosa prazer alegria feliz felizes amor amei adoro gosto gostei " +
    "impecável primoroso vibrante luminoso genuíno honesto sensível delicado profundo rico rica").split(/\s+/);

  var NEG_LEX = ("ruim ruins péssimo péssima horrível terrível fraco fraca fracos fracas medíocre decepção decepcionante " +
    "decepcionou fracasso fracassos erro erros errado errada falha falhas problema problemas pior piores chato chata " +
    "chatos chatas cansativo cansativa arrastado arrastada confuso confusa raso rasa vazio vazia clichê clichês " +
    "previsível preguiçoso preguiçosa forçado forçada artificial superficial genérico genérica descartável esquecível " +
    "irritante insuportável triste tristes morte morto crise culpa medo ódio raiva perda dor sofrimento " +
    "cancelado cancelada cancelamento fim acabou perdeu perde queda declínio").split(/\s+/);

  var POSSET = {}, NEGSET = {};
  POS_LEX.forEach(function (w) { POSSET[w] = true; });
  NEG_LEX.forEach(function (w) { NEGSET[w] = true; });

  var PLATAFORMAS = [
    { nome: "Netflix", re: /\bnetflix\b/g },
    { nome: "HBO", re: /\bhbo(?:\s?max)?\b/g },
    { nome: "Disney+", re: /\bdisney\+?\b/g },
    { nome: "Prime Video", re: /\b(?:prime video|amazon)\b/g },
    { nome: "Globo", re: /\b(?:globo|globoplay)\b/g },
    { nome: "Paramount+", re: /\bparamount\+?\b/g },
    { nome: "Max", re: /\bmax\b/g },
    { nome: "Apple TV+", re: /\bapple tv\+?\b/g },
    { nome: "YouTube", re: /\byoutube\b/g },
    { nome: "Star+", re: /\bstar\+\b/g }
  ];

  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  /* ---------- utilidades ---------- */

  function el(tag, cls, parent) {
    var node = document.createElement(tag);
    if (cls) { node.className = cls; }
    if (parent) { parent.appendChild(node); }
    return node;
  }

  function svgEl(tag, attrs, parent) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (var k in attrs) { node.setAttribute(k, attrs[k]); }
    if (parent) { parent.appendChild(node); }
    return node;
  }

  function stripHtml(html) {
    var div = document.createElement("div");
    div.innerHTML = html || "";
    div.querySelectorAll("script,style,figcaption").forEach(function (n) { n.remove(); });
    return (div.textContent || "").replace(/\s+/g, " ").trim();
  }

  function tokenize(text) {
    var raw = text.toLowerCase().match(/[a-zà-öø-ýç]+(?:-[a-zà-öø-ýç]+)*/g) || [];
    return raw.filter(function (t) { return t.length >= 3 && !STOPSET[t]; });
  }

  function sentences(text) {
    return text.split(/[.!?…]+\s/).filter(function (s) { return s.trim().length > 2; });
  }

  function syllablesPt(word) {
    var groups = word.toLowerCase().match(/[aeiouáàâãéêíóôõúü]+/g);
    return groups ? groups.length : 1;
  }

  function shortTitle(t, max) {
    max = max || 26;
    return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
  }

  function fmtDate(d) {
    return MESES[d.getMonth()] + " " + d.getFullYear();
  }

  function fmtNum(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /* ---------- tooltip único (hover + foco de teclado) ---------- */

  var tip = document.getElementById("lab-tip");

  function tipShow(rows, x, y) {
    tip.textContent = "";
    rows.forEach(function (row) {
      var line = el("div", "lab-tip-row", tip);
      if (row.key) {
        var key = el("i", "lab-tip-key", line);
        key.style.background = row.key;
      }
      var val = el("strong", null, line);
      val.textContent = row.value;
      var lab = el("span", null, line);
      lab.textContent = row.label;
    });
    tip.hidden = false;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var px = Math.min(Math.max(x - w / 2, 8), window.innerWidth - w - 8);
    var py = y - h - 14;
    if (py < 8) { py = y + 18; }
    tip.style.left = px + "px";
    tip.style.top = py + "px";
  }

  function tipHide() { tip.hidden = true; }

  function bindTip(node, rowsFn) {
    node.addEventListener("pointermove", function (e) { tipShow(rowsFn(), e.clientX, e.clientY); });
    node.addEventListener("pointerleave", tipHide);
    node.addEventListener("focus", function () {
      var r = node.getBoundingClientRect();
      tipShow(rowsFn(), r.left + r.width / 2, r.top);
    });
    node.addEventListener("blur", tipHide);
  }

  /* ---------- análise ---------- */

  function analisar(items) {
    var artigos = items.map(function (item) {
      var texto = stripHtml(item.content || item.description || "");
      var frases = sentences(texto);
      var todasPalavras = texto.toLowerCase().match(/[a-zà-öø-ýç]+/g) || [];
      var tokens = tokenize(texto);
      var freq = {};
      tokens.forEach(function (t) { freq[t] = (freq[t] || 0) + 1; });

      var pos = 0, neg = 0;
      todasPalavras.forEach(function (w) {
        if (POSSET[w]) { pos += 1; }
        if (NEGSET[w]) { neg += 1; }
      });

      var silabas = 0;
      todasPalavras.forEach(function (w) { silabas += syllablesPt(w); });
      var nP = Math.max(todasPalavras.length, 1);
      var nF = Math.max(frases.length, 1);
      var flesch = 248.835 - 1.015 * (nP / nF) - 84.6 * (silabas / nP);

      return {
        titulo: item.title || "(sem título)",
        link: item.link,
        data: new Date(item.pubDate),
        palavras: todasPalavras.length,
        frases: nF,
        fraseMedia: nP / nF,
        tokens: tokens,
        freq: freq,
        unicas: Object.keys(freq).length,
        diversidade: tokens.length ? Object.keys(freq).length / tokens.length : 0,
        leituraMin: Math.max(1, Math.round(todasPalavras.length / 230)),
        temperatura: ((pos - neg) / nP) * 1000,
        pos: pos,
        neg: neg,
        flesch: Math.max(0, Math.min(100, flesch)),
        textoLower: texto.toLowerCase()
      };
    }).filter(function (a) { return a.palavras > 30; });

    artigos.sort(function (a, b) { return a.data - b.data; });

    var corpusFreq = {}, docFreq = {};
    artigos.forEach(function (a) {
      for (var t in a.freq) {
        corpusFreq[t] = (corpusFreq[t] || 0) + a.freq[t];
        docFreq[t] = (docFreq[t] || 0) + 1;
      }
    });

    var N = artigos.length;
    artigos.forEach(function (a) {
      var scores = [];
      for (var t in a.freq) {
        scores.push([t, a.freq[t] * Math.log(N / docFreq[t] || 1)]);
      }
      scores.sort(function (x, y) { return y[1] - x[1]; });
      a.assinatura = scores.slice(0, 3).map(function (s) { return s[0]; });
    });

    var topTermos = Object.keys(corpusFreq)
      .map(function (t) { return [t, corpusFreq[t]]; })
      .sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, 12);

    var bigramas = {};
    artigos.forEach(function (a) {
      for (var i = 0; i < a.tokens.length - 1; i++) {
        var bg = a.tokens[i] + " " + a.tokens[i + 1];
        bigramas[bg] = (bigramas[bg] || 0) + 1;
      }
    });
    var topBigramas = Object.keys(bigramas)
      .map(function (b) { return [b, bigramas[b]]; })
      .filter(function (b) { return b[1] >= 2; })
      .sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, 10);

    var radar = PLATAFORMAS.map(function (p) {
      var count = 0;
      artigos.forEach(function (a) {
        var m = a.textoLower.match(p.re);
        if (m) { count += m.length; }
      });
      return { nome: p.nome, count: count };
    }).filter(function (p) { return p.count > 0; })
      .sort(function (a, b) { return b.count - a.count; });

    return { artigos: artigos, topTermos: topTermos, topBigramas: topBigramas, radar: radar };
  }

  /* ---------- gráficos (SVG, specs: barras ≤24px, ponta arredondada 4px,
       gap 2px+, grid hairline, valores em tinta, tooltip em toda marca) ---------- */

  var PLOT_W = 720;

  function barraHorizontal(x, y, w, h, color, r) {
    /* ponta de dado arredondada (direita), base reta */
    r = Math.min(r || 4, w);
    return svgElPath("M" + x + "," + y +
      " h" + Math.max(0, w - r) +
      " a" + r + "," + r + " 0 0 1 " + r + "," + r +
      " v" + (h - 2 * r) +
      " a" + r + "," + r + " 0 0 1 " + (-r) + "," + r +
      " h" + (-Math.max(0, w - r)) + " z", color);
  }

  function barraEsquerda(x, y, w, h, color, r) {
    r = Math.min(r || 4, w);
    return svgElPath("M" + x + "," + y +
      " h" + (-Math.max(0, w - r)) +
      " a" + r + "," + r + " 0 0 0 " + (-r) + "," + r +
      " v" + (h - 2 * r) +
      " a" + r + "," + r + " 0 0 0 " + r + "," + r +
      " h" + Math.max(0, w - r) + " z", color);
  }

  function svgElPath(d, fill) {
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", fill);
    return p;
  }

  function novoSvg(height, parent, label) {
    var svg = svgEl("svg", {
      viewBox: "0 0 " + PLOT_W + " " + height,
      width: "100%",
      role: "img",
      "aria-label": label
    }, parent);
    return svg;
  }

  function textoSvg(svg, x, y, str, opts) {
    opts = opts || {};
    var t = svgEl("text", {
      x: x, y: y,
      fill: opts.fill || C.muted,
      "font-size": opts.size || 11,
      "font-family": "'Space Mono', monospace",
      "text-anchor": opts.anchor || "start",
      "dominant-baseline": opts.baseline || "middle"
    }, svg);
    t.textContent = str;
    return t;
  }

  /* barras horizontais categóricas (série única = um matiz) */
  function chartBarras(container, dados, cor, label, onClick, tipRows) {
    var barH = 18, gap = 10, padL = 150, padR = 64, padT = 6;
    var h = padT + dados.length * (barH + gap) + 14;
    var svg = novoSvg(h, container, label);
    var max = Math.max.apply(null, dados.map(function (d) { return d.valor; }));
    var escala = (PLOT_W - padL - padR) / (max || 1);

    /* hairlines de referência */
    [0.5, 1].forEach(function (f) {
      var gx = padL + max * f * escala;
      svgEl("line", { x1: gx, y1: padT, x2: gx, y2: h - 14, stroke: C.grid, "stroke-width": 1 }, svg);
    });

    dados.forEach(function (d, i) {
      var y = padT + i * (barH + gap);
      var w = Math.max(2, d.valor * escala);
      var g = svgEl("g", { "class": "mark", tabindex: 0, role: "img", "aria-label": d.rotulo + ": " + d.valor }, svg);

      textoSvg(g, padL - 8, y + barH / 2, shortTitle(d.rotulo, 20), { anchor: "end", fill: C.ink2 });
      var bar = barraHorizontal(padL, y, w, barH, d.cor || cor);
      bar.setAttribute("class", "bar");
      g.appendChild(bar);
      textoSvg(g, padL + w + 8, y + barH / 2, fmtNum(d.valor), { fill: C.ink });

      /* alvo de toque maior que a marca */
      var hit = svgEl("rect", { x: 0, y: y - gap / 2, width: PLOT_W, height: barH + gap, fill: "transparent" }, g);
      bindTip(hit, function () { return tipRows(d); });
      bindTip(g, function () { return tipRows(d); });
      if (onClick) {
        g.style.cursor = "pointer";
        g.addEventListener("click", function () { onClick(d, g); });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(d, g); } });
      }
    });
    return svg;
  }

  /* ---------- montagem ---------- */

  function montar(analise) {
    var artigos = analise.artigos;
    document.getElementById("lab-status").hidden = true;
    document.getElementById("lab-body").hidden = false;

    /* KPI row */
    var tiles = document.getElementById("tiles");
    var totalPalavras = artigos.reduce(function (s, a) { return s + a.palavras; }, 0);
    var vocab = {};
    artigos.forEach(function (a) { Object.keys(a.freq).forEach(function (t) { vocab[t] = true; }); });
    var leitura = artigos.reduce(function (s, a) { return s + a.leituraMin; }, 0);

    [
      { label: "Textos no corpus", valor: String(artigos.length).padStart(2, "0") },
      { label: "Palavras analisadas", valor: fmtNum(totalPalavras) },
      { label: "Vocabulário único", valor: fmtNum(Object.keys(vocab).length) },
      { label: "Leitura total", valor: leitura + " min" }
    ].forEach(function (t) {
      var tile = el("div", "tile", tiles);
      var dd = el("p", "tile-valor", tile);
      dd.textContent = t.valor;
      var dt = el("p", "tile-label", tile);
      dt.textContent = t.label;
    });

    /* termos — clique rastreia o termo no gráfico de fôlego */
    var termoAtivo = null;
    var barrasTamanho = [];

    function aplicaRastreio() {
      barrasTamanho.forEach(function (b) {
        var contem = termoAtivo && b.artigo.freq[termoAtivo];
        var mudo = termoAtivo && !contem;
        b.bar.setAttribute("fill", mudo ? C.dim : C.teal);
        b.grupo.style.opacity = mudo ? ".55" : "1";
      });
      var nota = document.getElementById("nota-rastreio");
      if (termoAtivo) {
        var n = barrasTamanho.filter(function (b) { return b.artigo.freq[termoAtivo]; }).length;
        nota.textContent = "Rastreando “" + termoAtivo + "”: aparece em " + n + " de " + artigos.length + " textos. Clique de novo para soltar.";
        nota.hidden = false;
      } else {
        nota.hidden = true;
      }
    }

    chartBarras(
      document.getElementById("plot-termos"),
      analise.topTermos.map(function (t) { return { rotulo: t[0], valor: t[1] }; }),
      C.amber,
      "Barras: termos mais frequentes do corpus",
      function (d, g) {
        termoAtivo = termoAtivo === d.rotulo ? null : d.rotulo;
        document.querySelectorAll("#plot-termos .mark").forEach(function (m) { m.classList.remove("selected"); });
        if (termoAtivo) { g.classList.add("selected"); }
        aplicaRastreio();
      },
      function (d) {
        var docs = artigos.filter(function (a) { return a.freq[d.rotulo]; }).length;
        return [
          { key: C.amber, value: fmtNum(d.valor) + "×", label: "no corpus" },
          { value: docs + "/" + artigos.length, label: "textos em que aparece" }
        ];
      }
    );

    /* radar de plataformas */
    if (analise.radar.length) {
      chartBarras(
        document.getElementById("plot-radar"),
        analise.radar.map(function (r) { return { rotulo: r.nome, valor: r.count }; }),
        C.violet,
        "Barras: menções a plataformas e canais",
        null,
        function (d) { return [{ key: C.violet, value: fmtNum(d.valor) + "×", label: "menções a " + d.rotulo }]; }
      );
    } else {
      document.getElementById("scope-radar").hidden = true;
    }

    /* sentimento — divergente teal↔vermelho, meio neutro */
    (function () {
      var cont = document.getElementById("plot-sentimento");
      var dados = artigos;
      var barH = 18, gap = 10, padL = 150, padR = 64, padT = 6;
      var h = padT + dados.length * (barH + gap) + 20;
      var svg = novoSvg(h, cont, "Barras divergentes: temperatura de sentimento por texto");
      var maxAbs = Math.max(1, Math.max.apply(null, dados.map(function (a) { return Math.abs(a.temperatura); })));
      var cx = padL + (PLOT_W - padL - padR) / 2;
      /* reserva 52px por braço para o valor não colidir com os rótulos */
      var escala = ((PLOT_W - padL - padR) / 2 - 52) / maxAbs;

      svgEl("line", { x1: cx, y1: padT, x2: cx, y2: h - 20, stroke: "#3a3a44", "stroke-width": 1 }, svg);
      textoSvg(svg, cx, h - 8, "neutro", { anchor: "middle", size: 10 });

      dados.forEach(function (a, i) {
        var y = padT + i * (barH + gap);
        var v = a.temperatura;
        var w = Math.max(2, Math.abs(v) * escala);
        var g = svgEl("g", { "class": "mark", tabindex: 0, role: "img", "aria-label": a.titulo + ": temperatura " + v.toFixed(1) }, svg);
        textoSvg(g, padL - 8, y + barH / 2, shortTitle(a.titulo, 20), { anchor: "end", fill: C.ink2 });
        var bar = v >= 0 ? barraHorizontal(cx + 1, y, w, barH, C.teal) : barraEsquerda(cx - 1, y, w, barH, C.rec);
        g.appendChild(bar);
        textoSvg(g, v >= 0 ? cx + w + 9 : cx - w - 9, y + barH / 2, (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1),
          { anchor: v >= 0 ? "start" : "end", fill: C.ink });
        var hit = svgEl("rect", { x: 0, y: y - gap / 2, width: PLOT_W, height: barH + gap, fill: "transparent" }, g);
        bindTip(hit, function () {
          return [
            { key: v >= 0 ? C.teal : C.rec, value: (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1), label: "temperatura (por mil palavras)" },
            { key: C.teal, value: String(a.pos), label: "palavras positivas" },
            { key: C.rec, value: String(a.neg), label: "palavras negativas" }
          ];
        });
      });
    })();

    /* fôlego (palavras por texto, cronológico) */
    (function () {
      var cont = document.getElementById("plot-tamanho");
      var nota = el("p", "scope-nota", cont);
      nota.id = "nota-rastreio";
      nota.hidden = true;
      var barH = 18, gap = 10, padL = 150, padR = 74, padT = 6;
      var h = padT + artigos.length * (barH + gap) + 14;
      var svg = novoSvg(h, cont, "Barras: palavras por texto em ordem cronológica");
      var max = Math.max.apply(null, artigos.map(function (a) { return a.palavras; }));
      var escala = (PLOT_W - padL - padR) / max;

      [0.5, 1].forEach(function (f) {
        var gx = padL + max * f * escala;
        svgEl("line", { x1: gx, y1: padT, x2: gx, y2: h - 14, stroke: C.grid, "stroke-width": 1 }, svg);
      });

      artigos.forEach(function (a, i) {
        var y = padT + i * (barH + gap);
        var w = Math.max(2, a.palavras * escala);
        var g = svgEl("g", { "class": "mark", tabindex: 0, role: "img", "aria-label": a.titulo + ": " + a.palavras + " palavras" }, svg);
        textoSvg(g, padL - 8, y + barH / 2, shortTitle(a.titulo, 20), { anchor: "end", fill: C.ink2 });
        var bar = barraHorizontal(padL, y, w, barH, C.teal);
        g.appendChild(bar);
        textoSvg(g, padL + w + 8, y + barH / 2, fmtNum(a.palavras), { fill: C.ink });
        var hit = svgEl("rect", { x: 0, y: y - gap / 2, width: PLOT_W, height: barH + gap, fill: "transparent" }, g);
        barrasTamanho.push({ artigo: a, bar: bar, grupo: g });
        bindTip(hit, function () {
          return [
            { key: C.teal, value: fmtNum(a.palavras), label: "palavras · " + fmtDate(a.data) },
            { value: a.leituraMin + " min", label: "tempo de leitura" },
            { value: a.assinatura.join(" · "), label: "termos-assinatura" }
          ];
        });
        g.style.cursor = "pointer";
        g.addEventListener("click", function () { window.open(a.link, "_blank", "noopener"); });
      });
    })();

    /* mapa de estilo (dispersão) */
    (function () {
      var cont = document.getElementById("plot-estilo");
      var h = 330, padL = 60, padR = 24, padT = 16, padB = 44;
      var svg = novoSvg(h, cont, "Dispersão: frase média por diversidade lexical, um ponto por texto");
      var xs = artigos.map(function (a) { return a.fraseMedia; });
      var ys = artigos.map(function (a) { return a.diversidade; });
      var xMin = Math.min.apply(null, xs) * 0.9, xMax = Math.max.apply(null, xs) * 1.08;
      var yMin = Math.min.apply(null, ys) * 0.92, yMax = Math.min(1, Math.max.apply(null, ys) * 1.06);
      var X = function (v) { return padL + (v - xMin) / (xMax - xMin) * (PLOT_W - padL - padR); };
      var Y = function (v) { return h - padB - (v - yMin) / (yMax - yMin) * (h - padT - padB); };

      /* grid recessivo + ticks */
      for (var i = 0; i <= 3; i++) {
        var gy = padT + i * (h - padT - padB) / 3;
        svgEl("line", { x1: padL, y1: gy, x2: PLOT_W - padR, y2: gy, stroke: C.grid, "stroke-width": 1 }, svg);
        textoSvg(svg, padL - 8, gy, ((yMax - i * (yMax - yMin) / 3) * 100).toFixed(0) + "%", { anchor: "end", size: 10 });
      }
      for (var j = 0; j <= 4; j++) {
        var gx = padL + j * (PLOT_W - padL - padR) / 4;
        textoSvg(svg, gx, h - padB + 16, (xMin + j * (xMax - xMin) / 4).toFixed(0), { anchor: "middle", size: 10 });
      }
      textoSvg(svg, PLOT_W - padR, h - 10, "palavras por frase →", { anchor: "end", size: 10 });
      textoSvg(svg, padL - 8, padT - 6, "↑ diversidade lexical", { size: 10, baseline: "auto" });

      artigos.forEach(function (a) {
        var cx = X(a.fraseMedia), cy = Y(a.diversidade);
        var g = svgEl("g", { "class": "mark", tabindex: 0, role: "img", "aria-label": a.titulo }, svg);
        /* anel na cor da superfície para sobreposições */
        svgEl("circle", { cx: cx, cy: cy, r: 8, fill: C.surface }, g);
        svgEl("circle", { cx: cx, cy: cy, r: 6, fill: C.amber }, g);
        /* alvo ≥24px */
        var hit = svgEl("circle", { cx: cx, cy: cy, r: 15, fill: "transparent" }, g);
        bindTip(hit, function () {
          return [
            { key: C.amber, value: shortTitle(a.titulo, 34), label: fmtDate(a.data) },
            { value: a.fraseMedia.toFixed(1), label: "palavras por frase" },
            { value: (a.diversidade * 100).toFixed(0) + "%", label: "diversidade lexical" },
            { value: a.flesch.toFixed(0) + "/100", label: "legibilidade (Flesch-BR)" }
          ];
        });
        bindTip(g, function () {
          return [{ key: C.amber, value: shortTitle(a.titulo, 34), label: fmtDate(a.data) }];
        });
      });
    })();

    /* bigramas */
    var ul = document.getElementById("bigramas");
    if (analise.topBigramas.length) {
      analise.topBigramas.forEach(function (b) {
        var li = el("li", "bigrama", ul);
        var strong = el("strong", null, li);
        strong.textContent = b[0];
        var count = el("span", null, li);
        count.textContent = b[1] + "×";
      });
    } else {
      document.getElementById("scope-bigramas").hidden = true;
    }

    /* tabela (visão completa — nada fica só no tooltip) */
    var tbody = document.querySelector("#lab-table tbody");
    artigos.forEach(function (a) {
      var tr = el("tr", null, tbody);
      var tdT = el("td", null, tr);
      var link = el("a", "lab-link", tdT);
      link.href = a.link; link.target = "_blank"; link.rel = "noopener";
      link.textContent = a.titulo;
      [fmtDate(a.data), fmtNum(a.palavras), a.leituraMin + " min", a.fraseMedia.toFixed(1),
       (a.diversidade * 100).toFixed(0) + "%", a.flesch.toFixed(0) + "/100",
       (a.temperatura >= 0 ? "+" : "−") + Math.abs(a.temperatura).toFixed(1), a.assinatura.join(", ")
      ].forEach(function (v) {
        var td = el("td", null, tr);
        td.textContent = v;
      });
    });
  }

  function falhar() {
    var st = document.getElementById("lab-status");
    st.textContent = "Não deu para sincronizar com o Medium agora. ";
    var a = el("a", "lab-link", st);
    a.href = "https://extvnerd.medium.com";
    a.target = "_blank"; a.rel = "noopener";
    a.textContent = "Leia os textos direto no Medium ↗";
  }

  /* ---------- corpus de demonstração (para desenvolvimento: ?demo=1) ---------- */

  function corpusDemo() {
    var mk = function (titulo, data, corpo) {
      return { title: titulo, link: "https://extvnerd.medium.com/", pubDate: data, content: "<p>" + corpo + "</p>" };
    };
    var base = "A televisão mudou e o streaming venceu a batalha pela atenção. A Netflix aposta em volume, a HBO defende o prestígio e o público navega entre séries brilhantes e produções descartáveis. ";
    return [
      mk("Melhores da Década", "2020-01-05", base + "A década consagrou dramas excelentes e comédias inteligentes. Enlightened foi brilhante e emocionante, um retrato sensível e profundo. A HBO acertou, a Netflix errou menos do que dizem, e a TV ficou maravilhosa e memorável. Succession é genial. O prestígio virou moeda e a qualidade virou marketing, mas os melhores episódios foram luminosos e originais."),
      mk("O fim da TV como conhecíamos", "2020-06-12", base + "O cancelamento virou rotina e a decepção também. Séries fracas e previsíveis dominam catálogos cansativos. A crise do streaming é um problema real: queda de assinantes, fracasso de originais genéricos, medo do fim. Mas há esperança nos roteiros honestos e criativos."),
      mk("Enlightened e a dramédia perfeita", "2021-03-20", base + "Enlightened é a obra-prima esquecida da HBO. Laura Dern é incrível, o roteiro é sofisticado e delicado, cada episódio é um acerto. A dramédia venceu: meia hora de dor e alegria, sucesso artístico absoluto, televisão de qualidade genuína e encantadora."),
      mk("Netflix contra o mundo", "2021-11-02", base + "A Netflix aposta tudo em algoritmo e volume. Alguns originais são ótimos e surpreendentes, outros são rasos, artificiais e esquecíveis. O catálogo cresce, a curadoria morre, e o assinante fica confuso e cansado. A HBO Max e o Prime Video observam a queda."),
      mk("O prestígio acabou?", "2022-05-15", base + "A televisão de qualidade virou clichê de marketing. O prestígio da HBO sofre com fusões e cancelamentos, um declínio triste. Mas Succession terminou impecável e brilhante, prova de que roteiro forte e elenco perfeito ainda vencem qualquer crise."),
      mk("Guia honesto do streaming brasileiro", "2023-02-08", base + "Globoplay cresce com novelas e jornalismo, o Paramount+ aposta em originais brasileiros excelentes, a Disney+ integra o Star+. O YouTube segue gigante. Falta dinheiro, sobra talento criativo, e a produção nacional merece elogios e telas maiores."),
      mk("A era dos formatos curtos", "2024-09-30", base + "Episódios de meia hora venceram. A atenção é curta, o roteiro precisa ser ágil, inteligente e delicioso. Comédias rápidas e dramédias sensíveis dominam, enquanto dramas longos e arrastados perdem público. Menos é mais, e a edição é a alma do formato."),
      mk("Curadoria é o novo algoritmo", "2025-08-14", base + "Depois do excesso, a curadoria humana volta a ser essencial. Escolher bem é um trabalho criativo e generoso. Festivais, mostras e newsletters brilhantes guiam o público perdido no catálogo infinito. O futuro da TV é menor, mais honesto e mais bonito.")
    ];
  }

  /* ---------- boot ---------- */

  if (/[?&]demo=1/.test(location.search)) {
    montar(analisar(corpusDemo()));
    return;
  }

  fetch(FEED_API)
    .then(function (res) {
      if (!res.ok) { throw new Error("HTTP " + res.status); }
      return res.json();
    })
    .then(function (data) {
      var items = (data && data.status === "ok" && data.items) ? data.items : [];
      if (!items.length) { throw new Error("feed vazio"); }
      montar(analisar(items));
    })
    .catch(falhar);
})();
