import { FaStar, FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function Depoimentos() {
  const { t } = useTranslation();

  return (
    <>
      <section id="depoimentos">
        <span className="section-label">{t.depoimentos.label}</span>
        <h2>{t.depoimentos.title}</h2>

        <div className="depoimentos-list">
          {t.depoimentos.items.map((item, i) => (
            <div key={i} className="depoimento-card">
              <div className="depoimento-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar key={s} />
                ))}
              </div>
              <FaQuoteLeft className="depoimento-quote" />
              <p className="depoimento-text">"{item.text}"</p>
              <div className="depoimento-author">
                <div className="depoimento-avatar">
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="estudos-caso">
        <span className="section-label">{t.estudosCaso.label}</span>
        <h2>{t.estudosCaso.title}</h2>

        <div className="casos-list">
          {t.estudosCaso.items.map((caso, i) => (
            <div key={i} className="caso-card">
              <h3 className="caso-projeto">{caso.projeto}</h3>
              <div className="caso-section">
                <h4 className="caso-heading caso-heading--problema">Problema</h4>
                <p>{caso.problema}</p>
              </div>
              <div className="caso-section">
                <h4 className="caso-heading caso-heading--solucao">Solução</h4>
                <p>{caso.solucao}</p>
              </div>
              <div className="caso-section">
                <h4 className="caso-heading caso-heading--resultado">Resultado</h4>
                <ul className="caso-resultados">
                  {caso.resultado.map((r, j) => (
                    <li key={j}>
                      <FaCheckCircle /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Depoimentos;
