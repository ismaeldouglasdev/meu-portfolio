import type { Translation } from './types';

const en: Translation = {
  nav: {
    sobre: 'About',
    servicos: 'Services',
    skills: 'Skills',
    projetos: 'Projects',
    experiencia: 'Experience',
    contato: 'Contact',
  },
  hero: {
    tag: 'Full Stack Developer',
    title1: 'Websites, systems & APIs',
    title2: 'that make your business run',
    phrases: [
      'Websites, systems & APIs\nthat make your business run',
      'Code that delivers\nfrom line one to ship',
      'Open Source in practice\ncontributing to the community',
      'Tailor-made solutions\nthat scale with you',
    ],
    subtitle:
      'Landing pages, custom web systems and complete e-commerce. From business sites to API integrations — no bullshit, no surprises, no ghosting.',
    ctaProjetos: 'View Projects',
    ctaContato: 'Get in Touch',
    stat1: 'Top Contributor',
    stat2: '20+',
    stat3: 'Since 2024',
    stat1Label: 'Open Source',
    stat2Label: 'Projects',
    stat3Label: 'Building Software',
  },
  sobre: {
    label: 'About',
    title: 'Who I am',
    textBefore: 'Nice to meet you! I\'m ',
    textAfter: ', a Full Stack developer passionate about creating practical and efficient solutions. Currently focused on JavaScript, Python, TypeScript and React, I\'m always learning and contributing to open-source projects.',
    highlight1: 'Full Stack Developer',
    highlight2: 'Open Source Contributor',
    highlight3: 'Creative Solutions',
  },
  servicos: {
    label: 'What I do',
    title: 'Services',
    items: [
      {
        title: 'Websites & Landing Pages',
        desc: 'Transform your online presence with sites that convert visitors into customers. Responsive design, optimized performance, and results-driven from day one.',
        techs: ['React', 'TypeScript', 'Modern CSS'],
      },
      {
        title: 'Web Applications',
        desc: 'Web systems that solve real business problems. Dashboards, automations, and integrations that eliminate bottlenecks and give you real visibility into your processes.',
        techs: ['React', 'Node.js', 'PostgreSQL'],
      },
      {
        title: 'APIs & Backend',
        desc: 'Backends that don\'t stall, APIs that don\'t break. Scalable architecture from day one — security and performance so your application grows without surprises.',
        techs: ['Python', 'Node.js', 'Docker'],
      },
      {
        title: 'Open Source & Consulting',
        desc: '90+ accepted PRs in open source projects. Technical consulting for teams that want quality code, code review, and best practices that actually work.',
        techs: ['Git', 'Code Review', 'Best Practices'],
      },
      {
        title: 'E-commerce & Integrations',
        desc: 'An online store that actually sells. Product catalog, cart, payments, WhatsApp and marketplace integrations — all synced with your POS.',
        techs: ['React', 'OSPOS', 'Mercado Livre'],
      },
      {
        title: 'Custom Systems',
        desc: 'Automation that cuts hours off your day. Dashboards, management systems, and custom processes that eliminate spreadsheets and rework.',
        techs: ['Python', 'FastAPI', 'PostgreSQL'],
      },
    ],
  },
  skills: {
    label: 'Technologies',
    title: 'Skills',
  },
  projetos: {
    label: 'Work',
    title: 'Featured Projects',
    loading: 'Loading projects...',
    verGitHub: 'GitHub',
    visitSite: 'Visit Site',
    wakingServer: 'Waking up server...',
    serverOnline: 'Online',
    serverOffline: 'Offline',
    desktopApp: 'Desktop App',
    serverSleeping: 'Server is asleep. Click to wake up.',
    serverStarting: 'Render is starting the server (~30s)…',
    semDesc: 'Featured portfolio project.',
    destaque: 'Featured project',
    names: {
      PeakVault: 'PeakVault',
      'Cronograma-Projeto': 'Study Schedule',
      'mensageiros-da-esperanca': 'Messengers of Hope',
      Engram: 'Engram',
    },
    desc: {
      PeakVault: 'JSON file analysis and processing system with GUI (CustomTkinter). Handles 10k+ record imports, dynamic CRUD, smart grouping, and graphical visualization.',
      'Cronograma-Projeto': 'Full-stack gamified study schedule system with 12+ modules, progression levels, streaks, and rankings. Python, Flask, PostgreSQL, and Docker.',
      'mensageiros-da-esperanca': 'Web system for NGO management — course registration, 100+ volunteers, digital attendance and dashboard with Firebase. HTML, CSS, JavaScript and Firestore.',
      Engram: 'Multi-agent memory consistency platform. Top contributor — security, CLI, dashboard, Neovim/Slack plugins, and critical conflict engine fixes.',
    },
  },
  experiencia: {
    label: 'Journey',
    title: 'Experience',
    items: [
      {
        cargo: 'Commercial Manager',
        empresa: 'Loja Quase Tudo',
        periodo: '2020 — Present',
        descricao: [
          'Leading the sales team with a focus on results',
          'Strategies to increase revenue and customer loyalty',
          'Migrated ~10k product database between systems',
          'Implemented and customized OSPOS (open source POS) — multiple core improvements',
          'Linux infrastructure (Lubuntu) — local server, database and network administration',
          'E-commerce integrations with open source POS (omnichannel)',
        ],
      },
      {
        cargo: 'Open Source Contributor',
        empresa: 'Engram',
        periodo: 'Apr 2026 — May 2026',
        descricao: [
          'Top Contributor — 90+ merged PRs, 130+ commits',
          'Implemented MINJA security defenses and PII/secret scanner in the memory engine',
          'Built Neovim plugin and Slack bot to query and commit facts directly from editors',
          'Fixed critical conflict detection bugs — eliminated duplicates and resurfacing conflicts',
          'Built CLI commands (setup, verify, status, search, export, conflicts) and full dashboard',
          'Designed memory compression, pinned facts, MCP tools (audit_trail, replay) and Health Score',
          'Authored security architecture, SOC 2 compliance, SSO, data residency and pricing docs',
        ],
      },
    ],
  },
  processo: {
    label: 'How it works',
    title: 'My Process',
    steps: [
      {
        phase: '01',
        title: 'Discovery',
        desc: 'I understand your business, your goals, and the exact problem you need to solve. We walk away with a clear brief and a no-obligation proposal.',
        duration: '1-2 days',
      },
      {
        phase: '02',
        title: 'Build',
        desc: 'I develop in sprints with frequent deliverables. You watch the progress in real time — no surprises, no ghosting.',
        duration: '1-4 weeks',
      },
      {
        phase: '03',
        title: 'Ship & Support',
        desc: 'We go live, configure everything, and I hand over all knowledge. Need ongoing help? I offer monthly maintenance retainers.',
        duration: 'Ongoing',
      },
    ],
  },
  depoimentos: {
    label: 'Testimonials',
    title: 'Who trusted my work',
    items: [
      {
        text: 'On behalf of NGO Messengers of Hope, I want to thank you for building a solution for our registration and attendance records. This is our most important process. It\'s heartwarming to see academic work making a real impact. Thank you for being a problem-solver and gifting us these solutions!',
        name: 'Verônica',
        role: 'NGO Messengers of Hope',
      },
      {
        text: 'Your contributions speak for themselves: 90+ merged PRs, 130+ commits, architecture documentation, SQLite/Postgres conflict fixes, Slack and Neovim integrations — you\'ve been an incredible force on this project. Thank you for everything you\'ve poured into Engram.',
        name: 'Joshua',
        role: 'Founder / Engram',
      },
    ],
  },
  estudosCaso: {
    label: 'Case Studies',
    title: 'Real problems I\'ve solved',
    items: [
      {
        projeto: 'Messengers of Hope',
        problema: 'The NGO struggled to manage course registrations and attendance lists manually. The process relied on paper and spreadsheets with no centralization — causing rework, data loss, and difficulty generating reports.',
        solucao: 'We built a complete web system with Firebase for course management, online enrollment, and digital attendance tracking. Real-time dashboard with full operational visibility.',
        resultado: [
          'Course registration and enrollment 100% digitized',
          'Attendance lists generated automatically',
          'Real-time dashboard for informed decision-making',
          'Drastic reduction in rework and data loss',
        ],
      },
      {
        projeto: 'Engram — Multi-Agent Memory',
        problema: 'Engram needed a contributor to accelerate critical deliveries: memory engine security, CLI, dashboard, and plugins for community tools. There were open bugs in the conflict detector causing duplicates and resurfacing conflicts.',
        solucao: 'Acted as Top Contributor with 90+ merged PRs, implementing security defenses, full CLI, dashboard, Neovim and Slack plugins, and fixing critical conflict engine bugs.',
        resultado: [
          '90+ merged PRs, 130+ commits in 2 months',
          'Hardened security with secret and PII scanner',
          'Developer tools (CLI, Neovim, Slack)',
          'Memory conflicts eliminated — zero duplicates',
          'Architecture documentation and SOC 2 compliance',
        ],
      },
    ],
  },
  precos: {
    label: 'Investment',
    title: 'Plans & Pricing',
    subtitle: 'Fair pricing, fast delivery, no fine print. Every plan includes support during development.',
    items: [
      {
        name: 'Landing Page / Business Site',
        price: '$500',
        period: 'starting at',
        features: [
          'Responsive design (mobile + desktop)',
          'Optimized performance',
          'Contact form',
          'Social media integration',
          'Delivery in 3 to 5 days',
        ],
        highlighted: false,
      },
      {
        name: 'Custom System',
        price: 'from $1,000',
        period: '',
        features: [
          'Authentication & access levels',
          'Admin dashboard',
          'Database + custom API',
          'Can include e-commerce',
          'Built from scratch for your problem',
        ],
        highlighted: true,
      },
      {
        name: 'Support & Maintenance',
        price: '$200',
        period: 'starting at',
        features: [
          'Ongoing maintenance',
          'Weekly backups',
          'Uptime monitoring',
          'Priority support',
          'Security updates',
        ],
        highlighted: false,
      },
    ],
    popular: 'Most Popular',
    selos: [
      { icon: '🚀', text: 'Fast Delivery' },
      { icon: '🤝', text: 'Dedicated Support' },
      { icon: '🔓', text: 'No Lock-in' },
      { icon: '📄', text: 'Open Source' },
    ],
    cta: 'Get a Proposal',
  },
  beneficios: {
    label: 'Why me',
    title: 'Direct with you, from start to finish',
    subtitle: 'No chatbot, no middleman, no empty promises.',
    items: [
      {
        title: 'Fast & fairly priced',
        desc: 'Landing page live in 3 to 5 days from $500. Larger systems quoted per project — you know the cost before we start.',
      },
      {
        title: 'I work with clients worldwide',
        desc: '100% remote. I\'ve worked with clients across Brazil and internationally.',
      },
      {
        title: 'Real support after delivery',
        desc: 'I don\'t vanish after the site goes live. Maintenance plans available and I\'m always around when you need me.',
      },
    ],
    cta: 'Let\'s talk',
  },
  contato: {
    label: 'Get in touch',
    title: 'Contact',
    subtitle: 'Let\'s work together? Reach me through one of the channels below.',
  },
  footer: {
    direitos: 'All rights reserved.',
  },
};

export default en;
