// Core Pokémon data types

export interface PokemonSpecies {
  id: number
  name: string
  type1: PokemonType
  type2?: PokemonType
  hp: number
  attack: number
  defense: number
  spAtk: number
  spDef: number
  speed: number
  icon: string // URL to sprite/artwork
  artwork?: string // Official artwork URL
  generation: number
  isLegendary: boolean
  isMythical: boolean
  abilities: string[] // Available abilities
  hiddenAbility?: string
  height: number // in decimeters
  weight: number // in hectograms
  baseExp: number
  captureRate: number
  eggGroups: string[]
  hatchCounter: number // Egg steps / 255
  forms: PokemonForm[]
  evYield?: EvYield
}

export interface PokemonForm {
  name: string
  type1: PokemonType
  type2?: PokemonType
  hp?: number
  attack?: number
  defense?: number
  spAtk?: number
  spDef?: number
  speed?: number
}

export interface EvYield {
  hp?: number
  atk?: number
  def?: number
  spAtk?: number
  spDef?: number
  spe?: number
}

export interface Nature {
  name: string
  increasedStat: StatName | null
  decreasedStat: StatName | null
  likedFlavor?: string
  dislikedFlavor?: string
}

export type StatName = 'hp' | 'atk' | 'def' | 'spAtk' | 'spDef' | 'spe'

export interface PokemonInstance {
  id: string // Unique ID (uuid)
  speciesId: number
  boxId: string
  form?: string // Hisuian, Alolan, Mega, etc.
  isShiny: boolean
  gender?: 'male' | 'female'
  level: number
  iv: IvStats
  ev: EvStats
  nature: string // Nature name (e.g., "Adamant", "Timid")
  ability: string // Selected ability
  moves: Move[]
  nickname?: string
  notes?: string
  capturedAt: number // timestamp
  updatedAt: number // timestamp
  isFavorite: boolean
}

export interface IvStats {
  hp: number // 0-31
  atk: number
  def: number
  spAtk: number
  spDef: number
  spe: number
}

export interface EvStats {
  hp: number // 0-252
  atk: number
  def: number
  spAtk: number
  spDef: number
  spe: number
}

export interface Move {
  name: string
  type: PokemonType
  category: 'physical' | 'special' | 'status'
  power: number
  accuracy: number
  pp: number
}

export type PokemonType =
  | 'Normal'
  | 'Fighting'
  | 'Flying'
  | 'Poison'
  | 'Ground'
  | 'Rock'
  | 'Bug'
  | 'Ghost'
  | 'Steel'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Psychic'
  | 'Ice'
  | 'Dragon'
  | 'Dark'
  | 'Fairy'

export interface PokemonWithInstance extends PokemonSpecies {
  instance?: PokemonInstance
}
