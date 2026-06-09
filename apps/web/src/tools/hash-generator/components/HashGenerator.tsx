'use client';

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from 'react';
import { AlertTriangle, FileCheck, FileText, Hash, Loader2, RefreshCw, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import CopyButton from '@/shared/components/toolkit/CopyButton';
import ToolPanel from '@/shared/components/toolkit/ToolPanel';
import StatPill from '@/shared/components/toolkit/StatPill';
import { formatBytes } from '@/shared/utils/formatBytes';
import { readFileAsArrayBuffer } from '@/shared/utils/clientFile';
import { HashAlgorithm, HASH_ALGORITHMS, HashResult, hashArrayBuffer, hashText } from '@/tools/hash-generator/utils/hashing';

type InputMode = 'text' | 'file';
type OutputCase = 'lowercase' | 'uppercase';

const fieldClass = 'w-full rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] px-4 py-3 text-sm text-[var(--tb-text)] placeholder:text-[var(--tb-text-muted)] outline-none transition focus:border-[var(--tb-accent)] focus:shadow-[0_0_0_3px_var(--tb-glow)] font-mono';
const allAlgorithms = HASH_ALGORITHMS.map((algorithm) => algorithm.id);
const sampleText = 'ToolsBox Hash Generator\n为文本和文件快速生成 MD5、SHA-1、SHA-256、SHA-512 摘要。';
const tenMegabytes = 10 * 1024 * 1024;
const fiftyMegabytes = 50 * 1024 * 1024;

function formatDate(timestamp: number): string {
  if (!Number.isFinite(timestamp)) return '未知';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function formatResults(results: HashResult[], outputCase: OutputCase): HashResult[] {
  return results.map((result) => ({
    ...result,
    value: outputCase === 'uppercase' ? result.value.toUpperCase() : result.value.toLowerCase(),
  }));
}

function buildCopyAllText(results: HashResult[]): string {
  return results.map((result) => `${result.label}: ${result.value}`).join('\n');
}

export default function HashGenerator() {
  const [mode, setMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<HashAlgorithm[]>(allAlgorithms);
  const [outputCase, setOutputCase] = useState<OutputCase>('lowercase');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileResults, setFileResults] = useState<HashResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textResults = useMemo(() => {
    if (!textInput || selectedAlgorithms.length === 0) return [];
    return formatResults(hashText(textInput, selectedAlgorithms), outputCase);
  }, [outputCase, selectedAlgorithms, textInput]);

  const displayedResults = mode === 'text' ? textResults : formatResults(fileResults, outputCase);
  const copyAllValue = buildCopyAllText(displayedResults);
  const hasLargeFileWarning = Boolean(selectedFile && selectedFile.size > tenMegabytes);
  const hasVeryLargeFileWarning = Boolean(selectedFile && selectedFile.size > fiftyMegabytes);

  const toggleAlgorithm = (algorithm: HashAlgorithm) => {
    setSelectedAlgorithms((current) => {
      if (current.includes(algorithm)) {
        return current.filter((item) => item !== algorithm);
      }

      return [...current, algorithm].sort((a, b) => allAlgorithms.indexOf(a) - allAlgorithms.indexOf(b));
    });
    setError('');
  };

  const switchMode = (nextMode: InputMode) => {
    setMode(nextMode);
    setError('');
    setIsDragging(false);
  };

  const handleClearText = () => {
    setTextInput('');
    setError('');
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
    setFileResults([]);
    setError('');
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelected(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelected(event.dataTransfer.files?.[0] ?? null);
  };

  const handleClearFile = () => {
    handleFileSelected(null);
  };

  const handleHashFile = async () => {
    if (!selectedFile) {
      setError('请先选择一个文件');
      return;
    }

    if (selectedAlgorithms.length === 0) {
      setError('请至少选择一种哈希算法');
      return;
    }

    if (selectedFile.size > fiftyMegabytes) {
      const confirmed = window.confirm('文件较大，可能导致浏览器短暂无响应。是否继续计算？');
      if (!confirmed) return;
    }

    setIsProcessingFile(true);
    setError('');

    try {
      const buffer = await readFileAsArrayBuffer(selectedFile);
      setFileResults(hashArrayBuffer(buffer, selectedAlgorithms));
    } catch (fileError) {
      console.error('Failed to hash file:', fileError);
      setFileResults([]);
      setError('文件读取或哈希计算失败，请重试');
    } finally {
      setIsProcessingFile(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToolPanel
        title="输入源"
        subtitle="选择文本实时计算，或上传文件后手动开始计算摘要"
        kicker="HASH SOURCE"
        actions={
          <div className="inline-flex rounded-full border border-[var(--tb-border)] bg-[var(--tb-surface)] p-1">
            <button
              type="button"
              onClick={() => switchMode('text')}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mode === 'text'
                  ? 'bg-[var(--tb-accent)] text-white shadow-sm'
                  : 'text-[var(--tb-text-muted)] hover:text-[var(--tb-text)]'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              文本输入
            </button>
            <button
              type="button"
              onClick={() => switchMode('file')}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mode === 'file'
                  ? 'bg-[var(--tb-accent)] text-white shadow-sm'
                  : 'text-[var(--tb-text-muted)] hover:text-[var(--tb-text)]'
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              文件输入
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {HASH_ALGORITHMS.map((algorithm) => {
                const selected = selectedAlgorithms.includes(algorithm.id);

                return (
                  <button
                    key={algorithm.id}
                    type="button"
                    onClick={() => toggleAlgorithm(algorithm.id)}
                    aria-pressed={selected}
                    className={`rounded-full border px-3 py-2 text-left text-xs transition sm:min-w-32 ${
                      selected
                        ? 'border-[var(--tb-accent)] bg-[var(--tb-accent)]/10 text-[var(--tb-accent)] shadow-[0_0_0_3px_var(--tb-glow)]'
                        : 'border-[var(--tb-border)] bg-[var(--tb-surface)] text-[var(--tb-text-muted)] hover:border-[var(--tb-accent)] hover:text-[var(--tb-text)]'
                    }`}
                  >
                    <span className="block font-semibold">{algorithm.label}</span>
                    <span className="block text-[11px] opacity-80">{algorithm.description}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-full border border-[var(--tb-border)] bg-[var(--tb-surface)] p-1">
                <button
                  type="button"
                  onClick={() => setOutputCase('lowercase')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    outputCase === 'lowercase'
                      ? 'bg-[var(--tb-accent)] text-white'
                      : 'text-[var(--tb-text-muted)] hover:text-[var(--tb-text)]'
                  }`}
                >
                  lowercase
                </button>
                <button
                  type="button"
                  onClick={() => setOutputCase('uppercase')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    outputCase === 'uppercase'
                      ? 'bg-[var(--tb-accent)] text-white'
                      : 'text-[var(--tb-text-muted)] hover:text-[var(--tb-text)]'
                  }`}
                >
                  UPPERCASE
                </button>
              </div>
              <StatPill label="算法" value={selectedAlgorithms.length} tone={selectedAlgorithms.length ? 'accent' : 'danger'} />
            </div>
          </div>

          {selectedAlgorithms.length === 0 && (
            <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-500">
              请至少选择一种哈希算法。
            </div>
          )}

          {mode === 'text' ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-sm font-semibold text-[var(--tb-text)]" htmlFor="hash-text-input">
                  文本内容
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setTextInput(sampleText)} className="tb-toolbar-btn">
                    <Sparkles className="h-4 w-4" />
                    示例
                  </button>
                  <button type="button" onClick={handleClearText} className="tb-toolbar-btn">
                    <Trash2 className="h-4 w-4" />
                    清空
                  </button>
                </div>
              </div>
              <textarea
                id="hash-text-input"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                rows={10}
                placeholder="输入文本后将实时生成哈希摘要..."
                className={`${fieldClass} min-h-64 resize-y`}
              />
              <div className="flex flex-wrap gap-2">
                <StatPill label="字符" value={textInput.length} />
                <StatPill label="字节" value={formatBytes(new Blob([textInput]).size)} />
                <StatPill label="结果" value={textResults.length} tone={textResults.length ? 'success' : 'default'} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input ref={fileInputRef} type="file" onChange={handleFileInputChange} className="hidden" />
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed px-6 py-10 text-center transition ${
                  isDragging
                    ? 'border-[var(--tb-accent)] bg-[var(--tb-accent)]/10 shadow-[0_0_0_4px_var(--tb-glow)]'
                    : 'border-[var(--tb-border)] bg-[var(--tb-surface)] hover:border-[var(--tb-accent)]'
                }`}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tb-accent)]/10 text-[var(--tb-accent)]">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <p className="text-base font-semibold text-[var(--tb-text)]">拖拽文件到此处</p>
                <p className="mt-1 text-sm text-[var(--tb-text-muted)]">或点击下方按钮从本地选择文件，文件不会上传到服务器</p>
                <button type="button" onClick={handlePickFile} className="tb-toolbar-btn mt-5 px-5 py-2.5">
                  选择文件
                </button>
              </div>

              {selectedFile && (
                <div className="tb-card rounded-3xl p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--tb-accent-2)]/10 text-[var(--tb-accent-2)]">
                          <FileCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[var(--tb-text)]">{selectedFile.name}</h3>
                          <p className="mt-1 text-xs text-[var(--tb-text-muted)]">{selectedFile.type || '未知类型'}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <StatPill label="大小" value={formatBytes(selectedFile.size)} tone={hasLargeFileWarning ? 'warning' : 'accent'} />
                        <StatPill label="类型" value={selectedFile.type || '未知'} />
                        <StatPill label="修改时间" value={formatDate(selectedFile.lastModified)} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleHashFile}
                        disabled={isProcessingFile || selectedAlgorithms.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--tb-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />}
                        {isProcessingFile ? '计算中...' : '开始计算'}
                      </button>
                      <button type="button" onClick={handleClearFile} className="tb-toolbar-btn">
                        <Trash2 className="h-4 w-4" />
                        移除
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {hasLargeFileWarning && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-500">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p>{hasVeryLargeFileWarning ? '文件较大，可能导致浏览器短暂无响应' : '大文件可能需要数秒处理'}</p>
                    {hasVeryLargeFileWarning && <p className="mt-1 text-xs opacity-80">点击“开始计算”后将再次确认。</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </ToolPanel>

      <ToolPanel
        title="哈希结果"
        subtitle="每个摘要均在浏览器本地计算，可单独复制或一次复制全部"
        kicker="DIGEST RESULTS"
        actions={
          <CopyButton
            value={copyAllValue}
            label="复制全部"
            copiedLabel="已复制全部"
            disabled={displayedResults.length === 0}
          />
        }
      >
        {displayedResults.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {displayedResults.map((result) => (
                <article key={result.algorithm} className="tb-card rounded-3xl p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="tb-section-kicker">{result.algorithm}</div>
                      <h3 className="text-base font-semibold text-[var(--tb-text)]">{result.label}</h3>
                    </div>
                    <CopyButton value={result.value} label="复制" copiedLabel="已复制" />
                  </div>
                  <p className="break-all rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-3 font-mono text-xs leading-relaxed text-[var(--tb-text)] sm:text-sm">
                    {result.value}
                  </p>
                </article>
              ))}
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] px-4 py-3 text-sm text-[var(--tb-text-muted)]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>MD5 和 SHA-1 仅适用于文件校验，不建议用于安全敏感场景</span>
            </div>
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--tb-border)] bg-[var(--tb-surface)] p-8 text-center">
            <RefreshCw className="mb-3 h-8 w-8 text-[var(--tb-text-muted)]" />
            <h3 className="text-sm font-semibold text-[var(--tb-text)]">等待生成哈希</h3>
            <p className="mt-1 max-w-md text-sm text-[var(--tb-text-muted)]">
              输入文本会自动实时计算；文件模式需选择文件并点击“开始计算”。
            </p>
          </div>
        )}
      </ToolPanel>
    </div>
  );
}
