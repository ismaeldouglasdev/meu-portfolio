/**
 * blog-md.mjs — lógica compartilhada de renderização do blog.
 *
 * Usado pelo SPA (BlogPostPage.tsx via Vite) e pelo prerender estático
 * (scripts/prerender.mjs via Node). Evita duplicação e garante que o HTML
 * estático (crawler) e o HTML client-side saiam idênticos.
 *
 * Só dependências nativas: nada de unist-util-* ou hast — walker próprio.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapa texto para inserção segura em HTML. */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
}

/** Escapa caracteres de regex. */
function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Gera slug de heading (id de âncora): "O virar de chave" → "o-virar-de-chave". */
export function slugify(text) {
  const slug = String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}

/**
 * Remove blocos de código cercado (fenced) do texto, para que termos dentro
 * de código não sejam detectados pelo glossário.
 */
export function stripFencedCode(text) {
  return String(text)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ');
}

// HeadingFontes/crédito que não devem aparecer no TOC.
const TOC_SKIP = /^(fontes|sources|refer[eê]ncias|references)\b|cr[eê]dito da imagem|^\s*📸/i;

// ---------------------------------------------------------------------------
// TOC — extração (texto) e ids (rehype)
// ---------------------------------------------------------------------------

/**
 * Extrai headings h2/h3 do markdown do artigo, pulando:
 * - conteúdo dentro de fence blocks (``` / ~~~)
 * - seções de fontes/crédito (não são conteúdo navegável)
 *
 * Os ids usam o MESMO slugify + dedup do headingIdPlugin, na mesma ordem do
 * documento — as âncoras do TOC batem com os ids renderizados.
 */
export function extractToc(markdown) {
  const used = new Map();
  const toc = [];
  const lines = String(markdown).split('\n');
  let fence = null;
  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fence === fenceMatch[1]) fence = null;
      continue;
    }
    if (fence) continue;

    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const level = m[1].length; // 2 ou 3
    const text = m[2].trim();
    if (TOC_SKIP.test(text)) continue;

    const base = slugify(text);
    const n = (used.get(base) || 0) + 1;
    used.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;
    toc.push({ id, text, level });
  }
  return toc;
}

/** Plugin rehype: adiciona `id` aos h2/h3 (slugify + dedup em ordem DOM). */
export function headingIdPlugin() {
  const used = new Map();
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'element') return;
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      const text = nodeText(node);
      const base = slugify(text);
      const n = (used.get(base) || 0) + 1;
      used.set(base, n);
      node.properties = node.properties || {};
      node.properties.id = n === 1 ? base : `${base}-${n}`;
    });
  };
}

// ---------------------------------------------------------------------------
// Glossário — indexação por post e linkagem no texto
// ---------------------------------------------------------------------------

/**
 * Detecta quais termos do glossário aparecem no artigo (fora de code fences)
 * e retorna a lista ordenada pela primeira ocorrência no texto.
 *
 * glossary: { termo: { pt: string; en: string } }
 */
export function buildGlossaryIndex(articleText, glossary, lang = 'pt') {
  const text = stripFencedCode(articleText);
  const entries = [];
  for (const [term, defs] of Object.entries(glossary)) {
    if (!defs) continue;
    const re = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
    const match = text.match(re);
    if (!match) continue;
    entries.push({
      term,
      slug: slugify(term),
      definition: defs[lang] || defs.pt || term,
      index: match.index,
    });
  }
  entries.sort((a, b) => a.index - b.index);
  return entries.map(({ index, ...rest }) => rest); // index só para ordenar
}

/**
 * Plugin rehype: envolve a PRIMEIRA ocorrência de cada termo do glossário em
 * <a class="blog-glossary-term" href="#glossario-<slug>" data-def="...">.
 *
 * Não linka dentro de code/pre/a/headings (evita link aninhado e sujeira no
 * id dos headings). Preserva o texto original (case intacto).
 */
