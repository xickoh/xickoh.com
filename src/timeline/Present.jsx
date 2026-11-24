// A cena do presente: a mesma secretária de dia (Porto Editora) e de noite (em casa).
// Desenhada à volta do centro do compartimento (x = 0), com o chão em y = 0.
import { useEffect, useRef, useState } from 'react'
import banner from '../assets/banner.png'
import photo from '../assets/eu.jpg'
import { HOBBIES, SKILLS_NOTE } from './content.js'
import { REDUCED } from './motion.js'

const HALF = 250
const TOP = -292
const WALL = 'translate(0 34)' // o que está pendurado na parede desce com o teto

const CODE = [
  'function proxima(jogo) {',
  '  let p = jogo.fila.pop()',
  '  mostrar(p.texto)',
  '  return p.pontos',
  '}',
  '',
  'const teste = novoTeste()',
  'teste.corrigir(respostas)',
  'teste.guardar()',
]

// Um objeto clicável dentro do SVG, com teclado.
export function Hot({ on, label, onPress, children, className = '', ...rest }) {
  return (
    <g
      className={`hot ${on ? 'on' : ''} ${className}`}
      role="button"
      aria-label={label}
      aria-hidden={!on}
      tabIndex={on ? 0 : -1}
      onClick={on ? onPress : undefined}
      onKeyDown={(e) => {
        if (on && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onPress(e)
        }
      }}
      {...rest}
    >
      {children}
    </g>
  )
}

// Posição, no texto todo, em que cada linha começa.
const STARTS = CODE.map((_, i) => CODE.slice(0, i).join('\n').length + (i ? 1 : 0))
const CODE_LEN = CODE.join('\n').length + 30 // com uma pausa no fim antes de recomeçar

function CodeScreen({ running }) {
  const [n, setN] = useState(REDUCED ? CODE_LEN - 1 : 0)
  useEffect(() => {
    if (!running || REDUCED) return
    const id = setInterval(() => setN((v) => v + 1), 70)
    return () => clearInterval(id)
  }, [running])
  const pos = n % CODE_LEN
  return (
    <g className="code">
      {CODE.map((line, i) => {
        const at = pos - STARTS[i]
        return (
          <text key={i} x="-35" y={-100 + i * 5.2} xmlSpace="preserve">
            {line.slice(0, Math.max(0, at))}
            {at >= 0 && at <= line.length ? '▌' : ''}
          </text>
        )
      })}
    </g>
  )
}

// A bola e o carro ficam entre a picareta e o baú, para nunca pararem à frente de nenhum dos dois.
const BALL_MIN = -188
const BALL_MAX = 136
const R = 11
const rand = (a, b) => a + Math.random() * (b - a)
// A baliza fica encostada ao baú, virada para a esquerda: a boca em GOAL_X, a trave em GOAL_TOP.
const GOAL_X = 116
const GOAL_TOP = -46
const CONFETTI = ['#f2c230', '#d2493f', '#3d7ed6', '#4fa55f', '#f4f1ea', '#e8833a']

