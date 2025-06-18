import { DockerMirror, DockerTool, QuickConfigTemplate } from '../types/dockerCenter';
import { Container, Server, Shield, Monitor, Package, Wrench } from 'lucide-react';

// Docker镜像站数据
export const dockerMirrors: DockerMirror[] = [
  {
    id: 'docker-hub',
    name: 'Docker Hub (官方)',
    url: 'https://hub.docker.com',
    description: 'Docker官方镜像仓库',
    location: '全球',
    provider: 'Docker Inc.',
    status: 'unknown',
    features: ['官方镜像', '社区镜像', '私有仓库'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'aliyun',
    name: '阿里云镜像站',
    url: 'https://cr.console.aliyun.com',
    description: '阿里云容器镜像服务',
    location: '中国',
    provider: '阿里云',
    status: 'unknown',
    features: ['国内加速', '企业级', '安全扫描'],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'tencent',
    name: '腾讯云镜像站',
    url: 'https://cloud.tencent.com/product/tcr',
    description: '腾讯云容器镜像服务',
    location: '中国',
    provider: '腾讯云',
    status: 'unknown',
    features: ['国内加速', '多地域', '版本管理'],
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'ustc',
    name: '中科大镜像站',
    url: 'https://docker.mirrors.ustc.edu.cn',
    description: '中国科学技术大学开源软件镜像',
    location: '中国',
    provider: '中科大',
    status: 'unknown',
    features: ['教育网', '免费', '高速'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'netease',
    name: '网易云镜像站',
    url: 'https://hub-mirror.c.163.com',
    description: '网易云Docker镜像加速服务',
    location: '中国',
    provider: '网易云',
    status: 'unknown',
    features: ['免费加速', '稳定可靠', '简单配置'],
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'daocloud',
    name: 'DaoCloud镜像站',
    url: 'https://hub.daocloud.io',
    description: 'DaoCloud提供的Docker镜像加速服务',
    location: '中国',
    provider: 'DaoCloud',
    status: 'unknown',
    features: ['企业级', '高可用', '监控告警'],
    color: 'from-purple-500 to-indigo-500'
  }
];

// Docker相关工具数据
export const dockerTools: DockerTool[] = [
  {
    id: 'docker-desktop',
    name: 'Docker Desktop',
    description: '官方桌面版Docker，包含完整的开发环境',
    category: 'runtime',
    icon: 'Container',
    officialUrl: 'https://www.docker.com/products/docker-desktop/',
    downloadUrl: 'https://www.docker.com/products/docker-desktop/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Freemium',
    tutorialUrl: 'https://docs.docker.com/desktop/',
    features: ['容器管理', 'Kubernetes', '开发环境', '可视化界面'],
    color: 'from-blue-500 to-cyan-600',
    dockerHubUrl: 'https://hub.docker.com',
    githubUrl: 'https://github.com/docker'
  },
  {
    id: 'docker-compose',
    name: 'Docker Compose',
    description: '定义和运行多容器Docker应用的工具',
    category: 'orchestration',
    icon: 'Package',
    officialUrl: 'https://docs.docker.com/compose/',
    downloadUrl: 'https://docs.docker.com/compose/install/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://docs.docker.com/compose/gettingstarted/',
    features: ['多容器编排', 'YAML配置', '服务依赖', '网络管理'],
    color: 'from-green-500 to-blue-500',
    githubUrl: 'https://github.com/docker/compose'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: '容器编排和管理平台',
    category: 'orchestration',
    icon: 'Server',
    officialUrl: 'https://kubernetes.io/',
    downloadUrl: 'https://kubernetes.io/docs/setup/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://kubernetes.io/docs/tutorials/',
    features: ['自动扩缩容', '服务发现', '负载均衡', '滚动更新'],
    color: 'from-blue-600 to-purple-600',
    githubUrl: 'https://github.com/kubernetes/kubernetes'
  },
  {
    id: 'portainer',
    name: 'Portainer',
    description: '轻量级Docker管理界面',
    category: 'monitoring',
    icon: 'Monitor',
    officialUrl: 'https://www.portainer.io/',
    downloadUrl: 'https://docs.portainer.io/start/install-ce',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Freemium',
    tutorialUrl: 'https://docs.portainer.io/',
    features: ['Web界面', '容器管理', '镜像管理', '用户权限'],
    color: 'from-indigo-500 to-blue-600',
    dockerHubUrl: 'https://hub.docker.com/r/portainer/portainer-ce',
    githubUrl: 'https://github.com/portainer/portainer'
  },
  {
    id: 'harbor',
    name: 'Harbor',
    description: '企业级Docker镜像仓库',
    category: 'registry',
    icon: 'Package',
    officialUrl: 'https://goharbor.io/',
    downloadUrl: 'https://github.com/goharbor/harbor/releases',
    platforms: ['Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://goharbor.io/docs/',
    features: ['镜像扫描', '访问控制', '审计日志', '复制同步'],
    color: 'from-teal-500 to-green-600',
    dockerHubUrl: 'https://hub.docker.com/r/goharbor/harbor-core',
    githubUrl: 'https://github.com/goharbor/harbor'
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    description: '自动更新Docker容器的工具',
    category: 'monitoring',
    icon: 'Monitor',
    officialUrl: 'https://containrrr.dev/watchtower/',
    downloadUrl: 'https://containrrr.dev/watchtower/installation/',
    platforms: ['Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://containrrr.dev/watchtower/',
    features: ['自动更新', '通知推送', '调度任务', '镜像清理'],
    color: 'from-cyan-500 to-blue-500',
    dockerHubUrl: 'https://hub.docker.com/r/containrrr/watchtower',
    githubUrl: 'https://github.com/containrrr/watchtower'
  }
];

// 快速配置模板
export const quickConfigTemplates: QuickConfigTemplate[] = [
  {
    id: 'daemon-json-linux',
    name: 'Linux Daemon配置',
    description: '配置Docker守护进程使用镜像加速',
    platform: 'linux',
    configType: 'daemon',
    template: `{
  "registry-mirrors": [
    "{{MIRROR_URL}}"
  ],
  "insecure-registries": [],
  "debug": false,
  "experimental": false
}`,
    variables: ['MIRROR_URL']
  },
  {
    id: 'daemon-json-windows',
    name: 'Windows Daemon配置',
    description: 'Windows Docker Desktop镜像配置',
    platform: 'windows',
    configType: 'daemon',
    template: `{
  "registry-mirrors": [
    "{{MIRROR_URL}}"
  ],
  "insecure-registries": [],
  "debug": false
}`,
    variables: ['MIRROR_URL']
  },
  {
    id: 'daemon-json-macos',
    name: 'macOS Daemon配置',
    description: 'macOS Docker Desktop镜像配置',
    platform: 'macos',
    configType: 'daemon',
    template: `{
  "registry-mirrors": [
    "{{MIRROR_URL}}"
  ],
  "insecure-registries": [],
  "debug": false
}`,
    variables: ['MIRROR_URL']
  }
];

// 获取Docker工具分类
export const dockerToolCategories = Array.from(new Set(dockerTools.map(tool => tool.category)));

// 根据分类获取工具
export const getDockerToolsByCategory = (category: string) => {
  return dockerTools.filter(tool => tool.category === category);
};

// 分类显示名称映射
export const categoryDisplayNames: Record<string, string> = {
  'runtime': 'Docker运行时',
  'orchestration': '容器编排',
  'registry': '镜像仓库',
  'monitoring': '监控管理',
  'security': '安全工具',
  'development': '开发工具'
};
