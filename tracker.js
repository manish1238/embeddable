// tracker.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ✅ Firebase config (replace with yours)
const firebaseConfig = {
  apiKey: "AIzaSyA3ovG8BmEBqeDr-GZgDgP7Wg7Id9c4nkM",
  authDomain: "p-analysis-5fafe.firebaseapp.com",
  projectId: "p-analysis-5fafe",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Get unique user ID (persistent per browser)
function getUniqueUserId() {
  let uid = localStorage.getItem("unique_visitor_id");
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem("unique_visitor_id", uid);
  }
  return uid;
}

// ✅ Get site name dynamically
function getSiteName() {
  const { hostname, pathname } = window.location;
  return `${hostname}${pathname}`;
}

// ✅ Track visit
async function trackVisit() {
  const siteName = getSiteName();
  const uid = getUniqueUserId();
  const docRef = doc(db, "visits", siteName);

  const snap = await getDoc(docRef);
  let data = snap.exists()
    ? snap.data()
    : { totalVisits: 0, uniqueVisitors: [] };

  // Check if this UID already visited
  const isUnique = !data.uniqueVisitors.includes(uid);

  if (isUnique) {
    data.uniqueVisitors.push(uid);
  }

  await setDoc(
    docRef,
    {
      totalVisits: increment(1),
      uniqueVisitors: data.uniqueVisitors,
      lastVisit: new Date().toISOString(),
    },
    { merge: true }
  );

  console.log(
    `✅ ${
      isUnique ? "New unique visitor" : "Returning visitor"
    } | Page: ${siteName}`
  );
}

trackVisit();
