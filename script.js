/* =============================================
   CHARLES & FLAMES — script.js
   Premium BBQ Website Interactions
   ============================================= */

'use strict';

/* ===== AOS INIT ===== */
AOS.init({
  duration: 900,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
});

/* ===== SCROLL PROGRESS BAR ===== */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
}, { passive: true });

/* ===== STICKY NAV ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const drawer    = document.getElementById('mobile-drawer');

hamburger.addEventListener('click', () => {
  const isOpen = drawer && drawer.classList.toggle('open');
  hamburger.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    if (drawer) drawer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link && scrollY >= top && scrollY < top + height) {
      navLinkEls.forEach(l => l.style.color = '');
      link.style.color = 'var(--gold)';
    }
  });
}, { passive: true });

/* ===== PARALLAX HERO ===== */
const parallaxBg = document.getElementById('parallax-bg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight * 1.5) {
    const offset = window.scrollY * 0.4;
    parallaxBg.style.transform = `translateY(${offset}px)`;
  }
}, { passive: true });

/* ===== FIRE PARTICLE CANVAS ===== */
(function initFireCanvas() {
  const canvas  = document.getElementById('fire-canvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = canvas.height + 20;
      this.size = Math.random() * 4 + 1;
      this.speedY = -(Math.random() * 1.5 + 0.5);
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.life   = 1;
      this.decay  = Math.random() * 0.008 + 0.003;

      // Color: ember orange → gold → red
      const colors = [
        `rgba(255,140,0,`,
        `rgba(201,147,58,`,
        `rgba(255,69,0,`,
        `rgba(255,200,50,`,
        `rgba(180,30,0,`,
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x    += this.speedX;
      this.y    += this.speedY;
      this.life -= this.decay;
      this.speedX += (Math.random() - 0.5) * 0.04;
      this.size  *= 0.998;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      gradient.addColorStop(0,   this.color + '0.9)');
      gradient.addColorStop(0.5, this.color + '0.4)');
      gradient.addColorStop(1,   this.color + '0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Spawn particles
  for (let i = 0; i < 120; i++) {
    const p = new Particle();
    p.y    = Math.random() * canvas.height;
    p.life = Math.random();
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add new particles
    if (particles.length < 180 && Math.random() > 0.3) {
      particles.push(new Particle());
    }

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });

    animId = requestAnimationFrame(animate);
  }

  animate();

  // Pause when hero not visible
  const heroObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) {
      cancelAnimationFrame(animId);
    } else {
      animate();
    }
  }, { threshold: 0.1 });

  const hero = document.getElementById('home');
  if (hero) heroObserver.observe(hero);
})();

