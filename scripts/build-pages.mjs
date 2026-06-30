import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(repoRoot, '.pages-dist');
const basePath = normalizeBasePath(process.env.PAGES_BASE_PATH || '/FOR-ME');
const siteUrl = (process.env.PAGES_SITE_URL || 'https://m1592361997-hash.github.io/FOR-ME').replace(/\/$/, '');

const publicEntries = [
  '_next',
  'fav',
  'font',
  'portfolio',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'cutout.svg',
  'duct_tape.glb',
  'index.html',
  'Lax-Chee_Resume_2025.pdf',
  'laxspace-logo.svg',
  'pin.svg',
  'planeTex.png',
  'portfolio-showcase.css',
  'portfolio-showcase.js',
  'project01.png',
  'project02.png',
  'project03.png',
  'project04.png',
  'project05.png',
  'project06.png',
  'project07.png',
  'project08.png',
  'project09.png',
  'project10.png',
  'project11.png',
  'project12.png',
  'project13.png',
  'resume.png',
  'robots.txt',
  'Sandbox.webm',
  'sitemap.xml',
  'smile.svg',
  'texture.png',
  'websiteDay.svg',
  'websiteMonth.svg',
];

const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.svg',
  '.txt',
  '.webmanifest',
  '.xml',
]);

const assetDirectories = ['_next', 'fav', 'font', 'portfolio'];
const assetFiles = [
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'cutout.svg',
  'duct_tape.glb',
  'Lax-Chee_Resume_2025.pdf',
  'laxspace-logo.svg',
  'pin.svg',
  'planeTex.png',
  'portfolio-showcase.css',
  'portfolio-showcase.js',
  'resume.png',
  'robots.txt',
  'Sandbox.webm',
  'sitemap.xml',
  'smile.svg',
  'texture.png',
  'websiteDay.svg',
  'websiteMonth.svg',
  ...Array.from({ length: 13 }, (_, index) => `project${String(index + 1).padStart(2, '0')}.png`),
];

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

for (const entry of publicEntries) {
  await copyEntry(path.join(repoRoot, entry), path.join(outDir, entry));
}

await fs.writeFile(path.join(outDir, '.nojekyll'), '');
await transformTextFiles(outDir);
await writePagesMetadata();

console.log(`pages build: ${outDir}`);
console.log(`base path: ${basePath}`);

async function copyEntry(source, destination) {
  const stat = await fs.stat(source);
  if (stat.isDirectory()) {
    await fs.mkdir(destination, { recursive: true });
    for (const child of await fs.readdir(source)) {
      await copyEntry(path.join(source, child), path.join(destination, child));
    }
    return;
  }

  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(source, destination);
}

async function transformTextFiles(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await transformTextFiles(target);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    const original = await fs.readFile(target, 'utf8');
    const transformed = transformText(original);
    if (transformed !== original) {
      await fs.writeFile(target, transformed);
    }
  }
}

function transformText(input) {
  let text = input;

  text = text
    .replace(/https:\/\/laxspace\.co\/fav\/android-chrome-512x512\.png/g, `${siteUrl}/fav/android-chrome-512x512.png`)
    .replace(/https:\/\/laxspace\.co\/?/g, `${siteUrl}/`)
    .replace(/"assetPrefix":""/g, `"assetPrefix":"${basePath}"`)
    .replace(/\\"assetPrefix\\":\\"\\"/g, `\\"assetPrefix\\":\\"${escapeForFlight(basePath)}\\"`)
    .replace(/"initialCanonicalUrl":"\/"/g, `"initialCanonicalUrl":"${basePath}/"`)
    .replace(/\\"initialCanonicalUrl\\":\\"\/\\"/g, `\\"initialCanonicalUrl\\":\\"${escapeForFlight(basePath)}/\\"`)
    .replace(/href="\/"/g, `href="${basePath}/"`)
    .replace(/"href":"\/"/g, `"href":"${basePath}/"`)
    .replace(/\\"href\\":\\"\/\\"/g, `\\"href\\":\\"${escapeForFlight(basePath)}/\\"`)
    .replace(/push\("\/",/g, `push("${basePath}/",`)
    .replace(/push\("\/\?view=works"/g, `push("${basePath}/?view=works"`);

  text = prefixRootAssetDirectories(text);
  text = prefixRootAssetFiles(text);
  text = disableThirdPartyAnalytics(text);
  return text;
}

function prefixRootAssetDirectories(input) {
  let text = input;
  for (const directory of assetDirectories) {
    const pattern = new RegExp(`(^|["'(:=\\[]|\\\\")/(${escapeRegExp(directory)})(?=/)`, 'g');
    text = text.replace(pattern, `$1${basePath}/$2`);
  }
  return text;
}

function prefixRootAssetFiles(input) {
  const pattern = new RegExp(
    `(^|["'(:=\\[]|\\\\")/(${assetFiles.map(escapeRegExp).join('|')})(?=[)"'?#,;\\\\]|$)`,
    'g',
  );
  return input.replace(pattern, `$1${basePath}/$2`);
}

function disableThirdPartyAnalytics(input) {
  let text = input;

  text = text.replace(
    /<script async="" src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-M13S2KFHB3"><\/script>/g,
    '',
  );
  text = text.replace(
    /<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-M13S2KFHB3'\);\s*<\/script>/g,
    '',
  );
  text = text.replace(
    /;\(function\(\)\{if\(typeof document==="undefined"\|\|!\/\(\?:\^\|;\\s\)__vercel_toolbar=1\(\?:;\|\$\)\/\.test\(document\.cookie\)\)return;var s=document\.createElement\('script'\);s\.src='https:\/\/vercel\.live\/_next-live\/feedback\/feedback\.js';s\.setAttribute\("data-explicit-opt-in","true"\);s\.setAttribute\("data-cookie-opt-in","true"\);s\.setAttribute\("data-deployment-id","[^"]+"\);\(\(document\.head\|\|document\.documentElement\)\.appendChild\(s\)\)\}\)\(\);?/g,
    '',
  );
  text = text.replace(
    /function h\(e\)\{return r\.createElement\(r\.Suspense,\{fallback:null\},r\.createElement\(p,\{\.\.\.e\}\)\)\}/g,
    'function h(){return null}',
  );
  text = text
    .replace(/https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-M13S2KFHB3/g, 'about:blank')
    .replace(/G-M13S2KFHB3/g, 'G-DISABLED')
    .replace(/\/_vercel\/insights\/script\.js/g, `${basePath}/disabled-analytics.js`)
    .replace(/https:\/\/va\.vercel-scripts\.com\/v1\/script\.debug\.js/g, 'about:blank');

  return text;
}

async function writePagesMetadata() {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  await fs.writeFile(path.join(outDir, 'robots.txt'), robots);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n  </url>\n</urlset>\n`;
  await fs.writeFile(path.join(outDir, 'sitemap.xml'), sitemap);
}

function normalizeBasePath(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '/') {
    return '';
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeForFlight(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
