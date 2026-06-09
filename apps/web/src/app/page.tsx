'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/shared/components/Header';
import ToolCard from '@/shared/components/ToolCard';
import SidebarNewsPanel from '@/shared/components/SidebarNewsPanel';
import { NewToolNotification } from '@/shared/components/NewToolNotification';
import { EnhancedSearch } from '@/shared/components/EnhancedSearch';
import { FavoriteToolsList } from '@/shared/components/FavoriteButton';
import { RecentlyUsed, UsageStats } from '@/shared/components/RecentlyUsed';
import { StatsCollapsiblePanel, InfoCollapsiblePanel } from '@/shared/components/CollapsiblePanel';
import { LayoutSettings, LayoutSettingsButton } from '@/shared/components/LayoutSettings';
import { StorageManager } from '@/shared/components/StorageManager';
import TranslationSettings from '@/shared/components/TranslationSettings';
import Footer from '@/shared/components/Footer';
import EmptyState from '@/shared/components/EmptyState';
import SearchBar from '@/shared/components/SearchBar';
import { useUserPreferences } from '@/shared/contexts/UserPreferencesContext';
import { useKeyboardShortcuts, createDefaultShortcuts } from '@/shared/hooks/useKeyboardShortcuts';
import { tools, categories } from '@/shared/data/tools';
import { searchTools, getSearchSuggestions } from '@/shared/utils/searchUtils';
import {
  TrendingUp,
  Star,
  Users,
  Clock,
  CheckCircle,
  Heart,
  History,
  Database,
  Languages,
  Search as SearchIcon,
} from 'lucide-react';

// Predefined grid classes — avoids JIT-breaking dynamic class generation
const gridColClasses: Record<string, string> = {
  compact_auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3',
  compact_3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3',
  compact_4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3',
  compact_5: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3',
  compact_6: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3',
  standard_auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6',
  standard_3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6',
  standard_4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  standard_5: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6',
  standard_6: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6',
  spacious_auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8',
  spacious_3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8',
  spacious_4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8',
  spacious_5: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8',
  spacious_6: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8',
};

const containerClasses: Record<string, string> = {
  compact: 'w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6',
  standard: 'w-[80%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8',
  spacious: 'w-[70%] max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12',
};

