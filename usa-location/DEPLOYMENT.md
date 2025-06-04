# 🚀 GitHub Pages 部署指南

本项目已配置为自动部署到GitHub Pages，每次推送到主分支时会自动构建和部署。

## 📋 部署配置

### 自动化部署
- **触发条件**: 推送到 `main` 或 `master` 分支
- **构建工具**: GitHub Actions
- **部署目标**: GitHub Pages
- **访问地址**: `https://[username].github.io/USAlocation/`

### 技术配置
- **静态导出**: Next.js 静态导出模式
- **构建目录**: `dist/`
- **基础路径**: `/USAlocation`
- **图片优化**: 已禁用（GitHub Pages兼容）

## 🛠️ 部署步骤

### 1. 启用GitHub Pages
1. 进入GitHub仓库设置页面
2. 找到 "Pages" 设置项
3. 在 "Source" 中选择 "GitHub Actions"
4. 保存设置

### 2. 推送代码
```bash
git add .
git commit -m "feat: 配置GitHub Pages部署"
git push origin main
```

### 3. 查看部署状态
1. 进入仓库的 "Actions" 标签页
2. 查看最新的工作流运行状态
3. 等待部署完成（通常需要2-5分钟）

### 4. 访问网站
部署完成后，访问：`https://[你的GitHub用户名].github.io/USAlocation/`

## 🔧 本地测试生产构建

在推送前，可以本地测试生产构建：

```bash
# 构建静态文件
npm run export

# 使用静态服务器测试（可选）
npx serve dist
```

## 📁 项目结构

```
usa-location/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions工作流
├── dist/                       # 构建输出目录（自动生成）
├── src/                        # 源代码
├── next.config.ts              # Next.js配置（已配置静态导出）
├── package.json                # 项目配置（已添加部署脚本）
└── DEPLOYMENT.md               # 本文档
```

## ⚙️ 配置说明

### Next.js配置 (next.config.ts)
```typescript
const nextConfig: NextConfig = {
  output: 'export',              // 启用静态导出
  trailingSlash: true,           // 添加尾部斜杠
  distDir: 'dist',               // 构建目录
  images: { unoptimized: true }, // 禁用图片优化
  basePath: '/USAlocation',      // GitHub Pages路径
  assetPrefix: '/USAlocation/',  // 资源前缀
};
```

### GitHub Actions工作流
- **Node.js版本**: 18
- **缓存**: npm缓存
- **构建命令**: `npm run export`
- **部署目录**: `./dist`

## 🌐 自定义域名（可选）

如果你有自定义域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为你的域名，如：`toolbox.yourdomain.com`
3. 在域名DNS设置中添加CNAME记录指向 `[username].github.io`

## 🔍 故障排除

### 常见问题

1. **部署失败**
   - 检查GitHub Actions日志
   - 确保所有依赖都在package.json中
   - 检查代码是否有语法错误

2. **页面显示404**
   - 确认GitHub Pages设置正确
   - 检查basePath配置是否匹配仓库名
   - 等待DNS传播（可能需要几分钟）

3. **样式或资源加载失败**
   - 检查assetPrefix配置
   - 确认所有资源路径使用相对路径
   - 检查.nojekyll文件是否存在

### 调试命令

```bash
# 检查构建
npm run lint
npm run export

# 查看构建文件
ls -la dist/

# 本地测试
npx serve dist
```

## 📞 支持

如果遇到部署问题，可以：
1. 查看GitHub Actions运行日志
2. 检查本文档的故障排除部分
3. 提交Issue到项目仓库

---

**🎉 享受你的自动化部署体验！**
