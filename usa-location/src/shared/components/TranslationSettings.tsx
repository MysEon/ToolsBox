'use client';

import React, { useState } from 'react';
import { X, Languages, Key, Globe, Clock, Eye, EyeOff, Trash2, ExternalLink } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { SUPPORTED_LANGUAGES, translationService } from '../../utils/translationService';

interface TranslationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TranslationSettings({ isOpen, onClose }: TranslationSettingsProps) {
  const { preferences, updateTranslationSettings } = useUserPreferences();
  const [testText, setTestText] = useState('Hello, this is a test message.');
  const [testResult, setTestResult] = useState<string>('');
  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState<string>('');

  if (!isOpen) return null;

  const handleApiKeyChange = (apiKey: string) => {
    updateTranslationSettings({ deeplxApiKey: apiKey });
  };

  const handleTargetLanguageChange = (targetLanguage: string) => {
    updateTranslationSettings({ targetLanguage });
  };

  const handleCacheToggle = (enableCache: boolean) => {
    updateTranslationSettings({ enableCache });
  };

  const handleCacheExpiryChange = (cacheExpiry: number) => {
    updateTranslationSettings({ cacheExpiry });
  };

  const handleAutoTranslateToggle = (autoTranslate: boolean) => {
    updateTranslationSettings({ autoTranslate });
  };

  const handleShowOriginalToggle = (showOriginal: boolean) => {
    updateTranslationSettings({ showOriginal });
  };

  const handleTestTranslation = async () => {
    if (!preferences.translation.deeplxApiKey.trim()) {
      setTestError('请先输入 API Key');
      return;
    }

    if (!testText.trim()) {
      setTestError('请输入测试文本');
      return;
    }

    setTesting(true);
    setTestError('');
    setTestResult('');

    try {
      const result = await translationService.translateText(
        testText,
        preferences.translation.targetLanguage as any,
        preferences.translation.deeplxApiKey,
        'auto' as any,
        false, // 测试时不使用缓存
        preferences.translation.cacheExpiry
      );

      if (result.error) {
        setTestError(result.error);
      } else {
        setTestResult(result.translatedText);
      }
    } catch (error) {
      setTestError(error instanceof Error ? error.message : '测试失败');
    } finally {
      setTesting(false);
    }
  };

  const handleClearCache = () => {
    translationService.clearCache();
    alert('翻译缓存已清除');
  };

  const cacheStats = translationService.getCacheStats();

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* 设置面板 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center space-x-3">
              <Languages className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">翻译设置</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* API Key 配置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Key className="h-4 w-4 inline mr-2" />
                DeepLX API Key
              </label>
              <div className="space-y-2">
                <input
                  type="password"
                  value={preferences.translation.deeplxApiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="请输入您的 DeepLX API Key"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <ExternalLink className="h-4 w-4" />
                    <span>
                      请前往
                      <a
                        href="https://connect.linux.do"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 underline mx-1"
                      >
                        connect.linux.do
                      </a>
                      获取您的专属 API Key
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <span>🔒</span>
                    <span>您的 API Key 仅保存在本地浏览器中，不会上传到任何服务器</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 目标语言选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="h-4 w-4 inline mr-2" />
                目标翻译语言
              </label>
              <select
                value={preferences.translation.targetLanguage}
                onChange={(e) => handleTargetLanguageChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* 缓存设置 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4 inline mr-2" />
                  翻译缓存
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.translation.enableCache}
                    onChange={(e) => handleCacheToggle(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.translation.enableCache ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.translation.enableCache ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                </label>
              </div>
              
              {preferences.translation.enableCache && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      缓存过期时间（小时）
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="168"
                      value={preferences.translation.cacheExpiry}
                      onChange={(e) => handleCacheExpiryChange(parseInt(e.target.value) || 24)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        缓存统计
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        已缓存 {cacheStats.size} / {cacheStats.maxSize} 条翻译
                      </p>
                    </div>
                    <button
                      onClick={handleClearCache}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>清除缓存</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 显示选项 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">显示选项</h3>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">同时显示原文</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.translation.showOriginal}
                  onChange={(e) => handleShowOriginalToggle(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* 测试翻译 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                测试翻译
              </label>
              <div className="space-y-3">
                <textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="输入要测试的文本..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
                
                <button
                  onClick={handleTestTranslation}
                  disabled={testing || !preferences.translation.deeplxApiKey.trim()}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {testing ? '翻译中...' : '测试翻译'}
                </button>
                
                {testResult && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">翻译结果：</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{testResult}</p>
                  </div>
                )}
                
                {testError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300">{testError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 底部 */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
