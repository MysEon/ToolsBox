import { Globe, FileText, Database, Code, Palette, Shield, Download, Lock, Gamepad2, GraduationCap, ImageDown, FileStack, Braces, Clock3, Link2, Hash, FilePenLine } from 'lucide-react';
import NintendoIcon from '@/shared/components/icons/NintendoIcon';
import type { ComponentType } from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
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
    id: 'spongebob-test',
    name: '🧽 海绵宝宝人格测试',
    description: '18道灵魂拷问，测测你是海绵宝宝里的谁，内含15种稀有度角色结果和分享卡片',
    icon: Gamepad2,
    href: '/spongebob-test/',
    status: 'active',
    category: '娱乐工具',
    features: ['18道题目', '15种角色', '稀有度系统', '分享卡片', '彩带特效'],
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'image-compressor',
    name: '🖼️ 图片压缩工具',
    description: '在线压缩图片大小，支持 JPG/PNG/WebP 格式转换，可调整质量和输出尺寸，所有处理均在本地完成',
    icon: ImageDown,
    href: '/image-compressor/',
    status: 'active',
    category: '图像工具',
    features: ['质量调节', '尺寸调整', '格式转换', '拖拽上传', '本地处理'],
    color: 'from-blue-400 to-purple-500'
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
    id: 'nintendo-official',
    name: 'Nintendo 官网导航',
    description: '快速访问任天堂全球各地区官方网站，包括北美、日本、欧洲、香港等区域',
    icon: NintendoIcon,
    href: '/tools/nintendo-official',
    status: 'active',
    category: '实用工具',
    features: ['北美官网', '日本官网', '欧洲官网', '港区官网', '多区域支持'],
    color: 'from-red-500 to-red-700'
  },
  {
    id: 'ilovepdf',
    name: 'iLovePDF 在线 PDF 工具',
    description: '快速访问 iLovePDF 中文站，合并、拆分、压缩、转换、编辑 PDF 等常用文档处理功能',
    icon: FileStack,
    href: 'https://www.ilovepdf.com/zh-cn',
    status: 'active',
    category: '实用工具',
    features: ['PDF 合并', 'PDF 压缩', '格式转换', 'PDF 编辑', '在线处理'],
    color: 'from-rose-500 to-red-600'
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
  },
  {
    id: 'regex-tester',
    name: '🔍 正则表达式测试器',
    description: '实时测试正则匹配结果，展示捕获组、命名分组和常用正则模板，所有计算均在本地完成',
    icon: Braces,
    href: '/tools/regex-tester',
    status: 'active',
    category: '开发工具',
    features: ['实时匹配', '捕获组', '模板库', '结果复制', '本地处理'],
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'timestamp-converter',
    name: '⏱️ 时间戳转换器',
    description: 'Unix 时间戳与可读时间双向转换，支持秒/毫秒识别、时区切换和当前时间复制',
    icon: Clock3,
    href: '/tools/timestamp-converter',
    status: 'active',
    category: '开发工具',
    features: ['Unix转换', '时区切换', '当前时间', '批量转换', '一键复制'],
    color: 'from-emerald-500 to-cyan-600'
  },
  {
    id: 'url-codec',
    name: '🔗 URL 编解码',
    description: 'URL 编码解码、查询参数解析与批量处理工具，支持参数表格化和 JSON 导出',
    icon: Link2,
    href: '/tools/url-codec',
    status: 'active',
    category: '开发工具',
    features: ['URL编码', 'URL解码', '参数解析', '批量处理', 'JSON导出'],
    color: 'from-sky-500 to-indigo-600'
  },
  {
    id: 'hash-generator',
    name: '#️⃣ Hash 生成器',
    description: '为文本和文件生成 MD5、SHA1、SHA256、SHA512 摘要，适合校验和开发调试',
    icon: Hash,
    href: '/tools/hash-generator',
    status: 'active',
    category: '安全工具',
    features: ['MD5', 'SHA1', 'SHA256', 'SHA512', '文件校验'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'markdown-editor',
    name: '✍️ Markdown 编辑器',
    description: '分屏 Markdown 编辑与实时预览，支持代码高亮、HTML 复制和静态 HTML 导出',
    icon: FilePenLine,
    href: '/tools/markdown-editor',
    status: 'active',
    category: '开发工具',
    features: ['实时预览', '分屏编辑', '代码高亮', 'HTML导出', '本地处理'],
    color: 'from-violet-500 to-fuchsia-600'
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
