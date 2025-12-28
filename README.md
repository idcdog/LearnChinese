这是一个基于 Next.js 的纯前端汉字学习小工具：汉字/拼音查询、笔顺动画、生词本、搜索历史。

项目定位为“轻量级纯静态站点”：
- 不采用任何后台服务（无 API、无数据库）
- 无登录注册
- 不接入第三方在线服务（语音/LLM/统计等）
- 数据仅保存在浏览器本地（localStorage）

## 功能概览
- 汉字/拼音搜索（示例数据集）
- 汉字详情：拼音、部首、笔画数、释义、组词、例句
- 笔顺动画：基于 `hanzi-writer`（按需加载）
- 生词本与搜索历史：本地持久化

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
- 站点不上传任何用户数据；生词本/搜索历史保存在浏览器 `localStorage`
- 清缓存/更换浏览器会导致本地数据丢失（后续可扩展导入导出）
