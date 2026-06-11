import { useTranslation } from '../i18n';

function Experiencia() {
  const { t } = useTranslation();

  return (
    <section id="experiencia">
      <h2 className="exp-title">{t.experiencia.title}</h2>

      <div className="exp-timeline">
        {t.experiencia.items.map((exp, i) => (
          <div key={i} className="exp-entry">
            <div className="exp-dot" />
            <div className="exp-content">
              <h3 className="exp-cargo">{exp.cargo}</h3>
              <p className="exp-meta">{exp.empresa} • {exp.periodo}</p>
              <ul className="exp-desc">
                {exp.descricao.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experiencia;
