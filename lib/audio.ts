/**
 * Centralized audio manager for sound effects
 * All sounds must be registered here
 */

export type SoundEffect = 'hover' | 'click' | 'capture' | 'flip' | 'achievement' | 'error'

class AudioManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.5
  private sounds: Map<SoundEffect, AudioBuffer | null> = new Map()

  constructor() {
    this.initializeContext()
  }

  private initializeContext() {
    // Only init in browser
    if (typeof window === 'undefined') return

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContextClass()
    } catch (error) {
      console.warn('[v0] AudioContext not supported')
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Play a simple beep sound using Web Audio API
   * This is a fallback until we add actual audio files
   */
  playSound(effect: SoundEffect) {
    if (!this.enabled || !this.audioContext) return

    try {
      const ctx = this.audioContext
      const oscNode = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscNode.connect(gainNode)
      gainNode.connect(ctx.destination)

      gainNode.gain.setValueAtTime(this.volume, ctx.currentTime)

      // Different frequencies for different sounds
      const frequencies: Record<SoundEffect, number> = {
        hover: 600,
        click: 800,
        capture: 1000,
        flip: 700,
        achievement: 1200,
        error: 400,
      }

      oscNode.frequency.value = frequencies[effect] || 600
      oscNode.type = 'sine'

      oscNode.start(ctx.currentTime)
      oscNode.stop(ctx.currentTime + 0.1)

      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    } catch (error) {
      console.warn('[v0] Failed to play sound:', error)
    }
  }

  /**
   * Preload audio file (for future use with actual audio files)
   */
  preloadSound(effect: SoundEffect, url: string) {
    // Placeholder for actual audio loading
    // TODO: Implement actual audio file loading when audio assets are available
  }
}

export const audioManager = new AudioManager()
