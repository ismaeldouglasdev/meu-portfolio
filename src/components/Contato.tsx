import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '../i18n';

const contatos = [
  { icon: <FaGithub />, label: 'GitHub', href: 'https://github.com/ismaeldouglasdev' },
  { icon: <FaLinkedin />, label: 'LinkedIn', href: 'https://linkedin.com/in/ismaeldouglasdev' },
  { icon: <FaEnvelope />, label: 'Email', href: 'mailto:y2kgif@gmail.com' },
  { icon: <FaWhatsapp />, label: 'WhatsApp', href: 'https://wa.me/5511959873202' },
];

function Contato() {
  const { t } = useTranslation();

  return (
    <section id="contato">
      <span className="section-label">{t.contato.label}</span>
      <h2>{t.contato.title}</h2>
      <p style={{ textAlign: 'center', maxWidth: 500, margin: '-1rem auto 1rem' }}>
        {t.contato.subtitle}
      </p>
      <div className="contato-grid">
        {contatos.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contato-link"
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
