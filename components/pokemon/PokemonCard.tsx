'use client'

import { memo, useCallback } from 'react'
import Link from 'next/link'
import { PokemonSpecies } from '@/types/pokemon'
import { GameType } from '@/types/game'
import { usePokemonStore } from '@/store/pokemonStore'
import { TYPE_COLORS } from '@/lib/designTokens'
import { Badge } from '@/components/ui/badge'
import { getRecommendedNature, getTypeEffectivenessSummary } from '@/data/natureRecommendations'
import { getGameTheme } from '@/hooks/useGameTheme'

interface PokemonCardProps {
  pokemon: PokemonSpecies
  game?: GameType
  tags?: string[]
}

function PokemonCardComponent({ pokemon, game, tags }: PokemonCardProps) {
  const toggleCaughtSpecies = usePokemonStore((s) => s.toggleCaughtSpecies)
  const toggleFavorite = usePokemonStore((s) => s.toggleFavorite)
  const isCaught = usePokemonStore((s) => s.caughtSpecies.includes(pokemon.id))
  const isShiny = usePokemonStore((s) => s.shinySpecies.includes(pokemon.id))
  const isAlpha = usePokemonStore((s) => s.alphaSpecies.includes(pokemon.id))
  const isMega = usePokemonStore((s) => s.megaSpecies.includes(pokemon.id))
  const isFavorite = usePokemonStore((s) => s.favoriteSpecies.includes(pokemon.id))

  const theme = getGameTheme(game)
  const slot = theme.card
  const type1Color = TYPE_COLORS[pokemon.type1]
  const type2Color = pokemon.type2 ? TYPE_COLORS[pokemon.type2] : null

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCaughtSpecies(pokemon.id)
  }, [pokemon.id, toggleCaughtSpecies])

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(pokemon.id)
  }, [pokemon.id, toggleFavorite])

  // --- Uncaught state: preview with nature + type info ---
  if (!isCaught) {
    const nature = getRecommendedNature(pokemon)
    const typeEffectiveness = getTypeEffectivenessSummary(pokemon)

    return (
      <div
        onDoubleClick={handleDoubleClick}
        className={`${slot.wrapper} relative overflow-hidden flex flex-col cursor-pointer select-none`}
      >
        {/* Favorite star */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-0.5 left-0.5 z-20 text-sm transition-opacity ${isFavorite ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
        >
          {isFavorite ? '★' : '☆'}
        </button>

        {/* Silhouette */}
        <div className="flex-1 flex items-center justify-center p-1.5 overflow-hidden">
          <div className={`${slot.imageContainer} opacity-40`}>
            <img
              src={pokemon.icon}
              alt=""
              className="object-contain max-h-full max-w-full grayscale brightness-0 invert"
              draggable={false}
            />
          </div>
          <span className="absolute text-2xl font-bold text-foreground/10 select-none">?</span>
        </div>

        {/* Label strip */}
        <div className={slot.label}>??? #{pokemon.id.toString().padStart(3, '0')}</div>

        {/* Info preview */}
        <div className="px-1.5 py-1 space-y-1 text-[9px]">
          {/* Type badges dimmed */}
          <div className="flex gap-1">
            <Badge variant="secondary" className="bg-secondary/20 text-muted-foreground/40 border-border/20 text-[8px] h-4 px-1.5">
              ???
            </Badge>
            {pokemon.type2 && (
              <Badge variant="secondary" className="bg-secondary/20 text-muted-foreground/40 border-border/20 text-[8px] h-4 px-1.5">
                ???
              </Badge>
            )}
          </div>

          {/* Best Nature */}
          <div className="text-muted-foreground/50 leading-tight">
            <span className="font-semibold text-muted-foreground/60">{nature.label}</span>
          </div>

          {/* Type matchups */}
          <div className="flex items-center gap-1.5">
            {typeEffectiveness.strong.length > 0 && (
              <div className="flex items-center gap-0.5">
                <span className="text-[7px] text-green-500/60">+</span>
                {typeEffectiveness.strong.slice(0, 3).map(t => (
                  <img key={t} src={`/types/${t.toLowerCase()}.svg`} alt={t} title={t} width={10} height={10} className="opacity-60" />
                ))}
              </div>
            )}
            {typeEffectiveness.weak.length > 0 && (
              <div className="flex items-center gap-0.5">
                <span className="text-[7px] text-red-400/60">-</span>
                {typeEffectiveness.weak.slice(0, 3).map(t => (
                  <img key={t} src={`/types/${t.toLowerCase()}.svg`} alt={t} title={t} width={10} height={10} className="opacity-60" />
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags.map(tag => (
                <span key={tag} className="text-[7px] px-1 py-0.5 rounded bg-secondary/20 text-muted-foreground/40">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Hint */}
          <div className="text-[7px] text-muted-foreground/20 text-center pt-0.5 leading-none">
            Double-click to reveal
          </div>
        </div>
      </div>
    )
  }

  // --- Caught state: full reveal with stats ---
  const content = (
    <div
      onDoubleClick={handleDoubleClick}
      className={`${slot.wrapper} relative overflow-hidden flex flex-col cursor-pointer`}
    >
      {/* Favorite star */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-0.5 left-0.5 z-20 text-sm transition-opacity ${isFavorite ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
        >
          {isFavorite ? '★' : '☆'}
        </button>

        {/* Variant indicators */}
      <div className="absolute top-0.5 right-0.5 z-20 flex gap-0.5">
        {isShiny && <span className="text-yellow-400 text-[10px]" title="Shiny">✨</span>}
        {isAlpha && <span className="text-orange-400 text-[10px]" title="Alpha">🔆</span>}
        {isMega && <span className="text-purple-400 text-[10px]" title="Mega">💎</span>}
      </div>

      {/* Sprite */}
      <div className="flex-1 flex items-center justify-center p-1.5 overflow-hidden">
        <div className={slot.imageContainer}>
          <img
            src={pokemon.artwork || pokemon.icon}
            alt={pokemon.name}
            className="object-contain max-h-full max-w-full"
            draggable={false}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      </div>

      {/* Label strip */}
      <div className={slot.label}>{pokemon.name}</div>

      {/* Stats + Types */}
      <div className="px-1.5 py-1 space-y-1 text-[9px]">
        {/* Type badges */}
        <div className="flex gap-1">
          <Badge
            className="h-4 px-1.5 text-[8px] flex items-center gap-0.5"
            style={{
              backgroundColor: type1Color?.bg,
              color: type1Color?.text,
              border: `1px solid ${type1Color?.border}`,
            }}
          >
            <img src={`/types/${pokemon.type1.toLowerCase()}.svg`} alt="" width={9} height={9} />
            <span>{pokemon.type1}</span>
          </Badge>
          {pokemon.type2 && type2Color && (
            <Badge
              className="h-4 px-1.5 text-[8px] flex items-center gap-0.5"
              style={{
                backgroundColor: type2Color.bg,
                color: type2Color.text,
                border: `1px solid ${type2Color.border}`,
              }}
            >
              <img src={`/types/${pokemon.type2.toLowerCase()}.svg`} alt="" width={9} height={9} />
              <span>{pokemon.type2}</span>
            </Badge>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {tags.map(tag => (
              <span key={tag} className="text-[7px] px-1 py-0.5 rounded bg-secondary/50 text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats summary */}
        <div className="flex gap-2 text-muted-foreground font-mono">
          <span>HP {pokemon.hp}</span>
          <span>Atk {pokemon.attack}</span>
          <span>Sp {pokemon.spAtk}</span>
        </div>
      </div>
    </div>
  )

  return (
    <Link href={`/${pokemon.id}`}>
      {content}
    </Link>
  )
}

export default memo(PokemonCardComponent)
