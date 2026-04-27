  // Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
/* --- NAVIGATSIYA TUGMASI --- */
  function toggleNav() {
    document.getElementById('main-nav').classList.toggle('open');
  }
  document.addEventListener('click', function(e) {
    const nav = document.getElementById('main-nav');
    const hb = document.getElementById('hamburger');
    if (!nav.contains(e.target) && !hb.contains(e.target)) nav.classList.remove('open');
  });

  /* --- FAQ AKKORDEON --- */
  function toggleFaq(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  /* --- XOTIRADAGI AUTENTIFIKATSIYA --- */
  const users = {};
  let currentUser = null;

  function showDownload(name) {
    currentUser = name;
    const ds = document.getElementById('download-section');
    ds.classList.add('visible');
    document.getElementById('welcome-msg').textContent = 'Xush kelibsiz, ' + name + '! 🎓';
    ds.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setMsg(id, text, success) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.style.color = success ? 'var(--primary)' : '#e74c3c';
  }

  function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    if (!name) return setMsg('reg-msg', '⚠️ Iltimos, to\'liq ismingizni kiriting.', false);
    if (!email || !email.includes('@')) return setMsg('reg-msg', '⚠️ To\'g\'ri email manzil kiriting.', false);
    if (pass.length < 6) return setMsg('reg-msg', '⚠️ Parol kamida 6 ta belgidan iborat bo\'lishi kerak.', false);
    if (users[email]) return setMsg('reg-msg', '⚠️ Bu email allaqachon ro\'yxatdan o\'tgan.', false);
    users[email] = { name, pass };
    setMsg('reg-msg', '✅ Hisob muvaffaqiyatli yaratildi!', true);
    setTimeout(() => showDownload(name), 600);
    if ('reg-msg' == true ); return document.getElementById('auth-card').style.display = 'none';
  }

  function handleLogin2() {
    const email = document.getElementById('log-email').value.trim().toLowerCase();
    const pass = document.getElementById('log-pass').value;
    if (!email || !pass) return setMsg('log-msg', '⚠️ Iltimos, barcha maydonlarni to\'ldiring.', false);
    const user = users[email];
    if (!user) return setMsg('log-msg', '⚠️ Bu email bilan hisob topilmadi.', false);
    if (user.pass !== pass) return setMsg('log-msg', '⚠️ Parol noto\'g\'ri.', false);
    setMsg('log-msg', '✅ Tizimga kirildi!', true);
    setTimeout(() => showDownload(user.name), 600);
  }

  function submitContact() {
    const name = document.getElementById('c-name').value.trim();
    const msg = document.getElementById('c-msg').value.trim();
    if (!name || !msg) { alert('Iltimos, barcha maydonlarni to\'ldiring.'); return; }
    document.getElementById('contact-success').style.display = 'block';
    document.getElementById('c-name').value = '';
    document.getElementById('c-msg').value = '';
  }
const hamburger = document.querySelector('.hamburger');

let isOpen = false;
let scrollY = 0;

hamburger.addEventListener('click', () => {
  if (!isOpen) {
    // OCHISH
    scrollY = window.scrollY;

    document.body.classList.add('no-scroll');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    isOpen = true;
  } else {
    // YOPISH
    document.body.classList.remove('no-scroll');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    window.scrollTo(0, scrollY);

    isOpen = false;
  }
});
/* --- FIREBASE AUTHENTICATION --- */

// Auth state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    const name = user.displayName || 'Foydalanuvchi';
    showDownload(name);
  }
});

// Helper function for button loading state
function setButtonLoading(btnId, loading) {
  const btn = document.querySelector(btnId);
  if (btn) {
    btn.disabled = loading;
    btn.style.opacity = loading ? '0.6' : '1';
    btn.style.cursor = loading ? 'not-allowed' : 'pointer';
  }
}
// Google Login
function handleGoogleLogin() {
  setButtonLoading('.google-btn', true);
  setMsg('reg-msg', '⏳ Google bilan kirishmoqda...', true);
  
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const name = user.displayName || 'Foydalanuvchi';
      showDownload(name);
      setMsg('reg-msg', '✅ Google bilan tizimga kirildi!', true);
    })
    .catch((error) => {
      console.error('Google login error:', error);
      let errorMsg = '⚠️ Google bilan kirishda xatolik yuz berdi.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = '⚠️ Kirish bekor qilindi.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMsg = '⚠️ So\'rov bekor qilindi.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMsg = '⚠️ Bu email boshqa usul bilan ro\'yxatdan o\'tgan.';
      }
      
      setMsg('reg-msg', errorMsg, false);
    })
    .finally(() => {
      setButtonLoading('.google-btn', false);
    });
}
function handleAppleLogin() {
  setButtonLoading('.apple-btn', true);
  setMsg('reg-msg', '⏳ Apple bilan kirishmoqda...', true);
  
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const name = user.displayName || 'Foydalanuvchi';
      showDownload(name);
      setMsg('reg-msg', '✅ Apple bilan tizimga kirildi!', true);
    })
    .catch((error) => {
      console.error('Apple login error:', error);
      let errorMsg = '⚠️ Apple bilan kirishda xatolik yuz berdi.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = '⚠️ Kirish bekor qilindi.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMsg = '⚠️ So\'rov bekor qilindi.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMsg = '⚠️ Bu email boshqa usul bilan ro\'yxatdan o\'tgan.';
      }
      
      setMsg('reg-msg', errorMsg, false);
    })
    .finally(() => {
      setButtonLoading('.apple-btn', false);
    });
}

// Logout function
function handleLogout() {
  signOut(auth)
    .then(() => {
      const ds = document.getElementById('download-section');
      ds.classList.remove('visible');
      
      const authCard = document.getElementById('auth-card');
      if (authCard) {
        authCard.style.display = 'block';
      }
      
      setMsg('reg-msg', '', true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch((error) => {
      console.error('Logout error:', error);
      alert('Tizimdan chiqishda xatolik yuz berdi.');
    });
}

// Professional APK download with progress
function handleDownload() {
  const downloadBtn = document.getElementById('download-btn');
  const downloadText = document.getElementById('download-text');
  const downloadProgress = document.getElementById('download-progress');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  const progressText = document.getElementById('progress-text');
  
  downloadBtn.disabled = true;
  downloadBtn.style.opacity = '0.7';
  downloadText.textContent = 'Yuklanmoqda...';
  downloadProgress.style.display = 'block';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 95) progress = 95;
    
    progressBar.style.width = progress + '%';
    progressPercent.textContent = Math.round(progress) + '%';
    
    if (progress >= 95) {
      clearInterval(interval);
      
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = './assets/download/app-release.apk';
        link.download = 'NotiPort.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';
        progressText.textContent = 'Yuklab olindi!';
        downloadText.textContent = 'Yuklab olindi ✓';
        
        setTimeout(() => {
          downloadBtn.disabled = false;
          downloadBtn.style.opacity = '1';
          downloadText.textContent = 'Yuklab olish';
          downloadProgress.style.display = 'none';
          progressBar.style.width = '0%';
          progressPercent.textContent = '0%';
          progressText.textContent = 'Yuklanmoqda...';
        }, 3000);
      }, 500);
    }
  }, 200);
}