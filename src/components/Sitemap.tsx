import { useEffect, useState } from 'react';

const GITHUB_API = 'https://api.github.com/repos/ismaeldouglasdev/blog-content/contents/posts';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}

function Sitemap() {
  const [xml, setXml] = useState('');

  useEffect(() => {
    const fetchSitemap = async () => {
      const headers: HeadersInit = {};
      if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

      const res = await fetch(`${GITHUB_API}/_meta.json`, { headers });
      const data = await res.json();
      const meta = JSON.parse(decodeBase64Utf8(data.content));
      const posts = meta.posts || [];

      const urls = posts.map((p: { slug: string; date: string }) => `
  <url>
    <loc>https://blog.ismaeltech.com/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

      setXml(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://blog.ismaeltech.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`);
    };
    fetchSitemap();
  }, []);

  if (!xml) return null;

  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', padding: '2rem' }}>
      {xml}
    </pre>
  );
}

export default Sitemap;
