// ------------ Utilities -------------
const select = (s) => document.querySelector(s);
const selectAll = (s) => Array.from(document.querySelectorAll(s));

/* ---------- Modal (localStorage) ---------- */
const nameModal = select('#nameModal');
const modalName = select('#modalName');
const saveNameBtn = select('#saveName');
const skipBtn = select('#skipName');
const modalErr = select('#modalErr');
const greeting = select('#greeting');

function setGreeting(name){
  if (!greeting) return;
  greeting.textContent = `Hi ${name}, Welcome`;
  greeting.style.color = 'var(--accent)';
}

(function initIdentity(){
  const saved = localStorage.getItem('faiz_user');
  if (saved && saved.length >= 3) {
    setGreeting(saved);
    if (nameModal) nameModal.style.display = 'none';
  } else {
    if (nameModal) {
      nameModal.style.display = 'flex';
      if (modalName) modalName.focus();
    }
  }
})();

function identify(){
  const v = modalName.value.trim();
  if (v.length < 3) { 
    modalErr.style.display = 'block'; 
    return; 
  }

  modalErr.style.display = 'none';
  localStorage.setItem('faiz_user', v);
  setGreeting(v);

  const card = document.querySelector('.modal-card');
  if (card) {
    card.style.transform = 'translateY(12px)';
    card.style.opacity = '0';
  }

  setTimeout(()=> {
    if (nameModal) nameModal.style.display = 'none';
  }, 260);
}

if (saveNameBtn) saveNameBtn.addEventListener('click', identify);
if (modalName) modalName.addEventListener('keydown', (e)=> {
  if (e.key === 'Enter') identify();
});
if (skipBtn) skipBtn.addEventListener('click', ()=> { 
  localStorage.removeItem('faiz_user'); 
  setGreeting('Guest'); 
  nameModal.style.display = 'none'; 
});

/* ---------- Auto-scroll nav buttons ---------- */
selectAll('.nav a').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({behavior:'smooth', block: 'start'});
    }
  });
});

const toMessageBtn = select('#toMessage');
if (toMessageBtn){
  toMessageBtn.addEventListener('click', ()=> {
    const msg = document.querySelector('#message');
    if (msg) msg.scrollIntoView({behavior:'smooth'});
  });
}

/* ---------- Reveal on scroll ---------- */
const reveals = selectAll('.reveal');

function runReveal(){
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if(top < window.innerHeight - 90) el.classList.add('active');
  });
}
window.addEventListener('scroll', runReveal);
window.addEventListener('load', runReveal);

/* ---------- System time update ---------- */
const systemTimeEl = select('#systemTime');
setInterval(()=> {
  const now = new Date();
  if(systemTimeEl){
    systemTimeEl.textContent = 'SYSTEM TIME: ' + now.toLocaleString();
  }
}, 1000);

/* ---------- Message form logic ---------- */
const sendBtn = select('#sendBtn');
const clearBtn = select('#clearBtn');
const logArea = select('#logArea');

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"'`=\/]/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',
    "'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'
  })[s]);
}

function appendLog(lines){
  if (!logArea) return;
  const p = document.createElement('p');
  p.innerHTML = lines;
  logArea.prepend(p);
}

function transmit(){
  const nameInput = select('#name');
  const birthInput = select('#birth');
  const messageInput = select('#messageInput');

  const name = escapeHtml(nameInput?.value.trim());
  const birth = birthInput?.value;
  const genderEl = document.querySelector('input[name="gender"]:checked');
  const gender = genderEl ? genderEl.value : '-';
  const message = escapeHtml(messageInput?.value.trim());

  const statusLed = select('#statusLed');

  if(!name || !birth || !message){
    if (statusLed){
      statusLed.textContent = '● ERROR';
      statusLed.classList.remove('online');
      statusLed.style.color = '#FF6B6B';
      setTimeout(()=>{ 
        statusLed.textContent = '● OFFLINE'; 
        statusLed.style.color=''; 
      }, 1000);
    }
    alert('Lengkapi semua field terlebih dahulu.');
    return;
  }

  if (statusLed){
    statusLed.textContent = '● RECEIVING';
    statusLed.style.color = 'var(--accent)';
  }

  appendLog(`<strong>RECEIVING:</strong> ${new Date().toLocaleString()}`);
  appendLog(`<strong>NAME:</strong> ${name}`);
  appendLog(`<strong>BIRTH:</strong> ${birth}`);
  appendLog(`<strong>GENDER:</strong> ${gender}`);
  appendLog(`<strong>MESSAGE:</strong> ${message}`);

  const rNama = select('#rNama');
  const rTanggal = select('#rTanggal');
  const rGender = select('#rGender');
  const rPesan = select('#rPesan');
  const timeEl = select('#time');

  if (rNama) rNama.textContent = `Name: ${name}`;
  if (rTanggal) rTanggal.textContent = `Birth: ${birth}`;
  if (rGender) rGender.textContent = `Gender: ${gender}`;
  if (rPesan) rPesan.textContent = `Message: ${message}`;
  if (timeEl) timeEl.textContent = 'System Time: ' + new Date().toLocaleString();

  setTimeout(()=> {
    if (statusLed){
      statusLed.textContent = '● ONLINE';
      statusLed.classList.add('online');
    }
  }, 700);
}

function clearForm(){
  const nameInput = select('#name');
  const birthInput = select('#birth');
  const messageInput = select('#messageInput');

  if (nameInput) nameInput.value = '';
  if (birthInput) birthInput.value = '';
  if (messageInput) messageInput.value = '';

  const rNama = select('#rNama');
  const rTanggal = select('#rTanggal');
  const rGender = select('#rGender');
  const rPesan = select('#rPesan');

  if (rNama) rNama.textContent = '';
  if (rTanggal) rTanggal.textContent = '';
  if (rGender) rGender.textContent = '';
  if (rPesan) rPesan.textContent = '';

  appendLog('<em>Terminal cleared</em>');
}

if (sendBtn) sendBtn.addEventListener('click', transmit);
if (clearBtn) clearBtn.addEventListener('click', clearForm);

/* ---------- Enter to send ---------- */
const msgInput = select('#messageInput');
if (msgInput){
  msgInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      transmit();
    }
  });
}
