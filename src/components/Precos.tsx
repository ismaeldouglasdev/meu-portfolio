import { FaCheck, FaRocket, FaHandshake, FaUnlockAlt, FaFileCode } from 'react-icons/fa';
import { useTranslation } from '../i18n';

const seloIcons = [FaRocket, FaHandshake, FaUnlockAlt, FaFileCode];

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
            {plano.parcelado && (
              <span className="preco-parcelado">{plano.parcelado}</span>
            )}
            <ul className="preco-features">
              {plano.features.map((feat, j) => (
                <li key={j}>
                  <FaCheck aria-hidden="true" /> {feat}
                </li>
              ))}
            </ul>
            <div className="preco-actions">
              <a href="#contato" className="btn btn-outline preco-cta">
                {t.precos.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="precos-selos">
        {t.precos.selos.map((selo, i) => {
          const Icon = seloIcons[i];
          return (
            <span key={i} className="preco-selo">
              <span className="preco-selo-icon">
                <Icon aria-hidden="true" />
              </span>
              {selo.text}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export default Precos;
