import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
      }

      const metaRes = await fetch(`${GITHUB_API}/_meta.json`, { headers });
      if (!metaRes.ok) throw new Error('Failed to fetch meta');
      const metaData = await metaRes.json();
      const metaContent = JSON.parse(atob(metaData.content));
      const postMeta = metaContent.posts?.find((p: BlogPost) => p.slug === slug);
      if (!postMeta) throw new Error('Post not found');

      const mdRes = await fetch(`${GITHUB_API}/${slug}.md`, { headers });
      if (!mdRes.ok) throw new Error('Failed to fetch post');
      const mdData = await mdRes.json();
      const binary = atob(mdData.content);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const markdown = new TextDecoder('utf-8').decode(bytes);
      const content = markdown.split('---\n').slice(2).join('---\n').trim() || markdown;

      setPost({ ...postMeta, content });
      document.title = `${postMeta.title} — Blog Ismael Douglas`;
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

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
      if (line.startsWith('```')) return null;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i}>{line}</p>;
    });
  };

  if (loading) {
    return (
      <div className="blogpage blogpost">
        <header className="blogpage-header">
          <a href="https://ismaeltech.com/" className="blogpage-logo">Ismael Douglas</a>
          <nav className="blogpage-nav">
            <a href="/" className="blogpage-nav-link">← Blog</a>
          </nav>
        </header>
        <div className="blogpage-loading">
          <div className="blogpage-spinner" />
          <span>Carregando artigo...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blogpage blogpost">
        <header className="blogpage-header">
          <a href="https://ismaeltech.com/" className="blogpage-logo">Ismael Douglas</a>
          <nav className="blogpage-nav">
            <a href="/" className="blogpage-nav-link">← Blog</a>
          </nav>
        </header>
        <div className="blogpage-empty">
          <h1>Artigo não encontrado</h1>
          <p>O artigo que você procura não existe ou foi removido.</p>
          <a href="/" className="blogpage-back">← Voltar ao blog</a>
        </div>
      </div>
    );
  }

  return (
    <div className="blogpage blogpost">
      <header className="blogpage-header">
        <a href="https://ismaeltech.com/" className="blogpage-logo">Ismael Douglas</a>
        <nav className="blogpage-nav">
          <a href="/" className="blogpage-nav-link">← Blog</a>
        </nav>
      </header>

      <article className="blogpost-article">
        <header className="blogpost-header">
          <span className="blogpost-category">{getCategoryLabel(post.category)}</span>
          <h1 className="blogpost-title">{post.title}</h1>
          <div className="blogpost-meta">
            <time>{formatDate(post.date)}</time>
            {post.content && <span>{getReadingTime(post.content)} min de leitura</span>}
          </div>
        </header>

        <div className="blogpost-content">
          {post.content && renderMarkdown(post.content)}
        </div>

        <footer className="blogpost-footer">
          <a href="/" className="blogpage-back">← Voltar a todos os artigos</a>
        </footer>
      </article>
    </div>
  );
}

export default BlogPostPage;
