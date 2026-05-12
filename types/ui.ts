import { PokemonType } from './pokemon'

export type SortOption = 'dex' | 'name' | 'recent' | 'perfection' | 'favorite'

export interface FilterState {
  types: PokemonType[]
  captured: boolean | null // null = both, true = only captured, false = only uncaptured
  shiny: boolean
  alpha: boolean
  favorite: boolean
  searchQuery: string
  sortBy: SortOption
}

export interface ViewMode {
  columns: 'auto' | 2 | 4 | 6
  showSprites: boolean
}
