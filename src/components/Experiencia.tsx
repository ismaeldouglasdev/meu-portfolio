import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from '../i18n';

function Experiencia() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const lineScaleY = useTransform(scrollY, [0, 1500], [0, 1]);

  const entryVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const dotVariants: Variants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 17 },
    },
  };

  return (
    <motion.section
      id="experiencia"
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="exp-title"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t.experiencia.title}
      </motion.h2>

      <motion.div
        className="exp-timeline"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="exp-timeline-line"
          style={{ scaleY: lineScaleY }}
        />

        {t.experiencia.items.map((exp, i) => (
          <motion.div
            key={i}
            className="exp-entry"
            variants={entryVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: i * 0.15 }}
          >
            <motion.div
              className="exp-dot"
              variants={dotVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.5 }}
              transition={{ delay: i * 0.15 + 0.1 }}
            />
            <div className="exp-content">
              <h3 className="exp-cargo">{exp.cargo}</h3>
              <p className="exp-meta">{exp.empresa} • {exp.periodo}</p>
              <ul className="exp-desc">
                {exp.descricao.map((item, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + j * 0.05 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default Experiencia;
