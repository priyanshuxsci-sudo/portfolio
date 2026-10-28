(() => {
'use strict';
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const K = reduce ? 0 : 1;
const small = innerWidth < 900;

/* ---------- Loader ---------- */
setTimeout(() => {
  $('#loader').classList.add('done');
  document.body.classList.remove('loading');
}, 2500);

/* ---------- Cursor Glow ---------- */
const glow = $('#cursor-glow');
if (!small && !reduce) {
  addEventListener('pointermove', e => {
    glow.style.setProperty('--x', e.clientX + 'px');
    glow.style.setProperty('--y', e.clientY + 'px');
  }, { passive: true });
}

/* ================= CONTENT (edit me) ================= */
const GITHUB_PENCIL = 'https://github.com/priyanshuxsci-sudo/pencil-ai';

const SKILLS = [
  { n: 'Python', tag: 'Primary language', c: 0x5aa9e6,
    d: 'My main language. I use it for backend logic, data pipelines, automation and wiring up AI models.',
    use: 'Where: PENCIL.ai is built with it.' },
  { n: 'C', tag: 'Systems foundation', c: 0xa8b9cc,
    d: 'The foundation of systems programming. It taught me memory management and how code meets hardware.',
    use: 'Why: it is the reason my fundamentals are strong.' },
  { n: 'HTML/CSS/JS', tag: 'The web', c: 0xff7b4f,
    d: 'The trinity of the web. This entire fly-through universe is built with them, plus Three.js.',
    use: 'Where: this portfolio.' },
  { n: 'SQLite', tag: 'Database', c: 0x4cc9f0,
    d: 'A lightweight, serverless database engine, perfect for local storage and rapid prototyping.',
    use: 'Where: small projects that need to remember things.' },
  { n: 'REST APIs', tag: 'Integration', c: 0xffd166,
    d: 'The bridge between systems. I use them to connect applications to external AI services.',
    use: 'Where: every tool PENCIL.ai talks to.' },
  { n: 'LLM APIs', tag: 'AI', c: 0x9d4edd,
    d: 'Calling models like Gemini and Groq: deciding what to send, which tool to use, and how to use the reply.',
    use: 'Where: the reasoning and speed layers of PENCIL.ai.' },
  { n: 'AI Agents', tag: 'AI', c: 0xf472b6,
    d: 'Plan → research → answer loops, where the model picks tools and checks evidence instead of guessing.',
    use: 'Where: the core idea behind PENCIL.ai.' },
  { n: 'Git & GitHub', tag: 'Workflow', c: 0x6ee7b7,
    d: 'Version control and learning in public. My projects live on GitHub as I build them.',
    use: 'Where: every project.' },
  { n: 'Data Science', tag: 'Currently studying', c: 0xc4b5fd,
    d: 'My degree path: turning data into insight with Python-first tooling. Growing every week.',
    use: 'Status: first year, just getting started.' }
];

const PROJECT = { n: 'PENCIL.ai', tag: 'The Sun · First project', link: GITHUB_PENCIL,
  d: 'A modular AI assistant with memory, tool use and evidence-based research. It doesn\'t just guess; it verifies.',
  use: 'Everything orbiting it is a part of its design.' };

const MODULES = [
  { n: 'Gemini', tag: 'PENCIL.ai · Reasoning',
    d: 'The central reasoning engine. It plans the query, decides which tools to call, and synthesizes the final answer.' },
  { n: 'Tavily', tag: 'PENCIL.ai · Live research',
    d: 'Advanced web search. Fetches real-time, evidence-based sources so the AI never hallucinates facts.' },
  { n: 'Groq', tag: 'PENCIL.ai · Speed',
    d: 'Ultra-low latency inference. Ensures the final generated response feels instantaneous to the user.' },
  { n: 'Wikipedia', tag: 'PENCIL.ai · Knowledge',
    d: 'Dedicated knowledge retrieval node for well-documented, historical, or scientific topics.' },
  { n: 'Memory', tag: 'PENCIL.ai · Context',
    d: 'Persistent vector storage. Remembers past interactions and maintains context across long research sessions.' }
];

/* ================= THREE.JS ================= */
if (!window.THREE) return;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const renderer = new THREE.WebGLRenderer({ canvas: $('#universe'), antialias: !small, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x020205, 100, 260);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 4000);

scene.add(new THREE.AmbientLight(0x8890b8, 0.32));

/* Per-stage fade (so a stage is invisible until the camera actually arrives) */
const FADE = [{ value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }];
const vis = [1, 0, 0, 0];
const fadeSprites = []; // {m, base, st}

/* ---------- noise (JS) ---------- */
function h3(x, y, z) {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
function vn3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  let fx = x - xi, fy = y - yi, fz = z - zi;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  const a = (p, q) => p + (q - p);
  const l = (p, q, t) => p + (q - p) * t;
  return l(
    l(l(h3(xi, yi, zi), h3(xi + 1, yi, zi), fx), l(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), fx), fy),
    l(l(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), fx), l(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), fx), fy),
    fz);
}
function fbm3(x, y, z, o = 4) {
  let a = 0.5, s = 0, f = 1;
  for (let i = 0; i < o; i++) { s += a * vn3(x * f, y * f, z * f); f *= 2.03; a *= 0.5; }
  return s / (1 - Math.pow(0.5, o));
}
const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function ramp(st, t) {
  t = clamp(t, 0, 1);
  for (let i = 1; i < st.length; i++) {
    if (t <= st[i][0]) {
      const a = st[i - 1], b = st[i], k = (t - a[0]) / ((b[0] - a[0]) || 1);
      return [a[1][0] + (b[1][0] - a[1][0]) * k, a[1][1] + (b[1][1] - a[1][1]) * k, a[1][2] + (b[1][2] - a[1][2]) * k];
    }
  }
  return st[st.length - 1][1];
}
const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/* seamless procedural texture painted on a sphere */
function genTex(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); const im = g.createImageData(w, h); const d = im.data;
  for (let y = 0; y < h; y++) {
    const lat = (0.5 - (y + 0.5) / h) * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
    for (let x = 0; x < w; x++) {
      const lon = (x + 0.5) / w * Math.PI * 2;
      const o = fn(cl * Math.cos(lon), sl, cl * Math.sin(lon), lat);
      const i = (y * w + x) * 4;
      d[i] = o[0]; d[i + 1] = o[1]; d[i + 2] = o[2]; d[i + 3] = o.length > 3 ? o[3] : 255;
    }
  }
  g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

