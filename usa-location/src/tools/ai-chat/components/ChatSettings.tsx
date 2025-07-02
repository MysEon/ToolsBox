'use client';

import React, { useState } from 'react';
import { X, Save, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { ChatSettings as ChatSettingsType, ModelProvider } from '../types/chat';
import { getModelsByProvider } from '../data/models';

interface ChatSettingsProps {
  settings: ChatSettingsType;
  onSave: (settings: ChatSettingsType) => void;
  onClose: () => void;
}

export default function ChatSettings({ settings, onSave, onClose }: ChatSettingsProps) {
  const [formData, setFormData] = useState<ChatSettingsType>(settings);
  const [showApiKeys, setShowApiKeys] = useState<Record<ModelProvider, boolean>>({
    openai: false,
    deepseek: false,
    gemini: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 验证设置
  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证API密钥
    Object.entries(formData.providers).forEach(([provider, config]) => {
      if (!config.apiKey?.trim()) {
        newErrors[`${provider}_apiKey`] = `请输入${provider.toUpperCase()} API密钥`;
      }
    });

    // 验证温度值
    Object.entries(formData.providers).forEach(([provider, config]) => {
      if (config.temperature < 0 || config.temperature > 2) {
        newErrors[`${provider}_temperature`] = '温度值应在0-2之间';
      }
    });

    // 验证最大token数
    Object.entries(formData.providers).forEach(([provider, config]) => {
      if (config.maxTokens < 100 || config.maxTokens > 100000) {
        newErrors[`${provider}_maxTokens`] = '最大token数应在100-100000之间';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存设置
  const handleSave = () => {
    if (validateSettings()) {
      onSave(formData);
    }
  };

  // 更新提供商配置
  const updateProviderConfig = (provider: ModelProvider, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          [field]: value
        }
      }
    }));
  };

  // 切换API密钥显示
  const toggleApiKeyVisibility = (provider: ModelProvider) => {
    setShowApiKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  // 获取提供商名称
  const getProviderName = (provider: ModelProvider) => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'deepseek': return 'DeepSeek';
      case 'gemini': return 'Gemini';
      default: return provider;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI聊天设置</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* 通用设置 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">通用设置</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  默认提供商
                </label>
                <select
                  value={formData.defaultProvider}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultProvider: e.target.value as ModelProvider }))}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="openai">OpenAI</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="gemini">Gemini</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  自动保存会话
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.autoSave}
                    onChange={(e) => setFormData(prev => ({ ...prev, autoSave: e.target.checked }))}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">启用自动保存</span>
                </label>
              </div>
            </div>
          </div>

          {/* 提供商配置 */}
          {(['openai', 'deepseek', 'gemini'] as ModelProvider[]).map(provider => (
            <div key={provider} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                {getProviderName(provider)} 配置
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* API密钥 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API密钥 *
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeys[provider] ? 'text' : 'password'}
                      value={formData.providers[provider].apiKey || ''}
                      onChange={(e) => updateProviderConfig(provider, 'apiKey', e.target.value)}
                      placeholder={`请输入${getProviderName(provider)} API密钥`}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                        errors[`${provider}_apiKey`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => toggleApiKeyVisibility(provider)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKeys[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors[`${provider}_apiKey`] && (
                    <div className="mt-1 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors[`${provider}_apiKey`]}
                    </div>
                  )}
                </div>

                {/* 基础URL (仅OpenAI) */}
                {provider === 'openai' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      基础URL
                    </label>
                    <input
                      type="url"
                      value={formData.providers[provider].baseUrl || ''}
                      onChange={(e) => updateProviderConfig(provider, 'baseUrl', e.target.value)}
                      placeholder="https://api.openai.com/v1"
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                )}

                {/* 模型选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    模型
                  </label>
                  <select
                    value={formData.providers[provider].model}
                    onChange={(e) => updateProviderConfig(provider, 'model', e.target.value)}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {getModelsByProvider(provider).map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 温度 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    温度 ({formData.providers[provider].temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.providers[provider].temperature}
                    onChange={(e) => updateProviderConfig(provider, 'temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>保守</span>
                    <span>创造性</span>
                  </div>
                  {errors[`${provider}_temperature`] && (
                    <div className="mt-1 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors[`${provider}_temperature`]}
                    </div>
                  )}
                </div>

                {/* 最大Token数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    最大Token数
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    value={formData.providers[provider].maxTokens}
                    onChange={(e) => updateProviderConfig(provider, 'maxTokens', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                      errors[`${provider}_maxTokens`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors[`${provider}_maxTokens`] && (
                    <div className="mt-1 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors[`${provider}_maxTokens`]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
