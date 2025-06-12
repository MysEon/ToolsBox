/**
 * IndexedDB 存储系统
 * 提供强大的本地数据存储和管理功能
 *
 * 存储限制说明：
 * - Chrome/Edge: 最多60%磁盘空间
 * - Firefox: 最佳努力模式10GB，持久模式最多50%磁盘空间
 * - Safari: 约20%磁盘空间，Web App可达60%
 * - 实际可用空间取决于设备磁盘大小和可用空间
 */

export interface StorageItem<T = any> {
  id: string;
  data: T;
  timestamp: number;
  version: number;
  compressed?: boolean;
}

export interface DatabaseSchema {
  preferences: StorageItem;
  backups: StorageItem;
  cache: StorageItem;
  identityProfiles: StorageItem;
  identitySettings: StorageItem;
}

class IndexedDBManager {
  private dbName = 'ToolsBoxDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('IndexedDB is not available in server environment');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建对象存储
        if (!db.objectStoreNames.contains('preferences')) {
          const preferencesStore = db.createObjectStore('preferences', { keyPath: 'id' });
          preferencesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('backups')) {
          const backupsStore = db.createObjectStore('backups', { keyPath: 'id' });
          backupsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'id' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('identityProfiles')) {
          const identityStore = db.createObjectStore('identityProfiles', { keyPath: 'id' });
          identityStore.createIndex('timestamp', 'timestamp', { unique: false });
          identityStore.createIndex('state', 'data.address.stateAbbreviation', { unique: false });
        }

        if (!db.objectStoreNames.contains('identitySettings')) {
          const settingsStore = db.createObjectStore('identitySettings', { keyPath: 'id' });
          settingsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  /**
   * 存储数据
   */
  async set<T>(storeName: keyof DatabaseSchema, key: string, data: T, compress = false): Promise<void> {
    const db = await this.ensureDB();
    
    const item: StorageItem<T> = {
      id: key,
      data,
      timestamp: Date.now(),
      version: 1,
      compressed: compress
    };

    // 如果需要压缩，这里可以添加压缩逻辑
    if (compress) {
      // TODO: 实现数据压缩
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to store data for key: ${key}`));
    });
  }

  /**
   * 获取数据
   */
  async get<T>(storeName: keyof DatabaseSchema, key: string): Promise<T | null> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result as StorageItem<T> | undefined;
        if (result) {
          // 如果数据被压缩，这里需要解压缩
          resolve(result.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(new Error(`Failed to get data for key: ${key}`));
    });
  }

  /**
   * 删除数据
   */
  async delete(storeName: keyof DatabaseSchema, key: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete data for key: ${key}`));
    });
  }

  /**
   * 获取所有键
   */
  async getAllKeys(storeName: keyof DatabaseSchema): Promise<string[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(new Error('Failed to get all keys'));
    });
  }

  /**
   * 获取所有数据
   */
  async getAll<T>(storeName: keyof DatabaseSchema): Promise<StorageItem<T>[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as StorageItem<T>[]);
      request.onerror = () => reject(new Error('Failed to get all data'));
    });
  }

  /**
   * 清空存储
   */
  async clear(storeName: keyof DatabaseSchema): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to clear store'));
    });
  }

  /**
   * 获取存储使用情况
   */
  async getStorageInfo(customQuota?: number, useCustomQuota?: boolean): Promise<{
    usage: number;
    quota: number;
    percentage: number;
    quotaType: 'estimated' | 'custom' | 'unknown';
    isOverQuota: boolean;
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      let quota = estimate.quota || 0;
      let quotaType: 'estimated' | 'custom' | 'unknown' = 'estimated';

      // 如果使用自定义配额
      if (useCustomQuota && customQuota && customQuota > 0) {
        quota = customQuota;
        quotaType = 'custom';
      }

      const percentage = quota > 0 ? (usage / quota) * 100 : 0;
      const isOverQuota = usage > quota;

      return {
        usage,
        quota,
        percentage,
        quotaType,
        isOverQuota
      };
    }

    return {
      usage: 0,
      quota: 0,
      percentage: 0,
      quotaType: 'unknown',
      isOverQuota: false
    };
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// 创建单例实例
export const indexedDBManager = new IndexedDBManager();

