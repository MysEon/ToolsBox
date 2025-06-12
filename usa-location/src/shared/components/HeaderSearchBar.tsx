'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface HeaderSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function HeaderSearchBar({ 
  searchTerm, 
  onSearchChange, 
  suggestions = [], 
  placeholder = "搜索工具...",
  className = "",
  onFocus,
  onBlur
}: HeaderSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭建议
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setShowSuggestions(value.trim().length > 0 && suggestions.length > 0);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    onFocus?.();
    if (searchTerm.trim().length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    onBlur?.();
    // 延迟关闭建议，以便点击建议项
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-sm lg:max-w-md xl:max-w-lg ${className}`}>
      {/* 搜索输入框 */}
      <div className={`relative bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 ${
        isFocused ? 'bg-white/30 ring-2 ring-white/50' : 'hover:bg-white/25'
      }`}>
        {/* 搜索图标 */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 transition-colors duration-200 ${
            isFocused ? 'text-white' : 'text-white/70'
          }`} />
        </div>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 text-white placeholder-white/60 bg-transparent border-0 rounded-lg focus:outline-none focus:ring-0 text-sm"
        />

        {/* 清空按钮 */}
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 搜索建议 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
              <Sparkles className="h-3 w-3" />
              <span>搜索建议</span>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150 flex items-center space-x-2"
              >
                <Search className="h-3 w-3 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 移动端搜索图标组件
export function MobileSearchButton({ 
  onClick, 
  className = "" 
}: { 
  onClick: () => void; 
  className?: string; 
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-white hover:text-blue-200 transition-colors duration-200 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 ${className}`}
      title="搜索工具 (Ctrl+K)"
    >
      <Search className="h-5 w-5" />
    </button>
  );
}
