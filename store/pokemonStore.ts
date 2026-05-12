'use client'

import { create } from 'zustand'
import { PokemonInstance } from '@/types/pokemon'
import { BoxStorage } from '@/types/box'

interface PokemonStore {
  // Captured Pokémon
  capturedPokemon: PokemonInstance[]
  setCapturedPokemon: (pokemon: PokemonInstance[]) => void
  addPokemon: (pokemon: PokemonInstance) => void
  removePokemon: (id: string) => void
  updatePokemon: (id: string, updates: Partial<PokemonInstance>) => void

  // Caught species tracking (double-click toggle + variants)
  caughtSpecies: number[]
  toggleCaughtSpecies: (speciesId: number) => void
  isSpeciesCaught: (speciesId: number) => boolean

  // Variant tracking (shiny, alpha, mega)
  shinySpecies: number[]
  toggleShiny: (speciesId: number) => void
  alphaSpecies: number[]
  toggleAlpha: (speciesId: number) => void
  megaSpecies: number[]
  toggleMega: (speciesId: number) => void

  // Boxes
  boxes: BoxStorage[]
  setBoxes: (boxes: BoxStorage[]) => void
  addBox: (box: BoxStorage) => void
  updateBox: (id: string, updates: Partial<BoxStorage>) => void
  deleteBox: (id: string) => void
  movePokemonToBox: (pokemonId: string, fromBoxId: string, toBoxId: string) => void

  // Selection/Favorites
  favoriteBoxId: string | null
  setFavoriteBox: (boxId: string | null) => void
  selectedPokemonId: string | null
  setSelectedPokemon: (id: string | null) => void
}

export const usePokemonStore = create<PokemonStore>((set, get) => ({
  // Captured Pokémon
  capturedPokemon: [],
  setCapturedPokemon: (pokemon) => set({ capturedPokemon: pokemon }),
  addPokemon: (pokemon) =>
    set((state) => ({
      capturedPokemon: [...state.capturedPokemon, pokemon],
    })),
  removePokemon: (id) =>
    set((state) => ({
      capturedPokemon: state.capturedPokemon.filter((p) => p.id !== id),
    })),
  updatePokemon: (id, updates) =>
    set((state) => ({
      capturedPokemon: state.capturedPokemon.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  // Caught species tracking
  caughtSpecies: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('livedex_caught') || '[]')
    : [],
  toggleCaughtSpecies: (speciesId) =>
    set((state) => {
      const next = state.caughtSpecies.includes(speciesId)
        ? state.caughtSpecies.filter((id) => id !== speciesId)
        : [...state.caughtSpecies, speciesId]
      if (typeof window !== 'undefined') {
        localStorage.setItem('livedex_caught', JSON.stringify(next))
      }
      return { caughtSpecies: next }
    }),
  isSpeciesCaught: (speciesId) => get().caughtSpecies.includes(speciesId),

  // Variant tracking
  shinySpecies: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('livedex_shiny') || '[]')
    : [],
  toggleShiny: (speciesId) =>
    set((state) => {
      const next = state.shinySpecies.includes(speciesId)
        ? state.shinySpecies.filter((id) => id !== speciesId)
        : [...state.shinySpecies, speciesId]
      if (typeof window !== 'undefined') {
        localStorage.setItem('livedex_shiny', JSON.stringify(next))
      }
      return { shinySpecies: next }
    }),
  alphaSpecies: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('livedex_alpha') || '[]')
    : [],
  toggleAlpha: (speciesId) =>
    set((state) => {
      const next = state.alphaSpecies.includes(speciesId)
        ? state.alphaSpecies.filter((id) => id !== speciesId)
        : [...state.alphaSpecies, speciesId]
      if (typeof window !== 'undefined') {
        localStorage.setItem('livedex_alpha', JSON.stringify(next))
      }
      return { alphaSpecies: next }
    }),
  megaSpecies: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('livedex_mega') || '[]')
    : [],
  toggleMega: (speciesId) =>
    set((state) => {
      const next = state.megaSpecies.includes(speciesId)
        ? state.megaSpecies.filter((id) => id !== speciesId)
        : [...state.megaSpecies, speciesId]
      if (typeof window !== 'undefined') {
        localStorage.setItem('livedex_mega', JSON.stringify(next))
      }
      return { megaSpecies: next }
    }),

  // Boxes
  boxes: [],
  setBoxes: (boxes) => set({ boxes }),
  addBox: (box) =>
    set((state) => ({
      boxes: [...state.boxes, box],
    })),
  updateBox: (id, updates) =>
    set((state) => ({
      boxes: state.boxes.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: Date.now() } : b
      ),
    })),
  deleteBox: (id) =>
    set((state) => ({
      boxes: state.boxes.filter((b) => b.id !== id),
    })),
  movePokemonToBox: (pokemonId, fromBoxId, toBoxId) =>
    set((state) => ({
      capturedPokemon: state.capturedPokemon.map((p) =>
        p.id === pokemonId ? { ...p, boxId: toBoxId } : p
      ),
      boxes: state.boxes.map((b) => {
        if (b.id === fromBoxId) {
          return {
            ...b,
            pokemonIds: b.pokemonIds.filter((id) => id !== pokemonId),
          }
        }
        if (b.id === toBoxId) {
          return {
            ...b,
            pokemonIds: [...b.pokemonIds, pokemonId],
          }
        }
        return b
      }),
    })),

  // Selection/Favorites
  favoriteBoxId: null,
  setFavoriteBox: (boxId) => set({ favoriteBoxId: boxId }),
  selectedPokemonId: null,
  setSelectedPokemon: (id) => set({ selectedPokemonId: id }),
}))
