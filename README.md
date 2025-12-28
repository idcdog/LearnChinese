这是一个基于 Next.js 的纯前端汉字学习小工具：汉字/拼音查询、笔顺动画、生词本、搜索历史。

项目定位为“纯静态部署”：不提供任何后端服务、无登录注册，数据仅保存在浏览器本地（localStorage）。

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

如果希望用 Node 直接托管静态文件（不依赖其他服务），可在服务器上：

```bash
npm run build
PORT=10382 npm run start
```
