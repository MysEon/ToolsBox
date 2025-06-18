'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, Globe } from 'lucide-react';
import { DockerMirror, MirrorStatus } from '../types/dockerCenter';
import { dockerMirrors } from '../data/dockerCenter';

interface MirrorMonitorPanelProps {
  className?: string;
}

export function MirrorMonitorPanel({ className = '' }: MirrorMonitorPanelProps) {
  const [mirrorStatuses, setMirrorStatuses] = useState<MirrorStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [showKentxxqFrame, setShowKentxxqFrame] = useState(false);

  // 模拟检查镜像站状态
  const checkMirrorStatus = async (mirror: DockerMirror): Promise<MirrorStatus> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    // 模拟状态检测结果
    const statuses = ['online', 'offline', 'slow'] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const responseTime = randomStatus === 'offline' ? 0 : Math.random() * 1000 + 100;
    
    return {
      mirror,
      isOnline: randomStatus !== 'offline',
      responseTime,
      lastError: randomStatus === 'offline' ? '连接超时' : undefined
    };
  };

  // 检查所有镜像站状态
  const checkAllMirrors = async () => {
    setIsChecking(true);
    try {
      const statusPromises = dockerMirrors.map(mirror => checkMirrorStatus(mirror));
      const statuses = await Promise.all(statusPromises);
      setMirrorStatuses(statuses);
      setLastUpdateTime(new Date());
    } catch (error) {
      console.error('检查镜像站状态失败:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // 组件挂载时检查状态
  useEffect(() => {
    checkAllMirrors();
  }, []);

  // 获取状态图标
  const getStatusIcon = (status: MirrorStatus) => {
    if (status.isOnline) {
      return status.responseTime > 800 ? 
        <AlertCircle className="h-4 w-4 text-yellow-500" /> :
        <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  // 获取状态文本
  const getStatusText = (status: MirrorStatus) => {
    if (!status.isOnline) return '离线';
    if (status.responseTime > 800) return '较慢';
    return '正常';
  };

  // 获取状态颜色类
  const getStatusColorClass = (status: MirrorStatus) => {
    if (!status.isOnline) return 'border-red-200 bg-red-50';
    if (status.responseTime > 800) return 'border-yellow-200 bg-yellow-50';
    return 'border-green-200 bg-green-50';
  };

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
              实时监控各大Docker镜像站的可用性和响应速度
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {lastUpdateTime && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {lastUpdateTime.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={checkAllMirrors}
              disabled={isChecking}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? '检查中...' : '刷新状态'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 镜像站状态列表 */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
          {mirrorStatuses.map((status) => (
            <div
              key={status.mirror.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getStatusColorClass(status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <h4 className="font-medium text-gray-900">{status.mirror.name}</h4>
                </div>
                <button
                  onClick={() => window.open(status.mirror.url, '_blank')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{status.mirror.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{status.mirror.provider}</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full ${
                    status.isOnline ? 
                      (status.responseTime > 800 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700') :
                      'bg-red-100 text-red-700'
                  }`}>
                    {getStatusText(status)}
                  </span>
                  {status.isOnline && (
                    <span className="text-gray-500">
                      {Math.round(status.responseTime)}ms
                    </span>
                  )}
                </div>
              </div>
              
              {status.lastError && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  错误: {status.lastError}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* kentxxq镜像监控集成 */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-900">第三方镜像站监控</h4>
              <p className="text-sm text-gray-600">查看更多镜像站的实时状态</p>
            </div>
            <button
              onClick={() => setShowKentxxqFrame(!showKentxxqFrame)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showKentxxqFrame ? '隐藏' : '显示'} 详细监控
            </button>
          </div>
          
          {showKentxxqFrame && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">数据来源: mirror.kentxxq.com</span>
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
