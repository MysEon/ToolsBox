export type RegexTemplateCategory = '常用' | 'Web' | '中文场景' | '数据提取';

export interface RegexTemplate {
  id: string;
  name: string;
  pattern: string;
  flags: string;
  description: string;
  sample: string;
  category: RegexTemplateCategory;
}

export const regexTemplates: RegexTemplate[] = [
  {
    id: 'email',
    name: 'Email',
    pattern: '[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}',
    flags: 'gi',
    description: '匹配常见电子邮箱地址，适合日志、表单文本中的邮箱提取。',
    sample: 'Contact us at support@example.com or sales.team@toolsbox.dev for help.',
    category: '常用',
  },
  {
    id: 'url',
    name: 'URL',
    pattern: 'https?:\\/\\/(?:www\\.)?[\\w.-]+(?:\\.[A-Za-z]{2,})(?:[\\w./?%&=#:-]*)?',
    flags: 'gi',
    description: '匹配 http 或 https 链接，包含路径、查询参数和锚点。',
    sample: 'Docs: https://nextjs.org/docs and API: http://api.example.com/v1/users?id=42',
    category: 'Web',
  },
  {
    id: 'ipv4',
    name: 'IPv4',
    pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\b',
    flags: 'g',
    description: '匹配 0.0.0.0 到 255.255.255.255 范围内的 IPv4 地址。',
    sample: 'Gateway 192.168.1.1, DNS 8.8.8.8, invalid 999.10.10.10',
    category: '常用',
  },
  {
    id: 'uuid',
    name: 'UUID',
    pattern: '\\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\b',
    flags: 'gi',
    description: '匹配标准 UUID v1-v5 字符串。',
    sample: 'Request id: 550e8400-e29b-41d4-a716-446655440000',
    category: '常用',
  },
  {
    id: 'cn-mobile',
    name: '中国大陆手机号',
    pattern: '(?<!\\d)1[3-9]\\d{9}(?!\\d)',
    flags: 'g',
    description: '基础匹配中国大陆 11 位手机号。',
    sample: '联系电话：13800138000，备用：19912345678，错误：12800138000',
    category: '中文场景',
  },
  {
    id: 'cn-id-card-basic',
    name: '中国身份证基础',
    pattern: '(?<!\\d)[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[0-9Xx](?!\\d)',
    flags: 'g',
    description: '基础匹配 18 位中国居民身份证号格式，不校验校验位。',
    sample: '身份证号示例：11010519900307123X，另一个：440524188001010014',
    category: '中文场景',
  },
  {
    id: 'date',
    name: '日期',
    pattern: '\\b(\\d{4})[-\\/](0?[1-9]|1[0-2])[-\\/](0?[1-9]|[12]\\d|3[01])\\b',
    flags: 'g',
    description: '匹配 YYYY-MM-DD 或 YYYY/MM/DD 日期，并捕获年、月、日。',
    sample: 'Release: 2026-06-09, previous: 2025/12/31, invalid: 2026-99-99',
    category: '数据提取',
  },
  {
    id: 'hex-color',
    name: 'Hex Color',
    pattern: '#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b',
    flags: 'g',
    description: '匹配 CSS 十六进制颜色值，支持 3、6、8 位。',
    sample: 'Colors: #fff, #0ea5e9, #111827ff, invalid #12',
    category: 'Web',
  },
  {
    id: 'html-tag',
    name: 'HTML 标签',
    pattern: '<\\/?([A-Za-z][A-Za-z0-9-]*)(?:\\s+[^<>]*)?>',
    flags: 'g',
    description: '匹配 HTML 开始或结束标签，并捕获标签名。',
    sample: '<main><h1 class="title">ToolsBox</h1><br /></main>',
    category: 'Web',
  },
  {
    id: 'whitespace-cleanup',
    name: '空白清理',
    pattern: '[ \\t]{2,}|\\n{3,}',
    flags: 'g',
    description: '定位连续空格、制表符或过多空行，便于文本清理。',
    sample: 'Hello    world\n\n\nThis\t\tline has extra whitespace.',
    category: '常用',
  },
  {
    id: 'markdown-links',
    name: 'Markdown 链接',
    pattern: '\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)',
    flags: 'g',
    description: '提取 Markdown 链接文本和 URL，捕获链接标题与地址。',
    sample: 'Read [Next.js docs](https://nextjs.org/docs) and [Tailwind](https://tailwindcss.com/).',
    category: '数据提取',
  },
];
