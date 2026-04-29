'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CustomResourceForm } from './CustomResourceForm';
import { CustomResourceFormData, customResourceStorage } from '../utils/customResourceStorage';
import Modal from '@/shared/components/Modal';

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

  return (
    <Modal open={isOpen} onClose={onClose} title="添加自定义资源" size="lg">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      <CustomResourceForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        submitLabel="添加资源"
      />
    </Modal>
  );
}
