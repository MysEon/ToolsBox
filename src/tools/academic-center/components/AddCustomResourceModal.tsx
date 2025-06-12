'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { CustomResourceForm } from './CustomResourceForm';
import { CustomResourceFormData, customResourceStorage } from '../utils/customResourceStorage';

interface AddCustomResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCustomResourceModal({ isOpen, onClose, onSuccess }: AddCustomResourceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CustomResourceFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await customResourceStorage.addCustomResource(formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to add custom resource:', err);
      setError('添加资源失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">添加自定义资源</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* 表单内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          <CustomResourceForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitLabel="添加资源"
          />
        </div>
      </div>
    </div>
  );
}
