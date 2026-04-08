/* ── AutomatIA Pro — Common JS ── */

// ── NAV & FOOTER INJECTION ──────────────────────────
(function () {
  const path = window.location.pathname;
  const BASE = '';

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
        <!-- <a href="${BASE}/admin/login.html"<!-- Admin deshabilitado en versión estática --> style="opacity:.4">Admin</a>
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

// ══════════════════════════════════════════════════════
//  PREMIUM UX ENHANCEMENTS
// ══════════════════════════════════════════════════════

// ── PRELOADER ────────────────────────────────────────
(function () {
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.innerHTML = `
    <div class="preloader-icon">
      <svg viewBox="0 0 64 64">
        <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient></defs>
        <rect x="3" y="3" width="58" height="58" rx="15" class="rect-draw"/>
      </svg>
      <div class="preloader-letter">A</div>
    </div>
    <div class="preloader-bar"><div class="preloader-bar-fill"></div></div>`;
  document.body.prepend(preloader);
  const ready = new Promise(r => {
    if (document.readyState === 'complete') r();
    else window.addEventListener('load', r);
  });
  const minTime = new Promise(r => setTimeout(r, 1600));
  Promise.all([ready, minTime]).then(() => {
    preloader.classList.add('done');
    document.body.classList.add('page-transition-in');
    setTimeout(() => preloader.remove(), 700);
  });
})();

// ── CUSTOM CURSOR RING ───────────────────────────────
(function () {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 769) return;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function lerp(a, b, n) { return a + n * (b - a); }

  (function animate() {
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animate);
  })();

  const interactive = 'a, button, input, textarea, select, .svc-card, .pain-card, .res-card, .btn-primary, .btn-secondary, .nav-cta';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactive)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactive)) ring.classList.remove('hover');
  });
  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup', () => ring.classList.remove('click'));

  // Magnetic pull on CTA buttons
  document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.closest('nav') || btn.closest('.sticky-cta')) return;
    btn.addEventListener('mouseenter', () => { btn.style.transition = 'box-shadow .2s'; });
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = '';
      btn.style.transform = '';
    });
  });
})();

// ── SCROLL PROGRESS BAR ─────────────────────────────
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0';
  }, { passive: true });
})();

// ── HERO TEXT SPLIT REVEAL ───────────────────────────
(function () {
  const hero = document.querySelector('#hero h1');
  if (!hero) return;

  const html = hero.innerHTML;
  let charIndex = 0;
  const newHTML = html.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, text) => {
    if (tag) return tag;
    return text.split('').map(char => {
      if (char === '\n' || char === '\r') return '';
      if (char === ' ') return '<span class="char-space"> </span>';
      const delay = 120 + charIndex * 28;
      charIndex++;
      return `<span class="char-reveal" style="animation-delay:${delay}ms">${char}</span>`;
    }).join('');
  });

  hero.innerHTML = newHTML;
  hero.style.animation = 'none';
  hero.style.opacity = '1';
})();

// ── 3D TILT ON CARDS ─────────────────────────────────
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.svc-card, .pain-card, .res-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'border-color .3s, box-shadow .3s';
    });
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .5s ease, border-color .3s, box-shadow .3s';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

// ── STICKY CTA BAR ───────────────────────────────────
(function () {
  const BASE = '';
  const hero = document.querySelector('#hero, .page-hero');
  if (!hero) return;

  const bar = document.createElement('div');
  bar.className = 'sticky-cta';
  bar.innerHTML = `
    <div class="sticky-cta-text"><strong>¿Listo para automatizar?</strong> &nbsp;Consulta gratuita de 60 min</div>
    <a href="${BASE}/contact.html" class="btn-primary btn-sm">Agenda tu consulta →</a>`;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const footer = document.querySelector('footer');
    const atFooter = footer && footer.getBoundingClientRect().top < window.innerHeight + 50;
    bar.classList.toggle('visible', heroBottom < -100 && !atFooter);
  }, { passive: true });
})();

// ── SMOOTH PAGE TRANSITIONS ──────────────────────────
(function () {
  const BASE = '';
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.target === '_blank') return;
    if (!href.startsWith(BASE) && !href.startsWith('/')) return;

    e.preventDefault();
    document.body.classList.add('page-transition-out');
    setTimeout(() => { window.location.href = href; }, 280);
  });
})();

