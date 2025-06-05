'use client';

import { useState, useEffect } from 'react';
import { X, Download, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NewToolNotificationProps {
  onClose?: () => void;
}

export function NewToolNotification({ onClose }: NewToolNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 检查用户是否已经关闭过这个通知
    const hasClosedNotification = localStorage.getItem('devToolsNotificationClosed');
    
    if (!hasClosedNotification) {
      // 延迟2秒显示，避免页面加载时立即弹出
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
          bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm
          transform transition-all duration-300 ease-out
          ${isAnimating 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-full opacity-0 scale-95'
          }
        `}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 新功能标识 */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
            <Sparkles className="h-3 w-3 text-white" />
            <span className="text-xs font-medium text-white">新功能</span>
          </div>
        </div>

        {/* 工具信息 */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">编程软件下载中心</h3>
              <p className="text-xs text-gray-500">刚刚上线</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            汇聚23个主流编程工具的官方下载地址，从IDE到数据库，从前端到后端，一站式获取开发环境！
          </p>
        </div>

        {/* 特性亮点 */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1 text-gray-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>官方下载</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>安装教程</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span>分类筛选</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span>多平台支持</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-2">
          <Link
            href="/tools/dev-tools"
            onClick={handleVisitTool}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <span>立即体验</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            稍后再看
          </button>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
