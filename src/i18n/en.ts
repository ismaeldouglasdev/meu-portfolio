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
    subtitle:
      'Landing pages, custom web systems and complete e-commerce. From business sites to API integrations — no bullshit, no surprises, no ghosting.',
    ctaProjetos: 'View Projects',
    ctaContato: 'Get in Touch',
    stat1: '2+',
    stat2: '10+',
    stat3: 'Open Source',
    stat1Label: 'Years of Experience',
    stat2Label: 'Projects',
    stat3Label: 'Active Contributor',
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
        desc: 'Creating business websites, landing pages and portfolios with responsive design and optimized performance.',
        techs: ['React', 'TypeScript', 'Modern CSS'],
      },
      {
        title: 'Web Applications',
        desc: 'Building complete web applications with dashboards, authentication, and API integrations.',
        techs: ['React', 'Node.js', 'PostgreSQL'],
      },
      {
        title: 'APIs & Backend',
        desc: 'Developing RESTful APIs and scalable backend services with focus on security and performance.',
        techs: ['Python', 'Node.js', 'Docker'],
      },
      {
        title: 'Open Source & Consulting',
        desc: 'Contributing to open-source projects, code review, and technical consulting for development teams.',
        techs: ['Git', 'Code Review', 'Best Practices'],
      },
      {
        title: 'E-commerce & Integrations',
        desc: 'Complete online store with product catalog, shopping cart, payments, and WhatsApp & marketplace integration.',
        techs: ['React', 'OSPOS', 'Mercado Livre'],
      },
      {
        title: 'Custom Systems',
        desc: 'Process automation, management dashboards, and tailor-made business management systems.',
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
      PeakVault: 'JSON file analysis and processing system with GUI (CustomTkinter). Dynamic CRUD, grouping, and graphical visualization.',
      'Cronograma-Projeto': 'Full-stack gamified study schedule system with levels, progression, and streaks. Python, Flask, PostgreSQL, and Docker.',
      'mensageiros-da-esperanca': 'Web system for NGO management — course registration, enrollments, digital attendance and dashboard with Firebase. HTML, CSS, JavaScript and Firestore.',
      Engram: 'Multi-agent memory consistency platform. Top contributor — developed critical features, code review, and continuous improvements.',
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
          'Process optimization through technological solutions',
        ],
      },
      {
        cargo: 'Open Source Contributor',
        empresa: 'Engram',
        periodo: '2026 — Present',
        descricao: [
          'Top Contributor — 90+ merged PRs, 130+ commits',
          'Critical feature development and code review',
          'Architecture documentation and continuous improvements',
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
  precos: {
    label: 'Investment',
    title: 'Plans & Pricing',
    subtitle: 'Fair pricing, fast delivery, no fine print. Every plan includes support during development.',
    items: [
      {
        name: 'Landing Page / Business Site',
        price: '$300',
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
        price: 'Get a quote',
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
        price: '$100',
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
    cta: 'Get a Proposal',
  },
  beneficios: {
    label: 'Why me',
    title: 'Direct with you, from start to finish',
    subtitle: 'No chatbot, no middleman, no empty promises.',
    items: [
      {
        title: 'Fast & fairly priced',
        desc: 'Landing page live in 3 to 5 days from $300. Larger systems quoted per project — you know the cost before we start.',
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
