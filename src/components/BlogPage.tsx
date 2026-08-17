import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const content = JSON.parse(atob(data.content));
      setPosts(content.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
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
          <a href="/" className="blogpage-logo">Ismael Douglas</a>
        </header>
        <div className="blogpage-empty">
          <div className="blogpage-empty-icon">📝</div>
          <h1>Blog em breve</h1>
          <p>Estamos preparando conteúdos incríveis para você.</p>
          <a href="/" className="blogpage-back">← Voltar ao portfólio</a>
        </div>
      </div>
    );
  }

  return (
    <div className="blogpage">
      <header className="blogpage-header">
        <a href="/" className="blogpage-logo">Ismael Douglas</a>
        <nav className="blogpage-nav">
          <a href="/" className="blogpage-nav-link">Portfólio</a>
        </nav>
      </header>

      <section className="blogpage-hero">
        <h1 className="blogpage-hero-title">Artigos & Tutoriais</h1>
        <p className="blogpage-hero-desc">
          Conteúdo sobre desenvolvimento web, design e tecnologia.
          Aprenda com tutoriais práticos e insights do mercado.
        </p>
      </section>

      <main className="blogpage-content">
        <div className="blogpage-grid">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className={`blogpage-card ${index === 0 ? 'blogpage-card-featured' : ''}`}
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div className="blogpage-card-category">
                {getCategoryLabel(post.category)}
              </div>
              <h2 className="blogpage-card-title">{post.title}</h2>
              <p className="blogpage-card-excerpt">{post.excerpt}</p>
              <div className="blogpage-card-footer">
                <time className="blogpage-card-date">{formatDate(post.date)}</time>
                <span className="blogpage-card-read">Ler artigo →</span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="blogpage-footer">
        <a href="/" className="blogpage-back">← Voltar ao portfólio</a>
      </footer>
    </div>
  );
}

export default BlogPage;
