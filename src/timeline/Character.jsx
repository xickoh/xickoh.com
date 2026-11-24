// O boneco: formas planas, desenhado com a origem nos pés. Cresce e muda de roupa com a posição no mundo.
import { X } from './track.js'

const SKIN = '#e8b796'
const HAIR = '#b3894e' // loiro-acastanhado
const EYE = '#2b7fd6'
const LEGS = '#34415e'

const lerp = (a, b, t) => a + (b - a) * t

// Altura do boneco ao longo do caminho (bebé que anda → adulto).
const HEIGHT = [
  [520, 44],
  [1100, 60],
  [X.pc, 84],
  [2300, 93],
  [X.pier, 102],
  [X.quay, 108],
  [X.fixeads, 110],
]

function heightAt(x) {
  if (x <= HEIGHT[0][0]) return HEIGHT[0][1]
  for (let i = 1; i < HEIGHT.length; i++) {
    if (x <= HEIGHT[i][0]) {
      const [xa, a] = HEIGHT[i - 1]
      const [xb, b] = HEIGHT[i]
      return lerp(a, b, (x - xa) / (xb - xa))
    }
  }
  return HEIGHT[HEIGHT.length - 1][1]
}

function outfitAt(x, night) {
  if (x === X.school) return { shirt: night > 0.5 ? '#e39a3b' : '#3d7ea6' }
  if (night > 0.5) return { shirt: '#8a4452', hood: true }
  if (x < X.pc) return { shirt: '#e2574c' }
  if (x < X.pier) return { shirt: '#3d7ea6', pack: x > X.pc + 60 && '#e39a3b' }
  if (x < 4500) return { shirt: '#2f4858' }
  if (x < 5050) return { shirt: '#f6f2ea', badge: true }
  if (x < X.station) return { shirt: '#c9773f' }
  if (x < X.porto) return { shirt: '#5b8c5a', pack: x >= X.felgueiras && x !== X.estg && '#3c4f6b' }
  return { shirt: '#4a6fa5' }
}

function Baby({ pose, phase }) {
  const onesie = '#f1c95b'
  if (pose === 'baby-sit') {
    return (
      <g>
        <path d="M-2 -7 L13 -4 M-2 -4 L11 -1" stroke={onesie} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="-2" cy="-12" rx="9.5" ry="11" fill={onesie} />
        <path d="M0 -15 L9 -11" stroke={onesie} strokeWidth="5" strokeLinecap="round" />
        <circle cx="10" cy="-10.5" r="2.6" fill={SKIN} />
        <circle cx="-2" cy="-31" r="10.5" fill={HAIR} />
        <circle cx="-0.5" cy="-29.5" r="9.8" fill={SKIN} />
        <circle cx="4" cy="-30" r="1.5" fill={EYE} />
      </g>
    )
  }
  const a = Math.sin(phase) * 7
  const bob = Math.abs(Math.cos(phase)) * 1.2
  return (
    <g transform={`translate(0 ${-bob})`}>
      <path
        d={`M-8 -10 L${-10 - a} 0 M8 -10 L${10 + a} 0`}
        stroke={onesie}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <ellipse cx="0" cy="-12" rx="13" ry="7.5" fill={onesie} />
      <path
        d={`M-7 -10 L${-7 + a} 0 M9 -10 L${12 - a} 0`}
        stroke={onesie}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <circle cx="15" cy="-21" r="10" fill={HAIR} />
      <circle cx="16.5" cy="-19.8" r="9.3" fill={SKIN} />
      <circle cx="21" cy="-20.5" r="1.5" fill={EYE} />
    </g>
  )
}

