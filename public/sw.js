// PWA Service Worker：离线可用 + 更可靠的更新策略
// 关键点：页面（HTML / 导航请求）使用“网络优先”，避免长期命中旧缓存导致必须开隐身模式才能更新。
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `hanzi-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `hanzi-runtime-${CACHE_VERSION}`;

// 首次安装时缓存的核心文件（只做“离线兜底”）
const STATIC_FILES = [
  '/',
  '/index.html',
  '/character/',
  '/offline.html'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch((err) => {
        console.error('Service Worker: Cache failed', err);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        const allowList = new Set([STATIC_CACHE, RUNTIME_CACHE]);
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!allowList.has(cacheName)) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(async () => {
        if ('navigationPreload' in self.registration) {
          try {
            await self.registration.navigationPreload.enable();
          } catch {
            // 忽略不支持或启用失败
          }
        }
        await self.clients.claim();
      })
  );
});

function normalizeDocumentRequest(request) {
  const url = new URL(request.url);
  return new Request(url.origin + url.pathname, { headers: request.headers, method: 'GET' });
}

async function networkFirstForNavigate(event) {
  const request = event.request;
  const normalized = normalizeDocumentRequest(request);

  try {
    const preloaded = await event.preloadResponse;
    const response = preloaded || await fetch(request, { cache: 'no-store' });

    if (response && response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(normalized, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(normalized);
    if (cached) return cached;
    return caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  return cached || fetchPromise;
}

// Fetch event - 按资源类型选择策略
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and external requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(request.url);

  // 页面/路由导航：网络优先，解决“更新不生效/必须隐身”问题
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstForNavigate(event));
    return;
  }

  // 关键配置文件：尽量走网络，避免缓存导致配置/离线页不更新
  if (url.pathname === '/manifest.json' || url.pathname === '/offline.html') {
    event.respondWith(fetch(request, { cache: 'no-store' }).catch(() => caches.match(request)));
    return;
  }

  // Next.js 构建产物：文件名自带 hash，适合缓存；用“stale-while-revalidate”提升命中率与更新可靠性
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/static/')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 其他同源 GET：缓存优先兜底（比如图标），失败再走网络
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => cached))
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
