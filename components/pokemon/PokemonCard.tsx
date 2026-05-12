'use client'

import { memo, useCallback } from 'react'
import Link from 'next/link'
import { PokemonSpecies } from '@/types/pokemon'
import { usePokemonStore } from '@/store/pokemonStore'
import { TYPE_COLORS } from '@/lib/designTokens'
import { Badge } from '@/components/ui/badge'
import { getRecommendedNature, getTypeEffectivenessSummary } from '@/data/natureRecommendations'

interface PokemonCardProps {
  pokemon: PokemonSpecies
  onClick?: () => void
  tags?: string[]
}

function PokemonCardComponent({ pokemon, onClick, tags }: PokemonCardProps) {
  const toggleCaughtSpecies = usePokemonStore((s) => s.toggleCaughtSpecies)
  const isRevealed = usePokemonStore((s) => s.caughtSpecies.includes(pokemon.id))
  const isShiny = usePokemonStore((s) => s.shinySpecies.includes(pokemon.id))
  const isAlpha = usePokemonStore((s) => s.alphaSpecies.includes(pokemon.id))
  const isMega = usePokemonStore((s) => s.megaSpecies.includes(pokemon.id))
  const type1Color = TYPE_COLORS[pokemon.type1]
  const type2Color = pokemon.type2 ? TYPE_COLORS[pokemon.type2] : null

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCaughtSpecies(pokemon.id)
  }, [pokemon.id, toggleCaughtSpecies])

  if (!isRevealed) {
    const nature = getRecommendedNature(pokemon)
    const typeEffectiveness = getTypeEffectivenessSummary(pokemon)

    return (
      <div
        onDoubleClick={handleDoubleClick}
        className="border border-dashed border-border/50 rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full flex flex-col select-none"
      >
        {/* Silhouette Sprite */}
        <div className="flex justify-center mb-4 h-32 bg-secondary/5 rounded-md flex-shrink-0 relative overflow-hidden">
          <img
            src={pokemon.icon}
            alt=""
            className="object-contain opacity-20 grayscale brightness-0 invert"
            draggable={false}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl text-muted-foreground/30 font-bold">?</span>
          </div>
        </div>

        {/* ID & Hidden Name */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground/50">#{pokemon.id.toString().padStart(3, '0')}</p>
          <h3 className="font-bold text-foreground/40 truncate">???</h3>
        </div>

        {/* Type badges dimmed */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <Badge variant="secondary" className="bg-secondary/20 text-muted-foreground/40 border-border/20">
            ???
          </Badge>
          {pokemon.type2 && (
            <Badge variant="secondary" className="bg-secondary/20 text-muted-foreground/40 border-border/20">
              ???
            </Badge>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex gap-1 mb-3 flex-wrap">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-muted-foreground/40">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Capture Info */}
        <div className="mt-auto space-y-1.5 text-xs">
          {/* Best Nature */}
          <div className="bg-secondary/10 rounded px-2 py-1.5">
            <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wide font-semibold">Best Nature</span>
            <div className="text-foreground/70 font-medium">{nature.label}</div>
            <div className="text-muted-foreground/50 text-[10px]">{nature.reasoning}</div>
          </div>

          {/* Type Matchups */}
          <div className="space-y-1.5">
            {typeEffectiveness.strong.length > 0 && (
              <div>
                <span className="text-[10px] text-green-500/60 font-semibold">Strong vs</span>
                <div className="flex gap-1 flex-wrap mt-0.5">
                  {typeEffectiveness.strong.slice(0, 5).map(t => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-sm"
                      style={{
                        backgroundColor: (TYPE_COLORS[t]?.bg || '#888') + '50',
                      }}
                      title={t}
                    >
                      <img
                        src={`/types/${t.toLowerCase()}.svg`}
                        alt={t}
                        width={12}
                        height={12}
                        className="flex-shrink-0"
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
            {typeEffectiveness.weak.length > 0 && (
              <div>
                <span className="text-[10px] text-red-400/60 font-semibold">Weak to</span>
                <div className="flex gap-1 flex-wrap mt-0.5">
                  {typeEffectiveness.weak.slice(0, 5).map(t => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-sm"
                      style={{
                        backgroundColor: (TYPE_COLORS[t]?.bg || '#888') + '50',
                      }}
                      title={t}
                    >
                      <img
                        src={`/types/${t.toLowerCase()}.svg`}
                        alt={t}
                        width={12}
                        height={12}
                        className="flex-shrink-0"
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hint */}
          <div className="text-[10px] text-muted-foreground/30 text-center pt-1">
            Double-click to reveal
          </div>
        </div>
      </div>
    )
  }

  const revealedContent = (
    <div
      onDoubleClick={handleDoubleClick}
      className={`border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col ${
        isRevealed
          ? 'border-primary bg-primary/5'
          : 'border-border bg-surface hover:border-primary'
      }`}
    >
      {/* Captured Badge */}
      <div className="flex items-center justify-between mb-2">
        <Badge className="bg-primary text-primary-foreground">
          ✓ Captured
        </Badge>
        <div className="flex gap-1">
          {isShiny && <span className="text-yellow-400 text-xs" title="Shiny caught">✨</span>}
          {isAlpha && <span className="text-orange-400 text-xs" title="Alpha caught">🔆</span>}
          {isMega && <span className="text-purple-400 text-xs" title="Mega caught">💎</span>}
        </div>
      </div>

      {/* Sprite */}
      <div className="flex justify-center mb-4 h-32 bg-secondary/10 rounded-md flex-shrink-0">
        <img
          src={pokemon.icon}
          alt={pokemon.name}
          className="object-contain"
          draggable={false}
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>

      {/* Name & ID */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground">#{pokemon.id.toString().padStart(3, '0')}</p>
        <h3 className="font-bold text-foreground truncate">{pokemon.name}</h3>
      </div>

      {/* Types */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <Badge
          variant="secondary"
          className="flex items-center gap-1"
          style={{
            backgroundColor: type1Color?.bg,
            color: type1Color?.text,
            border: `1px solid ${type1Color?.border}`,
          }}
        >
          <img src={`/types/${pokemon.type1.toLowerCase()}.svg`} alt="" width={14} height={14} className="flex-shrink-0" />
          {pokemon.type1}
        </Badge>
        {pokemon.type2 && type2Color && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1"
            style={{
              backgroundColor: type2Color.bg,
              color: type2Color.text,
              border: `1px solid ${type2Color.border}`,
            }}
          >
            <img src={`/types/${pokemon.type2.toLowerCase()}.svg`} alt="" width={14} height={14} className="flex-shrink-0" />
            {pokemon.type2}
          </Badge>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex gap-1 mb-3 flex-wrap">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/50 text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="text-xs text-muted-foreground space-y-1 mt-auto">
        <div className="flex justify-between">
          <span>HP</span>
          <span className="font-mono">{pokemon.hp}</span>
        </div>
        <div className="flex justify-between">
          <span>Atk/Sp</span>
          <span className="font-mono">{pokemon.attack}/{pokemon.spAtk}</span>
        </div>
      </div>
    </div>
  )

  return (
    <Link href={`/${pokemon.id}`}>
      {revealedContent}
    </Link>
  )
}

export default memo(PokemonCardComponent)
