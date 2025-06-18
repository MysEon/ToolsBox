'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, Play, Square, RefreshCw, BarChart3 } from 'lucide-react';
import { CustomContainer, ContainerStatus } from '../types/dockerCenter';
import { ContainerStorage } from '../utils/containerStorage';
import { ContainerMonitor } from '../utils/containerMonitor';
import { AddContainerModal } from './AddContainerModal';
import { EditContainerModal } from './EditContainerModal';
import { ContainerStatsModal } from './ContainerStatsModal';

interface CustomContainerPanelProps {
  className?: string;
}

export function CustomContainerPanel({ className = '' }: CustomContainerPanelProps) {
  const [containers, setContainers] = useState<CustomContainer[]>([]);
  const [containerStatuses, setContainerStatuses] = useState<ContainerStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContainer, setEditingContainer] = useState<CustomContainer | null>(null);
  const [statsContainer, setStatsContainer] = useState<CustomContainer | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const monitor = ContainerMonitor.getInstance();

  // 加载容器列表
  const loadContainers = () => {
    const loadedContainers = ContainerStorage.getContainers();
    setContainers(loadedContainers);
  };

  // 检查所有容器状态
  const checkAllContainers = async () => {
    if (containers.length === 0) return;
    
    setIsChecking(true);
    try {
      const statuses = await monitor.checkAllContainers();
      setContainerStatuses(statuses);
      setLastUpdateTime(new Date());
      loadContainers(); // 重新加载以获取更新的状态
    } catch (error) {
      console.error('检查容器状态失败:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // 删除容器
  const handleDeleteContainer = (id: string) => {
    if (confirm('确定要删除这个容器吗？')) {
      ContainerStorage.deleteContainer(id);
      loadContainers();
      // 从状态列表中移除
      setContainerStatuses(prev => prev.filter(s => s.container.id !== id));
    }
  };

  // 打开容器URL
  const handleOpenContainer = (container: CustomContainer) => {
    const url = ContainerStorage.buildContainerUrl(container);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 获取容器状态
  const getContainerStatus = (containerId: string) => {
    return containerStatuses.find(s => s.container.id === containerId);
  };

  // 获取状态显示
  const getStatusDisplay = (container: CustomContainer) => {
    const status = getContainerStatus(container.id);
    if (status) {
      return {
        text: status.isAccessible ? '运行中' : '停止',
        color: status.isAccessible ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100',
        icon: status.isAccessible ? Play : Square
      };
    }
    
    // 使用存储的状态
    switch (container.status) {
      case 'running':
        return { text: '运行中', color: 'text-green-600 bg-green-100', icon: Play };
      case 'stopped':
        return { text: '停止', color: 'text-red-600 bg-red-100', icon: Square };
      default:
        return { text: '未知', color: 'text-gray-600 bg-gray-100', icon: Square };
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadContainers();
  }, []);

  // 当容器列表变化时，检查状态
  useEffect(() => {
    if (containers.length > 0) {
      checkAllContainers();
    }
  }, [containers.length]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* 头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">自定义容器监控</h3>
            <p className="text-sm text-gray-600 mt-1">
              管理和监控你的自定义容器服务
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {lastUpdateTime && (
              <span className="text-xs text-gray-500">
                最后更新: {lastUpdateTime.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={checkAllContainers}
              disabled={isChecking || containers.length === 0}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? '检查中...' : '刷新状态'}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>添加容器</span>
            </button>
          </div>
        </div>
      </div>

      {/* 容器列表 */}
      <div className="p-4 md:p-6">
        {containers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无容器</h3>
            <p className="text-gray-600 mb-4">添加你的第一个自定义容器开始监控</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>添加容器</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {containers.map((container) => {
              const statusDisplay = getStatusDisplay(container);
              const StatusIcon = statusDisplay.icon;
              
              return (
                <div
                  key={container.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  {/* 容器头部 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="h-4 w-4 text-gray-600" />
                      <h4 className="font-medium text-gray-900 truncate">{container.name}</h4>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setStatsContainer(container)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="查看统计"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingContainer(container)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContainer(container.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* 容器信息 */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{container.description}</p>
                  
                  {/* 服务器和容器名 */}
                  <div className="text-xs text-gray-500 mb-3 space-y-1">
                    <div>服务器: {container.serverName}</div>
                    <div>容器: {container.containerName}</div>
                  </div>

                  {/* 标签 */}
                  {container.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {container.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {container.tags.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded">
                          +{container.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 状态和操作 */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                      {statusDisplay.text}
                    </span>
                    <button
                      onClick={() => handleOpenContainer(container)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>访问</span>
                    </button>
                  </div>

                  {/* 响应时间 */}
                  {getContainerStatus(container.id) && (
                    <div className="mt-2 text-xs text-gray-500">
                      响应时间: {Math.round(getContainerStatus(container.id)!.responseTime)}ms
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 模态框 */}
      {showAddModal && (
        <AddContainerModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            loadContainers();
          }}
        />
      )}

      {editingContainer && (
        <EditContainerModal
          container={editingContainer}
          onClose={() => setEditingContainer(null)}
          onSave={() => {
            setEditingContainer(null);
            loadContainers();
          }}
        />
      )}

      {statsContainer && (
        <ContainerStatsModal
          container={statsContainer}
          onClose={() => setStatsContainer(null)}
        />
      )}
    </div>
  );
}
