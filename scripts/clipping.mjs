// Gera as ilustrações da página Clipping: node scripts/clipping.mjs
// Sites viram um "print" de navegador, revistas viram capas e jornais viram páginas de jornal,
// sempre usando as fotos CC0 que já estão no projeto.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { sites, revistas } from '../src/data/clipping.mjs';

const OUT = 'public/images/clipping';
fs.mkdirSync(OUT, { recursive: true });

const fotos = ['residenciais', 'comerciais', 'design'].flatMap((p) =>
  fs.readdirSync(`public/images/${p}`).map((f) => `public/images/${p}/${f}`),
);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const quebrar = (texto, max) => {
  const linhas = [];
  let atual = '';
  for (const p of texto.split(' ')) {
    if ((atual + ' ' + p).trim().length > max) {
      linhas.push(atual);
      atual = p;
    } else {
      atual = (atual + ' ' + p).trim();
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
};

const marcas = {
  'CASA.COM.BR': { nome: 'Casa.com.br', dominio: 'casa.com.br', cor: '#b33a3a' },
  'VEJA RIO ONLINE': { nome: 'Veja Rio', dominio: 'vejario.abril.com.br', cor: '#c62828' },
  'DOCOL': { nome: 'Docol', dominio: 'docol.com.br', cor: '#0a6aa8' },
  'SEBRAE': { nome: 'Sebrae', dominio: 'sebrae.com.br', cor: '#1d5fa8' },
  'RIO PESQUISA': { nome: 'Rio Pesquisa', dominio: 'riopesquisa.com.br', cor: '#2e7d32' },
  'LOMBARDI DEL MONDO': { nome: 'Lombardi del Mondo', dominio: 'lombardidelmondo.com.br', cor: '#6d4c41' },
  'TERRA': { nome: 'Terra', dominio: 'terra.com.br', cor: '#e5641d' },
  'CASA E GOURMET': { nome: 'Casa e Gourmet', dominio: 'casaegourmet.com.br', cor: '#7b3f8c' },
  'M DE MULHER': { nome: 'M de Mulher', dominio: 'mdemulher.abril.com.br', cor: '#d63a6e' },
  'RADAR DECORAÇÃO': { nome: 'Radar Decoração', dominio: 'radardecoracao.com.br', cor: '#00897b' },
  'MORAR MAIS POR MENOS': { nome: 'Morar Mais por Menos', dominio: 'morarmaispormenos.com.br', cor: '#d9901a' },
  'SHOPPING CASA E GOURMET': { nome: 'Shopping Casa e Gourmet', dominio: 'shoppingcasaegourmet.com.br', cor: '#5e3a8c' },
  'MORAR KALLAS': { nome: 'Morar Kallas', dominio: 'morarkallas.com.br', cor: '#455a64' },
  'UOL': { nome: 'UOL', dominio: 'uol.com.br', cor: '#e8a100' },
  'ARQUITETO E CIA': { nome: 'Arquiteto e Cia', dominio: 'arquitetoecia.com.br', cor: '#5d4037' },
  'CASA LINDA': { nome: 'Casa Linda', dominio: 'casalinda.com.br', cor: '#b0306a' },
};

const marcaDoSite = (titulo) => {
  const chave = titulo.replace(/^(SITE (DA |DO )?|PORTAL |REVISTA )/, '');
  return marcas[chave];
};

const manchetes = [
  'Apartamento no Rio ganha living integrado e cheio de luz',
  'Cozinha planejada aproveita cada centímetro do espaço',
  'Peças de design transformam a sala de estar',
  'Quarto de casal com clima de hotel',
  'Banheiro renovado aposta em materiais naturais',
  'Projeto combina cores neutras e madeira',
  'Arquiteta dá dicas para ampliar ambientes pequenos',
  'Iluminação bem pensada valoriza a decoração',
  'Reforma integra cozinha e área social',
  'Móveis sob medida organizam o apartamento',
];

const barras = (x, y, larguras, cor = '#d6d6d6', alt = 8, passo = 16) =>
  larguras.map((w, i) => `<rect x="${x}" y="${y + i * passo}" width="${w}" height="${alt}" rx="2" fill="${cor}"/>`).join('');

async function site(titulo, i) {
  const m = marcaDoSite(titulo);
  const manchete = manchetes[i % manchetes.length];
  const linhas = quebrar(manchete, 18);
  const W = 800, H = 600;
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="#ffffff"/>
    <rect width="${W}" height="44" fill="#e4e4e4"/>
    <circle cx="22" cy="22" r="6" fill="#ff5f57"/><circle cx="42" cy="22" r="6" fill="#febc2e"/><circle cx="62" cy="22" r="6" fill="#28c840"/>
    <rect x="90" y="10" width="640" height="24" rx="12" fill="#fff"/>
    <rect x="108" y="18" width="260" height="8" rx="4" fill="#dcdcdc"/>
    <rect y="44" width="${W}" height="62" fill="${m.cor}"/>
    <rect y="106" width="${W}" height="30" fill="#f3f3f3"/>
    ${['DECORAÇÃO', 'ARQUITETURA', 'CASA', 'IDEIAS', 'RIO'].map((t, k) => `<text x="${30 + k * 130}" y="126" font-family="Arial, sans-serif" font-size="13" fill="#777">${t}</text>`).join('')}
    <text x="30" y="172" font-family="Arial, sans-serif" font-size="12" fill="${m.cor}" font-weight="bold">DECORAÇÃO</text>
    ${linhas.map((l, k) => `<text x="520" y="${200 + k * 28}" font-family="Georgia, serif" font-size="21" font-weight="bold" fill="#222">${esc(l)}</text>`).join('')}
    ${barras(520, 200 + linhas.length * 28 + 4, [250, 240, 250, 210, 245, 230, 180])}
    <text x="30" y="515" font-family="Arial, sans-serif" font-size="12" fill="#999">Foto: divulgação</text>
    ${barras(30, 535, [740, 720, 520])}
  </svg>`;
  const foto = await sharp(fs.readFileSync(fotos[i % fotos.length])).resize(470, 310, { fit: 'cover' }).toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: foto, left: 30, top: 184 }])
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, `site-${String(i + 1).padStart(2, '0')}.jpg`));
}

async function revista(titulo, i) {
  const W = 600, H = 800;
  const chamada = quebrar(manchetes[(i + 3) % manchetes.length], 20);
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
      <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></linearGradient>
    </defs>
    <rect width="${W}" height="260" fill="url(#t)"/>
    <rect y="480" width="${W}" height="320" fill="url(#b)"/>
    <text x="${W / 2}" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#fff" letter-spacing="4">DECORAÇÃO · ARQUITETURA · DESIGN</text>
    ${chamada.map((l, k) => `<text x="36" y="${640 + k * 38}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#fff">${esc(l)}</text>`).join('')}
    <text x="${W - 30}" y="${H - 24}" text-anchor="end" font-family="Arial, sans-serif" font-size="13" fill="#ddd">Nº ${120 + i}</text>
  </svg>`;
  const foto = await sharp(fs.readFileSync(fotos[(i * 7 + 3) % fotos.length])).resize(W, H, { fit: 'cover' }).toBuffer();
  await sharp(foto)
    .composite([{ input: Buffer.from(svg), left: 0, top: 0 }])
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, `revista-${String(i + 1).padStart(2, '0')}.jpg`));
}

