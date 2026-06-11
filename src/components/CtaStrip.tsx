import { useTranslation } from '../i18n';

function CtaStrip() {
  const { t } = useTranslation();

  return (
    <section className="cta-strip">
      <a href="#contato" className="btn btn-primary btn-lg">
        {t.beneficios.cta} →
      </a>
    </section>
  );
}

export default CtaStrip;
