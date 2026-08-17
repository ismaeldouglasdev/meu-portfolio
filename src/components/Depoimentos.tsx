import { FaStar, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from '../i18n';

interface DepoimentosProps {
  onViewCaseStudy?: (slug: string) => void;
}

function Depoimentos({ onViewCaseStudy }: DepoimentosProps) {
  const { t } = useTranslation();

  return (
    <section id="depoimentos">
      <span className="section-label">{t.depoimentos.label}</span>
      <h2>{t.depoimentos.title}</h2>

      <div className="depoimentos-list">
        {t.depoimentos.items.map((item, i) => (
          <div key={i} className="depoimento-card">
            <div className="depoimento-stars" aria-label="5 de 5 estrelas" role="img">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar key={s} aria-hidden="true" />
              ))}
            </div>
            <FaQuoteLeft className="depoimento-quote" aria-hidden="true" />
            <p className="depoimento-text">"{item.text}"</p>
            <div className="depoimento-author">
              <div className="depoimento-avatar" aria-hidden="true">
                {item.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </div>
            {item.caseStudySlug && onViewCaseStudy && (
              <button
                className="caso-link-btn"
                onClick={() => onViewCaseStudy(item.caseStudySlug!)}
              >
                {t.depoimentos.viewCaseStudy} <FaArrowRight />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Depoimentos;
