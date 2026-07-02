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

function Skills() {
  const { t } = useTranslation();

  return (
    <section id="skills">
      <span className="section-label">{t.skills.label}</span>
      <h2>{t.skills.title}</h2>
      <ul className="skills-grid" role="list">
        {skillsList.map((skill) => (
          <li key={skill.label} className="skill-item">
            {skill.icon}
            {skill.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
