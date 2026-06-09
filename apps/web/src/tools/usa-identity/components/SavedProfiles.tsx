'use client';

import React, { useState, useEffect } from 'react';
import { identityStorage, SavedIdentityProfile } from '../utils/identityStorage';
import { US_STATES } from '../data/states';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  User, 
  MapPin, 
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';

interface SavedProfilesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedProfiles({ isOpen, onClose }: SavedProfilesProps) {
  const [profiles, setProfiles] = useState<SavedIdentityProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<SavedIdentityProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);

  // 加载保存的档案
  useEffect(() => {
    if (isOpen) {
      loadProfiles();
    }
  }, [isOpen]);

  // 过滤档案
  useEffect(() => {
    let filtered = profiles;

    // 按搜索词过滤
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(profile =>
        profile.personal.fullName.toLowerCase().includes(term) ||
        profile.personal.email.toLowerCase().includes(term) ||
        profile.address.city.toLowerCase().includes(term) ||
        profile.address.state.toLowerCase().includes(term)
      );
    }

    // 按州过滤
    if (stateFilter) {
      filtered = filtered.filter(profile => 
        profile.address.stateAbbreviation === stateFilter
      );
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm, stateFilter]);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const savedProfiles = await identityStorage.getAllProfiles();
      setProfiles(savedProfiles);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (window.confirm('确定要删除这个档案吗？')) {
      try {
        await identityStorage.deleteProfile(profileId);
        await loadProfiles();
      } catch (error) {
        console.error('Failed to delete profile:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('确定要清空所有保存的档案吗？此操作不可恢复！')) {
      try {
        await identityStorage.clearAllProfiles();
        await loadProfiles();
      } catch (error) {
        console.error('Failed to clear profiles:', error);
        alert('清空失败，请重试');
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = await identityStorage.exportProfiles('json');
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `identity-profiles-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const maskSensitiveData = (data: string) => {
    if (showSensitive) return data;
    return data.replace(/./g, '*');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <History className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">保存的档案</h2>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {profiles.length} 个档案
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 搜索和筛选 */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索姓名、邮箱、城市..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 州筛选 */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">所有州</option>
                {US_STATES.map(state => (
                  <option key={state.abbreviation} value={state.abbreviation}>
                    {state.name} ({state.abbreviation})
                  </option>
                ))}
              </select>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowSensitive(!showSensitive)}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  showSensitive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showSensitive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showSensitive ? '隐藏' : '显示'}敏感信息
              </button>
              <button
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                导出
              </button>
              <button
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                清空
              </button>
            </div>
          </div>
        </div>

        {/* 档案列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">加载中...</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {profiles.length === 0 ? '还没有保存的档案' : '没有找到匹配的档案'}
              </h3>
              <p className="text-gray-500">
                {profiles.length === 0 
                  ? '生成身份档案时开启自动保存，或手动保存档案'
                  : '尝试调整搜索条件或筛选器'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProfiles.map((profile) => {
                const isExpanded = expandedProfile === profile.id;
                const stateInfo = US_STATES.find(s => s.abbreviation === profile.address.stateAbbreviation);

                return (
                  <div
                    key={profile.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{profile.personal.fullName}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {profile.personal.email}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {profile.address.city}, {profile.address.stateAbbreviation}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(profile.timestamp)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {profile.address.stateAbbreviation}
                            </span>
                            {stateInfo?.taxFree ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                🚫 免税州
                              </span>
                            ) : (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                💰 {stateInfo?.salesTaxRate}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setExpandedProfile(isExpanded ? null : profile.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* 详细信息 */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 个人信息 */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">个人信息</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>电话: {profile.personal.phone}</p>
                                <p>SSN: {maskSensitiveData(profile.personal.ssn)}</p>
                                <p>生日: {profile.personal.dateOfBirth}</p>
                                <p>年龄: {profile.personal.age}岁</p>
                                <p>性别: {profile.personal.gender}</p>
                                <p>职业: {profile.personal.occupation}</p>
                                <p>公司: {profile.personal.company}</p>
                              </div>
                            </div>

                            {/* 地址信息 */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">地址信息</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>街道: {profile.address.street}</p>
                                <p>城市: {profile.address.city}</p>
                                <p>州: {profile.address.state}</p>
                                <p>邮编: {profile.address.zipCode}</p>
                                <p>坐标: {profile.address.coordinates.lat.toFixed(6)}, {profile.address.coordinates.lng.toFixed(6)}</p>
                              </div>
                            </div>

                            {/* 金融信息 */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">金融信息</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>信用卡: {maskSensitiveData(profile.personal.creditCard.number)}</p>
                                <p>卡类型: {profile.personal.creditCard.type}</p>
                                <p>到期: {profile.personal.creditCard.expirationDate}</p>
                                <p>CVV: {maskSensitiveData(profile.personal.creditCard.cvv)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
