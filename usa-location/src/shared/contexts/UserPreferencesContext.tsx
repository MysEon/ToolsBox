'use client';

import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { advancedStorage } from '../utils/indexedDB';
import { autoMigrate, DataMigration } from '../utils/dataMigration';

// 类型定义
export interface ToolUsageHistory {
  toolId: string;
  lastUsed: number;
  usageCount: number;
}

export type LayoutDensity = 'compact' | 'standard' | 'spacious';
export type GridColumns = 'auto' | '3' | '4' | '5' | '6';

export interface UserPreferences {
  favoriteTools: string[];
  usageHistory: ToolUsageHistory[];
  searchHistory: string[];
  settings: {
    showUsageHistory: boolean;
    showFavorites: boolean;
    maxHistoryItems: number;
    maxSearchHistory: number;
  };
  layout: {
    density: LayoutDensity;
    gridColumns: GridColumns;
  };
  storage: {
    customQuota: number; // 用户自定义配额，单位：字节
    useCustomQuota: boolean; // 是否使用自定义配额
    warningThreshold: number; // 警告阈值，百分比 (0-100)
    lastWarningTime: number; // 上次警告时间戳
  };
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  addToFavorites: (toolId: string) => void;
  removeFromFavorites: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  recordToolUsage: (toolId: string) => void;
  getRecentlyUsedTools: (limit?: number) => ToolUsageHistory[];
  addToSearchHistory: (searchTerm: string) => void;
  clearSearchHistory: () => void;
  updateSettings: (settings: Partial<UserPreferences['settings']>) => void;
  updateLayoutSettings: (layout: Partial<UserPreferences['layout']>) => void;
  updateStorageSettings: (storage: Partial<UserPreferences['storage']>) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  isLoading: boolean;
  storageInfo: {
    indexedDB: { usage: number; quota: number; percentage: number; quotaType: 'estimated' | 'custom' | 'unknown'; isOverQuota: boolean };
    localStorage: { usage: number; quota: number; percentage: number };
  } | null;
  refreshStorageInfo: () => Promise<void>;
}

// 默认偏好设置
const defaultPreferences: UserPreferences = {
  favoriteTools: [],
  usageHistory: [],
  searchHistory: [],
  settings: {
    showUsageHistory: true,
    showFavorites: true,
    maxHistoryItems: 10,
    maxSearchHistory: 20,
  },
  layout: {
    density: 'standard',
    gridColumns: 'auto',
  },
  storage: {
    customQuota: 5 * 1024 * 1024 * 1024, // 默认5GB
    useCustomQuota: true, // 默认使用自定义配额
    warningThreshold: 80, // 80%时警告
    lastWarningTime: 0, // 上次警告时间
  },
};

// Action 类型
type PreferencesAction =
  | { type: 'LOAD_PREFERENCES'; payload: UserPreferences }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'RECORD_USAGE'; payload: string }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserPreferences['settings']> }
  | { type: 'UPDATE_LAYOUT_SETTINGS'; payload: Partial<UserPreferences['layout']> }
  | { type: 'UPDATE_STORAGE_SETTINGS'; payload: Partial<UserPreferences['storage']> }
  | { type: 'CLEAR_ALL_DATA' };

