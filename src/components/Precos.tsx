import { FaCheck } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function Precos() {
  const { t } = useTranslation();

  return (
    <section id="precos">
      <span className="section-label">{t.precos.label}</span>
      <h2>{t.precos.title}</h2>
      <p className="section-subtitle">{t.precos.subtitle}</p>

      <div className="precos-grid">
        {t.precos.items.map((plano, i) => (
          <div
            key={i}
            className={`preco-card ${plano.highlighted ? 'preco-highlight' : ''}`}
          >
            {plano.highlighted && <span className="preco-badge">{t.precos.popular}</span>}
            <h3>{plano.name}</h3>
            <div className="preco-price">
              <span className="preco-period">{plano.period}</span>
              <span className="preco-value">{plano.price}</span>
            </div>
            <ul className="preco-features">
              {plano.features.map((feat, j) => (
                <li key={j}>
                  <FaCheck /> {feat}
                </li>
              ))}
            </ul>
            <a href="#contato" className="btn btn-primary preco-cta">
              {t.precos.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Precos;
