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
  cover?: string;
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

  useEffect(() => {
    if (!post) return;
    const timer = setTimeout(() => {
      document.querySelectorAll('.blogpost-content pre').forEach(pre => {
        if (pre.querySelector('.blogpost-copy-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'blogpost-copy-btn';
        btn.textContent = 'Copiar';
        btn.onclick = () => {
          const code = pre.querySelector('code');
          if (code) {
            navigator.clipboard.writeText(code.textContent || '');
            btn.textContent = 'Copiado!';
            setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
          }
        };
        pre.style.position = 'relative';
        pre.appendChild(btn);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [post]);

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
        {post.cover && (
          <div className="blogpost-cover">
            <img src={post.cover} alt={post.title} />
          </div>
        )}
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

        <div className="blogpost-share">
          <span className="blogpost-share-label">Compartilhar:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://blog.ismaeltech.com/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blogpost-share-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://blog.ismaeltech.com/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blogpost-share-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${post.title} https://blog.ismaeltech.com/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blogpost-share-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>

        <footer className="blogpost-footer">
          <a href="/" className="blogpage-back">← Voltar a todos os artigos</a>
        </footer>
      </article>
    </div>
  );
}

export default BlogPostPage;
