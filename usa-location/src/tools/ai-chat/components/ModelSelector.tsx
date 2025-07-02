'use client';

import React, { useState } from 'react';
import { ChevronDown, Zap, Brain, Sparkles } from 'lucide-react';
import { ChatSettings } from '../types/chat';
import { getModelsByProvider } from '../data/models';

interface ModelSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  settings: ChatSettings;
}

export default function ModelSelector({
  selectedProvider,
  onProviderChange,
  settings
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 获取提供商图标
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return <Brain className="h-4 w-4 text-green-500" />;
      case 'deepseek':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'gemini':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  // 获取提供商名称
  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'OpenAI';
      case 'deepseek':
        return 'DeepSeek';
      case 'gemini':
        return 'Gemini';
      default:
        return provider;
    }
  };

  // 获取提供商颜色
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'from-green-500 to-emerald-600';
      case 'deepseek':
        return 'from-blue-500 to-cyan-600';
      case 'gemini':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // 处理提供商切换
  const handleProviderChange = (provider: string) => {
    onProviderChange(provider);
    setIsOpen(false);
  };

  const currentConfig = settings.providers[selectedProvider];
  const currentModels = getModelsByProvider(selectedProvider);
  const currentModel = currentModels.find(m => m.id === currentConfig?.model);

  return (
    <div className="relative">
      {/* 选择器按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 bg-gradient-to-r ${getProviderColor(selectedProvider)} text-white shadow-md hover:shadow-lg`}
      >
        <div className="flex items-center space-x-2">
          {getProviderIcon(selectedProvider)}
          <div className="text-left">
            <div className="text-sm font-medium">
              {getProviderName(selectedProvider)}
            </div>
            <div className="text-xs opacity-90">
              {currentModel?.name || currentConfig?.model || '未选择'}
            </div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto backdrop-blur-sm">
          {/* 提供商选择 */}
          <div className="p-3 border-b dark:border-gray-600">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">AI提供商</div>
            <div className="grid grid-cols-1 gap-2">
              {(['openai', 'deepseek', 'gemini'] as string[]).map(provider => (
                <button
                  key={provider}
                  onClick={() => handleProviderChange(provider)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    selectedProvider === provider
                      ? `bg-gradient-to-r ${getProviderColor(provider)} text-white shadow-md`
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {getProviderIcon(provider)}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{getProviderName(provider)}</div>
                    <div className={`text-xs ${selectedProvider === provider ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      {provider === 'openai' && '最先进的GPT模型'}
                      {provider === 'deepseek' && '中文优化，代码专长'}
                      {provider === 'gemini' && 'Google多模态模型'}
                    </div>
                  </div>
                  {selectedProvider === provider && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 当前模型信息 */}
          <div className="p-3">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
              当前模型: {getProviderName(selectedProvider)}
            </div>
            {currentModel && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {currentModel.name}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      {(currentModel.maxTokens / 1000).toFixed(0)}K
                    </span>
                    {currentModel.supportsVision && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        👁️
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {currentModel.description}
                </div>
                {currentModel.pricing && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    输入: ${currentModel.pricing.input}/1K • 输出: ${currentModel.pricing.output}/1K
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
