'use client'

import { useCallback } from 'react'
import { useAudioStore } from '@/store/audioStore'
import { audioManager, SoundEffect } from '@/lib/audio'

export function useAudio() {
  const { enabled } = useAudioStore()

  const playSound = useCallback(
    (effect: SoundEffect) => {
      if (!enabled) return
      audioManager.playSound(effect)
    },
    [enabled]
  )

  return { playSound }
}
