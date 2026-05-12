'use client'

import { memo } from 'react'

function PokemonSkeletonComponent() {
  return (
    <div className="border border-border rounded-lg p-4 bg-surface animate-pulse">
      {/* Sprite skeleton */}
      <div className="w-full h-32 bg-secondary/20 rounded-md mb-4" />

      {/* Name skeleton */}
      <div className="h-4 bg-secondary/20 rounded w-3/4 mb-2" />
      <div className="h-3 bg-secondary/20 rounded w-1/2 mb-3" />

      {/* Types skeleton */}
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-secondary/20 rounded w-16" />
        <div className="h-6 bg-secondary/20 rounded w-16" />
      </div>

      {/* Stats skeleton */}
      <div className="space-y-1">
        <div className="h-3 bg-secondary/20 rounded w-full" />
        <div className="h-3 bg-secondary/20 rounded w-5/6" />
      </div>
    </div>
  )
}

export default memo(PokemonSkeletonComponent)

export function PokemonGridSkeleton() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <PokemonSkeletonComponent key={i} />
      ))}
    </div>
  )
}
