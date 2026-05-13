'use client'

import { useMemo } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { PokemonSpecies } from '@/types/pokemon'
import { GameType } from '@/types/game'
import PokemonCard from './PokemonCard'
import PokemonSkeletonCard from './PokemonSkeleton'
import { GAME_SECTIONS, getSectionForPokemon, getPokemonTags, TAG_INFO, PokemonTag } from '@/data/pokemonCategories'
import { getGameTheme, GameTheme } from '@/hooks/useGameTheme'

interface PokemonGridProps {
  pokemon: PokemonSpecies[]
  game?: GameType
  showSections?: boolean
  onToggleSections?: () => void
  isLoading?: boolean
  totalCount?: number
}

const COLUMNS = 3
const FALLBACK_SKELETON_COUNT = 30

function HeaderRow({ section, label, tags, count, theme }: { section: string; label: string; tags: PokemonTag[]; count: number; theme: GameTheme }) {
  return (
    <div className={theme.header}>
      <div className="flex items-center gap-2">
        {tags.length > 0 && (
          <span className="text-sm">{TAG_INFO[tags[0]].icon}</span>
        )}
        <h2 className="text-sm font-bold truncate">{section === 'other' ? 'Other Pokémon' : label}</h2>
        <span className="text-xs ml-auto opacity-70">{count}</span>
      </div>
      {tags.length > 0 && (
        <p className="text-[10px] opacity-60 mt-0.5 truncate">
          {tags.map(t => TAG_INFO[t].description).join(' • ')}
        </p>
      )}
    </div>
  )
}

export default function PokemonGrid({ pokemon, game, showSections = false, onToggleSections, isLoading, totalCount }: PokemonGridProps) {
  const theme = getGameTheme(game)
  const gridStyle = { height: 'calc(100vh - 320px)', minHeight: 400 } as const
  const gridGap = theme.grid.includes('gap-1.5') ? 'mb-1.5' : 'mb-1'
  const gapClass = theme.grid.includes('gap-1.5') ? 'gap-1.5' : 'gap-1'
  const showFab = !!onToggleSections

  const totalSlots = totalCount || pokemon.length || FALLBACK_SKELETON_COUNT

  // --- Build sections (only when fully loaded) ---
  const sections = useMemo(() => {
    if (isLoading || !game || !showSections) {
      return [{ key: 'all' as string, label: 'All Pokémon', tags: [] as PokemonTag[], priority: 0, pokemon }]
    }

    const sectionDefs = GAME_SECTIONS[game]
    const grouped = new Map<string, PokemonSpecies[]>()
    sectionDefs.forEach(s => grouped.set(s.key, []))

    for (const p of pokemon) {
      const sectionKey = getSectionForPokemon(game, p.id)
      if (!grouped.has(sectionKey)) grouped.set(sectionKey, [])
      grouped.get(sectionKey)!.push(p)
    }

    return sectionDefs
      .filter(s => (grouped.get(s.key)?.length ?? 0) > 0)
      .map(s => ({ ...s, pokemon: grouped.get(s.key) ?? [] }))
  }, [pokemon, game, showSections, isLoading])

  // --- Flatten into renderable rows (headers + mixed real/skeleton rows) ---
  const renderQueue = useMemo(() => {
    if (!game || !showSections || sections.length <= 1 || isLoading) {
      // Build flat item array: real data at sorted positions, null for unloaded slots
      const items: (PokemonSpecies | null)[] = new Array(totalSlots).fill(null)
      for (let i = 0; i < pokemon.length; i++) {
        items[i] = pokemon[i]
      }

      const rows: Array<{ type: 'pokemon-row'; items: (PokemonSpecies | null)[] }> = []
      for (let i = 0; i < items.length; i += COLUMNS) {
        rows.push({ type: 'pokemon-row' as const, items: items.slice(i, i + COLUMNS) })
      }
      return rows
    }

    // Sectioned view: full data only
    const items: Array<
      { type: 'section-header'; sectionKey: string; label: string; tags: PokemonTag[]; count: number }
      | { type: 'pokemon-row'; items: PokemonSpecies[] }
    > = []

    for (const section of sections) {
      items.push({
        type: 'section-header',
        sectionKey: section.key,
        label: section.label,
        tags: section.tags,
        count: section.pokemon.length,
      })
      for (let i = 0; i < section.pokemon.length; i += COLUMNS) {
        items.push({ type: 'pokemon-row', items: section.pokemon.slice(i, i + COLUMNS) })
      }
    }

    return items
  }, [pokemon, game, showSections, sections, isLoading, totalSlots])

  // --- Empty state ---
  if (pokemon.length === 0 && !isLoading) {
    return (
      <div className={`flex items-center justify-center h-96 ${theme.container}`}>
        <p className="text-sm opacity-50">No Pokémon found</p>
      </div>
    )
  }

  // --- Render ---
  const isSectionView = game && showSections && !isLoading && sections.length > 1

  return (
    <div className={theme.container}>
      <Virtuoso
        totalCount={renderQueue.length}
        overscan={400}
        itemContent={(index) => {
          const item = renderQueue[index]
          if (item.type === 'section-header') {
            return (
              <HeaderRow
                section={item.sectionKey}
                label={item.label}
                tags={item.tags}
                count={item.count}
                theme={theme}
              />
            )
          }

          const showTags = isSectionView
          return (
            <div className={`grid grid-cols-3 ${gapClass} px-2 ${gridGap}`}>
              {item.items.map((p, colIdx) => {
                const key = p ? p.id : `skel-${index}-${colIdx}`
                if (p) {
                  const tags = showTags ? getPokemonTags(game, p.id).map(t => TAG_INFO[t].label) : undefined
                  return <PokemonCard key={key} pokemon={p} game={game} tags={tags} />
                }
                return <PokemonSkeletonCard key={key} colorClass={theme.skeleton} />
              })}
            </div>
          )
        }}
        style={gridStyle}
      />

      {/* FAB - Toggle Sections */}
      {showFab && !isLoading && (
        <button
          onClick={onToggleSections}
          className={`fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${theme.fab}`}
          title={showSections ? 'Show Living Dex' : 'Show Sections'}
        >
          {showSections ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          )}
        </button>
      )}
    </div>
  )
}
