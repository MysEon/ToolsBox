import { LucideIcon, Code, Database, Container, GitBranch, Palette, Terminal, Globe, Settings } from 'lucide-react';

export interface DevTool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  officialUrl: string;
  downloadUrl: string;
  platforms: string[];
  version?: string;
  license: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  tutorialUrl?: string;
  features: string[];
  color: string;
}

export const devTools: DevTool[] = [
  // IDE/编辑器
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    description: '微软开发的免费代码编辑器，支持多种编程语言和丰富的扩展生态',
    category: 'IDE/编辑器',
    icon: Code,
    officialUrl: 'https://code.visualstudio.com/',
    downloadUrl: 'https://code.visualstudio.com/download',
    platforms: ['Windows', 'macOS', 'Linux'],
    version: '最新版',
    license: 'Free',
    tutorialUrl: 'https://code.visualstudio.com/docs',
    features: ['智能代码补全', '调试支持', '扩展市场', 'Git集成', '多语言支持'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'intellij-idea',
    name: 'IntelliJ IDEA',
    description: 'JetBrains开发的强大Java IDE，支持多种JVM语言和框架',
    category: 'IDE/编辑器',
    icon: Code,
    officialUrl: 'https://www.jetbrains.com/idea/',
    downloadUrl: 'https://www.jetbrains.com/idea/download/',
    platforms: ['Windows', 'macOS', 'Linux'],
    version: '2024.3',
    license: 'Freemium',
    tutorialUrl: 'https://www.jetbrains.com/help/idea/',
    features: ['智能代码分析', '重构工具', '调试器', '版本控制', '框架支持'],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'eclipse',
    name: 'Eclipse IDE',
    description: '开源的集成开发环境，主要用于Java开发，支持多种编程语言',
    category: 'IDE/编辑器',
    icon: Code,
    officialUrl: 'https://www.eclipse.org/',
    downloadUrl: 'https://www.eclipse.org/downloads/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://help.eclipse.org/',
    features: ['插件架构', '项目管理', '调试工具', '团队协作', '多语言支持'],
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'sublime-text',
    name: 'Sublime Text',
    description: '轻量级但功能强大的文本编辑器，以速度和简洁著称',
    category: 'IDE/编辑器',
    icon: Code,
    officialUrl: 'https://www.sublimetext.com/',
    downloadUrl: 'https://www.sublimetext.com/download',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Paid',
    tutorialUrl: 'https://www.sublimetext.com/docs/',
    features: ['多重选择', '命令面板', '插件支持', '快速搜索', '分屏编辑'],
    color: 'from-yellow-500 to-orange-600'
  },

  // 编程语言运行时
  {
    id: 'nodejs',
    name: 'Node.js',
    description: '基于Chrome V8引擎的JavaScript运行时，用于构建服务器端应用',
    category: '编程语言运行时',
    icon: Terminal,
    officialUrl: 'https://nodejs.org/',
    downloadUrl: 'https://nodejs.org/en/download/',
    platforms: ['Windows', 'macOS', 'Linux'],
    version: 'v22.16.0 LTS',
    license: 'Open Source',
    tutorialUrl: 'https://nodejs.org/en/docs/',
    features: ['事件驱动', '非阻塞I/O', 'npm包管理', '跨平台', '高性能'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'python',
    name: 'Python',
    description: '简洁优雅的编程语言，广泛用于Web开发、数据科学、AI等领域',
    category: '编程语言运行时',
    icon: Terminal,
    officialUrl: 'https://www.python.org/',
    downloadUrl: 'https://www.python.org/downloads/',
    platforms: ['Windows', 'macOS', 'Linux'],
    version: '3.13.4',
    license: 'Open Source',
    tutorialUrl: 'https://docs.python.org/',
    features: ['简洁语法', '丰富库生态', '跨平台', '解释型', '面向对象'],
    color: 'from-blue-500 to-yellow-500'
  },
  {
    id: 'java-jdk',
    name: 'Java JDK',
    description: 'Oracle官方Java开发工具包，包含编译器、运行时和开发工具',
    category: '编程语言运行时',
    icon: Terminal,
    officialUrl: 'https://www.oracle.com/java/',
    downloadUrl: 'https://www.oracle.com/java/technologies/downloads/',
    platforms: ['Windows', 'macOS', 'Linux'],
    version: 'JDK 24 / JDK 21 LTS',
    license: 'Freemium',
    tutorialUrl: 'https://docs.oracle.com/en/java/',
    features: ['跨平台', '面向对象', '强类型', '垃圾回收', '企业级'],
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'go',
    name: 'Go',
    description: 'Google开发的编程语言，以简洁、高效和并发支持著称',
    category: '编程语言运行时',
    icon: Terminal,
    officialUrl: 'https://golang.org/',
    downloadUrl: 'https://golang.org/dl/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://golang.org/doc/',
    features: ['并发支持', '快速编译', '静态类型', '垃圾回收', '简洁语法'],
    color: 'from-cyan-500 to-blue-600'
  },

  // 容器化工具
  {
    id: 'docker',
    name: 'Docker Desktop',
    description: '容器化平台，简化应用程序的打包、分发和运行',
    category: '容器化工具',
    icon: Container,
    officialUrl: 'https://www.docker.com/',
    downloadUrl: 'https://www.docker.com/products/docker-desktop/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Freemium',
    tutorialUrl: 'https://docs.docker.com/',
    features: ['容器管理', '镜像构建', 'Kubernetes集成', '开发环境', '微服务支持'],
    color: 'from-blue-500 to-cyan-600'
  },

  // 版本控制
  {
    id: 'git',
    name: 'Git',
    description: '分布式版本控制系统，是现代软件开发的标准工具',
    category: '版本控制',
    icon: GitBranch,
    officialUrl: 'https://git-scm.com/',
    downloadUrl: 'https://git-scm.com/downloads',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://git-scm.com/doc',
    features: ['分布式', '分支管理', '合并工具', '历史追踪', '协作开发'],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'github-desktop',
    name: 'GitHub Desktop',
    description: 'GitHub官方桌面客户端，提供可视化的Git操作界面',
    category: '版本控制',
    icon: GitBranch,
    officialUrl: 'https://desktop.github.com/',
    downloadUrl: 'https://desktop.github.com/',
    platforms: ['Windows', 'macOS'],
    license: 'Free',
    tutorialUrl: 'https://docs.github.com/en/desktop',
    features: ['可视化界面', 'GitHub集成', '分支管理', '冲突解决', '历史查看'],
    color: 'from-gray-700 to-gray-900'
  },

  // 关系型数据库
  {
    id: 'mysql',
    name: 'MySQL',
    description: '世界上最流行的开源关系型数据库管理系统',
    category: '关系型数据库',
    icon: Database,
    officialUrl: 'https://www.mysql.com/',
    downloadUrl: 'https://dev.mysql.com/downloads/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://dev.mysql.com/doc/',
    features: ['ACID事务', '复制支持', '高性能', '可扩展', 'SQL标准'],
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: '功能强大的开源对象关系型数据库系统',
    category: '关系型数据库',
    icon: Database,
    officialUrl: 'https://www.postgresql.org/',
    downloadUrl: 'https://www.postgresql.org/download/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://www.postgresql.org/docs/',
    features: ['ACID兼容', '扩展性', 'JSON支持', '全文搜索', '并发控制'],
    color: 'from-blue-500 to-indigo-600'
  },

  // NoSQL数据库
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: '流行的NoSQL文档数据库，适用于现代应用开发',
    category: 'NoSQL数据库',
    icon: Database,
    officialUrl: 'https://www.mongodb.com/',
    downloadUrl: 'https://www.mongodb.com/try/download/community',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://docs.mongodb.com/',
    features: ['文档存储', '水平扩展', '灵活模式', '聚合框架', '分片支持'],
    color: 'from-green-500 to-green-700'
  },

  // 内存数据库
  {
    id: 'redis',
    name: 'Redis',
    description: '高性能的内存数据结构存储，用作数据库、缓存和消息代理',
    category: '内存数据库',
    icon: Database,
    officialUrl: 'https://redis.io/',
    downloadUrl: 'https://redis.io/downloads/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://redis.io/docs/',
    features: ['内存存储', '数据结构', '发布订阅', '事务支持', '集群模式'],
    color: 'from-red-500 to-red-600'
  },

  // 向量数据库
  {
    id: 'milvus',
    name: 'Milvus',
    description: '开源向量数据库，专为GenAI应用构建，支持大规模向量相似性搜索',
    category: '向量数据库',
    icon: Database,
    officialUrl: 'https://milvus.io/',
    downloadUrl: 'https://milvus.io/docs/install_standalone-docker.md',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://milvus.io/docs/',
    features: ['向量搜索', '高性能', '可扩展', 'AI集成', '多种部署'],
    color: 'from-blue-600 to-purple-700'
  },
  {
    id: 'weaviate',
    name: 'Weaviate',
    description: 'AI原生向量数据库，支持混合搜索和多模态数据处理',
    category: '向量数据库',
    icon: Database,
    officialUrl: 'https://weaviate.io/',
    downloadUrl: 'https://weaviate.io/developers/weaviate/installation',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://weaviate.io/developers/weaviate',
    features: ['混合搜索', '多模态', 'GraphQL API', '云原生', 'AI集成'],
    color: 'from-green-600 to-teal-700'
  },
  {
    id: 'chroma',
    name: 'Chroma',
    description: '开源嵌入式数据库，专为AI应用设计的向量存储解决方案',
    category: '向量数据库',
    icon: Database,
    officialUrl: 'https://www.trychroma.com/',
    downloadUrl: 'https://docs.trychroma.com/getting-started',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://docs.trychroma.com/',
    features: ['嵌入式', '简单易用', 'Python友好', '内存高效', 'AI优化'],
    color: 'from-orange-500 to-pink-600'
  },
  {
    id: 'pinecone',
    name: 'Pinecone',
    description: '完全托管的向量数据库服务，为生产环境的AI应用提供高性能搜索',
    category: '向量数据库',
    icon: Database,
    officialUrl: 'https://www.pinecone.io/',
    downloadUrl: 'https://docs.pinecone.io/docs/quickstart',
    platforms: ['云服务'],
    license: 'Freemium',
    tutorialUrl: 'https://docs.pinecone.io/',
    features: ['托管服务', '实时更新', '高可用', '自动扩展', '企业级'],
    color: 'from-indigo-600 to-blue-700'
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    description: '高性能开源向量数据库，专为大规模AI应用设计，支持Rust构建',
    category: '向量数据库',
    icon: Database,
    officialUrl: 'https://qdrant.tech/',
    downloadUrl: 'https://qdrant.tech/documentation/quick-start/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://qdrant.tech/documentation/',
    features: ['高性能', 'Rust构建', '云原生', '易部署', '企业级'],
    color: 'from-purple-600 to-indigo-700'
  },
  {
    id: 'faiss',
    name: 'FAISS',
    description: 'Facebook开源的高效相似性搜索和密集向量聚类库',
    category: '向量数据库',
    icon: Database,
    officialUrl: 'https://github.com/facebookresearch/faiss',
    downloadUrl: 'https://github.com/facebookresearch/faiss/blob/main/INSTALL.md',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://github.com/facebookresearch/faiss/wiki',
    features: ['高效搜索', 'GPU加速', '大规模', '聚类算法', 'C++/Python'],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'annoy',
    name: 'Annoy',
    description: 'Spotify开源的近似最近邻搜索库，内存高效且快速',
    category: '向量数据库',
    icon: Database,
    officialUrl: 'https://github.com/spotify/annoy',
    downloadUrl: 'https://github.com/spotify/annoy#installation',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://github.com/spotify/annoy#full-documentation',
    features: ['内存高效', '快速查询', '只读索引', '多语言', '轻量级'],
    color: 'from-green-400 to-blue-500'
  },

  // 搜索引擎
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    description: '分布式搜索和分析引擎，支持全文搜索和向量搜索功能',
    category: '搜索引擎',
    icon: Database,
    officialUrl: 'https://www.elastic.co/elasticsearch/',
    downloadUrl: 'https://www.elastic.co/downloads/elasticsearch',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Freemium',
    tutorialUrl: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/',
    features: ['全文搜索', '向量搜索', '分布式', '实时分析', 'RESTful API'],
    color: 'from-yellow-500 to-orange-600'
  },

  // 前端工具
  {
    id: 'npm',
    name: 'npm',
    description: 'Node.js的包管理器，世界上最大的软件注册表',
    category: '前端工具',
    icon: Settings,
    officialUrl: 'https://www.npmjs.com/',
    downloadUrl: 'https://nodejs.org/en/download/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://docs.npmjs.com/',
    features: ['包管理', '依赖解析', '脚本运行', '版本控制', '发布工具'],
    color: 'from-red-600 to-red-700'
  },
  {
    id: 'yarn',
    name: 'Yarn',
    description: '快速、可靠、安全的依赖管理工具',
    category: '前端工具',
    icon: Settings,
    officialUrl: 'https://yarnpkg.com/',
    downloadUrl: 'https://yarnpkg.com/getting-started/install',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://yarnpkg.com/getting-started',
    features: ['快速安装', '离线模式', '确定性安装', '网络性能', '多包仓库'],
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'vite',
    name: 'Vite',
    description: '下一代前端构建工具，提供极速的开发体验',
    category: '前端工具',
    icon: Settings,
    officialUrl: 'https://vitejs.dev/',
    downloadUrl: 'https://vitejs.dev/guide/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://vitejs.dev/guide/',
    features: ['极速启动', '热更新', '优化构建', '插件生态', 'TypeScript支持'],
    color: 'from-purple-500 to-pink-600'
  },

  // 更多编程语言
  {
    id: 'rust',
    name: 'Rust',
    description: '系统编程语言，注重安全、速度和并发',
    category: '编程语言运行时',
    icon: Terminal,
    officialUrl: 'https://www.rust-lang.org/',
    downloadUrl: 'https://www.rust-lang.org/tools/install',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://doc.rust-lang.org/',
    features: ['内存安全', '零成本抽象', '并发支持', '跨平台', '包管理器'],
    color: 'from-orange-600 to-red-600'
  },
  {
    id: 'dotnet',
    name: '.NET',
    description: '微软开发的跨平台开发框架，支持多种编程语言',
    category: '编程语言运行时',
    icon: Terminal,
    officialUrl: 'https://dotnet.microsoft.com/',
    downloadUrl: 'https://dotnet.microsoft.com/download',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://docs.microsoft.com/dotnet/',
    features: ['跨平台', '高性能', '云原生', '开源', '统一平台'],
    color: 'from-purple-600 to-blue-600'
  },
  {
    id: 'php',
    name: 'PHP',
    description: '流行的服务器端脚本语言，特别适合Web开发',
    category: '编程语言运行时',
    icon: Terminal,
    officialUrl: 'https://www.php.net/',
    downloadUrl: 'https://www.php.net/downloads',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://www.php.net/manual/',
    features: ['Web开发', '跨平台', '丰富库', '数据库支持', '模板引擎'],
    color: 'from-indigo-500 to-purple-600'
  },

  // 更多IDE
  {
    id: 'atom',
    name: 'Atom',
    description: 'GitHub开发的可定制文本编辑器（已停止维护）',
    category: 'IDE/编辑器',
    icon: Code,
    officialUrl: 'https://github.com/atom/atom',
    downloadUrl: 'https://github.com/atom/atom/releases',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Open Source',
    tutorialUrl: 'https://flight-manual.atom.io/',
    features: ['可定制', '包管理', 'Git集成', '多窗格', '智能补全'],
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'webstorm',
    name: 'WebStorm',
    description: 'JetBrains开发的JavaScript和Web开发IDE',
    category: 'IDE/编辑器',
    icon: Code,
    officialUrl: 'https://www.jetbrains.com/webstorm/',
    downloadUrl: 'https://www.jetbrains.com/webstorm/download/',
    platforms: ['Windows', 'macOS', 'Linux'],
    license: 'Paid',
    tutorialUrl: 'https://www.jetbrains.com/help/webstorm/',
    features: ['智能编码', '调试工具', '版本控制', '框架支持', '重构工具'],
    color: 'from-cyan-500 to-blue-600'
  }
];

export const categories = Array.from(new Set(devTools.map(tool => tool.category)));

export const getToolsByCategory = (category: string) => {
  return devTools.filter(tool => tool.category === category);
};

export const getLicenseColor = (license: string) => {
  switch (license) {
    case 'Free':
    case 'Open Source':
      return 'text-green-600 bg-green-100';
    case 'Freemium':
      return 'text-blue-600 bg-blue-100';
    case 'Paid':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};