// ── CONSOLE BRANDING ─────────────────────────────────
(function () {
  console.log(
    '%c AutomatIA Pro ',
    'background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; font-size: 20px; font-weight: 900; padding: 12px 24px; border-radius: 8px; margin: 10px 0;'
  );
  console.log(
    '%c🚀 ¿Te interesa la automatización con IA? → automatia.pro/contact',
    'color: #a855f7; font-size: 13px; font-weight: 600;'
  );
})();

// ══════════════════════════════════════════════════════
//  UX ESSENTIALS — Phase 2
// ══════════════════════════════════════════════════════

// ── COOKIE CONSENT BANNER ────────────────────────────
(function () {
  if (localStorage.getItem('cookie-consent')) return;

  const BASE = '';
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>Usamos cookies propias para mejorar tu experiencia. Sin rastreo de terceros.
      <a href="${BASE}/privacy.html">Política de privacidad</a>
    </p>
    <div class="cookie-btns">
      <button class="cookie-btn cookie-reject">Rechazar</button>
      <button class="cookie-btn cookie-accept">Aceptar</button>
    </div>`;
  document.body.appendChild(banner);
  document.body.classList.add('has-cookie');
  requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('visible')));

  banner.querySelector('.cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    close();
  });
  banner.querySelector('.cookie-reject').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'rejected');
    close();
  });
  function close() {
    banner.classList.remove('visible');
    document.body.classList.remove('has-cookie');
    setTimeout(() => banner.remove(), 500);
  }
})();

// ── BACK TO TOP BUTTON ──────────────────────────────
(function () {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── WHATSAPP FLOATING BUTTON ─────────────────────────
(function () {
  const phone = '34600000000'; // Change to real number
  const msg = encodeURIComponent('Hola, me interesa la automatización con IA para mi empresa.');
  const btn = document.createElement('a');
  btn.className = 'whatsapp-btn';
  btn.href = `https://wa.me/${phone}?text=${msg}`;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Contactar por WhatsApp');
  btn.innerHTML = `
    <div class="whatsapp-pulse"></div>
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  document.body.appendChild(btn);

  setTimeout(() => btn.classList.add('visible'), 2500);
})();

// ── MOBILE MENU BODY LOCK ────────────────────────────
(function () {
  const ham = document.getElementById('hamburger');
  if (!ham) return;
  const origClick = ham.onclick;
  ham.addEventListener('click', () => {
    setTimeout(() => {
      const isOpen = document.getElementById('mobile-menu').classList.contains('open');
      document.body.classList.toggle('menu-open', isOpen);
    }, 10);
  });
})();

// ── FORM VALIDATION HELPER ──────────────────────────
window.validateField = function (input, rules) {
  const group = input.closest('.form-group');
  if (!group) return true;

  let errorEl = group.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    group.appendChild(errorEl);
  }

  const val = input.value.trim();
  for (const rule of rules) {
    if (rule.required && !val) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      errorEl.textContent = rule.message || 'Este campo es obligatorio';
      return false;
    }
    if (rule.pattern && val && !rule.pattern.test(val)) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      errorEl.textContent = rule.message || 'Formato no válido';
      return false;
    }
    if (rule.minLength && val && val.length < rule.minLength) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      errorEl.textContent = rule.message || `Mínimo ${rule.minLength} caracteres`;
      return false;
    }
  }

  group.classList.remove('has-error');
  if (val) group.classList.add('has-success');
  else group.classList.remove('has-success');
  return true;
};

// ── REAL-TIME FIELD VALIDATION (on blur) ─────────────
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const rules = {
    name:  [{ required: true, message: 'El nombre es obligatorio' }, { minLength: 2, message: 'Mínimo 2 caracteres' }],
    email: [{ required: true, message: 'El email es obligatorio' }, { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email no válido (ej: tu@empresa.com)' }],
    phone: [{ pattern: /^[+\d\s()-]{6,20}$/, message: 'Formato de teléfono no válido' }],
  };

  Object.entries(rules).forEach(([name, fieldRules]) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;
    input.addEventListener('blur', () => validateField(input, fieldRules));
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group && group.classList.contains('has-error')) {
        validateField(input, fieldRules);
      }
    });
  });
})();
