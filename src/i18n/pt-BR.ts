import type { Translation } from './types';

const ptBR: Translation = {
  nav: {
    sobre: 'Sobre',
    servicos: 'Serviços',
    skills: 'Habilidades',
    projetos: 'Projetos',
    experiencia: 'Experiência',
    contato: 'Contato',
  },
  hero: {
    tag: 'Desenvolvedor Full Stack',
    title1: 'Sites, sistemas e APIs',
    title2: 'que fazem seu negócio rodar',
    subtitle:
      'Landing pages, sistemas web sob medida e e-commerce completos. Da página institucional à integração com APIs — sem enrolação, sem surpresas, sem ghosting.',
    ctaProjetos: 'Ver Projetos',
    ctaContato: 'Entrar em Contato',
    stat1: '2+',
    stat2: '10+',
    stat3: 'Open Source',
    stat1Label: 'Anos de Experiência',
    stat2Label: 'Projetos',
    stat3Label: 'Contribuidor Ativo',
  },
  sobre: {
    label: 'Sobre',
    title: 'Quem sou',
    textBefore: 'Prazer! Sou ',
    textAfter: ', desenvolvedor Full Stack com paixão por criar soluções práticas e eficientes. Atualmente focado em tecnologias como JavaScript, Python, TypeScript e React, estou sempre aprendendo e contribuindo em projetos open-source.',
    highlight1: 'Desenvolvedor Full Stack',
    highlight2: 'Contribuidor Open Source',
    highlight3: 'Soluções Criativas',
  },
  servicos: {
    label: 'O que eu faço',
    title: 'Serviços',
    items: [
      {
        title: 'Sites & Landing Pages',
        desc: 'Criação de sites institucionais, landing pages e portfólios com design responsivo e performance otimizada.',
        techs: ['React', 'TypeScript', 'CSS Moderno'],
      },
      {
        title: 'Aplicações Web',
        desc: 'Desenvolvimento de aplicações web completas com dashboards, autenticação e integração com APIs.',
        techs: ['React', 'Node.js', 'PostgreSQL'],
      },
      {
        title: 'APIs & Backend',
        desc: 'Construção de APIs RESTful e serviços backend escaláveis com foco em segurança e desempenho.',
        techs: ['Python', 'Node.js', 'Docker'],
      },
      {
        title: 'Open Source & Consultoria',
        desc: 'Contribuição em projetos open-source, code review e consultoria técnica para times de desenvolvimento.',
        techs: ['Git', 'Code Review', 'Boas Práticas'],
      },
      {
        title: 'E-commerce & Integrações',
        desc: 'Loja virtual completa com catálogo online, carrinho de compras, pagamentos e integração com WhatsApp e marketplaces.',
        techs: ['React', 'OSPOS', 'Mercado Livre'],
      },
      {
        title: 'Sistemas Sob Medida',
        desc: 'Automação de processos, dashboards gerenciais, sistemas de gestão personalizados para seu negócio.',
        techs: ['Python', 'FastAPI', 'PostgreSQL'],
      },
    ],
  },
  skills: {
    label: 'Tecnologias',
    title: 'Habilidades',
  },
  projetos: {
    label: 'Trabalhos',
    title: 'Projetos em Destaque',
    loading: 'Carregando projetos...',
    verGitHub: 'GitHub',
    visitSite: 'Visitar Site',
    wakingServer: 'Acordando servidor...',
    serverOnline: 'Online',
    serverOffline: 'Offline',
    desktopApp: 'Desktop App',
    serverSleeping: 'Servidor dormindo. Clique para acordar.',
    serverStarting: 'Render está iniciando o servidor (~30s)…',
    semDesc: 'Projeto em destaque no portfólio.',
    destaque: 'Projeto em destaque',
    names: {
      PeakVault: 'PeakVault',
      'Cronograma-Projeto': 'Cronograma de Estudos',
      'mensageiros-da-esperanca': 'Mensageiros da Esperança',
      Engram: 'Engram',
    },
    desc: {
      PeakVault: 'Sistema de análise e processamento de arquivos JSON com interface gráfica (CustomTkinter). CRUD dinâmico, agrupamento e visualização gráfica.',
      'Cronograma-Projeto': 'Sistema full-stack de cronograma de estudos gamificado com níveis, progressão e streaks. Python, Flask, PostgreSQL e Docker.',
      'mensageiros-da-esperanca': 'Sistema web para gestão de ONG — cadastro de cursos, inscrições, presença digital e dashboard com Firebase. HTML, CSS, JavaScript e Firestore.',
      Engram: 'Plataforma de consistência de memória multi-agente. Top contributor — desenvolvimento de funcionalidades críticas, code review e melhorias contínuas.',
    },
  },
  experiencia: {
    label: 'Trajetória',
    title: 'Experiência',
    items: [
      {
        cargo: 'Encarregado no setor Comercial',
        empresa: 'Loja Quase Tudo',
        periodo: '2020 — Presente',
        descricao: [
          'Liderança da equipe comercial com foco em resultados',
          'Estratégias para aumento de vendas e fidelização de clientes',
          'Otimização de processos via soluções tecnológicas',
        ],
      },
      {
        cargo: 'Contribuidor Open Source',
        empresa: 'Engram',
        periodo: '2026 — Presente',
        descricao: [
          'Top Contributor — 90+ PRs mesclados, 130+ commits',
          'Desenvolvimento de features críticas e code review',
          'Documentação de arquitetura e melhorias contínuas',
        ],
      },
    ],
  },
  processo: {
    label: 'Como funciona',
    title: 'Meu Processo',
    steps: [
      {
        phase: '01',
        title: 'Descoberta',
        desc: 'Entendo seu negócio, seus objetivos e o problema exato que precisa resolver. Saímos com um briefing claro e uma proposta sem compromisso.',
        duration: '1-2 dias',
      },
      {
        phase: '02',
        title: 'Construção',
        desc: 'Desenvolvo em sprints com entregas frequentes. Você acompanha o progresso em tempo real — sem surpresas, sem ghosting.',
        duration: '1-4 semanas',
      },
      {
        phase: '03',
        title: 'Entrega & Suporte',
        desc: 'Publicamos, configuramos tudo e faço a transferência de conhecimento. Se precisar, continuo com suporte mensal.',
        duration: 'Contínuo',
      },
    ],
  },
  depoimentos: {
    label: 'Depoimentos',
    title: 'Quem confiou no meu trabalho',
    items: [
      {
        text: 'Quero em nome da ONG Mensageiros da Esperança agradecer pelo apoio na construção de uma solução para nossos cadastros e listas de presença. Esse é o nosso processo mais importante. É bom saber que um trabalho acadêmico pode impactar vidas. Gratidão por ser um solucionador da Esperança e nos presentear com essas soluções!',
        name: 'Verônica',
        role: 'ONG Mensageiros da Esperança',
      },
      {
        text: 'Suas contribuições falam por si: 90+ PRs mesclados, 130+ commits, documentação de arquitetura, correções de conflitos SQLite/Postgres, integrações Slack e Neovim — você tem sido uma força incrível neste projeto. Obrigado por tudo que você investiu no Engram.',
        name: 'Joshua',
        role: 'Fundador / Engram',
      },
    ],
  },
  precos: {
    label: 'Investimento',
    title: 'Planos & Preços',
    subtitle: 'Preço justo, entregas rápidas e sem letras miúdas. Cada plano inclui suporte durante o desenvolvimento.',
    items: [
      {
        name: 'Landing Page / Site',
        price: 'R$ 1.500',
        period: 'a partir de',
        features: [
          'Design responsivo (celular + desktop)',
          'Performance otimizada',
          'Formulário de contato',
          'Integração com redes sociais',
          'Entrega em 3 a 5 dias',
        ],
        highlighted: false,
      },
      {
        name: 'Sistema Sob Medida',
        price: 'Sob consulta',
        period: '',
        features: [
          'Autenticação e níveis de acesso',
          'Dashboard administrativo',
          'Banco de dados + API própria',
          'Pode incluir e-commerce',
          'Feito do zero pro seu problema',
        ],
        highlighted: true,
      },
      {
        name: 'Suporte & Manutenção',
        price: 'R$ 400',
        period: 'a partir de',
        features: [
          'Manutenção contínua',
          'Backups semanais',
          'Monitoramento de disponibilidade',
          'Suporte prioritário',
          'Atualizações de segurança',
        ],
        highlighted: false,
      },
    ],
    popular: 'Mais Popular',
    cta: 'Solicitar Proposta',
  },
  beneficios: {
    label: 'Por que me escolher',
    title: 'Direto com você, do começo ao fim',
    subtitle: 'Sem chatbot, sem intermediate, sem promessa vazia.',
    items: [
      {
        title: 'Rápido e preço justo',
        desc: 'Landing page no ar em 3 a 5 dias a partir de R$ 1.500. Sistemas maiores sob consulta — você sabe o valor antes de começar.',
      },
      {
        title: 'Atendo o Brasil todo (e fora dele)',
        desc: '100% remoto. Já atendi clientes de várias regiões do Brasil e também em inglês para clientes internacionais.',
      },
      {
        title: 'Suporte de verdade depois da entrega',
        desc: 'Não sumo depois que o site vai ao ar. Ofereço planos de manutenção contínua e suporte sempre que precisar.',
      },
    ],
    cta: 'Vamos conversar',
  },
  contato: {
    label: 'Entre em contato',
    title: 'Contato',
    subtitle: 'Vamos trabalhar juntos? Me chama em um dos canais abaixo.',
  },
  footer: {
    direitos: 'Todos os direitos reservados.',
  },
};

export default ptBR;
