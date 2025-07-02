'use client';

import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import FileUpload from './FileUpload';

interface MessageInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function MessageInput({ onSendMessage, isLoading, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 发送消息
  const handleSend = () => {
    if (!message.trim() && attachedFiles.length === 0) return;
    if (isLoading || disabled) return;

    onSendMessage(message.trim(), attachedFiles);
    setMessage('');
    setAttachedFiles([]);
    setShowFileUpload(false);
    
    // 重置textarea高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 自动调整textarea高度
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // 自动调整高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // 处理文件上传
  const handleFileUpload = (files: File[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
    setShowFileUpload(false);
  };

  // 移除文件
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t dark:border-gray-700 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      {/* 附件预览 */}
      {attachedFiles.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center space-x-2">
            <span>📎 附件</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
              {attachedFiles.length}
            </span>
          </div>
          <div className="space-y-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                    📄
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="移除文件"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="flex items-end space-x-3">
        {/* 文件上传按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowFileUpload(!showFileUpload)}
            className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-md ${
              showFileUpload
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="上传文件"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* 文件上传组件 */}
          {showFileUpload && (
            <div className="absolute bottom-full left-0 mb-2 z-10">
              <FileUpload
                onFileUpload={handleFileUpload}
                onClose={() => setShowFileUpload(false)}
              />
            </div>
          )}
        </div>

        {/* 文本输入 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "请先创建或选择一个会话" : "输入消息... (Shift+Enter换行)"}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={disabled}
          />
        </div>

        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && attachedFiles.length === 0) || isLoading || disabled}
          className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-md ${
            (!message.trim() && attachedFiles.length === 0) || isLoading || disabled
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
          }`}
          title="发送消息"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* 提示文本 */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-4">
        <span className="flex items-center space-x-1">
          <span>📎</span>
          <span>支持PDF文件</span>
        </span>
        <span className="flex items-center space-x-1">
          <span>⌨️</span>
          <span>Shift+Enter换行</span>
        </span>
        <span className="flex items-center space-x-1">
          <span>🚀</span>
          <span>Enter发送</span>
        </span>
      </div>
    </div>
  );
}
