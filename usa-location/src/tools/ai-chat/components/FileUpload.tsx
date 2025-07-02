'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { PDFProcessor } from '../utils/pdfProcessor';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  onClose: () => void;
}

export default function FileUpload({ onFileUpload, onClose }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);
    setIsProcessing(true);

    try {
      const validFiles: File[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 验证文件
        const validation = await PDFProcessor.validatePDF(file);
        if (!validation.valid) {
          throw new Error(`文件 "${file.name}": ${validation.error}`);
        }
        
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        onFileUpload(validFiles);
        setSuccess(`成功上传 ${validFiles.length} 个文件`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }

    } catch (error) {
      console.error('File upload failed:', error);
      setError(error instanceof Error ? error.message : '文件上传失败');
    } finally {
      setIsProcessing(false);
    }
  };

  // 处理拖拽
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // 点击上传
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg p-4 w-80">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">上传PDF文件</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* 上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {isProcessing ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">处理中...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDragging ? '释放文件以上传' : '点击或拖拽PDF文件到此处'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                支持多文件上传，单个文件最大10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 状态消息 */}
      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-3 flex items-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* 支持的格式说明 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">支持的文件格式</span>
        </div>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• PDF文档 (.pdf)</li>
          <li>• 文件大小限制：10MB</li>
          <li>• 支持多文件同时上传</li>
          <li>• 自动提取文本内容供AI分析</li>
        </ul>
      </div>

      {/* 使用提示 */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <p>💡 上传的PDF文件将在本地解析，文本内容会添加到对话中供AI分析。</p>
      </div>
    </div>
  );
}