export function glossaryTermPlugin(index) {
  const linked = new Set();
  const terms = [...index]
    .sort((a, b) => b.term.length - a.term.length)
    .map((e) => ({ ...e, re: new RegExp(`\\b(${escapeRegExp(e.term)})\\b`, 'gi') }));

  return (tree) => {
    walkChildren(tree, (node, parent, childIndex) => {
      if (node.type !== 'text') return;
      if (!parent || shouldSkipLinking(parent)) return;
      const nodes = linkText(node.value, parent, childIndex);
      if (nodes && nodes.length) parent.children.splice(childIndex, 1, ...nodes);
    });
  };

  function linkText(value, parent, childIndex) {
    if (!value || !terms.length) return null;
    const out = [];
    let rest = value;
    let replaced = false;
    while (rest) {
      let best = null;
      for (const t of terms) {
        if (linked.has(t.term)) continue;
        t.re.lastIndex = 0;
        const m = t.re.exec(rest);
        if (m && (!best || m.index < best.index)) best = { term: t, m };
      }
      if (!best) break;
      const head = rest.slice(0, best.m.index);
      if (head) out.push({ type: 'text', value: head });
      out.push(makeTermLink(best.term, best.m[0]));
      linked.add(best.term.term);
      rest = rest.slice(best.m.index + best.m[0].length);
      replaced = true;
    }
    if (!replaced) return null;
    if (rest) out.push({ type: 'text', value: rest });
    return out;
  }

  function makeTermLink(entry, matchedText) {
    return {
      type: 'element',
      tagName: 'a',
      properties: {
        className: ['blog-glossary-term'],
        href: `#glossario-${entry.slug}`,
        'data-def': entry.definition,
        'aria-label': entry.definition,
      },
      children: [{ type: 'text', value: matchedText }],
    };
  }
}

function shouldSkipLinking(parent) {
  const tag = parent.tagName;
  return (
    tag === 'code' ||
    tag === 'pre' ||
    tag === 'a' ||
    tag === 'h1' ||
    tag === 'h2' ||
    tag === 'h3' ||
    tag === 'h4' ||
    tag === 'h5' ||
    tag === 'h6' ||
    tag === 'script' ||
    tag === 'style'
  );
}

// ---------------------------------------------------------------------------
// Renderizadores HTML (strings) — usados pelo SPA (dangerouslySetInnerHTML)
// e pelo prerender. Saída escapada.
// ---------------------------------------------------------------------------

const HTML_ATTR = (k, v) => (v == null ? '' : ` ${k}="${escapeHtml(v)}"`);

/** Box "Nesta página" (TOC). */
export function renderTocHtml(toc, label) {
  if (!toc || !toc.length) return '';
  const items = toc
    .map(
      (h) =>
        `<li class="blogpost-toc-item blogpost-toc-level-${h.level}"><a href="#${escapeHtml(h.id)}">${escapeHtml(h.text)}</a></li>`
    )
    .join('');
  return (
    `<nav class="blogpost-toc" aria-label="${escapeHtml(label)}">` +
    `<h2 class="blogpost-toc-title">${escapeHtml(label)}</h2>` +
    `<ul class="blogpost-toc-list">${items}</ul>` +
    `</nav>`
  );
}

/** Seção "Glossário" do post (dl de termos + definições). */
export function renderGlossaryHtml(index, label) {
  if (!index || !index.length) return '';
  const entries = index
    .map(
      (e) =>
        `<div class="blogpost-glossary-entry" id="glossario-${escapeHtml(e.slug)}">` +
        `<dt class="blogpost-glossary-term">${escapeHtml(e.term)}</dt>` +
        `<dd class="blogpost-glossary-def">${escapeHtml(e.definition)}</dd>` +
        `</div>`
    )
    .join('');
  return (
    `<section class="blogpost-glossary" aria-label="${escapeHtml(label)}">` +
    `<h2 class="blogpost-glossary-title">${escapeHtml(label)}</h2>` +
    `<dl class="blogpost-glossary-list">${entries}</dl>` +
    `</section>`
  );
}

/** Seção FAQ do post (details/summary). */
export function renderFaqHtml(faqs, label) {
  if (!faqs || !faqs.length) return '';
  const items = faqs
    .map(
      (f, i) =>
        `<details class="blogpost-faq-item" id="faq-${i + 1}">` +
        `<summary class="blogpost-faq-q">${escapeHtml(f.q)}</summary>` +
        `<div class="blogpost-faq-a">${escapeHtml(f.a)}</div>` +
        `</details>`
    )
    .join('');
  return (
    `<section class="blogpost-faq" aria-label="${escapeHtml(label)}">` +
    `<h2 class="blogpost-faq-title">${escapeHtml(label)}</h2>` +
    `${items}` +
    `</section>`
  );
}

// ---------------------------------------------------------------------------
// Walker mínimo de árvore hast
// ---------------------------------------------------------------------------

function walk(node, fn) {
  if (!node || typeof node !== 'object') return;
  fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, fn);
  }
}

function walkChildren(node, fn) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.children)) {
    // De trás pra frente: splice de children não desloca índices ainda não visitados
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      walkChildren(child, fn);
      fn(child, node, i);
    }
  }
}

function nodeText(node) {
  let out = '';
  walk(node, (n) => {
    if (n.type === 'text') out += n.value;
  });
  return out;
}