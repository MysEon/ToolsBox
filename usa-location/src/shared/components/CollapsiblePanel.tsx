'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
}

export function CollapsiblePanel({
  title,
  children,
  defaultExpanded = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  icon
}: CollapsiblePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* 标题栏 */}
      <button
        onClick={toggleExpanded}
        className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${titleClassName}`}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        
        <div className="flex-shrink-0 ml-4">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </button>

      {/* 内容区域 */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-6 pb-6 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// 预设样式的折叠面板变体
export function InfoCollapsiblePanel({
  title,
  children,
  defaultExpanded = false,
  className = ''
}: Omit<CollapsiblePanelProps, 'icon'>) {
  return (
    <CollapsiblePanel
      title={title}
      defaultExpanded={defaultExpanded}
      className={className}
      icon={
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <div className="h-4 w-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
        </div>
      }
    >
      {children}
    </CollapsiblePanel>
  );
}

export function StatsCollapsiblePanel({
  title,
  children,
  defaultExpanded = true,
  className = ''
}: Omit<CollapsiblePanelProps, 'icon'>) {
  return (
    <CollapsiblePanel
      title={title}
      defaultExpanded={defaultExpanded}
      className={className}
      icon={
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <div className="h-4 w-4 bg-green-600 dark:bg-green-400 rounded-full"></div>
        </div>
      }
    >
      {children}
    </CollapsiblePanel>
  );
}
