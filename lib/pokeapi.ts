import { PokemonSpecies, Nature, EvYield } from '@/types/pokemon'

const POKEAPI_BASE = 'https://pokeapi.co/api/v2'
const DB_NAME = 'PokemonDB'
const DB_VERSION = 1
const POKEMON_STORE = 'pokemon'
const NATURES_STORE = 'natures'
const METADATA_STORE = 'metadata'
const FETCH_TIMEOUT = 12000
const DEX_FETCH_TIMEOUT = 10000
const SPECIES_FETCH_TIMEOUT = 10000
const RETRY_DELAY = 2000

function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = FETCH_TIMEOUT): Promise<Response> {
  const { signal: externalSignal, ...rest } = options
  const controller = new AbortController()
  let timeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    timeoutId = null
    controller.abort()
  }, timeoutMs)

  const cleanup = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      cleanup()
      controller.abort()
    } else {
      externalSignal.addEventListener('abort', () => {
        cleanup()
        controller.abort()
      }, { once: true })
    }
  }

  return fetch(url, { ...rest, signal: controller.signal }).finally(cleanup)
}

// IndexedDB Management
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(POKEMON_STORE)) {
        db.createObjectStore(POKEMON_STORE, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(NATURES_STORE)) {
        db.createObjectStore(NATURES_STORE, { keyPath: 'name' })
      }
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE, { keyPath: 'key' })
      }
    }
  })
}

async function getPokemonFromCache(id: number): Promise<PokemonSpecies | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([POKEMON_STORE], 'readonly')
      const store = transaction.objectStore(POKEMON_STORE)
      const request = store.get(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  } catch (error) {
    console.warn('Cache read failed:', error)
    return null
  }
}

async function savePokemonToCache(pokemon: PokemonSpecies): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([POKEMON_STORE], 'readwrite')
      const store = transaction.objectStore(POKEMON_STORE)
      const request = store.put(pokemon)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.warn('Cache write failed:', error)
  }
}

async function getAllPokemonFromCache(): Promise<PokemonSpecies[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([POKEMON_STORE], 'readonly')
      const store = transaction.objectStore(POKEMON_STORE)
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  } catch (error) {
    console.warn('Cache read all failed:', error)
    return []
  }
}

async function getMetadata(key: string): Promise<any> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([METADATA_STORE], 'readonly')
      const store = transaction.objectStore(METADATA_STORE)
      const request = store.get(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  } catch (error) {
    console.warn('Metadata read failed:', error)
    return null
  }
}

async function saveMetadata(key: string, value: any): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([METADATA_STORE], 'readwrite')
      const store = transaction.objectStore(METADATA_STORE)
      const request = store.put({ key, value, timestamp: Date.now() })
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.warn('Metadata write failed:', error)
  }
}

/**
 * Fetch detailed Pokémon species data from PokeAPI
 * Includes stats, abilities, forms, and all metadata
 */
export async function fetchPokemonSpecies(
  id: number,
  signal?: AbortSignal
): Promise<PokemonSpecies | null> {
  // Try cache first
  const cached = await getPokemonFromCache(id)
  if (cached) return cached

  try {
    const response = await fetchWithTimeout(
      `${POKEAPI_BASE}/pokemon-species/${id}`,
      { signal },
      SPECIES_FETCH_TIMEOUT
    )
    if (!response.ok) return null

    const speciesData = await response.json()

    // Also fetch the pokemon endpoint for additional stats
    const pokemonResponse = await fetchWithTimeout(
      `${POKEAPI_BASE}/pokemon/${id}`,
      { signal },
      SPECIES_FETCH_TIMEOUT
    )
    if (!pokemonResponse.ok) return null

    const pokemonData = await pokemonResponse.json()

    const pokemon: PokemonSpecies = {
      id: pokemonData.id,
      name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
      type1: (pokemonData.types[0]?.type?.name || 'Normal').charAt(0).toUpperCase() + (pokemonData.types[0]?.type?.name || 'Normal').slice(1) as any,
      type2: pokemonData.types[1] ? (pokemonData.types[1].type.name.charAt(0).toUpperCase() + pokemonData.types[1].type.name.slice(1)) as any : undefined,
      hp: pokemonData.stats[0]?.base_stat || 0,
      attack: pokemonData.stats[1]?.base_stat || 0,
      defense: pokemonData.stats[2]?.base_stat || 0,
      spAtk: pokemonData.stats[3]?.base_stat || 0,
      spDef: pokemonData.stats[4]?.base_stat || 0,
      speed: pokemonData.stats[5]?.base_stat || 0,
      icon: pokemonData.sprites?.front_default || '',
      artwork: pokemonData.sprites?.other?.['official-artwork']?.front_default || '',
      generation: speciesData.generation?.url?.match(/\d+/)?.[0] ? parseInt(speciesData.generation.url.match(/\d+/)![0]) : 1,
      isLegendary: speciesData.is_legendary || false,
      isMythical: speciesData.is_mythical || false,
      height: pokemonData.height,
      weight: pokemonData.weight,
      baseExp: pokemonData.base_experience || 0,
      captureRate: speciesData.capture_rate || 0,
      abilities: pokemonData.abilities
        ?.filter((a: any) => !a.is_hidden)
        .map((a: any) => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)) || [],
      hiddenAbility: pokemonData.abilities
        ?.find((a: any) => a.is_hidden)
        ?.ability?.name?.charAt(0).toUpperCase() + pokemonData.abilities?.find((a: any) => a.is_hidden)?.ability?.name?.slice(1),
      eggGroups: speciesData.egg_groups?.map((g: any) => g.name.charAt(0).toUpperCase() + g.name.slice(1)) || [],
      hatchCounter: speciesData.hatch_counter || 0,
      forms: [],
      evYield: {
        hp: pokemonData.stats[0]?.effort || 0,
        atk: pokemonData.stats[1]?.effort || 0,
        def: pokemonData.stats[2]?.effort || 0,
        spAtk: pokemonData.stats[3]?.effort || 0,
        spDef: pokemonData.stats[4]?.effort || 0,
        spe: pokemonData.stats[5]?.effort || 0,
      },
    }

    // Save to cache
    await savePokemonToCache(pokemon)
    return pokemon
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      console.error(`Failed to fetch Pokemon #${id}:`, error)
    }
    return null
  }
}

