export interface Translation {
  nav: {
    sobre: string;
    servicos: string;
    skills: string;
    projetos: string;
    experiencia: string;
    contato: string;
  };
  hero: {
    tag: string;
    title1: string;
    title2: string;
    disponivel: string;
    phrases: string[];
    subtitle: string;
    ctaProjetos: string;
    ctaContato: string;
    stat1: string;
    stat2: string;
    stat3: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
  };
  sobre: {
    label: string;
    title: string;
    textBefore: string;
    textAfter: string;
    highlight1: string;
    highlight2: string;
    highlight3: string;
  };
  servicos: {
    label: string;
    title: string;
    items: Array<{
      title: string;
      desc: string;
      techs: string[];
    }>;
  };
  processo: {
    label: string;
    title: string;
    steps: Array<{
      phase: string;
      title: string;
      desc: string;
      duration: string;
    }>;
  };
  depoimentos: {
    label: string;
    title: string;
    items: Array<{
      text: string;
      name: string;
      role: string;
    }>;
  };
  estudosCaso: {
    label: string;
    title: string;
    items: Array<{
      projeto: string;
      problema: string;
      solucao: string;
      resultado: string[];
      link?: string;
    }>;
  };
  precos: {
    label: string;
    title: string;
    subtitle: string;
    popular: string;
    items: Array<{
      name: string;
      price: string;
      period: string;
      parcelado?: string;
      features: string[];
      highlighted: boolean;
    }>;
    selos: Array<{
      icon: string;
      text: string;
    }>;
    cta: string;
    ctaBuy: string;
  };
  checkout: {
    modalTitle: string;
    modalSubtitle: string;
    q1Label: string;
    q1Placeholder: string;
    q1Opt1: string;
    q1Opt2: string;
    q1Opt3: string;
    q1Opt4: string;
    q2Label: string;
    q2Placeholder: string;
    q2Opt1: string;
    q2Opt2: string;
    q2Opt3: string;
    q3Label: string;
    q3Placeholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    loading: string;
    modalError: string;
    successTitle: string;
    successMessage: string;
    successClose: string;
  };
  beneficios: {
    label: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
    cta: string;
  };
  skills: {
    label: string;
    title: string;
  };
  projetos: {
    label: string;
    title: string;
    loading: string;
    verGitHub: string;
    visitSite: string;
    wakingServer: string;
    serverOnline: string;
    serverOffline: string;
    semDesc: string;
    destaque: string;
    desktopApp: string;
    serverSleeping: string;
    serverStarting: string;
    desc: Record<string, string>;
    names: Record<string, string>;
  };
  experiencia: {
    label: string;
    title: string;
    items: Array<{
      cargo: string;
      empresa: string;
      periodo: string;
      descricao: string[];
    }>;
  };
  contato: {
    label: string;
    title: string;
    subtitle: string;
  };
  footer: {
    direitos: string;
  };
}
