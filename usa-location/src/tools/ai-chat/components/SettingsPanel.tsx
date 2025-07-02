import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Eye, EyeOff, Palette, Save, AlertCircle } from 'lucide-react';
import { ChatSettings, ModelInfo } from '../types/models';
import { fetchModelsFromAPI, getModelsByProvider } from '../data/models';

interface SettingsPanelProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  onClose: () => void;
}

type ProviderTab = 'openai' | 'deepseek' | 'gemini' | 'general';

export default function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<ProviderTab>('openai');
  const [localSettings, setLocalSettings] = useState<ChatSettings>(settings);
  const [showApiKeys, setShowApiKeys] = useState<{[key: string]: boolean}>({});
  const [availableModels, setAvailableModels] = useState<{[key: string]: ModelInfo[]}>({});
  const [loadingModels, setLoadingModels] = useState<{[key: string]: boolean}>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // 初始化可用模型
    setAvailableModels({
      openai: getModelsByProvider('openai'),
      deepseek: getModelsByProvider('deepseek'),
      gemini: getModelsByProvider('gemini')
    });
  }, []);

  const handleProviderSettingChange = (provider: string, field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          [field]: value
        }
      }
    }));
    
    // 清除错误
    if (errors[`${provider}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${provider}.${field}`];
        return newErrors;
      });
    }
  };

  const handleGeneralSettingChange = (field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const refreshModels = async (provider: string) => {
    const providerConfig = localSettings.providers[provider];
    if (!providerConfig.apiKey) {
      setErrors(prev => ({ ...prev, [`${provider}.apiKey`]: '请先输入API密钥' }));
      return;
    }

    setLoadingModels(prev => ({ ...prev, [provider]: true }));
    try {
      const models = await fetchModelsFromAPI(provider, providerConfig.apiKey, providerConfig.baseUrl);
      setAvailableModels(prev => ({ ...prev, [provider]: models }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${provider}.models`];
        return newErrors;
      });
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [`${provider}.models`]: `获取模型列表失败: ${error instanceof Error ? error.message : '未知错误'}` 
      }));
    } finally {
      setLoadingModels(prev => ({ ...prev, [provider]: false }));
    }
  };

  const validateSettings = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    Object.entries(localSettings.providers).forEach(([provider, config]) => {
      if (!config.apiKey.trim()) {
        newErrors[`${provider}.apiKey`] = 'API密钥不能为空';
      }
      if (!config.model) {
        newErrors[`${provider}.model`] = '请选择模型';
      }
      if (config.temperature < 0 || config.temperature > 2) {
        newErrors[`${provider}.temperature`] = '温度值应在0-2之间';
      }
      if (config.maxTokens < 1 || config.maxTokens > 100000) {
        newErrors[`${provider}.maxTokens`] = '最大Token数应在1-100000之间';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateSettings()) {
      onSettingsChange(localSettings);
      onClose();
    }
  };

  const toggleApiKeyVisibility = (provider: string) => {
    setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const renderProviderSettings = (provider: string) => {
    const config = localSettings.providers[provider];
    const models = availableModels[provider] || [];
    const isLoading = loadingModels[provider];

    return (
      <div className="space-y-6">
        {/* API配置 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">API配置</h4>
          
          <div className="space-y-4">
            {/* API密钥 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API密钥
              </label>
              <div className="relative">
                <input
                  type={showApiKeys[provider] ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => handleProviderSettingChange(provider, 'apiKey', e.target.value)}
                  placeholder="输入API密钥..."
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors[`${provider}.apiKey`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleApiKeyVisibility(provider)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKeys[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors[`${provider}.apiKey`] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`${provider}.apiKey`]}</p>
              )}
            </div>

            {/* Base URL */}
            {provider === 'openai' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Base URL
                </label>
                <input
                  type="text"
                  value={config.baseUrl || ''}
                  onChange={(e) => handleProviderSettingChange(provider, 'baseUrl', e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            )}
          </div>
        </div>

        {/* 模型配置 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">模型配置</h4>
            <button
              onClick={() => refreshModels(provider)}
              disabled={isLoading || !config.apiKey}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>刷新模型</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* 模型选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                模型
              </label>
              <select
                value={config.model}
                onChange={(e) => handleProviderSettingChange(provider, 'model', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors[`${provider}.model`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">选择模型...</option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
              {errors[`${provider}.model`] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`${provider}.model`]}</p>
              )}
              {errors[`${provider}.models`] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors[`${provider}.models`]}
                </p>
              )}
            </div>

            {/* 温度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                温度 ({config.temperature})
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => handleProviderSettingChange(provider, 'temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>保守</span>
                <span>创造性</span>
              </div>
            </div>

            {/* 最大Token数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                最大Token数
              </label>
              <input
                type="number"
                min="1"
                max="100000"
                value={config.maxTokens}
                onChange={(e) => handleProviderSettingChange(provider, 'maxTokens', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors[`${provider}.maxTokens`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors[`${provider}.maxTokens`] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`${provider}.maxTokens`]}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* 默认提供商 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">默认设置</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            默认AI提供商
          </label>
          <select
            value={localSettings.defaultProvider}
            onChange={(e) => handleGeneralSettingChange('defaultProvider', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="openai">OpenAI</option>
            <option value="deepseek">DeepSeek</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
      </div>

      {/* 界面设置 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">界面设置</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-300">自动保存对话</label>
            <input
              type="checkbox"
              checked={localSettings.autoSave}
              onChange={(e) => handleGeneralSettingChange('autoSave', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-300">启用Markdown渲染</label>
            <input
              type="checkbox"
              checked={localSettings.enableMarkdown}
              onChange={(e) => handleGeneralSettingChange('enableMarkdown', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-300">启用代码高亮</label>
            <input
              type="checkbox"
              checked={localSettings.enableCodeHighlight}
              onChange={(e) => handleGeneralSettingChange('enableCodeHighlight', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 历史记录设置 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">历史记录</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            最大历史记录数量
          </label>
          <input
            type="number"
            min="10"
            max="1000"
            value={localSettings.maxHistoryLength}
            onChange={(e) => handleGeneralSettingChange('maxHistoryLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'openai', name: 'OpenAI', icon: '🤖' },
    { id: 'deepseek', name: 'DeepSeek', icon: '🧠' },
    { id: 'gemini', name: 'Gemini', icon: '💎' },
    { id: 'general', name: '通用设置', icon: '⚙️' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI聊天设置</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* 侧边栏标签 */}
          <div className="w-48 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700">
            <nav className="p-4 space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProviderTab)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* 主内容区 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'general' ? renderGeneralSettings() : renderProviderSettings(activeTab)}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4" />
            <span>保存设置</span>
          </button>
        </div>
      </div>
    </div>
  );
}
