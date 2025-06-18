'use client';

import { useState } from 'react';
import { Container, Monitor, Settings, Package, ArrowLeft } from 'lucide-react';
import { MirrorMonitorPanel } from './MirrorMonitorPanel';
import { CustomContainerPanel } from './CustomContainerPanel';
import { DockerToolsPanel } from './DockerToolsPanel';
import { QuickConfigPanel } from './QuickConfigPanel';

interface DockerCenterProps {
  onBack?: () => void;
}

type TabType = 'monitor' | 'containers' | 'tools' | 'config';

export function DockerCenter({ onBack }: DockerCenterProps) {
  const [activeTab, setActiveTab] = useState<TabType>('monitor');

  const tabs = [
    {
      id: 'monitor' as TabType,
      name: '镜像站监控',
      icon: Monitor,
      description: '实时监控Docker镜像站状态'
    },
    {
      id: 'containers' as TabType,
      name: '容器监控',
      icon: Container,
      description: '管理自定义容器服务'
    },
    {
      id: 'tools' as TabType,
      name: 'Docker工具',
      icon: Package,
      description: '容器化开发工具下载'
    },
    {
      id: 'config' as TabType,
      name: '快速配置',
      icon: Settings,
      description: '镜像源配置生成器'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'monitor':
        return <MirrorMonitorPanel />;
      case 'containers':
        return <CustomContainerPanel />;
      case 'tools':
        return <DockerToolsPanel />;
      case 'config':
        return <QuickConfigPanel />;
      default:
        return <MirrorMonitorPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <>
                  <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    返回
                  </button>
                  <div className="h-6 w-px bg-gray-300" />
                </>
              )}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                  <Container className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">🐳 Docker中心</h1>
                  <p className="text-gray-600 mt-1">容器化开发的一站式工具平台</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>镜像站监控</span>
              </div>
              <div className="flex items-center space-x-2">
                <Container className="h-4 w-4" />
                <span>容器管理</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>配置助手</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标签导航 */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap space-x-4 md:space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.split('')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* 当前标签描述 */}
          <div className="mt-4">
            <p className="text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* 标签内容 */}
        <div className="transition-all duration-300">
          {renderTabContent()}
        </div>

        {/* 底部信息 */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center">
            <Container className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Docker中心功能特色</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              集成镜像站监控、容器管理、工具下载和配置生成于一体，为容器化开发提供全方位支持
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">实时监控</h4>
              <p className="text-sm text-gray-600">监控各大Docker镜像站的可用性和响应速度</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Container className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">容器管理</h4>
              <p className="text-sm text-gray-600">管理和监控你的自定义容器服务</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">工具下载</h4>
              <p className="text-sm text-gray-600">一站式Docker相关工具下载和安装指南</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">配置助手</h4>
              <p className="text-sm text-gray-600">快速生成Docker镜像源配置文件</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
