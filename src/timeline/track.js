// O percurso: o scroll (em alturas de ecrã) é convertido numa posição no mundo.
// 'walk' faz o boneco andar de x0 a x1; 'stop' deixa-o parado em x enquanto a cena corre (t de 0 a 1).

export const GROUND = 470
export const VIEW_H = 600

// Sítios do mundo (unidades do SVG) que mais do que um ficheiro precisa de conhecer.
export const X = {
  crib: 300,
  games: 1150,
  pc: 1750,
  pier: 3000,
  quay: 4250,
  fixeads: 4700,
  lusofona: 5400,
  hnf: 6000,
  station: 6600,
  felgueiras: 7750,
  estg: 8600,
  porto: 8900,
  desk: 10050,
  room: 10150, // centro do escritório/quarto
  end: 10900,
}

const SEGS = [
  { id: 'intro', type: 'stop', x: X.crib, len: 0.9, pose: 'baby-sit' },
  { id: 'crawl', type: 'walk', x0: X.crib, x1: 520, len: 0.6, pose: 'crawl' },
  { id: 'barreiro', type: 'walk', x0: 520, x1: X.games, len: 0.8 },
  { id: 'jogos', type: 'stop', x: X.games, len: 0.9, pose: 'sit' },
  { id: 'barreiro2', type: 'walk', x0: X.games, x1: X.pc, len: 0.7 },
  { id: 'pc', type: 'stop', x: X.pc, len: 1.5, pose: 'sit' },
  { id: 'escola', type: 'walk', x0: X.pc, x1: X.pier, len: 1.3 },
  { id: 'tejo', type: 'walk', x0: X.pier, x1: X.quay, len: 1.1, pose: 'boat' },
  { id: 'lisboa', type: 'walk', x0: X.quay, x1: X.fixeads, len: 0.6 },
  { id: 'fixeads', type: 'stop', x: X.fixeads, len: 0.9, pose: 'sit' },
  { id: 'lisboa2', type: 'walk', x0: X.fixeads, x1: X.lusofona, len: 0.7 },
  { id: 'lusofona', type: 'stop', x: X.lusofona, len: 0.8, pose: 'sit' },
  { id: 'lisboa3', type: 'walk', x0: X.lusofona, x1: X.hnf, len: 0.6 },
  { id: 'hnf', type: 'stop', x: X.hnf, len: 0.9, pose: 'sit' },
  { id: 'lisboa4', type: 'walk', x0: X.hnf, x1: X.station, len: 0.5 },
  { id: 'norte', type: 'walk', x0: X.station, x1: X.felgueiras, len: 1.1, pose: 'train' },
  { id: 'felgueiras', type: 'walk', x0: X.felgueiras, x1: X.estg, len: 0.9 },
  { id: 'estg', type: 'stop', x: X.estg, len: 0.8, pose: 'sit' },
  { id: 'porto', type: 'walk', x0: X.estg, x1: X.desk, len: 1.3 },
  { id: 'presente', type: 'stop', x: X.desk, len: 3.2, pose: 'sit' },
  { id: 'caminho', type: 'walk', x0: X.desk, x1: X.end, len: 1.0 },
  { id: 'fim', type: 'stop', x: X.end, len: 0.6, pose: 'stand' },
]

let acc = 0
for (const s of SEGS) {
  s.start = acc
  acc += s.len
}
export const TOTAL = acc

const BY_ID = Object.fromEntries(SEGS.map((s) => [s.id, s]))

// Posição no scroll (em alturas de ecrã) de um ponto t dentro de um troço.
export const at = (id, t = 0) => BY_ID[id].start + BY_ID[id].len * t

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t

// A parte do dia na cena do presente: de dia até 0.4, anoitece até 0.6, noite a seguir.
export const DAY_T = 0.2
export const NIGHT_T = 0.8

const PLACES = [
  [X.porto, 'Porto'],
  [X.felgueiras, 'Felgueiras'],
  [X.station + 1, 'Para norte'],
  [X.quay, 'Lisboa'],
  [X.pier + 1, 'Rio Tejo'],
  [-Infinity, 'Barreiro'],
]

export function locate(u) {
  u = clamp(u, 0, TOTAL)
  let seg = SEGS[SEGS.length - 1]
  for (const s of SEGS) {
    if (u < s.start + s.len) {
      seg = s
      break
    }
  }
  const t = clamp((u - seg.start) / seg.len)
  const x = seg.type === 'walk' ? lerp(seg.x0, seg.x1, t) : seg.x
  const past = u >= BY_ID.presente.start + BY_ID.presente.len
  const night = seg.id === 'presente' ? smooth(0.42, 0.6, t) : past ? 1 : 0
  const dawn = seg.id === 'caminho' ? smooth(0.1, 1, t) : seg.id === 'fim' ? 1 : 0
  const place = seg.id === 'fim' || seg.id === 'caminho' ? 'A seguir' : PLACES.find(([px]) => x >= px)[1]
  return {
    u,
    id: seg.id,
    t,
    x,
    pose: seg.pose || 'walk',
    night,
    dawn,
    place,
    // Quanto a câmara larga o boneco para centrar o escritório.
    pin: 1 - smooth(0, 380, Math.abs(x - X.desk)),
  }
}

// Marcos do caminho em miniatura.
export const MARKS = [
  { label: 'Barreiro', u: 0 },
  { label: 'Primeiro computador', u: at('pc', 0.25) },
  { label: 'Lisboa', u: at('fixeads', 0.4) },
  { label: 'ESTG', u: at('estg', 0.4) },
  { label: 'Porto Editora', u: at('presente', DAY_T) },
  { label: 'À noite', u: at('presente', NIGHT_T) },
  { label: 'A seguir', u: TOTAL },
]

// Cor do céu ao longo do caminho.
const SKY = [
  [0, [213, 234, 245]],
  [2900, [205, 229, 243]],
  [4300, [248, 230, 200]],
  [6400, [248, 230, 200]],
  [7700, [226, 240, 220]],
  [8900, [208, 221, 236]],
  [12000, [208, 221, 236]],
]
const NIGHT_SKY = [22, 27, 52]
const DUSK_SKY = [122, 96, 140]
const DAWN_SKY = [244, 205, 178]

export function skyAt({ x, night, dawn }) {
  let i = 0
  while (i < SKY.length - 2 && x > SKY[i + 1][0]) i++
  const [xa, a] = SKY[i]
  const [xb, b] = SKY[i + 1]
  const k = clamp((x - xa) / (xb - xa))
  let c = a.map((v, j) => lerp(v, b[j], k))
  c = c.map((v, j) => lerp(v, NIGHT_SKY[j], night))
  if (dawn > 0) {
    c = c.map((v, j) => (dawn < 0.5 ? lerp(v, DUSK_SKY[j], dawn * 2) : lerp(DUSK_SKY[j], DAWN_SKY[j], dawn * 2 - 1)))
  }
  return c.map(Math.round)
}
