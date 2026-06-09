import { LucideIcon, Search, BookOpen, BarChart3, Users, Wrench, Globe, Database, FileText, GraduationCap, Microscope } from 'lucide-react';

export interface AcademicResource {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  url: string;
  accessType: 'Free' | 'Subscription' | 'Institutional' | 'Freemium';
  features: string[];
  color: string;
  tags: string[];
  language: 'Chinese' | 'English' | 'Multilingual';
  isCustom?: boolean;
  createdAt?: number;
}

export const academicResources: AcademicResource[] = [
  // 文献检索类
  {
    id: 'dblp',
    name: 'DBLP',
    description: '计算机科学文献数据库，收录顶级会议和期刊论文，提供完整的引文信息',
    category: '文献检索',
    icon: Database,
    url: 'https://dblp.org/',
    accessType: 'Free',
    features: ['计算机科学专业', '会议期刊收录', '引文分析', '作者检索', '免费访问'],
    color: 'from-blue-500 to-indigo-600',
    tags: ['计算机科学', '会议', '期刊', '引文'],
    language: 'English'
  },
  {
    id: 'google-scholar',
    name: 'Google Scholar',
    description: '谷歌学术搜索引擎，覆盖所有学科领域，提供免费的学术文献搜索服务',
    category: '文献检索',
    icon: Search,
    url: 'https://scholar.google.com/',
    accessType: 'Free',
    features: ['全学科覆盖', '引用统计', '作者档案', '期刊排名', '免费访问'],
    color: 'from-green-500 to-blue-600',
    tags: ['全学科', '搜索引擎', '引用', '免费'],
    language: 'Multilingual'
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    description: '预印本论文库，收录物理、数学、计算机科学等领域的最新研究成果',
    category: '文献检索',
    icon: FileText,
    url: 'https://arxiv.org/',
    accessType: 'Free',
    features: ['预印本论文', '最新研究', '开放获取', '多学科', '免费下载'],
    color: 'from-purple-500 to-pink-600',
    tags: ['预印本', '物理', '数学', '计算机'],
    language: 'English'
  },
  {
    id: 'web-of-science',
    name: 'Web of Science',
    description: '科学引文索引数据库，提供高质量的学术文献和引文分析服务',
    category: '文献检索',
    icon: Globe,
    url: 'https://www.webofscience.com/',
    accessType: 'Subscription',
    features: ['引文索引', '影响因子', '期刊排名', '研究趋势', '高质量文献'],
    color: 'from-orange-500 to-red-600',
    tags: ['引文索引', 'SCI', '影响因子', '权威'],
    language: 'English'
  },
  {
    id: 'scopus',
    name: 'Scopus',
    description: 'Elsevier的文献数据库，工程技术和医学领域覆盖全面',
    category: '文献检索',
    icon: Microscope,
    url: 'https://www.scopus.com/',
    accessType: 'Subscription',
    features: ['工程技术强项', '医学文献', '引文分析', '作者档案', '期刊指标'],
    color: 'from-teal-500 to-cyan-600',
    tags: ['工程', '医学', 'Elsevier', '引文'],
    language: 'English'
  },

  // 期刊评估类
  {
    id: 'letpub',
    name: 'LetPub',
    description: 'SCI期刊影响因子查询和投稿分析系统，提供期刊选择建议',
    category: '期刊评估',
    icon: BarChart3,
    url: 'http://www.letpub.com.cn/',
    accessType: 'Freemium',
    features: ['影响因子查询', '投稿难度分析', '审稿周期', '期刊分区', '中文界面'],
    color: 'from-red-500 to-pink-600',
    tags: ['影响因子', 'SCI', '投稿', '中文'],
    language: 'Chinese'
  },
  {
    id: 'jcr',
    name: 'JCR期刊引证报告',
    description: '官方期刊影响因子数据库，提供权威的期刊评价指标',
    category: '期刊评估',
    icon: BarChart3,
    url: 'https://jcr.clarivate.com/',
    accessType: 'Subscription',
    features: ['官方影响因子', '期刊排名', '引用指标', '学科分类', '权威数据'],
    color: 'from-blue-600 to-purple-600',
    tags: ['JCR', '影响因子', '官方', '权威'],
    language: 'English'
  },
  {
    id: 'ei-compendex',
    name: 'EI Compendex',
    description: '工程索引数据库，工程技术领域的权威检索工具',
    category: '期刊评估',
    icon: Wrench,
    url: 'https://www.engineeringvillage.com/',
    accessType: 'Subscription',
    features: ['工程索引', '技术文献', 'EI收录', '专利检索', '工程专业'],
    color: 'from-gray-600 to-blue-600',
    tags: ['EI', '工程', '技术', '索引'],
    language: 'English'
  },
  {
    id: 'cas-journal-ranking',
    name: '中科院期刊分区',
    description: '中国科学院期刊分区表，为中国学者提供期刊评价参考',
    category: '期刊评估',
    icon: GraduationCap,
    url: 'https://www.fenqubiao.com/',
    accessType: 'Free',
    features: ['中科院分区', '期刊评价', '中文服务', '学科分类', '免费查询'],
    color: 'from-green-600 to-teal-600',
    tags: ['中科院', '分区', '中文', '免费'],
    language: 'Chinese'
  },

  // 学科专业库
  {
    id: 'ieee-xplore',
    name: 'IEEE Xplore',
    description: 'IEEE数字图书馆，电气电子工程师学会的权威文献库',
    category: '学科专业库',
    icon: Database,
    url: 'https://ieeexplore.ieee.org/',
    accessType: 'Subscription',
    features: ['电子工程', '计算机科学', 'IEEE标准', '会议论文', '期刊文章'],
    color: 'from-blue-500 to-cyan-600',
    tags: ['IEEE', '电子', '计算机', '标准'],
    language: 'English'
  },
  {
    id: 'acm-dl',
    name: 'ACM Digital Library',
    description: '计算机协会数字图书馆，计算机科学领域的权威资源',
    category: '学科专业库',
    icon: Database,
    url: 'https://dl.acm.org/',
    accessType: 'Subscription',
    features: ['计算机科学', 'ACM期刊', '会议论文', '技术报告', '专业权威'],
    color: 'from-purple-500 to-blue-600',
    tags: ['ACM', '计算机', '会议', '期刊'],
    language: 'English'
  },
  {
    id: 'pubmed',
    name: 'PubMed',
    description: '美国国立医学图书馆的医学文献数据库，生物医学领域权威资源',
    category: '学科专业库',
    icon: Microscope,
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    accessType: 'Free',
    features: ['医学文献', '生物科学', '免费访问', '权威数据', 'MEDLINE收录'],
    color: 'from-green-500 to-emerald-600',
    tags: ['医学', '生物', 'MEDLINE', '免费'],
    language: 'English'
  },
  {
    id: 'mathscinet',
    name: 'MathSciNet',
    description: '数学评论数据库，数学领域的权威文献检索工具',
    category: '学科专业库',
    icon: BarChart3,
    url: 'https://mathscinet.ams.org/',
    accessType: 'Subscription',
    features: ['数学文献', '评论系统', '分类检索', '权威评价', '专业深度'],
    color: 'from-indigo-500 to-purple-600',
    tags: ['数学', '评论', 'AMS', '专业'],
    language: 'English'
  },

  // 学术社交类
  {
    id: 'researchgate',
    name: 'ResearchGate',
    description: '科研人员社交网络平台，分享研究成果和学术交流',
    category: '学术社交',
    icon: Users,
    url: 'https://www.researchgate.net/',
    accessType: 'Free',
    features: ['学术社交', '论文分享', '研究合作', '问答社区', '影响力评估'],
    color: 'from-cyan-500 to-blue-600',
    tags: ['社交', '合作', '分享', '网络'],
    language: 'English'
  },
  {
    id: 'academia-edu',
    name: 'Academia.edu',
    description: '学术论文分享平台，研究者展示和推广学术成果的社交网络',
    category: '学术社交',
    icon: Users,
    url: 'https://www.academia.edu/',
    accessType: 'Freemium',
    features: ['论文分享', '学术档案', '关注系统', '统计分析', '推广平台'],
    color: 'from-green-500 to-teal-600',
    tags: ['分享', '档案', '推广', '社交'],
    language: 'English'
  },
  {
    id: 'orcid',
    name: 'ORCID',
    description: '研究者身份识别系统，为学者提供唯一的数字身份标识',
    category: '学术社交',
    icon: Users,
    url: 'https://orcid.org/',
    accessType: 'Free',
    features: ['身份识别', '学术档案', '成果管理', '国际标准', '免费注册'],
    color: 'from-orange-500 to-red-600',
    tags: ['身份', '标识', '档案', '标准'],
    language: 'Multilingual'
  },
  {
    id: 'mendeley',
    name: 'Mendeley',
    description: '文献管理和学术社交平台，帮助研究者管理和分享文献资源',
    category: '学术社交',
    icon: BookOpen,
    url: 'https://www.mendeley.com/',
    accessType: 'Freemium',
    features: ['文献管理', 'PDF注释', '社交网络', '引用生成', '云端同步'],
    color: 'from-red-500 to-pink-600',
    tags: ['文献管理', '注释', '同步', '引用'],
    language: 'English'
  },

  // 研究工具类
  {
    id: 'zotero',
    name: 'Zotero',
    description: '开源文献管理工具，帮助收集、整理和引用研究资料',
    category: '研究工具',
    icon: BookOpen,
    url: 'https://www.zotero.org/',
    accessType: 'Free',
    features: ['文献管理', '自动抓取', '引用格式', '团队协作', '开源免费'],
    color: 'from-blue-500 to-purple-600',
    tags: ['文献管理', '开源', '免费', '协作'],
    language: 'Multilingual'
  },
  {
    id: 'endnote',
    name: 'EndNote',
    description: '专业文献管理软件，提供强大的文献组织和引用功能',
    category: '研究工具',
    icon: BookOpen,
    url: 'https://endnote.com/',
    accessType: 'Subscription',
    features: ['专业管理', '引用格式', '数据库同步', '团队共享', '期刊匹配'],
    color: 'from-gray-600 to-blue-600',
    tags: ['专业', '管理', '引用', '同步'],
    language: 'English'
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    description: '英文写作辅助工具，提供语法检查和写作建议',
    category: '研究工具',
    icon: FileText,
    url: 'https://www.grammarly.com/',
    accessType: 'Freemium',
    features: ['语法检查', '拼写纠错', '写作建议', '学术写作', '浏览器插件'],
    color: 'from-green-500 to-blue-600',
    tags: ['写作', '语法', '英文', '检查'],
    language: 'English'
  },
  {
    id: 'overleaf',
    name: 'Overleaf',
    description: '在线LaTeX编辑器，专为学术论文写作设计的协作平台',
    category: '研究工具',
    icon: FileText,
    url: 'https://www.overleaf.com/',
    accessType: 'Freemium',
    features: ['LaTeX编辑', '实时协作', '模板库', '版本控制', '期刊模板'],
    color: 'from-green-600 to-teal-600',
    tags: ['LaTeX', '协作', '模板', '论文'],
    language: 'English'
  }
];

