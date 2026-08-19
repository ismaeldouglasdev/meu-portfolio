import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags?: string[];
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
            {theme === 'light' ? '🌙' : '☀️'}
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

      <main className="blogpage-content">
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
              <div className="blogpage-card-category">
                {getCategoryLabel(post.category)}
              </div>
              <h2 className="blogpage-card-title">{post.title}</h2>
              <p className="blogpage-card-excerpt">{post.excerpt}</p>
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
      </main>

      <footer className="blogpage-footer">
        <a href="https://ismaeltech.com/" className="blogpage-back">← Voltar ao portfólio</a>
      </footer>
    </div>
  );
}

export default BlogPage;
