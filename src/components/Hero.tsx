import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from '../i18n';
import Typewriter from './Typewriter';
import ThreeBackground from './ThreeBackground';

const FI = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

function Hero() {
  const { t } = useTranslation();

  return (
    <section id="hero" className="hero">
      <ThreeBackground />
      <div className="hero-content">
        <motion.span className="hero-badge" {...FI(0.1)}>
          <FaCheckCircle aria-hidden="true" />
          {t.hero.disponivel}
        </motion.span>

        <motion.span className="hero-tag" {...FI(0.2)}>
          {t.hero.tag}
        </motion.span>

        <motion.h1 className="hero-title typewriter-line" {...FI(0.35)}>
          <Typewriter phrases={t.hero.phrases} speed={65} deleteSpeed={35} pauseAfter={2500} />
        </motion.h1>

        <motion.p className="hero-subtitle" {...FI(0.5)}>
          {t.hero.subtitle}
        </motion.p>

        <motion.div className="hero-actions" {...FI(0.65)}>
          <motion.a
            href="#projetos"
            className="btn btn-primary"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            {t.hero.ctaProjetos}
          </motion.a>
          <motion.a
            href="#contato"
            className="btn btn-outline"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            {t.hero.ctaContato}
          </motion.a>
        </motion.div>

        <motion.div className="hero-stats" {...FI(0.8)}>
          {[
            { number: t.hero.stat1, label: t.hero.stat1Label },
            { number: t.hero.stat2, label: t.hero.stat2Label },
            { number: t.hero.stat3, label: t.hero.stat3Label },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="hero-stat"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="hero-stat-number">{stat.number}</div>
              <div className="hero-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
