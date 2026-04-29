'use client';

import { useState, useMemo, useEffect } from 'react';
import { GraduationCap, Star, Heart, Plus } from 'lucide-react';
import { useUserPreferences } from '@/shared/contexts/UserPreferencesContext';
import { academicResources, categories, AcademicResource } from '@/tools/academic-center/data/academicResources';
import { AcademicResourceCard } from '@/tools/academic-center/components/AcademicResourceCard';
import { CategoryFilter } from '@/shared/components/CategoryFilter';
import { SearchBar } from '@/tools/academic-center/components/SearchBar';
import ToolPageHeader from '@/shared/components/ToolPageHeader';
import EmptyState from '@/shared/components/EmptyState';
import { AddCustomResourceModal } from '@/tools/academic-center/components/AddCustomResourceModal';
import { EditCustomResourceModal } from '@/tools/academic-center/components/EditCustomResourceModal';
import { customResourceStorage } from '@/tools/academic-center/utils/customResourceStorage';

export default function AcademicCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [customResources, setCustomResources] = useState<AcademicResource[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { preferences } = useUserPreferences();

  useEffect(() => { loadCustomResources(); }, []);

  const loadCustomResources = async () => {
    try {
      const resources = await customResourceStorage.getAllCustomResources();
      setCustomResources(resources);
    } catch (error) {
      console.error('Failed to load custom resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allResources = useMemo(() => [...academicResources, ...customResources], [customResources]);

  const allCategories = useMemo(() => {
    const categorySet = new Set([...categories]);
    customResources.forEach(r => categorySet.add(r.category));
    return Array.from(categorySet);
  }, [customResources]);

  const handleAddSuccess = () => { loadCustomResources(); };
  const handleEditResource = (resourceId: string) => { setEditingResourceId(resourceId); setIsEditModalOpen(true); };
  const handleEditSuccess = () => { loadCustomResources(); };

  const filteredResources = useMemo(() => {
    let filtered = allResources;
    if (showFavoritesOnly) {
      filtered = filtered.filter(r => preferences.favoriteTools.includes(`academic-${r.id}`));
    }
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        r.features.some(f => f.toLowerCase().includes(term)) ||
        r.tags.some(t => t.toLowerCase().includes(term))
      );
    }
    return filtered;
  }, [searchTerm, selectedCategory, showFavoritesOnly, preferences.favoriteTools, allResources]);

  const resourcesByCategory = useMemo(() => {
    if (selectedCategory !== '全部') return { [selectedCategory]: filteredResources };
    const grouped: Record<string, AcademicResource[]> = {};
    allCategories.forEach(cat => {
      const catResources = filteredResources.filter(r => r.category === cat);
      if (catResources.length > 0) grouped[cat] = catResources;
    });
    return grouped;
  }, [filteredResources, selectedCategory]);

  const headerActions = (
    <>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
      >
        <Plus className="h-4 w-4" />
        <span>添加自定义资源</span>
      </button>
      <div className="hidden sm:flex items-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>共 {allResources.length} 个资源</span>
          {customResources.length > 0 && (
            <span className="text-purple-500">({customResources.length} 个自定义)</span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Heart className="h-4 w-4 text-red-500" />
          <span>已收藏 {preferences.favoriteTools.filter(id => id.startsWith('academic-')).length} 个</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ToolPageHeader
        title="学术中心"
        subtitle="汇聚计算机科学领域的权威学术资源和研究工具"
        actions={headerActions}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="搜索学术资源、功能或标签..."
            />
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                showFavoritesOnly
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>{showFavoritesOnly ? '显示全部' : '仅显示收藏'}</span>
            </button>
          </div>
          <CategoryFilter
            categories={['全部', ...allCategories]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Search stats */}
        {(searchTerm || selectedCategory !== '全部' || showFavoritesOnly) && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 text-sm font-medium">
              <GraduationCap className="h-4 w-4" />
              <span>
                {showFavoritesOnly && '收藏筛选 '}
                {searchTerm && `搜索 "${searchTerm}" `}
                {selectedCategory !== '全部' && `分类 "${selectedCategory}" `}
                找到 {filteredResources.length} 个资源
              </span>
            </div>
          </div>
        )}

        {/* Resource grid */}
        {Object.keys(resourcesByCategory).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(resourcesByCategory).map(([category, resources]) => {
              if (resources.length === 0) return null;
              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{category}</h2>
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {resources.length} 个资源
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {resources.map(resource => (
                      <AcademicResourceCard
                        key={resource.id}
                        resource={resource}
                        onEdit={resource.isCustom ? handleEditResource : undefined}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={showFavoritesOnly ? Heart : GraduationCap}
            title={showFavoritesOnly ? '还没有收藏的学术资源' : '未找到匹配的资源'}
            description={showFavoritesOnly ? '点击资源卡片上的收藏按钮来收藏常用的学术资源' : '尝试调整搜索关键词或选择不同的分类'}
            action={showFavoritesOnly ? (
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
              >
                浏览全部资源
              </button>
            ) : undefined}
          />
        )}

        {/* Tips */}
        <div className="mt-16 p-6 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="text-center">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">使用提示</h3>
            <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              <p><strong>访问资源：</strong>点击"访问资源"按钮将在新窗口中打开对应的学术平台。</p>
              <p><strong>收藏功能：</strong>点击资源卡片右上角的收藏按钮收藏常用资源，使用"仅显示收藏"快速筛选。</p>
              <p><strong>访问说明：</strong>部分资源可能需要机构订阅或注册账号才能完整访问。</p>
            </div>
          </div>
        </div>
      </div>

      <AddCustomResourceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />
      <EditCustomResourceModal
        isOpen={isEditModalOpen}
        resourceId={editingResourceId}
        onClose={() => { setIsEditModalOpen(false); setEditingResourceId(null); }}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
