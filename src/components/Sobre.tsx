import { FaCode, FaUsers, FaRocket } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function Sobre() {
  const { t } = useTranslation();

  const highlights = [
    { icon: <FaCode />, text: t.sobre.highlight1 },
    { icon: <FaUsers />, text: t.sobre.highlight2 },
    { icon: <FaRocket />, text: t.sobre.highlight3 },
  ];

  return (
    <section id="sobre">
      <span className="section-label">{t.sobre.label}</span>
      <h2>{t.sobre.title}</h2>
      <div className="sobre-content">
        <p className="sobre-text">
          {t.sobre.textBefore}
          <strong style={{ color: 'var(--text)' }}>Ismael Douglas</strong>
          {t.sobre.textAfter}
        </p>

        <div className="sobre-highlights">
          {highlights.map((item, i) => (
            <div key={i} className="sobre-highlight">
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Sobre;
