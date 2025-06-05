'use client';

import { ExternalLink, Download, BookOpen, Info } from 'lucide-react';
import { DevTool, getLicenseColor } from '@/data/devTools';

interface DevToolCardProps {
  tool: DevTool;
}

export function DevToolCard({ tool }: DevToolCardProps) {
  const handleDownload = () => {
    window.open(tool.downloadUrl, '_blank', 'noopener,noreferrer');
  };

  const handleVisitOfficial = () => {
    window.open(tool.officialUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewTutorial = () => {
    if (tool.tutorialUrl) {
      window.open(tool.tutorialUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* 头部渐变背景 */}
      <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
      
      <div className="p-6">
        {/* 工具图标和基本信息 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color} text-white`}>
              <tool.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              {tool.version && (
                <span className="text-sm text-gray-500">v{tool.version}</span>
              )}
            </div>
          </div>
          
          {/* 许可证标签 */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLicenseColor(tool.license)}`}>
            {tool.license}
          </span>
        </div>

        {/* 描述 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {tool.description}
        </p>

        {/* 平台支持 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {tool.platforms.map((platform) => (
              <span
                key={platform}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* 特性标签 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1">
            {tool.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {feature}
              </span>
            ))}
            {tool.features.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
                +{tool.features.length - 3} 更多
              </span>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-2">
          {/* 主要下载按钮 */}
          <button
            onClick={handleDownload}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${tool.color} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}
          >
            <Download className="h-4 w-4" />
            <span>官方下载</span>
          </button>

          {/* 次要操作按钮 */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleVisitOfficial}
              className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <ExternalLink className="h-3 w-3" />
              <span>官网</span>
            </button>
            
            {tool.tutorialUrl && (
              <button
                onClick={handleViewTutorial}
                className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <BookOpen className="h-3 w-3" />
                <span>教程</span>
              </button>
            )}
          </div>
        </div>

        {/* 悬停时显示更多信息 */}
        <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Info className="h-3 w-3" />
            <span>点击下载按钮将跳转到官方下载页面</span>
          </div>
        </div>
      </div>
    </div>
  );
}
