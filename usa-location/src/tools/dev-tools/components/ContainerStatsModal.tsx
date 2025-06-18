'use client';

import { useState, useEffect } from 'react';
import { X, BarChart3, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { CustomContainer, ContainerCheckResult } from '../types/dockerCenter';
import { ContainerMonitor } from '../utils/containerMonitor';

interface ContainerStatsModalProps {
  container: CustomContainer;
  onClose: () => void;
}

export function ContainerStatsModal({ container, onClose }: ContainerStatsModalProps) {
  const [stats, setStats] = useState<{
    totalChecks: number;
    successRate: number;
    averageResponseTime: number;
    lastCheck?: Date;
  } | null>(null);
  const [history, setHistory] = useState<ContainerCheckResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const monitor = ContainerMonitor.getInstance();

  useEffect(() => {
    const loadStats = () => {
      try {
        const containerStats = monitor.getContainerStats(container.id);
        const containerHistory = monitor.getContainerHistory(container.id, 20);
        
        setStats(containerStats);
        setHistory(containerHistory);
      } catch (error) {
        console.error('加载统计数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [container.id]);

  // 格式化时间
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'stopped':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // 获取响应时间颜色
  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 500) return 'text-green-600';
    if (responseTime < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">加载统计数据...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{container.name}</h3>
              <p className="text-sm text-gray-600">容器统计信息</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* 基本信息 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">基本信息</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">服务器:</span>
                <span className="ml-2 font-medium">{container.serverName}</span>
              </div>
              <div>
                <span className="text-gray-600">容器:</span>
                <span className="ml-2 font-medium">{container.containerName}</span>
              </div>
              <div>
                <span className="text-gray-600">URL:</span>
                <span className="ml-2 font-medium">{container.url}</span>
              </div>
              <div>
                <span className="text-gray-600">协议:</span>
                <span className="ml-2 font-medium">{container.protocol.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          {stats && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">统计数据</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalChecks}</div>
                  <div className="text-sm text-gray-600">总检查次数</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.successRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">成功率</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Math.round(stats.averageResponseTime)}ms
                  </div>
                  <div className="text-sm text-gray-600">平均响应时间</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-bold text-purple-600">
                    {stats.lastCheck ? formatTime(stats.lastCheck) : '未检查'}
                  </div>
                  <div className="text-sm text-gray-600">最后检查</div>
                </div>
              </div>
            </div>
          )}

          {/* 检查历史 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              检查历史 (最近20次)
            </h4>
            
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>暂无检查历史</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {record.status === 'running' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status === 'running' ? '运行中' : '停止'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(new Date(record.timestamp))}
                          </span>
                        </div>
                        {record.error && (
                          <div className="text-xs text-red-600 mt-1">
                            错误: {record.error}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getResponseTimeColor(record.responseTime)}`}>
                        {Math.round(record.responseTime)}ms
                      </div>
                      {index === 0 && (
                        <div className="text-xs text-gray-500">最新</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 标签 */}
          {container.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">标签</h4>
              <div className="flex flex-wrap gap-2">
                {container.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 关闭按钮 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
