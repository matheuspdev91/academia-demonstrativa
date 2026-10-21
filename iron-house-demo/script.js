(() => {
  /* ── JS Presence marker ── */
  document.documentElement.classList.remove('no-js');

  /* ── Header: mobile menu + scroll effect ── */
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');

  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  // Close menu on nav link click
  document.querySelectorAll('.site-header nav a').forEach(link =>
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
    })
  );

  // Header scroll effect — sticky background
  let lastScroll = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Reduced Motion Check ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Hero entrance animation ── */
  const heroElements = document.querySelectorAll('.hero-anim');
  const heroImageWrap = document.querySelector('.hero-image-wrap');

  if (prefersReducedMotion) {
    // Immediately show everything
    heroElements.forEach(el => el.classList.add('is-visible'));
    heroImageWrap?.classList.add('is-loaded');
    document.querySelectorAll('.reveal, .reveal-image').forEach(el => el.classList.add('is-visible'));
  } else {
    // Hero image zoom-in on load
    if (heroImageWrap) {
      const heroImg = heroImageWrap.querySelector('img');
      if (heroImg) {
        if (heroImg.complete) {
          requestAnimationFrame(() => heroImageWrap.classList.add('is-loaded'));
        } else {
          heroImg.addEventListener('load', () => heroImageWrap.classList.add('is-loaded'));
        }
      }
    }

    // Stagger hero content
    requestAnimationFrame(() => {
      heroElements.forEach(el => el.classList.add('is-visible'));
    });

    /* ── Scroll-based reveal — IntersectionObserver ── */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-image').forEach(element => {
      revealObserver.observe(element);
    });
  }

  /* ── Active nav state based on scroll position ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-header nav a');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => navObserver.observe(section));
  }
})();
