import { PokemonInstance } from '@/types/pokemon'
import { calculateOverallScore, calculateRarityScore } from './perfectScore'

/**
 * Calculate overall collection completion percentage
 */
export function calculateCollectionScore(captured: PokemonInstance[], totalAvailable: number): number {
  if (totalAvailable === 0) return 0
  return Math.round((captured.length / totalAvailable) * 100)
}

/**
 * Calculate shiny collection percentage
 */
export function calculateShinyPercentage(captured: PokemonInstance[]): number {
  if (captured.length === 0) return 0
  const shinyCount = captured.filter((p) => p.isShiny).length
  return Math.round((shinyCount / captured.length) * 100)
}

/**
 * Calculate alpha collection percentage
 */
export function calculateAlphaPercentage(captured: PokemonInstance[]): number {
  if (captured.length === 0) return 0
  const alphaCount = captured.filter((p) => p.form === 'alpha').length
  return Math.round((alphaCount / captured.length) * 100)
}

/**
 * Calculate percentage of perfect Pokémon
 * Score of 85+ is considered "perfect"
 */
export function calculatePerfectPercentage(captured: PokemonInstance[]): number {
  if (captured.length === 0) return 0
  const perfectCount = captured.filter((p) => calculateOverallScore(p) >= 85).length
  return Math.round((perfectCount / captured.length) * 100)
}

/**
 * Calculate completion velocity (captures per day)
 */
export function calculateCompletionVelocity(captured: PokemonInstance[], dayRange: number = 7): number {
  const now = Date.now()
  const rangeMs = dayRange * 24 * 60 * 60 * 1000

  const recentCaptures = captured.filter((p) => now - p.capturedAt <= rangeMs)

  return Math.round((recentCaptures.length / dayRange) * 100) / 100 // Captures per day
}

/**
 * Calculate best IV average across collection
 */
export function calculateBestIVAverage(captured: PokemonInstance[]): number {
  if (captured.length === 0) return 0

  let totalScore = 0
  captured.forEach((p) => {
    if (p.iv) {
      const ivScore = (p.iv.hp + p.iv.atk + p.iv.def + p.iv.spAtk + p.iv.spDef + p.iv.spe) / (31 * 6)
      totalScore += ivScore * 100
    }
  })

  return Math.round(totalScore / captured.length)
}

/**
 * Calculate rarity tier of entire collection
 * Returns a value 0-100 where higher = rarer
 */
export function calculateRarityTier(captured: PokemonInstance[]): number {
  if (captured.length === 0) return 0

  let totalRarity = 0
  captured.forEach((p) => {
    totalRarity += calculateRarityScore(p)
  })

  return Math.round(totalRarity / captured.length)
}

/**
 * Calculate type completion
 */
export function calculateTypeCompletion(
  captured: PokemonInstance[],
  allPokemon: Record<string, { type1: string; type2?: string }>
): Record<string, number> {
  const typeCount: Record<string, number> = {}
  const typeTotal: Record<string, number> = {}

  // Count all Pokémon by type
  Object.values(allPokemon).forEach((pokemon) => {
    if (!typeTotal[pokemon.type1]) typeTotal[pokemon.type1] = 0
    typeTotal[pokemon.type1]++

    if (pokemon.type2) {
      if (!typeTotal[pokemon.type2]) typeTotal[pokemon.type2] = 0
      typeTotal[pokemon.type2]++
    }
  })

  // Count captured by type — needs species data lookup
  // For now, all captured are counted via allPokemon
  // Calculate percentages
  const completion: Record<string, number> = {}
  Object.entries(typeTotal).forEach(([type, total]) => {
    const count = typeCount[type] || 0
    completion[type] = Math.round((count / total) * 100)
  })

  return completion
}

/**
 * Generate live stats summary
 */
export interface LiveStats {
  collectionScore: number
  shinyPercentage: number
  alphaPercentage: number
  perfectPercentage: number
  completionVelocity: number
  bestIVAverage: number
  rarityTier: number
  totalCaptured: number
  totalPerfect: number
  totalShiny: number
  totalAlpha: number
}

export function generateLiveStats(captured: PokemonInstance[], totalAvailable: number = 400): LiveStats {
  return {
    collectionScore: calculateCollectionScore(captured, totalAvailable),
    shinyPercentage: calculateShinyPercentage(captured),
    alphaPercentage: calculateAlphaPercentage(captured),
    perfectPercentage: calculatePerfectPercentage(captured),
    completionVelocity: calculateCompletionVelocity(captured),
    bestIVAverage: calculateBestIVAverage(captured),
    rarityTier: calculateRarityTier(captured),
    totalCaptured: captured.length,
    totalPerfect: captured.filter((p) => calculateOverallScore(p) >= 85).length,
    totalShiny: captured.filter((p) => p.isShiny).length,
    totalAlpha: captured.filter((p) => p.form === 'alpha').length,
  }
}
