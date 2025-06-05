'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Command } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface EnhancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => SearchResult[];
  onSelectResult: (result: SearchResult) => void;
  placeholder?: string;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  isOpen,
  onClose,
  onSearch,
  onSelectResult,
  placeholder = '搜索工具...',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { preferences, addToSearchHistory } = useUserPreferences();
  
  // 当搜索框打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      console.log('🔍 EnhancedSearch 打开，聚焦输入框');
      inputRef.current.focus();
    } else if (!isOpen) {
      console.log('❌ EnhancedSearch 关闭');
    }
  }, [isOpen]);

  // 搜索逻辑
  useEffect(() => {
    if (query.trim()) {
      const searchResults = onSearch(query);
      setResults(searchResults);
      setSelectedIndex(0);
      setShowHistory(false);
    } else {
      setResults([]);
      setShowHistory(true);
      setSelectedIndex(0);
    }
  }, [query, onSearch]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            Math.min(prev + 1, (showHistory ? preferences.searchHistory.length : results.length) - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (showHistory && preferences.searchHistory[selectedIndex]) {
            setQuery(preferences.searchHistory[selectedIndex]);
          } else if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, showHistory, preferences.searchHistory, results, onClose]);

  const handleSelectResult = (result: SearchResult) => {
    addToSearchHistory(query);
    onSelectResult(result);
    setQuery('');
    onClose();
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    setShowHistory(false);
  };

  const clearQuery = () => {
    setQuery('');
    setShowHistory(true);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 - 使用更温和的颜色 */}
      <div
        className="fixed inset-0 bg-gray-900 dark:bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 搜索框容器 */}
      <div className="flex min-h-full items-start justify-center p-4 pt-16 relative z-10">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* 搜索输入框 */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
            />
            {query && (
              <button
                onClick={clearQuery}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="ml-3 flex items-center space-x-1 text-xs text-gray-400">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>

          {/* 搜索结果或历史记录 */}
          <div className="max-h-96 overflow-y-auto">
            {showHistory && preferences.searchHistory.length > 0 ? (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  搜索历史
                </div>
                {preferences.searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg transition-colors
                      ${index === selectedIndex 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{item}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  搜索结果 ({results.length})
                </div>
                {results.map((result, index) => {
                  const IconComponent = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg transition-colors
                        ${index === selectedIndex 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {result.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {result.description}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {result.category}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query.trim() ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  没有找到匹配的工具
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  尝试使用不同的关键词
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  输入关键词搜索工具
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  支持按名称、描述、分类搜索
                </div>
              </div>
            )}
          </div>

          {/* 快捷键提示 */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>↑↓ 导航</span>
                <span>↵ 选择</span>
                <span>ESC 关闭</span>
              </div>
              <div>
                Ctrl+K 快速搜索
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
