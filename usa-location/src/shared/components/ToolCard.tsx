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

const paddingMap: Record<string, string> = {
  compact: 'p-4',
  spacious: 'p-7',
  standard: 'p-5',
};

const gapMap: Record<string, string> = {
  compact: 'mb-2.5',
  spacious: 'mb-5',
  standard: 'mb-3.5',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  beta: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  'coming-soon': 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
};

const statusTexts: Record<string, string> = {
  active: '可用',
  beta: '测试版',
  'coming-soon': '即将推出',
};

export default function ToolCard({ tool, className = '' }: ToolCardProps) {
  const { preferences, recordToolUsage } = useUserPreferences();

  const density = preferences.layout.density;
  const padding = paddingMap[density] || paddingMap.standard;
  const gap = gapMap[density] || gapMap.standard;

  const handleClick = () => {
    if (tool.status === 'active') recordToolUsage(tool.id);
  };

  const CardContent = () => (
    <div
      className={`group relative bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className={padding}>
        {/* Header: icon + favorite */}
        <div className={`flex items-start justify-between ${gap}`}>
          <div className={`p-2.5 rounded-lg bg-gradient-to-r ${tool.color} text-white`}>
            <tool.icon className="h-5 w-5" />
          </div>
          <FavoriteButton toolId={tool.id} size="sm" />
        </div>

        {/* Title + description */}
        <div className={gap}>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Status badge */}
        <div className={gap}>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[tool.status]}`}>
            {statusTexts[tool.status]}
          </span>
        </div>

        {/* Features */}
        {tool.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {tool.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs rounded">
                  {feature}
                </span>
              ))}
              {tool.features.length > 3 && (
                <span className="inline-block px-2 py-0.5 text-zinc-400 dark:text-zinc-500 text-xs">
                  +{tool.features.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {tool.status === 'active' ? '立即使用' : '敬请期待'}
          </span>
          <span className="inline-flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {tool.status === 'active' ? '进入工具' : '了解更多'}
            <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );

  if (tool.status === 'active') {
    return (
      <Link href={tool.href} className="block" onClick={handleClick}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
