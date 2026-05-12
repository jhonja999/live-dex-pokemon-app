export type GameType = 'arceus' | 'zeroA'

export const GAMES = {
  ARCEUS: 'arceus' as const,
  ZERO_A: 'zeroA' as const,
} as const

export interface GameInfo {
  id: GameType
  name: string
  fullName: string
  description: string
  pokemonCount: number
  releaseDate: string
}