/* ---------- other helpers ---------- */
function glowTex(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, inner); gr.addColorStop(0.35, outer); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
function starTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.08, 'rgba(255,245,220,0.9)');
  gr.addColorStop(0.3, 'rgba(255,220,160,0.18)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  [[0, 128, 256, 128], [128, 0, 128, 256]].forEach(([x1, y1, x2, y2]) => {
    const l = g.createLinearGradient(x1, y1, x2, y2);
    l.addColorStop(0, 'rgba(255,240,200,0)'); l.addColorStop(0.5, 'rgba(255,250,235,0.95)'); l.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = l;
    if (x1 === 0) g.fillRect(0, 126, 256, 4); else g.fillRect(126, 0, 4, 256);
  });
  return new THREE.CanvasTexture(c);
}
function glowSprite(inner, outer, size, opacity, stage) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex(inner, outer), blending: THREE.AdditiveBlending,
    transparent: true, depthWrite: false, fog: false, opacity
  }));
  s.scale.set(size, size, 1);
  fadeSprites.push({ m: s.material, base: opacity, st: stage });
  return s;
}
const labelDraws = [];
function makeLabel(text, color, w, stage) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  const css = '#' + new THREE.Color(color).getHexString();
  const draw = () => {
    g.clearRect(0, 0, 512, 128);
    let px = 62;
    g.font = `700 ${px}px Syne, Inter, sans-serif`;
    while (g.measureText(text).width > 470 && px > 24) { px -= 4; g.font = `700 ${px}px Syne, Inter, sans-serif`; }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = css; g.shadowBlur = 22; g.fillStyle = '#fff';
    g.fillText(text, 256, 66); g.fillText(text, 256, 66);
    tex.needsUpdate = true;
  };
  draw(); labelDraws.push(draw);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, fog: false }));
  sp.renderOrder = 10; sp.userData.w = w; sp.userData.st = stage; sp.scale.set(w, w / 4, 1);
  fadeSprites.push({ m: sp.material, base: 1, st: stage });
  return sp;
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => labelDraws.forEach(f => f()));
const _wp = V(0, 0, 0);
function sizeLabel(label, w, hover, div, lo, hi) {
  label.getWorldPosition(_wp);
  const f = clamp(camera.position.distanceTo(_wp) / div, lo, hi) * (1 + 0.15 * hover);
  label.scale.set(w * f, w * f / 4, 1);
}

/* smooth, lumpy rock with analytic-ish normals */
function makeRock(detail, seed) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position, n = p.count;
  const el = [1 + Math.random() * 0.45, 0.7 + Math.random() * 0.3, 0.85 + Math.random() * 0.3];
  const H = (x, y, z) => {
    const b = fbm3(x * 1.5 + seed, y * 1.5 + seed * 0.7, z * 1.5 + seed * 1.3, 3);
    const c = vn3(x * 4 + seed, y * 4, z * 4) * 0.1;
    return 0.58 + 0.8 * b + c;
  };
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  const d = V(0, 0, 0), t1 = V(0, 0, 0), t2 = V(0, 0, 0), P = V(0, 0, 0), P1 = V(0, 0, 0), P2 = V(0, 0, 0), N = V(0, 0, 0);
  const at = (v, out) => { v.normalize(); const h = H(v.x, v.y, v.z); out.set(v.x * h * el[0], v.y * h * el[1], v.z * h * el[2]); };
  for (let i = 0; i < n; i++) {
    d.set(p.getX(i), p.getY(i), p.getZ(i)).normalize();
    at(d.clone(), P);
    t1.crossVectors(d, Math.abs(d.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0)).normalize();
    t2.crossVectors(d, t1);
    at(d.clone().addScaledVector(t1, 0.03), P1);
    at(d.clone().addScaledVector(t2, 0.03), P2);
    N.crossVectors(P1.sub(P), P2.sub(P)).normalize();
    if (N.dot(d) < 0) N.negate();
    pos.set([P.x, P.y, P.z], i * 3); nor.set([N.x, N.y, N.z], i * 3);
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return g;
}

/* ---------- Anchors in space ---------- */
const BELT = V(0, 0, -400);
const SYS = V(0, 0, -900);
const HOLE = V(0, 0, -1500);
const anchors = [V(0, 0, 0), BELT, SYS, HOLE];
const FOG_FAR = [150, 260, 520, 360];

