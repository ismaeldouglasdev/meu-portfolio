import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from '../i18n';

interface CaseStudyPageProps {
  slug: string;
  onBack: () => void;
}

function CaseStudyPage({ slug, onBack }: CaseStudyPageProps) {
  const { t } = useTranslation();

  const caso = t.estudosCaso?.items?.find((c) => c.slug === slug);

  if (!caso) {
    return (
      <div className="caso-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 className="caso-page-title">{t.estudosCaso.notFound}</h1>
        <button className="btn btn-outline" onClick={onBack}>
          ← {t.estudosCaso.back}
        </button>
      </div>
    );
  }

  return (
    <div className="caso-page">
      <article className="caso-page-container">
        <button className="caso-page-back" onClick={onBack}>
          <FaArrowLeft /> {t.estudosCaso.back}
        </button>

        <h1 className="caso-page-title">{caso.projeto}</h1>

        <div className="caso-page-section">
          <h2 className="caso-heading caso-heading--problema">{t.estudosCaso.headingProblem}</h2>
          <p>{caso.problema}</p>
        </div>

        <div className="caso-page-section">
          <h2 className="caso-heading caso-heading--solucao">{t.estudosCaso.headingSolution}</h2>
          <p>{caso.solucao}</p>
        </div>

        <div className="caso-page-section">
          <h2 className="caso-heading caso-heading--resultado">{t.estudosCaso.headingResult}</h2>
          <ul className="caso-page-resultados">
            {caso.resultado.map((r, j) => (
              <li key={j}>
                <FaCheckCircle /> {r}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}

export default CaseStudyPage;
