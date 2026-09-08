import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import PageShell from './PageShell';

function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <PageShell>
      <div className="privacy-page">
        <div className="privacy-container">
          <h1>{t.privacy.title}</h1>
          <p className="privacy-intro">{t.privacy.intro}</p>
          
          <section className="privacy-section">
            <h2>{t.privacy.dataCollectedTitle}</h2>
            <p>{t.privacy.dataCollected}</p>
          </section>

          <section className="privacy-section">
            <h2>{t.privacy.trackersTitle}</h2>
            <p>{t.privacy.trackers}</p>
          </section>

          <section className="privacy-section">
            <h2>{t.privacy.usageTitle}</h2>
            <p>{t.privacy.usage}</p>
          </section>

          <section className="privacy-section">
            <h2>{t.privacy.contactTitle}</h2>
            <p>{t.privacy.contact}</p>
            <p>{t.privacy.cnpj}</p>
          </section>

          <p className="privacy-updated">{t.privacy.lastUpdated}</p>

          <Link to="/" className="btn btn-outline privacy-back-btn">
            {t.privacy.backHome}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

export default PrivacyPolicy;
