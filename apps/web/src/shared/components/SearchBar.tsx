'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'header';
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  suggestions = [],
  placeholder = '搜索工具...',
  className = '',
  variant = 'default',
  onFocus,
  onBlur,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const isHeader = variant === 'header';

  return (
    <div ref={containerRef} className={`relative ${isHeader ? 'w-full max-w-sm lg:max-w-md xl:max-w-lg' : 'max-w-2xl mx-auto'} ${className}`}>
      <div
        className={`relative rounded-xl transition-all duration-300 ${
          isHeader
            ? `bg-white/10 backdrop-blur-sm ${isFocused ? 'bg-white/20 ring-2 ring-white/50' : 'hover:bg-white/15'}`
            : `bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 ${isFocused ? 'ring-2 ring-blue-500/50 border-blue-500' : 'hover:border-zinc-300 dark:hover:border-zinc-600'}`
        }`}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search
            className={`${isHeader ? 'h-4 w-4' : 'h-5 w-5'} transition-colors duration-200 ${
              isHeader ? (isFocused ? 'text-white' : 'text-white/60') : (isFocused ? 'text-blue-500' : 'text-zinc-400')
            }`}
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent border-0 rounded-xl focus:outline-none focus:ring-0 ${
            isHeader
              ? 'pl-10 pr-10 py-2.5 text-white placeholder-white/50 text-sm'
              : 'pl-12 pr-12 py-3.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-base'
          }`}
        />

        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 ${
              isHeader ? 'text-white/60 hover:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <X className={`${isHeader ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center space-x-2 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-700">
              <Sparkles className="h-3 w-3" />
              <span>搜索建议</span>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors flex items-center space-x-2"
              >
                <Search className="h-3 w-3 text-zinc-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileSearchButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-white hover:text-blue-200 transition-colors bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 ${className}`}
      title="搜索工具 (Ctrl+K)"
    >
      <Search className="h-5 w-5" />
    </button>
  );
}
