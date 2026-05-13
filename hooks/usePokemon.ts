'use client'

import { useState, useEffect, useRef } from 'react'
import { fetchAllPokemon, fetchGameDex } from '@/lib/pokeapi'
import { PokemonSpecies } from '@/types/pokemon'
import { GameType } from '@/types/game'
import { GAME_POKEMON_TAGS, GAME_SECTIONS, getPokemonTags, PokemonTag } from '@/data/pokemonCategories'

function sortByDex(
  list: PokemonSpecies[],
  orderMap: Map<number, number>
): PokemonSpecies[] {
  return [...list].sort((a, b) => {
    const aDex = orderMap.get(a.id)
    const bDex = orderMap.get(b.id)
    if (aDex !== undefined && bDex !== undefined) return aDex - bDex
    if (aDex !== undefined) return -1
    if (bDex !== undefined) return 1
    return a.id - b.id
  })
}

function getGameSpeciesSet(game: GameType): Set<number> {
  const tagged = GAME_POKEMON_TAGS[game]
  if (!tagged) return new Set()
  return new Set(Object.keys(tagged).map(Number))
}

/**
 * Build a correct game-dex order from local data (sections + tags).
 * Used as fallback when PokeAPI dex fetch returns empty or fails.
 * Each Pokemon is assigned to exactly ONE section (first match in section priority order).
 */
function buildFallbackOrder(
  game: GameType,
  speciesSet: Set<number>
): Map<number, number> {
  const orderMap = new Map<number, number>()
  const sections = GAME_SECTIONS[game]
  if (!sections) return orderMap

  const tagged = GAME_POKEMON_TAGS[game]
  if (!tagged) return orderMap

  let order = 0
  // Process sections in priority order
  for (const section of sections) {
    // For starters section, use special evolutionary-line ordering
    if (section.key === 'starters') {
      const STARTER_TRIOS: Record<GameType, number[]> = {
        arceus: [722, 155, 501],
        zeroA: [650, 653, 656],
      }
      const starterTrios = STARTER_TRIOS[game] || []

      for (const baseId of starterTrios) {
        for (let offset = 0; offset <= 2; offset++) {
          const speciesId = baseId + offset
          if (speciesSet.has(speciesId) && !orderMap.has(speciesId)) {
            const tags = getPokemonTags(game, speciesId)
            if (tags.includes('starter' as PokemonTag)) {
              orderMap.set(speciesId, order++)
            }
          }
        }
      }
    }

    // Add all Pokemon that belong to this section and haven't been assigned yet
    for (const [speciesIdStr, tags] of Object.entries(tagged)) {
      const speciesId = parseInt(speciesIdStr, 10)
      if (!speciesSet.has(speciesId) || orderMap.has(speciesId)) continue

      const inSection = section.tags.length === 0
        || tags.some((tag: PokemonTag) => section.tags.includes(tag))

      if (inSection) {
        orderMap.set(speciesId, order++)
      }
    }
  }

  console.log(`[usePokemon] Fallback order built: ${orderMap.size} Pokemon`)
  return orderMap
}

const RETRY_DELAY_MS = 2000

export function usePokemon(game?: GameType) {
  const [pokemon, setPokemon] = useState<PokemonSpecies[]>([])
  const [loadedCount, setLoadedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameDexOrder, setGameDexOrder] = useState<Map<number, number>>(new Map())

  const orderMapRef = useRef<Map<number, number>>(new Map())
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    let isMounted = true
    const isUserAbort = { current: false }

    // Cancel any in-flight request from previous game
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    const init = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setPokemon([])
        setLoadedCount(0)
        setTotalCount(0)

        let dexOrderMap: Map<number, number>
        let gameSpeciesSet: Set<number> = new Set()

        if (game) {
          // Attempt to fetch PokeAPI dex order (retry once with delay)
          let dexEntries = await fetchGameDex(game, controller.signal)
          if (dexEntries.length === 0 && !controller.signal.aborted) {
            console.warn(`[usePokemon] First attempt for ${game} dex returned empty, waiting ${RETRY_DELAY_MS}ms before retry...`)
            await sleep(RETRY_DELAY_MS)
            if (controller.signal.aborted) return
            dexEntries = await fetchGameDex(game, controller.signal)
          }

          if (dexEntries.length > 0) {
            // API succeeded: use exact game dex order
            dexOrderMap = new Map<number, number>()
            dexEntries.forEach(e => dexOrderMap.set(e.speciesId, e.dexNumber))

            // Filter to ALL game Pokemon from API (not just tagged subset)
            gameSpeciesSet = new Set(dexEntries.map(e => e.speciesId))

            // Add any tagged species not present in API (e.g. mythical not in dex)
            const taggedSet = getGameSpeciesSet(game)
            for (const speciesId of taggedSet) {
              if (!gameSpeciesSet.has(speciesId)) {
                gameSpeciesSet.add(speciesId)
                dexOrderMap.set(speciesId, dexOrderMap.size)
              }
            }

            console.log(`[usePokemon] ${game} dex loaded from API (${dexOrderMap.size} species)`)
          } else {
            // API failed after retry: show ALL species (no filter), fallback order for tagged
            dexOrderMap = buildFallbackOrder(game, getGameSpeciesSet(game))
            gameSpeciesSet = new Set() // empty = no filter, all species shown
            console.warn(`[usePokemon] PokeAPI dex failed for ${game} after retry, showing all species (fallback order: ${dexOrderMap.size})`)
          }
        } else {
          // No game selected: empty order map means natural sorting (by national ID)
          dexOrderMap = new Map<number, number>()
        }

        const hasGameDex = dexOrderMap.size > 0
        const allowedSet = gameSpeciesSet.size > 0 ? gameSpeciesSet : null

        if (dexOrderMap.size > 0) {
          setTotalCount(dexOrderMap.size)
        }

        setGameDexOrder(dexOrderMap)
        orderMapRef.current = dexOrderMap

        // Step 3: progressive batch loading with live sorting
        let batchAcc: PokemonSpecies[] = []
        let lastUpdate = 0

        const flushBatch = () => {
          if (batchAcc.length === 0) return
          const toApply = [...batchAcc]
          batchAcc = []
          setPokemon(prev => {
            const map = new Map(prev.map(p => [p.id, p]))
            for (const p of toApply) map.set(p.id, p)
            const order = orderMapRef.current
            let values = [...map.values()]
            if (allowedSet) {
              values = values.filter(p => allowedSet.has(p.id))
            }
            return sortByDex(values, order)
          })
          setLoadedCount(prev => prev + toApply.length)
        }

        const data = await fetchAllPokemon(false, (count) => {
          if (isMounted && !hasGameDex) setTotalCount(count)
        }, (batch) => {
          if (!isMounted) return
          batchAcc.push(...batch.filter(Boolean) as PokemonSpecies[])
          const now = Date.now()
          if (now - lastUpdate > 300) {
            lastUpdate = now
            flushBatch()
          }
        }, controller.signal)

        flushBatch()
        if (!isMounted) return

        // Final sort + filter
        let result = [...data]
        if (allowedSet) {
          result = result.filter(p => allowedSet.has(p.id))
        }
        const sorted = sortByDex(result, dexOrderMap)

        setPokemon(sorted)
        setLoadedCount(sorted.length)
        setTotalCount(sorted.length)
      } catch (err) {
        if (isUserAbort.current) return // silent abort on game switch
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
      isUserAbort.current = true
      isMounted = false
      controller.abort()
    }
  }, [game])

  return { pokemon, loadedCount, totalCount, isLoading, error, gameDexOrder }
}
