import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useTranslation } from '../i18n';

const stripVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.2 } },
  hover: {
    background: 'linear-gradient(135deg, var(--accent), var(--text))',
    color: 'var(--bg)',
    boxShadow: '0 0 12px var(--accent)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

function CtaStrip() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="cta-strip"
      variants={stripVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <motion.a
        href="#contato"
        className="btn btn-primary btn-lg"
        variants={buttonVariants}
        initial="hidden"
        whileInView="visible"
        whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
        whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
      >
        {t.cta} →
      </motion.a>
    </motion.section>
  );
}

export default CtaStrip;
