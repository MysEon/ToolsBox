'use client';

import { useState } from 'react';
import { ArrowLeft, Search, Filter, ExternalLink, Download, Star, Container } from 'lucide-react';
import Link from 'next/link';
import { devTools, categories, getToolsByCategory, getLicenseColor } from '@/tools/dev-tools/data/devTools';
import { DevToolCard } from '@/tools/dev-tools/components/DevToolCard';
import { CategoryFilter } from '@/tools/dev-tools/components/CategoryFilter';
import { DockerCenter } from '@/tools/dev-tools/components/DockerCenter';

export default function DevToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDockerCenter, setShowDockerCenter] = useState(false);

  const filteredTools = devTools.filter(tool => {
    const matchesCategory = selectedCategory === '全部' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toolsByCategory = selectedCategory === '全部' 
    ? categories.reduce((acc, category) => {
        acc[category] = getToolsByCategory(category).filter(tool => 
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return acc;
      }, {} as Record<string, typeof devTools>)
    : { [selectedCategory]: filteredTools };

  // 如果显示Docker中心，渲染Docker中心组件
  if (showDockerCenter) {
    return <DockerCenter onBack={() => setShowDockerCenter(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回首页
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">💻 编程软件下载中心</h1>
                <p className="text-gray-600 mt-1">汇聚常见编程开发工具的官方下载地址和安装教程</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>共 {devTools.length} 个工具</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Docker中心入口 */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 md:p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-2 md:p-3">
                  <Container className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold">🐳 Docker中心</h3>
                  <p className="text-blue-100 mt-1 text-sm md:text-base">
                    <span className="hidden sm:inline">镜像站监控 • 容器管理 • 配置助手 • 工具下载</span>
                    <span className="sm:hidden">容器化开发一站式平台</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDockerCenter(true)}
                className="w-full sm:w-auto bg-white text-blue-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm md:text-base"
              >
                进入Docker中心
              </button>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-8 space-y-4">
          {/* 搜索框 */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索工具名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 分类筛选 */}
          <CategoryFilter
            categories={['全部', ...categories]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* 工具展示 */}
        <div className="space-y-12">
          {Object.entries(toolsByCategory).map(([category, tools]) => {
            if (tools.length === 0) return null;
            
            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {tools.length} 个工具
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((tool) => (
                    <DevToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关工具</h3>
            <p className="text-gray-600">尝试调整搜索关键词或选择不同的分类</p>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📖 使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🔗 官方下载</h4>
              <p>所有下载链接均指向软件官方网站，确保安全可靠。建议从官方渠道下载以获得最新版本和安全保障。</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">📚 安装教程</h4>
              <p>每个工具都提供了官方文档链接，包含详细的安装步骤和使用指南。</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">💡 许可证说明</h4>
              <p>
                <span className="inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-600 mr-2">免费</span>
                <span className="inline-block px-2 py-1 rounded text-xs bg-blue-100 text-blue-600 mr-2">免费增值</span>
                <span className="inline-block px-2 py-1 rounded text-xs bg-orange-100 text-orange-600">付费</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🔄 更新频率</h4>
              <p>工具信息定期更新，版本号和下载链接保持最新状态。如发现过期信息请及时反馈。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
