import { advancedStorage } from '../../../shared/utils/indexedDB';
import { CompleteProfile } from './addressGenerator';

export interface IdentitySettings {
  selectedState: string;
  selectedCity: string;
  taxFilter: string; // 'tax-free', 'taxable', ''
  batchCount: number;
  autoSave: boolean;
  maxSavedProfiles: number;
}

export interface SavedIdentityProfile extends CompleteProfile {
  id: string;
  timestamp: number;
  tags?: string[];
  notes?: string;
}

export const defaultIdentitySettings: IdentitySettings = {
  selectedState: '',
  selectedCity: '',
  taxFilter: '',
  batchCount: 1,
  autoSave: false,
  maxSavedProfiles: 100,
};

/**
 * 身份生成器数据管理类
 */
export class IdentityStorageManager {
  private static instance: IdentityStorageManager;

  static getInstance(): IdentityStorageManager {
    if (!IdentityStorageManager.instance) {
      IdentityStorageManager.instance = new IdentityStorageManager();
    }
    return IdentityStorageManager.instance;
  }

  /**
   * 保存生成设置
   */
  async saveSettings(settings: Partial<IdentitySettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await advancedStorage.saveIdentitySettings(newSettings);
    } catch (error) {
      console.error('Failed to save identity settings:', error);
      throw error;
    }
  }

  /**
   * 获取生成设置
   */
  async getSettings(): Promise<IdentitySettings> {
    try {
      const settings = await advancedStorage.getIdentitySettings();
      return settings ? { ...defaultIdentitySettings, ...settings } : defaultIdentitySettings;
    } catch (error) {
      console.warn('Failed to load identity settings:', error);
      return defaultIdentitySettings;
    }
  }

  /**
   * 保存单个身份档案
   */
  async saveProfile(profile: CompleteProfile, tags?: string[], notes?: string): Promise<string> {
    try {
      const profileWithMeta = {
        ...profile,
        tags: tags || [],
        notes: notes || '',
      };
      return await advancedStorage.saveIdentityProfile(profileWithMeta);
    } catch (error) {
      console.error('Failed to save identity profile:', error);
      throw error;
    }
  }

  /**
   * 批量保存身份档案
   */
  async saveProfiles(profiles: CompleteProfile[]): Promise<string[]> {
    try {
      const profilesWithMeta = profiles.map(profile => ({
        ...profile,
        tags: [],
        notes: '',
      }));
      return await advancedStorage.saveIdentityProfiles(profilesWithMeta);
    } catch (error) {
      console.error('Failed to save identity profiles:', error);
      throw error;
    }
  }

  /**
   * 获取所有保存的身份档案
   */
  async getAllProfiles(): Promise<SavedIdentityProfile[]> {
    try {
      return await advancedStorage.getAllIdentityProfiles();
    } catch (error) {
      console.error('Failed to load identity profiles:', error);
      return [];
    }
  }

  /**
   * 获取单个身份档案
   */
  async getProfile(profileId: string): Promise<SavedIdentityProfile | null> {
    try {
      return await advancedStorage.getIdentityProfile(profileId);
    } catch (error) {
      console.error('Failed to load identity profile:', error);
      return null;
    }
  }

  /**
   * 删除身份档案
   */
  async deleteProfile(profileId: string): Promise<void> {
    try {
      await advancedStorage.deleteIdentityProfile(profileId);
    } catch (error) {
      console.error('Failed to delete identity profile:', error);
      throw error;
    }
  }

  /**
   * 清空所有身份档案
   */
  async clearAllProfiles(): Promise<void> {
    try {
      await advancedStorage.clearAllIdentityProfiles();
    } catch (error) {
      console.error('Failed to clear identity profiles:', error);
      throw error;
    }
  }

  /**
   * 按州筛选档案
   */
  async getProfilesByState(stateAbbreviation: string): Promise<SavedIdentityProfile[]> {
    try {
      const allProfiles = await this.getAllProfiles();
      return allProfiles.filter(profile => 
        profile.address.stateAbbreviation === stateAbbreviation
      );
    } catch (error) {
      console.error('Failed to filter profiles by state:', error);
      return [];
    }
  }

  /**
   * 搜索档案
   */
  async searchProfiles(query: string): Promise<SavedIdentityProfile[]> {
    try {
      const allProfiles = await this.getAllProfiles();
      const lowerQuery = query.toLowerCase();
      
      return allProfiles.filter(profile => 
        profile.personal.fullName.toLowerCase().includes(lowerQuery) ||
        profile.personal.email.toLowerCase().includes(lowerQuery) ||
        profile.address.city.toLowerCase().includes(lowerQuery) ||
        profile.address.state.toLowerCase().includes(lowerQuery) ||
        profile.address.stateAbbreviation.toLowerCase().includes(lowerQuery) ||
        (profile.tags && profile.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
        (profile.notes && profile.notes.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Failed to search profiles:', error);
      return [];
    }
  }

  /**
   * 获取统计信息
   */
  async getStatistics(): Promise<{
    totalProfiles: number;
    profilesByState: { [state: string]: number };
    recentProfiles: SavedIdentityProfile[];
  }> {
    try {
      const allProfiles = await this.getAllProfiles();
      
      const profilesByState: { [state: string]: number } = {};
      allProfiles.forEach(profile => {
        const state = profile.address.stateAbbreviation;
        profilesByState[state] = (profilesByState[state] || 0) + 1;
      });

      const recentProfiles = allProfiles.slice(0, 5);

      return {
        totalProfiles: allProfiles.length,
        profilesByState,
        recentProfiles,
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return {
        totalProfiles: 0,
        profilesByState: {},
        recentProfiles: [],
      };
    }
  }

  /**
   * 导出档案数据
   */
  async exportProfiles(format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const profiles = await this.getAllProfiles();
      
      if (format === 'json') {
        return JSON.stringify(profiles, null, 2);
      } else {
        // CSV 格式
        const headers = [
          'ID', 'Name', 'Email', 'Phone', 'Address', 'City', 'State', 'ZIP',
          'SSN', 'Credit Card', 'Bank Account', 'Timestamp', 'Tags', 'Notes'
        ];
        
        const rows = profiles.map(profile => [
          profile.id,
          profile.personal.fullName,
          profile.personal.email,
          profile.personal.phone,
          profile.address.street,
          profile.address.city,
          profile.address.state,
          profile.address.zipCode,
          profile.personal.ssn,
          profile.financial.creditCard.number,
          profile.financial.bankAccount.accountNumber,
          new Date(profile.timestamp).toISOString(),
          (profile.tags || []).join(';'),
          profile.notes || ''
        ]);

        return [headers, ...rows].map(row => 
          row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
      }
    } catch (error) {
      console.error('Failed to export profiles:', error);
      throw error;
    }
  }
}

// 创建单例实例
export const identityStorage = IdentityStorageManager.getInstance();
