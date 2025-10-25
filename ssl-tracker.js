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

  // ----- SECURITY AUDIT CLASS -----
  class SecurityAudit {
    constructor() {
      this.results = {
        hasSSL: false,
        mixedContent: [],
        outdatedLibraries: [],
        domainAge: "unknown",
        checkedAt: new Date().toISOString(),
      };
    }

    async run() {
      this.checkSSL();
      this.checkMixedContent();
      this.detectOutdatedLibs();
      await this.getDomainAge();
      await this.saveToFirebase();
    }

    checkSSL() {
      this.results.hasSSL = location.protocol === "https:";
      console.log(`🔐 SSL: ${this.results.hasSSL ? "Secure" : "Not Secure"}`);
    }

    checkMixedContent() {
      const insecure = [];

      document.querySelectorAll("img, script, link").forEach((el) => {
        const src = el.src || el.href;
        if (src && src.startsWith("http://")) insecure.push(src);
      });

      this.results.mixedContent = insecure;
      console.log(`⚠️ Mixed Content Found: ${insecure.length}`);
    }

    detectOutdatedLibs() {
      const outdated = [];
      const scripts = Array.from(document.scripts)
        .map((s) => s.src)
        .filter(Boolean);

      scripts.forEach((src) => {
        if (/jquery-(1|2)\./i.test(src)) outdated.push("Old jQuery");
        if (/bootstrap\/3/i.test(src)) outdated.push("Old Bootstrap");
        if (/angular\.js/i.test(src)) outdated.push("Old AngularJS");
      });

      this.results.outdatedLibraries = [...new Set(outdated)];
      console.log(
        `📦 Outdated Libs: ${
          this.results.outdatedLibraries.join(", ") || "None"
        }`
      );
    }

    async getDomainAge() {
      try {
        const domain = location.hostname.replace("www.", "");
        const res = await fetch(
          `https://api.api-ninjas.com/v1/whois?domain=${domain}`,
          {
            headers: { "X-Api-Key": "YOUR_API_NINJAS_KEY" }, // optional
          }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.creation_date) {
            this.results.domainAge = data.creation_date;
            console.log(`📅 Domain Created: ${data.creation_date}`);
          }
        }
      } catch (err) {
        console.warn("⚠️ Domain age lookup failed:", err);
      }
    }

    async saveToFirebase() {
      try {
        const websiteName = location.hostname.replace(/\./g, "_");
        await setDoc(doc(db, "security-audit", websiteName), this.results);
        console.log("✅ Security audit saved to Firebase:", this.results);
      } catch (err) {
        console.error("❌ Firebase save failed:", err);
      }
    }
  }

  // ----- INITIALIZE SECURITY AUDIT -----
  const audit = new SecurityAudit();
  await audit.run();
})();
