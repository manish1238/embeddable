import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA3ovG8BmEBqeDr-GZgDgP7Wg7Id9c4nkM",
  authDomain: "p-analysis-5fafe.firebaseapp.com",
  projectId: "p-analysis-5fafe",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🧠 SEO Audit Script
async function runSEOAudit() {
  const seoReport = {};

  // 1️⃣ Title
  seoReport.title = document.title || "❌ Missing";

  // 2️⃣ Meta Description
  const desc = document.querySelector('meta[name="description"]');
  seoReport.description = desc ? "✅ Found" : "❌ Missing";

  // 3️⃣ Canonical Tag
  const canonical = document.querySelector('link[rel="canonical"]');
  seoReport.canonical = canonical ? "✅ Found" : "❌ Missing";

  // 4️⃣ H1 Tag
  const h1s = document.querySelectorAll("h1");
  seoReport.h1Count = h1s.length;
  seoReport.h1Status =
    h1s.length === 1 ? "✅ One H1 tag" : `⚠️ ${h1s.length} H1 tags`;

  // 5️⃣ Image Alts
  const imgs = [...document.querySelectorAll("img")];
  const noAlt = imgs.filter((img) => !img.alt).length;
  seoReport.imagesWithoutAlt =
    noAlt > 0 ? `⚠️ ${noAlt} missing alt` : "✅ All images have alt";

  // 6️⃣ Robots meta
  const robots = document.querySelector('meta[name="robots"]');
  seoReport.robots = robots ? robots.content : "✅ Default (index, follow)";

  // 7️⃣ Open Graph tags
  const ogTags = document.querySelectorAll('meta[property^="og:"]');
  seoReport.openGraphTags = ogTags.length
    ? `✅ ${ogTags.length} OG tags`
    : "❌ None found";

  // 8️⃣ Structured Data
  const schema = document.querySelector('script[type="application/ld+json"]');
  seoReport.structuredData = schema ? "✅ Found" : "❌ Missing";

  // 9️⃣ Timestamp
  seoReport.timestamp = new Date().toISOString();

  // 🌐 Website name (host only)
  const websiteName = window.location.hostname || "unknown-site";

  // 🧾 Save to Firebase (seo-audit → websiteName)
  try {
    await setDoc(doc(db, "seo-audit", websiteName), seoReport);
    console.log("✅ SEO audit saved for", websiteName, seoReport);
  } catch (err) {
    console.error("❌ Error saving SEO audit:", err);
  }

  // Also print summary in console
  console.table(seoReport);
}

// Run SEO audit after DOM is ready
document.addEventListener("DOMContentLoaded", runSEOAudit);
