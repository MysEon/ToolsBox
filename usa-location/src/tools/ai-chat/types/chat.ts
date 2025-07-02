// AI聊天相关类型定义

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  fileAttachments?: FileInfo[];
  isStreaming?: boolean;
}

export interface FileInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string; // PDF解析后的文本内容
  uploadTime: number;
}

export interface ChatSession {
  id: string;
  name: string;
  model: string;
  provider: ModelProvider;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  attachedFiles?: FileInfo[];
  systemPrompt?: string;
}

export interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface DualChatState {
  leftChat: ChatState;
  rightChat: ChatState;
  layout: {
    leftWidth: number; // 百分比
    rightWidth: number; // 百分比
  };
}

export type ModelProvider = 'openai' | 'deepseek' | 'gemini';

export interface ChatConfig {
  provider: ModelProvider;
  model: string;
  apiKey: string;
  baseUrl?: string; // 用于OpenAI兼容接口
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ChatSettings {
  providers: {
    [key in ModelProvider]: ChatConfig;
  };
  defaultProvider: ModelProvider;
  autoSave: boolean;
  maxHistoryLength: number;
  enableMarkdown: boolean;
  enableCodeHighlight: boolean;
  theme: 'light' | 'dark' | 'auto';
}
