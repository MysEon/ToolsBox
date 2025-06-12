'use client';

import React, { useState, useEffect } from 'react';
import { US_STATES, getTaxFreeStates, getTaxableStates } from '../data/states';
import { generateCompleteProfile, generateMultipleProfiles, CompleteProfile } from '../utils/addressGenerator';
import { exportToJSON, exportToCSV, exportToTXT, copyToClipboard } from '../utils/exportUtils';
import { identityStorage, IdentitySettings } from '../utils/identityStorage';
import SavedProfiles from './SavedProfiles';
import { Download, Copy, RefreshCw, MapPin, User, CreditCard, Home, DollarSign, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Save, History } from 'lucide-react';

interface GeneratorProps {
  onProfilesGenerated?: (profiles: CompleteProfile[]) => void;
}

export default function Generator({ onProfilesGenerated }: GeneratorProps = {}) {
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
  const [autoSave, setAutoSave] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [showSavedProfiles, setShowSavedProfiles] = useState<boolean>(false);

  // 加载保存的设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await identityStorage.getSettings();
        setSelectedState(settings.selectedState);
        setSelectedCity(settings.selectedCity);
        setTaxFilter(settings.taxFilter);
        setBatchCount(settings.batchCount);
        setAutoSave(settings.autoSave);
      } catch (error) {
        console.warn('Failed to load identity settings:', error);
      }
    };

    loadSettings();
  }, []);

  // 保存设置
  const saveSettings = async () => {
    try {
      await identityStorage.saveSettings({
        selectedState,
        selectedCity,
        taxFilter,
        batchCount,
        autoSave,
      });
    } catch (error) {
      console.warn('Failed to save identity settings:', error);
    }
  };

  // 当设置改变时自动保存
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveSettings();
    }, 1000); // 1秒后保存

    return () => clearTimeout(timeoutId);
  }, [selectedState, selectedCity, taxFilter, batchCount, autoSave]);

  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // 每页显示10个档案

  // 卡片展开状态
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

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

  // 分页逻辑
  const totalPages = Math.ceil(generatedProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfiles = generatedProfiles.slice(startIndex, endIndex);

  // 重置分页当生成新数据时
  const resetPagination = () => {
    setCurrentPage(1);
    setExpandedCard(null);
  };

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
    resetPagination(); // 重置分页

    // 模拟生成延迟，提升用户体验
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const profiles = generateMultipleProfiles(
        batchCount,
        selectedState || undefined,
        selectedCity || undefined
      );
      setGeneratedProfiles(profiles);

      // 自动保存功能
      if (autoSave && profiles.length > 0) {
        try {
          await identityStorage.saveProfiles(profiles);
          setSaveMessage(`已自动保存 ${profiles.length} 个档案`);
          setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
          console.error('Auto-save failed:', error);
          setSaveMessage('自动保存失败');
          setTimeout(() => setSaveMessage(''), 3000);
        }
      }

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

  // 手动保存档案
  const handleSaveProfiles = async () => {
    if (generatedProfiles.length === 0) {
      alert('没有可保存的档案');
      return;
    }

    try {
      await identityStorage.saveProfiles(generatedProfiles);
      setSaveMessage(`已保存 ${generatedProfiles.length} 个档案`);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存失败，请重试');
    }
  };

  // 分页处理函数
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setExpandedCard(null); // 重置展开状态
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* 标题 */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            🇺🇸 美国虚拟身份生成器
          </h1>
          <button
            onClick={() => setShowSavedProfiles(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <History className="h-4 w-4 mr-2" />
            查看历史
          </button>
        </div>
        <p className="text-lg text-gray-600">
          一键生成真实格式的美国地址和完整个人信息，支持按州/城市筛选
        </p>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <RefreshCw className="mr-2" />
          生成设置
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="flex items-end">
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

        {/* 自动保存设置 */}
        <div className="border-t pt-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">自动保存生成的档案</span>
              </label>
              {saveMessage && (
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  {saveMessage}
                </span>
              )}
            </div>
            {generatedProfiles.length > 0 && (
              <button
                onClick={handleSaveProfiles}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm"
              >
                <Save className="mr-2 h-4 w-4" />
                手动保存
              </button>
            )}
          </div>
        </div>

        {/* 导出按钮 */}
        {generatedProfiles.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">导出选项</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleExport('json')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                JSON
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                CSV
              </button>
              <button
                onClick={() => handleExport('txt')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                TXT
              </button>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-md flex items-center transition-colors ${
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

      {/* 结果显示 */}
      {generatedProfiles.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              生成结果 ({generatedProfiles.length} 个档案)
            </h2>
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                第 {currentPage} 页，共 {totalPages} 页
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {currentProfiles.map((profile, index) => {
              const globalIndex = startIndex + index;
              const isExpanded = expandedCard === globalIndex;

              return (
                <div
                  key={globalIndex}
                  className={`bg-white rounded-lg shadow-lg transition-all duration-200 cursor-pointer ${
                    isExpanded ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl'
                  }`}
                  onMouseEnter={() => setExpandedCard(globalIndex)}
                  onMouseLeave={() => setExpandedCard(null)}
                >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      档案 #{globalIndex + 1}
                    </h3>
                    <div className="flex gap-2 items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {profile.address.stateAbbreviation}
                      </span>
                      {(() => {
                        const stateInfo = US_STATES.find(s => s.abbreviation === profile.address.stateAbbreviation);
                        return stateInfo?.taxFree ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            🚫 免税州
                          </span>
                        ) : (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            💰 {stateInfo?.salesTaxRate}%
                          </span>
                        );
                      })()}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* 基础信息 - 始终显示 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">姓名:</span>
                      <span className="ml-2 text-gray-900">{profile.personal.fullName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">邮箱:</span>
                      <span className="ml-2 text-gray-900">{profile.personal.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">地址:</span>
                      <span className="ml-2 text-gray-900">{profile.address.city}, {profile.address.stateAbbreviation}</span>
                    </div>
                  </div>
                </div>

                {/* 详细信息 - 仅在展开时显示 */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      {/* 个人信息 */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          个人信息
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">姓名:</span> {profile.personal.fullName}</p>
                          <p><span className="font-medium">邮箱:</span> {profile.personal.email}</p>
                          <p><span className="font-medium">电话:</span> {profile.personal.phone}</p>
                          <p><span className="font-medium">SSN:</span> {profile.personal.ssn}</p>
                          <p><span className="font-medium">生日:</span> {profile.personal.dateOfBirth}</p>
                          <p><span className="font-medium">年龄:</span> {profile.personal.age}岁</p>
                          <p><span className="font-medium">性别:</span> {profile.personal.gender}</p>
                          <p><span className="font-medium">职业:</span> {profile.personal.occupation}</p>
                          <p><span className="font-medium">公司:</span> {profile.personal.company}</p>
                        </div>
                      </div>

                      {/* 地址信息 */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <Home className="mr-2 h-4 w-4" />
                          地址信息
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">街道:</span> {profile.address.street}</p>
                          <p><span className="font-medium">城市:</span> {profile.address.city}</p>
                          <p><span className="font-medium">州:</span> {profile.address.state}</p>
                          <p><span className="font-medium">邮编:</span> {profile.address.zipCode}</p>
                          <p className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span className="font-medium">坐标:</span>
                            <span className="ml-1">
                              {profile.address.coordinates.lat.toFixed(6)}, {profile.address.coordinates.lng.toFixed(6)}
                            </span>
                          </p>
                          {(() => {
                            const stateInfo = US_STATES.find(s => s.abbreviation === profile.address.stateAbbreviation);
                            return (
                              <p className="flex items-center">
                                <DollarSign className="mr-1 h-3 w-3" />
                                <span className="font-medium">税收:</span>
                                <span className="ml-1">
                                  {stateInfo?.taxFree ? '免税州' : `销售税 ${stateInfo?.salesTaxRate}%`}
                                </span>
                              </p>
                            );
                          })()}
                        </div>
                      </div>

                      {/* 信用卡信息 */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          信用卡信息
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">卡号:</span> {profile.personal.creditCard.number}</p>
                          <p><span className="font-medium">类型:</span> {profile.personal.creditCard.type}</p>
                          <p><span className="font-medium">到期:</span> {profile.personal.creditCard.expirationDate}</p>
                          <p><span className="font-medium">CVV:</span> {profile.personal.creditCard.cvv}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              );
            })}
          </div>

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8 py-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                上一页
              </button>

              <div className="flex items-center space-x-2">
                {/* 页码显示 */}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                下一页
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}

          {/* 分页信息 */}
          {totalPages > 1 && (
            <div className="text-center text-sm text-gray-600 mt-4">
              显示第 {startIndex + 1}-{Math.min(endIndex, generatedProfiles.length)} 项，
              共 {generatedProfiles.length} 项 | 第 {currentPage} 页，共 {totalPages} 页
            </div>
          )}
        </div>
      )}

      {/* 保存的档案弹窗 */}
      <SavedProfiles
        isOpen={showSavedProfiles}
        onClose={() => setShowSavedProfiles(false)}
      />
    </div>
  );
}
