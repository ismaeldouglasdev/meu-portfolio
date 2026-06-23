import { useState, useEffect, useCallback } from 'react';
import { FaGithub, FaFolder, FaExternalLinkAlt, FaCircle } from 'react-icons/fa';
import { useTranslation } from '../i18n';

interface Projeto {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  deploy_url?: string;
  language: string | null;
  stars: number;
}

const curatedRepos = [
  'Cronograma-Projeto',
  'mensageiros-da-esperanca',
  'PeakVault',
];

const manualEntries: Projeto[] = [
  {
    id: 999,
    name: 'Engram',
    description: null,
    html_url: 'https://github.com/ismaeldouglasdev/Engram',
    deploy_url: 'https://www.engram-memory.com/',
    language: 'Python',
    stars: 1,
  },
];

const GITHUB_OWNER = 'ismaeldouglasdev';

const curatedRepoMeta: Record<string, { lang: string; stars: number; deploy_url?: string }> = {
  PeakVault: { lang: 'Python', stars: 1 },
  'Cronograma-Projeto': { lang: 'JavaScript', stars: 1, deploy_url: 'https://cronograma-projeto.onrender.com/' },
  'mensageiros-da-esperanca': { lang: 'JavaScript', stars: 0, deploy_url: 'https://mensageiros-da-esperanca.vercel.app/' },
};

type ServerStatus = 'checking' | 'online' | 'offline' | 'waking';

function StatusBadge({ url }: { url: string }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ServerStatus>('checking');
  const [wakingAttempts, setWakingAttempts] = useState(0);

  const checkServer = useCallback(async () => {
    try {
      await fetch(url, { method: 'GET', mode: 'no-cors', cache: 'no-store' });
      setStatus('online');
      return true;
    } catch {
      setStatus('offline');
      return false;
    }
  }, [url]);

  useEffect(() => {
    const timer = setTimeout(checkServer, 500);
    return () => clearTimeout(timer);
  }, [checkServer]);

  useEffect(() => {
    let cancelled = false;
    if (status === 'waking') {
      const interval = setInterval(async () => {
        setWakingAttempts(prev => prev + 1);
        try {
          await fetch(url, { method: 'GET', mode: 'no-cors', cache: 'no-store' });
          if (!cancelled) {
            setStatus('online');
            setWakingAttempts(0);
          }
        } catch {
        }
      }, 4000);
      return () => { cancelled = true; clearInterval(interval); };
    }
  }, [status, url]);

  const handleWake = async () => {
    setStatus('waking');
    setWakingAttempts(0);
    try {
      await fetch(url, { method: 'GET', mode: 'no-cors', cache: 'no-store' });
      setStatus('online');
    } catch {
    }
  };

  const color = status === 'online' ? '#22c55e'
    : status === 'waking' ? '#f59e0b'
    : status === 'offline' ? '#ef4444'
    : '#6b7280';

  const statusLabel = status === 'online' ? t.projetos.serverOnline
    : status === 'waking' ? `${t.projetos.wakingServer} (${wakingAttempts})`
    : status === 'offline' ? t.projetos.serverOffline
    : '…';

  return (
    <button
      className={`status-badge status-${status}`}
      onClick={status === 'offline' ? handleWake : undefined}
      title={
        status === 'offline'
          ? t.projetos.serverSleeping
          : status === 'waking'
          ? t.projetos.serverStarting
          : undefined
      }
      disabled={status === 'waking' || status === 'checking'}
    >
      <FaCircle style={{ color, fontSize: '0.5rem' }} />
      <span>{statusLabel}</span>
    </button>
  );
}

function ProjetoCard({ projeto }: { projeto: Projeto }) {
  const { t } = useTranslation();
  const desc = t.projetos.desc[projeto.name] || projeto.description || t.projetos.semDesc;

  return (
    <div className="projeto-card">
      <div className="projeto-body">
        <div className="projeto-header">
          <FaFolder className="projeto-folder-icon" />
          <h3>{t.projetos.names[projeto.name] || projeto.name}</h3>
        </div>
        <p>{desc}</p>
        <div className="projeto-footer">
          <div className="projeto-langs">
            {projeto.language && <span>{projeto.language}</span>}
            {projeto.stars > 0 && <span>★ {projeto.stars}</span>}
            {!projeto.deploy_url && <span className="tag-desktop">{t.projetos.desktopApp}</span>}
          </div>
          <div className="projeto-actions">
            {projeto.deploy_url && (
              <a
                href={projeto.deploy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="projeto-link deploy-link"
              >
                <FaExternalLinkAlt /> {t.projetos.visitSite}
              </a>
            )}
            <a
              href={projeto.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="projeto-link"
            >
              <FaGithub /> {t.projetos.verGitHub}
            </a>
          </div>
        </div>
        {projeto.deploy_url && (
          <StatusBadge key={projeto.name} url={projeto.deploy_url} />
        )}
      </div>
    </div>
  );
}

function Projetos() {
  const { t } = useTranslation();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      const buildFallback = () =>
        curatedRepos.map((name, i) => ({
          id: i,
          name,
          description: t.projetos.destaque,
          html_url: `https://github.com/${GITHUB_OWNER}/${name}`,
          deploy_url: curatedRepoMeta[name]?.deploy_url,
          language: curatedRepoMeta[name]?.lang || null,
          stars: curatedRepoMeta[name]?.stars || 0,
        }));

      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_OWNER}/repos?sort=updated&per_page=30`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const filtered = data
          .filter((r: { fork: boolean }) => !r.fork)
          .map(
            (r: {
              id: number;
              name: string;
              description: string | null;
              html_url: string;
              language: string | null;
              stargazers_count: number;
            }) => ({
              id: r.id,
              name: r.name,
              description: r.description,
              html_url: r.html_url,
              language: r.language,
              stars: r.stargazers_count,
            })
          );

          const curated = (curatedRepos
            .map((name) => filtered.find((p: Projeto) => p.name === name))
            .filter(Boolean) as Projeto[])
            .map((p) => ({
              ...p,
              deploy_url: curatedRepoMeta[p.name]?.deploy_url,
            }));

        if (curated.length === 0) {
          throw new Error('empty curated list');
        }

        if (!cancelled) setProjetos([...manualEntries, ...curated]);
      } catch {
        if (!cancelled) setProjetos([...manualEntries, ...buildFallback()]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProjects();
    return () => { cancelled = true; };
  }, [t]);

  return (
    <section id="projetos">
      <span className="section-label">{t.projetos.label}</span>
      <h2>{t.projetos.title}</h2>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>
          {t.projetos.loading}
        </p>
      ) : (
        <div className="projetos-grid">
          {projetos.map((projeto) => (
            <ProjetoCard key={projeto.id} projeto={projeto} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Projetos;
