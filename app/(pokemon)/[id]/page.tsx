'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchPokemonSpecies, fetchPokemonMoves } from '@/lib/pokeapi'
import { usePokemonStore } from '@/store/pokemonStore'
import { useGameStore } from '@/store/gameStore'
import { PokemonSpecies, PokemonInstance, StatName } from '@/types/pokemon'
import { v4 as uuidv4 } from 'uuid'
import { TYPE_COLORS } from '@/lib/designTokens'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

const ALL_NATURES = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky',
]

const NATURE_EFFECTS: Record<string, { increased: StatName; decreased: StatName }> = {
  Hardy: { increased: 'atk', decreased: 'atk' }, Lonely: { increased: 'atk', decreased: 'def' },
  Brave: { increased: 'atk', decreased: 'spe' }, Adamant: { increased: 'atk', decreased: 'spAtk' },
  Naughty: { increased: 'atk', decreased: 'spDef' }, Bold: { increased: 'def', decreased: 'atk' },
  Docile: { increased: 'def', decreased: 'def' }, Relaxed: { increased: 'def', decreased: 'spe' },
  Impish: { increased: 'def', decreased: 'spAtk' }, Lax: { increased: 'def', decreased: 'spDef' },
  Timid: { increased: 'spe', decreased: 'atk' }, Hasty: { increased: 'spe', decreased: 'def' },
  Serious: { increased: 'spe', decreased: 'spe' }, Jolly: { increased: 'spe', decreased: 'spAtk' },
  Naive: { increased: 'spe', decreased: 'spDef' }, Modest: { increased: 'spAtk', decreased: 'atk' },
  Mild: { increased: 'spAtk', decreased: 'def' }, Quiet: { increased: 'spAtk', decreased: 'spe' },
  Bashful: { increased: 'spAtk', decreased: 'spAtk' }, Rash: { increased: 'spAtk', decreased: 'spDef' },
  Calm: { increased: 'spDef', decreased: 'atk' }, Gentle: { increased: 'spDef', decreased: 'def' },
  Sassy: { increased: 'spDef', decreased: 'spe' }, Careful: { increased: 'spDef', decreased: 'spAtk' },
  Quirky: { increased: 'spDef', decreased: 'spDef' },
}

const STAT_ORDER: StatName[] = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spe']
const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP', atk: 'Attack', def: 'Defense', spAtk: 'Sp.Atk', spDef: 'Sp.Def', spe: 'Speed',
}

function isNeutralNature(name: string): boolean {
  const effect = NATURE_EFFECTS[name]
  return effect.increased === effect.decreased
}

