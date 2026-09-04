import { motion, Variants } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from '../i18n';

interface DepoimentosProps {
  onViewCaseStudy?: (slug: string) => void;
}

const cardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -40 : 40,
    rotate: i % 2 === 0 ? -1 : 1,
  }),
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const starVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 200 },
  }),
};

const quoteVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.3, type: 'spring', stiffness: 150 } },
};

function Depoimentos({ onViewCaseStudy }: DepoimentosProps) {
  const { t } = useTranslation();

  return (
    <section id="depoimentos">
      <motion.span
        className="section-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t.depoimentos.label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.depoimentos.title}
      </motion.h2>

      <div className="depoimentos-list">
        {t.depoimentos.items.map((item, i) => (
          <motion.div
            key={i}
            className="depoimento-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div
              className="depoimento-stars"
              aria-label="5 de 5 estrelas"
              role="img"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <motion.span
                  key={s}
                  custom={s}
                  variants={starVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <FaStar aria-hidden="true" />
                </motion.span>
              ))}
            </motion.div>
            <motion.div variants={quoteVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <FaQuoteLeft className="depoimento-quote" aria-hidden="true" />
            </motion.div>
            <p className="depoimento-text">"{item.text}"</p>
            <div className="depoimento-author">
              <div className="depoimento-avatar" aria-hidden="true">
                {item.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </div>
            {item.caseStudySlug && onViewCaseStudy && (
              <button className="caso-link-btn" onClick={() => onViewCaseStudy(item.caseStudySlug!)}>
                {t.depoimentos.viewCaseStudy} <FaArrowRight />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Depoimentos;