import { useState, type FormEvent } from 'react';
import { useTranslation } from '../i18n';
import { redirectToCheckout } from '../services/stripe';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { t } = useTranslation();

  const [tipoSistema, setTipoSistema] = useState('');
  const [prazo, setPrazo] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tipoSistema || !prazo || !orcamento || !email) {
      setError(t.checkout.modalError || 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const formData = {
        tipo_sistema: tipoSistema,
        prazo_estimado: prazo,
        orcamento: orcamento,
      };

      await redirectToCheckout('sistema_sob_medida', 'portfolio_modal', email, formData);
      // If we get here without redirecting (dev mode), show confirmation
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="checkout-modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={(e) => { if (e.key === 'Escape' && !loading) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={t.checkout.modalTitle}
    >
      <div className="checkout-modal">
        <button
          className="checkout-modal-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Fechar"
        >
          &times;
        </button>

        {submitted ? (
          <div className="checkout-modal-success">
            <h3>{t.checkout.successTitle}</h3>
            <p>{t.checkout.successMessage}</p>
            <button className="btn btn-primary" onClick={onClose}>
              {t.checkout.successClose}
            </button>
          </div>
        ) : (
          <>
            <h3>{t.checkout.modalTitle}</h3>
            <p className="checkout-modal-subtitle">{t.checkout.modalSubtitle}</p>

            <form onSubmit={handleSubmit}>
              <div className="checkout-field">
                <label htmlFor="tipo-sistema">{t.checkout.q1Label}</label>
                <select
                  id="tipo-sistema"
                  value={tipoSistema}
                  onChange={(e) => setTipoSistema(e.target.value)}
                  required
                >
                  <option value="">{t.checkout.q1Placeholder}</option>
                  <option value="dashboard">{t.checkout.q1Opt1}</option>
                  <option value="api">{t.checkout.q1Opt2}</option>
                  <option value="ecommerce">{t.checkout.q1Opt3}</option>
                  <option value="outro">{t.checkout.q1Opt4}</option>
                </select>
              </div>

              <div className="checkout-field">
                <label htmlFor="prazo">{t.checkout.q2Label}</label>
                <select
                  id="prazo"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  required
                >
                  <option value="">{t.checkout.q2Placeholder}</option>
                  <option value="<1 mes">{t.checkout.q2Opt1}</option>
                  <option value="1-3 meses">{t.checkout.q2Opt2}</option>
                  <option value="flexivel">{t.checkout.q2Opt3}</option>
                </select>
              </div>

              <div className="checkout-field">
                <label htmlFor="orcamento">{t.checkout.q3Label}</label>
                <select
                  id="orcamento"
                  value={orcamento}
                  onChange={(e) => setOrcamento(e.target.value)}
                  required
                >
                  <option value="">{t.checkout.q3Placeholder}</option>
                  <option value="5000">R$ 5.000</option>
                  <option value="10000">R$ 10.000</option>
                  <option value="20000+">R$ 20.000+</option>
                </select>
              </div>

              <div className="checkout-field">
                <label htmlFor="email">{t.checkout.emailLabel}</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.checkout.emailPlaceholder}
                  required
                />
              </div>

              {error && <p className="checkout-error">{error}</p>}

              <button
                type="submit"
                className="btn btn-primary checkout-submit"
                disabled={loading}
              >
                {loading ? t.checkout.loading : t.checkout.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
