'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ThemeToggle';
import SearchBar, { MobileSearchButton } from '../SearchBar';
import { ArrowLeft, Menu, X, Github, Wrench } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchSuggestions?: string[];
  onMobileSearchClick?: () => void;
}

export default function Header({
  showBackButton = false,
  title,
  subtitle,
  searchTerm = '',
  onSearchChange,
  searchSuggestions = [],
  onMobileSearchClick,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const showSearch = isHomePage && onSearchChange;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4">
          {/* Left: Logo + back button */}
          <div className="flex items-center gap-3 shrink-0">
            {showBackButton && !isHomePage && (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">返回</span>
              </Link>
            )}

            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100">
                <Wrench className="h-4 w-4 text-white dark:text-zinc-900" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {title || '开发者工具箱'}
                </span>
                {subtitle && (
                  <span className="text-xs text-zinc-400 ml-2">{subtitle}</span>
                )}
              </div>
            </Link>
          </div>

          {/* Center: search (home page only) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 justify-center max-w-lg mx-4">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                suggestions={searchSuggestions}
                placeholder="搜索工具..."
                variant="header"
                className="w-full"
              />
            </div>
          )}

          {/* Right: nav + theme + mobile menu */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isHomePage
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                工具箱
              </Link>
              <a
                href="https://github.com/MysEon/ToolsBox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            </nav>

            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 hidden md:block mx-1" />

            {showSearch && (
              <div className="md:hidden">
                <MobileSearchButton onClick={onMobileSearchClick || (() => {})} />
              </div>
            )}

            <ThemeToggle variant="button" size="sm" />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 py-3">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isHomePage
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                工具箱
              </Link>
              <a
                href="https://github.com/MysEon/ToolsBox"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
