import { motion, Variants } from 'framer-motion';
import { FaCheck, FaRocket, FaHandshake, FaUnlockAlt, FaFileCode } from 'react-icons/fa';
import { useTranslation } from '../i18n';

const planVariants: Variants = {
  hidden: { opacity: 0, y: 34, rotateX: -18, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.58, ease: 'easeOut' },
  }),
};

const featureVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.28 },
  }),
};

const seloVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.25 + i * 0.08, type: 'spring', stiffness: 280, damping: 18 },
  }),
};

const seloIcons = [FaRocket, FaHandshake, FaUnlockAlt, FaFileCode];

function Precos() {
  const { t } = useTranslation();

  return (
    <section id="precos">
      <motion.span
        className="section-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t.precos.label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.precos.title}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {t.precos.subtitle}
      </motion.p>

      <div className="precos-grid">
        {t.precos.items.map((plano, i) => (
          <motion.div
            key={i}
            className={`preco-card ${plano.highlighted ? 'preco-highlight' : ''}`}
            custom={i}
            variants={planVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {plano.highlighted && (
              <motion.span
                className="preco-badge"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.2, type: 'spring', stiffness: 300 }}
              >
                {t.precos.popular}
              </motion.span>
            )}
            <h3>{plano.name}</h3>
            <div className="preco-price">
              <span className="preco-period">{plano.period}</span>
              <motion.span
                className="preco-value"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.15, duration: 0.3 }}
              >
                {plano.price}
              </motion.span>
            </div>
            {plano.parcelado && (
              <span className="preco-parcelado">{plano.parcelado}</span>
            )}
            <ul className="preco-features">
              {plano.features.map((feat, j) => (
                <motion.li
                  key={j}
                  custom={j}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <FaCheck aria-hidden="true" /> {feat}
                </motion.li>
              ))}
            </ul>
            <div className="preco-actions">
              <a href="#contato" className="btn btn-outline preco-cta">
                {t.precos.cta}
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="precos-selos"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {t.precos.selos.map((selo, i) => {
          const Icon = seloIcons[i];
          return (
            <motion.span
              key={i}
              className="preco-selo"
              custom={i}
              variants={seloVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="preco-selo-icon">
                <Icon aria-hidden="true" />
              </span>
              {selo.text}
            </motion.span>
          );
        })}
      </motion.div>
    </section>
  );
}

export default Precos;
