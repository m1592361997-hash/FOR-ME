(function () {
  var panel = null;
  var rail = null;

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function openShowcase(event) {
    if (!panel) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    document.body.classList.remove("listMenu-open-left", "listMenu-open-right", "open");
    document.body.classList.add("portfolio-showcase-open");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  }

  function closeShowcase(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!panel) return;
    document.body.classList.remove("portfolio-showcase-open");
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  function moveRail(direction) {
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.max(260, rail.clientWidth * 0.7),
      behavior: "smooth",
    });
  }

  ready(function () {
    panel = document.getElementById("portfolio-showcase");
    rail = document.querySelector("[data-showcase-rail]");

    document.addEventListener(
      "click",
      function (event) {
        if (event.target.closest("#portfolio-showcase")) return;
        if (event.target.closest(".viewWorks, footer .listMenu")) {
          openShowcase(event);
        }
      },
      true,
    );

    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-showcase-close]")) {
        closeShowcase(event);
      }

      if (event.target.closest("[data-showcase-prev]")) {
        event.preventDefault();
        moveRail(-1);
      }

      if (event.target.closest("[data-showcase-next]")) {
        event.preventDefault();
        moveRail(1);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel && panel.classList.contains("is-open")) {
        closeShowcase(event);
      }
    });

    if (new URLSearchParams(window.location.search).get("works") === "2025") {
      openShowcase();
    }
  });
})();
