'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Eye } from 'lucide-react';
import { 
  CustomResourceFormData, 
  customResourceStorage 
} from '../utils/customResourceStorage';
import { 
  customResourceIcons, 
  customResourceColors, 
  categories,
  getIconComponent 
} from '../data/academicResources';

interface CustomResourceFormProps {
  initialData?: Partial<CustomResourceFormData>;
  onSubmit: (data: CustomResourceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function CustomResourceForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  submitLabel = '添加资源'
}: CustomResourceFormProps) {
  const [formData, setFormData] = useState<CustomResourceFormData>({
    name: '',
    description: '',
    url: '',
    category: '文献检索',
    accessType: 'Free',
    language: 'Chinese',
    iconName: 'Search',
    color: 'from-blue-500 to-indigo-600',
    features: [''],
    tags: [''],
    ...initialData
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPreview, setShowPreview] = useState(false);

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入资源名称';
    }

    if (!formData.description.trim()) {
      newErrors.description = '请输入资源描述';
    }

    if (!formData.url.trim()) {
      newErrors.url = '请输入资源URL';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = '请输入有效的URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const cleanedData = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags.filter(t => t.trim())
      };
      onSubmit(cleanedData);
    }
  };

  // 添加特性
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // 删除特性
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // 更新特性
  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  // 添加标签
  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  // 删除标签
  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // 更新标签
  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((t, i) => i === index ? value : t)
    }));
  };

  // 预览组件
  const PreviewCard = () => {
    const IconComponent = getIconComponent(formData.iconName);
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
        <div className={`h-2 bg-gradient-to-r ${formData.color}`}></div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${formData.color} text-white shadow-lg`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {formData.accessType}
              </div>
              <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {formData.language === 'Chinese' ? '中文' : 
                 formData.language === 'English' ? 'English' : '多语言'}
              </div>
            </div>
          </div>
          
          <h3 className="font-bold text-gray-900 mb-2">{formData.name || '资源名称'}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {formData.description || '资源描述'}
          </p>
          
          {formData.features.filter(f => f.trim()).length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {formData.features.filter(f => f.trim()).slice(0, 3).map((feature, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {feature}
                </span>
              ))}
            </div>
          )}
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            访问资源
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 预览切换 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {submitLabel === '添加资源' ? '添加自定义资源' : '编辑自定义资源'}
        </h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>{showPreview ? '隐藏预览' : '显示预览'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">基本信息</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                资源名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="例如：ResearchGate"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                资源描述 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="简要描述这个学术资源的功能和特点"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                资源URL *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com"
              />
              {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
            </div>
          </div>

          {/* 分类和属性 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">分类和属性</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分类
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  访问类型
                </label>
                <select
                  value={formData.accessType}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Free">免费</option>
                  <option value="Subscription">订阅</option>
                  <option value="Institutional">机构</option>
                  <option value="Freemium">免费增值</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                语言
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Chinese">中文</option>
                <option value="English">英文</option>
                <option value="Multilingual">多语言</option>
              </select>
            </div>
          </div>

          {/* 外观设置 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">外观设置</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图标
              </label>
              <div className="grid grid-cols-5 gap-2">
                {customResourceIcons.map(({ name, icon: Icon, label }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, iconName: name }))}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.iconName === name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={label}
                  >
                    <Icon className="h-5 w-5 mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                颜色主题
              </label>
              <div className="grid grid-cols-4 gap-2">
                {customResourceColors.map(({ name, value, label }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: value }))}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.color === value
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={label}
                  >
                    <div className={`h-6 w-full rounded bg-gradient-to-r ${value}`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 特性和标签 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">特性和标签</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                功能特性
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如：免费访问"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>添加特性</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如：学术搜索"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>添加标签</span>
                </button>
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {isLoading ? '保存中...' : submitLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </form>

        {/* 预览 */}
        {showPreview && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">预览效果</h4>
            <PreviewCard />
          </div>
        )}
      </div>
    </div>
  );
}
