'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import SearchBar, { MobileSearchButton } from './SearchBar';
import ToolsBoxMark from './icons/ToolsBoxMark';
import { ArrowLeft, Menu, X, Github } from 'lucide-react';

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
    <header className="sticky top-0 z-30 tb-glass">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4">
          {/* Left: Logo + back button */}
          <div className="flex items-center gap-3 shrink-0">
            {showBackButton && !isHomePage && (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-[var(--tb-text-muted)] hover:text-[var(--tb-accent)] transition-colors shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">返回</span>
              </Link>
            )}

            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <ToolsBoxMark size={32} className="shrink-0" />
              <div className="hidden sm:block">
                <span className="text-sm font-semibold text-[var(--tb-text)]">
                  {title || 'ToolsBox'}
                </span>
                {subtitle && (
                  <span className="text-xs text-[var(--tb-text-muted)] ml-2">{subtitle}</span>
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
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isHomePage
                    ? 'tb-pill text-[var(--tb-text)]'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-[var(--tb-accent)]'
                }`}
              >
                工具箱
              </Link>
              <a
                href="https://github.com/MysEon/ToolsBox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-[var(--tb-accent)] transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            </nav>

            <div className="w-px h-5 bg-[var(--tb-border)] hidden md:block mx-1" />

            {showSearch && (
              <div className="md:hidden">
                <MobileSearchButton onClick={onMobileSearchClick || (() => {})} />
              </div>
            )}

            <ThemeToggle variant="button" size="sm" />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-[var(--tb-text-muted)] hover:text-[var(--tb-accent)] rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden tb-glass border-t border-[var(--tb-border)] py-3">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isHomePage
                    ? 'tb-pill text-[var(--tb-text)]'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-[var(--tb-accent)]'
                }`}
              >
                工具箱
              </Link>
              <a
                href="https://github.com/MysEon/ToolsBox"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-[var(--tb-accent)] transition-colors"
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
