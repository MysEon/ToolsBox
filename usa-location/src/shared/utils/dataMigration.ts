/**
 * 数据迁移工具
 * 负责将localStorage数据迁移到IndexedDB
 */

import { advancedStorage } from './indexedDB';

export interface MigrationResult {
  success: boolean;
  migratedItems: string[];
  errors: string[];
  totalSize: number;
}

export class DataMigration {
  private static readonly MIGRATION_KEY = 'toolsbox-migration-completed';
  private static readonly BACKUP_KEY = 'toolsbox-pre-migration-backup';

  /**
   * 检查是否需要迁移
   */
  static needsMigration(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const migrationCompleted = localStorage.getItem(DataMigration.MIGRATION_KEY);
      const hasLegacyData = localStorage.getItem('toolsbox-preferences') !== null;
      
      return !migrationCompleted && hasLegacyData;
    } catch (error) {
      console.warn('Failed to check migration status:', error);
      return false;
    }
  }

  /**
   * 执行数据迁移
   */
  static async migrate(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedItems: [],
      errors: [],
      totalSize: 0
    };

    try {
      // 初始化高级存储
      await advancedStorage.init();

      // 创建迁移前备份
      await DataMigration.createPreMigrationBackup();

      // 获取所有localStorage数据
      const localStorageData = DataMigration.getAllLocalStorageData();
      
      // 迁移用户偏好设置
      if (localStorageData['toolsbox-preferences']) {
        try {
          const preferences = JSON.parse(localStorageData['toolsbox-preferences']);
          await advancedStorage.setPreferences(preferences);
          result.migratedItems.push('user-preferences');
          result.totalSize += localStorageData['toolsbox-preferences'].length;
        } catch (error) {
          result.errors.push(`Failed to migrate preferences: ${error}`);
        }
      }

      // 迁移游戏数据
      const gameKeys = Object.keys(localStorageData).filter(key => 
        key.startsWith('toolsbox-game-') || 
        key.startsWith('snake-') || 
        key.startsWith('tetris-') || 
        key.startsWith('gomoku-')
      );

      for (const key of gameKeys) {
        try {
          const data = JSON.parse(localStorageData[key]);
          await advancedStorage.createBackup(`legacy-${key}`, data);
          result.migratedItems.push(key);
          result.totalSize += localStorageData[key].length;
        } catch (error) {
          result.errors.push(`Failed to migrate ${key}: ${error}`);
        }
      }

      // 迁移其他工具箱相关数据
      const toolsboxKeys = Object.keys(localStorageData).filter(key => 
        key.startsWith('toolsbox-') && 
        key !== 'toolsbox-preferences' &&
        !gameKeys.includes(key)
      );

      for (const key of toolsboxKeys) {
        try {
          const data = JSON.parse(localStorageData[key]);
          await advancedStorage.createBackup(`legacy-${key}`, data);
          result.migratedItems.push(key);
          result.totalSize += localStorageData[key].length;
        } catch (error) {
          result.errors.push(`Failed to migrate ${key}: ${error}`);
        }
      }

      // 标记迁移完成
      localStorage.setItem(DataMigration.MIGRATION_KEY, JSON.stringify({
        completed: true,
        timestamp: Date.now(),
        version: '1.0',
        migratedItems: result.migratedItems.length,
        totalSize: result.totalSize
      }));

      result.success = result.errors.length === 0;

      console.log('Data migration completed:', result);
      return result;

    } catch (error) {
      result.errors.push(`Migration failed: ${error}`);
      console.error('Data migration failed:', error);
      return result;
    }
  }

  /**
   * 获取所有localStorage数据
   */
  private static getAllLocalStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = value;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to read localStorage:', error);
    }

    return data;
  }

  /**
   * 创建迁移前备份
   */
  private static async createPreMigrationBackup(): Promise<void> {
    try {
      const allData = DataMigration.getAllLocalStorageData();
      const backup = {
        timestamp: Date.now(),
        data: allData,
        version: '1.0'
      };

      // 保存到localStorage作为紧急备份
      localStorage.setItem(DataMigration.BACKUP_KEY, JSON.stringify(backup));

      // 同时保存到IndexedDB
      await advancedStorage.createBackup('pre-migration-backup', backup);
    } catch (error) {
      console.warn('Failed to create pre-migration backup:', error);
    }
  }

  /**
   * 恢复迁移前数据
   */
  static async restorePreMigrationData(): Promise<boolean> {
    try {
      const backupData = localStorage.getItem(DataMigration.BACKUP_KEY);
      if (!backupData) {
        return false;
      }

      const backup = JSON.parse(backupData);
      
      // 清除当前localStorage中的工具箱数据
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('toolsbox-')) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      // 恢复备份数据
      Object.entries(backup.data).forEach(([key, value]) => {
        try {
          localStorage.setItem(key, value as string);
        } catch (error) {
          console.warn(`Failed to restore ${key}:`, error);
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to restore pre-migration data:', error);
      return false;
    }
  }

  /**
   * 清理迁移数据
   */
  static cleanupMigrationData(): void {
    try {
      // 移除迁移备份（保留迁移完成标记）
      localStorage.removeItem(DataMigration.BACKUP_KEY);
    } catch (error) {
      console.warn('Failed to cleanup migration data:', error);
    }
  }

  /**
   * 获取迁移状态
   */
  static getMigrationStatus(): {
    completed: boolean;
    timestamp?: number;
    migratedItems?: number;
    totalSize?: number;
  } {
    if (typeof window === 'undefined') {
      return { completed: false };
    }

    try {
      const migrationData = localStorage.getItem(DataMigration.MIGRATION_KEY);
      if (migrationData) {
        const data = JSON.parse(migrationData);
        return {
          completed: data.completed,
          timestamp: data.timestamp,
          migratedItems: data.migratedItems,
          totalSize: data.totalSize
        };
      }
    } catch (error) {
      console.warn('Failed to get migration status:', error);
    }

    return { completed: false };
  }

  /**
   * 重置迁移状态（用于测试）
   */
  static resetMigrationStatus(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(DataMigration.MIGRATION_KEY);
      localStorage.removeItem(DataMigration.BACKUP_KEY);
    } catch (error) {
      console.warn('Failed to reset migration status:', error);
    }
  }
}

/**
 * 自动迁移钩子
 */
export async function autoMigrate(): Promise<MigrationResult | null> {
  if (DataMigration.needsMigration()) {
    console.log('Starting automatic data migration...');
    const result = await DataMigration.migrate();
    
    if (result.success) {
      console.log('Data migration completed successfully');
      // 可以在这里显示成功通知
    } else {
      console.warn('Data migration completed with errors:', result.errors);
      // 可以在这里显示警告通知
    }
    
    return result;
  }
  
  return null;
}
