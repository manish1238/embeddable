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

  // ----- LOAD WEB-VITALS LIBRARY -----
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/web-vitals@3.0.0/dist/web-vitals.umd.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  // ----- PERFORMANCE TRACKER CLASS -----
  class PerformanceTracker {
    constructor() {
      this.metrics = {};
      this.init();
    }

    init() {
      this.observeWebVitals();
      this.captureNavigationTiming();
      this.captureResourceTiming();
    }

    observeWebVitals() {
      if (!window.webVitals) return;

      const send = (metric, name) => this.sendToFirebase(name, metric.value);

      webVitals.getCLS((metric) => send(metric, "CLS"));
      webVitals.getFID((metric) => send(metric, "FID"));
      webVitals.getLCP((metric) => send(metric, "LCP"));
      webVitals.getFCP((metric) => send(metric, "FCP"));
      webVitals.getTTFB((metric) => send(metric, "TTFB"));
    }

    captureNavigationTiming() {
      const nav = performance.getEntriesByType("navigation")[0];
      if (!nav) return;

      const metrics = {
        TTFB: nav.responseStart - nav.requestStart,
        DOMLoad: nav.domContentLoadedEventEnd - nav.navigationStart,
        WindowLoad: nav.loadEventEnd - nav.navigationStart,
      };

      for (let key in metrics) this.sendToFirebase(key, metrics[key]);
    }

    captureResourceTiming() {
      const resources = performance.getEntriesByType("resource");
      resources.forEach((res) => {
        if (["script", "css", "img"].includes(res.initiatorType)) {
          this.sendToFirebase(`Resource_${res.name}`, res.duration);
        }
      });
    }

    async sendToFirebase(metricName, value) {
      this.metrics[metricName] = value;
      try {
        await addDoc(collection(db, "performance_metrics"), {
          metric: metricName,
          value,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        });
        console.log(`✅ ${metricName}: ${value}`);
      } catch (err) {
        console.error("❌ Firebase error:", err);
      }
    }

    getMetrics() {
      return this.metrics;
    }
  }

  // ----- INITIALIZE TRACKER -----
  window.PerformanceTracker = new PerformanceTracker();
})();
