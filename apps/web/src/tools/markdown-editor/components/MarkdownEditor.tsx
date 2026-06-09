'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Bold,
  Code,
  Columns2,
  Download,
  Eraser,
  Eye,
  FileCode2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  PanelLeft,
  Quote,
  Table2,
} from 'lucide-react';
import CopyButton from '@/shared/components/toolkit/CopyButton';
import ToolPanel from '@/shared/components/toolkit/ToolPanel';
import StatPill from '@/shared/components/toolkit/StatPill';
import { copyToClipboard, downloadText } from '@/shared/utils/fileExport';
import { computeTextStats } from '@/shared/utils/textStats';
import { markdownSamples, readmeTemplate } from '@/tools/markdown-editor/data/markdownSamples';
import { buildStandaloneHtml, renderMarkdown } from '@/tools/markdown-editor/utils/markdownRender';

type ViewMode = 'split' | 'editor' | 'preview';
type MobilePane = 'editor' | 'preview';

interface ToolbarAction {
  id: string;
  label: string;
  title: string;
  icon: React.ReactNode;
  run: () => void;
}

const DEFAULT_MARKDOWN = readmeTemplate;

function createHtmlTitle(markdownText: string): string {
  const firstHeading = markdownText.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return firstHeading || 'ToolsBox Markdown Export';
}

