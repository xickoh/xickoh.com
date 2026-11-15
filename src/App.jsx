import { useEffect } from 'react'
import banner from './assets/banner.png'
import { getAge, JOURNEY, LIKES, LINKS, PROJECTS, SHEET, SKILLS, SOCIALS } from './data.js'

const NAV = [
  ['sobre', 'Sobre'],
  ['projetos', 'Projetos'],
  ['skills', 'Skills'],
  ['percurso', 'Percurso'],
  ['contactos', 'Contactos'],
]

function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <h2 className="title">
        <span>{title}</span>
      </h2>
      {children}
    </section>
  )
}

function Hero({ age }) {
  return (
    <header className="hero">
      <div className="banner-wrap">
        <img
          className="banner"
          src={banner}
          alt="A vila do Pixel Fantasy à noite: taberna, torre do mago, ferreiro e aldeões à volta da fogueira"
        />
      </div>
      <div className="intro">
        <p className="kicker">Olá, eu sou o</p>
        <h1>
          Fran<span>cisco</span>
        </h1>
        <p className="role">
          <span>Developer</span>
          <span>{age} anos</span>
          <span>A fazer o Pixel Fantasy</span>
        </p>
        <p className="lead">
          Escrevo código desde os 13 anos. Neste momento estou a construir o{' '}
          <strong>Pixel Fantasy</strong>, um jogo de ação em pixel art: a vila aí em cima é dele.
        </p>
        <div className="actions">
          <a className="btn" href="#projetos">
            Ver projetos
          </a>
          <a className="btn alt" href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="btn steam" href={LINKS.steam} target="_blank" rel="noreferrer">
            Steam
          </a>
        </div>
      </div>
    </header>
  )
}

function About({ age }) {
  const sheet = SHEET.map(([k, v]) => [k, v ?? `${age} anos`])
  return (
    <Section id="sobre" title="Sobre mim">
      <div className="about">
        <div className="card text">
          <p>
            Chamo-me Francisco, tenho {age} anos e sou developer. Gosto de tudo o que tenha a
            ver com computadores, tecnologia, internet, software e videojogos.
          </p>
          <p>
            Comecei a programar aos 13 anos e já fiz muitos projetos, incluindo um jogo de
            estratégia online para o browser. Sou racional, de mente aberta e estou sempre com
            vontade de aprender mais e de fazer melhor.
          </p>
          <p>
            Agora a minha missão é o <strong>Pixel Fantasy</strong>: um jogo em Godot que mistura
            o que mais gosto em RuneScape, Metin2, Terraria e Diablo. Vou documentando tudo num
            diário de desenvolvimento.
          </p>
          <ul className="likes">
            {LIKES.map((l) => (
              <li key={l.text}>
                <span aria-hidden="true">{l.icon}</span> {l.text}
              </li>
            ))}
          </ul>
        </div>
        <aside className="card sheet" aria-label="Ficha de personagem">
          <h3>Ficha</h3>
          <dl>
            {sheet.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Section>
  )
}

function Projects() {
  return (
    <Section id="projetos" title="Projetos">
      <ul className="projects">
        {PROJECTS.map((p) => (
          <li key={p.name} className="card project">
            <div className="project-head">
              <h3>{p.name}</h3>
              <span className="status">{p.status}</span>
            </div>
            <p>{p.text}</p>
            <ul className="tags">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {p.href && (
              <a className="btn small" href={p.href} target="_blank" rel="noreferrer">
                {p.cta} →
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="skills">
        {SKILLS.map((g) => (
          <div key={g.group} className="card skill">
            <h3>{g.group}</h3>
            <ul className="tags">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Journey() {
  return (
    <Section id="percurso" title="Percurso">
      <ol className="journey">
        {JOURNEY.map((j) => (
          <li key={j.title}>
            <span className="when">{j.when}</span>
            <div className="card">
              <h3>{j.title}</h3>
              <p>{j.where}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Contacts() {
  return (
    <Section id="contactos" title="Onde me encontrar">
      <ul className="socials">
        {SOCIALS.map((c) => (
          <li key={c.name}>
            <a className="card social" href={c.href} target="_blank" rel="noreferrer">
              <h3>{c.name}</h3>
              <span className="handle">{c.handle}</span>
              <p>{c.text}</p>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default function App() {
  const age = getAge()
  // Realce "reveal" do Fluent: os cartões sabem onde está o ponteiro.
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.('.card')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
  return (
    <>
      <nav className="topbar">
        <a className="brand" href="#top">
          <img src="/favicon.png" alt="" width="28" height="28" />
          xickoh
        </a>
        <div className="links">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </div>
      </nav>
      <main id="top">
        <Hero age={age} />
        <About age={age} />
        <Projects />
        <Skills />
        <Journey />
        <Contacts />
      </main>
      <footer className="footer">
        <p>Francisco · xickoh</p>
        <p className="foot-links">
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={LINKS.steam} target="_blank" rel="noreferrer">
            Steam
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
      </footer>
    </>
  )
}
