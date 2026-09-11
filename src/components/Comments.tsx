import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        action: string;
        size?: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
      }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const API_BASE = 'https://blog-analytics.y2kgif.workers.dev';
const TURNSTILE_SITEKEY = (import.meta.env.VITE_TURNSTILE_SITEKEY as string) || '';

interface Comment {
  id: number;
  author: string;
  body: string;
  created_at: string;
}

interface CommentsProps {
  path: string;
  lang: string;
}

function Comments({ path, lang }: CommentsProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);

  const blogT = lang === 'en' ? t.blog : t.blog;

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/comments?path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const data = await res.json();
        const results = data?.comments?.results || data?.results || [];
        setComments(results);
      }
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    fetchComments();
  }, [path]);

  // Render Turnstile widget
  useEffect(() => {
    const container = turnstileRef.current;
    if (!container || !TURNSTILE_SITEKEY) return;

    const tryRender = () => {
      if (!window.turnstile || turnstileWidgetId.current) return false;
      turnstileWidgetId.current = window.turnstile.render(container, {
        sitekey: TURNSTILE_SITEKEY,
        action: 'blog_comment',
        size: 'compact',
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(null),
        'error-callback': () => setTurnstileToken(null),
      });
      return true;
    };

    if (tryRender()) return;

    const interval = window.setInterval(() => {
      if (tryRender()) window.clearInterval(interval);
    }, 200);

    return () => {
      window.clearInterval(interval);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      turnstileWidgetId.current = undefined;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken || submitStatus === 'submitting') return;

    setSubmitStatus('submitting');
    try {
      const res = await fetch(`${API_BASE}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          author: author.trim(),
          email: email.trim() || undefined,
          comment: body.trim(),
          turnstileToken,
        }),
      });

      if (!res.ok) throw new Error('submit failed');

      setSubmitStatus('success');
      setAuthor('');
      setEmail('');
      setBody('');
      setTurnstileToken(null);

      // Refetch comments
      await fetchComments();

      // Reset Turnstile
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }

      // Clear success message after 3s
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const formatDate = (dateStr: string) => {
    const locale = lang === 'en' ? 'en-US' : 'pt-BR';
    return new Date(dateStr).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section className="blogpost-comments">
      <h2>{blogT.commentsTitle}</h2>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="blogpost-comments-empty">{blogT.commentsEmpty}</p>
      ) : (
        <div className="blogpost-comments-list">
          {comments.map((c) => (
            <div key={c.id} className="blogpost-comment">
              <div className="blogpost-comment-author">{c.author}</div>
              <div className="blogpost-comment-date">{formatDate(c.created_at)}</div>
              <div className="blogpost-comment-body">{c.body}</div>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <form className="blogpost-comment-form" onSubmit={handleSubmit}>
        <div className="blogpost-comment-row">
          <input
            type="text"
            className="blogpost-comment-input"
            placeholder={blogT.commentsAuthorPlaceholder}
            value={author}
            onChange={(e) => setAuthor(e.target.value.slice(0, 60))}
            maxLength={60}
            required
          />
          <input
            type="email"
            className="blogpost-comment-input"
            placeholder={blogT.commentsEmailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="blogpost-comment-charcount">
          {blogT.commentsAuthorCharCount.replace('{0}', String(author.length))}
        </div>

        <textarea
          className="blogpost-comment-input"
          placeholder={blogT.commentsPlaceholder}
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 500))}
          maxLength={500}
          rows={4}
          required
        />
        <div className="blogpost-comment-charcount">
          {blogT.commentsCharCount.replace('{0}', String(body.length))}
        </div>

        <div ref={turnstileRef} className="blogpost-turnstile" />

        <button
          type="submit"
          className="blogpost-comment-submit"
          disabled={!turnstileToken || !author.trim() || !body.trim() || submitStatus === 'submitting'}
        >
          {submitStatus === 'submitting' ? blogT.commentsSubmitting : blogT.commentsSubmit}
        </button>

        {submitStatus === 'success' && (
          <p className="blogpost-comment-status success">{blogT.commentsSuccess}</p>
        )}
        {submitStatus === 'error' && (
          <p className="blogpost-comment-status error">{blogT.commentsError}</p>
        )}
      </form>
    </section>
  );
}

export default Comments;
