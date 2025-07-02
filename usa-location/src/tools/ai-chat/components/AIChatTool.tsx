'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Download, Upload, RotateCcw } from 'lucide-react';
import ChatInterface from './ChatInterface';
import ChatSettings from './ChatSettings';
import { DualChatState, ChatSession, ChatSettings as ChatSettingsType } from '../types/chat';
import { ChatStorage } from '../utils/chatStorage';
import { defaultChatSettings } from '../data/models';

export default function AIChatTool() {
  const [dualChatState, setDualChatState] = useState<DualChatState>({
    leftChat: {
      sessions: [],
      activeSessionId: null,
      isLoading: false,
      error: null
    },
    rightChat: {
      sessions: [],
      activeSessionId: null,
      isLoading: false,
      error: null
    },
    layout: {
      leftWidth: 50,
      rightWidth: 50
    }
  });

  const [settings, setSettings] = useState<ChatSettingsType>(defaultChatSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // 加载设置
        const savedSettings = await ChatStorage.getSettings();
        setSettings(savedSettings);
        
        // 加载会话
        const sessions = await ChatStorage.getSessions();
        
        setDualChatState(prev => ({
          ...prev,
          leftChat: {
            ...prev.leftChat,
            sessions
          },
          rightChat: {
            ...prev.rightChat,
            sessions
          }
        }));
        
      } catch (error) {
        console.error('Failed to initialize chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // 更新会话
  const updateSessions = async () => {
    try {
      const sessions = await ChatStorage.getSessions();
      setDualChatState(prev => ({
        ...prev,
        leftChat: {
          ...prev.leftChat,
          sessions
        },
        rightChat: {
          ...prev.rightChat,
          sessions
        }
      }));
    } catch (error) {
      console.error('Failed to update sessions:', error);
    }
  };

  // 保存设置
  const handleSaveSettings = async (newSettings: ChatSettingsType) => {
    try {
      await ChatStorage.saveSettings(newSettings);
      setSettings(newSettings);
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // 导出数据
  const handleExportData = async () => {
    try {
      const data = await ChatStorage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-chat-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('导出失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 导入数据
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        await ChatStorage.importData(text);
        await updateSessions();
        alert('导入成功！');
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('导入失败：' + (error instanceof Error ? error.message : '未知错误'));
      }
    };
    input.click();
  };

  // 清理数据
  const handleCleanupData = async () => {
    if (confirm('确定要清理30天前的旧数据吗？此操作不可撤销。')) {
      try {
        await ChatStorage.cleanupOldData();
        await updateSessions();
        alert('清理完成！');
      } catch (error) {
        console.error('Failed to cleanup data:', error);
        alert('清理失败：' + (error instanceof Error ? error.message : '未知错误'));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            双对话框AI助手
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            左右独立运行，互不干扰
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportData}
            className="flex items-center px-3 py-2 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            title="导出数据"
          >
            <Download className="h-4 w-4 mr-1" />
            导出
          </button>
          
          <button
            onClick={handleImportData}
            className="flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            title="导入数据"
          >
            <Upload className="h-4 w-4 mr-1" />
            导入
          </button>
          
          <button
            onClick={handleCleanupData}
            className="flex items-center px-3 py-2 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
            title="清理旧数据"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            清理
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="设置"
          >
            <Settings className="h-4 w-4 mr-1" />
            设置
          </button>
        </div>
      </div>

      {/* 双对话框区域 */}
      <div className="flex-1 flex gap-4">
        {/* 左侧对话框 */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700"
          style={{ width: `${dualChatState.layout.leftWidth}%` }}
        >
          <ChatInterface
            chatState={dualChatState.leftChat}
            settings={settings}
            onUpdateSessions={updateSessions}
            title="对话框 A"
          />
        </div>

        {/* 分隔线 */}
        <div className="w-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />

        {/* 右侧对话框 */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700"
          style={{ width: `${dualChatState.layout.rightWidth}%` }}
        >
          <ChatInterface
            chatState={dualChatState.rightChat}
            settings={settings}
            onUpdateSessions={updateSessions}
            title="对话框 B"
          />
        </div>
      </div>

      {/* 设置弹窗 */}
      {showSettings && (
        <ChatSettings
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