// Rocket League: um toque no carro ou na bola e o carro acelera (ou voa) até à bola, de boost ligado, e chuta-a.
function RocketLeague({ on, onNote }) {
  const [goal, setGoal] = useState(0)
  const ballRef = useRef(null)
  const carRef = useRef(null)
  const flameRef = useRef(null)
  const s = useRef({
    b: { x: 40, y: -R, vx: 0, vy: 0, rot: 0, scored: false },
    c: { x: -40, y: 0, vx: 0, vy: 0, rot: 0, face: 1, mode: 'idle', since: 0 },
    raf: 0,
    last: 0,
  })

  const draw = () => {
    const { b, c } = s.current
    ballRef.current?.setAttribute('transform', `translate(${b.x} ${b.y}) rotate(${b.rot})`)
    carRef.current?.setAttribute('transform', `translate(${c.x} ${c.y}) rotate(${c.rot}) scale(${c.face} 1)`)
    flameRef.current?.setAttribute('opacity', c.mode === 'chase' ? 1 : 0)
  }

  const step = (now) => {
    const st = s.current
    const { b, c } = st
    const dt = Math.min(0.032, (now - st.last) / 1000)
    st.last = now

    if (c.mode === 'chase') {
      const dx = b.x - c.x
      const dy = b.y - (c.y - 7)
      const dist = Math.hypot(dx, dy)
      if (Math.abs(dx) > 2) c.face = dx > 0 ? 1 : -1
      const move = Math.min(560 * dt, dist)
      c.x += (dx / (dist || 1)) * move
      c.y = Math.min(0, c.y + (dy / (dist || 1)) * move)
      c.rot = c.y < 0 || dy < -10 ? (c.face * Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI : 0
      if (dist < 20 || now - c.since > 3000) {
        if (dist < 20) {
          // Dentro da baliza só dá para a chutar cá para fora.
          b.vx = (b.x > GOAL_X ? -1 : c.face) * rand(260, 500)
          b.vy = -rand(420, 680)
        }
        c.mode = 'coast'
        c.vx = c.face * 220
        c.vy = 0
      }
    } else if (c.mode === 'coast') {
      c.vy += 1100 * dt
      c.x += c.vx * dt
      c.y += c.vy * dt
      c.vx *= 1 - Math.min(1, 3 * dt)
      c.rot *= 1 - Math.min(1, 8 * dt)
      if (c.y >= 0) {
        c.y = 0
        c.vy = 0
      }
      if (c.y === 0 && Math.abs(c.vx) < 8) {
        c.mode = 'idle'
        c.rot = 0
      }
    }
    c.x = Math.min(BALL_MAX, Math.max(BALL_MIN, c.x))

    const wasInside = b.x > GOAL_X - R
    b.vy += 1100 * dt
    b.x += b.vx * dt
    b.y += b.vy * dt
    b.rot += b.vx * dt * 4
    // A baliza: por cima da trave a bola bate no poste e volta; lá dentro não passa da trave.
    const under = b.y > GOAL_TOP + R
    if (!wasInside && !under && b.x > GOAL_X - R) {
      b.x = GOAL_X - R
      b.vx = -Math.abs(b.vx) * 0.8
    }
    if (wasInside && !under) {
      b.y = GOAL_TOP + R
      b.vy = Math.abs(b.vy) * 0.5
    }
    if (b.x > GOAL_X + 4 && !b.scored) {
      b.scored = true
      setGoal((g) => g + 1)
      onNote(HOBBIES.goal)
    }
    if (b.x < GOAL_X - R) b.scored = false
    if (b.x < BALL_MIN) {
      b.x = BALL_MIN
      b.vx = Math.abs(b.vx) * 0.8
    }
    if (b.x > BALL_MAX) {
      b.x = BALL_MAX
      b.vx = -Math.abs(b.vx) * 0.8
    }
    if (b.y < TOP + R + 8) {
      b.y = TOP + R + 8
      b.vy = Math.abs(b.vy) * 0.7
    }
    if (b.y > -R) {
      b.y = -R
      b.vy = -b.vy * 0.68
      b.vx *= 0.9
      if (Math.abs(b.vy) < 60) b.vy = 0
    }
    draw()
    const ballStill = b.vy === 0 && b.y >= -R && Math.abs(b.vx) < 6
    if (ballStill && c.mode === 'idle') {
      st.raf = 0
      return
    }
    st.raf = requestAnimationFrame(step)
  }

  useEffect(() => {
    draw()
    const st = s.current
    return () => cancelAnimationFrame(st.raf)
  }, [])

  const play = () => {
    const st = s.current
    onNote(HOBBIES.ball)
    if (REDUCED) return
    if (st.c.mode === 'idle') {
      st.c.mode = 'chase'
      st.c.since = performance.now()
    }
    if (!st.raf) {
      st.last = performance.now()
      st.raf = requestAnimationFrame(step)
    }
  }

  return (
    <Hot on={on} label="Carro e bola: Rocket League" onPress={play}>
      <g pointerEvents="none">
        <path d={`M${GOAL_X} 0 V${GOAL_TOP} H${GOAL_X + 18} L${GOAL_X + 31} 0`} fill="#fff" fillOpacity="0.07" stroke="#f4f1ea" strokeWidth="2.6" strokeLinejoin="round" />
        <path
          d={`M${GOAL_X} -12 H${GOAL_X + 28} M${GOAL_X} -24 H${GOAL_X + 24} M${GOAL_X} -36 H${GOAL_X + 21} M${GOAL_X + 9} ${GOAL_TOP} V0 M${GOAL_X + 18} ${GOAL_TOP} V0`}
          stroke="#f4f1ea"
          strokeWidth="0.8"
          opacity="0.45"
        />
      </g>
      <g ref={carRef}>
        <rect x="-22" y="-22" width="44" height="24" fill="transparent" />
        <g ref={flameRef} opacity="0">
          <path d="M-17 -6 L-40 -8.5 L-28 -10 L-44 -12 L-17 -12 Z" fill="#ff9b3d" />
          <path d="M-17 -7.5 L-30 -9.5 L-17 -11 Z" fill="#ffe08a" />
        </g>
        <rect x="-20" y="-17" width="6" height="2.4" rx="1" fill="#1f5fae" />
        <rect x="-18" y="-16" width="2.4" height="5" fill="#1f5fae" />
        <path d="M-17 -4 V-10 Q-17 -13 -13 -13 H-6 L-1 -18 H8 L13 -13 H15 Q18 -13 18 -9 V-4 Z" fill="#2f7fd6" />
        <path d="M-3.5 -13 L0 -16.5 H7 L10.5 -13 Z" fill="#cfe9fa" />
        <circle cx="-9" cy="-4" r="4.4" fill="#20243a" />
        <circle cx="10" cy="-4" r="4.4" fill="#20243a" />
        <circle cx="-9" cy="-4" r="1.6" fill="#aeb9c7" />
        <circle cx="10" cy="-4" r="1.6" fill="#aeb9c7" />
      </g>
      <g ref={ballRef}>
        <circle r={R} fill="#e3e8ee" />
        <path d="M0 -5 L4.8 -1.5 L3 4 H-3 L-4.8 -1.5 Z" fill="#5d6b82" />
        <path d="M0 -5 V-11 M4.8 -1.5 L10.4 -3.4 M3 4 L6.4 9 M-3 4 L-6.4 9 M-4.8 -1.5 L-10.4 -3.4" stroke="#5d6b82" strokeWidth="1.5" />
        <circle r={R} fill="none" stroke="#5d6b82" strokeWidth="1.5" />
      </g>
      {goal > 0 && (
        <g key={goal} className="goal" pointerEvents="none" transform={`translate(${GOAL_X + 10} ${GOAL_TOP - 6})`}>
          {Array.from({ length: 18 }, (_, i) => (
            <rect
              key={i}
              x="-2"
              y="-2"
              width={i % 3 ? 4 : 6}
              height="4"
              fill={CONFETTI[i % CONFETTI.length]}
              style={{
                '--dx': `${Math.cos(i * 2.4) * (26 + ((i * 7) % 34))}px`,
                '--dy': `${-22 - ((i * 13) % 52)}px`,
                '--rot': `${(i % 2 ? 1 : -1) * (200 + i * 30)}deg`,
                animationDelay: `${(i % 5) * 30}ms`,
              }}
            />
          ))}
          <text y="-40" textAnchor="middle">
            GOAL!
          </text>
        </g>
      )}
    </Hot>
  )
}

// Cubos de Rubik na prateleira: um 4x4 e um 3x3, vistos de frente. Cada toque alterna entre resolvidos e
// baralhados, e os cubos saltam, dão uma ou duas cambalhotas e caem noutro sítio da prateleira.
const STICKERS = ['#f4f1ea', '#f2c230', '#d2493f', '#e8833a', '#3d7ed6', '#4fa55f']
const SHELF = [-238, -150, -196] // esquerda, direita e tampo
const CUBES = [
  { n: 4, size: 22, x: -234, face: 5 },
  { n: 3, size: 17, x: -204, face: 4 },
]
const scramble = () => CUBES.map((c) => Array.from({ length: c.n * c.n }, () => Math.floor(Math.random() * 6)))
const solve = () => CUBES.map((c) => Array.from({ length: c.n * c.n }, () => c.face))

// Sítios novos para os dois cubos, sem se sobreporem nem saírem da prateleira.
function landing() {
  const order = Math.random() < 0.5 ? [0, 1] : [1, 0]
  const free = SHELF[1] - SHELF[0] - CUBES[0].size - CUBES[1].size - 4
  const left = Math.random() * free
  const gap = 4 + Math.random() * (free - left)
  const xs = []
  xs[order[0]] = SHELF[0] + left
  xs[order[1]] = xs[order[0]] + CUBES[order[0]].size + gap
  return xs
}

function Cubes({ on, onNote }) {
  const [solved, setSolved] = useState(true)
  const [colors, setColors] = useState(solve)
  const refs = useRef([])
  const anim = useRef({ xs: CUBES.map((c) => c.x), raf: 0 })

  const place = (i, x, lift = 0, rot = 0) => {
    const half = CUBES[i].size / 2
    refs.current[i]?.setAttribute('transform', `translate(${x} ${SHELF[2] - CUBES[i].size - lift}) rotate(${rot} ${half} ${half})`)
  }

  useEffect(() => {
    const a = anim.current
    a.xs.forEach((x, i) => place(i, x))
    return () => cancelAnimationFrame(a.raf)
  }, [])

  const toggle = () => {
    setColors(solved ? scramble() : solve())
    setSolved(!solved)
    onNote(HOBBIES.cubes)
    const a = anim.current
    const from = a.xs
    const to = landing()
    a.xs = to
    cancelAnimationFrame(a.raf)
    if (REDUCED) {
      to.forEach((x, i) => place(i, x))
      return
    }
    const jumps = CUBES.map(() => ({
      height: 34 + Math.random() * 22,
      turns: (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.5 ? 1 : 2) * 360,
    }))
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 720)
      jumps.forEach((j, i) => place(i, from[i] + (to[i] - from[i]) * p, 4 * j.height * p * (1 - p), j.turns * p))
      if (p < 1) a.raf = requestAnimationFrame(tick)
    }
    a.raf = requestAnimationFrame(tick)
  }

  return (
    <Hot on={on} label={`Cubos de Rubik: ${solved ? 'baralhar' : 'resolver'}`} onPress={toggle}>
      {CUBES.map((c, ci) => {
        const cell = c.size / c.n
        return (
          <g key={c.n} ref={(el) => (refs.current[ci] = el)}>
            <rect x="-4" y="-4" width={c.size + 8} height={c.size + 8} fill="transparent" />
            <rect width={c.size} height={c.size} rx="1.5" fill="#15182b" />
            {colors[ci].map((color, i) => (
              <rect
                key={i}
                className="sticker"
                x={(i % c.n) * cell + 0.6}
                y={Math.floor(i / c.n) * cell + 0.6}
                width={cell - 1.2}
                height={cell - 1.2}
                rx="0.8"
                fill={STICKERS[color]}
                style={{ transitionDelay: `${(i % c.n) * 40}ms` }}
              />
            ))}
          </g>
        )
      })}
    </Hot>
  )
}

