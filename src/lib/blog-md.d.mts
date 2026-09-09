/**
 * Tipos para o módulo compartilhado src/lib/blog-md.mjs.
 * O TS resolve automaticamente este arquivo (blog-md.d.mts) para imports de
 * "./blog-md.mjs" (moduleResolution bundler/node).
 */

export interface TocEntry {
  /** Slug do heading, usado como id de âncora (ex.: "o-virar-de-chave"). */
  id: string;
  /** Texto limpo do heading (sem markdown). */
  text: string;
  /** Nível do heading: 2 (##) ou 3 (###). */
  level: number;
}

export interface GlossaryDef {
  pt: string;
  en: string;
}

/** Glossário global: termo (chave, minúsculo) → definições PT/EN. */
export type Glossary = Record<string, GlossaryDef>;

/** Entrada de glossário já resolvida para um post e idioma. */
export interface GlossaryTermEntry {
  /** Termo na grafia original (ex.: "Node.js"). */
  term: string;
  /** Slug do termo para âncoras (#glossario-<slug>). */
  slug: string;
  /** Definição no idioma do post. */
  definition: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export function escapeHtml(value: unknown): string;

export function slugify(text: string): string;

export function stripFencedCode(text: string): string;

export function extractToc(markdown: string): TocEntry[];

/** Factory de plugin rehype: adiciona `id` aos h2/h3 (mesmo slugify do TOC). */
export function headingIdPlugin(): (tree: unknown) => void;

/**
 * Detecta termos do glossário presentes no artigo (fora de code fences),
 * ordenados pela primeira ocorrência no texto.
 */
export function buildGlossaryIndex(
  articleText: string,
  glossary: Glossary,
  lang?: 'pt' | 'en'
): GlossaryTermEntry[];

/** Factory de plugin rehype: linka a primeira ocorrência de cada termo. */
export function glossaryTermPlugin(index: GlossaryTermEntry[]): (tree: unknown) => void;

/** Box "Nesta página" (TOC). Retorna '' se vazio. */
export function renderTocHtml(toc: TocEntry[], label: string): string;

/** Seção "Glossário" do post. Retorna '' se vazio. */
export function renderGlossaryHtml(index: GlossaryTermEntry[], label: string): string;

/** Seção FAQ (details/summary). Retorna '' se vazio. */
export function renderFaqHtml(faqs: FaqEntry[], label: string): string;