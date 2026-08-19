# Blog Planning — blog.ismaeltech.com

## Status Atual

- **Stack**: React 19 + TypeScript + Vite 8 + React Router 7
- **Deploy**: Vercel (mesmo projeto que ismaeltech.com)
- **Conteudo**: Repo privado `ismaeldouglasdev/blog-content` (markdown + _meta.json)
- **Geracao**: cron 9h/dia via `blog-generator.py` (usa daemon :20131)
- **Posts publicados**: 3 (CSS Grid, React Hooks, Prisma ORM)
- **Renderer**: react-markdown + remark-gfm + rehype-highlight (Tokyo Night)

## Fase 1: SEO & Performance

### 1.1 JSON-LD Structured Data (Article schema)
- Adicionar `<script type="application/ld+json">` em BlogPostPage.tsx
- Schema: headline, datePublished, dateModified, author, image (placeholder), publisher
- Google rich results para artigos

### 1.2 Open Graph Dinamico por Post
- Meta tags `og:title`, `og:description`, `og:image`, `og:url` via `useEffect`
- Atualizar `document.title` + meta tags no head via `document.querySelector`
- Default image para posts sem capa (placeholder gerado)

### 1.3 Sitemap.xml
- Criar rota `/sitemap.xml` no App.tsx
- Gerar dinamicamente do `_meta.json` (ou build-time se preferir)
- Incluir: `<lastmod>`, `<changefreq>`, `<priority>`

### 1.4 RSS Feed
- Criar rota `/feed.xml`
- Formato RSS 2.0 com items do `_meta.json`
- Link auto-discovery no `<head>` do index.html

### 1.5 Preconnect & Resource Hints
- Preconnect para `fonts.googleapis.com` (ja existe)
- Preload do CSS critical path
- Lazy load de imagens futuras

## Fase 2: UI do Blog

### 2.1 Tags Clicaveis
- Tags no card de cada post
- Click na tag filtra posts (query param `?tag=react`)
- Pagina dedicada `/tags/:tag`

### 2.2 Paginacao
- Max 9 posts por pagina (grid 3x3)
- Botao "Carregar mais" ou paginacao numerica
- URL pagination: `/?page=2`

### 2.3 Imagem de Capa (Optional)
- Campo `cover` no _meta.json
- BlogPostPage mostra cover como hero image
- BlogPage mostra cover no card (primeiro post em destaque)

### 2.4 Dark/Light Mode Explicito
- Toggle no header do blog (independente do portfolio)
- Salvar preferencia em localStorage separado
- Respeitar `prefers-color-scheme`

### 2.5 Busca
- Barra de busca no header
- Filtra por titulo + excerpt client-side
- Debounced input

## Fase 3: Conteudo

### 3.1 Pool de Topicos Expandido
- 20 topicos hoje -> 50+ (cobrir: Go, Docker, AWS, CSS avancado, Testing, etc.)
- Topicos sazonais (Black Friday tech, ano novo, etc.)
- Topicos baseados em trends

### 3.2 Conteudo Mais Rico
- Exemplos de codigo com copy-paste button
- Callout boxes (Dica, Atencao, Nota)
- Links internos entre posts relacionados
- "Leitura recomendada" no final de cada post

### 3.3 Categorias & Sidebar
- Sidebar com categorias (Tutorial, Case Study, Artigo)
- Contador de posts por categoria
- Posts populares (por data, nao por analytics ainda)

## Fase 4: CI/CD & Qualidade

### 4.1 GitHub Actions (blog-content)
- Workflow: lint markdown (markdownlint)
- Validar frontmatter (schema check)
- Auto-merge se lint passar

### 4.2 Notificacao
- Webhook Discord quando PR e criado
- Template de notificacao bonito

### 4.3 Monitoramento
- Contagem de posts gerados/dia
- Taxa de sucesso do cron
- Alerta se daemon cair

## Ordem de Execucao

1. **Fase 1** (SEO) — Impacto imediato no Google
2. **Fase 2.1-2.2** (Tags + Paginacao) — UX basica
3. **Fase 3.1** (Mais topicos) — Conteudo fresco
4. **Fase 2.3-2.4** (Capa + Dark mode) — Visual
5. **Fase 3.2-3.3** (Rich content + Sidebar) — Profundidade
6. **Fase 4** (CI/CD) — Qualidade

## Decisoes Tecnicas Pendentes

- **RSS**: server-side (Vercel function) ou client-side gerado?
- **Sitemap**: build-time ou on-demand?
- **Imagens de capa**: geradas por IA ou upload manual?
- **Busca**: client-side (fuse.js) ou server-side?
