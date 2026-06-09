export type TimestampUnit = 'seconds' | 'milliseconds' | 'auto';

/**
 * Detect whether a numeric string represents seconds or milliseconds.
 *
 * Heuristic:
 *  - value > 10^12  => milliseconds (covers year 2001+ in ms)
 *  - value > 10^9   => seconds      (covers year 2001+ in s)
 *  - otherwise      => invalid      (too small for any reasonable Unix timestamp)
 */
export function detectTimestampUnit(value: string): 'seconds' | 'milliseconds' | 'invalid' {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 'invalid';

  if (num > 1e12) return 'milliseconds';
  if (num > 1e9) return 'seconds';
  return 'invalid';
}

/**
 * Parse a Unix timestamp string into a Date object.
 * Returns null for invalid inputs.
 */
export function parseUnixTimestamp(value: string, unit: TimestampUnit): Date | null {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;

  const resolvedUnit = unit === 'auto' ? detectTimestampUnit(value) : unit;
  if (resolvedUnit === 'invalid') return null;

  const ms = resolvedUnit === 'milliseconds' ? num : num * 1000;
  const date = new Date(ms);

  // Validate the resulting date
  if (isNaN(date.getTime())) return null;
  return date;
}

/**
 * Format a Date in a specific IANA timezone using Intl.DateTimeFormat.
 * Falls back to UTC on error.
 */
export function formatInTimezone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone,
    }).format(date);
  } catch {
    // Invalid timezone — fall back to UTC
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(date);
  }
}

/** Return the Unix timestamp in seconds (integer). */
export function toUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/** Return the Unix timestamp in milliseconds. */
export function toUnixMilliseconds(date: Date): number {
  return date.getTime();
}

/**
 * Compute a human-readable relative-time string in Chinese.
 * E.g. "刚刚", "3 分钟前", "2 天前"
 */
export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();

  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let text: string;

  if (seconds < 10) text = '刚刚';
  else if (seconds < 60) text = `${seconds} 秒${isFuture ? '后' : '前'}`;
  else if (minutes < 60) text = `${minutes} 分钟${isFuture ? '后' : '前'}`;
  else if (hours < 24) text = `${hours} 小时${isFuture ? '后' : '前'}`;
  else if (days < 30) text = `${days} 天${isFuture ? '后' : '前'}`;
  else if (months < 12) text = `${months} 个月${isFuture ? '后' : '前'}`;
  else text = `${years} 年${isFuture ? '后' : '前'}`;

  return text;
}
