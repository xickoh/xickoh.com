// Conteúdo do portfolio. Tudo o que se mostra no site sai daqui.

// Data de nascimento: só serve para calcular a idade (o site mostra apenas os anos).
const BIRTH = { year: 1996, month: 12, day: 3 }

export function getAge(now = new Date()) {
  let age = now.getFullYear() - BIRTH.year
  const before =
    now.getMonth() + 1 < BIRTH.month ||
    (now.getMonth() + 1 === BIRTH.month && now.getDate() < BIRTH.day)
  if (before) age -= 1
  return age
}

export const LINKS = {
  github: 'https://github.com/xickoh',
  steam: 'https://steamcommunity.com/id/xickoh/',
  linkedin: 'https://www.linkedin.com/in/francisco-nogueira-922437232/',
  journal: 'https://pixelfantasy.xickoh.com/',
}

export const SHEET = [
  ['Classe', 'Programador Analista'],
  ['Nível', null], // preenchido com a idade
  ['Trabalho', 'Porto Editora'],
  ['Missão pessoal', 'Pixel Fantasy'],
  ['Base', 'Portugal'],
  ['Línguas', 'Português, Inglês'],
]

export const PROJECTS = [
  {
    name: 'Pixel Fantasy Journal',
    status: 'Ativo',
    text:
      'O diário de desenvolvimento do Pixel Fantasy: funcionalidades, capturas e GIFs, devlog por dia e uma wiki com itens, inimigos e mecânicas.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Python'],
    href: LINKS.journal,
    cta: 'Abrir o diário',
  },
  {
    name: 'Pixel Fantasy',
    status: 'Em desenvolvimento',
    text:
      'Jogo de ação 2D em pixel art, vista de cima, onde um escudeiro defende uma vila no meio da floresta. Mundo gerado por seed, combate, skills de 1 a 99, crafting, vila com aldeões, dungeons e multijogador até 4 jogadores.',
    tags: ['Godot', 'GDScript', 'Python', 'Pixel art'],
  },
  {
    name: 'Jogo de estratégia online',
    status: 'Antigo',
    text:
      'Um jogo de estratégia online para o browser, dos primeiros projetos que fiz depois de começar a programar.',
    tags: ['Web', 'Browser game'],
  },
]

export const SKILLS = [
  { group: 'Jogos', items: ['Godot', 'GDScript', 'Pixel art', 'Game design'] },
  { group: 'Software', items: ['Python', 'Java', 'C', 'C#', 'Kotlin', 'SQL', 'Visual Basic', 'Pascal'] },
  { group: 'Web', items: ['JavaScript', 'React', 'Node.js', 'Express.js', 'jQuery', 'PHP', 'ASP', 'HTML', 'CSS'] },
  { group: 'Bases de dados', items: ['SQL Server', 'MySQL'] },
]

export const JOURNEY = [
  {
    when: '2022 – Agora',
    title: 'Programador Analista',
    where: 'Porto Editora',
  },
  {
    when: 'A terminar',
    title: 'Engenharia Informática',
    where: 'Escola Superior de Tecnologia e Gestão, Politécnico do Porto',
  },
  {
    when: '2014 – 2015',
    title: 'Curso de Especialização Técnica em DevOps',
    where: 'Desenvolvimento de Software e Administração de Sistemas, Universidade Lusófona (Lisboa)',
  },
  {
    when: '2014',
    title: 'Full stack Web Developer (estágio)',
    where: 'FixeAds, Lisboa. Três meses.',
  },
  {
    when: '2011 – 2014',
    title: 'Técnico de Programação e Gestão de Sistemas Informáticos',
    where: 'Escola Secundária Augusto de Cabrita (Barreiro)',
  },
]

export const LIKES = [
  { icon: '▸', text: 'Computadores e software' },
  { icon: '▸', text: 'Videojogos' },
  { icon: '▸', text: 'Internet e tecnologia' },
  { icon: '▸', text: 'Aprender mais, sempre' },
]

export const SOCIALS = [
  { name: 'GitHub', handle: 'xickoh', text: 'O código e os projetos.', href: LINKS.github },
  { name: 'Steam', handle: 'xickoh', text: 'Onde jogo quando não estou a programar.', href: LINKS.steam },
  { name: 'LinkedIn', handle: 'Francisco Nogueira', text: 'O percurso profissional.', href: LINKS.linkedin },
]
