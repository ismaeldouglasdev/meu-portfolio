import { motion, useMotionValue, useSpring, useReducedMotion, Variants } from 'framer-motion';
import { FaGlobe, FaMobileAlt, FaCogs, FaGitAlt, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { useTranslation } from '../i18n';
import { useRef } from 'react';

const icons = [<FaGlobe aria-hidden="true" />, <FaMobileAlt aria-hidden="true" />, <FaCogs aria-hidden="true" />, <FaGitAlt aria-hidden="true" />, <FaShoppingCart aria-hidden="true" />, <FaChartLine aria-hidden="true" />];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function ServicoCardInner({ servico, index }: { servico: any; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.2 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    rotateY.set(x * 15);
    rotateX.set(-y * 15);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="servico-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.12 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
        rotateX: prefersReducedMotion ? 0 : rotateXSpring,
        rotateY: prefersReducedMotion ? 0 : rotateYSpring,
      }}
    >
      <div className="servico-icon">{icons[index]}</div>
      <h3>{servico.title}</h3>
      <p>{servico.desc}</p>
      <div className="servico-techs">
        {servico.techs.map((tech: string, j: number) => (
          <motion.span
            key={j}
            whileHover={!prefersReducedMotion ? { y: -2, scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function Servicos() {
  const { t } = useTranslation();

  return (
    <section id="servicos">
      <motion.span
        className="section-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t.servicos.label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.servicos.title}
      </motion.h2>

      <div className="servicos-grid">
        {t.servicos.items.map((servico, i) => (
          <ServicoCardInner key={i} servico={servico} index={i} />
        ))}
      </div>
    </section>
  );
}

export default Servicos;