export default function PokemonDetailPage() {
  const params = useParams()
  const [pokemon, setPokemon] = useState<PokemonSpecies | null>(null)
  const [moves, setMoves] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentGame = useGameStore((s) => s.currentGame)
  const caughtSpecies = usePokemonStore((s) => s.caughtSpecies)
  const shinySpecies = usePokemonStore((s) => s.shinySpecies)
  const alphaSpecies = usePokemonStore((s) => s.alphaSpecies)
  const megaSpecies = usePokemonStore((s) => s.megaSpecies)
  const capturedPokemon = usePokemonStore((s) => s.capturedPokemon)
  const toggleCaughtSpecies = usePokemonStore((s) => s.toggleCaughtSpecies)
  const toggleShiny = usePokemonStore((s) => s.toggleShiny)
  const toggleAlpha = usePokemonStore((s) => s.toggleAlpha)
  const toggleMega = usePokemonStore((s) => s.toggleMega)
  const addPokemon = usePokemonStore((s) => s.addPokemon)
  const removePokemon = usePokemonStore((s) => s.removePokemon)

  const [selectedNature, setSelectedNature] = useState('Hardy')
  const [ivs, setIvs] = useState<Record<StatName, number>>({
    hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0,
  })
  const [newLevel, setNewLevel] = useState(50)
  const [newIsShiny, setNewIsShiny] = useState(false)
  const [newIsAlpha, setNewIsAlpha] = useState(false)
  const [newIsMega, setNewIsMega] = useState(false)

  const speciesCaptures = capturedPokemon.filter(p => p.speciesId === speciesId)

  useEffect(() => {
    let isMounted = true

    const loadPokemon = async () => {
      try {
        const id = parseInt(params.id as string)
        const data = await fetchPokemonSpecies(id)

        if (isMounted) {
          if (data) {
            setPokemon(data)
            const pokemonMoves = await fetchPokemonMoves(id)
            setMoves(pokemonMoves.filter((m: any) => m.learnMethod === 'level-up').slice(0, 16))
          } else {
            setError('Pokémon not found')
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load Pokémon')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPokemon()

    return () => {
      isMounted = false
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="space-y-3">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
          <p className="text-muted-foreground">Loading Pokémon details...</p>
        </div>
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error || 'Pokémon not found'}</p>
        <Link href="/main">
          <Button>Back to Pokédex</Button>
        </Link>
      </div>
    )
  }

  const speciesId = pokemon.id
  const type1Color = TYPE_COLORS[pokemon.type1]
  const type2Color = pokemon.type2 ? TYPE_COLORS[pokemon.type2] : null
  const natureEffect = NATURE_EFFECTS[selectedNature]
  const isCaught = caughtSpecies.includes(speciesId)
  const isShinyCaught = shinySpecies.includes(speciesId)
  const isAlphaCaught = alphaSpecies.includes(speciesId)
  const isMegaCaught = megaSpecies.includes(speciesId)
  const isArceus = currentGame === 'arceus'

  const handleToggleCaught = () => {
    if (isCaught) {
      // Unmark: remove all captures + clear variants
      speciesCaptures.forEach(c => removePokemon(c.id))
      if (isShinyCaught) toggleShiny(speciesId)
      if (isAlphaCaught) toggleAlpha(speciesId)
      if (isMegaCaught) toggleMega(speciesId)
      toggleCaughtSpecies(speciesId)
    } else {
      // Mark as caught: add default capture + toggle
      addPokemon({
        id: uuidv4(),
        speciesId,
        boxId: 'box-1',
        level: 50,
        isShiny: false,
        gender: 'male' as const,
        iv: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
        ev: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
        nature: 'Hardy',
        ability: pokemon?.abilities[0] || 'Unknown',
        moves: [],
        capturedAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
      })
      toggleCaughtSpecies(speciesId)
    }
  }

  const handleRemoveCapture = (id: string) => {
    removePokemon(id)
    const remaining = capturedPokemon.filter(p => p.speciesId === speciesId && p.id !== id)
    if (remaining.length === 0) {
      toggleCaughtSpecies(speciesId)
    }
  }

  const handleAddCapture = () => {
    let form: string | undefined
    if (newIsAlpha) form = 'alpha'
    else if (newIsMega) form = 'mega'

    addPokemon({
      id: uuidv4(),
      speciesId,
      boxId: 'box-1',
      level: newLevel,
      isShiny: newIsShiny,
      form,
      gender: 'male' as const,
      iv: { ...ivs },
      ev: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
      nature: selectedNature,
      ability: pokemon?.abilities[0] || 'Unknown',
      moves: [],
      capturedAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
    })
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link href={`/main?game=${currentGame}`} className="text-primary hover:underline mb-6 inline-block">
        ← Back to Pokédex
      </Link>

      <div className="bg-surface border border-border rounded-lg p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              #{speciesId.toString().padStart(3, '0')}
            </p>
            <h1 className="text-4xl font-bold text-foreground">{pokemon.name}</h1>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1"
              style={{
                backgroundColor: type1Color?.bg,
                color: type1Color?.text,
                border: `1px solid ${type1Color?.border}`,
              }}
            >
              <img src={`/types/${pokemon.type1.toLowerCase()}.svg`} alt="" width={16} height={16} className="flex-shrink-0" />
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
                <img src={`/types/${pokemon.type2.toLowerCase()}.svg`} alt="" width={16} height={16} className="flex-shrink-0" />
                {pokemon.type2}
              </Badge>
            )}
          </div>
        </div>

        {/* Artwork */}
        <div className="flex justify-center mb-8 h-64 bg-secondary/10 rounded-lg relative">
          <img
            src={pokemon.artwork || pokemon.icon}
            alt={pokemon.name}
            className={`object-contain ${!isCaught ? 'opacity-20 grayscale brightness-0 invert' : ''}`}
          />
          {!isCaught && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl text-muted-foreground/20 font-bold">?</span>
            </div>
          )}
        </div>

        {/* Caught Status + Variant Toggles */}
        <div className="mb-8 p-4 border border-border rounded-lg bg-secondary/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Status</h3>
            <Badge className={isCaught ? 'bg-green-600' : 'bg-muted-foreground/30'}>
              {isCaught ? '✓ Caught' : 'Not caught'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Caught toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={isCaught} onCheckedChange={handleToggleCaught} />
              <span className="text-sm">{isCaught ? 'Mark as not caught' : 'Mark as caught'}</span>
            </label>

            {/* Shiny (both games) */}
            <label className={`flex items-center gap-2 ${isCaught ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}>
              <Checkbox
                checked={isShinyCaught}
                disabled={!isCaught}
                onCheckedChange={() => toggleShiny(speciesId)}
              />
              <span className="text-sm">✨ Shiny{!isCaught && ' (mark as caught first)'}</span>
            </label>

            {/* Alpha (Arceus only) */}
            {isArceus && (
              <label className={`flex items-center gap-2 ${isCaught ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}>
                <Checkbox
                  checked={isAlphaCaught}
                  disabled={!isCaught}
                  onCheckedChange={() => toggleAlpha(speciesId)}
                />
                <span className="text-sm">🔆 Alpha{!isCaught && ' (mark as caught first)'}</span>
              </label>
            )}

            {/* Mega (Z-A only) */}
            {!isArceus && (
              <label className={`flex items-center gap-2 ${isCaught ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}>
                <Checkbox
                  checked={isMegaCaught}
                  disabled={!isCaught}
                  onCheckedChange={() => toggleMega(speciesId)}
                />
                <span className="text-sm">💎 Mega{!isCaught && ' (mark as caught first)'}</span>
              </label>
            )}
          </div>

          {/* Show variant badges when caught */}
          {isCaught && (
            <div className="flex gap-2 mt-3">
              {isShinyCaught && <Badge variant="outline" className="text-yellow-500 border-yellow-500">✨ Shiny</Badge>}
              {isAlphaCaught && <Badge variant="outline" className="text-orange-500 border-orange-500">🔆 Alpha</Badge>}
              {isMegaCaught && <Badge variant="outline" className="text-purple-500 border-purple-500">💎 Mega</Badge>}
            </div>
          )}
        </div>

        {/* Your Captures */}
        <div className="mb-8 p-4 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">📦 Your Captures ({speciesCaptures.length})</h3>

          {/* Capture list */}
          {speciesCaptures.length > 0 && (
            <div className="space-y-2 mb-4">
              {speciesCaptures.map((cap) => (
                <div key={cap.id} className="flex items-center justify-between p-2 rounded bg-secondary/10 border border-border/50">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-medium text-foreground">Lv.{cap.level}</span>
                    <Badge variant="outline" className="text-[10px]">{cap.nature}</Badge>
                    <div className="flex gap-0.5">
                      {STAT_ORDER.map(s => (
                        <span key={s} className={`font-mono w-5 text-center ${cap.iv[s] >= 31 ? 'text-green-400' : cap.iv[s] >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {cap.iv[s]}
                        </span>
                      ))}
                    </div>
                    {cap.isShiny && <span className="text-yellow-400">✨</span>}
                    {cap.form === 'alpha' && <span className="text-orange-400">🔆</span>}
                    {cap.form === 'mega' && <span className="text-purple-400">💎</span>}
                  </div>
                  <button
                    onClick={() => handleRemoveCapture(cap.id)}
                    className="text-muted-foreground hover:text-destructive text-xs ml-2"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new capture form */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground mb-3">Add a capture</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Label className="text-[10px] text-muted-foreground">Nature</Label>
                <Select value={selectedNature} onValueChange={setSelectedNature}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_NATURES.map(n => (
                      <SelectItem key={n} value={n} className="text-xs">{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Level</Label>
                <Input type="number" min={1} max={100} value={newLevel}
                  onChange={e => setNewLevel(parseInt(e.target.value) || 1)}
                  className="w-full h-8 text-xs"
                />
              </div>
            </div>

            {/* IVs row */}
            <div className="mb-3">
              <Label className="text-[10px] text-muted-foreground mb-1 block">IVs</Label>
              <div className="grid grid-cols-6 gap-1">
                {STAT_ORDER.map(stat => (
                  <div key={stat}>
                    <Label className="text-[8px] text-muted-foreground block text-center">{STAT_LABELS[stat]}</Label>
                    <Input type="number" min={0} max={31} value={ivs[stat]}
                      onChange={e => setIvs(prev => ({ ...prev, [stat]: Math.min(31, Math.max(0, parseInt(e.target.value) || 0)) }))}
                      className="w-full h-7 text-xs text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Variant checkboxes */}
            <div className="flex flex-wrap gap-3 mb-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox checked={newIsShiny} onCheckedChange={(v) => setNewIsShiny(v === true)} />
                <span className="text-xs">✨ Shiny</span>
              </label>
              {isArceus && (
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox checked={newIsAlpha} onCheckedChange={(v) => setNewIsAlpha(v === true)} />
                  <span className="text-xs">🔆 Alpha</span>
                </label>
              )}
              {!isArceus && (
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox checked={newIsMega} onCheckedChange={(v) => setNewIsMega(v === true)} />
                  <span className="text-xs">💎 Mega</span>
                </label>
              )}
            </div>

            <Button onClick={handleAddCapture} size="sm" className="w-full">
              + Add Capture
            </Button>
          </div>
        </div>

        {/* Nature & IV Reference */}
        <div className="mb-8 p-4 border border-primary/30 rounded-lg bg-primary/5">
          <h3 className="font-semibold text-foreground mb-4">📋 Reference: Nature & IVs</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Best Nature</Label>
              <Select value={selectedNature} onValueChange={setSelectedNature}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select nature" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_NATURES.map(n => (
                    <SelectItem key={n} value={n}>
                      {n} {!isNeutralNature(n) && `(+${STAT_LABELS[NATURE_EFFECTS[n].increased]} -${STAT_LABELS[NATURE_EFFECTS[n].decreased]})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isNeutralNature(selectedNature) && (
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-green-500 font-medium">↑ {STAT_LABELS[natureEffect.increased]}</span>
                  <span className="text-red-400 font-medium">↓ {STAT_LABELS[natureEffect.decreased]}</span>
                </div>
              )}
            </div>
          </div>

          {/* IV Reference */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">IV Calculator (0-31)</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {STAT_ORDER.map(stat => (
                <div key={stat}>
                  <Label className="text-[10px] text-muted-foreground">{STAT_LABELS[stat]}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={31}
                    value={ivs[stat]}
                    onChange={e => {
                      const val = Math.min(31, Math.max(0, parseInt(e.target.value) || 0))
                      setIvs(prev => ({ ...prev, [stat]: val }))
                    }}
                    className="w-full text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compare with Perfect */}
        <div className="mb-8 p-4 border border-border rounded-lg bg-secondary/5">
          <h3 className="font-semibold text-foreground mb-3">⚖️ Compare with Perfect</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Stat</th>
                  <th className="text-center py-2 text-muted-foreground font-medium">Base</th>
                  <th className="text-center py-2 text-blue-400 font-medium">Your IV</th>
                  <th className="text-center py-2 text-green-400 font-medium">Perfect IV</th>
                  <th className="text-center py-2 text-muted-foreground font-medium">Nature</th>
                </tr>
              </thead>
              <tbody>
                {STAT_ORDER.map(stat => {
                  const baseValue = pokemon[stat as keyof typeof pokemon] as number
                  const yourIV = ivs[stat]
                  const isBoosted = natureEffect.increased === stat && !isNeutralNature(selectedNature)
                  const isHindered = natureEffect.decreased === stat && !isNeutralNature(selectedNature)

                  return (
                    <tr key={stat} className="border-b border-border/50">
                      <td className="py-2 font-medium">
                        {STAT_LABELS[stat]}
                        {isBoosted && <span className="text-green-500 ml-1">↑</span>}
                        {isHindered && <span className="text-red-400 ml-1">↓</span>}
                      </td>
                      <td className="text-center py-2 text-muted-foreground">{baseValue}</td>
                      <td className={`text-center py-2 font-mono ${yourIV === 31 ? 'text-green-400' : yourIV >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {yourIV}
                      </td>
                      <td className="text-center py-2 font-mono text-green-400">31</td>
                      <td className="text-center py-2 text-xs">
                        {isBoosted && <span className="text-green-500/70">×1.1</span>}
                        {isHindered && <span className="text-red-400/70">×0.9</span>}
                        {!isBoosted && !isHindered && <span className="text-muted-foreground/50">×1.0</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Base Stats */}
        <div className="mb-8">
          <h3 className="font-semibold text-foreground mb-3">Base Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STAT_ORDER.map(stat => (
              <div key={stat} className="border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">{STAT_LABELS[stat]}</p>
                <p className="text-2xl font-bold text-foreground">{pokemon[stat as keyof typeof pokemon] as number}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <Badge key={ability} variant="outline">
                  {ability}
                </Badge>
              ))}
              {pokemon.hiddenAbility && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-600">
                  {pokemon.hiddenAbility} (Hidden)
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-semibold text-foreground">{(pokemon.height / 10).toFixed(1)} m</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-semibold text-foreground">{(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base EXP</p>
              <p className="font-semibold text-foreground">{pokemon.baseExp}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capture Rate</p>
              <p className="font-semibold text-foreground">{pokemon.captureRate}</p>
            </div>
          </div>

          {pokemon.eggGroups.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Egg Groups</p>
              <div className="flex flex-wrap gap-2">
                {pokemon.eggGroups.map((group) => (
                  <Badge key={group} variant="secondary">
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {pokemon.isLegendary && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-600 rounded-lg">
              <p className="text-sm font-semibold text-yellow-600">⭐ Legendary Pokémon</p>
            </div>
          )}
          {pokemon.isMythical && (
            <div className="p-3 bg-purple-500/10 border border-purple-600 rounded-lg">
              <p className="text-sm font-semibold text-purple-600">✨ Mythical Pokémon</p>
            </div>
          )}
        </div>

        {/* Moves Section */}
        {moves.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="font-semibold text-lg text-foreground mb-4">Levelup Moves</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {moves.map((move, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 rounded border border-border/50 bg-secondary/5"
                >
                  <span className="font-medium text-sm">{move.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Lv. {move.level}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
