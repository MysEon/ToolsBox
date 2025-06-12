'use client';

import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Star, Heart, Plus } from 'lucide-react';
import Link from 'next/link';
import { useUserPreferences } from '@/shared/contexts/UserPreferencesContext';
import { academicResources, categories, getResourcesByCategory, AcademicResource } from '@/tools/academic-center/data/academicResources';
import { AcademicResourceCard } from '@/tools/academic-center/components/AcademicResourceCard';
import { CategoryFilter } from '@/tools/academic-center/components/CategoryFilter';
import { SearchBar } from '@/tools/academic-center/components/SearchBar';
import { AddCustomResourceModal } from '../../../tools/academic-center/components/AddCustomResourceModal';
import { EditCustomResourceModal } from '../../../tools/academic-center/components/EditCustomResourceModal';
import { customResourceStorage } from '../../../tools/academic-center/utils/customResourceStorage';

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

  // 加载自定义资源
  useEffect(() => {
    loadCustomResources();
  }, []);

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

  // 合并预设资源和自定义资源
  const allResources = useMemo(() => {
    return [...academicResources, ...customResources];
  }, [customResources]);

  // 获取所有分类（包括自定义资源的分类）
  const allCategories = useMemo(() => {
    const categorySet = new Set([...categories]);
    customResources.forEach(resource => {
      categorySet.add(resource.category);
    });
    return Array.from(categorySet);
  }, [customResources]);

  // 处理自定义资源操作
  const handleAddSuccess = () => {
    loadCustomResources();
  };

  const handleEditResource = (resourceId: string) => {
    setEditingResourceId(resourceId);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    loadCustomResources();
  };

  // 过滤资源
  const filteredResources = useMemo(() => {
    let filtered = allResources;

    // 按收藏筛选
    if (showFavoritesOnly) {
      filtered = filtered.filter(resource =>
        preferences.favoriteTools.includes(`academic-${resource.id}`)
      );
    }

    // 按分类筛选
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // 按搜索词筛选
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term) ||
        resource.features.some(feature => feature.toLowerCase().includes(term)) ||
        resource.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory, showFavoritesOnly, preferences.favoriteTools, allResources]);

  // 按分类组织资源
  const resourcesByCategory = useMemo(() => {
    if (selectedCategory !== '全部') {
      return { [selectedCategory]: filteredResources };
    }

    const grouped: Record<string, AcademicResource[]> = {};
    allCategories.forEach(category => {
      const categoryResources = filteredResources.filter(resource => resource.category === category);
      if (categoryResources.length > 0) {
        grouped[category] = categoryResources;
      }
    });
    return grouped;
  }, [filteredResources, selectedCategory]);

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
                <h1 className="text-3xl font-bold text-gray-900">🎓 学术中心</h1>
                <p className="text-gray-600 mt-1">汇聚计算机科学领域的权威学术资源和研究工具</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>添加自定义资源</span>
              </button>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>共 {allResources.length} 个资源</span>
                  {customResources.length > 0 && (
                    <span className="text-purple-600">({customResources.length} 个自定义)</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>已收藏 {preferences.favoriteTools.filter(id => id.startsWith('academic-')).length} 个</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选 */}
        <div className="mb-8 space-y-4">
          {/* 搜索框 */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="搜索学术资源、功能或标签..."
            />

            {/* 收藏筛选按钮 */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showFavoritesOnly
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>{showFavoritesOnly ? '显示全部' : '仅显示收藏'}</span>
            </button>
          </div>

          {/* 分类筛选 */}
          <CategoryFilter
            categories={['全部', ...allCategories]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* 搜索结果统计 */}
        {(searchTerm || selectedCategory !== '全部' || showFavoritesOnly) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                {showFavoritesOnly && '收藏筛选 '}
                {searchTerm && `搜索 "${searchTerm}" `}
                {selectedCategory !== '全部' && `分类 "${selectedCategory}" `}
                找到 {filteredResources.length} 个资源
              </span>
            </div>
          </div>
        )}

        {/* 资源展示 */}
        {Object.keys(resourcesByCategory).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(resourcesByCategory).map(([category, resources]) => {
              if (resources.length === 0) return null;

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {resources.length} 个资源
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {resources.map((resource) => (
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
          <div className="text-center py-12">
            {showFavoritesOnly ? (
              <>
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">还没有收藏的学术资源</h3>
                <p className="text-gray-500 mb-4">
                  点击资源卡片上的 ⭐ 按钮来收藏常用的学术资源
                </p>
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  浏览全部资源
                </button>
              </>
            ) : (
              <>
                <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的资源</h3>
                <p className="text-gray-500">
                  尝试调整搜索关键词或选择不同的分类
                </p>
              </>
            )}
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-16 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">💡 使用提示</h3>
            <div className="space-y-2 text-gray-600 text-sm leading-relaxed">
              <p>
                <strong>访问资源：</strong>点击"访问资源"按钮将在新窗口中打开对应的学术平台。
              </p>
              <p>
                <strong>收藏功能：</strong>点击资源卡片右上角的 ⭐ 按钮收藏常用资源，使用"仅显示收藏"快速筛选。
              </p>
              <p>
                <strong>访问说明：</strong>部分资源可能需要机构订阅或注册账号才能完整访问。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 弹窗组件 */}
      <AddCustomResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditCustomResourceModal
        isOpen={isEditModalOpen}
        resourceId={editingResourceId}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingResourceId(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
