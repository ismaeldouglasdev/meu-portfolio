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
    title1: 'Transformando',
    titleGradient: 'ideias',
    title2: 'em código',
    subtitle:
      'Especializado em criar aplicações web modernas com React, TypeScript e Python. Apaixonado por código limpo, open-source e soluções que fazem a diferença.',
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
    semDesc: 'Projeto em destaque no portfólio.',
    destaque: 'Projeto em destaque',
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
        descricao:
          'Responsável por liderar a equipe comercial e desenvolver estratégias para aumentar as vendas, fidelização de clientes e otimização de processos por meio de soluções tecnológicas.',
      },
      {
        cargo: 'Contribuidor Open Source',
        empresa: 'Engram',
        periodo: '2026 — Presente',
        descricao:
          'Top Contributor do projeto Engram. Responsável pelo desenvolvimento de features críticas, code review e implementação de melhorias contínuas, impactando o fluxo de trabalho de outros desenvolvedores.',
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
  faq: {
    label: 'Dúvidas',
    title: 'Perguntas Frequentes',
    items: [
      {
        q: 'Quanto tempo leva para fazer um site?',
        a: 'Site institucional ou landing page fica pronto em 3 a 5 dias. Sistemas web e e-commerce levam de 1 a 4 semanas dependendo da complexidade.',
      },
      {
        q: 'Quanto custa?',
        a: 'Landing pages e sites institucionais a partir de R$ 1.500. Sistemas web e e-commerce sob consulta — cada projeto tem necessidades diferentes. Me chama que faço uma proposta sem compromisso.',
      },
      {
        q: 'Atende empresas de outros estados?',
        a: 'Sim! Trabalho 100% remoto. Já atendi clientes de várias regiões do Brasil. Também atendo clientes internacionais (falando inglês fluente).',
      },
      {
        q: 'Preciso de um sistema sob medida, como começo?',
        a: 'Me chama no WhatsApp ou email. Fazemos uma call rápida de 15 minutos para entender sua necessidade e eu preparo uma proposta personalizada.',
      },
    ],
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
