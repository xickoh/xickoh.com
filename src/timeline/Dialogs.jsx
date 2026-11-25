// As janelas que os objetos abrem: baú, álbum do Hunt n' Fight, projetos e competências.
import { useEffect, useRef, useState } from 'react'
import banner from '../assets/banner.png'
import photo from '../assets/eu.jpg'
import { getAge, LINKS, PROJECTS, SKILLS } from '../data.js'
import { ALBUM, CRT_PHOTOS, SKILL_SINCE } from './content.js'

const PHOTOS = Object.entries(
  import.meta.glob('../assets/hnf/*.jpg', { eager: true, query: '?url', import: 'default' }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)

function Modal({ title, className = '', onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d.open) d.showModal()
  }, [])
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="modal-body">
        <header>
          <h2>{title}</h2>
          <button type="button" className="close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}

function Album({ onClose }) {
  const [page, setPage] = useState(0)
  const [zoom, setZoom] = useState(null)
  const pages = Math.ceil(PHOTOS.length / 2)
  const turn = (d) => setPage((p) => Math.min(pages - 1, Math.max(0, p + d)))
  return (
    <Modal title="Hunt n' Fight" className="album" onClose={onClose}>
      <p className="album-sub">O meu primeiro jogo: estratégia para o browser, em PHP.</p>
      <div
        className="spread"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') turn(1)
          if (e.key === 'ArrowLeft') turn(-1)
        }}
      >
        {[0, 1].map((side) => {
          const i = page * 2 + side
          if (i >= PHOTOS.length) return <div key={side} className="leaf" />
          return (
            <figure key={i} className={`leaf ${side ? 'right' : 'left'}`}>
              <button type="button" className="photo" onClick={() => setZoom(i)} aria-label={`Ampliar: ${ALBUM[i]}`}>
                <img src={PHOTOS[i]} alt={ALBUM[i]} loading="lazy" />
                <i className="corner tl" />
                <i className="corner tr" />
                <i className="corner bl" />
                <i className="corner br" />
              </button>
              <figcaption>{ALBUM[i]}</figcaption>
            </figure>
          )
        })}
      </div>
      <footer className="album-nav">
        <button type="button" onClick={() => turn(-1)} disabled={page === 0}>
          ← Anterior
        </button>
        <span>
          {page + 1} / {pages}
        </span>
        <button type="button" onClick={() => turn(1)} disabled={page === pages - 1}>
          Seguinte →
        </button>
      </footer>
      {zoom !== null && (
        <button type="button" className="zoom" onClick={() => setZoom(null)} aria-label="Fechar a ampliação">
          <img src={PHOTOS[zoom]} alt={ALBUM[zoom]} />
          <span>{ALBUM[zoom]}</span>
        </button>
      )}
    </Modal>
  )
}

// O monitor do quarto: algumas imagens do jogo, uma de cada vez.
function Crt({ onOpen, onClose }) {
  const [n, setN] = useState(0)
  const i = CRT_PHOTOS[n]
  const turn = (d) => setN((v) => (v + d + CRT_PHOTOS.length) % CRT_PHOTOS.length)
  return (
    <Modal title="Hunt n' Fight" className="crt" onClose={onClose}>
      <div
        className="tube"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') turn(1)
          if (e.key === 'ArrowLeft') turn(-1)
        }}
      >
        <img src={PHOTOS[i]} alt={ALBUM[i]} />
      </div>
      <p className="crt-caption">{ALBUM[i]}</p>
      <footer className="crt-panel">
        <span className="led" aria-hidden="true" />
        <button type="button" onClick={() => turn(-1)} aria-label="Imagem anterior">
          ◀
        </button>
        <span className="count">
          {n + 1} / {CRT_PHOTOS.length}
        </span>
        <button type="button" onClick={() => turn(1)} aria-label="Imagem seguinte">
          ▶
        </button>
        <button type="button" className="wide" onClick={() => onOpen('album')}>
          Álbum completo
        </button>
      </footer>
    </Modal>
  )
}

function Chest({ got, onOpen, onClose }) {
  const items = [
    { id: 'album', name: "Hunt n' Fight", sub: 'Álbum de fotografias', has: got.hnf, hint: 'Está no quarto, nos anos do secundário.' },
    { id: 'projects', name: 'Pixel Fantasy', sub: 'O jogo que estou a fazer', has: got.pf, hint: 'Aparece à noite.' },
    { id: 'projects', name: 'Pixel Fantasy Journal', sub: 'O diário do jogo', has: got.pf, hint: 'Aparece à noite.' },
  ]
  return (
    <Modal title="Baú" className="chest" onClose={onClose}>
      <p className="lead">O que apanhei pelo caminho.</p>
      <ul className="slots">
        {items.map((it) => (
          <li key={it.name}>
            {it.has ? (
              <button type="button" onClick={() => onOpen(it.id)}>
                <strong>{it.name}</strong>
                <span>{it.sub}</span>
              </button>
            ) : (
              <div className="locked">
                <strong>?</strong>
                <span>{it.hint}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Modal>
  )
}

function Projects({ onClose }) {
  const mine = PROJECTS.filter((p) => p.name.startsWith('Pixel Fantasy')).reverse()
  return (
    <Modal title="Os projetos da noite" className="projects" onClose={onClose}>
      <img className="banner" src={banner} alt="A vila do Pixel Fantasy à noite" />
      {mine.map((p) => (
        <article key={p.name}>
          <h3>
            {p.name} <small>{p.status}</small>
          </h3>
          <p>{p.text}</p>
          <ul className="tags">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {p.href && (
            <a className="btn" href={p.href} target="_blank" rel="noreferrer">
              {p.cta}
            </a>
          )}
        </article>
      ))}
    </Modal>
  )
}

const YEAR = new Date().getFullYear()

function About({ onClose }) {
  return (
    <Modal title="Sobre mim" className="about" onClose={onClose}>
      <div className="about-row">
        <img className="about-photo" src={photo} alt="Retrato do Francisco" />
        <div>
          <p>
            Chamo-me Francisco, tenho {getAge()} anos e sou programador analista na Porto Editora.
          </p>
          <p>Gosto de tudo o que tenha a ver com computadores, tecnologia, internet, software e videojogos.</p>
          <ul className="tags">
            <li>
              <a href={LINKS.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={LINKS.steam} target="_blank" rel="noreferrer">
                Steam
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}

function Skills({ onClose }) {
  return (
    <Modal title="Competências" className="skills" onClose={onClose}>
      {SKILLS.map((g) => (
        <section key={g.group}>
          <h3>{g.group}</h3>
          <ul className="grid">
            {g.items.map((name) => {
              const since = SKILL_SINCE[name]
              return (
                <li key={name}>
                  <span>{name}</span>
                  {since && <b title={`Desde ${since}`}>{Math.max(1, YEAR - since)}</b>}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      {Object.keys(SKILL_SINCE).length > 0 && <p className="note">O nível é o número de anos de uso.</p>}
    </Modal>
  )
}

export default function Dialogs({ open, got, onOpen, onClose }) {
  if (open === 'album') return <Album onClose={onClose} />
  if (open === 'crt') return <Crt onOpen={onOpen} onClose={onClose} />
  if (open === 'chest') return <Chest got={got} onOpen={onOpen} onClose={onClose} />
  if (open === 'projects') return <Projects onClose={onClose} />
  if (open === 'skills') return <Skills onClose={onClose} />
  if (open === 'about') return <About onClose={onClose} />
  return null
}
