import { FaLightbulb, FaCode, FaRocket } from 'react-icons/fa';
import { useTranslation } from '../i18n';

const phaseIcons = [<FaLightbulb />, <FaCode />, <FaRocket />];

function Processo() {
  const { t } = useTranslation();

  return (
    <section id="processo">
      <span className="section-label">{t.processo.label}</span>
      <h2>{t.processo.title}</h2>

      <div className="processo-grid">
        {t.processo.steps.map((step, i) => (
          <div key={i} className="processo-card">
            <div className="processo-phase">{step.phase}</div>
            <div className="processo-icon">{phaseIcons[i]}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            <span className="processo-duration">{step.duration}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Processo;
