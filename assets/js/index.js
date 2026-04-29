// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ================= AUTH STATE =================
onAuthStateChanged(auth, (user) => {
  if (user) {
    showDownload(user.displayName || "User");
  }
});

// ================= REGISTER =================
window.handleRegister = function () {
  const name = document.getElementById("reg-name")?.value.trim();
  const email = document.getElementById("reg-email")?.value.trim();
  const pass = document.getElementById("reg-pass")?.value.trim();

  if (!name || !email || !pass) {
    alert("Fill all fields!");
    return;
  }

  showDownload(name);
};

// ================= LOGIN =================
window.handleLogin1 = function () {
  const email = document.getElementById("log-email")?.value.trim();
  const pass = document.getElementById("log-pass")?.value.trim();

  if (!email || !pass) {
    alert("Fill login fields!");
    return;
  }

  showDownload(email.split("@")[0]);
};

// ================= GOOGLE LOGIN =================
window.handleGoogleLogin = function () {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((res) => {
      showDownload(res.user.displayName || "User");
    })
    .catch((err) => {
      console.error(err);
      alert("Google login error");
    });
};

// ================= APPLE LOGIN =================
window.handleAppleLogin = function () {
  const provider = new OAuthProvider("apple.com");

  signInWithPopup(auth, provider)
    .then((res) => {
      showDownload(res.user.displayName || "User");
    })
    .catch((err) => {
      console.error(err);
      alert("Apple login error");
    });
};

// ================= LOGOUT =================
window.handleLogout = function () {
  signOut(auth).then(() => {
    document.getElementById("download-section")?.classList.remove("visible");
  });
};

// ================= DOWNLOAD =================
window.handleDownload = function () {
  const link = document.createElement("a");
  link.href = "./assets/download/app.apk";
  link.download = "NotiPort.apk";
  link.click();
};

// ================= NAV =================
window.toggleNav = function () {
  document.getElementById("main-nav")?.classList.toggle("open");
};

// ================= FAQ =================
window.toggleFaq = function (btn) {
  btn.parentElement.classList.toggle("open");
};

// ================= CONTACT (OPTIONAL TELEGRAM) =================
window.submitContact = function () {
  const name = document.getElementById("c-name")?.value.trim();
  const email = document.getElementById("c-email")?.value.trim();
  const msg = document.getElementById("c-msg")?.value.trim();

  if (!name || !email || !msg) {
    alert("Fill all fields!");
    return;
  }

  alert("Message sent (demo mode)");
};

// ================= COUNTER =================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".count").forEach((el) => {
    const target = +el.dataset.target;
    let count = 0;

    const step = Math.ceil(target / 100);

    const run = () => {
      count += step;
      if (count < target) {
        el.innerText = count;
        setTimeout(run, 20);
      } else {
        el.innerText = target;
      }
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