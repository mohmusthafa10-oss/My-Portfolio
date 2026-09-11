/* ==========================================================================
   EDITORIAL SCROLL MOTION — JavaScript Controller
   Works alongside main.js without modifying it.
   All existing functionality preserved.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Utility: reduced motion check --- */
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth <= 1024 && window.innerWidth > 768;

  /* =========================================================================
     1. PAGE LOAD SEQUENCE
     ========================================================================= */

  function runPageLoadSequence() {
    if (prefersReducedMotion()) return;

    document.body.classList.add('js-loaded');

    const sequence = [
      { el: '.brand-logo',        delay: 80  },
      { el: '.nav-pill-container',delay: 160 },
      { el: '.nav-actions',       delay: 220 },
      { el: '.hero-badge',        delay: 320 },
      { el: '.hero-title',        delay: 440 },
      { el: '.hero-description',  delay: 580 },
      { el: '.hero-cta-group',    delay: 680 },
      { el: '.hero-showcase',     delay: 780 },
    ];

    sequence.forEach(({ el, delay }) => {
      const node = document.querySelector(el);
      if (!node) return;
      setTimeout(() => node.classList.add('anim-in'), delay);
    });
  }

  /* =========================================================================
     2. SCROLL PROGRESS BAR
     ========================================================================= */

  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          bar.style.width = pct.toFixed(2) + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================================================
     3. SECTION REVEAL — IntersectionObserver
     ========================================================================= */

  function initSectionReveals() {
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-revealed');
          sectionObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.section-block').forEach(s => sectionObs.observe(s));

    /* About grid */
    const aboutObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('about-revealed');
          aboutObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    const aboutGrid = document.querySelector('.about-grid');
    if (aboutGrid) aboutObs.observe(aboutGrid);

    /* Skills column */
    const skillsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('skills-revealed');
          // Stagger pills
          const pills = entry.target.querySelectorAll('.skill-pill');
          pills.forEach((pill, i) => {
            setTimeout(() => pill.classList.add('anim-in'), i * 55);
          });
          skillsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.skills-column').forEach(col => skillsObs.observe(col));

    /* Timeline */
    const timelineObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.closest('.skills-column')?.classList.add('timeline-revealed');
          timelineObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-list').forEach(tl => timelineObs.observe(tl));

    /* Contact section */
    const contactObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('contact-revealed');
          contactObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer) contactObs.observe(contactContainer);

    /* Marquee dividers */
    const marqueeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-revealed');
          marqueeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.section-marquee-divider').forEach(d => marqueeObs.observe(d));
  }

  /* =========================================================================
     4. PROJECT CARD REVEAL (works with dynamically rendered cards)
     ========================================================================= */

  function observeProjectCards() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const cardObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-revealed');
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    const attachObs = () => {
      grid.querySelectorAll('.project-card-item').forEach((card, i) => {
        card.style.transitionDelay = (i * 120) + 'ms';
        cardObs.observe(card);
      });
    };

    // Observe DOM mutations in case JS renders cards after this script runs
    const mutObs = new MutationObserver(attachObs);
    mutObs.observe(grid, { childList: true });
    attachObs(); // also run immediately
  }

  /* =========================================================================
     5. PROJECT FILTER ANIMATION (hooks into existing filter buttons)
     ========================================================================= */

  function initFilterAnimation() {
    const grid = document.getElementById('projects-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!grid || !filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (prefersReducedMotion()) return;

        // Exit current cards
        const cards = grid.querySelectorAll('.project-card-item');
        cards.forEach(card => {
          card.classList.add('card-exit');
          card.classList.remove('card-revealed');
        });
      });
    });

    // Re-observe after cards are re-rendered
    // main.js renders new cards after click — we watch via MutationObserver
    const mutObs = new MutationObserver(() => {
      const newCards = grid.querySelectorAll('.project-card-item:not(.card-revealed)');
      newCards.forEach((card, i) => {
        card.classList.remove('card-exit');
        card.style.transitionDelay = (i * 120) + 'ms';
        // slight delay to let browser paint the reset state
        requestAnimationFrame(() => {
          requestAnimationFrame(() => card.classList.add('card-revealed'));
        });
      });
    });
    mutObs.observe(grid, { childList: true });
  }

  /* =========================================================================
     6. DECORATIVE MARQUEE TYPOGRAPHY — Scroll-linked horizontal movement
     ========================================================================= */

  const marqueeData = [
    { section: '#about',   text: 'ABOUT ME',       dir: -1 },
    { section: '#projects',text: 'SELECTED WORKS',  dir:  1 },
    { section: '#skills',  text: 'CAPABILITIES',    dir: -1 },
    { section: '#contact', text: 'CONTACT',          dir:  1 },
  ];

  function buildMarquees() {
    marqueeData.forEach(({ section, text, dir }) => {
      const sectionEl = document.querySelector(section);
      if (!sectionEl) return;

      const divider = document.createElement('div');
      divider.className = 'section-marquee-divider';
      divider.setAttribute('aria-hidden', 'true');

      const line = document.createElement('div');
      line.className = 'marquee-line';
      divider.appendChild(line);

      const wrap = document.createElement('div');
      wrap.className = 'editorial-marquee-wrap';

      const inner = document.createElement('div');
      inner.className = 'editorial-marquee-inner';
      inner.dataset.dir = dir;

      // Repeat text enough times to fill + overflow
      const repeatCount = 8;
      for (let i = 0; i < repeatCount; i++) {
        const span = document.createElement('span');
        span.className = 'editorial-marquee-text';
        span.textContent = text;
        inner.appendChild(span);
      }

      wrap.appendChild(inner);
      divider.appendChild(wrap);

      // Insert before the section
      sectionEl.parentNode.insertBefore(divider, sectionEl);
    });
  }

  function initMarqueeScroll() {
    if (prefersReducedMotion()) return;

    const inners = document.querySelectorAll('.editorial-marquee-inner');
    if (!inners.length) return;

    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      const reduce = isMobile() ? 0.15 : isTablet() ? 0.3 : 0.55;

      inners.forEach(inner => {
        const dir = parseFloat(inner.dataset.dir) || -1;
        const offset = scrollY * reduce * dir;
        inner.style.transform = `translate3d(${offset}px, 0, 0)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* =========================================================================
     7. HERO PARALLAX — Scroll-linked, subtle
     ========================================================================= */

  function initHeroParallax() {
    if (prefersReducedMotion() || isMobile()) return;

    const heroTitle = document.querySelector('.hero-title');
    const heroDesc  = document.querySelector('.hero-description');
    const heroCard  = document.querySelector('.hero-showcase');
    const heroSection = document.querySelector('.hero-section');

    if (!heroTitle || !heroCard || !heroSection) return;

    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      const heroH   = heroSection.offsetHeight;

      if (scrollY > heroH * 1.5) { ticking = false; return; }

      const factor = isTablet() ? 0.4 : 1;

      // Title drifts up slightly
      const titleY = scrollY * 0.12 * factor;
      const titleX = scrollY * 0.025 * factor;
      heroTitle.style.transform = `translate3d(${titleX}px, ${-titleY}px, 0)`;

      // Showcase moves at different speed
      const cardY = scrollY * 0.07 * factor;
      heroCard.style.transform = `translate3d(0, ${-cardY}px, 0)`;

      // Description fades as it scrolls away
      if (heroDesc) {
        const fadeStart = heroH * 0.3;
        const fadeEnd   = heroH * 0.8;
        const opacity   = scrollY < fadeStart
          ? 1
          : scrollY > fadeEnd
            ? 0.2
            : 1 - ((scrollY - fadeStart) / (fadeEnd - fadeStart)) * 0.8;
        heroDesc.style.opacity = opacity;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================================================
     8. MAGNETIC BUTTONS — Desktop only
     ========================================================================= */

  function initMagneticButtons() {
    if (prefersReducedMotion() || isMobile()) return;

    const MAX_MOVE = 7; // px

    const magnetize = (btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        btn.style.transform = `translate3d(${dx * MAX_MOVE}px, ${dy * MAX_MOVE}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    };

    document.querySelectorAll('.btn-primary-lg, .btn-secondary-lg').forEach(magnetize);

    // Submit button — apply after page load (it's static)
    const submit = document.querySelector('.btn-submit-form');
    if (submit) magnetize(submit);
  }

  /* =========================================================================
     9. NAVIGATION SCROLL COMPACT
     ========================================================================= */

  function initNavCompact() {
    const nav = document.querySelector('.header-nav');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 60) {
            nav.classList.add('nav-compact');
          } else {
            nav.classList.remove('nav-compact');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================================================
     10. BACK TO TOP BUTTON — Smooth entrance already handled by CSS,
         this just ensures smooth JS transition as well
     ========================================================================= */

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================================
     INIT
     ========================================================================= */

  function init() {
    runPageLoadSequence();
    initScrollProgress();
    buildMarquees();
    initSectionReveals();
    observeProjectCards();
    initFilterAnimation();
    initMarqueeScroll();
    initHeroParallax();
    initMagneticButtons();
    initNavCompact();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