// `look` troca a roupa, o cabelo e os olhos: é o que distingue os amigos do boneco principal.
export default function Character({ x, pose, night = 0, typing = false, clip = false, look }) {
  if (pose === 'baby-sit' || pose === 'crawl') return <Baby pose={pose} phase={x / 9} />

  const H = heightAt(x)
  const k = (H - 44) / 66 // 0 no bebé que anda, 1 no adulto
  const r = 10.5 + 1.5 * k
  const leg = (H - 2 * r) * 0.535
  const torso = (H - 2 * r) * 0.465
  const tw = 13 + 7 * k
  const legW = 4.5 + 4.5 * k
  const armW = 3.8 + 3.4 * k
  const arm = torso * 0.92 + 2
  const out = { hair: HAIR, eye: EYE, skin: SKIN, ...outfitAt(x, night), ...look }

  const rest = pose === 'rest' // sentado, de mãos no colo
  const sit = pose === 'sit' || rest
  const still = pose === 'stand' || pose === 'boat' || pose === 'train'
  const a = sit || still ? 0 : Math.sin((x / (leg * 1.15 + 6)) * Math.PI) * 0.46
  const seat = 23
  const hipY = sit ? -seat - legW / 2 : -leg * Math.cos(a)
  const shY = hipY - torso + 4
  const hx = 1
  const hy = hipY - torso - r + 3.5

  let legs
  if (sit) {
    const thigh = Math.min(leg * 0.5, 23)
    const shin = leg - thigh
    legs = (
      <path
        d={`M0 ${hipY} L${thigh} ${hipY} L${thigh} ${Math.min(hipY + shin, -legW / 2)}`}
        stroke={LEGS}
        strokeWidth={legW}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )
  } else {
    const foot = (s) => `${Math.sin(a * s) * leg} ${hipY + Math.cos(a) * leg - legW / 2}`
    legs = (
      <path
        d={`M0 ${hipY} L${foot(-1)} M0 ${hipY} L${foot(1)}`}
        stroke={LEGS}
        strokeWidth={legW}
        strokeLinecap="round"
      />
    )
  }

  // Braços: a balançar ao andar, pousados no teclado quando sentado.
  const hand = (s) =>
    rest
      ? [10 + s * 2, hipY - 3]
      : sit
        ? [22 + s * 3, -47]
      : [Math.sin(-a * 0.9 * s) * arm, shY + Math.cos(a * 0.9) * arm]
  const [bx, by] = hand(-1)
  const [fx, fy] = hand(1)

  return (
    <g clipPath={clip ? 'url(#train-window)' : undefined}>
      <g className={typing ? 'typing back' : undefined}>
        <path d={`M0 ${shY} L${bx} ${by}`} stroke={out.shirt} strokeWidth={armW} strokeLinecap="round" opacity="0.82" />
        <circle cx={bx} cy={by} r={armW * 0.55} fill={out.skin} />
      </g>
      {legs}
      {out.pack && (
        <rect x={-tw / 2 - 8} y={shY - 1} width="11" height={torso * 0.72} rx="4.5" fill={out.pack} />
      )}
      {out.hood && <circle cx={hx - 3.5} cy={hy + 1} r={r + 2.2} fill={out.shirt} />}
      <rect x={-tw / 2} y={hipY - torso} width={tw} height={torso + legW / 2} rx={tw * 0.42} fill={out.shirt} />
      {out.badge && (
        <g>
          <path d={`M-2 ${shY - 2} L4 ${shY + torso * 0.42}`} stroke="#d2493f" strokeWidth="1.3" />
          <rect x="1" y={shY + torso * 0.4} width="6.5" height="8" rx="1" fill="#fff" stroke="#d2493f" strokeWidth="1" />
        </g>
      )}
      {!out.hood && <circle cx={hx - 1.8} cy={hy - 2.2} r={r} fill={out.hair} />}
      <circle cx={hx + (out.hood ? 1.5 : 0.6)} cy={hy + 0.6} r={r - (out.hood ? 2 : 1)} fill={out.skin} />
      <circle cx={hx + r * 0.5} cy={hy + 0.5} r="1.7" fill={out.eye} />
      <g className={typing ? 'typing' : undefined}>
        <path d={`M0 ${shY} L${fx} ${fy}`} stroke={out.shirt} strokeWidth={armW} strokeLinecap="round" />
        <circle cx={fx} cy={fy} r={armW * 0.55} fill={out.skin} />
      </g>
    </g>
  )
}
