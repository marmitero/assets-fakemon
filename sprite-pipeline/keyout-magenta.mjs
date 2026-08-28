/**
 * keyout-magenta.mjs — chroma key do fundo MAGENTA.
 *
 * Converte os PNGs gerados com fundo magenta (frames-raw/) em PNGs com fundo
 * transparente (frames/).
 *
 *   node keyout-magenta.mjs                 # processa tudo que existe em frames-raw
 *   node keyout-magenta.mjs --id 1          # só uma criatura
 *   node keyout-magenta.mjs --tol 150       # ajusta a distância de key (0-255)
 *
 * Método: distância da cor até o magenta puro (255,0,255). Quanto mais magenta,
 * menor a distância. Pixels abaixo do limiar viram transparentes; a franja
 * (distância intermediária) recebe de-spill, puxando R e B para o canal verde
 * para matar o matiz magenta sem apagar violetas/rosas legítimos da paleta
 * (o rosa mais próximo da arte, #FF6688, tem distância ~221 — bem acima do limiar).
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FAKEMON, ALL_VARIANTS, padId } from './manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(__dirname, 'frames-raw');
const OUT = path.join(__dirname, 'frames');

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const key = t.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { a[key] = next; i++; } else a[key] = true;
    }
  }
  return a;
}

const args = parseArgs(process.argv);
const KEY_TOL = Number(args.tol ?? 150);   // abaixo disto -> transparente
const SPILL_TOL = Number(args.spill ?? 215); // entre KEY_TOL e isto -> de-spill

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function listFrames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /^frame\d+\.png$/i.test(f))
    .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
}

async function keyOut(src, dst) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: ch } = info;
  const out = Buffer.from(data);
  const idx = (x, y) => (y * W + x) * ch;

  // Pass 1 — key duro: alpha 0 para magenta.
  for (let p = 0; p < W * H; p++) {
    const i = p * ch;
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const dMag = Math.abs(r - 255) + g + Math.abs(b - 255);
    if (out[i + 3] < 128 || dMag < KEY_TOL) out[i + 3] = 0;
  }

  // Pass 2 — limpeza de borda (de-spill / erosão) só na franja perto do transparente.
  const isClear = (x, y) => x < 0 || y < 0 || x >= W || y >= H || out[idx(x, y) + 3] < 128;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (out[i + 3] < 128) continue;

      // tem pixel transparente num raio de 2? (é franja)
      let nearClear = false;
      for (let dy = -2; dy <= 2 && !nearClear; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (isClear(x + dx, y + dy)) { nearClear = true; break; }
        }
      }
      if (!nearClear) continue;

      const r = out[i], g = out[i + 1], b = out[i + 2];
      const dMag = Math.abs(r - 255) + g + Math.abs(b - 255);
      const magentaCast = r > 110 && b > 110 && Math.abs(r - b) < 70 && g < Math.min(r, b) - 20;

      if (dMag < SPILL_TOL) {
        out[i + 3] = 0; // franja fortemente magenta -> remove (erosão de 1px)
      } else if (magentaCast) {
        const t = Math.max(g, Math.min(r, b) - 60); // de-spill: puxa R e B para o verde
        out[i] = t;
        out[i + 2] = t;
      }
    }
  }

  await sharp(out, { raw: { width: W, height: H, channels: ch } }).png().toFile(dst);
}

async function main() {
  const onlyId = args.id != null ? Number(args.id) : null;
  let done = 0;

  for (const c of FAKEMON) {
    if (onlyId != null && c.id !== onlyId) continue;
    for (const variant of ALL_VARIANTS) {
      const inDir = path.join(RAW, padId(c.id), variant);
      const outDir = path.join(OUT, padId(c.id), variant);
      const files = listFrames(inDir);
      if (!files.length) continue;
      ensureDir(outDir);
      for (const f of files) {
        await keyOut(path.join(inDir, f), path.join(outDir, f));
        done++;
      }
      console.log(`  ✓ keyout ${padId(c.id)}/${variant} (${files.length})`);
    }
  }
  console.log(`\nConcluído: ${done} frames keyados -> frames/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
