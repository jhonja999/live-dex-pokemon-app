'use client'

import { useMemo } from 'react'
import { PokemonSpecies } from '@/types/pokemon'
import { FilterState } from '@/types/ui'

export function useFilters(pokemon: PokemonSpecies[], filters: FilterState) {
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

    // Legendary/Mythical filter
    if (filters.sortBy === 'perfection') {
      // This will be enhanced in Phase 4 with actual perfect score
      result = result.sort((a, b) => b.hp + b.attack + b.defense - (a.hp + a.attack + a.defense))
    } else if (filters.sortBy === 'dex') {
      result = result.sort((a, b) => a.id - b.id)
    } else if (filters.sortBy === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [pokemon, filters])
}
