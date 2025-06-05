'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';

// 类型定义
export interface ToolUsageHistory {
  toolId: string;
  lastUsed: number;
  usageCount: number;
}

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
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
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

  // 从 localStorage 加载偏好设置
  useEffect(() => {
    try {
      const saved = localStorage.getItem('toolsbox-preferences');
      if (saved) {
        const parsedPreferences = JSON.parse(saved);
        // 验证数据结构
        if (parsedPreferences && typeof parsedPreferences === 'object') {
          dispatch({ type: 'LOAD_PREFERENCES', payload: { ...defaultPreferences, ...parsedPreferences } });
        }
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }, []);

  // 保存偏好设置到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('toolsbox-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }, [preferences]);

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
    clearAllData,
    exportData,
    importData,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