// Reducer
const preferencesReducer = (state: UserPreferences, action: PreferencesAction): UserPreferences => {
  switch (action.type) {
    case 'LOAD_PREFERENCES':
      return action.payload;

    case 'ADD_FAVORITE':
      if (state.favoriteTools.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favoriteTools: [...state.favoriteTools, action.payload],
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favoriteTools: state.favoriteTools.filter(id => id !== action.payload),
      };

    case 'RECORD_USAGE': {
      const toolId = action.payload;
      const now = Date.now();
      const existingIndex = state.usageHistory.findIndex(item => item.toolId === toolId);
      
      let newUsageHistory: ToolUsageHistory[];
      
      if (existingIndex >= 0) {
        // 更新现有记录
        newUsageHistory = state.usageHistory.map((item, index) =>
          index === existingIndex
            ? { ...item, lastUsed: now, usageCount: item.usageCount + 1 }
            : item
        );
      } else {
        // 添加新记录
        newUsageHistory = [
          ...state.usageHistory,
          { toolId, lastUsed: now, usageCount: 1 }
        ];
      }
      
      // 按最后使用时间排序并限制数量
      newUsageHistory.sort((a, b) => b.lastUsed - a.lastUsed);
      if (newUsageHistory.length > state.settings.maxHistoryItems) {
        newUsageHistory = newUsageHistory.slice(0, state.settings.maxHistoryItems);
      }
      
      return {
        ...state,
        usageHistory: newUsageHistory,
      };
    }

    case 'ADD_SEARCH_HISTORY': {
      const searchTerm = action.payload.trim();
      if (!searchTerm || state.searchHistory.includes(searchTerm)) {
        return state;
      }
      
      let newSearchHistory = [searchTerm, ...state.searchHistory];
      if (newSearchHistory.length > state.settings.maxSearchHistory) {
        newSearchHistory = newSearchHistory.slice(0, state.settings.maxSearchHistory);
      }
      
      return {
        ...state,
        searchHistory: newSearchHistory,
      };
    }

    case 'CLEAR_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [],
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'UPDATE_LAYOUT_SETTINGS':
      return {
        ...state,
        layout: { ...state.layout, ...action.payload },
      };

    case 'UPDATE_STORAGE_SETTINGS':
      return {
        ...state,
        storage: { ...state.storage, ...action.payload },
      };

    case 'CLEAR_ALL_DATA':
      return defaultPreferences;

    default:
      return state;
  }
};

// Context
const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Hook
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

