'use client'

import { useMemo } from 'react'
import { PokemonSpecies } from '@/types/pokemon'
import { FilterState } from '@/types/ui'
import { usePokemonStore } from '@/store/pokemonStore'

export function useFilters(pokemon: PokemonSpecies[], filters: FilterState) {
  const caughtSpecies = usePokemonStore((s) => s.caughtSpecies)
  const shinySpecies = usePokemonStore((s) => s.shinySpecies)
  const alphaSpecies = usePokemonStore((s) => s.alphaSpecies)
  const favoriteSpecies = usePokemonStore((s) => s.favoriteSpecies)
  const capturedPokemon = usePokemonStore((s) => s.capturedPokemon)

  return useMemo(() => {
    let result = [...pokemon]

    // Type filter
    if (filters.types.length > 0) {
      result = result.filter(
        (p) => filters.types.includes(p.type1) || filters.types.includes(p.type2!)
      )
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) || p.id.toString().includes(query)
      )
    }

    // Captured filter
    if (filters.captured !== null) {
      result = result.filter((p) =>
        filters.captured === true
          ? caughtSpecies.includes(p.id)
          : !caughtSpecies.includes(p.id)
      )
    }

    // Shiny filter
    if (filters.shiny) {
      result = result.filter((p) => shinySpecies.includes(p.id))
    }

    // Alpha filter
    if (filters.alpha) {
      result = result.filter((p) => alphaSpecies.includes(p.id))
    }

    // Favorite filter
    if (filters.favorite) {
      result = result.filter((p) => favoriteSpecies.includes(p.id))
    }

    // Sorting
    if (filters.sortBy === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (filters.sortBy === 'favorite') {
      result = result.sort((a, b) => {
        const aFav = favoriteSpecies.includes(a.id) ? 1 : 0
        const bFav = favoriteSpecies.includes(b.id) ? 1 : 0
        return bFav - aFav
      })
    } else if (filters.sortBy === 'recent') {
      result = result.sort((a, b) => {
        const aCap = capturedPokemon.filter(p => p.speciesId === a.id)
        const bCap = capturedPokemon.filter(p => p.speciesId === b.id)
        const aLatest = aCap.length > 0 ? Math.max(...aCap.map(p => p.capturedAt)) : 0
        const bLatest = bCap.length > 0 ? Math.max(...bCap.map(p => p.capturedAt)) : 0
        return bLatest - aLatest
      })
    } else if (filters.sortBy === 'perfection') {
      result = result.sort((a, b) => b.hp + b.attack + b.defense - (a.hp + a.attack + a.defense))
    }
    // 'dex' default: preserve input order (game dex from usePokemon)

    return result
  }, [pokemon, filters, caughtSpecies, shinySpecies, alphaSpecies, favoriteSpecies, capturedPokemon])
}
