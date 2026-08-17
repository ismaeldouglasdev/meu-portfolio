import { useState, useEffect } from 'react';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags?: string[];
  content?: string;
}

const GITHUB_API = 'https://api.github.com/repos/ismaeldouglasdev/blog-content/contents/posts';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

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

  const fetchPostContent = async (post: BlogPost) => {
    try {
      const headers: HeadersInit = {};
      if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
      }
      const res = await fetch(`${GITHUB_API}/${post.slug}.md`, { headers });
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      const markdown = atob(data.content);
      const content = markdown.split('---\n')[2]?.trim() || markdown;
      setSelectedPost({ ...post, content });
    } catch (err) {
      console.error('Error fetching post:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
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
      <section id="blog" className="blog-section">
        <div className="blog-container">
          <div className="blog-loading">
            <div className="blog-loading-spinner" />
            <span>Carregando artigos...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return (
      <section id="blog" className="blog-section">
        <div className="blog-container">
          <div className="blog-header">
            <span className="blog-label">BLOG</span>
            <h2 className="blog-main-title">Artigos & Tutoriais</h2>
            <p className="blog-description">
              Conteúdo sobre desenvolvimento web, design e tecnologia. 
              Aprenda com tutoriais práticos e insights do mercado.
            </p>
          </div>
          <div className="blog-empty">
            <div className="blog-empty-icon">📝</div>
            <h3>Blog em breve</h3>
            <p>Estamos preparando conteúdos incríveis para você.</p>
          </div>
        </div>
      </section>
    );
  }

  if (selectedPost) {
    return (
      <section id="blog" className="blog-section blog-single">
        <div className="blog-container">
          <button className="blog-back" onClick={() => setSelectedPost(null)}>
            ← Voltar para todos os artigos
          </button>
          
          <article className="blog-article">
            <header className="blog-article-header">
              <span className="blog-article-category">{getCategoryLabel(selectedPost.category)}</span>
              <h1 className="blog-article-title">{selectedPost.title}</h1>
              <div className="blog-article-meta">
                <time>{formatDate(selectedPost.date)}</time>
                <span className="blog-article-reading">
                  {selectedPost.content ? `${getReadingTime(selectedPost.content)} min de leitura` : ''}
                </span>
              </div>
            </header>
            
            <div className="blog-article-content">
              {selectedPost.content?.split('\n').map((paragraph, i) => {
                if (paragraph.startsWith('# ')) return <h1 key={i}>{paragraph.slice(2)}</h1>;
                if (paragraph.startsWith('## ')) return <h2 key={i}>{paragraph.slice(3)}</h2>;
                if (paragraph.startsWith('### ')) return <h3 key={i}>{paragraph.slice(4)}</h3>;
                if (paragraph.startsWith('```')) return null;
                if (paragraph.trim() === '') return <br key={i} />;
                return <p key={i}>{paragraph}</p>;
              })}
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="blog-section">
      <div className="blog-container">
        <div className="blog-header">
          <span className="blog-label">BLOG</span>
          <h2 className="blog-main-title">Artigos & Tutoriais</h2>
          <p className="blog-description">
            Conteúdo sobre desenvolvimento web, design e tecnologia. 
            Aprenda com tutoriais práticos e insights do mercado.
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((post, index) => (
            <article 
              key={post.slug} 
              className={`blog-card ${index === 0 ? 'blog-card-featured' : ''}`}
              onClick={() => fetchPostContent(post)}
            >
              <div className="blog-card-category">
                {getCategoryLabel(post.category)}
              </div>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-footer">
                <time className="blog-card-date">{formatDate(post.date)}</time>
                <span className="blog-card-read">Ler artigo →</span>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-cta">
          <p>Novos artigos toda semana</p>
        </div>
      </div>
    </section>
  );
}

export default Blog;