/* ===== 3D CARD TILT ===== */
(function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) / (rect.width  / 2);
      const deltaY  = (e.clientY - centerY) / (rect.height / 2);

      card.style.transform = `
        perspective(800px)
        rotateX(${-deltaY * 6}deg)
        rotateY(${deltaX * 6}deg)
        translateZ(12px)
        translateY(-8px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ===== GSAP SCROLL ANIMATIONS ===== */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Hero title letter stagger
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.from('.fire-text', {
      duration: 1.4,
      opacity: 0,
      y: 60,
      stagger: 0.15,
      ease: 'power4.out',
      delay: 0.5,
    });
    gsap.from('.hero-tagline', {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: 'power3.out',
      delay: 1.2,
    });
    gsap.from('.hero-btns .btn', {
      duration: 0.8,
      opacity: 0,
      y: 20,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 1.5,
    });
  }

  // Menu cards
  gsap.utils.toArray('.menu-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0,
      y: 50,
      duration: 0.7,
      delay: (i % 4) * 0.1,
      ease: 'power3.out',
    });
  });

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
    });
  });

  // Strip items
  gsap.utils.toArray('.strip-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 90%' },
      opacity: 0,
      x: -30,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
    });
  });

  // Order cards
  gsap.utils.toArray('.order-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'back.out(1.4)',
    });
  });

  // Gallery items
  gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 90%' },
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      delay: i * 0.08,
      ease: 'power2.out',
    });
  });
}

/* ===== LAZY LOAD IMAGES ===== */
if ('IntersectionObserver' in window) {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImgs.forEach(img => imgObserver.observe(img));
}

/* ===== BUTTON GLOW RIPPLE ===== */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      top: ${e.clientY - rect.top  - size/2}px;
      left: ${e.clientX - rect.left - size/2}px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ===== OPENING HOURS BADGE ===== */
(function checkHours() {
  const badge = document.querySelector('.open-badge');
  if (!badge) return;
  const now  = new Date();
  const hour = now.getHours();
  // Open 17:00 (5 PM) to 04:00 (4 AM) — crosses midnight
  const isOpen = hour >= 17 || hour < 4;
  badge.innerHTML = isOpen
    ? '<span class="dot"></span> We\'re Open Now'
    : '<span class="dot" style="background:#ef5350;box-shadow:0 0 6px #ef5350;animation:blink 1.5s ease-in-out infinite;"></span> Currently Closed';
  if (!isOpen) badge.style.color = '#ef5350';
})();

/* ===== HERO LOGO HOVER TILT ===== */
const heroLogo = document.querySelector('.hero-logo');
if (heroLogo) {
  heroLogo.addEventListener('mousemove', e => {
    const rect = heroLogo.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width/2) / (rect.width/2);
    const dy = (e.clientY - rect.top - rect.height/2) / (rect.height/2);
    heroLogo.style.transform = `perspective(300px) rotateX(${-dy*15}deg) rotateY(${dx*15}deg) scale(1.05)`;
  });
  heroLogo.addEventListener('mouseleave', () => {
    heroLogo.style.transform = '';
  });
}

/* ===== PAGE LOAD FADE IN ===== */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

/* ===== CLOSE MENU ON OUTSIDE CLICK ===== */
document.addEventListener('click', e => {
  if (drawer && !drawer.contains(e.target) && !hamburger.contains(e.target) && drawer.classList.contains('open')) {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===== FEEDBACK FORM ===== */
(function initFeedbackForm() {
  const submitBtn   = document.getElementById('fb-submit');
  const successMsg  = document.getElementById('feedback-success');
  const dropdown    = document.getElementById('fb-source-dropdown');
  const selected    = document.getElementById('fb-source-selected');
  const list        = document.getElementById('fb-source-list');
  const hiddenInput = document.getElementById('fb-source');
  if (!submitBtn) return;

  /* ── Dropdown: toggle open/close ── */
  selected.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  /* ── Dropdown: pick an item ── */
  list.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const value = item.dataset.value;
      const icon  = item.querySelector('i').outerHTML;
      const text  = item.textContent.trim();

      hiddenInput.value = value;
      selected.innerHTML = `
        <span class="dropdown-selected-content">${icon} ${text}</span>
        <i class="fas fa-chevron-down dropdown-arrow"></i>
      `;
      list.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      dropdown.classList.remove('open');
      dropdown.classList.remove('error');
    });
  });

  /* ── Close dropdown on outside click ── */
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
  });

  /* ── Submit via Web3Forms fetch ── */
  submitBtn.addEventListener('click', async () => {
    const nameEl     = document.getElementById('fb-name');
    const emailEl    = document.getElementById('fb-email');
    const feedbackEl = document.getElementById('fb-feedback');
    const replytoEl  = document.getElementById('fb-replyto');

    const name     = nameEl.value.trim();
    const email    = emailEl.value.trim();
    const feedback = feedbackEl.value.trim();
    const source   = hiddenInput.value;

    /* Validate */
    let valid = true;
    [[nameEl, name], [emailEl, email], [feedbackEl, feedback]].forEach(([el, val]) => {
      if (!val) {
        valid = false;
        el.style.borderColor = '#ef5350';
        el.addEventListener('input', () => el.style.borderColor = '', { once: true });
      }
    });
    if (!source) {
      valid = false;
      dropdown.classList.add('error');
    }
    if (!valid) return;

    /* Mirror email into replyto so you can reply directly from Gmail */
    replytoEl.value = email;

    /* Lock button */
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    /* Build payload */
    const payload = {
      access_key : '2aa8e259-163c-4525-b0a8-2c83b6f43e2a',
      subject    : 'New Feedback – Charles & Flames',
      from_name  : 'Charles & Flames Feedback',
      replyto    : email,
      name       : name,
      email      : email,
      message    : feedback,
      source     : source,
    };

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body    : JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        /* ── Trigger the existing success state ── */
        successMsg.style.display = 'block';
        submitBtn.style.display  = 'none';

        /* Reset fields */
        nameEl.value     = '';
        emailEl.value    = '';
        feedbackEl.value = '';
        hiddenInput.value = '';
        selected.innerHTML = `<span class="dropdown-placeholder">Select an option</span><i class="fas fa-chevron-down dropdown-arrow"></i>`;
      } else {
        /* Web3Forms returned an error — restore button, log details */
        console.error('Web3Forms error:', data);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Feedback';
      }
    } catch (err) {
      /* Network / fetch error — restore button, log details */
      console.error('Submission failed:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Feedback';
    }
  });
})();
