'use client';

import { useState } from 'react';
import { ExternalLink, Globe } from 'lucide-react';

interface MirrorMonitorPanelProps {
  className?: string;
}

export function MirrorMonitorPanel({ className = '' }: MirrorMonitorPanelProps) {
  const [showKentxxqFrame, setShowKentxxqFrame] = useState(true);

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* 头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-600" />
              Docker镜像站监控
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              通过第三方服务监控Docker镜像站的可用性和响应速度
            </p>
          </div>
        </div>
      </div>

      {/* 镜像站监控内容 */}
      <div className="p-4 md:p-6">
        {/* kentxxq镜像监控 */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-900">镜像站监控服务</h4>
              <p className="text-sm text-gray-600">实时查看各大Docker镜像站的可用性状态</p>
            </div>
            <button
              onClick={() => setShowKentxxqFrame(!showKentxxqFrame)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showKentxxqFrame ? '隐藏监控' : '显示监控'}
            </button>
          </div>

          {showKentxxqFrame && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">监控服务提供: mirror.kentxxq.com</span>
                <a
                  href="https://mirror.kentxxq.com/image"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  在新窗口打开 <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <iframe
                src="https://mirror.kentxxq.com/image"
                className="w-full h-96 border border-gray-300 rounded-lg"
                title="Docker镜像站监控"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
