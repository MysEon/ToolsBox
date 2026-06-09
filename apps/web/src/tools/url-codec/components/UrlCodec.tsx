'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ArrowRightLeft,
  Trash2,
  Zap,
  Search,
  List,
  AlertTriangle,
} from 'lucide-react';
import CopyButton from '@/shared/components/toolkit/CopyButton';
import ToolPanel from '@/shared/components/toolkit/ToolPanel';
import StatPill from '@/shared/components/toolkit/StatPill';
import {
  type UrlOperation,
  type ParsedQueryParam,
  processUrlText,
  parseUrlOrQuery,
  paramsToJson,
  buildNormalizedUrl,
  buildQueryString,
  safeDecodeQueryValue,
} from '../utils/urlCodec';

type TabMode = 'codec' | 'query' | 'batch';

const fieldClass =
  'w-full rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] px-4 py-3 text-sm text-[var(--tb-text)] placeholder:text-[var(--tb-text-muted)] outline-none transition focus:border-[var(--tb-accent)] focus:shadow-[0_0_0_3px_var(--tb-glow)] font-mono';

const operations: { key: UrlOperation; label: string; desc: string }[] = [
  { key: 'encodeURI', label: 'encodeURI', desc: '编码完整 URL' },
  { key: 'encodeURIComponent', label: 'encodeURIComponent', desc: '编码 URL 组件' },
  { key: 'decodeURI', label: 'decodeURI', desc: '解码完整 URL' },
  { key: 'decodeURIComponent', label: 'decodeURIComponent', desc: '解码 URL 组件' },
];

const tabs: { key: TabMode; label: string; icon: typeof Zap }[] = [
  { key: 'codec', label: '编码/解码', icon: ArrowRightLeft },
  { key: 'query', label: '查询解析', icon: Search },
  { key: 'batch', label: '批量处理', icon: List },
];

function hasEncodedSequence(text: string): boolean {
  return /%[0-9A-Fa-f]{2}/.test(text);
}