function Pickaxe({ on, onNote }) {
  const [dug, setDug] = useState(0)
  const [swing, setSwing] = useState(0)
  useEffect(() => {
    if (!dug) return
    const id = setTimeout(() => setDug(0), 4500)
    return () => clearTimeout(id)
  }, [dug])
  const hit = () => {
    setDug((d) => (d >= 5 ? 0 : d + 1))
    setSwing((v) => v + 1)
    onNote(HOBBIES.pick)
  }
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i} transform={`translate(${-242 + i * 17} 1)`}>
          <rect width="16" height="16" fill="#14172a" />
          <g className={`block ${i < dug ? 'gone' : ''}`}>
            <rect width="16" height="16" fill="#8a6748" />
            <rect width="16" height="5" fill="#6fa55f" />
            <rect x="3" y="8" width="3" height="3" fill="#73553a" />
            <rect x="10" y="10" width="3" height="3" fill="#73553a" />
          </g>
        </g>
      ))}
      <Hot on={on} label="Picareta: Terraria" onPress={hit}>
        <g key={swing} className={swing ? 'swing' : ''} style={{ transformOrigin: '-226px 0px' }}>
          <rect x="-244" y="-74" width="40" height="76" fill="transparent" />
          <path d="M-226 -2 L-212 -62" stroke="#a9794f" strokeWidth="5" strokeLinecap="round" />
          <path d="M-232 -52 Q-212 -76 -190 -66 Q-208 -66 -214 -56 Z" fill="#aeb9c7" />
          <path d="M-232 -52 Q-226 -62 -216 -66" stroke="#8793a3" strokeWidth="2" fill="none" />
        </g>
      </Hot>
    </g>
  )
}