/* ---------- Starfield (long tunnel) ---------- */
{
  const dot = glowTex('rgba(255,255,255,1)', 'rgba(255,255,255,0.4)');
  const n = small ? 2500 : 5500;
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const palette = [new THREE.Color('#f0f4ff'), new THREE.Color('#bcd0ff'), new THREE.Color('#ffe2b0')];
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 1400;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 900;
    pos[i * 3 + 2] = 120 - Math.random() * 1900;
    const c = palette[(Math.random() * 3) | 0];
    col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    size: 2.2 * Math.min(devicePixelRatio, 2), map: dot, sizeAttenuation: false, vertexColors: true,
    transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, fog: false
  })));
}

/* ================= 1. HERO GALAXY (unchanged look) ================= */
const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);
const particleCount = small ? 8000 : 25000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const colorInside = new THREE.Color('#ffd166');
const colorOutside = new THREE.Color('#9d4edd');
for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  const radius = Math.random() * 40;
  const spinAngle = radius * 0.8;
  const branchAngle = (i % 3) * ((Math.PI * 2) / 3);
  const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5 * radius;
  const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5 * radius;
  const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5 * radius;
  positions[i3] = Math.cos(branchAngle + spinAngle) * radius + rx;
  positions[i3 + 1] = ry * 0.5;
  positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz;
  const mixed = colorInside.clone().lerp(colorOutside, radius / 40);
  colors[i3] = mixed.r; colors[i3 + 1] = mixed.g; colors[i3 + 2] = mixed.b;
}
const galaxyGeometry = new THREE.BufferGeometry();
galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const galaxy = new THREE.Points(galaxyGeometry, new THREE.PointsMaterial({
  size: 0.12, vertexColors: true, blending: THREE.AdditiveBlending,
  depthWrite: false, transparent: true, opacity: 0.9
}));
galaxyGroup.add(galaxy);

/* ================= 2. ASTEROID BELT (fly inside it) ================= */
const RMIN = 80, RMAX = 190, RC = 130;
const beltGroup = new THREE.Group();
beltGroup.position.copy(BELT);
beltGroup.rotation.z = 0.2;
scene.add(beltGroup);

const rockTex = genTex(256, 128, (x, y, z) => {
  const n = fbm3(x * 3, y * 3, z * 3, 5), m = fbm3(x * 11 + 5, y * 11, z * 11, 3);
  const v = clamp(0.3 + 0.55 * n + 0.3 * (m - 0.5), 0.1, 1);
  return [v * 168, v * 152, v * 136];
});
const rockMat = () => new THREE.MeshStandardMaterial({
  map: rockTex, bumpMap: rockTex, bumpScale: 2, color: 0xb4aca4, roughness: 1, metalness: 0
});

const dummy = new THREE.Object3D();
const tint = new THREE.Color();
const rnd = Math.random;
const layers = []; // {pivot, w}

function addRockLayer(geo, count, w, gen) {
  const mesh = new THREE.InstancedMesh(geo, rockMat(), count);
  mesh.frustumCulled = false;
  for (let i = 0; i < count; i++) {
    const o = gen();
    dummy.position.set(Math.cos(o.a) * o.r, o.y, Math.sin(o.a) * o.r);
    dummy.rotation.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28);
    dummy.scale.set(o.s * (0.75 + rnd() * 0.5), o.s * (0.7 + rnd() * 0.4), o.s * (0.75 + rnd() * 0.5));
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    tint.setHSL(0.07 + rnd() * 0.05, 0.08 + rnd() * 0.12, 0.26 + rnd() * 0.26);
    mesh.setColorAt(i, tint);
  }
  mesh.instanceColor.needsUpdate = true;
  const pivot = new THREE.Group();
  pivot.add(mesh);
  beltGroup.add(pivot);
  layers.push({ pivot, w });
}
const NB = small ? 1800 : 6000;
[0, 1, 2].forEach(k => addRockLayer(makeRock(2, 1 + k * 4), Math.floor(NB / 3), [-0.0105, -0.014, -0.0175][k], () => ({
  a: rnd() * Math.PI * 2, r: RMIN + (RMAX - RMIN) * rnd(),
  y: (rnd() + rnd() + rnd() - 1.5) * 5, s: 0.35 + Math.pow(rnd(), 4) * 2.4
})));
const NH = small ? 140 : 320;
[0, 1].forEach(k => addRockLayer(makeRock(3, 20 + k * 7), NH / 2, [-0.013, -0.016][k], () => ({
  a: rnd() * Math.PI * 2, r: RMIN + 10 + (RMAX - RMIN - 20) * rnd(),
  y: (rnd() + rnd() - 1) * 5, s: 3 + Math.pow(rnd(), 2) * 6
})));

