import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useTranslation } from '../i18n';
import { redirectToCheckout } from '../services/stripe';
import CheckoutModal from './CheckoutModal';

type PlanIndex = 0 | 1 | 2;

const PLAN_IDS: Record<PlanIndex, string> = {
  0: 'landing_page',
  1: 'sistema_sob_medida',
  2: 'suporte_manutencao',
};

function Precos() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [buyingIndex, setBuyingIndex] = useState<number | null>(null);

  const handleBuy = async (i: number) => {
    if (i === 1) {
      // Sistema Sob Medida — opens modal first
      setModalOpen(true);
      return;
    }

    setBuyingIndex(i);
    try {
      await redirectToCheckout(PLAN_IDS[i as PlanIndex], 'portfolio_direct');
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err instanceof Error ? err.message : 'Erro ao iniciar pagamento');
    } finally {
      setBuyingIndex(null);
    }
  };

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
              <button
                className="btn btn-primary preco-cta"
                onClick={() => handleBuy(i)}
                disabled={buyingIndex === i}
              >
                {buyingIndex === i ? '...' : t.precos.ctaBuy}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="precos-selos">
        {t.precos.selos.map((selo, i) => (
          <span key={i} className="preco-selo">
            <span className="preco-selo-icon">{selo.icon}</span>
            {selo.text}
          </span>
        ))}
      </div>

      <CheckoutModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

export default Precos;
