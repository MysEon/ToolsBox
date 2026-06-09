'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';
import { CustomContainer, ContainerCheckResult } from '../types/dockerCenter';
import { ContainerMonitor } from '../utils/containerMonitor';
import Modal from '@/shared/components/Modal';

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
    try {
      setStats(monitor.getContainerStats(container.id));
      setHistory(monitor.getContainerHistory(container.id, 20));
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [container.id]);

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'stopped': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  if (isLoading) {
    return (
      <Modal open={true} onClose={onClose} title="容器统计信息" size="md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-zinc-500 text-sm">加载统计数据...</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={true} onClose={onClose} title={container.name} size="md">
      <div className="space-y-5">
        {/* Basic info */}
        <div>
          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">基本信息</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-zinc-500">服务器:</span><span className="ml-2 font-medium text-zinc-900 dark:text-zinc-100">{container.serverName}</span></div>
            <div><span className="text-zinc-500">容器:</span><span className="ml-2 font-medium text-zinc-900 dark:text-zinc-100">{container.containerName}</span></div>
            <div><span className="text-zinc-500">URL:</span><span className="ml-2 font-medium text-zinc-900 dark:text-zinc-100">{container.url}</span></div>
            <div><span className="text-zinc-500">协议:</span><span className="ml-2 font-medium text-zinc-900 dark:text-zinc-100">{container.protocol.toUpperCase()}</span></div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">统计数据</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.totalChecks}</div>
                <div className="text-xs text-zinc-500">总检查次数</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{stats.successRate.toFixed(1)}%</div>
                <div className="text-xs text-zinc-500">成功率</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{Math.round(stats.averageResponseTime)}ms</div>
                <div className="text-xs text-zinc-500">平均响应时间</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {stats.lastCheck ? formatTime(stats.lastCheck) : '未检查'}
                </div>
                <div className="text-xs text-zinc-500">最后检查</div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            检查历史 (最近20次)
          </h4>
          {history.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <BarChart3 className="h-10 w-10 mx-auto mb-3" />
              <p className="text-sm">暂无检查历史</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {history.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {record.status === 'running' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                        {record.status === 'running' ? '运行中' : '停止'}
                      </span>
                      <span className="text-xs text-zinc-400 ml-2">{formatTime(new Date(record.timestamp))}</span>
                      {record.error && <div className="text-xs text-red-500 mt-1">错误: {record.error}</div>}
                    </div>
                  </div>
                  <div className="text-right text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {Math.round(record.responseTime)}ms
                    {index === 0 && <div className="text-xs text-zinc-400">最新</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {container.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">标签</h4>
            <div className="flex flex-wrap gap-1.5">
              {container.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