// dust ribbon
{
  const n = small ? 5000 : 12000;
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const c1 = new THREE.Color('#6f86c8'), c2 = new THREE.Color('#a58a74');
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, r = RMIN - 20 + (RMAX - RMIN + 40) * rnd();
    pos.set([Math.cos(a) * r, (rnd() + rnd() + rnd() - 1.5) * 4, Math.sin(a) * r], i * 3);
    const c = c1.clone().lerp(c2, rnd());
    col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({
    size: 1.6, map: glowTex('rgba(255,255,255,1)', 'rgba(255,255,255,0.3)'), vertexColors: true,
    transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  const pivot = new THREE.Group(); pivot.add(pts); beltGroup.add(pivot);
  layers.push({ pivot, w: -0.009 });
}

// skill rocks (clickable) — hover above the stream, around eye level
const SK_ARC = [34, 50, 42, 68, 60, 86, 78, 106, 96];
const SK_F = [-0.7, 0.6, 0.9, -0.8, 0.1, 0.7, -0.5, -0.9, 0.4];
const SK_Y = [18, 20, 17, 21, 19, 17, 20, 18, 21];
const skillHits = [];
const skillGeos = [0, 1, 2].map(i => makeRock(3, 50 + i * 3));
const skillEnts = SKILLS.map((d, i) => {
  const base = 3.4 + (i % 3) * 0.6;
  const col = new THREE.Color(d.c).lerp(new THREE.Color(0xffffff), 0.12);
  const mat = new THREE.MeshStandardMaterial({
    map: rockTex, bumpMap: rockTex, bumpScale: 3, color: col, emissive: d.c, emissiveIntensity: 0.1, roughness: 1
  });
  const mesh = new THREE.Mesh(skillGeos[i % 3], mat);
  const hit = new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 10), new THREE.MeshBasicMaterial({ visible: false }));
  mesh.add(hit);
  const label = makeLabel(d.n, d.c, 9, 1);
  const arc = SK_ARC[i], phi = -arc / RC, rad = RC + SK_F[i] * arc * 0.65;
  const bx = Math.cos(phi) * rad, bz = Math.sin(phi) * rad;
  mesh.position.set(bx, SK_Y[i], bz);
  beltGroup.add(mesh, label);
  const ent = { d, mesh, label, base, hover: 0, lw: 9, bx, by: SK_Y[i], bz, ph: i * 1.7, rotV: 0.15 + (i % 4) * 0.06 };
  hit.userData.ent = ent;
  skillHits.push(hit);
  return ent;
});

