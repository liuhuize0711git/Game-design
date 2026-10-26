import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const result = await build({
  root,
  configFile: false,
  publicDir: false,
  build: {
    write: false,
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: { entry: path.join(root, 'src/main.js'), name: 'SproutGuard', formats: ['iife'] },
  },
});
const output = (Array.isArray(result) ? result : [result]).flatMap(r => r.output);
const scripts = output.filter(item => item.type === 'chunk');
const styles = output.filter(item => item.type === 'asset' && item.fileName.endsWith('.css'));
if (scripts.length !== 1 || scripts[0].imports.length || scripts[0].dynamicImports.length || output.length !== scripts.length + styles.length) {
  throw new Error('Offline build must contain only one standalone script and embedded CSS.');
}
const favicon = await readFile(path.join(root, 'public/favicon.svg'), 'utf8');
const css = styles.map(s => s.source).join('\n').replace(/<\/style/gi, '<\\/style');
const js = scripts[0].code.replace(/<\/script/gi, '<\\/script');
let html = await readFile(path.join(root, 'index.html'), 'utf8');
html = html.replace('href="/favicon.svg"', () => `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`);
html = html.replace('</head>', () => `<style>${css}</style>\n</head>`);
html = html.replace('<script type="module" src="/src/main.js"></script>', () => `<script>${js}</script>`);
await writeFile(path.join(root, '开始游戏.html'), html);
console.log('Offline game ready: 萌芽守卫/开始游戏.html');
