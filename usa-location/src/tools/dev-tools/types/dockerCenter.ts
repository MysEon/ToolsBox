// Docker中心相关类型定义

export interface DockerMirror {
  id: string;
  name: string;
  url: string;
  description: string;
  location: string;
  provider: string;
  status: 'online' | 'offline' | 'slow' | 'unknown';
  responseTime?: number;
  lastChecked?: Date;
  features: string[];
  color: string;
}

export interface CustomContainer {
  id: string;
  name: string;
  description: string;
  url: string;
  port?: number;
  protocol: 'http' | 'https';
  serverName: string;
  containerName: string;
  status: 'running' | 'stopped' | 'unknown';
  lastChecked?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DockerTool {
  id: string;
  name: string;
  description: string;
  category: 'runtime' | 'orchestration' | 'registry' | 'monitoring' | 'security' | 'development';
  icon: string;
  officialUrl: string;
  downloadUrl: string;
  platforms: string[];
  version?: string;
  license: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  tutorialUrl?: string;
  features: string[];
  color: string;
  dockerHubUrl?: string;
  githubUrl?: string;
}

export interface MirrorStatus {
  mirror: DockerMirror;
  isOnline: boolean;
  responseTime: number;
  lastError?: string;
}

export interface ContainerStatus {
  container: CustomContainer;
  isAccessible: boolean;
  responseTime: number;
  lastError?: string;
}

export interface DockerCenterConfig {
  enableMirrorMonitoring: boolean;
  enableContainerMonitoring: boolean;
  checkInterval: number; // 检查间隔（分钟）
  timeout: number; // 超时时间（秒）
  maxRetries: number;
}

export interface QuickConfigTemplate {
  id: string;
  name: string;
  description: string;
  platform: 'windows' | 'macos' | 'linux';
  configType: 'daemon' | 'cli' | 'compose';
  template: string;
  variables: string[];
}

// 镜像站监控相关
export interface MirrorCheckResult {
  mirrorId: string;
  status: 'online' | 'offline' | 'slow';
  responseTime: number;
  timestamp: Date;
  error?: string;
}

// 容器监控相关
export interface ContainerCheckResult {
  containerId: string;
  status: 'running' | 'stopped' | 'unknown';
  responseTime: number;
  timestamp: Date;
  error?: string;
}

// 存储相关
export interface DockerCenterStorage {
  customContainers: CustomContainer[];
  config: DockerCenterConfig;
  mirrorHistory: MirrorCheckResult[];
  containerHistory: ContainerCheckResult[];
}
