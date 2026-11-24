(function () {
  var lastMermaidDark = null;
  var isApplyingTheme = false;

  function isDarkTheme() {
    var root = document.documentElement;
    var dt = root.getAttribute("data-theme");
    if (dt === "dark") return true;
    if (dt === "light") return false;
    return root.classList.contains("dark");
  }

  function applyTheme(theme) {
    isApplyingTheme = true;
    try {
      var root = document.documentElement;
      root.setAttribute("data-theme", theme);
      root.classList.toggle("dark", theme === "dark");
      try {
        localStorage.setItem("pelican-benchmark-theme", theme);
      } catch (_) {}
      updateToggleLabel();
    } finally {
      isApplyingTheme = false;
    }
  }

  function updateToggleLabel() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.textContent = isDarkTheme() ? "浅色模式" : "深色模式";
  }

  function renderArithmatex() {
    if (typeof window.renderMathInElement !== "function") return;
    document.querySelectorAll(".arithmatex").forEach(function (el) {
      if (el.getAttribute("data-katex-rendered") === "1") return;
      window.renderMathInElement(el, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
      el.setAttribute("data-katex-rendered", "1");
    });
  }

  function prepareMermaidBlocks() {
    document.querySelectorAll("pre.mermaid").forEach(function (pre) {
      var codeEl = pre.querySelector("code");
      var raw = ((codeEl ? codeEl.textContent : pre.textContent) || "").trim();
      if (!raw) return;
      var wrapper = document.createElement("div");
      wrapper.className = "pelican-mermaid";
      wrapper.setAttribute("data-mermaid-src", raw);
      pre.replaceWith(wrapper);
    });
  }

  async function renderMermaid(force) {
    if (!window.mermaid) return;
    prepareMermaidBlocks();
    var nodes = document.querySelectorAll(".pelican-mermaid[data-mermaid-src]");
    if (!nodes.length) return;

    var dark = isDarkTheme();
    if (!force && lastMermaidDark === dark && nodes[0].querySelector("svg")) {
      return;
    }
    lastMermaidDark = dark;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: dark ? "dark" : "default",
      securityLevel: "loose"
    });

    for (var i = 0; i < nodes.length; i++) {
      var container = nodes[i];
      var src = container.getAttribute("data-mermaid-src");
      if (!src) continue;
      var id = "pelican-mermaid-" + Date.now() + "-" + i;
      try {
        var out = await window.mermaid.render(id, src);
        container.innerHTML = out.svg;
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    }
  }

  function init() {
    var root = document.documentElement;
    var attr = root.getAttribute("data-theme");
    if (root.classList.contains("dark") && attr !== "dark") {
      applyTheme("dark");
    } else if (!attr || attr === "light") {
      var saved = null;
      try {
        saved = localStorage.getItem("pelican-benchmark-theme");
      } catch (_) {}
      if (saved === "dark") {
        applyTheme("dark");
      } else {
        updateToggleLabel();
      }
    } else {
      updateToggleLabel();
    }

    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next = isDarkTheme() ? "light" : "dark";
        applyTheme(next);
        void renderMermaid(true);
      });
    }

    renderArithmatex();
    void renderMermaid(true);

    var observer = new MutationObserver(function () {
      if (isApplyingTheme) return;
      var dark = isDarkTheme();
      document.documentElement.classList.toggle("dark", dark);
      updateToggleLabel();
      void renderMermaid(false);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"]
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
