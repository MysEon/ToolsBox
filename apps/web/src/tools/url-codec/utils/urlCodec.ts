export type UrlOperation = 'encodeURI' | 'encodeURIComponent' | 'decodeURI' | 'decodeURIComponent';

export interface UrlProcessResult {
  ok: boolean;
  value: string;
  error?: string;
}

export interface ParsedQueryParam {
  key: string;
  values: string[];
}

const operationLabels: Record<UrlOperation, string> = {
  encodeURI: 'encodeURI',
  encodeURIComponent: 'encodeURIComponent',
  decodeURI: 'decodeURI',
  decodeURIComponent: 'decodeURIComponent',
};

/**
 * Runs one native URL encoder/decoder safely.
 * Native decodeURI/decodeURIComponent throw URIError for malformed percent-encoded input,
 * so callers always receive a stable result object instead of an exception.
 */
export function processUrlText(input: string, operation: UrlOperation): UrlProcessResult {
  try {
    const value = (() => {
      switch (operation) {
        case 'encodeURI':
          return encodeURI(input);
        case 'encodeURIComponent':
          return encodeURIComponent(input);
        case 'decodeURI':
          return decodeURI(input);
        case 'decodeURIComponent':
          return decodeURIComponent(input);
        default: {
          const exhaustive: never = operation;
          return exhaustive;
        }
      }
    })();

    return { ok: true, value };
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知 URL 处理错误';

    return {
      ok: false,
      value: '',
      error: `${operationLabels[operation]} 处理失败：${message}`,
    };
  }
}

function decodeSearchParamPart(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '));
  } catch {
    return value;
  }
}

function collectParams(searchParams: URLSearchParams): ParsedQueryParam[] {
  const grouped = new Map<string, string[]>();

  searchParams.forEach((value, key) => {
    const currentValues = grouped.get(key) ?? [];
    currentValues.push(value);
    grouped.set(key, currentValues);
  });

  return Array.from(grouped.entries()).map(([key, values]) => ({ key, values }));
}

function parseRawQuery(input: string) {
  const queryText = input.startsWith('?') ? input.slice(1) : input;
  const hashIndex = queryText.indexOf('#');
  const query = hashIndex >= 0 ? queryText.slice(0, hashIndex) : queryText;
  const hash = hashIndex >= 0 ? queryText.slice(hashIndex) : undefined;

  return {
    hash,
    params: collectParams(new URLSearchParams(query)),
  };
}

/**
 * Parses either a complete URL or a raw query string into a normalized base URL,
 * optional hash fragment, and grouped query parameters.
 *
 * URLs without protocol are parsed by temporarily prepending https:// and stripping
 * the artificial protocol from the returned base URL.
 */
export function parseUrlOrQuery(input: string): {
  baseUrl?: string;
  hash?: string;
  params: ParsedQueryParam[];
  error?: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    return { params: [], error: '请输入 URL 或查询字符串。' };
  }

  const looksLikeRawQuery =
    trimmed.startsWith('?') ||
    (!trimmed.includes('://') && !trimmed.includes('/') && !trimmed.includes('#') && trimmed.includes('='));

  try {
    if (looksLikeRawQuery) {
      return parseRawQuery(trimmed);
    }

    const hasProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed);
    const parseTarget = hasProtocol ? trimmed : `https://${trimmed}`;
    const url = new URL(parseTarget);
    const params = collectParams(url.searchParams);
    const baseWithSyntheticProtocol = `${url.origin}${url.pathname}`;
    const normalizedBaseUrl = hasProtocol
      ? baseWithSyntheticProtocol
      : baseWithSyntheticProtocol.replace(/^https:\/\//, '');

    return {
      baseUrl: normalizedBaseUrl.replace(/\/$/, url.pathname === '/' && !trimmed.includes('/') ? '' : '/'),
      hash: url.hash || undefined,
      params,
    };
  } catch (error) {
    try {
      return parseRawQuery(trimmed);
    } catch {
      const message = error instanceof Error ? error.message : '无法解析输入内容';

      return {
        params: [],
        error: `解析失败：${message}`,
      };
    }
  }
}

/**
 * Converts grouped query parameters into a JSON-friendly object.
 * Duplicate keys become arrays, single values remain strings.
 */
export function paramsToJson(params: ParsedQueryParam[]): Record<string, string | string[]> {
  return params.reduce<Record<string, string | string[]>>((acc, param) => {
    acc[param.key] = param.values.length === 1 ? param.values[0] ?? '' : param.values;
    return acc;
  }, {});
}

export function buildQueryString(params: ParsedQueryParam[]): string {
  const searchParams = new URLSearchParams();

  params.forEach((param) => {
    param.values.forEach((value) => {
      searchParams.append(param.key, value);
    });
  });

  return searchParams.toString();
}

export function buildNormalizedUrl(baseUrl: string | undefined, hash: string | undefined, params: ParsedQueryParam[]): string {
  const queryString = buildQueryString(params);
  const normalizedHash = hash?.startsWith('#') ? hash : hash ? `#${hash}` : '';

  if (!baseUrl) {
    return queryString ? `?${queryString}${normalizedHash}` : normalizedHash;
  }

  return `${baseUrl}${queryString ? `?${queryString}` : ''}${normalizedHash}`;
}

export function safeDecodeQueryValue(value: string): string {
  return decodeSearchParamPart(value);
}
