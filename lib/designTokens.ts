// Single source of truth for design system
// Used in globals.css, components, and animations

export const SPACING = {
  0: '0',
  2: '0.125rem', // 2px
  4: '0.25rem', // 4px
  8: '0.5rem', // 8px
  12: '0.75rem', // 12px
  16: '1rem', // 16px
  24: '1.5rem', // 24px
  32: '2rem', // 32px
  48: '3rem', // 48px
} as const

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
} as const

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Normal: { bg: '#A8A878', text: '#fff', border: '#8b8b67' },
  Fighting: { bg: '#C03028', text: '#fff', border: '#a01f1f' },
  Flying: { bg: '#A890F0', text: '#fff', border: '#8b7fc7' },
  Poison: { bg: '#A040A0', text: '#fff', border: '#7f327f' },
  Ground: { bg: '#E0C068', text: '#000', border: '#b39a52' },
  Rock: { bg: '#B8A038', text: '#fff', border: '#92812f' },
  Bug: { bg: '#A8B820', text: '#000', border: '#85911a' },
  Ghost: { bg: '#705898', text: '#fff', border: '#59467f' },
  Steel: { bg: '#B8B8D0', text: '#000', border: '#92929f' },
  Fire: { bg: '#F08030', text: '#fff', border: '#c86124' },
  Water: { bg: '#6090F0', text: '#fff', border: '#4a6fc0' },
  Grass: { bg: '#78C850', text: '#000', border: '#5f9d42' },
  Electric: { bg: '#F8D030', text: '#000', border: '#c4a424' },
  Psychic: { bg: '#F85888', text: '#fff', border: '#c64471' },
  Ice: { bg: '#98D8D8', text: '#000', border: '#78a8a8' },
  Dragon: { bg: '#7038F8', text: '#fff', border: '#5a2fc7' },
  Dark: { bg: '#705848', text: '#fff', border: '#59483a' },
  Fairy: { bg: '#EE99AC', text: '#fff', border: '#c17a8a' },
} as const

export const RARITY_COLORS = {
  common: '#A8A878',
  uncommon: '#78C850',
  rare: '#F8D030',
  veryRare: '#F08030',
  legendary: '#C03028',
  mythical: '#E65EEE',
} as const

export const THEME_COLORS = {
  dark: {
    bg: '#0a0e27',
    surface: '#1a1f3a',
    border: '#2a3050',
    text: '#e2e8f0',
    muted: '#94a3b8',
  },
  light: {
    bg: '#f8f9fa',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    muted: '#64748b',
  },
  pokédexRed: {
    primary: '#cc0000',
    secondary: '#ffcc00',
    accent: '#333333',
  },
  homeBlue: {
    primary: '#0066cc',
    secondary: '#ffcc00',
    accent: '#ffffff',
  },
} as const

export const SPRING_CONFIG = {
  stiff: { damping: 40, mass: 1, stiffness: 210 },
  normal: { damping: 20, mass: 1, stiffness: 300 },
  gentle: { damping: 30, mass: 1, stiffness: 100 },
  molasses: { damping: 50, mass: 1, stiffness: 50 },
} as const
