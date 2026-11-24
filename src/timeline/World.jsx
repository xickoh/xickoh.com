// O cenário fixo, em três camadas com paralaxe. Nada aqui depende do scroll: só a câmara mexe.
import { memo } from 'react'
import Character from './Character.jsx'
import { F_FAR, F_MID } from './motion.js'
import { GROUND as G, X } from './track.js'


// Converte uma posição do mundo na posição dentro de uma camada mais lenta.
const far = (x) => 500 + F_FAR * (x - 500)
const mid = (x) => 500 + F_MID * (x - 500)

// Números pseudoaleatórios estáveis, para as filas de casas e árvores.
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

const Cloud = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.85">
    <ellipse cx="0" cy="0" rx="34" ry="13" />
    <ellipse cx="-20" cy="5" rx="24" ry="10" />
    <ellipse cx="24" cy="6" rx="26" ry="10" />
  </g>
)

function houses(x0, x1, seed, { colors, roofs, minH, maxH, minW, maxW, gap = 6 }) {
  const r = rng(seed)
  const out = []
  let x = x0
  while (x < x1) {
    const w = minW + r() * (maxW - minW)
    const h = minH + r() * (maxH - minH)
    const c = colors[Math.floor(r() * colors.length)]
    const roof = roofs[Math.floor(r() * roofs.length)]
    const cols = Math.max(1, Math.floor(w / 26))
    const rows = Math.max(1, Math.floor(h / 34))
    out.push(
      <g key={x} transform={`translate(${x} ${G - h})`}>
        <rect width={w} height={h} fill={c} />
        <path d={`M-4 0 L${w / 2} ${-14 - r() * 10} L${w + 4} 0 Z`} fill={roof} />
        {Array.from({ length: rows * cols }, (_, i) => (
          <rect
            key={i}
            x={(w / cols) * (i % cols) + w / cols / 2 - 5}
            y={12 + Math.floor(i / cols) * 32}
            width="10"
            height="15"
            rx="1"
            fill="#fff"
            opacity="0.55"
          />
        ))}
      </g>,
    )
    x += w + gap * r()
  }
  return out
}

function trees(x0, x1, seed, step = 70) {
  const r = rng(seed)
  const out = []
  for (let x = x0; x < x1; x += step * (0.6 + r() * 0.9)) {
    const h = 46 + r() * 40
    out.push(
      <g key={x} transform={`translate(${x} ${G})`}>
        <rect x="-3" y={-h * 0.5} width="6" height={h * 0.5} fill="#7a5c43" />
        <ellipse cx="0" cy={-h * 0.72} rx={h * 0.3} ry={h * 0.36} fill={r() > 0.5 ? '#6fa56a' : '#86b877'} />
      </g>,
    )
  }
  return out
}

export const FarLayer = memo(function FarLayer() {
  const r = rng(7)
  const clouds = []
  for (let x = -300; x < 3600; x += 190 + r() * 160) {
    clouds.push(<Cloud key={x} x={x} y={50 + r() * 150} s={0.7 + r() * 0.7} />)
  }
  const bx = far(3500)
  const px = far(8950)
  return (
    <g>
      {clouds}
      {/* Tejo e a outra margem */}
      <rect x={far(-2500)} y={G - 84} width={far(5000) - far(-2500)} height="90" fill="#9cc7de" />
      <path
        d={`M${far(-2500)} ${G - 84} h${far(5000) - far(-2500)} v-7 q-80 -16 -160 -2 t-170 -2 t-190 2 t-200 -4 t-210 3 t-200 -2 t-250 4 v8 Z`}
        fill="#bccdb6"
      />
      {/* Ponte 25 de Abril */}
      <g transform={`translate(${bx} ${G - 84})`} stroke="#c2553f" fill="none" strokeLinecap="round">
        <path d="M-170 -22 H170" strokeWidth="3" />
        <path d="M-70 0 V-78 M70 0 V-78" strokeWidth="5" />
        <path d="M-170 -22 Q-120 -30 -70 -76 Q0 -8 70 -76 Q120 -30 170 -22" strokeWidth="1.6" />
      </g>
      {/* Colinas do norte */}
      <g>
        <ellipse cx={far(7000)} cy={G + 20} rx="330" ry="140" fill="#bcd9b0" />
        <ellipse cx={far(7900)} cy={G + 30} rx="380" ry="180" fill="#a9cc9d" />
        <ellipse cx={far(8700)} cy={G + 20} rx="300" ry="120" fill="#bcd9b0" />
      </g>
      {/* Ponte D. Luís I */}
      <g transform={`translate(${px} ${G})`} stroke="#8a93a0" fill="none">
        <path d="M-150 -96 H150 M-150 -22 H150" strokeWidth="4" />
        <path d="M-120 -22 Q0 -150 120 -22" strokeWidth="5" />
        <path d="M-90 -96 V-50 M-60 -96 V-72 M-30 -96 V-84 M30 -96 V-84 M60 -96 V-72 M90 -96 V-50" strokeWidth="2" />
        <path d="M-150 0 V-96 M150 0 V-96" strokeWidth="8" stroke="#a7aeb8" />
      </g>
    </g>
  )
})

