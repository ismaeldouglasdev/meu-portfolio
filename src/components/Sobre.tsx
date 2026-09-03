import { motion, useScroll, useTransform } from 'framer-motion';
import { FaCode, FaUsers, FaRocket } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function Sobre() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 60]);

  const highlights = [
    { icon: <FaCode aria-hidden="true" />, text: t.sobre.highlight1 },
    { icon: <FaUsers aria-hidden="true" />, text: t.sobre.highlight2 },
    { icon: <FaRocket aria-hidden="true" />, text: t.sobre.highlight3 },
  ];

  return (
    <motion.section
      id="sobre"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="section-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t.sobre.label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.sobre.title}
      </motion.h2>

      <motion.div className="sobre-content" style={{ y }}>
        <motion.p
          className="sobre-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t.sobre.textBefore}
          <strong style={{ color: 'var(--text)' }}>Ismael Douglas</strong>
          {t.sobre.textAfter}
        </motion.p>

        <div className="sobre-highlights">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              className="sobre-highlight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.03 }}
            >
              {item.icon}
              {item.text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

export default Sobre;
