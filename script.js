/* =========================================================
   ABHISHEK SINGH — PORTFOLIO SCRIPT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    const scrolled = window.scrollY > 30;
    header.classList.toggle('is-scrolled', scrolled);
    if (backToTop) backToTop.style.opacity = window.scrollY > 500 ? '1' : '0.4';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile nav ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  const closeMobileNav = () => {
    mobileNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ---------- Grid overlay toggle (signature element) ---------- */
  const gridToggle = document.getElementById('gridToggle');
  const blueprint = document.getElementById('blueprint');
  if (gridToggle && blueprint) {
    gridToggle.addEventListener('click', () => {
      const active = blueprint.classList.toggle('is-active');
      gridToggle.setAttribute('aria-pressed', String(active));
    });
  }

  /* ---------- Custom coordinate cursor (desktop, hero only) ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const coords = document.getElementById('coords');
  const hero = document.querySelector('.hero');

  if (!reducedMotion && cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });
  }

  if (coords && hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = Math.max(0, Math.round(e.clientX - rect.left));
      const y = Math.max(0, Math.round(e.clientY - rect.top));
      coords.textContent = `X ${String(x).padStart(3, '0')} · Y ${String(y).padStart(3, '0')}`;
    }, { passive: true });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Work gallery: filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---------- Work gallery: project modal ---------- */
  const modal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalArt = document.getElementById('modalArt');
  const modalTitle = document.getElementById('modalTitle');
  const modalRole = document.getElementById('modalRole');
  const modalDesc = document.getElementById('modalDesc');
  let lastFocused = null;

  const openModal = (card) => {
    const artClass = Array.from(card.querySelector('.project-card__art').classList)
      .find(c => c.startsWith('art-'));
    modalArt.className = 'modal__art ' + artClass;
    modalTitle.textContent = card.dataset.title || '';
    modalRole.textContent = card.dataset.role || '';
    modalDesc.textContent = card.dataset.desc || '';

    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');

  if (track && dotsWrap) {
    const slides = Array.from(track.children);
    let current = 0;
    let autoplayId = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

    function startAutoplay() {
      if (reducedMotion) return;
      autoplayId = setInterval(next, 6000);
    }
    function restartAutoplay() {
      clearInterval(autoplayId);
      startAutoplay();
    }

    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(autoplayId));
      carousel.addEventListener('mouseleave', startAutoplay);
    }
    startAutoplay();
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'name', errId: 'err-name', check: v => v.trim().length > 1, msg: 'Please enter your name.' },
        { id: 'email', errId: 'err-email', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email.' },
        { id: 'message', errId: 'err-message', check: v => v.trim().length > 9, msg: 'Message should be at least 10 characters.' },
      ];

      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const errEl = document.getElementById(f.errId);
        const row = input.closest('.form-row');
        const ok = f.check(input.value);
        row.classList.toggle('has-error', !ok);
        errEl.textContent = ok ? '' : f.msg;
        if (!ok) valid = false;
      });

      if (!valid) {
        formStatus.textContent = '';
        return;
      }

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const project = document.getElementById('project').value;
      const message = document.getElementById('message').value.trim();

      const subject = encodeURIComponent(`New project inquiry — ${project}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nProject type: ${project}\n\n${message}`
      );

      formStatus.textContent = 'Opening your email app to send the message…';
      window.location.href = `mailto:abhehackerman@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        formStatus.textContent = 'Thanks! Your message is ready to send from your email app.';
        form.reset();
      }, 600);
    });

    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        el.closest('.form-row').classList.remove('has-error');
      });
    });
  }

});
