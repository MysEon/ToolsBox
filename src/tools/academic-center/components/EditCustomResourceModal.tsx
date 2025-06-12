'use client';

import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import { CustomResourceForm } from './CustomResourceForm';
import { 
  CustomResourceFormData, 
  customResourceStorage 
} from '../utils/customResourceStorage';
import { AcademicResource } from '../data/academicResources';

interface EditCustomResourceModalProps {
  isOpen: boolean;
  resourceId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCustomResourceModal({ 
  isOpen, 
  resourceId, 
  onClose, 
  onSuccess 
}: EditCustomResourceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resource, setResource] = useState<AcademicResource | null>(null);
  const [initialData, setInitialData] = useState<Partial<CustomResourceFormData> | undefined>();

  // 加载资源数据
  useEffect(() => {
    if (isOpen && resourceId) {
      loadResource();
    }
  }, [isOpen, resourceId]);

  const loadResource = async () => {
    if (!resourceId) return;

    try {
      const resourceData = await customResourceStorage.getCustomResource(resourceId);
      if (resourceData) {
        setResource(resourceData);
        
        // 转换为表单数据格式
        const formData: Partial<CustomResourceFormData> = {
          name: resourceData.name,
          description: resourceData.description,
          url: resourceData.url,
          category: resourceData.category,
          accessType: resourceData.accessType,
          language: resourceData.language,
          iconName: (resourceData as any).iconName || 'Search',
          color: resourceData.color,
          features: resourceData.features,
          tags: resourceData.tags
        };
        
        setInitialData(formData);
      }
    } catch (err) {
      console.error('Failed to load resource:', err);
      setError('加载资源失败');
    }
  };

  const handleSubmit = async (formData: CustomResourceFormData) => {
    if (!resourceId) return;

    setIsLoading(true);
    setError(null);

    try {
      await customResourceStorage.updateCustomResource(resourceId, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update custom resource:', err);
      setError('更新资源失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!resourceId || !resource) return;

    const confirmed = window.confirm(`确定要删除资源"${resource.name}"吗？此操作不可恢复。`);
    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await customResourceStorage.deleteCustomResource(resourceId);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to delete custom resource:', err);
      setError('删除资源失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setResource(null);
    setInitialData(undefined);
    onClose();
  };

  if (!isOpen || !resourceId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">编辑自定义资源</h2>
              {resource && (
                <p className="text-sm text-gray-600">{resource.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="删除资源"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* 删除确认提示 */}
        {isDeleting && (
          <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">正在删除资源...</p>
          </div>
        )}

        {/* 表单内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {initialData ? (
            <CustomResourceForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
              submitLabel="更新资源"
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">加载中...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
