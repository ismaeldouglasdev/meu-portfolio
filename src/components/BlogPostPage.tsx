import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

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

function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}

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
      const metaContent = JSON.parse(decodeBase64Utf8(metaData.content));
      const postMeta = metaContent.posts?.find((p: BlogPost) => p.slug === slug);
      if (!postMeta) throw new Error('Post not found');

      const mdRes = await fetch(`${GITHUB_API}/${slug}.md`, { headers });
      if (!mdRes.ok) throw new Error('Failed to fetch post');
      const mdData = await mdRes.json();
      const markdown = decodeBase64Utf8(mdData.content);
      const content = markdown.split('---\n').slice(2).join('---\n').trim() || markdown;

      setPost({ ...postMeta, content });
      document.title = `${postMeta.title} — Blog Ismael Douglas`;

      const url = `https://blog.ismaeltech.com/${postMeta.slug}`;

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
      ogTitle.setAttribute('content', postMeta.title);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
      ogDesc.setAttribute('content', postMeta.excerpt);

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
      ogUrl.setAttribute('content', url);

      let ogType = document.querySelector('meta[property="og:type"]');
      if (!ogType) { ogType = document.createElement('meta'); ogType.setAttribute('property', 'og:type'); document.head.appendChild(ogType); }
      ogType.setAttribute('content', 'article');

      const ldScript = document.getElementById('blog-jsonld');
      if (ldScript) ldScript.remove();
      const script = document.createElement('script');
      script.id = 'blog-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": postMeta.title,
        "datePublished": postMeta.date + "T00:00:00-03:00",
        "url": url,
        "author": { "@type": "Person", "name": "Ismael Douglas" },
        "publisher": { "@type": "Person", "name": "Ismael Douglas" },
        "description": postMeta.excerpt,
      });
      document.head.appendChild(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content || ''}
          </ReactMarkdown>
        </div>

        <footer className="blogpost-footer">
          <a href="/" className="blogpage-back">← Voltar a todos os artigos</a>
        </footer>
      </article>
    </div>
  );
}

export default BlogPostPage;
