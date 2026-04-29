// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,   // FIX: was missing
  signInWithEmailAndPassword,       // FIX: was missing
  updateProfile                     // FIX: was missing (needed to save display name on register)
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ⚠️ REPLACE these values with your real Firebase project config
// Go to: Firebase Console → Project Settings → Your Apps → SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyB0i2FgRO4hCNmC5Ehnm02VlTSvfVCpQhY",
  authDomain: "notiport-f975a.firebaseapp.com",
  databaseURL: "https://notiport-f975a-default-rtdb.firebaseio.com",
  projectId: "notiport-f975a",
  storageBucket: "notiport-f975a.firebasestorage.app",
  messagingSenderId: "54239992603",
  appId: "1:54239992603:web:d0a917d666f39c96d251be",
  measurementId: "G-KQBGQMX8FN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ================= AUTH STATE =================
// FIX: Wrapped in DOMContentLoaded so DOM elements are guaranteed to exist
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      showDownload(user.displayName || user.email?.split("@")[0] || "User");
    } else {
      // User logged out — hide download section
      document.getElementById("download-section")?.classList.remove("visible");
    }
  });
});

// ================= REGISTER =================
// FIX: Now actually creates a Firebase user with email + password
window.handleRegister = async function () {
  const name  = document.getElementById("reg-name")?.value.trim();
  const email = document.getElementById("reg-email")?.value.trim();
  const pass  = document.getElementById("reg-pass")?.value.trim();

  if (!name || !email || !pass) {
    alert("Fill all fields!");
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);

    // FIX: Save display name to the Firebase user profile
    await updateProfile(result.user, { displayName: name });

    showDownload(name);
  } catch (err) {
    console.error(err);
    alert(getErrorMessage(err.code));
  }
};

// ================= LOGIN =================
// FIX: Now actually signs in via Firebase instead of just showing download
window.handleLogin1 = async function () {
  const email = document.getElementById("log-email")?.value.trim();
  const pass  = document.getElementById("log-pass")?.value.trim();

  if (!email || !pass) {
    alert("Fill login fields!");
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    showDownload(result.user.displayName || email.split("@")[0]);
  } catch (err) {
    console.error(err);
    alert(getErrorMessage(err.code));
  }
};

// ================= GOOGLE LOGIN =================
window.handleGoogleLogin = async function () {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    showDownload(result.user.displayName || "User");
  } catch (err) {
    console.error(err);
    // FIX: Don't alert on user-cancelled popup (popup-closed-by-user)
    if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
      alert("Google login error: " + getErrorMessage(err.code));
    }
  }
};

// ================= APPLE LOGIN =================
window.handleAppleLogin = async function () {
  const provider = new OAuthProvider("apple.com");

  try {
    const result = await signInWithPopup(auth, provider);
    showDownload(result.user.displayName || "User");
  } catch (err) {
    console.error(err);
    if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
      alert("Apple login error: " + getErrorMessage(err.code));
    }
  }
};

// ================= LOGOUT =================
window.handleLogout = async function () {
  try {
    await signOut(auth);
    // onAuthStateChanged above will handle hiding the download section
  } catch (err) {
    console.error(err);
    alert("Logout failed. Please try again.");
  }
};

// ================= DOWNLOAD =================
window.handleDownload = function () {
  const link = document.createElement("a");
  link.href = "./assets/download/app.apk"; // ⚠️ Make sure this file actually exists on your server
  link.download = "NotiPort.apk";
  document.body.appendChild(link); // FIX: Some browsers require the link to be in the DOM
  link.click();
  document.body.removeChild(link); // Clean up
};

// ================= NAV =================
window.toggleNav = function () {
  document.getElementById("main-nav")?.classList.toggle("open");
};

// ================= FAQ =================
window.toggleFaq = function (btn) {
  btn.parentElement.classList.toggle("open");
};

// ================= CONTACT =================
window.submitContact = function () {
  const name  = document.getElementById("c-name")?.value.trim();
  const email = document.getElementById("c-email")?.value.trim();
  const msg   = document.getElementById("c-msg")?.value.trim();

  if (!name || !email || !msg) {
    alert("Fill all fields!");
    return;
  }

  // TODO: Connect to a real backend, Firebase Function, or Telegram bot
  alert("Message sent!");
};

// ================= COUNTER =================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".count").forEach((el) => {
    const target = +el.dataset.target;
    let count = 0;
    const step = Math.ceil(target / 100);

    const run = () => {
      count = Math.min(count + step, target); // FIX: Clamp so it never overshoots
      el.innerText = count;
      if (count < target) setTimeout(run, 20);
    };

    run();
  });
});

// ================= SHOW DOWNLOAD =================
function showDownload(name) {
  const box = document.getElementById("download-section");
  if (box) {
    box.classList.add("visible");
    box.scrollIntoView({ behavior: "smooth" });
  }

  const msg = document.getElementById("welcome-msg");
  if (msg) msg.innerText = "Welcome, " + name;
}

// ================= ERROR MESSAGES =================
// FIX: New helper — turns Firebase error codes into readable messages
function getErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use":    "Bu email allaqchon foydalanilgan.",
    "auth/invalid-email":           "Notog'ri email manzili.",
    "auth/weak-password":           "Parol kamida 6 ta belgidan iborat bo'lishi kerak.",
    "auth/user-not-found":          "Ushbu email bilan hisob qayd etilmagan.",
    "auth/wrong-password":          "Noto'g'ri parol.",
    "auth/invalid-credential":      "Noto'g'ri email yoki parol.",
    "auth/too-many-requests":       "Urinishlar juda ko'p. Iltimos, keyinroq harakat qiling.",
    "auth/network-request-failed":  "Tarmoqda xatolik, iltimos ulanishni tekshiring.",
    "auth/operation-not-allowed":   "Bu Kirish usuli mavjud emas.",
  };
  return messages[code] || "Something went wrong. Please try again.";
}