export const MidLayer = memo(function MidLayer() {
  const barreiro = {
    colors: ['#f6efe4', '#f2dcc6', '#e9e2d6', '#f4d9b8', '#dfe7ea'],
    roofs: ['#c96f4a', '#b8613f', '#d08258'],
    minH: 60,
    maxH: 120,
    minW: 56,
    maxW: 110,
  }
  const lisboa = {
    colors: ['#f3d27a', '#f0b9a0', '#f7ecd6', '#b9d3df', '#f2c98d', '#e9a6a0'],
    roofs: ['#c2603c', '#b3552f'],
    minH: 110,
    maxH: 200,
    minW: 60,
    maxW: 100,
    gap: 2,
  }
  const porto = {
    colors: ['#d9b44a', '#c96a52', '#e8e2d2', '#5d86a8', '#b9c7b0', '#e2a66a'],
    roofs: ['#a8583c', '#8c4a35'],
    minH: 130,
    maxH: 220,
    minW: 40,
    maxW: 62,
    gap: 1,
  }
  const mill = mid(1050)
  const chim = mid(1420)
  const castle = mid(5150)
  const tower = mid(9420)
  return (
    <g>
      {houses(mid(40), mid(940), 3, barreiro)}
      {houses(mid(1560), mid(2880), 11, barreiro)}
      {/* Moinho de Alburrica */}
      <g transform={`translate(${mill} ${G})`}>
        <path d="M-20 0 L-14 -74 H14 L20 0 Z" fill="#f7f4ee" />
        <path d="M-17 -74 L0 -98 L17 -74 Z" fill="#b8613f" />
        <rect x="-5" y="-22" width="10" height="22" rx="5" fill="#8fa9b8" />
        <g className="spin" style={{ transformOrigin: '0px -76px' }}>
          <path d="M0 -76 L46 -80 L46 -70 Z M0 -76 L-46 -72 L-46 -82 Z M0 -76 L4 -122 L-6 -122 Z M0 -76 L-4 -30 L6 -30 Z" fill="#e4dccb" />
        </g>
      </g>
      {/* Chaminés da zona industrial */}
      <g transform={`translate(${chim} ${G})`} fill="#c98b6b">
        <path d="M-9 0 L-5 -170 H5 L9 0 Z" />
        <path d="M34 0 L37 -130 H45 L48 0 Z" fill="#b97b5d" />
        <rect x="-7" y="-160" width="14" height="6" fill="#f3ece2" />
      </g>
      {/* Lisboa: a colina do castelo e as casas */}
      <ellipse cx={castle} cy={G} rx="330" ry="250" fill="#e2cfa4" />
      <g transform={`translate(${castle} ${G - 250})`} fill="#c9b386">
        <path d="M-80 12 V-18 h12 v8 h12 v-8 h12 v8 h12 v-8 h12 v8 h12 v-8 h12 v8 h12 v-8 h12 v8 h12 v-8 h12 V12 Z" />
        <rect x="-96" y="-34" width="22" height="48" />
        <rect x="76" y="-40" width="22" height="54" />
      </g>
      {houses(mid(4330), mid(6420), 23, lisboa)}
      {/* A caminho do norte */}
      {trees(mid(6650), mid(7750), 5, 60)}
      {houses(mid(7820), mid(7960), 31, barreiro)}
      {trees(mid(8000), mid(8880), 9, 90)}
      {/* Porto: casas estreitas e a Torre dos Clérigos */}
      <g transform={`translate(${tower} ${G})`}>
        <rect x="-15" y="-270" width="30" height="270" fill="#b5ada0" />
        <rect x="-11" y="-318" width="22" height="50" fill="#a9a195" />
        <path d="M-11 -318 Q0 -352 11 -318 Z" fill="#8f887d" />
        <rect x="-1.5" y="-362" width="3" height="22" fill="#8f887d" />
        <rect x="-5" y="-250" width="10" height="20" rx="5" fill="#7d776d" />
        <rect x="-5" y="-190" width="10" height="20" rx="5" fill="#7d776d" />
        <circle cx="0" cy="-292" r="6" fill="#f3efe6" />
      </g>
      {houses(mid(8960), mid(9330), 41, porto)}
      {houses(mid(9500), mid(10480), 43, porto)}
    </g>
  )
})

