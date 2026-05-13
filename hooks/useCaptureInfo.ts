'use client'

import { useMemo } from 'react'
import { usePokemonStore } from '@/store/pokemonStore'

export function usePokemonProgress(totalCount?: number) {
  const { capturedPokemon, caughtSpecies } = usePokemonStore()

  return useMemo(() => {
    const totalCaptured = caughtSpecies.length
    const totalInstances = capturedPokemon.length
    const actualTotal = totalCount || 1025

    return {
      totalCaptured,
      totalInstances,
      completionPercentage: Math.round((totalCaptured / actualTotal) * 100),
    }
  }, [capturedPokemon, caughtSpecies, totalCount])
}
