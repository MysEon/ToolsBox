'use client';

import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

interface FavoriteButtonProps {
  toolId: string;
  variant?: 'heart' | 'star';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  toolId,
  variant = 'heart',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useUserPreferences();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isFav = isFavorite(toolId);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    if (isFav) {
      removeFromFavorites(toolId);
    } else {
      addToFavorites(toolId);
    }
  };

  const Icon = variant === 'heart' ? Heart : Star;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${buttonSizeClasses[size]}
        inline-flex items-center justify-center space-x-1
        rounded-lg transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isAnimating ? 'scale-110' : 'scale-100'}
        ${isFav 
          ? variant === 'heart' 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-yellow-500 hover:text-yellow-600'
          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }
        ${className}
      `}
      title={isFav ? '取消收藏' : '添加到收藏'}
      aria-label={isFav ? '取消收藏' : '添加到收藏'}
    >
      <Icon 
        className={`
          ${sizeClasses[size]}
          transition-all duration-200
          ${isFav ? 'fill-current' : ''}
          ${isAnimating ? 'animate-pulse' : ''}
        `}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isFav ? '已收藏' : '收藏'}
        </span>
      )}
    </button>
  );
};

// 收藏工具列表组件
interface FavoriteToolsListProps {
  tools: Array<{ id: string; name: string; href: string; icon: React.ComponentType<any> }>;
  onToolClick?: (toolId: string) => void;
  className?: string;
}

export const FavoriteToolsList: React.FC<FavoriteToolsListProps> = ({
  tools,
  onToolClick,
  className = '',
}) => {
  const { preferences } = useUserPreferences();
  
  const favoriteTools = tools.filter(tool => 
    preferences.favoriteTools.includes(tool.id)
  );

  if (favoriteTools.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Heart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          还没有收藏的工具
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          点击工具卡片上的 ❤️ 按钮来收藏常用工具
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {favoriteTools.map((tool) => {
        const IconComponent = tool.icon;
        return (
          <div
            key={tool.id}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => onToolClick?.(tool.id)}
          >
            <div className="flex-shrink-0">
              <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {tool.name}
              </h4>
            </div>
            <FavoriteButton toolId={tool.id} size="sm" />
          </div>
        );
      })}
    </div>
  );
};