const Sign = ({ x, label }) => {
  const w = label.length * 8.4 + 22
  return (
    <g transform={`translate(${x} ${G})`}>
      <rect x="-2.5" y="-74" width="5" height="74" fill="#6b7280" />
      <rect x={-w / 2} y="-98" width={w} height="28" rx="5" fill="#fff" stroke="#2c3345" strokeWidth="2.5" />
      <text x="0" y="-79" textAnchor="middle" className="sign">
        {label}
      </text>
    </g>
  )
}

// Um interior em corte: parede, rodapé e o que estiver lá dentro.
const Room = ({ x, w, h = 250, wall, trim = 'rgba(0,0,0,0.08)', children }) => (
  <g transform={`translate(${x} ${G})`}>
    <path d={`M0 0 V${-h + 14} Q0 ${-h} 14 ${-h} H${w - 14} Q${w} ${-h} ${w} ${-h + 14} V0 Z`} fill={wall} />
    <rect x="0" y="-9" width={w} height="9" fill={trim} />
    {children}
  </g>
)

const Desk = ({ x, w = 112, color = '#b98a5e' }) => (
  <g transform={`translate(${x} ${G})`}>
    <rect x="0" y="-46" width={w} height="6" rx="2" fill={color} />
    <rect x="6" y="-40" width="5" height="40" fill={color} opacity="0.8" />
    <rect x={w - 11} y="-40" width="5" height="40" fill={color} opacity="0.8" />
  </g>
)

const Chair = ({ x, color = '#4b5568' }) => (
  <g transform={`translate(${x} ${G})`} stroke={color} strokeLinecap="round" fill="none">
    <path d="M-13 -24 H12" strokeWidth="6" />
    <path d="M-13 -24 V-62" strokeWidth="5" />
    <path d="M-10 -20 V0 M10 -20 V0" strokeWidth="4" />
  </g>
)

const Laptop = ({ x, color = '#8d97a8' }) => (
  <g transform={`translate(${x} ${G - 46})`} stroke={color} strokeLinecap="round" fill="none">
    <path d="M0 -1.5 H24" strokeWidth="3.4" />
    <path d="M24 -2 L32 -24" strokeWidth="3.4" />
  </g>
)

const Plant = ({ x }) => (
  <g transform={`translate(${x} ${G})`}>
    <path d="M0 -22 Q-16 -44 -8 -62 Q0 -44 0 -22 Q6 -50 20 -56 Q14 -34 0 -22" fill="#5f9a62" />
    <path d="M-9 0 L-11 -22 H11 L9 0 Z" fill="#c9773f" />
  </g>
)

const Ground = ({ x0, x1, color, line }) => (
  <g>
    <rect x={x0} y={G} width={x1 - x0} height="140" fill={color} />
    <rect x={x0} y={G} width={x1 - x0} height="5" fill={line} />
  </g>
)

