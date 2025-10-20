(async function () {
  // ----- FIREBASE SETUP -----
  const { initializeApp } = await import(
    "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"
  );
  const { getFirestore, collection, addDoc } = await import(
    "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"
  );

  const firebaseConfig = {
    apiKey: "AIzaSyA3ovG8BmEBqeDr-GZgDgP7Wg7Id9c4nkM",
    authDomain: "p-analysis-5fafe.firebaseapp.com",
    projectId: "p-analysis-5fafe",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // ----- PAGE LOAD TIME -----
  window.addEventListener("load", async () => {
    const perf = performance.getEntriesByType("navigation")[0];
    const loadTime = perf.loadEventEnd - perf.startTime; // total load time (ms)

    try {
      await addDoc(collection(db, "performance_metrics"), {
        metric: "page_load_time",
        value: loadTime,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
      console.log(`✅ Page Load Time recorded: ${loadTime.toFixed(2)} ms`);
    } catch (err) {
      console.error("❌ Firebase error:", err);
    }
  });
})();
