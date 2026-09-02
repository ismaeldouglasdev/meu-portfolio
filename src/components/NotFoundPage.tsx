import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">{t.notFound.message}</p>
        <Link to="/" className="btn btn-primary">
          {t.notFound.backHome}
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;