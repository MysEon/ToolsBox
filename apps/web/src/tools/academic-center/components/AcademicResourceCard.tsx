'use client';

import { ExternalLink, Star, Info, Globe, Edit, Sparkles } from 'lucide-react';
import { AcademicResource, getAccessTypeColor, getLanguageColor } from '../data/academicResources';
import { FavoriteButton } from '@/shared/components/FavoriteButton';

interface AcademicResourceCardProps {
  resource: AcademicResource;
  onEdit?: (resourceId: string) => void;
}

export function AcademicResourceCard({ resource, onEdit }: AcademicResourceCardProps) {
  const handleVisit = () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group relative bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* 渐变背景装饰 - 所有卡片都使用加高样式 */}
      <div className={`absolute top-0 left-0 w-full h-6 bg-gradient-to-r ${resource.color} flex items-center justify-between px-3`}>
        {/* 左侧：分类信息 */}
        <div className="text-white text-xs font-semibold">
          {resource.category}
        </div>

        {/* 右侧：自定义标识 */}
        {resource.isCustom && (
          <div className="flex items-center space-x-1 text-white text-xs font-semibold">
            <Sparkles className="h-3 w-3" />
            <span>自定义</span>
          </div>
        )}
      </div>

      {/* 卡片内容 */}
      <div className="p-4 pt-8">
        {/* 头部：图标、访问类型、语言和收藏 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${resource.color} text-white shadow-lg`}>
              <resource.icon className="h-5 w-5" />
            </div>

          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-2">
              {resource.isCustom && onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(resource.id);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="编辑资源"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              <FavoriteButton toolId={`academic-${resource.id}`} variant="star" size="sm" />
              <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getAccessTypeColor(resource.accessType)}`}>
                <span>{resource.accessType}</span>
              </div>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLanguageColor(resource.language)}`}>
              {resource.language === 'Chinese' ? '中文' :
               resource.language === 'English' ? 'EN' :
               '多语言'}
            </div>
          </div>
        </div>

        {/* 标题和描述 */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {resource.name}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2">
            {resource.description}
          </p>
        </div>

        {/* 特性标签 */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {resource.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="inline-block px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs rounded"
              >
                {feature}
              </span>
            ))}
            {resource.features.length > 3 && (
              <span className="inline-block px-1.5 py-0.5 text-zinc-400 dark:text-zinc-500 text-xs">
                +{resource.features.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div>
          {/* 主要访问按钮 */}
          <button
            onClick={handleVisit}
            className={`w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r ${resource.color} text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm`}
          >
            <Globe className="h-3 w-3" />
            <span>访问资源</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>


      </div>

    </div>
  );
}
