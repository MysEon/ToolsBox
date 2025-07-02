'use client';

import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Edit3, Settings2, Settings } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModelSelector from './ModelSelector';
import SettingsPanel from './SettingsPanel';
import { ChatState, ChatSession, ChatSettings, Message } from '../types/chat';
import { ChatStorage } from '../utils/chatStorage';
import { MessageUtils } from '../utils/messageUtils';
import { APIClient } from '../utils/apiClients';

interface ChatInterfaceProps {
  chatState: ChatState;
  settings: ChatSettings;
  onUpdateSessions: () => void;
  title: string;
}

export default function ChatInterface({ 
  chatState, 
  settings, 
  onUpdateSessions, 
  title 
}: ChatInterfaceProps) {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(settings.defaultProvider);
  const [showSessionList, setShowSessionList] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('你是一个有用的AI助手。请用中文回答问题，保持友好和专业的语调。如果用户上传了文档，请仔细分析文档内容并提供有价值的见解。');
  const [lastTruncationState, setLastTruncationState] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 获取当前会话
  useEffect(() => {
    if (chatState.activeSessionId) {
      const session = chatState.sessions.find(s => s.id === chatState.activeSessionId);
      setCurrentSession(session || null);
    } else {
      setCurrentSession(null);
    }
  }, [chatState.activeSessionId, chatState.sessions]);

  // 创建新会话
  const createNewSession = async () => {
    try {
      const newSession: ChatSession = {
        id: ChatStorage.generateId(),
        name: `新对话 ${new Date().toLocaleTimeString()}`,
        model: settings.providers[selectedProvider].model,
        provider: selectedProvider,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await ChatStorage.saveSession(newSession);
      await onUpdateSessions();
      setCurrentSession(newSession);
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  // 删除会话
  const deleteSession = async (sessionId: string) => {
    if (confirm('确定要删除这个会话吗？')) {
      try {
        await ChatStorage.deleteSession(sessionId);
        await onUpdateSessions();
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
        }
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  // 重命名会话
  const renameSession = async (sessionId: string, newName: string) => {
    try {
      const session = chatState.sessions.find(s => s.id === sessionId);
      if (session) {
        const updatedSession = { ...session, name: newName, updatedAt: Date.now() };
        await ChatStorage.saveSession(updatedSession);
        await onUpdateSessions();
      }
    } catch (error) {
      console.error('Failed to rename session:', error);
    }
  };

  // 发送消息
  const sendMessage = async (content: string, files?: File[]) => {
    if (!currentSession) {
      await createNewSession();
      return;
    }

    try {
      setIsLoading(true);

      // 处理文件上传
      let fileAttachments;
      let processedContent = content;

      if (files && files.length > 0) {
        const { PDFProcessor } = await import('../utils/pdfProcessor');
        fileAttachments = [];

        for (const file of files) {
          try {
            const result = await PDFProcessor.processPDF(file);
            if (result.success && result.text) {
              // 将PDF内容添加到消息中
              processedContent = MessageUtils.processMessageWithFiles(content, [{
                id: ChatStorage.generateId(),
                name: file.name,
                size: file.size,
                type: file.type,
                content: result.text,
                uploadedAt: Date.now()
              }]);

              fileAttachments.push({
                id: ChatStorage.generateId(),
                name: file.name,
                size: file.size,
                type: file.type,
                content: result.text,
                uploadedAt: Date.now()
              });
            }
          } catch (error) {
            console.error('PDF processing failed:', error);
            // 继续处理其他文件
          }
        }
      }

      // 创建用户消息
      const userMessage = MessageUtils.createUserMessage(processedContent, fileAttachments);

      // 更新会话
      let updatedMessages = [...currentSession.messages, userMessage];

      // 确保有系统消息（如果会话是新的且没有系统消息）
      if (updatedMessages.length === 1 && !updatedMessages.some(msg => msg.role === 'system')) {
        const systemMessage = MessageUtils.createSystemMessage(systemPrompt);
        updatedMessages = [systemMessage, ...updatedMessages];
      }

      const updatedSession = {
        ...currentSession,
        messages: updatedMessages,
        updatedAt: Date.now()
      };

      await ChatStorage.saveSession(updatedSession);
      await onUpdateSessions();

      // Token管理：截断消息以适应模型限制
      const config = settings.providers[selectedProvider];
      const maxContextTokens = Math.floor(config.maxTokens * 0.7); // 为回复预留30%的token
      const truncatedMessages = MessageUtils.truncateMessages(updatedMessages, maxContextTokens);

      // 检查是否发生了截断
      const wasTruncated = truncatedMessages.length < updatedMessages.length;
      setLastTruncationState(wasTruncated);
      if (wasTruncated) {
        console.log(`上下文已截断: ${updatedMessages.length} -> ${truncatedMessages.length} 条消息`);
      }

      // 调用AI API
      const response = await APIClient.callAPI(config, truncatedMessages);

      if (response.success && response.data) {
        // 创建AI回复消息
        const assistantMessage = MessageUtils.createAssistantMessage(response.data);
        
        // 再次更新会话
        const finalMessages = [...updatedMessages, assistantMessage];
        const finalSession = {
          ...updatedSession,
          messages: finalMessages,
          updatedAt: Date.now()
        };

        await ChatStorage.saveSession(finalSession);
        await onUpdateSessions();
      } else {
        throw new Error(response.error || 'API调用失败');
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      // 这里可以显示错误消息
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 头部 */}
      <div className="p-4 border-b dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{title}</h3>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-105"
              title="设置"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowSystemPrompt(!showSystemPrompt)}
              className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                showSystemPrompt
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
              title="系统提示词"
            >
              <Settings2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowSessionList(!showSessionList)}
              className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                showSessionList
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
              title="会话列表"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
            <button
              onClick={createNewSession}
              className="p-2.5 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              title="新建会话"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 模型选择器 */}
        <div className="mt-3">
          <ModelSelector
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
            settings={settings}
          />
        </div>

        {/* 当前会话信息 */}
        {currentSession && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>{currentSession.name} • {currentSession.messages.length} 条消息</span>
              <span className="text-xs">
                约 {MessageUtils.estimateTokens(
                  currentSession.messages.map(m => m.content).join(' ')
                )} tokens
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 系统提示词设置 */}
      {showSystemPrompt && (
        <div className="border-b dark:border-gray-700 p-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              系统提示词
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="设置AI的角色和行为..."
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowSystemPrompt(false)}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              取消
            </button>
            <button
              onClick={() => {
                setShowSystemPrompt(false);
                // 如果当前会话有系统消息，更新它
                if (currentSession && currentSession.messages.some(msg => msg.role === 'system')) {
                  const updatedMessages = currentSession.messages.map(msg =>
                    msg.role === 'system'
                      ? { ...msg, content: systemPrompt, timestamp: Date.now() }
                      : msg
                  );
                  const updatedSession = {
                    ...currentSession,
                    messages: updatedMessages,
                    updatedAt: Date.now()
                  };
                  ChatStorage.saveSession(updatedSession).then(() => onUpdateSessions());
                }
              }}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* 会话列表 */}
      {showSessionList && (
        <div className="border-b dark:border-gray-700 max-h-40 overflow-y-auto">
          {chatState.sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              暂无会话
            </div>
          ) : (
            <div className="p-2">
              {chatState.sessions.map(session => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    currentSession?.id === session.id
                      ? 'bg-indigo-100 dark:bg-indigo-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setCurrentSession(session)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {session.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {session.messages.length} 条消息 • {MessageUtils.formatMessageTime(session.updatedAt)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt('请输入新名称', session.name);
                        if (newName && newName !== session.name) {
                          renameSession(session.id, newName);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      title="重命名"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="删除"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-hidden">
        {currentSession ? (
          <MessageList
            messages={currentSession.messages}
            isLoading={isLoading}
            showTruncationWarning={lastTruncationState && currentSession.messages.length > 5}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>选择或创建一个会话开始对话</p>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      {currentSession && (
        <MessageInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          disabled={!currentSession}
        />
      )}

      {/* 设置面板 */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={onSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
