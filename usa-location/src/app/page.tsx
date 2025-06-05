'use client';

import React, { useState, useMemo } from 'react';
import Header from '../shared/components/Layout/Header';
import ToolCard from '../shared/components/ToolCard';
import SearchBar from '../shared/components/SearchBar';
import SidebarNewsPanel from '../shared/components/SidebarNewsPanel';
import { NewToolNotification } from '../shared/components/NewToolNotification';
import { EnhancedSearch } from '../shared/components/EnhancedSearch';
import { FavoriteToolsList } from '../shared/components/FavoriteButton';
import { RecentlyUsed, UsageStats } from '../shared/components/RecentlyUsed';
import { useUserPreferences } from '../shared/contexts/UserPreferencesContext';
import { useKeyboardShortcuts, createDefaultShortcuts } from '../shared/hooks/useKeyboardShortcuts';
import { tools, categories } from '../data/tools';
import { searchTools, getSearchSuggestions } from '../shared/utils/searchUtils';
import {
  Wrench,
  Sparkles,
  Users,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  Github,
  Twitter,
  Mail,
  Search as SearchIcon,
  Heart,
  History
} from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'favorites' | 'recent'>('all');

  const isSearching = searchTerm.trim().length > 0;

  const { recordToolUsage } = useUserPreferences();

  // 根据搜索词过滤工具
  const filteredTools = useMemo(() => {
    return searchTools(tools, searchTerm);
  }, [searchTerm]);

  // 获取搜索建议
  const searchSuggestions = useMemo(() => {
    return getSearchSuggestions(tools, searchTerm);
  }, [searchTerm]);

  // 增强搜索功能
  const handleEnhancedSearch = (query: string) => {
    return searchTools(tools, query).map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      href: tool.href,
      icon: tool.icon,
    }));
  };

  // 处理工具选择
  const handleToolSelect = (result: any) => {
    recordToolUsage(result.id);
    window.location.href = result.href;
  };

  // 快捷键设置
  useKeyboardShortcuts({
    shortcuts: createDefaultShortcuts({
      openSearch: () => setIsSearchModalOpen(true),
      closeModal: () => setIsSearchModalOpen(false),
    }),
  });

  const activeTools = filteredTools.filter(tool => tool.status === 'active');
  const comingSoonTools = filteredTools.filter(tool => tool.status === 'coming-soon');

  // 是否有搜索结果
  const hasSearchResults = filteredTools.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      {/* 头部导航 */}
      <Header />

      {/* 侧边栏新闻面板 */}
      <SidebarNewsPanel maxItems={15} />

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 欢迎区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Wrench className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            欢迎使用
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              开发者工具箱
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            集成多种实用开发工具的现代化工具集合，为开发者和创作者提供高效便捷的解决方案
          </p>

          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeTools.length}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">可用工具</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-orange-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{comingSoonTools.length}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">即将推出</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">免费使用</p>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
              <SearchIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">快速查找工具</h2>
            <p className="text-gray-600 dark:text-gray-300">输入关键词搜索您需要的工具，或按 Ctrl+K 快速搜索</p>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            suggestions={searchSuggestions}
            placeholder="搜索工具名称、功能、分类... (Ctrl+K)"
          />
        </div>



        {/* 个性化区域 */}
        {!isSearching && (
          <div className="mb-8">
            {/* 区域切换标签 */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
                <button
                  onClick={() => setActiveSection('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  全部工具
                </button>
                <button
                  onClick={() => setActiveSection('favorites')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                    activeSection === 'favorites'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>收藏工具</span>
                </button>
                <button
                  onClick={() => setActiveSection('recent')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                    activeSection === 'recent'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>最近使用</span>
                </button>
              </div>
            </div>

            {/* 收藏工具区域 */}
            {activeSection === 'favorites' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">收藏的工具</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">您收藏的常用工具</p>
                    </div>
                  </div>
                  <FavoriteToolsList
                    tools={tools}
                    onToolClick={(toolId) => {
                      const tool = tools.find(t => t.id === toolId);
                      if (tool) {
                        recordToolUsage(toolId);
                        window.location.href = tool.href;
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* 最近使用区域 */}
            {activeSection === 'recent' && (
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <History className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">最近使用</h2>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">您最近使用的工具</p>
                        </div>
                      </div>
                      <RecentlyUsed
                        tools={tools}
                        onToolClick={(toolId) => {
                          const tool = tools.find(t => t.id === toolId);
                          if (tool) {
                            recordToolUsage(toolId);
                            window.location.href = tool.href;
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <UsageStats />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 搜索结果提示 */}
        {isSearching && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
              <SearchIcon className="h-4 w-4" />
              <span>
                {hasSearchResults
                  ? `找到 ${filteredTools.length} 个相关工具`
                  : '未找到相关工具'
                }
              </span>
            </div>
          </div>
        )}

        {/* 工具展示区域 */}
        {!isSearching || hasSearchResults ? (
          <div className="space-y-8">
            {/* 可用工具 */}
            {activeTools.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {isSearching ? '搜索结果 - 可用工具' : '可用工具'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {isSearching ? `找到 ${activeTools.length} 个可用工具` : '立即使用这些强大的工具'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* 即将推出的工具 */}
            {comingSoonTools.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {isSearching ? '搜索结果 - 即将推出' : '即将推出'}
                      </h2>
                      <p className="text-gray-600">
                        {isSearching ? `找到 ${comingSoonTools.length} 个即将推出的工具` : '敬请期待更多实用工具'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comingSoonTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* 特色介绍 - 只在非搜索状态或搜索有结果时显示 */}
            {(!isSearching || hasSearchResults) && (
              <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">为什么选择开发者工具箱？</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    我们致力于为开发者和创作者提供最优质的工具体验
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">高效便捷</h3>
                    <p className="text-gray-600 text-sm">
                      简洁直观的界面设计，让您快速上手，提升工作效率
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-3">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">完全免费</h3>
                    <p className="text-gray-600 text-sm">
                      所有工具完全免费使用，无需注册，无使用限制
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-3">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">持续更新</h3>
                    <p className="text-gray-600 text-sm">
                      根据用户反馈持续优化，定期推出新功能和工具
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        ) : (
          /* 空搜索结果 */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-6">
              <SearchIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">未找到相关工具</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              抱歉，没有找到与 &ldquo;<span className="font-medium text-gray-900">{searchTerm}</span>&rdquo; 相关的工具。
              <br />请尝试其他关键词或浏览所有工具。
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <span>清空搜索</span>
            </button>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 主要页脚内容 */}
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 产品信息 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Wrench className="h-6 w-6 text-blue-400" />
                  <h3 className="text-lg font-semibold">开发者工具箱</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  集成多种实用开发工具的现代化工具集合，为开发者和创作者提供高效便捷的解决方案。
                </p>
                <div className="flex space-x-3">
                  <a href="https://github.com/MysEon/ToolsBox" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* 工具分类 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">工具分类</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {categories.map((category) => (
                    <li key={category} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>{category}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 法律声明 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  <span>使用说明</span>
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    所有工具完全免费使用，无需注册。
                  </p>
                  <p>
                    生成的虚拟数据仅供测试和开发使用。
                  </p>
                  <p className="text-yellow-300">
                    ⚠️ 请遵守相关法律法规，合理使用工具
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部版权信息 */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2024 开发者工具箱. 保留所有权利.
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  隐私政策
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  使用条款
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  联系我们
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 新工具通知 */}
      <NewToolNotification />

      {/* 增强搜索模态框 */}
      <EnhancedSearch
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleEnhancedSearch}
        onSelectResult={handleToolSelect}
      />
    </div>
  );
}
