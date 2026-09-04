import { motion, useReducedMotion, Variants } from 'framer-motion';
import {
  FaJs, FaPython, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt, FaDocker, FaReact,
  FaDatabase, FaTerminal, FaPhp, FaDesktop,
} from 'react-icons/fa';
import { SiTypescript, SiFastapi, SiPostgresql, SiFlask, SiFirebase } from 'react-icons/si';
import { useTranslation } from '../i18n';

const skillsList = [
  { icon: <FaReact aria-hidden="true" />, label: 'React' },
  { icon: <SiTypescript aria-hidden="true" />, label: 'TypeScript' },
  { icon: <FaJs aria-hidden="true" />, label: 'JavaScript' },
  { icon: <FaNodeJs aria-hidden="true" />, label: 'Node.js' },
  { icon: <FaPython aria-hidden="true" />, label: 'Python' },
  { icon: <FaPhp aria-hidden="true" />, label: 'PHP' },
  { icon: <SiFastapi aria-hidden="true" />, label: 'FastAPI' },
  { icon: <SiFlask aria-hidden="true" />, label: 'Flask' },
  { icon: <FaHtml5 aria-hidden="true" />, label: 'HTML5' },
  { icon: <FaCss3Alt aria-hidden="true" />, label: 'CSS3' },
  { icon: <SiPostgresql aria-hidden="true" />, label: 'PostgreSQL' },
  { icon: <SiFirebase aria-hidden="true" />, label: 'Firebase' },
  { icon: <FaDatabase aria-hidden="true" />, label: 'SQL' },
  { icon: <FaDesktop aria-hidden="true" />, label: 'CustomTkinter' },
  { icon: <FaGitAlt aria-hidden="true" />, label: 'Git' },
  { icon: <FaDocker aria-hidden="true" />, label: 'Docker' },
  { icon: <FaTerminal aria-hidden="true" />, label: 'Bash/Linux' },
];

const skillVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.05,
      ease: 'backOut',
    },
  }),
};

function Skills() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="skills">
      <motion.span
        className="section-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t.skills.label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.skills.title}
      </motion.h2>

      <ul className="skills-grid" role="list">
        {skillsList.map((skill, i) => (
          <motion.li
            key={skill.label}
            className="skill-item"
            custom={i}
            variants={skillVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            whileHover={!prefersReducedMotion ? { scale: 1.1, y: -4, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <motion.span
              className="skill-icon"
              whileHover={!prefersReducedMotion ? { scale: 1.3, rotate: 15 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {skill.icon}
            </motion.span>
            {skill.label}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