// the distant star + its light (placed after camera keys exist)
const beltStar = new THREE.Sprite(new THREE.SpriteMaterial({
  map: starTex(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false
}));
beltStar.scale.set(46, 46, 1);
fadeSprites.push({ m: beltStar.material, base: 1, st: 1 });
scene.add(beltStar);
const beltSun = new THREE.DirectionalLight(0xfff0d8, 1.5);
scene.add(beltSun, beltSun.target);

/* ================= 3. PENCIL.ai SOLAR SYSTEM ================= */
const sysGroup = new THREE.Group();
sysGroup.position.copy(SYS);
sysGroup.rotation.x = 0.06;
scene.add(sysGroup);

const NOISE_GLSL = `
float h31(vec3 p){ p=fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float n31(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm31(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n31(p); p*=2.03; a*=0.5; } return s; }
`;
const sunUniforms = { uTime: { value: 0 }, uFade: FADE[2] };
const SUN_R = 30;
const sun = new THREE.Mesh(new THREE.SphereGeometry(SUN_R, 96, 64), new THREE.ShaderMaterial({
  uniforms: sunUniforms, fog: false,
  vertexShader: 'varying vec3 vP; varying vec3 vN; void main(){ vP=position; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: NOISE_GLSL + `
    uniform float uTime, uFade; varying vec3 vP; varying vec3 vN;
    void main(){
      vec3 p = normalize(vP) * 2.6;
      float w = fbm31(p*1.2 + vec3(0.0, uTime*0.06, 0.0));
      float v = fbm31(p*2.2 + w*1.6 + vec3(uTime*0.05, 0.0, uTime*0.03));
      float spots = smoothstep(0.62, 0.78, fbm31(p*1.1 - 4.0 + uTime*0.01));
      vec3 deep = vec3(0.85,0.25,0.03), mid = vec3(1.0,0.58,0.12), hot = vec3(1.0,0.92,0.6);
      vec3 c = mix(deep, mid, smoothstep(0.25,0.6,v));
      c = mix(c, hot, smoothstep(0.55,0.9,v));
      c *= 1.0 - spots*0.45;
      float limb = pow(clamp(abs(vN.z),0.0,1.0), 0.55);
      c *= mix(0.45, 1.15, limb);
      gl_FragColor = vec4(c * uFade, 1.0);
    }`
}));
function atmosphere(radius, color, stage, power = 1.8, gain = 1.6) {
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uFade: FADE[stage], uPow: { value: power }, uGain: { value: gain } },
    vertexShader: 'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 uColor; uniform float uFade, uPow, uGain; varying vec3 vN; void main(){ float i=pow(clamp(-vN.z,0.0,1.0), uPow); gl_FragColor=vec4(uColor*i*uGain*uFade, 1.0); }',
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false
  }));
}
const corona = atmosphere(SUN_R * 1.35, 0xff8a2a, 2, 1.4, 1.5);
const sunGlowA = glowSprite('rgba(255,235,170,1)', 'rgba(255,140,50,0.35)', SUN_R * 5, 0.9, 2);
const sunGlowB = glowSprite('rgba(255,170,80,0.45)', 'rgba(157,78,221,0.12)', SUN_R * 12, 0.6, 2);
const sunLight = new THREE.PointLight(0xffe6c0, 2.8, 800, 1);
const sunHit = new THREE.Mesh(new THREE.SphereGeometry(SUN_R * 1.15, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
const sunLabel = makeLabel('PENCIL.ai', 0xffd166, 34, 2);
sunLabel.position.set(0, SUN_R + 16, 0);
sysGroup.add(sun, corona, sunGlowA, sunGlowB, sunLight, sunHit, sunLabel);
const sunEnt = { d: PROJECT, hover: 0 };
sunHit.userData.ent = sunEnt;

/* planet textures */
const TEX = {
  gas: () => genTex(512, 256, (x, y, z, lat) => {
    const warp = fbm3(x * 2, y * 2.5, z * 2, 4);
    const t = 0.5 + 0.5 * Math.sin(lat * 11 + warp * 6);
    const det = fbm3(x * 5, y * 22, z * 5, 3);
    const c = ramp([[0, [78, 44, 130]], [0.4, [150, 100, 205]], [0.7, [220, 190, 240]], [1, [110, 68, 175]]], t * 0.8 + det * 0.3);
    const k = 0.75 + det * 0.5; return [c[0] * k, c[1] * k, c[2] * k];
  }),
  ice: () => genTex(512, 256, (x, y, z, lat) => {
    const w = fbm3(x * 2, y * 3, z * 2, 3);
    const t = 0.5 + 0.5 * Math.sin(lat * 7 + w * 2.5);
    const det = fbm3(x * 4, y * 18, z * 4, 3);
    const c = ramp([[0, [34, 108, 160]], [0.5, [90, 178, 215]], [1, [190, 238, 248]]], t * 0.75 + det * 0.3);
    return c;
  }),
  lava: () => genTex(512, 256, (x, y, z) => {
    const n = fbm3(x * 3, y * 3, z * 3, 5);
    const ridge = 1 - Math.abs(2 * fbm3(x * 4 + 9, y * 4, z * 4, 4) - 1);
    const rock = ramp([[0, [26, 10, 8]], [0.5, [80, 34, 20]], [1, [140, 70, 40]]], n);
    const lava = ss(0.8, 0.94, ridge);
    return mixc(rock, [255, 140, 40], lava);
  }),
  earth: () => genTex(512, 256, (x, y, z, lat) => {
    const e = fbm3(x * 2.2 + 3, y * 2.2, z * 2.2, 5);
    let c;
    if (e < 0.5) c = ramp([[0, [6, 22, 62]], [1, [22, 96, 168]]], e / 0.5);
    else {
      const t = (e - 0.5) / 0.5;
      c = ramp([[0, [46, 118, 56]], [0.45, [120, 134, 72]], [0.8, [138, 108, 82]], [1, [240, 240, 240]]], t);
      if (e < 0.525) c = mixc([70, 170, 170], c, (e - 0.5) / 0.025);
    }
    return mixc(c, [244, 248, 255], ss(1.1, 1.3, Math.abs(lat)));
  }),
  clouds: () => genTex(512, 256, (x, y, z) => {
    const n = fbm3(x * 3.5 + 11, y * 3.5, z * 3.5, 5);
    return [255, 255, 255, ss(0.5, 0.72, n) * 235];
  }),
  marble: () => genTex(512, 256, (x, y, z) => {
    const w = fbm3(x * 2, y * 2, z * 2, 4);
    const n = fbm3(x * 3 + w * 2, y * 3 + w * 2, z * 3, 5);
    return ramp([[0, [8, 60, 66]], [0.45, [30, 150, 130]], [0.75, [110, 220, 190]], [1, [225, 252, 235]]], n);
  })
};
function ringTex() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 4;
  const g = c.getContext('2d'); const im = g.createImageData(512, 4);
  for (let x = 0; x < 512; x++) {
    const t = x / 511;
    let a = 0.5 + 0.25 * Math.sin(t * 90) + 0.15 * Math.sin(t * 31 + 1.3) + 0.2 * (vn3(t * 60, 1, 1) - 0.5);
    a *= ss(0, 0.06, t) * ss(1, 0.88, t);
    a *= 1 - 0.95 * ss(0.5, 0.52, t) * ss(0.6, 0.58, t);
    const col = mixc([150, 170, 180], [235, 225, 205], t);
    for (let y = 0; y < 4; y++) { const i = (y * 512 + x) * 4; im.data[i] = col[0]; im.data[i + 1] = col[1]; im.data[i + 2] = col[2]; im.data[i + 3] = clamp(a, 0, 1) * 235; }
  }
  g.putImageData(im, 0, 0);
  return new THREE.CanvasTexture(c);
}

const PLANETS = [
  { type: 'gas',    r: 13,  orbit: 64,  atm: 0xb58cff, tilt: 0.25, spin: 0.5,  a0: 2.3 },
  { type: 'ice',    r: 11,  orbit: 100,  atm: 0x7fe3ff, tilt: 0.1,  spin: 0.4,  a0: 3.9, ring: true },
  { type: 'lava',   r: 7.5, orbit: 138,  atm: 0xff7a3d, tilt: 0.05, spin: 0.25, a0: 5.4 },
  { type: 'earth',  r: 8.5, orbit: 178, atm: 0x6fb4ff, tilt: 0.41, spin: 0.55, a0: 0.9, clouds: true, moon: true },
  { type: 'marble', r: 9.5, orbit: 220, atm: 0x6ee7b7, tilt: 0.3,  spin: 0.35, a0: 4.6, moon: true }
];

const sysHits = [sunHit];
const planetEnts = PLANETS.map((P, i) => {
  const d = MODULES[i];
  // orbit trace
  const pts = [];
  for (let k = 0; k < 200; k++) { const t = k / 200 * Math.PI * 2; pts.push(V(Math.cos(t) * P.orbit, 0, Math.sin(t) * P.orbit)); }
  sysGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0x8892b0, transparent: true, opacity: 0.16 })));

  const pivot = new THREE.Group();
  const tex = TEX[P.type]();
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 });
  if (P.type === 'lava') { mat.emissiveMap = tex; mat.emissive = new THREE.Color(0xff7030); mat.emissiveIntensity = 0.35; mat.bumpMap = tex; mat.bumpScale = 2; }
  if (P.type === 'earth') mat.roughness = 0.7;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(P.r, 64, 48), mat);
  mesh.rotation.z = P.tilt;
  pivot.add(mesh);
  if (P.clouds) {
    const cl = new THREE.Mesh(new THREE.SphereGeometry(P.r * 1.014, 64, 48), new THREE.MeshStandardMaterial({
      map: TEX.clouds(), transparent: true, depthWrite: false, roughness: 1
    }));
    cl.rotation.z = P.tilt; pivot.add(cl); mesh.userData.clouds = cl;
  }
  pivot.add(atmosphere(P.r * 1.2, P.atm, 2));
  if (P.ring) {
    const rg = new THREE.RingGeometry(P.r * 1.45, P.r * 2.5, 128, 1);
    const uv = rg.attributes.uv, pp = rg.attributes.position;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, (Math.hypot(pp.getX(k), pp.getY(k)) - P.r * 1.45) / (P.r * 1.05), 0.5);
    const ring = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({
      map: ringTex(), color: 0xd8dde8, side: THREE.DoubleSide, transparent: true, depthWrite: false
    }));
    ring.rotation.x = Math.PI / 2 + 0.38; ring.rotation.y = 0.2;
    pivot.add(ring);
  }
  let moon = null;
  if (P.moon) {
    moon = new THREE.Mesh(makeRock(2, 90 + i), new THREE.MeshStandardMaterial({ map: rockTex, bumpMap: rockTex, bumpScale: 2, roughness: 1 }));
    moon.scale.setScalar(P.r * 0.26);
    pivot.add(moon);
  }
  const hit = new THREE.Mesh(new THREE.SphereGeometry(P.r * 1.7, 10, 10), new THREE.MeshBasicMaterial({ visible: false }));
  pivot.add(hit);
  const label = makeLabel(d.n, new THREE.Color(P.atm).getHex(), 12, 2);
  sysGroup.add(pivot, label);
  const ent = { d, P, pivot, mesh, moon, label, hover: 0, lw: 12, a: P.a0, w: 0.045 * Math.pow(64 / P.orbit, 1.5), ma: i };
  hit.userData.ent = ent;
  sysHits.push(hit);
  return ent;
});

/* ================= 4. BLACK HOLE ================= */
const holeGroup = new THREE.Group();
holeGroup.position.copy(HOLE);
holeGroup.rotation.set(0.0, 0, 0.1);
scene.add(holeGroup);

const holeCore = new THREE.Mesh(new THREE.SphereGeometry(9, 64, 48), new THREE.MeshBasicMaterial({ color: 0x000000, fog: false }));
holeGroup.add(holeCore);

const diskUniforms = { uTime: { value: 0 }, uFade: FADE[3] };
const disk = new THREE.Mesh(new THREE.RingGeometry(13, 440, 192, 28), new THREE.ShaderMaterial({
  uniforms: diskUniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
  vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: NOISE_GLSL + `
    uniform float uTime, uFade; varying vec3 vP;
    void main(){
      float r = length(vP.xy);
      float a = atan(vP.y, vP.x);
      float lr = log(r*0.08 + 1.0);
      float spin = a*2.0 + lr*5.0 - uTime*0.35/(0.4+lr);
      vec3 q = vec3(cos(spin), sin(spin), 0.0) * (lr*2.4);
      float st = fbm31(vec3(q.xy*2.0, lr*3.0));
      float fine = fbm31(vec3(cos(a)*3.0 - uTime*0.02, sin(a)*3.0, lr*30.0));
      float v = clamp(0.5*st + 0.65*fine, 0.0, 1.0);
      float heat = exp(-(r-13.0)/70.0);
      vec3 dark = vec3(0.17,0.035,0.02), mid = vec3(0.78,0.27,0.07), hot = vec3(1.0,0.78,0.42), white = vec3(1.0,0.95,0.85);
      vec3 col = mix(dark, mid, smoothstep(0.22,0.75,v)*(0.4+0.6*heat));
      col = mix(col, hot, smoothstep(0.3,1.0,heat)*smoothstep(0.25,0.8,v)*0.9);
      col += white*pow(heat,4.0)*1.5;
      col *= 0.55 + 0.9*v;
      col *= 0.82 + 0.3*cos(a - 0.5);
      float alpha = smoothstep(13.0,17.0,r) * (1.0 - 0.8*smoothstep(240.0,440.0,r)) * 0.97;
      gl_FragColor = vec4(col, alpha*uFade);
    }`
}));
disk.rotation.x = -Math.PI / 2;
disk.renderOrder = 1;
holeGroup.add(disk);

// blue relativistic jet
const JET_H = 190;
const jetGeo = new THREE.CylinderGeometry(30, 1.6, JET_H, 64, 40, true);
jetGeo.translate(0, JET_H / 2, 0);
const jetUniforms = { uTime: { value: 0 }, uFade: FADE[3] };
const jet = new THREE.Mesh(jetGeo, new THREE.ShaderMaterial({
  uniforms: jetUniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending, fog: false,
  vertexShader: `varying float vH; varying float vA; varying vec3 vN; varying vec3 vV;
    void main(){ vH=position.y/${JET_H.toFixed(1)}; vA=atan(position.z, position.x); vN=normalize(normalMatrix*normal);
      vec4 mv=modelViewMatrix*vec4(position,1.0); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `uniform float uTime, uFade; varying float vH; varying float vA; varying vec3 vN; varying vec3 vV;
    void main(){
      float s1 = pow(0.5+0.5*sin(vA*7.0 + vH*16.0 - uTime*1.1), 3.0);
      float s2 = pow(0.5+0.5*sin(vA*11.0 - vH*23.0 + uTime*0.8), 4.0);
      float facing = pow(abs(dot(normalize(vN), normalize(vV))), 0.7);
      float core = pow(1.0 - vH, 2.2);
      float a = (0.18 + 0.55*s1 + 0.4*s2) * core * facing * (1.0 - smoothstep(0.55,1.0,vH));
      vec3 c = mix(vec3(1.0,1.0,1.0), vec3(0.35,0.65,1.0), clamp(vH*1.6,0.0,1.0));
      gl_FragColor = vec4(c, a*uFade);
    }`
}));
jet.renderOrder = 2;
holeGroup.add(jet);

const holeGlowA = glowSprite('rgba(255,250,235,1)', 'rgba(255,200,120,0.35)', 80, 0.95, 3);
const holeGlowB = glowSprite('rgba(255,150,70,0.45)', 'rgba(150,50,30,0.15)', 240, 0.6, 3);
holeGlowA.renderOrder = 3; holeGlowB.renderOrder = 3;
holeGroup.add(holeGlowB, holeGlowA);
const jetGlow = glowSprite('rgba(200,230,255,0.95)', 'rgba(90,150,255,0.25)', 46, 0.9, 3);
jetGlow.position.set(0, 20, 0); jetGlow.renderOrder = 3;
holeGroup.add(jetGlow);

/* ================= CAMERA PATH ================= */
let keys = [];
function buildKeys() {
  const aspect = innerWidth / innerHeight;
  const k = clamp(1.1 / aspect, 1, 1.8);
  beltGroup.updateMatrixWorld(true);
  const bp = beltGroup.localToWorld(V(RC, 30, 0));
  const bl = beltGroup.localToWorld(V(RC - 10, 8, -95));
  keys = [
    { p: V(0, 0, 25), l: V(0, 0, 0) },
    { p: bp, l: bl },
    { p: V(0, 100 * k, SYS.z + 215 * k), l: V(0, 20, SYS.z) },
    { p: V(0, 58 * k, HOLE.z + 160 * k), l: V(0, -16, HOLE.z) }
  ];
  // belt star, left of the view, far ahead
  const fwd = bl.clone().sub(bp).normalize();
  const right = fwd.clone().cross(V(0, 1, 0)).normalize();
  const sp = bp.clone().addScaledVector(fwd, 230).addScaledVector(right, -95).add(V(0, 38, 0));
  beltStar.position.copy(sp);
  beltSun.position.copy(sp);
  beltSun.target.position.copy(bp);
}
buildKeys();

let target = 0, cur = 0, s = 0;
function onScroll() {
  const m = document.documentElement.scrollHeight - innerHeight;
  target = m > 0 ? clamp(scrollY / m, 0, 1) : 0;
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.querySelectorAll('[data-stage]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const m = document.documentElement.scrollHeight - innerHeight;
  scrollTo({ top: m * (+a.dataset.stage / 3), behavior: reduce ? 'auto' : 'smooth' });
}));

/* ================= HUD + INFO PANEL ================= */
const stageEls = [...document.querySelectorAll('.stage')];
const info = $('#info');
let selected = null, panelStage = -1;

function openInfo(ent) {
  selected = ent; panelStage = Math.round(s);
  $('#info-tag').textContent = ent.d.tag || '';
  $('#info-name').textContent = ent.d.n;
  $('#info-desc').textContent = ent.d.d;
  const use = $('#info-use'); use.textContent = ent.d.use || ''; use.hidden = !ent.d.use;
  const link = $('#info-link'); link.hidden = !ent.d.link; if (ent.d.link) link.href = ent.d.link;
  info.classList.add('open');
}
function closeInfo() { selected = null; info.classList.remove('open'); }
$('#info-close').addEventListener('click', closeInfo);
addEventListener('keydown', e => { if (e.key === 'Escape') closeInfo(); });

/* ================= RAYCAST ================= */
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2(-9, -9);
let hovered = null;
const isUI = t => t && t.closest && t.closest('#info, a, button, #top-nav');
function setMouse(e) { mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); }
addEventListener('pointermove', e => { if (isUI(e.target)) mouse.set(-9, -9); else setMouse(e); }, { passive: true });
function pickEnt() {
  const st = Math.round(s);
  const list = st === 1 ? skillHits : st === 2 ? sysHits : null;
  if (!list || mouse.x < -2) return null;
  ray.setFromCamera(mouse, camera);
  const h = ray.intersectObjects(list, false)[0];
  return h ? h.object.userData.ent : null;
}
addEventListener('click', e => {
  if (isUI(e.target)) return;
  setMouse(e);
  const ent = pickEnt();
  if (ent) openInfo(ent);
});

