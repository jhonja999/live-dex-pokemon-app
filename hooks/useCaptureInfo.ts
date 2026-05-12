'use client'

import { useMemo } from 'react'
import { usePokemonStore } from '@/store/pokemonStore'
import { PokemonInstance } from '@/types/pokemon'

export interface CaptureInfo {
  isCaptured: boolean
  instances: PokemonInstance[]
  conditions: string[]
  boxCount: number
}

export function usePokemonCaptureInfo(speciesId: number): CaptureInfo {
  const { capturedPokemon } = usePokemonStore()

  return useMemo(() => {
    const instances = capturedPokemon.filter((p) => p.speciesId === speciesId)
    const conditions = new Set<string>()

    instances.forEach((instance) => {
      if (instance.isShiny) conditions.add('✨ Shiny')
      if (instance.gender) conditions.add(`♂️ ${instance.gender.charAt(0).toUpperCase()}`)
      if (instance.level) conditions.add(`Lv.${instance.level}`)
    })

    return {
      isCaptured: instances.length > 0,
      instances,
      conditions: Array.from(conditions),
      boxCount: instances.length,
    }
  }, [capturedPokemon, speciesId])
}

export function usePokemonProgress() {
  const { capturedPokemon } = usePokemonStore()

  return useMemo(() => {
    const totalCaptured = new Set(capturedPokemon.map((p) => p.speciesId)).size
    const totalInstances = capturedPokemon.length

    return {
      totalCaptured,
      totalInstances,
      completionPercentage: Math.round((totalCaptured / 1025) * 100), // ~1025 Pokémon total
    }
  }, [capturedPokemon])
}
