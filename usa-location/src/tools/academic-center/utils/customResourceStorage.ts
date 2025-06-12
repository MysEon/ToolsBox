import { advancedStorage } from '../../../shared/utils/indexedDB';
import { AcademicResource, getIconComponent } from '../data/academicResources';

export interface CustomAcademicResource extends Omit<AcademicResource, 'icon'> {
  iconName: string;
  isCustom: true;
  createdAt: number;
}

export interface CustomResourceFormData {
  name: string;
  description: string;
  url: string;
  category: string;
  accessType: 'Free' | 'Subscription' | 'Institutional' | 'Freemium';
  language: 'Chinese' | 'English' | 'Multilingual';
  iconName: string;
  color: string;
  features: string[];
  tags: string[];
}

/**
 * 自定义学术资源存储管理器
 */
export class CustomResourceStorageManager {
  private static instance: CustomResourceStorageManager;

  static getInstance(): CustomResourceStorageManager {
    if (!CustomResourceStorageManager.instance) {
      CustomResourceStorageManager.instance = new CustomResourceStorageManager();
    }
    return CustomResourceStorageManager.instance;
  }

  /**
   * 添加自定义资源
   */
  async addCustomResource(formData: CustomResourceFormData): Promise<string> {
    try {
      const resourceId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const customResource: CustomAcademicResource = {
        id: resourceId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        category: formData.category,
        accessType: formData.accessType,
        language: formData.language,
        iconName: formData.iconName,
        color: formData.color,
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags.filter(t => t.trim()),
        isCustom: true,
        createdAt: Date.now()
      };

      await advancedStorage.saveCustomAcademicResource(resourceId, customResource);

      return resourceId;
    } catch (error) {
      console.error('Failed to add custom resource:', error);
      throw error;
    }
  }

  /**
   * 获取所有自定义资源
   */
  async getAllCustomResources(): Promise<AcademicResource[]> {
    try {
      const customResources = await advancedStorage.getAllCustomAcademicResources();

      return customResources.map((item: any) => {
        const resource = item.data as CustomAcademicResource;

        // 数据迁移：为缺少 iconName 的旧数据添加默认值
        if (!resource.iconName) {
          resource.iconName = 'Search';
          // 异步更新存储的数据
          this.migrateResourceData(resource.id, resource);
        }

        return {
          ...resource,
          icon: getIconComponent(resource.iconName || 'Search') // 默认使用 Search 图标
        };
      }).sort((a: any, b: any) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Failed to load custom resources:', error);
      return [];
    }
  }

  /**
   * 迁移旧数据格式
   */
  private async migrateResourceData(resourceId: string, resource: any): Promise<void> {
    try {
      // 确保所有必需字段都存在
      const migratedResource: CustomAcademicResource = {
        id: resourceId,
        name: resource.name || '未命名资源',
        description: resource.description || '',
        url: resource.url || '',
        category: resource.category || '其他',
        accessType: resource.accessType || 'Free',
        language: resource.language || 'English',
        iconName: resource.iconName || 'Search',
        color: resource.color || 'from-gray-500 to-slate-600',
        features: Array.isArray(resource.features) ? resource.features : [],
        tags: Array.isArray(resource.tags) ? resource.tags : [],
        isCustom: true,
        createdAt: resource.createdAt || Date.now()
      };

      await advancedStorage.saveCustomAcademicResource(resourceId, migratedResource);
    } catch (error) {
      console.error('Failed to migrate resource data:', error);
    }
  }

  /**
   * 获取单个自定义资源
   */
  async getCustomResource(resourceId: string): Promise<AcademicResource | null> {
    try {
      const item = await advancedStorage.getCustomAcademicResource(resourceId);

      if (!item || !item.data) return null;

      const resource = item.data as CustomAcademicResource;

      // 确保资源对象存在且有基本字段
      if (!resource || typeof resource !== 'object') {
        console.warn('Invalid resource data:', resource);
        return null;
      }

      // 数据迁移：为缺少 iconName 的旧数据添加默认值
      if (!resource.iconName) {
        resource.iconName = 'Search';
        // 异步更新存储的数据
        this.migrateResourceData(resourceId, resource);
      }

      return {
        ...resource,
        icon: getIconComponent(resource.iconName || 'Search') // 默认使用 Search 图标
      };
    } catch (error) {
      console.error('Failed to load custom resource:', error);
      return null;
    }
  }

  /**
   * 更新自定义资源
   */
  async updateCustomResource(resourceId: string, formData: CustomResourceFormData): Promise<void> {
    try {
      const existingResource = await this.getCustomResource(resourceId);
      if (!existingResource || !existingResource.isCustom) {
        throw new Error('Resource not found or not editable');
      }

      const updatedResource: CustomAcademicResource = {
        id: resourceId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        category: formData.category,
        accessType: formData.accessType,
        language: formData.language,
        iconName: formData.iconName,
        color: formData.color,
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags.filter(t => t.trim()),
        isCustom: true,
        createdAt: existingResource.createdAt || Date.now()
      };

      await advancedStorage.saveCustomAcademicResource(resourceId, updatedResource);
    } catch (error) {
      console.error('Failed to update custom resource:', error);
      throw error;
    }
  }

  /**
   * 删除自定义资源
   */
  async deleteCustomResource(resourceId: string): Promise<void> {
    try {
      await advancedStorage.deleteCustomAcademicResource(resourceId);
    } catch (error) {
      console.error('Failed to delete custom resource:', error);
      throw error;
    }
  }

  /**
   * 清空所有自定义资源
   */
  async clearAllCustomResources(): Promise<void> {
    try {
      await advancedStorage.clearAllCustomAcademicResources();
    } catch (error) {
      console.error('Failed to clear custom resources:', error);
      throw error;
    }
  }

  /**
   * 按分类获取自定义资源
   */
  async getCustomResourcesByCategory(category: string): Promise<AcademicResource[]> {
    try {
      const allResources = await this.getAllCustomResources();
      return allResources.filter(resource => resource.category === category);
    } catch (error) {
      console.error('Failed to filter custom resources by category:', error);
      return [];
    }
  }

  /**
   * 搜索自定义资源
   */
  async searchCustomResources(query: string): Promise<AcademicResource[]> {
    try {
      const allResources = await this.getAllCustomResources();
      const lowerQuery = query.toLowerCase();

      return allResources.filter(resource =>
        resource.name.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.features.some(feature => feature.toLowerCase().includes(lowerQuery)) ||
        resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Failed to search custom resources:', error);
      return [];
    }
  }

  /**
   * 验证资源数据
   */
  private validateResourceData(resource: any): boolean {
    return (
      resource &&
      typeof resource.name === 'string' &&
      typeof resource.description === 'string' &&
      typeof resource.url === 'string' &&
      typeof resource.category === 'string' &&
      typeof resource.iconName === 'string' &&
      typeof resource.color === 'string' &&
      ['Free', 'Subscription', 'Institutional', 'Freemium'].includes(resource.accessType) &&
      ['Chinese', 'English', 'Multilingual'].includes(resource.language) &&
      Array.isArray(resource.features) &&
      Array.isArray(resource.tags)
    );
  }
}

// 创建单例实例
export const customResourceStorage = CustomResourceStorageManager.getInstance();