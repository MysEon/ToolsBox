'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import CopyButton from '@/shared/components/toolkit/CopyButton';
import ToolPanel from '@/shared/components/toolkit/ToolPanel';
import StatPill from '@/shared/components/toolkit/StatPill';
import { evaluateRegex, type RegexEvaluation, type RegexMatch } from '../utils/regexEngine';
import { regexTemplates, type RegexTemplateCategory } from '../data/regexTemplates';

/* ───────── constants ───────── */

const FLAG_OPTIONS = [
  { flag: 'g', label: 'g', title: '全局匹配 (global)' },
  { flag: 'i', label: 'i', title: '忽略大小写 (ignoreCase)' },
  { flag: 'm', label: 'm', title: '多行模式 (multiline)' },
  { flag: 's', label: 's', title: '单行模式 (dotAll)' },
  { flag: 'u', label: 'u', title: 'Unicode 模式' },
] as const;

const CATEGORIES: { value: RegexTemplateCategory | '全部'; label: string }[] = [
  { value: '全部', label: '全部' },
  { value: '常用', label: '常用' },
  { value: 'Web', label: 'Web' },
  { value: '中文场景', label: '中文场景' },
  { value: '数据提取', label: '数据提取' },
];

const fieldClass =
  'w-full rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] px-4 py-3 text-sm text-[var(--tb-text)] placeholder:text-[var(--tb-text-muted)] outline-none transition focus:border-[var(--tb-accent)] focus:shadow-[0_0_0_3px_var(--tb-glow)] font-mono';

/* ───────── sub-components ───────── */

