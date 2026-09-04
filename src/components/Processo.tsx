import { motion, useScroll, useTransform, useReducedMotion, Variants } from 'framer-motion';
import { FaLightbulb, FaCode, FaRocket } from 'react-icons/fa';
import { useTranslation } from '../i18n';
import { useRef } from 'react';

const phaseIcons = [<FaLightbulb aria-hidden="true" />, <FaCode aria-hidden="true" />, <FaRocket aria-hidden="true" />];

function Processo() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  const lineScaleY = useTransform(scrollY, [0, 2000], [0, 1]);

  const cardVariants = (index: number): Variants => ({
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -40 : 40,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: 'easeInOut',
      },
    },
  });

  const counterVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'backOut',
      },
    },
  };

  return (
    <motion.section
      id="processo"
      ref={sectionRef}
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
        {t.processo.label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.processo.title}
      </motion.h2>

      {!prefersReducedMotion && (
        <motion.div
          className="processo-progress-line"
          style={{ scaleY: lineScaleY }}
        />
      )}

      <div className="processo-grid">
        {t.processo.steps.map((step, i) => (
          <motion.div
            key={i}
            className="processo-card"
            variants={cardVariants(i)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div
              className="processo-counter"
              variants={counterVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 + 0.3 }}
            >
              {i + 1}
            </motion.div>

            <div className="processo-phase">{step.phase}</div>
            <motion.div
              className="processo-icon"
              whileHover={!prefersReducedMotion ? { scale: 1.2, rotate: 10 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {phaseIcons[i]}
            </motion.div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            <span className="processo-duration">{step.duration}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default Processo;
