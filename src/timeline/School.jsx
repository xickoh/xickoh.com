// O secundário: de dia a sala de aula, de noite o quarto onde nasceu o Hunt n' Fight.
// Desenhado à volta do centro do compartimento (x = 0), com o chão em y = 0, como a cena do presente.
import Character from './Character.jsx'
import { Hot } from './Present.jsx'

const HALF = 250
const TOP = -270
const WALL = `M${-HALF} 0 V${TOP + 16} Q${-HALF} ${TOP} ${-HALF + 16} ${TOP} H${HALF - 16} Q${HALF} ${TOP} ${HALF} ${TOP + 16} V0 Z`

export default function School({ night, t, active, onOpen }) {
  const room = active && night > 0.85
  const dusk = 4 * night * (1 - night)
  const sunY = t < 0.6 ? -222 + Math.min(1, t / 0.45) * 62 : -222
  return (
    <g>
      <path d={WALL} fill="#eef2e4" />
      <path d={WALL} fill="#2d2a4c" opacity={night} />
      <rect x={-HALF} y="-9" width={HALF * 2} height="9" fill="rgba(0,0,0,0.12)" />

      {/* A janela */}
      <clipPath id="school-window">
        <rect x="-228" y="-236" width="92" height="86" rx="5" />
      </clipPath>
      <g clipPath="url(#school-window)">
        <rect x="-228" y="-236" width="92" height="86" fill="#bfe3f7" />
        <circle cx="-160" cy={sunY} r="12" fill="#ffd66b" />
        <rect x="-228" y="-236" width="92" height="86" fill="#f29a5c" opacity={dusk * 0.85} />
        <g opacity={night}>
          <rect x="-228" y="-236" width="92" height="86" fill="#0f1430" />
          <circle cx="-164" cy="-206" r="12" fill="#f6efc9" />
          <circle cx="-158" cy="-210" r="10" fill="#0f1430" />
          {[
            [-214, -222],
            [-196, -170],
            [-146, -164],
            [-204, -196],
            [-150, -228],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" className="twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </g>
      </g>
      <path d="M-182 -236 V-150" stroke={night > 0.5 ? '#2d2a4c' : '#eef2e4'} strokeWidth="5" />

      {/* Só de dia: a sala de aula */}
      <g opacity={1 - night} pointerEvents="none">
        <rect x="64" y="-240" width="170" height="92" rx="5" fill="#2f4a3f" />
        <rect x="64" y="-148" width="170" height="6" fill="#a98463" />
        <text x="76" y="-218" className="board">program Jogo;</text>
        <text x="76" y="-201" className="board">begin</text>
        <text x="76" y="-184" className="board">{"  writeln('Olá');"}</text>
        <text x="76" y="-167" className="board">end.</text>
        <circle cx="-88" cy="-212" r="14" fill="#fff" stroke="#2c3345" strokeWidth="2.5" />
        <path d="M-88 -212 V-221 M-88 -212 H-82" stroke="#2c3345" strokeWidth="2" strokeLinecap="round" />
        <g stroke="#4b5568" strokeLinecap="round" fill="none">
          <path d="M-215 -24 H-190" strokeWidth="6" />
          <path d="M-215 -24 V-62" strokeWidth="5" />
          <path d="M-212 -20 V0 M-192 -20 V0" strokeWidth="4" />
        </g>
        <rect x="-188" y="-46" width="92" height="6" rx="2" fill="#b98a5e" />
        <rect x="-183" y="-40" width="5" height="40" fill="#a37a52" />
        <rect x="-106" y="-40" width="5" height="40" fill="#a37a52" />
        <rect x="-150" y="-84" width="48" height="36" rx="4" fill="#e6dfcf" />
        <rect x="-146" y="-80" width="40" height="26" rx="2" fill="#1d2b2a" />
        <g transform="translate(-202 0)">
          <Character x={2700} pose="sit" look={{ shirt: '#c96f4a', hair: '#3a2a22', eye: '#232a3d', pack: false }} />
        </g>
      </g>

      {/* Só de noite: o quarto */}
      <g opacity={night} pointerEvents="none">
        <rect x="84" y="-236" width="58" height="78" rx="3" fill="#8c2f25" />
        <path d="M95 -222 H131 V-196 Q131 -176 113 -168 Q95 -176 95 -196 Z" fill="#ead9b0" />
        <path d="M95 -208 L131 -190 V-180 L95 -198 Z" fill="#c9a24b" />
        <rect x="158" y="-230" width="64" height="48" rx="3" fill="#3f8f8a" />
        <path d="M166 -190 L182 -214 L194 -200 L204 -210 L214 -190 Z" fill="#f6efc9" opacity="0.9" />
        <rect x="150" y="-136" width="84" height="5" rx="2" fill="#8d6b4a" />
        {['#c96f4a', '#e2c05a', '#5b8c5a', '#3d7ea6', '#8a4452'].map((c, i) => (
          <rect key={c} x={156 + i * 11} y={-164 + (i % 2) * 5} width="9" height={28 - (i % 2) * 5} fill={c} />
        ))}
        <rect x="-240" y="-66" width="8" height="66" rx="2" fill="#6e5238" />
        <rect x="-234" y="-26" width="124" height="18" fill="#8d6b4a" />
        <rect x="-234" y="-40" width="124" height="16" rx="5" fill="#e9e2d6" />
        <rect x="-230" y="-52" width="34" height="14" rx="6" fill="#fff" />
        <rect x="-192" y="-44" width="82" height="22" rx="5" fill="#5b7fb0" />
        <rect x="-116" y="-8" width="6" height="8" fill="#6e5238" />
      </g>

      {/* A secretária e o computador, iguais nos dois */}
      <ellipse cx="30" cy="-72" rx="62" ry="46" fill="#ffd9a0" opacity={night * 0.14} />
      <g transform="translate(-70 0)" stroke={night > 0.5 ? '#6b7391' : '#4b5568'} strokeLinecap="round" fill="none">
        <path d="M-13 -24 H12" strokeWidth="6" />
        <path d="M-13 -24 V-62" strokeWidth="5" />
        <path d="M-10 -20 V0 M10 -20 V0" strokeWidth="4" />
      </g>
      <rect x="-56" y="-46" width="150" height="6" rx="2" fill="#b98a5e" />
      <rect x="-50" y="-40" width="5" height="40" fill="#a37a52" />
      <rect x="83" y="-40" width="5" height="40" fill="#a37a52" />
      <rect x="-60" y="-49" width="34" height="3" rx="1" fill="#cfc7b6" />
      <rect x="64" y="-78" width="20" height="32" rx="2" fill="#d8d0bf" />
      <circle cx="74" cy="-54" r="2" fill="#7dfc9a" />
      <Hot on={room} label="Computador: ver o Hunt n' Fight" onPress={() => onOpen('crt')}>
        <rect x="-8" y="-98" width="66" height="48" rx="6" fill="#e6dfcf" />
        <rect x="-3" y="-93" width="56" height="35" rx="3" fill="#1d2b2a" />
        <g opacity={1 - night}>
          <rect x="2" y="-87" width="22" height="2" fill="#7dfc9a" />
          <rect x="6" y="-82" width="30" height="2" fill="#7dfc9a" />
          <rect x="6" y="-77" width="18" height="2" fill="#7dfc9a" />
          <rect x="2" y="-72" width="10" height="2" fill="#7dfc9a" />
          <rect x="2" y="-66" width="5" height="2" fill="#7dfc9a" className="blink" />
        </g>
        <g opacity={night}>
          <rect x="-3" y="-93" width="56" height="35" rx="3" fill="#5a4030" />
          <rect x="13" y="-88" width="36" height="25" fill="#ead9b0" />
          <rect x="1" y="-88" width="9" height="4" fill="#8c2f25" />
          <rect x="1" y="-81" width="9" height="4" fill="#7a5a40" />
          <rect x="1" y="-74" width="9" height="4" fill="#7a5a40" />
          <rect x="18" y="-83" width="8" height="8" fill="#7a8a70" />
          <rect x="29" y="-83" width="8" height="8" fill="#c98a4a" />
          <rect x="40" y="-83" width="6" height="8" fill="#6a6a6a" />
        </g>
        <rect x="15" y="-50" width="20" height="4" fill="#cfc7b6" />
      </Hot>
    </g>
  )
}