export const categories = Array.from(new Set(academicResources.map(resource => resource.category)));

export const getResourcesByCategory = (category: string) => {
  return academicResources.filter(resource => resource.category === category);
};

// 自定义资源可选图标
export const customResourceIcons = [
  { name: 'Search', icon: Search, label: '搜索' },
  { name: 'BookOpen', icon: BookOpen, label: '书籍' },
  { name: 'Database', icon: Database, label: '数据库' },
  { name: 'FileText', icon: FileText, label: '文档' },
  { name: 'Globe', icon: Globe, label: '网站' },
  { name: 'GraduationCap', icon: GraduationCap, label: '学术' },
  { name: 'Microscope', icon: Microscope, label: '研究' },
  { name: 'BarChart3', icon: BarChart3, label: '分析' },
  { name: 'Users', icon: Users, label: '社交' },
  { name: 'Wrench', icon: Wrench, label: '工具' }
];

// 自定义资源可选颜色
export const customResourceColors = [
  { name: 'blue', value: 'from-blue-500 to-indigo-600', label: '蓝色' },
  { name: 'green', value: 'from-green-500 to-emerald-600', label: '绿色' },
  { name: 'purple', value: 'from-purple-500 to-pink-600', label: '紫色' },
  { name: 'red', value: 'from-red-500 to-pink-600', label: '红色' },
  { name: 'orange', value: 'from-orange-500 to-red-600', label: '橙色' },
  { name: 'teal', value: 'from-teal-500 to-cyan-600', label: '青色' },
  { name: 'indigo', value: 'from-indigo-500 to-purple-600', label: '靛蓝' },
  { name: 'gray', value: 'from-gray-500 to-slate-600', label: '灰色' }
];

// 获取图标组件
export const getIconComponent = (iconName: string): LucideIcon => {
  const iconMap: { [key: string]: LucideIcon } = {
    Search, BookOpen, Database, FileText, Globe,
    GraduationCap, Microscope, BarChart3, Users, Wrench
  };
  return iconMap[iconName] || Search;
};

// 访问类型颜色
export const getAccessTypeColor = (accessType: string): string => {
  switch (accessType) {
    case 'Free':
      return 'text-green-700 bg-green-100 border-green-200';
    case 'Subscription':
      return 'text-blue-700 bg-blue-100 border-blue-200';
    case 'Institutional':
      return 'text-purple-700 bg-purple-100 border-purple-200';
    case 'Freemium':
      return 'text-orange-700 bg-orange-100 border-orange-200';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200';
  }
};

// 语言颜色
export const getLanguageColor = (language: string): string => {
  switch (language) {
    case 'Chinese':
      return 'text-red-700 bg-red-100';
    case 'English':
      return 'text-blue-700 bg-blue-100';
    case 'Multilingual':
      return 'text-green-700 bg-green-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};