/**
 * Fetch all Pokémon from API with pagination and caching
 * First call fetches from API, subsequent calls use cache
 */
export async function fetchAllPokemon(
  forceRefresh = false,
  onProgress?: (count: number) => void,
  onBatch?: (pokemon: PokemonSpecies[]) => void,
  signal?: AbortSignal
): Promise<PokemonSpecies[]> {
  // Check if we have cached data
  const cachedPokemon = await getAllPokemonFromCache()
  const metadata = await getMetadata('all_pokemon_fetched')
  
  if (cachedPokemon.length > 100 && metadata && !forceRefresh) {
    console.log(`Loaded ${cachedPokemon.length} Pokemon from cache`)
    return cachedPokemon
  }

  console.log('Fetching all Pokemon from API...')
  const allPokemon: PokemonSpecies[] = []
  const limit = 50
  let offset = 0
  let hasMore = true

  try {
    while (hasMore) {
      const response = await fetchWithTimeout(
        `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`,
        { signal }
      )
      if (!response.ok) break

      const data = await response.json()
      
      // Fetch detailed data for each pokemon in parallel batches
      const batchSize = 5
      const urls: { id: number; url: string }[] = []
      
      for (const pokemonRef of data.results) {
        const match = pokemonRef.url.match(/\/pokemon\/(\d+)\//)
        if (match) {
          urls.push({ id: parseInt(match[1]), url: pokemonRef.url })
        }
      }

      // Fetch in parallel batches to respect rate limits
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize)
        const results = await Promise.all(
          batch.map(item => fetchPokemonSpecies(item.id, signal))
        )
        for (const pokemon of results) {
          if (pokemon) {
            allPokemon.push(pokemon)
          }
        }
        onProgress?.(allPokemon.length)
        onBatch?.(results.filter(Boolean) as PokemonSpecies[])
      }

      offset += limit
      hasMore = data.next !== null
      
      console.log(`Loaded ${allPokemon.length} Pokemon...`)
    }

    // Save completion metadata
    await saveMetadata('all_pokemon_fetched', true)
    
    return allPokemon
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn(`Fetch aborted, returning ${allPokemon.length} Pokemon (${cachedPokemon.length} cached)`)
    } else {
      console.error('Failed to fetch all Pokemon:', error)
    }
    return allPokemon.length > 0 ? allPokemon : cachedPokemon
  }
}

/**
 * Fetch all Natures from PokeAPI
 */
export async function fetchNatures(signal?: AbortSignal): Promise<Nature[]> {
  try {
    const response = await fetchWithTimeout(
      `${POKEAPI_BASE}/nature?limit=25`,
      { signal }
    )
    if (!response.ok) return []

    const data = await response.json()
    const natures: Nature[] = data.results.map((nature: any) => ({
      name: nature.name.charAt(0).toUpperCase() + nature.name.slice(1),
      increasedStat: null,
      decreasedStat: null,
    }))

    return natures
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      console.error('Failed to fetch natures:', error)
    }
    return getDefaultNatures()
  }
}

/**
 * Fetch Pokémon moves by level
 */
export async function fetchPokemonMoves(pokemonId: number, signal?: AbortSignal) {
  try {
    const response = await fetchWithTimeout(
      `${POKEAPI_BASE}/pokemon/${pokemonId}`,
      { signal }
    )
    if (!response.ok) return []

    const data = await response.json()
    const moves = data.moves.map((moveData: any) => {
      const levelMove = moveData.version_group_details?.[0]
      return {
        name: moveData.move.name.charAt(0).toUpperCase() + moveData.move.name.slice(1),
        level: levelMove?.level_learned_at || 0,
        learnMethod: levelMove?.move_learn_method?.name || 'unknown',
      }
    })

    // Sort by level learned
    return moves.sort((a: any, b: any) => a.level - b.level)
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      console.error(`Failed to fetch moves for Pokemon #${pokemonId}:`, error)
    }
    return []
  }
}

