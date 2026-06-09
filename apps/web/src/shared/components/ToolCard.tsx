'use client';

import React from 'react';
import Link from 'next/link';
import { Tool } from '@/shared/data/tools';
import { FavoriteButton } from './FavoriteButton';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { ArrowRight } from 'lucide-react';

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
  active: 'tb-pill tb-badge-active',
  beta: 'tb-pill tb-badge-beta',
  'coming-soon': 'tb-pill tb-badge-coming',
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
      className={`group relative overflow-hidden rounded-2xl tb-card transition-all duration-200 ${className}`}
    >
      <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-[0.07] group-hover:opacity-[0.12] blur-2xl transition-opacity`} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--tb-accent)] to-transparent opacity-40 group-hover:opacity-80 transition-opacity" />
      <div className={padding}>
        {/* Header: icon + favorite */}
        <div className={`flex items-start justify-between ${gap}`}>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg shadow-black/5`}>
            <tool.icon className="h-5 w-5" />
          </div>
          <FavoriteButton toolId={tool.id} size="sm" />
        </div>

        {/* Title + description */}
        <div className={gap}>
          <h3 className="text-base font-semibold text-[var(--tb-text)] mb-1.5 group-hover:text-[var(--tb-accent)] transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-[var(--tb-text-muted)] leading-relaxed line-clamp-2">
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
                <span key={index} className="inline-block px-2 py-0.5 rounded-md text-xs bg-[var(--tb-bg-soft)] text-[var(--tb-text-muted)] border border-[var(--tb-border)]">
                  {feature}
                </span>
              ))}
              {tool.features.length > 3 && (
                <span className="inline-block px-2 py-0.5 text-[var(--tb-text-muted)] text-xs">
                  +{tool.features.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[var(--tb-text-muted)]">
            {tool.status === 'active' ? '立即使用' : '敬请期待'}
          </span>
          <span className="inline-flex items-center text-sm font-medium text-[var(--tb-text)] group-hover:text-[var(--tb-accent)] transition-colors">
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
