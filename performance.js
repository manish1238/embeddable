(async function () {
  // ----- FIREBASE SETUP -----
  const { initializeApp } = await import(
    "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"
  );
  const { getFirestore, doc, setDoc } = await import(
    "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"
  );

  const firebaseConfig = {
    apiKey: "AIzaSyA3ovG8BmEBqeDr-GZgDgP7Wg7Id9c4nkM",
    authDomain: "p-analysis-5fafe.firebaseapp.com",
    projectId: "p-analysis-5fafe",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // ----- CALCULATE PAGE LOAD TIME -----
  window.addEventListener("load", async () => {
    const nav = performance.getEntriesByType("navigation")[0];
    if (!nav) return;

    const loadTime = nav.loadEventEnd - nav.startTime; // total page load time (ms)
    const siteName = window.location.hostname.replace(/\./g, "_"); // use website name as doc ID

    try {
      // Only ONE doc per website — overwrite instead of adding new
      await setDoc(
        doc(db, "performance_metrics", siteName),
        {
          pageLoadTime: loadTime,
          timestamp: new Date().toISOString(),
        },
        { merge: true }
      );

      console.log(`✅ ${siteName} load time: ${loadTime.toFixed(2)} ms`);
    } catch (err) {
      console.error("❌ Error saving performance:", err);
    }
  });
})();
