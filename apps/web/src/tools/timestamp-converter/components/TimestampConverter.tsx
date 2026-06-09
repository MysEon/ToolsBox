'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Clock3, Globe2, ListChecks, RefreshCw, Timer } from 'lucide-react';
import CopyButton from '@/shared/components/toolkit/CopyButton';
import ToolPanel from '@/shared/components/toolkit/ToolPanel';
import StatPill from '@/shared/components/toolkit/StatPill';
import { timezones } from '@/tools/timestamp-converter/data/timezones';
import {
  detectTimestampUnit,
  formatInTimezone,
  formatRelativeTime,
  parseUnixTimestamp,
  toUnixMilliseconds,
  toUnixSeconds,
} from '@/tools/timestamp-converter/utils/timeConversion';

const fieldClass = 'w-full rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] px-4 py-3 text-sm text-[var(--tb-text)] placeholder:text-[var(--tb-text-muted)] outline-none transition focus:border-[var(--tb-accent)] focus:shadow-[0_0_0_3px_var(--tb-glow)] font-mono';

const labelClass = 'mb-2 block text-sm font-medium text-[var(--tb-text)]';
const mutedTextClass = 'text-sm text-[var(--tb-text-muted)]';

interface OutputRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

function formatLocalDateTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDateTimeLocalInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function describeDetectedUnit(unit: ReturnType<typeof detectTimestampUnit>): string {
  if (unit === 'seconds') return '秒级时间戳';
  if (unit === 'milliseconds') return '毫秒级时间戳';
  return '无法识别';
}

function OutputRow({ label, value, mono = true }: OutputRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--tb-text-muted)]">{label}</div>
        <div className={`break-all text-sm text-[var(--tb-text)] ${mono ? 'font-mono' : ''}`}>{value || '—'}</div>
      </div>
      <CopyButton value={value} disabled={!value} className="shrink-0 self-start sm:self-center" />
    </div>
  );
}

