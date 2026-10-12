/**
 * Muhammed Musthafa K C - Main Portfolio Interactions
 * Native Vanilla JS with Zero Third-Party Libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const motion = window.PortfolioMotion || {
    prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    hasFinePointer: () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
  };

  // ==========================================================================
  // 1. NAVIGATION & ACCESSIBILITY
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const headerNav = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.nav-link-tab');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && headerNav) {
    function closeMobileNav() {
      headerNav.classList.remove('mobile-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }

    mobileToggle.addEventListener('click', () => {
      const isOpen = headerNav.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-link-tab, .btn-resume, .btn-email').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (headerNav.classList.contains('mobile-open') && !headerNav.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on resize above 860px
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && headerNav.classList.contains('mobile-open')) {
        closeMobileNav();
      }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && headerNav.classList.contains('mobile-open')) {
        closeMobileNav();
      }
    });
  }

  // Active Nav Link Observer
  if (navLinks.length > 0 && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.1 });

    sections.forEach(sec => navObserver.observe(sec));
  }

  // Resume logic
  const RESUME_URL = ''; // Set resume URL when PDF is available
  if (RESUME_URL) {
    document.querySelectorAll('.resume-link').forEach(link => {
      link.href = RESUME_URL;
      link.hidden = false;
    });
  }

  // ==========================================================================
  // 2. HERO POINTER PARALLAX
  // ==========================================================================
  const heroStage = document.getElementById('hero-stage');
  if (heroStage) {
    let heroRaf = null;

    heroStage.addEventListener('pointermove', (e) => {
      if (!motion.hasFinePointer()) return;

      const rect = heroStage.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (heroRaf) cancelAnimationFrame(heroRaf);
      heroRaf = requestAnimationFrame(() => {
        heroStage.style.setProperty('--px', px.toFixed(3));
        heroStage.style.setProperty('--py', py.toFixed(3));
      });
    });

    heroStage.addEventListener('pointerleave', () => {
      if (heroRaf) cancelAnimationFrame(heroRaf);
      heroStage.style.setProperty('--px', '0');
      heroStage.style.setProperty('--py', '0');
    });
  }

  // ==========================================================================
  // 3. SECTION 2: PROJECTS 3D COVER-FLOW CAROUSEL
  // ==========================================================================
  const projects = window.PROJECTS || [];
  const coverflowStage = document.getElementById('coverflow-stage');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const dotsContainer = document.getElementById('carousel-dots-container');
  const autoplayToggle = document.getElementById('carousel-autoplay-toggle');
  const playPauseText = document.getElementById('carousel-autoplay-status');
  const announcer = document.getElementById('carousel-announcer');

  let activeIndex = 0;
  let autoplayTimer = null;
  let isAutoplayPaused = false;
  let previousOffsets = new Map();
  const N = projects.length;

  function renderCoverflowCards() {
    if (!coverflowStage) return;
    coverflowStage.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    projects.forEach((proj, idx) => {
      const card = document.createElement('article');
      card.className = 'coverflow-card';
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', `${idx + 1} of ${N}: ${proj.title}`);
      card.setAttribute('data-index', String(idx));

      // Generated Typographic Cover from real project data
      const coverHtml = `
        <div class="project-card-cover" aria-hidden="true">
          <div class="cover-bg-grid"></div>
          <div class="cover-badge-row">
            <span class="cover-type-tag">${proj.type}</span>
            <span class="cover-accent-mark"></span>
          </div>
          <h3 class="cover-title-display">${proj.title}</h3>
          <div class="cover-tags-footer">${proj.tags.slice(0, 3).join(' · ')}</div>
        </div>
      `;

      const tagsHtml = proj.tags.map(t => `<span class="coverflow-tag">${t}</span>`).join('');

      const hasCode = proj.codeUrl && proj.codeUrl.trim() !== '' && proj.codeUrl !== '#';
      const hasDemo = proj.demoUrl && proj.demoUrl.trim() !== '' && proj.demoUrl !== '#';

      let linksHtml = '';
      if (hasCode) {
        linksHtml += `<a href="${proj.codeUrl}" target="_blank" rel="noopener noreferrer" class="coverflow-link-btn" aria-label="GitHub repository for ${proj.title}">GitHub</a>`;
      }
      if (hasDemo) {
        linksHtml += `<a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="coverflow-link-btn" aria-label="Live site for ${proj.title}">Live</a>`;
      }

      card.innerHTML = `
        ${coverHtml}
        <div class="coverflow-body">
          <h3 class="coverflow-title">${proj.title}</h3>
          <p class="coverflow-desc">${proj.description}</p>
          <div class="coverflow-tags">${tagsHtml}</div>
          <div class="coverflow-actions">
            <button type="button" class="coverflow-open-btn" data-action="open-drawer">
              <span>View details</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <div class="coverflow-links-group">${linksHtml}</div>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // Allow natural anchor clicks

        if (idx === activeIndex) {
          openProjectDrawer(idx);
        } else {
          setActiveProject(idx);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (idx === activeIndex) {
            e.preventDefault();
            openProjectDrawer(idx);
          } else {
            e.preventDefault();
            setActiveProject(idx);
          }
        }
      });

      coverflowStage.appendChild(card);

      // Indicator dot
      if (dotsContainer) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `carousel-dot ${idx === 0 ? 'is-active' : ''}`;
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Navigate to project ${idx + 1}: ${proj.title}`);
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => setActiveProject(idx));
        dotsContainer.appendChild(dot);
      }
    });

    updateCoverflowPositions(false);
  }

  function updateCoverflowPositions(animateWraps = true) {
    if (!coverflowStage || N === 0) return;

    const cards = coverflowStage.querySelectorAll('.coverflow-card');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

    cards.forEach((card, i) => {
      // Circular signed distance d:
      // d in range [-floor(N/2), floor(N/2)]
      const half = Math.floor(N / 2);
      const d = ((i - activeIndex + N + half) % N) - half;
      const absD = Math.abs(d);

      const oldD = previousOffsets.has(i) ? previousOffsets.get(i) : d;
      previousOffsets.set(i, d);

      // Wrapping check: if transition jump > 1, apply .is-wrapping to travel behind
      if (animateWraps && Math.abs(d - oldD) > 1) {
        card.classList.add('is-wrapping');
        setTimeout(() => {
          card.classList.remove('is-wrapping');
        }, 480);
      }

      card.style.setProperty('--d', String(d));
      card.style.setProperty('--abs-d', String(absD));

      if (d === 0) {
        card.classList.add('is-active');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-hidden', 'false');
      } else {
        card.classList.remove('is-active');
        card.setAttribute('tabindex', '-1');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

    if (announcer && projects[activeIndex]) {
      announcer.textContent = `Active project ${activeIndex + 1} of ${N}: ${projects[activeIndex].title}`;
    }
  }

  function setActiveProject(newIndex) {
    if (newIndex === activeIndex) return;
    activeIndex = ((newIndex % N) + N) % N;
    updateCoverflowPositions(true);
  }

  function nextProject() {
    setActiveProject(activeIndex + 1);
  }

  function prevProject() {
    setActiveProject(activeIndex - 1);
  }

  // Autoplay handler
  function startAutoplay() {
    if (motion.prefersReducedMotion() || isAutoplayPaused) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      nextProject();
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevProject(); stopAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextProject(); stopAutoplay(); });

  if (autoplayToggle) {
    autoplayToggle.addEventListener('click', () => {
      isAutoplayPaused = !isAutoplayPaused;
      if (isAutoplayPaused) {
        stopAutoplay();
        if (playPauseText) playPauseText.textContent = 'Play';
        autoplayToggle.setAttribute('aria-label', 'Resume carousel autoplay');
      } else {
        startAutoplay();
        if (playPauseText) playPauseText.textContent = 'Pause';
        autoplayToggle.setAttribute('aria-label', 'Pause carousel autoplay');
      }
    });
  }

  // Keyboard navigation inside stage
  if (coverflowStage) {
    coverflowStage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevProject();
        stopAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextProject();
        stopAutoplay();
      }
    });

    coverflowStage.addEventListener('mouseenter', stopAutoplay);
    coverflowStage.addEventListener('mouseleave', () => { if (!isAutoplayPaused) startAutoplay(); });
    coverflowStage.addEventListener('focusin', stopAutoplay);
    coverflowStage.addEventListener('focusout', () => { if (!isAutoplayPaused) startAutoplay(); });

    // Touch / Pointer Swipe handling
    let startX = 0;
    let deltaX = 0;
    let isSwiping = false;

    coverflowStage.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      deltaX = 0;
      isSwiping = true;
    });

    coverflowStage.addEventListener('pointermove', (e) => {
      if (!isSwiping) return;
      deltaX = e.clientX - startX;
    });

    coverflowStage.addEventListener('pointerup', () => {
      if (!isSwiping) return;
      isSwiping = false;
      if (deltaX > 40) {
        prevProject();
        stopAutoplay();
      } else if (deltaX < -40) {
        nextProject();
        stopAutoplay();
      }
    });

    coverflowStage.addEventListener('pointercancel', () => {
      isSwiping = false;
    });
  }

  // Document visibility & off-screen IO for Autoplay
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (!isAutoplayPaused) {
      startAutoplay();
    }
  });

  const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isAutoplayPaused) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    });
  }, { threshold: 0.2 });

  if (coverflowStage) carouselObserver.observe(coverflowStage);

  renderCoverflowCards();

  // ==========================================================================
  // 4. PROJECT DRAWER DETAILS
  // ==========================================================================
  const drawerOverlay = document.getElementById('project-drawer-overlay');
  const drawerElement = document.getElementById('project-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerPrevBtn = document.getElementById('drawer-prev-btn');
  const drawerNextBtn = document.getElementById('drawer-next-btn');

  let activeDrawerIndex = -1;
  let lastActiveFocus = null;

  function renderProjectDrawer(index) {
    const proj = projects[index];
    if (!proj) return;

    const formattedNum = String(index + 1).padStart(2, '0');
    const formattedTotal = String(N).padStart(2, '0');
    const counterText = `PROJECT ${formattedNum} / ${formattedTotal}`;

    const drawerCounter = document.getElementById('drawer-project-counter');
    const navCounter = document.getElementById('drawer-nav-counter');
    if (drawerCounter) drawerCounter.textContent = counterText;
    if (navCounter) navCounter.textContent = `${formattedNum} / ${formattedTotal}`;

    const catBadge = document.getElementById('drawer-project-category');
    if (catBadge) catBadge.textContent = proj.type;

    const titleEl = document.getElementById('drawer-project-title');
    if (titleEl) titleEl.textContent = proj.title;

    const descEl = document.getElementById('drawer-project-desc');
    if (descEl) descEl.textContent = proj.description || '';

    // Role
    const roleWrap = document.getElementById('drawer-role-wrapper');
    const roleEl = document.getElementById('drawer-project-role');
    if (roleWrap && roleEl) {
      if (proj.role && proj.role.trim() !== '') {
        roleEl.textContent = proj.role;
        roleWrap.style.display = 'flex';
      } else {
        roleWrap.style.display = 'none';
      }
    }

    // Highlights
    const hlWrap = document.getElementById('drawer-highlights-wrapper');
    const hlList = document.getElementById('drawer-project-highlights');
    if (hlWrap && hlList) {
      if (proj.highlights && proj.highlights.length > 0) {
        hlList.innerHTML = proj.highlights.map(h => `<li>${h}</li>`).join('');
        hlWrap.style.display = 'flex';
      } else {
        hlWrap.style.display = 'none';
      }
    }

    // Technologies
    const tagsWrap = document.getElementById('drawer-tags-wrapper');
    const tagsList = document.getElementById('drawer-project-tags');
    if (tagsWrap && tagsList) {
      tagsList.innerHTML = proj.tags.map(t => `<span class="tech-tag-chip">${t}</span>`).join('');
      tagsWrap.style.display = 'flex';
    }

    // Links
    const codeLink = document.getElementById('drawer-code-link');
    const demoLink = document.getElementById('drawer-demo-link');
    const linksWrap = document.getElementById('drawer-links-wrapper');

    let hasAnyLink = false;
    if (codeLink) {
      if (proj.codeUrl && proj.codeUrl.trim() !== '' && proj.codeUrl !== '#') {
        codeLink.href = proj.codeUrl;
        codeLink.style.display = 'inline-flex';
        hasAnyLink = true;
      } else {
        codeLink.style.display = 'none';
      }
    }

    if (demoLink) {
      if (proj.demoUrl && proj.demoUrl.trim() !== '' && proj.demoUrl !== '#') {
        demoLink.href = proj.demoUrl;
        demoLink.style.display = 'inline-flex';
        hasAnyLink = true;
      } else {
        demoLink.style.display = 'none';
      }
    }

    if (linksWrap) {
      linksWrap.style.display = hasAnyLink ? 'flex' : 'none';
    }

    if (drawerPrevBtn) drawerPrevBtn.disabled = index <= 0;
    if (drawerNextBtn) drawerNextBtn.disabled = index >= N - 1;
  }

  function openProjectDrawer(index) {
    if (index < 0 || index >= N) return;
    lastActiveFocus = document.activeElement;
    activeDrawerIndex = index;
    renderProjectDrawer(index);

    document.body.style.overflow = 'hidden';

    if (drawerOverlay) {
      drawerOverlay.classList.add('is-active');
      drawerOverlay.setAttribute('aria-hidden', 'false');
    }

    if (drawerElement) {
      drawerElement.removeAttribute('inert');
      drawerElement.classList.add('is-active');
      drawerElement.setAttribute('aria-hidden', 'false');
      const body = drawerElement.querySelector('.project-drawer-body');
      if (body) body.scrollTop = 0;
    }

    setTimeout(() => {
      if (drawerCloseBtn) drawerCloseBtn.focus();
    }, 120);
  }

  function closeProjectDrawer() {
    if (drawerOverlay) {
      drawerOverlay.classList.remove('is-active');
      drawerOverlay.setAttribute('aria-hidden', 'true');
    }

    if (drawerElement) {
      drawerElement.setAttribute('inert', '');
      drawerElement.classList.remove('is-active');
      drawerElement.setAttribute('aria-hidden', 'true');
    }

    document.body.style.overflow = '';
    activeDrawerIndex = -1;

    if (lastActiveFocus && typeof lastActiveFocus.focus === 'function') {
      lastActiveFocus.focus();
    }
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeProjectDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeProjectDrawer);

  if (drawerPrevBtn) {
    drawerPrevBtn.addEventListener('click', () => {
      if (activeDrawerIndex > 0) {
        activeDrawerIndex--;
        renderProjectDrawer(activeDrawerIndex);
      }
    });
  }

  if (drawerNextBtn) {
    drawerNextBtn.addEventListener('click', () => {
      if (activeDrawerIndex < N - 1) {
        activeDrawerIndex++;
        renderProjectDrawer(activeDrawerIndex);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!drawerElement || !drawerElement.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeProjectDrawer();
    } else if (e.key === 'ArrowLeft' && activeDrawerIndex > 0) {
      activeDrawerIndex--;
      renderProjectDrawer(activeDrawerIndex);
    } else if (e.key === 'ArrowRight' && activeDrawerIndex < N - 1) {
      activeDrawerIndex++;
      renderProjectDrawer(activeDrawerIndex);
    }
  });

  // ==========================================================================
  // 5. SECTION 3: ABOUT FLIP ID CARD
  // ==========================================================================
  const idCardEl = document.getElementById('id-card-element');
  const idFlipBtn = document.getElementById('id-flip-btn');
  const idTiltStage = document.getElementById('id-tilt-stage');
  const idFaceFront = document.getElementById('id-face-front');
  const idFaceBack = document.getElementById('id-face-back');

  let isFlipped = false;

  function toggleIdCard() {
    isFlipped = !isFlipped;
    if (idCardEl) {
      idCardEl.classList.toggle('is-flipped', isFlipped);
      idCardEl.setAttribute('aria-pressed', String(isFlipped));
    }

    if (isFlipped) {
      if (idFaceFront) { idFaceFront.setAttribute('inert', ''); idFaceFront.setAttribute('aria-hidden', 'true'); }
      if (idFaceBack) { idFaceBack.removeAttribute('inert'); idFaceBack.setAttribute('aria-hidden', 'false'); }
    } else {
      if (idFaceFront) { idFaceFront.removeAttribute('inert'); idFaceFront.setAttribute('aria-hidden', 'false'); }
      if (idFaceBack) { idFaceBack.setAttribute('inert', ''); idFaceBack.setAttribute('aria-hidden', 'true'); }
    }
  }

  if (idCardEl) {
    idCardEl.addEventListener('click', toggleIdCard);
    idCardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleIdCard();
      }
    });
  }

  if (idFlipBtn) {
    idFlipBtn.addEventListener('click', toggleIdCard);
  }

  // Pointer Tilt on Stage Wrapper (separate from flipping button)
  if (idTiltStage) {
    let tiltRaf = null;

    idTiltStage.addEventListener('pointermove', (e) => {
      if (!motion.hasFinePointer()) return;

      const rect = idTiltStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotX = ((y / rect.height) - 0.5) * -12;
      const rotY = ((x / rect.width) - 0.5) * 12;

      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      tiltRaf = requestAnimationFrame(() => {
        idTiltStage.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      });
    });

    idTiltStage.addEventListener('pointerleave', () => {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      idTiltStage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // ==========================================================================
  // 6. SECTION 4: WHAT I WORK WITH (INTERACTIVE TOOLKIT)
  // ==========================================================================
  const skillsData = window.SKILLS || [];
  const toolkitGrid = document.getElementById('toolkit-groups-grid');
  const detailPanel = document.getElementById('skill-detail-panel');
  const detailName = document.getElementById('skill-detail-name');
  const detailDef = document.getElementById('skill-detail-def');
  const detailUsedIn = document.getElementById('skill-detail-used-in');
  const detailProjects = document.getElementById('skill-detail-projects');

  function getMatchingProjects(skill) {
    const term = (skill.alias || skill.name).toLowerCase();
    const matches = projects.filter(p => {
      return p.tags.some(t => {
        const tagLower = t.toLowerCase();
        return tagLower.includes(term) || term.includes(tagLower);
      });
    });
    return matches.map(m => m.title);
  }

  function showSkillDetail(item) {
    if (!detailPanel || !detailName || !detailDef) return;

    detailName.textContent = item.name;
    detailDef.textContent = item.definition;

    const matched = getMatchingProjects(item);
    if (matched.length > 0) {
      detailProjects.textContent = matched.join(', ');
      detailUsedIn.style.display = 'flex';
    } else {
      detailUsedIn.style.display = 'none';
    }

    detailPanel.classList.add('is-active');
  }

  if (toolkitGrid) {
    toolkitGrid.innerHTML = '';

    skillsData.forEach(group => {
      const card = document.createElement('div');
      card.className = `toolkit-group-card ${group.isLearning ? 'is-learning' : ''}`;

      let headerBadge = '';
      if (group.isLearning) {
        headerBadge = `<span class="toolkit-learning-badge">Learning</span>`;
      }

      const tilesHtml = group.items.map(item => {
        return `<button type="button" class="skill-tile" data-skill="${item.name}" aria-expanded="false">${item.name}</button>`;
      }).join('');

      card.innerHTML = `
        <div class="toolkit-group-header">
          <h3 class="toolkit-group-title">${group.group}</h3>
          ${headerBadge}
        </div>
        <div class="toolkit-tiles-wrap">${tilesHtml}</div>
      `;

      // Tilt on fine pointer for group card
      card.addEventListener('pointermove', (e) => {
        if (!motion.hasFinePointer()) return;
        const rect = card.getBoundingClientRect();
        const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });

      toolkitGrid.appendChild(card);
    });

    // Delegate click/focus on skill tiles
    toolkitGrid.addEventListener('click', (e) => {
      const tile = e.target.closest('.skill-tile');
      if (!tile) return;

      const skillName = tile.getAttribute('data-skill');
      let found = null;
      for (const g of skillsData) {
        const item = g.items.find(i => i.name === skillName);
        if (item) { found = item; break; }
      }

      if (found) {
        const allTiles = toolkitGrid.querySelectorAll('.skill-tile');
        allTiles.forEach(t => t.setAttribute('aria-expanded', 'false'));
        tile.setAttribute('aria-expanded', 'true');
        showSkillDetail(found);
      }
    });

    toolkitGrid.addEventListener('focusin', (e) => {
      const tile = e.target.closest('.skill-tile');
      if (!tile) return;
      const skillName = tile.getAttribute('data-skill');
      for (const g of skillsData) {
        const item = g.items.find(i => i.name === skillName);
        if (item) { showSkillDetail(item); break; }
      }
    });

    // Default: show first skill details
    if (skillsData[0] && skillsData[0].items[0]) {
      showSkillDetail(skillsData[0].items[0]);
    }
  }

  // ==========================================================================
  // 7. SECTION 6: EDUCATION CARD & TIMELINE
  // ==========================================================================
  const eduCard = document.getElementById('education-card');
  const eduProgressFill = document.getElementById('edu-progress-fill');

  if (eduCard && eduProgressFill) {
    if (motion.prefersReducedMotion()) {
      eduProgressFill.style.transform = 'scaleX(1)';
    } else {
      eduProgressFill.style.transform = 'scaleX(0)';
      const eduObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            eduProgressFill.style.transform = 'scaleX(1)';
            eduObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      eduObserver.observe(eduCard);
    }

    eduCard.addEventListener('pointermove', (e) => {
      if (!motion.hasFinePointer()) return;
      const rect = eduCard.getBoundingClientRect();
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      eduCard.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });

    eduCard.addEventListener('pointerleave', () => {
      eduCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }
});