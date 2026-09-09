#!/usr/bin/env node

/**
 * Post-build Pre-render Script for Blog
 *
 * Runs after `vite build` to generate a static HTML shell per blog post
 * (crawler-visible), plus sitemap.xml / robots.txt / feed.xml / llms.txt.
 * It fetches blog metadata + markdown from the blog-content GitHub repo
 * (raw.githubusercontent.com, no API rate limit) and renders the article
 * body to static HTML mirroring src/components/BlogPostPage.tsx.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

const distDir = resolve(process.cwd(), 'dist');
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/ismaeldouglasdev/blog-content';
const BLOG_URL = 'https://blog.ismaeltech.com';
const DEFAULT_OG_IMAGE = 'https://ismaeltech.com/images/og-image.png';

const BRANCHES = ['main', 'master'];

async function fetchJson(url) {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchBlogMetadata() {
  for (const branch of BRANCHES) {
    const url = `${GITHUB_RAW_BASE}/${branch}/posts/_meta.json`;
    try {
      const data = await fetchJson(url);
      console.log(`✅ Using branch '${branch}' for metadata`);
      return data;
    } catch (err) {
      console.warn(`⚠️  Branch '${branch}' failed: ${err.message}`);
    }
  }
  throw new Error('❌ Could not fetch _meta.json from any branch (tried main, master)');
}

function decodeBase64Utf8(base64) {
  const buffer = Buffer.from(base64, 'base64');
  return buffer.toString('utf-8');
}

function stripFrontmatter(markdown) {
  const parts = markdown.split('---\n');
  if (parts.length >= 3) {
    return parts.slice(2).join('---\n').trim();
  }
  return markdown.trim();
}

function splitSources(md) {
  const regex = /^##\s+(?:Fontes|Sources|Referências|References)\s*\n([\s\S]*?)(?=\n^##\s|\n\Z)/m;
  const match = md.match(regex);
  if (match) {
    return {
      article: md.slice(0, match.index).trim(),
      sources: match[1].trim(),
    };
  }
  return { article: md, sources: '' };
}

async function renderMarkdown(markdown) {
  const React = await import('react');
  const ReactDOM = await import('react-dom/server');
  const ReactMarkdown = await import('react-markdown');
  const remarkGfm = await import('remark-gfm');
  const rehypeHighlight = await import('rehype-highlight');

  const { renderToStaticMarkup } = ReactDOM;
  const { default: ReactMarkdownComponent } = ReactMarkdown;
  const { default: remarkGfmPlugin } = remarkGfm;
  const { default: rehypeHighlightPlugin } = rehypeHighlight;

  const calloutComponents = {
    blockquote: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : '';
      const firstChild = Array.isArray(children) ? children[0] : null;
      const childText = firstChild && typeof firstChild === 'object' && 'props' in firstChild
        ? String(firstChild.props.children) : '';
      const fullText = text || childText;
      if (fullText.startsWith('**Dica:**') || fullText.startsWith('**Tip:**')) {
        return React.createElement('blockquote', { className: 'blogpost-callout blogpost-callout-tip', ...props }, children);
      }
      if (fullText.startsWith('**Atenção:**') || fullText.startsWith('**Cuidado:**') || fullText.startsWith('**Aviso:**')) {
        return React.createElement('blockquote', { className: 'blogpost-callout blogpost-callout-warning', ...props }, children);
      }
      if (fullText.startsWith('**Nota:**') || fullText.startsWith('**Note:**')) {
        return React.createElement('blockquote', { className: 'blogpost-callout blogpost-callout-note', ...props }, children);
      }
      return React.createElement('blockquote', props, children);
    },
  };

  const articleHtml = renderToStaticMarkup(
    React.createElement('div', { className: 'blogpost-content' },
      React.createElement(ReactMarkdownComponent, {
        remarkPlugins: [remarkGfmPlugin],
        rehypePlugins: [rehypeHighlightPlugin],
        components: calloutComponents,
      }, markdown)
    )
  );

  const { article, sources } = splitSources(markdown);
  let fullHtml = articleHtml;

  if (sources) {
    const sourcesHtml = renderToStaticMarkup(
      React.createElement(ReactMarkdownComponent, { remarkPlugins: [remarkGfmPlugin] }, sources)
    );
    const sourcesWrapper = React.createElement('aside', { className: 'blogpost-sources' },
      React.createElement('h2', { className: 'blogpost-sources-title' }, 'Fontes'),
      React.createElement('div', null, sourcesHtml)
    );
    fullHtml = renderToStaticMarkup(
      React.createElement('div', null,
        React.createElement('div', null, articleHtml),
        React.createElement('div', null, sourcesWrapper)
      )
    );
  }

  return fullHtml;
}

function writeStaticHtml(slug, lang, title, excerpt, pubDate, ogImage, articleHtml) {
  const outDir = resolve(distDir, slug);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  let html = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

  html = html.replace('<html lang="pt-BR">', `<html lang="${lang}">`);
  html = html.replace(/<title>.*?<\/title>/, `<title>${title} - Blog Ismael Douglas</title>`);
  html = html.replace(/<meta[^>]*name=["']description["'][^>]*>/, `<meta name="description" content="${excerpt}">`);

  const ogReplacements = [
    ['og:title', title],
    ['og:description', excerpt],
    ['og:url', `${BLOG_URL}/${slug}`],
    ['og:type', 'article'],
    ['og:image', ogImage],
    ['og:locale', lang === 'pt-BR' ? 'pt_BR' : 'en_US'],
  ];

  for (const [attr, content] of ogReplacements) {
    const tag = `<meta property="${attr}" content="${content.replace(/"/g, '&quot;')}">`;
    const re = new RegExp(`<meta[^>]*property=["']${attr}["'][^>]*>`, 'i');
    if (re.test(html)) html = html.replace(re, tag);
    else html = html.replace('</head>', `${tag}\n</head>`);
  }

  const twitterReplacements = [
    ['twitter:card', 'summary_large_image'],
    ['twitter:title', title],
    ['twitter:description', excerpt],
    ['twitter:image', ogImage],
  ];

  for (const [attr, content] of twitterReplacements) {
    const tag = `<meta name="${attr}" content="${content.replace(/"/g, '&quot;')}">`;
    const re = new RegExp(`<meta[^>]*name=["']${attr}["'][^>]*>`, 'i');
    if (re.test(html)) html = html.replace(re, tag);
    else html = html.replace('</head>', `${tag}\n</head>`);
  }

  html = html.replace(new RegExp(`<link[^>]*rel=["']canonical["'][^>]*>`), `<link rel="canonical" href="${BLOG_URL}/${slug}"/>`);

  const translationSlug = slug.endsWith('-en') ? slug.replace(/-en$/, '') : slug + '-en';
  const hreflangPt = slug.endsWith('-en') ? translationSlug : slug;
  const hreflangEn = slug.endsWith('-en') ? slug : translationSlug;
  const hreflangs = [
    `<link rel="alternate" hreflang="pt-BR" href="${BLOG_URL}/${hreflangPt}"/>`,
    `<link rel="alternate" hreflang="en" href="${BLOG_URL}/${hreflangEn}"/>`,
    `<link rel="alternate" hreflang="x-default" href="${BLOG_URL}/${hreflangPt}"/>`,
  ].join('\n');
  html = html.replace('</head>', `${hreflangs}\n</head>`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: ogImage,
    datePublished: `${pubDate}T00:00:00-03:00`,
    dateModified: `${pubDate}T00:00:00-03:00`,
    url: `${BLOG_URL}/${slug}`,
    author: { '@type': 'Person', name: 'Ismael Douglas', url: 'https://ismaeltech.com/' },
    publisher: { '@type': 'Organization', name: 'Ismael Douglas', logo: { '@type': 'ImageObject', url: ogImage } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BLOG_URL}/${slug}` },
    inLanguage: lang === 'en' ? 'en' : 'pt-BR',
  };

  const ldTag = `<script type="application/ld+json" id="blog-jsonld">${JSON.stringify(jsonLd, null, 2)}<\/script>`;
  html = html.replace(new RegExp(`<script[^>]*id=["']blog-jsonld["'][^>]*>[\s\S]*?<\/script>`, 'i'), ldTag);

  html = html.replace('<div id="root"></div>', `<div id="root"><div class="blogpost-article">${articleHtml}</div></div>`);
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
}

function writeSitemap(posts) {
  const postsXml = posts.filter(p => !p.translation_of).map(post => `
  <url>
    <loc>${BLOG_URL}/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${BLOG_URL}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n${postsXml}\n</urlset>`;
  writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('  → sitemap.xml');
}

function writeRobotsTxt() {
  const robots = `User-agent: *
Allow: /\n\nSitemap: https://ismaeltech.com/sitemap.xml\nSitemap: https://blog.ismaeltech.com/sitemap.xml\n`;
  writeFileSync(join(distDir, 'robots.txt'), robots, 'utf-8');
  console.log('  → robots.txt');
}

function writeFeed(posts) {
  const items = posts.filter(p => !p.translation_of).map(post => {
    const isEn = post.lang === 'en';
    const title = isEn && post.title_en ? post.title_en : post.title;
    const excerpt = isEn && post.excerpt_en ? post.excerpt_en : post.excerpt;
    const date = new Date(post.date + 'T12:00:00-03:00').toUTCString();
    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${BLOG_URL}/${post.slug}</link>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
      <guid isPermaLink="true">${BLOG_URL}/${post.slug}</guid>
    </item>`;
  }).join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog - Ismael Douglas</title>
    <link>${BLOG_URL}/</link>
    <description>Artigos sobre desenvolvimento web, design e tecnologia.</description>
    <language>pt-BR</language>
    <atom:link href="${BLOG_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;
  writeFileSync(join(distDir, 'feed.xml'), feed, 'utf-8');
  console.log('  → feed.xml');
}

function writeLlmTxt(posts) {
  const entries = posts.filter(p => !p.translation_of).map(p => `- [${p.title}](${BLOG_URL}/${p.slug}): ${p.excerpt}`).join('\n');
  const content = `# Blog - Ismael Douglas

Ismael Douglas é desenvolvedor Full Stack especializado em desenvolvimento web moderno.
Este blog compartilha conhecimentos sobre desenvolvimento, design e tecnologia.

## Articles

${entries}
`;
  writeFileSync(join(distDir, 'llms.txt'), content, 'utf-8');
  console.log('  → llms.txt');
}

async function main() {
  console.log('🚀 Starting blog prerender...');

  if (!existsSync(distDir)) throw new Error(`Dist not found: ${distDir}. Run vite build first.`);

  const metaResponse = await fetchBlogMetadata();
  const posts = metaResponse.posts || [];
  console.log(`✅ Found ${posts.length} posts\n`);

  const ogImage = DEFAULT_OG_IMAGE;
  let successCount = 0;
  let skipCount = 0;

  for (const post of posts) {
    const isEn = post.lang === 'en';
    const displayTitle = isEn && post.title_en ? post.title_en : post.title;
    const displayExcerpt = isEn && post.excerpt_en ? post.excerpt_en : post.excerpt;
    const slug = post.slug;

    let mdResponse;
    const mdUrls = [
      `${GITHUB_RAW_BASE}/main/posts/${slug}.md`,
      `${GITHUB_RAW_BASE}/master/posts/${slug}.md`,
    ];

    for (const mdUrl of mdUrls) {
      try {
        mdResponse = await fetchText(mdUrl);
        if (mdResponse) break;
      } catch {}
    }

    if (!mdResponse) {
      console.warn(`⚠️  Skipping ${slug}: markdown not found`);
      skipCount++;
      continue;
    }

    const mdText = stripFrontmatter(mdResponse);
    const articleHtml = await renderMarkdown(mdText);

    const translationSlug = post.translation_slug || slug;
    const hreflangPt = slug.endsWith('-en') ? translationSlug : slug;
    const hreflangEn = slug.endsWith('-en') ? slug : translationSlug;

    writeStaticHtml(slug, isEn ? 'en' : 'pt-BR', displayTitle, displayExcerpt, post.date, ogImage, articleHtml);
    successCount++;
  }

  console.log(`\n✅ Generated ${successCount} static pages`);
  if (skipCount > 0) console.log(`⚠️  Skipped ${skipCount} posts`);

  writeSitemap(posts);
  writeFeed(posts);
  writeRobotsTxt();
  writeLlmTxt(posts);

  console.log('✨ Pre-render complete');
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
