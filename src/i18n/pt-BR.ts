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
    phrases: [
      'Sites, sistemas e APIs\nque fazem seu negócio rodar',
      'Código que resolve\nda primeira à última linha',
      'Open Source na prática\ncontribuindo com a comunidade',
      'Soluções sob medida\nque crescem com você',
    ],
    subtitle:
      'Landing pages, sistemas web sob medida e e-commerce completos. Da página institucional à integração com APIs — sem enrolação, sem surpresas, sem ghosting.',
    ctaProjetos: 'Ver Projetos',
    ctaContato: 'Entrar em Contato',
    stat1: 'Top Contributor',
    stat2: '20+',
    stat3: 'Desde 2024',
    stat1Label: 'Open Source',
    stat2Label: 'Projetos',
    stat3Label: 'Construindo Software',
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
        desc: 'Transforme sua presença online com sites que convertem visitantes em clientes. Design responsivo, performance otimizada e foco em resultados.',
        techs: ['React', 'TypeScript', 'CSS Moderno'],
      },
      {
        title: 'Aplicações Web',
        desc: 'Sistemas web que resolvem problemas reais do seu negócio. Dashboards, automações e integrações que eliminam gargalos e dão visibilidade real dos seus processos.',
        techs: ['React', 'Node.js', 'PostgreSQL'],
      },
      {
        title: 'APIs & Backend',
        desc: 'Backends que não travam, APIs que não quebram. Arquitetura escalável desde o primeiro deploy — segurança e desempenho para sua aplicação crescer sem sustos.',
        techs: ['Python', 'Node.js', 'Docker'],
      },
      {
        title: 'Open Source & Consultoria',
        desc: '90+ PRs aceitos em projetos open source. Consultoria técnica para times que querem código de qualidade, code review e boas práticas que funcionam na prática.',
        techs: ['Git', 'Code Review', 'Boas Práticas'],
      },
      {
        title: 'E-commerce & Integrações',
        desc: 'Loja virtual que realmente vende. Catálogo online, carrinho, pagamentos, WhatsApp e marketplaces integrados — tudo sincronizado com seu PDV.',
        techs: ['React', 'OSPOS', 'Mercado Livre'],
      },
      {
        title: 'Sistemas Sob Medida',
        desc: 'Automação que corta horas do seu dia. Dashboards, sistemas de gestão e processos personalizados que eliminam planilhas e retrabalho.',
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
      PeakVault: 'Sistema de análise e processamento de JSON com interface gráfica (CustomTkinter). Importação de 10k+ registros, CRUD dinâmico, agrupamento inteligente e visualização gráfica.',
      'Cronograma-Projeto': 'Sistema full-stack de cronograma de estudos gamificado com 12+ módulos, níveis de progressão, streaks e ranking. Python, Flask, PostgreSQL e Docker.',
      'mensageiros-da-esperanca': 'Sistema web para gestão de ONG — cadastro de cursos, 100+ voluntários, presença digital e dashboard com Firebase. HTML, CSS, JavaScript e Firestore.',
      Engram: 'Plataforma de consistência de memória multi-agente. Top contributor — segurança, CLI, dashboard, plugins Neovim/Slack e correções críticas no motor de conflitos.',
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
          'Migrei banco de dados com ~10k produtos entre sistemas',
          'Implementei e customizei o OSPOS (sistema open source de PDV) — diversas melhorias no core',
          'Infraestrutura Linux (Lubuntu) — administração de servidor local, banco e redes',
          'Integrações de e-commerce com PDV open source (omnichannel)',
        ],
      },
      {
        cargo: 'Contribuidor Open Source',
        empresa: 'Engram',
        periodo: 'Abr 2026 — Mai 2026',
        descricao: [
          'Top Contributor — 90+ PRs mesclados, 130+ commits',
          'Implementei defesas de segurança MINJA e scanner de segredos/PII no motor de memória',
          'Criei plugin Neovim e bot Slack para consultar e comitar facts diretamente dos editores',
          'Corrigi bugs críticos no detector de conflitos — eliminava duplicatas e conflitos reabertos',
          'Construí CLI commands (setup, verify, status, search, export, conflicts) e dashboard completo',
          'Projetei compressão de memória, pinned facts, MCP tools (audit_trail, replay) e Health Score',
          'Documentei arquitetura de segurança, compliance SOC 2, SSO, data residency e pricing',
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
  estudosCaso: {
    label: 'Estudos de Caso',
    title: 'Problemas que resolvi na prática',
    items: [
      {
        projeto: 'Mensageiros da Esperança',
        problema: 'A ONG enfrentava dificuldades para gerenciar cadastros de cursos e listas de presença manualmente. O processo era feito em papel e planilhas, sem centralização — gerava retrabalho, perda de dados e dificuldade de gerar relatórios.',
        solucao: 'Desenvolvemos um sistema web completo com Firebase para gerenciamento de cursos, inscrições online e registro de presença digital. Dashboard em tempo real com visibilidade total das operações.',
        resultado: [
          'Cadastro de cursos e inscrições 100% digitalizados',
          'Listas de presença emitidas automaticamente',
          'Dashboard com dados em tempo real para tomada de decisão',
          'Redução drástica de retrabalho e perda de dados',
        ],
      },
      {
        projeto: 'Engram — Multi-Agent Memory',
        problema: 'O projeto precisava acelerar entregas críticas: segurança do motor de memória, CLI, dashboard e plugins para ferramentas da comunidade. Havia bugs abertos no detector de conflitos que causavam duplicatas e conflitos reabertos.',
        solucao: 'Atuei como Top Contributor com 90+ PRs mesclados, implementando defesas de segurança, CLI completa, dashboard, plugins Neovim e Slack, e corrigindo bugs críticos no motor de conflitos.',
        resultado: [
          '90+ PRs mesclados, 130+ commits em 2 meses',
          'Segurança reforçada com scanner de segredos e PII',
          'Ferramentas para desenvolvedores (CLI, Neovim, Slack)',
          'Conflitos de memória eliminados — zero duplicatas',
          'Documentação de arquitetura e compliance SOC 2',
        ],
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
        price: 'R$ 2.500',
        period: 'a partir de',
        parcelado: 'ou 12x R$ 249',
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
        price: 'a partir de R$ 5.000',
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
        price: 'R$ 600',
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
    selos: [
      { icon: '🚀', text: 'Entrega Rápida' },
      { icon: '🤝', text: 'Suporte Dedicado' },
      { icon: '🔓', text: 'Contrato Flexível' },
      { icon: '📄', text: 'Código Aberto' },
    ],
    cta: 'Solicitar Proposta',
  },
  beneficios: {
    label: 'Por que me escolher',
    title: 'Direto com você, do começo ao fim',
    subtitle: 'Sem chatbot, sem intermediate, sem promessa vazia.',
    items: [
      {
        title: 'Rápido e preço justo',
        desc: 'Landing page no ar em 3 a 5 dias a partir de R$ 2.500. Sistemas maiores sob consulta — você sabe o valor antes de começar.',
      },
      {
        title: 'Atendo o Brasil todo (e fora dele)',
        desc: '100% remoto. Já atendi clientes de várias regiões do Brasil e do exterior.',
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
