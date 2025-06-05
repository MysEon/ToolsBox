'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ThemeToggle';
import {
  Home,
  ArrowLeft,
  Menu,
  X,
  Github,
  Twitter,
  Mail,
  Wrench
} from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
}

export default function Header({ showBackButton = false, title, subtitle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* 左侧：Logo和标题 */}
          <div className="flex items-center space-x-4">
            {/* 返回按钮 */}
            {showBackButton && !isHomePage && (
              <Link 
                href="/"
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">返回工具箱</span>
              </Link>
            )}

            {/* Logo和标题 */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/30 transition-all duration-200">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors">
                  {title || '开发者工具箱'}
                </h1>
                {subtitle && (
                  <p className="text-blue-100 text-sm">
                    {subtitle}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* 右侧：导航和菜单 */}
          <div className="flex items-center space-x-4">
            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  isHomePage 
                    ? 'text-white bg-white/20' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>工具箱</span>
              </Link>
              
              <a
                href="https://github.com/MysEon/ToolsBox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </nav>

            {/* 主题切换按钮 */}
            <ThemeToggle variant="button" size="md" />

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-blue-200 transition-colors duration-200 bg-white/10 backdrop-blur-sm rounded-lg p-2 hover:bg-white/20"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isHomePage 
                    ? 'text-white bg-white/20' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>工具箱</span>
              </Link>
              
              <a
                href="https://github.com/MysEon/ToolsBox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>

              <a
                href="#"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Mail className="h-4 w-4" />
                <span>联系我们</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
