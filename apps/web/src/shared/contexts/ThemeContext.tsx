'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // 获取系统主题偏好
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // 计算实际应用的主题
  const calculateActualTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // 应用主题到 DOM
  const applyTheme = (themeToApply: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;

    console.log('🎨 应用主题:', themeToApply);
    const root = document.documentElement;

    // 记录当前类名
    console.log('🔍 当前 HTML 类名:', root.className);

    root.classList.remove('light', 'dark');
    root.classList.add(themeToApply);

    // 记录更新后的类名
    console.log('✅ 更新后 HTML 类名:', root.className);

    // 更新 meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        themeToApply === 'dark' ? '#1f2937' : '#ffffff'
      );
      console.log('🎯 更新 meta theme-color:', themeToApply === 'dark' ? '#1f2937' : '#ffffff');
    }
  };

  // 从 localStorage 加载主题设置
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('🚀 初始化主题系统');
    const savedTheme = localStorage.getItem('toolsbox-theme') as Theme;
    console.log('📖 从 localStorage 读取主题:', savedTheme);

    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      // 如果没有保存的主题，强制应用默认主题
      console.log('🔧 没有保存的主题，应用默认主题');
      const defaultActualTheme = calculateActualTheme('system');
      setActualTheme(defaultActualTheme);
      applyTheme(defaultActualTheme);
    }
    setIsInitialized(true);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const newActualTheme = getSystemTheme();
        setActualTheme(newActualTheme);
        applyTheme(newActualTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 当主题设置改变时更新实际主题
  useEffect(() => {
    console.log('🔄 主题设置改变:', theme);
    const newActualTheme = calculateActualTheme(theme);
    console.log('📊 计算出的实际主题:', newActualTheme);
    setActualTheme(newActualTheme);
    applyTheme(newActualTheme);

    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('toolsbox-theme', theme);
      console.log('💾 保存主题到 localStorage:', theme);
    }
  }, [theme, calculateActualTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    console.log('🔀 切换主题，当前主题:', theme);
    if (theme === 'light') {
      console.log('➡️ 从 light 切换到 dark');
      setTheme('dark');
    } else if (theme === 'dark') {
      console.log('➡️ 从 dark 切换到 system');
      setTheme('system');
    } else {
      console.log('➡️ 从 system 切换到 light');
      setTheme('light');
    }
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme: handleSetTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
