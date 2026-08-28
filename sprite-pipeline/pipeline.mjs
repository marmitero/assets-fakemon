/**
 * pipeline.mjs — FASE B: transforma os PNGs SEM FUNDO (frames/) nos GIFs 96x96.
 *
 * Entrada : frames/{id}/{variant}/frame1..4.png  (PNG com alpha, já sem magenta)
 * Saída   : output/sprites/pokemon/versions/generation-v/black-white/
 *             animated/{id}.gif
 *             animated/back/{id}.gif
 *             animated/shiny/{id}.gif
 *
 *   node pipeline.mjs                       # processa tudo que estiver completo
 *   node pipeline.mjs --id 1                # só uma criatura
 *   node pipeline.mjs --id 1 --variant front
 *
 * Enquadramento (para sprites vindos em qualquer tamanho, ex. 1408x768):
 *  1. safety: pixels magenta residuais -> alpha 0;
 *  2. calcula a bounding box do conteúdo (alpha) e tira a UNIÃO das 4 frames
 *     (mesmo recorte nos 4 -> sem tremida entre frames);
 *  3. recorta, faz resize NEAREST para ~96 e ancora em bottom-center no 96x96;
 *  4. ImageMagick empilha os 4 PNG: -dispose Background, -delay por criatura, loop 0.
 */

import sharp from 'sharp';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { FAKEMON, ALL_VARIANTS, VARIANT_PATH, FRAMES_PER_VARIANT, padId } from './manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SIZE = 96;
const ALPHA_CUTOFF = 128;
const FRAMES_DIR = path.join(__dirname, 'frames');
const OUT_BASE = path.join(
  __dirname,
  'output/sprites/pokemon/versions/generation-v/black-white'
);
const VARIANT_FILL = { front: 0.9, back: 1.0, shiny: 0.9, backshiny: 1.0 };
const CONVERT_BIN = process.env.CONVERT_BIN || 'convert';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const key = t.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { a[key] = next; i++; } else a[key] = true;
    } else a._.push(t);
  }
  return a;
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function frameFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^frame\d+\.png$/i.test(f))
    .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0])
    .map((f) => path.join(dir, f));
}

/** Lê um PNG como RGBA cru, aplica safety magenta->transparente, devolve {data,w,h,ch}. */
async function readRGBA(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  const { width: w, height: h, channels: ch } = info;
  for (let i = 0; i < buf.length; i += ch) {
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    const magenta = r > 220 && g < 60 && b > 220; // segurança: magenta residual
    if (magenta || buf[i + 3] < ALPHA_CUTOFF) buf[i + 3] = 0;
  }
  return { data: buf, w, h, ch };
}

