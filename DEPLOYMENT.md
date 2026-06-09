# 🚀 GitHub Pages 部署指南

本项目已配置为自动部署到GitHub Pages，每次推送到主分支时会自动构建和部署。

## 📋 项目结构说明

```
ToolsBox/                       # 项目根目录（GitHub仓库根目录）
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions工作流
├── apps/
│   └── web/                    # Next.js Web应用目录
│       ├── src/                # 源代码
│       ├── package.json        # 应用依赖
│       ├── next.config.ts      # Next.js配置
│       └── dist/               # 构建输出（自动生成）
└── DEPLOYMENT.md               # 本文档
```

## 🛠️ 完整部署步骤

### 1. 启用GitHub Pages
1. 进入GitHub仓库设置页面
2. 找到 "Pages" 设置项
3. 在 "Source" 中选择 "GitHub Actions"
4. **重要：如果GitHub推荐了Next.js模板，请忽略或删除**

### 2. 清理冲突的workflow文件
1. 进入仓库的 `.github/workflows/` 目录
2. 删除除了 `deploy.yml` 之外的所有文件（如 `nextjs.yml`）
3. 确保只有我们的 `deploy.yml` 文件存在

### 3. 确认Actions权限
1. 仓库设置 → Actions → General
2. 确保 "Allow all actions and reusable workflows" 被选中
3. 在 "Workflow permissions" 中选择 "Read and write permissions"

### 4. 推送代码
```bash
git add .
git commit -m "feat: 配置GitHub Pages部署"
git push origin main
```

### 5. 查看部署状态
1. 进入仓库的 "Actions" 标签页
2. 查看 "Deploy to GitHub Pages" 工作流
3. 等待部署完成（通常需要2-5分钟）
4. 如果有错误，点击查看详细日志

### 6. 访问网站
部署完成后，访问：`https://[你的GitHub用户名].github.io/ToolsBox/`

## ⚙️ 配置说明

### GitHub Actions工作流 (.github/workflows/deploy.yml)
- **工作目录**: `./apps/web`（Next.js应用所在目录）
- **Node.js版本**: 20
- **缓存**: npm缓存，路径为 `./apps/web/package-lock.json`
- **构建命令**: `npm run export`（在apps/web目录中执行）
- **部署目录**: `./apps/web/dist`

### Next.js配置 (apps/web/next.config.ts)
```typescript
const nextConfig: NextConfig = {
  output: 'export',              // 启用静态导出
  trailingSlash: true,           // 添加尾部斜杠
  distDir: 'dist',               // 构建目录
  images: { unoptimized: true }, // 禁用图片优化
  basePath: '/ToolsBox',         // GitHub Pages路径（仓库名）
  assetPrefix: '/ToolsBox/',     // 资源前缀
};
```

## 🔧 本地测试生产构建

在推送前，可以本地测试生产构建：

```bash
# 进入Next.js应用目录
cd apps/web

# 构建静态文件
npm run export

# 使用静态服务器测试（可选）
npx serve dist
```

## 🔍 故障排除

### 常见问题

1. **Actions报错：权限问题**
   - 确保仓库设置中启用了Actions权限
   - 检查Workflow permissions设置

2. **Actions报错：workflow冲突**
   - 删除GitHub自动生成的workflow文件
   - 确保只有我们的deploy.yml存在

3. **Actions报错：找不到package.json**
   - 确认working-directory设置为./apps/web
   - 确认cache-dependency-path正确

4. **页面显示404**
   - 等待几分钟，DNS可能需要时间传播
   - 检查GitHub Pages设置是否正确
   - 确认basePath配置匹配仓库名

5. **样式或资源加载失败**
   - 检查assetPrefix配置
   - 确认.nojekyll文件存在

### 调试命令

```bash
# 检查构建（在apps/web目录中）
cd apps/web
npm run lint
npm run export

# 查看构建文件
ls -la apps/web/dist/

# 本地测试
cd apps/web
npx serve dist
```

## 🌐 自定义域名（可选）

如果你有自定义域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为你的域名，如：`toolbox.yourdomain.com`
3. 在域名DNS设置中添加CNAME记录指向 `[username].github.io`

## 📞 支持

如果遇到部署问题，可以：
1. 查看GitHub Actions运行日志
2. 检查本文档的故障排除部分
3. 确认项目结构是否正确

---

**🎉 享受你的自动化部署体验！**
