import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
}

const GITHUB_API = 'https://api.github.com/repos/ismaeldouglasdev/blog-content/contents/posts';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function Blog() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }

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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'tutorial': '#22c55e',
      'case-study': '#3b82f6',
      'article': '#f59e0b',
    };
    return colors[category] || '#6b7280';
  };

  if (loading) {
    return (
      <section id="blog">
        <div className="blog-loading">
          <div className="blog-loading-spinner" />
          <span>Carregando artigos...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog">
        <div className="blog-empty">
          <p>Blog em breve. Estamos preparando conteúdos incríveis para você.</p>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog">
        <div className="blog-empty">
          <p>Blog em breve. Estamos preparando conteúdos incríveis para você.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="blog">
      <span className="section-label">{t.blog?.label || 'BLOG'}</span>
      <h2 className="section-title">{t.blog?.title || 'Artigos'}</h2>
      <p className="section-subtitle">
        {t.blog?.subtitle || 'Conteúdo sobre desenvolvimento, design e tecnologia.'}
      </p>

      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.slug} className="blog-card">
            <div className="blog-card-header">
              <span 
                className="blog-category"
                style={{ borderColor: getCategoryColor(post.category) }}
              >
                {post.category}
              </span>
              <time className="blog-date">{formatDate(post.date)}</time>
            </div>
            
            <h3 className="blog-title">{post.title}</h3>
            <p className="blog-excerpt">{post.excerpt}</p>
            
            <div className="blog-footer">
              <span className="blog-read-more">Ler artigo →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Blog;