function FlagToggle({
  flag,
  title,
  active,
  onToggle,
}: {
  flag: string;
  title: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onToggle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-bold transition ${
        active
          ? 'border-[var(--tb-accent)] bg-[var(--tb-accent)] text-white shadow-[0_0_8px_var(--tb-glow)]'
          : 'border-[var(--tb-border)] bg-[var(--tb-surface)] text-[var(--tb-text-muted)] hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)]'
      }`}
    >
      {flag}
    </button>
  );
}

function HighlightedText({
  input,
  matches,
}: {
  input: string;
  matches: RegexMatch[];
}) {
  if (!input || matches.length === 0) {
    return <span>{input}</span>;
  }

  // Sort matches by index and remove overlaps
  const sorted = [...matches].sort((a, b) => a.index - b.index);
  const nonOverlapping: RegexMatch[] = [];
  let lastEnd = -1;
  for (const m of sorted) {
    if (m.index >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.endIndex;
    }
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  nonOverlapping.forEach((m, idx) => {
    if (m.index > cursor) {
      parts.push(
        <span key={`t-${idx}`}>{input.slice(cursor, m.index)}</span>,
      );
    }
    parts.push(
      <mark
        key={`m-${idx}`}
        className="rounded-sm bg-[var(--tb-accent)]/25 text-[var(--tb-text)] px-0.5"
      >
        {input.slice(m.index, m.endIndex)}
      </mark>,
    );
    cursor = m.endIndex;
  });

  if (cursor < input.length) {
    parts.push(<span key="tail">{input.slice(cursor)}</span>);
  }

  return <>{parts}</>;
}

function MatchDetail({
  m,
  index,
  expanded,
  onToggle,
}: {
  m: RegexMatch;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-[var(--tb-accent)]/5"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--tb-accent)]/15 text-[10px] font-bold text-[var(--tb-accent)]">
          {index + 1}
        </span>
        <span className="min-w-0 truncate font-mono text-[var(--tb-text)]">
          {m.match || <span className="text-[var(--tb-text-muted)] italic">零宽匹配</span>}
        </span>
        <span className="ml-auto shrink-0 text-xs text-[var(--tb-text-muted)]">
          [{m.index}..{m.endIndex}]
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[var(--tb-text-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--tb-text-muted)]" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-[var(--tb-border)] px-4 py-3 space-y-2">
          {m.groups.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--tb-text-muted)] mb-1">捕获组</p>
              <div className="space-y-1">
                {m.groups.map((g, gi) => (
                  <div
                    key={gi}
                    className="flex items-center gap-2 text-xs font-mono"
                  >
                    <span className="shrink-0 rounded-md bg-[var(--tb-accent)]/10 px-1.5 py-0.5 text-[var(--tb-accent)]">
                      ${gi + 1}
                    </span>
                    <span className="text-[var(--tb-text)] break-all">
                      {g !== undefined ? g : <span className="italic text-[var(--tb-text-muted)]">undefined</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {m.namedGroups && Object.keys(m.namedGroups).length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--tb-text-muted)] mb-1">命名捕获组</p>
              <div className="space-y-1">
                {Object.entries(m.namedGroups).map(([name, value]) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 text-xs font-mono"
                  >
                    <span className="shrink-0 rounded-md bg-[var(--tb-accent-2)]/15 px-1.5 py-0.5 text-[var(--tb-accent-2)]">
                      {name}
                    </span>
                    <span className="text-[var(--tb-text)] break-all">
                      {value !== undefined ? value : <span className="italic text-[var(--tb-text-muted)]">undefined</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────── main component ───────── */

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gi');
  const [testText, setTestText] = useState('');
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [templateCategory, setTemplateCategory] = useState<RegexTemplateCategory | '全部'>('全部');

  // Evaluate regex in real-time
  const evaluation: RegexEvaluation = useMemo(
    () => evaluateRegex(pattern, flags, testText),
    [pattern, flags, testText],
  );

  // Derived stats
  const totalGroups = useMemo(
    () => evaluation.matches.reduce((sum, m) => sum + m.groups.length, 0),
    [evaluation.matches],
  );

  // Compose the regex string for copy
  const regexString = useMemo(() => {
    if (!pattern) return '';
    return `/${pattern}/${flags}`;
  }, [pattern, flags]);

  // Matches as JSON for copy
  const matchesJson = useMemo(() => {
    if (evaluation.matches.length === 0) return '';
    return JSON.stringify(evaluation.matches, null, 2);
  }, [evaluation.matches]);

  // Flag toggle handler
  const toggleFlag = useCallback((flag: string) => {
    setFlags((prev) => {
      if (prev.includes(flag)) return prev.replace(flag, '');
      return prev + flag;
    });
  }, []);

  // Apply a template
  const applyTemplate = useCallback((t: (typeof regexTemplates)[number]) => {
    setPattern(t.pattern);
    setFlags(t.flags);
    setTestText(t.sample);
    setExpandedMatch(null);
  }, []);

  // Filtered templates
  const filteredTemplates = useMemo(
    () =>
      templateCategory === '全部'
        ? regexTemplates
        : regexTemplates.filter((t) => t.category === templateCategory),
    [templateCategory],
  );

  return (
    <div className="space-y-6">
      {/* ── Pattern Input ── */}
      <ToolPanel
        kicker="表达式"
        title="正则表达式"
        subtitle="输入正则模式和匹配标志"
        actions={
          <CopyButton value={regexString} label="复制正则" copiedLabel="已复制" disabled={!pattern} />
        }
      >
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xl font-bold text-[var(--tb-accent)]">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="输入正则表达式..."
            spellCheck={false}
            className={fieldClass}
          />
          <span className="shrink-0 text-xl font-bold text-[var(--tb-accent)]">/</span>
          <div className="flex shrink-0 items-center gap-1">
            {FLAG_OPTIONS.map((f) => (
              <FlagToggle
                key={f.flag}
                flag={f.label}
                title={f.title}
                active={flags.includes(f.flag)}
                onToggle={() => toggleFlag(f.flag)}
              />
            ))}
          </div>
        </div>

        {/* Error */}
        {!evaluation.isValid && evaluation.error && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="font-mono break-all">{evaluation.error}</span>
          </div>
        )}
      </ToolPanel>

      {/* ── Test Area + Results ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Input */}
        <ToolPanel
          kicker="输入"
          title="测试文本"
          subtitle="在此输入需要匹配的文本"
          actions={
            <CopyButton value={testText} label="复制文本" copiedLabel="已复制" disabled={!testText} />
          }
        >
          <textarea
            value={testText}
            onChange={(e) => {
              setTestText(e.target.value);
              setExpandedMatch(null);
            }}
            placeholder="粘贴或输入测试文本..."
            rows={10}
            spellCheck={false}
            className={`${fieldClass} resize-y min-h-[160px]`}
          />
        </ToolPanel>

        {/* Results */}
        <ToolPanel
          kicker="结果"
          title="匹配结果"
          subtitle={
            evaluation.isValid
              ? evaluation.matches.length > 0
                ? '点击展开查看捕获组详情'
                : '暂无匹配'
              : '正则表达式无效'
          }
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <StatPill
                label="匹配数"
                value={evaluation.matches.length}
                tone={evaluation.matches.length > 0 ? 'accent' : 'default'}
              />
              {totalGroups > 0 && (
                <StatPill label="捕获组" value={totalGroups} tone="success" />
              )}
              <CopyButton value={matchesJson} label="复制 JSON" copiedLabel="已复制" disabled={!matchesJson} />
            </div>
          }
        >
          {evaluation.isValid && evaluation.matches.length > 0 ? (
            <div className="space-y-4">
              {/* Highlighted preview */}
              <div className="rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-bg)] p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
                <HighlightedText input={testText} matches={evaluation.matches} />
              </div>

              {/* Match list */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {evaluation.matches.map((m, idx) => (
                  <MatchDetail
                    key={m.id}
                    m={m}
                    index={idx}
                    expanded={expandedMatch === m.id}
                    onToggle={() =>
                      setExpandedMatch((prev) => (prev === m.id ? null : m.id))
                    }
                  />
                ))}
              </div>
            </div>
          ) : evaluation.isValid ? (
            <div className="flex flex-col items-center justify-center py-10 text-[var(--tb-text-muted)]">
              <Search className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">输入正则和文本后，匹配结果将在此显示</p>
            </div>
          ) : null}
        </ToolPanel>
      </div>

      {/* ── Template Gallery ── */}
      <ToolPanel
        kicker="模板"
        title="常用正则模板"
        subtitle="选择模板快速填入表达式和示例文本"
      >
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setTemplateCategory(c.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                templateCategory === c.value
                  ? 'border-[var(--tb-accent)] bg-[var(--tb-accent)] text-white'
                  : 'border-[var(--tb-border)] bg-[var(--tb-surface)] text-[var(--tb-text-muted)] hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t)}
              className="group text-left rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4 transition hover:border-[var(--tb-accent)] hover:shadow-[0_0_0_3px_var(--tb-glow)]"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-[var(--tb-text)]">{t.name}</h4>
                <span className="shrink-0 rounded-md bg-[var(--tb-accent)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--tb-accent)]">
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-[var(--tb-text-muted)] mb-2 line-clamp-2">
                {t.description}
              </p>
              <code className="block rounded-lg bg-[var(--tb-bg)] px-2 py-1 text-[11px] font-mono text-[var(--tb-accent)] break-all">
                /{t.pattern}/{t.flags}
              </code>
            </button>
          ))}
        </div>
      </ToolPanel>
    </div>
  );
}
