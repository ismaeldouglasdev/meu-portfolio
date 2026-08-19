import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags?: string[];
  cover?: string;
}

const GITHUB_API = 'https://api.github.com/repos/ismaeldouglasdev/blog-content/contents/posts';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const POSTS_PER_PAGE = 9;

function BlogPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('blog-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('blog-theme', theme);
  }, [theme]);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const activeTag = searchParams.get('tag') || '';
  const searchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    document.title = 'Blog — Ismael Douglas';
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
      }
      const res = await fetch(`${GITHUB_API}/_meta.json`, { headers });
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      const binary = atob(data.content);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const content = JSON.parse(new TextDecoder('utf-8').decode(bytes));
      setPosts(content.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(p => p.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  const allCategories = useMemo(() => {
    const catMap = new Map<string, number>();
    posts.forEach(p => catMap.set(p.category, (catMap.get(p.category) || 0) + 1));
    return Array.from(catMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const recentPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeTag) {
      result = result.filter(p => p.tags?.includes(activeTag));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeTag, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    if (tag === activeTag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('q', searchInput.trim());
    } else {
      params.delete('q');
    }
    params.delete('page');
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'tutorial': 'Tutorial',
      'case-study': 'Case Study',
      'article': 'Artigo',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="blogpage">
        <div className="blogpage-loading">
          <div className="blogpage-spinner" />
          <span>Carregando artigos...</span>
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="blogpage">
        <header className="blogpage-header">
          <a href="https://ismaeltech.com/" className="blogpage-logo">Ismael Douglas</a>
        </header>
        <div className="blogpage-empty">
          <div className="blogpage-empty-icon">BLOG</div>
          <h1>Blog em breve</h1>
          <p>Estamos preparando conteúdos incríveis para você.</p>
          <a href="https://ismaeltech.com/" className="blogpage-back">← Voltar ao portfólio</a>
        </div>
      </div>
    );
  }

  return (
    <div className="blogpage">
      <header className="blogpage-header">
        <a href="https://ismaeltech.com/" className="blogpage-logo">Ismael Douglas</a>
        <nav className="blogpage-nav">
          <a href="https://ismaeltech.com/" className="blogpage-nav-link">Portfólio</a>
          <button
            className="blogpage-theme-toggle"
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            aria-label="Alternar tema"
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            )}
          </button>
        </nav>
      </header>

      <section className="blogpage-hero">
        <h1 className="blogpage-hero-title">Artigos & Tutoriais</h1>
        <p className="blogpage-hero-desc">
          Conteúdo sobre desenvolvimento web, design e tecnologia.
          Aprenda com tutoriais práticos e insights do mercado.
        </p>
        <form className="blogpage-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="blogpage-search-input"
            placeholder="Buscar artigos..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" className="blogpage-search-btn">Buscar</button>
        </form>
      </section>

      <main className="blogpage-main">
        <div className="blogpage-content">
          {allTags.length > 0 && (
            <div className="blogpage-tags">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`blogpage-tag ${activeTag === tag ? 'blogpage-tag-active' : ''}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="blogpage-grid">
            {paginatedPosts.map((post, index) => (
              <article
                key={post.slug}
                className={`blogpage-card ${index === 0 && currentPage === 1 && !activeTag ? 'blogpage-card-featured' : ''}`}
                onClick={() => navigate(`/${post.slug}`)}
              >
                {post.cover && (
                  <div className="blogpage-card-cover">
                    <img src={post.cover} alt={post.title} loading="lazy" />
                  </div>
                )}
                <div className="blogpage-card-category">
                  {getCategoryLabel(post.category)}
                </div>
                <h2 className="blogpage-card-title">{post.title}</h2>
                <div className="blogpage-card-excerpt">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.excerpt}
                  </ReactMarkdown>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="blogpage-card-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="blogpage-card-tag">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="blogpage-card-footer">
                  <time className="blogpage-card-date">{formatDate(post.date)}</time>
                  <span className="blogpage-card-read">Ler artigo →</span>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="blogpage-pagination">
              <button
                className="blogpage-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ← Anterior
              </button>
              <span className="blogpage-pagination-info">
                {currentPage} / {totalPages}
              </span>
              <button
                className="blogpage-pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Próximo →
              </button>
            </div>
          )}
        </div>

        <aside className="blogpage-sidebar">
          <div className="blogpage-sidebar-section">
            <h3 className="blogpage-sidebar-title">Categorias</h3>
            <ul className="blogpage-sidebar-list">
              {allCategories.map(([cat, count]) => (
                <li key={cat} className="blogpage-sidebar-item">
                  <span>{getCategoryLabel(cat)}</span>
                  <span className="blogpage-sidebar-count">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="blogpage-sidebar-section">
            <h3 className="blogpage-sidebar-title">Recentes</h3>
            <ul className="blogpage-sidebar-list">
              {recentPosts.map(post => (
                <li key={post.slug} className="blogpage-sidebar-item blogpage-sidebar-post" onClick={() => navigate(`/${post.slug}`)}>
                  <span className="blogpage-sidebar-post-title">{post.title}</span>
                  <time className="blogpage-sidebar-post-date">{formatDate(post.date)}</time>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      <footer className="blogpage-footer">
        <a href="https://ismaeltech.com/" className="blogpage-back">← Voltar ao portfólio</a>
      </footer>
    </div>
  );
}

export default BlogPage;