export default function UrlCodec() {
  const [tab, setTab] = useState<TabMode>('codec');

  return (
    <div className="space-y-6">
      {/* Segmented tabs */}
      <div className="flex justify-center">
        <div className="tb-segmented">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`tb-segmented-item flex items-center gap-1.5 ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'codec' && <CodecMode />}
      {tab === 'query' && <QueryMode />}
      {tab === 'batch' && <BatchMode />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Mode 1 – Encode / Decode
   ══════════════════════════════════════════════════════════════════ */

function CodecMode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [lastError, setLastError] = useState<string | null>(null);

  const encodedDetected = useMemo(() => input.length > 0 && hasEncodedSequence(input), [input]);

  const handleOperation = useCallback(
    (op: UrlOperation) => {
      setLastError(null);
      const result = processUrlText(input, op);
      if (result.ok) {
        setOutput(result.value);
      } else {
        setOutput('');
        setLastError(result.error ?? '处理失败');
      }
    },
    [input],
  );

  const handleSwap = useCallback(() => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setLastError(null);
  }, [input, output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setLastError(null);
  }, []);

  return (
    <div className="space-y-5">
      <ToolPanel title="编码 / 解码" kicker="URL CODEC">
        <div className="space-y-4">
          {/* Auto-detect banner */}
          {encodedDetected && (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--tb-accent)]/30 bg-[var(--tb-accent)]/5 px-4 py-2.5 text-sm text-[var(--tb-accent)]">
              <Zap className="h-4 w-4 shrink-0" />
              检测到编码文本，建议解码
            </div>
          )}

          {/* Input */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--tb-text-muted)]">输入</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入需要编码或解码的文本..."
              rows={4}
              className={fieldClass + ' resize-y'}
            />
          </div>

          {/* Operation buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {operations.map(({ key, label, desc }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleOperation(key)}
                className="tb-toolbar-btn"
                title={desc}
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}

            <div className="mx-1 h-5 w-px bg-[var(--tb-border)]" />

            <button type="button" onClick={handleSwap} className="tb-toolbar-btn" title="交换输入/输出">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              交换
            </button>

            <button type="button" onClick={handleClear} className="tb-toolbar-btn" title="清空">
              <Trash2 className="h-3.5 w-3.5" />
              清空
            </button>
          </div>

          {/* Error */}
          {lastError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/5 px-4 py-2.5 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {lastError}
            </div>
          )}

          {/* Output */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--tb-text-muted)]">输出</label>
              <CopyButton value={output} label="复制结果" />
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="处理结果将显示在此处..."
              rows={4}
              className={fieldClass + ' resize-y opacity-80'}
            />
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Mode 2 – Query Parser
   ══════════════════════════════════════════════════════════════════ */

function QueryMode() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<{
    baseUrl?: string;
    hash?: string;
    params: ParsedQueryParam[];
    error?: string;
  } | null>(null);

  const handleParse = useCallback(() => {
    const result = parseUrlOrQuery(input);
    setParsed(result);
  }, [input]);

  const normalizedUrl = useMemo(() => {
    if (!parsed || parsed.params.length === 0) return '';
    return buildNormalizedUrl(parsed.baseUrl, parsed.hash, parsed.params);
  }, [parsed]);

  const jsonStr = useMemo(() => {
    if (!parsed || parsed.params.length === 0) return '';
    return JSON.stringify(paramsToJson(parsed.params), null, 2);
  }, [parsed]);

  const queryString = useMemo(() => {
    if (!parsed || parsed.params.length === 0) return '';
    return buildQueryString(parsed.params);
  }, [parsed]);

  return (
    <div className="space-y-5">
      <ToolPanel title="查询参数解析" kicker="QUERY PARSER">
        <div className="space-y-4">
          {/* Input */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--tb-text-muted)]">
              输入 URL 或查询字符串
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://example.com/path?key=value&foo=bar#section"
              rows={3}
              className={fieldClass + ' resize-y'}
            />
          </div>

          <button type="button" onClick={handleParse} className="tb-toolbar-btn">
            <Search className="h-3.5 w-3.5" />
            解析
          </button>

          {/* Error */}
          {parsed?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/5 px-4 py-2.5 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {parsed.error}
            </div>
          )}

          {parsed && !parsed.error && parsed.params.length > 0 && (
            <>
              {/* Summary row */}
              <div className="flex flex-wrap items-center gap-3">
                <StatPill label="参数" value={parsed.params.length} tone="accent" />
                {parsed.baseUrl && <StatPill label="Base URL" value={truncate(parsed.baseUrl, 40)} tone="default" />}
                {parsed.hash && <StatPill label="Hash" value={truncate(parsed.hash, 20)} tone="default" />}
              </div>

              {/* Base URL + Hash display */}
              {(parsed.baseUrl || parsed.hash) && (
                <div className="space-y-2 rounded-xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4">
                  {parsed.baseUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="shrink-0 text-[var(--tb-text-muted)]">Base URL:</span>
                      <span className="font-mono text-[var(--tb-text)] break-all">{parsed.baseUrl}</span>
                      <CopyButton value={parsed.baseUrl} label="复制" />
                    </div>
                  )}
                  {parsed.hash && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="shrink-0 text-[var(--tb-text-muted)]">Hash:</span>
                      <span className="font-mono text-[var(--tb-text)]">{parsed.hash}</span>
                      <CopyButton value={parsed.hash} label="复制" />
                    </div>
                  )}
                </div>
              )}

              {/* Params table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--tb-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--tb-border)] bg-[var(--tb-surface)]">
                      <th className="px-4 py-2.5 text-left font-medium text-[var(--tb-text-muted)]">Key</th>
                      <th className="px-4 py-2.5 text-left font-medium text-[var(--tb-text-muted)]">Value</th>
                      <th className="px-4 py-2.5 text-left font-medium text-[var(--tb-text-muted)]">Decoded</th>
                      <th className="px-4 py-2.5 text-center font-medium text-[var(--tb-text-muted)]">重复</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.params.map((param, index) => (
                      <ParamRow key={`${param.key}-${index}`} param={param} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Copy actions */}
              <div className="flex flex-wrap items-center gap-3">
                <CopyButton value={normalizedUrl} label="复制 Normalized URL" />
                <CopyButton value={jsonStr} label="复制 JSON" />
                <CopyButton value={queryString ? `?${queryString}` : ''} label="复制 Query String" />
              </div>
            </>
          )}

          {parsed && !parsed.error && parsed.params.length === 0 && (
            <p className="text-sm text-[var(--tb-text-muted)]">未检测到查询参数。</p>
          )}
        </div>
      </ToolPanel>
    </div>
  );
}

function ParamRow({ param }: { param: ParsedQueryParam }) {
  const isDuplicate = param.values.length > 1;

  return (
    <>
      {param.values.map((value, valueIndex) => (
        <tr
          key={`${param.key}-${valueIndex}`}
          className="border-b border-[var(--tb-border)] last:border-b-0"
        >
          {valueIndex === 0 ? (
            <td
              rowSpan={param.values.length}
              className="px-4 py-2.5 font-mono font-medium text-[var(--tb-accent)] align-top"
            >
              {param.key}
            </td>
          ) : null}
          <td className="px-4 py-2.5 font-mono text-[var(--tb-text)] break-all">
            {value || <span className="text-[var(--tb-text-muted)] italic">empty</span>}
          </td>
          <td className="px-4 py-2.5 font-mono text-[var(--tb-text-muted)] break-all">
            {safeDecodeQueryValue(value)}
          </td>
          {valueIndex === 0 ? (
            <td
              rowSpan={param.values.length}
              className="px-4 py-2.5 text-center align-top"
            >
              {isDuplicate ? (
                <span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-amber-500/10 px-1.5 text-xs font-semibold text-amber-400">
                  {param.values.length}
                </span>
              ) : (
                <span className="text-xs text-[var(--tb-text-muted)]">1</span>
              )}
            </td>
          ) : null}
        </tr>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Mode 3 – Batch
   ══════════════════════════════════════════════════════════════════ */

interface BatchLineResult {
  line: number;
  input: string;
  ok: boolean;
  output: string;
  error?: string;
}

function BatchMode() {
  const [input, setInput] = useState('');
  const [operation, setOperation] = useState<UrlOperation>('encodeURI');
  const [results, setResults] = useState<BatchLineResult[]>([]);

  const handleProcess = useCallback(() => {
    const lines = input.split('\n').filter((line) => line.trim().length > 0);
    const batchResults: BatchLineResult[] = lines.map((line, index) => {
      const result = processUrlText(line.trim(), operation);
      return {
        line: index + 1,
        input: line.trim(),
        ok: result.ok,
        output: result.value,
        error: result.error,
      };
    });
    setResults(batchResults);
  }, [input, operation]);

  const successCount = useMemo(() => results.filter((r) => r.ok).length, [results]);
  const failCount = useMemo(() => results.filter((r) => !r.ok).length, [results]);

  const allOutput = useMemo(
    () => results.filter((r) => r.ok).map((r) => r.output).join('\n'),
    [results],
  );

  return (
    <div className="space-y-5">
      <ToolPanel title="批量处理" kicker="BATCH">
        <div className="space-y-4">
          {/* Operation selector */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--tb-text-muted)]">操作</label>
            <div className="flex flex-wrap gap-2">
              {operations.map(({ key, label, desc }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOperation(key)}
                  className={`tb-toolbar-btn ${operation === key ? 'border-[var(--tb-accent)] text-[var(--tb-accent)]' : ''}`}
                  title={desc}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Multi-line input */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--tb-text-muted)]">
              输入（每行一条）
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"https://example.com/路径\nhello world\n%E4%BD%A0%E5%A5%BD"}
              rows={6}
              className={fieldClass + ' resize-y'}
            />
          </div>

          <button type="button" onClick={handleProcess} className="tb-toolbar-btn">
            <Zap className="h-3.5 w-3.5" />
            批量处理
          </button>

          {/* Stats */}
          {results.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <StatPill label="总计" value={results.length} tone="default" />
              <StatPill label="成功" value={successCount} tone="success" />
              {failCount > 0 && <StatPill label="失败" value={failCount} tone="danger" />}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.line}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-mono ${
                    r.ok
                      ? 'border-[var(--tb-border)] bg-[var(--tb-surface)]'
                      : 'border-red-400/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 text-xs text-[var(--tb-text-muted)]">#{r.line}</span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="text-[var(--tb-text-muted)] truncate">{r.input}</div>
                      {r.ok ? (
                        <div className="text-[var(--tb-text)] break-all">{r.output}</div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-400">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          {r.error}
                        </div>
                      )}
                    </div>
                    {r.ok && <CopyButton value={r.output} label="复制" />}
                  </div>
                </div>
              ))}

              {/* Copy all successful */}
              {successCount > 0 && (
                <div className="flex justify-end pt-2">
                  <CopyButton value={allOutput} label="复制全部成功结果" />
                </div>
              )}
            </div>
          )}
        </div>
      </ToolPanel>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}
