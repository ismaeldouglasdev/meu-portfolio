import {
  FaJs, FaPython, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt, FaDocker, FaReact,
  FaDatabase, FaTerminal, FaPhp, FaDesktop,
} from 'react-icons/fa';
import { SiTypescript, SiFastapi, SiPostgresql, SiFlask, SiFirebase } from 'react-icons/si';
import { useTranslation } from '../i18n';

const skillsList = [
  { icon: <FaReact />, label: 'React' },
  { icon: <SiTypescript />, label: 'TypeScript' },
  { icon: <FaJs />, label: 'JavaScript' },
  { icon: <FaNodeJs />, label: 'Node.js' },
  { icon: <FaPython />, label: 'Python' },
  { icon: <FaPhp />, label: 'PHP' },
  { icon: <SiFastapi />, label: 'FastAPI' },
  { icon: <SiFlask />, label: 'Flask' },
  { icon: <FaHtml5 />, label: 'HTML5' },
  { icon: <FaCss3Alt />, label: 'CSS3' },
  { icon: <SiPostgresql />, label: 'PostgreSQL' },
  { icon: <SiFirebase />, label: 'Firebase' },
  { icon: <FaDatabase />, label: 'SQL' },
  { icon: <FaDesktop />, label: 'CustomTkinter' },
  { icon: <FaGitAlt />, label: 'Git' },
  { icon: <FaDocker />, label: 'Docker' },
  { icon: <FaTerminal />, label: 'Bash/Linux' },
];

function Skills() {
  const { t } = useTranslation();

  return (
    <section id="skills">
      <span className="section-label">{t.skills.label}</span>
      <h2>{t.skills.title}</h2>
      <div className="skills-grid">
        {skillsList.map((skill) => (
          <div key={skill.label} className="skill-item">
            {skill.icon}
            {skill.label}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
