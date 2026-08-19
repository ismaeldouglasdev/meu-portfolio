import { useEffect, useState } from 'react';

const GITHUB_API = 'https://api.github.com/repos/ismaeldouglasdev/blog-content/contents/posts';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}

function Feed() {
  const [xml, setXml] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      const headers: HeadersInit = {};
      if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

      const res = await fetch(`${GITHUB_API}/_meta.json`, { headers });
      const data = await res.json();
      const meta = JSON.parse(decodeBase64Utf8(data.content));
      const posts = meta.posts || [];

      const items = posts.map((p: { slug: string; title: string; date: string; excerpt: string }) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>https://blog.ismaeltech.com/${p.slug}</link>
      <pubDate>${new Date(p.date + 'T12:00:00-03:00').toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
      <guid>https://blog.ismaeltech.com/${p.slug}</guid>
    </item>`).join('');

      setXml(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog — Ismael Douglas</title>
    <link>https://blog.ismaeltech.com/</link>
    <description>Artigos sobre desenvolvimento web, design e tecnologia.</description>
    <language>pt-BR</language>
    <atom:link href="https://blog.ismaeltech.com/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`);
    };
    fetchFeed();
  }, []);

  if (!xml) return null;

  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', padding: '2rem' }}>
      {xml}
    </pre>
  );
}

export default Feed;