/**
 * Fetch a single Pokédex by PokeAPI ID.
 * Uses the proven original await pattern.
 */
async function fetchSingleDex(
  pokedexId: number,
  signal?: AbortSignal
): Promise<{ speciesId: number; dexNumber: number }[]> {
  try {
    const response = await fetchWithTimeout(
      `${POKEAPI_BASE}/pokedex/${pokedexId}`,
      { signal },
      DEX_FETCH_TIMEOUT
    )
    if (!response.ok) return []

    const data = await response.json()
    return (data.pokemon_entries || []).map((entry: any) => {
      const match = entry.pokemon_species?.url?.match(/\/pokemon-species\/(\d+)\//)
      return {
        speciesId: match ? parseInt(match[1]) : 0,
        dexNumber: entry.entry_number,
      }
    }).filter((e: { speciesId: number }) => e.speciesId > 0)
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      console.warn(`Failed to fetch Pokedex #${pokedexId}:`, error)
    }
    return []
  }
}

/**
 * Fetch game-specific Pokédex from PokeAPI to get correct ordering
 * Uses original proven fetch pattern (not Promise chaining).
 * @returns Array of { speciesId, dexNumber } in game dex order
 */
export async function fetchGameDex(
  game: 'arceus' | 'zeroA',
  signal?: AbortSignal
): Promise<{ speciesId: number; dexNumber: number }[]> {
  const DEX_IDS: Record<string, number[]> = {
    arceus: [30],        // Hisui Pokédex
    zeroA: [12, 13, 14], // Kalos Central + Coastal + Mountain
  }

  const ids = DEX_IDS[game]
  if (!ids || ids.length === 0) return []

  const results = await Promise.all(ids.map(id => fetchSingleDex(id, signal)))

  // Combine with offset for sequential ordering
  const seen = new Set<number>()
  const all: { speciesId: number; dexNumber: number }[] = []
  let offset = 0

  for (const entries of results) {
    for (const e of entries) {
      if (!seen.has(e.speciesId)) {
        seen.add(e.speciesId)
        all.push({ speciesId: e.speciesId, dexNumber: offset + e.dexNumber })
      }
    }
    offset += entries.length
  }

  return all
}

/**
 * Default Natures as fallback
 */
function getDefaultNatures(): Nature[] {
  return [
    { name: 'Hardy', increasedStat: null, decreasedStat: null },
    { name: 'Lonely', increasedStat: 'atk' as any, decreasedStat: 'def' as any },
    { name: 'Brave', increasedStat: 'atk' as any, decreasedStat: 'spe' as any },
    { name: 'Adamant', increasedStat: 'atk' as any, decreasedStat: 'spAtk' as any },
    { name: 'Naughty', increasedStat: 'atk' as any, decreasedStat: 'spDef' as any },
    { name: 'Bold', increasedStat: 'def' as any, decreasedStat: 'atk' as any },
    { name: 'Docile', increasedStat: null, decreasedStat: null },
    { name: 'Relaxed', increasedStat: 'def' as any, decreasedStat: 'spe' as any },
    { name: 'Impish', increasedStat: 'def' as any, decreasedStat: 'spAtk' as any },
    { name: 'Lax', increasedStat: 'def' as any, decreasedStat: 'spDef' as any },
    { name: 'Timid', increasedStat: 'spe' as any, decreasedStat: 'atk' as any },
    { name: 'Hasty', increasedStat: 'spe' as any, decreasedStat: 'def' as any },
    { name: 'Serious', increasedStat: null, decreasedStat: null },
    { name: 'Jolly', increasedStat: 'spe' as any, decreasedStat: 'spAtk' as any },
    { name: 'Naive', increasedStat: 'spe' as any, decreasedStat: 'spDef' as any },
    { name: 'Modest', increasedStat: 'spAtk' as any, decreasedStat: 'atk' as any },
    { name: 'Mild', increasedStat: 'spAtk' as any, decreasedStat: 'def' as any },
    { name: 'Quiet', increasedStat: 'spAtk' as any, decreasedStat: 'spe' as any },
    { name: 'Bashful', increasedStat: null, decreasedStat: null },
    { name: 'Rash', increasedStat: 'spAtk' as any, decreasedStat: 'spDef' as any },
    { name: 'Calm', increasedStat: 'spDef' as any, decreasedStat: 'atk' as any },
    { name: 'Gentle', increasedStat: 'spDef' as any, decreasedStat: 'def' as any },
    { name: 'Sassy', increasedStat: 'spDef' as any, decreasedStat: 'spe' as any },
    { name: 'Careful', increasedStat: 'spDef' as any, decreasedStat: 'spAtk' as any },
    { name: 'Quirky', increasedStat: null, decreasedStat: null },
  ]
}
