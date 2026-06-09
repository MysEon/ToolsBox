'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Command } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import Modal from './Modal';

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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setShowHistory(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      setResults(onSearch(query));
      setSelectedIndex(0);
      setShowHistory(false);
    } else {
      setResults([]);
      setShowHistory(true);
      setSelectedIndex(0);
    }
  }, [query, onSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      const items = showHistory ? preferences.searchHistory : results;
      const maxIndex = items.length - 1;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
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

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      {/* Search input */}
      <div className="flex items-center -mx-6 -mt-4 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <Search className="h-5 w-5 text-zinc-400 mr-3" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none text-lg"
        />
        {query && (
          <button onClick={clearQuery} className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="ml-3 flex items-center space-x-1 text-xs text-zinc-400">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </div>

      {/* Results / History */}
      <div className="max-h-72 overflow-y-auto -mx-6 -mb-4 mt-4">
        {showHistory && preferences.searchHistory.length > 0 ? (
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">搜索历史</div>
            {preferences.searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  index === selectedIndex
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{item}</span>
                </div>
              </button>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              搜索结果 ({results.length})
            </div>
            {results.map((result, index) => {
              const IconComponent = result.icon;
              return (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{result.name}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{result.description}</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shrink-0">
                      {result.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : query.trim() ? (
          <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            没有找到匹配的工具
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            输入关键词搜索工具
          </div>
        )}
      </div>

      {/* Footer shortcuts */}
      <div className="-mx-6 -mb-4 mt-4 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700 rounded-b-xl">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-4">
            <span>↑↓ 导航</span>
            <span>↵ 选择</span>
            <span>ESC 关闭</span>
          </div>
          <span>Ctrl+K 快速搜索</span>
        </div>
      </div>
    </Modal>
  );
};
