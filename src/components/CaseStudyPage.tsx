import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from '../i18n';

interface CaseStudyPageProps {
  slug: string;
  onBack: () => void;
}

function CaseStudyPage({ slug, onBack }: CaseStudyPageProps) {
  const { t } = useTranslation();
  
  console.log('[CaseStudyPage] slug:', slug);
  console.log('[CaseStudyPage] t keys:', Object.keys(t));
  console.log('[CaseStudyPage] t.estudosCaso:', t.estudosCaso);
  console.log('[CaseStudyPage] t.estudosCaso?.items:', t.estudosCaso?.items);
  console.log('[CaseStudyPage] t.estudosCaso?.items?.[0]:', t.estudosCaso?.items?.[0]);
  console.log('[CaseStudyPage] t keys:', Object.keys(t));
  
  const caso = t.estudosCaso?.items?.find((c) => c.slug === slug);
  
  console.log('[CaseStudyPage] caso found:', caso);
  
  if (!caso) {
    return (
      <div className="caso-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 className="caso-page-title">Debug: Estudo de caso não encontrado</h1>
        <pre style={{ textAlign: 'left', maxWidth: '800px', margin: '1rem auto', background: '#f5f5f5', padding: '1rem', color: '#333', fontSize: '0.85rem' }}>
          {JSON.stringify({ 
            slug, 
            availableSlugs: t.estudosCaso?.items?.map(c => c.slug),
            tKeys: Object.keys(t),
            tHasEstudosCaso: !!t.estudosCaso,
            itemsLength: t.estudosCaso?.items?.length
          }, null, 2)}
        </pre>
        <button className="btn btn-outline" onClick={onBack}>
          ← Voltar
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
