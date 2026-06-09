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
  Settings,
} from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { advancedStorage } from '../utils/indexedDB';
import { DataMigration } from '../utils/dataMigration';
import { downloadBlob } from '../utils/fileExport';
import Modal from './Modal';

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

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isOpen) { loadBackups(); refreshStorageInfo(); }
  }, [isOpen, refreshStorageInfo]);

  const loadBackups = async () => {
    try { const allBackups = await advancedStorage.getAllBackups(); setBackups(allBackups); }
    catch (error) { console.error('Failed to load backups:', error); }
  };

  const handleCreateBackup = async () => {
    try {
      setIsLoading(true);
      const data = exportData();
      await advancedStorage.createBackup(`手动备份 ${new Date().toLocaleString()}`, JSON.parse(data));
      await loadBackups();
      setMessage({ type: 'success', text: '备份创建成功！' });
    } catch { setMessage({ type: 'error', text: '备份创建失败' }); }
    finally { setIsLoading(false); }
  };

  const handleExportData = () => {
    try {
      const data = exportData();
      downloadBlob(new Blob([data], { type: 'application/json' }), `toolsbox-backup-${new Date().toISOString().split('T')[0]}.json`);
      setMessage({ type: 'success', text: '数据导出成功！' });
    } catch { setMessage({ type: 'error', text: '数据导出失败' }); }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        if (importData(data)) { setMessage({ type: 'success', text: '数据导入成功！' }); refreshStorageInfo(); }
        else { setMessage({ type: 'error', text: '数据格式无效' }); }
      } catch { setMessage({ type: 'error', text: '数据导入失败' }); }
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
      } catch { setMessage({ type: 'error', text: '数据清除失败' }); }
      finally { setIsLoading(false); }
    }
  };

  const handleSaveQuotaSettings = () => {
    updateStorageSettings({ customQuota: customQuotaGB * 1024 * 1024 * 1024, useCustomQuota, warningThreshold });
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

  const migrationStatus = isMounted ? DataMigration.getMigrationStatus() : { completed: false };

  const msgIcon = { success: CheckCircle, error: AlertCircle, info: Info };

  return (
    <Modal open={isOpen && isMounted} onClose={onClose} title="存储管理" size="lg">
      <div className="space-y-5">
        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg flex items-center space-x-2 text-sm ${
            message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
            message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
            'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
          }`}>
            {React.createElement(msgIcon[message.type], { className: 'h-4 w-4 shrink-0' })}
            <span>{message.text}</span>
          </div>
        )}

        {/* Storage usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IndexedDB */}
          <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <HardDrive className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">IndexedDB</h3>
            </div>
            {storageInfo?.indexedDB && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">已使用:</span><span className="text-zinc-700 dark:text-zinc-300">{formatBytes(storageInfo.indexedDB.usage)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">{storageInfo.indexedDB.quotaType === 'custom' ? '自定义配额:' : '浏览器配额:'}</span><span className="text-zinc-700 dark:text-zinc-300">{formatBytes(storageInfo.indexedDB.quota)}</span></div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-600 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${storageInfo.indexedDB.isOverQuota ? 'bg-red-500' : storageInfo.indexedDB.percentage >= preferences.storage.warningThreshold ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(storageInfo.indexedDB.percentage, 100)}%` }}
                  />
                </div>
                <div className={`text-xs ${storageInfo.indexedDB.isOverQuota ? 'text-red-500' : storageInfo.indexedDB.percentage >= preferences.storage.warningThreshold ? 'text-yellow-500' : 'text-zinc-500'}`}>
                  {storageInfo.indexedDB.percentage.toFixed(1)}% 已使用
                  {storageInfo.indexedDB.isOverQuota && ' (超出配额)'}
                </div>
              </div>
            )}
          </div>

          {/* localStorage */}
          <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Database className="h-4 w-4 text-green-500" />
              <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">localStorage</h3>
            </div>
            {storageInfo?.localStorage && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">已使用:</span><span className="text-zinc-700 dark:text-zinc-300">{formatBytes(storageInfo.localStorage.usage)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">估计配额:</span><span className="text-zinc-700 dark:text-zinc-300">{formatBytes(storageInfo.localStorage.quota)}</span></div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-600 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(storageInfo.localStorage.percentage, 100)}%` }} />
                </div>
                <div className="text-xs text-zinc-500">{storageInfo.localStorage.percentage.toFixed(1)}% 已使用</div>
              </div>
            )}
          </div>
        </div>

        {/* Quota settings */}
        <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-4">
          <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 mb-4 flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>配额设置</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">使用自定义配额限制</label>
              <button
                onClick={() => setUseCustomQuota(!useCustomQuota)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useCustomQuota ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useCustomQuota ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400">配额大小 (GB)</label>
              <input type="number" min="1" max="100" value={customQuotaGB} onChange={(e) => setCustomQuotaGB(Number(e.target.value))} disabled={!useCustomQuota}
                className="w-full mt-1 px-3 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 disabled:opacity-50" />
            </div>
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400">警告阈值 ({warningThreshold}%)</label>
              <input type="range" min="50" max="95" step="5" value={warningThreshold} onChange={(e) => setWarningThreshold(Number(e.target.value))} className="w-full mt-1" />
            </div>
            <button onClick={handleSaveQuotaSettings} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">保存设置</button>
          </div>
        </div>

        {/* Migration status */}
        {migrationStatus.completed && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-700 dark:text-green-300">数据迁移已完成</span>
            </div>
            <div className="mt-2 text-green-600 dark:text-green-400 space-y-0.5">
              <p>迁移时间: {new Date(migrationStatus.timestamp!).toLocaleString()}</p>
              <p>迁移项目: {migrationStatus.migratedItems} 个</p>
              <p>数据大小: {formatBytes(migrationStatus.totalSize || 0)}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={handleCreateBackup} disabled={isLoading} className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
            <Database className="h-4 w-4" /><span>创建备份</span>
          </button>
          <button onClick={handleExportData} className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            <Download className="h-4 w-4" /><span>导出数据</span>
          </button>
          <label className="flex items-center justify-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 cursor-pointer text-sm">
            <Upload className="h-4 w-4" /><span>导入数据</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
          <button onClick={handleClearAllData} disabled={isLoading} className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm">
            <Trash2 className="h-4 w-4" /><span>清除数据</span>
          </button>
        </div>

        {/* Backup list */}
        {backups.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">备份历史</h3>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {backups.slice(0, 5).map((backup, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg text-sm">
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{backup.name}</div>
                    <div className="text-xs text-zinc-500">{backup.createdAt}</div>
                  </div>
                  <div className="text-xs text-zinc-400">v{backup.version}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button onClick={refreshStorageInfo} className="flex items-center space-x-2 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            <RefreshCw className="h-4 w-4" /><span>刷新存储信息</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const StorageManager = dynamic(() => Promise.resolve(StorageManagerContent), { ssr: false, loading: () => null });
