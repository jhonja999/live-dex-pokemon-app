'use client'

import { create } from 'zustand'
import { audioManager } from '@/lib/audio'

interface AudioStore {
  enabled: boolean
  volume: number
  toggleAudio: () => void
  setVolume: (volume: number) => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  enabled: true,
  volume: 0.5,

  toggleAudio: () =>
    set((state) => {
      const newState = !state.enabled
      audioManager.setEnabled(newState)
      return { enabled: newState }
    }),

  setVolume: (volume: number) =>
    set(() => {
      audioManager.setVolume(volume)
      return { volume }
    }),
}))