export const NearLayer = memo(function NearLayer() {
  const sleepers = []
  for (let x = X.station - 90; x < X.felgueiras + 196; x += 22) {
    sleepers.push(<rect key={x} x={x} y={G + 4} width="9" height="5" fill="#8a6f55" />)
  }
  return (
    <g>
      <Ground x0={-3000} x1={2940} color="#dccfb8" line="#c9b99d" />
      <Ground x0={X.quay + 86} x1={X.station - 100} color="#e9dcc4" line="#d3c2a3" />
      <Ground x0={X.station - 100} x1={X.felgueiras + 210} color="#cbbda3" line="#b7a88c" />
      <Ground x0={X.felgueiras + 210} x1={X.porto} color="#9fc38b" line="#86b072" />
      <Ground x0={X.porto} x1={10420} color="#cbc6be" line="#b4aea5" />

      {/* Barreiro: a casa */}
      <Room x={150} w={330} h={205} wall="#f4e3c8">
        <rect x="205" y="-160" width="76" height="70" rx="4" fill="#bfe3f7" />
        <path d="M243 -160 V-90 M205 -125 H281" stroke="#f4e3c8" strokeWidth="5" />
        <rect x="44" y="-166" width="46" height="36" rx="3" fill="#e8b796" opacity="0.7" />
        <ellipse cx="150" cy="-2" rx="92" ry="7" fill="#e79a8c" />
        <circle cx="218" cy="-12" r="9" fill="#5b9bd5" />
        <rect x="68" y="-18" width="16" height="16" rx="2" fill="#f1c95b" />
        <rect x="80" y="-32" width="16" height="16" rx="2" fill="#7ab87a" />
      </Room>
      <Sign x={600} label="Barreiro" />

      {/* O primeiro computador: jogar com os amigos à volta dele */}
      <Room x={X.games - 170} w={380} h={225} wall="#f1dfc4">
        <rect x="24" y="-186" width="70" height="60" rx="4" fill="#bfe3f7" />
        <path d="M59 -186 V-126" stroke="#f1dfc4" strokeWidth="5" />
        <rect x="130" y="-190" width="50" height="38" rx="3" fill="#7ab87a" opacity="0.75" />
      </Room>
      {[
        [-96, '#8fb7d8'],
        [-52, '#e79a8c'],
      ].map(([dx, c]) => (
        <ellipse key={dx} cx={X.games + dx} cy={G - 11} rx="19" ry="13" fill={c} />
      ))}
      <g transform={`translate(${X.games - 96} ${G})`}>
        <Character x={1240} pose="rest" look={{ shirt: '#5b8c5a', hair: '#3a2a22', eye: '#232a3d', skin: '#c99670' }} />
      </g>
      <g transform={`translate(${X.games - 52} ${G})`}>
        <Character x={1090} pose="rest" look={{ shirt: '#8a6fb0', hair: '#7a3f25', eye: '#232a3d' }} />
      </g>
      <Chair x={X.games} />
      <Desk x={X.games + 14} w={122} />
      <g transform={`translate(${X.games + 62} ${G - 46})`}>
        <rect x="0" y="-48" width="60" height="44" rx="5" fill="#e6dfcf" />
        <rect x="5" y="-43" width="50" height="32" rx="3" fill="#8fd0f0" />
        <rect x="5" y="-20" width="50" height="9" fill="#6fb36a" />
        <rect x="14" y="-28" width="7" height="8" fill="#e2574c" />
        <rect x="32" y="-34" width="7" height="7" fill="#f1c95b" />
        <rect x="41" y="-34" width="7" height="7" fill="#f1c95b" />
        <rect x="16" y="-4" width="28" height="4" fill="#cfc7b6" />
        <rect x="-34" y="-3" width="28" height="3" rx="1" fill="#cfc7b6" />
        <rect x="64" y="-30" width="20" height="30" rx="2" fill="#d8d0bf" />
        <circle cx="74" cy="-8" r="2" fill="#7dfc9a" />
      </g>

      {/* O quarto com o primeiro computador */}
      <Room x={X.pc - 110} w={330} h={240} wall="#cfdcea">
        <rect x="30" y="-190" width="54" height="72" rx="3" fill="#e2574c" opacity="0.75" />
        <path d="M40 -140 L57 -172 L74 -140 Z" fill="#fff" opacity="0.8" />
        <rect x="230" y="-180" width="70" height="64" rx="4" fill="#bfe3f7" />
        <path d="M265 -180 V-116" stroke="#cfdcea" strokeWidth="5" />
      </Room>
      <Chair x={X.pc} />
      <Desk x={X.pc + 14} w={122} />
      <g transform={`translate(${X.pc + 62} ${G - 46})`}>
        <rect x="0" y="-44" width="56" height="40" rx="5" fill="#e6dfcf" />
        <rect x="5" y="-39" width="46" height="28" rx="3" fill="#1d2b2a" />
        <text x="9" y="-27" className="crt">
          Olá, mundo
        </text>
        <rect x="9" y="-22" width="5" height="1.6" fill="#7dfc9a" className="blink" />
        <rect x="14" y="-4" width="28" height="4" fill="#cfc7b6" />
        <rect x="-34" y="-3" width="28" height="3" rx="1" fill="#cfc7b6" />
      </g>

      {/* A escola */}
      <g transform={`translate(2260 ${G})`}>
        <rect x="0" y="-190" width="420" height="190" fill="#f1ead9" />
        <rect x="-8" y="-200" width="436" height="14" fill="#c96f4a" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={24 + (i % 6) * 66} y={-162 + Math.floor(i / 6) * 62} width="40" height="38" rx="2" fill="#a9cfe3" />
        ))}
        <rect x="186" y="-56" width="48" height="56" fill="#8c6a4f" />
        <rect x="150" y="-88" width="120" height="22" rx="3" fill="#2c3345" />
        <text x="210" y="-72" textAnchor="middle" className="sign light">
          ESCOLA
        </text>
        <rect x="446" y="-150" width="4" height="150" fill="#6b7280" />
        <path d="M450 -150 h40 v12 h-40 Z" fill="#3f8f5a" />
        <path d="M450 -138 h40 v12 h-40 Z" fill="#d2493f" />
      </g>

      {/* O cais e o Tejo */}
      <g transform={`translate(2940 ${G})`}>
        <rect x="0" y="0" width="86" height="8" fill="#a98463" />
        <rect x="10" y="8" width="7" height="60" fill="#8a6a4d" />
        <rect x="64" y="8" width="7" height="60" fill="#8a6a4d" />
        <rect x="18" y="-58" width="4" height="58" fill="#6b7280" />
        <rect x="-6" y="-80" width="52" height="24" rx="4" fill="#2c3345" />
        <text x="20" y="-63" textAnchor="middle" className="sign light small">
          Barcos
        </text>
      </g>
      <rect x="2940" y={G + 8} width={X.quay + 86 - 2940} height="140" fill="#6fa8c7" />
      <g transform={`translate(${X.quay} ${G})`}>
        <rect x="0" y="0" width="86" height="8" fill="#bfb199" />
        <rect x="14" y="8" width="8" height="60" fill="#a39680" />
        <rect x="62" y="8" width="8" height="60" fill="#a39680" />
      </g>

      {/* Lisboa */}
      <Sign x={X.quay + 130} label="Lisboa" />
      <g transform={`translate(${X.quay + 240} ${G})`}>
        <path d="M30 -78 V-104 M24 -104 H60" stroke="#4b5568" strokeWidth="2" fill="none" />
        <rect x="0" y="-78" width="118" height="62" rx="9" fill="#f2c230" />
        <rect x="0" y="-34" width="118" height="18" rx="4" fill="#f6f1e4" />
        {[10, 37, 64, 91].map((wx) => (
          <rect key={wx} x={wx} y="-68" width="20" height="26" rx="3" fill="#bfe3f7" />
        ))}
        <circle cx="26" cy="-9" r="9" fill="#3a4152" />
        <circle cx="92" cy="-9" r="9" fill="#3a4152" />
      </g>

      {/* FixeAds */}
      <Room x={X.fixeads - 130} w={370} h={250} wall="#f3f5f7">
        <rect x="30" y="-212" width="126" height="34" rx="6" fill="#2c3345" />
        <text x="93" y="-189" textAnchor="middle" className="sign light">
          FixeAds
        </text>
        <rect x="236" y="-200" width="100" height="74" rx="4" fill="#bfe3f7" />
        <path d="M286 -200 V-126" stroke="#f3f5f7" strokeWidth="5" />
      </Room>
      <Plant x={X.fixeads - 96} />
      <Chair x={X.fixeads} />
      <Desk x={X.fixeads + 14} w={150} color="#d8dde4" />
      <Laptop x={X.fixeads + 30} />
      <g transform={`translate(${X.fixeads + 44} ${G - 80})`} className="tags">
        <text x="0" y="0">{'<div>'}</text>
        <text x="16" y="0">{'</a>'}</text>
        <text x="-6" y="0">{'<?php'}</text>
      </g>
      <rect x={X.fixeads + 120} y={G - 60} width="30" height="14" rx="2" fill="#aab3c0" />

      {/* Lusófona */}
      <Room x={X.lusofona - 130} w={370} h={250} wall="#ece4d3">
        <rect x="150" y="-210" width="190" height="100" rx="5" fill="#2f4a3f" />
        <rect x="150" y="-110" width="190" height="6" fill="#a98463" />
        <text x="164" y="-186" className="board">$ ssh servidor</text>
        <text x="164" y="-168" className="board">$ git push</text>
        <text x="164" y="-150" className="board">$ deploy --ok</text>
        <text x="60" y="-196" textAnchor="middle" className="sign small" opacity="0.6">
          Lusófona
        </text>
      </Room>
      <Chair x={X.lusofona} />
      <Desk x={X.lusofona + 14} w={100} />
      <Laptop x={X.lusofona + 30} />

      {/* O quarto do Hunt n' Fight */}
      <Room x={X.hnf - 130} w={370} h={250} wall="#2e3350" trim="rgba(0,0,0,0.25)">
        <rect x="40" y="-200" width="80" height="74" rx="4" fill="#161b33" />
        <circle cx="96" cy="-174" r="12" fill="#f6efc9" />
        <circle cx="60" cy="-150" r="1.4" fill="#fff" />
        <circle cx="74" cy="-184" r="1.2" fill="#fff" />
      </Room>
      <Chair x={X.hnf} color="#6b7391" />
      <Desk x={X.hnf + 14} w={130} color="#8d6b4a" />
      <g transform={`translate(${X.hnf + 62} ${G - 46})`}>
        <rect x="0" y="-52" width="66" height="44" rx="3" fill="#20243a" />
        <rect x="3" y="-49" width="60" height="38" fill="#5a4030" />
        <rect x="16" y="-44" width="42" height="28" fill="#ead9b0" />
        <rect x="6" y="-44" width="8" height="5" fill="#8c2f25" />
        <rect x="6" y="-36" width="8" height="5" fill="#7a5a40" />
        <rect x="6" y="-28" width="8" height="5" fill="#7a5a40" />
        <rect x="28" y="-8" width="10" height="8" fill="#20243a" />
        <rect x="-36" y="-3" width="28" height="3" rx="1" fill="#555d7a" />
      </g>

      {/* A estação e a linha */}
      <g transform={`translate(${X.station - 100} ${G})`}>
        <rect x="6" y="-110" width="5" height="110" fill="#6b7280" />
        <rect x="84" y="-110" width="5" height="110" fill="#6b7280" />
        <path d="M-10 -110 H106 L96 -124 H0 Z" fill="#c96f4a" />
        <circle cx="48" cy="-84" r="13" fill="#fff" stroke="#2c3345" strokeWidth="2.5" />
        <path d="M48 -84 V-92 M48 -84 H54" stroke="#2c3345" strokeWidth="2" strokeLinecap="round" />
      </g>
      {sleepers}
      <rect x={X.station - 100} y={G + 1} width={X.felgueiras + 300 - X.station} height="3" fill="#5c6474" />
      <path d={`M${X.felgueiras + 200} ${G + 2} v-16 h8 v16`} fill="#d2493f" />

      {/* Felgueiras e a ESTG */}
      <Sign x={X.felgueiras + 262} label="Felgueiras" />
      <g transform={`translate(${X.felgueiras + 340} ${G})`}>
        <rect x="0" y="-170" width="330" height="170" fill="#eef0ee" />
        <rect x="0" y="-170" width="330" height="26" fill="#2f6f8f" />
        <text x="165" y="-151" textAnchor="middle" className="sign light">
          ESTG · P.PORTO
        </text>
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={18 + i * 62} y="-126" width="46" height="60" fill="#a9cfe3" />
        ))}
        <rect x="140" y="-52" width="50" height="52" fill="#3c4f6b" />
      </g>
      <Room x={X.estg - 130} w={370} h={250} wall="#f0e7d8">
        {[0, 1, 2].map((row) => (
          <g key={row} transform={`translate(20 ${-214 + row * 48})`}>
            <rect x="0" y="38" width="130" height="5" fill="#a98463" />
            {['#c96f4a', '#3d7ea6', '#5b8c5a', '#e2c05a', '#8a4452', '#3d7ea6', '#c9773f', '#5b8c5a', '#2f4858'].map(
              (c, i) => (
                <rect key={i} x={6 + i * 13} y={8 + ((i * 7 + row * 3) % 8)} width="10" height={30 - ((i * 7 + row * 3) % 8)} fill={c} />
              ),
            )}
          </g>
        ))}
        <rect x="246" y="-200" width="90" height="74" rx="4" fill="#bfe3f7" />
      </Room>
      <Chair x={X.estg} />
      <Desk x={X.estg + 14} w={130} />
      <Laptop x={X.estg + 30} />
      <rect x={X.estg + 96} y={G - 56} width="30" height="5" fill="#3d7ea6" />
      <rect x={X.estg + 98} y={G - 51} width="28" height="5" fill="#c96f4a" />

      {/* Porto */}
      <Sign x={X.porto + 130} label="Porto" />
      <Plant x={9700} />

    </g>
  )
})

