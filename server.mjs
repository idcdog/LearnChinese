import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "out");

function parsePort() {
  const args = process.argv.slice(2);
  const index = args.findIndex((arg) => arg === "--port" || arg === "-p");
  const argPort = index >= 0 ? Number(args[index + 1]) : undefined;
  const envPort = process.env.PORT ? Number(process.env.PORT) : undefined;
  const port = argPort || envPort || 10382;
  return Number.isFinite(port) ? port : 10382;
}

function parseHost() {
  const args = process.argv.slice(2);
  const index = args.findIndex((arg) => arg === "--host" || arg === "--hostname" || arg === "-H");
  const argHost = index >= 0 ? args[index + 1] : undefined;
  const envHost = process.env.HOST;
  const host = (argHost || envHost || "").trim();
  return host.length > 0 ? host : undefined;
}

const CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function getContentType(filePath) {
  return CONTENT_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

function isSafePath(resolvedPath) {
  const relative = path.relative(ROOT_DIR, resolvedPath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  if (res.req?.method === "HEAD") {
    res.end();
    return;
  }
  res.end(body);
}

async function send404(req, res) {
  const fallback404 = path.resolve(ROOT_DIR, "404.html");
  if (await fileExists(fallback404)) {
    const html = await fs.readFile(fallback404);
    send(res, 404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }, html);
    return;
  }
  send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "Not Found");
}

async function trySendFile(req, res, filePath) {
  const resolved = path.resolve(ROOT_DIR, "." + filePath);
  if (!isSafePath(resolved)) {
    send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Bad Request");
    return true;
  }

  if (!(await fileExists(resolved))) return false;

  const body = await fs.readFile(resolved);
  const contentType = getContentType(resolved);
  const isHtml = contentType.startsWith("text/html");
  const isImmutableAsset = filePath.startsWith("/_next/") || filePath.startsWith("/static/");

  send(
    res,
    200,
    {
      "Content-Type": contentType,
      "Cache-Control": isHtml ? "no-cache" : isImmutableAsset ? "public, max-age=31536000, immutable" : "public, max-age=3600",
    },
    body,
  );
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Bad Request");
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      send(res, 405, { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" }, "Method Not Allowed");
      return;
    }

    const url = new URL(req.url, "http://localhost");
    const rawPathname = url.pathname;
    let decodedPathname = rawPathname;
    try {
      decodedPathname = decodeURIComponent(rawPathname);
    } catch {
      decodedPathname = rawPathname;
    }

    if (rawPathname === "/") {
      const served = await trySendFile(req, res, "/index.html");
      if (!served) await send404(req, res);
      return;
    }

    const hasExt = path.extname(rawPathname) !== "";
    if (!hasExt && !rawPathname.endsWith("/")) {
      const decodedDirIndex = `${decodedPathname}/index.html`;
      const rawDirIndex = `${rawPathname}/index.html`;
      const resolvedDecodedIndex = path.resolve(ROOT_DIR, "." + decodedDirIndex);
      const resolvedRawIndex = path.resolve(ROOT_DIR, "." + rawDirIndex);
      const decodedExists =
        isSafePath(resolvedDecodedIndex) && (await fileExists(resolvedDecodedIndex));
      const rawExists = isSafePath(resolvedRawIndex) && (await fileExists(resolvedRawIndex));

      if (decodedExists || rawExists) {
        send(
          res,
          308,
          { Location: `${rawPathname}/${url.search}`, "Content-Type": "text/plain; charset=utf-8" },
          "Permanent Redirect",
        );
        return;
      }
    }

    const rawTarget = rawPathname.endsWith("/") ? `${rawPathname}index.html` : rawPathname;
    const decodedTarget = decodedPathname.endsWith("/") ? `${decodedPathname}index.html` : decodedPathname;

    const servedRaw = await trySendFile(req, res, rawTarget);
    if (servedRaw) return;

    if (decodedTarget !== rawTarget) {
      const servedDecoded = await trySendFile(req, res, decodedTarget);
      if (servedDecoded) return;
    }

    await send404(req, res);
  } catch (error) {
    send(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "Internal Server Error");
    console.error("静态服务异常：", error);
  }
});

const port = parsePort();
const host = parseHost();
const onListening = () => {
  const displayHost = !host || host === "0.0.0.0" || host === "::" ? "localhost" : host;
  console.log(`静态站点已启动： http://${displayHost}:${port}`);
  if (host) {
    console.log(`监听地址：${host}${host === "0.0.0.0" || host === "::" ? `（局域网可用 http://<本机IP>:${port} 访问）` : ""}`);
  } else {
    console.log(`监听地址：未指定（Node 默认监听全部网卡）`);
  }
  console.log(`根目录：${ROOT_DIR}`);
};

if (host) {
  server.listen(port, host, onListening);
} else {
  server.listen(port, onListening);
}
