'use client'

import { create } from 'zustand'
import { GameType } from '@/types/game'

interface GameStore {
  currentGame: GameType
  setCurrentGame: (game: GameType) => void

  // Stats
  totalCaptured: number
  setTotalCaptured: (count: number) => void
  totalShiny: number
  setTotalShiny: (count: number) => void
  totalAlpha: number
  setTotalAlpha: (count: number) => void
  perfectPokemon: number
  setPerfectPokemon: (count: number) => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentGame: 'arceus',
  setCurrentGame: (game) => set({ currentGame: game }),

  totalCaptured: 0,
  setTotalCaptured: (count) => set({ totalCaptured: count }),
  totalShiny: 0,
  setTotalShiny: (count) => set({ totalShiny: count }),
  totalAlpha: 0,
  setTotalAlpha: (count) => set({ totalAlpha: count }),
  perfectPokemon: 0,
  setPerfectPokemon: (count) => set({ perfectPokemon: count }),
}))
