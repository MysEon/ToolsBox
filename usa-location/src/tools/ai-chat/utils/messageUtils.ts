import { Message, FileInfo } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

export class MessageUtils {
  // 创建用户消息
  static createUserMessage(content: string, fileAttachments?: FileInfo[]): Message {
    return {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
      fileAttachments
    };
  }

  // 创建助手消息
  static createAssistantMessage(content: string): Message {
    return {
      id: uuidv4(),
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
  }

  // 创建系统消息
  static createSystemMessage(content: string): Message {
    return {
      id: uuidv4(),
      role: 'system',
      content,
      timestamp: Date.now()
    };
  }

  // 格式化消息时间
  static formatMessageTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return '刚刚';
    } else if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // 处理带文件的消息内容
  static processMessageWithFiles(content: string, files: FileInfo[]): string {
    if (!files || files.length === 0) {
      return content;
    }

    let processedContent = content;
    
    // 为每个文件添加上下文
    files.forEach(file => {
      if (file.content) {
        processedContent += `\n\n--- 附件：${file.name} ---\n${file.content}`;
      }
    });

    return processedContent;
  }

  // 清理消息内容
  static cleanMessageContent(content: string): string {
    return content
      .trim()
      .replace(/\n{3,}/g, '\n\n') // 移除多余的换行
      .replace(/\s+$/gm, ''); // 移除行尾空格
  }

  // 计算消息字符数
  static getMessageLength(message: Message): number {
    let length = message.content.length;
    
    if (message.fileAttachments) {
      message.fileAttachments.forEach(file => {
        if (file.content) {
          length += file.content.length;
        }
      });
    }
    
    return length;
  }

  // 估算token数量（粗略估算）
  static estimateTokens(text: string): number {
    // 中文字符按1.5个token计算，英文单词按1个token计算
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = text.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(word => word.length > 0).length;
    
    return Math.ceil(chineseChars * 1.5 + englishWords);
  }

  // 截断消息以适应token限制
  static truncateMessages(messages: Message[], maxTokens: number): Message[] {
    if (messages.length === 0) return [];

    // 首先确保系统消息始终保留
    const systemMessage = messages.find(msg => msg.role === 'system');
    const otherMessages = messages.filter(msg => msg.role !== 'system');

    let totalTokens = 0;
    const truncated: Message[] = [];

    // 如果有系统消息，先添加它
    if (systemMessage) {
      const systemTokens = this.estimateTokens(systemMessage.content);
      if (systemTokens < maxTokens) {
        truncated.push(systemMessage);
        totalTokens += systemTokens;
      }
    }

    // 从最新消息开始，向前添加（保持对话的连贯性）
    for (let i = otherMessages.length - 1; i >= 0; i--) {
      const message = otherMessages[i];
      const messageTokens = this.estimateTokens(message.content);

      if (totalTokens + messageTokens <= maxTokens) {
        // 插入到系统消息之后
        if (systemMessage) {
          truncated.splice(1, 0, message);
        } else {
          truncated.unshift(message);
        }
        totalTokens += messageTokens;
      } else {
        // 如果单条消息就超过限制，尝试截断消息内容
        if (truncated.length === (systemMessage ? 1 : 0) && messageTokens > maxTokens * 0.8) {
          const availableTokens = maxTokens - totalTokens;
          if (availableTokens > 100) { // 至少保留100个token的内容
            const truncatedContent = this.truncateContent(message.content, availableTokens);
            const truncatedMessage = { ...message, content: truncatedContent };
            if (systemMessage) {
              truncated.splice(1, 0, truncatedMessage);
            } else {
              truncated.unshift(truncatedMessage);
            }
          }
        }
        break;
      }
    }

    // 确保至少有一条非系统消息（如果原始消息中有的话）
    if (otherMessages.length > 0 && truncated.filter(msg => msg.role !== 'system').length === 0) {
      const lastMessage = otherMessages[otherMessages.length - 1];
      const availableTokens = maxTokens - (systemMessage ? this.estimateTokens(systemMessage.content) : 0);
      if (availableTokens > 50) {
        const truncatedContent = this.truncateContent(lastMessage.content, availableTokens);
        const truncatedMessage = { ...lastMessage, content: truncatedContent };
        truncated.push(truncatedMessage);
      }
    }

    return truncated;
  }

  // 截断单条消息内容
  static truncateContent(content: string, maxTokens: number): string {
    const words = content.split('');
    const targetLength = Math.floor(maxTokens / 1.5); // 粗略估算

    if (words.length <= targetLength) return content;

    const truncated = words.slice(0, targetLength).join('');
    return truncated + '...[内容已截断]';
  }

  // 搜索消息
  static searchMessages(messages: Message[], query: string): Message[] {
    const lowerQuery = query.toLowerCase();
    return messages.filter(message => 
      message.content.toLowerCase().includes(lowerQuery) ||
      message.fileAttachments?.some(file => 
        file.name.toLowerCase().includes(lowerQuery) ||
        file.content?.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // 导出消息为文本
  static exportMessagesToText(messages: Message[]): string {
    return messages.map(message => {
      const time = this.formatMessageTime(message.timestamp);
      const role = message.role === 'user' ? '用户' : 
                   message.role === 'assistant' ? 'AI助手' : '系统';
      
      let content = `[${time}] ${role}:\n${message.content}`;
      
      if (message.fileAttachments && message.fileAttachments.length > 0) {
        content += '\n附件: ' + message.fileAttachments.map(f => f.name).join(', ');
      }
      
      return content;
    }).join('\n\n---\n\n');
  }

  // 导出消息为Markdown
  static exportMessagesToMarkdown(messages: Message[]): string {
    return messages.map(message => {
      const time = this.formatMessageTime(message.timestamp);
      const role = message.role === 'user' ? '👤 用户' : 
                   message.role === 'assistant' ? '🤖 AI助手' : '⚙️ 系统';
      
      let content = `## ${role} (${time})\n\n${message.content}`;
      
      if (message.fileAttachments && message.fileAttachments.length > 0) {
        content += '\n\n**附件:**\n' + 
          message.fileAttachments.map(f => `- ${f.name}`).join('\n');
      }
      
      return content;
    }).join('\n\n---\n\n');
  }

  // 验证消息内容
  static validateMessage(content: string): { valid: boolean; error?: string } {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: '消息内容不能为空' };
    }

    if (content.length > 50000) {
      return { valid: false, error: '消息内容过长，请控制在50000字符以内' };
    }

    return { valid: true };
  }
}