/* ================= LOOP ================= */
const clock = new THREE.Clock();
const look = V(0, 0, 0);
let T = 0;

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  T += dt * K;

  // scroll -> camera journey
  cur += (target - cur) * (reduce ? 1 : 1 - Math.pow(0.004, dt));
  s = cur * 3;
  const idx = Math.min(2, Math.floor(s));
  const f = s - idx;
  const u = clamp((f - 0.15) / 0.7, 0, 1);
  const e = u * u * (3 - 2 * u);
  camera.position.lerpVectors(keys[idx].p, keys[idx + 1].p, e);
  look.lerpVectors(keys[idx].l, keys[idx + 1].l, e);
  const sw = clamp(s, 0, 1) * K;
  camera.position.x += Math.sin(T * 0.31) * 1.6 * sw;
  camera.position.y += Math.sin(T * 0.23) * 1.1 * sw;
  look.x += Math.sin(T * 0.19) * 2.0 * sw;
  camera.lookAt(look);
  const fov = 60 + 26 * Math.sin(Math.PI * e) * K;
  if (Math.abs(fov - camera.fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }

  // stage isolation: only what the camera is actually near can be seen
  const far = FOG_FAR[idx] + (FOG_FAR[idx + 1] - FOG_FAR[idx]) * e;
  scene.fog.far = far; scene.fog.near = far * 0.62;
  for (let i = 0; i < 4; i++) {
    vis[i] = clamp((far - camera.position.distanceTo(anchors[i])) / (0.4 * far), 0, 1);
    FADE[i].value = vis[i];
  }
  fadeSprites.forEach(o => { o.m.opacity = o.base * vis[o.st]; });
  galaxy.material.opacity = 0.9 * vis[0];
  galaxyGroup.visible = vis[0] > 0.003;
  beltGroup.visible = vis[1] > 0.003;
  beltStar.visible = beltSun.visible = vis[1] > 0.003;
  beltSun.intensity = 1.5 * vis[1];
  sysGroup.visible = vis[2] > 0.003;
  sunLight.intensity = 2.6 * vis[2];
  holeGroup.visible = vis[3] > 0.003;

  // HUD fade
  stageEls.forEach((el, i) => {
    const op = clamp(1 - (Math.abs(s - i) - 0.12) / 0.28, 0, 1);
    el.style.opacity = op.toFixed(3);
    el.style.visibility = op < 0.01 ? 'hidden' : 'visible';
    el.style.transform = `translateY(${(-(s - i) * 40).toFixed(1)}px)`;
    el.classList.toggle('live', op > 0.6);
  });
  if (selected && Math.round(s) !== panelStage) closeInfo();

  // hover
  const hit = pickEnt();
  if (hit !== hovered) { hovered = hit; document.body.style.cursor = hit ? 'pointer' : ''; }

  // 1. galaxy
  if (galaxyGroup.visible) { galaxy.rotation.y = T * 0.05; galaxy.rotation.z = T * 0.01; }

  // 2. belt
  if (beltGroup.visible) {
    layers.forEach(l => { l.pivot.rotation.y += l.w * dt * K; });
    skillEnts.forEach(en => {
      en.hover += ((hovered === en ? 1 : 0) - en.hover) * 0.15;
      const bob = Math.sin(T * 0.6 + en.ph) * 0.8 * (1 - en.hover);
      en.mesh.position.set(en.bx, en.by + bob, en.bz);
      en.mesh.rotation.x += en.rotV * dt * K * (1 - 0.8 * en.hover);
      en.mesh.rotation.y += en.rotV * 0.7 * dt * K * (1 - 0.8 * en.hover);
      const sc = en.base * (1 + 0.28 * en.hover + (selected === en ? 0.15 : 0));
      en.mesh.scale.setScalar(sc);
      en.mesh.material.emissiveIntensity = 0.1 + 0.5 * en.hover + (selected === en ? 0.3 : 0);
      en.label.position.set(en.bx, en.by + bob + sc * 1.6 + 2.4, en.bz);
      sizeLabel(en.label, en.lw, en.hover, 45, 1, 2.6);
    });
  }

  // 3. solar system
  if (sysGroup.visible) {
    sunUniforms.uTime.value = T;
    sunGlowA.scale.setScalar(SUN_R * 5 + Math.sin(T * 1.5) * 3);
    sun.rotation.y = T * 0.02;
    sunEnt.hover += ((hovered === sunEnt ? 1 : 0) - sunEnt.hover) * 0.15;
    sizeLabel(sunLabel, 34, sunEnt.hover, 150, 0.9, 1.6);
    planetEnts.forEach(en => {
      en.hover += ((hovered === en ? 1 : 0) - en.hover) * 0.15;
      en.a += en.w * dt * K * (1 - 0.9 * en.hover);
      en.pivot.position.set(Math.cos(en.a) * en.P.orbit, 0, Math.sin(en.a) * en.P.orbit);
      const sc = 1 + 0.12 * en.hover + (selected === en ? 0.08 : 0);
      en.pivot.scale.setScalar(sc);
      en.mesh.rotation.y += en.P.spin * 0.25 * dt * K;
      if (en.mesh.userData.clouds) en.mesh.userData.clouds.rotation.y += en.P.spin * 0.33 * dt * K;
      if (en.moon) {
        en.ma += dt * K * 0.35;
        en.moon.position.set(Math.cos(en.ma) * en.P.r * 2.1, Math.sin(en.ma * 0.7) * en.P.r * 0.3, Math.sin(en.ma) * en.P.r * 2.1);
      }
      en.label.position.set(en.pivot.position.x, en.P.r * 1.5 + 4, en.pivot.position.z);
      sizeLabel(en.label, en.lw, en.hover, 110, 0.9, 2.0);
    });
  }

  // 4. black hole
  if (holeGroup.visible) {
    diskUniforms.uTime.value = T;
    jetUniforms.uTime.value = T;
  }

  renderer.render(scene, camera);
}
animate();

/* ---------- Resize ---------- */
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  buildKeys();
  onScroll();
});
})();
