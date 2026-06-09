'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ExternalLink, Clock, Newspaper, RefreshCw, AlertCircle,
  ChevronLeft, ChevronRight, Languages, Eye, EyeOff,
} from 'lucide-react';
import type { NewsItem } from '@/shared/services/newsService';
import type { SourceLanguage, SupportedLanguage } from '@/shared/services/translationService';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { formatTimeAgo } from '@/shared/utils/timeFormat';

interface SidebarNewsPanelProps {
  maxItems?: number;
}

interface TranslatedNewsItem extends NewsItem {
  translatedTitle?: string;
  isTranslating?: boolean;
  translationError?: string;
}

function formatPublishDate(dateString: string): string {
  try {
    return formatTimeAgo(new Date(dateString).getTime());
  } catch {
    return '时间未知';
  }
}

export default function SidebarNewsPanel({ maxItems = 15 }: SidebarNewsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [news, setNews] = useState<TranslatedNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);
  const hasLoaded = useRef(false);

  const { preferences } = useUserPreferences();

  // Detect desktop via matchMedia
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const fetchNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { newsService } = await import('@/shared/services/newsService');
      const response = await newsService.getHackerNews(maxItems);
      setNews(response.items);
      if (response.stale) {
        setError(response.error || '网络异常，显示缓存新闻');
      } else if (response.error) {
        setError(response.error);
      }
    } catch {
      setError('获取新闻数据失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [maxItems]);

  // Fetch only on first expand
  useEffect(() => {
    if (isExpanded && !hasLoaded.current) {
      hasLoaded.current = true;
      fetchNews();
    }
  }, [isExpanded, fetchNews]);

  const handleRefresh = async () => {
    const { newsService } = await import('@/shared/services/newsService');
    newsService.clearCache();
    fetchNews(true);
  };

  // Desktop only — return nothing on mobile/tablet
  if (!isDesktop) return null;

  // Translate a single news item title
  const translateNewsItem = async (id: string) => {
    const { translation } = preferences;
    if (!translation.deeplxApiKey) {
      console.warn('DeepLX API Key not configured');
      return;
    }

    const idx = news.findIndex(item => (item.guid || item.link) === id);
    if (idx === -1 || news[idx].isTranslating) return;

    setNews(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, isTranslating: true, translationError: undefined } : item,
      ),
    );

    try {
      const { translationService } = await import('@/shared/services/translationService');
      const result = await translationService.translateText(
        news[idx].title,
        translation.targetLanguage as SupportedLanguage,
        translation.deeplxApiKey,
        'auto' as SourceLanguage,
        translation.enableCache,
        translation.cacheExpiry,
      );

      setNews(prev =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                translatedTitle: result.error ? undefined : result.translatedText,
                isTranslating: false,
                translationError: result.error,
              }
            : item,
        ),
      );
    } catch {
      setNews(prev =>
        prev.map((item, i) =>
          i === idx ? { ...item, isTranslating: false, translationError: '翻译失败，请稍后重试' } : item,
        ),
      );
    }
  };

  const translateAllNews = async () => {
    const { translation } = preferences;
    if (!translation.deeplxApiKey) return;

    const untranslatedIds = news
      .filter(item => !item.translatedTitle && !item.isTranslating)
      .map(item => item.guid || item.link)
      .filter(Boolean) as string[];

    if (untranslatedIds.length === 0) return;

    const batchSize = 3;
    for (let i = 0; i < untranslatedIds.length; i += batchSize) {
      const batch = untranslatedIds.slice(i, i + batchSize);
      await Promise.all(batch.map(id => translateNewsItem(id)));
      if (i + batchSize < untranslatedIds.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  };

  return (
    <div
      className={`fixed top-20 right-0 z-40 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-96' : 'w-12'
      } h-[calc(100vh-5rem)]`}
      id="tech-news-sidebar-panel"
      role="complementary"
      aria-label="科技新闻侧边栏"
    >
      {/* Expand/Collapse trigger */}
      <button
        type="button"
        aria-label={isExpanded ? '收起科技新闻侧边栏' : '展开科技新闻侧边栏'}
        aria-expanded={isExpanded}
        aria-controls="tech-news-sidebar-panel"
        onClick={() => setIsExpanded(prev => !prev)}
        className={`
          absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 z-10
          flex items-center justify-center
          bg-[var(--tb-surface)] border border-[var(--tb-border)]
          text-[var(--tb-text)] p-1.5 rounded-l-xl shadow-lg
          hover:bg-[var(--tb-bg-soft)] transition-colors cursor-pointer
        `}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--tb-border)] tb-glass-strong rounded-tl-2xl">
        {isExpanded ? (
          <>
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-[var(--tb-accent)]" />
              <span className="text-sm font-semibold text-[var(--tb-text)]">科技新闻</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={showTranslated ? '显示原文' : '显示翻译'}
                onClick={() => setShowTranslated(prev => !prev)}
                className="tb-toolbar-btn"
              >
                {showTranslated ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                aria-label="翻译所有新闻"
                onClick={translateAllNews}
                className="tb-toolbar-btn"
              >
                <Languages className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="刷新新闻"
                onClick={handleRefresh}
                disabled={refreshing}
                className="tb-toolbar-btn"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full">
            <Newspaper className="h-5 w-5 text-[var(--tb-accent)]" />
          </div>
        )}
      </div>

      {/* News content */}
      <div
        className={`h-[calc(100%-48px)] overflow-hidden tb-surface rounded-bl-2xl ${
          isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300`}
      >
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-1.5">
                <div className="h-3 bg-[var(--tb-bg-soft)] rounded w-full" />
                <div className="h-2.5 bg-[var(--tb-bg-soft)] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {/* Non-fatal stale-data warning */}
            {error && news.length > 0 && (
              <div className="px-3 pt-3 pb-1 text-xs text-amber-400 text-center" role="alert">
                {error}
              </div>
            )}

            {news.length > 0 ? (
              <div className="p-2 space-y-2">
                {news.map(item => {
                  const id = item.guid || item.link;
                  return (
                    <div
                      key={id}
                      className="tb-card rounded-xl overflow-hidden"
                    >
                      {/* Title row — link is sibling to action button, not parent */}
                      <div className="p-3 pb-2">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <h3 className="text-xs font-medium text-[var(--tb-text)] leading-relaxed line-clamp-3 hover:text-[var(--tb-accent)] transition-colors">
                            {showTranslated && item.translatedTitle ? item.translatedTitle : item.title}
                          </h3>
                          {showTranslated && item.translatedTitle && preferences.translation.showOriginal && (
                            <p className="text-xs text-[var(--tb-text-muted)] mt-1 line-clamp-2 leading-tight">
                              {item.title}
                            </p>
                          )}
                        </a>

                        {item.translationError && (
                          <p className="text-xs text-red-400 mt-1">{item.translationError}</p>
                        )}
                      </div>

                      {/* Footer row: meta + action buttons */}
                      <div className="flex items-center justify-between px-3 pb-2">
                        <div className="flex items-center gap-1 text-xs text-[var(--tb-text-muted)]">
                          <Clock className="h-3 w-3" />
                          <span>{formatPublishDate(item.pubDate)}</span>
                          {item.translatedTitle && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-[var(--tb-accent-2)]/10 text-[var(--tb-accent-2)]">
                              已翻译
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`翻译此条: ${item.title.slice(0, 30)}`}
                            disabled={item.isTranslating}
                            onClick={() => translateNewsItem(id)}
                            className="tb-toolbar-btn p-1"
                          >
                            {item.isTranslating ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Languages className="h-3 w-3" />
                            )}
                          </button>
                          <span className="text-[var(--tb-text-muted)]">
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : error ? (
              <div className="p-8 text-center" role="alert">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-[var(--tb-text-muted)] mb-3">{error}</p>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="px-3 py-1.5 text-xs font-medium rounded-full tb-pill border border-[var(--tb-border)] hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)] transition-colors"
                >
                  重试
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-[var(--tb-text-muted)]">暂无新闻数据</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer bar */}
      {isExpanded && news.length > 0 && (
        <div className="h-8 flex items-center justify-center border-t border-[var(--tb-border)] bg-[var(--tb-bg-soft)]">
          <span className="text-xs text-[var(--tb-text-muted)]">
            来自 Hacker News · {news.length} 条
          </span>
        </div>
      )}
    </div>
  );
}