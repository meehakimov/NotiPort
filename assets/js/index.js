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
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLDmOwRHWLNvp2QOrBaRg1Deiwk33sd30",
  authDomain: "notiport-7c96a.firebaseapp.com",
  projectId: "notiport-7c96a",
  storageBucket: "notiport-7c96a.firebasestorage.app",
  messagingSenderId: "658354889549",
  appId: "1:658354889549:web:4147f82bf6dfa996570d04",
  measurementId: "G-DT7XFB510W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);