// Provider
interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, dispatch] = useReducer(preferencesReducer, defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState<{
    indexedDB: { usage: number; quota: number; percentage: number; quotaType: 'estimated' | 'custom' | 'unknown'; isOverQuota: boolean };
    localStorage: { usage: number; quota: number; percentage: number };
  } | null>(null);

  // 初始化和数据迁移
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsLoading(true);

        // 执行自动迁移
        await autoMigrate();

        // 尝试从IndexedDB加载偏好设置
        const savedPreferences = await advancedStorage.getPreferences();

        if (savedPreferences) {
          // 合并默认设置和保存的设置
          const mergedPreferences = {
            ...defaultPreferences,
            ...savedPreferences,
            settings: {
              ...defaultPreferences.settings,
              ...savedPreferences.settings,
            },
            layout: {
              ...defaultPreferences.layout,
              ...savedPreferences.layout,
            },
            storage: {
              ...defaultPreferences.storage,
              ...savedPreferences.storage,
            },
          };
          dispatch({ type: 'LOAD_PREFERENCES', payload: mergedPreferences });
        } else {
          // 如果IndexedDB中没有数据，尝试从localStorage加载（兜底方案）
          try {
            const saved = localStorage.getItem('toolsbox-preferences');
            if (saved) {
              const parsedPreferences = JSON.parse(saved);
              if (parsedPreferences && typeof parsedPreferences === 'object') {
                const mergedPreferences = { ...defaultPreferences, ...parsedPreferences };
                dispatch({ type: 'LOAD_PREFERENCES', payload: mergedPreferences });

                // 立即保存到IndexedDB
                await advancedStorage.setPreferences(mergedPreferences);
              }
            }
          } catch (error) {
            console.warn('Failed to load from localStorage:', error);
          }
        }

        // 获取存储信息
        await refreshStorageInfo();

      } catch (error) {
        console.warn('Failed to initialize storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStorage();
  }, []);

  // 保存偏好设置到 IndexedDB
  useEffect(() => {
    if (!isLoading) {
      const savePreferences = async () => {
        try {
          await advancedStorage.setPreferences(preferences);
          // 同时保存到localStorage作为备份
          localStorage.setItem('toolsbox-preferences', JSON.stringify(preferences));
        } catch (error) {
          console.warn('Failed to save user preferences:', error);
          // 如果IndexedDB失败，至少保存到localStorage
          try {
            localStorage.setItem('toolsbox-preferences', JSON.stringify(preferences));
          } catch (localStorageError) {
            console.error('Failed to save to localStorage as well:', localStorageError);
          }
        }
      };

      savePreferences();
    }
  }, [preferences, isLoading]);

  // 刷新存储信息
  const refreshStorageInfo = async () => {
    try {
      const info = await advancedStorage.getStorageStats(
        preferences.storage.customQuota,
        preferences.storage.useCustomQuota
      );
      setStorageInfo(info);

      // 检查是否需要显示警告
      if (info.indexedDB.percentage >= preferences.storage.warningThreshold) {
        const now = Date.now();
        const timeSinceLastWarning = now - preferences.storage.lastWarningTime;
        const oneHour = 60 * 60 * 1000; // 1小时

        // 如果距离上次警告超过1小时，则显示新警告
        if (timeSinceLastWarning > oneHour) {
          showStorageWarning(info.indexedDB.percentage);
          // 更新上次警告时间
          dispatch({
            type: 'UPDATE_STORAGE_SETTINGS',
            payload: { lastWarningTime: now }
          });
        }
      }
    } catch (error) {
      console.warn('Failed to get storage info:', error);
    }
  };

  // 显示存储警告
  const showStorageWarning = (percentage: number) => {
    if (typeof window !== 'undefined') {
      const message = `存储空间使用率已达到 ${percentage.toFixed(1)}%，建议清理数据或增加配额限制。`;

      // 创建自定义警告弹窗
      const warningDiv = document.createElement('div');
      warningDiv.className = 'fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-50 max-w-sm';
      warningDiv.innerHTML = `
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">存储空间警告</p>
            <p class="text-sm">${message}</p>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="mt-2 text-xs text-yellow-600 hover:text-yellow-800 underline">关闭</button>
          </div>
        </div>
      `;

      document.body.appendChild(warningDiv);

      // 5秒后自动移除
      setTimeout(() => {
        if (warningDiv.parentNode) {
          warningDiv.parentNode.removeChild(warningDiv);
        }
      }, 5000);
    }
  };

  // 工具函数
  const addToFavorites = (toolId: string) => {
    dispatch({ type: 'ADD_FAVORITE', payload: toolId });
  };

  const removeFromFavorites = (toolId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: toolId });
  };

  const isFavorite = (toolId: string): boolean => {
    return preferences.favoriteTools.includes(toolId);
  };

  const recordToolUsage = (toolId: string) => {
    dispatch({ type: 'RECORD_USAGE', payload: toolId });
  };

  const getRecentlyUsedTools = (limit = 5): ToolUsageHistory[] => {
    return preferences.usageHistory
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, limit);
  };

  const addToSearchHistory = (searchTerm: string) => {
    dispatch({ type: 'ADD_SEARCH_HISTORY', payload: searchTerm });
  };

  const clearSearchHistory = () => {
    dispatch({ type: 'CLEAR_SEARCH_HISTORY' });
  };

  const updateSettings = (settings: Partial<UserPreferences['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const updateLayoutSettings = (layout: Partial<UserPreferences['layout']>) => {
    dispatch({ type: 'UPDATE_LAYOUT_SETTINGS', payload: layout });
  };

  const updateStorageSettings = (storage: Partial<UserPreferences['storage']>) => {
    dispatch({ type: 'UPDATE_STORAGE_SETTINGS', payload: storage });
  };

  const clearAllData = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
  };

  const exportData = (): string => {
    return JSON.stringify(preferences, null, 2);
  };

  const importData = (data: string): boolean => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData && typeof parsedData === 'object') {
        dispatch({ type: 'LOAD_PREFERENCES', payload: { ...defaultPreferences, ...parsedData } });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const value: UserPreferencesContextType = {
    preferences,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    recordToolUsage,
    getRecentlyUsedTools,
    addToSearchHistory,
    clearSearchHistory,
    updateSettings,
    updateLayoutSettings,
    updateStorageSettings,
    clearAllData,
    exportData,
    importData,
    isLoading,
    storageInfo,
    refreshStorageInfo,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
