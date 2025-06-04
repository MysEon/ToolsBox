'use client';

import React, { useState } from 'react';
import { US_STATES, getTaxFreeStates, getTaxableStates } from '../data/states';
import { generateMultipleProfiles, CompleteProfile } from '../utils/addressGenerator';
import { exportToJSON, exportToCSV, exportToTXT, copyToClipboard } from '../utils/exportUtils';
import { Download, Copy, RefreshCw, DollarSign } from 'lucide-react';

interface GeneratorSettingsProps {
  onProfilesGenerated?: (profiles: CompleteProfile[]) => void;
}

export default function GeneratorSettings({ onProfilesGenerated }: GeneratorSettingsProps = {}) {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [taxFilter, setTaxFilter] = useState<string>(''); // 'tax-free', 'taxable', ''
  const [batchCount, setBatchCount] = useState<number>(1);
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [customCount, setCustomCount] = useState<string>('');
  const [customCountError, setCustomCountError] = useState<string>('');
  const [generatedProfiles, setGeneratedProfiles] = useState<CompleteProfile[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // 根据税收筛选获取州列表
  const getFilteredStates = () => {
    switch (taxFilter) {
      case 'tax-free':
        return getTaxFreeStates();
      case 'taxable':
        return getTaxableStates();
      default:
        return US_STATES;
    }
  };

  // 获取选中州的城市列表
  const availableCities = selectedState
    ? US_STATES.find(state => state.name === selectedState)?.cities || []
    : [];

  // 处理数量选择变化
  const handleCountChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomCount(true);
      setCustomCount('');
      setCustomCountError('');
    } else {
      setIsCustomCount(false);
      setBatchCount(Number(value));
      setCustomCount('');
      setCustomCountError('');
    }
  };

  // 处理自定义数量输入
  const handleCustomCountChange = (value: string) => {
    setCustomCount(value);
    setCustomCountError('');

    // 验证输入
    if (value === '') {
      setBatchCount(1);
      return;
    }

    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      setCustomCountError('请输入有效的正整数');
      setBatchCount(1);
    } else if (num > 1000) {
      setCustomCountError('数量不能超过1000');
      setBatchCount(1000);
    } else {
      setBatchCount(num);
    }
  };

  // 生成身份信息
  const handleGenerate = async () => {
    setIsGenerating(true);

    // 模拟生成延迟，提升用户体验
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const profiles = generateMultipleProfiles(
        batchCount,
        selectedState || undefined,
        selectedCity || undefined
      );
      setGeneratedProfiles(profiles);

      // 调用回调函数传递数据给父组件
      if (onProfilesGenerated) {
        onProfilesGenerated(profiles);
      }
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      await copyToClipboard(generatedProfiles);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请重试');
    }
  };

  // 导出处理
  const handleExport = (format: 'json' | 'csv' | 'txt') => {
    if (generatedProfiles.length === 0) {
      alert('请先生成数据');
      return;
    }

    try {
      switch (format) {
        case 'json':
          exportToJSON(generatedProfiles);
          break;
        case 'csv':
          exportToCSV(generatedProfiles);
          break;
        case 'txt':
          exportToTXT(generatedProfiles);
          break;
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题和说明 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <RefreshCw className="mr-2 h-5 w-5" />
          生成设置
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          一键生成真实格式的美国地址和完整个人信息，支持按州/城市筛选
        </p>
        
        <div className="space-y-4">
          {/* 税收筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              税收筛选
            </label>
            <select
              value={taxFilter}
              onChange={(e) => {
                setTaxFilter(e.target.value);
                setSelectedState(''); // 重置州选择
                setSelectedCity(''); // 重置城市选择
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">所有州</option>
              <option value="tax-free">🚫 免税州 ({getTaxFreeStates().length}个)</option>
              <option value="taxable">💰 有税州 ({getTaxableStates().length}个)</option>
            </select>
          </div>

          {/* 州选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择州 (可选)
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity(''); // 重置城市选择
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">
                {taxFilter === 'tax-free' ? '所有免税州' :
                 taxFilter === 'taxable' ? '所有有税州' : '所有州'}
              </option>
              {getFilteredStates().map(state => (
                <option key={state.abbreviation} value={state.name}>
                  {state.name} ({state.abbreviation})
                  {state.taxFree ? ' 🚫' : ` 💰${state.salesTaxRate}%`}
                </option>
              ))}
            </select>
          </div>

          {/* 城市选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择城市 (可选)
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
            >
              <option value="">所有城市</option>
              {availableCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* 批量生成数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生成数量
            </label>
            <select
              value={isCustomCount ? 'custom' : batchCount}
              onChange={(e) => handleCountChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value={1}>1个</option>
              <option value={5}>5个</option>
              <option value={10}>10个</option>
              <option value={20}>20个</option>
              <option value={50}>50个</option>
              <option value="custom">自定义</option>
            </select>

            {/* 自定义数量输入框 */}
            {isCustomCount && (
              <div className="mt-2">
                <input
                  type="number"
                  value={customCount}
                  onChange={(e) => handleCustomCountChange(e.target.value)}
                  placeholder="输入数量 (1-1000)"
                  min="1"
                  max="1000"
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    customCountError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {customCountError && (
                  <p className="text-red-500 text-xs mt-1">{customCountError}</p>
                )}
              </div>
            )}
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                生成中...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                生成身份
              </>
            )}
          </button>
        </div>
      </div>

      {/* 导出选项 */}
      {generatedProfiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium mb-3">导出选项</h3>
          <div className="space-y-3">
            <button
              onClick={() => handleExport('json')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors text-sm"
            >
              <Download className="mr-2 h-4 w-4" />
              导出 JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors text-sm"
            >
              <Download className="mr-2 h-4 w-4" />
              导出 CSV
            </button>
            <button
              onClick={() => handleExport('txt')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors text-sm"
            >
              <Download className="mr-2 h-4 w-4" />
              导出 TXT
            </button>
            <button
              onClick={handleCopy}
              className={`w-full px-4 py-2 rounded-md flex items-center justify-center transition-colors text-sm ${
                copySuccess 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <Copy className="mr-2 h-4 w-4" />
              {copySuccess ? '已复制!' : '复制JSON'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
