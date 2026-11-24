// Quem pede menos movimento fica sem paralaxe e sem animações contínuas; o scroll continua a mandar.
export const REDUCED =
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const F_FAR = REDUCED ? 1 : 0.25
export const F_MID = REDUCED ? 1 : 0.6
