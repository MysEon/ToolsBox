'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, Newspaper, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, Languages, Eye, EyeOff } from 'lucide-react';
import { newsService, NewsItem } from '../../utils/newsService';
import { translationService, SupportedLanguage } from '../../utils/translationService';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

interface SidebarNewsPanelProps {
  maxItems?: number;
}

interface TranslatedNewsItem extends NewsItem {
  translatedTitle?: string;
  isTranslating?: boolean;
  translationError?: string;
}

export default function SidebarNewsPanel({ maxItems = 15 }: SidebarNewsPanelProps) {
  const [news, setNews] = useState<TranslatedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);

  const { preferences } = useUserPreferences();

  const fetchNews = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await newsService.getHackerNews(maxItems);
      if (response.error) {
        setError(response.error);
      } else {
        setNews(response.items);
      }
    } catch (err) {
      setError('获取新闻数据失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [maxItems]);

  const handleRefresh = () => {
    newsService.clearCache();
    fetchNews(true);
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  // 翻译单个新闻标题
  const translateNewsItem = async (index: number) => {
    const { translation } = preferences;

    if (!translation.deeplxApiKey) {
      alert('请先在设置中配置 DeepLX API Key');
      return;
    }

    const newsItem = news[index];
    if (!newsItem || newsItem.isTranslating) return;

    // 更新状态为翻译中
    setNews(prevNews =>
      prevNews.map((item, i) =>
        i === index ? { ...item, isTranslating: true, translationError: undefined } : item
      )
    );

    try {
      const result = await translationService.translateText(
        newsItem.title,
        translation.targetLanguage as SupportedLanguage,
        translation.deeplxApiKey,
        'auto' as SupportedLanguage,
        translation.enableCache,
        translation.cacheExpiry
      );

      setNews(prevNews =>
        prevNews.map((item, i) =>
          i === index ? {
            ...item,
            translatedTitle: result.error ? undefined : result.translatedText,
            isTranslating: false,
            translationError: result.error
          } : item
        )
      );
    } catch (error) {
      setNews(prevNews =>
        prevNews.map((item, i) =>
          i === index ? {
            ...item,
            isTranslating: false,
            translationError: '翻译失败，请稍后重试'
          } : item
        )
      );
    }
  };

  // 批量翻译所有新闻
  const translateAllNews = async () => {
    const { translation } = preferences;

    if (!translation.deeplxApiKey) {
      alert('请先在设置中配置 DeepLX API Key');
      return;
    }

    // 只翻译还没有翻译的新闻
    const untranslatedIndices = news
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.translatedTitle && !item.isTranslating)
      .map(({ index }) => index);

    if (untranslatedIndices.length === 0) return;

    // 批量翻译（限制并发数量）
    const batchSize = 3;
    for (let i = 0; i < untranslatedIndices.length; i += batchSize) {
      const batch = untranslatedIndices.slice(i, i + batchSize);
      await Promise.all(batch.map(index => translateNewsItem(index)));

      // 添加延迟避免API限制
      if (i + batchSize < untranslatedIndices.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  return (
    <div
      className={`fixed top-20 right-0 z-40 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-96' : 'w-12'
      } h-[calc(100vh-5rem)] bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 hidden lg:block`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 侧边栏头部 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-red-500">
        {isExpanded ? (
          <>
            <div className="flex items-center space-x-2">
              <Newspaper className="h-5 w-5 text-white" />
              <span className="text-white font-medium text-sm">科技新闻</span>
            </div>
            <div className="flex items-center space-x-1">
              {/* 翻译控制按钮 */}
              <button
                onClick={() => setShowTranslated(!showTranslated)}
                className="p-1 text-white hover:bg-white/20 rounded transition-colors duration-200"
                title={showTranslated ? "显示原文" : "显示翻译"}
              >
                {showTranslated ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={translateAllNews}
                className="p-1 text-white hover:bg-white/20 rounded transition-colors duration-200"
                title="翻译所有新闻"
              >
                <Languages className="h-4 w-4" />
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-1 text-white hover:bg-white/20 rounded transition-colors duration-200 disabled:opacity-50"
                title="刷新新闻"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {/* 展开/收起指示器 */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
        <div className="bg-orange-500 text-white p-1 rounded-l-md shadow-lg">
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* 新闻内容区域 */}
      <div className={`h-full overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded transition-colors duration-200"
            >
              重试
            </button>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="p-2 space-y-2">
              {news.map((item, index) => (
                <div
                  key={item.guid || index}
                  className="group bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-md"
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 pr-2">
                        {/* 显示翻译后的标题或原标题 */}
                        <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                          {showTranslated && item.translatedTitle ? item.translatedTitle : item.title}
                        </h3>

                        {/* 显示原文（当显示翻译且设置了显示原文时） */}
                        {showTranslated && item.translatedTitle && preferences.translation.showOriginal && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-tight">
                            {item.title}
                          </p>
                        )}

                        {/* 翻译错误提示 */}
                        {item.translationError && (
                          <p className="text-xs text-red-500 mt-1">
                            {item.translationError}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {/* 翻译按钮 */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            translateNewsItem(index);
                          }}
                          disabled={item.isTranslating}
                          className="p-1 text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50"
                          title="翻译此条新闻"
                        >
                          {item.isTranslating ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Languages className="h-3 w-3" />
                          )}
                        </button>

                        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{newsService.formatPublishDate(item.pubDate)}</span>

                      {/* 翻译状态指示器 */}
                      {item.translatedTitle && (
                        <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-xs">
                          已翻译
                        </span>
                      )}
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {news.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">暂无新闻数据</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部信息 */}
      {isExpanded && !loading && !error && news.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            来自 Hacker News · {news.length} 条新闻
          </p>
        </div>
      )}
    </div>
  );
}
