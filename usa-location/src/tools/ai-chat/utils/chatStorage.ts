import { advancedStorage } from '../../../shared/utils/indexedDB';
import { ChatSession, ChatSettings, Message, FileInfo } from '../types/chat';
import { defaultChatSettings } from '../data/models';

const STORAGE_KEYS = {
  SESSIONS: 'ai-chat-sessions',
  SETTINGS: 'ai-chat-settings',
  FILES: 'ai-chat-files'
};

export class ChatStorage {
  // 获取所有聊天会话
  static async getSessions(): Promise<ChatSession[]> {
    try {
      const sessions = await advancedStorage.get('cache', STORAGE_KEYS.SESSIONS);
      return sessions || [];
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      return [];
    }
  }

  // 保存聊天会话
  static async saveSession(session: ChatSession): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = { ...session, updatedAt: Date.now() };
      } else {
        sessions.push({ ...session, createdAt: Date.now(), updatedAt: Date.now() });
      }
      
      await advancedStorage.set('cache', STORAGE_KEYS.SESSIONS, sessions);
    } catch (error) {
      console.error('Failed to save chat session:', error);
      throw new Error('保存会话失败');
    }
  }

  // 删除聊天会话
  static async deleteSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      await advancedStorage.set('cache', STORAGE_KEYS.SESSIONS, filteredSessions);
    } catch (error) {
      console.error('Failed to delete chat session:', error);
      throw new Error('删除会话失败');
    }
  }

  // 获取设置
  static async getSettings(): Promise<ChatSettings> {
    try {
      const settings = await advancedStorage.get('cache', STORAGE_KEYS.SETTINGS);
      return settings ? { ...defaultChatSettings, ...settings } : defaultChatSettings;
    } catch (error) {
      console.error('Failed to load chat settings:', error);
      return defaultChatSettings;
    }
  }

  // 保存设置
  static async saveSettings(settings: Partial<ChatSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await advancedStorage.set('cache', STORAGE_KEYS.SETTINGS, newSettings);
    } catch (error) {
      console.error('Failed to save chat settings:', error);
      throw new Error('保存设置失败');
    }
  }

  // 保存文件信息
  static async saveFile(fileInfo: FileInfo): Promise<void> {
    try {
      const files = await this.getFiles();
      const existingIndex = files.findIndex(f => f.id === fileInfo.id);
      
      if (existingIndex >= 0) {
        files[existingIndex] = fileInfo;
      } else {
        files.push(fileInfo);
      }
      
      await advancedStorage.set('cache', STORAGE_KEYS.FILES, files);
    } catch (error) {
      console.error('Failed to save file:', error);
      throw new Error('保存文件失败');
    }
  }

  // 获取所有文件
  static async getFiles(): Promise<FileInfo[]> {
    try {
      const files = await advancedStorage.get('cache', STORAGE_KEYS.FILES);
      return files || [];
    } catch (error) {
      console.error('Failed to load files:', error);
      return [];
    }
  }

  // 删除文件
  static async deleteFile(fileId: string): Promise<void> {
    try {
      const files = await this.getFiles();
      const filteredFiles = files.filter(f => f.id !== fileId);
      await advancedStorage.set('cache', STORAGE_KEYS.FILES, filteredFiles);
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error('删除文件失败');
    }
  }

  // 清理过期数据
  static async cleanupOldData(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const cutoffTime = Date.now() - maxAge;
      
      // 清理旧会话
      const sessions = await this.getSessions();
      const activeSessions = sessions.filter(s => s.updatedAt > cutoffTime);
      await advancedStorage.set('cache', STORAGE_KEYS.SESSIONS, activeSessions);
      
      // 清理孤立文件
      const files = await this.getFiles();
      const sessionFileIds = new Set();
      activeSessions.forEach(session => {
        session.messages.forEach(message => {
          message.fileAttachments?.forEach(file => sessionFileIds.add(file.id));
        });
        session.attachedFiles?.forEach(file => sessionFileIds.add(file.id));
      });
      
      const activeFiles = files.filter(file => sessionFileIds.has(file.id));
      await advancedStorage.set('cache', STORAGE_KEYS.FILES, activeFiles);
      
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }

  // 导出数据
  static async exportData(): Promise<string> {
    try {
      const data = {
        sessions: await this.getSessions(),
        settings: await this.getSettings(),
        files: await this.getFiles(),
        exportTime: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('导出数据失败');
    }
  }

  // 导入数据
  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.sessions && Array.isArray(data.sessions)) {
        await advancedStorage.set('cache', STORAGE_KEYS.SESSIONS, data.sessions);
      }
      
      if (data.settings) {
        await advancedStorage.set('cache', STORAGE_KEYS.SETTINGS, data.settings);
      }
      
      if (data.files && Array.isArray(data.files)) {
        await advancedStorage.set('cache', STORAGE_KEYS.FILES, data.files);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('导入数据失败：格式不正确');
    }
  }

  // 生成唯一ID
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