/** Bounding box dos pixels opacos. */
function bboxOf(img) {
  let minX = img.w, minY = img.h, maxX = -1, maxY = -1;
  for (let y = 0; y < img.h; y++) {
    for (let x = 0; x < img.w; x++) {
      if (img.data[(y * img.w + x) * img.ch + 3] >= ALPHA_CUTOFF) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < 0 ? null : { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function unionBox(a, b) {
  if (!a) return b;
  if (!b) return a;
  const left = Math.min(a.left, b.left);
  const top = Math.min(a.top, b.top);
  const right = Math.max(a.left + a.width, b.left + b.width);
  const bottom = Math.max(a.top + a.height, b.top + b.height);
  return { left, top, width: right - left, height: bottom - top };
}

/** Recorta -> resize nearest -> ancora bottom-center no canvas 96x96. Retorna PNG buffer. */
async function frameTo96(file, crop, rw, rh) {
  const yOff = SIZE - rh; // ancorado embaixo
  const xOff = Math.floor((SIZE - rw) / 2); // centralizado
  const resized = await sharp(file)
    .ensureAlpha()
    .extract(crop)
    .resize(rw, rh, { kernel: 'nearest', fit: 'fill' })
    .png()
    .toBuffer();

  return sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, left: xOff, top: yOff }])
    .png()
    .toBuffer();
}

async function buildVariant(id, variant, delayCs) {
  const srcDir = path.join(FRAMES_DIR, padId(id), variant);
  const out = path.join(OUT_BASE, VARIANT_PATH[variant], `${id}.gif`);
  const files = frameFiles(srcDir);
  if (files.length === 0) return { skipped: true };
  // Trava de qualidade: só gera o GIF quando o loop está COMPLETO (4 frames).
  // Se estiver incompleto, remove um GIF parcial antigo e aguarda os frames.
  if (files.length < FRAMES_PER_VARIANT) {
    fs.rmSync(out, { force: true });
    return { incomplete: true, have: files.length };
  }

  // 1) lê todas e acha a bbox de união (com margem)
  const imgs = await Promise.all(files.map(readRGBA));
  let u = null;
  for (const im of imgs) u = unionBox(u, bboxOf(im));
  if (!u) return { skipped: true };
  const pad = Math.max(2, Math.round(Math.max(u.width, u.height) * 0.02));
  const crop = {
    left: Math.max(0, u.left - pad),
    top: Math.max(0, u.top - pad),
    width: Math.min(imgs[0].w - Math.max(0, u.left - pad), u.width + pad * 2),
    height: Math.min(imgs[0].h - Math.max(0, u.top - pad), u.height + pad * 2),
  };

  // 2) calcula escala para encaixar no 96 (nearest)
  const fill = VARIANT_FILL[variant] ?? 0.92;
  const target = Math.floor(SIZE * fill);
  const scale = Math.min(target / crop.width, target / crop.height);
  const rw = Math.max(1, Math.round(crop.width * scale));
  const rh = Math.max(1, Math.round(crop.height * scale));

  // 3) gera cada frame 96x96 numa pasta temporária
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'fakemon-'));
  const tmpFiles = [];
  try {
    for (let i = 0; i < files.length; i++) {
      const png = await frameTo96(files[i], crop, rw, rh);
      const t = path.join(work, `f${i + 1}.png`);
      fs.writeFileSync(t, png);
      tmpFiles.push(t);
    }
    // 4) monta o GIF
    ensureDir(path.dirname(out));
    execFileSync(
      CONVERT_BIN,
      ['-dispose', 'Background', '-delay', String(delayCs), '-loop', '0', ...tmpFiles, out],
      { stdio: ['ignore', 'ignore', 'pipe'] }
    );
    return { skipped: false, out, count: files.length, crop, rw, rh };
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const onlyId = args.id != null ? Number(args.id) : null;
  const onlyVariant = args.variant || null;

  try {
    execFileSync(CONVERT_BIN, ['-version'], { stdio: 'ignore' });
  } catch {
    console.error(`✗ ImageMagick 'convert' não encontrado. Instale ou aponte CONVERT_BIN.`);
    process.exit(1);
  }

  let built = 0;
  for (const c of FAKEMON) {
    if (onlyId != null && c.id !== onlyId) continue;
    for (const variant of ALL_VARIANTS) {
      if (onlyVariant && variant !== onlyVariant) continue;
      const r = await buildVariant(c.id, variant, c.delay);
      if (r.skipped) {
        console.log(`  · ${padId(c.id)}/${variant.padEnd(5)} sem frames — pula`);
        continue;
      }
      if (r.incomplete) {
        console.log(`  · ${padId(c.id)}/${variant.padEnd(5)} só ${r.have}/${FRAMES_PER_VARIANT} frames — aguarda (sem GIF parcial)`);
        continue;
      }
      built++;
      console.log(
        `  ✓ ${padId(c.id)} ${c.name.padEnd(16)} ${variant.padEnd(5)} ` +
        `${r.count}f @ ${c.delay * 10}ms  sprite ${r.rw}x${r.rh} -> ${path.relative(__dirname, r.out)}`
      );
    }
  }
  console.log(`\nConcluído: ${built} GIF(s) em output/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
