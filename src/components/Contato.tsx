import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '../i18n';
import QuizLead from './QuizLead';

function Contato() {
  const { t } = useTranslation();

  const contatos = [
    { icon: <FaGithub aria-hidden="true" />, label: 'GitHub', href: 'https://github.com/ismaeldouglasdev' },
    { icon: <FaLinkedin aria-hidden="true" />, label: 'LinkedIn', href: 'https://linkedin.com/in/ismael-douglas-dev' },
    { icon: <FaEnvelope aria-hidden="true" />, label: 'Email', href: 'mailto:contact@ismaeltech.com' },
    { icon: <FaWhatsapp aria-hidden="true" />, label: 'WhatsApp', href: `https://wa.me/5511959873202?text=${encodeURIComponent(t.contato.whatsappMsg)}` },
  ];

  return (
    <section id="contato">
      <span className="section-label">{t.contato.label}</span>
      <h2>{t.contato.title}</h2>
      <p style={{ textAlign: 'center', maxWidth: 500, margin: '-1rem auto 1rem' }}>
        {t.contato.subtitle}
      </p>
      <QuizLead />
      <div className="contato-grid">
        {contatos.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contato-link"
            aria-label={`${c.label} (abre em nova aba)`}
          >
            {c.icon}
            {c.label}
          </a>
        ))}
      </div>
    </section>
  );
}

export default Contato;
