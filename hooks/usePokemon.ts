'use client'

import { useState, useEffect } from 'react'
import { fetchAllPokemon, fetchGameDex } from '@/lib/pokeapi'
import { PokemonSpecies } from '@/types/pokemon'
import { GameType } from '@/types/game'

export function usePokemon(game?: GameType) {
  const [pokemon, setPokemon] = useState<PokemonSpecies[]>([])
  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameDexOrder, setGameDexOrder] = useState<Map<number, number>>(new Map())

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch game dex order in parallel with pokemon data
        const [data, dexEntries] = await Promise.all([
          fetchAllPokemon(false, (count) => {
            if (isMounted) setLoadedCount(count)
          }),
          game ? fetchGameDex(game) : Promise.resolve([]),
        ])

        if (!isMounted) return

        // Build dex order map
        const orderMap = new Map<number, number>()
        if (dexEntries.length > 0) {
          dexEntries.forEach(e => orderMap.set(e.speciesId, e.dexNumber))
        }

        // Sort by game dex order if available, otherwise national dex
        const sorted = [...data].sort((a, b) => {
          const aDex = orderMap.get(a.id)
          const bDex = orderMap.get(b.id)
          if (aDex !== undefined && bDex !== undefined) return aDex - bDex
          if (aDex !== undefined) return -1
          if (bDex !== undefined) return 1
          return a.id - b.id
        })

        setPokemon(sorted)
        setGameDexOrder(orderMap)
        setLoadedCount(sorted.length)
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load Pokémon'
          setError(message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      isMounted = false
    }
  }, [game])

  return { pokemon, loadedCount, isLoading, error, gameDexOrder }
}
