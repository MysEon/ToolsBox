import { ModelInfo } from '../types/models';

// 支持的AI模型配置
export const availableModels: ModelInfo[] = [
  // OpenAI兼容模型
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: '最新的GPT-4优化版本，平衡性能和成本',
    maxTokens: 128000,
    supportsFunctions: true,
    supportsVision: true,
    pricing: { input: 0.005, output: 0.015 }
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: '轻量级GPT-4模型，更快更便宜',
    maxTokens: 128000,
    supportsFunctions: true,
    supportsVision: true,
    pricing: { input: 0.00015, output: 0.0006 }
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: '经典的GPT-3.5模型，性价比高',
    maxTokens: 16385,
    supportsFunctions: true,
    supportsVision: false,
    pricing: { input: 0.0015, output: 0.002 }
  },

  // DeepSeek模型
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    description: 'DeepSeek的对话模型，中文表现优秀',
    maxTokens: 32768,
    supportsFunctions: true,
    supportsVision: false,
    pricing: { input: 0.0014, output: 0.0028 }
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    description: '专门优化的代码生成模型',
    maxTokens: 16384,
    supportsFunctions: true,
    supportsVision: false,
    pricing: { input: 0.0014, output: 0.0028 }
  },

  // Gemini模型
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    description: 'Google最新的多模态大模型',
    maxTokens: 2097152,
    supportsFunctions: true,
    supportsVision: true,
    pricing: { input: 0.0035, output: 0.0105 }
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    description: '快速响应的Gemini模型',
    maxTokens: 1048576,
    supportsFunctions: true,
    supportsVision: true,
    pricing: { input: 0.00035, output: 0.00105 }
  }
];

// 默认配置
export const defaultChatSettings = {
  providers: {
    openai: {
      provider: 'openai' as const,
      model: 'gpt-4o-mini',
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      temperature: 0.7,
      maxTokens: 4000
    },
    deepseek: {
      provider: 'deepseek' as const,
      model: 'deepseek-chat',
      apiKey: '',
      baseUrl: 'https://api.deepseek.com/v1',
      temperature: 0.7,
      maxTokens: 4000
    },
    gemini: {
      provider: 'gemini' as const,
      model: 'gemini-1.5-flash',
      apiKey: '',
      temperature: 0.7,
      maxTokens: 4000
    }
  },
  defaultProvider: 'openai' as const,
  autoSave: true,
  maxHistoryLength: 100,
  enableMarkdown: true,
  enableCodeHighlight: true,
  theme: 'auto' as const
};

// 根据provider获取可用模型
export const getModelsByProvider = (provider: string) => {
  return availableModels.filter(model => model.provider === provider);
};

// 根据ID获取模型信息
export const getModelById = (id: string) => {
  return availableModels.find(model => model.id === id);
};

// 动态模型列表缓存
let cachedModels: { [key: string]: ModelInfo[] } = {};
let lastFetchTime: { [key: string]: number } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 从API获取模型列表
export async function fetchModelsFromAPI(provider: string, apiKey: string, baseUrl?: string): Promise<ModelInfo[]> {
  try {
    const now = Date.now();
    const lastFetch = lastFetchTime[provider] || 0;

    // 检查缓存
    if (cachedModels[provider] && (now - lastFetch) < CACHE_DURATION) {
      return cachedModels[provider];
    }

    let models: ModelInfo[] = [];

    switch (provider) {
      case 'openai':
        models = await fetchOpenAIModels(apiKey, baseUrl || 'https://api.openai.com/v1');
        break;
      case 'deepseek':
        models = await fetchDeepSeekModels(apiKey);
        break;
      case 'gemini':
        models = await fetchGeminiModels(apiKey);
        break;
      default:
        models = getModelsByProvider(provider);
    }

    // 更新缓存
    cachedModels[provider] = models;
    lastFetchTime[provider] = now;

    return models;
  } catch (error) {
    console.error(`Failed to fetch models for ${provider}:`, error);
    // 返回默认模型
    return getModelsByProvider(provider);
  }
}

// 获取OpenAI模型列表
async function fetchOpenAIModels(apiKey: string, baseUrl: string): Promise<ModelInfo[]> {
  const response = await fetch(`${baseUrl}/models`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.data
    .filter((model: any) => model.id.includes('gpt'))
    .map((model: any) => ({
      id: model.id,
      name: model.id.toUpperCase().replace(/-/g, ' '),
      provider: 'openai',
      description: `OpenAI ${model.id}`,
      maxTokens: getModelMaxTokens(model.id),
      supportsVision: model.id.includes('gpt-4') && !model.id.includes('3.5'),
      supportsFunctions: true,
      pricing: getModelPricing(model.id)
    }));
}

// 获取DeepSeek模型列表
async function fetchDeepSeekModels(apiKey: string): Promise<ModelInfo[]> {
  const response = await fetch('https://api.deepseek.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.data.map((model: any) => ({
    id: model.id,
    name: model.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    provider: 'deepseek',
    description: `DeepSeek ${model.id}`,
    maxTokens: 32768,
    supportsVision: false,
    supportsFunctions: true,
    pricing: { input: 0.0014, output: 0.0028 }
  }));
}

// 获取Gemini模型列表
async function fetchGeminiModels(apiKey: string): Promise<ModelInfo[]> {
  // Gemini API不提供模型列表接口，返回已知模型
  return getModelsByProvider('gemini');
}

// 根据模型ID估算最大token数
function getModelMaxTokens(modelId: string): number {
  if (modelId.includes('gpt-4o') || modelId.includes('gpt-4-turbo')) {
    return 128000;
  } else if (modelId.includes('gpt-4')) {
    return 8192;
  } else if (modelId.includes('gpt-3.5-turbo')) {
    return 16385;
  }
  return 4096;
}

// 根据模型ID获取定价信息
function getModelPricing(modelId: string): { input: number; output: number } {
  const defaultModel = getModelById(modelId);
  if (defaultModel?.pricing) {
    return defaultModel.pricing;
  }

  // 默认定价
  if (modelId.includes('gpt-4o-mini')) {
    return { input: 0.00015, output: 0.0006 };
  } else if (modelId.includes('gpt-4')) {
    return { input: 0.005, output: 0.015 };
  } else if (modelId.includes('gpt-3.5')) {
    return { input: 0.0015, output: 0.002 };
  }

  return { input: 0.001, output: 0.002 };
}
