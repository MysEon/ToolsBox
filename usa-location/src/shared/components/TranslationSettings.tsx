'use client';

import React, { useState } from 'react';
import { X, Languages, Key, Globe, Clock, Trash2, ExternalLink } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { SUPPORTED_LANGUAGES, translationService } from '../../utils/translationService';
import Modal from './Modal';

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
  const [cacheCleared, setCacheCleared] = useState(false);

  const { translation } = preferences;

  const handleTestTranslation = async () => {
    if (!translation.deeplxApiKey.trim()) {
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
        translation.targetLanguage as any,
        translation.deeplxApiKey,
        'auto' as any,
        false,
        translation.cacheExpiry
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
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  const cacheStats = translationService.getCacheStats();

  return (
    <Modal open={isOpen} onClose={onClose} title="翻译设置" size="lg">
      <div className="space-y-6">
        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            <Key className="h-4 w-4 inline mr-2" />
            DeepLX API Key
          </label>
          <input
            type="password"
            value={translation.deeplxApiKey}
            onChange={(e) => updateTranslationSettings({ deeplxApiKey: e.target.value })}
            placeholder="请输入您的 DeepLX API Key"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm"
          />
          <div className="mt-2 flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
            <ExternalLink className="h-4 w-4" />
            <span>
              请前往{' '}
              <a href="https://connect.linux.do" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline">
                connect.linux.do
              </a>{' '}
              获取您的专属 API Key
            </span>
          </div>
        </div>

        {/* Target language */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            <Globe className="h-4 w-4 inline mr-2" />
            目标翻译语言
          </label>
          <select
            value={translation.targetLanguage}
            onChange={(e) => updateTranslationSettings({ targetLanguage: e.target.value })}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        {/* Cache */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <Clock className="h-4 w-4 inline mr-2" />
              翻译缓存
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={translation.enableCache}
                onChange={(e) => updateTranslationSettings({ enableCache: e.target.checked })}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                translation.enableCache ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  translation.enableCache ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
            </label>
          </div>
          {translation.enableCache && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">缓存过期时间（小时）</label>
                <input
                  type="number" min="1" max="168"
                  value={translation.cacheExpiry}
                  onChange={(e) => updateTranslationSettings({ cacheExpiry: parseInt(e.target.value) || 24 })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">缓存统计</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">已缓存 {cacheStats.size} / {cacheStats.maxSize} 条翻译</p>
                </div>
                <button
                  onClick={handleClearCache}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{cacheCleared ? '已清除!' : '清除缓存'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Test */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">测试翻译</label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="输入要测试的文本..."
            rows={3}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm resize-none"
          />
          <button
            onClick={handleTestTranslation}
            disabled={testing || !translation.deeplxApiKey.trim()}
            className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
          >
            {testing ? '翻译中...' : '测试翻译'}
          </button>
          {testResult && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">翻译结果：</p>
              <p className="text-sm text-green-600 dark:text-green-400">{testResult}</p>
            </div>
          )}
          {testError && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{testError}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
