import { PokemonInstance } from '@/types/pokemon'

const PERFECT_IVS = { hp: 31, atk: 31, def: 31, spAtk: 31, spDef: 31, spe: 31 }
const PERFECT_EVS_MAX = 252 // Each stat can have max 252 EVs (252+252+4 distribution)

/**
 * Calculate IV score (0-100%)
 * Perfect IVs are 31 in all stats
 */
export function calculateIVScore(pokemon: PokemonInstance): number {
  if (!pokemon.iv) return 0

  const stats = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spe'] as const
  let score = 0

  stats.forEach((stat) => {
    const value = pokemon.iv[stat] || 0
    score += (value / 31) * 100
  })

  return Math.round(score / stats.length)
}

/**
 * Calculate EV score (0-100%)
 * Max useful EVs are 252 per stat
 */
export function calculateEVScore(pokemon: PokemonInstance): number {
  if (!pokemon.ev) return 0

  const stats = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spe'] as const
  let score = 0
  let maxedStats = 0

  stats.forEach((stat) => {
    const value = pokemon.ev?.[stat] || 0
    if (value >= 252) maxedStats++
  })

  // Score based on how many stats have max EV investment
  return Math.round((maxedStats / stats.length) * 100)
}

/**
 * Calculate Nature score (0-100%)
 * If nature is set, assume it's a good choice = 100%
 */
export function calculateNatureScore(pokemon: PokemonInstance): number {
  return pokemon.nature ? 100 : 0
}

/**
 * Calculate move score (0-100%)
 * If moves are set, assume they're competitive = 100%
 */
export function calculateMoveScore(pokemon: PokemonInstance): number {
  if (!pokemon.moves || pokemon.moves.length === 0) return 0
  // 4 moves is perfect
  return Math.round((pokemon.moves.length / 4) * 100)
}

/**
 * Calculate overall perfection score (0-100%)
 * Weighted average: IVs (40%), EVs (30%), Nature (20%), Moves (10%)
 */
export function calculateOverallScore(pokemon: PokemonInstance): number {
  const ivScore = calculateIVScore(pokemon)
  const evScore = calculateEVScore(pokemon)
  const natureScore = calculateNatureScore(pokemon)
  const moveScore = calculateMoveScore(pokemon)

  return Math.round(
    ivScore * 0.4 + evScore * 0.3 + natureScore * 0.2 + moveScore * 0.1
  )
}

/**
 * Calculate rarity score for special forms
 */
export function calculateRarityScore(pokemon: PokemonInstance): number {
  let rarity = 0

  if (pokemon.isShiny) rarity += 50
  if (pokemon.form && pokemon.form !== 'normal') rarity += 30
  // Alpha status would go here
  // if (pokemon.isAlpha) rarity += 40

  return Math.min(rarity, 100)
}

/**
 * Get a descriptive label for a perfection score
 */
export function getPerfectionLabel(score: number): string {
  if (score >= 95) return 'Perfect'
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Very Good'
  if (score >= 50) return 'Good'
  if (score >= 25) return 'Fair'
  return 'Needs Work'
}
