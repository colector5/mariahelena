// Uso: node scripts/sheet.mjs <pasta> <saida.jpg>
// Converte as imagens da pasta para JPEG (in-place) e monta uma folha de contato numerada.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [dir, out] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => /^\d+\.jpg$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b));
const cols = 6, w = 300, h = 200;
const rows = Math.ceil(files.length / cols);
const composites = [];

for (const [i, f] of files.entries()) {
  const p = path.join(dir, f);
  const buf = await sharp(fs.readFileSync(p)).jpeg({ quality: 85 }).toBuffer();
  fs.writeFileSync(p, buf);
  const n = parseInt(f);
  const thumb = await sharp(buf).resize(w - 4, h - 4, { fit: 'cover' }).toBuffer();
  const label = Buffer.from(`<svg width="44" height="30"><rect width="44" height="30"/><text x="4" y="24" font-size="22" font-family="Arial" font-weight="bold" fill="yellow">${n}</text></svg>`);
  const x = (i % cols) * w, y = Math.floor(i / cols) * h;
  composites.push({ input: thumb, left: x, top: y }, { input: label, left: x, top: y });
}

await sharp({ create: { width: cols * w, height: rows * h, channels: 3, background: '#fff' } })
  .composite(composites)
  .jpeg()
  .toFile(out);
console.log('ok', files.length);
