import { ChatConfig, Message } from '../types/chat';
import { APIResponse, StreamResponse } from '../types/models';

export class APIClient {
  // OpenAI兼容接口客户端
  static async callOpenAI(
    config: ChatConfig,
    messages: Message[],
    onStream?: (response: StreamResponse) => void
  ): Promise<APIResponse> {
    try {
      const { apiKey, baseUrl, model, temperature, maxTokens } = config;
      
      if (!apiKey) {
        throw new Error('请配置OpenAI API密钥');
      }

      const requestBody = {
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 4000,
        stream: !!onStream
      };

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      if (onStream) {
        return this.handleStreamResponse(response, onStream);
      } else {
        const data = await response.json();
        return {
          success: true,
          data: data.choices[0]?.message?.content || '',
          usage: data.usage
        };
      }
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      };
    }
  }

  // DeepSeek接口客户端
  static async callDeepSeek(
    config: ChatConfig,
    messages: Message[],
    onStream?: (response: StreamResponse) => void
  ): Promise<APIResponse> {
    try {
      const { apiKey, model, temperature, maxTokens } = config;
      
      if (!apiKey) {
        throw new Error('请配置DeepSeek API密钥');
      }

      const requestBody = {
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 4000,
        stream: !!onStream
      };

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      if (onStream) {
        return this.handleStreamResponse(response, onStream);
      } else {
        const data = await response.json();
        return {
          success: true,
          data: data.choices[0]?.message?.content || '',
          usage: data.usage
        };
      }
    } catch (error) {
      console.error('DeepSeek API call failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      };
    }
  }

  // Gemini接口客户端
  static async callGemini(
    config: ChatConfig,
    messages: Message[],
    onStream?: (response: StreamResponse) => void
  ): Promise<APIResponse> {
    try {
      const { apiKey, model, temperature, maxTokens } = config;
      
      if (!apiKey) {
        throw new Error('请配置Gemini API密钥');
      }

      // 转换消息格式
      const contents = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          parts: [{ text: msg.content }],
          role: msg.role === 'assistant' ? 'model' : 'user'
        }));

      // 处理系统消息
      const systemMessage = messages.find(msg => msg.role === 'system');
      if (systemMessage) {
        contents.unshift({
          parts: [{ text: systemMessage.content }],
          role: 'user'
        });
      }

      const requestBody = {
        contents,
        generationConfig: {
          temperature: temperature || 0.7,
          maxOutputTokens: maxTokens || 4000
        }
      };

      const endpoint = onStream ? 'streamGenerateContent' : 'generateContent';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      if (onStream) {
        return this.handleGeminiStreamResponse(response, onStream);
      } else {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return {
          success: true,
          data: content,
          usage: data.usageMetadata
        };
      }
    } catch (error) {
      console.error('Gemini API call failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      };
    }
  }

  // 处理流式响应
  static async handleStreamResponse(
    response: Response,
    onStream: (response: StreamResponse) => void
  ): Promise<APIResponse> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onStream({ content: '', done: true });
              return { success: true, data: fullContent };
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onStream({ content, done: false });
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      return { success: true, data: fullContent };
    } catch (error) {
      onStream({ content: '', done: true, error: '流式响应处理失败' });
      throw error;
    }
  }

  // 处理Gemini流式响应
  static async handleGeminiStreamResponse(
    response: Response,
    onStream: (response: StreamResponse) => void
  ): Promise<APIResponse> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() && line.startsWith('{')) {
            try {
              const parsed = JSON.parse(line);
              const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (content) {
                fullContent += content;
                onStream({ content, done: false });
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      onStream({ content: '', done: true });
      return { success: true, data: fullContent };
    } catch (error) {
      onStream({ content: '', done: true, error: '流式响应处理失败' });
      throw error;
    }
  }

  // 统一调用接口
  static async callAPI(
    config: ChatConfig,
    messages: Message[],
    onStream?: (response: StreamResponse) => void
  ): Promise<APIResponse> {
    switch (config.provider) {
      case 'openai':
        return this.callOpenAI(config, messages, onStream);
      case 'deepseek':
        return this.callDeepSeek(config, messages, onStream);
      case 'gemini':
        return this.callGemini(config, messages, onStream);
      default:
        return {
          success: false,
          error: '不支持的API提供商'
        };
    }
  }
}
