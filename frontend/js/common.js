/* ── AutomatIA Pro — Common JS ── */

// ── NAV & FOOTER INJECTION ──────────────────────────
(function () {
  const path = window.location.pathname;
  const BASE = '/AutomatIA';

  function isActive(href) {
    if (href === BASE + '/' || href === BASE + '/index.html') return path === BASE + '/' || path === BASE + '/index.html' || path === BASE;
    return path.includes(href.replace('.html', ''));
  }

  const links = [
    { href: BASE + '/services.html', label: 'Servicios' },
    { href: BASE + '/process.html', label: 'Proceso' },
    { href: BASE + '/results.html', label: 'Resultados' },
    { href: BASE + '/clients.html', label: 'Clientes' },
  ];

  const navHTML = `
    <nav id="main-nav">
      <div class="logo"><a href="${BASE}/"><span>Auto</span>matIA<span>.pro</span></a></div>
      <ul class="nav-links">
        ${links.map(l => `<li><a href="${l.href}" class="${isActive(l.href) ? 'active' : ''}">${l.label}</a></li>`).join('')}
        <li><a href="${BASE}/contact.html" class="nav-cta${isActive(BASE + '/contact.html') ? ' active' : ''}">Consulta gratis →</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Menú">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      ${links.map(l => `<a href="${l.href}" class="${isActive(l.href) ? 'active' : ''}">${l.label}</a>`).join('')}
      <a href="${BASE}/contact.html" class="nav-cta" style="text-align:center;margin-top:8px">Consulta gratis →</a>
    </div>`;

  const footerHTML = `
    <footer>
      <div class="footer-logo"><a href="${BASE}/"><span>Auto</span>matIA<span>.pro</span></a></div>
      <p>© ${new Date().getFullYear()} AutomatIA Pro · Automatización con IA para PYMEs</p>
      <div class="footer-links">
        <a href="${BASE}/privacy.html">Privacidad</a>
        <a href="${BASE}/legal.html">Aviso legal</a>
        <a href="${BASE}/contact.html">Contacto</a>
        <a href="${BASE}/admin/login.html" style="opacity:.4">Admin</a>
      </div>
    </footer>`;

  document.getElementById('nav-placeholder').innerHTML = navHTML;
  document.getElementById('footer-placeholder').innerHTML = footerHTML;

  // Nav scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 50);
  });

  // Hamburger
  document.getElementById('hamburger').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('mobile-menu').classList.toggle('open');
  });
})();

// ── PARTICLES CANVAS ────────────────────────────────
(function () {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 1.4 + 0.3;
      this.vx = (Math.random() - .5) * 0.25; this.vy = (Math.random() - .5) * 0.25;
      this.alpha = Math.random() * 0.45 + 0.1;
      this.color = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4';
    }
    update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset(); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.globalAlpha = this.alpha; ctx.fill(); }
  }

  for (let i = 0; i < 100; i++) particles.push(new P());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = '#7c3aed'; ctx.globalAlpha = (1 - d / 90) * 0.1; ctx.lineWidth = .5; ctx.stroke(); }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── SCROLL REVEAL ────────────────────────────────────
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// ── COUNTER ANIMATION ────────────────────────────────
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1600, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();

// ── TOAST ────────────────────────────────────────────
window.showToast = function (msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; toast.style.transition = '.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
};
