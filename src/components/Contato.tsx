import { motion, Variants } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function Contato() {
  const { t } = useTranslation();

  const contatos = [
    { icon: <FaGithub aria-hidden="true" />, label: 'GitHub', href: 'https://github.com/ismaeldouglasdev' },
    { icon: <FaLinkedin aria-hidden="true" />, label: 'LinkedIn', href: 'https://linkedin.com/in/ismael-douglas-dev' },
    { icon: <FaEnvelope aria-hidden="true" />, label: 'Email', href: 'mailto:contact@ismaeltech.com' },
    { icon: <FaWhatsapp aria-hidden="true" />, label: 'WhatsApp', href: `https://wa.me/5511959873202?text=${encodeURIComponent(t.contato.whatsappMsg)}` },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
    hover: {
      scale: 1.08,
      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
      transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
  };

  return (
    <motion.section
      id="contato"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="section-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t.contato.label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.contato.title}
      </motion.h2>
      <motion.p
        style={{ textAlign: 'center', maxWidth: 500, margin: '-1rem auto 1rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {t.contato.subtitle}
      </motion.p>
      <motion.div
        className="contato-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {contatos.map((c, i) => (
          <motion.a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contato-link"
            aria-label={`${c.label} (abre em nova aba)`}
            custom={i}
            variants={linkVariants}
            whileHover="hover"
          >
            <motion.span
              className="contato-icon-wrapper"
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {c.icon}
            </motion.span>
            <span className="contato-label">{c.label}</span>
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default Contato;