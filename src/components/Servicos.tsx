import { FaGlobe, FaMobileAlt, FaCogs, FaGitAlt, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { useTranslation } from '../i18n';

const icons = [<FaGlobe />, <FaMobileAlt />, <FaCogs />, <FaGitAlt />, <FaShoppingCart />, <FaChartLine />];

function Servicos() {
  const { t } = useTranslation();

  return (
    <section id="servicos">
      <span className="section-label">{t.servicos.label}</span>
      <h2>{t.servicos.title}</h2>

      <div className="servicos-grid">
        {t.servicos.items.map((servico, i) => (
          <div key={i} className="servico-card">
            <div className="servico-icon">{icons[i]}</div>
            <h3>{servico.title}</h3>
            <p>{servico.desc}</p>
            <div className="servico-techs">
              {servico.techs.map((tech, j) => (
                <span key={j}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Servicos;
