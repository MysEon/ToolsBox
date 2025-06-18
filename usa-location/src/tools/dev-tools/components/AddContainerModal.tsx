'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { CustomContainer } from '../types/dockerCenter';
import { ContainerStorage } from '../utils/containerStorage';

interface AddContainerModalProps {
  onClose: () => void;
  onSave: () => void;
}

export function AddContainerModal({ onClose, onSave }: AddContainerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    port: '',
    protocol: 'https' as 'http' | 'https',
    serverName: '',
    containerName: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '容器名称不能为空';
    }

    if (!formData.description.trim()) {
      newErrors.description = '描述不能为空';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL不能为空';
    } else if (!ContainerStorage.validateContainerUrl(formData.url)) {
      newErrors.url = 'URL格式不正确';
    }

    if (formData.port && (isNaN(Number(formData.port)) || Number(formData.port) < 1 || Number(formData.port) > 65535)) {
      newErrors.port = '端口号必须是1-65535之间的数字';
    }

    if (!formData.serverName.trim()) {
      newErrors.serverName = '服务器名称不能为空';
    }

    if (!formData.containerName.trim()) {
      newErrors.containerName = '容器名称不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 添加标签
  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const container: CustomContainer = {
        id: ContainerStorage.generateId(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        port: formData.port ? Number(formData.port) : undefined,
        protocol: formData.protocol,
        serverName: formData.serverName.trim(),
        containerName: formData.containerName.trim(),
        status: 'unknown',
        tags: formData.tags,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      ContainerStorage.saveContainer(container);
      onSave();
    } catch (error) {
      console.error('保存容器失败:', error);
      setErrors({ submit: '保存失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">添加容器</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 容器名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              容器名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="例如: 我的Web应用"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述 *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="简要描述这个容器的用途"
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* URL和协议 */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                协议
              </label>
              <select
                value={formData.protocol}
                onChange={(e) => setFormData(prev => ({ ...prev, protocol: e.target.value as 'http' | 'https' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="https">HTTPS</option>
                <option value="http">HTTP</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL *
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="example.com"
              />
              {errors.url && <p className="text-red-600 text-xs mt-1">{errors.url}</p>}
            </div>
          </div>

          {/* 端口 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              端口 (可选)
            </label>
            <input
              type="number"
              value={formData.port}
              onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
              min="1"
              max="65535"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.port ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="8080"
            />
            {errors.port && <p className="text-red-600 text-xs mt-1">{errors.port}</p>}
          </div>

          {/* 服务器名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              服务器名称 *
            </label>
            <input
              type="text"
              value={formData.serverName}
              onChange={(e) => setFormData(prev => ({ ...prev, serverName: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.serverName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="例如: 阿里云服务器A"
            />
            {errors.serverName && <p className="text-red-600 text-xs mt-1">{errors.serverName}</p>}
          </div>

          {/* 容器名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Docker容器名称 *
            </label>
            <input
              type="text"
              value={formData.containerName}
              onChange={(e) => setFormData(prev => ({ ...prev, containerName: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.containerName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="例如: webapp-container"
            />
            {errors.containerName && <p className="text-red-600 text-xs mt-1">{errors.containerName}</p>}
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标签
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="添加标签"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 错误信息 */}
          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          {/* 按钮 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
