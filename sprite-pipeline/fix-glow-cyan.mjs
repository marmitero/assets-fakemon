/**
 * fix-glow-cyan.mjs — corrige halo ROXO/VIOLETA teimoso em brilhos mágicos.
 *
 * Algumas criaturas (ex.: 120 Tidalgleam) têm a IA insistindo em colorir o glow
 * de energia de violeta/azul-arroxeado, mesmo quando a paleta da criatura NÃO tem
 * roxo legítimo. Este script roda DEPOIS do keyout (sobre frames/, que já estão
 * com o fundo transparente) e converte, apenas nos pixels de BORDA (raio do
 * transparente), o halo arroxeado em ciano — sem tocar no teal (g>r), no dourado
 * (b baixo), no branco puro nem nos interiores da criatura.
 *
 *   node keyout-magenta.mjs --id 120
 *   node fix-glow-cyan.mjs --id 120     # <-- entre keyout e pipeline
 *   node pipeline.mjs
 *
 * NUNCA rodar sobre frames-raw/ (o fundo magenta seria confundido e viraria ciano).
 * Só usar em criaturas cuja paleta NÃO contenha roxo/violeta legítimo.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FAKEMON, ALL_VARIANTS, padId } from './manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMES = path.join(__dirname, 'frames');

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { a[t.slice(2)] = next; i++; } else a[t.slice(2)] = true;
    }
  }
  return a;
}
const args = parseArgs(process.argv);
const onlyId = args.id != null ? Number(args.id) : null;
const RADIUS = 3;

function listFrames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /^frame\d+\.png$/i.test(f));
}

async function fixFile(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, ch = info.channels;
  const idx = (x, y) => (y * W + x) * ch;
  const clear = (x, y) => x < 0 || y < 0 || x >= W || y >= H || data[idx(x, y) + 3] < 128;

  let n = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (data[i + 3] < 128) continue;
      let edge = false;
      for (let dy = -RADIUS; dy <= RADIUS && !edge; dy++)
        for (let dx = -RADIUS; dx <= RADIUS; dx++)
          if (clear(x + dx, y + dy)) { edge = true; break; }
      if (!edge) continue;

      const r = data[i], g = data[i + 1], b = data[i + 2];
      // A) lavanda/pervinca clara na borda (azul > verde, vermelho substancial, não branco puro)
      if (b > 175 && b > g + 15 && r >= 130 && r <= 228 && r > g - 25) {
        data[i] = Math.round(Math.min(r, g) * 0.55); // derruba o vermelho -> ciano
        n++;
      }
      // B) azul-violeta vivo (verde baixo, azul muito alto, vermelho baixo) -> ciano
      else if (b > 225 && g < 155 && r < 125) {
        data[i] = Math.round(r * 0.45);
        data[i + 1] = Math.min(255, Math.round(b * 0.9));
        n++;
      }
    }
  }
  await sharp(data, { raw: { width: W, height: H, channels: ch } }).png().toFile(file);
  return n;
}

let done = 0;
for (const c of FAKEMON) {
  if (onlyId != null && c.id !== onlyId) continue;
  for (const variant of ALL_VARIANTS) {
    const dir = path.join(FRAMES, padId(c.id), variant);
    for (const f of listFrames(dir)) {
      const n = await fixFile(path.join(dir, f));
      done++;
      if (n) console.log(`  · fix ${padId(c.id)}/${variant}/${f}: ${n}px violeta->ciano`);
    }
  }
}
console.log(`\nConcluído: ${done} frames verificados (fix-glow-cyan).`);
