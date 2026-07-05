import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function Footer() {
  const { t } = useTranslation();
  const ano = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {ano} Ismael Douglas. {t.footer.direitos}</p>
      <div className="footer-links">
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
