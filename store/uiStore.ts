'use client'

import { create } from 'zustand'
import { FilterState, SortOption, ViewMode } from '@/types/ui'
import { PokemonType } from '@/types/pokemon'

interface UIStore {
  // Theme
  theme: 'dark' | 'light' | 'pokédex' | 'home' | 'neon'
  setTheme: (theme: UIStore['theme']) => void

  // Filters
  filters: FilterState
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void

  // View
  viewMode: ViewMode
  setViewMode: (mode: Partial<ViewMode>) => void

  // UI State
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeModalId: string | null
  setActiveModal: (id: string | null) => void
}

const defaultFilters: FilterState = {
  types: [],
  captured: null,
  shiny: false,
  alpha: false,
  favorite: false,
  searchQuery: '',
  sortBy: 'dex',
}

const defaultViewMode: ViewMode = {
  columns: 'auto',
  showSprites: true,
}

export const useUIStore = create<UIStore>((set) => ({
  // Theme
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  // Filters
  filters: defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetFilters: () => set({ filters: defaultFilters }),

  // View
  viewMode: defaultViewMode,
  setViewMode: (mode) =>
    set((state) => ({
      viewMode: {
        ...state.viewMode,
        ...mode,
      },
    })),

  // UI State
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  activeModalId: null,
  setActiveModal: (id) => set({ activeModalId: id }),
}))
