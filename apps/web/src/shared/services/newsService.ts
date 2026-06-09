import { formatTimeAgo } from '@/shared/utils/timeFormat';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  guid?: string;
}

export interface NewsResponse {
  items: NewsItem[];
  error?: string;
  stale?: boolean;
  updatedAt?: number;
}

class NewsService {
  private cache: Map<string, { data: NewsResponse; timestamp: number }> = new Map();
  private inFlight: Map<string, Promise<NewsResponse>> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes fresh
  private readonly REQUEST_TIMEOUT = 8000; // 8 seconds

  /**
   * Fetch Hacker News RSS via CORS proxy.
   * Dedupes in-flight requests, times out, and falls back to stale cache.
   */
  async getHackerNews(limit: number = 30): Promise<NewsResponse> {
    const cacheKey = `hackernews_${limit}`;

    // Return fresh cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Dedupe in-flight requests
    const existing = this.inFlight.get(cacheKey);
    if (existing) return existing;

    const promise = this._fetchHackerNews(limit, cacheKey, cached);
    this.inFlight.set(cacheKey, promise);
    return promise;
  }

  private async _fetchHackerNews(
    limit: number,
    cacheKey: string,
    staleEntry: { data: NewsResponse; timestamp: number } | undefined
  ): Promise<NewsResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

    try {
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const rssUrl = 'https://hnrss.org/frontpage';
      const response = await fetch(`${proxyUrl}${encodeURIComponent(rssUrl)}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data.contents !== 'string') {
        throw new Error('Invalid proxy response');
      }

      const items = this.parseRSS(data.contents, limit);
      const result: NewsResponse = { items, updatedAt: Date.now() };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (err) {
      // Fallback to stale cache if available
      if (staleEntry && staleEntry.data.items.length > 0) {
        return {
          ...staleEntry.data,
          stale: true,
          updatedAt: staleEntry.timestamp,
          error: '网络异常，显示缓存新闻',
        };
      }

      return {
        items: [],
        error: err instanceof Error
          ? (err.name === 'AbortError' ? '请求超时，请稍后重试' : err.message)
          : '获取新闻数据失败',
      };
    } finally {
      clearTimeout(timer);
      this.inFlight.delete(cacheKey);
    }
  }

  /**
   * Parse RSS XML using browser-native DOMParser.
   * Replaces rss-parser to reduce bundle size.
   */
  private parseRSS(xml: string, limit: number): NewsItem[] {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.warn('RSS parse error:', parseError.textContent);
      return [];
    }

    const items: NewsItem[] = [];
    const entries = doc.querySelectorAll('item');

    entries.forEach((entry, i) => {
      if (i >= limit) return;

      const getText = (tag: string): string => {
        const el = entry.querySelector(tag);
        return el?.textContent?.trim() || '';
      };

      items.push({
        title: getText('title') || '无标题',
        link: getText('link') || '#',
        pubDate: getText('pubDate') || new Date().toISOString(),
        contentSnippet: getText('description'),
        guid: getText('guid') || getText('link'),
      });
    });

    return items;
  }

  /**
   * Format publish date as relative time.
   */
  formatPublishDate(dateString: string): string {
    try {
      return formatTimeAgo(new Date(dateString).getTime());
    } catch {
      return '时间未知';
    }
  }

  /**
   * Clear all caches.
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache info for debugging.
   */
  getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const newsService = new NewsService();
export default newsService;
