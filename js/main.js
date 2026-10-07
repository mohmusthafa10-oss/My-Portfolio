document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const headerNav = document.querySelector('.header-nav');

  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = headerNav.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-link-tab, .btn-resume, .btn-email').forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        headerNav.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Nav Active Link Observer ---
  const navLinks = document.querySelectorAll('.nav-link-tab');
  const sections = document.querySelectorAll('section[id]');
  
  if (navLinks.length > 0 && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      let activeSectionId = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSectionId = entry.target.id;
        }
      });
      if (activeSectionId) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }, { rootMargin: '-40% 0px -40% 0px' });
    
    sections.forEach(sec => observer.observe(sec));
  }

  // --- Resume Logic ---
  const RESUME_URL = ''; // add resume.pdf then set RESUME_URL
  if (RESUME_URL) {
    document.querySelectorAll('.resume-link').forEach(link => {
      link.href = RESUME_URL;
      link.hidden = false;
      link.style.display = ''; // Clear inline display block if any
    });
  }

  // --- Single Source of Truth: Approved Projects Data ---
  const projectsData = [
    {
      id: 1,
      type: 'Real-world project',
      title: 'The Hub Chungam Traders',
      description: 'A responsive website built for a local building materials and hardware business, designed to present its products and services clearly while making it easy for customers to enquire, contact the business and find the physical location.',
      role: 'Frontend development · UI implementation · Content structure · Local SEO · Deployment',
      highlights: [
        'Built a responsive, mobile-first interface',
        'Structured products and categories for easier navigation',
        'Added contextual WhatsApp enquiry and contact actions',
        'Implemented local SEO-focused content structure',
        'Added location, contact and directions functionality',
        'Deployed as a static website using GitHub Pages'
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'SEO', 'GitHub Pages'],
      codeUrl: '', // needs repository URL
      demoUrl: ''  // needs live URL
    },
    {
      id: 2,
      type: 'Lead Evaluation Interface',
      title: 'AI-Assisted Logistics Lead Evaluation',
      description: 'A web application focused on organising and evaluating logistics leads through a structured, workflow-oriented interface.',
      role: '',
      highlights: [
        'Built an interactive frontend interface',
        'Designed structured lead information and evaluation flows',
        'Worked with API-connected application concepts',
        'Focused on responsive layouts and clear information presentation',
        'Created reusable interface patterns for workflow-based interactions'
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'REST APIs'],
      codeUrl: 'https://github.com/mohmusthafa10-oss/AI-assisted-Logistics-lead-evaluation',
      demoUrl: ''
    },
    {
      id: 3,
      type: 'Interactive Web Application',
      title: 'MindLink',
      description: 'An interactive web application featuring conversational UI, mood visualisation, profiles and dashboard-style interfaces.',
      role: '',
      highlights: [
        'Built responsive and interactive UI components',
        'Created conversational interface patterns',
        'Designed dashboard and profile experiences',
        'Implemented interactive visual elements',
        'Focused on responsive behaviour across screen sizes'
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'REST APIs'],
      codeUrl: 'https://github.com/mohmusthafa10-oss/MindLink',
      demoUrl: ''
    }
  ];

  // --- Editorial Project List Rendering ---
  const projectsListContainer = document.getElementById('projects-list');

  // Drawer DOM References
  const drawerOverlay = document.getElementById('project-drawer-overlay');
  const drawerElement = document.getElementById('project-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerPrevBtn = document.getElementById('drawer-prev-btn');
  const drawerNextBtn = document.getElementById('drawer-next-btn');

  let activeDrawerIndex = -1;
  let lastActiveElement = null;

  function renderEditorialProjects() {
    if (!projectsListContainer) return;
    projectsListContainer.innerHTML = '';
    
    projectsListContainer.classList.add('project-grid-container');

    projectsData.forEach((project, index) => {
      const item = document.createElement('article');
      item.className = 'project-card';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View details for project: ${project.title}`);

      const tagsHtml = project.tags
        .map(tag => `<span class="project-tag-chip">${tag}</span>`)
        .join('');

      item.innerHTML = `
        <div class="project-card-image-slot"></div>
        <div class="project-card-content">
          <span class="project-category-badge">${index === 0 ? 'Real-world project' : project.type}</span>
          <h3 class="project-card-title" ${index === 0 ? 'style="font-size: clamp(1.4rem, 2vw, 1.8rem);"' : ''}>${project.title}</h3>
          <p class="project-card-desc">${project.description}</p>
          <div class="project-list-tags">${tagsHtml}</div>
          <div class="project-card-action">
            <span>View details</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        openProjectDrawer(index);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectDrawer(index);
        }
      });

      projectsListContainer.appendChild(item);
    });
  }

  // --- Project Drawer Event & Render Helpers ---
  function setupProjectDrawer() {
    if (!drawerElement || !drawerOverlay) return;

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeProjectDrawer);
    }
    drawerOverlay.addEventListener('click', closeProjectDrawer);

    if (drawerPrevBtn) {
      drawerPrevBtn.addEventListener('click', goToPreviousProject);
    }
    if (drawerNextBtn) {
      drawerNextBtn.addEventListener('click', goToNextProject);
    }

    document.addEventListener('keydown', (e) => {
      if (!drawerElement.classList.contains('is-active')) return;

      if (e.key === 'Escape') {
        closeProjectDrawer();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousProject();
      } else if (e.key === 'ArrowRight') {
        goToNextProject();
      } else if (e.key === 'Tab') {
        const focusableElements = drawerElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusableElements.length) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  function renderProjectDrawer(project, index, total) {
    if (!project) return;

    const formattedNum = String(index + 1).padStart(2, '0');
    const formattedTotal = String(total).padStart(2, '0');
    const counterText = `PROJECT ${formattedNum} / ${formattedTotal}`;
    
    const drawerCounter = document.getElementById('drawer-project-counter');
    const navCounter = document.getElementById('drawer-nav-counter');
    if (drawerCounter) drawerCounter.textContent = counterText;
    if (navCounter) navCounter.textContent = `${formattedNum} / ${formattedTotal}`;

    // Category
    const categoryBadge = document.getElementById('drawer-project-category');
    if (categoryBadge) {
      categoryBadge.textContent = project.type;
    }

    // Title
    const titleEl = document.getElementById('drawer-project-title');
    if (titleEl) titleEl.textContent = project.title;

    // Description
    const descEl = document.getElementById('drawer-project-desc');
    if (descEl) descEl.textContent = project.description || '';

    // My Role
    const roleWrapper = document.getElementById('drawer-role-wrapper');
    const roleEl = document.getElementById('drawer-project-role');
    if (roleWrapper && roleEl) {
      if (project.role && project.role.trim() !== '') {
        roleEl.textContent = project.role;
        roleWrapper.style.display = 'block';
      } else {
        roleWrapper.style.display = 'none';
      }
    }

    // Frontend Contribution / Highlights
    const highlightsWrapper = document.getElementById('drawer-highlights-wrapper');
    const highlightsList = document.getElementById('drawer-project-highlights');
    if (highlightsWrapper && highlightsList) {
      if (project.highlights && project.highlights.length > 0) {
        highlightsList.innerHTML = project.highlights.map(h => `<li>${h}</li>`).join('');
        highlightsWrapper.style.display = 'block';
      } else {
        highlightsWrapper.style.display = 'none';
        highlightsList.innerHTML = '';
      }
    }

    // Technologies
    const tagsWrapper = document.getElementById('drawer-tags-wrapper');
    const tagsList = document.getElementById('drawer-project-tags');
    if (tagsWrapper && tagsList) {
      if (project.tags && project.tags.length > 0) {
        tagsList.innerHTML = project.tags.map(tag => `<span class="tech-tag-chip">${tag}</span>`).join('');
        tagsWrapper.style.display = 'block';
      } else {
        tagsWrapper.style.display = 'none';
      }
    }

    // Available Repository & Live Links
    const codeLink = document.getElementById('drawer-code-link');
    const demoLink = document.getElementById('drawer-demo-link');
    const linksWrapper = document.getElementById('drawer-links-wrapper');

    let hasAnyLink = false;
    
    if (codeLink) {
      const validCodeUrl = project.codeUrl && project.codeUrl.trim() !== '' && project.codeUrl.trim() !== '#';
      if (validCodeUrl) {
        codeLink.href = project.codeUrl;
        codeLink.style.display = 'inline-flex';
        hasAnyLink = true;
      } else {
        codeLink.style.display = 'none';
      }
    }

    if (demoLink) {
      const validDemoUrl = project.demoUrl && project.demoUrl.trim() !== '' && project.demoUrl.trim() !== '#';
      if (validDemoUrl) {
        demoLink.href = project.demoUrl;
        demoLink.style.display = 'inline-flex';
        hasAnyLink = true;
      } else {
        demoLink.style.display = 'none';
      }
    }

    if (linksWrapper) {
      linksWrapper.style.display = hasAnyLink ? 'flex' : 'none';
    }

    // Prev / Next button states
    if (drawerPrevBtn) drawerPrevBtn.disabled = index <= 0;
    if (drawerNextBtn) drawerNextBtn.disabled = index >= total - 1;
  }

  function openProjectDrawer(index) {
    if (index < 0 || index >= projectsData.length) return;

    lastActiveElement = document.activeElement;
    activeDrawerIndex = index;

    const project = projectsData[index];
    renderProjectDrawer(project, index, projectsData.length);

    document.body.style.overflow = 'hidden';
    
    if (drawerOverlay) {
      drawerOverlay.classList.add('is-active');
      drawerOverlay.setAttribute('aria-hidden', 'false');
    }
    
    if (drawerElement) {
      drawerElement.classList.add('is-active');
      drawerElement.setAttribute('aria-hidden', 'false');
      const drawerBody = drawerElement.querySelector('.project-drawer-body');
      if (drawerBody) drawerBody.scrollTop = 0;
    }

    setTimeout(() => {
      if (drawerCloseBtn) drawerCloseBtn.focus();
    }, 100);
  }

  function closeProjectDrawer() {
    if (drawerOverlay) {
      drawerOverlay.classList.remove('is-active');
      drawerOverlay.setAttribute('aria-hidden', 'true');
    }
    
    if (drawerElement) {
      drawerElement.classList.remove('is-active');
      drawerElement.setAttribute('aria-hidden', 'true');
    }

    document.body.style.overflow = '';
    activeDrawerIndex = -1;

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  function goToNextProject() {
    if (activeDrawerIndex < projectsData.length - 1) {
      switchProjectContent(activeDrawerIndex + 1);
    }
  }

  function goToPreviousProject() {
    if (activeDrawerIndex > 0) {
      switchProjectContent(activeDrawerIndex - 1);
    }
  }

  function switchProjectContent(newIndex) {
    const drawerPanel = drawerElement ? drawerElement.querySelector('.project-drawer-panel') : null;
    if (drawerPanel) {
      drawerPanel.classList.add('project-drawer-content-switching');
    }

    setTimeout(() => {
      activeDrawerIndex = newIndex;
      const project = projectsData[newIndex];
      renderProjectDrawer(project, newIndex, projectsData.length);

      const drawerBody = drawerElement.querySelector('.project-drawer-body');
      if (drawerBody) drawerBody.scrollTop = 0;

      if (drawerPanel) {
        drawerPanel.classList.remove('project-drawer-content-switching');
      }
    }, 120);
  }

  renderEditorialProjects();
  setupProjectDrawer();

  // --- What I Work With (Capabilities) Skills Renderer ---
  const frontendSkills = ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Responsive Web Design', 'Semantic HTML', 'Accessibility', 'DOM Manipulation'];
  const backendSkills = ['Python', 'REST APIs', 'JSON', 'Fetch API', 'HTTP', 'API Integration', 'Error Handling'];
  const devSkills = ['Git', 'GitHub', 'VS Code', 'Postman', 'Chrome DevTools'];
  const learningSkills = ['React', 'Django', 'Generative AI', 'Large Language Models (LLMs)'];

  function populateSkills(wrapId, skillsList) {
    const wrap = document.getElementById(wrapId);
    if (wrap) {
      wrap.innerHTML = '';
      wrap.style.display = 'flex';
      wrap.style.flexWrap = 'wrap';
      wrap.style.gap = '0.5rem';
      
      skillsList.forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'skill-chip';
        // Give learning skills a distinct subtle style via inline css
        if (wrapId === 'learning-skills-wrap') {
          chip.style.fontWeight = '500';
          chip.style.borderStyle = 'dashed';
        }
        chip.textContent = skill;
        wrap.appendChild(chip);
      });
    }
  }

  populateSkills('frontend-skills-wrap', frontendSkills);
  populateSkills('backend-skills-wrap', backendSkills);
  populateSkills('tools-skills-wrap', devSkills);
  populateSkills('learning-skills-wrap', learningSkills);

  // FAQ section removed

  // --- Render Social Links ---
  const socialLinksData = [
    {
      name: 'GitHub',
      url: 'https://github.com/mohmusthafa10-oss',
      icon: `<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/moh-musthafa',
      icon: `<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
    }
  ];

  const socialWrap = document.getElementById('social-links-container');
  if (socialWrap) {
    socialWrap.innerHTML = '';
    socialLinksData.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'social-link-btn';
      a.innerHTML = `
        <span class="social-icon-label">
          ${link.icon}
          <span>${link.name}</span>
        </span>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      `;
      socialWrap.appendChild(a);
    });
  }

  // Deleted Project Filtering
  // Deleted Form Handler
  // Deleted Hero API Card Interaction

  // --- Scroll Active Nav Highlight & Back-to-Top Button ---
  const sections = document.querySelectorAll('section[id]');
  const navTabs = document.querySelectorAll('.nav-link-tab');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navTabs.forEach(tab => {
          tab.classList.remove('active');
          if (tab.getAttribute('href') === `#${sectionId}`) {
            tab.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});