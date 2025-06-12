'use client';

import { ExternalLink, Star, Info, Globe } from 'lucide-react';
import { AcademicResource, getAccessTypeColor, getLanguageColor } from '../data/academicResources';
import { FavoriteButton } from '@/shared/components/FavoriteButton';

interface AcademicResourceCardProps {
  resource: AcademicResource;
}

export function AcademicResourceCard({ resource }: AcademicResourceCardProps) {
  const handleVisit = () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* 渐变背景装饰 */}
      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${resource.color}`}></div>
      
      {/* 卡片内容 */}
      <div className="p-4">
        {/* 头部：图标、访问类型、语言和收藏 */}
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${resource.color} text-white shadow-lg`}>
            <resource.icon className="h-5 w-5" />
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-2">
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
          <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {resource.name}
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
            {resource.description}
          </p>
        </div>

        {/* 特性标签 */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {resource.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {feature}
              </span>
            ))}
            {resource.features.length > 3 && (
              <span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-500 text-xs rounded">
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

      {/* 悬停效果装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
    </div>
  );
}
