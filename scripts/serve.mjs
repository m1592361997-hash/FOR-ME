import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve('.');
const preferredPort = Number.parseInt(process.env.PORT ?? '4173', 10);
const maxPort = preferredPort + 20;

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.eot', 'application/vnd.ms-fontobject'],
  ['.glb', 'model/gltf-binary'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.ttf', 'font/ttf'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webm', 'video/webm'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const filePath = resolveRequest(url.pathname);

  if (!filePath) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    'content-type': contentTypes.get(ext) ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  fs.createReadStream(filePath).pipe(response);
});

listen(preferredPort);

function resolveRequest(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const directPath = path.join(root, normalized);

  if (isInsideRoot(directPath) && fileExists(directPath)) {
    return directPath;
  }

  const indexPath = path.join(directPath, 'index.html');
  if (isInsideRoot(indexPath) && fileExists(indexPath)) {
    return indexPath;
  }

  return null;
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isInsideRoot(filePath) {
  const relative = path.relative(root, filePath);
  return !relative.startsWith('..') && !path.isAbsolute(relative);
}

function listen(port) {
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && port < maxPort) {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, () => {
    console.log(`serve: http://localhost:${port}`);
  });
}
