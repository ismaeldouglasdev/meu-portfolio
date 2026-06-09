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
    titleGradient: string;
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
  faq: {
    label: string;
    title: string;
    items: Array<{
      q: string;
      a: string;
    }>;
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
    desc: Record<string, string>;
  };
  experiencia: {
    label: string;
    title: string;
    items: Array<{
      cargo: string;
      empresa: string;
      periodo: string;
      descricao: string;
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
