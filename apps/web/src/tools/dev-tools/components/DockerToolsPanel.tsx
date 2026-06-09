'use client';

import { useState } from 'react';
import { Container, ExternalLink, Download, BookOpen, Filter } from 'lucide-react';
import { DevTool, getToolsByCategory } from '../data/devTools';
import { DevToolCard } from './DevToolCard';

interface DockerToolsPanelProps {
  className?: string;
}

export function DockerToolsPanel({ className = '' }: DockerToolsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 获取容器化工具
  const dockerTools = getToolsByCategory('容器化工具');
  
  // 过滤工具
  const filteredTools = dockerTools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 工具分类
  const toolCategories = {
    '核心工具': filteredTools.filter(tool => 
      ['docker', 'docker-compose'].includes(tool.id)
    ),
    '编排管理': filteredTools.filter(tool => 
      ['kubernetes', 'portainer'].includes(tool.id)
    ),
    '镜像仓库': filteredTools.filter(tool => 
      ['harbor'].includes(tool.id)
    )
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* 头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Container className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Docker工具集合</h3>
              <p className="text-sm text-gray-600 mt-1">
                容器化开发必备工具下载和安装指南
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Container className="h-4 w-4" />
            <span>共 {dockerTools.length} 个工具</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="搜索Docker工具..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 工具分类展示 */}
        <div className="space-y-8">
          {Object.entries(toolCategories).map(([categoryName, tools]) => {
            if (tools.length === 0) return null;
            
            return (
              <div key={categoryName}>
                <div className="flex items-center space-x-3 mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{categoryName}</h4>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {tools.length} 个工具
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map((tool) => (
                    <DevToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 无结果提示 */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Container className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关工具</h3>
            <p className="text-gray-600">尝试调整搜索关键词</p>
          </div>
        )}

        {/* 使用提示 */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Container className="h-5 w-5 mr-2 text-blue-600" />
            Docker工具使用指南
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">🚀 快速开始</h5>
              <ul className="space-y-1">
                <li>• 首先安装 Docker Desktop 作为基础环境</li>
                <li>• 使用 Docker Compose 管理多容器应用</li>
                <li>• 通过 Portainer 获得可视化管理界面</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">📚 学习路径</h5>
              <ul className="space-y-1">
                <li>• 掌握 Docker 基础概念和命令</li>
                <li>• 学习编写 Dockerfile 和 docker-compose.yml</li>
                <li>• 了解 Kubernetes 容器编排</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">🔧 生产环境</h5>
              <ul className="space-y-1">
                <li>• 使用 Harbor 搭建私有镜像仓库</li>
                <li>• 配置 Kubernetes 集群进行容器编排</li>
                <li>• 实施容器安全和监控策略</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">💡 最佳实践</h5>
              <ul className="space-y-1">
                <li>• 使用多阶段构建优化镜像大小</li>
                <li>• 配置健康检查和资源限制</li>
                <li>• 实施镜像安全扫描和版本管理</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">📖 相关资源</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://docs.docker.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200"
            >
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Docker官方文档</div>
                <div className="text-sm text-gray-600">完整的Docker使用指南</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
            
            <a
              href="https://kubernetes.io/docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200"
            >
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">Kubernetes文档</div>
                <div className="text-sm text-gray-600">容器编排学习资源</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
            
            <a
              href="https://hub.docker.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200"
            >
              <Container className="h-5 w-5 text-cyan-600" />
              <div>
                <div className="font-medium text-gray-900">Docker Hub</div>
                <div className="text-sm text-gray-600">官方镜像仓库</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