const newPlanet = () => ({
  hue: Math.floor(Math.random() * 360),
  r: 14 + Math.random() * 12,
  ring: Math.random() > 0.45,
  moons: Math.floor(Math.random() * 3),
  tilt: -30 + Math.random() * 50,
})

function Sky({ night, t, on, onNote }) {
  const [p, setP] = useState({ hue: 18, r: 20, ring: true, moons: 1, tilt: -18 })
  const dusk = 4 * night * (1 - night)
  const sunY = -272 + Math.min(1, t / 0.55) * 80
  return (
    <g>
      <clipPath id="window-clip">
        <rect x="130" y="-292" width="104" height="104" rx="5" />
      </clipPath>
      <g clipPath="url(#window-clip)">
        <rect x="130" y="-292" width="104" height="104" fill="#bfe3f7" />
        <circle cx="205" cy={sunY} r="13" fill="#ffd66b" />
        <rect x="130" y="-292" width="104" height="104" fill="#f29a5c" opacity={dusk * 0.85} />
        <g opacity={night}>
          <rect x="130" y="-292" width="104" height="104" fill="#0f1430" />
          {[
            [142, -276],
            [160, -212],
            [222, -280],
            [214, -204],
            [150, -244],
            [226, -236],
            [176, -284],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" className="twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          <Hot
            on={on}
            label="Janela: No Man's Sky"
            onPress={() => {
              setP(newPlanet())
              onNote(HOBBIES.planet)
            }}
          >
            <rect x="130" y="-292" width="104" height="104" fill="transparent" />
            <g transform={`translate(182 -240) rotate(${p.tilt})`}>
              {p.ring && <ellipse rx={p.r * 1.75} ry={p.r * 0.42} fill="none" stroke={`hsl(${(p.hue + 40) % 360} 60% 78%)`} strokeWidth="3" />}
              <circle r={p.r} fill={`hsl(${p.hue} 55% 60%)`} />
              <path d={`M${-p.r * 0.9} ${-p.r * 0.25} H${p.r * 0.95} M${-p.r} ${p.r * 0.15} H${p.r * 0.8}`} stroke={`hsl(${p.hue} 50% 48%)`} strokeWidth={p.r * 0.16} strokeLinecap="round" />
              {p.ring && <path d={`M${-p.r * 1.75} 0 A${p.r * 1.75} ${p.r * 0.42} 0 0 0 ${p.r * 1.75} 0`} fill="none" stroke={`hsl(${(p.hue + 40) % 360} 60% 78%)`} strokeWidth="3" />}
              {Array.from({ length: p.moons }, (_, i) => (
                <circle key={i} cx={(i ? -1 : 1) * p.r * 2.1} cy={(i ? 1 : -1) * p.r * 0.9} r={3 + i} fill="#d9dbe6" />
              ))}
            </g>
          </Hot>
        </g>
      </g>
      <path d="M182 -292 V-188 M130 -240 H234" stroke="currentColor" strokeWidth="4" opacity="0.18" pointerEvents="none" />
      <rect x="126" y="-188" width="112" height="6" rx="2" fill="currentColor" opacity="0.2" />
    </g>
  )
}

export default function Present({ night, t, active, onNote, onOpen }) {
  const room = active && night > 0.85
  const office = active && night < 0.15
  const [steam, setSteam] = useState(0)
  return (
    <g>
      {/* Paredes: escritório e, por cima, o quarto */}
      <path d={`M${-HALF} 0 V${TOP + 16} Q${-HALF} ${TOP} ${-HALF + 16} ${TOP} H${HALF - 16} Q${HALF} ${TOP} ${HALF} ${TOP + 16} V0 Z`} fill="#fbf8f1" />
      <path d={`M${-HALF} 0 V${TOP + 16} Q${-HALF} ${TOP} ${-HALF + 16} ${TOP} H${HALF - 16} Q${HALF} ${TOP} ${HALF} ${TOP + 16} V0 Z`} fill="#2b3050" opacity={night} />
      <rect x={-HALF} y="-9" width={HALF * 2} height="9" fill="rgba(0,0,0,0.12)" />

      <g transform={WALL} style={{ color: night > 0.5 ? '#fff' : '#2c3345' }}>
        <Sky night={night} t={t} on={room} onNote={onNote} />
      </g>

      {/* Só de dia: o escritório */}
      <g opacity={1 - night} pointerEvents="none">
        <g transform={WALL}>
        <rect x="-118" y="-282" width="170" height="36" rx="7" fill="#2c3345" />
        <text x="-33" y="-258" textAnchor="middle" className="sign light">
          Porto Editora
        </text>
        <rect x="-236" y="-286" width="104" height="84" rx="4" fill="#fff" stroke="#c9d0da" strokeWidth="3" />
        <text x="-184" y="-268" textAnchor="middle" className="sign small">
          Escola Virtual
        </text>
        <rect x="-226" y="-256" width="22" height="20" fill="#f6d55c" />
        <rect x="-198" y="-256" width="22" height="20" fill="#8fd3c1" />
        <rect x="-170" y="-256" width="22" height="20" fill="#f29a8c" />
        <rect x="-212" y="-230" width="22" height="20" fill="#9cc7de" />
        <rect x="-184" y="-230" width="22" height="20" fill="#f6d55c" />
        </g>
        <path d="M-200 -22 Q-222 -52 -210 -78 Q-198 -52 -198 -22 Q-190 -60 -170 -68 Q-178 -38 -198 -22" fill="#5f9a62" />
        <path d="M-211 0 L-214 -24 H-184 L-187 0 Z" fill="#c9773f" />
      </g>

      {/* Só de noite: o quarto */}
      <g opacity={night}>
        <g transform={WALL}>
        <Hot on={room} label="Moldura: sobre mim" onPress={() => onOpen('about')}>
          <rect x="-114" y="-304" width="68" height="86" rx="3" fill="#b9975b" />
          <image href={photo} x="-109" y="-299" width="58" height="76" preserveAspectRatio="xMidYMid slice" />
        </Hot>
        <rect x="-240" y="-196" width="92" height="6" rx="2" fill="#8d6b4a" />
        <Hot
          on={room}
          label="Painel de competências: Old School RuneScape"
          onPress={() => {
            onNote(SKILLS_NOTE)
            onOpen('skills')
          }}
        >
          <rect x="-238" y="-296" width="66" height="60" rx="4" fill="#4a3a2a" stroke="#b9975b" strokeWidth="3" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect
              key={i}
              x={-232 + (i % 3) * 19}
              y={-290 + Math.floor(i / 3) * 17}
              width="16"
              height="14"
              rx="2"
              fill={['#e2c05a', '#c96f4a', '#7ab87a', '#5b9bd5', '#b98ad0', '#e39a3b', '#8fd3c1', '#d2493f', '#cfc7b6'][i]}
            />
          ))}
        </Hot>
        <Cubes on={room} onNote={onNote} />
        </g>
        <Pickaxe on={room} onNote={onNote} />
        <Hot on={room} label="Baú: os projetos" onPress={() => onOpen('chest')}>
          <rect x="150" y="-34" width="70" height="34" rx="3" fill="#8d5a34" />
          <path d="M150 -34 Q150 -58 185 -58 Q220 -58 220 -34 Z" fill="#a66b3d" />
          <path d="M150 -34 H220 M164 -57 V0 M206 -57 V0" stroke="#5e3b22" strokeWidth="3" fill="none" />
          <rect x="179" y="-41" width="12" height="14" rx="2" fill="#e2c05a" />
        </Hot>
      </g>

      {/* A secretária, igual nos dois */}
      <ellipse cx="6" cy="-84" rx="78" ry="56" fill="#9fc0ff" opacity={night * 0.16} />
      <g transform="translate(-100 0)" stroke={night > 0.5 ? '#6b7391' : '#4b5568'} strokeLinecap="round" fill="none">
        <path d="M-13 -24 H12" strokeWidth="6" />
        <path d="M-13 -24 V-62" strokeWidth="5" />
        <path d="M-10 -20 V0 M10 -20 V0" strokeWidth="4" />
      </g>
      <rect x="-86" y="-46" width="190" height="6" rx="2" fill="#b98a5e" />
      <rect x="-80" y="-40" width="5" height="40" fill="#a37a52" />
      <rect x="93" y="-40" width="5" height="40" fill="#a37a52" />
      <rect x="-90" y="-49" width="34" height="3" rx="1" fill="#8d97a8" />

      <Hot on={room} label="Monitor: os meus projetos" onPress={() => onOpen('projects')}>
        <rect x="-42" y="-112" width="94" height="60" rx="4" fill="#20243a" />
        <rect x="-38" y="-108" width="86" height="52" fill="#141a2b" />
        <g opacity={1 - night}>
          <CodeScreen running={active && night < 0.5} />
        </g>
        <image
          href={banner}
          x="-38"
          y="-108"
          width="86"
          height="52"
          preserveAspectRatio="xMidYMid slice"
          opacity={night}
          style={{ imageRendering: 'pixelated' }}
        />
        <rect x="-1" y="-52" width="12" height="6" fill="#20243a" />
      </Hot>

      <Hot
        on={room || office}
        label="Caneca de café"
        onPress={() => {
          setSteam((v) => v + 1)
          onNote(HOBBIES.mug)
        }}
      >
        <rect x="58" y="-60" width="12" height="14" rx="2" fill="#e2574c" />
        <path d="M70 -57 q6 0 6 4 t-6 4" stroke="#e2574c" strokeWidth="2.4" fill="none" />
        <rect x="54" y="-70" width="24" height="26" fill="transparent" />
        {steam > 0 && (
          <path key={steam} className="steam" d="M62 -64 q-3 -4 0 -8 t0 -8 M67 -64 q3 -4 0 -8 t0 -8" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        )}
      </Hot>

      <g opacity={night}>
        <Hot on={room} label="Livro: Engenharia Informática" onPress={() => onNote(HOBBIES.book)}>
          <rect x="78" y="-52" width="24" height="6" rx="1" fill="#5b8c5a" />
          <rect x="80" y="-57" width="20" height="5" rx="1" fill="#f1ead9" />
          <rect x="74" y="-62" width="32" height="18" fill="transparent" />
        </Hot>
        <RocketLeague on={room} onNote={onNote} />
      </g>
    </g>
  )
}