const spacingClasses: Record<string, string> = {
  compact: 'space-y-4',
  standard: 'space-y-8',
  spacious: 'space-y-12',
};

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'favorites' | 'recent'>('all');
  const [isLayoutSettingsOpen, setIsLayoutSettingsOpen] = useState(false);
  const [isStorageManagerOpen, setIsStorageManagerOpen] = useState(false);
  const [isTranslationSettingsOpen, setIsTranslationSettingsOpen] = useState(false);

  const isSearching = searchTerm.trim().length > 0;
  const { preferences, recordToolUsage, updateLayoutSettings } = useUserPreferences();

  const filteredTools = useMemo(() => searchTools(tools, searchTerm), [searchTerm]);
  const searchSuggestions = useMemo(() => getSearchSuggestions(tools, searchTerm), [searchTerm]);

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

  const handleToolSelect = (result: any) => {
    recordToolUsage(result.id);

    if (/^https?:\/\//.test(result.href)) {
      window.open(result.href, '_blank', 'noopener,noreferrer');
      return;
    }

    router.push(result.href);
  };

  useKeyboardShortcuts({
    shortcuts: createDefaultShortcuts({
      openSearch: () => setIsSearchModalOpen(true),
      closeModal: () => setIsSearchModalOpen(false),
    }),
  });

  const favoriteToolIds = preferences.favoriteTools;
  const favoriteTools = tools.filter(tool => favoriteToolIds.includes(tool.id) && tool.status === 'active');
  const activeTools = filteredTools.filter(tool => tool.status === 'active');
  const visibleActiveTools = isSearching
    ? activeTools
    : activeTools.filter(tool => !favoriteToolIds.includes(tool.id));
  const comingSoonTools = filteredTools.filter(tool => tool.status === 'coming-soon');
  const hasSearchResults = filteredTools.length > 0;

  const { density, gridColumns } = preferences.layout;
  const gridKey = `${density}_${gridColumns}`;
  const gridClass = gridColClasses[gridKey] || gridColClasses.standard_auto;

  return (
    <div className="min-h-screen tb-app-bg transition-colors duration-300 relative">
      <div className="tb-atmosphere" aria-hidden="true" />
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchSuggestions={searchSuggestions}
        onMobileSearchClick={() => setIsSearchModalOpen(true)}
      />

      <SidebarNewsPanel maxItems={15} />

      <main className={containerClasses[density] || containerClasses.standard}>
        {/* Compact command bar */}
        <div className="mb-8 pt-5">
          <div className="tb-glass-strong rounded-3xl px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 xl:max-w-md">
                <div className="tb-section-kicker mb-2">
                  TOOLSBOX · LOCAL-FIRST · FREE
                </div>
                <h1 className="tb-gradient-text text-2xl sm:text-3xl font-bold tracking-tight">
                  开发者工具箱
                </h1>
                <p className="mt-1 text-sm text-[var(--tb-text-muted)] leading-relaxed">
                  {tools.filter(t => t.status === 'active').length} 个可用工具 · {categories.length} 个分类 · 本地优先
                </p>
              </div>

              <div className="flex-1 xl:max-w-xl">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  suggestions={searchSuggestions}
                  placeholder="搜索工具、分类、功能..."
                />
              </div>

              <div className="flex shrink-0 items-center gap-1 xl:justify-end">
                <button
                  onClick={() => setIsTranslationSettingsOpen(true)}
                  className="tb-toolbar-btn"
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span>翻译</span>
                </button>
                <button
                  onClick={() => setIsStorageManagerOpen(true)}
                  className="tb-toolbar-btn"
                >
                  <Database className="h-3.5 w-3.5" />
                  <span>存储</span>
                </button>
                <div className="tb-toolbar-btn">
                  <LayoutSettingsButton onClick={() => setIsLayoutSettingsOpen(true)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section tabs */}
        {!isSearching && (
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="tb-segmented">
                <button
                  onClick={() => setActiveSection('all')}
                  className={`tb-segmented-item ${activeSection === 'all' ? 'active' : ''}`}
                >
                  全部工具
                </button>
                <button
                  onClick={() => setActiveSection('favorites')}
                  className={`tb-segmented-item flex items-center space-x-1 ${activeSection === 'favorites' ? 'active' : ''}`}
                >
                  <Heart className="h-4 w-4" />
                  <span>收藏工具</span>
                </button>
                <button
                  onClick={() => setActiveSection('recent')}
                  className={`tb-segmented-item flex items-center space-x-1 ${activeSection === 'recent' ? 'active' : ''}`}
                >
                  <History className="h-4 w-4" />
                  <span>最近使用</span>
                </button>
              </div>
            </div>

            {activeSection === 'favorites' && (
              <div className="max-w-4xl mx-auto">
                <div className="tb-glass-strong rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-[var(--tb-glow)] rounded-lg">
                      <Heart className="h-5 w-5 text-[var(--tb-accent)]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--tb-text)]">收藏的工具</h2>
                      <p className="text-sm text-[var(--tb-text-muted)]">您收藏的常用工具</p>
                    </div>
                  </div>
                  <FavoriteToolsList
                    tools={tools}
                    onToolClick={(toolId) => {
                      const tool = tools.find(t => t.id === toolId);
                      if (tool) {
                        recordToolUsage(toolId);
                        router.push(tool.href);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {activeSection === 'recent' && (
              <div className="max-w-4xl mx-auto">
                <div className="tb-glass-strong rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-[var(--tb-glow-2)] rounded-lg">
                      <History className="h-5 w-5 text-[var(--tb-accent-2)]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--tb-text)]">最近使用</h2>
                      <p className="text-sm text-[var(--tb-text-muted)]">您最近使用的工具</p>
                    </div>
                  </div>
                  <RecentlyUsed
                    tools={tools}
                    onToolClick={(toolId) => {
                      const tool = tools.find(t => t.id === toolId);
                      if (tool) {
                        recordToolUsage(toolId);
                        router.push(tool.href);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search result badge */}
        {isSearching && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 tb-pill border border-[var(--tb-border)] text-[var(--tb-text-muted)] text-sm">
              <SearchIcon className="h-4 w-4" />
              <span>{hasSearchResults ? <>找到 <span className="text-[var(--tb-accent)]">{filteredTools.length}</span> 个相关工具</> : '未找到相关工具'}</span>
            </div>
          </div>
        )}

        {/* Tool grid */}
        {!isSearching || hasSearchResults ? (
          <div className={spacingClasses[density] || spacingClasses.standard}>
            {!isSearching && favoriteTools.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[var(--tb-glow)] rounded-lg">
                      <Heart className="h-5 w-5 text-[var(--tb-accent)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--tb-text)]">收藏工具</h2>
                      <p className="text-sm text-[var(--tb-text-muted)]">优先展示您常用的工具</p>
                    </div>
                  </div>
                </div>
                <div className={gridClass}>
                  {favoriteTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {visibleActiveTools.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[var(--tb-glow-2)] rounded-lg">
                      <CheckCircle className="h-5 w-5 text-[var(--tb-accent-2)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--tb-text)]">
                        {isSearching ? '搜索结果' : '可用工具'}
                      </h2>
                      <p className="text-sm text-[var(--tb-text-muted)]">
                        {isSearching ? `找到 ${visibleActiveTools.length} 个可用工具` : '立即使用这些强大的工具'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={gridClass}>
                  {visibleActiveTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {comingSoonTools.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[var(--tb-bg-soft)] rounded-lg">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--tb-text)]">
                        {isSearching ? '搜索结果 - 即将推出' : '即将推出'}
                      </h2>
                      <p className="text-sm text-[var(--tb-text-muted)]">
                        {isSearching ? `找到 ${comingSoonTools.length} 个即将推出的工具` : '敬请期待更多实用工具'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={gridClass}>
                  {comingSoonTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {(!isSearching || hasSearchResults) && (
              <InfoCollapsiblePanel title="为什么选择开发者工具箱？" defaultExpanded={false}>
                <div className="text-center mb-6">
                  <p className="text-[var(--tb-text-muted)] max-w-2xl mx-auto">
                    我们致力于为开发者和创作者提供最优质的工具体验
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-[var(--tb-glow)] rounded-full mb-3">
                      <TrendingUp className="h-5 w-5 text-[var(--tb-accent)]" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--tb-text)] mb-2">高效便捷</h3>
                    <p className="text-sm text-[var(--tb-text-muted)]">简洁直观的界面设计，让您快速上手，提升工作效率</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-[var(--tb-glow-2)] rounded-full mb-3">
                      <Star className="h-5 w-5 text-[var(--tb-accent-2)]" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--tb-text)] mb-2">完全免费</h3>
                    <p className="text-sm text-[var(--tb-text-muted)]">所有工具完全免费使用，无需注册，无使用限制</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-[var(--tb-glow)] rounded-full mb-3">
                      <Users className="h-5 w-5 text-[var(--tb-accent)]" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--tb-text)] mb-2">持续更新</h3>
                    <p className="text-sm text-[var(--tb-text-muted)]">根据用户反馈持续优化，定期推出新功能和工具</p>
                  </div>
                </div>
              </InfoCollapsiblePanel>
            )}

            {(!isSearching || hasSearchResults) && (
              <div className="mt-8">
                <StatsCollapsiblePanel title="使用统计" defaultExpanded={false} className="max-w-md mx-auto">
                  <UsageStats />
                </StatsCollapsiblePanel>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={SearchIcon}
            title="未找到相关工具"
            description={`抱歉，没有找到与 "${searchTerm}" 相关的工具。请尝试其他关键词或浏览所有工具。`}
            action={
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[var(--tb-accent)] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
              >
                清空搜索
              </button>
            }
          />
        )}
      </main>

      <Footer categories={categories} />

      <NewToolNotification />

      <EnhancedSearch
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleEnhancedSearch}
        onSelectResult={handleToolSelect}
      />

      <LayoutSettings
        isOpen={isLayoutSettingsOpen}
        onClose={() => setIsLayoutSettingsOpen(false)}
        layoutDensity={preferences.layout.density}
        gridColumns={preferences.layout.gridColumns}
        onLayoutDensityChange={(density) => updateLayoutSettings({ density })}
        onGridColumnsChange={(gridColumns) => updateLayoutSettings({ gridColumns })}
      />

      <StorageManager isOpen={isStorageManagerOpen} onClose={() => setIsStorageManagerOpen(false)} />

      <TranslationSettings isOpen={isTranslationSettingsOpen} onClose={() => setIsTranslationSettingsOpen(false)} />
    </div>
  );
}
