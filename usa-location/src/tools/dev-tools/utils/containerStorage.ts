import { CustomContainer, ContainerCheckResult, DockerCenterConfig } from '../types/dockerCenter';

const STORAGE_KEYS = {
  CONTAINERS: 'docker-center-containers',
  CONFIG: 'docker-center-config',
  HISTORY: 'docker-center-history'
};

// 默认配置
const DEFAULT_CONFIG: DockerCenterConfig = {
  enableMirrorMonitoring: false, // 禁用镜像监控，只使用第三方服务
  enableContainerMonitoring: true,
  checkInterval: 5, // 5分钟
  timeout: 10, // 10秒
  maxRetries: 3
};

export class ContainerStorage {
  // 获取所有容器
  static getContainers(): CustomContainer[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTAINERS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load containers:', error);
      return [];
    }
  }

  // 保存容器
  static saveContainer(container: CustomContainer): void {
    try {
      const containers = this.getContainers();
      const existingIndex = containers.findIndex(c => c.id === container.id);
      
      if (existingIndex >= 0) {
        containers[existingIndex] = { ...container, updatedAt: new Date() };
      } else {
        containers.push({ ...container, createdAt: new Date(), updatedAt: new Date() });
      }
      
      localStorage.setItem(STORAGE_KEYS.CONTAINERS, JSON.stringify(containers));
    } catch (error) {
      console.error('Failed to save container:', error);
      throw new Error('保存容器失败');
    }
  }

  // 删除容器
  static deleteContainer(id: string): void {
    try {
      const containers = this.getContainers();
      const filtered = containers.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CONTAINERS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete container:', error);
      throw new Error('删除容器失败');
    }
  }

  // 获取单个容器
  static getContainer(id: string): CustomContainer | null {
    const containers = this.getContainers();
    return containers.find(c => c.id === id) || null;
  }

  // 更新容器状态
  static updateContainerStatus(id: string, status: CustomContainer['status']): void {
    try {
      const containers = this.getContainers();
      const container = containers.find(c => c.id === id);
      if (container) {
        container.status = status;
        container.lastChecked = new Date();
        container.updatedAt = new Date();
        localStorage.setItem(STORAGE_KEYS.CONTAINERS, JSON.stringify(containers));
      }
    } catch (error) {
      console.error('Failed to update container status:', error);
    }
  }

  // 获取配置
  static getConfig(): DockerCenterConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
    } catch (error) {
      console.error('Failed to load config:', error);
      return DEFAULT_CONFIG;
    }
  }

  // 保存配置
  static saveConfig(config: Partial<DockerCenterConfig>): void {
    try {
      const currentConfig = this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
    } catch (error) {
      console.error('Failed to save config:', error);
      throw new Error('保存配置失败');
    }
  }

  // 获取检查历史
  static getCheckHistory(): ContainerCheckResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load check history:', error);
      return [];
    }
  }

  // 添加检查记录
  static addCheckResult(result: ContainerCheckResult): void {
    try {
      const history = this.getCheckHistory();
      history.push(result);
      
      // 只保留最近1000条记录
      if (history.length > 1000) {
        history.splice(0, history.length - 1000);
      }
      
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save check result:', error);
    }
  }

  // 清除历史记录
  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  // 导出数据
  static exportData(): string {
    const data = {
      containers: this.getContainers(),
      config: this.getConfig(),
      history: this.getCheckHistory(),
      exportTime: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // 导入数据
  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.containers && Array.isArray(data.containers)) {
        localStorage.setItem(STORAGE_KEYS.CONTAINERS, JSON.stringify(data.containers));
      }
      
      if (data.config) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data.config));
      }
      
      if (data.history && Array.isArray(data.history)) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
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

  // 验证容器URL
  static validateContainerUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // 构建完整URL
  static buildContainerUrl(container: CustomContainer): string {
    const baseUrl = container.url.replace(/\/$/, ''); // 移除末尾斜杠
    return container.port ? `${baseUrl}:${container.port}` : baseUrl;
  }
}
