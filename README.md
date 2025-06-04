# 🛠️ 开发者工具箱

一个集成多种实用开发工具的现代化工具集合，为开发者和创作者提供高效便捷的解决方案。


## ✨ 工具列表

### 🟢 可用工具
- **🇺🇸 美国虚拟身份生成器**: 生成真实格式的美国地址和完整虚构个人信息
  - 真实地址格式生成
  - 完整个人档案信息
  - 州/城市精确筛选
  - 免税州筛选功能
  - 批量生成和导出
  - 地图可视化定位

### 🟡 即将推出
- **🔐 密码生成器**: 生成安全强密码，支持自定义规则
- **📝 JSON格式化工具**: JSON数据格式化、压缩、验证
- **🎨 调色板生成器**: 生成和谐的颜色搭配方案
- **🔄 Base64转换器**: 文本、图片与Base64编码转换
- **📱 二维码生成器**: 生成各种类型的二维码

## 🚀 快速开始

### 本地开发

```bash
# 进入项目目录
cd usa-location

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
open http://localhost:3001
```

### 部署到GitHub Pages

1. **启用GitHub Pages**
   - 仓库设置 → Pages → Source → "GitHub Actions"

2. **推送代码**
   ```bash
   git push origin main
   ```

3. **自动部署**
   - GitHub Actions自动构建和部署
   - 访问：`https://[username].github.io/USAlocation/`

详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ 技术栈

- **框架**: Next.js 15 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **地图**: React Leaflet
- **数据生成**: Faker.js
- **部署**: GitHub Pages + GitHub Actions

## 📁 项目结构

```
USAlocation/
├── .github/workflows/deploy.yml    # GitHub Actions部署配置
├── usa-location/                   # Next.js应用
│   ├── src/                        # 源代码
│   │   ├── app/                    # 页面路由
│   │   ├── components/             # React组件
│   │   ├── data/                   # 数据配置
│   │   └── utils/                  # 工具函数
│   ├── public/                     # 静态资源
│   ├── package.json                # 项目依赖
│   └── next.config.ts              # Next.js配置
├── DEPLOYMENT.md                   # 部署指南
└── README.md                       # 项目说明
```

## 🌟 特色功能

- **完全免费**: 所有工具完全免费使用，无需注册
- **智能搜索**: 支持按工具名称、功能、分类快速搜索
- **现代设计**: 美观的用户界面和流畅的交互体验
- **响应式**: 完美适配桌面端和移动端设备
- **高性能**: 基于最新技术栈，确保快速响应
- **自动部署**: GitHub Actions自动化部署流程

## ⚠️ 重要声明

**本工具箱中生成的所有虚拟信息均为虚构数据，仅供测试和开发使用。**

- 所有个人信息都是随机生成的虚假数据
- SSN、信用卡号等敏感信息均为无效格式
- 地址信息虽然格式真实，但不对应实际地址
- 请遵守相关法律法规，合理使用工具箱中的所有工具
- 请勿将生成的虚假信息用于任何非法用途或欺诈行为

## 📄 许可证

MIT License

---

**🛠️ 开发者工具箱 - 让开发更高效，让创作更便捷**
