export interface TranslationRequest {
  text: string;
  sourceLang?: string;
  targetLang: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  error?: string;
}

export interface CachedTranslation {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
  'zh': '中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'fr': 'Français',
  'de': 'Deutsch',
  'es': 'Español',
  'ru': 'Русский',
  'it': 'Italiano',
  'pt': 'Português',
  'ar': 'العربية',
  'hi': 'हिन्दी',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;
export type SourceLanguage = SupportedLanguage | 'auto';

class TranslationService {
  private cache: Map<string, CachedTranslation> = new Map();
  private readonly CACHE_KEY = 'toolsbox-translation-cache';
  private readonly MAX_CACHE_SIZE = 1000; // 最大缓存条目数

  constructor() {
    this.loadCacheFromStorage();
  }

  /**
   * 翻译文本
   */
  async translateText(
    text: string,
    targetLang: SupportedLanguage,
    apiKey: string,
    sourceLang: SourceLanguage = 'auto',
    enableCache: boolean = true,
    cacheExpiry: number = 24
  ): Promise<TranslationResponse> {
    if (!text.trim()) {
      return {
        translatedText: '',
        sourceLang: sourceLang,
        targetLang,
        error: '文本不能为空'
      };
    }

    if (!apiKey.trim()) {
      return {
        translatedText: text,
        sourceLang: sourceLang,
        targetLang,
        error: '请先配置 DeepLX API Key'
      };
    }

    // 检查缓存
    if (enableCache) {
      const cached = sourceLang !== 'auto' ? this.getCachedTranslation(text, sourceLang, targetLang, cacheExpiry) : null;
      if (cached) {
        return {
          translatedText: cached.translatedText,
          sourceLang: cached.sourceLang,
          targetLang: cached.targetLang
        };
      }
    }

    try {
      // 调用 DeepLX API
      const response = await this.callDeepLXAPI(text, sourceLang, targetLang, apiKey);
      
      // 缓存结果
      if (enableCache && response.translatedText && !response.error) {
        this.setCachedTranslation({
          originalText: text,
          translatedText: response.translatedText,
          sourceLang: response.sourceLang,
          targetLang: response.targetLang,
          timestamp: Date.now()
        });
      }

      return response;
    } catch (error) {
      console.error('Translation error:', error);
      return {
        translatedText: text,
        sourceLang: sourceLang,
        targetLang,
        error: error instanceof Error ? error.message : '翻译服务暂时不可用'
      };
    }
  }

  /**
   * 调用 DeepLX API
   */
  private async callDeepLXAPI(
    text: string,
    sourceLang: SourceLanguage,
    targetLang: SupportedLanguage,
    apiKey: string
  ): Promise<TranslationResponse> {
    // DeepLX API 使用个人化的 URL 格式
    const apiUrl = `https://api.deeplx.org/${apiKey}/translate`;

    const requestBody = {
      text: text,
      source_lang: sourceLang === 'auto' ? 'auto' : sourceLang.toUpperCase(),
      target_lang: targetLang.toUpperCase()
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      translatedText: data.text || data.data || '',
      sourceLang: (data.source_lang || sourceLang).toLowerCase(),
      targetLang: targetLang
    };
  }

  /**
   * 获取缓存的翻译
   */
  private getCachedTranslation(
    text: string,
    sourceLang: SupportedLanguage,
    targetLang: SupportedLanguage,
    cacheExpiry: number
  ): CachedTranslation | null {
    const cacheKey = this.generateCacheKey(text, sourceLang, targetLang);
    const cached = this.cache.get(cacheKey);

    if (!cached) {
      return null;
    }

    // 检查是否过期
    const now = Date.now();
    const expiryTime = cached.timestamp + (cacheExpiry * 60 * 60 * 1000); // 转换为毫秒
    
    if (now > expiryTime) {
      this.cache.delete(cacheKey);
      this.saveCacheToStorage();
      return null;
    }

    return cached;
  }

  /**
   * 设置缓存的翻译
   */
  private setCachedTranslation(translation: CachedTranslation): void {
    const cacheKey = this.generateCacheKey(
      translation.originalText,
      translation.sourceLang as SupportedLanguage,
      translation.targetLang as SupportedLanguage
    );

    this.cache.set(cacheKey, translation);

    // 限制缓存大小
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      // 删除最旧的条目
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.saveCacheToStorage();
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(text: string, sourceLang: SupportedLanguage, targetLang: SupportedLanguage): string {
    return `${sourceLang}-${targetLang}-${btoa(encodeURIComponent(text.trim()))}`;
  }

  /**
   * 从本地存储加载缓存
   */
  private loadCacheFromStorage(): void {
    try {
      // 检查是否在浏览器环境
      if (typeof window !== 'undefined' && window.localStorage) {
        const cached = localStorage.getItem(this.CACHE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          this.cache = new Map(data);
        }
      }
    } catch (error) {
      console.warn('Failed to load translation cache:', error);
    }
  }

  /**
   * 保存缓存到本地存储
   */
  private saveCacheToStorage(): void {
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save translation cache:', error);
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
    localStorage.removeItem(this.CACHE_KEY);
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE
    };
  }

  /**
   * 检测文本语言（简单实现）
   */
  detectLanguage(text: string): SupportedLanguage {
    // 简单的语言检测逻辑
    const chineseRegex = /[\u4e00-\u9fff]/;
    const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
    const koreanRegex = /[\uac00-\ud7af]/;
    const arabicRegex = /[\u0600-\u06ff]/;
    const russianRegex = /[\u0400-\u04ff]/;

    if (chineseRegex.test(text)) return 'zh';
    if (japaneseRegex.test(text)) return 'ja';
    if (koreanRegex.test(text)) return 'ko';
    if (arabicRegex.test(text)) return 'ar';
    if (russianRegex.test(text)) return 'ru';

    // 默认返回英文
    return 'en';
  }
}

// 导出单例实例
export const translationService = new TranslationService();
