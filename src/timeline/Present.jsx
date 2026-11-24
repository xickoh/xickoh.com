// A cena do presente: a mesma secretária de dia (Porto Editora) e de noite (em casa).
// Desenhada à volta do centro do compartimento (x = 0), com o chão em y = 0.
import { useEffect, useRef, useState } from 'react'
import banner from '../assets/banner.png'
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
function Hot({ on, label, onPress, children, className = '', ...rest }) {
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

// A bola fica entre a picareta e o baú, para nunca parar à frente de nenhum dos dois.
const BALL_MIN = -188
const BALL_MAX = 136

function Ball({ on, onNote }) {
  const ref = useRef(null)
  const s = useRef({ x: 118, y: -11, vx: 0, vy: 0, rot: 0, raf: 0, last: 0 })
  const R = 11

  const draw = () => {
    const b = s.current
    ref.current?.setAttribute('transform', `translate(${b.x} ${b.y}) rotate(${b.rot})`)
  }

  const step = (now) => {
    const b = s.current
    const dt = Math.min(0.032, (now - b.last) / 1000)
    b.last = now
    b.vy += 1100 * dt
    b.x += b.vx * dt
    b.y += b.vy * dt
    b.rot += b.vx * dt * 4
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
    if (b.vy === 0 && b.y >= -R && Math.abs(b.vx) < 6) {
      b.raf = 0
      return
    }
    b.raf = requestAnimationFrame(step)
  }

  useEffect(() => {
    draw()
    const b = s.current
    return () => cancelAnimationFrame(b.raf)
  }, [])

  const kick = () => {
    const b = s.current
    const dir = b.x > 60 ? -1 : b.x < -60 ? 1 : Math.random() > 0.5 ? 1 : -1
    b.vx = dir * (220 + Math.random() * 260)
    b.vy = -(420 + Math.random() * 260)
    onNote(HOBBIES.ball)
    if (REDUCED) return
    if (!b.raf) {
      b.last = performance.now()
      b.raf = requestAnimationFrame(step)
    }
  }

  return (
    <Hot on={on} label="Bola: Rocket League" onPress={kick}>
      <g ref={ref}>
        <circle r={R} fill="#e3e8ee" />
        <path d="M0 -5 L4.8 -1.5 L3 4 H-3 L-4.8 -1.5 Z" fill="#5d6b82" />
        <path d="M0 -5 V-11 M4.8 -1.5 L10.4 -3.4 M3 4 L6.4 9 M-3 4 L-6.4 9 M-4.8 -1.5 L-10.4 -3.4" stroke="#5d6b82" strokeWidth="1.5" />
        <circle r={R} fill="none" stroke="#5d6b82" strokeWidth="1.5" />
      </g>
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
        <rect x="-112" y="-302" width="64" height="82" rx="3" fill="#3f8f8a" />
        <path d="M-104 -232 L-88 -262 L-76 -244 L-66 -256 L-56 -232 Z" fill="#f6efc9" opacity="0.9" />
        <circle cx="-64" cy="-284" r="6" fill="#f6efc9" />
        <rect x="-240" y="-196" width="92" height="6" rx="2" fill="#8d6b4a" />
        {['#c96f4a', '#e2c05a', '#5b8c5a', '#3d7ea6'].map((c, i) => (
          <rect key={c} x={-236 + i * 11} y={-226 + (i % 2) * 5} width="9" height={30 - (i % 2) * 5} fill={c} />
        ))}
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
        <Ball on={room} onNote={onNote} />
      </g>
    </g>
  )
}
