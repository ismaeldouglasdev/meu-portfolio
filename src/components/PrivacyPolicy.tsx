import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';

function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <h1>{t.privacy.title}</h1>
        <p className="privacy-intro">{t.privacy.intro}</p>
        
        <section className="privacy-section">
          <h2>Dados Coletados / Data Collected</h2>
          <p>{t.privacy.dataCollected}</p>
        </section>

        <section className="privacy-section">
          <h2>Rastreamento / Tracking</h2>
          <p>{t.privacy.trackers}</p>
        </section>

        <section className="privacy-section">
          <h2>Uso dos Dados / Data Usage</h2>
          <p>{t.privacy.usage}</p>
        </section>

        <section className="privacy-section">
          <h2>Contato / Contact</h2>
          <p>{t.privacy.contact}</p>
          <p>{t.privacy.cnpj}</p>
        </section>

        <p className="privacy-updated">{t.privacy.lastUpdated}</p>

        <Link to="/" className="btn btn-outline privacy-back-btn">
          {t.privacy.backHome}
        </Link>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