// O cacilheiro: leva o boneco do Barreiro a Lisboa.
export const Boat = () => (
  <g transform="scale(1.7)">
    <rect x="-66" y="-50" width="62" height="40" rx="5" fill="#f6f1e4" />
    {[-58, -40, -22].map((x) => (
      <rect key={x} x={x} y="-42" width="12" height="13" rx="2" fill="#9cc7de" />
    ))}
    <rect x="-50" y="-68" width="12" height="20" fill="#e2733c" />
    <path d="M-84 -10 H86 L68 16 H-72 Z" fill="#f6f1e4" />
    <path d="M-83 -7 H84 L80 0 H-80 Z" fill="#e2733c" />
    <path d="M44 -10 V-28 M64 -10 V-28 M84 -10 V-28 M0 -28 H86" stroke="#6b7280" strokeWidth="2" fill="none" />
  </g>
)

export const Waves = () => (
  <g className="waves">
    <rect x="3026" y={G + 8} width={X.quay - 3026} height="24" fill="#6fa8c7" />
    <path
      d={`M2994 ${G + 9} ${Array.from({ length: 40 }, () => 'q8 -5 16 0 t16 0').join(' ')}`}
      stroke="#cfe6f2"
      strokeWidth="2.5"
      fill="none"
    />
  </g>
)

// O comboio para norte. A janela do meio é a do boneco.
export const Train = () => (
  <g>
    {[-182, 68].map((cx) => (
      <g key={cx} transform={`translate(${cx} 0)`}>
        <rect x="-120" y="-140" width="240" height="130" rx="14" fill="#f1ece0" />
        <rect x="-120" y="-62" width="240" height="16" fill="#3f8f5a" />
        <rect x="-120" y="-24" width="240" height="14" rx="6" fill="#5c6474" />
        {[-96, -28, 40].map((wx) => (
          <rect key={wx} x={wx} y="-124" width="56" height="52" rx="6" fill="#2f3b52" />
        ))}
        <circle cx="-78" cy="-8" r="10" fill="#3a4152" />
        <circle cx="78" cy="-8" r="10" fill="#3a4152" />
      </g>
    ))}
    <rect x="-64" y="-70" width="14" height="8" fill="#5c6474" />
  </g>
)
