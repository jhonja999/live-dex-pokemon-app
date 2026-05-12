export interface BoxStorage {
  id: string
  name: string
  color: string // hex or tailwind color
  icon?: string
  pokemonIds: string[] // array of PokemonInstance IDs
  isFavorite: boolean
  createdAt: number
  updatedAt: number
}

export interface DragItem {
  type: 'pokemon'
  id: string
  fromBoxId: string
}
