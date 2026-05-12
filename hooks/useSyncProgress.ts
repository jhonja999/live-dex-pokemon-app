'use client'

import { useEffect, useRef } from 'react'
import { usePokemonStore } from '@/store/pokemonStore'

const SYNC_INTERVAL = 30000

async function fetchProgress(): Promise<number[]> {
  try {
    const res = await fetch('/api/progress')
    if (!res.ok) return []
    const data = await res.json()
    return data.caughtSpecies ?? []
  } catch {
    return []
  }
}

async function pushProgress(speciesIds: number[]): Promise<boolean> {
  try {
    const res = await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caughtSpecies: speciesIds }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function useSyncProgress() {
  const caughtSpecies = usePokemonStore((s) => s.caughtSpecies)
  const prevRef = useRef<number[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load from API on mount
  useEffect(() => {
    let mounted = true

    fetchProgress().then((remoteIds) => {
      if (!mounted || remoteIds.length === 0) return

      const local = usePokemonStore.getState().caughtSpecies
      const merged = [...new Set([...local, ...remoteIds])]

      if (merged.length > local.length) {
        // Merge remote into local (prefer local for writes, add remote for new)
        merged.forEach((id) => {
          if (!local.includes(id)) {
            usePokemonStore.getState().toggleCaughtSpecies(id)
          }
        })
      }
    })

    return () => { mounted = false }
  }, [])

  // Sync local changes to API periodically
  useEffect(() => {
    const current = caughtSpecies
    const prev = prevRef.current

    const hasChanged =
      current.length !== prev.length ||
      current.some((id, i) => id !== prev[i])

    if (hasChanged) {
      prevRef.current = [...current]
      pushProgress(current)
    }

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const ids = usePokemonStore.getState().caughtSpecies
        pushProgress(ids)
      }, SYNC_INTERVAL)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [caughtSpecies])
}
