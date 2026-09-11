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
    viewCaseStudy: string;
    items: Array<{
      text: string;
      name: string;
      role: string;
      caseStudySlug?: string;
    }>;
  };
  estudosCaso: {
    label: string;
    title: string;
    back: string;
    notFound: string;
    headingProblem: string;
    headingSolution: string;
    headingResult: string;
    items: Array<{
      slug: string;
      projeto: string;
      problema: string;
      solucao: string;
      resultado: string[];
      link?: string;
    }>;
  };
  cta: string;
  beneficios: {
    label: string;
    title: string;
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
    serverSleeping: string;
    serverStarting: string;
    semDesc: string;
    destaque: string;
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
    whatsappMsg: string;
    skipLink: string;
    quiz: {
      title: string;
      step: string;
      btnBack: string;
      btnNext: string;
      btnComplete: string;
      btnReset: string;
      navHint: string;
      btnWhatsApp: string;
      btnEmail: string;
      verifyLabel: string;
      verifying: string;
      verified: string;
      verifyError: string;
      questions: {
        projeto: { title: string; options: string[] };
        orcamento: { title: string; options: string[] };
        prazo: { title: string; options: string[] };
        mensagem: { title: string; placeholder: string };
        captura: { title: string; namePlaceholder: string; contactPlaceholder: string };
      };
      summary: { title: string; service: string; reset: string };
      whatsappMessage: string;
      emailSubject: string;
      mensagemLabel: string;
    };
  };
  footer: {
    direitos: string;
    privacidade: string;
  };
  privacy: {
    title: string;
    intro: string;
    dataCollectedTitle: string;
    dataCollected: string;
    trackersTitle: string;
    trackers: string;
    usageTitle: string;
    usage: string;
    contactTitle: string;
    contact: string;
    cnpj: string;
    lastUpdated: string;
    backHome: string;
  };
  notFound: {
    message: string;
    backHome: string;
  };
  blog: {
    label: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchBtn: string;
    langLabel: string;
    categoriesLabel: string;
    recentLabel: string;
    backToPortfolio: string;
    portfolioLink: string;
    loading: string;
    emptyTitle: string;
    emptyDesc: string;
    readArticle: string;
    paginationPrev: string;
    paginationNext: string;
    shareLabel: string;
    tocLabel: string;
    glossaryLabel: string;
    faqLabel: string;
    backToBlog: string;
    notFound: string;
    readingTime: string;
    copyBtn: string;
    copiedBtn: string;
    likeLabel: string;
    likedLabel: string;
    feedbackUpLabel: string;
    feedbackDownLabel: string;
    feedbackThanks: string;
    writtenBy: string;
    aboutAuthorTitle: string;
    aboutAuthorBio: string;
    aboutAuthorCta: string;
    sourcesTitle: string;
    toggleTheme: string;
    documentTitle: string;
    categoriesTutorial: string;
    categoriesArticle: string;
    categoriesCuriosity: string;
    categoriesTrend: string;
    categoriesNews: string;
    categoriesCaseStudy: string;
    commentsTitle: string;
    commentsPlaceholder: string;
    commentsAuthorPlaceholder: string;
    commentsEmailPlaceholder: string;
    commentsSubmit: string;
    commentsSubmitting: string;
    commentsSuccess: string;
    commentsError: string;
    commentsEmpty: string;
    commentsCharCount: string;
    commentsAuthorCharCount: string;
    likeCount: string;
    tags: Record<string, string>;
  };
}
