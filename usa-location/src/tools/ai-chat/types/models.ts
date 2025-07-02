// AI模型相关类型定义

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'openai' | 'deepseek' | 'gemini';
  description: string;
  maxTokens: number;
  supportsFunctions: boolean;
  supportsVision: boolean;
  pricing?: {
    input: number; // 每1K tokens价格
    output: number;
  };
}

export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamResponse {
  content: string;
  done: boolean;
  error?: string;
}

// OpenAI兼容接口
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// DeepSeek接口
export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// Gemini接口
export interface GeminiContent {
  parts: Array<{
    text: string;
  }>;
  role?: 'user' | 'model';
}

export interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}
