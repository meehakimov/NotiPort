// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      showDownload(user.displayName || user.email?.split("@")[0] || "User");
    } else {
      hideDownload();
    }
  });
});

// ================= REGISTER =================
window.handleRegister = async function () {
  const name  = document.getElementById("reg-name")?.value.trim();
  const email = document.getElementById("reg-email")?.value.trim();
  const pass  = document.getElementById("reg-pass")?.value.trim();

  if (!name || !email || !pass) {
    showError("reg-error", "Barcha maydonlarni to'ldiring!");
    return;
  }

  try {
    setLoading("btn-register", true);
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(result.user, { displayName: name });
    showDownload(name); // ✅ hides form, shows download
  } catch (err) {
    console.error(err);
    showError("reg-error", getErrorMessage(err.code));
  } finally {
    setLoading("btn-register", false);
  }
};

// ================= LOGIN =================
window.handleLogin1 = async function () {
  const email = document.getElementById("log-email")?.value.trim();
  const pass  = document.getElementById("log-pass")?.value.trim();

  if (!email || !pass) {
    showError("log-error", "Email va parolni kiriting!");
    return;
  }

  try {
    setLoading("btn-login", true);
    const result = await signInWithEmailAndPassword(auth, email, pass);
    showDownload(result.user.displayName || email.split("@")[0]);
  } catch (err) {
    console.error(err);
    showError("log-error", getErrorMessage(err.code));
  } finally {
    setLoading("btn-login", false);
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
    if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
      showError("reg-error", getErrorMessage(err.code));
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
      showError("reg-error", getErrorMessage(err.code));
    }
  }
};

// ================= LOGOUT =================
window.handleLogout = async function () {
  try {
    await signOut(auth);
    // onAuthStateChanged will call hideDownload() automatically
  } catch (err) {
    console.error(err);
  }
};

// ================= DOWNLOAD =================
window.handleDownload = function () {
  const link = document.createElement("a");
  link.href = "./assets/download/app-release.apk";
  link.download = "NotiPort.apk";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ================= NAV =================
window.toggleNav = function () {
  document.getElementById("main-nav")?.classList.toggle("open");
};

// ================= FAQ =================
window.toggleFaq = function (btn) {
  const clickedItem = btn.parentElement;
  const allItems = document.querySelectorAll(".faq-item"); // ✅ o'z class nomingizni yozing

  allItems.forEach((item) => {
    if (item === clickedItem) {
      // Bosilgan item — ochiq/yopiq almashtir
      item.classList.toggle("open");
    } else {
      // Boshqa itemlar — yopib qo'y
      item.classList.remove("open");
    }
  });
};
// ================= CONTACT =================
window.submitContact = function () {
  const name  = document.getElementById("c-name")?.value.trim();
  const email = document.getElementById("c-email")?.value.trim();
  const msg   = document.getElementById("c-msg")?.value.trim();

  if (!name || !email || !msg) {
    alert("Barcha maydonlarni to'ldiring!");
    return;
  }
  alert("Xabar yuborildi!");
};

// ================= COUNTER =================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".count").forEach((el) => {
    const target = +el.dataset.target;
    let count = 0;
    const step = Math.ceil(target / 100);
    const run = () => {
      count = Math.min(count + step, target);
      el.innerText = count;
      if (count < target) setTimeout(run, 20);
    };
    run();
  });
});

// ================= SHOW DOWNLOAD =================
function showDownload(name) {
  // ✅ Hide the register/login form
  const authSection = document.getElementById("auth-section");
  if (authSection) authSection.style.display = "none";

  // ✅ Show download section
  const box = document.getElementById("download-section");
  if (box) {
    box.classList.add("visible");
    box.scrollIntoView({ behavior: "smooth" });
  }
   const navLink = document.getElementById("nav-login-link");
  if (navLink) navLink.style.display = "none";
  // ✅ Set welcome name
  const msg = document.getElementById("welcome-msg");
  if (msg) msg.innerText = "Welcome, " + name;
}

// ================= HIDE DOWNLOAD (logout) =================
function hideDownload() {
  // Show auth form again
  const authSection = document.getElementById("auth-section");
  if (authSection) authSection.style.display = "";

  // Hide download section
  const box = document.getElementById("download-section");
  if (box) box.classList.remove("visible");
  const navLink = document.getElementById("nav-login-link");
  if (navLink) navLink.style.display = "";
}

// ================= LOADING STATE =================
function setLoading(btnId, isLoading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = isLoading;
  btn.style.opacity = isLoading ? "0.6" : "1";
}

// ================= ERROR DISPLAY =================
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.innerText = message;
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 4000);
  } else {
    alert(message);
  }
}

// ================= ERROR MESSAGES (Uzbek) =================
function getErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use":   "Bu email allaqachon ro'yxatdan o'tgan.",
    "auth/invalid-email":          "Email noto'g'ri formatda.",
    "auth/weak-password":          "Parol kamida 6 ta belgidan iborat bo'lishi kerak.",
    "auth/user-not-found":         "Bu email bilan hisob topilmadi.",
    "auth/wrong-password":         "Parol noto'g'ri.",
    "auth/invalid-credential":     "Email yoki parol noto'g'ri.",
    "auth/too-many-requests":      "Juda ko'p urinish. Keyinroq urinib ko'ring.",
    "auth/network-request-failed": "Tarmoq xatosi. Internetni tekshiring.",
    "auth/operation-not-allowed":  "Bu kirish usuli Firebase'da yoqilmagan.",
  };
  return messages[code] || "Xatolik yuz berdi. Qaytadan urinib ko'ring.";
}