import { FaRocket, FaDollarSign, FaGlobeAmericas, FaHeadset } from 'react-icons/fa';
import { useTranslation } from '../i18n';

const icons = [<FaRocket />, <FaDollarSign />, <FaGlobeAmericas />, <FaHeadset />];

function Beneficios() {
  const { t } = useTranslation();

  return (
    <section id="beneficios">
      <span className="section-label">{t.beneficios.label}</span>
      <h2>{t.beneficios.title}</h2>
      <p className="section-subtitle">{t.beneficios.subtitle}</p>

      <div className="beneficios-grid">
        {t.beneficios.items.map((item, i) => (
          <div key={i} className="beneficio-card">
            <div className="beneficio-icon">{icons[i]}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Beneficios;
