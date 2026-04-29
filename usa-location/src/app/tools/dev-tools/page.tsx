'use client';

import { useState } from 'react';
import { Search, Container } from 'lucide-react';
import { devTools, categories, getToolsByCategory } from '@/tools/dev-tools/data/devTools';
import { DevToolCard } from '@/tools/dev-tools/components/DevToolCard';
import { CategoryFilter } from '@/shared/components/CategoryFilter';
import { DockerCenter } from '@/tools/dev-tools/components/DockerCenter';
import ToolPageHeader from '@/shared/components/ToolPageHeader';
import EmptyState from '@/shared/components/EmptyState';

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

  if (showDockerCenter) {
    return <DockerCenter onBack={() => setShowDockerCenter(false)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ToolPageHeader
        title="编程软件下载中心"
        subtitle="汇聚常见编程开发工具的官方下载地址和安装教程"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Docker center entry */}
        <div className="mb-8">
          <div className="bg-zinc-900 dark:bg-zinc-800 rounded-xl p-4 md:p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="bg-white/10 rounded-lg p-2 md:p-3">
                  <Container className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold">Docker 中心</h3>
                  <p className="text-zinc-400 mt-1 text-sm md:text-base">
                    <span className="hidden sm:inline">镜像站监控 · 容器管理 · 配置助手 · 工具下载</span>
                    <span className="sm:hidden">容器化开发一站式平台</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDockerCenter(true)}
                className="w-full sm:w-auto bg-white text-zinc-900 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-zinc-100 transition-colors text-sm md:text-base"
              >
                进入 Docker 中心
              </button>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <input
              type="text"
              placeholder="搜索工具名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <CategoryFilter
            categories={['全部', ...categories]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Tool grid */}
        <div className="space-y-12">
          {Object.entries(toolsByCategory).map(([category, tools]) => {
            if (tools.length === 0) return null;
            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{category}</h2>
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tools.length} 个工具
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map(tool => <DevToolCard key={tool.id} tool={tool} />)}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <EmptyState
            icon={Search}
            title="未找到相关工具"
            description="尝试调整搜索关键词或选择不同的分类"
          />
        )}

        {/* Usage guide */}
        <div className="mt-16 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">官方下载</h4>
              <p>所有下载链接均指向软件官方网站，确保安全可靠。建议从官方渠道下载以获得最新版本和安全保障。</p>
            </div>
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">安装教程</h4>
              <p>每个工具都提供了官方文档链接，包含详细的安装步骤和使用指南。</p>
            </div>
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">许可证说明</h4>
              <p>
                <span className="inline-block px-2 py-1 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-2">免费</span>
                <span className="inline-block px-2 py-1 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-2">免费增值</span>
                <span className="inline-block px-2 py-1 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">付费</span>
              </p>
            </div>
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">更新频率</h4>
              <p>工具信息定期更新，版本号和下载链接保持最新状态。如发现过期信息请及时反馈。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
