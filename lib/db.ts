import Dexie, { Table } from 'dexie'
import { PokemonInstance } from '@/types/pokemon'
import { BoxStorage } from '@/types/box'

export interface SettingsRecord {
  key: string
  value: unknown
}

export interface PokemonInstanceRecord extends PokemonInstance {}

export interface BoxStorageRecord extends BoxStorage {}

// IndexedDB Database
export class LiveDexDB extends Dexie {
  pokemon!: Table<PokemonInstanceRecord>
  boxes!: Table<BoxStorageRecord>
  settings!: Table<SettingsRecord>

  constructor() {
    super('LiveDexDB')
    this.version(1).stores({
      pokemon: '++id, speciesId, boxId, isFavorite, capturedAt',
      boxes: '++id, isFavorite, createdAt',
      settings: 'key',
    })
  }
}

export const db = new LiveDexDB()

// Helper functions for database operations
export async function savePokemon(pokemon: PokemonInstance): Promise<string> {
  const now = Date.now()
  const record = {
    ...pokemon,
    updatedAt: now,
  }
  const id = await db.pokemon.put(record)
  return id as string
}

export async function getPokemonById(id: string): Promise<PokemonInstance | undefined> {
  return db.pokemon.get(id)
}

export async function getPokemonByBox(boxId: string): Promise<PokemonInstance[]> {
  return db.pokemon.where('boxId').equals(boxId).toArray()
}

export async function deletePokemon(id: string): Promise<void> {
  await db.pokemon.delete(id)
}

export async function createBox(box: Omit<BoxStorage, 'id'>): Promise<string> {
  const id = crypto.randomUUID()
  const record = { ...box, id }
  await db.boxes.put(record)
  return id
}

export async function getBoxes(): Promise<BoxStorage[]> {
  return db.boxes.toArray()
}

export async function updateBox(id: string, updates: Partial<BoxStorage>): Promise<void> {
  await db.boxes.update(id, {
    ...updates,
    updatedAt: Date.now(),
  })
}

export async function deleteBox(id: string): Promise<void> {
  // Move all Pokémon in this box to default box first
  const pokemonInBox = await getPokemonByBox(id)
  const defaultBox = await db.boxes.where('name').equals('Box 1').first()

  if (defaultBox) {
    for (const pokemon of pokemonInBox) {
      await db.pokemon.update(pokemon.id, { boxId: defaultBox.id })
    }
  }

  await db.boxes.delete(id)
}

export async function getSetting(key: string): Promise<unknown> {
  const record = await db.settings.get(key)
  return record?.value
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await db.settings.put({ key, value })
}

export async function initializeDefaults(): Promise<void> {
  const existingBoxes = await db.boxes.count()

  if (existingBoxes === 0) {
    // Create default box
    await createBox({
      name: 'Box 1',
      color: '#3b82f6',
      pokemonIds: [],
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Initialize default settings
    await setSetting('theme', 'dark')
    await setSetting('game', 'arceus')
  }
}
