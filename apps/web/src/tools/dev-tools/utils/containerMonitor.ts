import { CustomContainer, ContainerStatus, ContainerCheckResult } from '../types/dockerCenter';
import { ContainerStorage } from './containerStorage';

export class ContainerMonitor {
  private static instance: ContainerMonitor;
  private checkInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  static getInstance(): ContainerMonitor {
    if (!ContainerMonitor.instance) {
      ContainerMonitor.instance = new ContainerMonitor();
    }
    return ContainerMonitor.instance;
  }

  // 检查单个容器状态
  async checkContainerStatus(container: CustomContainer): Promise<ContainerStatus> {
    const config = ContainerStorage.getConfig();
    const url = ContainerStorage.buildContainerUrl(container);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout * 1000);
      
      const startTime = Date.now();
      
      // 使用fetch检查容器可访问性
      const response = await fetch(url, {
        method: 'HEAD', // 使用HEAD请求减少数据传输
        signal: controller.signal,
        mode: 'no-cors', // 避免CORS问题
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      // 由于no-cors模式，我们无法获取真实的响应状态
      // 如果请求没有抛出异常，就认为容器是可访问的
      return {
        container,
        isAccessible: true,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - Date.now();
      let errorMessage = '未知错误';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '请求超时';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = '网络连接失败';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        container,
        isAccessible: false,
        responseTime,
        lastError: errorMessage
      };
    }
  }

  // 检查所有容器状态
  async checkAllContainers(): Promise<ContainerStatus[]> {
    const containers = ContainerStorage.getContainers();
    const promises = containers.map(container => this.checkContainerStatus(container));
    
    try {
      const results = await Promise.all(promises);
      
      // 更新容器状态并保存检查结果
      results.forEach(result => {
        const status = result.isAccessible ? 'running' : 'stopped';
        ContainerStorage.updateContainerStatus(result.container.id, status);
        
        // 保存检查结果到历史记录
        const checkResult: ContainerCheckResult = {
          containerId: result.container.id,
          status,
          responseTime: result.responseTime,
          timestamp: new Date(),
          error: result.lastError
        };
        ContainerStorage.addCheckResult(checkResult);
      });
      
      return results;
    } catch (error) {
      console.error('检查容器状态失败:', error);
      throw error;
    }
  }

  // 开始监控
  startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    const config = ContainerStorage.getConfig();
    if (!config.enableContainerMonitoring) {
      return;
    }

    this.isMonitoring = true;
    
    // 立即执行一次检查
    this.checkAllContainers().catch(console.error);
    
    // 设置定时检查
    this.checkInterval = setInterval(() => {
      this.checkAllContainers().catch(console.error);
    }, config.checkInterval * 60 * 1000); // 转换为毫秒
    
    console.log(`容器监控已启动，检查间隔: ${config.checkInterval}分钟`);
  }

  // 停止监控
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    console.log('容器监控已停止');
  }

  // 重启监控
  restartMonitoring(): void {
    this.stopMonitoring();
    this.startMonitoring();
  }

  // 获取监控状态
  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  // 手动触发检查
  async triggerCheck(): Promise<ContainerStatus[]> {
    return this.checkAllContainers();
  }

  // 获取容器历史状态
  getContainerHistory(containerId: string, limit: number = 50): ContainerCheckResult[] {
    const history = ContainerStorage.getCheckHistory();
    return history
      .filter(result => result.containerId === containerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // 获取容器统计信息
  getContainerStats(containerId: string): {
    totalChecks: number;
    successRate: number;
    averageResponseTime: number;
    lastCheck?: Date;
  } {
    const history = this.getContainerHistory(containerId, 100);
    
    if (history.length === 0) {
      return {
        totalChecks: 0,
        successRate: 0,
        averageResponseTime: 0
      };
    }

    const successfulChecks = history.filter(h => h.status === 'running').length;
    const totalResponseTime = history.reduce((sum, h) => sum + h.responseTime, 0);
    
    return {
      totalChecks: history.length,
      successRate: (successfulChecks / history.length) * 100,
      averageResponseTime: totalResponseTime / history.length,
      lastCheck: new Date(history[0].timestamp)
    };
  }

  // 清理旧的历史记录
  cleanupHistory(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const history = ContainerStorage.getCheckHistory();
    const filteredHistory = history.filter(
      result => new Date(result.timestamp) > cutoffDate
    );
    
    localStorage.setItem('docker-center-history', JSON.stringify(filteredHistory));
    console.log(`清理了 ${history.length - filteredHistory.length} 条历史记录`);
  }
}
