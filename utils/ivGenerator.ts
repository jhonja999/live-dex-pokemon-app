import { IvStats, EvStats, Nature } from '@/types/pokemon'
import { fetchNatureDetails } from '@/lib/pokeapi'

// All 25 Natures in Pokémon
export const ALL_NATURES: Nature[] = [
  { name: 'Hardy', increasedStat: null, decreasedStat: null },
  { name: 'Lonely', increasedStat: 'atk' as any, decreasedStat: 'def' as any },
  { name: 'Brave', increasedStat: 'atk' as any, decreasedStat: 'spe' as any },
  { name: 'Adamant', increasedStat: 'atk' as any, decreasedStat: 'spAtk' as any },
  { name: 'Naughty', increasedStat: 'atk' as any, decreasedStat: 'spDef' as any },
  { name: 'Bold', increasedStat: 'def' as any, decreasedStat: 'atk' as any },
  { name: 'Docile', increasedStat: null, decreasedStat: null },
  { name: 'Relaxed', increasedStat: 'def' as any, decreasedStat: 'spe' as any },
  { name: 'Impish', increasedStat: 'def' as any, decreasedStat: 'spAtk' as any },
  { name: 'Lax', increasedStat: 'def' as any, decreasedStat: 'spDef' as any },
  { name: 'Timid', increasedStat: 'spe' as any, decreasedStat: 'atk' as any },
  { name: 'Hasty', increasedStat: 'spe' as any, decreasedStat: 'def' as any },
  { name: 'Serious', increasedStat: null, decreasedStat: null },
  { name: 'Jolly', increasedStat: 'spe' as any, decreasedStat: 'spAtk' as any },
  { name: 'Naive', increasedStat: 'spe' as any, decreasedStat: 'spDef' as any },
  { name: 'Modest', increasedStat: 'spAtk' as any, decreasedStat: 'atk' as any },
  { name: 'Mild', increasedStat: 'spAtk' as any, decreasedStat: 'def' as any },
  { name: 'Quiet', increasedStat: 'spAtk' as any, decreasedStat: 'spe' as any },
  { name: 'Bashful', increasedStat: null, decreasedStat: null },
  { name: 'Rash', increasedStat: 'spAtk' as any, decreasedStat: 'spDef' as any },
  { name: 'Calm', increasedStat: 'spDef' as any, decreasedStat: 'atk' as any },
  { name: 'Gentle', increasedStat: 'spDef' as any, decreasedStat: 'def' as any },
  { name: 'Sassy', increasedStat: 'spDef' as any, decreasedStat: 'spe' as any },
  { name: 'Careful', increasedStat: 'spDef' as any, decreasedStat: 'spAtk' as any },
  { name: 'Quirky', increasedStat: null, decreasedStat: null },
]

/**
 * Generate random IVs (0-31 for each stat)
 * Can generate perfect IVs (all 31) or random values
 */
export function generateIVs(perfectIVs = false): IvStats {
  if (perfectIVs) {
    return {
      hp: 31,
      atk: 31,
      def: 31,
      spAtk: 31,
      spDef: 31,
      spe: 31,
    }
  }

  return {
    hp: Math.floor(Math.random() * 32),
    atk: Math.floor(Math.random() * 32),
    def: Math.floor(Math.random() * 32),
    spAtk: Math.floor(Math.random() * 32),
    spDef: Math.floor(Math.random() * 32),
    spe: Math.floor(Math.random() * 32),
  }
}

/**
 * Generate random EVs (effort values)
 * Can be 0-252 per stat, max total 510
 */
export function generateEVs(optimized = false): EvStats {
  if (optimized) {
    // Optimized spread: 252/252/6 or similar common competitive spreads
    return {
      hp: 252,
      atk: 252,
      def: 6,
      spAtk: 0,
      spDef: 0,
      spe: 0,
    }
  }

  // Random untrained EVs (0-20 per stat max)
  return {
    hp: Math.floor(Math.random() * 21),
    atk: Math.floor(Math.random() * 21),
    def: Math.floor(Math.random() * 21),
    spAtk: Math.floor(Math.random() * 21),
    spDef: Math.floor(Math.random() * 21),
    spe: Math.floor(Math.random() * 21),
  }
}

/**
 * Get a random nature
 */
export function getRandomNature(): Nature {
  return ALL_NATURES[Math.floor(Math.random() * ALL_NATURES.length)]
}

/**
 * Get nature by name with full details
 */
export function getNatureByName(name: string): Nature | undefined {
  return ALL_NATURES.find((n) => n.name.toLowerCase() === name.toLowerCase())
}

/**
 * Calculate actual stats from base stats, IVs, EVs, level, and nature
 */
export function calculateStats(
  baseStat: number,
  iv: number,
  ev: number,
  level: number = 50,
  statType: 'hp' | 'other' = 'other',
  nature?: Nature
): number {
  let stat: number

  if (statType === 'hp') {
    stat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100 + level + 5)
  } else {
    stat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100 + 5)
  }

  // Apply nature modifier
  if (nature) {
    if (nature.increasedStat === 'atk' || nature.increasedStat === 'def' || nature.increasedStat === 'spAtk' || nature.increasedStat === 'spDef' || nature.increasedStat === 'spe') {
      // This is a simplified version - would need to map stat names to actual stat
      stat = Math.floor(stat * 1.1)
    }
    if (nature.decreasedStat === 'atk' || nature.decreasedStat === 'def' || nature.decreasedStat === 'spAtk' || nature.decreasedStat === 'spDef' || nature.decreasedStat === 'spe') {
      stat = Math.floor(stat * 0.9)
    }
  }

  return stat
}

/**
 * Check if IVs are perfect (all 31)
 */
export function isPerfectIVs(ivs: IvStats): boolean {
  return (
    ivs.hp === 31 &&
    ivs.atk === 31 &&
    ivs.def === 31 &&
    ivs.spAtk === 31 &&
    ivs.spDef === 31 &&
    ivs.spe === 31
  )
}

/**
 * Calculate IV percentage (0-100)
 */
export function getIVPercentage(ivs: IvStats): number {
  const total = ivs.hp + ivs.atk + ivs.def + ivs.spAtk + ivs.spDef + ivs.spe
  const max = 31 * 6
  return Math.round((total / max) * 100)
}

/**
 * Format IV stats for display
 */
export function formatIVStats(ivs: IvStats): string {
  return `${ivs.hp}/${ivs.atk}/${ivs.def}/${ivs.spAtk}/${ivs.spDef}/${ivs.spe}`
}
