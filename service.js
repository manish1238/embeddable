(function () {
  // Create floating button
  const btn = document.createElement("div");
  btn.id = "widget-button";
  btn.textContent = "+";
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#e67e22",
    color: "#fff",
    fontSize: "32px",
    textAlign: "center",
    lineHeight: "55px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 9999,
    userSelect: "none",
  });
  document.body.appendChild(btn);

  // Create popup panel
  const panel = document.createElement("div");
  panel.id = "widget-panel";
  panel.style.cssText = `
    position: fixed;
    bottom: 150px;
    right: 20px;
    width: 280px;
    padding: 15px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    display: none;
    font-family: Poppins, sans-serif;
  `;
  panel.innerHTML = `
    <h3 style="margin:0 0 10px;color:#e67e22;">My Awesome Servic 1.1.0e</h3>
    <p style="margin-bottom:6px;">Enter two numbers please:-</p>
    <input id="num1" type="number" placeholder="Number 1" style="width:100%;padding:8px;margin-bottom:6px;border:1px solid #ccc;border-radius:6px;">
    <input id="num2" type="number" placeholder="Number 2" style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;">
    <button id="computeBtn" style="width:100%;padding:10px;background:#27ae60;color:white;border:none;border-radius:6px;cursor:pointer;">Compute Sum</button>
    <div id="widget-result" style="margin-top:10px;font-weight:bold;"></div>
  `;
  document.body.appendChild(panel);

  // Toggle visibility
  btn.onclick = () => {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  };

  // Service logic
  window.myAwesomeService = {
    greet: (name) => `Hello, ${name}!`,
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => (b === 0 ? "Error: Division by zero" : a / b),
  };

  // Compute button logic
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "computeBtn") {
      const a = parseFloat(document.getElementById("num1").value) || 0;
      const b = parseFloat(document.getElementById("num2").value) || 0;
      const result = window.myAwesomeService.add(a, b);
      document.getElementById("widget-result").innerText =
        "Final Result: " + result;
    }
  });
})();
