(function () {
  'use strict';

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Hero Load
  function runHeroLoad() {
    if (prefersReducedMotion()) return;
    
    const heroEls = document.querySelectorAll('.hero-status-line, .hero-title, .hero-description, .hero-chips, .hero-cta-group');
    heroEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + (i * 120));
    });

    const apiCard = document.querySelector('.api-card');
    if (apiCard) {
      apiCard.style.opacity = '0';
      apiCard.style.transform = 'translateX(40px) rotate(2deg)';
      apiCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      setTimeout(() => {
        apiCard.style.opacity = '1';
        apiCard.style.transform = 'translateX(0) rotate(0deg)';
      }, 300);
    }
  }

  // 2. Card-level reveal (fade up 24px, stagger by index % 6 x 70ms) & Level Bars
  function initCardReveals() {
    if (prefersReducedMotion()) return;

    const cards = document.querySelectorAll('.section-header, .project-card, .profile-card-frame, .about-bio-text, .skills-column, .info-box, .academic-card, .contact-actions-row');
    
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          // Calculate stagger index
          const visibleCards = Array.from(cards).filter(c => {
            const rect = c.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          });
          const index = visibleCards.indexOf(target);
          const stagger = (index > -1 ? index % 6 : 0) * 70;

          setTimeout(() => {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
            
            // Level bar animation
            if (target.classList.contains('skill-card')) {
              const bar = target.querySelector('.skill-level-bar');
              if (bar) {
                bar.style.width = bar.getAttribute('data-level');
              }
            }
          }, stagger);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach(card => observer.observe(card));
  }

  // 3. Scroll Progress Bar & Accent color
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.style.position = 'fixed';
    bar.style.top = '0';
    bar.style.left = '0';
    bar.style.height = '3px';
    bar.style.width = '0%';
    bar.style.backgroundColor = 'var(--black)';
    bar.style.zIndex = '9999';
    bar.style.transition = 'width 0.1s ease';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
    }, { passive: true });
  }

  // 4. Project Card Spotlight and Tilt
  function initCardInteractions() {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = ((y - centerY) / centerY) * -6;
        const tiltY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,0.03) 0%, var(--bg-card) 50%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.background = 'var(--bg-card)';
      });
    });
  }

  function init() {
    runHeroLoad();
    initScrollProgress();
    setTimeout(() => {
      initCardReveals();
      initCardInteractions();
    }, 500); // Give DOM time to settle for project cards
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