function createExportFilename(markdownText: string): string {
  const title = createHtmlTitle(markdownText)
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return `${title || 'markdown-export'}.html`;
}

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [mobilePane, setMobilePane] = useState<MobilePane>('editor');
  const [statusMessage, setStatusMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const rendered = useMemo(() => renderMarkdown(markdown), [markdown]);
  const textStats = useMemo(() => computeTextStats(markdown), [markdown]);
  const readingTime = Math.max(1, Math.ceil(textStats.words / 200));
  const standaloneHtml = useMemo(
    () => buildStandaloneHtml(createHtmlTitle(markdown), rendered.sanitizedHtml),
    [markdown, rendered.sanitizedHtml],
  );

  function flashStatus(message: string) {
    setStatusMessage(message);
    window.setTimeout(() => setStatusMessage(''), 1800);
  }

  function focusAndSelect(start: number, end: number) {
    window.requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start, end);
    });
  }

  function replaceSelection(nextText: string, selectionStartOffset = nextText.length, selectionEndOffset = selectionStartOffset) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const before = markdown.slice(0, selectionStart);
    const after = markdown.slice(selectionEnd);
    const nextMarkdown = `${before}${nextText}${after}`;

    setMarkdown(nextMarkdown);
    focusAndSelect(selectionStart + selectionStartOffset, selectionStart + selectionEndOffset);
  }

  function wrapSelection(prefix: string, suffix = prefix, fallback = 'text') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selected = markdown.slice(textarea.selectionStart, textarea.selectionEnd) || fallback;
    const inserted = `${prefix}${selected}${suffix}`;
    const start = prefix.length;
    const end = prefix.length + selected.length;
    replaceSelection(inserted, start, end);
  }

  function prefixSelectedLines(prefix: string, fallback = 'List item') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selected = markdown.slice(textarea.selectionStart, textarea.selectionEnd) || fallback;
    const lines = selected.split('\n');
    const inserted = lines.map((line) => `${prefix}${line}`).join('\n');
    replaceSelection(inserted, 0, inserted.length);
  }

  function numberSelectedLines() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selected = markdown.slice(textarea.selectionStart, textarea.selectionEnd) || 'First item\nSecond item';
    const inserted = selected
      .split('\n')
      .map((line, index) => `${index + 1}. ${line.replace(/^\d+\.\s*/, '')}`)
      .join('\n');
    replaceSelection(inserted, 0, inserted.length);
  }

  function insertBlock(block: string, cursorOffset = block.length) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const needsLeadingNewline = textarea.selectionStart > 0 && !markdown.slice(0, textarea.selectionStart).endsWith('\n');
    const needsTrailingNewline = textarea.selectionEnd < markdown.length && !markdown.slice(textarea.selectionEnd).startsWith('\n');
    const inserted = `${needsLeadingNewline ? '\n\n' : ''}${block}${needsTrailingNewline ? '\n\n' : ''}`;
    const leadingOffset = needsLeadingNewline ? 2 : 0;
    replaceSelection(inserted, leadingOffset + cursorOffset, leadingOffset + cursorOffset);
  }

  const toolbarGroups: ToolbarAction[][] = [
    [
      { id: 'bold', label: 'Bold', title: '加粗', icon: <Bold className="h-3.5 w-3.5" />, run: () => wrapSelection('**', '**', 'bold text') },
      { id: 'italic', label: 'Italic', title: '斜体', icon: <Italic className="h-3.5 w-3.5" />, run: () => wrapSelection('*', '*', 'italic text') },
      { id: 'inline-code', label: 'Code', title: '行内代码', icon: <Code className="h-3.5 w-3.5" />, run: () => wrapSelection('`', '`', 'code') },
    ],
    [
      { id: 'h1', label: 'H1', title: '一级标题', icon: <Heading1 className="h-3.5 w-3.5" />, run: () => prefixSelectedLines('# ', 'Heading 1') },
      { id: 'h2', label: 'H2', title: '二级标题', icon: <Heading2 className="h-3.5 w-3.5" />, run: () => prefixSelectedLines('## ', 'Heading 2') },
      { id: 'h3', label: 'H3', title: '三级标题', icon: <Heading3 className="h-3.5 w-3.5" />, run: () => prefixSelectedLines('### ', 'Heading 3') },
    ],
    [
      { id: 'link', label: 'Link', title: '链接', icon: <Link className="h-3.5 w-3.5" />, run: () => wrapSelection('[', '](https://example.com)', 'link text') },
      { id: 'image', label: 'Image', title: '图片', icon: <ImageIcon className="h-3.5 w-3.5" />, run: () => replaceSelection('![alt text](https://example.com/image.png)', 2, 10) },
    ],
    [
      { id: 'code-block', label: 'Code Block', title: '代码块', icon: <FileCode2 className="h-3.5 w-3.5" />, run: () => insertBlock('```ts\nconst message = "Hello ToolsBox";\n```', 6) },
      { id: 'quote', label: 'Quote', title: '引用', icon: <Quote className="h-3.5 w-3.5" />, run: () => prefixSelectedLines('> ', 'Quote') },
      { id: 'ul', label: 'List', title: '无序列表', icon: <List className="h-3.5 w-3.5" />, run: () => prefixSelectedLines('- ', 'List item') },
      { id: 'ol', label: 'Ordered', title: '有序列表', icon: <ListOrdered className="h-3.5 w-3.5" />, run: numberSelectedLines },
    ],
    [
      {
        id: 'table',
        label: 'Table',
        title: '表格',
        icon: <Table2 className="h-3.5 w-3.5" />,
        run: () => insertBlock('| Column A | Column B |\n| --- | --- |\n| Value A | Value B |'),
      },
      { id: 'hr', label: 'HR', title: '水平分割线', icon: <Minus className="h-3.5 w-3.5" />, run: () => insertBlock('---') },
    ],
  ];

  function loadSample(sampleId: string) {
    const sample = markdownSamples.find((item) => item.id === sampleId);
    if (!sample) return;
    setMarkdown(sample.value);
    flashStatus(`已加载：${sample.label}`);
  }

  async function handleCopyHtml() {
    await copyToClipboard(rendered.sanitizedHtml);
    flashStatus('HTML 已复制');
  }

  function handleExportHtml() {
    downloadText(standaloneHtml, createExportFilename(markdown));
    flashStatus('HTML 文件已导出');
  }

  function clearEditor() {
    setMarkdown('');
    flashStatus('内容已清空');
    focusAndSelect(0, 0);
  }

  const desktopPaneClass =
    viewMode === 'split'
      ? 'grid-cols-2'
      : viewMode === 'editor'
        ? 'grid-cols-1'
        : 'grid-cols-1';

  return (
    <div className="space-y-5">
      <ToolPanel
        kicker="MARKDOWN WORKSPACE"
        title="Markdown 编辑器"
        subtitle="编辑 Markdown，实时预览渲染效果，并复制或导出安全的 HTML。"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="tb-segmented hidden md:inline-flex" aria-label="切换视图模式">
              <button type="button" className={`tb-segmented-item ${viewMode === 'split' ? 'active' : ''}`} onClick={() => setViewMode('split')}>
                <Columns2 className="mr-1 inline h-3.5 w-3.5" /> Split
              </button>
              <button type="button" className={`tb-segmented-item ${viewMode === 'editor' ? 'active' : ''}`} onClick={() => setViewMode('editor')}>
                <PanelLeft className="mr-1 inline h-3.5 w-3.5" /> Editor
              </button>
              <button type="button" className={`tb-segmented-item ${viewMode === 'preview' ? 'active' : ''}`} onClick={() => setViewMode('preview')}>
                <Eye className="mr-1 inline h-3.5 w-3.5" /> Preview
              </button>
            </div>
            <div className="tb-segmented md:hidden" aria-label="移动端切换编辑与预览">
              <button type="button" className={`tb-segmented-item ${mobilePane === 'editor' ? 'active' : ''}`} onClick={() => setMobilePane('editor')}>
                编辑
              </button>
              <button type="button" className={`tb-segmented-item ${mobilePane === 'preview' ? 'active' : ''}`} onClick={() => setMobilePane('preview')}>
                预览
              </button>
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="border-b border-[var(--tb-border)] p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {toolbarGroups.map((group, groupIndex) => (
                <React.Fragment key={`group-${groupIndex}`}>
                  {groupIndex > 0 && <div className="hidden h-6 w-px bg-[var(--tb-border)] sm:block" aria-hidden="true" />}
                  {group.map((action) => (
                    <button key={action.id} type="button" title={action.title} onClick={action.run} className="tb-toolbar-btn">
                      {action.icon}
                      <span className="hidden sm:inline">{action.label}</span>
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="加载 Markdown 模板"
                defaultValue=""
                onChange={(event) => {
                  loadSample(event.target.value);
                  event.currentTarget.value = '';
                }}
                className="rounded-full border border-[var(--tb-border)] bg-[var(--tb-surface)] px-3 py-2 text-xs font-medium text-[var(--tb-text)] outline-none transition focus:border-[var(--tb-accent)]"
              >
                <option value="" disabled>
                  加载模板
                </option>
                {markdownSamples.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.label}
                  </option>
                ))}
              </select>

              <CopyButton value={markdown} label="复制 Markdown" copiedLabel="已复制" />

              <button type="button" className="tb-toolbar-btn" onClick={handleCopyHtml} disabled={!rendered.sanitizedHtml}>
                <Code className="h-3.5 w-3.5" />
                <span>复制 HTML</span>
              </button>

              <button type="button" className="tb-toolbar-btn" onClick={handleExportHtml} disabled={!rendered.sanitizedHtml}>
                <Download className="h-3.5 w-3.5" />
                <span>导出 .html</span>
              </button>

              <button type="button" className="tb-toolbar-btn" onClick={clearEditor} disabled={!markdown}>
                <Eraser className="h-3.5 w-3.5" />
                <span>清空</span>
              </button>
            </div>
          </div>

          {statusMessage && <p className="mt-3 text-xs text-[var(--tb-accent)]">{statusMessage}</p>}
        </div>

        <div className={`hidden min-h-[680px] md:grid ${desktopPaneClass}`}>
          {(viewMode === 'split' || viewMode === 'editor') && (
            <section className="flex min-h-[680px] flex-col border-r border-[var(--tb-border)]">
              <div className="flex items-center justify-between border-b border-[var(--tb-border)] px-4 py-3">
                <span className="tb-section-kicker">EDITOR</span>
                <span className="text-xs text-[var(--tb-text-muted)]">Markdown</span>
              </div>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(event) => setMarkdown(event.target.value)}
                spellCheck={false}
                placeholder="在这里输入 Markdown..."
                className="min-h-0 flex-1 resize-none bg-transparent p-5 font-mono text-sm leading-7 text-[var(--tb-text)] outline-none placeholder:text-[var(--tb-text-muted)]"
              />
            </section>
          )}

          {(viewMode === 'split' || viewMode === 'preview') && (
            <section className="flex min-h-[680px] flex-col">
              <div className="flex items-center justify-between border-b border-[var(--tb-border)] px-4 py-3">
                <span className="tb-section-kicker">PREVIEW</span>
                <span className="text-xs text-[var(--tb-text-muted)]">Sanitized HTML</span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-5">
                {rendered.sanitizedHtml ? (
                  <div className="tb-markdown-preview" dangerouslySetInnerHTML={{ __html: rendered.sanitizedHtml }} />
                ) : (
                  <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[var(--tb-border)] text-sm text-[var(--tb-text-muted)]">
                    预览将在这里显示
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="md:hidden">
          {mobilePane === 'editor' ? (
            <section className="flex min-h-[620px] flex-col">
              <div className="flex items-center justify-between border-b border-[var(--tb-border)] px-4 py-3">
                <span className="tb-section-kicker">EDITOR</span>
                <span className="text-xs text-[var(--tb-text-muted)]">Markdown</span>
              </div>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(event) => setMarkdown(event.target.value)}
                spellCheck={false}
                placeholder="在这里输入 Markdown..."
                className="min-h-[620px] resize-y bg-transparent p-4 font-mono text-sm leading-7 text-[var(--tb-text)] outline-none placeholder:text-[var(--tb-text-muted)]"
              />
            </section>
          ) : (
            <section>
              <div className="flex items-center justify-between border-b border-[var(--tb-border)] px-4 py-3">
                <span className="tb-section-kicker">PREVIEW</span>
                <span className="text-xs text-[var(--tb-text-muted)]">Sanitized HTML</span>
              </div>
              <div className="min-h-[620px] overflow-auto p-4">
                {rendered.sanitizedHtml ? (
                  <div className="tb-markdown-preview" dangerouslySetInnerHTML={{ __html: rendered.sanitizedHtml }} />
                ) : (
                  <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[var(--tb-border)] text-sm text-[var(--tb-text-muted)]">
                    预览将在这里显示
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--tb-border)] p-4">
          <StatPill label="字符" value={textStats.characters.toLocaleString()} tone="accent" />
          <StatPill label="词数" value={textStats.words.toLocaleString()} />
          <StatPill label="行数" value={textStats.lines.toLocaleString()} />
          <StatPill label="阅读" value={`${readingTime} 分钟`} tone="success" />
          <StatPill label="标题" value={rendered.headings.toLocaleString()} />
          <StatPill label="链接" value={rendered.links.toLocaleString()} />
          <StatPill label="代码块" value={rendered.codeBlocks.toLocaleString()} />
        </div>
      </ToolPanel>

      <style jsx global>{`
        .tb-markdown-preview {
          color: var(--tb-text);
          font-size: 0.95rem;
          line-height: 1.75;
          word-break: break-word;
        }

        .tb-markdown-preview > :first-child {
          margin-top: 0;
        }

        .tb-markdown-preview > :last-child {
          margin-bottom: 0;
        }

        .tb-markdown-preview h1,
        .tb-markdown-preview h2,
        .tb-markdown-preview h3,
        .tb-markdown-preview h4,
        .tb-markdown-preview h5,
        .tb-markdown-preview h6 {
          color: var(--tb-text);
          font-weight: 700;
          line-height: 1.25;
          margin: 1.35em 0 0.6em;
        }

        .tb-markdown-preview h1 {
          font-size: clamp(1.75rem, 3vw, 2.35rem);
          border-bottom: 1px solid var(--tb-border);
          padding-bottom: 0.35em;
        }

        .tb-markdown-preview h2 {
          font-size: clamp(1.4rem, 2.4vw, 1.8rem);
          border-bottom: 1px solid var(--tb-border);
          padding-bottom: 0.3em;
        }

        .tb-markdown-preview h3 { font-size: 1.25rem; }
        .tb-markdown-preview h4 { font-size: 1.1rem; }
        .tb-markdown-preview h5 { font-size: 1rem; }
        .tb-markdown-preview h6 { font-size: 0.9rem; color: var(--tb-text-muted); }

        .tb-markdown-preview p,
        .tb-markdown-preview ul,
        .tb-markdown-preview ol,
        .tb-markdown-preview blockquote,
        .tb-markdown-preview table,
        .tb-markdown-preview pre {
          margin-bottom: 1rem;
        }

        .tb-markdown-preview a {
          color: var(--tb-accent);
          text-decoration: none;
          border-bottom: 1px solid color-mix(in srgb, var(--tb-accent) 40%, transparent);
        }

        .tb-markdown-preview a:hover {
          border-bottom-color: var(--tb-accent);
        }

        .tb-markdown-preview ul,
        .tb-markdown-preview ol {
          padding-left: 1.5rem;
        }

        .tb-markdown-preview li {
          margin: 0.25rem 0;
        }

        .tb-markdown-preview li > ul,
        .tb-markdown-preview li > ol {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .tb-markdown-preview code {
          border-radius: 0.375rem;
          background: color-mix(in srgb, var(--tb-accent) 12%, transparent);
          color: var(--tb-text);
          font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.88em;
          padding: 0.15rem 0.35rem;
        }

        .tb-markdown-preview pre {
          overflow-x: auto;
          border: 1px solid var(--tb-border);
          border-radius: 1rem;
          background: color-mix(in srgb, var(--tb-bg-soft) 82%, black 18%);
          box-shadow: inset 0 1px 0 color-mix(in srgb, white 4%, transparent);
          padding: 1rem;
        }

        .tb-markdown-preview pre code {
          display: block;
          background: transparent;
          padding: 0;
          color: inherit;
          font-size: 0.86rem;
          line-height: 1.65;
          white-space: pre;
        }

        .tb-markdown-preview blockquote {
          border-left: 4px solid var(--tb-accent);
          border-radius: 0 0.75rem 0.75rem 0;
          background: color-mix(in srgb, var(--tb-accent) 8%, transparent);
          color: var(--tb-text-muted);
          padding: 0.75rem 1rem;
        }

        .tb-markdown-preview blockquote > :last-child {
          margin-bottom: 0;
        }

        .tb-markdown-preview table {
          display: block;
          width: 100%;
          overflow-x: auto;
          border-collapse: collapse;
          border-spacing: 0;
        }

        .tb-markdown-preview th,
        .tb-markdown-preview td {
          border: 1px solid var(--tb-border);
          padding: 0.65rem 0.8rem;
          text-align: left;
          vertical-align: top;
        }

        .tb-markdown-preview th {
          background: color-mix(in srgb, var(--tb-accent) 8%, transparent);
          color: var(--tb-text);
          font-weight: 700;
        }

        .tb-markdown-preview tr:nth-child(even) td {
          background: color-mix(in srgb, var(--tb-surface) 60%, transparent);
        }

        .tb-markdown-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          border: 1px solid var(--tb-border);
        }

        .tb-markdown-preview hr {
          border: 0;
          border-top: 1px solid var(--tb-border);
          margin: 2rem 0;
        }

        .tb-markdown-preview strong { color: var(--tb-text); font-weight: 700; }
        .tb-markdown-preview em { color: var(--tb-text); }

        .tb-markdown-preview .hljs-comment,
        .tb-markdown-preview .hljs-quote { color: #94a3b8; }
        .tb-markdown-preview .hljs-keyword,
        .tb-markdown-preview .hljs-selector-tag,
        .tb-markdown-preview .hljs-subst { color: #22d3ee; }
        .tb-markdown-preview .hljs-number,
        .tb-markdown-preview .hljs-literal,
        .tb-markdown-preview .hljs-variable,
        .tb-markdown-preview .hljs-template-variable,
        .tb-markdown-preview .hljs-tag .hljs-attr { color: #34d399; }
        .tb-markdown-preview .hljs-string,
        .tb-markdown-preview .hljs-doctag { color: #fbbf24; }
        .tb-markdown-preview .hljs-title,
        .tb-markdown-preview .hljs-section,
        .tb-markdown-preview .hljs-selector-id { color: #f472b6; }
        .tb-markdown-preview .hljs-type,
        .tb-markdown-preview .hljs-class .hljs-title { color: #a78bfa; }
        .tb-markdown-preview .hljs-tag,
        .tb-markdown-preview .hljs-name,
        .tb-markdown-preview .hljs-attribute { color: #60a5fa; }
        .tb-markdown-preview .hljs-regexp,
        .tb-markdown-preview .hljs-link { color: #fb7185; }
      `}</style>
    </div>
  );
}
