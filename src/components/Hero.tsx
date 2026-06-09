import { FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function Hero() {
  const { t } = useTranslation();

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <span className="hero-badge">
          <FaCheckCircle />
          {t.hero.disponivel}
        </span>

        <span className="hero-tag">{t.hero.tag}</span>

        <h1 className="hero-title">
          {t.hero.title1}{' '}
          <span className="hero-gradient">{t.hero.titleGradient}</span>
          <br />
          {t.hero.title2}
        </h1>

        <p className="hero-subtitle">{t.hero.subtitle}</p>

        <div className="hero-actions">
          <a href="#projetos" className="btn btn-primary">
            {t.hero.ctaProjetos}
          </a>
          <a href="#contato" className="btn btn-outline">
            {t.hero.ctaContato}
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">{t.hero.stat1}</div>
            <div className="hero-stat-label">{t.hero.stat1Label}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">{t.hero.stat2}</div>
            <div className="hero-stat-label">{t.hero.stat2Label}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">{t.hero.stat3}</div>
            <div className="hero-stat-label">{t.hero.stat3Label}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
