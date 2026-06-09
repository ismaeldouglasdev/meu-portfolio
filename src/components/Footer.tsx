import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function Footer() {
  const { t } = useTranslation();
  const ano = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {ano} Ismael Douglas. {t.footer.direitos}</p>
      <div className="footer-links">
        <a href="https://github.com/ismaeldouglasdev" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
        <a href="https://linkedin.com/in/ismaeldouglasdev" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
