'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Database,
  HardDrive,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Settings
} from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { advancedStorage } from '../utils/indexedDB';
import { DataMigration } from '../utils/dataMigration';

interface StorageManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const StorageManagerContent: React.FC<StorageManagerProps> = ({ isOpen, onClose }) => {
  const { storageInfo, refreshStorageInfo, exportData, importData, clearAllData, preferences, updateStorageSettings } = useUserPreferences();
  const [backups, setBackups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [customQuotaGB, setCustomQuotaGB] = useState(Math.round(preferences.storage.customQuota / (1024 * 1024 * 1024)));
  const [warningThreshold, setWarningThreshold] = useState(preferences.storage.warningThreshold);
  const [useCustomQuota, setUseCustomQuota] = useState(preferences.storage.useCustomQuota);

  // 确保只在客户端渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadBackups();
      refreshStorageInfo();
    }
  }, [isOpen, refreshStorageInfo]);

  const loadBackups = async () => {
    try {
      const allBackups = await advancedStorage.getAllBackups();
      setBackups(allBackups);
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setIsLoading(true);
      const data = exportData();
      const backupName = `手动备份 ${new Date().toLocaleString()}`;
      await advancedStorage.createBackup(backupName, JSON.parse(data));
      await loadBackups();
      setMessage({ type: 'success', text: '备份创建成功！' });
    } catch (error) {
      setMessage({ type: 'error', text: '备份创建失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toolsbox-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: '数据导出成功！' });
    } catch (error) {
      setMessage({ type: 'error', text: '数据导出失败' });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const success = importData(data);
        if (success) {
          setMessage({ type: 'success', text: '数据导入成功！' });
          refreshStorageInfo();
        } else {
          setMessage({ type: 'error', text: '数据格式无效' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: '数据导入失败' });
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = async () => {
    if (window.confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      try {
        setIsLoading(true);
        clearAllData();
        await refreshStorageInfo();
        setMessage({ type: 'success', text: '数据清除成功！' });
      } catch (error) {
        setMessage({ type: 'error', text: '数据清除失败' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 保存配额设置
  const handleSaveQuotaSettings = () => {
    const newQuotaBytes = customQuotaGB * 1024 * 1024 * 1024;
    updateStorageSettings({
      customQuota: newQuotaBytes,
      useCustomQuota,
      warningThreshold,
    });
    refreshStorageInfo();
    setMessage({ type: 'success', text: '配额设置已保存' });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 只在客户端获取迁移状态
  const migrationStatus = isMounted ? DataMigration.getMigrationStatus() : { completed: false };

  if (!isOpen || !isMounted) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">存储管理</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-100 text-green-800' :
            message.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {message.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {message.type === 'error' && <AlertCircle className="h-4 w-4" />}
            {message.type === 'info' && <Info className="h-4 w-4" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* 存储使用情况 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IndexedDB */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <HardDrive className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">IndexedDB</h3>
              </div>
              {storageInfo?.indexedDB && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>已使用:</span>
                    <span>{formatBytes(storageInfo.indexedDB.usage)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{storageInfo.indexedDB.quotaType === 'custom' ? '自定义配额:' : '浏览器配额:'}</span>
                    <span>{formatBytes(storageInfo.indexedDB.quota)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        storageInfo.indexedDB.isOverQuota ? 'bg-red-600' :
                        storageInfo.indexedDB.percentage >= preferences.storage.warningThreshold ? 'bg-yellow-600' :
                        'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(storageInfo.indexedDB.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className={`text-xs ${
                    storageInfo.indexedDB.isOverQuota ? 'text-red-600' :
                    storageInfo.indexedDB.percentage >= preferences.storage.warningThreshold ? 'text-yellow-600' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {storageInfo.indexedDB.percentage.toFixed(1)}% 已使用
                    {storageInfo.indexedDB.isOverQuota && ' (超出配额)'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    * {storageInfo.indexedDB.quotaType === 'custom' ? '使用自定义配额限制' : '配额基于设备存储空间动态分配'}
                  </div>
                </div>
              )}
            </div>

            {/* localStorage */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">localStorage</h3>
              </div>
              {storageInfo?.localStorage && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>已使用:</span>
                    <span>{formatBytes(storageInfo.localStorage.usage)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>估计配额:</span>
                    <span>{formatBytes(storageInfo.localStorage.quota)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(storageInfo.localStorage.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {storageInfo.localStorage.percentage.toFixed(1)}% 已使用
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 配额设置 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>配额设置</span>
            </h3>

            <div className="space-y-4">
              {/* 使用自定义配额开关 */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  使用自定义配额限制
                </label>
                <button
                  onClick={() => setUseCustomQuota(!useCustomQuota)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useCustomQuota ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useCustomQuota ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 自定义配额大小 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  配额大小 (GB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customQuotaGB}
                  onChange={(e) => setCustomQuotaGB(Number(e.target.value))}
                  disabled={!useCustomQuota}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                />
              </div>

              {/* 警告阈值 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  警告阈值 ({warningThreshold}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>

              {/* 保存按钮 */}
              <button
                onClick={handleSaveQuotaSettings}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存设置
              </button>
            </div>
          </div>

          {/* 迁移状态 */}
          {migrationStatus.completed && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800 dark:text-green-200">数据迁移已完成</h3>
              </div>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>迁移时间: {new Date(migrationStatus.timestamp!).toLocaleString()}</p>
                <p>迁移项目: {migrationStatus.migratedItems} 个</p>
                <p>数据大小: {formatBytes(migrationStatus.totalSize || 0)}</p>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={handleCreateBackup}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Database className="h-4 w-4" />
              <span>创建备份</span>
            </button>

            <button
              onClick={handleExportData}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>导出数据</span>
            </button>

            <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>导入数据</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearAllData}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>清除数据</span>
            </button>
          </div>

          {/* 备份列表 */}
          {backups.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">备份历史</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {backups.slice(0, 5).map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{backup.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{backup.createdAt}</div>
                    </div>
                    <div className="text-sm text-gray-500">v{backup.version}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 刷新按钮 */}
          <div className="flex justify-center">
            <button
              onClick={refreshStorageInfo}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>刷新存储信息</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 使用动态导入确保只在客户端渲染
export const StorageManager = dynamic(
  () => Promise.resolve(StorageManagerContent),
  {
    ssr: false,
    loading: () => null
  }
);
