/**
 * Muhammed Musthafa K C - Motion & Accessibility Controller
 * Respects prefers-reduced-motion, fine-pointer requirements, and performance best practices.
 */

(function () {
  'use strict';

  let reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  let reducedMotion = reducedMotionQuery.matches;
  let finePointer = finePointerQuery.matches;

  function updateReducedMotion(e) {
    reducedMotion = e ? e.matches : reducedMotionQuery.matches;
  }

  function updateFinePointer(e) {
    finePointer = e ? e.matches : finePointerQuery.matches;
  }

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', updateReducedMotion);
    finePointerQuery.addEventListener('change', updateFinePointer);
  } else if (typeof reducedMotionQuery.addListener === 'function') {
    reducedMotionQuery.addListener(updateReducedMotion);
    finePointerQuery.addListener(updateFinePointer);
  }

  function prefersReducedMotion() {
    return reducedMotion;
  }

  function hasFinePointer() {
    return finePointer && !reducedMotion;
  }

  // --- 1. [data-reveal] Intersection Observer (Threshold 0.15) ---
  function initDataReveals() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;

    if (prefersReducedMotion()) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  // --- 2. Passive rAF-Coalesced Scroll Progress Bar (scaleX) ---
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;

    function update() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  // --- 3. IntersectionObserver Sentinel for Back-to-Top Button ---
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    const heroSection = document.getElementById('home');
    if (!backToTopBtn || !heroSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If hero is NOT intersecting, we've scrolled past it -> show back to top
        if (!entry.isIntersecting) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(heroSection);

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });
  }

  // --- 4. Pause Ambient Animations When Off-Screen ---
  function initAmbientObserver() {
    const ambientEls = document.querySelectorAll('[data-ambient]');
    if (!ambientEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.style.animationPlayState = entry.isIntersecting && !prefersReducedMotion() ? 'running' : 'paused';
      });
    }, { threshold: 0 });

    ambientEls.forEach(el => observer.observe(el));
  }

  // --- 5. Layered Hero Scroll & Interactive Pointer Parallax ---
  function initHeroParallax() {
    const heroSection = document.getElementById('home');
    const heroStage = document.getElementById('hero-stage');
    if (!heroSection || !heroStage) return;

    const bgLayer = heroSection.querySelector('[data-parallax="bg"]');
    const typographyLayers = heroSection.querySelectorAll('[data-parallax="typography"]');
    const portraitLayer = heroSection.querySelector('[data-parallax="portrait"]');
    const foregroundLayer = heroSection.querySelector('[data-parallax="foreground"]');

    let scrollY = 0;
    let ptrX = 0;
    let ptrY = 0;
    let ticking = false;

    function applyParallax() {
      if (prefersReducedMotion()) {
        if (bgLayer) bgLayer.style.transform = '';
        typographyLayers.forEach(el => el.style.transform = '');
        if (portraitLayer) portraitLayer.style.transform = '';
        if (foregroundLayer) foregroundLayer.style.transform = '';
        ticking = false;
        return;
      }

      const heroHeight = heroSection.offsetHeight;
      if (scrollY <= heroHeight + 100) {
        // Background moves slowly: factor 0.08
        if (bgLayer) {
          bgLayer.style.transform = `translate3d(0, ${(scrollY * 0.08).toFixed(2)}px, 0)`;
        }

        // Typography moves subtly with pointer shift
        typographyLayers.forEach(el => {
          const x = (ptrX * 4).toFixed(2);
          const y = (ptrY * 3).toFixed(2);
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        // Portrait moves with subtle scroll parallax + counter pointer shift for organic depth
        if (portraitLayer) {
          const x = (ptrX * -6).toFixed(2);
          const y = (scrollY * 0.10 + ptrY * -4).toFixed(2);
          portraitLayer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }

        // Foreground floating elements
        if (foregroundLayer) {
          const x = (ptrX * 8).toFixed(2);
          const y = (ptrY * 6).toFixed(2);
          foregroundLayer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      }

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', () => {
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
      requestTick();
    }, { passive: true });

    heroStage.addEventListener('pointermove', (e) => {
      if (!hasFinePointer()) return;
      const rect = heroStage.getBoundingClientRect();
      ptrX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      ptrY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      requestTick();
    });

    heroStage.addEventListener('pointerleave', () => {
      ptrX = 0;
      ptrY = 0;
      requestTick();
    });

    // Initial positioning
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    applyParallax();
  }

  // Expose on window for portfolio modules
  window.PortfolioMotion = {
    prefersReducedMotion,
    hasFinePointer,
    initDataReveals,
    initScrollProgress,
    initBackToTop,
    initAmbientObserver,
    initHeroParallax
  };

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initDataReveals();
    initBackToTop();
    initAmbientObserver();
    initHeroParallax();
  });
})();
