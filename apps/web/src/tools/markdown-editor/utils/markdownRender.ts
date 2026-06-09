/**
 * markdownRender.ts
 * Markdown rendering pipeline using marked + DOMPurify + highlight.js.
 *
 * Dependencies (installed separately):
 *   marked, dompurify, highlight.js, @types/dompurify
 */
import { marked } from 'marked';
import createDOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';

// Register the languages we want highlight.js to recognise in fenced code blocks.
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);      // alias html -> xml
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);

/* ── Types ─────────────────────────────────────────────────────── */

export interface MarkdownRenderResult {
  /** Raw HTML from marked (before sanitisation). */
  html: string;
  /** Sanitised HTML safe for dangerouslySetInnerHTML. */
  sanitizedHtml: string;
  /** Number of heading elements (<h1>-<h6>) in the rendered output. */
  headings: number;
  /** Number of anchor elements (<a>) in the rendered output. */
  links: number;
  /** Number of <pre><code> blocks in the rendered output. */
  codeBlocks: number;
}

/* ── Configure marked ──────────────────────────────────────────── */

marked.setOptions({
  gfm: true,                       // GitHub-Flavoured Markdown (tables, strikethrough, etc.)
  breaks: false,                   // line-breaks = <br> only when two trailing spaces present
});

/**
 * Custom renderer that delegates code-block highlighting to highlight.js.
 */
const renderer = new marked.Renderer();

renderer.code = function ({ text, lang }: { text: string; lang?: string }): string {
  // If a language is specified and highlight.js can handle it, emit highlighted HTML.
  // Otherwise fall back to a plain <pre><code> block.
  const language = lang || '';
  const validLang = language && hljs.getLanguage(language);

  if (validLang) {
    try {
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    } catch {
      // fall through to plain block
    }
  }

  // Plain fallback – escape the text ourselves to avoid XSS vectors in non-highlighted blocks.
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<pre><code class="hljs${language ? ` language-${language}` : ''}">${escaped}</code></pre>`;
};

marked.use({ renderer });

/* ── Helpers ───────────────────────────────────────────────────── */

/**
 * Count occurrences of a substring in a string using a regex.
 */
function countMatches(html: string, pattern: RegExp): number {
  const matches = html.match(pattern);
  return matches ? matches.length : 0;
}

function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html;
  }

  const purify = createDOMPurify(window);
  return purify.sanitize(html, {
    ADD_TAGS: ['pre', 'code', 'span'],
    ADD_ATTR: ['class'],
  });
}

/* ── Public API ────────────────────────────────────────────────── */

/**
 * Render markdown text to sanitized HTML and extract document statistics.
 *
 * @param markdownText - Raw markdown string.
 * @returns {MarkdownRenderResult} Rendered output + stats.
 */
export function renderMarkdown(markdownText: string): MarkdownRenderResult {
  if (!markdownText) {
    return { html: '', sanitizedHtml: '', headings: 0, links: 0, codeBlocks: 0 };
  }

  // 1. Parse markdown to raw HTML via marked.
  const rawHtml = marked.parse(markdownText) as string;

  // 2. Sanitise with DOMPurify in the browser – removes script tags, event handlers, etc.
  const sanitizedHtml = sanitizeHtml(rawHtml);

  // 3. Compute document statistics from the raw (unsanitised) HTML.
  //    Counting from raw is fine for statistics – we only sanitise what gets injected.
  const headings = countMatches(rawHtml, /<h[1-6][^>]*>/gi);
  const links = countMatches(rawHtml, /<a\s+[^>]*>/gi);
  const codeBlocks = countMatches(rawHtml, /<pre>/gi);

  return { html: rawHtml, sanitizedHtml, headings, links, codeBlocks };
}

/**
 * Build a complete standalone HTML document suitable for export.
 * Includes a minimal dark-theme stylesheet that matches the ToolsBox aesthetic.
 *
 * @param title - Page title for the <title> tag.
 * @param sanitizedHtml - Pre-sanitized HTML content to embed in the body.
 * @returns A complete, self-contained HTML document string.
 */
export function buildStandaloneHtml(title: string, sanitizedHtml: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f1115;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
      line-height: 1.7;
      padding: 2rem;
      max-width: 960px;
      margin: 0 auto;
    }
    h1, h2, h3, h4, h5, h6 { color: #f1f5f9; font-weight: 600; line-height: 1.3; margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { font-size: 2rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.4em; }
    h2 { font-size: 1.6rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.3em; }
    h3 { font-size: 1.35rem; }
    h4 { font-size: 1.15rem; }
    p { margin-bottom: 1em; }
    a { color: #22d3ee; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ul, ol { margin: 0.5em 0 1em 1.8em; }
    li { margin-bottom: 0.25em; }
    pre {
      background: #1a1d24;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 0.75rem;
      padding: 1rem;
      overflow-x: auto;
      font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 1em 0;
    }
    code {
      font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      font-size: 0.875em;
      background: rgba(255,255,255,0.06);
      padding: 0.15em 0.4em;
      border-radius: 0.3em;
    }
    pre code {
      background: transparent;
      padding: 0;
      border-radius: 0;
    }
    blockquote {
      border-left: 4px solid #22d3ee;
      padding: 0.5em 1em;
      margin: 1em 0;
      background: rgba(34, 211, 238, 0.04);
      border-radius: 0 0.5rem 0.5rem 0;
      color: #94a3b8;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid rgba(255,255,255,0.08);
      padding: 0.5em 0.75em;
      text-align: left;
    }
    th { background: rgba(255,255,255,0.04); font-weight: 600; }
    tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
    img { max-width: 100%; border-radius: 0.5rem; }
    hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2em 0; }
  </style>
</head>
<body>
  ${sanitizedHtml}
</body>
</html>`;
}

/* ── Internal helpers ──────────────────────────────────────────── */

/**
 * Escape HTML entities in a plain-text string so it is safe inside an HTML
 * document body or attribute.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}