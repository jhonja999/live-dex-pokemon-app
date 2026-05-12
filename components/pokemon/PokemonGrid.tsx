'use client'

import { useMemo } from 'react'
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso'
import { PokemonSpecies } from '@/types/pokemon'
import { GameType } from '@/types/game'
import PokemonCard from './PokemonCard'
import { GAME_SECTIONS, getSectionForPokemon, getPokemonTags, TAG_INFO, PokemonTag } from '@/data/pokemonCategories'

interface PokemonGridProps {
  pokemon: PokemonSpecies[]
  game?: GameType
  showSections?: boolean
  onToggleSections?: () => void
}

const CARD_WIDTH = 150
const CARD_GAP = 16

export default function PokemonGrid({ pokemon, game, showSections = false, onToggleSections }: PokemonGridProps) {
  // Group pokemon by sections if needed
  const sections = useMemo(() => {
    if (!game || !showSections) {
      return [{ key: 'all', label: 'All Pokémon', tags: [] as PokemonTag[], priority: 0, pokemon }]
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
  }, [pokemon, game, showSections])

  const flatList = useMemo(() => sections.flatMap(s => s.pokemon), [sections])

  if (pokemon.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        <p>No Pokémon found</p>
      </div>
    )
  }

  if (!showSections || sections.length <= 1) {
    return (
      <div>
        {game && onToggleSections && (
          <div className="px-4 mb-4">
            <button
              onClick={onToggleSections}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Show Sections
            </button>
          </div>
        )}
        <VirtuosoGrid
          totalCount={flatList.length}
          overscan={400}
          itemContent={(index) => (
            <PokemonCard key={flatList[index].id} pokemon={flatList[index]} />
          )}
          listClassName="flex flex-wrap gap-4 px-4"
          itemClassName="flex-none"
          style={{ height: 'calc(100vh - 320px)', minHeight: 400 }}
        />
      </div>
    )
  }

  // Sectioned view using Virtuoso
  if (!game) return null

  return (
    <div>
      {onToggleSections && (
        <div className="px-4 mb-2">
          <button
            onClick={onToggleSections}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Show Living Dex
          </button>
        </div>
      )}

      <Virtuoso
        style={{ height: 'calc(100vh - 320px)', minHeight: 400 }}
        totalCount={sections.reduce((sum, s) => sum + s.pokemon.length + 1, 0)}
        overscan={400}
        itemContent={(index) => {
          let cursor = 0
          for (const section of sections) {
            const headerSize = 1
            const sectionSize = section.pokemon.length + headerSize
            if (index < cursor + sectionSize) {
              const localIndex = index - cursor
              if (localIndex === 0) {
                return (
                  <div className="px-4 mb-4 mt-6">
                    <div className="flex items-center gap-2">
                      {section.tags.length > 0 && (
                        <span className="text-xl">{TAG_INFO[section.tags[0]].icon}</span>
                      )}
                      <h2 className="text-lg font-bold text-foreground">{section.label}</h2>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {section.pokemon.length}
                      </span>
                    </div>
                    {section.tags.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {section.tags.map(t => TAG_INFO[t].description).join(' • ')}
                      </p>
                    )}
                    <div className="border-t border-border mt-2" />
                  </div>
                )
              }
              const poke = section.pokemon[localIndex - 1]
              return (
                <div className="px-4 pb-4">
                  <PokemonCard
                    key={poke.id}
                    pokemon={poke}
                    tags={getPokemonTags(game, poke.id).map(t => TAG_INFO[t].label)}
                  />
                </div>
              )
            }
            cursor += sectionSize
          }
          return null
        }}
      />
    </div>
  )
}
