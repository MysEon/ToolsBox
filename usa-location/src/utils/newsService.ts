import Parser from 'rss-parser';

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
}

class NewsService {
  private parser: Parser;
  private cache: Map<string, { data: NewsResponse; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['guid']
      }
    });
  }

  /**
   * 获取Hacker News RSS数据
   */
  async getHackerNews(limit: number = 30): Promise<NewsResponse> {
    const cacheKey = `hackernews_${limit}`;
    
    // 检查缓存
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // 使用CORS代理获取RSS数据
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const rssUrl = 'https://hnrss.org/frontpage';
      const response = await fetch(`${proxyUrl}${encodeURIComponent(rssUrl)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const feed = await this.parser.parseString(data.contents);

      const items: NewsItem[] = feed.items.slice(0, limit).map(item => ({
        title: item.title || '无标题',
        link: item.link || '#',
        pubDate: item.pubDate || new Date().toISOString(),
        contentSnippet: item.contentSnippet || '',
        guid: item.guid || item.link
      }));

      const result: NewsResponse = { items };
      
      // 缓存结果
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('获取Hacker News数据失败:', error);
      return {
        items: [],
        error: error instanceof Error ? error.message : '获取新闻数据失败'
      };
    }
  }

  /**
   * 格式化发布时间
   */
  formatPublishDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes}分钟前`;
      } else if (diffHours < 24) {
        return `${diffHours}小时前`;
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      return '时间未知';
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存状态
   */
  getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// 导出单例实例
export const newsService = new NewsService();
export default newsService;
