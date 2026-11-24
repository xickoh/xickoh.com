// Textos da timeline. Cada legenda aparece entre dois pontos do scroll (troço + t).
import { at } from './track.js'
import { getAge } from '../data.js'

export const CAPTIONS = [
  {
    from: at('intro', 0.62),
    to: at('crawl', 0.95),
    title: 'Barreiro, 1996.',
    text: 'Onde começou.',
  },
  {
    from: at('jogos', 0.05),
    to: at('jogos', 0.98),
    title: 'Aos 8 ou 9 anos, o computador já era o centro de tudo.',
    text: 'Era lá que jogava, e trazia muitas vezes os amigos lá para casa para jogarmos juntos.',
  },
  {
    from: at('pc', 0.03),
    to: at('pc', 0.52),
    title: 'Foi na altura do ensino básico que comecei a fazer as primeiras experiências.',
    text: 'Blogs, sites simples, pequenos programas a seguir tutoriais, servidores de jogos. Tudo ainda antes de saber programar.',
  },
  {
    from: at('pc', 0.56),
    to: at('pc', 0.98),
    title: 'Depois veio a vontade de perceber como tudo funcionava.',
    text: 'Por isso decidi estudar programação no ensino secundário.',
  },
  {
    from: at('secundario', 0.03),
    to: at('secundario', 0.34),
    title: 'Técnico de Programação e Gestão de Sistemas Informáticos',
    text: 'Escola Secundária Augusto Cabrita, Barreiro.',
  },
  {
    from: at('secundario', 0.5),
    to: at('secundario', 0.9),
    title: "Foi aqui que fiz o meu primeiro jogo: Hunt n' Fight.",
    text: 'Toca no computador para o ver.',
  },
  {
    from: at('tejo', 0.2),
    to: at('tejo', 0.9),
    title: 'Do outro lado do rio.',
  },
  {
    from: at('fixeads', 0.05),
    to: at('fixeads', 0.98),
    title: 'O estágio do curso, na FixeAds.',
    text: 'Três meses como full stack web developer, a fechar o curso do secundário.',
  },
  {
    from: at('lusofona', 0.05),
    to: at('lusofona', 0.98),
    title: 'Curso de Especialização Técnica em DevOps',
    text: 'Desenvolvimento de Software e Administração de Sistemas, Universidade Lusófona.',
  },
  {
    from: at('norte', 0.2),
    to: at('norte', 0.9),
    title: 'Para norte.',
  },
  {
    from: at('felgueiras', 0.3),
    to: at('estg', 0.98),
    title: 'Engenharia Informática',
    text: 'Escola Superior de Tecnologia e Gestão do Politécnico do Porto, em Felgueiras. Onde a programação passou a ter teoria por trás.',
  },
  {
    from: at('presente', 0.02),
    to: at('presente', 0.4),
    title: 'Programador Analista na Porto Editora, desde 2022.',
    text: 'Integro a equipa da Escola Virtual: desenvolvo o sistema de testes interativos pedagógicos e crio conteúdos lúdicos, como jogos de perguntas (Glória, Trivial Pursuit). Também fiz os backoffices que personalizam esses jogos, uma espécie de editores de níveis, e widgets.',
  },
  {
    from: at('presente', 0.6),
    to: at('presente', 0.99),
    title: 'À noite, os projetos são meus.',
    text: 'Toca nas coisas do quarto.',
  },
]

export const INTRO = {
  title: 'Francisco Nogueira',
  text: 'Se a minha vida fosse uma página',
  hint: 'Faz scroll para avançar',
}

export const END = {
  title: 'O resto ainda está por escrever.',
  level: () => `Nível ${getAge()}`,
}

export const HOBBIES = {
  ball: 'Rocket League: mais horas do que devia.',
  pick: 'Terraria: escavar só mais um bocadinho.',
  planet: "No Man's Sky: um planeta diferente de cada vez.",
  book: 'Engenharia Informática, ESTG. Em conclusão.',
  mug: 'Café. O combustível do dia.',
  goal: 'What a save!',
  cubes: 'Para quê resolvê-los, se vou baralhá-los de seguida?',
}

export const SKILLS_NOTE = 'Old School RuneScape: o grind ensinou-me paciência.'

// Ano em que comecei a usar cada tecnologia. O nível na grelha é o número de anos de uso.
// As que não estiverem aqui aparecem sem nível.
export const SKILL_SINCE = {}

// As fotografias (pela ordem do álbum, a contar do zero) que o monitor do quarto mostra.
export const CRT_PHOTOS = [1, 2, 4, 5, 7, 11]

export const ALBUM = [
  'Bem-vindo!',
  'Nómada, Lutador, Sábio ou Trabalhador.',
  'A aldeia.',
  'Coordenadas 96:26.',
  'Madeira, pedra e caça.',
  'Lobos, tigres e mamutes.',
  'Relatórios de ataque.',
  'O ranking. Cinco jogadores, todos eu.',
  'As famílias (os clãs).',
  'O perfil.',
  'Mensagens entre jogadores.',
  '«Não podes enviar mensagens a ti mesmo! Arranja amigos...»',
]