export default function TimestampConverter() {
  const [now, setNow] = useState<Date | null>(null);
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Shanghai');
  const [batchInput, setBatchInput] = useState('');

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();

    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimestampInput(String(Math.floor(Date.now() / 1000)));
    setDateInput(formatDateTimeLocalInput(new Date()));
  }, []);

  const selectedTimezoneLabel = useMemo(
    () => timezones.find((timezone) => timezone.value === selectedTimezone)?.label ?? selectedTimezone,
    [selectedTimezone],
  );

  const detectedUnit = useMemo(() => detectTimestampUnit(timestampInput.trim()), [timestampInput]);
  const unixDate = useMemo(() => parseUnixTimestamp(timestampInput.trim(), 'auto'), [timestampInput]);

  const unixOutputs = useMemo(() => {
    if (!unixDate) return null;

    return {
      local: formatLocalDateTime(unixDate),
      utc: `${formatInTimezone(unixDate, 'UTC')} UTC`,
      timezone: `${formatInTimezone(unixDate, selectedTimezone)} ${selectedTimezoneLabel}`,
      iso: unixDate.toISOString(),
      relative: formatRelativeTime(unixDate),
    };
  }, [selectedTimezone, selectedTimezoneLabel, unixDate]);

  const dateToUnixDate = useMemo(() => {
    if (!dateInput) return null;

    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  }, [dateInput]);

  const dateOutputs = useMemo(() => {
    if (!dateToUnixDate) return null;

    return {
      seconds: String(toUnixSeconds(dateToUnixDate)),
      milliseconds: String(toUnixMilliseconds(dateToUnixDate)),
      iso: dateToUnixDate.toISOString(),
    };
  }, [dateToUnixDate]);

  const batchRows = useMemo(() => {
    return batchInput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((raw) => {
        const unit = detectTimestampUnit(raw);
        const parsed = parseUnixTimestamp(raw, 'auto');

        return {
          raw,
          unit,
          local: parsed ? formatLocalDateTime(parsed) : '无效时间戳',
          utc: parsed ? `${formatInTimezone(parsed, 'UTC')} UTC` : '—',
          timezone: parsed ? `${formatInTimezone(parsed, selectedTimezone)} ${selectedTimezoneLabel}` : '—',
          iso: parsed ? parsed.toISOString() : '—',
        };
      });
  }, [batchInput, selectedTimezone, selectedTimezoneLabel]);

  const fillCurrentTimestamp = () => {
    setTimestampInput(String(Math.floor(Date.now() / 1000)));
  };

  const fillCurrentDateTime = () => {
    setDateInput(formatDateTimeLocalInput(new Date()));
  };

  return (
    <div className="space-y-8">
      <ToolPanel
        title="当前时间"
        subtitle="每秒自动刷新，便于快速复制当前 Unix 时间戳"
        kicker="LIVE CLOCK"
        actions={now ? <StatPill label="状态" value="实时更新" tone="success" /> : <StatPill label="状态" value="初始化" tone="warning" />}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="tb-card p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--tb-text-muted)]">
              <Timer className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Unix 秒</span>
            </div>
            <div className="break-all font-mono text-lg font-semibold text-[var(--tb-text)]">
              {now ? toUnixSeconds(now) : '—'}
            </div>
            {now && <CopyButton value={String(toUnixSeconds(now))} className="mt-3" />}
          </div>

          <div className="tb-card p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--tb-text-muted)]">
              <Timer className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Unix 毫秒</span>
            </div>
            <div className="break-all font-mono text-lg font-semibold text-[var(--tb-text)]">
              {now ? toUnixMilliseconds(now) : '—'}
            </div>
            {now && <CopyButton value={String(toUnixMilliseconds(now))} className="mt-3" />}
          </div>

          <div className="tb-card p-4 xl:col-span-1">
            <div className="mb-2 flex items-center gap-2 text-[var(--tb-text-muted)]">
              <CalendarClock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">ISO</span>
            </div>
            <div className="break-all font-mono text-sm font-semibold text-[var(--tb-text)]">
              {now ? now.toISOString() : '—'}
            </div>
            {now && <CopyButton value={now.toISOString()} className="mt-3" />}
          </div>

          <div className="tb-card p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--tb-text-muted)]">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">本地时间</span>
            </div>
            <div className="break-all text-sm font-semibold text-[var(--tb-text)]">
              {now ? formatLocalDateTime(now) : '—'}
            </div>
          </div>

          <div className="tb-card p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--tb-text-muted)]">
              <Globe2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">UTC</span>
            </div>
            <div className="break-all text-sm font-semibold text-[var(--tb-text)]">
              {now ? `${formatInTimezone(now, 'UTC')} UTC` : '—'}
            </div>
          </div>
        </div>
      </ToolPanel>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <ToolPanel
            title="Unix → 日期"
            subtitle="输入秒级或毫秒级 Unix 时间戳，自动识别单位并转换为多种可读格式"
            kicker="TIMESTAMP TO DATE"
            actions={<StatPill label="检测" value={describeDetectedUnit(detectedUnit)} tone={detectedUnit === 'invalid' ? 'warning' : 'accent'} />}
          >
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label htmlFor="timestamp-input" className={labelClass}>时间戳</label>
                  <button type="button" onClick={fillCurrentTimestamp} className="tb-toolbar-btn w-fit">
                    <RefreshCw className="h-3.5 w-3.5" />
                    填入当前秒级时间戳
                  </button>
                </div>
                <input
                  id="timestamp-input"
                  value={timestampInput}
                  onChange={(event) => setTimestampInput(event.target.value)}
                  placeholder="例如：1717910400 或 1717910400000"
                  inputMode="numeric"
                  className={fieldClass}
                />
                <p className="mt-2 text-xs text-[var(--tb-text-muted)]">
                  自动检测规则：大于 10^12 识别为毫秒，大于 10^9 识别为秒，否则视为无效。
                </p>
              </div>

              {unixOutputs ? (
                <div className="grid gap-3">
                  <OutputRow label="本地时间" value={unixOutputs.local} mono={false} />
                  <OutputRow label="UTC 时间" value={unixOutputs.utc} mono={false} />
                  <OutputRow label={`选定时区：${selectedTimezoneLabel}`} value={unixOutputs.timezone} mono={false} />
                  <OutputRow label="ISO 8601" value={unixOutputs.iso} />
                  <OutputRow label="相对时间" value={unixOutputs.relative} mono={false} />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--tb-border)] p-6 text-center text-sm text-[var(--tb-text-muted)]">
                  请输入有效的 Unix 时间戳以查看转换结果。
                </div>
              )}
            </div>
          </ToolPanel>

          <ToolPanel
            title="日期 → Unix"
            subtitle="选择本地日期时间，快速生成秒级、毫秒级与 ISO 8601 格式"
            kicker="DATE TO TIMESTAMP"
          >
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label htmlFor="date-input" className={labelClass}>本地日期时间</label>
                  <button type="button" onClick={fillCurrentDateTime} className="tb-toolbar-btn w-fit">
                    <RefreshCw className="h-3.5 w-3.5" />
                    填入当前时间
                  </button>
                </div>
                <input
                  id="date-input"
                  type="datetime-local"
                  value={dateInput}
                  onChange={(event) => setDateInput(event.target.value)}
                  className={fieldClass}
                />
                <p className="mt-2 text-xs text-[var(--tb-text-muted)]">
                  datetime-local 使用浏览器本地时区解析，输出 ISO 会自动转换为 UTC 标准格式。
                </p>
              </div>

              {dateOutputs ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <OutputRow label="Unix 秒" value={dateOutputs.seconds} />
                  <OutputRow label="Unix 毫秒" value={dateOutputs.milliseconds} />
                  <div className="md:col-span-2">
                    <OutputRow label="ISO 8601" value={dateOutputs.iso} />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--tb-border)] p-6 text-center text-sm text-[var(--tb-text-muted)]">
                  请选择有效的日期时间。
                </div>
              )}
            </div>
          </ToolPanel>
        </div>

        <aside className="space-y-8">
          <ToolPanel title="时区选择" subtitle="用于 Unix → 日期与批量转换中的指定时区输出" kicker="TIMEZONE">
            <div className="space-y-4">
              <label htmlFor="timezone-select" className={labelClass}>目标时区</label>
              <select
                id="timezone-select"
                value={selectedTimezone}
                onChange={(event) => setSelectedTimezone(event.target.value)}
                className={fieldClass}
              >
                {timezones.map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </option>
                ))}
              </select>
              <div className="rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--tb-text-muted)]">当前选择</div>
                <div className="break-all font-mono text-sm text-[var(--tb-text)]">{selectedTimezone}</div>
                <div className="mt-2 text-sm text-[var(--tb-text-muted)]">{selectedTimezoneLabel}</div>
              </div>
            </div>
          </ToolPanel>

          <ToolPanel title="使用提示" subtitle="常见场景与单位说明" kicker="TIPS">
            <div className="space-y-3 text-sm text-[var(--tb-text-muted)]">
              <p>秒级时间戳通常为 10 位数字，毫秒级时间戳通常为 13 位数字。</p>
              <p>ISO 8601 结尾的 Z 表示 UTC 时间，例如 2026-06-09T00:00:00.000Z。</p>
              <p>夏令时由浏览器 Intl API 自动处理，推荐使用 IANA 时区名称。</p>
            </div>
          </ToolPanel>
        </aside>
      </div>

      <ToolPanel
        title="批量转换"
        subtitle="每行输入一个秒级或毫秒级 Unix 时间戳，自动输出本地、UTC、指定时区与 ISO 格式"
        kicker="BATCH"
        actions={<StatPill label="行数" value={batchRows.length} tone={batchRows.length > 0 ? 'accent' : 'default'} />}
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="batch-input" className={labelClass}>多行时间戳</label>
            <textarea
              id="batch-input"
              value={batchInput}
              onChange={(event) => setBatchInput(event.target.value)}
              placeholder={'1717910400\n1717910400000\n1767225600'}
              rows={5}
              className={`${fieldClass} resize-y`}
            />
          </div>

          {batchRows.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[var(--tb-border)]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--tb-border)] text-sm">
                  <thead className="bg-[var(--tb-surface)]">
                    <tr className="text-left text-xs uppercase tracking-wide text-[var(--tb-text-muted)]">
                      <th className="px-4 py-3 font-semibold">输入</th>
                      <th className="px-4 py-3 font-semibold">单位</th>
                      <th className="px-4 py-3 font-semibold">本地时间</th>
                      <th className="px-4 py-3 font-semibold">UTC</th>
                      <th className="px-4 py-3 font-semibold">选定时区</th>
                      <th className="px-4 py-3 font-semibold">ISO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--tb-border)]">
                    {batchRows.map((row, index) => (
                      <tr key={`${row.raw}-${index}`} className="align-top text-[var(--tb-text)]">
                        <td className="px-4 py-3 font-mono">{row.raw}</td>
                        <td className="px-4 py-3">
                          <span className={`tb-pill border border-[var(--tb-border)] ${row.unit === 'invalid' ? 'text-amber-400' : 'text-[var(--tb-accent)]'}`}>
                            {describeDetectedUnit(row.unit)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.local}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.utc}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.timezone}</td>
                        <td className="px-4 py-3 font-mono whitespace-nowrap">{row.iso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--tb-border)] p-6 text-center">
              <ListChecks className="mx-auto mb-3 h-8 w-8 text-[var(--tb-text-muted)]" />
              <p className={mutedTextClass}>批量输入为空。添加多行时间戳后会显示转换表格。</p>
            </div>
          )}
        </div>
      </ToolPanel>
    </div>
  );
}
