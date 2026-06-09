import { useTranslation } from '../i18n';

function Experiencia() {
  const { t } = useTranslation();

  return (
    <section id="experiencia">
      <span className="section-label">{t.experiencia.label}</span>
      <h2>{t.experiencia.title}</h2>
      <div className="experiencia-list">
        {t.experiencia.items.map((exp, i) => (
          <div key={i} className="experiencia-card">
            <h3>{exp.cargo}</h3>
            <div className="experiencia-meta">
              {exp.empresa} • {exp.periodo}
            </div>
            <p>{exp.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experiencia;
