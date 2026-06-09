'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NewToolNotificationProps {
  onClose?: () => void;
}

export function NewToolNotification({ onClose }: NewToolNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const hasClosedNotification = localStorage.getItem('devToolsNotificationClosed');
    if (!hasClosedNotification) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('devToolsNotificationClosed', 'true');
      onClose?.();
    }, 300);
  };

  const handleVisitTool = () => {
    localStorage.setItem('devToolsNotificationClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`
          bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 p-5 max-w-sm
          transform transition-all duration-300 ease-out
          ${isAnimating
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-full opacity-0 scale-95'
          }
        `}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            新功能
          </span>
        </div>

        <div className="mb-3">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">编程软件下载中心</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">刚刚上线</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2">
            汇聚23个主流编程工具的官方下载地址，从IDE到数据库，从前端到后端，一站式获取开发环境！
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <span>官方下载</span>
          <span>安装教程</span>
          <span>分类筛选</span>
          <span>多平台支持</span>
        </div>

        <div className="space-y-2">
          <Link
            href="/tools/dev-tools"
            onClick={handleVisitTool}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
          >
            <span>立即体验</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            稍后再看
          </button>
        </div>
      </div>
    </div>
  );
}