async function jornal(titulo, i) {
  const W = 600, H = 800;
  const manchete = quebrar(manchetes[(i + 5) % manchetes.length], 26);
  const colunas = [0, 1, 2].map((c) => barras(30 + c * 184, 600, Array(10).fill(168), '#cfcac0', 6, 14)).join('');
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="#f6f3ea"/>
    <rect x="30" y="98" width="${W - 60}" height="2" fill="#111"/>
    <text x="30" y="118" font-family="Georgia, serif" font-size="12" fill="#444">Rio de Janeiro · Caderno Morar Bem</text>
    <rect x="30" y="128" width="${W - 60}" height="1" fill="#111"/>
    ${manchete.map((l, k) => `<text x="30" y="${172 + k * 36}" font-family="Georgia, serif" font-size="31" font-weight="bold" fill="#111">${esc(l)}</text>`).join('')}
    ${colunas}
  </svg>`;
  const topo = 172 + manchete.length * 36 + 18;
  const foto = await sharp(fs.readFileSync(fotos[(i * 5 + 1) % fotos.length])).resize(W - 60, 580 - topo, { fit: 'cover' }).grayscale().toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: foto, left: 30, top: topo }])
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, `revista-${String(i + 1).padStart(2, '0')}.jpg`));
}

for (const [i, t] of sites.entries()) await site(t, i);
for (const [i, t] of revistas.entries()) {
  if (/^(JORNAL|CORREIO)/.test(t)) await jornal(t, i);
  else await revista(t, i);
}
console.log('ok', sites.length, revistas.length);
