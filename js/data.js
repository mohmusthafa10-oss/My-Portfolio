/**
 * Muhammed Musthafa K C - Portfolio Data Store
 * Single source of truth for projects and skills.
 */

const PROJECTS = [
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

const SKILLS = [
  {
    group: 'Frontend',
    items: [
      {
        name: 'HTML5',
        alias: 'HTML',
        definition: 'Standard markup language for structuring accessible, semantic web content.'
      },
      {
        name: 'CSS3',
        alias: 'CSS',
        definition: 'Style sheet language for modern responsive layouts, typography, and motion.'
      },
      {
        name: 'JavaScript',
        alias: 'JavaScript',
        definition: 'Core programming language powering interactive frontend logic and asynchronous state.'
      },
      {
        name: 'Tailwind CSS',
        alias: 'Tailwind CSS',
        definition: 'Utility-first styling system used for rapid, predictable, and modular design.'
      },
      {
        name: 'Responsive Web Design',
        alias: 'Responsive',
        definition: 'Methodology ensuring layouts fluidly adapt across mobile, tablet, and desktop viewports.'
      },
      {
        name: 'Semantic HTML',
        alias: 'HTML',
        definition: 'Using appropriate semantic tags to ensure machine readability and screen reader support.'
      },
      {
        name: 'Accessibility',
        alias: 'A11y',
        definition: 'Designing and building web applications accessible to all users following WCAG guidelines.'
      },
      {
        name: 'DOM Manipulation',
        alias: 'JavaScript',
        definition: 'Programmatic interaction and live event handling with document elements.'
      }
    ]
  },
  {
    group: 'APIs & Programming',
    items: [
      {
        name: 'Python',
        alias: 'Python',
        definition: 'Versatile programming language utilized for automation, scripting, and backend logic.'
      },
      {
        name: 'REST APIs',
        alias: 'REST APIs',
        definition: 'Architectural pattern enabling reliable client-server data communication.'
      },
      {
        name: 'JSON',
        alias: 'JSON',
        definition: 'Standard data serialization format for exchanging state between client and server.'
      },
      {
        name: 'Fetch API',
        alias: 'REST APIs',
        definition: 'Native browser interface for asynchronous HTTP network communication.'
      },
      {
        name: 'HTTP',
        alias: 'REST APIs',
        definition: 'Fundamental web protocol covering request methods, headers, and status codes.'
      },
      {
        name: 'API Integration',
        alias: 'REST APIs',
        definition: 'Connecting frontend UI components with backend endpoints and third-party data.'
      },
      {
        name: 'Error Handling',
        alias: 'JavaScript',
        definition: 'Writing defensive code to handle network, parsing, and runtime failures gracefully.'
      }
    ]
  },
  {
    group: 'Development Tools',
    items: [
      {
        name: 'Git',
        alias: 'Git',
        definition: 'Distributed version control system for atomic commits and branch tracking.'
      },
      {
        name: 'GitHub',
        alias: 'GitHub Pages',
        definition: 'Collaborative code hosting platform supporting CI/CD and static website deployment.'
      },
      {
        name: 'VS Code',
        alias: 'VS Code',
        definition: 'Modern lightweight code editor with extensible language tooling and debugging.'
      },
      {
        name: 'Postman',
        alias: 'Postman',
        definition: 'API testing platform for validating endpoints, payloads, and response headers.'
      },
      {
        name: 'Chrome DevTools',
        alias: 'DevTools',
        definition: 'Browser development suite for inspecting the DOM, measuring network performance, and profiling.'
      }
    ]
  },
  {
    group: 'Currently Learning',
    isLearning: true,
    items: [
      {
        name: 'React',
        alias: 'React',
        definition: 'Declarative component-based UI library for stateful frontends.'
      },
      {
        name: 'Django',
        alias: 'Django',
        definition: 'High-level Python web framework designed for secure, rapid backend development.'
      },
      {
        name: 'Generative AI',
        alias: 'AI',
        definition: 'Modern AI architectures enabling automated generation of structured data, code, and content.'
      },
      {
        name: 'Large Language Models (LLMs)',
        alias: 'LLM',
        definition: 'Deep learning models trained on vast corpora for reasoning and language tasks.'
      }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.PROJECTS = PROJECTS;
  window.SKILLS = SKILLS;
}
