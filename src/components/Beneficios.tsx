import { motion, useReducedMotion, Variants } from 'framer-motion';
import { FaRocket, FaDollarSign, FaGlobeAmericas, FaHeadset } from 'react-icons/fa';
import { useTranslation } from '../i18n';

const icons = [<FaRocket aria-hidden="true" />, <FaDollarSign aria-hidden="true" />, <FaGlobeAmericas aria-hidden="true" />, <FaHeadset aria-hidden="true" />];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    transition: { delay: i * 0.13, duration: 0.55, ease: 'easeOut' },
  }),
};

function Beneficios() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="beneficios">
      <motion.span
        className="section-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t.beneficios.label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.beneficios.title}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {t.beneficios.subtitle}
      </motion.p>

      <div className="beneficios-grid">
        {t.beneficios.items.map((item, i) => (
          <motion.div
            key={i}
            className="beneficio-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <motion.div
              className="beneficio-icon"
              animate={!prefersReducedMotion ? {
                y: [0, -5, 0],
                transition: { repeat: Infinity, duration: 2.5 + i * 0.4, ease: 'easeInOut' },
              } : {}}
            >
              {icons[i]}
            </motion.div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Beneficios;
