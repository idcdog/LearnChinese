这是一个基于 Next.js 的纯前端汉字学习工具：汉字/拼音查询、笔顺动画、生词本、智能复习系统。

项目定位为"轻量级纯静态 PWA 应用"：
- ✅ PWA 支持，可离线使用
- ✅ 不采用任何后台服务（无 API、无数据库）
- ✅ 无登录注册
- ✅ 不接入第三方在线服务（语音使用浏览器内置 TTS）
- ✅ 数据仅保存在浏览器本地（localStorage）
- ✅ 支持数据导入/导出

## 功能概览

### 核心功能
- **汉字/拼音搜索**：支持汉字或拼音搜索（示例数据集）
- **汉字详情**：拼音、部首、笔画数、释义、组词、例句
- **笔顺动画**：基于 `hanzi-writer`（按需加载）
- **生词本**：收藏常用汉字，本地持久化
- **搜索历史**：自动记录最近搜索

### 新功能 ✨
- **📱 PWA 离线支持**：可安装到主屏幕，支持离线访问
- **💾 数据导入/导出**：备份和迁移生词本与搜索历史
- **🔄 智能复习系统**：基于艾宾浩斯遗忘曲线的复习提醒
- **🔈 语音朗读**：使用浏览器内置 Web Speech API
- **✓ 自动保存提示**：实时显示数据保存状态
- **📱 移动端优化**：大号输入框和按钮，更好的触摸体验

详见 [新功能说明文档](./docs/新功能说明.md)。

## 技术栈
- Next.js（App Router）+ React + TypeScript
- Tailwind CSS
- 静态导出：`next.config.ts` 使用 `output: "export"`，产物为 `out/`

## 本地开发
安装依赖后启动开发服务器：

```bash
npm install
npm run dev
```

打开 `http://localhost:10382` 即可预览。
开发模式默认端口为 `10382`（可在 `package.json` 的 `dev` 脚本里调整）。

如需在局域网/容器中从其他机器访问，使用：

```bash
npm run dev:lan
```

然后用 `http://<本机IP>:10382` 访问（注意防火墙/安全组放行端口）。

## 构建与静态部署
生成静态产物（输出目录为 `out/`）：

```bash
npm run build
```

本地预览静态产物：

```bash
npm run preview
```

部署时将 `out/` 目录上传到任意静态托管（如 Nginx、GitHub Pages、对象存储 + CDN）。

### 用 Node 直接部署（推荐给容器平台）
本项目内置了一个不依赖任何框架的静态文件服务：`server.mjs`，用于把 `out/` 目录对外提供访问。

```bash
npm run build
PORT=10382 npm run start
```

说明：
- `npm run start` 等价于 `node server.mjs`（默认端口 `10382`）
- 可通过 `PORT` 或 `--port` 覆盖端口，例如：`node server.mjs --port 8080`
- 如需显式监听 `0.0.0.0`：`node server.mjs --host 0.0.0.0`（或设置环境变量 `HOST=0.0.0.0`）

## 路由说明
为保证纯静态部署稳定性，详情页使用 query 参数：
- 首页：`/`
- 详情页：`/character?char=中`

## 目录结构
- `src/`：应用源码
- `public/`：静态资源
- `server.mjs`：静态服务入口（读取 `out/`）
- `out/`：构建后的静态产物（运行 `npm run build` 生成）

## 常见问题
### 1) 容器平台提示找不到 `package.json`
通常是平台工作目录不在项目根目录，或只上传了部分文件。现在工程已提升到仓库根目录，平台在 `/home/container` 直接执行 `npm install` / `npm run build` / `npm run start` 即可。

### 2) 端口不可访问/健康检查失败
多数平台要求监听其下发的 `PORT` 环境变量。请确保以 `PORT=<平台端口> npm run start` 启动。

## 数据与隐私
- ✅ 站点不上传任何用户数据
- ✅ 生词本/搜索历史/复习记录保存在浏览器 `localStorage`
- ✅ 支持数据导出备份（JSON 格式）
- ✅ 完全离线可用（PWA）
- ⚠️ 清缓存/更换浏览器会导致本地数据丢失，建议定期导出备份

## PWA 部署注意事项
1. **HTTPS 要求**：PWA 和 Service Worker 需要 HTTPS（localhost 除外）
2. **Service Worker 文件**：确保 `sw.js` 返回正确的 MIME 类型 `application/javascript`
3. **图标文件**：当前使用简单的 SVG 图标，可替换为更精美的设计

## 浏览器兼容性
- **PWA**: Chrome 45+, Edge 17+, Safari 11.1+
- **Service Worker**: Chrome 40+, Edge 17+, Safari 11.1+
- **Web Speech API**: Chrome 33+, Edge 14+, Safari 14.1+
- **LocalStorage**: 所有现代浏览器
