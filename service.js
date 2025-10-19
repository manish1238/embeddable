(async function () {
  // ✅ Import Firebase SDKs directly from CDN
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js");
  const { getFirestore, collection, addDoc } = await import("https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js");

  // ✅ Initialize Firebase (your project config)
  const firebaseConfig = {
    apiKey: "AIzaSyA3ovG8BmEBqeDr-GZgDgP7Wg7Id9c4nkM",
    authDomain: "p-analysis-5fafe.firebaseapp.com",
    projectId: "p-analysis-5fafe",
    storageBucket: "p-analysis-5fafe.firebasestorage.app",
    messagingSenderId: "127142036441",
    appId: "1:127142036441:web:8d51578cc8b8f7018acfc8",
    measurementId: "G-Q18KXX0QHG",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // ✅ Log widget load event
  try {
    await addDoc(collection(db, "widget_events"), {
      event: "widget_loaded",
      page: window.location.href,
      timestamp: new Date().toISOString(),
    });
    console.log("✅ Widget event logged to Firestore");
  } catch (err) {
    console.error("❌ Error logging event:", err);
  }

  // --- UI CREATION BELOW ---

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
    <h3 style="margin:0 0 10px;color:#e67e22;">My Awesome Service</h3>
    <p style="margin-bottom:6px;">Enter two numbers please:-</p>
    <input id="num1" type="number" placeholder="Number 1" style="width:100%;padding:8px;margin-bottom:6px;border:1px solid #ccc;border-radius:6px;">
    <input id="num2" type="number" placeholder="Number 2" style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;">
    <button id="computeBtn" style="width:100%;padding:10px;background:#27ae60;color:white;border:none;border-radius:6px;cursor:pointer;">Compute Sum</button>
    <div id="widget-result" style="margin-top:10px;font-weight:bold;"></div>
  `;
  document.body.appendChild(panel);

  btn.onclick = () => {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  };

  window.myAwesomeService = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => (b === 0 ? "Error: Division by zero" : a / b),
  };

  document.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "computeBtn") {
      const a = parseFloat(document.getElementById("num1").value) || 0;
      const b = parseFloat(document.getElementById("num2").value) || 0;
      const result = window.myAwesomeService.add(a, b);
      document.getElementById("widget-result").innerText = "Final Result: " + result;

      // ✅ Log action in Firestore
      try {
        await addDoc(collection(db, "widget_events"), {
          event: "compute_clicked",
          num1: a,
          num2: b,
          result: result,
          page: window.location.href,
          timestamp: new Date().toISOString(),
        });
        console.log("✅ Compute event logged to Firestore");
      } catch (err) {
        console.error("❌ Error writing compute event:", err);
      }
    }
  });
})();
