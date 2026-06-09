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
    title1: 'Turning',
    titleGradient: 'ideas',
    title2: 'into code',
    subtitle:
      'Specialized in building modern web applications with React, TypeScript and Python. Passionate about clean code, open-source, and solutions that make a difference.',
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
    semDesc: 'Featured portfolio project.',
    destaque: 'Featured project',
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
        descricao:
          'Leading the sales team and developing strategies to increase revenue, customer loyalty, and process optimization through technological solutions.',
      },
      {
        cargo: 'Open Source Contributor',
        empresa: 'Engram',
        periodo: '2026 — Present',
        descricao:
          'Top Contributor at Engram. Responsible for developing critical features, code review, and implementing continuous improvements that impact other developers\' workflows.',
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
  faq: {
    label: 'FAQ',
    title: 'Frequently Asked Questions',
    items: [
      {
        q: 'How long does it take to build a website?',
        a: 'A business site or landing page is ready in 3 to 5 days. Web apps and e-commerce take 1 to 4 weeks depending on complexity.',
      },
      {
        q: 'How much does it cost?',
        a: 'Landing pages and business sites start at US$ 300. Web apps and e-commerce are quoted per project — each one has different needs. Reach out and I\'ll prepare a no-obligation proposal.',
      },
      {
        q: 'Do you work with clients outside Brazil?',
        a: 'Absolutely! I work 100% remotely and I\'m fluent in English (C1/C2). I\'ve worked with clients across Brazil and internationally.',
      },
      {
        q: 'I need a custom system, where do I start?',
        a: 'Send me a message on WhatsApp or email. We do a quick 15-minute call to understand your needs and I prepare a tailored proposal.',
      },
    ],
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
