'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePokemon } from '@/hooks/usePokemon'
import { useUIStore } from '@/store/uiStore'
import { useFilters } from '@/hooks/useFilters'
import { usePokemonProgress } from '@/hooks/useCaptureInfo'
import PokemonGrid from '@/components/pokemon/PokemonGrid'
import SearchBar from '@/components/filters/SearchBar'
import FilterSidebar from '@/components/filters/FilterSidebar'
import SortSelector from '@/components/filters/SortSelector'
import { GameType } from '@/types/game'
import { useSyncProgress } from '@/hooks/useSyncProgress'
import { useGameStore } from '@/store/gameStore'
import { getGameTheme } from '@/hooks/useGameTheme'

export default function MainContent() {
  useSyncProgress()
  const searchParams = useSearchParams()
  const gameParam = searchParams.get('game')
  const game = (gameParam === 'arceus' || gameParam === 'zeroA' ? gameParam : undefined) as GameType | undefined
  const [showSections, setShowSections] = useState(false)
  const [mounted, setMounted] = useState(false)
  const setCurrentGame = useGameStore((s) => s.setCurrentGame)
  useEffect(() => { setMounted(true); if (game) setCurrentGame(game) }, [game, setCurrentGame])

  const { pokemon, isLoading, error, totalCount } = usePokemon(game)
  const { filters, setFilter } = useUIStore()
  const filtered = useFilters(pokemon, filters)
  const { totalCaptured, completionPercentage } = usePokemonProgress(totalCount)
  const theme = getGameTheme(game)
  const gameFont = game === 'arceus' ? 'font-serif' : 'font-mono'

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="w-full lg:w-64 lg:shrink-0">
        <FilterSidebar filters={filters} onFilterChange={setFilter} />
      </aside>

      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-col gap-4 mb-6">
          <SearchBar value={filters.searchQuery} onChange={(q) => setFilter('searchQuery', q)} />
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {isLoading ? `${pokemon.length} / ${totalCount || '...'} loaded` : `${filtered.length} Pokémon shown`}
            </div>
            <SortSelector value={filters.sortBy} onChange={(s) => setFilter('sortBy', s)} game={game} />
          </div>

          <div className="bg-secondary/50 border border-border rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-semibold text-foreground ${gameFont}`}>Living Dex Progress</span>
              <span className="text-sm font-mono text-primary">{mounted ? `${totalCaptured} / ${totalCount || '...'}` : '...'}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className={`text-xs text-muted-foreground mt-2 ${gameFont}`}>{completionPercentage}% complete</p>
          </div>
        </div>

        {error && !isLoading && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">Failed to load Pokémon: {error}</p>
          </div>
        )}

        {game && !isLoading && !error && (
          <div className="flex items-center gap-3 px-4 mb-2">
            <span className={`text-sm font-semibold text-foreground ${gameFont}`}>
              {game === 'arceus' ? 'Hisui Pokédex' : 'Kalos Pokédex'}
            </span>
            <span className={`text-xs text-muted-foreground ${gameFont}`}>
              {totalCaptured} / {pokemon.length} caught
            </span>
          </div>
        )}

        <PokemonGrid
          pokemon={filtered}
          game={game}
          showSections={showSections}
          onToggleSections={game ? () => setShowSections(s => !s) : undefined}
          isLoading={isLoading}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}
