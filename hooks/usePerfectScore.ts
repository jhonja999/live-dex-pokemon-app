'use client'

import { useMemo } from 'react'
import { PokemonInstance } from '@/types/pokemon'
import {
  calculateOverallScore,
  calculateIVScore,
  calculateEVScore,
  calculateNatureScore,
  calculateMoveScore,
  calculateRarityScore,
  getPerfectionLabel,
} from '@/utils/perfectScore'

export function usePerfectScore(pokemon: PokemonInstance | undefined) {
  return useMemo(() => {
    if (!pokemon) {
      return {
        overall: 0,
        iv: 0,
        ev: 0,
        nature: 0,
        moves: 0,
        rarity: 0,
        label: 'N/A',
      }
    }

    const overall = calculateOverallScore(pokemon)
    return {
      overall,
      iv: calculateIVScore(pokemon),
      ev: calculateEVScore(pokemon),
      nature: calculateNatureScore(pokemon),
      moves: calculateMoveScore(pokemon),
      rarity: calculateRarityScore(pokemon),
      label: getPerfectionLabel(overall),
    }
  }, [pokemon])
}
