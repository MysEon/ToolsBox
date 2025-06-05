'use client';

import React, { useState } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme, Theme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'button', 
  size = 'md',
  showLabel = false 
}) => {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: '浅色主题', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: '深色主题', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: '跟随系统', icon: <Monitor className="h-4 w-4" /> },
  ];

  const currentThemeOption = themeOptions.find(option => option.value === theme);

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  const buttonClasses = `
    ${sizeClasses[size]}
    inline-flex items-center justify-center
    rounded-lg border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-800
    text-gray-700 dark:text-gray-200
    hover:bg-gray-50 dark:hover:bg-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-all duration-200
    shadow-sm hover:shadow-md
  `;

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={buttonClasses}
        title={`当前主题: ${currentThemeOption?.label} (点击切换)`}
        aria-label="切换主题"
      >
        {actualTheme === 'dark' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`
          ${buttonClasses}
          ${showLabel ? 'px-3 w-auto space-x-2' : ''}
        `}
        aria-label="主题设置"
        aria-expanded={isDropdownOpen}
      >
        {currentThemeOption?.icon}
        {showLabel && (
          <>
            <span className="hidden sm:inline">{currentThemeOption?.label}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isDropdownOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-48 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsDropdownOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left flex items-center space-x-3
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors duration-150
                  ${theme === option.value 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-200'
                  }
                `}
              >
                {option.icon}
                <span>{option.label}</span>
                {theme === option.value && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            ))}
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                当前: {actualTheme === 'dark' ? '深色模式' : '浅色模式'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
