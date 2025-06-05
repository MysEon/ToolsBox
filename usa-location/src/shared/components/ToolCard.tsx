'use client';

import React from 'react';
import Link from 'next/link';
import { Tool } from '../../data/tools';
import { ArrowRight, Clock, CheckCircle, Zap } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export default function ToolCard({ tool, className = '' }: ToolCardProps) {
  const StatusIcon = tool.status === 'active' ? CheckCircle : 
                    tool.status === 'beta' ? Zap : Clock;
  
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
    <div className={`group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${className}`}>
      {/* 渐变背景装饰 */}
      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${tool.color}`}></div>
      
      {/* 卡片内容 */}
      <div className="p-6">
        {/* 头部：图标和状态 */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color} text-white shadow-lg`}>
            <tool.icon className="h-6 w-6" />
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[tool.status]}`}>
            <StatusIcon className="h-3 w-3" />
            <span>{statusTexts[tool.status]}</span>
          </div>
        </div>

        {/* 标题和描述 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {tool.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {tool.description}
          </p>
        </div>

        {/* 分类标签 */}
        <div className="mb-4">
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
      <Link href={tool.href} className="block">
        <CardContent />
      </Link>
    );
  }

  // 否则显示为普通卡片
  return <CardContent />;
}
