import { useCallback, useEffect, useRef, useState } from 'react'
import { LINKS } from '../data.js'
import Character from './Character.jsx'
import { CAPTIONS, END, INTRO } from './content.js'
import Dialogs from './Dialogs.jsx'
import { F_FAR, F_MID, REDUCED } from './motion.js'
import Present from './Present.jsx'
import School from './School.jsx'
import { at, DAY_NIGHT, GROUND, locate, MARKS, skyAt, TOTAL, VIEW_H, X } from './track.js'
import { Boat, FarLayer, MidLayer, NearLayer, Train, Waves } from './World.jsx'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const fade = (u, from, to, edge = 0.14) => clamp(Math.min((u - from) / edge, (to - u) / edge))

// Para capturas e ligações diretas: ?u=7.5 fixa a posição, ?open=album abre uma janela.
const PARAMS = new URLSearchParams(location.search)
const FORCED = PARAMS.has('u') ? Number(PARAMS.get('u')) : null

const HNF_AT = at('secundario', 0.55)
const PF_AT = at('presente', 0.6)

// Onde o boneco é desenhado. No Tejo vai a pé até ao barco, atravessa com ele e sai do outro lado.
const DOCK_A = X.pier + 172
const DOCK_B = X.quay - 150
const DECK = 70 // onde o boneco fica no convés, a contar do meio do barco
function place(st) {
  let { x, pose } = st
  let lift = 0
  let boatX = st.x < X.pier + 1 ? DOCK_A : DOCK_B
  if (st.id === 'tejo') {
    boatX = lerp(DOCK_A, DOCK_B, clamp((st.t - 0.12) / 0.76))
    if (st.t < 0.12) {
      x = lerp(X.pier, DOCK_A + DECK, st.t / 0.12)
      pose = 'walk'
    } else if (st.t > 0.88) {
      x = lerp(DOCK_B + DECK, X.quay, (st.t - 0.88) / 0.12)
      pose = 'walk'
    } else {
      x = boatX + DECK
    }
    if (x > boatX - 143 && x < boatX + 146) lift = 17
  }
  if (pose === 'train') lift = 10
  return { x, pose, lift, boatX, trainX: clamp(st.x, X.station, X.felgueiras) }
}

function useViewport() {
  const [vp, setVp] = useState({ w: innerWidth, h: innerHeight })
  useEffect(() => {
    const on = () => setVp({ w: innerWidth, h: innerHeight })
    addEventListener('resize', on)
    return () => removeEventListener('resize', on)
  }, [])
  return vp
}

