'use client';

import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

interface Tool {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
}

interface RecentlyUsedProps {
  tools: Tool[];
  onToolClick?: (toolId: string) => void;
  limit?: number;
  className?: string;
}

export const RecentlyUsed: React.FC<RecentlyUsedProps> = ({
  tools,
  onToolClick,
  limit = 5,
  className = '',
}) => {
  const { getRecentlyUsedTools } = useUserPreferences();
  
  const recentlyUsedData = getRecentlyUsedTools(limit);
  
  const recentlyUsedTools = recentlyUsedData
    .map(usage => tools.find(tool => tool.id === usage.toolId))
    .filter((tool): tool is Tool => tool !== undefined)
    .map((tool, index) => ({
      ...tool,
      usage: recentlyUsedData[index],
    }));

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  if (recentlyUsedTools.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          还没有使用记录
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          开始使用工具后，这里会显示您最近使用的工具
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {recentlyUsedTools.map((tool) => {
        const IconComponent = tool.icon;
        return (
          <div
            key={tool.id}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => onToolClick?.(tool.id)}
          >
            <div className="flex-shrink-0">
              <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {tool.name}
                </h4>
                {tool.usage.usageCount > 1 && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>{tool.usage.usageCount}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatTimeAgo(tool.usage.lastUsed)}
              </p>
            </div>
            
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 使用统计组件
interface UsageStatsProps {
  className?: string;
}

export const UsageStats: React.FC<UsageStatsProps> = ({ className = '' }) => {
  const { preferences } = useUserPreferences();

  const totalUsage = preferences.usageHistory.reduce((sum, item) => sum + item.usageCount, 0);
  const uniqueTools = preferences.usageHistory.length;
  const mostUsedTool = preferences.usageHistory.reduce((max, item) =>
    item.usageCount > (max?.usageCount || 0) ? item : max,
    null as typeof preferences.usageHistory[0] | null
  );

  if (totalUsage === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${className}`}>
      <h3 className="text-xs font-normal text-gray-600 dark:text-gray-400 mb-2 flex items-center">
        <TrendingUp className="h-3 w-3 mr-1" />
        使用统计
      </h3>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {totalUsage}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            总使用
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {uniqueTools}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            工具数
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mostUsedTool?.usageCount || 0}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            最高次数
          </div>
        </div>
      </div>
    </div>
  );
};
