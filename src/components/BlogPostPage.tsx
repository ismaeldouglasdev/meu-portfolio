import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useTranslation } from '../i18n';
import type { BlogPost } from '../types/blog';
import { track } from '../lib/analytics';

const GITHUB_API = 'https://api.github.com/repos/ismaeldouglasdev/blog-content/contents/posts';

function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang, setLang } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [fb, setFb] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (slug) {
      setLiked(localStorage.getItem(`blog_liked_${slug}`) === '1');
      const saved = localStorage.getItem(`blog_fb_${slug}`);
      setFb(saved === 'up' || saved === 'down' ? saved : null);
    }
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const contentEl = document.querySelector<HTMLElement>('.blogpost-content');
    if (!contentEl) return;
    const onClickOut = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      const isExternal = anchor.target === '_blank' || /^https?:\/\//.test(href);
      if (isExternal && !href.includes('ismaeltech.com')) {
        track('click_out', window.location.pathname, { href });
      }
    };
    contentEl.addEventListener('click', onClickOut);
    return () => contentEl.removeEventListener('click', onClickOut);
  }, [post]);

  const handleLike = () => {
    if (liked || !slug) return;
    setLiked(true);
    try {
      localStorage.setItem(`blog_liked_${slug}`, '1');
    } catch {
      // storage bloqueado/cheio: o like é registrado no analytics mesmo sem persistir
    }
    track('like', window.location.pathname, { slug });
  };

  const handleFeedback = (v: 'up' | 'down') => {
    if (fb || !slug) return;
    localStorage.setItem(`blog_fb_${slug}`, v);
    setFb(v);
    track(v === 'up' ? 'feedback_up' : 'feedback_down', window.location.pathname, { slug });
  };

  useEffect(() => {
    fetchPost();
  }, [slug, lang]);

  useEffect(() => {
    if (!post) return;
    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.blogpost-content pre').forEach(pre => {
        if (pre.querySelector('.blogpost-copy-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'blogpost-copy-btn';
        btn.textContent = t.blog.copyBtn;
        btn.onclick = () => {
          const code = pre.querySelector('code');
          if (code) {
            navigator.clipboard.writeText(code.textContent || '');
            btn.textContent = t.blog.copiedBtn;
            setTimeout(() => { btn.textContent = t.blog.copyBtn; }, 2000);
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

      const metaRes = await fetch(`${GITHUB_API}/_meta.json`, { headers });
      if (!metaRes.ok) throw new Error('Failed to fetch meta');
      const metaData = await metaRes.json();
      const metaContent = JSON.parse(decodeBase64Utf8(metaData.content));
      const postMeta = metaContent.posts?.find((p: BlogPost) => p.slug === slug);
      if (!postMeta) throw new Error('Post not found');

      const isEn = lang === 'en' && postMeta.translation_slug;
      const fetchSlug = isEn ? postMeta.translation_slug : slug;

      const mdRes = await fetch(`${GITHUB_API}/${fetchSlug}.md`, { headers });
      if (!mdRes.ok) throw new Error('Failed to fetch post');
      const mdData = await mdRes.json();
      const markdown = decodeBase64Utf8(mdData.content);
      const content = markdown.split('---\n').slice(2).join('---\n').trim() || markdown;

      const displayTitle = isEn && postMeta.title_en ? postMeta.title_en : postMeta.title;
      const displayExcerpt = isEn && postMeta.excerpt_en ? postMeta.excerpt_en : postMeta.excerpt;

      setPost({ ...postMeta, lang: postMeta.lang || 'pt', content, title: displayTitle, excerpt: displayExcerpt });
      document.title = `${displayTitle} ${t.blog.documentTitle}`;

      const url = `https://blog.ismaeltech.com/${postMeta.slug}`;

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
      ogTitle.setAttribute('content', displayTitle);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
      ogDesc.setAttribute('content', postMeta.excerpt_en || postMeta.excerpt);

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
      ogUrl.setAttribute('content', url);

      let ogType = document.querySelector('meta[property="og:type"]');
      if (!ogType) { ogType = document.createElement('meta'); ogType.setAttribute('property', 'og:type'); document.head.appendChild(ogType); }
      ogType.setAttribute('content', 'article');

      if (postMeta.cover) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) { ogImage = document.createElement('meta'); ogImage.setAttribute('property', 'og:image'); document.head.appendChild(ogImage); }
        ogImage.setAttribute('content', postMeta.cover);
      }

      const ldScript = document.getElementById('blog-jsonld');
      if (ldScript) ldScript.remove();
      const script = document.createElement('script');
      script.id = 'blog-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": displayTitle,
        "datePublished": postMeta.date + "T00:00:00-03:00",
        "url": url,
        "author": { "@type": "Person", "name": "Ismael Douglas" },
        "publisher": { "@type": "Person", "name": "Ismael Douglas" },
        "description": postMeta.excerpt_en || postMeta.excerpt,
      });
      document.head.appendChild(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const calloutComponents: Components = {
    blockquote: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : '';
      const firstChild = Array.isArray(children) ? children[0] : null;
      const childText = firstChild && typeof firstChild === 'object' && 'props' in firstChild
        ? String(firstChild.props.children) : '';

      const fullText = text || childText;

      if (fullText.startsWith('**Dica:**') || fullText.startsWith('**Tip:**')) {
        return <blockquote className="blogpost-callout blogpost-callout-tip" {...props}>{children}</blockquote>;
      }
      if (fullText.startsWith('**Atenção:**') || fullText.startsWith('**Cuidado:**') || fullText.startsWith('**Aviso:**')) {
        return <blockquote className="blogpost-callout blogpost-callout-warning" {...props}>{children}</blockquote>;
      }
      if (fullText.startsWith('**Nota:**') || fullText.startsWith('**Note:**')) {
        return <blockquote className="blogpost-callout blogpost-callout-note" {...props}>{children}</blockquote>;
      }
      return <blockquote {...props}>{children}</blockquote>;
    },
  };

  const formatDate = (dateStr: string) => {
    const locale = lang === 'en' ? 'en-US' : 'pt-BR';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return t.blog.readingTime.replace('{0}', String(minutes));
  };

  const splitSources = (md: string): { article: string; sources: string } => {
    const sourcesRegex = /^##\s+(?:Fontes|Sources|Refer[êe]ncias|References)\s*\n([\s\S]*?)(?=^##\s|\Z)/m;
    const match = md.match(sourcesRegex);
    if (match) {
      const article = md.slice(0, match.index).trim();
      const sources = match[1].trim();
      return { article, sources };
    }
    return { article: md, sources: '' };
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'tutorial': t.blog.categoriesTutorial,
      'case-study': t.blog.categoriesCaseStudy,
      'article': t.blog.categoriesArticle,
      'curiosidade': t.blog.categoriesCuriosity,
      'tendencia': t.blog.categoriesTrend,
      'noticia': t.blog.categoriesNews,
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="blogpage blogpost">
        <header className="blogpage-header">
          <a href="https://ismaeltech.com/" className="blogpage-logo">Ismael Douglas</a>
          <nav className="blogpage-nav">
            <a href="/" className="blogpage-nav-link">{t.blog.backToBlog}</a>
          </nav>
        </header>
        <div className="blogpage-loading">
          <div className="blogpage-spinner" />
          <span>{t.blog.loading}</span>
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
            <a href="/" className="blogpage-nav-link">{t.blog.backToBlog}</a>
          </nav>
        </header>
        <div className="blogpage-empty">
          <h1>{t.blog.notFound}</h1>
          <a href="/" className="blogpage-back">{t.blog.backToBlog}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="blogpage blogpost">
      <header className="blogpage-header">
        <a href="https://ismaeltech.com/" className="blogpage-logo">Ismael Douglas</a>
        <nav className="blogpage-nav">
          <a href="/" className="blogpage-nav-link">{t.blog.backToBlog}</a>
          <div className="blogpage-lang-switch">
            <button
              className={`blogpage-lang-option ${lang === 'pt-BR' ? 'blogpage-lang-option-active' : ''}`}
              onClick={() => setLang('pt-BR')}
            >PT</button>
            <button
              className={`blogpage-lang-option ${lang === 'en' ? 'blogpage-lang-option-active' : ''}`}
              onClick={() => setLang('en')}
            >EN</button>
          </div>
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
            {post.content && <span>{getReadingTime(post.content)}</span>}
          </div>
        </header>

        <div className="blogpost-content">
          {(() => {
            const { article, sources } = splitSources(post.content || '');
            return (
              <>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={calloutComponents}
                >
                  {article}
                </ReactMarkdown>
                {sources && (
                  <aside className="blogpost-sources">
                    <h2 className="blogpost-sources-title">{t.blog.sourcesTitle}</h2>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {sources}
                    </ReactMarkdown>
                  </aside>
                )}
              </>
            );
          })()}
        </div>

        <div className="blogpost-share">
          <button
            type="button"
            className={`blogpost-like-btn ${liked ? 'blogpost-like-btn-active' : ''}`}
            onClick={handleLike}
            disabled={liked}
            aria-pressed={liked}
            aria-label={liked ? t.blog.likedLabel : t.blog.likeLabel}
            title={liked ? t.blog.likedLabel : t.blog.likeLabel}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>{liked ? t.blog.likedLabel : t.blog.likeLabel}</span>
          </button>
          <span className="blogpost-share-label">{t.blog.shareLabel}:</span>
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

        {slug && post && <GiscusComments key={lang} lang={lang} />}
        <footer className="blogpost-footer">
          <div className="blogpost-feedback" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              {fb ? (t.blog?.feedbackThanks ?? 'Obrigado pelo feedback!') : (t.blog?.feedbackUpLabel ?? 'Helpful') + ' / ' + (t.blog?.feedbackDownLabel ?? 'Not really') + '?'}
            </span>
            <button type="button" className="blogpost-feedback-btn" aria-pressed={fb === 'up'} disabled={!!fb}
              onClick={() => handleFeedback('up')}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border, #333)', background: 'transparent', color: 'inherit', cursor: fb ? 'default' : 'pointer', fontSize: '0.9rem' }}>
              👍 {t.blog?.feedbackUpLabel ?? 'Helpful'}
            </button>
            <button type="button" className="blogpost-feedback-btn" aria-pressed={fb === 'down'} disabled={!!fb}
              onClick={() => handleFeedback('down')}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border, #333)', background: 'transparent', color: 'inherit', cursor: fb ? 'default' : 'pointer', fontSize: '0.9rem' }}>
              👎 {t.blog?.feedbackDownLabel ?? 'Not really'}
            </button>
          </div>
          <a href="/" className="blogpage-back">{t.blog.backToBlog}</a>
        </footer>
      </article>
    </div>
  );
}

function GiscusComments({ lang }: { lang: string }) {
  useEffect(() => {
    const el = document.getElementById('giscus-container');
    if (!el) return;
    el.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', 'ismaeldouglasdev/blog-content');
    script.setAttribute('data-repo-id', 'R_kgDOT7Uwvg');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOT7Uwvs4DEHeX');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark');
    script.setAttribute('data-lang', lang === 'pt-BR' ? 'pt' : 'en');
    el.appendChild(script);
  }, [lang]);
  return <div id="giscus-container" style={{ marginTop: '32px' }} />;
}

export default BlogPostPage;
