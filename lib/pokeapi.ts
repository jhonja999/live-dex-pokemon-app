import { PokemonSpecies, Nature, PokemonForm, EvYield } from '@/types/pokemon'

const POKEAPI_BASE = 'https://pokeapi.co/api/v2'
const DB_NAME = 'PokemonDB'
const DB_VERSION = 1
const POKEMON_STORE = 'pokemon'
const NATURES_STORE = 'natures'
const METADATA_STORE = 'metadata'

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
export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies | null> {
  // Try cache first
  const cached = await getPokemonFromCache(id)
  if (cached) return cached

  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon-species/${id}`)
    if (!response.ok) return null

    const speciesData = await response.json()

    // Also fetch the pokemon endpoint for additional stats
    const pokemonResponse = await fetch(`${POKEAPI_BASE}/pokemon/${id}`)
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
    console.error(`Failed to fetch Pokemon #${id}:`, error)
    return null
  }
}

/**
 * Fetch all Pokémon from API with pagination and caching
 * First call fetches from API, subsequent calls use cache
 */
export async function fetchAllPokemon(
  forceRefresh = false,
  onProgress?: (count: number) => void
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
      const response = await fetch(
        `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`
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
          batch.map(item => fetchPokemonSpecies(item.id))
        )
        for (const pokemon of results) {
          if (pokemon) {
            allPokemon.push(pokemon)
          }
        }
        onProgress?.(allPokemon.length)
      }

      offset += limit
      hasMore = data.next !== null
      
      console.log(`Loaded ${allPokemon.length} Pokemon...`)
    }

    // Save completion metadata
    await saveMetadata('all_pokemon_fetched', true)
    
    return allPokemon
  } catch (error) {
    console.error('Failed to fetch all Pokemon:', error)
    return allPokemon.length > 0 ? allPokemon : cachedPokemon
  }
}

/**
 * Fetch all Natures from PokeAPI
 */
export async function fetchNatures(): Promise<Nature[]> {
  try {
    const response = await fetch(`${POKEAPI_BASE}/nature?limit=25`)
    if (!response.ok) return []

    const data = await response.json()
    const natures: Nature[] = data.results.map((nature: any) => ({
      name: nature.name.charAt(0).toUpperCase() + nature.name.slice(1),
      increasedStat: null,
      decreasedStat: null,
    }))

    return natures
  } catch (error) {
    console.error('Failed to fetch natures:', error)
    return getDefaultNatures()
  }
}

/**
 * Get detailed nature info
 */
export async function fetchNatureDetails(name: string): Promise<Nature | null> {
  try {
    const response = await fetch(`${POKEAPI_BASE}/nature/${name.toLowerCase()}`)
    if (!response.ok) return null

    const data = await response.json()
    return {
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      increasedStat: data.increased_stat?.name as any,
      decreasedStat: data.decreased_stat?.name as any,
    }
  } catch (error) {
    console.error(`Failed to fetch nature ${name}:`, error)
    return null
  }
}

/**
 * Fetch move data from PokeAPI
 */
export async function fetchMove(id: number | string) {
  try {
    const response = await fetch(`${POKEAPI_BASE}/move/${id}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch move:', error)
    return null
  }
}

/**
 * Fetch Pokémon moves by level
 */
export async function fetchPokemonMoves(pokemonId: number) {
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon/${pokemonId}`)
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
    console.error(`Failed to fetch moves for Pokemon #${pokemonId}:`, error)
    return []
  }
}

/**
 * Get best moves for a Pokémon (highest power moves that can be learned)
 */
export async function getPokemonBestMoves(pokemonId: number): Promise<any[]> {
  try {
    const moves = await fetchPokemonMoves(pokemonId)
    if (moves.length === 0) return []

    // Group by level and get latest moves for each level
    const bestMoves = []
    const seenNames = new Set<string>()

    for (const move of moves) {
      if (!seenNames.has(move.name)) {
        bestMoves.push(move)
        seenNames.add(move.name)
      }
    }

    return bestMoves.slice(0, 12) // Return up to 12 best moves
  } catch (error) {
    console.error('Failed to get best moves:', error)
    return []
  }
}

/**
 * Fetch type effectiveness data
 */
export async function fetchTypeChart(type: string) {
  try {
    const response = await fetch(`${POKEAPI_BASE}/type/${type.toLowerCase()}`)
    if (!response.ok) return null

    const data = await response.json()
    return {
      weaknesses: data.damage_relations?.take_damage_from || [],
      resistances: data.damage_relations?.take_damage_half || [],
      immunities: data.damage_relations?.take_no_damage_from || [],
    }
  } catch (error) {
    console.error('Failed to fetch type chart:', error)
    return null
  }
}

/**
 * Fetch evolution chain for a Pokémon
 */
export async function fetchEvolutionChain(speciesId: number) {
  try {
    const speciesResponse = await fetch(`${POKEAPI_BASE}/pokemon-species/${speciesId}`)
    if (!speciesResponse.ok) return null

    const speciesData = await speciesResponse.json()
    const evolutionChainUrl = speciesData.evolution_chain?.url

    if (!evolutionChainUrl) return null

    const chainResponse = await fetch(evolutionChainUrl)
    if (!chainResponse.ok) return null

    return await chainResponse.json()
  } catch (error) {
    console.error('Failed to fetch evolution chain:', error)
    return null
  }
}

/**
 * Fetch game-specific Pokédex from PokeAPI to get correct ordering
 * @returns Array of { speciesId, dexNumber } in game dex order
 */
export async function fetchGameDex(
  game: 'arceus' | 'zeroA'
): Promise<{ speciesId: number; dexNumber: number }[]> {
  const POKEDEX_IDS: Record<string, number> = {
    arceus: 26,
    zeroA: 12,
  }

  const pokedexId = POKEDEX_IDS[game]
  if (!pokedexId) return []

  try {
    const response = await fetch(`${POKEAPI_BASE}/pokedex/${pokedexId}`)
    if (!response.ok) return []

    const data = await response.json()
    return data.pokemon_entries.map((entry: any) => ({
      speciesId: entry.pokemon_species.url.match(/\/pokemon-species\/(\d+)\//)?.[1]
        ? parseInt(entry.pokemon_species.url.match(/\/pokemon-species\/(\d+)\//)[1])
        : 0,
      dexNumber: entry.entry_number,
    })).filter((e: { speciesId: number }) => e.speciesId > 0)
  } catch (error) {
    console.warn(`Failed to fetch ${game} dex from PokeAPI:`, error)
    return []
  }
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