/**
 * 高级存储工具类
 */
export class AdvancedStorage {
  private static instance: AdvancedStorage;
  private initialized = false;

  static getInstance(): AdvancedStorage {
    if (!AdvancedStorage.instance) {
      AdvancedStorage.instance = new AdvancedStorage();
    }
    return AdvancedStorage.instance;
  }

  async init(): Promise<void> {
    if (!this.initialized) {
      await indexedDBManager.init();
      this.initialized = true;
    }
  }

  /**
   * 存储用户偏好设置
   */
  async setPreferences(data: any): Promise<void> {
    await this.init();
    await indexedDBManager.set('preferences', 'user-preferences', data);
  }

  /**
   * 获取用户偏好设置
   */
  async getPreferences(): Promise<any> {
    await this.init();
    return await indexedDBManager.get('preferences', 'user-preferences');
  }

  /**
   * 创建数据备份
   */
  async createBackup(name: string, data: any): Promise<void> {
    await this.init();
    const backupData = {
      name,
      data,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };
    await indexedDBManager.set('backups', `backup-${Date.now()}`, backupData);
  }

  /**
   * 获取所有备份
   */
  async getAllBackups(): Promise<any[]> {
    await this.init();
    const backups = await indexedDBManager.getAll('backups');
    return backups.map(item => item.data).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * 保存身份档案
   */
  async saveIdentityProfile(profile: any): Promise<string> {
    await this.init();
    const profileId = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await indexedDBManager.set('identityProfiles', profileId, profile);
    return profileId;
  }

  /**
   * 批量保存身份档案
   */
  async saveIdentityProfiles(profiles: any[]): Promise<string[]> {
    await this.init();
    const profileIds: string[] = [];
    for (const profile of profiles) {
      const profileId = await this.saveIdentityProfile(profile);
      profileIds.push(profileId);
    }
    return profileIds;
  }

  /**
   * 获取身份档案
   */
  async getIdentityProfile(profileId: string): Promise<any> {
    await this.init();
    return await indexedDBManager.get('identityProfiles', profileId);
  }

  /**
   * 获取所有身份档案
   */
  async getAllIdentityProfiles(): Promise<any[]> {
    await this.init();
    const profiles = await indexedDBManager.getAll('identityProfiles');
    return profiles.map(item => ({ ...item.data, id: item.id, timestamp: item.timestamp }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 删除身份档案
   */
  async deleteIdentityProfile(profileId: string): Promise<void> {
    await this.init();
    await indexedDBManager.delete('identityProfiles', profileId);
  }

  /**
   * 清空所有身份档案
   */
  async clearAllIdentityProfiles(): Promise<void> {
    await this.init();
    await indexedDBManager.clear('identityProfiles');
  }

  /**
   * 保存身份生成器设置
   */
  async saveIdentitySettings(settings: any): Promise<void> {
    await this.init();
    await indexedDBManager.set('identitySettings', 'user-identity-settings', settings);
  }

  /**
   * 获取身份生成器设置
   */
  async getIdentitySettings(): Promise<any> {
    await this.init();
    return await indexedDBManager.get('identitySettings', 'user-identity-settings');
  }

  /**
   * 获取存储统计信息
   */
  async getStorageStats(customQuota?: number, useCustomQuota?: boolean): Promise<{
    indexedDB: { usage: number; quota: number; percentage: number; quotaType: 'estimated' | 'custom' | 'unknown'; isOverQuota: boolean };
    localStorage: { usage: number; quota: number; percentage: number };
  }> {
    const indexedDBInfo = await indexedDBManager.getStorageInfo(customQuota, useCustomQuota);
    
    // 计算localStorage使用情况
    let localStorageUsage = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageUsage += localStorage[key].length;
        }
      }
    } catch (e) {
      // 忽略错误
    }

    const localStorageQuota = 5 * 1024 * 1024; // 假设5MB限制
    const localStoragePercentage = (localStorageUsage / localStorageQuota) * 100;

    return {
      indexedDB: indexedDBInfo,
      localStorage: {
        usage: localStorageUsage,
        quota: localStorageQuota,
        percentage: localStoragePercentage
      }
    };
  }
}

export const advancedStorage = AdvancedStorage.getInstance();
