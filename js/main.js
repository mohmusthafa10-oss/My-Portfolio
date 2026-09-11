document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Initialize theme from localStorage or default to light
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      `;
    } else {
      themeToggleBtn.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      `;
    }
  }

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navPillMenu = document.getElementById('nav-pill-menu');

  if (mobileToggle && navPillMenu) {
    mobileToggle.addEventListener('click', () => {
      navPillMenu.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-link-tab').forEach(link => {
      link.addEventListener('click', () => {
        navPillMenu.classList.remove('mobile-open');
      });
    });
  }

  // --- Projects Data & Filter Logic ---
  const projectsData = [
    {
      id: 1,
      category: 'ai',
      categoryName: 'AI & LOGISTICS',
      title: 'AI-Assisted Logistics Lead Evaluation',
      description: 'Designed and built a structured, responsive web platform for analyzing, filtering, and organizing logistics leads through automated scoring workflows.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
      demoUrl: 'https://github.com/mohmusthafa10-oss/AI-assisted-Logistics-lead-evaluation',
      codeUrl: 'https://github.com/mohmusthafa10-oss/AI-assisted-Logistics-lead-evaluation'
    },
    {
      id: 2,
      category: 'ai',
      categoryName: 'AI & WELLNESS',
      title: 'MindLink – AI Mental Wellness Platform',
      description: 'Developed intuitive frontend interfaces for AI conversations, interactive mood tracking charts, user profile customization, and analytics dashboards.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'],
      demoUrl: 'https://github.com/mohmusthafa10-oss/MindLink',
      codeUrl: 'https://github.com/mohmusthafa10-oss/MindLink'
    },
    {
      id: 3,
      category: 'ui',
      categoryName: 'UI REVIEW & CASE STUDY',
      title: 'Swiggy Careers — Responsive UI Review',
      description: 'Independent frontend case study analyzing responsive UI behavior across the Swiggy Careers experience, with experimental CSS/layout improvements for mobile responsiveness.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
      demoUrl: 'https://github.com/mohmusthafa10-oss/swiggy-careers-responsive-ui-review',
      codeUrl: 'https://github.com/mohmusthafa10-oss/swiggy-careers-responsive-ui-review'
    }
  ];

  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderProjects(filterCategory = 'all') {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    const filtered = filterCategory === 'all' 
      ? projectsData 
      : projectsData.filter(p => p.category === filterCategory);

    filtered.forEach(project => {
      const card = document.createElement('article');
      card.className = 'project-card-item';
      card.innerHTML = `
        <div>
          <div class="project-card-top">
            <span class="project-category-badge">${project.categoryName}</span>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <h3 class="project-card-title">${project.title}</h3>
          <p class="project-card-desc">${project.description}</p>
        </div>
        <div>
          <div class="project-tech-list">
            ${project.tags.map(tag => `<span class="tech-tag-chip">${tag}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn-project-link">
              <span>View Repository</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      `;
      projectsGrid.appendChild(card);
    });
  }

  renderProjects();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
    });
  });

  // --- Render Skills Tags ---
  const frontendSkills = ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Tailwind CSS', 'React', 'Vue.js', 'Responsive Web Design', 'DOM Manipulation'];
  const toolsSkills = ['Git', 'GitHub', 'VS Code', 'Figma', 'Vite', 'npm / Webpack'];

  const frontendWrap = document.getElementById('frontend-skills-wrap');
  const toolsWrap = document.getElementById('tools-skills-wrap');

  if (frontendWrap) {
    frontendSkills.forEach(skill => {
      const span = document.createElement('span');
      span.className = 'skill-pill';
      span.textContent = skill;
      frontendWrap.appendChild(span);
    });
  }

  if (toolsWrap) {
    toolsSkills.forEach(skill => {
      const span = document.createElement('span');
      span.className = 'skill-pill';
      span.textContent = skill;
      toolsWrap.appendChild(span);
    });
  }

  // --- Render Certifications ---
  const certificationsData = [
    { name: 'Web Development Bootcamp', year: '2025', desc: 'Comprehensive full-stack & modern frontend architecture training.' },
    { name: 'AI in Action: Predictive Models', year: '2025', desc: 'Building predictive ML applications with Python.' },
    { name: 'AI Face Detection Using Python', year: '2026', desc: 'Computer vision and neural network application development.' }
  ];

  const certsList = document.getElementById('certifications-list');
  if (certsList) {
    certificationsData.forEach(cert => {
      const div = document.createElement('div');
      div.className = 'timeline-card';
      div.innerHTML = `
        <div class="timeline-card-header">
          <h4 class="timeline-card-title">${cert.name}</h4>
          <span class="timeline-period-badge">${cert.year}</span>
        </div>
        <div class="timeline-sub">${cert.desc}</div>
      `;
      certsList.appendChild(div);
    });
  }

  // --- Render Social Links ---
  const socialLinksData = [
    {
      name: 'GitHub Profile',
      url: 'https://github.com/mohmusthafa10-oss',
      icon: `<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`
    },
    {
      name: 'LinkedIn Network',
      url: 'https://linkedin.com/in/moh-musthafa',
      icon: `<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
    },
    {
      name: 'Medium Articles',
      url: 'https://medium.com/@alhdjsu147',
      icon: `<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`
    }
  ];

  const socialWrap = document.getElementById('social-links-container');
  if (socialWrap) {
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

  // --- Form Handler ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;

      alert(`Thank you ${name}! Your transmission has been sent successfully. I will get back to you at ${email} shortly.`);
      contactForm.reset();
    });
  }

  // --- Scroll Active Nav Highlight & Back-to-Top Button ---
  const sections = document.querySelectorAll('section[id]');
  const navTabs = document.querySelectorAll('.nav-link-tab');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Show/hide back to top button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active link highlight
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