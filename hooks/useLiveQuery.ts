'use client'

import { useEffect, useState } from 'react'
import { db, initializeDefaults, getPokemonByBox, getBoxes } from '@/lib/db'
import { PokemonInstance } from '@/types/pokemon'
import { BoxStorage } from '@/types/box'
import { usePokemonStore } from '@/store/pokemonStore'

/**
 * Hook to sync Dexie data with Zustand store
 * Initializes DB on mount and updates store with live data
 */
export function useLiveQuery() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const setCapturedPokemon = usePokemonStore((state) => state.setCapturedPokemon)
  const setBoxes = usePokemonStore((state) => state.setBoxes)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        // Initialize database if empty
        await initializeDefaults()

        // Load all Pokémon (from all boxes)
        const allPokemon = await db.pokemon.toArray()
        if (isMounted) {
          setCapturedPokemon(allPokemon)
        }

        // Load all boxes
        const allBoxes = await getBoxes()
        if (isMounted) {
          setBoxes(allBoxes)
        }

        setIsLoading(false)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load data'))
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [setCapturedPokemon, setBoxes])

  return { isLoading, error }
}

/**
 * Hook to watch changes in a specific box
 */
export function useBoxQuery(boxId: string) {
  const [pokemon, setPokemon] = useState<PokemonInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadBoxPokemon() {
      try {
        const boxPokemon = await getPokemonByBox(boxId)
        if (isMounted) {
          setPokemon(boxPokemon)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBoxPokemon()

    return () => {
      isMounted = false
    }
  }, [boxId])

  return { pokemon, isLoading }
}
