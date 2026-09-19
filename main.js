/* THE SPECIALTY ATLAS — main interactions (no frameworks, no build step) */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- reading progress ---------- */
  var prog = document.getElementById("progress");
  function onScroll() {
    if (prog) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    var tb = document.getElementById("top-btn");
    if (tb) tb.classList.toggle("show", window.scrollY > 700);
    spy();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector(".nav-burger");
  var links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      links.classList.toggle("open");
      burger.setAttribute("aria-expanded", links.classList.contains("open"));
    });
  }

  /* ---------- back to top ---------- */
  var topBtn = document.getElementById("top-btn");
  if (topBtn) topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  /* ---------- reveal on scroll ---------- */
  var rvs = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
          // trigger bars inside
          en.target.querySelectorAll(".bar i[data-w], .wbar i[data-w]").forEach(function (b) {
            b.style.width = b.getAttribute("data-w") + "%";
          });
          // trigger counters
          en.target.querySelectorAll(".count[data-n]").forEach(countUp);
          if (en.target.classList && en.target.classList.contains("count")) countUp(en.target);
        }
      });
    }, { threshold: 0.12 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".bar i[data-w], .wbar i[data-w]").forEach(function (b) {
      b.style.width = b.getAttribute("data-w") + "%";
    });
    document.querySelectorAll(".count[data-n]").forEach(function (el) {
      el.textContent = (+el.getAttribute("data-n")).toLocaleString("en-US");
    });
  }

  /* ---------- animated counters ---------- */
  function countUp(el) {
    if (el._done) return;
    el._done = true;
    var target = parseFloat(el.getAttribute("data-n"));
    var suf = el.getAttribute("data-suf") || "";
    var dur = reduced ? 0 : 1300;
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = dur === 0 ? 1 : Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val).toLocaleString("en-US") : val.toFixed(1)) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- scroll spy ---------- */
  var spySections = Array.prototype.slice.call(document.querySelectorAll("[data-spy]"));
  function spy() {
    if (!spySections.length) return;
    var pos = window.scrollY + 140, current = null;
    spySections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    document.querySelectorAll(".nav-links a[data-spylink]").forEach(function (a) {
      a.classList.toggle("on-spy", a.getAttribute("data-spylink") === current);
    });
  }

  /* ---------- top-10 expand ---------- */
  document.querySelectorAll(".rank .more").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var r = btn.closest(".rank");
      r.classList.toggle("open");
      btn.childNodes[0].textContent = r.classList.contains("open") ? "Hide the reasoning " : "Why this ranks here ";
    });
  });

  /* ---------- specialty + catalog filters ---------- */
  var q = document.getElementById("q");
  if (q) {
    var grp = document.getElementById("grp");
    var sortSel = document.getElementById("sort");
    var counter = document.getElementById("count-lab");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var rows = Array.prototype.slice.call(document.querySelectorAll("[data-row]"));

    function apply() {
      var term = (q.value || "").toLowerCase().trim();
      var g = grp ? grp.value : "";
      var shown = 0;
      cards.forEach(function (c) {
        var okG = !g || c.getAttribute("data-group") === g;
        var okQ = !term || c.getAttribute("data-search").indexOf(term) !== -1;
        var vis = okG && okQ;
        c.style.display = vis ? "" : "none";
        if (vis) shown++;
      });
      rows.forEach(function (r) {
        var okG = !g || r.getAttribute("data-group") === g;
        var okQ = !term || r.getAttribute("data-search").indexOf(term) !== -1;
        var vis = okG && okQ;
        r.style.display = vis ? "" : "none";
        if (vis) shown++;
      });
      // hide empty group headers
      document.querySelectorAll(".grp-head[data-grouphead]").forEach(function (h) {
        var name = h.getAttribute("data-grouphead");
        var any = cards.some(function (c) {
          return c.getAttribute("data-group") === name && c.style.display !== "none";
        });
        h.style.display = any ? "" : "none";
      });
      if (counter) counter.textContent = shown + " shown";
    }

    function applySort() {
      if (!sortSel) return;
      var key = sortSel.value;
      if (!key) return;
      var byCat = cards.length ? cards : rows;
      var parent = byCat[0] ? byCat[0].parentNode : null;
      if (!parent) return;
      var sorted = byCat.slice().sort(function (a, b) {
        var va = parseFloat(a.getAttribute("data-" + key)) || 0;
        var vb = parseFloat(b.getAttribute("data-" + key)) || 0;
        return vb - va;
      });
      // re-append preserving headers: simple approach — append at end of parent
      sorted.forEach(function (el) { parent.appendChild(el); });
    }

    q.addEventListener("input", apply);
    if (grp) grp.addEventListener("change", apply);
    if (sortSel) sortSel.addEventListener("change", function () { applySort(); apply(); });
    apply();
  }

  /* ---------- EKG generator (renders beat pattern into any .ekg svg) ---------- */
  document.querySelectorAll("svg[data-ekg]").forEach(function (svg) {
    var beat =
      "h52 c5,-9 11,-9 16,0 h22 l5,9 l7,-52 l8,66 l6,-23 h20 c9,-17 21,-17 30,0 h62";
    var d = "M0,60 ";
    for (var i = 0; i < 5; i++) d += beat + " ";
    var paths = svg.querySelectorAll("path");
    paths.forEach(function (p) { p.setAttribute("d", d); });
  });

  onScroll();
})();
