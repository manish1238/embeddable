(function () {
  function insertHello(message) {
    const el = document.createElement("div");
    el.textContent = message || "Hello from widget!";
    el.style.padding = "10px";
    el.style.border = "1px solid #000";
    el.style.background = "#eef";
    document.body.appendChild(el);
  }

  // Expose init function globally
  window.HelloWidget = {
    init: function (options) {
      const message = options && options.message;
      insertHello(message);
    },
  };
})();
