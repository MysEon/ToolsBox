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
            ? `tb-search-header ${isFocused ? 'ring-2 ring-white/50' : ''}`
            : `tb-search-default ${isFocused ? 'ring-2 ring-[var(--tb-accent)]/50 border-[var(--tb-accent)]' : ''}`
        }`}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search
            className={`${isHeader ? 'h-4 w-4' : 'h-5 w-5'} transition-colors duration-200 ${
              isHeader ? (isFocused ? 'text-white' : 'text-white/60') : (isFocused ? 'text-[var(--tb-accent)]' : 'text-zinc-400')
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
              : 'pl-12 pr-12 py-3.5 text-[var(--tb-text)] placeholder-[var(--tb-text-muted)] text-base'
          }`}
        />

        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 ${
              isHeader ? 'text-white/60 hover:text-white' : 'text-[var(--tb-text-muted)] hover:text-[var(--tb-text)]'
            }`}
          >
            <X className={`${isHeader ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 tb-glass-strong rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center space-x-2 px-3 py-2 text-xs text-[var(--tb-text-muted)] border-b border-[var(--tb-border)]">
              <Sparkles className="h-3 w-3" />
              <span>搜索建议</span>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-[var(--tb-text)] hover:bg-[var(--tb-bg-soft)] hover:text-[var(--tb-accent)] rounded-md transition-colors flex items-center space-x-2"
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
      className={`p-2 text-[var(--tb-text-muted)] hover:text-[var(--tb-accent)] bg-[var(--tb-surface)] backdrop-blur-sm rounded-lg hover:bg-[var(--tb-bg-soft)] border border-[var(--tb-border)] transition-colors ${className}`}
      title="搜索工具 (Ctrl+K)"
    >
      <Search className="h-5 w-5" />
    </button>
  );
}