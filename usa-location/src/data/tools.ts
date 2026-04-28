import { LucideIcon, Globe, MapPin, Calculator, FileText, Database, Code, Palette, Shield, Download, Lock, Gamepad2, GraduationCap } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status: 'active' | 'coming-soon' | 'beta';
  category: string;
  features: string[];
  color: string;
}

export const tools: Tool[] = [
  {
    id: 'usa-identity',
    name: '🇺🇸 美国虚拟身份生成器',
    description: '生成真实格式的美国地址和完整虚构个人信息，支持州/城市筛选、批量生成、多格式导出',
    icon: Globe,
    href: '/tools/usa-identity',
    status: 'active',
    category: '数据生成',
    features: ['地址生成', '个人信息', '批量导出', '地图定位', '免税州筛选'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'dev-tools',
    name: '💻 编程软件下载中心',
    description: '汇聚常见编程开发工具的官方下载地址和安装教程，从IDE到运行时，从数据库到容器化工具',
    icon: Download,
    href: '/tools/dev-tools',
    status: 'active',
    category: '开发工具',
    features: ['官方下载', '安装教程', '多平台支持', '分类筛选', '版本信息'],
    color: 'from-green-500 to-blue-600'
  },
  {
    id: 'crypto-tool',
    name: '🔐 双向文本加密解密',
    description: '支持主流加密算法和古典密码的双向文本加密解密工具，提供AES、DES、凯撒密码等多种加密方式',
    icon: Lock,
    href: '/tools/crypto-tool',
    status: 'active',
    category: '安全工具',
    features: ['主流加密', '古典密码', '双向转换', '密钥管理', '多种算法'],
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'mini-games',
    name: '🎮 小游戏合集',
    description: '经典小游戏合集，包含贪吃蛇、俄罗斯方块、五子棋等热门游戏，支持个性化设置和游戏记录',
    icon: Gamepad2,
    href: '/tools/mini-games',
    status: 'active',
    category: '娱乐工具',
    features: ['贪吃蛇', '俄罗斯方块', '五子棋', '个性化设置', '游戏记录'],
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'academic-center',
    name: '🎓 学术中心',
    description: '汇聚计算机科学领域的权威学术资源，包含DBLP、Google Scholar、LetPub等30+学术平台',
    icon: GraduationCap,
    href: '/tools/academic-center',
    status: 'active',
    category: '学术工具',
    features: ['文献检索', '期刊评估', '学术社交', '研究工具', '权威资源'],
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'password-generator',
    name: '🔐 密码生成器',
    description: '生成安全强密码，支持自定义规则、批量生成、强度检测',
    icon: Shield,
    href: '/tools/password-generator',
    status: 'coming-soon',
    category: '安全工具',
    features: ['自定义规则', '强度检测', '批量生成', '安全存储'],
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'json-formatter',
    name: '📝 JSON格式化工具',
    description: 'JSON数据格式化、压缩、验证和转换工具',
    icon: FileText,
    href: '/tools/json-formatter',
    status: 'coming-soon',
    category: '开发工具',
    features: ['格式化', '压缩', '验证', '转换'],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'color-palette',
    name: '🎨 调色板生成器',
    description: '生成和谐的颜色搭配方案，支持多种色彩模式',
    icon: Palette,
    href: '/tools/color-palette',
    status: 'coming-soon',
    category: '设计工具',
    features: ['色彩搭配', '多种模式', '导出功能', '预览效果'],
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'base64-converter',
    name: '🔄 Base64转换器',
    description: '文本、图片与Base64编码的双向转换工具',
    icon: Code,
    href: '/tools/base64-converter',
    status: 'coming-soon',
    category: '开发工具',
    features: ['文本转换', '图片转换', '双向转换', '批量处理'],
    color: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'qr-generator',
    name: '📱 二维码生成器',
    description: '生成各种类型的二维码，支持自定义样式和批量生成',
    icon: Database,
    href: '/tools/qr-generator',
    status: 'coming-soon',
    category: '实用工具',
    features: ['多种类型', '自定义样式', '批量生成', '高清导出'],
    color: 'from-cyan-500 to-blue-600'
  }
];

export const categories = Array.from(new Set(tools.map(tool => tool.category)));

export const getToolsByCategory = (category: string) => {
  return tools.filter(tool => tool.category === category);
};

export const getActiveTools = () => {
  return tools.filter(tool => tool.status === 'active');
};

export const getComingSoonTools = () => {
  return tools.filter(tool => tool.status === 'coming-soon');
};
