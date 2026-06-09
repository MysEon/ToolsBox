'use client';

import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { CustomResourceForm } from './CustomResourceForm';
import { CustomResourceFormData, customResourceStorage } from '../utils/customResourceStorage';
import { AcademicResource } from '../data/academicResources';
import Modal from '@/shared/components/Modal';

interface EditCustomResourceModalProps {
  isOpen: boolean;
  resourceId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCustomResourceModal({ isOpen, resourceId, onClose, onSuccess }: EditCustomResourceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resource, setResource] = useState<AcademicResource | null>(null);
  const [initialData, setInitialData] = useState<Partial<CustomResourceFormData> | undefined>();

  useEffect(() => {
    if (isOpen && resourceId) loadResource();
  }, [isOpen, resourceId]);

  const loadResource = async () => {
    if (!resourceId) return;
    try {
      const resourceData = await customResourceStorage.getCustomResource(resourceId);
      if (resourceData) {
        setResource(resourceData);
        setInitialData({
          name: resourceData.name,
          description: resourceData.description,
          url: resourceData.url,
          category: resourceData.category,
          accessType: resourceData.accessType,
          language: resourceData.language,
          iconName: (resourceData as any).iconName || 'Search',
          color: resourceData.color,
          features: resourceData.features,
          tags: resourceData.tags,
        });
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
    if (!window.confirm(`确定要删除资源"${resource.name}"吗？此操作不可恢复。`)) return;
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

  const handleClose = () => {
    setError(null);
    setResource(null);
    setInitialData(undefined);
    onClose();
  };

  const titleContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">编辑自定义资源</h2>
          {resource && <p className="text-sm text-zinc-500">{resource.name}</p>}
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
        title="删除资源"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <Modal open={isOpen && !!resourceId} onClose={handleClose} size="lg">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      {isDeleting && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm">正在删除资源...</p>
        </div>
      )}
      {initialData ? (
        <CustomResourceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isLoading={isLoading}
          submitLabel="更新资源"
        />
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-zinc-500 text-sm">加载中...</span>
        </div>
      )}
    </Modal>
  );
}
