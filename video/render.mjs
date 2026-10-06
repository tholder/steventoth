// Renders video/intro.html (with the soundtrack from music.mjs) to public/video/ as
// MP4 (H.264 + AAC) + WebM (VP9 + Opus) + a poster image.
//
//   npm i --no-save playwright ffmpeg-static
//   node video/render.mjs
//
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
import ffmpeg from 'ffmpeg-static';
import { renderMusic, toWav } from './music.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'public/video');
const FPS = 30;
const SCALE = 1.5; // 1280x720 CSS px -> 1920x1080
const POSTER_AT = 8; // seconds

const types = { '.html': 'text/html', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const path = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!path.startsWith(ROOT)) throw new Error('outside root');
    res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const port = server.address().port;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: SCALE });
await page.goto(`http://localhost:${port}/video/intro.html`);
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);
const stage = page.locator('#stage');

const wav = join(tmpdir(), `steven-intro-${process.pid}.wav`);
await writeFile(wav, toWav(renderMusic(duration)));

const encode = (args) => {
  const p = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', wav, '-map', '0:v', '-map', '1:a', '-shortest', ...args], {
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  const done = new Promise((ok, fail) => p.on('close', (c) => (c === 0 ? ok() : fail(new Error(`ffmpeg ${c}`)))));
  return { stdin: p.stdin, done };
};
const mp4 = encode([
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '128k',
  join(OUT, 'steven-toth-intro.mp4'),
]);
const webm = encode([
  '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-c:a', 'libopus', '-b:a', '96k',
  join(OUT, 'steven-toth-intro.webm'),
]);

const frames = Math.round(duration * FPS);
for (let i = 0; i < frames; i++) {
  const t = i / FPS;
  await page.evaluate((t) => window.renderAt(t), t);
  const buf = await stage.screenshot({ type: 'png' });
  for (const enc of [mp4, webm]) if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once('drain', r));
  if (Math.round(t * FPS) === POSTER_AT * FPS) {
    await stage.screenshot({ type: 'jpeg', quality: 82, path: join(OUT, 'steven-toth-intro-poster.jpg') });
  }
  if (i % FPS === 0) process.stdout.write(`\r${Math.round((i / frames) * 100)}%`);
}
mp4.stdin.end();
webm.stdin.end();
await Promise.all([mp4.done, webm.done]);
await browser.close();
server.close();
await rm(wav, { force: true });
console.log('\rDone →', OUT);
