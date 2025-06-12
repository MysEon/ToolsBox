'use client';

import React from 'react';
import Link from 'next/link';
import { Tool } from '../../data/tools';
import { FavoriteButton } from './FavoriteButton';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { ArrowRight, Clock, CheckCircle, Zap } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export default function ToolCard({ tool, className = '' }: ToolCardProps) {
  const { preferences, recordToolUsage } = useUserPreferences();

  const StatusIcon = tool.status === 'active' ? CheckCircle :
                    tool.status === 'beta' ? Zap : Clock;

  const handleClick = () => {
    if (tool.status === 'active') {
      recordToolUsage(tool.id);
    }
  };

  // 根据布局密度获取内边距
  const getPaddingClasses = () => {
    const { density } = preferences.layout;

    switch (density) {
      case 'compact':
        return 'p-4';
      case 'spacious':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  // 根据布局密度获取间距
  const getSpacingClasses = () => {
    const { density } = preferences.layout;

    switch (density) {
      case 'compact':
        return 'mb-3';
      case 'spacious':
        return 'mb-6';
      default:
        return 'mb-4';
    }
  };
  
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    beta: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'coming-soon': 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const statusTexts = {
    active: '可用',
    beta: '测试版',
    'coming-soon': '即将推出'
  };

  const CardContent = () => (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${className}`}>
      {/* 渐变背景装饰 - 加高样式并显示分类信息 */}
      <div className={`absolute top-0 left-0 w-full h-6 bg-gradient-to-r ${tool.color} flex items-center justify-between px-3`}>
        {/* 左侧：分类信息 */}
        <div className="text-white text-xs font-semibold">
          {tool.category}
        </div>

        {/* 右侧：状态信息 */}
        <div className="text-white text-xs font-semibold">
          {statusTexts[tool.status]}
        </div>
      </div>

      {/* 卡片内容 */}
      <div className={`${getPaddingClasses()} pt-8`}>
        {/* 头部：图标、状态和收藏 */}
        <div className={`flex items-start justify-between ${getSpacingClasses()}`}>
          <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color} text-white shadow-lg`}>
            <tool.icon className="h-6 w-6" />
          </div>
          <div className="flex items-center space-x-2">
            <FavoriteButton toolId={tool.id} size="sm" />
          </div>
        </div>

        {/* 标题和描述 */}
        <div className={getSpacingClasses()}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {tool.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
            {tool.description}
          </p>
        </div>

        {/* 分类标签 */}
        <div className={getSpacingClasses()}>
          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
            {tool.category}
          </span>
        </div>

        {/* 功能特点 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {tool.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
            {tool.features.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{tool.features.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* 底部：操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {tool.status === 'active' ? '立即使用' : '敬请期待'}
          </div>
          <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium mr-1">
              {tool.status === 'active' ? '进入工具' : '了解更多'}
            </span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 悬停效果装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
    </div>
  );

  // 如果工具可用，包装为链接
  if (tool.status === 'active') {
    return (
      <Link href={tool.href} className="block" onClick={handleClick}>
        <CardContent />
      </Link>
    );
  }

  // 否则显示为普通卡片
  return <CardContent />;
}
