// Gera a ilustração "peças organizadas antes da montagem" do artigo de montagem de móveis:
// node scripts/ilustracao-montagem.mjs
import sharp from 'sharp';

const W = 1200, H = 750;

// Pequenos parafusos vistos de cima, espalhados dentro de uma bandeja.
const parafusos = (cx, cy, n, cor) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + (cx % 7);
    const r = 14 + (i % 3) * 13;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    const rot = (i * 47) % 180;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})">
      <rect x="-3" y="-13" width="6" height="22" rx="2" fill="${cor}"/>
      <circle cx="0" cy="-13" r="6" fill="${cor}"/>
      <path d="M-3 -13h6M0 -16v6" stroke="#6b6b6b" stroke-width="1.4"/>
    </g>`;
  }).join('');

const bandeja = (cx, cy, rot, cor, n, etiqueta) => `
  <g>
    <circle cx="${cx}" cy="${cy + 6}" r="62" fill="#000" opacity=".12"/>
    <circle cx="${cx}" cy="${cy}" r="62" fill="#f4f1ec"/>
    <circle cx="${cx}" cy="${cy}" r="52" fill="#e9e4dc"/>
    ${parafusos(cx, cy, n, cor)}
    <rect x="${cx - 26}" y="${cy + 70}" width="52" height="24" rx="4" fill="#fff" transform="rotate(${rot} ${cx} ${cy + 82})"/>
    <text x="${cx}" y="${cy + 88}" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#6b5a45" transform="rotate(${rot} ${cx} ${cy + 82})">${etiqueta}</text>
  </g>`;

const painel = (x, y, w, h, rot, furos) => `
  <g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">
    <rect x="${x + 6}" y="${y + 8}" width="${w}" height="${h}" fill="#000" opacity=".13"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#mdf)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#f3ead9" stroke-width="4"/>
    ${furos.map(([fx, fy]) => `<circle cx="${x + fx}" cy="${y + fy}" r="5" fill="#8a6f4e"/>`).join('')}
  </g>`;

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="piso" width="160" height="750" patternUnits="userSpaceOnUse">
      <rect width="160" height="750" fill="#c9a77f"/>
      <rect width="158" height="750" fill="#d2b18b"/>
      <path d="M20 0v750M70 0v750M120 0v750" stroke="#c49f76" stroke-width="2" opacity=".5"/>
    </pattern>
    <linearGradient id="mdf" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbf8f2"/><stop offset="1" stop-color="#ece6da"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#piso)"/>

  <!-- papelão protegendo o piso -->
  <rect x="70" y="60" width="1060" height="630" rx="6" fill="#b88a55"/>
  <rect x="70" y="60" width="1060" height="630" rx="6" fill="none" stroke="#a37745" stroke-width="3" stroke-dasharray="14 10"/>

  ${painel(120, 110, 520, 120, -2, [[30, 30], [30, 90], [490, 30], [490, 90], [260, 60]])}
  ${painel(130, 270, 520, 120, 1.5, [[30, 30], [30, 90], [490, 30], [490, 90]])}
  ${painel(150, 440, 380, 90, -1, [[25, 45], [355, 45], [190, 45]])}
  ${painel(560, 450, 80, 190, 3, [[40, 30], [40, 160]])}

  <!-- manual de instruções -->
  <g transform="rotate(4 900 230)">
    <rect x="786" y="106" width="230" height="300" fill="#000" opacity=".12"/>
    <rect x="780" y="100" width="230" height="300" fill="#fff"/>
    <rect x="800" y="122" width="190" height="14" fill="#9a8f82"/>
    <rect x="800" y="156" width="80" height="80" fill="none" stroke="#bbb" stroke-width="3"/>
    <path d="M808 226l30-40 20 22 14-14 14 32z" fill="#d8d2c8"/>
    <rect x="895" y="160" width="95" height="8" fill="#ddd"/><rect x="895" y="178" width="80" height="8" fill="#ddd"/>
    <rect x="895" y="196" width="90" height="8" fill="#ddd"/><rect x="895" y="214" width="60" height="8" fill="#ddd"/>
    <circle cx="815" cy="275" r="14" fill="#9a8f82"/><text x="815" y="281" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">1</text>
    <rect x="840" y="266" width="150" height="8" fill="#ddd"/><rect x="840" y="282" width="110" height="8" fill="#ddd"/>
    <circle cx="815" cy="330" r="14" fill="#9a8f82"/><text x="815" y="336" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">2</text>
    <rect x="840" y="321" width="150" height="8" fill="#ddd"/><rect x="840" y="337" width="120" height="8" fill="#ddd"/>
  </g>

  ${bandeja(760, 510, -4, '#b9b9b9', 9, 'A')}
  ${bandeja(910, 540, 3, '#9fa4a8', 7, 'B')}
  ${bandeja(1050, 500, -2, '#c7b58f', 11, 'C')}

  <!-- chave allen -->
  <g transform="rotate(-30 1060 200)">
    <path d="M1000 190h110v22h-88v60h-22z" fill="#4a4a4a"/>
  </g>

  <!-- chave de fenda -->
  <g transform="translate(-30 20) rotate(4 1000 640)">
    <rect x="905" y="628" width="90" height="26" rx="12" fill="#c8612f"/>
    <rect x="918" y="628" width="8" height="26" fill="#a84e24"/><rect x="940" y="628" width="8" height="26" fill="#a84e24"/>
    <rect x="995" y="636" width="110" height="10" fill="#bfc3c7"/>
    <path d="M1105 636l16 5-16 5z" fill="#9ea3a8"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 86 }).toFile('public/images/blog/montagem_pecas_organizadas.jpg');
console.log('ok');
