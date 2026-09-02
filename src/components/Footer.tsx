import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';

function Footer() {
  const { t } = useTranslation();
  const ano = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {ano} Ismael Douglas. {t.footer.direitos}</p>
      <p className="footer-cnpj">{t.privacy.cnpj}</p>
      <div className="footer-links">
        <Link to="/privacidade" className="footer-privacidade-link">
          {t.footer.privacidade}
        </Link>
        <a href="https://github.com/ismaeldouglasdev" target="_blank" rel="noopener noreferrer" aria-label="GitHub (abre em nova aba)">
          <FaGithub aria-hidden="true" />
        </a>
        <a href="https://linkedin.com/in/ismael-douglas-dev" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (abre em nova aba)">
          <FaLinkedin aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