export default function Timeline() {
  const stage = useRef(null)
  const vp = useViewport()
  const [u, setU] = useState(FORCED ?? 0)
  const [maxU, setMaxU] = useState(FORCED ?? 0)
  const [open, setOpen] = useState(PARAMS.get('open'))
  const [note, setNote] = useState(null)
  const [fly, setFly] = useState(false)

  const go = useCallback((target) => {
    scrollTo({ top: target * stage.current.clientHeight, behavior: REDUCED ? 'auto' : 'smooth' })
  }, [])

  useEffect(() => {
    if (FORCED !== null) return
    let raf = 0
    const read = () => {
      raf = 0
      const v = clamp(scrollY / stage.current.clientHeight, 0, TOTAL)
      setU(v)
      setMaxU((m) => Math.max(m, v))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    addEventListener('scroll', on, { passive: true })
    if (location.hash === '#presente') {
      const h = new Date().getHours()
      scrollTo({ top: at('presente', DAY_NIGHT.presente[h >= 7 && h < 19 ? 0 : 1]) * stage.current.clientHeight })
    }
    read()
    return () => {
      removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  const say = useCallback((text) => setNote({ text, key: Date.now() }), [])
  useEffect(() => {
    if (!note) return
    const id = setTimeout(() => setNote(null), 4200)
    return () => clearTimeout(id)
  }, [note])

  const got = { hnf: maxU >= HNF_AT, pf: maxU >= PF_AT }
  const count = (got.hnf ? 1 : 0) + (got.pf ? 2 : 0)
  const st = locate(u)
  // A fotografia só voa para o baú quando se passa pela cena; num salto pelo caminho em miniatura não.
  const hadHnf = useRef(got.hnf)
  useEffect(() => {
    if (got.hnf && !hadHnf.current && st.id === 'secundario') setFly(true)
    hadHnf.current = got.hnf
  }, [got.hnf, st.id])
  const pl = place(st)
  const portrait = vp.w / vp.h < 0.8
  const sceneH = portrait ? vp.h * 0.56 : vp.h
  const W = (VIEW_H * vp.w) / sceneH
  const follow = pl.x + (portrait ? 0.06 : 0.12) * W
  const cam = lerp(follow, st.pinX, st.pin) - W / 2

  const sky = skyAt(st)
  const dark = sky[0] * 0.3 + sky[1] * 0.59 + sky[2] * 0.11 < 140
  const inPresent = st.id === 'presente'
  const isNight = st.night > 0.5
  const dayNight = DAY_NIGHT[st.id] // só nas cenas com dia e noite
  const introOp = st.id === 'intro' ? 1 - clamp((st.t - 0.3) / 0.25) : 0
  const endOp = st.id === 'fim' ? 1 : st.id === 'caminho' ? clamp((st.t - 0.6) / 0.3) : 0

  return (
    <div className="scroller" style={{ height: `calc(${TOTAL + 1} * 100svh)` }}>
      <div
        ref={stage}
        className={`stage ${portrait ? 'portrait' : ''} ${dark ? 'dark' : ''}`}
        style={{ background: `rgb(${sky.join(' ')})` }}
      >
        <svg
          className="scene"
          viewBox={`0 0 ${W} ${VIEW_H}`}
          style={{ height: sceneH }}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Ilustração do percurso do Francisco, do Barreiro ao Porto"
        >
          <defs>
            <clipPath id="above-ground">
              <rect x="0" y="0" width={W} height={GROUND + 5} />
            </clipPath>
            <clipPath id="train-window">
              <rect x="-26" y="-113" width="52" height="50" rx="6" />
            </clipPath>
          </defs>
          <g clipPath="url(#above-ground)">
            <g transform={`translate(${-cam * F_FAR} 0)`}>
              <FarLayer />
            </g>
            <g transform={`translate(${-cam * F_MID} 0)`}>
              <MidLayer />
            </g>
          </g>
          <g transform={`translate(${-cam} 0)`}>
            <NearLayer />
            {st.night > 0 && (
              <rect x={cam - 20} y="0" width={W + 40} height={VIEW_H} fill="#0b0f2a" opacity={st.night * 0.66 * (1 - st.dawn)} />
            )}
            <path
              d={`M10405 ${GROUND + 2} H13500`}
              className="path-ahead"
              strokeWidth="4"
              strokeDasharray="18 16"
              strokeLinecap="round"
            />
            {st.pin > 0 && st.pinX === X.schoolRoom && (
              <g transform={`translate(${X.schoolRoom} ${GROUND})`}>
                <School night={st.night} t={st.id === 'secundario' ? st.t : 0} active={st.id === 'secundario'} onOpen={setOpen} />
              </g>
            )}
            {st.pin > 0 && st.pinX === X.room && (
              <g transform={`translate(${X.room} ${GROUND})`}>
                <Present night={st.night} t={inPresent ? st.t : st.night} active={inPresent} onNote={say} onOpen={setOpen} />
              </g>
            )}
            <g transform={`translate(${pl.boatX} ${GROUND})`}>
              <Boat />
            </g>
            <g transform={`translate(${pl.trainX} ${GROUND})`}>
              <Train />
            </g>
            <g transform={`translate(${pl.x} ${GROUND - pl.lift})`}>
              <Character
                x={pl.x}
                pose={pl.pose}
                night={st.night}
                typing={pl.pose === 'sit' && !REDUCED}
                clip={pl.pose === 'train'}
              />
            </g>
            <Waves />
          </g>
        </svg>

        <div className="text-zone">
          <div className="intro" style={{ opacity: introOp, visibility: introOp ? 'visible' : 'hidden' }}>
            <h1>{INTRO.title}</h1>
            <p>{INTRO.text}</p>
            <span className="hint">{INTRO.hint} ↓</span>
          </div>
          {CAPTIONS.map((c) => {
            const op = fade(u, c.from, c.to)
            if (!op) return null
            return (
              <div key={c.from} className="caption" style={{ opacity: op, transform: `translateY(${(1 - op) * 10}px)` }} aria-hidden="true">
                <h2>{c.title}</h2>
                {c.text && <p>{c.text}</p>}
              </div>
            )
          })}
          {endOp > 0 && (
            <div className="caption end" style={{ opacity: endOp }}>
              <h2>{END.title}</h2>
              <p>{END.level()} · Francisco Nogueira</p>
              <div className="links">
                <a href={LINKS.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={LINKS.steam} target="_blank" rel="noreferrer">
                  Steam
                </a>
                <a href="/cv/">Versão curta</a>
              </div>
            </div>
          )}
          {note && (
            <div key={note.key} className="note" role="status">
              {note.text}
            </div>
          )}
        </div>

        <header className="hud">
          <span className="place">{st.place}</span>
          <span className="hud-right">
            {dayNight && (
              <button type="button" className="pill" onClick={() => go(at(st.id, dayNight[isNight ? 0 : 1]))}>
                {isNight ? 'Ver de dia' : 'Ver de noite'}
              </button>
            )}
            <button type="button" className={`pill chest-btn ${fly ? 'bump' : ''}`} onClick={() => setOpen('chest')} aria-label={`Baú: ${count} de 3 objetos`}>
              <svg viewBox="0 0 24 20" width="20" height="17" aria-hidden="true">
                <path d="M2 9 Q2 2 12 2 Q22 2 22 9 V18 H2 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M2 9 H22" stroke="currentColor" strokeWidth="2" />
                <rect x="10" y="7" width="4" height="5" rx="1" fill="currentColor" />
              </svg>
              {count}/3
            </button>
            <a className="pill" href="/cv/">
              Versão curta
            </a>
          </span>
        </header>

        <nav className="minimap" aria-label="Capítulos">
          <span className="line">
            <span className="done" style={{ width: `${(u / TOTAL) * 100}%` }} />
          </span>
          {MARKS.map((m) => (
            <button
              key={m.label}
              type="button"
              className={u >= m.u - 0.05 ? 'past' : ''}
              style={{ left: `${(m.u / TOTAL) * 100}%` }}
              onClick={() => go(m.u)}
              aria-label={`Ir para: ${m.label}`}
            >
              <span>{m.label}</span>
            </button>
          ))}
        </nav>

        {fly && <div className="fly-photo" onAnimationEnd={() => setFly(false)} />}
      </div>

      {/* O mesmo texto, por ordem, para leitores de ecrã */}
      <ol className="sr-only">
        <li>
          {INTRO.title}. {INTRO.text}
        </li>
        {CAPTIONS.map((c) => (
          <li key={c.from}>
            {c.title} {c.text}
          </li>
        ))}
        <li>{END.title}</li>
      </ol>

      <Dialogs open={open} got={got} onOpen={setOpen} onClose={() => setOpen(null)} />
    </div>
  )
}
