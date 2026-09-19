/* ============================================================
   PULSE — the site's heartbeat (Appwrite-backed)
   Sends anonymous page_view events and wires the "Was this
   page useful?" feedback widget to an Appwrite Function.
   Degrades gracefully: if not configured or offline, it is
   completely silent.
   ============================================================ */
(function () {
  "use strict";
  var cfg = window.PULSE_CONFIG || {};
  if (!cfg.projectId || !cfg.functionId) return; // not configured → static mode

  var path = location.pathname.replace(/index\.html$/, "/");

  function call(body) {
    return fetch(cfg.endpoint + "/functions/" + cfg.functionId + "/executions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": cfg.projectId,
      },
      body: JSON.stringify(body),
    }).then(function (r) { return r.ok ? r.json() : null; });
  }

  /* ---- fire the page_view beacon (fire-and-forget) ---- */
  call({ type: "page_view", path: path }).then(function (res) {
    try {
      var data = JSON.parse(res.responseBody || "{}");
      var el = document.getElementById("pulse-views");
      if (el && data.views != null) {
        el.textContent = "● " + Number(data.views).toLocaleString("en-US") + " views on this page";
        el.style.display = "inline-block";
      }
    } catch (e) { /* silent */ }
  }).catch(function () { /* offline / blocked — silent */ });

  /* ---- feedback widget ---- */
  var slot = document.getElementById("pulse-slot");
  if (!slot) return;
  slot.style.display = "flex";

  slot.querySelectorAll(".pulse-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-val");
      btn.disabled = true;
      call({ type: "feedback", path: path, value: val })
        .then(function () {
          slot.querySelectorAll(".pulse-btn").forEach(function (b) { b.style.display = "none"; });
          var thanks = slot.querySelector(".pulse-thanks");
          if (thanks) { thanks.style.display = "inline"; }
        })
        .catch(function () { btn.disabled = false; });
    });
  });
})();
